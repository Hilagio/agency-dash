-- Repair tables left with an INCOMPLETE schema by the interrupted 0017 (P3009).
-- The idempotent `CREATE TABLE IF NOT EXISTS` in 0017 skipped a half-created
-- ShopifyConnection, leaving it missing columns the app expects
-- ("column (not available) does not exist"). These tables hold no data yet, so
-- drop and recreate all five commerce/product tables with the correct schema.

DROP TABLE IF EXISTS "OrderDaily" CASCADE;
DROP TABLE IF EXISTS "ProductAdsDaily" CASCADE;
DROP TABLE IF EXISTS "ProductSalesDaily" CASCADE;
DROP TABLE IF EXISTS "Product" CASCADE;
DROP TABLE IF EXISTS "ShopifyConnection" CASCADE;

CREATE TABLE "ShopifyConnection" (
  "accountId"   TEXT NOT NULL PRIMARY KEY,
  "shopDomain"  TEXT NOT NULL,
  "accessToken" TEXT NOT NULL,
  "scope"       TEXT NOT NULL DEFAULT '',
  "installedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastSyncAt"  TIMESTAMP(3),
  "updatedAt"   TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ShopifyConnection_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "ShopifyConnection_shopDomain_key" ON "ShopifyConnection"("shopDomain");

CREATE TABLE "OrderDaily" (
  "id"         TEXT NOT NULL PRIMARY KEY,
  "accountId"  TEXT NOT NULL,
  "date"       TEXT NOT NULL,
  "orders"     INTEGER NOT NULL,
  "revenue"    DOUBLE PRECISION NOT NULL,
  "currency"   TEXT NOT NULL DEFAULT 'EUR',
  CONSTRAINT "OrderDaily_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "OrderDaily_accountId_date_key" ON "OrderDaily"("accountId", "date");
CREATE INDEX "OrderDaily_accountId_date_idx" ON "OrderDaily"("accountId", "date");

CREATE TABLE "ProductAdsDaily" (
  "id"              TEXT NOT NULL PRIMARY KEY,
  "accountId"       TEXT NOT NULL,
  "date"            TEXT NOT NULL,
  "itemId"          TEXT NOT NULL,
  "title"           TEXT NOT NULL DEFAULT '',
  "spend"           DOUBLE PRECISION NOT NULL,
  "clicks"          INTEGER NOT NULL,
  "impressions"     INTEGER NOT NULL,
  "conversions"     DOUBLE PRECISION NOT NULL,
  "conversionValue" DOUBLE PRECISION NOT NULL,
  CONSTRAINT "ProductAdsDaily_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "ProductAdsDaily_accountId_date_itemId_key" ON "ProductAdsDaily"("accountId", "date", "itemId");
CREATE INDEX "ProductAdsDaily_accountId_date_idx" ON "ProductAdsDaily"("accountId", "date");

CREATE TABLE "ProductSalesDaily" (
  "id"           TEXT NOT NULL PRIMARY KEY,
  "accountId"    TEXT NOT NULL,
  "date"         TEXT NOT NULL,
  "productId"    TEXT NOT NULL,
  "variantId"    TEXT NOT NULL DEFAULT '',
  "title"        TEXT NOT NULL DEFAULT '',
  "variantTitle" TEXT NOT NULL DEFAULT '',
  "units"        INTEGER NOT NULL,
  "revenue"      DOUBLE PRECISION NOT NULL,
  "currency"     TEXT NOT NULL DEFAULT 'EUR',
  CONSTRAINT "ProductSalesDaily_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "ProductSalesDaily_accountId_date_productId_variantId_key" ON "ProductSalesDaily"("accountId", "date", "productId", "variantId");
CREATE INDEX "ProductSalesDaily_accountId_date_idx" ON "ProductSalesDaily"("accountId", "date");

CREATE TABLE "Product" (
  "id"          TEXT NOT NULL PRIMARY KEY,
  "accountId"   TEXT NOT NULL,
  "externalId"  TEXT NOT NULL,
  "title"       TEXT NOT NULL DEFAULT '',
  "productType" TEXT,
  "status"      TEXT,
  "price"       DOUBLE PRECISION,
  "sku"         TEXT,
  "updatedAt"   TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Product_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Product_accountId_externalId_key" ON "Product"("accountId", "externalId");
