/**
 * GET /api/accounts/[id]/product-rows
 * Returns RawRow[] for the product engine (90-day shopping_performance_view).
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { fetchProductEngineRows, extractGoogleAdsError } from "@/lib/integrations/google-ads";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;

  const account = await prisma.account.findFirst({
    where: { id, organizationId: ctx.orgId },
    select: { googleAdsId: true, name: true },
  });
  if (!account) return forbidden();
  if (!account.googleAdsId) {
    return NextResponse.json({ error: "No Google Ads account linked" }, { status: 400 });
  }

  const period = (req.nextUrl.searchParams.get("period") as "LAST_30_DAYS" | "LAST_60_DAYS" | "LAST_90_DAYS") ?? "LAST_90_DAYS";

  try {
    const rows = await fetchProductEngineRows(account.googleAdsId, ctx.orgId, period);
    return NextResponse.json(rows);
  } catch (err) {
    const msg = extractGoogleAdsError(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
