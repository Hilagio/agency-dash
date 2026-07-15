-- Client Context Pack (per-account enrichment for the 90-day plan generator).
-- Additive + idempotent.
CREATE TABLE IF NOT EXISTS "ClientContext" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "amName" TEXT,
    "goal" TEXT,
    "mainKpi" TEXT,
    "targetRoasNote" TEXT,
    "adsStartedNote" TEXT,
    "strategyPreference" TEXT,
    "usps" TEXT,
    "audienceNuances" TEXT,
    "makeOrBreak" TEXT,
    "anythingElse" TEXT,
    "netMarginPct" DOUBLE PRECISION,
    "breakEvenRoas" DOUBLE PRECISION,
    "defaultLanguage" TEXT NOT NULL DEFAULT 'en',
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClientContext_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ClientContext_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "ClientContext_accountId_key" ON "ClientContext"("accountId");
