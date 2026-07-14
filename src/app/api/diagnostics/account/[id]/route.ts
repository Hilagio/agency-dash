/**
 * GET /api/diagnostics/account/[id] — the diagnosis for one account (§9).
 *
 * Reads the latest *diagnostics* AccountStatus (source:"diagnostics"), runs the
 * pure engine, and returns a Diagnosis. Never blank: if no diagnostics status
 * exists yet, it computes one on the fly so the workspace always has something
 * honest to show.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/auth";
import { buildDiagnosis, cleanProductLabel } from "@/lib/diagnostics/engine";
import { computeAccountSignals } from "@/lib/diagnostics/run-signals";
import { computeWindows, detectTrend } from "@/lib/diagnostics/windows";
import { buildProductGroups, type AdsVariantRow, type SalesVariantRow } from "@/lib/diagnostics/products";
import { shopifyAppConfig } from "@/lib/integrations/shopify";
import type { Signal } from "@/lib/diagnostics/signals";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

const CURRENCY_SYMBOL: Record<string, string> = { EUR: "€", USD: "$", GBP: "£" };
const symbol = (code: string) => CURRENCY_SYMBOL[code] ?? `${code} `;

interface DiagnosticsMetrics {
  source?: string;
  dataVerified?: boolean;
  window?: { spend: number; conversions: number; conversionValue: number; days: number };
  commerce?: { orders: number; revenue: number; currency: string } | null;
  reconciliation?: { adsConversions: number; actualOrders: number } | null;
  grossMarginPct?: number | null;
  signals?: Signal[];
}

function parseDiagnostics(metricsJson: string): DiagnosticsMetrics | null {
  try {
    const m = JSON.parse(metricsJson) as DiagnosticsMetrics;
    return m?.source === "diagnostics" ? m : null;
  } catch {
    return null;
  }
}

export async function GET(_req: Request, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const { id } = await params;
  try {
    return await handle(id, ctx.orgId);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[diagnostics/account/${id}] failed:`, message, err);
    // Surface the real reason instead of a generic "couldn't load".
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function handle(id: string, orgId: string) {
  const account = await prisma.account.findFirst({
    where: { id, organizationId: orgId },
    select: {
      id: true, name: true, clientName: true, currency: true, dataVerified: true,
      roasFloor: true, grossMarginPercent: true, minSpendForEval: true, minConversionsForEval: true,
    },
  });
  if (!account) return NextResponse.json({ error: "This account isn't in your organization, or doesn't exist." }, { status: 404 });

  // Latest diagnostics status; if the newest status isn't a diagnostics one,
  // scan back a little before falling back to an on-the-fly compute.
  const recent = await prisma.accountStatus.findMany({
    where: { accountId: id },
    orderBy: { computedAt: "desc" },
    take: 10,
  });
  let status = recent.find(s => parseDiagnostics(s.metrics));

  if (!status) {
    // Never blank (§resilience): compute one now.
    await computeAccountSignals({
      id: account.id, name: account.name, roasFloor: account.roasFloor,
      grossMarginPercent: account.grossMarginPercent, minSpendForEval: account.minSpendForEval,
      minConversionsForEval: account.minConversionsForEval, dataVerified: account.dataVerified,
    }).catch(() => null);
    status = await prisma.accountStatus.findFirst({
      where: { accountId: id }, orderBy: { computedAt: "desc" },
    }) ?? undefined;
  }

  const diag = status ? parseDiagnostics(status.metrics) : null;
  const signals = diag?.signals ?? [];

  // Multi-window trend (§4) — computed fresh from up to 90 days of spine.
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 91);
  const sinceYmd = since.toISOString().slice(0, 10);
  const todayYmd = new Date().toISOString().slice(0, 10);
  const marginPct = diag?.grossMarginPct ?? account.grossMarginPercent ?? null;
  const [mRows, oRows] = await Promise.all([
    prisma.metricDaily.findMany({
      where: { accountId: id, date: { gte: sinceYmd } },
      select: { date: true, spend: true, clicks: true, conversions: true, conversionValue: true },
    }),
    prisma.orderDaily.findMany({
      where: { accountId: id, date: { gte: sinceYmd } },
      select: { date: true, orders: true, revenue: true },
    }),
  ]);
  // Collapse per-campaign metric rows to per-day before windowing.
  const perDay = new Map<string, { date: string; spend: number; clicks: number; conversions: number; conversionValue: number }>();
  for (const r of mRows) {
    const e = perDay.get(r.date) ?? { date: r.date, spend: 0, clicks: 0, conversions: 0, conversionValue: 0 };
    e.spend += r.spend; e.clicks += r.clicks; e.conversions += r.conversions; e.conversionValue += r.conversionValue;
    perDay.set(r.date, e);
  }
  const windows = computeWindows([...perDay.values()], oRows, todayYmd, marginPct);
  const trend = detectTrend(windows);

  // Product-level join (§4/§8): what the ads did per product vs what sold.
  // Current window = last 7 days (ends yesterday), matching the signal window.
  const prodStart = new Date(); prodStart.setUTCDate(prodStart.getUTCDate() - 7);
  const prodStartYmd = prodStart.toISOString().slice(0, 10);
  const prodEndYmd = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  const [adRows, saleRows] = await Promise.all([
    prisma.productAdsDaily.findMany({ where: { accountId: id, date: { gte: prodStartYmd, lte: prodEndYmd } } }),
    prisma.productSalesDaily.findMany({ where: { accountId: id, date: { gte: prodStartYmd, lte: prodEndYmd } } }),
  ]);
  // Aggregate to variant grain across the window (ads: per item_id; sales: per
  // product+variant), then roll up to product inside buildProductGroups.
  const adsAgg = new Map<string, AdsVariantRow>();
  for (const r of adRows) {
    const e = adsAgg.get(r.itemId) ?? { itemId: r.itemId, title: r.title, spend: 0, clicks: 0, conversions: 0, conversionValue: 0 };
    e.spend += r.spend; e.clicks += r.clicks; e.conversions += r.conversions; e.conversionValue += r.conversionValue;
    if (!e.title && r.title) e.title = r.title;
    adsAgg.set(r.itemId, e);
  }
  const salesAgg = new Map<string, SalesVariantRow>();
  for (const r of saleRows) {
    const k = `${r.productId}|${r.variantId}`;
    const e = salesAgg.get(k) ?? { productId: r.productId, variantId: r.variantId, title: r.title, variantTitle: r.variantTitle, units: 0, revenue: 0 };
    e.units += r.units; e.revenue += r.revenue;
    if (!e.title && r.title) e.title = r.title;
    if (!e.variantTitle && r.variantTitle) e.variantTitle = r.variantTitle;
    salesAgg.set(k, e);
  }
  const products = (adsAgg.size || salesAgg.size)
    ? buildProductGroups([...adsAgg.values()], [...salesAgg.values()], { marginPct })
    : null;

  // Product performance from landing pages (§4.7) — the product data every
  // ecommerce account has from Google Ads, even without a feed or Shopify.
  const pageRows = await prisma.metricProductDaily.findMany({
    where: { accountId: id, date: { gte: prodStartYmd, lte: prodEndYmd } },
    select: { landingPageUrl: true, clicks: true, spend: true, conversions: true, conversionValue: true },
  });
  const pageAgg = new Map<string, { url: string; name: string; spend: number; clicks: number; conversions: number; conversionValue: number }>();
  for (const r of pageRows) {
    const e = pageAgg.get(r.landingPageUrl) ?? { url: r.landingPageUrl, name: cleanProductLabel(r.landingPageUrl), spend: 0, clicks: 0, conversions: 0, conversionValue: 0 };
    e.spend += r.spend; e.clicks += r.clicks; e.conversions += r.conversions; e.conversionValue += r.conversionValue;
    pageAgg.set(r.landingPageUrl, e);
  }
  const productPages = [...pageAgg.values()]
    .map(p => ({ ...p, roas: p.spend > 0 ? p.conversionValue / p.spend : null }))
    .sort((a, b) => b.spend - a.spend)
    .slice(0, 20);

  // Shopify connection status — drives the connect card on the workspace.
  const conn = await prisma.shopifyConnection.findUnique({
    where: { accountId: id }, select: { shopDomain: true, lastSyncAt: true },
  });
  const shopify = {
    appConfigured: !!shopifyAppConfig(),
    connected: !!conn,
    shopDomain: conn?.shopDomain ?? null,
    lastSyncAt: conn?.lastSyncAt ?? null,
  };

  const diagnosis = buildDiagnosis({
    accountId: account.id,
    name: account.name,
    clientName: account.clientName,
    status: (status?.status as "green" | "yellow" | "red") ?? "green",
    dataVerified: diag?.dataVerified ?? account.dataVerified,
    computedAt: (status?.computedAt ?? new Date()).toISOString(),
    signals,
    window: diag?.window,
    currency: symbol(account.currency),
    reconciliation: diag?.reconciliation ?? null,
    commerce: diag?.commerce ?? null,
    grossMarginPct: diag?.grossMarginPct ?? account.grossMarginPercent ?? null,
  });

  return NextResponse.json({ diagnosis, windows, trend, shopify, products, productPages, hasData: !!diag });
}
