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
  merchantId:        string;
  products:          PriceCompRow[];
  /** True if the content scope appears to be missing from the token */
  scopeMissing:      boolean;
  /** True when the GCP project hasn't been registered with this Merchant Center account */
  gcpNotRegistered?: boolean;
  /** The GCP project ID/number extracted from the 401 error, so the UI can show exact steps */
  gcpProjectId?:     string;
  gcpProjectNumber?: string;
  /** Raw error body from the API */
  apiError?:         string;
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

function parseRows(rows: MerchantReportRow[]): PriceCompRow[] {
  return rows
    .map((r) => {
      const pv          = r.productView;
      const pc          = r.priceCompetitiveness;
      const rawId       = pv?.id ?? "";
      const title       = pv?.title ?? "";
      const brand       = pv?.brand ?? "";
      const priceMicros = Number(pv?.priceMicros ?? 0);
      const benchMicros = Number(pc?.benchmarkPriceMicros ?? 0);
      const currency    = pv?.currencyCode ?? pc?.benchmarkPriceCurrencyCode ?? "EUR";
      const country     = pc?.countryCode ?? "";

      if (!rawId || priceMicros === 0 || benchMicros === 0) return null;

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
        spendMicros: 0,
      } satisfies PriceCompRow;
    })
    .filter((r): r is PriceCompRow => r !== null);
}

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

  // Merchant Center Reports API v1 is the only API that provides price competitiveness data.
  // Content API v2.1 only surfaces Shopping Ads performance (clicks/cost/conversions) — not benchmarks.
  const query = [
    "SELECT",
    "  product_view.id,",
    "  product_view.title,",
    "  product_view.brand,",
    "  product_view.price_micros,",
    "  product_view.currency_code,",
    "  price_competitiveness.country_code,",
    "  price_competitiveness.benchmark_price_micros,",
    "  price_competitiveness.benchmark_price_currency_code",
    "FROM price_competitiveness_product_view",
  ].join(" ");

  const rows: MerchantReportRow[] = [];
  let pageToken: string | undefined;

  // On a first 401/403, get a fresh token and retry once — transient token
  // expiry should not trigger the permanent "register your project" banner.
  let retried = false;

  do {
    const body: Record<string, unknown> = { query };
    if (pageToken) body.pageToken = pageToken;

    // eslint-disable-next-line no-await-in-loop
    let res = await fetch(
      `https://merchantapi.googleapis.com/reports/v1/accounts/${merchantId}/reports:search`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if ((res.status === 401 || res.status === 403) && !retried) {
      // Refresh the token and retry once before treating this as a hard error
      retried = true;
      try {
        accessToken = await getAccessToken(refreshToken);
        res = await fetch(
          `https://merchantapi.googleapis.com/reports/v1/accounts/${merchantId}/reports:search`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );
      } catch {
        // If token refresh itself fails, fall through to the original 401 handling below
      }
    }

    if (res.status === 401 || res.status === 403) {
      // eslint-disable-next-line no-await-in-loop
      const errBody = await res.text();
      console.warn(`[merchant-center] v1 auth error ${res.status} (after retry=${retried}):`, errBody.slice(0, 300));

      // Only flag gcpNotRegistered if the API explicitly says so — transient 401s
      // must not be promoted to a permanent "register your project" banner.
      let gcpProjectId: string | undefined;
      let gcpProjectNumber: string | undefined;
      let isGcpNotRegistered = false;
      try {
        const parsed = JSON.parse(errBody) as {
          error?: {
            status?: string;
            details?: Array<{ metadata?: { GCP_ID?: string; GCP_NUMBER?: string } }>
          }
        };
        const meta = parsed?.error?.details?.[0]?.metadata;
        gcpProjectId       = meta?.GCP_ID;
        gcpProjectNumber   = meta?.GCP_NUMBER;
        isGcpNotRegistered = !!(gcpProjectId || errBody.includes("GCP_NOT_REGISTERED"));
      } catch { /* ignore parse errors */ }

      if (isGcpNotRegistered) {
        return {
          merchantId, products: [], scopeMissing: false,
          gcpNotRegistered: true, gcpProjectId, gcpProjectNumber,
          apiError: errBody.slice(0, 500),
        };
      }

      return { merchantId, products: [], scopeMissing: true, apiError: errBody.slice(0, 300) };
    }

    if (!res.ok) {
      // eslint-disable-next-line no-await-in-loop
      const errBody = await res.text();
      throw new Error(`Merchant Center API v1 error (${res.status}): ${errBody}`);
    }

    // eslint-disable-next-line no-await-in-loop
    const json = await res.json() as { results?: MerchantReportRow[]; nextPageToken?: string };
    rows.push(...(json.results ?? []));
    pageToken = json.nextPageToken;
  } while (pageToken);

  console.log(`[merchant-center] v1 price competitiveness: ${rows.length} rows`);
  return { merchantId, products: parseRows(rows), scopeMissing: false };
}

// ─── Product catalog listing ──────────────────────────────────────────────────

export interface MerchantProductItem {
  itemId:      string;
  title:       string;
  brand:       string;
}

/**
 * Lists all products in the Merchant Center feed via Content API v2.1.
 * Used as a fallback when shopping_performance_view returns no rows
 * (PMax campaigns serving on non-Shopping surfaces).
 *
 * Despite the "sunset" announcement, this endpoint still works for accounts
 * that have the content scope. We cap at 1000 products to stay fast.
 */
export async function fetchMerchantCenterProductList(
  merchantId: string,
  orgId?: string
): Promise<MerchantProductItem[]> {
  const refreshToken = await getRefreshToken(orgId);
  let accessToken: string;
  try {
    accessToken = await getAccessToken(refreshToken);
  } catch {
    return [];
  }

  const products: MerchantProductItem[] = [];
  let pageToken: string | undefined;

  try {
    do {
      const url = new URL(`https://shoppingcontent.googleapis.com/content/v2.1/${merchantId}/products`);
      url.searchParams.set("maxResults", "250");
      if (pageToken) url.searchParams.set("pageToken", pageToken);

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        console.warn(`[merchant-center] products.list ${res.status}:`, body.slice(0, 200));
        break;
      }

      const json = await res.json() as {
        resources?: Array<{ id?: string; title?: string; brand?: string }>;
        nextPageToken?: string;
      };

      for (const p of json.resources ?? []) {
        // Content API product ID: "online:en:GB:ITEM123" — extract last segment
        const parts  = (p.id ?? "").split(":");
        const itemId = parts[parts.length - 1] ?? "";
        if (itemId) products.push({ itemId, title: p.title ?? "", brand: p.brand ?? "" });
      }

      pageToken = json.nextPageToken;
    } while (pageToken && products.length < 1000);
  } catch (err) {
    console.warn("[merchant-center] fetchMerchantCenterProductList failed:", err instanceof Error ? err.message : err);
  }

  console.log(`[merchant-center] product list for ${merchantId}: ${products.length} items`);
  return products;
}

// ─── Feed / account health (disapprovals, suspensions, country approval) ──────

export interface MerchantHealth {
  linked: boolean;
  scopeOrAuthError?: string;
  accountIssues: { title: string; severity: string; country?: string }[];
  // Serving summary per country/destination (from the account status products stats).
  destinations: { country: string; destination: string; active: number; pending: number; disapproved: number }[];
  // Top item-level issues aggregated across the feed, by product count.
  itemIssues: { description: string; servability: string; numItems: number; country?: string }[];
  totals: { active: number; pending: number; disapproved: number };
}

/**
 * Live Merchant Center feed health via the Content API v2.1 `accountstatuses`
 * endpoint — one call returns account-level issues (suspension, misrepresentation,
 * policy) AND per-country serving stats + aggregated item-level disapproval reasons
 * with product counts. This is what lets the agent answer "is the feed suspended /
 * are products disapproved / is BE approved?" itself instead of sending the team
 * into Merchant Center. Uses the `content` scope (no GCP registration needed).
 */
export async function fetchMerchantCenterHealth(merchantId: string, orgId?: string): Promise<MerchantHealth> {
  const empty: MerchantHealth = { linked: true, accountIssues: [], destinations: [], itemIssues: [], totals: { active: 0, pending: 0, disapproved: 0 } };
  let accessToken: string;
  try { accessToken = await getAccessToken(await getRefreshToken(orgId)); }
  catch (e) { return { ...empty, scopeOrAuthError: e instanceof Error ? e.message : String(e) }; }

  const res = await fetch(
    `https://shoppingcontent.googleapis.com/content/v2.1/${merchantId}/accountstatuses/${merchantId}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  ).catch((e: unknown) => { throw e; });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return { ...empty, scopeOrAuthError: `accountstatuses ${res.status}: ${body.slice(0, 200)}` };
  }

  const json = await res.json() as {
    accountLevelIssues?: Array<{ title?: string; severity?: string; country?: string }>;
    products?: Array<{
      country?: string; destination?: string;
      statistics?: { active?: string | number; pending?: string | number; disapproved?: string | number };
      itemLevelIssues?: Array<{ description?: string; servability?: string; numItems?: string | number; country?: string }>;
    }>;
  };

  const n = (v: string | number | undefined) => Number(v ?? 0) || 0;
  const accountIssues = (json.accountLevelIssues ?? []).map(i => ({ title: i.title ?? "issue", severity: i.severity ?? "", country: i.country }));
  const destinations = (json.products ?? []).map(p => ({
    country: p.country ?? "", destination: p.destination ?? "",
    active: n(p.statistics?.active), pending: n(p.statistics?.pending), disapproved: n(p.statistics?.disapproved),
  }));
  const issueAgg = new Map<string, { description: string; servability: string; numItems: number; country?: string }>();
  for (const p of json.products ?? []) {
    for (const it of p.itemLevelIssues ?? []) {
      const key = `${it.description ?? ""}|${it.country ?? p.country ?? ""}`;
      const e = issueAgg.get(key) ?? { description: it.description ?? "issue", servability: it.servability ?? "", numItems: 0, country: it.country ?? p.country };
      e.numItems += n(it.numItems);
      issueAgg.set(key, e);
    }
  }
  const itemIssues = [...issueAgg.values()].sort((a, b) => b.numItems - a.numItems).slice(0, 15);
  const totals = destinations.reduce((t, d) => ({ active: t.active + d.active, pending: t.pending + d.pending, disapproved: t.disapproved + d.disapproved }), { active: 0, pending: 0, disapproved: 0 });
  return { linked: true, accountIssues, destinations, itemIssues, totals };
}

// ─── Internal types (Merchant Center Reports API v1 response shape) ──────────

interface MerchantReportRow {
  // v1: product_view fields and price_competitiveness fields in separate keys
  productView?: {
    id?:           string;
    title?:        string;
    brand?:        string;
    priceMicros?:  string | number;
    currencyCode?: string;
  };
  priceCompetitiveness?: {
    countryCode?:                 string;
    benchmarkPriceMicros?:        string | number;
    benchmarkPriceCurrencyCode?:  string;
  };
}
