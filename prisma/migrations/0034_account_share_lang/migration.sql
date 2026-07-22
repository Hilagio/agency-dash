-- Per-link language for the client share page (NL or EN, chosen at creation).
-- Additive + idempotent; existing rows default to Dutch.
ALTER TABLE "Account" ADD COLUMN IF NOT EXISTS "shareLang" TEXT NOT NULL DEFAULT 'nl';
