-- Diagnostic spine (BUILD-SPEC §4/§6): daily time-series + change events.

ALTER TABLE "Account"
  ADD COLUMN "roasFloor"         DOUBLE PRECISION,
  ADD COLUMN "conversionLagDays" INTEGER NOT NULL DEFAULT 4,
  ADD COLUMN "timezone"          TEXT,
  ADD COLUMN "dataVerified"      BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE "MetricDaily" (
  "id"              TEXT NOT NULL PRIMARY KEY,
  "accountId"       TEXT NOT NULL,
  "date"            TEXT NOT NULL,
  "campaignId"      TEXT NOT NULL,
  "campaignName"    TEXT NOT NULL,
  "spend"           DOUBLE PRECISION NOT NULL,
  "impressions"     INTEGER NOT NULL,
  "clicks"          INTEGER NOT NULL,
  "conversions"     DOUBLE PRECISION NOT NULL,
  "conversionValue" DOUBLE PRECISION NOT NULL,
  CONSTRAINT "MetricDaily_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "MetricDaily_accountId_date_campaignId_key" ON "MetricDaily"("accountId", "date", "campaignId");
CREATE INDEX "MetricDaily_accountId_date_idx" ON "MetricDaily"("accountId", "date");

CREATE TABLE "MetricProductDaily" (
  "id"              TEXT NOT NULL PRIMARY KEY,
  "accountId"       TEXT NOT NULL,
  "date"            TEXT NOT NULL,
  "landingPageUrl"  TEXT NOT NULL,
  "productId"       TEXT,
  "productTitle"    TEXT,
  "clicks"          INTEGER NOT NULL,
  "spend"           DOUBLE PRECISION NOT NULL,
  "conversions"     DOUBLE PRECISION NOT NULL,
  "conversionValue" DOUBLE PRECISION NOT NULL,
  CONSTRAINT "MetricProductDaily_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "MetricProductDaily_accountId_date_landingPageUrl_key" ON "MetricProductDaily"("accountId", "date", "landingPageUrl");
CREATE INDEX "MetricProductDaily_accountId_date_idx" ON "MetricProductDaily"("accountId", "date");

CREATE TABLE "SearchTermDaily" (
  "id"              TEXT NOT NULL PRIMARY KEY,
  "accountId"       TEXT NOT NULL,
  "date"            TEXT NOT NULL,
  "campaignId"      TEXT NOT NULL,
  "searchTerm"      TEXT NOT NULL,
  "matchType"       TEXT NOT NULL,
  "clicks"          INTEGER NOT NULL,
  "cost"            DOUBLE PRECISION NOT NULL,
  "conversions"     DOUBLE PRECISION NOT NULL,
  "conversionValue" DOUBLE PRECISION NOT NULL,
  CONSTRAINT "SearchTermDaily_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "SearchTermDaily_accountId_date_campaignId_searchTerm_key" ON "SearchTermDaily"("accountId", "date", "campaignId", "searchTerm");
CREATE INDEX "SearchTermDaily_accountId_date_idx" ON "SearchTermDaily"("accountId", "date");

CREATE TABLE "ChangeEvent" (
  "id"           TEXT NOT NULL PRIMARY KEY,
  "accountId"    TEXT NOT NULL,
  "changedAt"    TIMESTAMP(3) NOT NULL,
  "userEmail"    TEXT,
  "campaignName" TEXT,
  "resourceType" TEXT NOT NULL,
  "changeType"   TEXT NOT NULL,
  "oldValue"     TEXT,
  "newValue"     TEXT,
  "raw"          TEXT NOT NULL,
  "dedupeKey"    TEXT NOT NULL,
  CONSTRAINT "ChangeEvent_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "ChangeEvent_dedupeKey_key" ON "ChangeEvent"("dedupeKey");
CREATE INDEX "ChangeEvent_accountId_changedAt_idx" ON "ChangeEvent"("accountId", "changedAt");
