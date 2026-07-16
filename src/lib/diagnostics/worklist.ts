/**
 * Overnight agentic triage. For a FLAGGED account, a bounded agent investigates
 * the issue with the live tools and writes ONE worklist item — the single
 * highest-leverage next action, a time estimate, and which PPC OS skill to hand
 * off to. The cockpit turns these into each specialist's ranked plan for the day.
 *
 * Bounded on purpose: only flagged accounts, a hard step cap, Sonnet (not Opus),
 * a small pool — so the nightly cost scales with problems, not account count.
 * It PLANS; it never mutates (execution stays with PPC OS's approval-gated skills).
 */
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { AGENT_TOOLS, runAgentTool, type AgentAccount } from "./agent-tools";
import type { Signal } from "./signals";

const client = new Anthropic();
const MAX_STEPS = 3;

export interface WorklistItem {
  headline: string;
  action: string;
  minutes: number;
  skill: string;      // "/search-term-optimizer" | "off-platform" | "none" | ...
  confidence: "high" | "medium" | "low";
  category: string;
}

const PPC_OS = `PPC OS skills to hand off to — name the ONE that fits (with the leading slash), or "off-platform" / "none":
/search-term-optimizer (negatives, promote terms, n-grams), /keyword-optimizer, /bidding-optimizer (tCPA/tROAS targets), /budget-optimizer (raise/reduce/reallocate/pacing), /placement-optimizer, /pmax-optimizer, /feed-optimizer (Merchant Center feed fixes), /geo-schedule-optimizer, /lp-optimizer (landing page), /quality-score-auditor, /tracking-audit, /account-audit.
Use "off-platform" for a checkout/site/stock/pricing/promo issue (the client's job, not Google Ads). Use "none" if it only needs watching.`;

const SYSTEM = `You are triaging ONE flagged Google Ads account for tomorrow's worklist. Investigate the flagged issue with your tools — call only what you need, you have a TIGHT budget (a couple of tool calls) — then output ONE worklist item: the single highest-leverage next action, how long it takes, and which PPC OS skill to run.

Rules: every claim comes from the data/tools, never invented. OFF-PLATFORM FIRST — if conversions collapsed broadly, suspect checkout / payments / stock / tracking before any in-account cause. Point at the ONE action that moves the most, not a list. Be realistic on the time estimate.

${PPC_OS}

Finish with ONLY this JSON, nothing after it:
{"headline":"one line — what's wrong, with the number","action":"the single next action to take","minutes":15,"skill":"/search-term-optimizer"|"off-platform"|"none","confidence":"high"|"medium"|"low","category":"off-platform"|"feed"|"bidding"|"budget"|"search-terms"|"structure"|"tracking"|"page"|"scale"}`;

function extractItem(text: string): WorklistItem | null {
  const start = text.lastIndexOf("{"), end = text.lastIndexOf("}");
  if (start < 0 || end < 0 || end < start) return null;
  try {
    const o = JSON.parse(text.slice(start, end + 1)) as Partial<WorklistItem>;
    if (!o.headline || !o.action) return null;
    return {
      headline: String(o.headline), action: String(o.action),
      minutes: Number.isFinite(Number(o.minutes)) ? Math.max(1, Math.round(Number(o.minutes))) : 15,
      skill: String(o.skill ?? "none"),
      confidence: o.confidence === "high" || o.confidence === "low" ? o.confidence : "medium",
      category: String(o.category ?? "structure"),
    };
  } catch { return null; }
}

function seedContext(name: string, metricsJson: string): string {
  try {
    const m = JSON.parse(metricsJson) as { window?: { spend: number; conversions: number; conversionValue: number; days: number }; commerce?: { orders: number; revenue: number } | null; reconciliation?: { adsConversions: number; actualOrders: number } | null; signals?: Signal[] };
    const L = [`ACCOUNT: ${name}`];
    if (m.window) L.push(`Last ${m.window.days}d: spend ${Math.round(m.window.spend)}, conv ${m.window.conversions.toFixed(1)}, value ${Math.round(m.window.conversionValue)}, ROAS ${m.window.spend > 0 ? (m.window.conversionValue / m.window.spend).toFixed(2) : "—"}`);
    if (m.commerce) L.push(`Shopify: ${m.commerce.orders} orders, ${Math.round(m.commerce.revenue)} revenue`);
    if (m.reconciliation) L.push(`Reconciliation: ${m.reconciliation.adsConversions.toFixed(1)} Ads conv vs ${m.reconciliation.actualOrders} real orders`);
    const problems = (m.signals ?? []).filter(s => s.kind === "problem");
    if (problems.length) { L.push(`Flagged:`); for (const s of problems.slice(0, 5)) L.push(`- [${s.severity}] ${s.title}: ${s.detail}`); }
    return L.join("\n");
  } catch { return `ACCOUNT: ${name} (flagged; no detail parsed)`; }
}

export async function investigateAccount(acc: AgentAccount & { name: string }, metricsJson: string): Promise<WorklistItem | null> {
  const context = seedContext(acc.name, metricsJson);
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: `${context}\n\nTriage this account and give me the one worklist item.` }];
  let finalText = "";
  for (let step = 0; step < MAX_STEPS; step++) {
    const msg = await client.messages.create({
      model: "claude-sonnet-5", max_tokens: 900, system: SYSTEM,
      tools: AGENT_TOOLS as unknown as Anthropic.Tool[],
      messages,
    });
    finalText = msg.content.filter(b => b.type === "text").map(b => (b as { text: string }).text).join("");
    const toolUses = msg.content.filter(b => b.type === "tool_use") as Array<{ id: string; name: string; input: unknown }>;
    if (msg.stop_reason !== "tool_use" || !toolUses.length) break;
    messages.push({ role: "assistant", content: msg.content });
    const results: Anthropic.ToolResultBlockParam[] = [];
    for (const tu of toolUses) {
      let out: string;
      try { out = await runAgentTool(tu.name, (tu.input ?? {}) as Record<string, unknown>, acc); }
      catch (e) { out = `Error running ${tu.name}: ${e instanceof Error ? e.message : String(e)}`; }
      results.push({ type: "tool_result", tool_use_id: tu.id, content: out });
    }
    messages.push({ role: "user", content: results });
  }
  return extractItem(finalText);
}

export async function generateOrgWorklist(organizationId: string): Promise<{ investigated: number; cleared: number; flagged: number }> {
  const accounts = await prisma.account.findMany({
    where: { organizationId, active: true, archived: false },
    select: { id: true, name: true, googleAdsId: true, organizationId: true, currency: true, merchantCenterId: true },
  });
  // Latest status per account → only investigate the flagged ones; clear the rest.
  const flagged: Array<{ acc: AgentAccount & { name: string }; red: boolean; metrics: string }> = [];
  let cleared = 0;
  for (const a of accounts) {
    const st = await prisma.accountStatus.findFirst({ where: { accountId: a.id }, orderBy: { computedAt: "desc" }, select: { status: true, metrics: true } });
    if (st?.status === "red" || st?.status === "yellow") {
      flagged.push({ acc: { id: a.id, name: a.name, googleAdsId: a.googleAdsId, organizationId: a.organizationId, currency: a.currency, merchantCenterId: a.merchantCenterId }, red: st.status === "red", metrics: st.metrics });
    } else {
      await prisma.account.update({ where: { id: a.id }, data: { worklist: null, worklistAt: null } }).catch(() => null);
      cleared++;
    }
  }
  flagged.sort((x, y) => (x.red ? 0 : 1) - (y.red ? 0 : 1));
  const targets = flagged.slice(0, 25); // cost cap

  let investigated = 0, cursor = 0;
  async function worker() {
    while (cursor < targets.length) {
      const t = targets[cursor++];
      try {
        const item = await investigateAccount(t.acc, t.metrics);
        if (item) { await prisma.account.update({ where: { id: t.acc.id }, data: { worklist: JSON.stringify(item), worklistAt: new Date() } }); investigated++; }
      } catch { /* skip this account */ }
    }
  }
  await Promise.all(Array.from({ length: 3 }, () => worker()));
  return { investigated, cleared, flagged: flagged.length };
}
