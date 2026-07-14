-- Variant-level Shopify sales (BUILD-SPEC §4 data-sufficiency).
-- Idempotent for P3009 recovery.

ALTER TABLE "ProductSalesDaily" ADD COLUMN IF NOT EXISTS "variantId"    TEXT NOT NULL DEFAULT '';
ALTER TABLE "ProductSalesDaily" ADD COLUMN IF NOT EXISTS "variantTitle" TEXT NOT NULL DEFAULT '';

DROP INDEX IF EXISTS "ProductSalesDaily_accountId_date_productId_key";
CREATE UNIQUE INDEX IF NOT EXISTS "ProductSalesDaily_accountId_date_productId_variantId_key"
  ON "ProductSalesDaily"("accountId", "date", "productId", "variantId");
