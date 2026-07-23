/**
 * GET /api/share/[token] — PUBLIC (no auth), read-only client performance data.
 *
 * Resolves an account by its unguessable shareToken and returns ONLY curated,
 * client-safe metrics: spend, conversions, revenue, ROAS/POAS and a daily trend
 * over the requested window, plus top products. It never exposes internal
 * diagnosis, notes, signals, or any other account. Token-gated, not enumerable.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { computeWindows } from "@/lib/diagnostics/windows";
import { cleanProductLabel } from "@/lib/diagnostics/engine";
import { getPageImages } from "@/lib/page-image";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ token: string }> };
const SYMBOL: Record<string, string> = { EUR: "€", USD: "$", GBP: "£", CZK: "Kč", PLN: "zł" };

export async function GET(_req: NextRequest, { params }: Params) {
  const { token } = await params;
  // Guard: tokens are 64 hex chars; reject anything else without touching the DB.
  if (!/^[a-f0-9]{32,80}$/.test(token)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const account = await prisma.account.findUnique({
    where: { shareToken: token },
    select: { id: true, name: true, clientName: true, currency: true, grossMarginPercent: true, shareLang: true },
  });
  if (!account) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const ago = (n: number) => { const d = new Date(); d.setUTCDate(d.getUTCDate() - n); return d.toISOString().slice(0, 10); };
  // 181 days so a 90-day window can be compared against the prior 90 days.
  const sinceYmd = ago(181);
  const todayYmd = new Date().toISOString().slice(0, 10);
  const win30Ymd = ago(30);
  const endYmd = ago(1);

  const [mRows, oRows, pRows, catalog] = await Promise.all([
    prisma.metricDaily.findMany({ where: { accountId: account.id, date: { gte: sinceYmd } }, select: { date: true, spend: true, clicks: true, conversions: true, conversionValue: true } }),
    prisma.orderDaily.findMany({ where: { accountId: account.id, date: { gte: sinceYmd } }, select: { date: true, orders: true, revenue: true } }),
    prisma.metricProductDaily.findMany({ where: { accountId: account.id, date: { gte: win30Ymd, lte: endYmd } }, select: { landingPageUrl: true, spend: true, clicks: true, conversions: true, conversionValue: true } }),
    prisma.product.findMany({ where: { accountId: account.id, imageUrl: { not: null } }, select: { title: true, imageUrl: true } }),
  ]);

  // Collapse per-campaign metric rows to per-day.
  const perDay = new Map<string, { date: string; spend: number; clicks: number; conversions: number; conversionValue: number }>();
  for (const r of mRows) {
    const e = perDay.get(r.date) ?? { date: r.date, spend: 0, clicks: 0, conversions: 0, conversionValue: 0 };
    e.spend += r.spend; e.clicks += r.clicks; e.conversions += r.conversions; e.conversionValue += r.conversionValue;
    perDay.set(r.date, e);
  }
  const marginPct = account.grossMarginPercent ?? null;
  // adRevenue = Google-Ads-attributed conversion value — the "omzet" every
  // account has, even without Shopify. Shopify revenue stays alongside it.
  const valueBetween = (fromYmd: string, toYmdExcl: string) => {
    let v = 0; for (const d of perDay.values()) if (d.date >= fromYmd && d.date < toYmdExcl) v += d.conversionValue; return v;
  };
  const windows = computeWindows([...perDay.values()], oRows, todayYmd, marginPct)
    .filter(w => [7, 30, 90].includes(w.days))
    .map(w => ({ days: w.days, spend: w.spend, conversions: w.conversions, adRevenue: valueBetween(ago(w.days), todayYmd), roas: w.roas, poas: w.poas, orders: w.orders, revenue: w.revenue, partial: w.partial }));

  // Period-over-period deltas (gamification): current window vs the equal window
  // before it. adRevenue delta works for every account; Shopify revenue when present.
  const revByDay = new Map(oRows.map(o => [o.date, o.revenue]));
  const sumBetween = (fromYmd: string, toYmdExcl: string) => {
    let spend = 0, conversions = 0, revenue = 0, adRevenue = 0;
    for (const d of perDay.values()) if (d.date >= fromYmd && d.date < toYmdExcl) { spend += d.spend; conversions += d.conversions; adRevenue += d.conversionValue; }
    for (const o of oRows) if (o.date >= fromYmd && o.date < toYmdExcl) revenue += o.revenue;
    return { spend, conversions, revenue, adRevenue };
  };
  const pct = (cur: number, prev: number): number | null => prev > 0 ? Math.round(((cur - prev) / prev) * 100) : null;
  const deltas: Record<number, { spend: number | null; revenue: number | null; adRevenue: number | null; conversions: number | null }> = {};
  for (const n of [7, 30, 90]) {
    const cur = sumBetween(ago(n), todayYmd);
    const prev = sumBetween(ago(2 * n), ago(n));
    deltas[n] = { spend: pct(cur.spend, prev.spend), revenue: pct(cur.revenue, prev.revenue), adRevenue: pct(cur.adRevenue, prev.adRevenue), conversions: pct(cur.conversions, prev.conversions) };
  }

  // Daily trend (last 30 days) — spend + revenue per day for a simple chart.
  const days = [...perDay.values()]
    .filter(d => d.date >= win30Ymd)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(d => ({ date: d.date, spend: Math.round(d.spend), conversions: Math.round(d.conversions), conversionValue: Math.round(d.conversionValue), revenue: Math.round(revByDay.get(d.date) ?? 0) }));

  // Bestsellers (last 30d): ONLY products that actually generated value —
  // homepage/root pages and zero-conversion rows are excluded, ranked by the
  // revenue they generated, top 5. This is a client-facing highlight list, not
  // an inventory dump.
  const isRootPage = (url: string, name: string) => /^https?:\/\/[^/]+\/?(\?|#|$)/.test(url) || /^home\s*page$/i.test(name);
  const pAgg = new Map<string, { url: string; name: string; spend: number; clicks: number; conversions: number; conversionValue: number }>();
  for (const r of pRows) {
    const e = pAgg.get(r.landingPageUrl) ?? { url: r.landingPageUrl, name: cleanProductLabel(r.landingPageUrl), spend: 0, clicks: 0, conversions: 0, conversionValue: 0 };
    e.spend += r.spend; e.clicks += r.clicks; e.conversions += r.conversions; e.conversionValue += r.conversionValue;
    pAgg.set(r.landingPageUrl, e);
  }
  const strict = [...pAgg.values()]
    .filter(p => !isRootPage(p.url, p.name) && p.conversions >= 1 && p.conversionValue > 0)
    .sort((a, b) => b.conversionValue - a.conversionValue)
    .slice(0, 5);
  // Fallback: stores whose ads land on collections/the root have no per-page
  // product rows that pass the strict filter — use real Shopify sales
  // (live or the "Sales by product" CSV) so the client still sees their
  // bestsellers instead of an empty section.
  let bestsellers = strict;
  let bestsellerSource: "ads" | "store" = "ads";
  if (!bestsellers.length) {
    const saleRows = await prisma.productSalesDaily.findMany({
      where: { accountId: account.id, date: { gte: win30Ymd, lte: endYmd } },
      select: { title: true, units: true, revenue: true },
    });
    const sAgg = new Map<string, { url: string; name: string; spend: number; clicks: number; conversions: number; conversionValue: number }>();
    for (const r of saleRows) {
      const e = sAgg.get(r.title) ?? { url: "", name: r.title, spend: 0, clicks: 0, conversions: 0, conversionValue: 0 };
      e.conversions += r.units; e.conversionValue += r.revenue;
      sAgg.set(r.title, e);
    }
    bestsellers = [...sAgg.values()].filter(p => p.conversionValue > 0)
      .sort((a, b) => b.conversionValue - a.conversionValue).slice(0, 5);
    if (bestsellers.length) bestsellerSource = "store";
  }

  // Product photos: Shopify catalog first (title match), else the product page's
  // own og:image (fetched + cached server-side) — so photos work without Shopify.
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const imgByTitle = new Map<string, string>();
  for (const c of catalog) { const k = norm(c.title); if (k && c.imageUrl && !imgByTitle.has(k)) imgByTitle.set(k, c.imageUrl); }
  const catalogImageFor = (name: string): string | null => {
    const k = norm(name);
    if (imgByTitle.has(k)) return imgByTitle.get(k)!;
    for (const [t, url] of imgByTitle) if (t.length > 5 && (t.includes(k) || k.includes(t))) return url;
    return null;
  };
  const needPage = bestsellers.filter(p => !catalogImageFor(p.name) && p.url).map(p => p.url);
  const pageImages = await getPageImages(account.id, needPage);
  const products = bestsellers.map(p => ({
    name: p.name,
    image: catalogImageFor(p.name) ?? (p.url ? pageImages.get(p.url) ?? null : null),
    value: Math.round(p.conversionValue),
    spend: Math.round(p.spend), clicks: p.clicks, conversions: Math.round(p.conversions),
    roas: p.spend > 0 ? +(p.conversionValue / p.spend).toFixed(2) : null,
  }));

  return NextResponse.json({
    account: { name: account.name, client: account.clientName },
    lang: account.shareLang === "en" ? "en" : "nl",
    currency: SYMBOL[account.currency] ?? `${account.currency} `,
    hasCommerce: oRows.some(o => o.revenue > 0),
    windows, deltas, days, products, bestsellerSource,
    generatedAt: new Date().toISOString(),
  });
}
