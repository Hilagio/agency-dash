-- Shopify deprecated non-expiring Admin API tokens. Offline tokens now expire
-- (~1h) and are rotated with a single-use refresh token (~90d). Store the refresh
-- token and both expiries. Additive + idempotent; legacy rows keep NULLs and are
-- treated as "needs reconnect" by the app.
ALTER TABLE "ShopifyConnection" ADD COLUMN IF NOT EXISTS "refreshToken" TEXT;
ALTER TABLE "ShopifyConnection" ADD COLUMN IF NOT EXISTS "accessTokenExpiresAt" TIMESTAMP(3);
ALTER TABLE "ShopifyConnection" ADD COLUMN IF NOT EXISTS "refreshTokenExpiresAt" TIMESTAMP(3);
