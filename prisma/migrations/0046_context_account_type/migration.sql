-- Explicit Ecommerce / Lead-gen toggle on the Client Context Pack. Additive +
-- idempotent: safe to run on a live database.
ALTER TABLE "ClientContext" ADD COLUMN IF NOT EXISTS "accountType" TEXT;
