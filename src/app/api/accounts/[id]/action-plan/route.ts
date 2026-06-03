import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { scoreConstraints } from "@/lib/engine";
import { ConstraintSignals, BUCKET_LABELS } from "@/lib/engine/types";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import {
  fetchProductPerformance,
  fetchPriorPeriodProducts,
  ProductRow,
  PriorProductRow,
} from "@/lib/integrations/google-ads";

type Params = { params: Promise<{ id: string }> };

const client = new Anthropic();

// ─── Product comparison builder ───────────────────────────────────────────────

export interface ProductComparison {
  winners:    { title: string; revenue: number; pctChange: number | null }[];
  declining:  { title: string; revenue: number; pctChange: number; priorRevenue: number }[];
  dropouts:   { title: string; priorRevenue: number }[];
  newArrivals:{ title: string; revenue: number; conversions: number }[];
  totalRevenue: number;
  priorRevenue: number;
}

function buildComparison(current: ProductRow[], prior: PriorProductRow[]): ProductComparison {
  const priorMap = new Map(prior.map(p => [p.itemId, p]));
  const currentMap = new Map(current.map(p => [p.itemId, p]));

  const totalRevenue = current.reduce((s, p) => s + p.revenue, 0);
  const priorRevenue = prior.reduce((s, p) => s + p.revenue, 0);

  // Products with current revenue
  const withRevenue = current.filter(p => p.revenue > 0);
  const winners: ProductComparison["winners"] = [];
  const declining: ProductComparison["declining"] = [];
  const newArrivals: ProductComparison["newArrivals"] = [];

  for (const p of withRevenue) {
    const prev = priorMap.get(p.itemId);
    if (!prev || prev.revenue === 0) {
      newArrivals.push({ title: p.title, revenue: p.revenue, conversions: p.conversions });
    } else {
      const pct = ((p.revenue - prev.revenue) / prev.revenue) * 100;
      if (pct >= -5) {
        winners.push({ title: p.title, revenue: p.revenue, pctChange: Math.round(pct) });
      } else {
        declining.push({ title: p.title, revenue: p.revenue, pctChange: Math.round(pct), priorRevenue: prev.revenue });
      }
    }
  }

  // Products with prior revenue but zero current
  const dropouts: ProductComparison["dropouts"] = prior
    .filter(p => p.revenue > 50 && (!currentMap.has(p.itemId) || currentMap.get(p.itemId)!.revenue === 0))
    .slice(0, 8)
    .map(p => ({ title: p.title, priorRevenue: p.revenue }));

  winners.sort((a, b) => b.revenue - a.revenue);
  declining.sort((a, b) => a.pctChange - b.pctChange);
  newArrivals.sort((a, b) => b.revenue - a.revenue);

  return {
    winners:    winners.slice(0, 8),
    declining:  declining.slice(0, 6),
    dropouts:   dropouts.slice(0, 6),
    newArrivals: newArrivals.slice(0, 8),
    totalRevenue,
    priorRevenue,
  };
}

function comparisonToContextString(cmp: ProductComparison, currency: string): string {
  const sym = currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency === "PLN" ? "PLN " : "$";
  const fmt = (n: number) => `${sym}${Math.round(n).toLocaleString()}`;
  const lines: string[] = [];

  lines.push(`Total revenue: ${fmt(cmp.totalRevenue)} vs prior period ${fmt(cmp.priorRevenue)} (${cmp.priorRevenue > 0 ? ((cmp.totalRevenue - cmp.priorRevenue) / cmp.priorRevenue * 100).toFixed(0) + "%" : "no prior data"})`);

  if (cmp.winners.length) {
    lines.push("\nTop performers (current period):");
    cmp.winners.slice(0, 5).forEach((p, i) => {
      const pct = p.pctChange != null ? ` (${p.pctChange > 0 ? "+" : ""}${p.pctChange}%)` : " (new)";
      lines.push(`  ${i + 1}. ${p.title} — ${fmt(p.revenue)}${pct}`);
    });
  }

  if (cmp.declining.length) {
    lines.push("\nDeclining products:");
    cmp.declining.slice(0, 4).forEach(p => {
      lines.push(`  - ${p.title} — ${fmt(p.revenue)} (${p.pctChange}% vs prior ${fmt(p.priorRevenue)})`);
    });
  }

  if (cmp.dropouts.length) {
    lines.push("\nDropped to zero (had revenue last period):");
    cmp.dropouts.slice(0, 4).forEach(p => {
      lines.push(`  - ${p.title} — was ${fmt(p.priorRevenue)}`);
    });
  }

  if (cmp.newArrivals.length) {
    lines.push(`\nNew products that started selling (${cmp.newArrivals.length} total):`);
    cmp.newArrivals.slice(0, 4).forEach(p => {
      lines.push(`  - ${p.title} — ${fmt(p.revenue)} (${p.conversions} orders)`);
    });
  }

  return lines.join("\n");
}

// ─── GET: return { plan, metrics } ───────────────────────────────────────────

export async function GET(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;

  const account = await prisma.account.findFirst({
    where: { id, organizationId: ctx.orgId },
    select: { id: true },
  });
  if (!account) return forbidden();

  const [plan, snapshot] = await Promise.all([
    prisma.clientActionPlan.findFirst({
      where: { accountId: id },
      orderBy: { createdAt: "desc" },
      select: { id: true, createdAt: true, content: true, snapshotId: true },
    }),
    prisma.constraintSnapshot.findFirst({
      where: { accountId: id },
      orderBy: { createdAt: "desc" },
      select: { rawSignals: true },
    }),
  ]);

  let metrics: { actualRoas: number | null; spend30d: number | null; conversionRate: number | null } | null = null;
  if (snapshot?.rawSignals) {
    try {
      const sig = JSON.parse(snapshot.rawSignals) as ConstraintSignals;
      metrics = {
        actualRoas:    sig.economics?.actualRoas       ?? null,
        spend30d:      sig.economics?.totalSpend       ?? null,
        conversionRate: sig.conversion?.conversionRate ?? null,
      };
    } catch { /* proceed */ }
  }

  return NextResponse.json({ plan: plan ?? null, metrics });
}

// ─── POST: generate plan (SSE streaming) ─────────────────────────────────────

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;

  const body = await req.json().catch(() => ({})) as {
    targetRoas?:   number | null;
    monthlyGoal?:  number | null;
    contextNotes?: string | null;
  };

  const account = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } });
  if (!account) return forbidden();

  const snapshot = await prisma.constraintSnapshot.findFirst({
    where: { accountId: id },
    orderBy: { createdAt: "desc" },
    include: {
      actions: { orderBy: { impact: "asc" }, take: 8, where: { status: { in: ["PENDING", "IN_PROGRESS"] } } },
    },
  });

  if (!snapshot) {
    return NextResponse.json({ error: "Score the account first to generate a plan." }, { status: 404 });
  }

  // Parse signals
  let signals: ConstraintSignals | null = null;
  let bucketSignals: Record<string, string[]> = {};
  try {
    signals = JSON.parse(snapshot.rawSignals) as ConstraintSignals;
    const result = scoreConstraints(signals);
    bucketSignals = Object.fromEntries(result.buckets.map(b => [b.bucket, b.signals]));
  } catch { /* proceed */ }

  const eco  = signals?.economics;
  const conv = signals?.conversion;

  // Effective target ROAS: use manual override from planSettings, fall back to account setting
  const effectiveTargetRoas = body.targetRoas ?? account.targetRoas ?? null;

  // ── Fetch product performance (with timeout) ──────────────────────────────
  let productComparison: ProductComparison | null = null;
  let productContextString = "";

  if (account.googleAdsId) {
    try {
      const TIMEOUT = 12_000;
      const [currentResult, priorResult] = await Promise.allSettled([
        Promise.race([
          fetchProductPerformance(account.googleAdsId, ctx.orgId, 0, 30),
          new Promise<never>((_, r) => setTimeout(() => r(new Error("timeout")), TIMEOUT)),
        ]),
        Promise.race([
          fetchPriorPeriodProducts(account.googleAdsId, ctx.orgId),
          new Promise<never>((_, r) => setTimeout(() => r(new Error("timeout")), TIMEOUT)),
        ]),
      ]);

      const currentProducts: ProductRow[] =
        currentResult.status === "fulfilled" ? currentResult.value.products : [];
      const priorProducts: PriorProductRow[] =
        priorResult.status === "fulfilled" ? priorResult.value : [];

      if (currentProducts.length > 0) {
        productComparison = buildComparison(currentProducts, priorProducts);
        productContextString = comparisonToContextString(productComparison, account.currency);
      }
    } catch { /* skip product data */ }
  }

  // ── Build context for Claude ──────────────────────────────────────────────
  const buckets = [
    { key: "MEASUREMENT", score: snapshot.scoreMeasurement },
    { key: "TRAFFIC",     score: snapshot.scoreTraffic },
    { key: "CONVERSION",  score: snapshot.scoreConversion },
    { key: "FUNNEL",      score: snapshot.scoreFunnel },
    { key: "ECONOMICS",   score: snapshot.scoreEconomics },
  ];

  // Only include bucket signals that are genuinely informative (not tracking noise)
  const relevantBuckets = buckets
    .filter(b => b.key !== "MEASUREMENT" || snapshot.governingConstraint === "MEASUREMENT")
    .map(b => {
      const issues = (bucketSignals[b.key] ?? [])
        .filter(s => !s.toLowerCase().includes("never fired") && !s.toLowerCase().includes("not fired"))
        .slice(0, 2);
      const label  = BUCKET_LABELS[b.key as keyof typeof BUCKET_LABELS];
      return `  ${label}: ${Math.round(b.score)}/100${issues.length ? ` — ${issues.join("; ")}` : ""}`;
    })
    .join("\n");

  const actualRoas   = eco?.actualRoas   ?? null;
  const spend30d     = eco?.totalSpend   ?? null;
  const revenue30d   = (actualRoas && spend30d) ? Math.round(actualRoas * spend30d) : null;
  const cvr          = conv?.conversionRate ?? null;

  const isLeadGen = ["lead_gen", "service"].includes(account.businessModel ?? "");

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const currentMonthName = monthNames[new Date().getMonth()];

  // Seasonal note — general ecommerce for current month
  const seasonalNotes: Record<number, string> = {
    0: "January is a recovery month post-holiday. Traffic is high but intent is mixed — focus on ROAS efficiency.",
    1: "February is typically the slowest month of the year for ecommerce. Focus on efficiency over volume.",
    2: "March marks the start of spring recovery — spring/summer collections gain traction.",
    3: "April: spring buying accelerates, particularly for fashion and outdoor categories.",
    4: "May: stable demand, approaching summer. Good month to test new audiences before the summer slowdown.",
    5: "June: early summer slowdown for many categories, particularly fashion. Focus on efficiency.",
    6: "July: summer slowdown. Volume is lower but competition is also lower — good for feed optimization.",
    7: "August: similar to July. Back-to-school categories start picking up in the second half.",
    8: "September: strong recovery. Fall/autumn collections launch, demand accelerates significantly.",
    9: "October: strong demand, especially for fashion. Pre-holiday awareness campaigns start performing.",
    10: "November: peak season begins. Black Friday drives the highest volume of the year.",
    11: "December: holiday peak. Focus on AOV and gift categories. ROAS can dip late December.",
  };
  const seasonalNote = seasonalNotes[new Date().getMonth()] ?? "";

  const businessModelLabel: Record<string, string> = {
    ecommerce: "Ecommerce", dtc: "DTC", dropship: "Ecommerce (dropshipping)",
    lead_gen: "Lead generation", service: "Service", saas: "SaaS",
    subscription: "Subscription", marketplace: "Marketplace",
  };
  const modelLabel = account.businessModel ? (businessModelLabel[account.businessModel] ?? account.businessModel) : null;
  const governing = BUCKET_LABELS[snapshot.governingConstraint as keyof typeof BUCKET_LABELS] ?? snapshot.governingConstraint;

  const actionsBlock = snapshot.actions.length
    ? snapshot.actions.map((a, i) => `${i + 1}. [${a.impact}] ${a.title} — ${a.description}`).join("\n")
    : "No pending recommendations.";

  const prompt = `ACCOUNT: ${account.name}
INDUSTRY: ${account.industry ?? "not set"}
${modelLabel ? `BUSINESS MODEL: ${modelLabel}` : ""}
CURRENCY: ${account.currency}
${account.country ? `COUNTRY: ${account.country}` : ""}
CURRENT MONTH: ${currentMonthName}
SEASONAL CONTEXT: ${seasonalNote}

PERFORMANCE (14-day window):
${actualRoas != null ? `- ROAS: ${actualRoas.toFixed(2)}×` : ""}
${effectiveTargetRoas != null ? `- Target ROAS (this period): ${effectiveTargetRoas}×` : ""}
${spend30d != null ? `- 30d spend: ${account.currency} ${Math.round(spend30d).toLocaleString()}` : ""}
${revenue30d != null ? `- 30d revenue: ${account.currency} ${revenue30d.toLocaleString()}` : ""}
${cvr != null && cvr > 0 ? `- Conversion rate: ${(cvr * 100).toFixed(2)}%` : ""}
${body.monthlyGoal ? `- Client's monthly revenue goal: ${account.currency} ${body.monthlyGoal.toLocaleString()}` : ""}

PRIMARY CONSTRAINT: ${governing}
REASON: ${snapshot.constraintReason}

DIAGNOSTIC SCORES:
${relevantBuckets}

EXISTING RECOMMENDATIONS:
${actionsBlock}

${productContextString ? `PRODUCT PERFORMANCE (last 30d vs prior 30d):\n${productContextString}\n` : ""}
${account.clientContext ? `CLIENT CONTEXT:\n${account.clientContext}\n` : ""}
${body.contextNotes ? `PLAN FOCUS / CONTEXT FROM MANAGER:\n${body.contextNotes}\n` : ""}

---

Generate a 30 & 90 day growth plan. Use EXACTLY this Markdown structure:

# Executive Summary

[2–3 sentences. What is driving performance right now, what the key constraint is, and what the plan will achieve. Cite actual numbers.]

# What's Working — Protect and Scale This

[Identify the current growth engine. If product data is provided, name specific products or categories. Be concrete about what's performing and why.]

# The #1 Growth Lever Right Now

[One specific, concrete explanation of what would move the needle most and WHY — name the mechanism. No generic advice. Reference actual metrics from the data above.]

# 30-Day Sprint Plan

## 1. [Specific Action Title]

**Impact**: HIGH/MEDIUM | **Effort**: EASY/MEDIUM/HARD

**What**: [One sentence — exactly what is being changed]

**Why this works**: [Explain the mechanism — how does this directly improve ROAS or revenue? Be specific about the causal chain.]

**How to execute**:
- [Step 1 — specific enough to do today]
- [Step 2]
- [Step 3]

**Expected outcome**: [Specific metric — e.g., "+0.3 ROAS points within 2 weeks", "Reduce wasted spend by ~15%"]

## 2. [Specific Action Title]
[Same structure. Max 4 priorities total.]

# 90-Day Growth Roadmap

## Month 1: [Theme — e.g., "Stop the bleeding on low performers"]
**Focus**: [One line]
- [Action 1 with brief HOW]
- [Action 2 with brief HOW]
- [Action 3 with brief HOW]
- [Action 4 with brief HOW]

## Month 2: [Theme]
**Focus**: [One line]
- [4 actions with HOW]

## Month 3: [Theme — usually scaling]
**Focus**: [One line]
- [3–4 actions with HOW]

# Seasonal Outlook — ${currentMonthName} to ${monthNames[(new Date().getMonth() + 2) % 12]}

[Based on the seasonal context provided, what should we expect for the next 3 months? What does this mean for budget strategy, campaign focus, and product priorities? Be specific about timing — name actual months and expected revenue direction.]

${productContextString ? `# Product Strategy

[Based on the product performance data above, provide specific strategic recommendations. Name actual products. Identify which products to push harder, which to investigate, which to pull budget from. Explain the seasonality impact where relevant.]
` : ""}
# Targets — Month by Month

| Month | Revenue Target | ROAS Target | Strategic Focus |
|-------|----------------|-------------|-----------------|
| ${monthNames[(new Date().getMonth() + 1) % 12]} | [realistic target in ${account.currency}] | [ROAS] | [One-liner] |
| ${monthNames[(new Date().getMonth() + 2) % 12]} | [target] | [ROAS] | [One-liner] |
| ${monthNames[(new Date().getMonth() + 3) % 12]} | [target] | [ROAS] | [One-liner] |

# Start Here — This Week

1. [Most urgent action — specific enough to execute today, not "review campaigns"]
2. [Second priority]
3. [Third priority]

---

HARD RULES:
- Every recommendation must include HOW — not just what.
- Never mention "budget utilization" as a performance KPI. Clients care about revenue and ROAS.
- Never mention impression share metrics unless IS lost to budget > 40% AND ROAS ≥ target.
- If conversion tracking is working (it is — account records purchases), do not mention tracking issues.
- Revenue targets must account for seasonal patterns described above.
- ${isLeadGen ? "This is lead-gen: never mention ROAS, product feeds, or Shopping." : "Name specific products where product data is available."}
- Tone: confident, specific, client-facing. Write as if presenting to a CEO who is results-focused.`;

  const encoder = new TextEncoder();
  let accumulated = "";

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Emit product comparison as structured data first (for UI rendering)
        if (productComparison) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ products: productComparison })}\n\n`));
        }

        const aiStream = await client.messages.stream({
          model:      "claude-sonnet-4-6",
          max_tokens: 3000,
          system: `You are a senior Google Ads growth strategist writing a client-facing deliverable.

Your job is to write a specific, actionable, results-oriented action plan.

CRITICAL RULES:
1. Focus exclusively on ROAS and revenue growth. Clients measure success by revenue and return on ad spend.
2. Every recommendation must explain HOW to execute it — not just what to do.
3. If product data is provided, reference specific product names in recommendations.
4. Never mention "budget utilization" as a goal metric.
5. Never mention tracking issues unless told the account has zero conversions.
6. Be concrete about seasonality — name specific months and expected revenue direction.
7. Revenue targets must be realistic and account for seasonal patterns.
8. No generic advice. Everything must be specific to this account's numbers and context.`,
          messages: [{ role: "user", content: prompt }],
        });

        for await (const chunk of aiStream) {
          if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
            accumulated += chunk.delta.text;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`));
          }
        }

        await prisma.clientActionPlan.create({
          data: { accountId: id, content: accumulated, snapshotId: snapshot.id },
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
