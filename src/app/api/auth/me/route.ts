/**
 * GET /api/auth/me — current session info
 */
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ user: null });

  let role = "OWNER";
  if (session.orgId) {
    const membership = await prisma.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: session.orgId, userId: session.userId } },
      select: { role: true },
    });
    if (membership) role = membership.role;
  }

  return NextResponse.json({
    user: {
      userId: session.userId,
      orgId:  session.orgId,
      email:  session.email,
      name:   session.name,
      role,
    },
  });
}
