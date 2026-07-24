-- Cache the MCC child-account list so the cockpit can flag accounts that
-- exist in the MCC but not in the system. Additive + idempotent.
ALTER TABLE "OAuthCredential" ADD COLUMN IF NOT EXISTS "mccAccounts" TEXT;
ALTER TABLE "OAuthCredential" ADD COLUMN IF NOT EXISTS "mccSyncedAt" TIMESTAMP(3);
