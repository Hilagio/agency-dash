/**
 * POST /api/integrations/notion/sync-stores
 *
 * Read-only, nightly sync of the Notion "Stores" database into Account rows.
 * Notion is never written back to.
 *
 * Two ways to trigger:
 *  1. Session (manual, from settings) — syncs the caller's organization.
 *  2. Nightly cron — send `Authorization: Bearer $CRON_SECRET`
 *     (or header `x-cron-secret: $CRON_SECRET`). Syncs every org that has a
 *     Notion connection.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized } from "@/lib/auth";
import { syncStoresFromNotion, type StoresSyncResult } from "@/lib/integrations/notion-stores";

export const dynamic = "force-dynamic";

function isCronRequest(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.get("authorization");
  const header = req.headers.get("x-cron-secret");
  return auth === `Bearer ${secret}` || header === secret;
}

async function syncOrg(organizationId: string): Promise<StoresSyncResult & { organizationId: string; error?: string }> {
  const conn = await prisma.notionConnection.findUnique({ where: { organizationId } });
  if (!conn) {
    return { organizationId, created: 0, updated: 0, deactivated: 0, skipped: [], errors: [], error: "no notion connection" };
  }
  try {
    const res = await syncStoresFromNotion(conn.accessToken, organizationId);
    // Persist the report — skipped/errored stores must be visible in the UI,
    // not just in whatever called the cron.
    await prisma.notionConnection.update({
      where: { id: conn.id },
      data: { lastSyncedAt: new Date(), lastSyncResult: JSON.stringify(res).slice(0, 20_000) },
    });
    return { organizationId, ...res };
  } catch (err) {
    const error = err instanceof Error ? err.message : "unknown error";
    await prisma.notionConnection.update({
      where: { id: conn.id },
      data: { lastSyncResult: JSON.stringify({ created: 0, updated: 0, deactivated: 0, skipped: [], errors: [error] }) },
    }).catch(() => null);
    return { organizationId, created: 0, updated: 0, deactivated: 0, skipped: [], errors: [], error };
  }
}

export async function POST(req: NextRequest) {
  // Nightly cron path: sync every connected org.
  if (isCronRequest(req)) {
    const conns = await prisma.notionConnection.findMany({ select: { organizationId: true } });
    const results = [];
    for (const c of conns) results.push(await syncOrg(c.organizationId));
    return NextResponse.json({ mode: "cron", orgs: results.length, results });
  }

  // Manual path: sync the caller's org.
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const result = await syncOrg(ctx.orgId);
  const status = result.error ? 422 : 200;
  return NextResponse.json({ mode: "manual", ...result }, { status });
}
