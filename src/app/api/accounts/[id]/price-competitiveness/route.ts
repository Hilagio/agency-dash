/**
 * GET /api/accounts/[id]/price-competitiveness
 *
 * Returns Merchant Center price competitiveness data for the account's
 * top products — your price vs the benchmark (median competitor price).
 *
 * Flow:
 *  1. Look up the Account's googleAdsId
 *  2. Discover linked Merchant Center account(s) via product_link
 *  3. Call Merchant Center Reports API (PriceCompetitivenessProductView)
 *  4. Return per-product price gap data
 *
 * If the stored OAuth token is missing the `content` scope, returns
 * { scopeMissing: true } with status 200 so the UI can show a reconnect prompt.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getMerchantCenterIds, fetchPriceCompetitiveness } from "@/lib/integrations/merchant-center";
import { fetchProductSpend } from "@/lib/integrations/google-ads";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;

  const account = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } });
  if (!account) return forbidden();

  if (!account.googleAdsId) {
    return NextResponse.json({ error: "No Google Ads account linked" }, { status: 422 });
  }

  // 1. Discover Merchant Center IDs (auto-discovery + stored fallback)
  let merchantIds: string[];
  try {
    merchantIds = await getMerchantCenterIds(account.googleAdsId, ctx.orgId, (account as {merchantCenterId?: string | null}).merchantCenterId);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Could not discover Merchant Center: ${msg}` }, { status: 502 });
  }

  if (merchantIds.length === 0) {
    return NextResponse.json({ noMerchantCenter: true, products: [], merchantIdMissing: true });
  }

  // 2. Fetch price competitiveness + product spend in parallel
  try {
    const [result, spendMap] = await Promise.all([
      fetchPriceCompetitiveness(merchantIds[0], ctx.orgId),
      fetchProductSpend(account.googleAdsId, ctx.orgId),
    ]);

    if (result.gcpNotRegistered) {
      return NextResponse.json({
        gcpNotRegistered:  true,
        gcpProjectId:      result.gcpProjectId,
        gcpProjectNumber:  result.gcpProjectNumber,
        merchantId:        result.merchantId,
        products:          [],
        scopeMissing:      false,
      });
    }

    if (result.scopeMissing) {
      return NextResponse.json({ scopeMissing: true, products: [], apiError: result.apiError });
    }

    // Merge spend data into each product row
    const products = result.products.map(p => ({
      ...p,
      spendMicros: spendMap.get(p.itemId) ?? 0,
    }));

    return NextResponse.json({
      merchantId:       result.merchantId,
      products,
      scopeMissing:     false,
      noMerchantCenter: false,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Merchant Center API error: ${msg}` }, { status: 502 });
  }
}
