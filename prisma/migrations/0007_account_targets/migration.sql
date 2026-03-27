-- Add per-account scoring targets and landing page URL
ALTER TABLE "Account" ADD COLUMN "targetRoas"         DOUBLE PRECISION;
ALTER TABLE "Account" ADD COLUMN "targetCpa"          DOUBLE PRECISION;
ALTER TABLE "Account" ADD COLUMN "grossMarginPercent" DOUBLE PRECISION;
ALTER TABLE "Account" ADD COLUMN "leadToSaleRate"     DOUBLE PRECISION;
ALTER TABLE "Account" ADD COLUMN "landingPageUrl"     TEXT;
