/**
 * The account's LIVE 90-day plan — the team execution copy of a generated plan.
 *
 *  PUT    — activate: store {plan} as the account's active plan (replaces the
 *           previous one; per-action state is kept where the action text still
 *           matches, so re-activating a revised plan doesn't lose progress).
 *  GET    — the live plan + per-action state.
 *  PATCH  — update one action's state: { path, status?, assignee?, note? }.
 *  DELETE — deactivate (removes the live plan + state).
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import type { PlanContent } from "@/lib/plan/types";

export const dynamic = "force-dynamic";
type Params = { params: Promise<{ id: string }> };

async function owned(id: string, orgId: string) {
  return prisma.account.findFirst({ where: { id, organizationId: orgId }, select: { id: true } });
}

export async function GET(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;
  if (!(await owned(id, ctx.orgId))) return forbidden();

  const inst = await prisma.planInstance.findUnique({
    where: { accountId: id },
    include: { states: true },
  });
  if (!inst) return NextResponse.json({ active: false });
  let content: PlanContent | null = null;
  try { content = JSON.parse(inst.content) as PlanContent; } catch { /* corrupt content */ }
  return NextResponse.json({
    active: true, planId: inst.id, startedAt: inst.startedAt, createdBy: inst.createdBy,
    language: inst.language, content,
    states: inst.states.map(s => ({ path: s.path, status: s.status, assignee: s.assignee, note: s.note, doneAt: s.doneAt, doneBy: s.doneBy })),
  });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;
  if (!(await owned(id, ctx.orgId))) return forbidden();

  const body = await req.json().catch(() => ({})) as { plan?: PlanContent };
  const plan = body.plan;
  if (!plan || !Array.isArray(plan.phases) || !plan.phases.length) {
    return NextResponse.json({ error: "A plan with phases is required." }, { status: 400 });
  }

  const existing = await prisma.planInstance.findUnique({ where: { accountId: id }, include: { states: true } });

  // Preserve progress across re-activation: match old action state to the new
  // plan by (phase index, action text) — a reworded action starts fresh.
  const keep = new Map<string, (typeof existing extends null ? never : NonNullable<typeof existing>)["states"][number]>();
  if (existing) {
    let old: PlanContent | null = null;
    try { old = JSON.parse(existing.content) as PlanContent; } catch { /* ignore */ }
    if (old) {
      const oldByPath = new Map(existing.states.map(s => [s.path, s]));
      old.phases.forEach((ph, pi) => (ph.actions ?? []).forEach((a, ai) => {
        const st = oldByPath.get(`p${pi}a${ai}`);
        if (st) keep.set(`${pi}|${a.action}`, st);
      }));
    }
  }

  const inst = await prisma.$transaction(async tx => {
    if (existing) await tx.planInstance.delete({ where: { id: existing.id } }); // cascades states
    const created = await tx.planInstance.create({
      data: {
        accountId: id, content: JSON.stringify(plan), language: plan.language ?? "en", createdBy: ctx.email,
        // Keep the original clock when replacing a live plan with a revision.
        ...(existing ? { startedAt: existing.startedAt } : {}),
      },
    });
    const restored = [] as { path: string }[];
    for (const [key, st] of keep) {
      const pi = Number(key.split("|")[0]);
      const ai = (plan.phases[pi]?.actions ?? []).findIndex(a => `${pi}|${a.action}` === key);
      if (ai < 0) continue;
      await tx.planActionState.create({
        data: {
          planId: created.id, path: `p${pi}a${ai}`, status: st.status,
          assignee: st.assignee, note: st.note, doneAt: st.doneAt, doneBy: st.doneBy,
        },
      });
      restored.push({ path: `p${pi}a${ai}` });
    }
    return { created, restored: restored.length };
  });

  return NextResponse.json({ ok: true, planId: inst.created.id, restoredStates: inst.restored, startedAt: inst.created.startedAt });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;
  if (!(await owned(id, ctx.orgId))) return forbidden();

  const body = await req.json().catch(() => ({})) as { path?: string; status?: string; assignee?: string | null; note?: string | null };
  const path = typeof body.path === "string" && /^p\d+a\d+$/.test(body.path) ? body.path : null;
  if (!path) return NextResponse.json({ error: "path required (p<phase>a<action>)" }, { status: 400 });
  const status = ["open", "busy", "done", "blocked"].includes(body.status ?? "") ? body.status : undefined;

  const inst = await prisma.planInstance.findUnique({ where: { accountId: id }, select: { id: true } });
  if (!inst) return NextResponse.json({ error: "No live plan on this account — activate one first." }, { status: 404 });

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
