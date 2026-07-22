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
import { publicOrigin } from "@/lib/base-url";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/** 256-bit unguessable token — two concatenated UUIDs, hex only. */
function newToken(): string {
  return (crypto.randomUUID() + crypto.randomUUID()).replace(/-/g, "");
}

/** Mint the token if needed (or rotate), and set the link's language if given. */
async function ensureToken(id: string, orgId: string, rotate: boolean, lang: string | null) {
  const account = await prisma.account.findFirst({ where: { id, organizationId: orgId }, select: { id: true, shareToken: true, shareLang: true } });
  if (!account) return null;
  const data: { shareToken?: string; shareLang?: string } = {};
  let token = account.shareToken;
  if (!token || rotate) { token = newToken(); data.shareToken = token; }
  const wantLang = lang === "en" || lang === "nl" ? lang : null;
  if (wantLang && wantLang !== account.shareLang) data.shareLang = wantLang;
  if (Object.keys(data).length) await prisma.account.update({ where: { id }, data });
  return { token, lang: data.shareLang ?? account.shareLang };
}

function langOf(req: Request): string | null {
  const l = new URL(req.url).searchParams.get("lang");
  return l === "en" || l === "nl" ? l : null;
}

export async function GET(req: Request, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;
  const res = await ensureToken(id, ctx.orgId, false, langOf(req));
  if (!res) return forbidden();
  return NextResponse.json({ token: res.token, lang: res.lang, url: `${publicOrigin()}/share/${res.token}` });
}

export async function POST(req: Request, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;
  const res = await ensureToken(id, ctx.orgId, true, langOf(req));
  if (!res) return forbidden();
  return NextResponse.json({ token: res.token, lang: res.lang, url: `${publicOrigin()}/share/${res.token}` });
}
