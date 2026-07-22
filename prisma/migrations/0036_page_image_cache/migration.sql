-- Cached og:image per landing page, so the client dashboard can show product
-- photos without a Shopify connection. Additive + idempotent.
CREATE TABLE IF NOT EXISTS "PageImage" (
  "id" TEXT NOT NULL,
  "accountId" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "imageUrl" TEXT,
  "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PageImage_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "PageImage_accountId_url_key" ON "PageImage"("accountId", "url");
