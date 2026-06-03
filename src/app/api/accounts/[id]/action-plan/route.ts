import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { scoreConstraints } from "@/lib/engine";
import { ConstraintSignals, BUCKET_LABELS } from "@/lib/engine/types";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

const client = new Anthropic();

// ─── GET: return latest saved plan ───────────────────────────────────────────

export async function GET(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;

  const account = await prisma.account.findFirst({
    where: { id, organizationId: ctx.orgId },
    select: { id: true },
  });
  if (!account) return forbidden();

  const plan = await prisma.clientActionPlan.findFirst({
    where: { accountId: id },
    orderBy: { createdAt: "desc" },
    select: { id: true, createdAt: true, content: true, snapshotId: true },
  });

  return NextResponse.json(plan ?? null);
}

// ─── POST: generate a new plan (streaming SSE) ───────────────────────────────

export async function POST(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;

  const account = await prisma.account.findFirst({
    where: { id, organizationId: ctx.orgId },
  });
  if (!account) return forbidden();

  const snapshot = await prisma.constraintSnapshot.findFirst({
    where: { accountId: id },
    orderBy: { createdAt: "desc" },
    include: {
      actions: {
        orderBy: { impact: "asc" },
        take: 8,
        where: { status: { in: ["PENDING", "IN_PROGRESS"] } },
      },
    },
  });

  if (!snapshot) {
    return NextResponse.json({ error: "Score the account first to generate a plan." }, { status: 404 });
  }

  // Parse signals for rich context
  let signals: ConstraintSignals | null = null;
  let bucketSignals: Record<string, string[]> = {};
  try {
    signals = JSON.parse(snapshot.rawSignals) as ConstraintSignals;
    const result = scoreConstraints(signals);
    bucketSignals = Object.fromEntries(result.buckets.map(b => [b.bucket, b.signals]));
  } catch { /* proceed without */ }

  // Build bucket scores block
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
      const label  = BUCKET_LABELS[b.key as keyof typeof BUCKET_LABELS];
      const issueStr = issues.length ? `\n    Signals: ${issues.slice(0, 3).join(" | ")}` : "";
      return `  ${label}: ${Math.round(b.score)}/100${issueStr}`;
    })
    .join("\n");

  // Key economics/traffic metrics from rawSignals
  const eco  = signals?.economics;
  const traf = signals?.traffic;
  const conv = signals?.conversion;
  const metricsLines: string[] = [];
  if (eco?.actualRoas)              metricsLines.push(`Actual ROAS (14d): ${eco.actualRoas.toFixed(2)}×`);
  if (account.targetRoas)           metricsLines.push(`Target ROAS: ${account.targetRoas}×`);
  if (eco?.budgetUtilizationPercent) metricsLines.push(`Budget utilisation: ${Math.round(eco.budgetUtilizationPercent * 100)}%`);
  if (eco?.totalDailyBudget)        metricsLines.push(`Daily budget: ${account.currency} ${Math.round(eco.totalDailyBudget)}`);
  if (traf?.impressionShareLost_budget) metricsLines.push(`IS lost to budget: ${Math.round(traf.impressionShareLost_budget * 100)}%`);
  if (traf?.impressionShareLost_rank)   metricsLines.push(`IS lost to rank: ${Math.round(traf.impressionShareLost_rank * 100)}%`);
  if (conv?.conversionRate)         metricsLines.push(`Conv. rate (14d): ${(conv.conversionRate * 100).toFixed(2)}%`);
  if (account.targetCpa)            metricsLines.push(`Target CPA: ${account.currency} ${account.targetCpa}`);
  if (eco?.actualCpa && eco.actualCpa > 0) metricsLines.push(`Actual CPA (14d): ${account.currency} ${Math.round(eco.actualCpa)}`);

  const metricsBlock = metricsLines.join("\n");

  // Action recommendations
  const actionsBlock = snapshot.actions.length
    ? snapshot.actions
        .map((a, i) => `${i + 1}. [${a.impact}] ${a.title} — ${a.description}`)
        .join("\n")
    : "No pending recommendations.";

  // Targets block
  const targets: string[] = [];
  if (account.targetRoas)        targets.push(`Target ROAS: ${account.targetRoas}×`);
  if (account.targetCpa)         targets.push(`Target CPA: ${account.currency} ${account.targetCpa}`);
  if (account.grossMarginPercent) targets.push(`Gross margin: ${Math.round(account.grossMarginPercent * 100)}%`);
  if (account.leadToSaleRate)    targets.push(`Lead-to-sale rate: ${Math.round(account.leadToSaleRate * 100)}%`);

  const businessModelLabel: Record<string, string> = {
    ecommerce:    "Ecommerce",
    dtc:          "Direct-to-consumer (DTC)",
    dropship:     "Ecommerce (dropshipping)",
    lead_gen:     "Lead generation",
    service:      "Service / lead generation",
    saas:         "SaaS",
    subscription: "Subscription",
    marketplace:  "Marketplace",
  };
  const modelLabel = account.businessModel
    ? (businessModelLabel[account.businessModel] ?? account.businessModel)
    : null;

  const isLeadGen = account.businessModel === "lead_gen" || account.businessModel === "service";
  const governing = BUCKET_LABELS[snapshot.governingConstraint as keyof typeof BUCKET_LABELS] ?? snapshot.governingConstraint;

  const dataAge = Math.round((Date.now() - snapshot.createdAt.getTime()) / 3_600_000);
  const dataAgeStr = dataAge < 24 ? `${dataAge}h ago` : `${Math.round(dataAge / 24)}d ago`;

  const prompt = `You are a senior Google Ads strategist preparing a client-facing deliverable.
Generate a detailed 30-day and 90-day action plan for the following account.
This document will be presented directly to the client as a PDF. Write professionally, in second person ("your campaigns", "we recommend").
Be specific — every recommendation must reference the actual data provided. Zero generic advice.

ACCOUNT: ${account.name}
INDUSTRY: ${account.industry ?? "not set"}
${modelLabel ? `BUSINESS MODEL: ${modelLabel}` : ""}
CURRENCY: ${account.currency}
${account.country ? `COUNTRY: ${account.country}` : ""}
DATA AS OF: ${dataAgeStr}

GOVERNING CONSTRAINT: ${governing} (score: ${Math.round(
    buckets.find(b => b.key === snapshot.governingConstraint)?.score ?? 0
  )}/100)
CONSTRAINT REASON: ${snapshot.constraintReason}

DIAGNOSTIC SCORES:
${bucketBlock}

KEY METRICS:
${metricsBlock || "Insufficient data — account may be new or not yet spending."}

${targets.length ? `TARGETS: ${targets.join(" | ")}\n` : ""}
PENDING RECOMMENDATIONS (from diagnostic system):
${actionsBlock}

${account.clientContext ? `CLIENT / ACCOUNT CONTEXT:\n${account.clientContext}\n` : ""}
---

Generate the action plan using EXACTLY this Markdown structure. Do not deviate from the section headers:

# Executive Summary

[2–3 sentences. Describe current state, the primary bottleneck, and the opportunity. Be specific — cite actual numbers.]

# Current Performance

[Bullet list of key metrics — include ROAS vs target, budget utilisation, constraint score, and any other relevant numbers from the data above. Use bold labels.]

# 30-Day Sprint Plan

## Priority 1: [Specific action title]

**Impact**: HIGH/MEDIUM/LOW
**Effort**: EASY/MEDIUM/HARD
**Timeframe**: Week 1–2 / Week 2–4

[2–3 sentences: what, why, how to execute specifically.]

**Expected outcome**: [measurable result]

## Priority 2: [Specific action title]
[same format]

## Priority 3: [Specific action title]
[same format]

[Add Priority 4 and 5 only if genuinely needed — maximum 5 priorities]

# 90-Day Growth Roadmap

## Phase 1: Fix the Foundation (Days 1–30)

**Focus**: [one-line focus area]

[3–4 bullet points of specific actions. Reference the governing constraint.]

## Phase 2: Amplify What Works (Days 31–60)

**Focus**: [one-line focus area]

[3–4 bullet points of actions that build on Phase 1 results]

## Phase 3: Systematic Scale (Days 61–90)

**Focus**: [one-line focus area]

[3–4 bullet points of scale and diversification actions]

# Success Metrics

| Metric | Current | 30-Day Target | 90-Day Target |
|--------|---------|---------------|---------------|
${isLeadGen
  ? "| CPL | [current from data] | [realistic 30d] | [90d] |\n| Conv. rate | [current] | [30d] | [90d] |\n| Lead volume/mo | [estimate] | [30d] | [90d] |"
  : "| ROAS | [current from data] | [realistic 30d] | [90d] |\n| Conv. rate | [current] | [30d] | [90d] |\n| Budget util | [current] | [30d] | [90d] |"
}

[Add more rows as relevant — max 6 rows]

# Start Here — This Week

1. [Most urgent action — specific enough to execute today]
2. [Second priority]
3. [Third priority]

---

RULES:
- Every number cited must come from the data above. No fabrication.
- Write for a client who understands Google Ads basics but not agency jargon.
- The 30-day plan addresses the GOVERNING CONSTRAINT first. Do not skip to growth if the foundation is broken.
- ${isLeadGen ? "Never mention ROAS, product feeds, or Shopping. Focus on CPL, lead quality, and conversion funnel." : "For ecommerce, reference specific campaign types (PMax, Shopping, Search) where relevant."}
- Budget increase recommendations: only if ROAS ≥ target AND budget utilisation ≥ 90%. Otherwise, fix efficiency first.
- Keep each section focused. The document should be readable in 5 minutes.`;

  const encoder  = new TextEncoder();
  let accumulated = "";

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const aiStream = await client.messages.stream({
          model:      "claude-sonnet-4-6",
          max_tokens: 2500,
          system: `You are a senior Google Ads strategist at a performance marketing agency. You write precise, actionable client deliverables. Your plans are specific, not generic — every recommendation references real numbers and real campaign mechanics.`,
          messages: [{ role: "user", content: prompt }],
        });

        for await (const chunk of aiStream) {
          if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
            accumulated += chunk.delta.text;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`));
          }
        }

        // Save completed plan to DB
        await prisma.clientActionPlan.create({
          data: {
            accountId:  id,
            content:    accumulated,
            snapshotId: snapshot.id,
          },
        });

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Generation failed";
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
        controller.close();
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection:      "keep-alive",
    },
  });
}
