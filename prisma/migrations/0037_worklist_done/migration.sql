-- Mark-as-done for the nightly worklist action (cockpit + diagnose checkbox).
-- Additive + idempotent.
ALTER TABLE "Account" ADD COLUMN IF NOT EXISTS "worklistDoneAt" TIMESTAMP(3);
ALTER TABLE "Account" ADD COLUMN IF NOT EXISTS "worklistDoneBy" TEXT;
