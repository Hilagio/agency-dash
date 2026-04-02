/**
 * GET /api/integrations/notion/pages
 *
 * Returns all pages visible to the stored integration token.
 * Used by the settings UI to let the user pick which pages to include.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized } from "@/lib/auth";
import { listNotionPages } from "@/lib/integrations/notion";

export async function GET() {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const conn = await prisma.notionConnection.findUnique({ where: { organizationId: ctx.orgId } });
  if (!conn) return NextResponse.json({ error: "not connected" }, { status: 404 });

  try {
    const pages = await listNotionPages(conn.accessToken);
    return NextResponse.json({ pages });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to list pages";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
