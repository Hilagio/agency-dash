/**
 * POST /api/accounts/[id]/explain-check
 *
 * Streams a 2–3 sentence contextual explanation for a specific failing check.
 * Answers: why does this metric matter for THIS client, what's likely causing it,
 * and is the benchmark even relevant for their situation?
 */
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { scoreConstraints } from "@/lib/engine";
import { ConstraintSignals } from "@/lib/engine/types";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

const client = new Anthropic();

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;

  const { bucket, checkLabel, signal, threshold } = await req.json() as {
    bucket:     string;
    checkLabel: string;
    signal:     string;   // the triggered signal text, e.g. "CTR 1.7% is below 2% threshold"
    threshold:  string;   // the pass bar, e.g. "≥ 2%"
  };

  const account = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } });
  if (!account) return forbidden();

  const snapshot = await prisma.constraintSnapshot.findFirst({
    where: { accountId: id },
    orderBy: { createdAt: "desc" },
  });

  // Extract extra context from rawSignals if available
  let signalContext = "";
  if (snapshot?.rawSignals) {
    try {
      const signals = JSON.parse(snapshot.rawSignals) as ConstraintSignals;
      const result  = scoreConstraints(signals);
      const bucketData = result.buckets.find(b => b.bucket === bucket);

      // Pull a few relevant metrics for context
      const t = signals.traffic;
      const e = signals.economics;
      const c = signals.conversion;

      const extras = [
        `CTR: ${(t.clickThroughRate * 100).toFixed(2)}%`,
        `Quality Score: ${t.qualityScoreAvg.toFixed(1)}/10`,
        e.actualRoas > 0 ? `ROAS: ${e.actualRoas.toFixed(2)}x` : null,
        c.conversionRate > 0 ? `CVR: ${(c.conversionRate * 100).toFixed(2)}% vs ${(c.industryBenchmarkConversionRate * 100).toFixed(1)}% benchmark` : null,
        `IS lost budget: ${Math.round(t.impressionShareLost_budget * 100)}%`,
        `IS lost rank: ${Math.round(t.impressionShareLost_rank * 100)}%`,
      ].filter(Boolean);

      signalContext = `Other signals from the same account: ${extras.join(" | ")}`;

      // All issues in this bucket for full context
      if (bucketData?.signals.length) {
        signalContext += `\nAll issues in this bucket: ${bucketData.signals.join(" | ")}`;
      }
    } catch { /* proceed without */ }
  }

  const targetsContext = [
    account.targetRoas         != null ? `target ROAS ${account.targetRoas}x` : null,
    account.targetCpa          != null ? `target CPA ${account.targetCpa} ${account.currency}` : null,
    account.grossMarginPercent != null ? `${Math.round(account.grossMarginPercent * 100)}% gross margin` : null,
  ].filter(Boolean).join(", ") || null;

  const clientBrief = account.clientContext
    ? `\nCLIENT BRIEF: ${account.clientContext}`
    : "";

  const prompt = `You are a Google Ads analyst explaining a specific issue to an account manager.

ACCOUNT: ${account.name}
INDUSTRY: ${account.industry ?? "not specified"}
CURRENCY: ${account.currency}
${targetsContext ? `TARGETS: ${targetsContext}` : ""}
${clientBrief}

FAILING CHECK: ${checkLabel} (${bucket} bucket)
DETECTED ISSUE: "${signal}"
PASS BAR: ${threshold}
${signalContext ? `\n${signalContext}` : ""}

Write exactly 2–3 sentences that explain:
1. What this metric actually measures and why it matters for this specific client/industry
2. What is likely causing this specific number given the context (use the actual number from the issue)
3. Whether the pass bar (${threshold}) is the right benchmark for this type of account, or if there are reasons it might be higher/lower

Be specific and use actual numbers. No generic advice. No "you should" language. Just sharp analysis.`;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const aiStream = await client.messages.stream({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 200,
          system: "You are a concise, data-driven Google Ads analyst. You explain issues in 2-3 sentences maximum. Always cite the actual numbers. Be specific to the account context.",
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
