/**
 * POST /api/accounts/[id]/chat
 *
 * Streaming chat endpoint for the senior Google Ads specialist assistant.
 * The AI receives full signal context — actual metric values, account targets,
 * business model, and all action recommendations — so it can give specific,
 * data-driven advice rather than generic optimization commentary.
 */
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { BUCKET_LABELS, BUCKET_DESCRIPTIONS, ConstraintSignals } from "@/lib/engine/types";
import { fetchDemographics, fetchSearchTermReport, fetchProductPerformance, DemographicRow, SearchTermRow } from "@/lib/integrations/google-ads";
import { fetchSlackMessages, formatSlackForContext } from "@/lib/integrations/slack";
import { getMerchantCenterIds, fetchPriceCompetitiveness } from "@/lib/integrations/merchant-center";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { AGENCY_PHILOSOPHY } from "@/lib/agencyPhilosophy";
import { searchKnowledge } from "@/lib/knowledge-search";

type Params = { params: Promise<{ id: string }> };

const client = new Anthropic();

// ─── Formatting helpers ────────────────────────────────────────────────────────

function pct(v: number, decimals = 1): string {
  return `${(v * 100).toFixed(decimals)}%`;
}
function money(v: number, currency = "EUR"): string {
  const sym = currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency === "USD" ? "$" : currency + " ";
  return `${sym}${v.toFixed(2)}`;
}
function score(v: number): string {
  return `${v.toFixed(1)}/10`;
}

// ─── Signal context builder ────────────────────────────────────────────────────

function buildSignalContext(signals: ConstraintSignals, currency: string): string {
  const m = signals.measurement;
  const t = signals.traffic;
  const c = signals.conversion;
  const f = signals.funnel;
  const e = signals.economics;

  const lines: string[] = ["LIVE SIGNAL DATA (actual metric values from last scoring run):"];

  // ── Measurement ──────────────────────────────────────────────────────────────
  lines.push("\n[Measurement]");
  lines.push(`  Conversion tracking active: ${m.conversionTrackingActive ? "YES" : "NO ⚠"}`);
  lines.push(`  Conversion actions: ${m.conversionActionsCount}`);
  lines.push(`  Enhanced conversions: ${m.hasEnhancedConversions ? "enabled" : "NOT enabled"}`);
  if (m.hasEnhancedConversions && m.enhancedConversionsDegraded) {
    lines.push(`  ⚠ Enhanced conversions degraded (conversion volume dropped ≥40%)`);
  }
  lines.push(`  Tag coverage: ${pct(m.tagCoveragePercent)}`);
  lines.push(`  Merchant Center linked: ${m.hasMerchantCenterLinked ? "yes" : "no"}`);
  lines.push(`  Attribution lag: ${m.dateLagDays.toFixed(1)} days`);

  // ── Traffic ──────────────────────────────────────────────────────────────────
  lines.push("\n[Traffic]");
  lines.push(`  Impression share: ${pct(t.searchImpressionShare)}`);
  lines.push(`  IS lost to budget: ${pct(t.impressionShareLost_budget)}`);
  lines.push(`  IS lost to rank: ${pct(t.impressionShareLost_rank)}`);
  lines.push(`  CTR (last 14d): ${pct(t.clickThroughRate, 2)}`);
  if (t.clickThroughRateBaseline > 0) {
    const trend = ((t.clickThroughRate / t.clickThroughRateBaseline) - 1) * 100;
    lines.push(`  CTR vs 6-month baseline: ${trend >= 0 ? "+" : ""}${trend.toFixed(1)}% (baseline: ${pct(t.clickThroughRateBaseline, 2)})`);
  }
  lines.push(`  Avg CPC: ${money(t.averageCpc, currency)}`);
  if (t.qualityScoreCount > 0) {
    lines.push(`  Avg Quality Score: ${score(t.qualityScoreAvg)} (across ${t.qualityScoreCount} keywords)`);
  } else {
    lines.push(`  Feed-only account (Shopping/PMax) — no keyword QS`);
    if (t.productDisapprovalRate > 0) {
      lines.push(`  Product disapproval rate: ${pct(t.productDisapprovalRate)}`);
    }
  }
  lines.push(`  Irrelevant query spend: ${pct(t.irrelevantQueryPercent)}`);

  // ── Conversion ───────────────────────────────────────────────────────────────
  lines.push("\n[Website Conversion]");
  lines.push(`  CVR (last 14d): ${pct(c.conversionRate, 2)}`);
  if (c.conversionRateBaseline > 0) {
    const trend = ((c.conversionRate / c.conversionRateBaseline) - 1) * 100;
    lines.push(`  CVR vs 6-month baseline: ${trend >= 0 ? "+" : ""}${trend.toFixed(1)}% (baseline: ${pct(c.conversionRateBaseline, 2)})`);
  }
  if (c.industryBenchmarkConversionRate > 0) {
    lines.push(`  Industry CVR benchmark: ${pct(c.industryBenchmarkConversionRate, 2)}`);
  }
  if (c.landingPageScore > 0) {
    lines.push(`  Landing page score: ${score(c.landingPageScore)}`);
  }
  if (c.mobileSpeedScore > 0) {
    lines.push(`  Mobile-friendly click rate: ${c.mobileSpeedScore}% (% of mobile clicks going to a mobile-optimised URL — source: Google Ads API. This is NOT a PageSpeed score; run PageSpeed Insights separately for actual load speed.)`);
  }
  if (c.bounceRateEstimate > 0) {
    lines.push(`  Bounce rate: ${pct(c.bounceRateEstimate)}`);
  }

  // ── Funnel ───────────────────────────────────────────────────────────────────
  lines.push("\n[Funnel]");
  if (f.targetCostPerLead > 0) {
    lines.push(`  CPL: ${money(f.costPerLead, currency)} (target: ${money(f.targetCostPerLead, currency)})`);
    const cplGap = ((f.costPerLead / f.targetCostPerLead) - 1) * 100;
    lines.push(`  CPL vs target: ${cplGap >= 0 ? "+" : ""}${cplGap.toFixed(1)}%`);
  } else if (f.costPerLead > 0) {
    lines.push(`  CPL: ${money(f.costPerLead, currency)} (no target set)`);
  }
  if (f.leadToSaleRate > 0) {
    lines.push(`  Lead-to-sale rate: ${pct(f.leadToSaleRate)}`);
  }
  if (f.averageLeadQualityScore > 0) {
    lines.push(`  Lead quality score: ${score(f.averageLeadQualityScore)}`);
  }
  lines.push(`  Offline conversion import: ${f.offlineConversionImportActive ? "active" : "not active"}`);

  // ── Economics ────────────────────────────────────────────────────────────────
  lines.push("\n[Business Economics]");
  if (e.targetRoas > 0) {
    lines.push(`  ROAS: ${e.actualRoas.toFixed(2)}x (target: ${e.targetRoas.toFixed(2)}x${e.actualRoasBaseline > 0 ? `, 6-month baseline: ${e.actualRoasBaseline.toFixed(2)}x` : ""})`);
    const roasGap = ((e.actualRoas / e.targetRoas) - 1) * 100;
    lines.push(`  ROAS vs target: ${roasGap >= 0 ? "+" : ""}${roasGap.toFixed(1)}%`);
  } else if (e.actualRoas > 0) {
    lines.push(`  ROAS: ${e.actualRoas.toFixed(2)}x (no target set${e.actualRoasBaseline > 0 ? `, 6-month baseline: ${e.actualRoasBaseline.toFixed(2)}x` : ""})`);
  }
  if (e.targetCpa > 0 && e.actualCpa > 0) {
    lines.push(`  CPA: ${money(e.actualCpa, currency)} (target: ${money(e.targetCpa, currency)}${e.actualCpaBaseline > 0 ? `, baseline: ${money(e.actualCpaBaseline, currency)}` : ""})`);
    const cpaGap = ((e.actualCpa / e.targetCpa) - 1) * 100;
    lines.push(`  CPA vs target: ${cpaGap >= 0 ? "+" : ""}${cpaGap.toFixed(1)}%`);
  }
  if (e.grossMarginPercent > 0) {
    const breakEven = 1 / e.grossMarginPercent;
    lines.push(`  Gross margin: ${pct(e.grossMarginPercent)} (break-even ROAS: ${breakEven.toFixed(2)}x)`);
  }
  if (e.avgOrderValue > 0) {
    lines.push(`  Avg order value: ${money(e.avgOrderValue, currency)}`);
  }
  if (e.ltv > 0) {
    lines.push(`  Customer LTV: ${money(e.ltv, currency)}`);
  }
  lines.push(`  Budget utilisation: ${pct(e.budgetUtilizationPercent)}`);

  return lines.join("\n");
}

// ─── System prompt builder ─────────────────────────────────────────────────────

function buildDemographicsContext(rows: DemographicRow[], currency: string): string {
  if (rows.length === 0) return "";
  const lines = ["\nDEMOGRAPHICS (last 30 days):"];

  const totalCost = rows.filter(r => r.dimension === "device").reduce((s, r) => s + r.costMicros, 0);
  const fmt = (r: DemographicRow) => {
    const costEur  = (r.costMicros / 1_000_000).toFixed(2);
    const ctr      = r.impressions > 0 ? ((r.clicks / r.impressions) * 100).toFixed(2) : "0";
    const cvr      = r.clicks > 0 ? ((r.conversions / r.clicks) * 100).toFixed(2) : "0";
    const costShare = totalCost > 0 ? ((r.costMicros / totalCost) * 100).toFixed(0) : "?";
    const roas     = r.costMicros > 0 && r.convValue > 0
      ? ` ROAS: ${(r.convValue / (r.costMicros / 1_000_000)).toFixed(2)}x`
      : "";
    return `  ${r.label.replace("AGE_RANGE_", "").replace("_", "–")}: spend ${costShare}% (${money(parseFloat(costEur), currency)}), CTR ${ctr}%, CVR ${cvr}%, conv ${r.conversions.toFixed(1)}${roas}`;
  };

  // UNKNOWN = Google couldn't determine the dimension (common for PMax / broad match).
  // It's not actionable so exclude it from the context — the specialist knows it exists.
  const SKIP = new Set(["UNKNOWN", "UNDETERMINED", "UNSPECIFIED"]);
  const known = (r: DemographicRow) => !SKIP.has(r.label);

  const devices = rows.filter(r => r.dimension === "device" && known(r)).sort((a, b) => b.costMicros - a.costMicros);
  const ages    = rows.filter(r => r.dimension === "age"    && known(r)).sort((a, b) => b.costMicros - a.costMicros);
  const genders = rows.filter(r => r.dimension === "gender" && known(r)).sort((a, b) => b.costMicros - a.costMicros);

  // Note for the model: UNKNOWN entries are omitted (expected for PMax/broad)
  lines.push("(UNKNOWN entries omitted — normal for PMax and broad match campaigns)");

  if (devices.length) { lines.push("Device:"); devices.forEach(r => lines.push(fmt(r))); }
  if (ages.length)    { lines.push("Age:"); ages.forEach(r => lines.push(fmt(r))); }
  if (genders.length) { lines.push("Gender:"); genders.forEach(r => lines.push(fmt(r))); }

  return lines.join("\n");
}

function buildSearchTermContext(rows: SearchTermRow[], currency: string): string {
  if (rows.length === 0) return "";
  const excludes = rows.filter(r => r.recommendation === "EXCLUDE").slice(0, 15);
  const watches  = rows.filter(r => r.recommendation === "WATCH").slice(0, 10);
  const lines    = ["\nSEARCH TERMS (last 90 days — top issues):"];

  if (excludes.length) {
    lines.push(`EXCLUDE candidates (0 conv, high spend):`);
    excludes.forEach(r => {
      const cost = r.source === "search" ? ` ${money(r.costEur, currency)}` : ` ${r.clicks} clicks`;
      lines.push(`  "${r.searchTerm}" [${r.campaignName}]${cost}`);
    });
  }
  if (watches.length) {
    lines.push(`WATCH (0 conv, accumulating spend):`);
    watches.forEach(r => {
      const cost = r.source === "search" ? ` ${money(r.costEur, currency)}` : ` ${r.clicks} clicks`;
      lines.push(`  "${r.searchTerm}" [${r.campaignName}]${cost}`);
    });
  }
  if (excludes.length === 0 && watches.length === 0) {
    lines.push("  No high-waste search terms detected.");
  }
  return lines.join("\n");
}

function buildSystemPrompt(params: {
  accountName:         string;
  currency:            string;
  industry:            string | null;
  country:             string | null;
  businessModel:       string | null;
  monthlyBudget:       number | null;
  targetRoas:          number | null;
  targetCpa:           number | null;
  grossMarginPercent:  number | null;
  governingConstraint: string;
  constraintReason:    string;
  bucketScores:        Record<string, number>;
  allActions:          Array<{ title: string; description: string; impact: string; effort: string; bucket: string }>;
  signals:             ConstraintSignals | null;
  demographics:        DemographicRow[];
  searchTerms:         SearchTermRow[];
  clientContext:       string | null;
  sopContext:          string;
  notionContext:       string;
  slackContext:        string;
  correctionContext:   string;
  globalPatternContext: string;
  productContext:      string;
  kbContext:           string;
  isLeadGen:           boolean;
  isShoppingAccount:   boolean;
}): string {
  const {
    accountName, currency, industry, country, businessModel, monthlyBudget,
    targetRoas, targetCpa, grossMarginPercent,
    governingConstraint, constraintReason, bucketScores, allActions, signals,
    demographics, searchTerms,
    clientContext, sopContext, notionContext, slackContext, correctionContext, globalPatternContext,
    productContext, kbContext, isLeadGen, isShoppingAccount,
  } = params;

  const bucketSummary = Object.entries(bucketScores)
    .map(([bucket, score]) => {
      const label = BUCKET_LABELS[bucket as keyof typeof BUCKET_LABELS] ?? bucket;
      const desc  = BUCKET_DESCRIPTIONS[bucket as keyof typeof BUCKET_DESCRIPTIONS] ?? "";
      const bar   = score >= 70 ? "●●●" : score >= 45 ? "●●○" : "●○○";
      return `  ${bar} ${label} (${desc}): ${Math.round(score)}/100`;
    })
    .join("\n");

  const actionSummary = allActions
    .map((a, i) => `  ${i + 1}. [${a.impact} impact · ${a.bucket}] ${a.title}\n     ${a.description}`)
    .join("\n\n");

  const businessModelLabel: Record<string, string> = {
    ecommerce: "Ecommerce",
    dtc:       "Direct-to-consumer (DTC)",
    dropship:  "Ecommerce (dropshipping fulfilment model — retailer, not manufacturer)",
    lead_gen:  "Lead generation",
    service:   "Service / lead generation",
    saas:      "SaaS",
  };
  const modelLabel = businessModel ? (businessModelLabel[businessModel] ?? businessModel) : null;

  const accountMeta = [
    industry     && `Industry: ${industry}`,
    country      && `Market: ${country}`,
    modelLabel   && `Business model: ${modelLabel}`,
    currency     && `Currency: ${currency}`,
    monthlyBudget && `Agreed monthly budget: ${money(monthlyBudget, currency)} (intentionally set by the agency — IS lost to budget is expected and not a problem to escalate)`,
    targetRoas   && `ROAS target: ${targetRoas.toFixed(2)}x`,
    targetCpa    && `CPA target: ${money(targetCpa, currency)}`,
    grossMarginPercent && `Gross margin: ${pct(grossMarginPercent)}`,
  ].filter(Boolean).join("\n");

  const accountTypeNote = isLeadGen
    ? `ACCOUNT TYPE: Lead generation (${modelLabel ?? "service/lead gen"}). This is NOT an ecommerce account. Do not mention ROAS, product feeds, or purchase revenue. Focus on: CPL vs target, lead volume, lead quality, form CVR, offline conversion import status, search intent quality, funnel handoff to sales team.`
    : isShoppingAccount
    ? `ACCOUNT TYPE: Ecommerce — Shopping/Performance Max (feed-based). Do NOT mention Quality Score. Focus on: product-level ROAS, feed titles, product labels (Heroes/Sidekicks/Zombies), price vs market benchmark, IS lost to rank (bid), zero-conversion products.`
    : `ACCOUNT TYPE: Ecommerce — Search-driven (runs Search campaigns for an online store). This IS a revenue-focused ecommerce account. Focus on: actual ROAS vs target ROAS, product-level performance, pricing vs competitors, CVR on product landing pages, search term hygiene, and keyword intent alignment with buyer stage. Quality Score is relevant but secondary to ROAS and conversion outcomes.`;

  const signalContext = signals ? "\n\n" + buildSignalContext(signals, currency) : "";
  const demoContext   = buildDemographicsContext(demographics, currency);
  const stContext     = buildSearchTermContext(searchTerms, currency);
  const clientBriefSection    = clientContext        ? `\n\nCLIENT BRIEF:\n${clientContext}` : "";
  const sopSection            = sopContext           ? `\n\n${sopContext}` : "";
  const notionSection         = notionContext        ? `\n\n${notionContext}` : "";
  const slackSection          = slackContext         ? `\n\n${slackContext}` : "";
  const correctionSection     = correctionContext    ? `\n\n${correctionContext}` : "";
  const globalPatternSection  = globalPatternContext ? `\n\n${globalPatternContext}` : "";
  const productSection        = productContext       ? `\n\n${productContext}` : "";
  const kbSection             = kbContext            ? `\n\n${kbContext}` : "";

  return `You are an expert senior Google Ads specialist embedded in an agency performance platform. You have full access to this account's data — it was fetched directly from Google Ads API and Merchant Center moments before this conversation. Never say you lack access to Google Ads data; everything you need is already provided below.

${AGENCY_PHILOSOPHY}

ACCOUNT: ${accountName}
${accountMeta}
${accountTypeNote}

DATA SOURCE: All metrics below are pulled live from this account's Google Ads API. You have the actual numbers — use them. If a specific dimension isn't listed (e.g. a specific campaign's day-parting), say you don't have that level of detail in the current context rather than saying you have no Google Ads access.

CONSTRAINT FRAMEWORK:
Accounts are systems with one governing constraint at any time. Fix the constraint first, then re-score. The sequence is: Measurement → Traffic → Website Conversion → Funnel → Business Economics. Fixing a downstream issue while an upstream constraint exists wastes time.

CURRENT GOVERNING CONSTRAINT: ${BUCKET_LABELS[governingConstraint as keyof typeof BUCKET_LABELS] ?? governingConstraint}
Why: ${constraintReason}

BUCKET HEALTH:
${bucketSummary}

RECOMMENDED ACTIONS (prioritised):
${actionSummary}
${signalContext}${demoContext}${stContext}${productSection}${clientBriefSection}${sopSection}

YOUR BEHAVIOUR:
- You have real account data. Use specific numbers in every response: "CTR dropped from 2.8% to 1.1%" not "CTR is low".
- If a metric isn't in the data above, say "I don't have that breakdown in the current context" — never say you lack Google Ads access.
- Anchor every answer to the governing constraint unless the user explicitly asks about a different bucket.
- Flag client escalations clearly (website changes, CRM setup, offline conversion import).
- For Shopping/PMax: think feed quality, product segmentation, asset group performance — not keyword QS.
- Be direct. Skip preamble. One problem → one cause → one fix.
- FRAMING RULE: Refer to the client by their name or as "the account" / "the store". Never call them a "dropshipper".
- BUDGET INCREASE RULE: NEVER recommend increasing budget if actual ROAS is below the target ROAS.
- If product performance data is provided: NAME specific products in answers about revenue, ROAS, or pricing. Use the actual numbers.
- If price competitiveness data is provided: use it directly. Do NOT say "see the Products tab" — you already have the data.
- When Slack messages are provided: actively correlate dates of team actions (budget changes, bid adjustments, campaign pauses) with metric shifts. If a metric deteriorated 2–5 days after a noted change, flag it explicitly as the likely cause and recommend a response.
- When Knowledge Base references are provided: ground your answer in the specific checklist items, SOP steps, or mental model framework cited. Quote the relevant rule or step when it directly answers the question.${notionSection}${slackSection}${correctionSection}${globalPatternSection}${kbSection}`;
}

// ─── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;
  const { message, sessionId, intelligenceBrief } = await req.json() as {
    message: string;
    sessionId?: string;
    intelligenceBrief?: string;
  };

  // Load everything in parallel
  const [account, sops, notionConn, slackConn, learnedPatterns] = await Promise.all([
    prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } }),
    prisma.agencySop.findMany({ where: { organizationId: ctx.orgId, isActive: true }, orderBy: { createdAt: "asc" } }),
    prisma.notionConnection.findUnique({
      where:   { organizationId: ctx.orgId },
      include: { pageCache: { orderBy: { fetchedAt: "desc" } } },
    }),
    prisma.slackConnection.findUnique({ where: { organizationId: ctx.orgId } }),
    prisma.learnedPattern.findMany({
      where: { isActive: true, OR: [{ orgId: ctx.orgId }, { orgId: null }] },
      orderBy: { seenCount: "desc" },
      take: 20,
    }).catch(() => [] as Awaited<ReturnType<typeof prisma.learnedPattern.findMany>>),
  ]);

  if (!account) {
    // Account either doesn't exist or belongs to a different org.
    // Return 400 with enough context to diagnose without exposing org internals.
    return NextResponse.json(
      { error: `Account not found (id=${id}). Try refreshing the page.` },
      { status: 400 }
    );
  }

  const snapshot = await prisma.constraintSnapshot.findFirst({
    where: { accountId: id },
    orderBy: { createdAt: "desc" },
    include: { actions: { orderBy: { impact: "asc" } } },
  });

  if (!snapshot) {
    return NextResponse.json(
      { error: "No constraint snapshot found. Run a scoring first." },
      { status: 400 }
    );
  }

  // Fetch Slack channel history if the account has one linked
  let slackContext = "";
  if (slackConn && account.slackChannelId && account.slackChannelName) {
    try {
      const msgs = await fetchSlackMessages(slackConn.botToken, account.slackChannelId, 90);
      slackContext = formatSlackForContext(msgs, account.slackChannelName);
    } catch { /* Slack fetch failure is non-fatal */ }
  }

  // Get or create chat session
  let session;
  if (sessionId) {
    session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: { messages: { orderBy: { createdAt: "asc" }, take: 30 } },
    });
  }
  if (!session) {
    session = await prisma.chatSession.create({
      data: { accountId: id },
      include: { messages: true },
    });
  }

  // Save user message
  await prisma.chatMessage.create({
    data: { sessionId: session.id, role: "user", content: message },
  });

  // Parse rawSignals
  let signals: ConstraintSignals | null = null;
  try {
    signals = JSON.parse(snapshot.rawSignals) as ConstraintSignals;
  } catch {
    // If parsing fails, continue without signal detail — prompt degrades gracefully
  }

  // Account type detection (mirrors intelligence route logic)
  const isLeadGen = account.businessModel === "lead_gen" || account.businessModel === "service"
    || (!account.businessModel && signals?.funnel?.costPerLead != null && signals.funnel.costPerLead > 0 && (signals?.economics?.actualRoas ?? 0) === 0);

  const isShoppingAccount = !isLeadGen && (signals?.traffic
    ? signals.traffic.qualityScoreCount === 0
    : account.businessModel === "ecommerce" || account.businessModel === "dtc" || account.businessModel === "dropship");

  // Fetch live demographics + search terms in parallel (non-blocking — fail gracefully)
  const googleAdsId = account.googleAdsId;
  const [demographics, searchTerms]: [DemographicRow[], SearchTermRow[]] = googleAdsId
    ? await Promise.all([
        fetchDemographics(googleAdsId, ctx.orgId).catch((): DemographicRow[] => []),
        fetchSearchTermReport(googleAdsId, ctx.orgId).catch((): SearchTermRow[] => []),
      ])
    : [[], []];

  // Fetch product performance + price competitiveness (ecommerce only, non-blocking)
  let productContext = "";
  if (googleAdsId && !isLeadGen) {
    try {
      const [productData, mcIds] = await Promise.race([
        Promise.all([
          fetchProductPerformance(googleAdsId, ctx.orgId).catch(() => null),
          getMerchantCenterIds(googleAdsId, ctx.orgId).catch(() => [] as string[]),
        ]),
        new Promise<[null, string[]]>((_, reject) => setTimeout(() => reject(new Error("product+MCC timed out")), 20_000)),
      ]);

      let priceRows: { itemId: string; priceDiffPercent: number; status: string }[] = [];
      if (mcIds.length > 0) {
        try {
          const priceData = await Promise.race([
            fetchPriceCompetitiveness(mcIds[0], ctx.orgId),
            new Promise<never>((_, reject) => setTimeout(() => reject(new Error("price comp timed out")), 10_000)),
          ]);
          priceRows = priceData.products ?? [];
        } catch { /* non-fatal */ }
      }

      if (productData?.products?.length) {
        const curr = account.currency === "EUR" ? "€" : account.currency === "GBP" ? "£" : "$";
        const priceMap = new Map(priceRows.map(p => [p.itemId, p]));

        const topByRevenue = [...productData.products]
          .filter(p => p.revenue > 0 || p.conversions > 0)
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 8);

        const noConv = [...productData.products]
          .filter(p => p.cost > 20 && p.conversions === 0)
          .sort((a, b) => b.cost - a.cost)
          .slice(0, 5);

        const formatProduct = (p: typeof productData.products[0]) => {
          const pc = priceMap.get(p.itemId);
          const priceNote = pc ? ` | price ${pc.priceDiffPercent > 0 ? "+" : ""}${pc.priceDiffPercent.toFixed(0)}% vs market (${pc.status})` : "";
          const eff = productData.roas > 0 ? ` | ROAS ${p.roas.toFixed(1)}x` : "";
          return `  - ${p.title || p.itemId}: ${p.conversions.toFixed(0)} sales, ${curr}${Math.round(p.revenue)} rev, ${curr}${Math.round(p.cost)} spend${eff}, CTR ${(p.ctr * 100).toFixed(1)}%${priceNote}`;
        };

        const lines = [`PRODUCT PERFORMANCE (last 30 days, ${productData.products.length} total products):`];
        lines.push(`Account ROAS: ${productData.roas.toFixed(2)}x | Total revenue: ${curr}${Math.round(productData.totalRevenue)} | Total spend: ${curr}${Math.round(productData.totalCost)}`);

        if (topByRevenue.length > 0) {
          lines.push(`\nTop revenue-generating products:`);
          topByRevenue.forEach(p => lines.push(formatProduct(p)));
        }

        if (noConv.length > 0) {
          lines.push(`\nProducts spending budget with zero conversions:`);
          noConv.forEach(p => {
            const pc = priceMap.get(p.itemId);
            const priceNote = pc ? ` | price ${pc.priceDiffPercent > 0 ? "+" : ""}${pc.priceDiffPercent.toFixed(0)}% vs market` : "";
            lines.push(`  - ${p.title || p.itemId}: ${curr}${Math.round(p.cost)} spent, ${p.clicks} clicks, 0 sales${priceNote}`);
          });
        }

        if (priceRows.length > 0) {
          const wellAbove = priceRows.filter(p => p.status === "well_above").length;
          const above     = priceRows.filter(p => p.status === "above").length;
          const below     = priceRows.filter(p => p.status === "below" || p.status === "competitive").length;
          lines.push(`\nPrice competitiveness (${priceRows.length} products with benchmark data): ${wellAbove} well above market, ${above} above market, ${below} competitive/below market`);
        }

        productContext = lines.join("\n");
      }
    } catch { /* non-fatal — chat still works without product data */ }
  }

  const bucketScores: Record<string, number> = {
    MEASUREMENT: snapshot.scoreMeasurement,
    TRAFFIC:     snapshot.scoreTraffic,
    CONVERSION:  snapshot.scoreConversion,
    FUNNEL:      snapshot.scoreFunnel,
    ECONOMICS:   snapshot.scoreEconomics,
  };

  const sopContext = sops.length > 0
    ? `AGENCY SOPs (always follow these):\n${sops.map(s => `--- ${s.title} ---\n${s.content}`).join("\n\n").slice(0, 4000)}`
    : "";

  // Notion knowledge base: pages the org has synced
  const notionContext = notionConn && notionConn.pageCache.length > 0
    ? `AGENCY KNOWLEDGE BASE (from Notion — treat as authoritative reference):\n` +
      notionConn.pageCache
        .map(p => `--- ${p.title} ---\n${p.content}`)
        .join("\n\n")
        .slice(0, 6000)
    : "";

  // Learned patterns: org-specific corrections + global patterns promoted from cross-org feedback
  const orgCorrections = await prisma.chatFeedback.findMany({
    where:   { orgId: ctx.orgId, rating: "down", correction: { not: null } },
    orderBy: { createdAt: "desc" },
    take:    10,
  });
  const correctionContext = orgCorrections.length > 0
    ? `TEAM FEEDBACK — PREVIOUSLY CORRECTED PATTERNS (prioritise these):\n` +
      orgCorrections
        .map(f => `- ${f.questionText ? `Q: "${f.questionText.slice(0, 80)}" → ` : ""}Correction: ${f.correction}`)
        .join("\n")
    : "";
  const globalPatternContext = learnedPatterns.length > 0
    ? `LEARNED PATTERNS (validated across accounts):\n` +
      learnedPatterns.map(p => `- [${p.questionType}] ${p.pattern}`).join("\n")
    : "";

  // Search the PPC Mastery KB for chunks relevant to this message + governing constraint
  const kbContext = searchKnowledge(message, snapshot.governingConstraint);

  const systemPrompt = buildSystemPrompt({
    accountName:         account.name,
    currency:            account.currency,
    industry:            account.industry ?? null,
    country:             account.country ?? null,
    businessModel:       account.businessModel ?? null,
    monthlyBudget:       account.monthlyBudget ?? null,
    targetRoas:          account.targetRoas ?? null,
    targetCpa:           account.targetCpa ?? null,
    grossMarginPercent:  account.grossMarginPercent ?? null,
    governingConstraint: snapshot.governingConstraint,
    constraintReason:    snapshot.constraintReason,
    bucketScores,
    allActions: snapshot.actions.map(a => ({
      title:       a.title,
      description: a.description,
      impact:      a.impact,
      effort:      a.effort,
      bucket:      a.bucket,
    })),
    signals,
    demographics,
    searchTerms,
    clientContext:        account.clientContext ?? null,
    sopContext,
    notionContext,
    slackContext,
    correctionContext,
    globalPatternContext,
    productContext,
    kbContext,
    isLeadGen,
    isShoppingAccount,
  });

  const history = (session.messages ?? []).map(m => ({
    role:    m.role as "user" | "assistant",
    content: m.content,
  }));

  // If this is the first message in a new session and the user came from the Intelligence tab,
  // prepend the brief as a synthetic assistant turn so the AI can answer follow-up questions
  // that reference specific conclusions from the brief (e.g. "explain action 1 more").
  if (intelligenceBrief && history.length === 0) {
    history.unshift({ role: "assistant", content: intelligenceBrief });
  }

  // Stream response
  const encoder = new TextEncoder();
  let fullResponse = "";

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = await client.messages.stream({
          model:      "claude-sonnet-4-6",
          max_tokens: 2048,
          system:     systemPrompt,
          messages: [
            ...history,
            { role: "user", content: message },
          ],
        });

        for await (const chunk of anthropicStream) {
          if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
            const text = chunk.delta.text;
            fullResponse += text;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
          }
        }

        const assistantMessage = await prisma.chatMessage.create({
          data: { sessionId: session!.id, role: "assistant", content: fullResponse },
        });

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ done: true, sessionId: session!.id, messageId: assistantMessage.id })}\n\n`)
        );
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
