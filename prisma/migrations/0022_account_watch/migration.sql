-- Per-user "my accounts" watchlist. Additive + idempotent (FKs inline in the
-- guarded CREATE TABLE so re-runs are safe even after an interrupted deploy).
CREATE TABLE IF NOT EXISTS "AccountWatch" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AccountWatch_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "AccountWatch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AccountWatch_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "AccountWatch_userId_accountId_key" ON "AccountWatch"("userId", "accountId");
CREATE INDEX IF NOT EXISTS "AccountWatch_userId_idx" ON "AccountWatch"("userId");
