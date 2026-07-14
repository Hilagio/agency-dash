-- Shopify connection + the order feed (BUILD-SPEC §4.3/§8 reconciliation, Phase 8).
-- ShopifyConnection holds the per-account OAuth access token; OrderDaily is the
-- daily order/revenue time-series used to reconcile Google Ads conversions
-- against real orders and to compute POAS.

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
