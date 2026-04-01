/**
 * Merchant Center integration
 *
 * Uses the Merchant Center Reports API (Content API for Shopping) to fetch
 * price competitiveness data for products linked to a Google Ads account.
 *
 * Requires the `content` OAuth scope — users may need to reconnect Google if
 * they authenticated before this scope was added.
 */

import { GoogleAdsApi } from "google-ads-api";
import { prisma } from "@/lib/db";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface PriceCompRow {
  itemId:              string;
  title:               string;
  brand:               string;
  yourPriceMicros:     number;
  /** Sale price in micros — 0 if no active sale */
  salePriceMicros:     number;
  /** Effective price used for benchmark comparison (sale if active, else regular) */
  effectivePriceMicros: number;
  benchmarkMicros:     number;
  currencyCode:        string;
  countryCode:         string;
  /** Positive = above benchmark (expensive), negative = below (cheap) */
  priceDiffPercent:    number;
  status:              "competitive" | "above" | "well_above" | "below";
  /** Google Ads spend on this item over last 30 days (micros); 0 = no data */
  spendMicros:         number;
}

export interface PriceCompetitivenessResult {
  merchantId:   string;
  products:     PriceCompRow[];
  /** True if the content scope appears to be missing from the token */
  scopeMissing: boolean;
}

// ─── OAuth helpers ─────────────────────────────────────────────────────────────

async function getRefreshToken(orgId?: string): Promise<string> {
  const cred = orgId
    ? await prisma.oAuthCredential.findUnique({ where: { organizationId: orgId } }).catch(() => null)
    : await prisma.oAuthCredential.findFirst().catch(() => null);
  if (cred?.refreshToken) return cred.refreshToken;
  if (process.env.GOOGLE_ADS_REFRESH_TOKEN) return process.env.GOOGLE_ADS_REFRESH_TOKEN;
  throw new Error("No Google refresh token configured. Complete OAuth at /api/auth/google-ads");
}

async function getAccessToken(refreshToken: string): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id:     process.env.GOOGLE_ADS_CLIENT_ID!,
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type:    "refresh_token",
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Token exchange failed (${res.status}): ${body}`);
  }

  const json = await res.json() as { access_token?: string; error?: string };
  if (!json.access_token) {
    throw new Error(`Token exchange returned no access_token: ${json.error ?? "unknown"}`);
  }
  return json.access_token;
}

// ─── Merchant Center ID discovery ─────────────────────────────────────────────

/**
 * Queries the Google Ads `product_link` resource to find the Merchant Center
 * accounts linked to this Google Ads customer.
 */
export async function getMerchantCenterIds(
  customerId: string,
  orgId?: string
): Promise<string[]> {
  const cred = orgId
    ? await prisma.oAuthCredential.findUnique({ where: { organizationId: orgId } }).catch(() => null)
    : await prisma.oAuthCredential.findFirst().catch(() => null);

  const refreshToken    = cred?.refreshToken ?? process.env.GOOGLE_ADS_REFRESH_TOKEN ?? "";
  const loginCustomerId = cred?.loginCustomerId ?? process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID;

  if (!refreshToken) return [];

  try {
    const client   = new GoogleAdsApi({
      client_id:       process.env.GOOGLE_ADS_CLIENT_ID!,
      client_secret:   process.env.GOOGLE_ADS_CLIENT_SECRET!,
      developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
    });
    const customer = client.Customer({
      customer_id:       customerId,
      login_customer_id: loginCustomerId,
      refresh_token:     refreshToken,
    });

    const rows = await customer.query(`
      SELECT
        product_link.product_link_id,
        product_link.type,
        product_link.merchant_center.merchant_center_id
      FROM product_link
      WHERE product_link.type = 'MERCHANT_CENTER'
    `);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rows.map((r: any) => String(r.product_link?.merchant_center?.merchant_center_id ?? "")).filter(Boolean);
  } catch (err) {
    console.warn("[merchant-center] product_link query failed:", err instanceof Error ? err.message : err);
    return [];
  }
}

// ─── Price Competitiveness ─────────────────────────────────────────────────────

/**
 * Calls the Merchant Center Reports API to get price competitiveness data.
 * Returns an empty array (with scopeMissing=true) if the `content` scope
 * is not included in the stored refresh token.
 */
export async function fetchPriceCompetitiveness(
  merchantId: string,
  orgId?: string
): Promise<PriceCompetitivenessResult> {
  const refreshToken = await getRefreshToken(orgId);
  let accessToken: string;
  try {
    accessToken = await getAccessToken(refreshToken);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // Token exchange errors that indicate missing scope
    if (msg.includes("invalid_grant") || msg.includes("unauthorized_client")) {
      return { merchantId, products: [], scopeMissing: true };
    }
    throw err;
  }

  // Merchant Center Reports API — PriceCompetitivenessProductView
  // sale_price_micros is available in product_view when a sale price is set.
  // Google's benchmark comparison already uses the effective (lowest) price,
  // so we fetch both and display accordingly.
  const query = [
    "SELECT",
    "  product_view.id,",
    "  product_view.title,",
    "  product_view.brand,",
    "  product_view.price_micros,",
    "  product_view.sale_price_micros,",
    "  product_view.currency_code,",
    "  price_competitiveness.benchmark_price_micros,",
    "  price_competitiveness.benchmark_price_currency_code,",
    "  price_competitiveness.country_code",
    "FROM PriceCompetitivenessProductView",
    "LIMIT 1000",
  ].join(" ");

  const res = await fetch(
    `https://shoppingcontent.googleapis.com/content/v2.1/${merchantId}/reports/search`,
    {
      method: "POST",
      headers: {
        Authorization:  `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    }
  );

  // 403 with insufficient scope → tell caller to prompt reconnect
  if (res.status === 401 || res.status === 403) {
    const body = await res.text();
    console.warn(`[merchant-center] Reports API ${res.status}:`, body);
    return { merchantId, products: [], scopeMissing: true };
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Merchant Center API error (${res.status}): ${body}`);
  }

  const json = await res.json() as { results?: MerchantReportRow[] };
  const rows  = json.results ?? [];

  const products: PriceCompRow[] = rows
    .map((r) => {
      // Merchant Center uses camelCase field names in REST responses
      const rawId       = r.productView?.id ?? "";
      const title       = r.productView?.title ?? "";
      const brand       = r.productView?.brand ?? "";
      const regularMicros  = Number(r.productView?.priceMicros ?? 0);
      const saleMicros     = Number(r.productView?.salePriceMicros ?? 0);
      // Effective price = sale price if active and lower, otherwise regular price.
      // Google's benchmark comparison already uses the effective price, so we match.
      const effectiveMicros = saleMicros > 0 && saleMicros < regularMicros ? saleMicros : regularMicros;
      const benchMicros = Number(r.priceCompetitiveness?.benchmarkPriceMicros ?? 0);
      const currency   = r.productView?.currencyCode ?? r.priceCompetitiveness?.benchmarkPriceCurrencyCode ?? "EUR";
      const country    = r.priceCompetitiveness?.countryCode ?? "";

      if (!rawId || effectiveMicros === 0 || benchMicros === 0) return null;

      // Extract item_id from resource name like "online:en:GB:ABC123"
      const parts  = rawId.split(":");
      const itemId = parts[parts.length - 1] ?? rawId;

      // Gap is calculated against effective price so it matches what Google sees
      const diffPct = ((effectiveMicros - benchMicros) / benchMicros) * 100;

      const status: PriceCompRow["status"] =
        diffPct > 15  ? "well_above" :
        diffPct > 3   ? "above" :
        diffPct < -3  ? "below" :
        "competitive";

      return {
        itemId,
        title,
        brand,
        yourPriceMicros:      regularMicros,
        salePriceMicros:      saleMicros,
        effectivePriceMicros: effectiveMicros,
        benchmarkMicros:      benchMicros,
        currencyCode:         currency,
        countryCode:          country,
        priceDiffPercent:     Math.round(diffPct * 10) / 10,
        status,
        spendMicros: 0, // populated by caller after merging Google Ads spend data
      } satisfies PriceCompRow;
    })
    .filter((r): r is PriceCompRow => r !== null);

  return { merchantId, products, scopeMissing: false };
}

// ─── Internal types (Merchant Center API response shape) ──────────────────────

interface MerchantReportRow {
  productView?: {
    id?:              string;
    title?:           string;
    brand?:           string;
    priceMicros?:     string | number;
    salePriceMicros?: string | number;
    currencyCode?:    string;
  };
  priceCompetitiveness?: {
    benchmarkPriceMicros?:        string | number;
    benchmarkPriceCurrencyCode?:  string;
    countryCode?:                 string;
  };
}
