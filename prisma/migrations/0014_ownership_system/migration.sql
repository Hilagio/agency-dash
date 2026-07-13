-- Account Ownership System
-- agency-dash becomes the system of record for account ownership (red/yellow/green).
-- Notion stays read-only: it only tells us which stores exist.

-- ── Account: read-only Notion mirror + ownership config ──────────────────────
ALTER TABLE "Account"
  ADD COLUMN "notionPageId"          TEXT,
  ADD COLUMN "clientName"            TEXT,
  ADD COLUMN "active"                BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "ownerId"               TEXT,
  ADD COLUMN "primaryKpi"            TEXT,
  ADD COLUMN "targetValue"           DOUBLE PRECISION,
  ADD COLUMN "tolYellowPct"          INTEGER NOT NULL DEFAULT 10,
  ADD COLUMN "tolRedPct"             INTEGER NOT NULL DEFAULT 25,
  ADD COLUMN "pacingGreenMin"        INTEGER NOT NULL DEFAULT 90,
  ADD COLUMN "pacingGreenMax"        INTEGER NOT NULL DEFAULT 110,
  ADD COLUMN "pacingYellowMin"       INTEGER NOT NULL DEFAULT 80,
  ADD COLUMN "pacingYellowMax"       INTEGER NOT NULL DEFAULT 120,
  ADD COLUMN "reviewFrequencyDays"   INTEGER NOT NULL DEFAULT 7,
  ADD COLUMN "minSpendForEval"       DOUBLE PRECISION NOT NULL DEFAULT 0,
  ADD COLUMN "minConversionsForEval" DOUBLE PRECISION NOT NULL DEFAULT 0,
  ADD COLUMN "ownershipEnabled"      BOOLEAN NOT NULL DEFAULT false;

CREATE UNIQUE INDEX "Account_notionPageId_key" ON "Account"("notionPageId");

-- ── Owner ─────────────────────────────────────────────────────────────────────
CREATE TABLE "Owner" (
  "id"             TEXT NOT NULL PRIMARY KEY,
  "organizationId" TEXT NOT NULL,
  "name"           TEXT NOT NULL,
  "slackUserId"    TEXT,
  "isTeamLead"     BOOLEAN NOT NULL DEFAULT false,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Owner_organizationId_fkey"
    FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Owner_organizationId_name_key" ON "Owner"("organizationId", "name");

ALTER TABLE "Account"
  ADD CONSTRAINT "Account_ownerId_fkey"
    FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ── AccountStatus (history, one row per run) ──────────────────────────────────
CREATE TABLE "AccountStatus" (
  "id"         TEXT NOT NULL PRIMARY KEY,
  "accountId"  TEXT NOT NULL,
  "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "status"     TEXT NOT NULL,
  "reasons"    TEXT NOT NULL DEFAULT '[]',
  "metrics"    TEXT NOT NULL DEFAULT '{}',
  CONSTRAINT "AccountStatus_accountId_fkey"
    FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX "AccountStatus_accountId_computedAt_idx" ON "AccountStatus"("accountId", "computedAt");

-- ── AccountSlackState (pinned card + last alert) ──────────────────────────────
CREATE TABLE "AccountSlackState" (
  "accountId"         TEXT NOT NULL PRIMARY KEY,
  "cardMessageTs"     TEXT,
  "lastAlertedStatus" TEXT,
  "lastAlertAt"       TIMESTAMP(3),
  "updatedAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AccountSlackState_accountId_fkey"
    FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ── Review (human-confirmed review log — source of truth for recency) ─────────
CREATE TABLE "Review" (
  "id"         TEXT NOT NULL PRIMARY KEY,
  "accountId"  TEXT NOT NULL,
  "reviewedBy" TEXT NOT NULL,
  "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "note"       TEXT NOT NULL,
  CONSTRAINT "Review_accountId_fkey"
    FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX "Review_accountId_reviewedAt_idx" ON "Review"("accountId", "reviewedAt");

-- ── OwnershipAction (the ownership log) ───────────────────────────────────────
CREATE TABLE "OwnershipAction" (
  "id"             TEXT NOT NULL PRIMARY KEY,
  "accountId"      TEXT NOT NULL,
  "openedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "statusAtOpen"   TEXT NOT NULL,
  "ownerId"        TEXT,
  "deadlineAt"     TIMESTAMP(3),
  "investigated"   TEXT,
  "conclusion"     TEXT,
  "actionTaken"    TEXT,
  "noChangeReason" TEXT,
  "reassessAt"     TIMESTAMP(3),
  "closedAt"       TIMESTAMP(3),
  "closedBy"       TEXT,
  CONSTRAINT "OwnershipAction_accountId_fkey"
    FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "OwnershipAction_ownerId_fkey"
    FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "OwnershipAction_accountId_openedAt_idx" ON "OwnershipAction"("accountId", "openedAt");

-- ── Exception (must have an end date) ─────────────────────────────────────────
CREATE TABLE "Exception" (
  "id"            TEXT NOT NULL PRIMARY KEY,
  "accountId"     TEXT NOT NULL,
  "reason"        TEXT NOT NULL,
  "suppressRules" TEXT NOT NULL DEFAULT '[]',
  "startsAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "endsAt"        TIMESTAMP(3) NOT NULL,
  "createdBy"     TEXT NOT NULL,
  CONSTRAINT "Exception_accountId_fkey"
    FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX "Exception_accountId_endsAt_idx" ON "Exception"("accountId", "endsAt");

-- ── Escalation ────────────────────────────────────────────────────────────────
CREATE TABLE "Escalation" (
  "id"           TEXT NOT NULL PRIMARY KEY,
  "accountId"    TEXT NOT NULL,
  "actionId"     TEXT,
  "type"         TEXT NOT NULL,
  "escalatedAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "notifiedUser" TEXT,
  CONSTRAINT "Escalation_accountId_fkey"
    FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Escalation_actionId_fkey"
    FOREIGN KEY ("actionId") REFERENCES "OwnershipAction"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "Escalation_accountId_escalatedAt_idx" ON "Escalation"("accountId", "escalatedAt");
