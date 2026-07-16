-- Freshness mark for manually uploaded Shopify data (CSV). The rows live in
-- OrderDaily / ProductSalesDaily; this records when they were uploaded and the
-- range they cover, so the agent keeps using them until stale and always states
-- their age. Additive + idempotent.
CREATE TABLE IF NOT EXISTS "ShopifyUpload" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'csv',
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedBy" TEXT,
    "rows" INTEGER NOT NULL DEFAULT 0,
    "rangeStart" TEXT,
    "rangeEnd" TEXT,
    CONSTRAINT "ShopifyUpload_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
  ALTER TABLE "ShopifyUpload" ADD CONSTRAINT "ShopifyUpload_accountId_fkey"
    FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "ShopifyUpload_accountId_kind_key" ON "ShopifyUpload"("accountId", "kind");
CREATE INDEX IF NOT EXISTS "ShopifyUpload_accountId_idx" ON "ShopifyUpload"("accountId");
