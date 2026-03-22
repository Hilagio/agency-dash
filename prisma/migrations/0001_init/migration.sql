-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "googleAdsId" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "monthlyBudget" DOUBLE PRECISION,
    "industry" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConstraintSnapshot" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rawSignals" TEXT NOT NULL,
    "scoreMeasurement" DOUBLE PRECISION NOT NULL,
    "scoreTraffic" DOUBLE PRECISION NOT NULL,
    "scoreConversion" DOUBLE PRECISION NOT NULL,
    "scoreFunnel" DOUBLE PRECISION NOT NULL,
    "scoreEconomics" DOUBLE PRECISION NOT NULL,
    "governingConstraint" TEXT NOT NULL,
    "constraintReason" TEXT NOT NULL,

    CONSTRAINT "ConstraintSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionRecommendation" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "snapshotId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bucket" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "impact" TEXT NOT NULL,
    "effort" TEXT NOT NULL,
    "safeToAutomate" BOOLEAN NOT NULL DEFAULT false,
    "actionType" TEXT NOT NULL,
    "actionPayload" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "executedAt" TIMESTAMP(3),
    "executionLog" TEXT,
    "isEscalation" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ActionRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OAuthCredential" (
    "id" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "customerIds" TEXT NOT NULL DEFAULT '[]',
    "loginCustomerId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OAuthCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatSession" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_googleAdsId_key" ON "Account"("googleAdsId");

-- AddForeignKey
ALTER TABLE "ConstraintSnapshot" ADD CONSTRAINT "ConstraintSnapshot_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionRecommendation" ADD CONSTRAINT "ActionRecommendation_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionRecommendation" ADD CONSTRAINT "ActionRecommendation_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "ConstraintSnapshot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChatSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
