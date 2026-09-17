-- Live 90-day plan board: active plan per account + per-action team state.
-- Additive + idempotent, safe on a live database.
CREATE TABLE IF NOT EXISTS "PlanInstance" (
  "id" TEXT NOT NULL,
  "accountId" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "language" TEXT NOT NULL DEFAULT 'en',
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdBy" TEXT,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PlanInstance_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "PlanInstance_accountId_key" ON "PlanInstance"("accountId");
DO $$ BEGIN
  ALTER TABLE "PlanInstance" ADD CONSTRAINT "PlanInstance_accountId_fkey"
    FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "PlanActionState" (
  "id" TEXT NOT NULL,
  "planId" TEXT NOT NULL,
  "path" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'open',
  "assignee" TEXT,
  "note" TEXT,
  "doneAt" TIMESTAMP(3),
  "doneBy" TEXT,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PlanActionState_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "PlanActionState_planId_path_key" ON "PlanActionState"("planId", "path");
CREATE INDEX IF NOT EXISTS "PlanActionState_planId_idx" ON "PlanActionState"("planId");
DO $$ BEGIN
  ALTER TABLE "PlanActionState" ADD CONSTRAINT "PlanActionState_planId_fkey"
    FOREIGN KEY ("planId") REFERENCES "PlanInstance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
