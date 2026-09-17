/**
 * POST /api/accounts/[id]/plan — generate the 90-day client plan.
 *
 * Gathers the account's live spine (Google Ads + Shopify) + the Client Context
 * Pack, asks Opus to fill the structured plan, and renders it in the ecomtrada
 * house style with charts drawn from real numbers. Streamed as SSE so the long
 * Opus generation never idles the gateway into a 502.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { buildPlanInputs, PLAN_SYSTEM } from "@/lib/plan/generate";
import { renderPlanHtml } from "@/lib/plan/render";
import type { PlanContent, PlanLanguage } from "@/lib/plan/types";

export const dynamic = "force-dynamic";
export const maxDuration = 180;
type Params = { params: Promise<{ id: string }> };

const client = new Anthropic();

function extractJson(text: string): PlanContent | null {
  let s = text.trim();
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) s = fence[1].trim();
  const a = s.indexOf("{"), b = s.lastIndexOf("}");
  if (a < 0 || b <= a) return null;
  try { return JSON.parse(s.slice(a, b + 1)) as PlanContent; } catch { return null; }
}

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;

  const body = await req.json().catch(() => ({})) as { language?: PlanLanguage; revise?: string; basePlan?: PlanContent; renderOnly?: boolean; rewriteFromLive?: boolean };
  const inputs = await buildPlanInputs(id, ctx.orgId, body.language === "nl" || body.language === "en" ? body.language : undefined);
  if (!inputs) return forbidden();

  // renderOnly: the block editor deleted/kept parts client-side — re-render the
  // document from the edited JSON without a model call. Instant and free.
  if (body.renderOnly && body.basePlan && typeof body.basePlan === "object") {
    const p = body.basePlan as PlanContent;
    p.language = inputs.language;
    p.client = inputs.account.name;
    return NextResponse.json({ html: renderPlanHtml(p, inputs.charts), plan: p });
  }

  // Rewrite-from-progress: take the LIVE plan + everything the team already
  // did, and re-plan the REMAINING days around growth — completed work stays
  // in the plan verbatim (so its done-state survives) but stops being the
  // story. This is what kills "week 1-4: fix tracking" nagging after the team
  // fixed it in week 1.
  let liveInstForRewrite: { id: string; startedAt: Date } | null = null;
  let rewriteInstr = "";
  let rewriteBase: PlanContent | null = null;
  if (body.rewriteFromLive) {
    const inst = await prisma.planInstance.findUnique({ where: { accountId: id }, include: { states: true } });
    if (!inst) return NextResponse.json({ error: "No live plan on this account — activate one first." }, { status: 404 });
    try { rewriteBase = JSON.parse(inst.content) as PlanContent; } catch { return NextResponse.json({ error: "Plan content unreadable." }, { status: 500 }); }
    liveInstForRewrite = { id: inst.id, startedAt: inst.startedAt };
    const stateBy = new Map(inst.states.map(st => [st.path, st]));
    const lines: string[] = [];
    rewriteBase.phases.forEach((ph, pi) => (ph.actions ?? []).forEach((a, ai) => {
      const st = stateBy.get(`p${pi}a${ai}`);
      if (a.dropped) lines.push(`DROPPED: "${a.action}"${a.droppedReason ? ` — ${a.droppedReason}` : ""}`);
      else if (st?.status === "done") lines.push(`DONE ${st.doneAt ? st.doneAt.toISOString().slice(0, 10) : ""}${st.doneBy ? ` by ${st.doneBy}` : ""}: "${a.action}"`);
      else if (st?.status === "blocked") lines.push(`BLOCKED: "${a.action}"${st.note ? ` — ${st.note}` : ""}`);
      else lines.push(`OPEN: "${a.action}"`);
    }));
    const day = Math.max(1, Math.floor((Date.now() - inst.startedAt.getTime()) / 86_400_000) + 1);
    rewriteInstr = `REWRITE FROM EXECUTION STATE — we are on DAY ${day} of the 90-day plan. Status of every action:
${lines.join("\n")}

Rules for the rewrite:
- Work marked DONE is finished reality. Keep each DONE action in its phase with its text VERBATIM (character-for-character — its completion state is keyed on that text), but the plan's story must treat it as completed: no recommendations, warnings or phasing around it anywhere (strategyLead, make-or-break, findings, levers, forecast). One short acknowledgement of what's been completed is enough.
- Re-plan the REMAINING ~${Math.max(0, 90 - day)} days around the next constraint and GROWTH, using the fresh live data below. Restructure open/future actions and week windows from today onward.
- Remove actions marked DROPPED entirely. Keep BLOCKED actions visible with their blocker.
- You may add new actions where the data says the growth path needs them.`;
  }

  // Revision mode: the team hands back an existing plan (from state or an
  // imported export) plus a specific instruction — wrong data, missing context,
  // sections to drop. The model applies ONLY those changes; everything else
  // stays verbatim, so a reviewed plan isn't reshuffled by a regeneration.
  const revise = rewriteInstr || (typeof body.revise === "string" ? body.revise.trim() : "");
  const basePlan = rewriteBase ?? (revise && body.basePlan && typeof body.basePlan === "object" && Array.isArray((body.basePlan as PlanContent).phases)
    ? body.basePlan as PlanContent : null);

  const userMsg = basePlan
    ? `EXISTING PLAN (JSON — the team has already reviewed this):\n${JSON.stringify(basePlan)}\n\nFRESH LIVE DATA (for reference — correct figures against this where the instruction says data is wrong):\n${inputs.dataBlock}\n\nCLIENT CONTEXT PACK:\n${inputs.contextBlock}\n\nREQUESTED CHANGES from the team:\n${revise}\n\nApply ONLY the requested changes to the existing plan. Keep every other field, sentence and figure VERBATIM — do not rephrase, reorder or re-balance untouched sections. If the instruction says to delete something, remove it entirely. Return the FULL updated plan as the same JSON shape, in ${inputs.language === "nl" ? "Dutch" : "English"}. Return only the JSON object.`
    : `CLIENT CONTEXT PACK:\n${inputs.contextBlock}\n\nLIVE DATA:\n${inputs.dataBlock}\n\nWrite the 90-day plan for ${inputs.account.name} in ${inputs.language === "nl" ? "Dutch" : "English"}. Return only the JSON object.`;

  const encoder = new TextEncoder();
  const send = (c: ReadableStreamDefaultController, o: unknown) => c.enqueue(encoder.encode(`data: ${JSON.stringify(o)}\n\n`));

  const stream = new ReadableStream({
    async start(controller) {
      try {
        send(controller, { status: inputs.hasMakeOrBreak ? "generating" : "generating_no_makeorbreak" });
        // One generation attempt; returns raw text + why the model stopped.
        const generate = async (extraNudge?: string) => {
          const anthropicStream = client.messages.stream({
            model: "claude-opus-4-8",
            // A full plan (stats + findings + levers + build list + 3 phases +
            // forecast, often in Dutch) regularly overflowed 4096 tokens — the
            // JSON got truncated mid-object and parsing failed for users as
            // "unparseable plan". Big budget + thinking disabled so the whole
            // budget is output (max_tokens caps thinking + output together).
            max_tokens: 12_000,
            thinking: { type: "disabled" },
            system: PLAN_SYSTEM,
            messages: [{ role: "user", content: extraNudge ? `${userMsg}\n\n${extraNudge}` : userMsg }],
          });
          let acc = "", ticks = 0, stopReason: string | null = null;
          for await (const ev of anthropicStream) {
            if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") {
              acc += ev.delta.text;
              if (++ticks % 12 === 0) send(controller, { status: "writing", chars: acc.length }); // keep-alive
            }
            if (ev.type === "message_delta" && ev.delta.stop_reason) stopReason = ev.delta.stop_reason;
          }
          return { acc, stopReason };
        };
        let { acc, stopReason } = await generate();
        let plan = extractJson(acc);
        if (!plan) {
          // One silent retry instead of bouncing the failure to the user —
          // with a nudge that names what went wrong the first time.
          send(controller, { status: "retrying" });
          ({ acc, stopReason } = await generate(
            stopReason === "max_tokens"
              ? "IMPORTANT: your previous attempt exceeded the output limit. Keep every body to ONE tight sentence and stay within the item counts' lower bounds."
              : "IMPORTANT: your previous attempt was not valid JSON. Return ONLY the JSON object — no prose, no code fences, no trailing commas.",
          ));
          plan = extractJson(acc);
        }
        if (!plan) { send(controller, { error: `The model returned an unparseable plan (${stopReason === "max_tokens" ? "output limit hit twice" : "invalid JSON twice"}). Try again.` }); controller.close(); return; }
        plan.language = inputs.language;
        plan.client = inputs.account.name;
        const html = renderPlanHtml(plan, inputs.charts);
        // Rewrite-from-progress updates the LIVE plan in place: same planId,
        // same clock, done-state re-keyed by (phase, action text).
        if (liveInstForRewrite && rewriteBase) {
          const inst = await prisma.planInstance.findUnique({ where: { id: liveInstForRewrite.id }, include: { states: true } });
          if (inst) {
            const oldByKey = new Map<string, (typeof inst.states)[number]>();
            let oldC: PlanContent | null = null;
            try { oldC = JSON.parse(inst.content) as PlanContent; } catch { /* ignore */ }
            oldC?.phases.forEach((ph, pi) => (ph.actions ?? []).forEach((a, ai) => {
              const st = inst.states.find(x => x.path === `p${pi}a${ai}`);
              if (st) oldByKey.set(`${a.action}`, st);
            }));
            let restored = 0;
            await prisma.$transaction(async tx => {
              await tx.planActionState.deleteMany({ where: { planId: inst.id } });
              await tx.planInstance.update({ where: { id: inst.id }, data: { content: JSON.stringify(plan) } });
              for (let pi = 0; pi < plan.phases.length; pi++) {
                const acts = plan.phases[pi].actions ?? [];
                for (let ai = 0; ai < acts.length; ai++) {
                  const st = oldByKey.get(acts[ai].action);
                  if (!st) continue;
                  await tx.planActionState.create({ data: { planId: inst.id, path: `p${pi}a${ai}`, status: st.status, assignee: st.assignee, note: st.note, doneAt: st.doneAt, doneBy: st.doneBy } });
                  restored++;
                }
              }
            });
            await prisma.planEvent.create({ data: { planId: inst.id, by: ctx.email, kind: "revised", detail: `Plan rewritten from execution progress by the AI (progress kept for ${restored} action${restored === 1 ? "" : "s"}).` } }).catch(() => null);
          }
        }
        send(controller, { done: true, html, plan, activated: !!liveInstForRewrite });
      } catch (err) {
        send(controller, { error: err instanceof Error ? err.message : "Plan generation failed" });
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" } });
}
