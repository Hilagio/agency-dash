/**
 * Live data tools the in-conversation agent (§agent) calls on demand — so it
 * fetches what it needs itself (impression share, campaign structure, search
 * terms, Shopify) instead of asking the account manager to look it up. It only
 * asks a human when the data genuinely isn't reachable through these tools.
 */
import { prisma } from "@/lib/db";
import { fetchImpressionShare, fetchCampaignOverview, fetchChangeHistory, fetchDemographics, fetchQualityScore, fetchAdStrength, fetchGeoPerformance } from "@/lib/integrations/google-ads";
import { fetchSlackMessages, formatSlackForContext } from "@/lib/integrations/slack";
import { getMerchantCenterIds, fetchMerchantCenterHealth, fetchPriceCompetitiveness } from "@/lib/integrations/merchant-center";
import { fetchGoogleShopping } from "@/lib/integrations/scraperapi-shopping";
import { lookupPlaybook } from "@/lib/diagnostics/agency-playbook";

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export interface AgentAccount { id: string; googleAdsId: string; organizationId: string; currency: string; merchantCenterId?: string | null }

const pct = (v: number | null) => (v == null ? "—" : `${Math.round(v * 100)}%`);
const clampDays = (d: unknown) => { const n = Number(d); return Number.isFinite(n) ? Math.min(90, Math.max(3, Math.round(n))) : 30; };
const CUR: Record<string, string> = { EUR: "€", USD: "$", GBP: "£", CZK: "Kč", PLN: "zł" };

// Tool definitions handed to the model (custom tools alongside the PPC OS MCP).
export const AGENT_TOOLS = [
  {
    name: "run_healthcheck",
    description: "Run the account's FUNDAMENTALS in priority order and return pass / ⚠ / fail for each: (1) tracking trustworthy? (2) Merchant Center / feed not suspended & serving? (3) is it actually spending? (4) are real sales/conversions coming in? (5) is efficiency above break-even? Do this FIRST on any 'what's wrong / is it healthy / diagnose / any risks' question — it confirms the important things are genuinely working before you theorise, and the first ✗ (upstream) is the governing constraint to fix before anything downstream. Cheap and fast; lead your read with it.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "get_impression_share",
    description: "Live from Google Ads: per-campaign impression share, share LOST TO BUDGET, and share lost to rank over the last N days. Use this to answer 'are we limited by budget / is there headroom to scale?' — high budget-lost % means raising budget will win more volume. Only Search/Shopping report search IS; Performance Max may return blanks.",
    input_schema: { type: "object", properties: { days: { type: "number", description: "Look-back window in days (default 30)." } } },
  },
  {
    name: "get_campaign_overview",
    description: "Live from Google Ads: each campaign's type (Search/Shopping/Performance Max/…), status, daily budget, spend, conversions and value over the last N days. Use to see the account structure — e.g. whether there's a feed-only Performance Max, which campaigns carry the spend, and whether budgets are the constraint.",
    input_schema: { type: "object", properties: { days: { type: "number", description: "Look-back window in days (default 30)." } } },
  },
  {
    name: "get_segments",
    description: "Segment the account so you're not reading a blended average (our doctrine: NEVER trust a blended number). Returns DEVICE split (spend / CVR / ROAS per device — a mobile CVR far below desktop is a mobile-UX/checkout tell) and BRAND vs NON-BRAND split (brand traffic inflates ROAS; growth performance is the non-brand number). Use whenever a blended metric looks fine but you suspect it's hiding a problem, or before judging real performance / scaling. Brand split comes from Search terms, so it's directional on PMax/Shopping-led accounts.",
    input_schema: { type: "object", properties: { days: { type: "number", description: "Look-back for the brand split (default 30). Device is a fixed 30d." } } },
  },
  {
    name: "get_price_competitiveness",
    description: "Merchant Center's account-wide price BENCHMARK (each product's price vs competitors, across the whole feed). Good for 'are we broadly over/under market?'. Needs a linked Merchant Center account, the 'content' scope, AND the Merchant API GCP project registered — if that's not set up it returns nothing, so for a SINGLE product's live competitor pricing prefer get_shopping_competitors (which needs none of that).",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "get_shopping_competitors",
    description: "Live Google Shopping scan for ONE product/search term — the real ranked listings a shopper sees: which shops rank, at what price, and the min/median/max across sellers. THIS is the tool for 'how does our price compare to competitors for [product]?', 'who else sells this and for how much?', 'are we the most expensive on this SKU?'. Works with no Google API and no Merchant Center registration (it reads Shopping directly), so use it instead of get_price_competitiveness for a specific product. Pass the product title as the query (trim overly-specific feed titles); optionally pass the client's shop/brand to locate where they rank.",
    input_schema: { type: "object", properties: {
      query: { type: "string", description: "The product or search term to scan on Google Shopping (usually the product title, trimmed if very specific)." },
      tld: { type: "string", description: "Google country edition: nl, be, de, fr, com, co.uk. Defaults to the account's market." },
      highlight: { type: "string", description: "Optional: the client's shop or brand name, to mark where they rank in the results." },
    }, required: ["query"] },
  },
  {
    name: "get_products",
    description: "Product-level ad performance. Answers 'which products are structurally underperforming?' — products with REAL spend but return below break-even (or zero conversions), sorted by spend, with the share of budget they're eating. In our doctrine a big underperformer share is a SEGMENTATION signal (recalibrate ProductHero thresholds), not just 'pause them'. Use for feed/Shopping/PMax accounts to find where the money leaks at product level.",
    input_schema: { type: "object", properties: { days: { type: "number", description: "Look-back window in days (default 30)." } } },
  },
  {
    name: "get_geo",
    description: "Performance by geographic location (country/region, resolved to names) — spend, clicks, conversions, ROAS. Use to spot a geo outperforming on little spend (shift budget there) or a country dragging the blended average (a margin/AOV question, or tighten targeting). Part of segmenting down before trusting a blended number.",
    input_schema: { type: "object", properties: { days: { type: "number", description: "Look-back window in days (default 30)." } } },
  },
  {
    name: "get_quality_score",
    description: "Quality Score components per keyword (Search only): expected CTR, ad relevance, landing-page experience, and the 1–10 score. The lead-gen rank check — if all three components are Below Average, Ad Rank is too low to enter the auction (rewrite RSAs, fix landing-page relevance). Not applicable to Shopping/PMax (feed-based, no keyword QS).",
    input_schema: { type: "object", properties: { days: { type: "number", description: "Look-back window in days (default 30)." } } },
  },
  {
    name: "get_ad_strength",
    description: "Responsive Search Ad strength (Poor/Average/Good/Excellent) and how many headlines/descriptions each ad actually uses. The 'the ad is the problem — build it out' check: most accounts run 3–4 headlines against a ceiling of 15; low ad strength with few assets means the creative is underbuilt. Search campaigns only.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "get_search_terms",
    description: "Top search terms by spend over the last N days (from the stored spine), with clicks, cost, and conversions. Use to spot wasted spend (high cost, zero conversions) and branded queries. Note: Performance Max search terms are limited by Google.",
    input_schema: { type: "object", properties: { days: { type: "number", description: "Look-back window in days (default 30)." } } },
  },
  {
    name: "get_shopify_data",
    description: "The account's real Shopify orders as ground truth: order count, revenue, and AOV for the window; a recent-vs-prior TREND for each (orders, revenue, AOV); a reconciliation of real orders against Google-Ads-attributed conversions for the same window; and, where per-product data exists, the top sellers plus which products are falling, rising, or newly emerging. Returns the numbers and deltas — you interpret them. Use it for 'are real sales dropping?', 'is it tracking or demand?', 'is AOV falling?', and 'which products carry the store / which are sliding?'. Per-product movement needs a live Shopify connection — a 'Sales over time' CSV gives order totals only, and the tool says so.",
    input_schema: { type: "object", properties: { days: { type: "number", description: "Look-back window in days (default 30)." } } },
  },
  {
    name: "get_merchant_center_status",
    description: "Live from Google Merchant Center: the feed's health — any ACCOUNT-LEVEL issues (suspension, misrepresentation, policy warning), how many products are approved vs disapproved vs pending, the top disapproval reasons by product count, and which countries/destinations are actually serving. Use this to answer feed / GMC questions YOURSELF — is the account suspended, are products disapproved, is a country (e.g. BE) not approved, is a dark feed-campaign caused by a serving/eligibility problem — instead of asking the team to open Merchant Center. Needs a linked Merchant Center account.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "get_change_history",
    description: "Live from Google Ads: who changed WHAT and WHEN in the account (budget edits, bid-strategy / target CPA-ROAS changes, campaign or ad-group pauses, new campaigns). This is the first thing to check when a metric swings on a specific date — line the change dates up against the metric change to find the cause instead of guessing. Google only retains ~30 days of history.",
    input_schema: { type: "object", properties: { days: { type: "number", description: "Look-back window in days (max 30, default 30)." } } },
  },
  {
    name: "get_slack_context",
    description: "The recent Slack conversation from THIS client's channel — where the team and often the client discuss off-platform events: a promo or sale, a price or checkout change, a payment-provider switch, a stockout, seasonality, 'we paused for the holidays'. Check this BEFORE asking the account manager an off-platform question — the answer is frequently already in the channel. Returns a clear note if no Slack channel is linked.",
    input_schema: { type: "object", properties: { days: { type: "number", description: "How far back to read the channel, in days (default 30)." } } },
  },
  {
    name: "consult_playbook",
    description: "OUR agency's Way of Work + playbook AND our full knowledge base — searchable together. The doctrine: the six principles (steer on POAS not ROAS; nine times out of ten it's NOT the ads; scale into demand not past it; concentration vs breadth; one change at a time; read leading signals), the signals we watch, how we build & scale, how we test DEMAND GEN, the exact DIAGNOSIS ORDER when something breaks (metric tree → decompose → overlay changes → buyability → canaries), the pattern library (what a specific IS/CTR/CVR/ROAS/budget/feed combination means), and product segmentation (Heroes/Sidekicks/Zombies/Villains). PLUS the knowledge base: ~90 step-by-step SOPs, ~34 mental models, ~20 checklists, guidelines and theory — so you can pull the exact PROCEDURE or CHECKLIST for a task, or the mental model behind a decision. Consult it when you hit a trigger and want our house stance or our documented method rather than generic advice. Pass the topic in plain words — a decision ('when to raise budget', 'brand conversion rate canary'), a pattern ('zero-conversion spend rot', 'tROAS spend flatlines'), or a task/procedure ('analyze search term reports', 'PMax ecommerce optimization cycle', 'budget allocation mental model', 'set up conversion tracking checklist'). Returns the best-matching section(s), each labelled by type ([SOP]/[Mental model]/[Checklist]/[Playbook]) — apply ONLY where it fits this account and what the data actually shows; method to reason with, not a script to force.",
    input_schema: { type: "object", properties: { topic: { type: "string", description: "What you're deciding, in plain words — the situation or pattern you want our stance on." } }, required: ["topic"] },
  },
] as const;

const LABELS: Record<string, string> = {
  run_healthcheck: "Running the fundamentals check…",
  get_impression_share: "Checking impression share in Google Ads…",
  get_campaign_overview: "Pulling the campaign structure from Google Ads…",
  get_segments: "Segmenting by device and brand vs non-brand…",
  get_price_competitiveness: "Checking product prices vs the market…",
  get_shopping_competitors: "Scanning Google Shopping for competitors & pricing…",
  get_products: "Finding the underperforming products…",
  get_geo: "Breaking performance down by location…",
  get_quality_score: "Reading Quality Score components…",
  get_ad_strength: "Checking ad strength & assets…",
  get_search_terms: "Reading the search terms…",
  get_shopify_data: "Checking the Shopify orders…",
  get_change_history: "Pulling the account change history from Google Ads…",
  get_merchant_center_status: "Checking Merchant Center feed health…",
  get_slack_context: "Reading the client's Slack channel…",
  consult_playbook: "Checking our agency playbook…",
};
export const toolStatusLabel = (name: string) => LABELS[name] ?? `Checking ${name.replace(/_/g, " ")}…`;

// Recognise the agency's own setup FROM THE DATA — so the agent gathers context
// by looking, not by asking the team basic things it can already see. Campaign
// names carry the ProductHero label segments (Heroes/Sidekicks/Zombies/Villains,
// or the HSZ/HS/H/S/Z/V shorthand); the channel tells us PMax feed-only; the
// bidding strategy tells us if a tROAS could be choking delivery. Each detected
// signal is a trigger that points at the matching house doctrine.
const tokensOf = (s: string) => s.toUpperCase().split(/[^A-Z0-9]+/).filter(Boolean);

function labelSegments(names: string[]): string[] {
  // Full words and combined tokens (HSZ/HS) are STRONG signals — a single one is
  // enough. Bare single letters (H/S/Z/V) are WEAK — a stray "Campaign V" would
  // false-trigger — so only trust them when at least two distinct ones co-occur
  // or a strong signal is already present (i.e. it really is the label scheme).
  const strong = new Set<string>();
  const weak = new Set<string>();
  for (const n of names) for (const t of tokensOf(n)) {
    if (t === "HERO" || t === "HEROES") strong.add("Heroes");
    else if (t === "SIDEKICK" || t === "SIDEKICKS") strong.add("Sidekicks");
    else if (t === "ZOMBIE" || t === "ZOMBIES") strong.add("Zombies");
    else if (t === "VILLAIN" || t === "VILLAINS") strong.add("Villains");
    else if (t === "HSZV" || t === "HSZ" || t === "HS") { strong.add("Heroes"); strong.add("Sidekicks"); strong.add("Zombies"); }
    else if (t === "H") weak.add("Heroes");
    else if (t === "S") weak.add("Sidekicks");
    else if (t === "Z") weak.add("Zombies");
    else if (t === "V") weak.add("Villains");
  }
  if (strong.size || weak.size >= 2) return [...new Set([...strong, ...weak])];
  return [...strong];
}

function detectSetup(rows: { campaign: string; channel: string; biddingStrategy: string }[]): string | null {
  const names = rows.map(r => r.campaign);
  const notes: string[] = [];

  const seg = labelSegments(names);
  if (seg.length) notes.push(`Runs the ProductHero / Flowboost Labelizer — campaigns named for label segments (${seg.join(", ")}). Performance is controlled at PRODUCT level via custom_label_0, so the segmentation doctrine applies: consult_playbook on "product segmentation" / "villain spend" if a segment's spend or ROAS looks off, before treating it as a generic campaign problem.`);

  if (names.some(n => tokensOf(n).includes("BRAND"))) notes.push(`Brand is isolated in its own campaign — brand traffic inflates ROAS, so read brand vs non-brand separately; don't trust a blended ROAS.`);

  const pmax = rows.filter(r => /PERFORMANCE_MAX/i.test(r.channel)).length;
  if (pmax) notes.push(`Performance Max is running (${pmax}) — in our structure PMax feed-only is the main growth driver; if it underperforms the cause is almost always feed quality/structure, not "switch to Standard Shopping".`);

  const troas = rows.filter(r => /TARGET_ROAS/i.test(r.biddingStrategy)).map(r => r.campaign);
  if (troas.length) notes.push(`Bidding: ${troas.length} campaign(s) on Target ROAS. If their spend is flatlining or stuck under budget, a too-high tROAS choking delivery is the FIRST thing to check (the most common self-inflicted wound) — consult_playbook on "tROAS spend flatlines".`);
  const tcpa = rows.filter(r => /TARGET_CPA/i.test(r.biddingStrategy)).length;
  if (tcpa) notes.push(`Bidding: ${tcpa} campaign(s) on Target CPA.`);

  if (!notes.length) return null;
  return `DETECTED SETUP — recognised from the account itself (use this as context; don't ask the team what you can already see):\n${notes.map(n => `- ${n}`).join("\n")}`;
}

// The fundamentals check — the Way of Work "foundation & truth" run as a
// sequence, upstream first. Confirms the important things are actually working
// (tracking → feed → spend → sales → efficiency) so the read starts from what's
// real, and the first ✗ is the governing constraint. Everything here is derived
// from real data; nothing is asserted that a check didn't return. Returned as
// structured checks so both the agent and the visible health panel use it.
export type VitalStatus = "ok" | "warn" | "fail" | "na";
export interface VitalCheck { key: string; label: string; status: VitalStatus; detail: string }
export interface VitalsResult { checks: VitalCheck[]; governing: string | null; summary: string }

export async function computeVitals(acc: AgentAccount): Promise<VitalsResult> {
  const cur = CUR[acc.currency] ?? `${acc.currency} `;
  const money = (n: number) => `${cur}${Math.round(n).toLocaleString("en-GB")}`;
  const day = (n: number) => { const d = new Date(); d.setUTCDate(d.getUTCDate() - n); return d.toISOString().slice(0, 10); };
  const d30 = day(30), d7 = day(7);

  const [account, m30, m7, o30, o7, orderRows] = await Promise.all([
    prisma.account.findUnique({ where: { id: acc.id }, select: { trackingStatus: true, roasFloor: true, grossMarginPercent: true } }),
    prisma.metricDaily.aggregate({ where: { accountId: acc.id, date: { gte: d30 } }, _sum: { spend: true, conversions: true, conversionValue: true } }),
    prisma.metricDaily.aggregate({ where: { accountId: acc.id, date: { gte: d7 } }, _sum: { spend: true, conversions: true } }),
    prisma.orderDaily.aggregate({ where: { accountId: acc.id, date: { gte: d30 } }, _sum: { orders: true, revenue: true } }),
    prisma.orderDaily.aggregate({ where: { accountId: acc.id, date: { gte: d7 } }, _sum: { orders: true, revenue: true } }),
    prisma.orderDaily.count({ where: { accountId: acc.id, date: { gte: d30 } } }),
  ]);

  const spend30 = m30._sum.spend ?? 0, spend7 = m7._sum.spend ?? 0;
  const conv30 = m30._sum.conversions ?? 0, conv7 = m7._sum.conversions ?? 0;
  const val30 = m30._sum.conversionValue ?? 0;
  const hasOrderData = orderRows > 0;
  const orders30 = o30._sum.orders ?? 0, orders7 = o7._sum.orders ?? 0, rev7 = o7._sum.revenue ?? 0;

  const checks: VitalCheck[] = [];
  const fails: string[] = [];
  const add = (key: string, label: string, status: VitalStatus, detail: string) => { checks.push({ key, label, status, detail }); if (status === "fail") fails.push(label); };

  // 1. TRACKING — can we trust the numbers at all?
  const reconNote = hasOrderData && orders30 > 0 && conv30 > orders30 * 1.5
    ? ` Reconciliation: Google shows ${conv30.toFixed(0)} conv/30d vs ${orders30} real orders — possible over-counting.` : "";
  if (account?.trackingStatus === "broken") add("tracking", "Tracking", "fail", "Flagged BROKEN — fix before trusting any number; every downstream read is unreliable until it is.");
  else if (account?.trackingStatus === "verified") add("tracking", "Tracking", "ok", `Confirmed working.${reconNote}`);
  else add("tracking", "Tracking", "warn", `Not confirmed — verify the primary conversion is a real purchase.${reconNote}`);

  // 2. MERCHANT CENTER / FEED — is Google even allowed to serve the products?
  // Bounded so a slow token-exchange / API call can't hang the whole check
  // (this powers the visible health strip and the opener's up-front pull).
  try {
    const timeout = new Promise<"__timeout__">(res => setTimeout(() => res("__timeout__"), 6000));
    const work = (async () => {
      const ids = await getMerchantCenterIds(acc.googleAdsId, acc.organizationId, acc.merchantCenterId ?? null);
      if (!ids.length) return null;
      return { ids, h: await fetchMerchantCenterHealth(ids[0], acc.organizationId) };
    })();
    const res = await Promise.race([work, timeout]);
    if (res === "__timeout__") add("merchant_center", "Merchant Center", "na", "Check timed out — open the account to see live feed status.");
    else if (res === null) add("merchant_center", "Merchant Center", "na", "No Merchant Center account linked.");
    else {
      const { h } = res;
      if (h.scopeOrAuthError) add("merchant_center", "Merchant Center", "warn", `Couldn't read it (${h.scopeOrAuthError.slice(0, 80)}).`);
      else if (h.accountIssues.length) add("merchant_center", "Merchant Center", "fail", `Account-level issue — ${h.accountIssues.map(i => i.title).join("; ")}. Can take the whole feed down.`);
      else {
        const tot = h.totals.active + h.totals.disapproved;
        const disPct = tot > 0 ? Math.round((h.totals.disapproved / tot) * 100) : 0;
        if (disPct >= 20) add("merchant_center", "Merchant Center", "warn", `No suspension, but ${h.totals.disapproved}/${tot} products disapproved (${disPct}%).`);
        else add("merchant_center", "Merchant Center", "ok", `No account-level issues; ${h.totals.active} products serving${h.totals.disapproved ? `, ${h.totals.disapproved} disapproved` : ""}.`);
      }
    }
  } catch { add("merchant_center", "Merchant Center", "na", "Couldn't reach Merchant Center."); }

  // 3. SPEND — is the account actually delivering?
  if (spend30 <= 0) add("spend", "Spend", "fail", "€0 in 30d — not delivering (paused, or blocked by billing/policy).");
  // Compare DAILY rates: last-7d/day vs 30d/day. Fires on a real partial collapse,
  // not only a total stoppage (spend7 is a 7-day total, spend30/30 is one day).
  else if (spend7 / 7 <= (spend30 / 30) * 0.2) add("spend", "Spend", "warn", `Spending ${money(spend30)}/30d but the last 7d (${money(spend7)}) has collapsed to a fraction of the run-rate — check serving/feed/budget.`);
  else add("spend", "Spend", "ok", `Delivering — ${money(spend30)}/30d, ${money(spend7)}/7d.`);

  // 4. SALES — is the money turning into orders?
  if (hasOrderData) {
    if (orders7 === 0 && spend7 > 0) add("sales", "Sales", "fail", "Spending but ZERO real orders in 7d — the classic checkout/site/stock break (clicks arriving, till closed).");
    else add("sales", "Sales", "ok", `${orders7} real orders/7d (${money(rev7)}); ${orders30} over 30d.`);
  } else {
    if (conv7 === 0 && spend7 > 0) add("sales", "Sales", "fail", "Spending but ZERO conversions in 7d (Google's count — no Shopify to confirm real orders).");
    else add("sales", "Sales", "warn", `${conv7.toFixed(0)} conversions/7d (Google's attribution) — no Shopify connected, so real orders aren't confirmed.`);
  }

  // 5. EFFICIENCY — profitable? (lagging; may be contaminated by an upstream break)
  const roas30 = spend30 > 0 ? val30 / spend30 : 0;
  const floor = account?.roasFloor ?? (account?.grossMarginPercent ? 1 / account.grossMarginPercent : null);
  if (spend30 > 0) {
    const floorTxt = floor != null ? ` (break-even ${floor.toFixed(2)})` : "";
    if (floor != null && roas30 < floor) add("efficiency", "Efficiency", fails.length ? "warn" : "fail", `ROAS ${roas30.toFixed(2)}/30d, below break-even${floorTxt}${fails.length ? " — likely contaminated by the upstream ✗; don't act on it yet." : "."}`);
    else add("efficiency", "Efficiency", "ok", `ROAS ${roas30.toFixed(2)}/30d${floorTxt}.`);
  } else add("efficiency", "Efficiency", "na", "No spend to judge efficiency on.");

  const governing = fails[0] ?? null;
  const summary = governing
    ? `${governing} is the governing constraint — fix that first; everything downstream (incl. efficiency) is unreliable until it is.`
    : "Fundamentals hold — no broken foundation. If performance is off, it's a tuning question, not a broken vital.";
  return { checks, governing, summary };
}

async function runVitals(acc: AgentAccount): Promise<string> {
  const v = await computeVitals(acc);
  const icon: Record<VitalStatus, string> = { ok: "✓", warn: "⚠", fail: "✗", na: "–" };
  const lines = v.checks.map(c => `${icon[c.status]} ${c.label}: ${c.detail}`);
  return `FUNDAMENTALS CHECK (upstream first — the first ✗ is the governing constraint):\n${lines.join("\n")}\n→ ${v.summary}`;
}

export async function runAgentTool(name: string, input: Record<string, unknown>, acc: AgentAccount): Promise<string> {
  const cur = CUR[acc.currency] ?? `${acc.currency} `;
  const money = (n: number) => `${cur}${Math.round(n).toLocaleString("en-GB")}`;
  const days = clampDays(input?.days);

  if (name === "run_healthcheck") return runVitals(acc);

  if (name === "get_impression_share") {
    const rows = (await fetchImpressionShare(acc.googleAdsId, acc.organizationId, days)).slice(0, 20);
    if (!rows.length) return `No campaigns with spend in the last ${days} days.`;
    const lines = rows.map(r => `- ${r.campaign} [${r.channel}]: spend ${money(r.cost)}, search IS ${pct(r.searchIS)}, lost to BUDGET ${pct(r.budgetLostIS)}, lost to rank ${pct(r.rankLostIS)}, abs-top ${pct(r.absTopIS)}`);
    return `Impression share, last ${days}d (higher "lost to budget" = more headroom if you raise budget; low abs-top = sitting at the bottom of the page, raise bids on converters; blanks are usually Performance Max):\n${lines.join("\n")}`;
  }

  if (name === "get_products") {
    const start = new Date(); start.setUTCDate(start.getUTCDate() - days);
    const rows = await prisma.productAdsDaily.findMany({
      where: { accountId: acc.id, date: { gte: start.toISOString().slice(0, 10) } },
      select: { itemId: true, title: true, spend: true, clicks: true, conversions: true, conversionValue: true },
    });
    if (!rows.length) return `No product-level ad data for the last ${days} days (item-level Shopping/PMax reporting may be missing, or the spine hasn't ingested it).`;
    const agg = new Map<string, { title: string; spend: number; clicks: number; conv: number; val: number }>();
    for (const r of rows) {
      const e = agg.get(r.itemId) ?? { title: r.title || r.itemId, spend: 0, clicks: 0, conv: 0, val: 0 };
      e.spend += r.spend; e.clicks += r.clicks; e.conv += r.conversions; e.val += r.conversionValue;
      if (!e.title && r.title) e.title = r.title;
      agg.set(r.itemId, e);
    }
    const acct = await prisma.account.findUnique({ where: { id: acc.id }, select: { roasFloor: true, grossMarginPercent: true } });
    const breakEven = acct?.roasFloor ?? (acct?.grossMarginPercent ? 1 / acct.grossMarginPercent : 1);
    const all = [...agg.values()];
    const totalSpend = all.reduce((s, p) => s + p.spend, 0);
    const under = all.filter(p => p.spend >= 20 && (p.conv === 0 || p.val / p.spend < breakEven)).sort((a, b) => b.spend - a.spend).slice(0, 20);
    if (!under.length) return `No structurally underperforming products over ${days}d — every product with real spend (≥${money(20)}) is at or above break-even (${breakEven.toFixed(2)}). Total product spend ${money(totalSpend)}.`;
    const wasted = under.reduce((s, p) => s + p.spend, 0);
    const lines = under.map(p => `- ${p.title}: spend ${money(p.spend)}, ${p.conv === 0 ? "0 conv" : `ROAS ${(p.val / p.spend).toFixed(2)}`}, ${p.clicks} clicks`);
    return `Structurally underperforming products, last ${days}d — real spend, return below break-even ${breakEven.toFixed(2)}${acct?.grossMarginPercent ? " (from margin)" : ""}. ${money(wasted)} of ${money(totalSpend)} product spend (${totalSpend > 0 ? Math.round(wasted / totalSpend * 100) : 0}%) is here:\n${lines.join("\n")}\n\nDoctrine: a large underperformer share is a SEGMENTATION signal — recalibrate ProductHero thresholds (tighter ROAS = smaller Villain pool) or move marginal items to Zombies for re-testing, rather than just pausing them.`;
  }

  if (name === "get_geo") {
    const rows = await fetchGeoPerformance(acc.googleAdsId, acc.organizationId, days);
    if (!rows.length) return `No geographic performance data for the last ${days} days.`;
    const lines = rows.map(r => `- ${r.location}: spend ${money(r.cost)}, ${r.clicks} clicks, ${r.conversions.toFixed(1)} conv, ROAS ${r.cost > 0 ? (r.value / r.cost).toFixed(2) : "—"}`);
    return `Performance by location, last ${days}d (look for a geo converting well on little spend = shift budget; or a country dragging the average = margin/AOV or tighten targeting):\n${lines.join("\n")}`;
  }

  if (name === "get_quality_score") {
    const rows = (await fetchQualityScore(acc.googleAdsId, acc.organizationId, days)).slice(0, 400);
    if (!rows.length) return `No Quality Score data (this is Search-only — a Shopping/PMax account has no keyword QS, and that's expected).`;
    const wAvg = rows.reduce((s, r) => s + r.qs, 0) / rows.length;
    const belowExpCtr = rows.filter(r => /BELOW/i.test(r.expCtr)).length;
    const belowAdRel = rows.filter(r => /BELOW/i.test(r.adRelevance)).length;
    const belowLp = rows.filter(r => /BELOW/i.test(r.lpExperience)).length;
    const allThree = rows.filter(r => /BELOW/i.test(r.expCtr) && /BELOW/i.test(r.adRelevance) && /BELOW/i.test(r.lpExperience));
    const worst = rows.filter(r => r.qs > 0).sort((a, b) => a.qs - b.qs).slice(0, 12)
      .map(r => `- "${r.keyword}": QS ${r.qs}/10 — CTR ${r.expCtr.toLowerCase()}, relevance ${r.adRelevance.toLowerCase()}, LP ${r.lpExperience.toLowerCase()} (spend ${money(r.cost)})`);
    return `Quality Score, last ${days}d (${rows.length} keywords, avg ${wAvg.toFixed(1)}/10): ${belowExpCtr} below-avg expected CTR, ${belowAdRel} below-avg ad relevance, ${belowLp} below-avg landing page. ${allThree.length} keywords are Below Average on ALL THREE (Ad Rank too low — rewrite RSAs + fix LP relevance).\nLowest QS:\n${worst.join("\n")}`;
  }

  if (name === "get_ad_strength") {
    const rows = await fetchAdStrength(acc.googleAdsId, acc.organizationId);
    if (!rows.length) return `No responsive search ads found (this is a Search-campaign check; Shopping/PMax have no RSAs).`;
    const dist = rows.reduce((m, r) => { const k = r.strength || "UNKNOWN"; m[k] = (m[k] ?? 0) + 1; return m; }, {} as Record<string, number>);
    const weak = rows.filter(r => /POOR|AVERAGE/i.test(r.strength)).sort((a, b) => a.headlines - b.headlines).slice(0, 15)
      .map(r => `- ${r.campaign} › ${r.adGroup}: ${r.strength.toLowerCase()} — ${r.headlines} headlines, ${r.descriptions} descriptions`);
    return `Ad strength across ${rows.length} responsive search ads: ${Object.entries(dist).map(([k, n]) => `${n} ${k.toLowerCase()}`).join(", ")}.\nWeakest / most underbuilt (ceiling is 15 headlines / 4 descriptions):\n${weak.join("\n") || "— none flagged weak"}`;
  }

  if (name === "get_campaign_overview") {
    const rows = (await fetchCampaignOverview(acc.googleAdsId, acc.organizationId, days)).slice(0, 30);
    if (!rows.length) return `No active campaigns found in the last ${days} days.`;
    const lines = rows.map(r => `- ${r.campaign} [${r.channel}, ${r.status}]: daily budget ${r.dailyBudget != null ? money(r.dailyBudget) : "—"}, spend ${money(r.cost)}, conv ${r.conversions.toFixed(1)}, value ${money(r.value)}, ROAS ${r.cost > 0 ? (r.value / r.cost).toFixed(2) : "—"}`);
    const setup = detectSetup(rows);
    return `Campaign structure, last ${days}d:\n${lines.join("\n")}${setup ? `\n\n${setup}` : ""}`;
  }

  if (name === "get_merchant_center_status") {
    const ids = await getMerchantCenterIds(acc.googleAdsId, acc.organizationId, acc.merchantCenterId ?? null);
    if (!ids.length) return "No Merchant Center account is linked to this Google Ads account (couldn't discover one via the product link, and none is stored). If feed health matters here, link Merchant Center — otherwise this can't be checked from the API.";
    const h = await fetchMerchantCenterHealth(ids[0], acc.organizationId);
    if (h.scopeOrAuthError) return `Couldn't read Merchant Center (${ids[0]}): ${h.scopeOrAuthError}. The Google login may be missing the 'content' scope — reconnect Google to grant it.`;
    const out: string[] = [`Merchant Center ${ids[0]} — feed health:`];
    if (h.accountIssues.length) {
      out.push(`ACCOUNT-LEVEL ISSUES (these can take the whole feed down):`);
      for (const i of h.accountIssues) out.push(`- ${i.title}${i.severity ? ` [${i.severity}]` : ""}${i.country ? ` (${i.country})` : ""}`);
    } else {
      out.push(`No account-level issues (no suspension / misrepresentation flag).`);
    }
    out.push(`Products: ${h.totals.active} active, ${h.totals.disapproved} disapproved, ${h.totals.pending} pending.`);
    if (h.destinations.length) {
      const byC = h.destinations.filter(d => d.active + d.disapproved + d.pending > 0)
        .map(d => `${d.country || "?"}: ${d.active} active${d.disapproved ? `, ${d.disapproved} disapproved` : ""}${d.pending ? `, ${d.pending} pending` : ""}`);
      if (byC.length) out.push(`By country: ${byC.join(" · ")} (a country missing here isn't serving — check it's approved).`);
    }
    if (h.itemIssues.length) {
      out.push(`Top disapproval reasons (by product count):`);
      for (const it of h.itemIssues.slice(0, 10)) out.push(`- ${it.description} [${it.servability || "?"}]: ${it.numItems} products${it.country ? ` (${it.country})` : ""}`);
    }
    return out.join("\n");
  }

  if (name === "get_change_history") {
    const window = Math.min(30, days);
    const rows = (await fetchChangeHistory(acc.googleAdsId, acc.organizationId, window)).slice(0, 120);
    if (!rows.length) return `No account changes recorded in the last ${window} days (Google Ads only retains ~30 days of change history).`;
    const lines = rows.map(r => {
      const day = r.when.slice(0, 16).replace("T", " ");
      const where = r.campaign ? ` · ${r.campaign}${r.adGroup ? ` › ${r.adGroup}` : ""}` : "";
      const what = r.summary ?? `${r.operation.toLowerCase()} ${r.fields}`.trim();
      return `- ${day} · ${r.scope}${where}: ${what} (by ${r.who})`;
    });
    return `Account change history, last ${window}d (line the dates up against when the metric moved):\n${lines.join("\n")}`;
  }

  if (name === "consult_playbook") {
    const topic = typeof input?.topic === "string" ? input.topic : "";
    return lookupPlaybook(topic);
  }

  if (name === "get_slack_context") {
    const [acct, conn] = await Promise.all([
      prisma.account.findUnique({ where: { id: acc.id }, select: { slackChannelId: true, slackChannelName: true } }),
      prisma.slackConnection.findUnique({ where: { organizationId: acc.organizationId }, select: { botToken: true } }),
    ]);
    if (!conn) return "Slack is NOT connected for this organisation, so there's no channel to read.";
    if (!acct?.slackChannelId) return "No Slack channel is linked to this account — nothing to read. (Link one in the account settings if the client's channel should feed context.)";
    let msgs;
    try { msgs = await fetchSlackMessages(conn.botToken, acct.slackChannelId, Math.min(90, days)); }
    catch (e) { return `Couldn't read the Slack channel: ${e instanceof Error ? e.message : String(e)}.`; }
    if (!msgs.length) return `No messages in #${acct.slackChannelName ?? "the channel"} in the last ${Math.min(90, days)} days (the bot may not be invited — /invite it in the channel).`;
    // Cap what we hand back so a busy channel can't blow the context window —
    // the most recent messages carry the freshest off-platform signal.
    const recent = msgs.slice(-60);
    const block = formatSlackForContext(recent, acct.slackChannelName ?? "channel");
    return block.length > 6000 ? block.slice(block.length - 6000) : block;
  }

  if (name === "get_segments") {
    const acct = await prisma.account.findUnique({ where: { id: acc.id }, select: { name: true } });
    const out: string[] = [];
    // Device split (30d, from Google Ads demographics).
    try {
      const demo = await fetchDemographics(acc.googleAdsId, acc.organizationId);
      const dev = demo.filter(d => d.dimension === "device" && (d.clicks > 0 || d.costMicros > 0));
      if (dev.length) {
        const lines = dev.sort((a, b) => b.costMicros - a.costMicros).map(d => {
          const cost = d.costMicros / 1_000_000;
          const cvr = d.clicks > 0 ? (d.conversions / d.clicks) * 100 : 0;
          const roas = cost > 0 ? d.convValue / cost : 0;
          return `- ${d.label}: spend ${money(cost)}, CVR ${cvr.toFixed(2)}%, ROAS ${roas.toFixed(2)}, ${Math.round(d.conversions)} conv`;
        });
        out.push(`Device (30d) — a mobile CVR far below desktop points at mobile UX/checkout, not the ads:\n${lines.join("\n")}`);
      }
    } catch { /* device best-effort */ }
    // Brand vs non-brand (from stored search terms).
    try {
      const token = norm(acct?.name ?? "");
      if (token.length >= 4) {
        const start = new Date(); start.setUTCDate(start.getUTCDate() - days);
        const rows = await prisma.searchTermDaily.findMany({
          where: { accountId: acc.id, date: { gte: start.toISOString().slice(0, 10) } },
          select: { searchTerm: true, clicks: true, cost: true, conversions: true, conversionValue: true },
        });
        if (rows.length) {
          const b = { clicks: 0, cost: 0, conv: 0, val: 0 }, nb = { clicks: 0, cost: 0, conv: 0, val: 0 };
          for (const r of rows) {
            const t = norm(r.searchTerm).includes(token) ? b : nb;
            t.clicks += r.clicks; t.cost += r.cost; t.conv += r.conversions; t.val += r.conversionValue;
          }
          const fmt = (x: typeof b) => `spend ${money(x.cost)}, CVR ${x.clicks > 0 ? ((x.conv / x.clicks) * 100).toFixed(2) : "—"}%, ROAS ${x.cost > 0 ? (x.val / x.cost).toFixed(2) : "—"}`;
          out.push(`Brand vs non-brand (search terms, ${days}d — brand inflates blended ROAS; the non-brand number is your real growth performance):\n- Brand: ${fmt(b)}\n- Non-brand: ${fmt(nb)}\n(Only Search queries; PMax/Shopping are limited by Google, so treat as directional.)`);
        }
      }
    } catch { /* brand split best-effort */ }
    if (!out.length) return "No segment data available — no device rows returned and no stored search terms to split brand vs non-brand for this account.";
    return out.join("\n\n");
  }

  if (name === "get_price_competitiveness") {
    const ids = await getMerchantCenterIds(acc.googleAdsId, acc.organizationId, acc.merchantCenterId ?? null);
    if (!ids.length) return "No Merchant Center account is linked, so there's no market price benchmark to compare against.";
    const res = await fetchPriceCompetitiveness(ids[0], acc.organizationId);
    if (res.scopeMissing) return "Couldn't read price competitiveness — the Google login is missing the 'content' scope. Reconnect Google to grant it.";
    if (res.gcpNotRegistered) return `Price competitiveness needs the Merchant API project registered${res.gcpProjectId ? ` (GCP ${res.gcpProjectId})` : ""}; until then it can't be pulled.`;
    const rows = res.products;
    if (!rows.length) return "No price-benchmark data returned for this account's products (Merchant Center may not have competitor benchmarks for them yet).";
    const wellAbove = rows.filter(p => p.status === "well_above").length;
    const above = rows.filter(p => p.status === "above").length;
    const belowOrOk = rows.filter(p => p.status === "below" || p.status === "competitive").length;
    const worst = rows.filter(p => p.status === "above" || p.status === "well_above").sort((a, b) => b.priceDiffPercent - a.priceDiffPercent).slice(0, 15);
    const lines = worst.map(p => `- ${p.title || p.itemId}: ${p.priceDiffPercent > 0 ? "+" : ""}${p.priceDiffPercent}% vs market (${p.status.replace("_", " ")})`);
    return `Price vs market (${rows.length} products with benchmarks): ${wellAbove} well above, ${above} above, ${belowOrOk} competitive/below.\n${worst.length ? `Most overpriced — if these are the products taking the clicks, PRICING is the constraint (a client conversation, not a bid change):\n${lines.join("\n")}` : "Nothing priced materially above market — pricing isn't the drag here."}`;
  }

  if (name === "get_shopping_competitors") {
    const query = typeof input?.query === "string" ? input.query.trim() : "";
    if (!query) return "Give me a product or search term to scan (usually the product title).";
    const tldByCur: Record<string, string> = { EUR: "nl", GBP: "co.uk", USD: "com", CZK: "cz", PLN: "pl" };
    const tld = (typeof input?.tld === "string" && input.tld.trim()) ? input.tld.trim().toLowerCase() : (tldByCur[acc.currency] ?? "nl");
    let highlight = typeof input?.highlight === "string" ? input.highlight.trim() : "";
    // No highlight given → derive it from the connected Shopify store, so the
    // client's own listing is located without anyone having to name the shop.
    if (!highlight) {
      const conn = await prisma.shopifyConnection.findUnique({ where: { accountId: acc.id }, select: { shopDomain: true } });
      if (conn?.shopDomain) highlight = conn.shopDomain.replace(/\.myshopify\.com$/i, "");
    }
    // The client's own listing from the ingested catalog — exact price + GTIN,
    // shown even when the scrape doesn't surface their shop in the results.
    const nq = norm(query);
    const own = nq ? (await prisma.product.findMany({
      where: { accountId: acc.id }, select: { title: true, price: true, barcode: true, url: true },
    })).find(p => { const t = norm(p.title); return t === nq || (t.length > 5 && (t.includes(nq) || nq.includes(t))); }) : undefined;
    let scan;
    try { scan = await fetchGoogleShopping(query, tld, highlight); }
    catch (e) { return `Couldn't run the Google Shopping scan: ${e instanceof Error ? e.message : String(e)}.`; }
    const ownLine = own
      ? `\nThe client's own listing (Shopify catalog): "${own.title}"${own.price != null ? ` at ${money(own.price)}` : ""}${own.barcode ? `, GTIN ${own.barcode}` : ""}.`
      : "";
    if (!scan.rows.length) return `No Google Shopping results for "${query}" on google.${tld}. Feed titles are often too specific — try a shorter, more generic term (e.g. drop the colour/size).${ownLine}`;
    const s = scan.stats;
    const range = s.min != null && s.max != null ? `${money(s.min)}–${money(s.max)}, median ${money(s.median ?? 0)}` : "n/a";
    const listings = scan.rows.slice(0, 12).map(r => `- #${r.position} ${r.merchant || "?"}: ${r.price || (r.priceValue != null ? money(r.priceValue) : "—")}${r.isYou ? "  ← the client" : ""}`);
    const ownVsMedian = own?.price != null && s.median != null && s.median > 0
      ? ` That store price is ${Math.round(((own.price - s.median) / s.median) * 100) > 0 ? `${Math.round(((own.price - s.median) / s.median) * 100)}% ABOVE` : `${Math.abs(Math.round(((own.price - s.median) / s.median) * 100))}% below`} the market median.`
      : "";
    const youLine = scan.you
      ? `\nThe client ranks #${scan.you.position}${scan.you.priceValue != null ? ` at ${money(scan.you.priceValue)}` : ""}${scan.you.vsMedianPct != null ? ` — ${scan.you.vsMedianPct > 0 ? `${scan.you.vsMedianPct}% ABOVE` : `${Math.abs(scan.you.vsMedianPct)}% below`} the median` : ""}.`
      : (highlight ? `\nThe client's shop ("${highlight}") didn't appear in the scraped listings — either not ranking for this term or listed under a different seller name.` : "");
    return `Live Google Shopping for "${query}" (google.${tld}) — ${s.sellers} sellers, price range ${range}.${youLine}${ownLine}${ownVsMedian}\nTop listings:\n${listings.join("\n")}\n\n(Real Shopping data, no Merchant API needed. Sellers are matched by name, so the client only shows as "← the client" if their shop is listed under a recognisable name.)`;
  }

  if (name === "get_search_terms") {
    const start = new Date(); start.setUTCDate(start.getUTCDate() - days);
    const rows = await prisma.searchTermDaily.findMany({
      where: { accountId: acc.id, date: { gte: start.toISOString().slice(0, 10) } },
      select: { searchTerm: true, clicks: true, cost: true, conversions: true },
    });
    if (!rows.length) return `No stored search-term data for the last ${days} days (the spine may not have it for this account, or it's Performance Max).`;
    const agg = new Map<string, { term: string; clicks: number; cost: number; conv: number }>();
    for (const r of rows) {
      const e = agg.get(r.searchTerm) ?? { term: r.searchTerm, clicks: 0, cost: 0, conv: 0 };
      e.clicks += r.clicks; e.cost += r.cost; e.conv += r.conversions;
      agg.set(r.searchTerm, e);
    }
    const top = [...agg.values()].sort((a, b) => b.cost - a.cost).slice(0, 30);
    const lines = top.map(t => `- "${t.term}": ${money(t.cost)}, ${t.clicks} clicks, ${t.conv.toFixed(1)} conv${t.conv === 0 && t.cost > 0 ? "  ⚠ spend, 0 conv" : ""}`);
    return `Top search terms by spend, last ${days}d:\n${lines.join("\n")}`;
  }

  if (name === "get_shopify_data") {
    const [conn, upload] = await Promise.all([
      prisma.shopifyConnection.findUnique({ where: { accountId: acc.id }, select: { shopDomain: true } }),
      prisma.shopifyUpload.findUnique({ where: { accountId_kind: { accountId: acc.id, kind: "daily_sales" } }, select: { uploadedAt: true, uploadedBy: true, rangeStart: true, rangeEnd: true } }),
    ]);
    const start = new Date(); start.setUTCDate(start.getUTCDate() - days);
    const ymd = start.toISOString().slice(0, 10);
    // Split the window in half (capped at 7d each side) so we can say whether
    // real orders are actually moving — the decisive fact for "did sales drop,
    // or is only Ads-attributed tracking broken?". Also pull the same window's
    // Ads conversions so the tool can reconcile the two sides directly.
    const half = Math.min(Math.floor(days / 2), 7);
    const recentStart = new Date(); recentStart.setUTCDate(recentStart.getUTCDate() - half);
    const recentYmd = recentStart.toISOString().slice(0, 10);
    const [orders, products, adsAgg] = await Promise.all([
      prisma.orderDaily.findMany({ where: { accountId: acc.id, date: { gte: ymd } }, select: { date: true, orders: true, revenue: true, currency: true } }),
      prisma.productSalesDaily.findMany({ where: { accountId: acc.id, date: { gte: ymd } }, select: { date: true, title: true, units: true, revenue: true } }),
      prisma.metricDaily.aggregate({ where: { accountId: acc.id, date: { gte: ymd } }, _sum: { conversions: true } }),
    ]);
    if (!conn && !upload && !orders.length) {
      return "Shopify is NOT connected and no CSV has been uploaded yet — no real order data to reconcile against. Ask the account manager for the Shopify 'Sales over time' CSV export (Analytics → Reports) and upload it; that's how we get order data for this account for now.";
    }

    // Freshness: uploaded CSV data is a snapshot, not live — always say how old
    // it is and whether it even covers the window asked for, so nothing here
    // gets passed off as current when it isn't.
    let sourceNote: string;
    if (conn && !upload) {
      sourceNote = `Source: live Shopify connection (${conn.shopDomain}).`;
    } else if (upload) {
      const ageDays = Math.floor((Date.now() - upload.uploadedAt.getTime()) / 86_400_000);
      const cover = upload.rangeStart && upload.rangeEnd ? ` covering ${upload.rangeStart} → ${upload.rangeEnd}` : "";
      const tailGap = upload.rangeEnd ? Math.floor((Date.now() - new Date(`${upload.rangeEnd}T00:00:00Z`).getTime()) / 86_400_000) : null;
      const staleness = ageDays >= 14
        ? " This is over two weeks old — treat it as possibly stale and ask for a fresh export before trusting recent movement."
        : tailGap != null && tailGap > 3
          ? ` The data ends ${tailGap}d ago, so the most recent days aren't covered.`
          : " It was recent when uploaded.";
      sourceNote = `Source: a MANUAL CSV${upload.uploadedBy ? ` uploaded by ${upload.uploadedBy}` : ""} ${ageDays === 0 ? "today" : `${ageDays}d ago`}${cover} — NOT a live connection.${staleness}`;
    } else {
      sourceNote = "Source: stored order data (origin unrecorded).";
    }

    if (!orders.length) {
      return `No Shopify orders in the last ${days} days from the data on file. ${sourceNote}`;
    }
    const totOrders = orders.reduce((s, o) => s + o.orders, 0);
    const totRev = orders.reduce((s, o) => s + o.revenue, 0);
    const aov = totOrders > 0 ? totRev / totOrders : 0;

    // Recent half vs the prior half — is the real order flow actually moving?
    const recent = orders.filter(o => o.date >= recentYmd);
    const prior = orders.filter(o => o.date < recentYmd);
    const rOrders = recent.reduce((s, o) => s + o.orders, 0);
    const pOrders = prior.reduce((s, o) => s + o.orders, 0);
    const rRev = recent.reduce((s, o) => s + o.revenue, 0);
    const pRev = prior.reduce((s, o) => s + o.revenue, 0);
    const pctChg = (now: number, was: number) => was > 0 ? Math.round(((now - was) / was) * 100) : null;
    const ordChg = pctChg(rOrders, pOrders), revChg = pctChg(rRev, pRev);
    const arrow = (n: number | null) => n == null ? "" : n > 0 ? `up ${n}%` : n < 0 ? `down ${Math.abs(n)}%` : "flat";
    // AOV is its own signal: a basket-size drop (discounting, mix shift toward
    // cheaper items) hurts even when order COUNT holds, so call it out separately.
    const rAov = rOrders > 0 ? rRev / rOrders : 0, pAov = pOrders > 0 ? pRev / pOrders : 0;
    const aovChg = pctChg(rAov, pAov);
    // Neutral numbers only — the deltas are the tool's job; the interpretation
    // (why AOV fell, what to do) is the agent's reasoning, not baked in here.
    const trendLine = prior.length
      ? `\nReal order trend — last ${half}d vs the prior ${half}d: ${rOrders} vs ${pOrders} orders (${arrow(ordChg) || "—"}), revenue ${money(rRev)} vs ${money(pRev)} (${arrow(revChg) || "—"}), AOV ${money(rAov)} vs ${money(pAov)} (${arrow(aovChg) || "—"}).`
      : "";

    // State the reconciliation as a fact for the same window; the agent decides
    // what a gap means (tracking, attribution, demand).
    const adsConv = Math.round(adsAgg._sum.conversions ?? 0);
    const gapPct = totOrders > 0 ? Math.round(((adsConv - totOrders) / totOrders) * 100) : null;
    const reconLine = gapPct != null
      ? `\nReconciliation (${days}d): Google Ads counted ${adsConv} conversions vs ${totOrders} real Shopify orders (${gapPct === 0 ? "matched" : gapPct < 0 ? `Ads ${Math.abs(gapPct)}% below orders` : `Ads ${gapPct}% above orders`}).`
      : "";

    // Per-product sales, split recent vs prior so we can name what's carrying the
    // store, what's dropping, and what's newly emerging — not just a flat total.
    const pAgg = new Map<string, { title: string; units: number; revenue: number; rRev: number; pRev: number; rUnits: number; pUnits: number }>();
    for (const p of products) {
      const e = pAgg.get(p.title) ?? { title: p.title, units: 0, revenue: 0, rRev: 0, pRev: 0, rUnits: 0, pUnits: 0 };
      e.units += p.units; e.revenue += p.revenue;
      if (p.date >= recentYmd) { e.rRev += p.revenue; e.rUnits += p.units; } else { e.pRev += p.revenue; e.pUnits += p.units; }
      pAgg.set(p.title, e);
    }
    const prods = [...pAgg.values()];
    let productSection: string;
    if (!prods.length) {
      // CSV / Flow give order totals only; per-product needs the live API.
      productSection = upload
        ? "\nPer-product sales aren't in this data — the “Sales over time” CSV is order totals only. A live Shopify connection (or a “Sales by product” export) is needed for product-level breakdowns."
        : "";
    } else {
      const top = [...prods].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
      const topLines = `\nTop sellers (${days}d): ${top.map(p => `${p.title} (${p.units}u, ${money(p.revenue)})`).join("; ")}.`;
      const movers = prods.filter(p => p.pRev > 0 || p.rRev > 0);
      const fallers = movers.filter(p => p.rRev < p.pRev).sort((a, b) => (a.rRev - a.pRev) - (b.rRev - b.pRev)).slice(0, 3);
      const risers = movers.filter(p => p.rRev > p.pRev && p.pRev > 0).sort((a, b) => (b.rRev - b.pRev) - (a.rRev - a.pRev)).slice(0, 2);
      const emerging = prods.filter(p => p.pUnits === 0 && p.rUnits > 0).sort((a, b) => b.rRev - a.rRev).slice(0, 3);
      const mv = (p: typeof prods[number]) => `${p.title} (${money(p.pRev)}→${money(p.rRev)})`;
      const parts: string[] = [];
      if (fallers.length) parts.push(`falling: ${fallers.map(mv).join("; ")}`);
      if (risers.length) parts.push(`rising: ${risers.map(mv).join("; ")}`);
      if (emerging.length) parts.push(`newly selling (no prior sales): ${emerging.map(p => `${p.title} (${money(p.rRev)})`).join("; ")}`);
      const moverLine = parts.length ? `\nProduct movement (last ${half}d vs prior ${half}d) — ${parts.join(" · ")}.` : "";
      productSection = topLines + moverLine;
    }
    // Shop currency can differ from the Ads account currency — flag it so figures aren't misread.
    const orderCur = orders.find(o => o.currency)?.currency;
    const curNote = orderCur && orderCur !== acc.currency ? ` (orders reported in ${orderCur}, not the account's ${acc.currency})` : "";
    const label = conn ? `Shopify (${conn.shopDomain})` : "Shopify";
    return `${label} — last ${days}d: ${totOrders} orders, ${money(totRev)} revenue, AOV ${money(aov)}${curNote}.${trendLine}${reconLine}${productSection}\n${sourceNote}`;
  }

  return `Unknown tool: ${name}`;
}
