-- CreateTable
CREATE TABLE "ClientActionPlan" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "snapshotId" TEXT,

    CONSTRAINT "ClientActionPlan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClientActionPlan" ADD CONSTRAINT "ClientActionPlan_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
