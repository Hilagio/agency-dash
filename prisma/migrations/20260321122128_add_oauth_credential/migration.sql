-- CreateTable
CREATE TABLE "OAuthCredential" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "refreshToken" TEXT NOT NULL,
    "customerIds" TEXT NOT NULL DEFAULT '[]',
    "updatedAt" DATETIME NOT NULL
);
