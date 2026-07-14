/**
 * Pure-function spec for the Shopify integration (no live store needed):
 * HMAC verification, shop-domain allowlist, order aggregation.
 *   npx tsx src/lib/integrations/shopify.test.ts
 */
import crypto from "crypto";
import {
  verifyShopifyHmac, normalizeShopDomain, isValidShopDomain, aggregateOrdersByDay, type OrderNode,
} from "./shopify";

let fail = 0;
const ok = (n: string, c: boolean) => { console.log(c ? "✓" : "✗ FAIL:", n); if (!c) fail++; };

// ─── HMAC ───────────────────────────────────────────────────────────────────
const secret = "hush-hush-secret";
// Shopify signs the sorted key=value&… string of all params except hmac.
const params: Record<string, string> = { code: "abc123", shop: "acme.myshopify.com", state: "nonce42", timestamp: "1700000000" };
const message = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join("&");
const goodHmac = crypto.createHmac("sha256", secret).update(message).digest("hex");

ok("valid HMAC passes", verifyShopifyHmac({ ...params, hmac: goodHmac }, secret));
ok("tampered param fails", !verifyShopifyHmac({ ...params, shop: "evil.myshopify.com", hmac: goodHmac }, secret));
ok("wrong secret fails", !verifyShopifyHmac({ ...params, hmac: goodHmac }, "not-the-secret"));
ok("missing hmac fails", !verifyShopifyHmac({ ...params }, secret));
ok("hmac param itself is excluded from the digest", verifyShopifyHmac({ ...params, hmac: goodHmac }, secret));

// ─── Shop-domain allowlist (SSRF guard) ───────────────────────────────────────
ok("bare handle → myshopify domain", normalizeShopDomain("acme") === "acme.myshopify.com");
ok("full URL → domain", normalizeShopDomain("https://acme.myshopify.com/admin") === "acme.myshopify.com");
ok("uppercase normalised", normalizeShopDomain("ACME.myshopify.com") === "acme.myshopify.com");
ok("valid myshopify domain accepted", isValidShopDomain("acme-store.myshopify.com"));
ok("arbitrary host rejected", !isValidShopDomain("evil.com"));
ok("subdomain smuggling rejected", !isValidShopDomain("acme.myshopify.com.evil.com"));
ok("non-myshopify rejected", !isValidShopDomain("acme.shopify.com"));

// ─── Order aggregation ────────────────────────────────────────────────────────
const nodes: OrderNode[] = [
  { createdAt: "2026-07-10T08:00:00Z", currentTotalPriceSet: { shopMoney: { amount: "120.50", currencyCode: "EUR" } } },
  { createdAt: "2026-07-10T20:30:00Z", currentTotalPriceSet: { shopMoney: { amount: "79.50", currencyCode: "EUR" } } },
  { createdAt: "2026-07-11T09:00:00Z", currentTotalPriceSet: { shopMoney: { amount: "50.00", currencyCode: "EUR" } } },
  { createdAt: "2026-07-11T10:00:00Z", test: true, currentTotalPriceSet: { shopMoney: { amount: "999.00", currencyCode: "EUR" } } }, // excluded
];
const agg = aggregateOrdersByDay(nodes);
ok("aggregates two days", agg.length === 2);
ok("day 1 counts 2 orders", agg[0].date === "2026-07-10" && agg[0].orders === 2);
ok("day 1 sums revenue", Math.abs(agg[0].revenue - 200) < 1e-9);
ok("test order excluded from count", agg[1].orders === 1);
ok("test order excluded from revenue", Math.abs(agg[1].revenue - 50) < 1e-9);
ok("currency carried through", agg[0].currency === "EUR");
ok("days sorted ascending", agg[0].date < agg[1].date);
ok("empty input → empty series", aggregateOrdersByDay([]).length === 0);

console.log(fail ? `\n${fail} FAILURE(S)` : "\nSHOPIFY: PASS — HMAC + allowlist + aggregation");
process.exit(fail ? 1 : 0);
