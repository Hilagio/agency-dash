-- CreateTable
CREATE TABLE "AccountNote" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccountNote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AccountNote" ADD CONSTRAINT "AccountNote_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
