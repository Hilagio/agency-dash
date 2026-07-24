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
  if (process.env.RAILWAY_PUBLIC_DOMAIN) return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
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

  console.log("[callback] debug", { code: !!code, error, origin });

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
  const tokens = await tokenRes.json() as { access_token?: string; error?: string; error_description?: string };
  console.log("[callback] token exchange:", { error: tokens.error, error_description: tokens.error_description, hasToken: !!tokens.access_token });

  if (tokens.error || !tokens.access_token) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(tokens.error ?? "token_exchange")}`);
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

  // ── 4. One agency = one workspace ────────────────────────────────────────────
  // Colleagues sign in with the same company email domain — they belong in the
  // SAME organization (the one holding the client accounts), not in accidental
  // personal orgs created via /onboard. At every login:
  //   a. ensure the user is a member of the biggest same-domain organization;
  //   b. land them in whichever of their orgs has the most accounts.
  const domain = profile.email.split("@")[1]?.toLowerCase();
  const PUBLIC_DOMAINS = new Set(["gmail.com", "googlemail.com", "outlook.com", "hotmail.com", "live.nl", "live.com", "yahoo.com", "icloud.com", "proton.me", "protonmail.com"]);
  if (domain && !PUBLIC_DOMAINS.has(domain)) {
    const colleagues = await prisma.organizationMember.findMany({
      where: { user: { email: { endsWith: `@${domain}` } } },
      include: { organization: { include: { _count: { select: { accounts: true } } } } },
      take: 50,
    });
    const teamOrg = colleagues.sort((a, b) => b.organization._count.accounts - a.organization._count.accounts)[0]?.organization ?? null;
    if (teamOrg && !colleagues.some(c => c.userId === user.id && c.organizationId === teamOrg.id)) {
      await prisma.organizationMember.create({
        data: { organizationId: teamOrg.id, userId: user.id, role: "SPECIALIST" },
      }).catch(() => null);
    }
  }

  const memberships = await prisma.organizationMember.findMany({
    where:   { userId: user.id },
    include: { organization: { include: { _count: { select: { accounts: true } } } } },
    orderBy: { createdAt: "asc" },
  });
  const membership = memberships.length
    ? [...memberships].sort((a, b) => b.organization._count.accounts - a.organization._count.accounts)[0]
    : null;

  // Self-heal: an organization whose members are ALL non-admin is stuck —
  // nobody can approve join requests or import accounts. Promote its earliest
  // member to OWNER (only fires when no OWNER/ADMIN exists at all).
  if (membership) {
    const admins = await prisma.organizationMember.count({
      where: { organizationId: membership.organizationId, role: { in: ["OWNER", "ADMIN"] } },
    });
    if (admins === 0) {
      const eldest = await prisma.organizationMember.findFirst({
        where: { organizationId: membership.organizationId },
        orderBy: { createdAt: "asc" },
      });
      if (eldest) await prisma.organizationMember.update({ where: { id: eldest.id }, data: { role: "OWNER" } }).catch(() => null);
    }
  }

  // ── 5. Set session and redirect ───────────────────────────────────────────────
  await setSessionCookie({
    userId: user.id,
    orgId:  membership?.organizationId ?? null,
    email:  user.email,
    name:   user.name ?? null,
  });

  // If next points to an invite, always go there — even for new users with no org yet.
  // The invite handler will add them to the org and set a proper session.
  const isInviteUrl = next.startsWith("/api/invite/");
  const destination = (membership || isInviteUrl) ? next : "/onboard";
  return NextResponse.redirect(`${origin}${destination}`);
}
