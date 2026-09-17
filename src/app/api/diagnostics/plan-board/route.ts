/**
 * GET /api/diagnostics/plan-board — the org-wide 90-day plan execution board.
 *
 * One query answers, for every account with a LIVE plan: where it stands
 * (day X of 90, per-phase progress), what was done last, the NEXT open action
 * and who owns it, and whether execution has stalled — so the whole team sees
 * the same real-time state without relying on ad-hoc communication.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized } from "@/lib/auth";
import type { PlanContent } from "@/lib/plan/types";

export const dynamic = "force-dynamic";

export interface BoardRow {
  accountId: string;
  name: string;
  clientName: string | null;
  startedAt: string;
  dayInPlan: number;           // 1-based
  language: string;
  totalActions: number;
  doneActions: number;
  blockedActions: number;
  phases: { title: string; window: string; done: number; total: number }[];
  nextAction: { path: string; phase: string; action: string; who: string; when: string; assignee: string | null; status: string } | null;
  lastActivityAt: string | null; // latest state change
  lastDoneBy: string | null;
  stalled: boolean;              // live > 7d and no state change in 7d
  assignees: string[];           // everyone currently assigned to open work
}

export async function GET() {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const [instances, members] = await Promise.all([
    prisma.planInstance.findMany({
      where: { account: { organizationId: ctx.orgId, archived: false } },
      include: {
        states: true,
        account: { select: { id: true, name: true, clientName: true } },
      },
    }),
    prisma.organizationMember.findMany({
      where: { organizationId: ctx.orgId },
      include: { user: { select: { email: true, name: true } } },
    }),
  ]);

  const now = Date.now();
  const rows: BoardRow[] = [];
  for (const inst of instances) {
    let content: PlanContent | null = null;
    try { content = JSON.parse(inst.content) as PlanContent; } catch { continue; }
    if (!content?.phases?.length) continue;

    const stateByPath = new Map(inst.states.map(s => [s.path, s]));
    let total = 0, done = 0, blocked = 0;
    let next: BoardRow["nextAction"] = null;
    const phases = content.phases.map((ph, pi) => {
      const acts = ph.actions ?? [];
      let phDone = 0;
      acts.forEach((a, ai) => {
        total += 1;
        const st = stateByPath.get(`p${pi}a${ai}`);
        if (st?.status === "done") { phDone += 1; done += 1; }
        else {
          if (st?.status === "blocked") blocked += 1;
          if (!next) next = {
            path: `p${pi}a${ai}`, phase: ph.title, action: a.action, who: a.who, when: a.when,
            assignee: st?.assignee ?? null, status: st?.status ?? "open",
          };
        }
      });
      return { title: ph.title, window: ph.window, done: phDone, total: acts.length };
    });

    const lastState = inst.states.reduce<{ at: Date | null; by: string | null }>((acc, s) => {
      const t = s.doneAt ?? s.updatedAt;
      return t && (!acc.at || t > acc.at) ? { at: t, by: s.doneBy ?? s.assignee ?? null } : acc;
    }, { at: null, by: null });

    const dayInPlan = Math.max(1, Math.floor((now - inst.startedAt.getTime()) / 86_400_000) + 1);
    const liveDays = (now - inst.startedAt.getTime()) / 86_400_000;
    const idleDays = lastState.at ? (now - lastState.at.getTime()) / 86_400_000 : liveDays;
    const finished = total > 0 && done >= total;

    rows.push({
      accountId: inst.account.id, name: inst.account.name, clientName: inst.account.clientName,
      startedAt: inst.startedAt.toISOString(), dayInPlan, language: inst.language,
      totalActions: total, doneActions: done, blockedActions: blocked, phases,
      nextAction: next,
      lastActivityAt: lastState.at?.toISOString() ?? null,
      lastDoneBy: lastState.by,
      stalled: !finished && liveDays > 7 && idleDays > 7,
      assignees: [...new Set(inst.states.filter(s => s.status !== "done" && s.assignee).map(s => s.assignee!))],
    });
  }

  // Attention first: stalled, then blocked work, then least-progressed.
  rows.sort((a, b) => Number(b.stalled) - Number(a.stalled)
    || b.blockedActions - a.blockedActions
    || (a.doneActions / Math.max(1, a.totalActions)) - (b.doneActions / Math.max(1, b.totalActions)));

  return NextResponse.json({
    rows,
    members: members.map(m => ({ email: m.user.email, name: m.user.name || m.user.email.split("@")[0], role: m.role })),
    me: ctx.email,
  });
}
