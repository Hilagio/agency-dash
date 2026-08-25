/**
 * POST /api/diagnostics/account/[id]/document — generate a client-ready brand
 * document (§agent → files out) from the account conversation + live data.
 *
 * Body: { request?: string, format?: "doc"|"deck", language?: "en"|"nl" }.
 * Returns { html, filename, title, docType } — the cockpit downloads/previews it.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { computeWindows } from "@/lib/diagnostics/windows";
import { generateDoc } from "@/lib/doc/generate";
import { renderDocHtml } from "@/lib/doc/render";
import type { DocFormat, DocLanguage } from "@/lib/doc/types";
import type { Signal } from "@/lib/diagnostics/signals";

export const dynamic = "force-dynamic";
export const maxDuration = 240;

type Params = { params: Promise<{ id: string }> };
const CUR: Record<string, string> = { EUR: "€", USD: "$", GBP: "£", CZK: "Kč", PLN: "zł" };
const money = (n: number, cur: string) => `${cur}${Math.round(n).toLocaleString("en-GB")}`;
const ymd = (daysAgo: number) => { const d = new Date(); d.setUTCDate(d.getUTCDate() - daysAgo); return d.toISOString().slice(0, 10); };

interface DiagMetrics { source?: string; grossMarginPct?: number | null; signals?: Signal[] }
function parseDiag(json: string): DiagMetrics | null {
  try { const m = JSON.parse(json) as DiagMetrics; return m?.source === "diagnostics" ? m : null; } catch { return null; }
}

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;

  const account = await prisma.account.findFirst({
    where: { id, organizationId: ctx.orgId },
    select: { id: true, name: true, clientName: true, currency: true, grossMarginPercent: true },
  });
  if (!account) return forbidden();

  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const request = typeof body?.request === "string" ? body.request.trim() : "";
  const format: DocFormat = body?.format === "deck" ? "deck" : "doc";
  const language: DocLanguage = body?.language === "nl" ? "nl" : "en";
  const cur = CUR[account.currency] ?? `${account.currency} `;

  // Build the grounding context: the conversation + a compact data snapshot.
  const since = ymd(91), end = ymd(1);
  const [msgs, statusRow, mRows, oRows, clientCtx] = await Promise.all([
    // Newest 24, flipped to chronological — `asc, take` returned the FIRST 24
    // and made long threads produce documents from stale conversation state.
    prisma.agentMessage.findMany({ where: { accountId: id }, orderBy: { createdAt: "desc" }, take: 24, select: { role: true, content: true } }).then(r => r.reverse()),
    prisma.accountStatus.findMany({ where: { accountId: id }, orderBy: { computedAt: "desc" }, take: 6 }),
    prisma.metricDaily.findMany({ where: { accountId: id, date: { gte: since } }, select: { date: true, spend: true, clicks: true, conversions: true, conversionValue: true } }),
    prisma.orderDaily.findMany({ where: { accountId: id, date: { gte: since } }, select: { date: true, orders: true, revenue: true } }),
    prisma.clientContext.findUnique({ where: { accountId: id } }).catch(() => null),
  ]);

  let diag: DiagMetrics | null = null;
  for (const s of statusRow) { const m = parseDiag(s.metrics); if (m) { diag = m; break; } }

  const perDay = new Map<string, { date: string; spend: number; clicks: number; conversions: number; conversionValue: number }>();
  for (const r of mRows) {
    const e = perDay.get(r.date) ?? { date: r.date, spend: 0, clicks: 0, conversions: 0, conversionValue: 0 };
    e.spend += r.spend; e.clicks += r.clicks; e.conversions += r.conversions; e.conversionValue += r.conversionValue;
    perDay.set(r.date, e);
  }
  const windows = computeWindows([...perDay.values()], oRows, end, diag?.grossMarginPct ?? account.grossMarginPercent ?? null);

  const L: string[] = [`Client: ${account.clientName || account.name} (currency ${cur})`];
  if (windows.some(w => w.spend > 0)) {
    L.push(`Performance windows (spend / ROAS / POAS${windows.some(w => w.orders != null) ? " / orders" : ""}):`);
    for (const w of windows) L.push(`  ${w.days}d: ${money(w.spend, cur)} / ${w.roas != null ? w.roas.toFixed(2) : "—"} / ${w.poas != null ? w.poas.toFixed(2) : "—"}${w.orders != null ? ` / ${w.orders}` : ""}`);
  }
  const problems = (diag?.signals ?? []).filter(s => s.kind === "problem");
  if (problems.length) { L.push(`Detected issues:`); for (const s of problems.slice(0, 6)) L.push(`  - ${s.detail}`); }
  if (clientCtx?.goal) L.push(`Client goal: ${clientCtx.goal}`);
  if (clientCtx?.targetRoasNote) L.push(`Target ROAS: ${clientCtx.targetRoasNote}`);
  if (clientCtx?.mainKpi) L.push(`Main KPI: ${clientCtx.mainKpi}`);
  if (msgs.length) {
    L.push(`\n--- The team's conversation about this account ---`);
    for (const m of msgs) L.push(`${m.role === "assistant" ? "Analyst" : "Team"}: ${m.content}`);
  } else {
    L.push(`\n(No prior conversation — base the document on the data above.)`);
  }

  try {
    const doc = await generateDoc({ client: account.clientName || account.name, request, format, language, context: L.join("\n") });
    if (!doc.sections.length) return NextResponse.json({ error: "The model returned an empty document — try again with a clearer ask." }, { status: 502 });
    const html = renderDocHtml(doc);
    const safe = (account.clientName || account.name).replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    const filename = `${safe}-${doc.docType.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}${format === "deck" ? "-deck" : ""}.html`;

    // Save to the account's document library (versioned deliverables).
    const saved = await prisma.generatedDoc.create({
      data: { accountId: id, title: doc.title, docType: doc.docType, format, language, filename, html, createdBy: ctx.email },
      select: { id: true, title: true, docType: true, format: true, language: true, filename: true, createdBy: true, createdAt: true },
    }).catch(() => null);

    return NextResponse.json({ id: saved?.id ?? null, html, filename, title: doc.title, docType: doc.docType, saved });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Document generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
