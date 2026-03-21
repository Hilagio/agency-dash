-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "googleAdsId" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "monthlyBudget" REAL,
    "industry" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ConstraintSnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rawSignals" TEXT NOT NULL,
    "scoreMeasurement" REAL NOT NULL,
    "scoreTraffic" REAL NOT NULL,
    "scoreConversion" REAL NOT NULL,
    "scoreFunnel" REAL NOT NULL,
    "scoreEconomics" REAL NOT NULL,
    "governingConstraint" TEXT NOT NULL,
    "constraintReason" TEXT NOT NULL,
    CONSTRAINT "ConstraintSnapshot_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ActionRecommendation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "snapshotId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bucket" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "impact" TEXT NOT NULL,
    "effort" TEXT NOT NULL,
    "safeToAutomate" BOOLEAN NOT NULL DEFAULT false,
    "actionType" TEXT NOT NULL,
    "actionPayload" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "executedAt" DATETIME,
    "executionLog" TEXT,
    "isEscalation" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ActionRecommendation_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ActionRecommendation_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "ConstraintSnapshot" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChatSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ChatSession_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChatMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChatSession" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_googleAdsId_key" ON "Account"("googleAdsId");
