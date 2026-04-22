<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Deployment
- Production is on **Railway** at `https://agency-dash-production.up.railway.app`
- Never assume localhost — all OAuth redirect URIs, base URLs, and environment assumptions must account for Railway
- `RAILWAY_PUBLIC_DOMAIN` is auto-injected by Railway and is the canonical way to resolve the public origin in code

# Google Ads API (v23)
We use `google-ads-api` v23 + `google-ads-node` v23. **Before writing any GAQL query, verify that every field exists in v23.**

## Verifying GAQL fields
- **Authoritative source — proto files**: `node_modules/google-ads-node/build/protos/google/ads/googleads/v23/resources/<resource>.proto`
  - Every field that can be SELECTed must appear in the proto for that resource.
  - 182 resource protos are available; also check `common/` for shared message types.
- **Enum types**: `node_modules/google-ads-api/build/src/protos/autogen/fields.js` lists every field that has an enum type — useful for spotting the enum name and valid values.
- **Error handling**: always import and use `import { errors } from "google-ads-api"` with `instanceof errors.GoogleAdsFailure`. See `node_modules/google-ads-api/README.md` § "Error handling".
- All Google Ads queries must be wrapped in `safeQuery()` (defined in `src/lib/integrations/google-ads.ts`) so a single bad query never kills the entire scoring run.

## Known v23 removals / renames
| Old (pre-v23) | v23 replacement | Notes |
|---|---|---|
| `conversion_action.last_conversion_date` | metrics query over date range | Detect staleness via 90-day conversion count |
| `conversion_action.enhanced_conversions_settings.enabled` | not exposed in GAQL | Infer from WEBPAGE conversion action presence |
| `google_analytics_link` resource | removed | Use GA4 conversion action types as proxy |
| `merchant_center_link` resource | `product_link` resource | `product_link.merchant_center.merchant_center_id` |

# Merchant Center API
Two separate APIs are used — **do not confuse them**.

## Merchant Center Reports API v1 (price competitiveness)
- Endpoint: `https://merchantapi.googleapis.com/reports/v1/accounts/{merchantId}/reports:search`
- Query language: SQL-like, field names are **snake_case** in the request body
- Response field names are **camelCase** (REST auto-converts)
- Resources we use: `price_competitiveness_product_view`
- Field reference: https://developers.google.com/merchant/api/reference/rest/reports_v1/accounts.reports/search

## Content API v2.1 (product catalog fallback)
- Endpoint: `https://shoppingcontent.googleapis.com/content/v2.1/{merchantId}/products`
- Returns product list when Shopping performance data is unavailable
- No googleapis client library — raw `fetch` with Bearer token

## Raw HTTP pattern (no googleapis SDK)
Both Merchant Center endpoints use plain `fetch`. There is no schema validation — if Google changes a field name silently, our parser will produce zeros/nulls with no error. When adding new fields, always cross-reference against the official API reference linked above.
