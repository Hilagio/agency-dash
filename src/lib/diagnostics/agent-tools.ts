/**
 * Live data tools the in-conversation agent (§agent) calls on demand — so it
 * fetches what it needs itself (impression share, campaign structure, search
 * terms, Shopify) instead of asking the account manager to look it up. It only
 * asks a human when the data genuinely isn't reachable through these tools.
 */
import { prisma } from "@/lib/db";
import { fetchImpressionShare, fetchCampaignOverview, fetchChangeHistory } from "@/lib/integrations/google-ads";
import { fetchSlackMessages, formatSlackForContext } from "@/lib/integrations/slack";
import { getMerchantCenterIds, fetchMerchantCenterHealth } from "@/lib/integrations/merchant-center";
import { lookupPlaybook } from "@/lib/diagnostics/agency-playbook";

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
    name: "get_search_terms",
    description: "Top search terms by spend over the last N days (from the stored spine), with clicks, cost, and conversions. Use to spot wasted spend (high cost, zero conversions) and branded queries. Note: Performance Max search terms are limited by Google.",
    input_schema: { type: "object", properties: { days: { type: "number", description: "Look-back window in days (default 30)." } } },
  },
  {
    name: "get_shopify_data",
    description: "The account's real Shopify orders and revenue by window, plus top-selling products — the ground truth to reconcile against Google Ads conversions. Returns a clear note if Shopify isn't connected for this account.",
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
    description: "OUR agency's own Way of Work + playbook — how THIS team thinks and operates: the six principles (steer on POAS not ROAS; nine times out of ten it's NOT the ads; scale into demand not past it; concentration vs breadth; one change at a time; read leading signals), the health/warning/opportunity signals we watch, how we build & scale (phases, guardrails), how we test DEMAND GEN, and — most importantly — the exact DIAGNOSIS ORDER when something breaks (metric tree → decompose → overlay changes → buyability → canaries). Also the granular pattern library (what a specific IS/CTR/CVR/ROAS/budget/feed combination means) and product segmentation (ProductHero Heroes/Sidekicks/Zombies/Villains). Consult it when you hit a trigger and want our house stance rather than generic advice. Pass the topic in plain words (e.g. 'revenue dropped how do we diagnose', 'when to raise budget', 'brand conversion rate canary', 'zero-conversion spend rot', 'demand gen measurement', 'product segmentation villains'). Returns the matching section — apply it ONLY where it fits this account's type and what the data actually shows; doctrine to reason with, not a script to force.",
    input_schema: { type: "object", properties: { topic: { type: "string", description: "What you're deciding, in plain words — the situation or pattern you want our stance on." } }, required: ["topic"] },
  },
] as const;

const LABELS: Record<string, string> = {
  run_healthcheck: "Running the fundamentals check…",
  get_impression_share: "Checking impression share in Google Ads…",
  get_campaign_overview: "Pulling the campaign structure from Google Ads…",
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
  const found = new Set<string>();
  for (const n of names) for (const t of tokensOf(n)) {
    if (t === "HERO" || t === "HEROES" || t === "H") found.add("Heroes");
    else if (t === "SIDEKICK" || t === "SIDEKICKS" || t === "S") found.add("Sidekicks");
    else if (t === "ZOMBIE" || t === "ZOMBIES" || t === "Z") found.add("Zombies");
    else if (t === "VILLAIN" || t === "VILLAINS" || t === "V") found.add("Villains");
    else if (t === "HSZV" || t === "HSZ" || t === "HS") { found.add("Heroes"); found.add("Sidekicks"); found.add("Zombies"); }
  }
  return [...found];
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
// from real data; nothing is asserted that a check didn't return.
async function runVitals(acc: AgentAccount): Promise<string> {
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

  const L: string[] = ["FUNDAMENTALS CHECK (upstream first — the first ✗ is the governing constraint):"];
  const fails: string[] = [];
  const mark = (icon: string, label: string, detail: string) => L.push(`${icon} ${label}: ${detail}`);

  // 1. TRACKING — can we trust the numbers at all?
  if (account?.trackingStatus === "broken") { mark("✗", "Tracking", "flagged BROKEN — fix before trusting any number here; every downstream read is unreliable until it's fixed."); fails.push("tracking"); }
  else if (account?.trackingStatus === "verified") mark("✓", "Tracking", "confirmed working.");
  else mark("⚠", "Tracking", "not confirmed — verify the primary conversion is a real purchase and reconciles to orders.");
  // Reconciliation sanity (only if we have real orders to compare)
  if (hasOrderData && orders30 > 0 && conv30 > orders30 * 1.5) {
    mark("⚠", "Reconciliation", `Google shows ${conv30.toFixed(0)} conversions/30d but only ${orders30} real orders — possible over-counting (non-purchase goals?).`);
  }

  // 2. MERCHANT CENTER / FEED — is Google even allowed to serve the products?
  try {
    const ids = await getMerchantCenterIds(acc.googleAdsId, acc.organizationId, acc.merchantCenterId ?? null);
    if (ids.length) {
      const h = await fetchMerchantCenterHealth(ids[0], acc.organizationId);
      if (h.scopeOrAuthError) mark("⚠", "Merchant Center", `couldn't read it (${h.scopeOrAuthError.slice(0, 80)}).`);
      else if (h.accountIssues.length) { mark("✗", "Merchant Center", `account-level issue — ${h.accountIssues.map(i => i.title).join("; ")}. This can take the whole feed down.`); fails.push("merchant center"); }
      else {
        const tot = h.totals.active + h.totals.disapproved;
        const disPct = tot > 0 ? Math.round((h.totals.disapproved / tot) * 100) : 0;
        if (disPct >= 20) mark("⚠", "Merchant Center", `no suspension, but ${h.totals.disapproved}/${tot} products disapproved (${disPct}%).`);
        else mark("✓", "Merchant Center", `no account-level issues; ${h.totals.active} products serving${h.totals.disapproved ? `, ${h.totals.disapproved} disapproved` : ""}.`);
      }
    }
  } catch { /* MC is best-effort — a failure here shouldn't sink the whole check */ }

  // 3. SPEND — is the account actually delivering?
  if (spend30 <= 0) { mark("✗", "Spend", "€0 in 30d — not delivering (paused, or blocked by billing/policy)."); fails.push("spend"); }
  else if (spend7 <= spend30 / 30 * 0.2) mark("⚠", "Spend", `spending ${money(spend30)}/30d but the last 7d (${money(spend7)}) has collapsed — check serving/feed/budget.`);
  else mark("✓", "Spend", `delivering — ${money(spend30)}/30d, ${money(spend7)}/7d.`);

  // 4. SALES — is the money turning into orders?
  if (hasOrderData) {
    if (orders7 === 0 && spend7 > 0) { mark("✗", "Sales", `spending but ZERO real orders in 7d — the classic checkout/site/stock break (clicks arriving, till closed).`); fails.push("sales"); }
    else mark("✓", "Sales", `${orders7} real orders/7d (${money(rev7)}); ${orders30} over 30d.`);
  } else {
    if (conv7 === 0 && spend7 > 0) { mark("✗", "Sales", `spending but ZERO conversions in 7d (Google's count — no Shopify to confirm real orders).`); fails.push("sales"); }
    else mark("✓", "Sales", `${conv7.toFixed(0)} conversions/7d (Google's attribution).`);
    mark("⚠", "Order data", "no Shopify orders connected — flying on Google's attribution; connect Shopify or upload a CSV to confirm real sales.");
  }

  // 5. EFFICIENCY — profitable? (lagging, so last; may be contaminated by an upstream break)
  const roas30 = spend30 > 0 ? val30 / spend30 : 0;
  const floor = account?.roasFloor ?? (account?.grossMarginPercent ? 1 / account.grossMarginPercent : null);
  if (spend30 > 0) {
    const floorTxt = floor != null ? ` (break-even ${floor.toFixed(2)})` : "";
    if (floor != null && roas30 < floor) mark(fails.length ? "⚠" : "✗", "Efficiency", `ROAS ${roas30.toFixed(2)} over 30d, BELOW break-even${floorTxt}${fails.length ? " — but likely contaminated by the upstream ✗ above; don't act on it until that's fixed." : "."}`);
    else mark("✓", "Efficiency", `ROAS ${roas30.toFixed(2)} over 30d${floorTxt}.`);
  }

  L.push(fails.length
    ? `→ Governing constraint: ${fails[0].toUpperCase()} is broken — fix that first; everything downstream (including efficiency) is unreliable until it is.`
    : `→ Fundamentals hold. No hard failure — if performance is off, it's a tuning/optimisation question, not a broken foundation.`);
  return L.join("\n");
}

export async function runAgentTool(name: string, input: Record<string, unknown>, acc: AgentAccount): Promise<string> {
  const cur = CUR[acc.currency] ?? `${acc.currency} `;
  const money = (n: number) => `${cur}${Math.round(n).toLocaleString("en-GB")}`;
  const days = clampDays(input?.days);

  if (name === "run_healthcheck") return runVitals(acc);

  if (name === "get_impression_share") {
    const rows = (await fetchImpressionShare(acc.googleAdsId, acc.organizationId, days)).slice(0, 20);
    if (!rows.length) return `No campaigns with spend in the last ${days} days.`;
    const lines = rows.map(r => `- ${r.campaign} [${r.channel}]: spend ${money(r.cost)}, search IS ${pct(r.searchIS)}, lost to BUDGET ${pct(r.budgetLostIS)}, lost to rank ${pct(r.rankLostIS)}`);
    return `Impression share, last ${days}d (higher "lost to budget" = more headroom if you raise budget; blanks are usually Performance Max, which doesn't report search IS):\n${lines.join("\n")}`;
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
    const [orders, products] = await Promise.all([
      prisma.orderDaily.findMany({ where: { accountId: acc.id, date: { gte: ymd } }, select: { orders: true, revenue: true } }),
      prisma.productSalesDaily.findMany({ where: { accountId: acc.id, date: { gte: ymd } }, select: { title: true, units: true, revenue: true } }),
    ]);
    if (!conn && !upload && !orders.length) {
      return "Shopify is NOT connected for this account, and no Shopify CSV has been uploaded — there's no real order data to reconcile against. (Connect the store with a custom-app token, or upload the 'Sales over time' CSV export.)";
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
    const pAgg = new Map<string, { title: string; units: number; revenue: number }>();
    for (const p of products) {
      const e = pAgg.get(p.title) ?? { title: p.title, units: 0, revenue: 0 };
      e.units += p.units; e.revenue += p.revenue; pAgg.set(p.title, e);
    }
    const top = [...pAgg.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 10);
    const topLines = top.length ? `\nTop sellers:\n${top.map(p => `- ${p.title}: ${p.units} units, ${money(p.revenue)}`).join("\n")}` : "";
    const label = conn ? `Shopify (${conn.shopDomain})` : "Shopify";
    return `${label} — last ${days}d: ${totOrders} orders, ${money(totRev)} revenue.${topLines}\n${sourceNote}`;
  }

  return `Unknown tool: ${name}`;
}
