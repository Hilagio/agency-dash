-- Catalog enrichment: GTIN (barcode), vendor, and the public product URL, so the
-- Shopping compare can show the client's exact store price + GTIN and link to
-- their own listing (instead of an average derived from revenue ÷ units).
-- Additive + idempotent.
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "barcode" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "vendor" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "url" TEXT;
