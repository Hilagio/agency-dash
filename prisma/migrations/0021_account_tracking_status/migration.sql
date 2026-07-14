-- Team-confirmed tracking status on Account (resolve-and-re-reason loop).
-- Additive + idempotent: safe to re-run and safe if a prior deploy was interrupted.
ALTER TABLE "Account" ADD COLUMN IF NOT EXISTS "trackingStatus" TEXT;
ALTER TABLE "Account" ADD COLUMN IF NOT EXISTS "trackingNote" TEXT;
ALTER TABLE "Account" ADD COLUMN IF NOT EXISTS "trackingSetAt" TIMESTAMP(3);
ALTER TABLE "Account" ADD COLUMN IF NOT EXISTS "trackingSetBy" TEXT;
