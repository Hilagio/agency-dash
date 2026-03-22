/**
 * GET /api/invite/[token] — accept an invite
 * If user is signed in: adds them to the org and redirects to /
 * If user is not signed in: redirects to /login?next=/api/invite/[token]
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, setSessionCookie } from "@/lib/session";

type Params = { params: Promise<{ token: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { token } = await params;
  const origin = process.env.NEXT_PUBLIC_BASE_URL ?? new URL(req.url).origin;

  const invite = await prisma.organizationInvite.findUnique({
    where: { token },
    include: { organization: true },
  });

  if (!invite || invite.usedAt || invite.expiresAt < new Date()) {
    return NextResponse.redirect(`${origin}/?invite_error=expired`);
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(`${origin}/login?next=/api/invite/${token}`);
  }

  // Add user to org
  await prisma.organizationMember.upsert({
    where: { organizationId_userId: { organizationId: invite.organizationId, userId: session.userId } },
    create: { organizationId: invite.organizationId, userId: session.userId, role: invite.role },
    update: { role: invite.role },
  });

  // Mark invite as used
  await prisma.organizationInvite.update({ where: { token }, data: { usedAt: new Date() } });

  // Update session with new orgId
  await setSessionCookie({
    userId: session.userId,
    orgId:  invite.organizationId,
    email:  session.email,
    name:   session.name,
  });

  return NextResponse.redirect(`${origin}/`);
}
