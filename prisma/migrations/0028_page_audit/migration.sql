-- Pre-flight page audit (12 personas judge the page before spend). Additive + idempotent.
CREATE TABLE IF NOT EXISTS "PageAudit" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "pageType" TEXT NOT NULL,
    "renderMode" TEXT NOT NULL DEFAULT 'fetch',
    "score" INTEGER NOT NULL DEFAULT 0,
    "understand" INTEGER NOT NULL DEFAULT 0,
    "submit" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL DEFAULT 0,
    "summary" TEXT NOT NULL DEFAULT '',
    "personas" TEXT NOT NULL DEFAULT '[]',
    "fixes" TEXT NOT NULL DEFAULT '[]',
    "html" TEXT NOT NULL DEFAULT '',
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PageAudit_pkey" PRIMARY KEY ("id")
);
DO $$ BEGIN
  ALTER TABLE "PageAudit" ADD CONSTRAINT "PageAudit_accountId_fkey"
    FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
CREATE INDEX IF NOT EXISTS "PageAudit_accountId_createdAt_idx" ON "PageAudit"("accountId", "createdAt");
