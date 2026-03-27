-- Add market and business context fields to Account.
-- country: auto-detected from Google Ads time_zone but can be overridden.
-- businessModel/monthlyChurnRate: manual — not available in Google Ads.
-- AOV is computed live (conversions_value / conversions), no DB column needed.
ALTER TABLE "Account" ADD COLUMN "country"          TEXT;
ALTER TABLE "Account" ADD COLUMN "businessModel"    TEXT;
ALTER TABLE "Account" ADD COLUMN "monthlyChurnRate" DOUBLE PRECISION;
