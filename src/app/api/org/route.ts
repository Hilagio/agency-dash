/**
 * GET  /api/org — current org details + member list
 * POST /api/org — create a new organization (called from onboard page)
 * PATCH /api/org — update org name
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized } from "@/lib/auth";
import { getSession, setSessionCookie } from "@/lib/session";

export async function GET() {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const org = await prisma.organization.findUnique({
    where: { id: ctx.orgId },
    include: {
      members: {
        include: { user: { select: { id: true, email: true, name: true, image: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!org) return NextResponse.json({ error: "Org not found" }, { status: 404 });
  return NextResponse.json(org);
}

export async function POST(req: NextRequest) {
  // Only accessible from onboard — user may not have an orgId yet
  const session = await getSession();
  if (!session) return unauthorized();

  const { name } = await req.json() as { name: string };
  if (!name?.trim()) {
    return NextResponse.json({ error: "Organization name is required" }, { status: 400 });
  }

  // Create slug from name
  const slug = name.trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50) || "agency";

  // Ensure slug is unique
  const existingSlug = await prisma.organization.findFirst({ where: { slug } });
  const finalSlug = existingSlug ? `${slug}-${Date.now().toString(36)}` : slug;

  const org = await prisma.organization.create({
    data: { name: name.trim(), slug: finalSlug },
  });

  // Add creator as OWNER
  await prisma.organizationMember.create({
    data: { organizationId: org.id, userId: session.userId, role: "OWNER" },
  });

  // Update session cookie with new orgId
  await setSessionCookie({
    userId: session.userId,
    orgId:  org.id,
    email:  session.email,
    name:   session.name,
  });

  return NextResponse.json(org, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  // Only OWNER or ADMIN can rename
  const member = await prisma.organizationMember.findUnique({
    where: { organizationId_userId: { organizationId: ctx.orgId, userId: ctx.userId } },
  });
  if (!member || !["OWNER", "ADMIN"].includes(member.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { name } = await req.json() as { name?: string };
  if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const org = await prisma.organization.update({
    where: { id: ctx.orgId },
    data: { name: name.trim() },
  });

  return NextResponse.json(org);
}
