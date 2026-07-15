/**
 * POST /api/shopify/webhooks — Shopify's mandatory GDPR compliance webhooks.
 *
 * Shopify requires every app to handle three topics. We verify the webhook HMAC
 * (over the raw body) and act by topic:
 *  - customers/data_request → we store NO individual customer PII (only
 *    aggregated daily totals), so there is nothing to return. Ack 200.
 *  - customers/redact → nothing per-customer to delete. Ack 200.
 *  - shop/redact → the merchant uninstalled; delete the Shopify-derived data we
 *    hold for that store (connection + order/sales aggregates + catalog). Ack 200.
 *
 * Configure this one URL in all three compliance-webhook fields in the Partner
 * Dashboard; the handler switches on the X-Shopify-Topic header.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { shopifyAppConfig, verifyShopifyWebhook } from "@/lib/integrations/shopify";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const cfg = shopifyAppConfig();
  if (!cfg) return NextResponse.json({ error: "not configured" }, { status: 401 });

  // Raw body is required for HMAC — read it before any parsing.
  const raw = await req.text();
  const hmac = req.headers.get("x-shopify-hmac-sha256");
  if (!verifyShopifyWebhook(raw, hmac, cfg.apiSecret)) {
    return NextResponse.json({ error: "invalid hmac" }, { status: 401 });
  }

  const topic = req.headers.get("x-shopify-topic") ?? "";
  let payload: { shop_domain?: string; shop_id?: number } = {};
  try { payload = JSON.parse(raw); } catch { /* body may be empty for some tests */ }

  if (topic === "shop/redact") {
    const shopDomain = payload.shop_domain;
    if (shopDomain) {
      const conn = await prisma.shopifyConnection.findUnique({ where: { shopDomain }, select: { accountId: true } });
      if (conn) {
        const accountId = conn.accountId;
        // Delete the Shopify-derived data for this store. Google Ads spine
        // (MetricDaily, ProductAdsDaily) is not the shop's customer data and stays.
        await prisma.$transaction([
          prisma.orderDaily.deleteMany({ where: { accountId } }),
          prisma.productSalesDaily.deleteMany({ where: { accountId } }),
          prisma.product.deleteMany({ where: { accountId } }),
          prisma.shopifyConnection.delete({ where: { accountId } }),
        ]);
      }
    }
  }
  // customers/data_request and customers/redact: we hold no per-customer PII —
  // nothing to return or delete. All three topics simply acknowledge 200.

  return new NextResponse(null, { status: 200 });
}
