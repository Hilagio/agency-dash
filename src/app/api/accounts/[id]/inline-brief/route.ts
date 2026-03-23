/**
 * POST /api/accounts/[id]/inline-brief
 *
 * Streams a focused, actionable brief for a specific issue detected in the account.
 * Body: { type: "cro" | "ctr", actionTitle: string, actionDescription?: string }
 *
 * CRO type: scrapes the client's actual landing page and writes a page-specific brief.
 * CTR type: headline ideas + ad copy recommendations based on live metrics.
 */
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { ConstraintSignals } from "@/lib/engine/types";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { scrapePage, formatPageForPrompt } from "@/lib/scrape-page";

type Params = { params: Promise<{ id: string }> };

const client = new Anthropic();

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;
  const { type, actionTitle, actionDescription } = await req.json() as {
    type: "cro" | "ctr";
    actionTitle: string;
    actionDescription?: string;
  };

  const [account, snapshot] = await Promise.all([
    prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } }),
    prisma.constraintSnapshot.findFirst({
      where: { accountId: id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!account) return forbidden();

  // ─── Live metrics ─────────────────────────────────────────────────────────
  let metricsBlock = "";
  if (snapshot?.rawSignals) {
    try {
      const signals = JSON.parse(snapshot.rawSignals) as ConstraintSignals;
      if (type === "ctr") {
        metricsBlock = `Live metrics:
  CTR: ${(signals.traffic.clickThroughRate * 100).toFixed(2)}%
  Quality Score avg: ${signals.traffic.qualityScoreAvg.toFixed(1)}/10
  Impression share lost to rank: ${Math.round(signals.traffic.impressionShareLost_rank * 100)}%
  Irrelevant query share: ${Math.round(signals.traffic.irrelevantQueryPercent * 100)}%`;
      } else {
        metricsBlock = `Live metrics:
  Conversion rate: ${(signals.conversion.conversionRate * 100).toFixed(2)}%
  Industry benchmark: ~${(signals.conversion.industryBenchmarkConversionRate * 100).toFixed(1)}%
  Landing page score (Google): ${signals.conversion.landingPageScore}/10
  Mobile speed score: ${signals.conversion.mobileSpeedScore}/100
  ROAS: ${signals.economics.actualRoas.toFixed(2)}x
  Budget utilisation: ${Math.round(signals.economics.budgetUtilizationPercent * 100)}%`;
      }
    } catch { /* ignore */ }
  }

  const clientBrief = account.clientContext
    ? `CLIENT BRIEF:\n${account.clientContext}\n`
    : "";

  // ─── Scrape landing page for CRO (parallel with other work) ───────────────
  let pageBlock = "";
  if (type === "cro" && account.landingPageUrl) {
    const page = await scrapePage(account.landingPageUrl);
    pageBlock   = formatPageForPrompt(page);
  } else if (type === "cro" && !account.landingPageUrl) {
    pageBlock = "[No landing page URL set — add it in Account Targets for page-specific analysis]";
  }

  // ─── Prompts ──────────────────────────────────────────────────────────────
  let systemPrompt = "";
  let userPrompt   = "";

  if (type === "cro") {
    const hasPage = !!account.landingPageUrl && !pageBlock.includes("failed");

    const pageInstruction = hasPage
      ? "You have the actual page content below — reference SPECIFIC elements: quote actual headline text, name actual button labels, describe actual form fields. Never say 'your headline' — say what the headline currently IS and what it should become."
      : "No page URL is set, so base recommendations on the industry and client brief.";

    const cvrRef = metricsBlock.includes("Conversion rate") ? "see metrics above" : "from brief";

    const aboveFoldInstruction = hasPage
      ? "[Reference the ACTUAL current H1/headline text. Say: 'The current headline \"[exact text]\" should become \"[new text]\" because [reason for this niche].' Do this for 2-3 specific changes.]"
      : "[3 specific changes for this industry. For each: what to change, what to change it TO, why it matters.]";

    const ctaInstruction = hasPage
      ? "[Name the actual button text currently on the page and what it should say. List any form fields and whether the number should be reduced.]"
      : "[2-3 specific CTA and form recommendations for this industry.]";

    const trustInstruction = hasPage
      ? "[Note what trust signals ARE present on the page. Name what is MISSING that this type of customer expects — be specific to the industry and price point.]"
      : "[What trust signals are likely missing based on the industry. Be specific.]";

    systemPrompt = `You are a senior CRO specialist writing a brief that goes directly to a developer or CRO specialist.
${pageInstruction}
Write in markdown. Be specific and actionable. No generic advice.`;

    userPrompt = `Create a CRO brief for this account.

Account: ${account.name}
Industry: ${account.industry ?? "ecommerce"}
Issue detected: "${actionTitle}"
${actionDescription ? `Details: ${actionDescription}\n` : ""}
${metricsBlock}
${clientBrief}
${pageBlock}

Write this structure exactly:

## CRO Brief — ${account.name}

### What's happening
[2 sentences. Include the actual CVR (${cvrRef}) vs benchmark. Be precise about the gap.]

### Above the fold — what to change
${aboveFoldInstruction}

### CTA & form
${ctaInstruction}

### Trust signals
${trustInstruction}

### A/B tests (priority order)
1. Hypothesis: [specific test] — Expected lift: [X–Y%]
2. Hypothesis: [specific test] — Expected lift: [X–Y%]
3. Hypothesis: [specific test] — Expected lift: [X–Y%]

### Brief for the specialist
[6–8 bullet points, ready to paste. Start each with an action verb. Reference actual page elements where possible.]`;

  } else {
    // CTR brief
    systemPrompt = `You are a senior Google Ads specialist writing specific, ready-to-use CTR recommendations.
Write in markdown. Provide REAL testable headlines — not descriptions of what a headline should do.
Every recommendation must reference the actual metrics.`;

    userPrompt = `Create CTR improvement recommendations for this account.

Account: ${account.name}
Industry: ${account.industry ?? "ecommerce"}
Issue detected: "${actionTitle}"
${actionDescription ? `Details: ${actionDescription}\n` : ""}
${metricsBlock}
${clientBrief}

Write this structure exactly:

## CTR Improvement Brief — ${account.name}

### Root cause
[1–2 sentences. Name the specific reason based on the data. Low QS = ad/page mismatch. High irrelevant query share = wrong match types. Be precise.]

### Headlines — ready to test (30 chars max each)
1. [Headline] — Benefit-led
2. [Headline] — Specificity/numbers
3. [Headline] — Urgency or scarcity
4. [Headline] — Social proof
5. [Headline] — Question format
6. [Headline] — Pain point
7. [Headline] — Brand differentiator
8. [Headline] — Feature highlight

### Description lines (90 chars max each)
1. [Description 1]
2. [Description 2]
3. [Description 3]

### Ad extensions to add now
[Sitelinks, callouts, structured snippets — give specific examples based on the industry, not generic labels]

### Match type & query hygiene
[1–2 actionable sentences on improving query relevance for this specific account]`;
  }

  // ─── Stream ───────────────────────────────────────────────────────────────
  const encoder = new TextEncoder();
  const stream  = new ReadableStream({
    async start(controller) {
      try {
        const aiStream = await client.messages.stream({
          model:      "claude-sonnet-4-6",
          max_tokens: 1200,
          system:     systemPrompt,
          messages:   [{ role: "user", content: userPrompt }],
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
      "Content-Type":  "text/event-stream",
      "Cache-Control": "no-cache",
      Connection:      "keep-alive",
    },
  });
}
