/**
 * Monthly client report (the "VOUXX-style" managementrapport): assemble one
 * month of real numbers for one account — Google Ads spine + Shopify orders /
 * products / discounts — computed HERE so the model never invents a figure.
 * The model only writes the narrative (ReportContent); the fixed template in
 * ./render.ts guarantees the house look and the honest structure, including a
 * "what we don't know" section that is partly auto-generated from what data is
 * actually connected.
 */
import { prisma } from "@/lib/db";
import type { ReportData, ReportLanguage, CampaignRow, TermRow, ProductRow, DiscountRow } from "./types";

const CUR: Record<string, string> = { EUR: "€", USD: "$", GBP: "£", CZK: "Kč", PLN: "zł" };
const pad = (n: number) => String(n).padStart(2, "0");
const isBrandCampaign = (name: string) => /(^|[^a-z])brand(ed)?([^a-z]|$)|merk(naam)?([^a-z]|$)/i.test(name);

/** Resolve the report window for "YYYY-MM": 1st of month → min(month end, yesterday). */
export function monthWindow(month: string): { start: string; end: string; label: string; partial: boolean } | null {
  const m = month.match(/^(\d{4})-(\d{2})$/);
  if (!m) return null;
  const y = Number(m[1]), mo = Number(m[2]);
  if (mo < 1 || mo > 12) return null;
  const start = `${m[1]}-${m[2]}-01`;
  const lastDay = new Date(Date.UTC(y, mo, 0)).getUTCDate();
  const monthEnd = `${m[1]}-${m[2]}-${pad(lastDay)}`;
  const yest = new Date(); yest.setUTCDate(yest.getUTCDate() - 1);
  const yestStr = yest.toISOString().slice(0, 10);
  if (start > yestStr) return null; // month hasn't started
  const end = monthEnd < yestStr ? monthEnd : yestStr;
  return { start, end, label: month, partial: end < monthEnd };
}

/** Same-length window immediately before `start` (for the comparison section). */
function previousWindow(start: string, end: string): { start: string; end: string } {
  const s = new Date(start + "T00:00:00Z"), e = new Date(end + "T00:00:00Z");
  const days = Math.round((e.getTime() - s.getTime()) / 86_400_000) + 1;
  const pe = new Date(s.getTime() - 86_400_000);
  const ps = new Date(pe.getTime() - (days - 1) * 86_400_000);
  return { start: ps.toISOString().slice(0, 10), end: pe.toISOString().slice(0, 10) };
}

export async function buildMonthlyReportData(
  accountId: string, orgId: string, month: string, langOverride?: ReportLanguage,
): Promise<{ data: ReportData; dataBlock: string } | null> {
  const account = await prisma.account.findFirst({
    where: { id: accountId, organizationId: orgId },
    select: {
      id: true, name: true, clientName: true, currency: true, targetRoas: true,
      grossMarginPercent: true, businessModel: true, country: true,
      clientContextPack: { select: { defaultLanguage: true, netMarginPct: true, breakEvenRoas: true, goal: true, makeOrBreak: true } },
      shopify: { select: { shopDomain: true } },
    },
  });
  if (!account) return null;
  const win = monthWindow(month);
  if (!win) return null;
  const prev = previousWindow(win.start, win.end);
  const sym = CUR[account.currency] ?? `${account.currency} `;
  const language: ReportLanguage = langOverride ?? (account.clientContextPack?.defaultLanguage === "nl" ? "nl" : "en");

  const range = { gte: win.start, lte: win.end };
  const prevRange = { gte: prev.start, lte: prev.end };
  const [mRows, mPrev, oRows, oPrev, salesRows, adsProdRows, termRows, discRows] = await Promise.all([
    prisma.metricDaily.findMany({ where: { accountId, date: range }, select: { date: true, campaignId: true, campaignName: true, spend: true, clicks: true, impressions: true, conversions: true, conversionValue: true } }),
    prisma.metricDaily.findMany({ where: { accountId, date: prevRange }, select: { campaignName: true, spend: true, conversions: true, conversionValue: true } }),
    prisma.orderDaily.findMany({ where: { accountId, date: range }, select: { orders: true, revenue: true } }),
    prisma.orderDaily.findMany({ where: { accountId, date: prevRange }, select: { orders: true, revenue: true } }),
    prisma.productSalesDaily.findMany({ where: { accountId, date: range }, select: { productId: true, title: true, units: true, revenue: true } }),
    prisma.productAdsDaily.findMany({ where: { accountId, date: range }, select: { itemId: true, title: true, spend: true, clicks: true, conversions: true, conversionValue: true } }),
    prisma.searchTermDaily.findMany({ where: { accountId, date: range }, select: { searchTerm: true, clicks: true, cost: true, conversions: true, conversionValue: true } }),
    prisma.discountDaily.findMany({ where: { accountId, date: range }, select: { code: true, orders: true, discounted: true, revenue: true } }),
  ]);

  // ── Totals + brand split ────────────────────────────────────────────────────
  type Tot = { spend: number; conversions: number; conversionValue: number; clicks: number; impressions: number };
  const sum = (rows: { spend?: number; conversions?: number; conversionValue?: number; clicks?: number; impressions?: number }[]): Tot =>
    rows.reduce<Tot>((t, r) => ({
      spend: t.spend + (r.spend ?? 0), conversions: t.conversions + (r.conversions ?? 0),
      conversionValue: t.conversionValue + (r.conversionValue ?? 0),
      clicks: t.clicks + (r.clicks ?? 0), impressions: t.impressions + (r.impressions ?? 0),
    }), { spend: 0, conversions: 0, conversionValue: 0, clicks: 0, impressions: 0 });
  const tot = sum(mRows);
  const nonBrandRows = mRows.filter(r => !isBrandCampaign(r.campaignName));
  const nb = sum(nonBrandRows);
  const brandNames = [...new Set(mRows.filter(r => isBrandCampaign(r.campaignName)).map(r => r.campaignName))];
  const totPrev = sum(mPrev);
  const nbPrev = sum(mPrev.filter(r => !isBrandCampaign(r.campaignName)));

  // ── Campaign table ──────────────────────────────────────────────────────────
  const byCampaign = new Map<string, CampaignRow>();
  for (const r of mRows) {
    const e = byCampaign.get(r.campaignId) ?? { name: r.campaignName, isBrand: isBrandCampaign(r.campaignName), spend: 0, clicks: 0, conversions: 0, conversionValue: 0 };
    e.spend += r.spend; e.clicks += r.clicks; e.conversions += r.conversions; e.conversionValue += r.conversionValue;
    if (!e.name) e.name = r.campaignName;
    byCampaign.set(r.campaignId, e);
  }
  const campaigns = [...byCampaign.values()].filter(c => c.spend > 0.5 || c.conversionValue > 0)
    .sort((a, b) => b.spend - a.spend).slice(0, 12);

  // ── Search terms: winners + leaks (only exists inside the 45d retention) ────
  const byTerm = new Map<string, TermRow>();
  for (const r of termRows) {
    const e = byTerm.get(r.searchTerm) ?? { term: r.searchTerm, clicks: 0, cost: 0, conversions: 0, conversionValue: 0 };
    e.clicks += r.clicks; e.cost += r.cost; e.conversions += r.conversions; e.conversionValue += r.conversionValue;
    byTerm.set(r.searchTerm, e);
  }
  const termList = [...byTerm.values()];
  const termWinners = termList.filter(t => t.conversions > 0).sort((a, b) => b.conversionValue - a.conversionValue).slice(0, 7);
  const termLeaks = termList.filter(t => t.conversions === 0 && t.cost > 0).sort((a, b) => b.cost - a.cost).slice(0, 7);
  const leakTotal = termList.filter(t => t.conversions === 0).reduce((s, t) => s + t.cost, 0);

  // ── Products: what SOLD (Shopify) joined with what the ads did ─────────────
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const soldByProduct = new Map<string, ProductRow>();
  for (const r of salesRows) {
    const e = soldByProduct.get(r.productId) ?? { title: r.title || r.productId, units: 0, revenue: 0, adSpend: 0, adValue: 0 };
    e.units += r.units; e.revenue += r.revenue;
    if (!e.title && r.title) e.title = r.title;
    soldByProduct.set(r.productId, e);
  }
  const adByTitle = new Map<string, { spend: number; value: number }>();
  for (const r of adsProdRows) {
    const k = norm(r.title || r.itemId);
    const e = adByTitle.get(k) ?? { spend: 0, value: 0 };
    e.spend += r.spend; e.value += r.conversionValue;
    adByTitle.set(k, e);
  }
  for (const p of soldByProduct.values()) {
    const ad = adByTitle.get(norm(p.title));
    if (ad) { p.adSpend = ad.spend; p.adValue = ad.value; }
  }
  const products = [...soldByProduct.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 10);
  // Ads-side top products too (covers accounts without Shopify)
  const byAdProduct = new Map<string, ProductRow>();
  for (const r of adsProdRows) {
    const k = r.title || r.itemId;
    const e = byAdProduct.get(k) ?? { title: k, units: 0, revenue: 0, adSpend: 0, adValue: 0 };
    e.adSpend += r.spend; e.adValue += r.conversionValue;
    byAdProduct.set(k, e);
  }
  const adProducts = [...byAdProduct.values()].filter(p => p.adSpend > 1).sort((a, b) => b.adValue - a.adValue).slice(0, 10);

  const discounts: DiscountRow[] = (() => {
    const m = new Map<string, DiscountRow>();
    for (const r of discRows) {
      const e = m.get(r.code) ?? { code: r.code, orders: 0, discounted: 0, revenue: 0 };
      e.orders += r.orders; e.discounted += r.discounted; e.revenue += r.revenue;
      m.set(r.code, e);
    }
    return [...m.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 8);
  })();

  // ── Shop totals + reconciliation ───────────────────────────────────────────
  const shopOrders = oRows.reduce((s, o) => s + o.orders, 0);
  const shopRevenue = oRows.reduce((s, o) => s + o.revenue, 0);
  const shopPrevRevenue = oPrev.reduce((s, o) => s + o.revenue, 0);
  const shopPrevOrders = oPrev.reduce((s, o) => s + o.orders, 0);
  const hasShopify = oRows.length > 0;
  const marginPct = account.clientContextPack?.netMarginPct ?? account.grossMarginPercent ?? null;
  const breakEven = account.clientContextPack?.breakEvenRoas ?? (marginPct && marginPct > 0 ? 1 / marginPct : null);

  const data: ReportData = {
    client: account.clientName || account.name,
    accountName: account.name,
    shopDomain: account.shopify?.shopDomain ?? null,
    currencySymbol: sym,
    language,
    month: win.label, periodStart: win.start, periodEnd: win.end, partialMonth: win.partial,
    businessModel: account.businessModel ?? null,
    targetRoas: account.targetRoas ?? null, breakEven,
    totals: {
      spend: tot.spend, adsConversions: tot.conversions, adsRevenue: tot.conversionValue,
      roas: tot.spend > 0 ? tot.conversionValue / tot.spend : null,
      clicks: tot.clicks, impressions: tot.impressions,
      nbSpend: nb.spend, nbRevenue: nb.conversionValue, nbRoas: nb.spend > 0 ? nb.conversionValue / nb.spend : null,
      brandCampaigns: brandNames,
      shopOrders: hasShopify ? shopOrders : null, shopRevenue: hasShopify ? shopRevenue : null,
      mer: hasShopify && tot.spend > 0 ? shopRevenue / tot.spend : null,
      adsShareOfRevenue: hasShopify && shopRevenue > 0 ? Math.min(1, tot.conversionValue / shopRevenue) : null,
    },
    previous: {
      start: prev.start, end: prev.end,
      spend: totPrev.spend, adsRevenue: totPrev.conversionValue,
      roas: totPrev.spend > 0 ? totPrev.conversionValue / totPrev.spend : null,
      nbRoas: nbPrev.spend > 0 ? nbPrev.conversionValue / nbPrev.spend : null,
      shopRevenue: oPrev.length ? shopPrevRevenue : null, shopOrders: oPrev.length ? shopPrevOrders : null,
    },
    campaigns, termWinners, termLeaks, leakTotal, termCount: termList.length,
    products, adProducts, discounts,
    hasShopify, hasTerms: termList.length > 0,
  };

  // ── Grounded data block for the model ──────────────────────────────────────
  const money = (n: number) => `${sym}${Math.round(n).toLocaleString("en-GB")}`;
  const rr = (n: number | null) => (n != null ? n.toFixed(2) : "—");
  const D: string[] = [
    `CLIENT: ${data.client} — ${account.businessModel ?? "ecommerce"}, market ${account.country ?? "—"}, currency ${account.currency}`,
    `PERIOD: ${win.start} … ${win.end}${win.partial ? " (month still running)" : " (full month)"}`,
    `GOOGLE ADS: spend ${money(tot.spend)}, ${Math.round(tot.conversions)} conversions, ads-reported revenue ${money(tot.conversionValue)}, ROAS ${rr(data.totals.roas)}`,
  ];
  if (brandNames.length) D.push(`EXCL. BRAND campaigns (${brandNames.join(", ")}): spend ${money(nb.spend)}, revenue ${money(nb.conversionValue)}, ROAS ${rr(data.totals.nbRoas)} — judge performance on THIS view`);
  if (data.targetRoas) D.push(`Target ROAS ${data.targetRoas.toFixed(2)}${breakEven ? `, break-even ${breakEven.toFixed(2)}` : ""}`);
  if (hasShopify) {
    D.push(`SHOPIFY (source of truth): ${shopOrders} orders, ${money(shopRevenue)} revenue → blended MER ${rr(data.totals.mer)}; ads-attributed share ≈ ${data.totals.adsShareOfRevenue != null ? Math.round(data.totals.adsShareOfRevenue * 100) + "%" : "—"}`);
    D.push(`RECONCILIATION: Ads counted ${Math.round(tot.conversions)} conversions vs ${shopOrders} real orders`);
  } else {
    D.push(`NO order feed connected — every revenue figure is Google's own attribution, not verified against real orders. Say so.`);
  }
  D.push(`PREVIOUS PERIOD (${prev.start}…${prev.end}): spend ${money(totPrev.spend)}, ads revenue ${money(totPrev.conversionValue)}, ROAS ${rr(data.previous.roas)}${data.previous.shopRevenue != null ? `, shop revenue ${money(data.previous.shopRevenue)} (${data.previous.shopOrders} orders)` : ""}`);
  if (campaigns.length) { D.push(`\nCAMPAIGNS:`); for (const c of campaigns) D.push(`  - ${c.name}${c.isBrand ? " [BRAND]" : ""}: spend ${money(c.spend)}, ${Math.round(c.conversions)} conv, ${money(c.conversionValue)}, ROAS ${c.spend > 0 ? (c.conversionValue / c.spend).toFixed(2) : "—"}`); }
  if (termWinners.length) { D.push(`\nSEARCH TERMS THAT SOLD:`); for (const t of termWinners) D.push(`  - "${t.term}": ${t.clicks} clicks, ${money(t.cost)}, ${Math.round(t.conversions)} conv, ${money(t.conversionValue)}`); }
  if (termLeaks.length) { D.push(`SEARCH TERMS LEAKING (0 conv): ${termLeaks.map(t => `"${t.term}" ${money(t.cost)}`).join(", ")} — total spend on 0-conv terms ${money(leakTotal)}`); }
  if (products.length) { D.push(`\nBEST SELLERS (Shopify):`); for (const p of products.slice(0, 8)) D.push(`  - ${p.title}: ${p.units} sold, ${money(p.revenue)}${p.adSpend > 0 ? ` (ads: ${money(p.adSpend)} spend → ${money(p.adValue)})` : " (no ad spend matched)"}`); }
  else if (adProducts.length) { D.push(`\nTOP PRODUCTS IN ADS:`); for (const p of adProducts.slice(0, 8)) D.push(`  - ${p.title}: ${money(p.adSpend)} spend → ${money(p.adValue)}`); }
  if (discounts.length) D.push(`\nDISCOUNT CODES: ${discounts.map(d => `${d.code} (${d.orders} orders, ${money(d.revenue)} net, ${money(d.discounted)} given away)`).join("; ")}`);
  if (account.clientContextPack?.goal) D.push(`\nCLIENT GOAL: ${account.clientContextPack.goal}`);
  if (account.clientContextPack?.makeOrBreak) D.push(`MAKE-OR-BREAK: ${account.clientContextPack.makeOrBreak}`);

  return { data, dataBlock: D.join("\n") };
}

export const REPORT_SYSTEM = `You write Ecomtrada's monthly client report narrative. The reader is the CLIENT (a busy shop owner), not a marketer: plain language, no jargon (never say "PMax", "CTR" or "conversie-attributie" without a plain-word explanation), short sentences, and every claim grounded in the numbers provided — never invent or recompute figures. Honesty over polish: when a number is uncertain or unverified, say so plainly. When "EXCL. BRAND" numbers are given, judge performance on those and say which view a number comes from.

Return ONLY a JSON object (no prose, no code fences):
{"title":"headline for the masthead, like 'Waar de omzet van augustus vandaan kwam' — one line, may use *emphasis* on 1-2 words","dek":"1-2 sentence standfirst under the title","inShort":["3-4 paragraphs for section 'In short' — each starts with a **bold claim sentence**, then 1-2 plain sentences with the numbers"],"adsVsOrders":["1-2 paragraphs explaining how ads numbers relate to real orders this month (or, without an order feed, what that means for how to read the figures)"],"googleDetail":["2-3 paragraphs on campaigns and search terms: what worked, where money leaks, one concrete next step"],"productsNote":["1-2 paragraphs on the product table: concentration, hero products, what to build on"],"comparisonNote":["1 paragraph comparing to the previous period, honest about direction"],"extraCaveats":["0-3 extra honest caveats specific to this month's data, beyond the standard ones"]}
Write in the requested language. Keep the whole thing tight — this accompanies tables that already show the detail.`;
