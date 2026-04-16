/**
 * GET /api/accounts/[id]/products
 *
 * Returns Shopping / PMax product performance for the last 30 days.
 * Includes campaign-level overview + per-product metrics.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { fetchProductPerformance } from "@/lib/integrations/google-ads";
import { getMerchantCenterIds, fetchMerchantCenterProductList } from "@/lib/integrations/merchant-center";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;

  const account = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } });
  if (!account) return forbidden();

  try {
    const data = await fetchProductPerformance(account.googleAdsId, ctx.orgId);

    // When shopping_performance_view returned nothing (PMax campaigns not serving
    // on Shopping surface), fall back to the Merchant Center product catalog so the
    // user can at least see what products are in their feed.
    if (data.noShoppingFeedData && account.googleAdsId) {
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
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Google Ads API error: ${msg}` }, { status: 502 });
  }
}
