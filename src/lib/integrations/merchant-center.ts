/**
 * Merchant Center integration
 *
 * Uses the Merchant Center Reports API (Content API for Shopping) to fetch
 * price competitiveness data for products linked to a Google Ads account.
 *
 * Requires the `content` OAuth scope — users may need to reconnect Google if
 * they authenticated before this scope was added.
 */

import { prisma } from "@/lib/db";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface PriceCompRow {
  itemId:           string;
  title:            string;
  brand:            string;
  /** Current product price in micros as reported by Merchant Center */
  yourPriceMicros:  number;
  benchmarkMicros:  number;
  currencyCode:     string;
  countryCode:      string;
  /** Positive = above benchmark (expensive), negative = below (cheap) */
  priceDiffPercent: number;
  status:           "competitive" | "above" | "well_above" | "below";
  /** Google Ads spend on this item over last 30 days (micros); 0 = no data */
  spendMicros:      number;
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
  orgId?: string,
  /** Manually configured fallback — used if auto-discovery returns nothing */
  storedMerchantId?: string | null
): Promise<string[]> {
  const cred = orgId
    ? await prisma.oAuthCredential.findUnique({ where: { organizationId: orgId } }).catch(() => null)
    : await prisma.oAuthCredential.findFirst().catch(() => null);

  const refreshToken    = cred?.refreshToken ?? process.env.GOOGLE_ADS_REFRESH_TOKEN ?? "";
  const loginCustomerId = cred?.loginCustomerId ?? process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID;

  if (!refreshToken) return [];

  try {
    const accessToken = await getAccessToken(refreshToken);

    const ac    = new AbortController();
    const timer = setTimeout(() => ac.abort(), 10_000);

    const headers: Record<string, string> = {
      Authorization:     `Bearer ${accessToken}`,
      "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
      "Content-Type":    "application/json",
    };
    // Strip dashes — Google Ads REST resource names require numeric-only customer IDs
    const numericCustomerId = customerId.replace(/-/g, "");
    if (loginCustomerId) headers["login-customer-id"] = loginCustomerId.replace(/-/g, "");

    let res: Response;
    try {
      res = await fetch(
        `https://googleads.googleapis.com/v23/customers/${numericCustomerId}/googleAds:search`,
        {
          method:  "POST",
          headers,
          body:    JSON.stringify({
            query: `SELECT product_link.product_link_id, product_link.type, product_link.merchant_center.merchant_center_id FROM product_link WHERE product_link.type = 'MERCHANT_CENTER'`,
          }),
          signal: ac.signal,
        }
      );
    } finally {
      clearTimeout(timer);
    }

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.warn(`[merchant-center] product_link REST ${res.status} for customer ${customerId}:`, body);
      return [];
    }

    const json = await res.json() as { results?: Array<Record<string, unknown>> };
    console.log(`[merchant-center] product_link raw response for ${customerId}:`, JSON.stringify(json.results?.slice(0, 2)));

    const ids = (json.results ?? [])
      .map(r => {
        // REST camelCase: productLink.merchantCenter.merchantCenterId
        const pl = r.productLink as { merchantCenter?: { merchantCenterId?: string } } | undefined;
        return String(pl?.merchantCenter?.merchantCenterId ?? "");
      })
      .filter(Boolean);

    console.log(`[merchant-center] found merchantCenterIds for ${customerId}:`, ids);
    if (ids.length > 0) return ids;

    // Auto-discovery returned nothing — fall back to stored ID if provided
    if (storedMerchantId) {
      console.log(`[merchant-center] auto-discovery empty, using stored merchantCenterId: ${storedMerchantId}`);
      return [storedMerchantId];
    }
    return [];

  } catch (err) {
    console.warn("[merchant-center] getMerchantCenterIds failed:", err instanceof Error ? err.message : err);
    // Even on error, try the stored ID as a last resort
    if (storedMerchantId) {
      console.log(`[merchant-center] falling back to stored merchantCenterId: ${storedMerchantId}`);
      return [storedMerchantId];
    }
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

  // sale_price_micros is not available in PriceCompetitivenessProductView —
  // Google's benchmark already compares against the effective (lowest) price,
  // so we just use price_micros as reported.
  const query = [
    "SELECT",
    "  product_view.id,",
    "  product_view.title,",
    "  product_view.brand,",
    "  product_view.price_micros,",
    "  product_view.currency_code,",
    "  price_competitiveness.benchmark_price_micros,",
    "  price_competitiveness.benchmark_price_currency_code,",
    "  price_competitiveness.country_code",
    "FROM PriceCompetitivenessProductView",
  ].join(" ");

  // Paginate through all results.
  const rows: MerchantReportRow[] = [];
  let pageToken: string | undefined;

  do {
    const body: Record<string, unknown> = { query, pageSize: 1000 };
    if (pageToken) body.pageToken = pageToken;

    // Merchant Center Reports API (v1beta, successor to Content API v2.1 which was
    // sunset September 2024). Endpoint: merchantapi.googleapis.com/reports/v1beta
    const res = await fetch(
      `https://merchantapi.googleapis.com/reports/v1beta/accounts/${merchantId}/reports:search`,
      {
        method: "POST",
        headers: {
          Authorization:  `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    // 403 with insufficient scope → tell caller to prompt reconnect
    if (res.status === 401 || res.status === 403) {
      const errBody = await res.text();
      console.warn(`[merchant-center] Reports API ${res.status}:`, errBody);
      return { merchantId, products: [], scopeMissing: true };
    }

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Merchant Center API error (${res.status}): ${errBody}`);
    }

    const json = await res.json() as { results?: MerchantReportRow[]; nextPageToken?: string };
    rows.push(...(json.results ?? []));
    pageToken = json.nextPageToken;
  } while (pageToken);

  const products: PriceCompRow[] = rows
    .map((r) => {
      // Merchant Center uses camelCase field names in REST responses
      const rawId       = r.productView?.id ?? "";
      const title       = r.productView?.title ?? "";
      const brand       = r.productView?.brand ?? "";
      const priceMicros = Number(r.productView?.priceMicros ?? 0);
      const benchMicros = Number(r.priceCompetitiveness?.benchmarkPriceMicros ?? 0);
      const currency    = r.productView?.currencyCode ?? r.priceCompetitiveness?.benchmarkPriceCurrencyCode ?? "EUR";
      const country     = r.priceCompetitiveness?.countryCode ?? "";

      if (!rawId || priceMicros === 0 || benchMicros === 0) return null;

      // Extract item_id from resource name like "online:en:GB:ABC123"
      const parts  = rawId.split(":");
      const itemId = parts[parts.length - 1] ?? rawId;

      const diffPct = ((priceMicros - benchMicros) / benchMicros) * 100;

      const status: PriceCompRow["status"] =
        diffPct > 15  ? "well_above" :
        diffPct > 3   ? "above" :
        diffPct < -3  ? "below" :
        "competitive";

      return {
        itemId,
        title,
        brand,
        yourPriceMicros:  priceMicros,
        benchmarkMicros:  benchMicros,
        currencyCode:     currency,
        countryCode:      country,
        priceDiffPercent: Math.round(diffPct * 10) / 10,
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
    id?:          string;
    title?:       string;
    brand?:       string;
    priceMicros?: string | number;
    currencyCode?: string;
  };
  priceCompetitiveness?: {
    benchmarkPriceMicros?:        string | number;
    benchmarkPriceCurrencyCode?:  string;
    countryCode?:                 string;
  };
}
