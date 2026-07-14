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
import { ingestOrgSpine } from "@/lib/diagnostics/ingest";
import { ingestOrgOrders } from "@/lib/diagnostics/orders";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

function isCronRequest(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`
      || req.headers.get("x-cron-secret") === secret;
}

async function readDays(req: NextRequest): Promise<number> {
  const body = await req.json().catch(() => ({}));
  const d = Number(body?.days);
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
        metrics: t.metrics + r.metrics, products: t.products + r.products,
        searchTerms: t.searchTerms + r.searchTerms, changeEvents: t.changeEvents + r.changeEvents,
      }),
      { metrics: 0, products: 0, searchTerms: 0, changeEvents: 0 },
    ),
    orders: {
      connected: orders.filter(o => o.skipped !== "no-connection").length,
      orderDays: orders.reduce((s, o) => s + o.orderDays, 0),
      failed: orders.filter(o => o.error).map(o => ({ accountId: o.accountId, error: o.error })),
    },
  };
}

export async function POST(req: NextRequest) {
  const days = await readDays(req);

  if (isCronRequest(req)) {
    const orgs = await prisma.oAuthCredential.findMany({ select: { organizationId: true } });
    const results = [];
    for (const o of orgs) {
      const [spine, orders] = [await ingestOrgSpine(o.organizationId, days), await ingestOrgOrders(o.organizationId, days)];
      results.push({ organizationId: o.organizationId, ...summarize(spine, orders) });
    }
    return NextResponse.json({ mode: "cron", days, orgs: results.length, results });
  }

  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const [spine, orders] = [await ingestOrgSpine(ctx.orgId, days), await ingestOrgOrders(ctx.orgId, days)];
  return NextResponse.json({ mode: "manual", days, ...summarize(spine, orders) });
}
