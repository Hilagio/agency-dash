/**
 * POST /api/accounts/[id]/intelligence
 *
 * Streams a concise, context-aware intelligence brief for the account.
 * Uses all available signal data, client context, and account targets to
 * produce a sharp analyst-grade summary — not generic advice.
 */
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { scoreConstraints } from "@/lib/engine";
import { ConstraintSignals, BUCKET_LABELS } from "@/lib/engine/types";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { AGENCY_PHILOSOPHY } from "@/lib/agencyPhilosophy";
import { fetchSlackMessages, formatSlackForContext } from "@/lib/integrations/slack";

type Params = { params: Promise<{ id: string }> };

const client = new Anthropic();

export async function POST(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;

  const [account, notionConn, slackConn] = await Promise.all([
    prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } }),
    prisma.notionConnection.findUnique({
      where:   { organizationId: ctx.orgId },
      include: { pageCache: { orderBy: { fetchedAt: "desc" } } },
    }),
    prisma.slackConnection.findUnique({ where: { organizationId: ctx.orgId } }),
  ]);
  if (!account) return forbidden();

  const snapshot = await prisma.constraintSnapshot.findFirst({
    where: { accountId: id },
    orderBy: { createdAt: "desc" },
    include: { actions: { orderBy: { impact: "asc" }, take: 5 } },
  });

  if (!snapshot) {
    return NextResponse.json({ error: "No snapshot found" }, { status: 404 });
  }

  // Re-run scorer to get per-bucket signals
  let signals: ConstraintSignals | null = null;
  let bucketSignals: Record<string, string[]> = {};
  try {
    signals = JSON.parse(snapshot.rawSignals) as ConstraintSignals;
    const result = scoreConstraints(signals);
    bucketSignals = Object.fromEntries(result.buckets.map(b => [b.bucket, b.signals]));
  } catch { /* proceed without signals */ }

  // ─── Build context blocks ─────────────────────────────────────────────────

  const buckets = [
    { key: "MEASUREMENT", score: snapshot.scoreMeasurement },
    { key: "TRAFFIC",     score: snapshot.scoreTraffic },
    { key: "CONVERSION",  score: snapshot.scoreConversion },
    { key: "FUNNEL",      score: snapshot.scoreFunnel },
    { key: "ECONOMICS",   score: snapshot.scoreEconomics },
  ];

  const bucketBlock = buckets
    .map(b => {
      const issues = bucketSignals[b.key] ?? [];
      const label = BUCKET_LABELS[b.key as keyof typeof BUCKET_LABELS];
      const issueStr = issues.length ? `\n    Issues: ${issues.join(" | ")}` : "";
      return `  ${label}: ${Math.round(b.score)}/100${issueStr}`;
    })
    .join("\n");

  const governing = BUCKET_LABELS[snapshot.governingConstraint as keyof typeof BUCKET_LABELS] ?? snapshot.governingConstraint;

  const targetsBlock = [
    account.targetRoas         != null ? `Target ROAS: ${account.targetRoas}x` : null,
    account.targetCpa          != null ? `Target CPA: ${account.targetCpa}` : null,
    account.grossMarginPercent != null ? `Gross margin: ${Math.round(account.grossMarginPercent * 100)}% (break-even ROAS: ${(1 / account.grossMarginPercent).toFixed(1)}x)` : null,
  ].filter(Boolean).join(" | ") || "No targets set";

  let metricsBlock = "";
  if (signals) {
    const t = signals.traffic;
    const e = signals.economics;
    const c = signals.conversion;
    const rows = [
      `CTR: ${(t.clickThroughRate * 100).toFixed(2)}%`,
      `Quality Score: ${t.qualityScoreAvg.toFixed(1)}/10`,
      `IS lost to budget: ${Math.round(t.impressionShareLost_budget * 100)}%`,
      `IS lost to rank: ${Math.round(t.impressionShareLost_rank * 100)}%`,
      e.actualRoas > 0 ? `Actual ROAS: ${e.actualRoas.toFixed(2)}x` : null,
      e.actualCpa  > 0 ? `Actual CPA: ${e.actualCpa.toFixed(0)}` : null,
      c.conversionRate > 0 ? `CVR: ${(c.conversionRate * 100).toFixed(2)}% (benchmark: ${(c.industryBenchmarkConversionRate * 100).toFixed(1)}%)` : null,
      `Budget utilisation: ${Math.round(e.budgetUtilizationPercent * 100)}%`,
    ].filter(Boolean);
    metricsBlock = rows.join(" | ");
  }

  const clientBrief = account.clientContext
    ? `\nCLIENT BRIEF:\n${account.clientContext}`
    : "";

  const notionContext = notionConn && notionConn.pageCache.length > 0
    ? `\nAGENCY KNOWLEDGE BASE (from Notion):\n` +
      notionConn.pageCache.map(p => `--- ${p.title} ---\n${p.content}`).join("\n\n").slice(0, 4000)
    : "";

  let slackContext = "";
  if (slackConn && account.slackChannelId && account.slackChannelName) {
    try {
      const msgs = await fetchSlackMessages(slackConn.botToken, account.slackChannelId, 90);
      slackContext = msgs.length > 0 ? "\n" + formatSlackForContext(msgs, account.slackChannelName) : "";
    } catch { /* non-fatal */ }
  }

  const prompt = `You are a senior Google Ads strategist. Write an intelligence brief for this account — the kind a good analyst would send to a client manager before a weekly call.

ACCOUNT: ${account.name}
INDUSTRY: ${account.industry ?? "not set"}
CURRENCY: ${account.currency}
GOVERNING CONSTRAINT: ${governing} (score: ${Math.round(snapshot.governingConstraint === "MEASUREMENT" ? snapshot.scoreMeasurement : snapshot.governingConstraint === "TRAFFIC" ? snapshot.scoreTraffic : snapshot.governingConstraint === "CONVERSION" ? snapshot.scoreConversion : snapshot.governingConstraint === "FUNNEL" ? snapshot.scoreFunnel : snapshot.scoreEconomics)}/100)

BUCKET HEALTH:
${bucketBlock}

LIVE METRICS: ${metricsBlock || "not available"}

ACCOUNT TARGETS: ${targetsBlock}
${clientBrief}${notionContext}${slackContext}

${slackContext ? "CHANGE-LOG CORRELATION INSTRUCTIONS: Cross-reference the Slack messages above with the metric data. If a team action (budget change, bid adjustment, campaign edit, creative swap) is mentioned and a related metric shifted within 2–7 days, explicitly call this out as the likely cause in your brief.\n\n" : ""}Format your response using markdown:
- Start with a ## heading that names the governing constraint clearly (e.g. "## Conversion Rate is the Governing Constraint")
- Write 2–3 short paragraphs covering: (1) what is actually happening with numbers, (2) why it is the governing constraint and what it blocks downstream, (3) the most likely root cause given the account context — be specific, not generic
- Add a **Next step:** line with one concrete, actionable task
- If there is a secondary risk, add a **Secondary risk:** line for it

Use actual numbers throughout ("CVR dropped from 1.2% to 0.5%", not "CVR is low"). Analyst tone — no platitudes, no generic advice.`;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const aiStream = await client.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 700,
          system: `You are a direct, data-driven Google Ads analyst. You write sharp, specific briefs. You never use generic advice. You always cite actual numbers.\n\n${AGENCY_PHILOSOPHY}`,
          messages: [{ role: "user", content: prompt }],
        });

        for await (const chunk of aiStream) {
          if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Stream error";
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
        controller.close();
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
