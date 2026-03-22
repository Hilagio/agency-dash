-- SOP progress tracking: which steps of each SOP have been done per account
CREATE TABLE "AccountSopProgress" (
  "id"             TEXT NOT NULL,
  "accountId"      TEXT NOT NULL,
  "sopId"          TEXT NOT NULL,
  "completedSteps" TEXT NOT NULL DEFAULT '[]',
  "startedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AccountSopProgress_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "AccountSopProgress_accountId_sopId_key" UNIQUE ("accountId", "sopId"),
  CONSTRAINT "AccountSopProgress_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "AccountSopProgress_sopId_fkey" FOREIGN KEY ("sopId") REFERENCES "AgencySop"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
