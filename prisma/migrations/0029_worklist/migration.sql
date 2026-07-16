-- Overnight agentic worklist item per account (JSON). Additive + idempotent.
ALTER TABLE "Account" ADD COLUMN IF NOT EXISTS "worklist" TEXT;
ALTER TABLE "Account" ADD COLUMN IF NOT EXISTS "worklistAt" TIMESTAMP(3);
