-- Client-facing share link: an unguessable per-account token that opens a
-- public, read-only performance page at /share/<token>. Additive + idempotent.
ALTER TABLE "Account" ADD COLUMN IF NOT EXISTS "shareToken" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "Account_shareToken_key" ON "Account"("shareToken");
