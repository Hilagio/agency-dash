/**
 * GET /api/accounts/[id]/products
 *
 * Returns Shopping / PMax product performance for the last 30 days.
 * Includes campaign-level overview + per-product metrics.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { fetchProductPerformance, describeGoogleAdsError } from "@/lib/integrations/google-ads";
import { getMerchantCenterIds, fetchMerchantCenterProductList } from "@/lib/integrations/merchant-center";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;

  const account = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } });
  if (!account) return forbidden();

  const page     = Math.max(0, parseInt(new URL(req.url).searchParams.get("page") ?? "0"));
  const pageSize = 10;

  try {
    const data = await fetchProductPerformance(account.googleAdsId, ctx.orgId, page * pageSize, pageSize);

    // When shopping_performance_view returned nothing, fall back to MC catalog
    // (only on page 0 — subsequent pages mean Shopping data exists).
    if (page === 0 && data.noShoppingFeedData && account.googleAdsId) {
      const mcId = (account as { merchantCenterId?: string | null }).merchantCenterId
        ?? (await getMerchantCenterIds(account.googleAdsId, ctx.orgId).catch(() => []))[0];

      if (mcId) {
        const mcProducts = await fetchMerchantCenterProductList(mcId, ctx.orgId);
        if (mcProducts.length > 0) {
          return NextResponse.json({
            ...data,
            noShoppingFeedData: false,
            fromMerchantFeed: true,
            products: mcProducts.map(p => ({
              itemId:      p.itemId,
              title:       p.title,
              brand:       p.brand,
              clicks:      0,
              impressions: 0,
              ctr:         0,
              conversions: 0,
              revenue:     0,
              cost:        0,
              roas:        0,
              cpc:         0,
            })),
          });
        }
      }
    }

    return NextResponse.json(data);
  } catch (err) {
    const msg = describeGoogleAdsError(err);
    return NextResponse.json({ error: `Google Ads API error: ${msg}` }, { status: 502 });
  }
}
