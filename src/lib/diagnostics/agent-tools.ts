/**
 * Live data tools the in-conversation agent (§agent) calls on demand — so it
 * fetches what it needs itself (impression share, campaign structure, search
 * terms, Shopify) instead of asking the account manager to look it up. It only
 * asks a human when the data genuinely isn't reachable through these tools.
 */
import { prisma } from "@/lib/db";
import { fetchImpressionShare, fetchCampaignOverview, fetchChangeHistory } from "@/lib/integrations/google-ads";
import { fetchSlackMessages, formatSlackForContext } from "@/lib/integrations/slack";
import { lookupPlaybook } from "@/lib/diagnostics/agency-playbook";

export interface AgentAccount { id: string; googleAdsId: string; organizationId: string; currency: string }

const pct = (v: number | null) => (v == null ? "—" : `${Math.round(v * 100)}%`);
const clampDays = (d: unknown) => { const n = Number(d); return Number.isFinite(n) ? Math.min(90, Math.max(3, Math.round(n))) : 30; };
const CUR: Record<string, string> = { EUR: "€", USD: "$", GBP: "£", CZK: "Kč", PLN: "zł" };

// Tool definitions handed to the model (custom tools alongside the PPC OS MCP).
export const AGENT_TOOLS = [
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
    description: "OUR agency's own playbook — how THIS team specifically bids, structures accounts, segments products (ProductHero Heroes/Sidekicks/Zombies/Villains), decides when to scale, and what specific signal COMBINATIONS mean. Consult it when you hit a trigger and want our house stance rather than generic advice: you're about to conclude from an impression-share / CTR / CVR / ROAS / budget / tracking / feed pattern; a bidding-strategy, campaign-structure, product-segmentation or scaling question; or judging where the account sits in its lifecycle. Pass the topic in plain words (e.g. 'impression share lost to budget with good ROAS', 'CVR dropped suddenly', 'when to raise budget', 'product segmentation labels'). It returns the matching section — apply it ONLY where it fits this account's type and what the data actually shows; it's doctrine to reason with, not a script to force.",
    input_schema: { type: "object", properties: { topic: { type: "string", description: "What you're deciding, in plain words — the situation or pattern you want our stance on." } }, required: ["topic"] },
  },
] as const;

const LABELS: Record<string, string> = {
  get_impression_share: "Checking impression share in Google Ads…",
  get_campaign_overview: "Pulling the campaign structure from Google Ads…",
  get_search_terms: "Reading the search terms…",
  get_shopify_data: "Checking the Shopify orders…",
  get_change_history: "Pulling the account change history from Google Ads…",
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

export async function runAgentTool(name: string, input: Record<string, unknown>, acc: AgentAccount): Promise<string> {
  const cur = CUR[acc.currency] ?? `${acc.currency} `;
  const money = (n: number) => `${cur}${Math.round(n).toLocaleString("en-GB")}`;
  const days = clampDays(input?.days);

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
    const conn = await prisma.shopifyConnection.findUnique({ where: { accountId: acc.id }, select: { shopDomain: true } });
    if (!conn) return "Shopify is NOT connected for this account — there's no order data to reconcile against. (If reconciliation matters here, ask the account manager to connect the store.)";
    const start = new Date(); start.setUTCDate(start.getUTCDate() - days);
    const ymd = start.toISOString().slice(0, 10);
    const [orders, products] = await Promise.all([
      prisma.orderDaily.findMany({ where: { accountId: acc.id, date: { gte: ymd } }, select: { orders: true, revenue: true } }),
      prisma.productSalesDaily.findMany({ where: { accountId: acc.id, date: { gte: ymd } }, select: { title: true, units: true, revenue: true } }),
    ]);
    const totOrders = orders.reduce((s, o) => s + o.orders, 0);
    const totRev = orders.reduce((s, o) => s + o.revenue, 0);
    const pAgg = new Map<string, { title: string; units: number; revenue: number }>();
    for (const p of products) {
      const e = pAgg.get(p.title) ?? { title: p.title, units: 0, revenue: 0 };
      e.units += p.units; e.revenue += p.revenue; pAgg.set(p.title, e);
    }
    const top = [...pAgg.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 10);
    const topLines = top.length ? `\nTop sellers:\n${top.map(p => `- ${p.title}: ${p.units} units, ${money(p.revenue)}`).join("\n")}` : "";
    return `Shopify (${conn.shopDomain}), last ${days}d: ${totOrders} orders, ${money(totRev)} revenue.${topLines}`;
  }

  return `Unknown tool: ${name}`;
}
