/**
 * GET /api/diagnostics/portfolio — every account's core numbers in one payload.
 *
 * Reads the latest *diagnostics* AccountStatus per account and extracts the
 * headline figures (spend, ROAS, POAS, orders, revenue, worst signal). Fast:
 * one status row per account, no live calls. Sorted worst-first.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized } from "@/lib/auth";
import type { Signal } from "@/lib/diagnostics/signals";
import { effectiveDoneAt } from "@/lib/diagnostics/done";

export const dynamic = "force-dynamic";

interface DiagMetrics {
  source?: string;
  dataVerified?: boolean;
  window?: { spend: number; conversions: number; conversionValue: number; days: number };
  commerce?: { orders: number; revenue: number; currency: string } | null;
  reconciliation?: { adsConversions: number; actualOrders: number } | null;
  grossMarginPct?: number | null;
  signals?: Signal[];
}
function parseDiag(json: string): DiagMetrics | null {
  try { const m = JSON.parse(json) as DiagMetrics; return m?.source === "diagnostics" ? m : null; }
  catch { return null; }
}

const STATUS_RANK: Record<string, number> = { red: 0, yellow: 1, green: 2, unknown: 3 };

export async function GET() {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const [accounts, watches, hiddenAccounts, notionConn, gadsCred, myMembership] = await Promise.all([
    prisma.account.findMany({
      where: { organizationId: ctx.orgId, active: true, archived: false },
      select: {
        id: true, name: true, clientName: true, grossMarginPercent: true,
        briefing: true, briefingAt: true, worklist: true, worklistAt: true, worklistDoneAt: true,
        owner: { select: { name: true } },
        shopify: { select: { shopDomain: true } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.accountWatch.findMany({ where: { userId: ctx.userId }, select: { accountId: true } }),
    // Accounts that exist but are filtered out of the cockpit — searchable so
    // "where did account X go" is answerable in the UI instead of a mystery.
    prisma.account.findMany({
      where: { organizationId: ctx.orgId, OR: [{ active: false }, { archived: true }] },
      select: { id: true, name: true, clientName: true, archived: true, active: true },
      orderBy: { name: "asc" },
    }),
    prisma.notionConnection.findUnique({
      where: { organizationId: ctx.orgId },
      select: { lastSyncedAt: true, lastSyncResult: true },
    }),
    prisma.oAuthCredential.findUnique({
      where: { organizationId: ctx.orgId },
      select: { mccAccounts: true, mccSyncedAt: true },
    }),
    prisma.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: ctx.orgId, userId: ctx.userId } },
      select: { role: true },
    }),
  ]);
  const watched = new Set(watches.map(w => w.accountId));

  const myRole = myMembership?.role ?? null;
  const isAdmin = myRole === "OWNER" || myRole === "ADMIN";

  // Pending join requests — surfaced to OWNER/ADMIN so approving a teammate is
  // one click in the cockpit instead of a hidden settings page.
  const joinRequests = isAdmin
    ? (await prisma.orgJoinRequest.findMany({
        where: { organizationId: ctx.orgId, status: "pending" },
        include: { user: { select: { email: true, name: true } } },
        orderBy: { createdAt: "asc" },
      })).map(r => ({ id: r.id, email: r.user.email, name: r.user.name }))
    : [];

  // Accounts that exist in the Google Ads MCC but not in the system at all —
  // from the cached MCC list (refreshed whenever the importer loads).
  let mccMissing: { count: number; names: string[]; syncedAt: Date | null } | null = null;
  if (gadsCred?.mccAccounts) {
    try {
      const mcc = JSON.parse(gadsCred.mccAccounts) as { id: string; name: string }[];
      const knownGads = new Set((await prisma.account.findMany({ where: { organizationId: ctx.orgId }, select: { googleAdsId: true } })).map(a => a.googleAdsId));
      const missing = mcc.filter(m => !knownGads.has(m.id));
      if (missing.length) mccMissing = { count: missing.length, names: missing.slice(0, 4).map(m => m.name), syncedAt: gadsCred.mccSyncedAt };
    } catch { /* unreadable cache */ }
  }

  const hidden = hiddenAccounts.map(a => ({
    id: a.id, name: a.name, clientName: a.clientName,
    // archived is the manual hide (wins over sync); otherwise it's Notion status.
    reason: a.archived ? "archived" as const : "inactive" as const,
  }));
  let syncIssues: { skipped: { page: string; reason: string }[]; errors: string[]; at: Date | null } | null = null;
  if (notionConn?.lastSyncResult) {
    try {
      const r = JSON.parse(notionConn.lastSyncResult) as { skipped?: { page: string; reason: string }[]; errors?: string[] };
      // Reports stored before friendly-error translation may hold the raw
      // Notion API JSON — translate at read time too, so the banner is always
      // an instruction, never a stack of JSON.
      const friendly = (e: string) => /object_not_found|Could not find database/i.test(e)
        ? "The Notion integration can't reach the Stores database — share it (or its parent page) with the integration via ⋯ → Connections in Notion, then run the sync again from Settings."
        : e;
      const errors = (r.errors ?? []).map(friendly);
      if ((r.skipped?.length ?? 0) || errors.length) {
        syncIssues = { skipped: r.skipped ?? [], errors, at: notionConn.lastSyncedAt };
      }
    } catch { /* unreadable report — nothing to surface */ }
  }

  const rows = await Promise.all(accounts.map(async (a) => {
    const recent = await prisma.accountStatus.findMany({
      where: { accountId: a.id }, orderBy: { computedAt: "desc" }, take: 6,
    });
    const st = recent.find(s => parseDiag(s.metrics));
    const diag = st ? parseDiag(st.metrics) : null;

    const w = diag?.window;
    const spend = w?.spend ?? 0;
    const roas = w && w.spend > 0 ? w.conversionValue / w.spend : null;
    const margin = diag?.grossMarginPct ?? a.grossMarginPercent ?? null;
    const revenue = diag?.commerce?.revenue ?? null;
    const poas = revenue != null && margin != null && margin > 0 && spend > 0 ? (revenue * margin) / spend : null;

    const problems = (diag?.signals ?? []).filter(s => s.kind === "problem");
    const worst = problems[0] ?? null; // signals are stored worst-first
    const reconciliationMismatch = problems.some(s => s.key === "conversions_vs_orders");

    return {
      id: a.id,
      name: a.name,
      clientName: a.clientName,
      ownerName: a.owner?.name ?? null,
      watched: watched.has(a.id),
      status: (st?.status as "red" | "yellow" | "green") ?? "unknown",
      computedAt: st?.computedAt ?? null,
      briefing: a.briefing ?? null,
      briefingAt: a.briefingAt ?? null,
      worklist: (() => { try { return a.worklist ? JSON.parse(a.worklist) : null; } catch { return null; } })(),
      worklistDoneAt: effectiveDoneAt(a.worklistDoneAt),
      hasData: !!diag,
      spend,
      conversions: w?.conversions ?? null,
      roas,
      poas,
      orders: diag?.commerce?.orders ?? null,
      revenue,
      dataVerified: diag?.dataVerified ?? false,
      hasOrderData: !!diag?.commerce,
      shopifyConnected: !!a.shopify,
      reconciliationMismatch,
      worstSignal: worst ? { title: worst.title, severity: worst.severity } : null,
      problemCount: problems.length,
      opportunityCount: (diag?.signals ?? []).filter(s => s.kind === "opportunity").length,
    };
  }));

  rows.sort((a, b) =>
    (STATUS_RANK[a.status] - STATUS_RANK[b.status]) || (b.spend - a.spend) || a.name.localeCompare(b.name));

  const counts = rows.reduce((c, r) => { c[r.status] = (c[r.status] ?? 0) + 1; return c; },
    {} as Record<string, number>);

  return NextResponse.json({
    accounts: rows,
    hidden,
    syncIssues,
    mccMissing,
    myRole,
    joinRequests,
    counts: { red: counts.red ?? 0, yellow: counts.yellow ?? 0, green: counts.green ?? 0, unknown: counts.unknown ?? 0 },
    total: rows.length,
    unverified: rows.filter(r => r.hasData && !r.dataVerified).length,
    verified: rows.filter(r => r.dataVerified).length,
    noOrderData: rows.filter(r => r.hasData && !r.hasOrderData).length,
    withData: rows.filter(r => r.hasData).length,
    watchedCount: watched.size,
  });
}
