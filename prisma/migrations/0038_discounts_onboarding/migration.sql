-- Discount performance per day per code + account onboarding mark.
-- Additive + idempotent: runs safely on a database where it already applied.

ALTER TABLE "Account" ADD COLUMN IF NOT EXISTS "onboardedAt" TIMESTAMP(3);

CREATE TABLE IF NOT EXISTS "DiscountDaily" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "orders" INTEGER NOT NULL DEFAULT 0,
    "discounted" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "revenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'EUR',

    CONSTRAINT "DiscountDaily_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "DiscountDaily_accountId_date_code_key"
    ON "DiscountDaily"("accountId", "date", "code");
CREATE INDEX IF NOT EXISTS "DiscountDaily_accountId_date_idx"
    ON "DiscountDaily"("accountId", "date");

DO $$ BEGIN
    ALTER TABLE "DiscountDaily"
        ADD CONSTRAINT "DiscountDaily_accountId_fkey"
        FOREIGN KEY ("accountId") REFERENCES "Account"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
