-- Shopify Flow ingestion: a per-account webhook URL (flowToken) that a merchant's
-- "when order created → send HTTP request" Flow posts to, plus a per-order event
-- table for idempotency (retried Flow runs must not double-count). Additive + idempotent.

ALTER TABLE "Account" ADD COLUMN IF NOT EXISTS "flowToken" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "Account_flowToken_key" ON "Account"("flowToken");

CREATE TABLE IF NOT EXISTS "ShopifyFlowEvent" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ShopifyFlowEvent_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
  ALTER TABLE "ShopifyFlowEvent" ADD CONSTRAINT "ShopifyFlowEvent_accountId_fkey"
    FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "ShopifyFlowEvent_accountId_orderId_key" ON "ShopifyFlowEvent"("accountId", "orderId");
CREATE INDEX IF NOT EXISTS "ShopifyFlowEvent_accountId_date_idx" ON "ShopifyFlowEvent"("accountId", "date");
