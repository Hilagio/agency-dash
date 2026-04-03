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
import { fetchProductPerformance } from "@/lib/integrations/google-ads";
import { getMerchantCenterIds, fetchPriceCompetitiveness } from "@/lib/integrations/merchant-center";

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

  // ── Account type detection ────────────────────────────────────────────────
  // Lead gen: explicit businessModel OR funnel signals show CPL with no ecommerce revenue
  const isLeadGen = account.businessModel === "lead_gen" || account.businessModel === "service"
    || (!account.businessModel && signals?.funnel?.costPerLead != null && signals.funnel.costPerLead > 0 && (signals?.economics?.actualRoas ?? 0) === 0);

  // Shopping/PMax: feed-based (no keyword QS) AND not lead gen
  const isShoppingAccount = !isLeadGen && (signals?.traffic
    ? signals.traffic.qualityScoreCount === 0
    : account.businessModel === "ecommerce" || account.businessModel === "dtc" || account.businessModel === "dropship");

  // Check if there is enough real data to give a meaningful analysis
  const hasRealData = signals != null && (
    (signals.economics.actualRoas > 0 || signals.economics.actualCpa > 0) ||
    (signals.funnel?.costPerLead ?? 0) > 0 ||
    signals.traffic.clickThroughRate > 0
  );
  const dataAge = snapshot.createdAt
    ? Math.round((Date.now() - new Date(snapshot.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  let metricsBlock = "";
  if (signals) {
    const t = signals.traffic;
    const e = signals.economics;
    const c = signals.conversion;
    const f = signals.funnel;
    const rows = [
      `CTR: ${(t.clickThroughRate * 100).toFixed(2)}%`,
      (!isShoppingAccount && t.qualityScoreCount > 0)
        ? `Quality Score: ${t.qualityScoreAvg.toFixed(1)}/10 (${t.qualityScoreCount} keywords)`
        : isShoppingAccount ? `Feed-based (Shopping/PMax) — QS not applicable` : null,
      `IS lost to budget: ${Math.round(t.impressionShareLost_budget * 100)}%`,
      `IS lost to rank: ${Math.round(t.impressionShareLost_rank * 100)}%`,
      // Ecommerce metrics
      (!isLeadGen && e.actualRoas > 0) ? `Actual ROAS: ${e.actualRoas.toFixed(2)}x` : null,
      (!isLeadGen && e.actualCpa  > 0) ? `Actual CPA: ${e.actualCpa.toFixed(0)}` : null,
      // Lead gen metrics
      (isLeadGen && f?.costPerLead   > 0)                          ? `CPL: ${e.actualCpa > 0 ? e.actualCpa.toFixed(0) : f.costPerLead.toFixed(0)} (target: ${account.targetCpa ?? "not set"})` : null,
      (isLeadGen && f?.leadToSaleRate > 0)                         ? `Lead-to-sale rate: ${(f.leadToSaleRate * 100).toFixed(1)}%` : null,
      (isLeadGen && f?.averageLeadQualityScore > 0)                 ? `Avg lead quality: ${f.averageLeadQualityScore.toFixed(1)}/10` : null,
      (isLeadGen)                                                   ? `Offline conversion import: ${f?.offlineConversionImportActive ? "active" : "NOT active — sales not tracked back to clicks"}` : null,
      c.conversionRate > 0 ? `${isLeadGen ? "Form CVR" : "CVR"}: ${(c.conversionRate * 100).toFixed(2)}% (benchmark: ${(c.industryBenchmarkConversionRate * 100).toFixed(1)}%)` : null,
      `Budget utilisation: ${Math.round(e.budgetUtilizationPercent * 100)}%`,
      !hasRealData ? `⚠ LOW DATA WARNING: This account has very little performance data. Scores are based on setup signals, not conversion history.` : null,
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

  // ── Product + pricing context (all ecommerce accounts — not just Shopping/PMax) ─
  let productContext = "";
  if (account.googleAdsId && !isLeadGen) {
    try {
      const [productData, mcIds] = await Promise.all([
        fetchProductPerformance(account.googleAdsId, ctx.orgId).catch(() => null),
        getMerchantCenterIds(account.googleAdsId, ctx.orgId).catch(() => [] as string[]),
      ]);

      // Price competitiveness — use first Merchant Center ID
      let priceRows: { itemId: string; title: string; priceDiffPercent: number; status: string; effectivePriceMicros: number; benchmarkMicros: number; currencyCode: string }[] = [];
      if (mcIds.length > 0) {
        try {
          const priceData = await fetchPriceCompetitiveness(mcIds[0], ctx.orgId);
          priceRows = priceData.products ?? [];
        } catch { /* non-fatal */ }
      }

      if (productData?.products?.length) {
        const curr = account.currency === "EUR" ? "€" : account.currency === "GBP" ? "£" : "$";
        const priceMap = new Map(priceRows.map(p => [p.itemId, p]));

        // Top products by revenue
        const topByRevenue = [...productData.products]
          .filter(p => p.revenue > 0 || p.conversions > 0)
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 8);

        // Products with spend but zero conversions
        const noConv = [...productData.products]
          .filter(p => p.cost > 20 && p.conversions === 0)
          .sort((a, b) => b.cost - a.cost)
          .slice(0, 5);

        const formatProduct = (p: typeof productData.products[0]) => {
          const pc = priceMap.get(p.itemId);
          const priceNote = pc
            ? ` | price ${pc.priceDiffPercent > 0 ? "+" : ""}${pc.priceDiffPercent.toFixed(0)}% vs market (${pc.status})`
            : "";
          const eff = productData.roas > 0 ? ` | ROAS ${p.roas.toFixed(1)}x` : "";
          return `  - ${p.title || p.itemId}: ${p.conversions.toFixed(0)} sales, ${curr}${Math.round(p.revenue)} rev, ${curr}${Math.round(p.cost)} spend${eff}, CTR ${(p.ctr * 100).toFixed(1)}%${priceNote}`;
        };

        const lines = [`\nPRODUCT PERFORMANCE (last 30 days, ${productData.products.length} total products):`];
        lines.push(`Account ROAS: ${productData.roas.toFixed(2)}x | Total revenue: ${curr}${Math.round(productData.totalRevenue)} | Total spend: ${curr}${Math.round(productData.totalCost)}`);

        if (topByRevenue.length > 0) {
          lines.push(`\nTop revenue-generating products:`);
          topByRevenue.forEach(p => lines.push(formatProduct(p)));
        }

        if (noConv.length > 0) {
          lines.push(`\nProducts spending budget with zero conversions (consider excluding or reviewing pricing):`);
          noConv.forEach(p => {
            const pc = priceMap.get(p.itemId);
            const priceNote = pc ? ` | price ${pc.priceDiffPercent > 0 ? "+" : ""}${pc.priceDiffPercent.toFixed(0)}% vs market` : "";
            lines.push(`  - ${p.title || p.itemId}: ${curr}${Math.round(p.cost)} spent, ${p.clicks} clicks, 0 sales${priceNote}`);
          });
        }

        // Overall price competitiveness summary
        if (priceRows.length > 0) {
          const wellAbove = priceRows.filter(p => p.status === "well_above").length;
          const above     = priceRows.filter(p => p.status === "above").length;
          const below     = priceRows.filter(p => p.status === "below" || p.status === "competitive").length;
          lines.push(`\nPrice competitiveness (${priceRows.length} products with benchmark data): ${wellAbove} well above market, ${above} above market, ${below} competitive/below market`);
        }

        productContext = lines.join("\n");
      }
    } catch { /* non-fatal — intelligence still runs without product data */ }
  }

  const accountTypeNote = isLeadGen
    ? `ACCOUNT TYPE: Lead generation (${account.businessModel ?? "service/lead gen"}). This is NOT an ecommerce account. Do not mention ROAS, product feeds, or purchase revenue. Focus on: CPL vs target, lead volume, lead quality, form CVR, offline conversion import status, search intent quality, funnel handoff to sales team.`
    : isShoppingAccount
    ? `ACCOUNT TYPE: Ecommerce — Shopping/Performance Max (feed-based). Do NOT mention Quality Score. Focus on: product-level ROAS, feed titles, product labels (Heroes/Sidekicks/Zombies), price vs market benchmark, IS lost to rank (bid), zero-conversion products.`
    : `ACCOUNT TYPE: Ecommerce — Search-driven (runs Search campaigns for an online store). This IS a revenue-focused ecommerce account. Focus on: actual ROAS vs target ROAS, product-level performance, pricing vs competitors, CVR on product landing pages, search term hygiene, and keyword intent alignment with buyer stage. Quality Score is relevant but secondary to ROAS and conversion outcomes.`;

  const dataWarning = !hasRealData
    ? `\n⚠ DATA WARNING: This account has very limited performance history (${dataAge != null ? `scored ${dataAge} days ago` : "recently scored"}). The scores reflect setup quality, not conversion outcomes. Do NOT fabricate performance trends. Instead, describe what the setup signals suggest and what to watch for as data accumulates.`
    : "";

  const governingScore = Math.round(
    snapshot.governingConstraint === "MEASUREMENT" ? snapshot.scoreMeasurement :
    snapshot.governingConstraint === "TRAFFIC"     ? snapshot.scoreTraffic     :
    snapshot.governingConstraint === "CONVERSION"  ? snapshot.scoreConversion  :
    snapshot.governingConstraint === "FUNNEL"      ? snapshot.scoreFunnel      :
    snapshot.scoreEconomics
  );

  const prompt = `ACCOUNT: ${account.name}
INDUSTRY: ${account.industry ?? "not set"} | CURRENCY: ${account.currency}
${accountTypeNote}
${dataWarning}

GOVERNING CONSTRAINT: ${governing} — score ${governingScore}/100

BUCKET SCORES:
${bucketBlock}

LIVE METRICS:
${metricsBlock || "insufficient data"}

TARGETS: ${targetsBlock}
${clientBrief}${productContext}${notionContext}${slackContext}

---

Produce a specialist briefing using EXACTLY this structure:

## [Constraint] — [one-line diagnosis that names the specific problem, not just the bucket]

**What the data shows**
Two or three sentences. Cite actual numbers from the metrics above. No filler. State what is happening, not what could be happening.

**Why this is the constraint**
One or two sentences. Explain the mechanism: how does this specific constraint block the downstream result (revenue / conversions)? Be mechanistic, not generic.

**Root cause**
One sentence. Name the most likely specific cause given this account's data. Cross-reference account type, business model, and metrics. If the data is ambiguous, name the two most likely causes and which signal would distinguish them.

**Actions this week**
Numbered list. Each action must be:
- Specific enough that a junior specialist can execute it without asking a follow-up question
- Tied to the agency's actual toolset and doctrine (PMax feed-only, ProductHero labels, feed titles, search term exclusions, etc.)
- Ordered by priority — the action that unlocks the most is first
Maximum 3 actions. If you can only justify 1 or 2, write 1 or 2.

**Watch**
One sentence: which metric to check in 7 days, and what threshold means the fix is working vs. not working.

${slackContext ? "If Slack messages are provided: before writing actions, check whether any team change in the last 14 days correlates with a metric shift. If yes, name it explicitly in Root cause.\n" : ""}
HARD RULES:
- Every number you cite must appear in the data provided above. Zero fabrication.
- Do not explain what the constraint framework is. Do not define terms. Write for someone who already knows Google Ads.
- For new accounts with no conversion history: actions must focus on setup and data collection, not performance optimisation.
- If a pattern from the agency doctrine applies, apply it and name the conclusion directly.
- BUDGET INCREASE RULE: NEVER recommend increasing budget if actual ROAS is below the target ROAS. Spending more money at a loss makes the situation worse. If IS lost to budget is high but ROAS is below target, the problem is efficiency — fix conversion rate, search term hygiene, or pricing FIRST. Only recommend a budget increase when actual ROAS ≥ target ROAS AND budget utilisation is at 100%.
${isLeadGen ? `- LEAD GEN RULES: Never mention ROAS, product feeds, Shopping, or ProductHero labels. Focus on CPL vs target, lead volume, lead quality, form CVR, search intent quality, offline conversion import.
- If offline conversion import is NOT active: this is always action #1 — without it, the account is optimising for form fills, not actual revenue, and the AI has no signal on lead quality.
- If CPL is above target: diagnose whether it's a volume problem (not enough clicks → bid/budget) or a quality problem (clicks not converting → landing page, form UX, keyword intent mismatch).
- Lead quality below par: recommend reviewing which search terms are generating leads and whether they match the actual buyer profile. Suggest adding negative keywords for low-intent queries.
- Always address the full funnel: clicks → form CVR → lead quality → lead-to-sale rate. A high form CVR with low lead-to-sale rate means the traffic is unqualified, not the landing page.`
: `- ECOMMERCE RULES: For Shopping/PMax, never mention Quality Score.
- If product data is available: NAME specific products in your actions. "Your top 3 revenue products are X, Y, Z — but X and Y are priced 18% above market. Dropping their price by 10% could unlock more volume given their existing click traction." That is the required level of specificity.
- If price competitiveness data shows products above market: quantify the gap and name the products. Do not speak in generalities.
- If products are spending with zero conversions: name them and give a specific recommendation (exclude, price review, or landing page check).`}`;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const aiStream = await client.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 1200,
          system: isLeadGen
            ? `You are the senior lead generation Google Ads specialist at a Dutch performance agency. You have deep expertise in B2B and B2C lead gen campaigns — search intent mapping, CPL optimisation, lead quality vs volume trade-offs, offline conversion tracking, CRM integration, and funnel handoff.

You think like a revenue operations expert: you don't just care about leads, you care about leads that turn into clients. You diagnose the full funnel — from keyword intent to form submission to sales outcome.

You write for understudies. Your brief tells a junior specialist exactly what to do this week: which campaigns to adjust, which keywords to exclude, what to say to the client about their landing page or lead follow-up process, and what metric to watch in 7 days.

You never use generic advice. Every sentence cites actual numbers from the data provided. You never mention ROAS or product feeds — they are irrelevant for this account type.

${AGENCY_PHILOSOPHY}`
            : `You are the senior ecommerce Google Ads specialist at a Dutch performance agency. You have deep expertise in Shopping, Performance Max, feed optimisation, product segmentation (Heroes/Sidekicks/Zombies/Villains via ProductHero), conversion rate diagnosis, and scaling strategy.

You think like a diagnostician, not a commentator. You find the one thing blocking growth and prescribe the exact fix. You write for understudies — someone reading your brief should know exactly what to do this week without needing to ask a follow-up question.

You never explain what a metric is. You never say "you may want to consider". You never give advice that applies to every account equally. Everything you write is specific to THIS account's numbers and account type.

${AGENCY_PHILOSOPHY}`,
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
