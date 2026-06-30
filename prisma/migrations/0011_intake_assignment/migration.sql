-- Client intake fields (replaces Typeform)
ALTER TABLE "Account" ADD COLUMN "reportEmail"       TEXT;
ALTER TABLE "Account" ADD COLUMN "tosAcceptedAt"     TIMESTAMP(3);
ALTER TABLE "Account" ADD COLUMN "intakeToken"       TEXT;
ALTER TABLE "Account" ADD COLUMN "intakeCompletedAt" TIMESTAMP(3);
CREATE UNIQUE INDEX "Account_intakeToken_key" ON "Account"("intakeToken");

-- Team assignment
ALTER TABLE "Account" ADD COLUMN "assignedUserId" TEXT;
