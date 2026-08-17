/**
 * POST /api/diagnostics/ingest — pull the diagnostic spine from Google Ads.
 *
 * Triggers:
 *  1. Session (manual) — ingests the caller's organization.
 *  2. Nightly cron — Authorization: Bearer $CRON_SECRET — ingests every org with
 *     Google Ads connected.
 *
 * Body (optional): { "days": 14 } — trailing window to (re)fetch. Use a larger
 * value (e.g. 90) for a first back-fill.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized } from "@/lib/auth";
import { ingestOrgSpine, ingestAccountSpine } from "@/lib/diagnostics/ingest";
import { ingestOrgOrders, ingestAccountOrders } from "@/lib/diagnostics/orders";

export const dynamic = "force-dynamic";
export const maxDuration = 800;

function isCronRequest(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`
      || req.headers.get("x-cron-secret") === secret;
}

function clampDays(v: unknown): number {
  const d = Number(v);
  return Number.isFinite(d) && d > 0 && d <= 365 ? Math.floor(d) : 14;
}

function summarize(
  results: Awaited<ReturnType<typeof ingestOrgSpine>>,
  orders: Awaited<ReturnType<typeof ingestOrgOrders>>,
) {
  return {
    accounts: results.length,
    failed: results.filter(r => r.error).map(r => ({ accountId: r.accountId, error: r.error })),
    totals: results.reduce(
      (t, r) => ({
        metrics: t.metrics + r.metrics, products: t.products + r.products, productAds: t.productAds + r.productAds,
        searchTerms: t.searchTerms + r.searchTerms, changeEvents: t.changeEvents + r.changeEvents,
      }),
      { metrics: 0, products: 0, productAds: 0, searchTerms: 0, changeEvents: 0 },
    ),
    orders: {
      connected: orders.filter(o => o.skipped !== "no-connection").length,
      orderDays: orders.reduce((s, o) => s + o.orderDays, 0),
      productSaleRows: orders.reduce((s, o) => s + o.productSaleRows, 0),
      catalogProducts: orders.reduce((s, o) => s + o.catalogProducts, 0),
      failed: orders.filter(o => o.error).map(o => ({ accountId: o.accountId, error: o.error })),
    },
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const days = clampDays((body as Record<string, unknown>)?.days);

  if (isCronRequest(req)) {
    // BATCHED: the caller (nightly script) loops offset until done:true. Each
    // request ingests a small slice of accounts SEQUENTIALLY — one account's raw
    // Google Ads data in memory at a time — so a large portfolio can't OOM the
    // container (which is what crashed the single-big-request version).
    const offset = Math.max(0, Math.floor(Number((body as Record<string, unknown>)?.offset) || 0));
    const limit = Math.min(50, Math.max(1, Math.floor(Number((body as Record<string, unknown>)?.limit) || 10)));

    const creds = await prisma.oAuthCredential.findMany({ select: { organizationId: true } });
    const orgIds = creds.map(c => c.organizationId);
    const accounts = await prisma.account.findMany({
      where: { organizationId: { in: orgIds }, active: true, archived: false },
      select: { id: true, name: true, googleAdsId: true, organizationId: true },
      orderBy: { id: "asc" }, // stable order so paging is consistent across calls
    });
    const total = accounts.length;
    const batch = accounts.slice(offset, offset + limit);

    // listOnly: name the accounts in a slice WITHOUT ingesting — the nightly
    // script uses this to report which account a crashing offset belongs to.
    if ((body as Record<string, unknown>)?.listOnly) {
      return NextResponse.json({
        mode: "cron", total, offset,
        accounts: batch.map((a, i) => ({ offset: offset + i, name: a.name, googleAdsId: a.googleAdsId })),
      });
    }

    let metrics = 0, orderDays = 0, failed = 0;
    for (const a of batch) {
      try {
        const r = await ingestAccountSpine({ id: a.id, googleAdsId: a.googleAdsId, organizationId: a.organizationId }, days);
        metrics += r.metrics ?? 0;
        if (r.error) failed++;
      } catch { failed++; }
      try { const o = await ingestAccountOrders(a.id, days); orderDays += o.orderDays ?? 0; } catch { /* best-effort */ }
    }

    const nextOffset = offset + batch.length;
    const done = nextOffset >= total;
    return NextResponse.json({ mode: "cron", days, total, offset, processed: batch.length, nextOffset, done, metrics, orderDays, failed });
  }

  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const [spine, orders] = [await ingestOrgSpine(ctx.orgId, days), await ingestOrgOrders(ctx.orgId, days)];
  return NextResponse.json({ mode: "manual", days, ...summarize(spine, orders) });
}
