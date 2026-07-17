/**
 * Return a valid Admin API access token for a Shopify connection, refreshing the
 * expiring offline token when it's near/at expiry and persisting the rotated
 * pair. Call this ONCE per operation and pass the result to every Admin API call
 * — the refresh token is single-use, so concurrent refreshes would invalidate
 * each other.
 */
import { prisma } from "@/lib/db";
import { shopifyAppConfig, refreshAccessToken } from "./shopify";

export interface ShopifyConnLike {
  accountId: string;
  shopDomain: string;
  accessToken: string;
  refreshToken: string | null;
  accessTokenExpiresAt: Date | null;
}

const SKEW_MS = 120_000; // refresh 2 minutes before the token actually expires

export class ShopifyReconnectError extends Error {}

export async function freshShopifyToken(conn: ShopifyConnLike): Promise<string> {
  // Still valid (expiring token with time left) → use as-is.
  if (conn.accessTokenExpiresAt && conn.accessTokenExpiresAt.getTime() - Date.now() > SKEW_MS) {
    return conn.accessToken;
  }
  // Legacy non-expiring token (no expiry, no refresh token) — Shopify rejects it.
  if (!conn.refreshToken) {
    throw new ShopifyReconnectError(
      "This store was connected with an old permanent token, which Shopify no longer accepts. Reconnect the store (click Connect) to switch to the new expiring token.",
    );
  }
  const cfg = shopifyAppConfig();
  if (!cfg) throw new Error("Shopify app not configured");

  const t = await refreshAccessToken(conn.shopDomain, conn.refreshToken, cfg);
  await prisma.shopifyConnection.update({
    where: { accountId: conn.accountId },
    data: {
      accessToken: t.accessToken,
      refreshToken: t.refreshToken ?? conn.refreshToken,
      accessTokenExpiresAt: t.expiresIn ? new Date(Date.now() + t.expiresIn * 1000) : null,
      refreshTokenExpiresAt: t.refreshTokenExpiresIn ? new Date(Date.now() + t.refreshTokenExpiresIn * 1000) : null,
    },
  });
  return t.accessToken;
}
