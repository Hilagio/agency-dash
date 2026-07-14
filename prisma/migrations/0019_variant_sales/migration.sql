-- Variant-level Shopify sales (BUILD-SPEC §4 data-sufficiency: variants are often
-- too thin to judge alone, so we keep the variant grain but roll up to product).

ALTER TABLE "ProductSalesDaily"
  ADD COLUMN "variantId"    TEXT NOT NULL DEFAULT '',
  ADD COLUMN "variantTitle" TEXT NOT NULL DEFAULT '';

DROP INDEX "ProductSalesDaily_accountId_date_productId_key";
CREATE UNIQUE INDEX "ProductSalesDaily_accountId_date_productId_variantId_key"
  ON "ProductSalesDaily"("accountId", "date", "productId", "variantId");
