/**
 * Shopify integration (BUILD-SPEC §4.3/§8, Phase 8) — the order feed.
 *
 * Public OAuth app flow: install → callback (HMAC-verified) → permanent Admin
 * API token, stored per account. The token then pulls orders per day, which we
 * reconcile against Google Ads conversions and use for POAS.
 *
 * The pure pieces (HMAC verification, shop-domain validation, order
 * aggregation) are exported so they can be tested without live credentials —
 * the OAuth handshake and order fetch need a real store.
 */
import crypto from "crypto";

export interface ShopifyAppConfig {
  apiKey: string;
  apiSecret: string;
  scopes: string;
  apiVersion: string;
}

/** App-level OAuth credentials (the agency's Shopify app). Null if unconfigured. */
export function shopifyAppConfig(): ShopifyAppConfig | null {
  const apiKey = process.env.SHOPIFY_API_KEY;
  const apiSecret = process.env.SHOPIFY_API_SECRET;
  if (!apiKey || !apiSecret) return null;
  return {
    apiKey,
    apiSecret,
    // read_orders (last 60 days) is enough to start; read_all_orders needs
    // Shopify's protected-customer-data grant and unlocks full history.
    scopes: process.env.SHOPIFY_SCOPES ?? "read_orders",
    apiVersion: process.env.SHOPIFY_API_VERSION ?? "2025-07",
  };
}

// ─── Shop-domain handling (an allowlist — never fetch arbitrary hosts) ─────────

const SHOP_RE = /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/;

/** "acme", "acme.myshopify.com", "https://acme.myshopify.com/" → "acme.myshopify.com". */
export function normalizeShopDomain(input: string): string {
  let s = input.trim().toLowerCase();
  s = s.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  if (s && !s.includes(".")) s = `${s}.myshopify.com`;
  return s;
}

export function isValidShopDomain(shop: string): boolean {
  return SHOP_RE.test(shop);
}

// ─── OAuth ─────────────────────────────────────────────────────────────────────

export function buildAuthorizeUrl(shop: string, cfg: ShopifyAppConfig, redirectUri: string, state: string): string {
  const p = new URLSearchParams({
    client_id: cfg.apiKey,
    scope: cfg.scopes,
    redirect_uri: redirectUri,
    state,
    // online:false → an offline (permanent) token, which is what a nightly sync needs.
    "grant_options[]": "",
  });
  return `https://${shop}/admin/oauth/authorize?${p.toString()}`;
}

/**
 * Verify the HMAC Shopify appends to every OAuth/redirect request. Params are
 * all query params EXCEPT `hmac` (and the legacy `signature`), sorted and
 * joined as key=value pairs, HMAC-SHA256'd with the app secret. Timing-safe.
 */
export function verifyShopifyHmac(params: Record<string, string>, secret: string): boolean {
  const provided = params.hmac;
  if (!provided) return false;
  const message = Object.keys(params)
    .filter(k => k !== "hmac" && k !== "signature")
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join("&");
  const digest = crypto.createHmac("sha256", secret).update(message).digest("hex");
  const a = Buffer.from(digest, "utf8");
  const b = Buffer.from(provided, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export interface TokenResult { accessToken: string; scope: string; }

/** Exchange the OAuth code for a permanent Admin API access token. */
export async function exchangeCodeForToken(shop: string, code: string, cfg: ShopifyAppConfig): Promise<TokenResult> {
  if (!isValidShopDomain(shop)) throw new Error(`refusing token exchange for invalid shop: ${shop}`);
  const res = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ client_id: cfg.apiKey, client_secret: cfg.apiSecret, code }),
  });
  if (!res.ok) throw new Error(`Shopify token exchange failed (${res.status}): ${await res.text().catch(() => "")}`);
  const j = await res.json() as { access_token?: string; scope?: string };
  if (!j.access_token) throw new Error("Shopify token exchange returned no access_token");
  return { accessToken: j.access_token, scope: j.scope ?? "" };
}

// ─── Orders → daily series ─────────────────────────────────────────────────────

export interface OrderNode {
  createdAt: string; // ISO8601
  test?: boolean;
  currentTotalPriceSet?: { shopMoney?: { amount?: string; currencyCode?: string } };
}
export interface OrderDayAgg { date: string; orders: number; revenue: number; currency: string; }

/**
 * Aggregate order nodes into a per-day series. Test orders are excluded.
 * Grouped by the UTC date of createdAt — for a pilot this is close enough; a
 * shop-timezone refinement can follow if day-boundary drift shows up in recon.
 */
export function aggregateOrdersByDay(nodes: OrderNode[]): OrderDayAgg[] {
  const map = new Map<string, OrderDayAgg>();
  for (const n of nodes) {
    if (n.test) continue;
    const date = n.createdAt.slice(0, 10);
    const amount = Number(n.currentTotalPriceSet?.shopMoney?.amount ?? 0);
    const currency = n.currentTotalPriceSet?.shopMoney?.currencyCode ?? "EUR";
    const e = map.get(date) ?? { date, orders: 0, revenue: 0, currency };
    e.orders += 1;
    e.revenue += Number.isFinite(amount) ? amount : 0;
    map.set(date, e);
  }
  return [...map.values()].sort((a, b) => a.date.localeCompare(b.date));
}

const ORDERS_QUERY = `
query($cursor: String, $q: String!) {
  orders(first: 250, after: $cursor, query: $q, sortKey: CREATED_AT) {
    pageInfo { hasNextPage endCursor }
    nodes {
      createdAt
      test
      currentTotalPriceSet { shopMoney { amount currencyCode } }
    }
  }
}`;

/**
 * Fetch every order between startDate and endDate (YYYY-MM-DD, inclusive) and
 * return the daily aggregate. Cursor-paginated with a hard page cap.
 */
export async function fetchOrdersByDay(
  shop: string, accessToken: string, startDate: string, endDate: string, apiVersion = "2025-07",
): Promise<OrderDayAgg[]> {
  if (!isValidShopDomain(shop)) throw new Error(`invalid shop domain: ${shop}`);
  const q = `created_at:>='${startDate}T00:00:00Z' created_at:<='${endDate}T23:59:59Z'`;
  const url = `https://${shop}/admin/api/${apiVersion}/graphql.json`;

  const nodes: OrderNode[] = [];
  let cursor: string | null = null;
  for (let page = 0; page < 60; page++) {
    const res: Response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": accessToken },
      body: JSON.stringify({ query: ORDERS_QUERY, variables: { cursor, q } }),
    });
    if (!res.ok) throw new Error(`Shopify orders query failed (${res.status}): ${await res.text().catch(() => "")}`);
    const body = await res.json() as {
      data?: { orders?: { pageInfo: { hasNextPage: boolean; endCursor: string | null }; nodes: OrderNode[] } };
      errors?: unknown;
    };
    if (body.errors) throw new Error(`Shopify GraphQL errors: ${JSON.stringify(body.errors)}`);
    const orders = body.data?.orders;
    if (!orders) break;
    nodes.push(...orders.nodes);
    if (!orders.pageInfo.hasNextPage) break;
    cursor = orders.pageInfo.endCursor;
  }
  return aggregateOrdersByDay(nodes);
}
