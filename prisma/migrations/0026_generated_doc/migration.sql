-- Library of generated brand documents per account (§agent → files out): saved,
-- versioned deliverables the team can reopen, re-download, or send. Additive +
-- idempotent.
CREATE TABLE IF NOT EXISTS "GeneratedDoc" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "docType" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "html" TEXT NOT NULL,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GeneratedDoc_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
  ALTER TABLE "GeneratedDoc" ADD CONSTRAINT "GeneratedDoc_accountId_fkey"
    FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS "GeneratedDoc_accountId_createdAt_idx" ON "GeneratedDoc"("accountId", "createdAt");
