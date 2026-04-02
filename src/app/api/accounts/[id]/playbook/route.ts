/**
 * POST /api/accounts/[id]/playbook
 *
 * Generates a comprehensive, account-specific optimization playbook.
 * Streams markdown. Uses:
 *  - Latest constraint snapshot (scores + signals + actions)
 *  - Active agency SOPs (injected as agency context)
 *  - Top wasteful search terms (if available from rawSignals)
 *  - Account industry and campaign type awareness
 */
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { scoreConstraints } from "@/lib/engine";
import { ConstraintSignals, BUCKET_LABELS, BUCKET_DESCRIPTIONS } from "@/lib/engine/types";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { AGENCY_PHILOSOPHY } from "@/lib/agencyPhilosophy";

type Params = { params: Promise<{ id: string }> };

const client = new Anthropic();

export async function POST(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;

  const [account, snapshot, sops] = await Promise.all([
    prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } }),
    prisma.constraintSnapshot.findFirst({
      where: { accountId: id },
      orderBy: { createdAt: "desc" },
      include: { actions: { orderBy: { impact: "asc" } } },
    }),
    prisma.agencySop.findMany({ where: { organizationId: ctx.orgId, isActive: true }, orderBy: { createdAt: "asc" } }),
  ]);

  if (!account) return forbidden();
  if (!snapshot) return NextResponse.json({ error: "No snapshot — run scoring first" }, { status: 400 });

  // Re-run scorer to get per-bucket signal strings
  let bucketSignals: Record<string, string[]> = {};
  let rawSignalData: ConstraintSignals | null = null;
  if (snapshot.rawSignals) {
    try {
      rawSignalData = JSON.parse(snapshot.rawSignals) as ConstraintSignals;
      const result  = scoreConstraints(rawSignalData);
      bucketSignals = Object.fromEntries(result.buckets.map(b => [b.bucket, b.signals]));
    } catch { /* ignore */ }
  }

  // Build structured context blocks
  const bucketRows = [
    ["MEASUREMENT", snapshot.scoreMeasurement],
    ["TRAFFIC",     snapshot.scoreTraffic],
    ["CONVERSION",  snapshot.scoreConversion],
    ["FUNNEL",      snapshot.scoreFunnel],
    ["ECONOMICS",   snapshot.scoreEconomics],
  ] as [string, number][];

  const bucketSection = bucketRows.map(([b, score]) => {
    const label   = BUCKET_LABELS[b as keyof typeof BUCKET_LABELS];
    const desc    = BUCKET_DESCRIPTIONS[b as keyof typeof BUCKET_DESCRIPTIONS];
    const sigs    = (bucketSignals[b] ?? []).map(s => `    • ${s}`).join("\n");
    const isGov   = b === snapshot.governingConstraint ? " ← GOVERNING CONSTRAINT" : "";
    return `  ${label} (${desc}): ${Math.round(score)}/100${isGov}${sigs ? "\n" + sigs : ""}`;
  }).join("\n\n");

  const actionsSection = snapshot.actions.slice(0, 8).map((a, i) =>
    `  ${i + 1}. [${a.impact}/${a.effort}] ${a.title}\n     ${a.description}`
  ).join("\n\n");

  // Raw signals summary (key numbers)
  let signalsSummary = "";
  if (rawSignalData) {
    const t = rawSignalData.traffic;
    const e = rawSignalData.economics;
    const m = rawSignalData.measurement;
    signalsSummary = `
Key live metrics (last 30 days):
  CTR: ${(t.clickThroughRate * 100).toFixed(1)}%
  Quality Score avg: ${t.qualityScoreAvg.toFixed(1)}/10
  IS lost to budget: ${Math.round(t.impressionShareLost_budget * 100)}%
  IS lost to rank: ${Math.round(t.impressionShareLost_rank * 100)}%
  Irrelevant query spend: ~${Math.round(t.irrelevantQueryPercent * 100)}%
  Actual ROAS: ${e.actualRoas.toFixed(2)}x | Target ROAS: ${e.targetRoas > 0 ? e.targetRoas.toFixed(2) + "x" : "not set"}
  Budget utilisation: ${Math.round(e.budgetUtilizationPercent * 100)}%
  Conversion tracking active: ${m.conversionTrackingActive ? "Yes" : "NO — CRITICAL"}
  Enhanced conversions: ${m.hasEnhancedConversions ? "Yes" : "No"}
  GA4 linked: ${m.hasGa4Linked ? "Yes" : "No"}`;
  }

  // SOPs context
  const sopContext = sops.length > 0
    ? `\nAGENCY STANDARD OPERATING PROCEDURES:\n${
        sops.map(s => `--- SOP: ${s.title} ---\n${s.content}`).join("\n\n").slice(0, 6000)
      }\n`
    : "";

  const clientBriefContext = account.clientContext
    ? `\nCLIENT BRIEF (provided by agency):\n${account.clientContext}\n`
    : "";

  const systemPrompt = `You are a senior Google Ads optimization specialist writing a concrete, actionable playbook for a client account. You do NOT give generic advice — every recommendation references the specific data and signals provided.

Write in a direct, confident tone — like a playbook from an expert who has already diagnosed the problem. No fluff, no "it depends", no "consider" — tell them exactly what to do and why.

${AGENCY_PHILOSOPHY}

${clientBriefContext}${sopContext}
IMPORTANT: If the account is ecommerce (Shopping/PMax), adapt all advice to feed-based campaigns:
- "Rewrite ads" → "Improve product feed titles/descriptions to match search intent"
- "CTR issues" → "Feed title mismatch or pricing issue vs competitors"
- "Landing page" → "Product page quality, price competitiveness, reviews"
- Search term exclusions always apply (Shopping campaigns accept negatives)`;

  const userPrompt = `Generate an optimization playbook for this account:

ACCOUNT: ${account.name} (ID: ${account.googleAdsId})
Industry: ${account.industry ?? "Not set — assume ecommerce/retail"}
Scored: ${new Date(snapshot.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}

CONSTRAINT ANALYSIS:
${bucketSection}

${signalsSummary}

RECOMMENDED ACTIONS (prioritised):
${actionsSection}

Write the playbook in this exact structure (use markdown):

# Optimization Playbook: ${account.name}

## What's blocking growth right now
[1-2 tight paragraphs. Name the constraint. Explain WHY it's the bottleneck — not what it is, but why fixing it first matters. Reference the actual score and signal.]

## The governing constraint in detail: [Constraint name]
[Explain what specifically is broken, using the actual signal strings above. Be specific — "Your CTR is 1.2%" not "your CTR is low".]

## Immediate actions (do this week)
[3-5 very specific actions with step-by-step HOW. For each action: what to do, where in the interface, what to look for, what result to expect.]

## What NOT to touch yet
[2-3 things that might seem tempting but should wait. Explain why in one sentence each.]

## Search term / query hygiene
[Specific guidance on what to look for in the search term report based on the irrelevant query signal. For Shopping accounts: GMC title guidance.]

## How to know it's working
[4-5 specific KPIs to track, with specific thresholds. E.g. "CTR should exceed 2.5% within 3 weeks of headline rewrites".]

## 30-day milestone
[One sentence: what "winning" looks like in 30 days for this specific account.]`;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = await client.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 2048,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
        });

        for await (const chunk of anthropicStream) {
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
