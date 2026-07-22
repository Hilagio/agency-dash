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

  const since = new Date(); since.setUTCDate(since.getUTCDate() - 91);
  const sinceYmd = since.toISOString().slice(0, 10);
  const todayYmd = new Date().toISOString().slice(0, 10);
  const win30 = new Date(); win30.setUTCDate(win30.getUTCDate() - 30);
  const win30Ymd = win30.toISOString().slice(0, 10);
  const endYmd = new Date(Date.now() - 864e5).toISOString().slice(0, 10);

  const [mRows, oRows, pRows] = await Promise.all([
    prisma.metricDaily.findMany({ where: { accountId: account.id, date: { gte: sinceYmd } }, select: { date: true, spend: true, clicks: true, conversions: true, conversionValue: true } }),
    prisma.orderDaily.findMany({ where: { accountId: account.id, date: { gte: sinceYmd } }, select: { date: true, orders: true, revenue: true } }),
    prisma.metricProductDaily.findMany({ where: { accountId: account.id, date: { gte: win30Ymd, lte: endYmd } }, select: { landingPageUrl: true, spend: true, clicks: true, conversions: true, conversionValue: true } }),
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

  // Daily trend (last 30 days) — spend + revenue per day for a simple chart.
  const revByDay = new Map(oRows.map(o => [o.date, (o as { revenue: number }).revenue]));
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
  // Sort by revenue so a client-facing "best performing" list actually leads
  // with the best products (fall back to spend when no revenue is attributed).
  const products = [...pAgg.values()]
    .sort((a, b) => (b.conversionValue - a.conversionValue) || (b.spend - a.spend)).slice(0, 8)
    .map(p => ({ name: p.name, spend: Math.round(p.spend), clicks: p.clicks, conversions: Math.round(p.conversions), roas: p.spend > 0 ? +(p.conversionValue / p.spend).toFixed(2) : null }));

  return NextResponse.json({
    account: { name: account.name, client: account.clientName },
    lang: account.shareLang === "en" ? "en" : "nl",
    currency: SYMBOL[account.currency] ?? `${account.currency} `,
    hasCommerce: oRows.some(o => o.revenue > 0),
    windows, days, products,
    generatedAt: new Date().toISOString(),
  });
}
