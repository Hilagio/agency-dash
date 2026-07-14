-- Product-level data (BUILD-SPEC §4 concentration, §8 buyability, Phase 8).
-- Idempotent for P3009 recovery.

CREATE TABLE IF NOT EXISTS "ProductAdsDaily" (
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
CREATE UNIQUE INDEX IF NOT EXISTS "ProductAdsDaily_accountId_date_itemId_key" ON "ProductAdsDaily"("accountId", "date", "itemId");
CREATE INDEX IF NOT EXISTS "ProductAdsDaily_accountId_date_idx" ON "ProductAdsDaily"("accountId", "date");

CREATE TABLE IF NOT EXISTS "ProductSalesDaily" (
  "id"        TEXT NOT NULL PRIMARY KEY,
  "accountId" TEXT NOT NULL,
  "date"      TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "title"     TEXT NOT NULL DEFAULT '',
  "units"     INTEGER NOT NULL,
  "revenue"   DOUBLE PRECISION NOT NULL,
  "currency"  TEXT NOT NULL DEFAULT 'EUR',
  CONSTRAINT "ProductSalesDaily_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "ProductSalesDaily_accountId_date_productId_key" ON "ProductSalesDaily"("accountId", "date", "productId");
CREATE INDEX IF NOT EXISTS "ProductSalesDaily_accountId_date_idx" ON "ProductSalesDaily"("accountId", "date");

CREATE TABLE IF NOT EXISTS "Product" (
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
CREATE UNIQUE INDEX IF NOT EXISTS "Product_accountId_externalId_key" ON "Product"("accountId", "externalId");
