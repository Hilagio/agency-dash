-- Shopify connection + the order feed (BUILD-SPEC §4.3/§8 reconciliation, Phase 8).
-- Idempotent (IF NOT EXISTS) so it re-runs cleanly after a partially-applied /
-- interrupted first attempt (P3009 recovery).

CREATE TABLE IF NOT EXISTS "ShopifyConnection" (
  "accountId"   TEXT NOT NULL PRIMARY KEY,
  "shopDomain"  TEXT NOT NULL,
  "accessToken" TEXT NOT NULL,
  "scope"       TEXT NOT NULL DEFAULT '',
  "installedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastSyncAt"  TIMESTAMP(3),
  "updatedAt"   TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ShopifyConnection_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "ShopifyConnection_shopDomain_key" ON "ShopifyConnection"("shopDomain");

CREATE TABLE IF NOT EXISTS "OrderDaily" (
  "id"         TEXT NOT NULL PRIMARY KEY,
  "accountId"  TEXT NOT NULL,
  "date"       TEXT NOT NULL,
  "orders"     INTEGER NOT NULL,
  "revenue"    DOUBLE PRECISION NOT NULL,
  "currency"   TEXT NOT NULL DEFAULT 'EUR',
  CONSTRAINT "OrderDaily_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "OrderDaily_accountId_date_key" ON "OrderDaily"("accountId", "date");
CREATE INDEX IF NOT EXISTS "OrderDaily_accountId_date_idx" ON "OrderDaily"("accountId", "date");
