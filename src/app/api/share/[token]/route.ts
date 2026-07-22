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
  const windows = computeWindows([...perDay.values()], oRows, todayYmd, marginPct)
    .filter(w => [7, 30, 90].includes(w.days))
    .map(w => ({ days: w.days, spend: w.spend, conversions: w.conversions, roas: w.roas, poas: w.poas, orders: w.orders, revenue: w.revenue, partial: w.partial }));

  // Period-over-period deltas (gamification): current window vs the equal window
  // before it, for spend / revenue / conversions. Null when there's no prior data.
  const revByDay = new Map(oRows.map(o => [o.date, o.revenue]));
  const sumBetween = (fromYmd: string, toYmdExcl: string) => {
    let spend = 0, conversions = 0, revenue = 0;
    for (const d of perDay.values()) if (d.date >= fromYmd && d.date < toYmdExcl) { spend += d.spend; conversions += d.conversions; }
    for (const o of oRows) if (o.date >= fromYmd && o.date < toYmdExcl) revenue += o.revenue;
    return { spend, conversions, revenue };
  };
  const pct = (cur: number, prev: number): number | null => prev > 0 ? Math.round(((cur - prev) / prev) * 100) : null;
  const deltas: Record<number, { spend: number | null; revenue: number | null; conversions: number | null }> = {};
  for (const n of [7, 30, 90]) {
    const cur = sumBetween(ago(n), todayYmd);
    const prev = sumBetween(ago(2 * n), ago(n));
    deltas[n] = { spend: pct(cur.spend, prev.spend), revenue: pct(cur.revenue, prev.revenue), conversions: pct(cur.conversions, prev.conversions) };
  }

  // Daily trend (last 30 days) — spend + revenue per day for a simple chart.
  const days = [...perDay.values()]
    .filter(d => d.date >= win30Ymd)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(d => ({ date: d.date, spend: Math.round(d.spend), conversions: Math.round(d.conversions), conversionValue: Math.round(d.conversionValue), revenue: Math.round(revByDay.get(d.date) ?? 0) }));

  // Top products (last 30d) by ad spend — client-safe labels, no internal flags.
  const pAgg = new Map<string, { name: string; spend: number; clicks: number; conversions: number; conversionValue: number }>();
  for (const r of pRows) {
    const e = pAgg.get(r.landingPageUrl) ?? { name: cleanProductLabel(r.landingPageUrl), spend: 0, clicks: 0, conversions: 0, conversionValue: 0 };
    e.spend += r.spend; e.clicks += r.clicks; e.conversions += r.conversions; e.conversionValue += r.conversionValue;
    pAgg.set(r.landingPageUrl, e);
  }
  // Product images from the Shopify catalog, matched to the landing-page product
  // by normalised title (best-effort; falls back to a placeholder in the UI).
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const imgByTitle = new Map<string, string>();
  for (const c of catalog) { const k = norm(c.title); if (k && c.imageUrl && !imgByTitle.has(k)) imgByTitle.set(k, c.imageUrl); }
  const imageFor = (name: string): string | null => {
    const k = norm(name);
    if (imgByTitle.has(k)) return imgByTitle.get(k)!;
    for (const [t, url] of imgByTitle) if (t.length > 5 && (t.includes(k) || k.includes(t))) return url;
    return null;
  };
  // Sort by revenue so a client-facing "best performing" list actually leads
  // with the best products (fall back to spend when no revenue is attributed).
  const products = [...pAgg.values()]
    .sort((a, b) => (b.conversionValue - a.conversionValue) || (b.spend - a.spend)).slice(0, 8)
    .map(p => ({ name: p.name, image: imageFor(p.name), spend: Math.round(p.spend), clicks: p.clicks, conversions: Math.round(p.conversions), roas: p.spend > 0 ? +(p.conversionValue / p.spend).toFixed(2) : null }));

  return NextResponse.json({
    account: { name: account.name, client: account.clientName },
    lang: account.shareLang === "en" ? "en" : "nl",
    currency: SYMBOL[account.currency] ?? `${account.currency} `,
    hasCommerce: oRows.some(o => o.revenue > 0),
    windows, deltas, days, products,
    generatedAt: new Date().toISOString(),
  });
}
