/**
 * POST /api/diagnostics/account/[id]/refresh — pull fresh data for ONE account
 * and recompute its diagnosis, on demand. This is the "open account → one click →
 * great output" primitive: no curl, no waiting for the nightly cron.
 *
 * Body (optional): { "days": 30 } — trailing window to pull.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { ingestAccountSpine } from "@/lib/diagnostics/ingest";
import { ingestAccountOrders } from "@/lib/diagnostics/orders";
import { computeAccountSignals } from "@/lib/diagnostics/run-signals";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;

  const body = await req.json().catch(() => ({}));
  const days = Number.isFinite(Number(body?.days)) ? Math.min(365, Math.max(1, Math.floor(Number(body.days)))) : 30;

  const account = await prisma.account.findFirst({
    where: { id, organizationId: ctx.orgId },
    select: {
      id: true, name: true, googleAdsId: true, organizationId: true,
      roasFloor: true, grossMarginPercent: true, minSpendForEval: true, minConversionsForEval: true, dataVerified: true,
    },
  });
  if (!account) return forbidden();

  // Google Ads spine (catches its own errors → surfaced, not thrown).
  const spine = await ingestAccountSpine(
    { id: account.id, googleAdsId: account.googleAdsId, organizationId: account.organizationId }, days,
  );
  // Shopify orders + product sales (skips cleanly if no store connected).
  const orders = await ingestAccountOrders(account.id, days);
  // Recompute the diagnosis from whatever we just pulled.
  await computeAccountSignals({
    id: account.id, name: account.name, roasFloor: account.roasFloor,
    grossMarginPercent: account.grossMarginPercent, minSpendForEval: account.minSpendForEval,
    minConversionsForEval: account.minConversionsForEval, dataVerified: account.dataVerified,
  }).catch(() => null);

  const gotData = spine.metrics > 0 || spine.productAds > 0 || spine.searchTerms > 0;
  return NextResponse.json({
    ok: !spine.error && gotData,
    days,
    error: spine.error ?? null,
    pulled: {
      metricDays: spine.metrics, productRows: spine.productAds, searchTerms: spine.searchTerms, changeEvents: spine.changeEvents,
      orderDays: orders.orderDays, productSales: orders.productSaleRows,
      shopify: orders.skipped === "no-connection" ? "not connected" : (orders.error ? `error: ${orders.error}` : "ok"),
    },
  });
}
