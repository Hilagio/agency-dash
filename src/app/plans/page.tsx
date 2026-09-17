"use client";

/**
 * /plans — the team's 90-day plan execution board.
 *
 * Every account with a LIVE plan, real-time: day X of 90, progress per phase,
 * the next open action and its owner, and stall warnings. Fully interactive:
 * tick actions done, assign teammates, flag blockers — inline, for everyone in
 * the workspace. This is the shared source of truth that replaces "did anyone
 * do step 3 for client X?" messages.
 */
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, ChevronDown, ChevronRight, AlertTriangle, CircleCheck, RefreshCw, Sparkles } from "lucide-react";

interface Phase { title: string; window: string; done: number; total: number }
interface NextAction { path: string; phase: string; action: string; who: string; when: string; assignee: string | null; status: string }
interface Row {
  accountId: string; name: string; clientName: string | null; startedAt: string; createdBy: string | null; dayInPlan: number;
  totalActions: number; doneActions: number; blockedActions: number; phases: Phase[];
  nextAction: NextAction | null; lastActivityAt: string | null; lastDoneBy: string | null;
  stalled: boolean; assignees: string[];
  lastUpdate: { at: string; by: string | null; detail: string } | null;
}
interface Unplanned { accountId: string; name: string; clientName: string | null }
interface Member { email: string; name: string; role: string }
interface LiveAction { action: string; who: string; when: string; deviation?: boolean; deviationReason?: string; addedAt?: string; addedBy?: string; dropped?: boolean; droppedReason?: string }
interface LivePhase { title: string; window: string; actions: LiveAction[] }
interface LiveState { path: string; status: string; assignee: string | null; note: string | null; doneAt: string | null; doneBy: string | null }
interface LiveEvent { at: string; by: string | null; kind: string; detail: string }

const card: React.CSSProperties = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14 };
const selStyle: React.CSSProperties = { fontSize: 11.5, padding: "4px 7px", borderRadius: 7, border: "1px solid var(--border-2)", background: "var(--surface-2)", color: "var(--text)" };

function ago(iso: string | null): string {
  if (!iso) return "no activity yet";
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  return d <= 0 ? "today" : d === 1 ? "yesterday" : `${d}d ago`;
}

export default function PlansBoardPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [unplanned, setUnplanned] = useState<Unplanned[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [me, setMe] = useState<string>("");
  const [mineOnly, setMineOnly] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [detail, setDetail] = useState<{ phases: LivePhase[]; states: Map<string, LiveState>; events: LiveEvent[] } | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [addText, setAddText] = useState<Record<number, string>>({});
  const [addReason, setAddReason] = useState<Record<number, string>>({});
  const [detailLoading, setDetailLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [rewriting, setRewriting] = useState<string | null>(null);

  const load = useCallback(async () => {
    const j = await fetch("/api/diagnostics/plan-board", { credentials: "include" }).then(r => r.ok ? r.json() : null).catch(() => null);
    if (!j) { setErr("Couldn't load the board."); return; }
    setRows(j.rows); setUnplanned(j.unplanned ?? []); setMembers(j.members ?? []); setMe(j.me ?? "");
  }, []);
  useEffect(() => { load(); const t = setInterval(load, 60_000); return () => clearInterval(t); }, [load]);

  async function openRow(accountId: string) {
    if (open === accountId) { setOpen(null); setDetail(null); return; }
    setOpen(accountId); setDetail(null); setDetailLoading(true);
    try {
      const j = await fetch(`/api/accounts/${accountId}/plan/live`, { credentials: "include" }).then(r => r.ok ? r.json() : null);
      if (j?.active && j.content?.phases) {
        setDetail({ phases: j.content.phases, states: new Map((j.states as LiveState[]).map(s => [s.path, s])), events: j.events ?? [] });
      }
    } finally { setDetailLoading(false); }
  }

  async function patchAction(accountId: string, path: string, patch: Record<string, unknown>) {
    // Optimistic detail update, then refresh the board row counts.
    setDetail(d => {
      if (!d) return d;
      const states = new Map(d.states);
      const prev = states.get(path) ?? { path, status: "open", assignee: null, note: null, doneAt: null, doneBy: null };
      states.set(path, { ...prev, ...patch } as LiveState);
      return { ...d, states };
    });
    await fetch(`/api/accounts/${accountId}/plan/live`, {
      method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, ...patch }),
    }).catch(() => null);
    load();
  }

  async function reloadDetail(accountId: string) {
    const j = await fetch(`/api/accounts/${accountId}/plan/live`, { credentials: "include" }).then(r => r.ok ? r.json() : null);
    if (j?.active && j.content?.phases) setDetail({ phases: j.content.phases, states: new Map((j.states as LiveState[]).map(s => [s.path, s])), events: j.events ?? [] });
    load();
  }
  async function addDeviation(accountId: string, phase: number) {
    const action = (addText[phase] ?? "").trim();
    if (!action) return;
    await fetch(`/api/accounts/${accountId}/plan/live`, {
      method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addAction: { phase, action, reason: (addReason[phase] ?? "").trim() } }),
    }).catch(() => null);
    setAddText(t => ({ ...t, [phase]: "" })); setAddReason(t => ({ ...t, [phase]: "" }));
    reloadDetail(accountId);
  }
  async function dropDeviation(accountId: string, path: string, action: string) {
    const reason = window.prompt(`Drop "${action}" from the plan?\nWhy? (kept in the plan history)`);
    if (reason === null) return;
    await fetch(`/api/accounts/${accountId}/plan/live`, {
      method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dropAction: { path, reason } }),
    }).catch(() => null);
    reloadDetail(accountId);
  }

  async function editAction(accountId: string, path: string, a: LiveAction) {
    const text = window.prompt("Action text:", a.action);
    if (text === null) return;
    const when = window.prompt("When (e.g. Week 3):", a.when);
    if (when === null) return;
    await fetch(`/api/accounts/${accountId}/plan/live`, {
      method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ editAction: { path, action: text.trim(), when: when.trim() } }),
    }).catch(() => null);
    reloadDetail(accountId);
  }

  // AI rewrite from progress: re-plans the remaining days around what's
  // already done — completed work keeps its state and stops being the story.
  async function rewriteFromProgress(accountId: string) {
    if (rewriting) return;
    setRewriting(accountId);
    try {
      const r = await fetch(`/api/accounts/${accountId}/plan`, {
        method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewriteFromLive: true }),
      });
      if (!r.ok || !r.body) { setErr("Rewrite failed to start."); return; }
      const reader = r.body.getReader(); const dec = new TextDecoder(); let buf = ""; let okDone = false;
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const parts = buf.split("\n\n"); buf = parts.pop() ?? "";
        for (const part of parts) {
          const line = part.trim(); if (!line.startsWith("data:")) continue;
          try {
            const ev = JSON.parse(line.slice(5).trim());
            if (ev.error) { setErr(ev.error); okDone = true; }
            else if (ev.done) okDone = true;
          } catch { /* keep-alive */ }
        }
      }
      if (!okDone) setErr("The connection dropped during the rewrite — check the plan and retry if needed.");
    } catch (e) { setErr(e instanceof Error ? e.message : "Rewrite failed"); }
    finally { setRewriting(null); reloadDetail(accountId); }
  }

  const shown = (rows ?? []).filter(r => !mineOnly || r.assignees.includes(me) || r.nextAction?.assignee === me);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <nav style={{ display: "flex", alignItems: "center", gap: 14, height: 56, padding: "0 24px", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, background: "var(--header-bg)", backdropFilter: "blur(12px)", zIndex: 9 }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-3)", textDecoration: "none", fontSize: 13 }}><ArrowLeft size={15} /> Cockpit</Link>
        <span style={{ fontWeight: 700, fontSize: 14 }}>90-day plans · team board</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--text-3)", cursor: "pointer" }}>
            <input type="checkbox" checked={mineOnly} onChange={e => setMineOnly(e.target.checked)} /> My work only
          </label>
          <button onClick={load} title="Refresh" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: "var(--text-2)", background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "7px 12px", cursor: "pointer" }}><RefreshCw size={13} /> Refresh</button>
        </div>
      </nav>

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "20px 24px 80px" }}>
        {err && <div style={{ ...card, padding: "13px 16px", marginBottom: 14, color: "var(--danger)", fontSize: 13 }}>{err}</div>}
        {!rows ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Loader2 size={20} className="animate-spin" style={{ color: "var(--text-dim)" }} /></div>
        ) : shown.length === 0 ? (
          <div style={{ ...card, padding: "48px 20px", textAlign: "center", color: "var(--text-muted)" }}>
            <Sparkles size={26} style={{ color: "var(--accent)", marginBottom: 10 }} />
            <div style={{ fontWeight: 600, color: "var(--text-2)" }}>{mineOnly ? "Nothing assigned to you right now." : "No live plans yet"}</div>
            <div style={{ fontSize: 13, marginTop: 6, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
              Generate a 90-day plan on an account and hit <b>Activate as live plan</b> — it appears here for the whole team, with every action trackable and assignable.
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {shown.map(r => {
              const pct = r.totalActions > 0 ? Math.round((r.doneActions / r.totalActions) * 100) : 0;
              const finished = r.totalActions > 0 && r.doneActions >= r.totalActions;
              const isOpen = open === r.accountId;
              return (
                <div key={r.accountId} style={{ ...card, overflow: "hidden", borderColor: r.stalled ? "color-mix(in srgb, var(--danger) 45%, var(--border))" : "var(--border)" }}>
                  <div role="button" tabIndex={0} onClick={() => openRow(r.accountId)} onKeyDown={e => { if (e.key === "Enter") openRow(r.accountId); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", cursor: "pointer", color: "var(--text)", textAlign: "left" }}>
                    {isOpen ? <ChevronDown size={15} style={{ flexShrink: 0, color: "var(--text-dim)" }} /> : <ChevronRight size={15} style={{ flexShrink: 0, color: "var(--text-dim)" }} />}
                    <div style={{ minWidth: 170 }}>
                      <div style={{ fontWeight: 700, fontSize: 13.5 }}>{r.clientName || r.name}</div>
                      <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>day {Math.min(r.dayInPlan, 90)} of 90 · live since {r.startedAt.slice(0, 10)}{r.createdBy ? ` by ${r.createdBy.split("@")[0]}` : ""}</div>
                      {r.lastUpdate && (
                        <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2, maxWidth: 380, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          <span style={{ color: "var(--text-dim)" }}>{ago(r.lastUpdate.at)}</span> · <b>{r.lastUpdate.by ? r.lastUpdate.by.split("@")[0] : "system"}</b> — {r.lastUpdate.detail}
                        </div>
                      )}
                    </div>
                    {/* Phase progress segments */}
                    <div style={{ flex: 1, display: "flex", gap: 4, alignItems: "center", minWidth: 120 }}>
                      {r.phases.map((p, i) => (
                        <div key={i} title={`${p.title} — ${p.done}/${p.total}`} style={{ flex: Math.max(1, p.total), height: 8, borderRadius: 4, background: "var(--surface-2)", overflow: "hidden", border: "1px solid var(--border-2)" }}>
                          <div style={{ width: `${p.total > 0 ? (p.done / p.total) * 100 : 0}%`, height: "100%", background: "var(--accent)" }} />
                        </div>
                      ))}
                      <span style={{ fontSize: 11.5, color: "var(--text-3)", fontVariantNumeric: "tabular-nums", marginLeft: 4 }}>{r.doneActions}/{r.totalActions} · {pct}%</span>
                    </div>
                    {/* Status + next */}
                    <div style={{ minWidth: 260, maxWidth: 340 }}>
                      {finished ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--accent)", fontWeight: 700 }}><CircleCheck size={13} /> Plan complete</span>
                      ) : r.nextAction ? (
                        <>
                          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4, color: r.nextAction.status === "blocked" ? "var(--danger)" : "var(--text-muted)" }}>
                            {r.nextAction.status === "blocked" ? "Blocked" : "Next"} · {r.nextAction.phase}
                          </div>
                          <div style={{ fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{r.nextAction.action}</div>
                          <div style={{ fontSize: 11, color: r.nextAction.assignee ? "var(--accent)" : "var(--text-dim)", marginTop: 2 }}>
                            {r.nextAction.assignee ? `→ ${r.nextAction.assignee.split("@")[0]}` : "unassigned"} · {r.nextAction.when}
                          </div>
                        </>
                      ) : null}
                    </div>
                    {r.stalled && <span title="Live for over a week with no activity in 7 days" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 700, color: "var(--danger)", flexShrink: 0 }}><AlertTriangle size={13} /> stalled</span>}
                    <Link href={`/diagnose/${r.accountId}`} onClick={e => e.stopPropagation()} title="Open the account" style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", textDecoration: "none", flexShrink: 0, padding: "4px 8px" }}>account →</Link>
                  </div>

                  {isOpen && (
                    <div style={{ borderTop: "1px solid var(--border)", padding: "12px 16px 16px 45px" }}>
                      {detailLoading || !detail ? (
                        <div style={{ fontSize: 12.5, color: "var(--text-3)", display: "flex", alignItems: "center", gap: 8, padding: "8px 0" }}><Loader2 size={13} className="animate-spin" /> Loading plan…</div>
                      ) : detail.phases.map((ph, pi) => (
                        <div key={pi} style={{ marginBottom: 14 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>{ph.title} <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>· {ph.window}</span></div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            {ph.actions.map((a, ai) => {
                              const path = `p${pi}a${ai}`;
                              const st = detail.states.get(path);
                              const isDone = st?.status === "done";
                              const isBlocked = st?.status === "blocked";
                              if (a.dropped) return (
                                <div key={ai} style={{ display: "flex", gap: 9, padding: "5px 10px", fontSize: 11.5, color: "var(--text-dim)" }}>
                                  <span style={{ textDecoration: "line-through" }}>{a.action}</span>
                                  <span>— dropped{a.droppedReason ? `: ${a.droppedReason}` : ""}</span>
                                </div>
                              );
                              return (
                                <div key={ai} style={{ display: "flex", alignItems: "flex-start", gap: 9, padding: "7px 10px", borderRadius: 9, background: isDone ? "var(--surface-2)" : "var(--surface)", border: `1px solid ${isBlocked ? "color-mix(in srgb, var(--danger) 45%, var(--border-2))" : "var(--border-2)"}`, opacity: isDone ? 0.65 : 1 }}>
                                  <input type="checkbox" checked={isDone} onChange={e => patchAction(r.accountId, path, { status: e.target.checked ? "done" : "open" })} style={{ marginTop: 3, cursor: "pointer" }} title={isDone && st?.doneBy ? `done by ${st.doneBy}` : "Mark done"} />
                                  {/* status select mirrors the paper checklist: Not started / In progress / Done / Blocked */}
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 12.5, color: isDone ? "var(--text-muted)" : "var(--text-2)", lineHeight: 1.45, textDecoration: isDone ? "line-through" : "none" }}>{a.action}{a.deviation && <span title={`${a.deviationReason ?? ""} — added ${a.addedAt?.slice(0, 10) ?? ""} by ${a.addedBy ?? ""}`} style={{ marginLeft: 6, fontSize: 9.5, fontWeight: 800, letterSpacing: 0.4, textTransform: "uppercase", color: "var(--accent)", border: "1px solid color-mix(in srgb, var(--accent) 45%, transparent)", borderRadius: 4, padding: "1px 5px" }}>deviation</span>}</div>
                                    <div style={{ fontSize: 10.5, color: "var(--text-dim)", marginTop: 2 }}>{a.who} · {a.when}{isDone && st?.doneBy ? ` · ✓ ${st.doneBy.split("@")[0]}` : ""}{st?.status === "busy" ? " · ⏳ in progress" : ""}{st?.note ? ` · 📝 ${st.note}` : ""}</div>
                                  </div>
                                  <select value={st?.assignee ?? ""} onChange={e => patchAction(r.accountId, path, { assignee: e.target.value || null })} style={selStyle} title="Assign a teammate">
                                    <option value="">— unassigned —</option>
                                    {members.map(m => <option key={m.email} value={m.email}>{m.name}</option>)}
                                  </select>
                                  <select value={st?.status ?? "open"} onChange={e => patchAction(r.accountId, path, { status: e.target.value })} title="Status"
                                    style={{ fontSize: 11, padding: "4px 6px", borderRadius: 7, border: "1px solid var(--border-2)", background: isBlocked ? "var(--danger)" : "var(--surface-2)", color: isBlocked ? "#fff" : st?.status === "busy" ? "var(--accent)" : "var(--text-3)", fontWeight: 700, flexShrink: 0 }}>
                                    <option value="open">not started</option>
                                    <option value="busy">in progress</option>
                                    <option value="done">done</option>
                                    <option value="blocked">blocked</option>
                                  </select>
                                  <button onClick={() => editAction(r.accountId, path, a)} title="Edit this action's text or timing"
                                    style={{ fontSize: 10.5, fontWeight: 700, padding: "3px 8px", borderRadius: 6, border: "1px solid var(--border-2)", cursor: "pointer", background: "var(--surface-2)", color: "var(--text-3)", flexShrink: 0 }}>edit</button>
                                  <button onClick={() => dropDeviation(r.accountId, path, a.action)} title="Drop this action from the plan (with a reason — kept in the history)"
                                    style={{ fontSize: 10.5, fontWeight: 700, padding: "3px 8px", borderRadius: 6, border: "1px solid var(--border-2)", cursor: "pointer", background: "var(--surface-2)", color: "var(--text-dim)", flexShrink: 0 }}>drop</button>
                                </div>
                              );
                            })}
                            <div style={{ display: "flex", gap: 6, alignItems: "center", paddingLeft: 2 }}>
                              <input value={addText[pi] ?? ""} onChange={e => setAddText(t => ({ ...t, [pi]: e.target.value }))} placeholder="+ Add action (deviation from the plan)…" style={{ flex: 2, minWidth: 0, ...({ fontSize: 11.5, padding: "5px 8px", borderRadius: 7, border: "1px dashed var(--border-2)", background: "var(--surface)", color: "var(--text)" } as React.CSSProperties) }} />
                              <input value={addReason[pi] ?? ""} onChange={e => setAddReason(t => ({ ...t, [pi]: e.target.value }))} placeholder="why? (goes in the history)" style={{ flex: 1.4, minWidth: 0, ...({ fontSize: 11.5, padding: "5px 8px", borderRadius: 7, border: "1px dashed var(--border-2)", background: "var(--surface)", color: "var(--text)" } as React.CSSProperties) }} />
                              <button onClick={() => addDeviation(r.accountId, pi)} disabled={!(addText[pi] ?? "").trim()} style={{ fontSize: 11, fontWeight: 700, padding: "5px 11px", borderRadius: 7, border: "1px solid var(--border-2)", cursor: "pointer", background: "var(--surface-2)", color: "var(--text-2)" }}>Add</button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {/* History + print of the current version */}
                      {detail && <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 4, marginBottom: 10, flexWrap: "wrap" }}>
                        <a href={`/api/accounts/${r.accountId}/plan/live?format=html`} target="_blank" rel="noreferrer" style={{ fontSize: 12, fontWeight: 700, color: "var(--text-2)", textDecoration: "none", border: "1px solid var(--border-2)", borderRadius: 8, padding: "6px 12px", background: "var(--surface)" }}>Print current plan ↗</a>
                        <a href={`/api/accounts/${r.accountId}/plan/live?format=checklist`} target="_blank" rel="noreferrer" style={{ fontSize: 12, fontWeight: 700, color: "var(--text-2)", textDecoration: "none", border: "1px solid var(--border-2)", borderRadius: 8, padding: "6px 12px", background: "var(--surface)" }}>Print checklist ↗</a>
                        <button onClick={() => rewriteFromProgress(r.accountId)} disabled={rewriting !== null}
                          title="AI re-plans the remaining days around what's already done — completed work keeps its state and stops dominating the plan"
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#fff", background: "var(--btn-primary, var(--accent))", border: "none", borderRadius: 8, padding: "6px 12px", cursor: rewriting ? "default" : "pointer" }}>
                          {rewriting === r.accountId ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} {rewriting === r.accountId ? "Rewriting…" : "Rewrite from progress"}
                        </button>
                        <button onClick={() => setHistoryOpen(h => !h)} style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                          {historyOpen ? "Hide history" : `History (${detail.events.length})`}
                        </button>
                      </div>}
                      {historyOpen && detail && (
                        <div style={{ borderLeft: "2px solid var(--border-2)", paddingLeft: 12, marginBottom: 12, display: "flex", flexDirection: "column", gap: 4 }}>
                          {detail.events.length === 0 && <div style={{ fontSize: 11.5, color: "var(--text-dim)" }}>No history yet.</div>}
                          {detail.events.map((ev, i) => (
                            <div key={i} style={{ fontSize: 11.5, color: "var(--text-3)", lineHeight: 1.5 }}>
                              <span style={{ color: "var(--text-dim)", fontVariantNumeric: "tabular-nums" }}>{ev.at.slice(0, 10)} {ev.at.slice(11, 16)}</span>
                              {" · "}<span style={{ fontWeight: 600, color: "var(--text-2)" }}>{ev.by ? ev.by.split("@")[0] : "system"}</span>
                              {" — "}{ev.detail}
                            </div>
                          ))}
                        </div>
                      )}
                      <Link href={`/plan/${r.accountId}`} style={{ fontSize: 12, color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>Open the plan generator for this account →</Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {rows && unplanned.length > 0 && !mineOnly && (
          <div style={{ marginTop: 22 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--text-muted)", marginBottom: 8 }}>
              No live plan yet · {unplanned.length} account{unplanned.length === 1 ? "" : "s"}
            </div>
            <div style={{ ...card, padding: "4px 0" }}>
              {unplanned.map((u, i) => (
                <div key={u.accountId} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 16px", borderBottom: i < unplanned.length - 1 ? "1px solid var(--border-2)" : "none" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-2)" }}>{u.clientName || u.name}</span>
                  </div>
                  <Link href={`/diagnose/${u.accountId}`} style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-3)", textDecoration: "none" }}>account →</Link>
                  <Link href={`/plan/${u.accountId}`} style={{ fontSize: 11.5, fontWeight: 700, color: "var(--accent)", textDecoration: "none", border: "1px solid color-mix(in srgb, var(--accent) 40%, var(--border-2))", borderRadius: 7, padding: "4px 10px" }}>Create plan →</Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
