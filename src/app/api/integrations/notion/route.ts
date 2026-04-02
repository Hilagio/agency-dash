/**
 * /api/integrations/notion
 *
 * GET    — return connection status + synced pages
 * POST   — connect (save token, test connection, save workspace name)
 * PATCH  — update selected page IDs
 * DELETE — disconnect (remove connection + all cached pages)
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized } from "@/lib/auth";
import { getNotionWorkspaceName, listNotionPages } from "@/lib/integrations/notion";

export async function GET() {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const conn = await prisma.notionConnection.findUnique({
    where: { organizationId: ctx.orgId },
    include: { pageCache: { select: { pageId: true, title: true, fetchedAt: true } } },
  });

  if (!conn) return NextResponse.json({ connected: false });

  return NextResponse.json({
    connected:       true,
    workspaceName:   conn.workspaceName,
    selectedPageIds: JSON.parse(conn.selectedPageIds) as string[],
    lastSyncedAt:    conn.lastSyncedAt,
    cachedPages:     conn.pageCache,
  });
}

export async function POST(req: NextRequest) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { token } = await req.json() as { token: string };
  if (!token?.trim()) return NextResponse.json({ error: "token required" }, { status: 400 });

  // Validate token by fetching workspace name
  const workspaceName = await getNotionWorkspaceName(token.trim()).catch(() => null);
  if (workspaceName === null) {
    return NextResponse.json({ error: "Invalid token or Notion API unreachable" }, { status: 400 });
  }

  const conn = await prisma.notionConnection.upsert({
    where:  { organizationId: ctx.orgId },
    update: { accessToken: token.trim(), workspaceName },
    create: { organizationId: ctx.orgId, accessToken: token.trim(), workspaceName },
  });

  return NextResponse.json({ connected: true, workspaceName: conn.workspaceName });
}

export async function PATCH(req: NextRequest) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { selectedPageIds } = await req.json() as { selectedPageIds: string[] };

  const conn = await prisma.notionConnection.findUnique({ where: { organizationId: ctx.orgId } });
  if (!conn) return NextResponse.json({ error: "not connected" }, { status: 404 });

  await prisma.notionConnection.update({
    where: { organizationId: ctx.orgId },
    data:  { selectedPageIds: JSON.stringify(selectedPageIds) },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  await prisma.notionConnection.deleteMany({ where: { organizationId: ctx.orgId } });
  return NextResponse.json({ ok: true });
}

export { listNotionPages };
