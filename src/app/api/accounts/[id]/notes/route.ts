/**
 * GET  /api/accounts/[id]/notes — list notes for an account (newest first)
 * POST /api/accounts/[id]/notes — add a note
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const notes = await prisma.accountNote.findMany({
    where: { accountId: id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(notes);
}

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { content, author } = await req.json() as { content: string; author?: string };

  if (!content?.trim()) {
    return NextResponse.json({ error: "content is required" }, { status: 400 });
  }

  const note = await prisma.accountNote.create({
    data: { accountId: id, content: content.trim(), author: author?.trim() ?? "" },
  });

  return NextResponse.json(note, { status: 201 });
}
