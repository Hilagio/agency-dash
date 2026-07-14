/**
 * GET /api/shopify/install?accountId=…&shop=… — start the Shopify OAuth flow.
 *
 * Validates the account (in the caller's org) and the shop domain, sets a signed
 * state nonce cookie (CSRF), and redirects the browser to Shopify's consent
 * screen. Shopify redirects back to /api/shopify/callback.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/auth";
import {
  shopifyAppConfig, normalizeShopDomain, isValidShopDomain, buildAuthorizeUrl,
} from "@/lib/integrations/shopify";

export const dynamic = "force-dynamic";

function baseUrl(req: NextRequest): string {
  const domain = process.env.RAILWAY_PUBLIC_DOMAIN;
  if (domain) return domain.startsWith("http") ? domain : `https://${domain}`;
  return new URL(req.url).origin;
}

function fail(req: NextRequest, accountId: string | null, reason: string) {
  const to = accountId ? `/diagnose/${accountId}?shopify=error&reason=${encodeURIComponent(reason)}` : "/settings?shopify=error";
  return NextResponse.redirect(new URL(to, baseUrl(req)));
}

export async function GET(req: NextRequest) {
  const ctx = await getAuthContext();
  const url = new URL(req.url);
  const accountId = url.searchParams.get("accountId");
  const shopRaw = url.searchParams.get("shop");

  if (!ctx) return NextResponse.redirect(new URL("/login", baseUrl(req)));
  if (!accountId || !shopRaw) return fail(req, accountId, "missing accountId or shop");

  const cfg = shopifyAppConfig();
  if (!cfg) return fail(req, accountId, "Shopify app not configured (set SHOPIFY_API_KEY / SHOPIFY_API_SECRET)");

  const account = await prisma.account.findFirst({ where: { id: accountId, organizationId: ctx.orgId }, select: { id: true } });
  if (!account) return fail(req, accountId, "account not found");

  const shop = normalizeShopDomain(shopRaw);
  if (!isValidShopDomain(shop)) return fail(req, accountId, "invalid myshopify.com domain");

  const nonce = crypto.randomBytes(16).toString("hex");
  const state = Buffer.from(JSON.stringify({ accountId, nonce })).toString("base64url");
  const redirectUri = `${baseUrl(req)}/api/shopify/callback`;

  const res = NextResponse.redirect(buildAuthorizeUrl(shop, cfg, redirectUri, state));
  res.cookies.set("shopify_oauth_nonce", nonce, {
    httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 600,
  });
  return res;
}
