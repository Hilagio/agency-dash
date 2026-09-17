/**
 * The account's LIVE 90-day plan — the team execution copy of a generated plan,
 * with a full audit trail (who did what, when, and why).
 *
 *  PUT    — activate {plan}: first time creates; afterwards updates IN PLACE
 *           (same planId → history and the 90-day clock survive a revision;
 *           per-action state is kept where the action text still matches).
 *  GET    — plan + per-action state + history. `?format=html` renders the
 *           CURRENT plan (deviations included, dropped actions removed) as the
 *           printable client document.
 *  PATCH  — one action's state { path, status?, assignee?, note? }, or a
 *           deliberate deviation:
 *             { addAction: { phase, action, who?, when?, reason } }
 *             { dropAction: { path, reason } }
 *  DELETE — deactivate.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { buildPlanInputs } from "@/lib/plan/generate";
import { renderPlanHtml } from "@/lib/plan/render";
import { renderPlanChecklist } from "@/lib/plan/checklist";
import type { PlanContent, PlanPhaseAction } from "@/lib/plan/types";

export const dynamic = "force-dynamic";
type Params = { params: Promise<{ id: string }> };

async function owned(id: string, orgId: string) {
  return prisma.account.findFirst({ where: { id, organizationId: orgId }, select: { id: true } });
}
const log = (planId: string, by: string, kind: string, detail: string) =>
  prisma.planEvent.create({ data: { planId, by, kind, detail } }).catch(() => null);

export async function GET(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;
  if (!(await owned(id, ctx.orgId))) return forbidden();

  const inst = await prisma.planInstance.findUnique({
    where: { accountId: id },
    include: { states: true, events: { orderBy: { at: "desc" }, take: 60 } },
  });
  if (!inst) return NextResponse.json({ active: false });
  let content: PlanContent | null = null;
  try { content = JSON.parse(inst.content) as PlanContent; } catch { /* corrupt content */ }

  // Printable progress CHECKLIST — the Action/Status/Owner/Notes tables the
  // team used to maintain by hand in Word, generated from the live state.
  if (req.nextUrl.searchParams.get("format") === "checklist" && content) {
    const html = renderPlanChecklist(content, { client: content.client, startedAt: inst.startedAt, createdBy: inst.createdBy, updatedAt: inst.updatedAt }, inst.states);
    return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
  }

  // Printable current version: the plan as it stands today — deviations
  // rendered as part of the phases, dropped actions removed, with an
  // activation/revision stamp in the subtitle.
  if (req.nextUrl.searchParams.get("format") === "html" && content) {
    const inputs = await buildPlanInputs(id, ctx.orgId, content.language);
    const printable: PlanContent = {
      ...content,
      phases: content.phases.map(ph => ({
        ...ph,
        actions: (ph.actions ?? []).filter(a => !a.dropped).map(a => a.deviation
          ? { ...a, action: `${a.action} (${content!.language === "nl" ? "toegevoegd" : "added"} ${a.addedAt?.slice(0, 10) ?? ""}${a.deviationReason ? ` — ${a.deviationReason}` : ""})` }
          : a),
      })),
      subtitle: `${content.subtitle} · ${content.language === "nl" ? "plan actief sinds" : "plan live since"} ${inst.startedAt.toISOString().slice(0, 10)}${inst.createdBy ? ` (${inst.createdBy})` : ""} · ${content.language === "nl" ? "versie van" : "version of"} ${inst.updatedAt.toISOString().slice(0, 10)}`,
    };
    const html = renderPlanHtml(printable, inputs?.charts ?? { roasWindows: [], dailyRevenue: [], currencySymbol: "€" });
    return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
  }

  return NextResponse.json({
    active: true, planId: inst.id, startedAt: inst.startedAt, createdBy: inst.createdBy,
    updatedAt: inst.updatedAt, language: inst.language, content,
    states: inst.states.map(s => ({ path: s.path, status: s.status, assignee: s.assignee, note: s.note, doneAt: s.doneAt, doneBy: s.doneBy })),
    events: inst.events.map(e => ({ at: e.at, by: e.by, kind: e.kind, detail: e.detail })),
  });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;
  if (!(await owned(id, ctx.orgId))) return forbidden();

  const body = await req.json().catch(() => ({})) as { plan?: PlanContent; startedAt?: string };
  const plan = body.plan;
  if (!plan || !Array.isArray(plan.phases) || !plan.phases.length) {
    return NextResponse.json({ error: "A plan with phases is required." }, { status: 400 });
  }

  // Optional real start date — for plans that were made earlier and are being
  // brought into the system now, so the 90-day clock reflects reality.
  const startRaw = typeof body.startedAt === "string" ? new Date(body.startedAt) : null;
  const startedAt = startRaw && !Number.isNaN(startRaw.getTime()) && startRaw.getTime() <= Date.now() ? startRaw : null;

  const existing = await prisma.planInstance.findUnique({ where: { accountId: id }, include: { states: true } });

  if (!existing) {
    const created = await prisma.planInstance.create({
      data: { accountId: id, content: JSON.stringify(plan), language: plan.language ?? "en", createdBy: ctx.email, ...(startedAt ? { startedAt } : {}) },
    });
    await log(created.id, ctx.email, "activated", `Plan activated as the account's live 90-day plan${startedAt ? ` (plan start date set to ${startedAt.toISOString().slice(0, 10)})` : ""}.`);
    return NextResponse.json({ ok: true, planId: created.id, restoredStates: 0, startedAt: created.startedAt });
  }

  // Revision in place: same planId, so history and the day-count clock survive.
  // Re-key action state by (phase index, action text); unmatched state drops.
  let old: PlanContent | null = null;
  try { old = JSON.parse(existing.content) as PlanContent; } catch { /* ignore */ }
  const oldByKey = new Map<string, typeof existing.states[number]>();
  if (old) {
    const byPath = new Map(existing.states.map(s => [s.path, s]));
    old.phases.forEach((ph, pi) => (ph.actions ?? []).forEach((a, ai) => {
      const st = byPath.get(`p${pi}a${ai}`);
      if (st) oldByKey.set(`${pi}|${a.action}`, st);
    }));
  }
  let restored = 0;
  await prisma.$transaction(async tx => {
    await tx.planActionState.deleteMany({ where: { planId: existing.id } });
    await tx.planInstance.update({
      where: { id: existing.id },
      data: { content: JSON.stringify(plan), language: plan.language ?? existing.language, ...(startedAt ? { startedAt } : {}) },
    });
    for (let pi = 0; pi < plan.phases.length; pi++) {
      const acts = plan.phases[pi].actions ?? [];
      for (let ai = 0; ai < acts.length; ai++) {
        const st = oldByKey.get(`${pi}|${acts[ai].action}`);
        if (!st) continue;
        await tx.planActionState.create({
          data: { planId: existing.id, path: `p${pi}a${ai}`, status: st.status, assignee: st.assignee, note: st.note, doneAt: st.doneAt, doneBy: st.doneBy },
        });
        restored++;
      }
    }
  });
  await log(existing.id, ctx.email, "revised", `Plan revised (progress kept for ${restored} unchanged action${restored === 1 ? "" : "s"}).`);
  return NextResponse.json({ ok: true, planId: existing.id, restoredStates: restored, startedAt: existing.startedAt });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;
  if (!(await owned(id, ctx.orgId))) return forbidden();

  const body = await req.json().catch(() => ({})) as {
    path?: string; status?: string; assignee?: string | null; note?: string | null;
    addAction?: { phase?: number; action?: string; who?: string; when?: string; reason?: string };
    editAction?: { path?: string; action?: string; when?: string; who?: string };
    dropAction?: { path?: string; reason?: string };
  };

  const inst = await prisma.planInstance.findUnique({ where: { accountId: id } });
  if (!inst) return NextResponse.json({ error: "No live plan on this account — activate one first." }, { status: 404 });
  let content: PlanContent;
  try { content = JSON.parse(inst.content) as PlanContent; } catch { return NextResponse.json({ error: "Plan content unreadable." }, { status: 500 }); }

  const actionAt = (path: string): PlanPhaseAction | null => {
    const m = path.match(/^p(\d+)a(\d+)$/);
    return m ? content.phases[Number(m[1])]?.actions?.[Number(m[2])] ?? null : null;
  };

  // ── Deviation: add an action to a phase, with the reason on record ─────────
  if (body.addAction) {
    const pi = Number(body.addAction.phase);
    const text = (body.addAction.action ?? "").trim();
    if (!Number.isInteger(pi) || !content.phases[pi]) return NextResponse.json({ error: "valid phase index required" }, { status: 400 });
    if (!text) return NextResponse.json({ error: "action text required" }, { status: 400 });
    const act: PlanPhaseAction = {
      action: text,
      who: (["Ecomtrada", "Client", "Together"].includes(body.addAction.who ?? "") ? body.addAction.who : "Ecomtrada") as PlanPhaseAction["who"],
      when: (body.addAction.when ?? "").trim() || "now",
      deviation: true, deviationReason: (body.addAction.reason ?? "").trim() || undefined,
      addedAt: new Date().toISOString(), addedBy: ctx.email,
    };
    content.phases[pi].actions = [...(content.phases[pi].actions ?? []), act];
    await prisma.planInstance.update({ where: { id: inst.id }, data: { content: JSON.stringify(content) } });
    await log(inst.id, ctx.email, "deviation", `Added to "${content.phases[pi].title}": "${text}"${act.deviationReason ? ` — reason: ${act.deviationReason}` : ""}`);
    return NextResponse.json({ ok: true, path: `p${pi}a${content.phases[pi].actions!.length - 1}` });
  }

  // ── Manual edit: reword an action / change its owner or timing in place.
  // The path (and therefore its done/assignee state) is unchanged.
  if (body.editAction) {
    const path = body.editAction.path ?? "";
    const act = actionAt(path);
    if (!act) return NextResponse.json({ error: "action not found" }, { status: 404 });
    const before = act.action;
    if (typeof body.editAction.action === "string" && body.editAction.action.trim()) act.action = body.editAction.action.trim();
    if (typeof body.editAction.when === "string" && body.editAction.when.trim()) act.when = body.editAction.when.trim();
    if (typeof body.editAction.who === "string" && ["Ecomtrada", "Client", "Together"].includes(body.editAction.who)) act.who = body.editAction.who as PlanPhaseAction["who"];
    await prisma.planInstance.update({ where: { id: inst.id }, data: { content: JSON.stringify(content) } });
    await log(inst.id, ctx.email, "edited", before === act.action ? `Edited timing/owner of "${act.action.slice(0, 80)}"` : `Edited: "${before.slice(0, 60)}" → "${act.action.slice(0, 60)}"`);
    return NextResponse.json({ ok: true });
  }

  // ── Deviation: drop an action (kept in the audit trail, out of progress) ───
  if (body.dropAction) {
    const path = body.dropAction.path ?? "";
    const act = actionAt(path);
    if (!act) return NextResponse.json({ error: "action not found" }, { status: 404 });
    act.dropped = true;
    act.droppedReason = (body.dropAction.reason ?? "").trim() || undefined;
    await prisma.planInstance.update({ where: { id: inst.id }, data: { content: JSON.stringify(content) } });
    await prisma.planActionState.deleteMany({ where: { planId: inst.id, path } });
    await log(inst.id, ctx.email, "dropped", `Dropped: "${act.action}"${act.droppedReason ? ` — reason: ${act.droppedReason}` : ""}`);
    return NextResponse.json({ ok: true });
  }

  // ── Regular state change ───────────────────────────────────────────────────
  const path = typeof body.path === "string" && /^p\d+a\d+$/.test(body.path) ? body.path : null;
  if (!path) return NextResponse.json({ error: "path required (p<phase>a<action>)" }, { status: 400 });
  const status = ["open", "busy", "done", "blocked"].includes(body.status ?? "") ? body.status : undefined;
  const act = actionAt(path);
  const label = act ? `"${act.action.slice(0, 90)}"` : path;

  const data = {
    ...(status !== undefined && { status, doneAt: status === "done" ? new Date() : null, doneBy: status === "done" ? ctx.email : null }),
    ...(body.assignee !== undefined && { assignee: body.assignee || null }),
    ...(body.note !== undefined && { note: body.note || null }),
  };
  const st = await prisma.planActionState.upsert({
    where: { planId_path: { planId: inst.id, path } },
    create: { planId: inst.id, path, ...data },
    update: data,
  });
  if (status === "done") await log(inst.id, ctx.email, "done", `Done: ${label}`);
  else if (status === "open" && body.status === "open") await log(inst.id, ctx.email, "reopened", `Reopened: ${label}`);
  else if (status === "blocked") await log(inst.id, ctx.email, "blocked", `Blocked: ${label}`);
  if (body.assignee !== undefined) await log(inst.id, ctx.email, "assigned", body.assignee ? `Assigned ${body.assignee} to ${label}` : `Unassigned ${label}`);
  if (body.note !== undefined && body.note) await log(inst.id, ctx.email, "note", `Note on ${label}: ${body.note.slice(0, 200)}`);

  return NextResponse.json({ ok: true, path: st.path, status: st.status, assignee: st.assignee, note: st.note, doneAt: st.doneAt, doneBy: st.doneBy });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;
  if (!(await owned(id, ctx.orgId))) return forbidden();
  await prisma.planInstance.delete({ where: { accountId: id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
