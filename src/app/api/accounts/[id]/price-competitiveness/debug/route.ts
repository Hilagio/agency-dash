import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { getMerchantCenterIds } from "@/lib/integrations/merchant-center";

type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/accounts/[id]/price-competitiveness/debug
 * Raw diagnostic — shows token status, scope, MC ID, and exact API responses.
 * Remove after debugging.
 */
export async function GET(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;
  const account = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } });
  if (!account) return forbidden();

  const diag: Record<string, unknown> = {};

  // 1. Credential check
  const cred = await prisma.oAuthCredential.findUnique({ where: { organizationId: ctx.orgId } }).catch(() => null);
  diag.hasRefreshToken   = !!cred?.refreshToken;
  diag.refreshTokenFirst12 = cred?.refreshToken?.slice(0, 12) ?? null;

  if (!cred?.refreshToken) {
    return NextResponse.json({ ...diag, error: "No refresh token in DB" });
  }

  // 2. Token exchange — captures scope
  let accessToken: string | null = null;
  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id:     process.env.GOOGLE_ADS_CLIENT_ID!,
        client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
        refresh_token: cred.refreshToken,
        grant_type:    "refresh_token",
      }),
    });
    const tj = await tokenRes.json() as { access_token?: string; error?: string; scope?: string };
    diag.tokenStatus     = tokenRes.status;
    diag.tokenError      = tj.error ?? null;
    diag.tokenScopes     = tj.scope ?? null;
    diag.hasContentScope = (tj.scope ?? "").includes("content");
    accessToken          = tj.access_token ?? null;
    diag.hasAccessToken  = !!accessToken;
  } catch (e) {
    diag.tokenException = String(e);
  }

  if (!accessToken) return NextResponse.json(diag);

  // 3. Merchant Center ID
  const storedMcId = (account as { merchantCenterId?: string | null }).merchantCenterId;
  diag.storedMerchantId = storedMcId;
  const mcIds = await getMerchantCenterIds(account.googleAdsId, ctx.orgId, storedMcId).catch(() => []);
  diag.discoveredMerchantIds = mcIds;
  const merchantId = mcIds[0] ?? storedMcId ?? null;
  diag.merchantIdUsed = merchantId;

  if (!merchantId) return NextResponse.json(diag);

  // 4. Content API v2.1 reports/search
  const q21 = "SELECT product_view.id, product_view.title, product_view.price_micros, product_view.currency_code, price_competitiveness.country_code, price_competitiveness.benchmark_price_micros, price_competitiveness.benchmark_price_currency_code FROM PriceCompetitivenessProductView";
  const r21 = await fetch(
    `https://shoppingcontent.googleapis.com/content/v2.1/${merchantId}/reports/search`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query: q21, pageSize: 3 }),
    }
  );
  diag.v21_status = r21.status;
  diag.v21_body   = (await r21.text()).slice(0, 1000);

  // 5. Merchant Center Reports API v1
  const q1 = "SELECT product_view.id, product_view.price_micros, price_competitiveness.benchmark_price_micros FROM price_competitiveness_product_view";
  const r1 = await fetch(
    `https://merchantapi.googleapis.com/reports/v1/accounts/${merchantId}/reports:search`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query: q1, pageSize: 3 }),
    }
  );
  diag.v1_status = r1.status;
  diag.v1_body   = (await r1.text()).slice(0, 1000);

  return NextResponse.json(diag, { status: 200 });
}
