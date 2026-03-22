/**
 * GET /api/auth/callback
 * Google OAuth callback for user authentication.
 * 1. Exchanges code for tokens
 * 2. Fetches Google profile (email, name, picture)
 * 3. Creates or finds User in DB
 * 4. Finds their org (first membership) or leaves orgId null → onboard
 * 5. Sets session cookie and redirects
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { setSessionCookie } from "@/lib/session";

function getOrigin(req: NextRequest): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  const host  = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") ?? (process.env.NODE_ENV === "production" ? "https" : "http");
  if (host) return `${proto}://${host}`;
  return new URL(req.url).origin;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code  = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state");
  const origin = getOrigin(req);

  if (error || !code) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error ?? "no_code")}`);
  }

  // Decode next URL from state
  let next = "/";
  try {
    if (state) {
      const decoded = JSON.parse(Buffer.from(state, "base64url").toString());
      if (decoded.next && decoded.next.startsWith("/")) next = decoded.next;
    }
  } catch { /* ignore */ }

  // ── 1. Exchange code for tokens ──────────────────────────────────────────────
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id:     process.env.GOOGLE_ADS_CLIENT_ID!,
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
      redirect_uri:  `${origin}/api/auth/callback`,
      grant_type:    "authorization_code",
    }),
  });
  const tokens = await tokenRes.json() as { access_token?: string; error?: string };

  if (tokens.error || !tokens.access_token) {
    return NextResponse.redirect(`${origin}/login?error=token_exchange`);
  }

  // ── 2. Fetch user profile ────────────────────────────────────────────────────
  const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  const profile = await profileRes.json() as {
    sub: string; email?: string; name?: string; picture?: string;
  };

  if (!profile.email) {
    return NextResponse.redirect(`${origin}/login?error=no_email`);
  }

  // ── 3. Upsert user ───────────────────────────────────────────────────────────
  const user = await prisma.user.upsert({
    where:  { email: profile.email },
    update: { name: profile.name ?? null, image: profile.picture ?? null },
    create: { email: profile.email, name: profile.name ?? null, image: profile.picture ?? null },
  });

  // ── 4. Find first org membership ─────────────────────────────────────────────
  const membership = await prisma.organizationMember.findFirst({
    where:   { userId: user.id },
    include: { organization: true },
    orderBy: { createdAt: "asc" },
  });

  // ── 5. Set session and redirect ───────────────────────────────────────────────
  await setSessionCookie({
    userId: user.id,
    orgId:  membership?.organizationId ?? null,
    email:  user.email,
    name:   user.name ?? null,
  });

  const destination = membership ? next : "/onboard";
  return NextResponse.redirect(`${origin}${destination}`);
}
