/**
 * Live data tools the in-conversation agent (§agent) calls on demand — so it
 * fetches what it needs itself (impression share, campaign structure, search
 * terms, Shopify) instead of asking the account manager to look it up. It only
 * asks a human when the data genuinely isn't reachable through these tools.
 */
import { prisma } from "@/lib/db";
import { fetchImpressionShare, fetchCampaignOverview } from "@/lib/integrations/google-ads";

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
] as const;

const LABELS: Record<string, string> = {
  get_impression_share: "Checking impression share in Google Ads…",
  get_campaign_overview: "Pulling the campaign structure from Google Ads…",
  get_search_terms: "Reading the search terms…",
  get_shopify_data: "Checking the Shopify orders…",
};
export const toolStatusLabel = (name: string) => LABELS[name] ?? `Checking ${name.replace(/_/g, " ")}…`;

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
    return `Campaign structure, last ${days}d:\n${lines.join("\n")}`;
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
