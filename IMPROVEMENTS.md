# Improvements log

A running record of what changed, where, and why — judged against the prime
directive: **clean UI + seamless UX, everything simpler.** Newest first.

## 2026-07-20 — Shopify context: AOV-drop + per-product movement

Extends `get_shopify_data` (`src/lib/diagnostics/agent-tools.ts`) beyond
"is tracking broken" so the agent can answer more of the questions a specialist
actually asks — all from data already stored, no schema change:

- **AOV drop as its own signal.** The recent-vs-prior trend now includes AOV
  ("AOV €45 vs €60, down 25% — basket size is shrinking, look at discounting /
  product mix"), so a shrinking-basket problem is caught even when order count
  holds.
- **Per-product movement.** Where per-product sales exist, the tool names the
  top sellers, which products are **falling** (€2,520→€420), which are **rising**,
  and which are **newly emerging** (no prior sales) — so "what's selling", "where's
  the drop", and "what's coming up" are answerable in one pull.
- **Honest availability.** Per-product needs a live Shopify connection; the "Sales
  over time" CSV is order totals only, and the tool now says exactly that instead
  of silently omitting products.

Still a genuine gap (needs new ingestion + a product decision): the
**add-to-cart → begin-checkout → purchase funnel rate**. No path ingests
behavioral funnel events today. The best fit for a PPC tool is the ad-side funnel
from Google Ads micro-conversion actions (`add_to_cart` / `begin_checkout`),
which would be a new Google Ads pull rather than Shopify. Deferred pending that
decision.

## 2026-07-20 — Trustworthy reconciliation check + richer Shopify context

Found by driving the app end-to-end as a specialist (seeded a realistically
flagged account, rendered the diagnose page in a browser).

- **`src/lib/diagnostics/engine.ts` — "What I already checked" contradicted the
  numbers.** `buildChecks` declared "Ads conversions reconcile with orders
  within tolerance — tracking looks intact" whenever a `reconciliation` object
  was present and no upstream `conversions_vs_orders` signal had fired — even
  when the account showed 3 Ads conversions against 48 real orders (a 94% gap)
  right above it. It now computes the delta from `reconciliation` itself and
  flags the check with the actual gap ("Ads counted 3 conversions against 48
  real orders (94% gap)…") when it exceeds tolerance, only claiming "intact"
  when the numbers really are close.
- **`src/lib/diagnostics/agent-tools.ts` — `get_shopify_data` gave the agent a
  flat lump sum.** It returned only total orders, total revenue, and top
  sellers. For the flagship "did sales really drop, or is only tracking broken?"
  question it now also returns: **AOV**, a **recent-vs-prior order trend** (last
  N/2 days vs the prior N/2 — "14 vs 63 orders, down 78%"), and a **direct
  Ads-vs-Shopify reconciliation line** for the same window ("Google Ads counted
  3 conversions vs 48 real orders — a 94% shortfall → suspect a tracking break,
  not a demand drop"). All derived from data already stored (`OrderDaily`,
  `MetricDaily`) — no schema change. Also flags when the shop's order currency
  differs from the Ads account currency.
- **`/diagnose/[id]` — dev-facing empty state.** The Shopify order-feed card told
  specialists to "Add `SHOPIFY_API_KEY` … on Railway"; it now points them to the
  CSV-upload flow ("same real orders & POAS") instead.

**Why simpler:** the read stops contradicting itself, and the AI gets the trend
+ reconciliation that actually answer the most common flagged case — so the
specialist reaches the right conclusion faster.

## 2026-07-20 — One-tap "Ask AI" on the evidence sections

**What:** On `/diagnose/[id]`, the four data-heavy evidence sections
(across-windows trend, underperforming products, landing pages, by-product
breakdown) now carry a quiet "Ask AI" chip next to their titles. One tap
scrolls to the Ecomtrada AI conversation and sends a targeted question about
that section ("where is spend going to pages that don't convert?"), reusing
the existing chat stream — no new surface, no typing.

Also fixed: the attachment-size error said "max 8 MB" while the actual cap is
5 MB, and a stale comment claimed a 6-file cap (it's 4).

**Why simpler:** asking the AI becomes the fastest path through every table —
the assistant is the front door, not a side panel (master-prompt objective 3).

## 2026-07-20 — Shopping compare grounded in the real Shopify catalog

**What:** The ingested Shopify product catalog (previously write-only — synced
but never read) now powers the per-product Google Shopping compare.

- `prisma/schema.prisma` + migration `0032_product_catalog_enrichment`:
  `Product` gains `barcode` (GTIN/EAN), `vendor`, and `url` (public product
  page). Additive + idempotent.
- `src/lib/integrations/shopify.ts`: the catalog sync now pulls handle, vendor,
  `onlineStoreUrl` and the first variant's barcode; the stored `url` prefers
  `onlineStoreUrl` (respects custom domains).
- `src/lib/diagnostics/products.ts`: new pure `attachCatalog()` joins catalog
  rows onto product groups — by real id (`pid:` ↔ Shopify GID) first, then
  normalised title. Covered in `products.test.ts`.
- `/api/diagnostics/account/[id]`: product groups now carry
  `catalog { price, gtin, url, vendor }`, and the Shopify block exposes
  `shopName` (derived from the shop domain).
- `/diagnose/[id]` → Shopping compare: "Your product" now shows the **exact
  store price** (labelled "store price") instead of an average of revenue ÷
  units (still the honest fallback, labelled "avg sold"), plus the GTIN and a
  link to the client's own product page. The "your shop" highlight is
  pre-seeded from the connected Shopify domain, so the client's own listing is
  spotted without typing.
- `src/lib/integrations/scraperapi-shopping.ts`: self-listing match now
  compares alphanumerics only, so "Cherie Boutique", "cherie-boutique" and
  "cherieboutique.nl" all count as the same shop.
- Agent tool `get_shopping_competitors`: auto-derives the highlight from the
  connected store when none is given, and cites the client's own catalog
  listing (exact price + GTIN, and vs-median) even when the scrape doesn't
  surface their shop.

**Why simpler:** the specialist no longer reasons from a proxy number or types
the shop name by hand — one click on a product shows the real listing against
the market. (Addresses master-prompt objectives 5 and 7.)

**Follow-up still required (external):** the Merchant API price-competitiveness
benchmark stays blocked until GCP project `ecomtrada-webapp` is registered in
Merchant Center (one-time Google-side action). Catalog data appears for an
account after its next Shopify sync (nightly, or "Sync orders" on the account).
