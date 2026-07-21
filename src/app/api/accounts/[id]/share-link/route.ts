/**
 * GET  /api/accounts/[id]/share-link — the account's client-facing share URL
 *      (minted on first request) so a specialist can copy it for the client.
 * POST /api/accounts/[id]/share-link — rotate the token (old link stops working).
 *
 * The link opens a PUBLIC, read-only performance page at /share/<token>. Only
 * this endpoint (org-scoped, authed) can mint/rotate the token; the public page
 * reads curated metrics via /api/share/<token>.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/** 256-bit unguessable token — two concatenated UUIDs, hex only. */
function newToken(): string {
  return (crypto.randomUUID() + crypto.randomUUID()).replace(/-/g, "");
}

function baseUrl(): string {
  const domain = process.env.RAILWAY_PUBLIC_DOMAIN;
  return domain ? `https://${domain}` : "https://agency-dash-production.up.railway.app";
}

async function ensureToken(id: string, orgId: string, rotate: boolean) {
  const account = await prisma.account.findFirst({ where: { id, organizationId: orgId }, select: { id: true, shareToken: true } });
  if (!account) return null;
  let token = account.shareToken;
  if (!token || rotate) {
    token = newToken();
    await prisma.account.update({ where: { id }, data: { shareToken: token } });
  }
  return token;
}

export async function GET(_req: Request, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;
  const token = await ensureToken(id, ctx.orgId, false);
  if (!token) return forbidden();
  return NextResponse.json({ token, url: `${baseUrl()}/share/${token}` });
}

export async function POST(_req: Request, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;
  const token = await ensureToken(id, ctx.orgId, true);
  if (!token) return forbidden();
  return NextResponse.json({ token, url: `${baseUrl()}/share/${token}` });
}
