/**
 * PATCH  /api/sops/[id] — toggle active or update title/content
 * DELETE /api/sops/[id] — delete permanently
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json() as Partial<{ title: string; content: string; isActive: boolean; tags: string[] }>;

  const sop = await prisma.agencySop.update({
    where: { id },
    data: {
      ...(body.title     !== undefined && { title:    body.title }),
      ...(body.content   !== undefined && { content:  body.content }),
      ...(body.isActive  !== undefined && { isActive: body.isActive }),
      ...(body.tags      !== undefined && { tags:     JSON.stringify(body.tags) }),
    },
  });

  return NextResponse.json(sop);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  await prisma.agencySop.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
