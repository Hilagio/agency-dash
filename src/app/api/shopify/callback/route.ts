/**
 * GET /api/shopify/callback — Shopify redirects here after consent.
 *
 * Verifies the HMAC (proves the request came from Shopify), checks the state
 * nonce (CSRF), exchanges the code for a permanent Admin API token, and stores
 * the ShopifyConnection for the account. Then kicks the browser back to the
 * account page. The first order sync runs on the next ingest (or on demand).
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/auth";
import {
  shopifyAppConfig, isValidShopDomain, verifyShopifyHmac, exchangeCodeForToken,
} from "@/lib/integrations/shopify";
import { ingestAccountOrders } from "@/lib/diagnostics/orders";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function baseUrl(req: NextRequest): string {
  const domain = process.env.RAILWAY_PUBLIC_DOMAIN;
  if (domain) return domain.startsWith("http") ? domain : `https://${domain}`;
  return new URL(req.url).origin;
}
function redirectTo(req: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, baseUrl(req)));
}

interface StatePayload { accountId: string; nonce: string; }
function parseState(raw: string | null): StatePayload | null {
  if (!raw) return null;
  try {
    const p = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
    return typeof p?.accountId === "string" && typeof p?.nonce === "string" ? p : null;
  } catch { return null; }
}

export async function GET(req: NextRequest) {
  const ctx = await getAuthContext();
  if (!ctx) return redirectTo(req, "/login");

  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });

  const cfg = shopifyAppConfig();
  if (!cfg) return redirectTo(req, "/settings?shopify=error&reason=not-configured");

  const state = parseState(params.state ?? null);
  const accountId = state?.accountId ?? null;
  const bail = (reason: string) =>
    redirectTo(req, accountId ? `/diagnose/${accountId}?shopify=error&reason=${encodeURIComponent(reason)}` : "/settings?shopify=error");

  // 1. HMAC — the request must be signed by Shopify.
  if (!verifyShopifyHmac(params, cfg.apiSecret)) return bail("bad signature");

  // 2. CSRF — the state nonce must match the cookie we set at install.
  const cookieNonce = req.cookies.get("shopify_oauth_nonce")?.value;
  if (!state || !cookieNonce || cookieNonce !== state.nonce) return bail("state mismatch — restart the connection");

  // 3. Shop domain must be a real myshopify host.
  const shop = params.shop ?? "";
  if (!isValidShopDomain(shop)) return bail("invalid shop");

  // 4. The account must belong to the caller's org.
  const account = await prisma.account.findFirst({ where: { id: state.accountId, organizationId: ctx.orgId }, select: { id: true } });
  if (!account) return bail("account not found");

  // 5. Exchange the code for a permanent token and persist the connection.
  const code = params.code;
  if (!code) return bail("missing code");
  let token;
  try {
    token = await exchangeCodeForToken(shop, code, cfg);
  } catch (err) {
    return bail(err instanceof Error ? err.message : "token exchange failed");
  }

  const now = Date.now();
  const tokenData = {
    accessToken: token.accessToken,
    scope: token.scope,
    refreshToken: token.refreshToken ?? null,
    accessTokenExpiresAt: token.expiresIn ? new Date(now + token.expiresIn * 1000) : null,
    refreshTokenExpiresAt: token.refreshTokenExpiresIn ? new Date(now + token.refreshTokenExpiresIn * 1000) : null,
  };
  await prisma.shopifyConnection.upsert({
    where: { accountId: account.id },
    create: { accountId: account.id, shopDomain: shop, ...tokenData },
    update: { shopDomain: shop, ...tokenData },
  });

  // Pull the last 60 days of orders right away, so the account isn't left
  // "synced never" and nobody has to click Sync. Best-effort — a slow or failed
  // pull must not break the redirect back into the app.
  await ingestAccountOrders(account.id, 60).catch(() => null);

  const res = redirectTo(req, `/diagnose/${account.id}?shopify=connected`);
  res.cookies.delete("shopify_oauth_nonce");
  return res;
}
