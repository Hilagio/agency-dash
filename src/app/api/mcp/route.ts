/**
 * POST /api/mcp — MCP server endpoint (Streamable HTTP transport), so Ecomtrada
 * AI can be added to claude.ai as a custom connector.
 *
 * Exposes the EXISTING agent tools (src/lib/diagnostics/agent-tools.ts) over
 * MCP — no new Google Ads logic lives here. Because a connector conversation
 * has no "current account" the way the in-app chat does, every account-scoped
 * tool takes a required `account` parameter (client name or Google Ads ID) and
 * resolves it server-side within the org.
 *
 * Auth (v1): a shared secret from env MCP_SECRET, passed as ?key=… in the
 * connector URL or as a Bearer header. The org scope is pinned by env
 * MCP_ORG_ID. /api/mcp is in PUBLIC_PREFIXES (src/proxy.ts) so the session
 * proxy doesn't bounce it to /login — THIS file is the gate: no valid key,
 * no answer. Everything is read-only except generate_plan.
 *
 * Transport notes (MCP spec, Streamable HTTP):
 *  - POST carries one JSON-RPC message. Notifications get 202 + empty body.
 *  - tools/call answers as an SSE stream with keep-alive pings so a long tool
 *    run (generate_plan ≈ 1–3 min of Opus) never idles Railway's gateway into
 *    a 502 — the same lesson the in-app SSE routes learned the hard way.
 *  - GET/DELETE are 405: this server is stateless, no sessions, no resumption.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { AGENT_TOOLS, runAgentTool, type AgentAccount } from "@/lib/diagnostics/agent-tools";
import { buildPlanInputs, PLAN_SYSTEM } from "@/lib/plan/generate";
import { renderPlanHtml } from "@/lib/plan/render";
import { ppcOsMcp, PPC_OS_SYSTEM_NOTE } from "@/lib/integrations/ppc-os";
import { publicOrigin } from "@/lib/base-url";
import type { PlanContent, PlanLanguage } from "@/lib/plan/types";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// ─── Auth ──────────────────────────────────────────────────────────────────────

function keysMatch(given: string, expected: string): boolean {
  // Hash both sides so timingSafeEqual gets equal-length buffers.
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

/** Returns the org id when the request carries a valid key; null otherwise. */
function authorize(req: NextRequest): string | null {
  const secret = process.env.MCP_SECRET;
  const orgId = process.env.MCP_ORG_ID;
  if (!secret || !orgId) return null; // not configured ⇒ endpoint is closed
  const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const key = req.nextUrl.searchParams.get("key") ?? bearer;
  return key && keysMatch(key, secret) ? orgId : null;
}

// ─── Account resolution ───────────────────────────────────────────────────────

const ACCOUNT_SELECT = {
  id: true, name: true, clientName: true, googleAdsId: true, currency: true,
  merchantCenterId: true, organizationId: true, active: true,
} as const;
type ResolvedAccount = { id: string; name: string; clientName: string | null; googleAdsId: string; currency: string; merchantCenterId: string | null; organizationId: string; active: boolean };

/** Name or Google Ads ID → the account, scoped to MCP_ORG_ID. Never guesses between ties. */
async function resolveAccount(orgId: string, q: string): Promise<{ acc?: ResolvedAccount; error?: string }> {
  const query = (q ?? "").trim();
  if (!query) return { error: "The `account` parameter is required: pass the client's name or Google Ads ID (use list_accounts to see them)." };
  const all = await prisma.account.findMany({ where: { organizationId: orgId, archived: false }, select: ACCOUNT_SELECT });
  const digits = query.replace(/\D/g, "");
  const lc = query.toLowerCase();
  const byId = digits.length >= 8 ? all.filter(a => a.googleAdsId.replace(/\D/g, "") === digits) : [];
  if (byId.length === 1) return { acc: byId[0] };
  const exact = all.filter(a => a.name.toLowerCase() === lc || a.clientName?.toLowerCase() === lc);
  if (exact.length === 1) return { acc: exact[0] };
  const partial = all.filter(a => a.name.toLowerCase().includes(lc) || a.clientName?.toLowerCase().includes(lc));
  if (partial.length === 1) return { acc: partial[0] };
  if (partial.length > 1) return { error: `"${query}" matches multiple accounts: ${partial.map(a => `${a.name} (${a.googleAdsId})`).join(", ")}. Pass the exact name or the Google Ads ID.` };
  return { error: `No account matches "${query}". Call list_accounts to see the available accounts.` };
}

const toAgentAccount = (a: ResolvedAccount): AgentAccount =>
  ({ id: a.id, googleAdsId: a.googleAdsId, organizationId: a.organizationId, currency: a.currency, merchantCenterId: a.merchantCenterId });

// ─── Tool catalog ─────────────────────────────────────────────────────────────

// Chat-only tools that make no sense over a connector: deliver_document renders
// into the in-app chat/library UI, remember_ruling writes team policy (v1 is
// read-only apart from generate_plan).
const SKIPPED_AGENT_TOOLS = new Set(["deliver_document", "remember_ruling"]);

const ACCOUNT_PARAM = {
  account: { type: "string", description: "Which client account: the client's name (e.g. \"Luna Fashion\") or the Google Ads ID. Use list_accounts if unsure." },
} as const;

type JsonSchema = { type: "object"; properties?: Record<string, unknown>; required?: string[] };

function mcpToolList() {
  const agentTools = AGENT_TOOLS
    .filter(t => !SKIPPED_AGENT_TOOLS.has(t.name))
    .map(t => {
      const schema = t.input_schema as JsonSchema;
      return {
        name: t.name,
        description: t.description,
        inputSchema: {
          type: "object" as const,
          properties: { ...ACCOUNT_PARAM, ...(schema.properties ?? {}) },
          required: ["account", ...(schema.required ?? [])],
        },
      };
    });
  return [
    {
      name: "list_accounts",
      description: "All client accounts in the agency: name, Google Ads ID, owner (account manager), active status, Slack channel, and the ROAS/CPA targets. Call this first when you need to know which accounts exist or how to reference one.",
      inputSchema: { type: "object" as const, properties: {} },
    },
    {
      name: "get_ownership_status",
      description: "The latest computed red/yellow/green ownership status for every account, with the reasons behind each verdict. The fastest 'which accounts need attention right now?' read.",
      inputSchema: { type: "object" as const, properties: {} },
    },
    {
      name: "get_plan",
      description: "The account's LIVE plan with its real execution state: every action with status (open/busy/done/blocked), assignee and completion info, plus the recent plan events (what changed, who, when). Use for 'where do we stand on the plan?' questions.",
      inputSchema: { type: "object" as const, properties: { ...ACCOUNT_PARAM }, required: ["account"] },
    },
    {
      name: "generate_plan",
      description: "Generate a strategic plan for the account — the same engine as the platform's plan generator (live Google Ads grounding, Context Pack, team rulings, PPC OS methodology). Takes 1–3 minutes. Returns the full plan JSON and a link; the rendered document is also saved to the account's document library. This is the ONLY writing tool on this connector.",
      inputSchema: {
        type: "object" as const,
        properties: {
          ...ACCOUNT_PARAM,
          planType: { type: "string", enum: ["first", "next", "recovery", "q4", "custom"], description: "Plan cycle: first (new client, day 0–90), next (follow-up period), recovery (30-day fix sprint), q4 (seasonal sprint), custom (brief is binding)." },
          language: { type: "string", enum: ["en", "nl"], description: "Plan language. Defaults to the account's configured language." },
          customBrief: { type: "string", description: "Team brief — binding for planType custom, optional context for recovery/q4." },
        },
        required: ["account"],
      },
    },
    ...agentTools,
  ];
}

// ─── Extra tools (connector-only) ─────────────────────────────────────────────

async function listAccounts(orgId: string): Promise<string> {
  const rows = await prisma.account.findMany({
    where: { organizationId: orgId, archived: false },
    select: { name: true, clientName: true, googleAdsId: true, active: true, slackChannelName: true, targetRoas: true, targetCpa: true, currency: true, owner: { select: { name: true } } },
    orderBy: { name: "asc" },
  });
  if (!rows.length) return "No accounts found for this organization.";
  return JSON.stringify(rows.map(r => ({
    name: r.name,
    client: r.clientName ?? undefined,
    googleAdsId: r.googleAdsId,
    owner: r.owner?.name ?? null,
    active: r.active,
    slackChannel: r.slackChannelName ?? null,
    targetRoas: r.targetRoas ?? null,
    targetCpa: r.targetCpa ?? null,
    currency: r.currency,
  })), null, 1);
}

async function getOwnershipStatus(orgId: string): Promise<string> {
  // distinct+desc = the newest AccountStatus row per account.
  const rows = await prisma.accountStatus.findMany({
    where: { account: { organizationId: orgId, archived: false } },
    orderBy: { computedAt: "desc" },
    distinct: ["accountId"],
    select: { status: true, reasons: true, computedAt: true, account: { select: { name: true, googleAdsId: true, active: true } } },
  });
  if (!rows.length) return "No ownership statuses computed yet.";
  const order = { red: 0, yellow: 1, green: 2 } as Record<string, number>;
  const parsed = rows
    .map(r => {
      let reasons: unknown = [];
      try { reasons = JSON.parse(r.reasons); } catch { /* keep empty */ }
      return { account: r.account.name, googleAdsId: r.account.googleAdsId, active: r.account.active, status: r.status, computedAt: r.computedAt.toISOString(), reasons };
    })
    .sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9) || a.account.localeCompare(b.account));
  return JSON.stringify(parsed, null, 1);
}

async function getPlan(acc: ResolvedAccount): Promise<string> {
  const inst = await prisma.planInstance.findUnique({
    where: { accountId: acc.id },
    include: { states: true, events: { orderBy: { at: "desc" }, take: 20 } },
  });
  if (!inst) return `No live plan on ${acc.name} — generate one with generate_plan, or activate one in the platform.`;
  let content: PlanContent | null = null;
  try { content = JSON.parse(inst.content) as PlanContent; } catch { return "The live plan's content is unreadable (invalid JSON in storage)."; }
  const stateBy = new Map(inst.states.map(s => [s.path, s]));
  const day = Math.max(1, Math.floor((Date.now() - inst.startedAt.getTime()) / 86_400_000) + 1);
  const out = {
    account: acc.name,
    goal: content.goal ?? content.subtitle,
    planType: content.planType ?? "first",
    horizonDays: content.horizonDays ?? 90,
    day,
    startedAt: inst.startedAt.toISOString().slice(0, 10),
    language: inst.language,
    nextReview: content.nextReview ?? null,
    mainRisk: content.mainRisk ?? null,
    phases: content.phases.map((ph, pi) => ({
      title: ph.title,
      window: ph.window,
      actions: (ph.actions ?? []).map((a, ai) => {
        const st = stateBy.get(`p${pi}a${ai}`);
        return {
          action: a.action,
          ...(a.dropped ? { dropped: true, droppedReason: a.droppedReason ?? null } : {}),
          status: st?.status ?? "open",
          assignee: st?.assignee ?? null,
          ...(st?.note ? { note: st.note } : {}),
          ...(st?.doneAt ? { doneAt: st.doneAt.toISOString().slice(0, 10), doneBy: st.doneBy ?? null } : {}),
        };
      }),
    })),
    recentEvents: inst.events.map(e => ({ at: e.at.toISOString().slice(0, 16).replace("T", " "), by: e.by ?? null, kind: e.kind, detail: e.detail })),
  };
  return JSON.stringify(out, null, 1);
}

// ─── generate_plan — the plan route's generation path, returning JSON not SSE ──

const anthropic = new Anthropic();

function extractJson(text: string): PlanContent | null {
  let s = text.trim();
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) s = fence[1].trim();
  const a = s.indexOf("{"), b = s.lastIndexOf("}");
  if (a < 0 || b <= a) return null;
  try { return JSON.parse(s.slice(a, b + 1)) as PlanContent; } catch { return null; }
}

async function generatePlan(acc: ResolvedAccount, args: { planType?: string; language?: string; customBrief?: string }): Promise<string> {
  const language = args.language === "nl" || args.language === "en" ? (args.language as PlanLanguage) : undefined;
  const inputs = await buildPlanInputs(acc.id, acc.organizationId, language);
  if (!inputs) return "Could not build plan inputs for this account.";

  // Same grounding as the platform route: live pulls (time-boxed — a hung
  // Google call must never pin the request), team conversation, rulings.
  const toolAcc = toAgentAccount(acc);
  const boxed = (p: Promise<string>) => Promise.race([p, new Promise<string>((_, rej) => setTimeout(() => rej(new Error("timeout")), 20_000))]);
  const pulls = await Promise.allSettled([
    boxed(runAgentTool("get_campaign_overview", {}, toolAcc)),
    boxed(runAgentTool("get_impression_share", {}, toolAcc)),
    boxed(runAgentTool("get_search_terms", {}, toolAcc)),
  ]);
  const labels = ["LIVE CAMPAIGN STRUCTURE (name campaigns by their REAL names in actions)", "IMPRESSION SHARE (lost to rank vs lost to budget)", "SEARCH TERMS (live — cite real terms in cleanup actions)"];
  pulls.forEach((p, i) => {
    if (p.status === "fulfilled" && p.value && !/^error/i.test(p.value)) inputs.dataBlock += `\n\n${labels[i]}:\n${p.value.slice(0, 4500)}`;
  });
  const msgs = await prisma.agentMessage.findMany({ where: { accountId: acc.id }, orderBy: { createdAt: "desc" }, take: 12, select: { role: true, content: true } }).then(r => r.reverse()).catch(() => []);
  if (msgs.length) inputs.contextBlock += `\n\nTEAM CONVERSATION ABOUT THIS ACCOUNT (recent — real account knowledge; weigh it heavily):\n${msgs.map(m => `${m.role === "assistant" ? "Analyst" : "Team"}: ${m.content.slice(0, 1200)}`).join("\n")}`;
  const rulings = await prisma.accountRuling.findMany({ where: { accountId: acc.id, active: true }, orderBy: { createdAt: "desc" }, take: 25 }).catch(() => []);
  if (rulings.length) inputs.contextBlock += `\n\nTEAM RULINGS (settled decisions — BINDING; never contradict, re-raise or plan against these):\n${rulings.map(r => `- ${r.text}`).join("\n")}`;

  // Plan-cycle block — same cycles as the platform route (fresh generation
  // only: the connector has no revise/rewrite/own-plan modes).
  const planType = ["next", "recovery", "q4", "custom"].includes(args.planType ?? "") ? args.planType as "next" | "recovery" | "q4" | "custom" : "first";
  const customBrief = typeof args.customBrief === "string" ? args.customBrief.trim() : "";
  let typeBlock = `\n\nPLAN CYCLE: FIRST plan for this client — baseline + quick wins (day 0–90). Set "planType":"first" and "horizonDays":90.`;
  if (planType === "next") {
    let prev = "";
    const prevInst = await prisma.planInstance.findUnique({ where: { accountId: acc.id }, include: { states: true } });
    if (prevInst) {
      try {
        const prevC = JSON.parse(prevInst.content) as PlanContent;
        const stBy = new Map(prevInst.states.map(s => [s.path, s]));
        const lines: string[] = [];
        prevC.phases.forEach((ph, pi) => (ph.actions ?? []).forEach((a, ai) => {
          if (a.dropped) return;
          const st = stBy.get(`p${pi}a${ai}`);
          lines.push(`${st?.status === "done" ? "DONE" : st?.status === "blocked" ? "BLOCKED" : "OPEN"}: "${a.action}"`);
        }));
        prev = `\nPREVIOUS PERIOD — goal: ${prevC.goal ?? prevC.subtitle}. Execution state of its actions:\n${lines.join("\n")}`;
      } catch { /* unreadable previous plan — proceed without it */ }
    }
    typeBlock = `\n\nPLAN CYCLE: FOLLOW-UP — the NEXT period (day 90–180): scale, efficiency, expansion. Set "planType":"next" and "horizonDays":90. This is NOT a restart: assume the foundation from the previous period stands. Do not re-propose work marked DONE below; carry BLOCKED/OPEN work forward only if it still matters. The story of this plan is the next constraint and the next level of growth (scaling, expansion, new inventory/markets/channels, compounding what works) — measurably beyond the previous period's goal.${prev}`;
  } else if (planType === "recovery") {
    typeBlock = `\n\nPLAN CYCLE: RECOVERY SPRINT — fix critical issues fast. Set "planType":"recovery" and "horizonDays":30 (or shorter if the brief says so). Ruthless prioritisation: only the actions that stop the bleeding and restore profitable economics make the plan; everything nice-to-have waits for the next cycle. Short review loops (days, not weeks), and the goal is the concrete recovery target (e.g. back above break-even ROAS).${customBrief ? `\nBRIEF FROM THE TEAM (binding):\n${customBrief}` : ""}`;
  } else if (planType === "q4") {
    typeBlock = `\n\nPLAN CYCLE: Q4 SPRINT — prioritise seasonal growth. Set "planType":"q4"; set "horizonDays" to the days remaining in the seasonal window (default 60 if unclear). Everything is ordered around the seasonal peak: inventory and feed readiness first, budget escalation timed to demand, creative/asset refresh for the season, and clear guardrails for peak-week spending. Timing anchors (Black Friday, Sinterklaas, Christmas) get concrete dates.${customBrief ? `\nBRIEF FROM THE TEAM (binding):\n${customBrief}` : ""}`;
  } else if (planType === "custom") {
    typeBlock = `\n\nPLAN CYCLE: CUSTOM. Set "planType":"custom". The brief below is BINDING — it defines the period, focus and boundaries of this plan. If the brief names a period other than 90 days, set "horizonDays" accordingly (in days); otherwise use 90.\nBRIEF FROM THE TEAM:\n${customBrief || "(no brief given — treat as a standard strategic plan)"}`;
  }

  const userMsg = `CLIENT CONTEXT PACK:\n${inputs.contextBlock}\n\nLIVE DATA:\n${inputs.dataBlock}${typeBlock}\n\nWrite the strategic plan for ${inputs.account.name} in ${inputs.language === "nl" ? "Dutch" : "English"}. ACTIONS MUST BE ACCOUNT-SPECIFIC: name the real campaigns, real search terms and real products from the data above — an action a competitor's plan could also contain ("optimise the feed") is too generic; say WHICH items, WHICH terms, WHICH campaigns. Return only the JSON object.`;

  const ppc = ppcOsMcp();
  const generate = async (extraNudge?: string) => {
    const genMsgs: Array<{ role: "user" | "assistant"; content: unknown }> = [{ role: "user", content: extraNudge ? `${userMsg}\n\n${extraNudge}` : userMsg }];
    let acc2 = "", stopReason: string | null = null;
    for (let round = 0; round < 5; round++) {
      const stream = anthropic.beta.messages.stream({
        model: "claude-opus-4-8",
        max_tokens: 20_000,
        thinking: { type: "adaptive" },
        ...(ppc ? { betas: ppc.betas, mcp_servers: ppc.mcp_servers, tools: ppc.tools } : {}),
        system: PLAN_SYSTEM + (ppc ? `${PPC_OS_SYSTEM_NOTE}\nConsult it for methodology while planning (scaling doctrine, structure, bidding) where it sharpens the plan — but your FINAL output must still be ONLY the JSON object.` : ""),
        messages: genMsgs as Parameters<typeof anthropic.beta.messages.stream>[0]["messages"],
      });
      for await (const ev of stream) {
        if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") acc2 += ev.delta.text;
      }
      const fm = await stream.finalMessage();
      stopReason = fm.stop_reason;
      if (fm.stop_reason !== "pause_turn") break;
      genMsgs.push({ role: "assistant", content: fm.content });
    }
    return { acc: acc2, stopReason };
  };
  let { acc: raw, stopReason } = await generate();
  let plan = extractJson(raw);
  if (!plan) {
    ({ acc: raw, stopReason } = await generate(
      stopReason === "max_tokens"
        ? "IMPORTANT: your previous attempt exceeded the output limit. Keep every body to ONE tight sentence and stay within the item counts' lower bounds."
        : "IMPORTANT: your previous attempt was not valid JSON. Return ONLY the JSON object — no prose, no code fences, no trailing commas.",
    ));
    plan = extractJson(raw);
  }
  if (!plan) return `Plan generation failed: the model returned an unparseable plan (${stopReason === "max_tokens" ? "output limit hit twice" : "invalid JSON twice"}). Try again.`;
  plan.language = inputs.language;
  plan.client = inputs.account.name;

  // Render + save to the account's document library so the team can open it in
  // the platform — the connector's "link back".
  const html = renderPlanHtml(plan, inputs.charts);
  const safe = (acc.clientName || acc.name).replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const saved = await prisma.generatedDoc.create({
    data: { accountId: acc.id, title: `${plan.horizonDays ?? 90}-day plan — ${inputs.account.name}`, docType: "Strategic Plan", format: "doc", language: inputs.language, filename: `${safe}-plan.html`, html, createdBy: "mcp-connector" },
    select: { id: true, title: true },
  }).catch(() => null);
  const link = `${publicOrigin()}/diagnose/${acc.id}`;
  return [
    saved
      ? `Plan generated and saved to ${acc.name}'s document library as "${saved.title}". Open it in the platform: ${link} (Documents panel).`
      : `Plan generated (saving to the document library failed — the JSON below is still complete). Account page: ${link}`,
    `NOTE: this is a generated DRAFT — it is not the account's live plan until the team activates it in the platform.`,
    `PLAN JSON:\n${JSON.stringify(plan)}`,
  ].join("\n\n");
}

// ─── Tool dispatch ────────────────────────────────────────────────────────────

const AGENT_TOOL_NAMES = new Set<string>(AGENT_TOOLS.filter(t => !SKIPPED_AGENT_TOOLS.has(t.name)).map(t => t.name));

async function callTool(orgId: string, name: string, args: Record<string, unknown>): Promise<{ text: string; isError?: boolean }> {
  try {
    if (name === "list_accounts") return { text: await listAccounts(orgId) };
    if (name === "get_ownership_status") return { text: await getOwnershipStatus(orgId) };

    // Everything below is account-scoped.
    const { acc, error } = await resolveAccount(orgId, String(args.account ?? ""));
    if (!acc) return { text: error ?? "Account not found.", isError: true };

    if (name === "get_plan") return { text: await getPlan(acc) };
    if (name === "generate_plan") {
      const text = await generatePlan(acc, { planType: args.planType as string | undefined, language: args.language as string | undefined, customBrief: args.customBrief as string | undefined });
      return { text, isError: /^(Plan generation failed|Could not build)/.test(text) };
    }
    if (AGENT_TOOL_NAMES.has(name)) {
      const text = await runAgentTool(name as Parameters<typeof runAgentTool>[0], args, toAgentAccount(acc));
      return { text };
    }
    return { text: `Unknown tool: ${name}`, isError: true };
  } catch (err) {
    return { text: `Tool ${name} failed: ${err instanceof Error ? err.message : String(err)}`, isError: true };
  }
}

// ─── JSON-RPC over Streamable HTTP ────────────────────────────────────────────

type JsonRpcMessage = { jsonrpc?: string; id?: string | number | null; method?: string; params?: Record<string, unknown> };

const SUPPORTED_PROTOCOLS = new Set(["2024-11-05", "2025-03-26", "2025-06-18"]);
const LATEST_PROTOCOL = "2025-06-18";

const rpcResult = (id: string | number | null, result: unknown) => ({ jsonrpc: "2.0", id, result });
const rpcError = (id: string | number | null, code: number, message: string) => ({ jsonrpc: "2.0", id, error: { code, message } });

export async function POST(req: NextRequest) {
  const orgId = authorize(req);
  if (!orgId) {
    return NextResponse.json(
      { jsonrpc: "2.0", id: null, error: { code: -32001, message: "Unauthorized: pass the connector key as ?key=… or an Authorization: Bearer header." } },
      { status: 401 },
    );
  }

  let msg: JsonRpcMessage;
  try { msg = await req.json() as JsonRpcMessage; } catch {
    return NextResponse.json(rpcError(null, -32700, "Parse error: body is not valid JSON."), { status: 400 });
  }
  // Batches were removed in protocol 2025-06-18; this stateless v1 takes one
  // message per POST (what claude.ai sends).
  if (Array.isArray(msg)) return NextResponse.json(rpcError(null, -32600, "Batch requests are not supported."), { status: 400 });

  const method = msg.method ?? "";
  const id = msg.id ?? null;

  // Notifications (no id) are acknowledged and produce no body.
  if (msg.id === undefined || method.startsWith("notifications/")) {
    return new Response(null, { status: 202 });
  }

  if (method === "initialize") {
    const requested = String((msg.params?.protocolVersion as string | undefined) ?? "");
    return NextResponse.json(rpcResult(id, {
      protocolVersion: SUPPORTED_PROTOCOLS.has(requested) ? requested : LATEST_PROTOCOL,
      capabilities: { tools: { listChanged: false } },
      serverInfo: { name: "ecomtrada-ai", title: "Ecomtrada AI", version: "1.0.0" },
      instructions: "Google Ads diagnostics for Ecomtrada's client accounts. Account-scoped tools take an `account` parameter (client name or Google Ads ID) — call list_accounts to see them. Everything is read-only except generate_plan.",
    }));
  }
  if (method === "ping") return NextResponse.json(rpcResult(id, {}));
  if (method === "tools/list") return NextResponse.json(rpcResult(id, { tools: mcpToolList() }));

  if (method === "tools/call") {
    const name = String(msg.params?.name ?? "");
    const args = (msg.params?.arguments ?? {}) as Record<string, unknown>;
    // Answer as an SSE stream with keep-alive pings: generate_plan runs 1–3
    // minutes and a silent connection is exactly what 502s long requests here.
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const ping = setInterval(() => {
          try { controller.enqueue(encoder.encode(": ping\n\n")); } catch { clearInterval(ping); }
        }, 10_000);
        try {
          const { text, isError } = await callTool(orgId, name, args);
          const response = rpcResult(id, { content: [{ type: "text", text }], ...(isError ? { isError: true } : {}) });
          controller.enqueue(encoder.encode(`event: message\ndata: ${JSON.stringify(response)}\n\n`));
        } catch (err) {
          const response = rpcError(id, -32603, err instanceof Error ? err.message : "Internal error");
          controller.enqueue(encoder.encode(`event: message\ndata: ${JSON.stringify(response)}\n\n`));
        } finally {
          clearInterval(ping);
          controller.close();
        }
      },
    });
    return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" } });
  }

  return NextResponse.json(rpcError(id, -32601, `Method not found: ${method}`));
}

// Stateless server: no server-initiated SSE stream, no sessions to delete.
export function GET() {
  return new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } });
}
export function DELETE() {
  return new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } });
}
