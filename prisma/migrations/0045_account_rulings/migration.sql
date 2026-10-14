-- Team rulings: settled corrections the AI must never re-raise.
CREATE TABLE IF NOT EXISTS "AccountRuling" (
  "id" TEXT NOT NULL,
  "accountId" TEXT NOT NULL,
  "text" TEXT NOT NULL,
  "by" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AccountRuling_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "AccountRuling_accountId_active_idx" ON "AccountRuling"("accountId", "active");
DO $$ BEGIN
  ALTER TABLE "AccountRuling" ADD CONSTRAINT "AccountRuling_accountId_fkey"
    FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
