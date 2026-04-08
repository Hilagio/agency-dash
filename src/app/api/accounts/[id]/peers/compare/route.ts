/**
 * POST /api/accounts/[id]/peers/compare
 *
 * Streaming AI gap analysis: explains why one account outperforms another.
 * Includes signals, product performance, and price competitiveness for both accounts.
 *
 * Body: { compareWithId: string }
 *
 * INTERNAL ONLY — never shown to clients.
 */
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { BUCKET_LABELS, ConstraintSignals } from "@/lib/engine/types";
import { AGENCY_PHILOSOPHY } from "@/lib/agencyPhilosophy";
import { fetchProductPerformance } from "@/lib/integrations/google-ads";
import { getMerchantCenterIds, fetchPriceCompetitiveness } from "@/lib/integrations/merchant-center";

type Params = { params: Promise<{ id: string }> };

const client = new Anthropic();

function pct(v: number, d = 1) { return `${(v * 100).toFixed(d)}%`; }
function money(v: number, c = "EUR") {
  const s = c === "EUR" ? "€" : c === "GBP" ? "£" : "$";
  return `${s}${v.toFixed(2)}`;
}

type AccountRow = {
  name: string; googleAdsId: string | null; industry: string | null;
  country: string | null; businessModel: string | null; currency: string;
  targetRoas: number | null; targetCpa: number | null; grossMarginPercent: number | null;
};
type SnapRow = {
  scoreMeasurement: number; scoreTraffic: number; scoreConversion: number;
  scoreFunnel: number; scoreEconomics: number;
  governingConstraint: string; constraintReason: string; rawSignals: string;
};
type PriceRow = { itemId: string; title?: string; priceDiffPercent: number; status: string };
type ProductData = Awaited<ReturnType<typeof fetchProductPerformance>>;

function buildSignalsBlock(account: AccountRow, snap: SnapRow): string {
  const label = BUCKET_LABELS[snap.governingConstraint as keyof typeof BUCKET_LABELS] ?? snap.governingConstraint;
  let signals: ConstraintSignals | null = null;
  try { signals = JSON.parse(snap.rawSignals) as ConstraintSignals; } catch { /* ignore */ }

  const scores = [
    `  Measurement: ${Math.round(snap.scoreMeasurement)}/100`,
    `  Traffic:     ${Math.round(snap.scoreTraffic)}/100`,
    `  Conversion:  ${Math.round(snap.scoreConversion)}/100`,
    `  Funnel:      ${Math.round(snap.scoreFunnel)}/100`,
    `  Economics:   ${Math.round(snap.scoreEconomics)}/100`,
  ].join("\n");

  const cur = account.currency;
  const metrics: string[] = [];
  if (signals) {
    const t = signals.traffic;
    const e = signals.economics;
    const c = signals.conversion;
    const f = signals.funnel;
    if (t.clickThroughRate > 0)            metrics.push(`CTR: ${pct(t.clickThroughRate, 2)}`);
    if (t.searchImpressionShare > 0)       metrics.push(`Impression share: ${pct(t.searchImpressionShare)}`);
    if (t.impressionShareLost_budget > 0)  metrics.push(`IS lost (budget): ${pct(t.impressionShareLost_budget)}`);
    if (t.impressionShareLost_rank > 0)    metrics.push(`IS lost (rank): ${pct(t.impressionShareLost_rank)}`);
    if (t.averageCpc > 0)                  metrics.push(`Avg CPC: ${money(t.averageCpc, cur)}`);
    if (t.qualityScoreCount > 0)           metrics.push(`Avg QS: ${t.qualityScoreAvg.toFixed(1)}/10`);
    if (c.conversionRate > 0)              metrics.push(`CVR: ${pct(c.conversionRate, 2)}`);
    if (e.actualRoas > 0)                  metrics.push(`ROAS: ${e.actualRoas.toFixed(2)}x${account.targetRoas ? ` (target: ${account.targetRoas}x, gap: ${(((e.actualRoas / account.targetRoas) - 1) * 100).toFixed(0)}%)` : ""}`);
    if (e.actualRoasBaseline > 0)          metrics.push(`ROAS 6-month baseline: ${e.actualRoasBaseline.toFixed(2)}x`);
    if (e.actualCpa > 0)                   metrics.push(`CPA: ${money(e.actualCpa, cur)}${account.targetCpa ? ` (target: ${money(account.targetCpa, cur)})` : ""}`);
    if (e.avgOrderValue > 0)               metrics.push(`Avg order value: ${money(e.avgOrderValue, cur)}`);
    if (e.budgetUtilizationPercent > 0)    metrics.push(`Budget utilisation: ${pct(e.budgetUtilizationPercent)}`);
    if (account.grossMarginPercent)        metrics.push(`Gross margin: ${pct(account.grossMarginPercent)} (break-even ROAS: ${(1 / account.grossMarginPercent).toFixed(1)}x)`);
    if (f?.costPerLead > 0)                metrics.push(`CPL: ${money(f.costPerLead, cur)}${account.targetCpa ? ` (target: ${money(account.targetCpa, cur)})` : ""}`);
    if (f?.leadToSaleRate > 0)             metrics.push(`Lead-to-sale rate: ${pct(f.leadToSaleRate)}`);
  }

  return `ACCOUNT: ${account.name}
Industry: ${account.industry ?? "?"} | Country: ${account.country ?? "?"} | Business model: ${account.businessModel ?? "?"} | Currency: ${cur}

Bucket scores:
${scores}

Governing constraint: ${label}
Why: ${snap.constraintReason}

Performance metrics:
${metrics.length ? metrics.map(m => `  ${m}`).join("\n") : "  No signal data available"}`;
}

function buildProductBlock(
  account: AccountRow,
  productData: ProductData | null,
  priceRows: PriceRow[]
): string {
  if (!productData?.products?.length) return "";

  const curr = account.currency === "EUR" ? "€" : account.currency === "GBP" ? "£" : "$";
  const priceMap = new Map(priceRows.map(p => [p.itemId, p]));

  const lines: string[] = [
    `Product performance (last 30 days — ${productData.products.length} products):`,
    `  Total revenue: ${curr}${Math.round(productData.totalRevenue)} | Total spend: ${curr}${Math.round(productData.totalCost)} | Account ROAS: ${productData.roas.toFixed(2)}x`,
  ];

  // Top 6 by revenue
  const topByRevenue = [...productData.products]
    .filter(p => p.revenue > 0 || p.conversions > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);

  if (topByRevenue.length > 0) {
    lines.push(`  Top revenue products:`);
    topByRevenue.forEach(p => {
      const pc = priceMap.get(p.itemId);
      const priceNote = pc
        ? ` | price ${pc.priceDiffPercent > 0 ? "+" : ""}${pc.priceDiffPercent.toFixed(0)}% vs market (${pc.status.replace("_", " ")})`
        : "";
      lines.push(`    - ${p.title || p.itemId}: ${p.conversions.toFixed(0)} sales, ${curr}${Math.round(p.revenue)} rev, ${curr}${Math.round(p.cost)} spend, ROAS ${p.roas.toFixed(1)}x, CTR ${(p.ctr * 100).toFixed(1)}%${priceNote}`);
    });
  }

  // Zero-conversion wasters
  const noConv = [...productData.products]
    .filter(p => p.cost > 15 && p.conversions === 0)
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 4);

  if (noConv.length > 0) {
    lines.push(`  Products spending with zero conversions:`);
    noConv.forEach(p => {
      const pc = priceMap.get(p.itemId);
      const priceNote = pc ? ` | ${pc.priceDiffPercent > 0 ? "+" : ""}${pc.priceDiffPercent.toFixed(0)}% vs market` : "";
      lines.push(`    - ${p.title || p.itemId}: ${curr}${Math.round(p.cost)} wasted, ${p.clicks} clicks${priceNote}`);
    });
  }

  // Price competitiveness summary
  if (priceRows.length > 0) {
    const wellAbove = priceRows.filter(p => p.status === "well_above").length;
    const above     = priceRows.filter(p => p.status === "above").length;
    const comp      = priceRows.filter(p => p.status === "below" || p.status === "competitive").length;
    lines.push(`  Price competitiveness (${priceRows.length} products benchmarked): ${wellAbove} well above market, ${above} above market, ${comp} competitive/below`);

    // Worst offenders — most above market among top revenue products
    const overpriced = topByRevenue
      .map(p => priceMap.get(p.itemId))
      .filter((pc): pc is PriceRow => !!pc && pc.priceDiffPercent > 10)
      .sort((a, b) => b.priceDiffPercent - a.priceDiffPercent)
      .slice(0, 3);
    if (overpriced.length > 0) {
      lines.push(`  Most overpriced top products: ${overpriced.map(pc => `${pc.title || pc.itemId} (+${pc.priceDiffPercent.toFixed(0)}%)`).join(", ")}`);
    }
  }

  return lines.join("\n");
}

async function fetchProductContext(
  account: AccountRow,
  orgId: string
): Promise<{ productData: ProductData | null; priceRows: PriceRow[] }> {
  if (!account.googleAdsId) return { productData: null, priceRows: [] };
  try {
    const [productData, mcIds] = await Promise.race([
      Promise.all([
        fetchProductPerformance(account.googleAdsId, orgId).catch(() => null),
        getMerchantCenterIds(account.googleAdsId, orgId).catch(() => [] as string[]),
      ]),
      new Promise<[null, string[]]>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 20_000)
      ),
    ]);

    let priceRows: PriceRow[] = [];
    if (mcIds.length > 0) {
      try {
        const priceData = await Promise.race([
          fetchPriceCompetitiveness(mcIds[0], orgId),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), 10_000)),
        ]);
        priceRows = priceData.products ?? [];
      } catch { /* non-fatal */ }
    }
    return { productData, priceRows };
  } catch {
    return { productData: null, priceRows: [] };
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;
  const { compareWithId } = await req.json() as { compareWithId: string };

  // Load both accounts — must belong to same org
  const [accountA, accountB] = await Promise.all([
    prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } }),
    prisma.account.findFirst({ where: { id: compareWithId, organizationId: ctx.orgId } }),
  ]);
  if (!accountA || !accountB) return forbidden();

  // Load snapshots + product data for both in parallel
  const [snapA, snapB, prodCtxA, prodCtxB] = await Promise.all([
    prisma.constraintSnapshot.findFirst({ where: { accountId: id },            orderBy: { createdAt: "desc" } }),
    prisma.constraintSnapshot.findFirst({ where: { accountId: compareWithId }, orderBy: { createdAt: "desc" } }),
    fetchProductContext(accountA, ctx.orgId),
    fetchProductContext(accountB, ctx.orgId),
  ]);

  if (!snapA || !snapB) {
    return NextResponse.json({ error: "One or both accounts have no scored snapshot yet. Run scoring first." }, { status: 400 });
  }

  const blockA = buildSignalsBlock(accountA, snapA);
  const blockB = buildSignalsBlock(accountB, snapB);

  const prodBlockA = buildProductBlock(accountA, prodCtxA.productData, prodCtxA.priceRows);
  const prodBlockB = buildProductBlock(accountB, prodCtxB.productData, prodCtxB.priceRows);

  // Determine leader by economics: actual ROAS first, then min bucket score
  let signals: { economics?: { actualRoas?: number } } = {};
  let signalsB: { economics?: { actualRoas?: number } } = {};
  try { signals  = JSON.parse(snapA.rawSignals); } catch { /* ignore */ }
  try { signalsB = JSON.parse(snapB.rawSignals); } catch { /* ignore */ }
  const roasA = signals?.economics?.actualRoas  ?? 0;
  const roasB = signalsB?.economics?.actualRoas ?? 0;
  const revenueA = prodCtxA.productData?.totalRevenue ?? 0;
  const revenueB = prodCtxB.productData?.totalRevenue ?? 0;

  // Leader = higher ROAS if both have revenue; else higher revenue; else better min score
  let leader: string, laggard: string;
  if (roasA > 0 && roasB > 0) {
    leader  = roasA >= roasB ? accountA.name : accountB.name;
    laggard = roasA >= roasB ? accountB.name : accountA.name;
  } else if (revenueA > 0 || revenueB > 0) {
    leader  = revenueA >= revenueB ? accountA.name : accountB.name;
    laggard = revenueA >= revenueB ? accountB.name : accountA.name;
  } else {
    const minA = Math.min(snapA.scoreMeasurement, snapA.scoreTraffic, snapA.scoreConversion, snapA.scoreFunnel, snapA.scoreEconomics);
    const minB = Math.min(snapB.scoreMeasurement, snapB.scoreTraffic, snapB.scoreConversion, snapB.scoreFunnel, snapB.scoreEconomics);
    leader  = minA >= minB ? accountA.name : accountB.name;
    laggard = minA >= minB ? accountB.name : accountA.name;
  }

  const hasProducts = prodBlockA || prodBlockB;

  const prompt = `Internal agency gap analysis. Two ${accountA.industry ?? "ecommerce"} stores, same market, managed by same agency.

${AGENCY_PHILOSOPHY}

--- ${accountA.name} ---
${blockA}
${prodBlockA ? `\n${prodBlockA}` : "\n(No product data)"}

--- ${accountB.name} ---
${blockB}
${prodBlockB ? `\n${prodBlockB}` : "\n(No product data)"}

---

Write a gap analysis. Use this structure, nothing else:

## ${accountA.name} vs ${accountB.name}

**Revenue & efficiency gap**
2–3 sentences max. Lead with ROAS and revenue. Cite numbers. Done.

**Why — root causes only**
Bullet points. Each bullet = one cause, one consequence. No padding, no transitions. If pricing is a factor, name the products and the % gap. If search term hygiene is a factor, say so and why it matters here specifically. Maximum 5 bullets.
${hasProducts ? `
**Product & pricing**
Which account has the better product mix? Name the top products that are driving the gap. Name specific overpriced products that are killing conversion. 3–5 bullets, numbers only.
` : ""}
**Actions for ${laggard} — this week**
Numbered list. Max 4. Each action must be executable by a specialist tomorrow morning — no strategy, no "review", no "consider". Format: [metric to move] → [exact action] → [expected result].

RULES:
- Maximum 400 words total.
- Zero meta-commentary about scores, data quality, or the tool.
- Zero strategy preamble. Start with the gap, end with actions.
- If a number isn't in the data, don't mention it.
- Do not explain what the constraint framework is.`;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const aiStream = await client.messages.stream({
          model:      "claude-sonnet-4-6",
          max_tokens: 2000,
          system: `You are a senior performance analyst at a Google Ads agency. You diagnose why similar stores achieve different results and tell specialists exactly what to fix. You are blunt, short, and number-driven. You never explain methodology, never comment on data quality, never use filler. Every sentence contains a number or an action. Maximum 400 words total.`,
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
      "Content-Type":  "text/event-stream",
      "Cache-Control": "no-cache",
      Connection:      "keep-alive",
    },
  });
}
