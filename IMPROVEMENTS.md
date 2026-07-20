# Improvements log

A running record of what changed, where, and why — judged against the prime
directive: **clean UI + seamless UX, everything simpler.** Newest first.

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
