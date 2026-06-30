// Shopify Admin API integration (Phase 1 — custom-app token).
//
// Auth model: the client creates a custom app in their Shopify admin, grants read scopes
// (read_orders is enough for Phase 1), and gives us the Admin API access token. We store
// the token per account (ShopifyConnection) and call the Admin GraphQL API directly.
//
// Phase 1 surfaces order-level totals (total sales, orders, AOV, net sales) over the
// 90/30/14-day windows — the numbers the 90-day plan needs to show Google's share of total
// store revenue and AOV. COGS/margin and inventory history are out of scope (need cost data /
// analytics the Admin API doesn't expose cleanly) and stay manual for now.

const API_VERSION = "2025-01";
const MAX_PAGES = 40; // 40 × 250 = 10k orders / 90 days — flag if exceeded

/** Normalise any of "brillers", "brillers.myshopify.com", "https://brillers.myshopify.com/" → "brillers.myshopify.com". */
export function normaliseShopDomain(input: string): string {
  let s = (input || "").trim().toLowerCase();
  s = s.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim();
  if (!s) return "";
  if (!s.includes(".")) s = `${s}.myshopify.com`;
  return s;
}

async function shopifyGraphQL<T>(
  shop: string,
  token: string,
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(`https://${shop}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Shopify API ${res.status}: ${body.slice(0, 200)}`);
  }
  const json = (await res.json()) as { data?: T; errors?: Array<{ message: string }> };
  if (json.errors?.length) throw new Error(`Shopify GraphQL: ${json.errors.map((e) => e.message).join("; ")}`);
  if (!json.data) throw new Error("Shopify GraphQL: empty response");
  return json.data;
}

/** Confirm the token works and return the shop name + currency. */
export async function verifyShopifyConnection(
  shopDomain: string,
  accessToken: string,
): Promise<{ ok: boolean; shop?: string; currency?: string; error?: string }> {
  const shop = normaliseShopDomain(shopDomain);
  if (!shop) return { ok: false, error: "Invalid shop domain" };
  try {
    const data = await shopifyGraphQL<{ shop: { name: string; currencyCode: string } }>(
      shop, accessToken, `{ shop { name currencyCode } }`,
    );
    return { ok: true, shop: data.shop.name, currency: data.shop.currencyCode };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export interface ShopifyWindow {
  totalSales: number;
  orders:     number;
  aov:        number;
  netSales:   number;  // subtotal (excludes shipping/tax), approximation of Shopify "net sales"
}

export interface ShopifyMetrics {
  currency:  string;
  windows:   { d90: ShopifyWindow; d30: ShopifyWindow; d14: ShopifyWindow };
  truncated: boolean;   // true if we hit the page cap and totals may be partial
}

const ORDERS_QUERY = `
  query($cursor: String, $q: String) {
    orders(first: 250, after: $cursor, query: $q, sortKey: CREATED_AT) {
      pageInfo { hasNextPage endCursor }
      nodes {
        createdAt
        test
        currentTotalPriceSet { shopMoney { amount } }
        currentSubtotalPriceSet { shopMoney { amount } }
      }
    }
  }`;

function ymd(d: Date): string { return d.toISOString().slice(0, 10); }

/** Fetch order-level totals over the 90/30/14-day windows. */
export async function fetchShopifyMetrics(
  shopDomain: string,
  accessToken: string,
): Promise<ShopifyMetrics> {
  const shop = normaliseShopDomain(shopDomain);

  // Currency (and a connectivity check).
  const shopData = await shopifyGraphQL<{ shop: { currencyCode: string } }>(
    shop, accessToken, `{ shop { currencyCode } }`,
  );
  const currency = shopData.shop.currencyCode;

  const now = new Date();
  const yd = new Date(); yd.setDate(now.getDate() - 1);
  const start90 = new Date(yd); start90.setDate(yd.getDate() - 89);
  const cut = (n: number) => { const d = new Date(yd); d.setDate(yd.getDate() - (n - 1)); return ymd(d); };
  const c30 = cut(30), c14 = cut(14);

  const mk = (): ShopifyWindow => ({ totalSales: 0, orders: 0, aov: 0, netSales: 0 });
  const d90 = mk(), d30 = mk(), d14 = mk();

  const q = `created_at:>=${ymd(start90)} created_at:<=${ymd(now)}`;
  let cursor: string | null = null;
  let pages = 0;
  let truncated = false;

  do {
    const data: {
      orders: {
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
        nodes: Array<{
          createdAt: string; test: boolean;
          currentTotalPriceSet?: { shopMoney?: { amount?: string } };
          currentSubtotalPriceSet?: { shopMoney?: { amount?: string } };
        }>;
      };
    } = await shopifyGraphQL(shop, accessToken, ORDERS_QUERY, { cursor, q });

    for (const o of data.orders.nodes) {
      if (o.test) continue;
      const total = parseFloat(o.currentTotalPriceSet?.shopMoney?.amount ?? "0") || 0;
      const sub   = parseFloat(o.currentSubtotalPriceSet?.shopMoney?.amount ?? "0") || 0;
      const date  = o.createdAt.slice(0, 10);
      const add = (w: ShopifyWindow) => { w.totalSales += total; w.netSales += sub; w.orders += 1; };
      add(d90);
      if (date >= c30) add(d30);
      if (date >= c14) add(d14);
    }

    pages += 1;
    cursor = data.orders.pageInfo.hasNextPage ? data.orders.pageInfo.endCursor : null;
    if (cursor && pages >= MAX_PAGES) { truncated = true; cursor = null; }
  } while (cursor);

  for (const w of [d90, d30, d14]) w.aov = w.orders > 0 ? w.totalSales / w.orders : 0;

  return { currency, windows: { d90, d30, d14 }, truncated };
}
