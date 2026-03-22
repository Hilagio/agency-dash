/**
 * POST /api/accounts/[id]/inline-brief
 *
 * Streams a focused, actionable brief for a specific issue detected in the account.
 * Body: { type: "cro" | "ctr", actionTitle: string, actionDescription: string }
 *
 * CRO type: structured brief for landing page / conversion rate issues
 * CTR type: headline ideas + ad copy recommendations
 */
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { ConstraintSignals } from "@/lib/engine/types";

type Params = { params: Promise<{ id: string }> };

const client = new Anthropic();

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { type, actionTitle, actionDescription } = await req.json() as {
    type: "cro" | "ctr";
    actionTitle: string;
    actionDescription?: string;
  };

  const [account, snapshot] = await Promise.all([
    prisma.account.findUnique({ where: { id } }),
    prisma.constraintSnapshot.findFirst({
      where: { accountId: id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!account) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Extract relevant live metrics from rawSignals
  let metricsBlock = "";
  if (snapshot?.rawSignals) {
    try {
      const signals = JSON.parse(snapshot.rawSignals) as ConstraintSignals;
      if (type === "ctr") {
        metricsBlock = `
Live metrics:
  CTR: ${(signals.traffic.clickThroughRate * 100).toFixed(2)}%
  Quality Score avg: ${signals.traffic.qualityScoreAvg.toFixed(1)}/10
  Impression share lost to rank: ${Math.round(signals.traffic.impressionShareLost_rank * 100)}%
  Irrelevant query share: ${Math.round(signals.traffic.irrelevantQueryPercent * 100)}%`;
      } else if (type === "cro") {
        metricsBlock = `
Live metrics:
  Conversion rate: ${(signals.conversion.conversionRate * 100).toFixed(2)}%
  Industry benchmark: ~${(signals.conversion.industryBenchmarkConversionRate * 100).toFixed(1)}%
  Landing page score: ${signals.conversion.landingPageScore}/10
  ROAS: ${signals.economics.actualRoas.toFixed(2)}x
  Budget utilisation: ${Math.round(signals.economics.budgetUtilizationPercent * 100)}%`;
      }
    } catch { /* ignore */ }
  }

  const clientBrief = account.clientContext
    ? `\nCLIENT BRIEF (from agency):\n${account.clientContext}\n`
    : "";

  let systemPrompt = "";
  let userPrompt = "";

  if (type === "cro") {
    systemPrompt = `You are a senior CRO specialist creating a concise brief that can be handed directly to a CRO specialist or shown to a client. Write in markdown. Be specific and actionable — no generic advice. Every recommendation should directly relate to the account context and metrics provided.`;
    userPrompt = `Create a CRO brief for this account.

Account: ${account.name}
Industry: ${account.industry ?? "Not set — assume ecommerce/retail"}
Issue detected: "${actionTitle}"
${actionDescription ? `Details: ${actionDescription}` : ""}
${metricsBlock}
${clientBrief}
Write this structure exactly:

## CRO Brief — ${account.name}

### What's happening
[2 sentences max. Include the actual CVR number vs benchmark. Name the problem precisely.]

### Highest-impact fixes (above the fold)
[3-4 specific changes. For each: what to change, what to change it TO, why it matters for this niche.]

### CTA & form
[2-3 specific changes based on the industry. What CTA text, placement, form length, etc.]

### Trust signals missing
[What's likely absent based on the industry. Be specific — e.g. "payment badges near checkout CTA" not just "add trust signals".]

### A/B tests to run (priority order)
1. Hypothesis: [what to test] — Expected lift: [X–Y%]
2. Hypothesis: [what to test] — Expected lift: [X–Y%]
3. Hypothesis: [what to test] — Expected lift: [X–Y%]

### Brief for the CRO specialist
[6–8 bullet points, ready to paste. Start each with an action verb.]`;

  } else {
    systemPrompt = `You are a senior Google Ads specialist creating specific, ready-to-use CTR improvement recommendations. Write in markdown. Provide real, testable headlines — not descriptions of headlines. Every recommendation should reference the actual metrics provided.`;
    userPrompt = `Create CTR improvement recommendations for this account.

Account: ${account.name}
Industry: ${account.industry ?? "Not set — assume ecommerce/retail"}
Issue detected: "${actionTitle}"
${actionDescription ? `Details: ${actionDescription}` : ""}
${metricsBlock}
${clientBrief}
Write this structure exactly:

## CTR Improvement Brief — ${account.name}

### Root cause
[1–2 sentences. Name the specific reason for low CTR based on the data — low QS = ad relevance, high irrelevant query share = wrong match types, etc.]

### Headline ideas — ready to test (30 chars max each)
Cover these angles in order:
1. [Headline] — Benefit-led
2. [Headline] — Specificity/numbers
3. [Headline] — Urgency or scarcity
4. [Headline] — Social proof
5. [Headline] — Question format
6. [Headline] — Pain point / problem aware
7. [Headline] — Brand differentiator
8. [Headline] — Feature highlight

### Description lines (90 chars max each)
1. [Description 1]
2. [Description 2]
3. [Description 3]

### Ad extensions to add immediately
[Sitelinks, callouts, structured snippets — list specific examples based on the industry, not generic advice]

### Match type & query relevance
[1–2 actionable sentences on improving query relevance for this account]`;
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = await client.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 1024,
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
