/**
 * POST /api/org/switch — switch the session to another organization the user
 * is a member of (no sign-out dance needed after a join approval).
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { setSessionCookie } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const body = await req.json().catch(() => ({})) as { organizationId?: string };
  if (!body.organizationId) return NextResponse.json({ error: "organizationId required" }, { status: 400 });

  const membership = await prisma.organizationMember.findUnique({
    where: { organizationId_userId: { organizationId: body.organizationId, userId: ctx.userId } },
  });
  if (!membership) return forbidden();

  await setSessionCookie({ userId: ctx.userId, orgId: body.organizationId, email: ctx.email, name: ctx.name ?? null });
  return NextResponse.json({ ok: true, orgId: body.organizationId });
}
