/**
 * GET  /api/sops — list all SOPs (active ones first)
 * POST /api/sops — create a new SOP
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const sops = await prisma.agencySop.findMany({
    orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
    select: { id: true, title: true, content: true, tags: true, isActive: true, createdAt: true },
  });
  return NextResponse.json(sops);
}

export async function POST(req: NextRequest) {
  const { title, content, tags } = await req.json() as {
    title: string;
    content: string;
    tags?: string[];
  };

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "title and content are required" }, { status: 400 });
  }

  const sop = await prisma.agencySop.create({
    data: {
      title: title.trim(),
      content: content.trim(),
      tags: JSON.stringify(tags ?? []),
    },
  });

  return NextResponse.json(sop, { status: 201 });
}
