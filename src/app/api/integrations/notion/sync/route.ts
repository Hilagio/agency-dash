/**
 * POST /api/integrations/notion/sync
 *
 * Re-fetches all selected pages from Notion and updates the cache.
 * Called after page selection changes or on manual refresh.
 * Returns the number of pages synced and any per-page errors.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized } from "@/lib/auth";
import { fetchPageContent, listNotionPages } from "@/lib/integrations/notion";

export async function POST() {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const conn = await prisma.notionConnection.findUnique({ where: { organizationId: ctx.orgId } });
  if (!conn) return NextResponse.json({ error: "not connected" }, { status: 404 });

  const selectedIds: string[] = JSON.parse(conn.selectedPageIds);
  if (selectedIds.length === 0) {
    return NextResponse.json({ synced: 0, errors: [] });
  }

  // We need page titles too — fetch the full list and filter to selected
  let titleMap: Record<string, string> = {};
  try {
    const all = await listNotionPages(conn.accessToken);
    titleMap = Object.fromEntries(all.map(p => [p.id.replace(/-/g, ""), p.title]));
    all.forEach(p => { titleMap[p.id] = p.title; });
  } catch {
    // proceed without titles if listing fails
  }

  const errors: string[] = [];
  let synced = 0;

  for (const pageId of selectedIds) {
    try {
      const content = await fetchPageContent(conn.accessToken, pageId);
      const title   = titleMap[pageId] ?? titleMap[pageId.replace(/-/g, "")] ?? "Untitled";

      await prisma.notionPageCache.upsert({
        where:  { connectionId_pageId: { connectionId: conn.id, pageId } },
        update: { content, title, fetchedAt: new Date() },
        create: { connectionId: conn.id, pageId, title, content },
      });
      synced++;
    } catch (err) {
      errors.push(`${pageId}: ${err instanceof Error ? err.message : "unknown error"}`);
    }
  }

  await prisma.notionConnection.update({
    where: { id: conn.id },
    data:  { lastSyncedAt: new Date() },
  });

  return NextResponse.json({ synced, errors });
}
