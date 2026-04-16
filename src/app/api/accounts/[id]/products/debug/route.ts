import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { GoogleAdsApi } from "google-ads-api";

type Params = { params: Promise<{ id: string }> };

function last30Days() {
  const fmt   = (d: Date) => d.toISOString().slice(0, 10);
  const end   = new Date(); end.setDate(end.getDate() - 1);
  const start = new Date(); start.setDate(start.getDate() - 30);
  return { start: fmt(start), end: fmt(end) };
}

/**
 * GET /api/accounts/[id]/products/debug
 * Shows exactly what shopping_performance_view and the campaign query return.
 */
export async function GET(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;
  const account = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } });
  if (!account) return forbidden();

  const diag: Record<string, unknown> = {
    googleAdsId: account.googleAdsId,
  };

  if (!account.googleAdsId) {
    return NextResponse.json({ ...diag, error: "No googleAdsId on account" });
  }

  const cred = await prisma.oAuthCredential.findUnique({ where: { organizationId: ctx.orgId } }).catch(() => null);
  diag.hasRefreshToken = !!cred?.refreshToken;
  diag.loginCustomerId = cred?.loginCustomerId ?? process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID ?? null;

  if (!cred?.refreshToken && !process.env.GOOGLE_ADS_REFRESH_TOKEN) {
    return NextResponse.json({ ...diag, error: "No refresh token" });
  }

  const client = new GoogleAdsApi({
    client_id:       process.env.GOOGLE_ADS_CLIENT_ID!,
    client_secret:   process.env.GOOGLE_ADS_CLIENT_SECRET!,
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
  });

  const customer = client.Customer({
    customer_id:       account.googleAdsId,
    login_customer_id: cred?.loginCustomerId ?? process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
    refresh_token:     cred?.refreshToken ?? process.env.GOOGLE_ADS_REFRESH_TOKEN!,
  });

  const { start, end } = last30Days();
  diag.dateRange = { start, end };

  // 1. Campaign query (should match what fetchProductPerformance does)
  try {
    const campaignRows = await customer.query(`
      SELECT campaign.id, campaign.name, campaign.advertising_channel_type,
             metrics.cost_micros, metrics.conversions_value
      FROM campaign
      WHERE campaign.status = 'ENABLED'
        AND campaign.advertising_channel_type IN ('SHOPPING', 'PERFORMANCE_MAX')
        AND segments.date BETWEEN '${start}' AND '${end}'
    `);
    diag.campaignCount = campaignRows.length;
    diag.campaigns = campaignRows.slice(0, 5).map((r: Record<string, unknown>) => {
      const c = r.campaign as { id?: unknown; name?: unknown; advertising_channel_type?: unknown } | undefined;
      const m = r.metrics as { cost_micros?: unknown; conversions_value?: unknown } | undefined;
      return {
        id: c?.id,
        name: c?.name,
        type: c?.advertising_channel_type,
        cost: Number(m?.cost_micros ?? 0) / 1_000_000,
        revenue: Number(m?.conversions_value ?? 0),
      };
    });
  } catch (e) {
    diag.campaignError = String(e);
  }

  // 2. shopping_performance_view — no filter, just count + sample
  try {
    const productRows = await customer.query(`
      SELECT
        segments.product_item_id,
        segments.product_title,
        campaign.advertising_channel_type,
        metrics.clicks,
        metrics.impressions,
        metrics.conversions_value,
        metrics.cost_micros
      FROM shopping_performance_view
      WHERE segments.date BETWEEN '${start}' AND '${end}'
    `);
    diag.productRowCount = productRows.length;
    diag.productSample = productRows.slice(0, 5).map((r: Record<string, unknown>) => {
      const s = r.segments as { product_item_id?: unknown; product_title?: unknown } | undefined;
      const c = r.campaign as { advertising_channel_type?: unknown } | undefined;
      const m = r.metrics as { clicks?: unknown; impressions?: unknown; conversions_value?: unknown; cost_micros?: unknown } | undefined;
      return {
        itemId: s?.product_item_id,
        title: String(s?.product_title ?? "").slice(0, 50),
        type: c?.advertising_channel_type,
        clicks: m?.clicks,
        impressions: m?.impressions,
        revenue: m?.conversions_value,
        cost: Number(m?.cost_micros ?? 0) / 1_000_000,
      };
    });
  } catch (e) {
    diag.productError = String(e);
  }

  // 3. shopping_performance_view — with impressions > 0 (old filter)
  try {
    const withImpRows = await customer.query(`
      SELECT segments.product_item_id, metrics.impressions, metrics.cost_micros
      FROM shopping_performance_view
      WHERE segments.date BETWEEN '${start}' AND '${end}'
        AND metrics.impressions > 0
    `);
    diag.withImpressionsFilter = withImpRows.length;
  } catch (e) {
    diag.withImpressionsFilterError = String(e);
  }

  // 4. shopping_performance_view — with cost > 0 (broken filter)
  try {
    const withCostRows = await customer.query(`
      SELECT segments.product_item_id, metrics.impressions, metrics.cost_micros
      FROM shopping_performance_view
      WHERE segments.date BETWEEN '${start}' AND '${end}'
        AND metrics.cost_micros > 0
    `);
    diag.withCostFilter = withCostRows.length;
  } catch (e) {
    diag.withCostFilterError = String(e);
  }

  return NextResponse.json(diag, { status: 200 });
}
