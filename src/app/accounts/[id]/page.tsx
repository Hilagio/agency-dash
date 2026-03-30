"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RefreshCw, MessageSquare, ListChecks, BarChart2, Loader2, Search, BookOpen, ClipboardList, Send, Pencil, X, CheckSquare, Sparkles, Package, Brain } from "lucide-react";
import { ScoreBuckets } from "@/components/ScoreBuckets";
import { ScoreHistory } from "@/components/ScoreHistory";
import { ActionList } from "@/components/ActionList";
import { ChatAssistant } from "@/components/ChatAssistant";
import { SearchTermReport } from "@/components/SearchTermReport";
import { PlaybookView } from "@/components/PlaybookView";
import { ProductPerformance } from "@/components/ProductPerformance";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BUCKET_LABELS } from "@/lib/engine/types";

type Tab = "overview" | "actions" | "products" | "search-terms" | "playbook" | "chat" | "notes" | "sops";

interface Note {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

// ─── SOP checklist component ──────────────────────────────────────────────────

interface SopProgress {
  id: string;
  sopId: string;
  completedSteps: string; // JSON number[]
  sop: { id: string; title: string; content: string; isActive: boolean };
}

function parseSteps(content: string): string[] {
  return content
    .split("\n")
    .filter(line => /^\s*\d+[.)]\s+/.test(line))
    .map(line => line.replace(/^\s*\d+[.)]\s+/, "").trim())
    .filter(Boolean);
}

function SopChecklist({ accountId }: { accountId: string }) {
  const [progressList, setProgressList] = useState<SopProgress[]>([]);
  const [allSops, setAllSops] = useState<{ id: string; title: string; content: string; isActive: boolean }[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null); // "sopId-stepIndex"

  useEffect(() => {
    Promise.all([
      fetch(`/api/accounts/${accountId}/sop-progress`).then(r => r.json()),
      fetch("/api/sops").then(r => r.json()),
    ]).then(([prog, sops]) => {
      setProgressList(prog);
      setAllSops(sops.filter((s: { isActive: boolean }) => s.isActive));
      setLoading(false);
    });
  }, [accountId]);

  const toggle = async (sopId: string, stepIndex: number) => {
    const key = `${sopId}-${stepIndex}`;
    setToggling(key);
    const res = await fetch(`/api/accounts/${accountId}/sop-progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sopId, stepIndex }),
    });
    if (res.ok) {
      const updated: SopProgress = await res.json();
      setProgressList(prev => {
        const idx = prev.findIndex(p => p.sopId === sopId);
        if (idx === -1) {
          // Need to re-fetch to get sop relation
          const sop = allSops.find(s => s.id === sopId)!;
          return [...prev, { ...updated, sop }];
        }
        return prev.map(p => p.sopId === sopId ? { ...p, completedSteps: updated.completedSteps } : p);
      });
    }
    setToggling(null);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-dim)", fontSize: 13, padding: "20px 0" }}>
        <Loader2 size={14} className="animate-spin" /> Loading SOPs…
      </div>
    );
  }

  if (allSops.length === 0) {
    return (
      <div style={{
        border: "1px dashed var(--border-2)", borderRadius: 12,
        padding: "40px 24px", textAlign: "center", color: "var(--text-faint)", fontSize: 13,
      }}>
        No active SOPs. Go to{" "}
        <a href="/sops" style={{ color: "#60a5fa", textDecoration: "none" }}>Agency SOPs</a>
        {" "}to add your procedures.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {allSops.map(sop => {
        const steps = parseSteps(sop.content);
        const prog = progressList.find(p => p.sopId === sop.id);
        const done: number[] = prog ? JSON.parse(prog.completedSteps) : [];
        const pct = steps.length > 0 ? Math.round((done.length / steps.length) * 100) : 0;

        return (
          <div key={sop.id} style={{
            border: "1px solid var(--border)",
            borderLeft: `3px solid ${pct === 100 ? "#4ade80" : pct > 0 ? "#60a5fa" : "var(--border-2)"}`,
            borderRadius: 12, overflow: "hidden",
          }}>
            {/* SOP header */}
            <div style={{
              padding: "12px 18px",
              background: "var(--surface)",
              borderBottom: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}>{sop.title}</span>
                {steps.length > 0 && (
                  <span style={{ fontSize: 11, color: "var(--text-faint)", marginLeft: 10 }}>
                    {done.length}/{steps.length} steps
                  </span>
                )}
              </div>
              {steps.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {/* Progress bar */}
                  <div style={{ width: 80, height: 4, background: "var(--border-2)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 2,
                      width: `${pct}%`,
                      background: pct === 100 ? "#4ade80" : "#60a5fa",
                      transition: "width 0.3s ease",
                    }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: pct === 100 ? "#4ade80" : "var(--text-dim)" }}>
                    {pct}%
                  </span>
                </div>
              )}
            </div>

            {/* Steps or raw content */}
            <div style={{ padding: "14px 18px" }}>
              {steps.length === 0 ? (
                <p style={{ fontSize: 12, color: "var(--text-faint)", lineHeight: 1.6, margin: 0 }}>
                  No numbered steps detected. Format steps as a numbered list (1. 2. 3.) to enable progress tracking.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {steps.map((step, i) => {
                    const isDone = done.includes(i);
                    const key = `${sop.id}-${i}`;
                    const isToggling = toggling === key;
                    return (
                      <button
                        key={i}
                        onClick={() => toggle(sop.id, i)}
                        disabled={isToggling}
                        style={{
                          display: "flex", alignItems: "flex-start", gap: 10,
                          background: isDone ? "rgba(74,222,128,0.04)" : "transparent",
                          border: `1px solid ${isDone ? "rgba(74,222,128,0.15)" : "var(--border)"}`,
                          borderRadius: 8, padding: "9px 12px",
                          cursor: isToggling ? "not-allowed" : "pointer",
                          textAlign: "left", width: "100%",
                          transition: "all 0.15s",
                          opacity: isToggling ? 0.6 : 1,
                        }}
                      >
                        {/* Checkbox */}
                        <div style={{
                          flexShrink: 0, width: 16, height: 16, borderRadius: 4,
                          background: isDone ? "#4ade80" : "var(--bg)",
                          border: `1.5px solid ${isDone ? "#4ade80" : "var(--border-2)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          marginTop: 1,
                        }}>
                          {isDone && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M1.5 5L4 7.5L8.5 2.5" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                          {isToggling && <Loader2 size={8} className="animate-spin" style={{ color: "var(--text-faint)" }} />}
                        </div>

                        {/* Step number + text */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-faint)", marginRight: 6 }}>
                            {i + 1}.
                          </span>
                          <span style={{
                            fontSize: 12, color: isDone ? "var(--text-dim)" : "var(--text-muted)",
                            textDecoration: isDone ? "line-through" : "none",
                            lineHeight: 1.6,
                          }}>
                            {step}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function NotesLog({ accountId }: { accountId: string }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/accounts/${accountId}/notes`)
      .then(r => r.json())
      .then(d => { setNotes(d); setLoading(false); });
  }, [accountId]);

  const submit = async () => {
    if (!content.trim()) return;
    setSaving(true);
    const res = await fetch(`/api/accounts/${accountId}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: content.trim(), author: author.trim() }),
    });
    if (res.ok) {
      const note: Note = await res.json();
      setNotes(prev => [note, ...prev]);
      setContent("");
    }
    setSaving(false);
  };

  return (
    <div>
      {/* Add note */}
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 10, padding: "16px 18px", marginBottom: 20,
      }}>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Add a change log entry, observation, or note…"
          rows={3}
          style={{
            width: "100%", background: "transparent", border: "none",
            color: "var(--text)", fontSize: 13, lineHeight: 1.6,
            resize: "vertical", outline: "none", fontFamily: "inherit",
            boxSizing: "border-box",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
          <input
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="Your name (optional)"
            style={{
              flex: 1, background: "var(--bg)", border: "1px solid var(--border-2)",
              borderRadius: 6, color: "var(--text-muted)", fontSize: 12,
              padding: "5px 10px", outline: "none", fontFamily: "inherit",
            }}
          />
          <button
            onClick={submit}
            disabled={saving || !content.trim()}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "#1d4ed8", border: "none", borderRadius: 6,
              color: "#fff", fontSize: 12, fontWeight: 600,
              padding: "6px 14px", cursor: saving || !content.trim() ? "not-allowed" : "pointer",
              opacity: saving || !content.trim() ? 0.5 : 1,
            }}
          >
            <Send size={11} /> {saving ? "Saving…" : "Add note"}
          </button>
        </div>
      </div>

      {/* Note list */}
      {loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-dim)", fontSize: 13, padding: "20px 0" }}>
          <Loader2 size={14} className="animate-spin" /> Loading…
        </div>
      ) : notes.length === 0 ? (
        <div style={{
          border: "1px dashed var(--border-2)", borderRadius: 10,
          padding: "40px 24px", textAlign: "center",
          color: "var(--text-faint)", fontSize: 13,
        }}>
          No notes yet — add the first one above.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {notes.map(note => (
            <div key={note.id} style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 10, padding: "14px 18px",
            }}>
              <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.65, margin: 0, whiteSpace: "pre-wrap" }}>
                {note.content}
              </p>
              <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
                {note.author && (
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-dim)" }}>{note.author}</span>
                )}
                {note.author && <span style={{ fontSize: 11, color: "var(--border-2)" }}>·</span>}
                <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
                  {new Date(note.createdAt).toLocaleString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                    hour: "numeric", minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface Snapshot {
  id: string;
  createdAt: string;
  governingConstraint: string;
  constraintReason: string;
  scoreMeasurement: number;
  scoreTraffic: number;
  scoreConversion: number;
  scoreFunnel: number;
  scoreEconomics: number;
  actions: Action[];
  bucketSignals?: Record<string, string[]>;
}

interface Action {
  id: string;
  bucket: string;
  title: string;
  description: string;
  impact: string;
  effort: string;
  safeToAutomate: boolean;
  actionType: string;
  status: string;
  isEscalation: boolean;
}

interface Account {
  id: string;
  name: string;
  googleAdsId: string;
  industry: string | null;
  monthlyBudget: number | null;
  currency: string;
  clientContext: string | null;
  targetRoas:         number | null;
  targetCpa:          number | null;
  grossMarginPercent: number | null;
  leadToSaleRate:     number | null;
  landingPageUrl:     string | null;
  country:            string | null;
  businessModel:      string | null;
  monthlyChurnRate:   number | null;
}

// ─── Client Context Panel ─────────────────────────────────────────────────────

function ClientContextPanel({
  accountId,
  initial,
  onSaved,
}: {
  accountId: string;
  initial: string | null;
  onSaved: (value: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initial ?? "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await fetch(`/api/accounts/${accountId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientContext: value }),
    });
    onSaved(value);
    setSaving(false);
    setEditing(false);
  };

  const cancel = () => {
    setValue(initial ?? "");
    setEditing(false);
  };

  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 12, padding: "16px 20px", marginBottom: 20,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: editing || value ? 10 : 0 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", color: "var(--text-dim)" }}>
          Account Brief · AI Context
        </span>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "transparent", border: "none", cursor: "pointer",
              color: "var(--text-faint)", fontSize: 11, padding: "2px 4px",
            }}
          >
            <Pencil size={10} /> {value ? "Edit" : "Add brief"}
          </button>
        )}
        {editing && (
          <button
            onClick={cancel}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-faint)", display: "flex" }}
          >
            <X size={12} />
          </button>
        )}
      </div>

      {!editing && value && (
        <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7, whiteSpace: "pre-wrap", margin: 0 }}>
          {value}
        </p>
      )}

      {!editing && !value && (
        <p style={{ fontSize: 12, color: "var(--text-faint)", lineHeight: 1.7, margin: 0 }}>
          No brief yet — add context so the AI gives better advice: what the client sells, landing page URL, target CPA/ROAS, key USPs.
        </p>
      )}

      {editing && (
        <>
          <textarea
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder={"What does this client sell?\nLanding page URL?\nTarget CPA / ROAS?\nKey USPs and differentiators?\nSeasonal or promotional context?"}
            rows={5}
            style={{
              width: "100%", background: "var(--bg)", border: "1px solid var(--border-2)",
              borderRadius: 8, color: "var(--text)", fontSize: 12, lineHeight: 1.7,
              padding: "10px 12px", resize: "vertical", outline: "none", fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 10, justifyContent: "flex-end" }}>
            <button
              onClick={cancel}
              style={{
                background: "transparent", border: "1px solid var(--border-2)",
                borderRadius: 6, color: "var(--text-dim)", fontSize: 11,
                padding: "5px 12px", cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving}
              style={{
                background: "#1d4ed8", border: "none", borderRadius: 6,
                color: "#fff", fontSize: 11, fontWeight: 600,
                padding: "5px 14px", cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Account Targets Panel ────────────────────────────────────────────────────
// Ecommerce-focused. Values override Google Ads API data and feed accurate
// ECONOMICS scoring.

interface AccountTargets {
  targetRoas:         number | null;
  targetCpa:          number | null;
  grossMarginPercent: number | null;
  landingPageUrl:     string | null;
  country:            string | null;
  businessModel:      string | null;
  monthlyChurnRate:   number | null;
}

function AccountTargetsPanel({
  accountId,
  currency,
  initial,
  onSaved,
}: {
  accountId: string;
  currency: string;
  initial: AccountTargets;
  onSaved: (v: AccountTargets) => void;
}) {
  const [editing, setEditing] = useState(false);
  const initVals = () => ({
    targetRoas:         initial.targetRoas         != null ? String(initial.targetRoas)                          : "",
    targetCpa:          initial.targetCpa          != null ? String(initial.targetCpa)                           : "",
    grossMarginPercent: initial.grossMarginPercent != null ? String(Math.round(initial.grossMarginPercent * 100)) : "",
    landingPageUrl:     initial.landingPageUrl     ?? "",
    country:            initial.country            ?? "",
    businessModel:      initial.businessModel      ?? "",
    monthlyChurnRate:   initial.monthlyChurnRate   != null ? String(Math.round(initial.monthlyChurnRate * 100))   : "",
  });
  const [vals, setVals] = useState(initVals);
  const [saving, setSaving] = useState(false);

  const currSym = currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$";

  const hasAny = initial.targetRoas != null || initial.targetCpa != null || initial.grossMarginPercent != null
    || !!initial.landingPageUrl || !!initial.country || !!initial.businessModel || initial.monthlyChurnRate != null;

  const save = async () => {
    setSaving(true);
    const body: AccountTargets = {
      targetRoas:         vals.targetRoas         !== "" ? parseFloat(vals.targetRoas)         : null,
      targetCpa:          vals.targetCpa          !== "" ? parseFloat(vals.targetCpa)          : null,
      grossMarginPercent: vals.grossMarginPercent !== "" ? parseFloat(vals.grossMarginPercent) / 100 : null,
      landingPageUrl:     vals.landingPageUrl.trim() || null,
      country:            vals.country.trim().toUpperCase() || null,
      businessModel:      vals.businessModel || null,
      monthlyChurnRate:   vals.monthlyChurnRate !== "" ? parseFloat(vals.monthlyChurnRate) / 100 : null,
    };
    await fetch(`/api/accounts/${accountId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    onSaved(body);
    setSaving(false);
    setEditing(false);
  };

  const cancel = () => { setVals(initVals()); setEditing(false); };

  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 12, padding: "16px 20px", marginBottom: 20,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: editing || hasAny ? 12 : 0 }}>
        <div>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", color: "var(--text-dim)" }}>
            Account Targets
          </span>
          <span style={{ fontSize: 11, color: "var(--text-faint)", marginLeft: 8 }}>
            feeds ECONOMICS scoring
          </span>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "transparent", border: "none", cursor: "pointer",
              color: hasAny ? "var(--text-faint)" : "#f97316", fontSize: 11, padding: "2px 4px",
            }}
          >
            <Pencil size={10} /> {hasAny ? "Edit" : "Set targets"}
          </button>
        )}
        {editing && (
          <button onClick={cancel} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-faint)", display: "flex" }}>
            <X size={12} />
          </button>
        )}
      </div>

      {!editing && !hasAny && (
        <p style={{ fontSize: 12, color: "var(--text-faint)", lineHeight: 1.6, margin: 0 }}>
          No targets set — FUNNEL & ECONOMICS scores will be inaccurate. Set target ROAS and gross margin to get meaningful numbers.
        </p>
      )}

      {!editing && hasAny && (
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {initial.targetRoas != null && (
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-2)", letterSpacing: "-0.5px", lineHeight: 1 }}>{initial.targetRoas}x</div>
              <div style={{ fontSize: 10, color: "var(--text-faint)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.4px" }}>Target ROAS</div>
            </div>
          )}
          {initial.targetCpa != null && (
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-2)", letterSpacing: "-0.5px", lineHeight: 1 }}>{currSym}{initial.targetCpa}</div>
              <div style={{ fontSize: 10, color: "var(--text-faint)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.4px" }}>Target CPA</div>
            </div>
          )}
          {initial.grossMarginPercent != null && (
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-2)", letterSpacing: "-0.5px", lineHeight: 1 }}>{Math.round(initial.grossMarginPercent * 100)}%</div>
              <div style={{ fontSize: 10, color: "var(--text-faint)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.4px" }}>Gross Margin</div>
            </div>
          )}
          {initial.grossMarginPercent != null && (
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-2)", letterSpacing: "-0.5px", lineHeight: 1 }}>
                {(1 / initial.grossMarginPercent).toFixed(1)}x
              </div>
              <div style={{ fontSize: 10, color: "var(--text-faint)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.4px" }}>Break-even ROAS</div>
            </div>
          )}
          {initial.country && (
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-2)", letterSpacing: "-0.5px", lineHeight: 1 }}>{initial.country}</div>
              <div style={{ fontSize: 10, color: "var(--text-faint)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.4px" }}>Market</div>
            </div>
          )}
          {initial.businessModel && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-2)", lineHeight: 1 }}>{initial.businessModel}</div>
              <div style={{ fontSize: 10, color: "var(--text-faint)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.4px" }}>Business model</div>
            </div>
          )}
          {initial.monthlyChurnRate != null && (
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-2)", letterSpacing: "-0.5px", lineHeight: 1 }}>{Math.round(initial.monthlyChurnRate * 100)}%/mo</div>
              <div style={{ fontSize: 10, color: "var(--text-faint)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.4px" }}>Churn rate</div>
            </div>
          )}
          {initial.landingPageUrl && (
            <div style={{ marginLeft: "auto" }}>
              <a
                href={initial.landingPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 12, color: "#60a5fa", textDecoration: "none", wordBreak: "break-all" }}
              >
                {initial.landingPageUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </a>
              <div style={{ fontSize: 10, color: "var(--text-faint)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.4px" }}>Landing page</div>
            </div>
          )}
        </div>
      )}

      {editing && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 10, color: "var(--text-faint)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" }}>Target ROAS</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 7, padding: "6px 10px" }}>
                <input
                  type="number" step="0.1" min="0" placeholder="e.g. 4.0"
                  value={vals.targetRoas}
                  onChange={e => setVals(v => ({ ...v, targetRoas: e.target.value }))}
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--text)", fontSize: 13, fontFamily: "inherit", minWidth: 0 }}
                />
                <span style={{ fontSize: 11, color: "var(--text-faint)" }}>x</span>
              </div>
              <span style={{ fontSize: 10, color: "var(--text-very-dim)" }}>Overrides campaign targets</span>
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 10, color: "var(--text-faint)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" }}>Target CPA</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 7, padding: "6px 10px" }}>
                <span style={{ fontSize: 11, color: "var(--text-faint)" }}>{currSym}</span>
                <input
                  type="number" step="1" min="0" placeholder="e.g. 25"
                  value={vals.targetCpa}
                  onChange={e => setVals(v => ({ ...v, targetCpa: e.target.value }))}
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--text)", fontSize: 13, fontFamily: "inherit", minWidth: 0 }}
                />
              </div>
              <span style={{ fontSize: 10, color: "var(--text-very-dim)" }}>For lead-gen accounts</span>
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 10, color: "var(--text-faint)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" }}>Gross Margin</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 7, padding: "6px 10px" }}>
                <input
                  type="number" step="1" min="0" max="100" placeholder="e.g. 38"
                  value={vals.grossMarginPercent}
                  onChange={e => setVals(v => ({ ...v, grossMarginPercent: e.target.value }))}
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--text)", fontSize: 13, fontFamily: "inherit", minWidth: 0 }}
                />
                <span style={{ fontSize: 11, color: "var(--text-faint)" }}>%</span>
              </div>
              <span style={{ fontSize: 10, color: "var(--text-very-dim)" }}>
                {vals.grossMarginPercent ? `Break-even ROAS: ${(100 / parseFloat(vals.grossMarginPercent || "1")).toFixed(1)}x` : "Required for break-even ROAS"}
              </span>
            </label>
          </div>

          {/* Market + business model */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 4 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 10, color: "var(--text-faint)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" }}>Market (country)</span>
              <div style={{ display: "flex", alignItems: "center", background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 7, padding: "6px 10px" }}>
                <input
                  type="text" maxLength={2} placeholder="e.g. PL, DE, GB"
                  value={vals.country}
                  onChange={e => setVals(v => ({ ...v, country: e.target.value.toUpperCase() }))}
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--text)", fontSize: 13, fontFamily: "inherit", textTransform: "uppercase" }}
                />
              </div>
              <span style={{ fontSize: 10, color: "var(--text-very-dim)" }}>Auto-detected from account timezone if blank</span>
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 10, color: "var(--text-faint)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" }}>Business Model</span>
              <select
                value={vals.businessModel}
                onChange={e => setVals(v => ({ ...v, businessModel: e.target.value }))}
                style={{ background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 7, padding: "7px 10px", color: vals.businessModel ? "var(--text)" : "var(--text-faint)", fontSize: 13, fontFamily: "inherit", outline: "none" }}
              >
                <option value="">— not set —</option>
                <option value="dtc">DTC (own brand)</option>
                <option value="dropship">Dropship</option>
                <option value="subscription">Subscription</option>
                <option value="marketplace">Marketplace seller</option>
                <option value="service">Service business</option>
                <option value="lead_gen">Lead generation</option>
              </select>
              <span style={{ fontSize: 10, color: "var(--text-very-dim)" }}>Adjusts CVR benchmarks</span>
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 10, color: "var(--text-faint)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" }}>Monthly Churn</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 7, padding: "6px 10px", opacity: vals.businessModel === "subscription" ? 1 : 0.4 }}>
                <input
                  type="number" step="0.5" min="0" max="100" placeholder="e.g. 5"
                  disabled={vals.businessModel !== "subscription"}
                  value={vals.monthlyChurnRate}
                  onChange={e => setVals(v => ({ ...v, monthlyChurnRate: e.target.value }))}
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--text)", fontSize: 13, fontFamily: "inherit", minWidth: 0 }}
                />
                <span style={{ fontSize: 11, color: "var(--text-faint)" }}>%/mo</span>
              </div>
              <span style={{ fontSize: 10, color: "var(--text-very-dim)" }}>Subscription only — used for LTV</span>
            </label>
          </div>

          {/* Landing page URL — full width */}
          <label style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
            <span style={{ fontSize: 10, color: "var(--text-faint)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" }}>Landing Page URL</span>
            <div style={{ display: "flex", alignItems: "center", background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 7, padding: "6px 10px" }}>
              <input
                type="url"
                placeholder="https://www.example.com/landing"
                value={vals.landingPageUrl}
                onChange={e => setVals(v => ({ ...v, landingPageUrl: e.target.value }))}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--text)", fontSize: 13, fontFamily: "inherit" }}
              />
            </div>
            <span style={{ fontSize: 10, color: "var(--text-very-dim)" }}>Scraped automatically for CRO briefs</span>
          </label>

          <div style={{ display: "flex", gap: 8, marginTop: 14, justifyContent: "flex-end", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "var(--text-faint)", marginRight: "auto" }}>
              Rescore after saving to apply
            </span>
            <button
              onClick={cancel}
              style={{ background: "transparent", border: "1px solid var(--border-2)", borderRadius: 6, color: "var(--text-dim)", fontSize: 11, padding: "5px 12px", cursor: "pointer" }}
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving}
              style={{ background: "#1d4ed8", border: "none", borderRadius: 6, color: "#fff", fontSize: 11, fontWeight: 600, padding: "5px 14px", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1 }}
            >
              {saving ? "Saving…" : "Save targets"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── AI Intelligence Panel ────────────────────────────────────────────────────

function IntelligencePanel({ accountId }: { accountId: string }) {
  const [text, setText]       = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const generate = async () => {
    if (loading) return;
    setLoading(true);
    setText("");
    setDone(false);
    setError(null);

    try {
      const res = await fetch(`/api/accounts/${accountId}/intelligence`, { method: "POST" });
      if (!res.ok || !res.body) throw new Error("Failed to generate");

      const reader = res.body.getReader();
      const dec    = new TextDecoder();

      while (true) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;
        for (const line of dec.decode(value).split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const payload = JSON.parse(line.slice(6));
          if (payload.error) { setError(payload.error); break; }
          if (payload.done)  { setDone(true); break; }
          if (payload.text)  setText(prev => prev + payload.text);
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 12, padding: "16px 20px", marginBottom: 20,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: text || loading ? 12 : 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Sparkles size={13} style={{ color: "#c084fc" }} />
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", color: "var(--text-dim)" }}>
            AI Intelligence
          </span>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            background: done ? "transparent" : "rgba(192,132,252,0.1)",
            border: "1px solid rgba(192,132,252,0.25)",
            borderRadius: 7, padding: "5px 12px",
            fontSize: 11, fontWeight: 500, color: "#c084fc",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading
            ? <><Loader2 size={11} className="animate-spin" /> Analysing…</>
            : done
              ? <><Sparkles size={11} /> Regenerate</>
              : <><Sparkles size={11} /> Generate insight</>}
        </button>
      </div>

      {error && (
        <p style={{ fontSize: 12, color: "#f87171", margin: 0 }}>{error}</p>
      )}

      {!text && !loading && !error && (
        <p style={{ fontSize: 12, color: "var(--text-faint)", lineHeight: 1.6, margin: 0 }}>
          Generate a contextual analysis of this account — what's actually happening, why, and what to watch.
        </p>
      )}

      {(text || loading) && !error && (
        <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.75, margin: 0, whiteSpace: "pre-wrap" }}>
          {text}
          {loading && !done && <span style={{ opacity: 0.35 }}>▍</span>}
        </p>
      )}
    </div>
  );
}

// ─── Landing Page AI Analysis Panel ──────────────────────────────────────────

interface LandingAnalysis {
  score: number;
  mobileReady: boolean;
  strengths: string[];
  issues: { severity: "high" | "medium" | "low"; text: string }[];
  topRecommendation: string;
}

function LandingAnalysisPanel({ accountId, landingPageUrl }: { accountId: string; landingPageUrl: string | null }) {
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<LandingAnalysis | null>(null);
  const [error,   setError]   = useState<string | null>(null);

  if (!landingPageUrl) return null;

  const run = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res  = await fetch(`/api/accounts/${accountId}/landing-analysis`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Analysis failed"); return; }
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s: number) => s >= 75 ? "#4ade80" : s >= 50 ? "#fbbf24" : "#f87171";
  const scoreLabel = (s: number) => s >= 75 ? "Good" : s >= 50 ? "Needs work" : "Poor";
  const sevColor = (sev: string) => sev === "high" ? "#f87171" : sev === "medium" ? "#fbbf24" : "var(--text-dim)";

  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 12, padding: "16px 20px", marginBottom: 20,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Brain size={13} style={{ color: "var(--text-dim)" }} />
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", color: "var(--text-dim)" }}>
            Landing Page Analysis
          </span>
          <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
            AI · CRO review
          </span>
        </div>
        <button
          onClick={run}
          disabled={loading}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            background: "transparent", border: "1px solid var(--border-2)",
            borderRadius: 6, padding: "4px 10px",
            fontSize: 11, fontWeight: 500,
            color: loading ? "var(--text-faint)" : "var(--text-muted)",
            cursor: loading ? "default" : "pointer",
          }}
        >
          {loading
            ? <><Loader2 size={11} className="animate-spin" /> Analysing…</>
            : <><Sparkles size={11} /> {result ? "Re-analyse" : "Analyse"}</>}
        </button>
      </div>

      {!result && !error && !loading && (
        <p style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 10, lineHeight: 1.5 }}>
          Claude fetches your landing page and reviews it for conversion readiness — value prop, CTA, trust signals, mobile experience. Takes ~10s.
        </p>
      )}

      {error && <p style={{ fontSize: 12, color: "#f87171", marginTop: 10 }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 14 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 14 }}>
            <span style={{ fontSize: 40, fontWeight: 800, lineHeight: 1, letterSpacing: "-2px", color: scoreColor(result.score) }}>
              {result.score}
            </span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: scoreColor(result.score) }}>{scoreLabel(result.score)}</div>
              <div style={{ fontSize: 10, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                CRO score · {result.mobileReady ? "✓ Mobile ready" : "✗ Mobile issues"}
              </div>
            </div>
          </div>

          {result.issues.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 6 }}>Issues</div>
              {result.issues.map((issue, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", paddingBottom: 5, fontSize: 12 }}>
                  <span style={{ color: sevColor(issue.severity), fontWeight: 700, flexShrink: 0, marginTop: 1 }}>
                    {issue.severity === "high" ? "●" : issue.severity === "medium" ? "◐" : "○"}
                  </span>
                  <span style={{ color: "var(--text-dim)", lineHeight: 1.4 }}>{issue.text}</span>
                </div>
              ))}
            </div>
          )}

          {result.strengths.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 6 }}>Strengths</div>
              {result.strengths.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 8, paddingBottom: 4, fontSize: 12 }}>
                  <span style={{ color: "#4ade80" }}>✓</span>
                  <span style={{ color: "var(--text-dim)" }}>{s}</span>
                </div>
              ))}
            </div>
          )}

          {result.topRecommendation && (
            <div style={{
              background: "rgba(192,132,252,0.06)", border: "1px solid rgba(192,132,252,0.2)",
              borderRadius: 8, padding: "10px 12px",
            }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#c084fc", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 4 }}>
                Top recommendation
              </div>
              <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.55, margin: 0 }}>{result.topRecommendation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── PDP Audit Panel ──────────────────────────────────────────────────────────

interface PDPAnalysis {
  score: number;
  checks: { area: string; status: "good" | "warning" | "missing"; note: string }[];
  issues: { severity: "high" | "medium" | "low"; text: string }[];
  topRecommendation: string;
}

function PDPAnalysisPanel({ accountId }: { accountId: string }) {
  const [url,     setUrl]     = useState("");
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<PDPAnalysis | null>(null);
  const [error,   setError]   = useState<string | null>(null);

  const run = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res  = await fetch(`/api/accounts/${accountId}/pdp-analysis`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Audit failed"); return; }
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s: number) => s >= 75 ? "#4ade80" : s >= 50 ? "#fbbf24" : "#f87171";
  const scoreLabel = (s: number) => s >= 75 ? "Good" : s >= 50 ? "Needs work" : "Poor";
  const sevColor   = (sev: string) => sev === "high" ? "#f87171" : sev === "medium" ? "#fbbf24" : "var(--text-dim)";
  const statusIcon = (st: string) =>
    st === "good" ? { icon: "✓", color: "#4ade80" }
    : st === "warning" ? { icon: "!", color: "#fbbf24" }
    : { icon: "✗", color: "#f87171" };

  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 12, padding: "16px 20px", marginBottom: 20,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Sparkles size={13} style={{ color: "var(--text-dim)" }} />
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", color: "var(--text-dim)" }}>
          Product Page Audit
        </span>
        <span style={{ fontSize: 11, color: "var(--text-faint)" }}>AI · PDP review</span>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="url"
          placeholder="https://store.com/products/example"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !loading && run()}
          style={{
            flex: 1, background: "var(--surface-2)", border: "1px solid var(--border-2)",
            borderRadius: 7, padding: "7px 11px",
            fontSize: 12, color: "var(--text)", fontFamily: "inherit", outline: "none",
          }}
        />
        <button
          onClick={run}
          disabled={loading || !url.trim()}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            background: "transparent", border: "1px solid var(--border-2)",
            borderRadius: 7, padding: "7px 12px",
            fontSize: 11, fontWeight: 500,
            color: loading || !url.trim() ? "var(--text-faint)" : "var(--text-muted)",
            cursor: loading || !url.trim() ? "default" : "pointer", flexShrink: 0,
          }}
        >
          {loading ? <><Loader2 size={11} className="animate-spin" /> Auditing…</> : "Audit"}
        </button>
      </div>

      {error && <p style={{ fontSize: 12, color: "#f87171", marginTop: 10 }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 16 }}>
          {/* Score */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 40, fontWeight: 800, lineHeight: 1, letterSpacing: "-2px", color: scoreColor(result.score) }}>
              {result.score}
            </span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: scoreColor(result.score) }}>{scoreLabel(result.score)}</div>
              <div style={{ fontSize: 10, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.4px" }}>PDP score</div>
            </div>
          </div>

          {/* Area checklist */}
          {result.checks.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>
                Area checks
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px" }}>
                {result.checks.map((c, i) => {
                  const { icon, color } = statusIcon(c.status);
                  return (
                    <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start", paddingBottom: 4 }}>
                      <span style={{ color, fontWeight: 700, fontSize: 11, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)" }}>{c.area}</div>
                        <div style={{ fontSize: 10, color: "var(--text-faint)", lineHeight: 1.4 }}>{c.note}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Issues */}
          {result.issues.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 6 }}>
                Issues to fix
              </div>
              {result.issues.map((issue, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", paddingBottom: 5, fontSize: 12 }}>
                  <span style={{ color: sevColor(issue.severity), fontWeight: 700, flexShrink: 0, marginTop: 1 }}>
                    {issue.severity === "high" ? "●" : issue.severity === "medium" ? "◐" : "○"}
                  </span>
                  <span style={{ color: "var(--text-dim)", lineHeight: 1.4 }}>{issue.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* Top recommendation */}
          {result.topRecommendation && (
            <div style={{
              background: "rgba(192,132,252,0.06)", border: "1px solid rgba(192,132,252,0.2)",
              borderRadius: 8, padding: "10px 12px",
            }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#c084fc", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 4 }}>
                Top recommendation
              </div>
              <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.55, margin: 0 }}>{result.topRecommendation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function buildBuckets(snap: Snapshot) {
  const sigs = snap.bucketSignals ?? {};
  return [
    { bucket: "MEASUREMENT", score: snap.scoreMeasurement, isGoverning: snap.governingConstraint === "MEASUREMENT", signals: sigs["MEASUREMENT"] ?? [] },
    { bucket: "TRAFFIC",     score: snap.scoreTraffic,     isGoverning: snap.governingConstraint === "TRAFFIC",     signals: sigs["TRAFFIC"]     ?? [] },
    { bucket: "CONVERSION",  score: snap.scoreConversion,  isGoverning: snap.governingConstraint === "CONVERSION",  signals: sigs["CONVERSION"]  ?? [] },
    { bucket: "FUNNEL",      score: snap.scoreFunnel,      isGoverning: snap.governingConstraint === "FUNNEL",      signals: sigs["FUNNEL"]      ?? [] },
    { bucket: "ECONOMICS",   score: snap.scoreEconomics,   isGoverning: snap.governingConstraint === "ECONOMICS",   signals: sigs["ECONOMICS"]   ?? [] },
  ];
}

const CONSTRAINT_ACCENT: Record<string, string> = {
  MEASUREMENT: "#c084fc",
  TRAFFIC:     "#60a5fa",
  CONVERSION:  "#fb923c",
  FUNNEL:      "#fbbf24",
  ECONOMICS:   "#4ade80",
};

const CONSTRAINT_GLOW: Record<string, string> = {
  MEASUREMENT: "rgba(192, 132, 252, 0.06)",
  TRAFFIC:     "rgba(96, 165, 250, 0.06)",
  CONVERSION:  "rgba(251, 146, 60, 0.06)",
  FUNNEL:      "rgba(251, 191, 36, 0.06)",
  ECONOMICS:   "rgba(74, 222, 128, 0.06)",
};

export default function AccountPage() {
  const { id } = useParams<{ id: string }>();
  const [account, setAccount] = useState<Account | null>(null);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [actions, setActions] = useState<Action[]>([]);
  const [tab, setTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  const [rescoring, setRescoring] = useState(false);
  const [rescoreError, setRescoreError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [acctRes, snapRes] = await Promise.all([
        fetch(`/api/accounts`),
        fetch(`/api/accounts/${id}/snapshot`),
      ]);
      if (!acctRes.ok) throw new Error("Failed to load account");
      const accounts: Account[] = await acctRes.json();
      const acct = accounts.find((a) => a.id === id);
      if (!acct) throw new Error("Account not found");
      setAccount(acct);
      if (snapRes.ok) {
        const snap: Snapshot = await snapRes.json();
        setSnapshot(snap);
        setActions(snap.actions ?? []);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const rescore = async () => {
    setRescoring(true);
    setRescoreError(null);
    try {
      const res = await fetch(`/api/accounts/${id}/snapshot?source=google-ads`, { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        setRescoreError(body.error ?? `Scoring failed (${res.status})`);
        return;
      }
      await load();
    } catch (e) {
      setRescoreError(e instanceof Error ? e.message : "Network error");
    } finally {
      setRescoring(false);
    }
  };

  const handleStatusChange = async (actionId: string, status: "APPROVED" | "DISMISSED") => {
    await fetch(`/api/actions/${actionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setActions((prev) => prev.map((a) => (a.id === actionId ? { ...a, status } : a)));
  };

  const handleExecute = async (actionId: string) => {
    const res = await fetch(`/api/actions/${actionId}`, { method: "POST" });
    if (res.ok) {
      const updated: Action = await res.json();
      setActions((prev) => prev.map((a) => (a.id === actionId ? updated : a)));
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: "var(--bg)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--text-dim)",
      }}>
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  }

  if (error || !account) {
    return (
      <div style={{
        minHeight: "100vh", background: "var(--bg)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16,
      }}>
        <p style={{ color: "#f87171", fontSize: 14 }}>{error ?? "Account not found"}</p>
        <Link href="/" style={{ color: "#3b82f6", fontSize: 13, textDecoration: "none" }}>← Back to overview</Link>
      </div>
    );
  }

  const buckets       = snapshot ? buildBuckets(snapshot) : [];
  const constraint    = snapshot?.governingConstraint ?? "MEASUREMENT";
  const label         = BUCKET_LABELS[constraint as keyof typeof BUCKET_LABELS] ?? constraint;
  const accent        = CONSTRAINT_ACCENT[constraint] ?? "#60a5fa";
  const glow          = CONSTRAINT_GLOW[constraint] ?? "rgba(96,165,250,0.06)";
  const pendingActions  = actions.filter((a) => a.status === "PENDING");
  const automatable     = pendingActions.filter((a) => a.safeToAutomate);

  const TABS: { key: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { key: "overview",      label: "Overview",     icon: <BarChart2    size={14} /> },
    { key: "actions",       label: "Actions",      icon: <ListChecks   size={14} />, badge: pendingActions.length },
    { key: "products",      label: "Products",     icon: <Package      size={14} /> },
    { key: "search-terms",  label: "Search terms", icon: <Search       size={14} /> },
    { key: "playbook",      label: "Playbook",     icon: <BookOpen     size={14} /> },
    { key: "chat",          label: "AI Advisor",   icon: <MessageSquare size={14} /> },
    { key: "sops",          label: "SOPs",         icon: <CheckSquare   size={14} /> },
    { key: "notes",         label: "Change log",   icon: <ClipboardList size={14} /> },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>

      {/* Top nav */}
      <header style={{
        borderBottom: "1px solid var(--border)", padding: "0 32px", height: 52,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0,
        background: "var(--header-bg)", backdropFilter: "blur(12px)", zIndex: 10,
      }}>
        <Link href="/" style={{
          display: "flex", alignItems: "center", gap: 6,
          color: "var(--text-dim)", fontSize: 13, textDecoration: "none",
          transition: "color 0.15s",
        }}
        onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)"}
        onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-dim)"}
        >
          <ArrowLeft size={14} />
          All accounts
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={rescore}
            disabled={rescoring}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "transparent", border: "1px solid var(--border-2)",
              borderRadius: 7, color: "var(--text-dim)", fontSize: 12, fontWeight: 500,
              padding: "6px 12px", cursor: rescoring ? "not-allowed" : "pointer",
              opacity: rescoring ? 0.5 : 1,
            }}
          >
            {rescoring ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
            {rescoring ? "Scoring…" : "Rescore"}
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* Constraint hero */}
      {snapshot && (
        <div style={{
          padding: "32px 32px 28px",
          background: glow,
          borderBottom: "1px solid var(--border)",
        }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24 }}>
              <div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 6 }}>{account.name} · {account.googleAdsId}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", color: "var(--text)" }}>
                    Governing Constraint
                  </h1>
                  <span style={{
                    fontSize: 12, fontWeight: 600, letterSpacing: "0.4px",
                    background: `rgba(${accent.slice(1).match(/../g)!.map(h => parseInt(h, 16)).join(",")}, 0.15)`,
                    color: accent,
                    padding: "3px 10px", borderRadius: 20,
                  }}>
                    {label}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 560, lineHeight: 1.6 }}>
                  {snapshot.constraintReason}
                </p>
              </div>

              {automatable.length > 0 && (
                <div style={{
                  flexShrink: 0,
                  background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
                  borderRadius: 10, padding: "10px 16px", textAlign: "center",
                }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#60a5fa" }}>{automatable.length}</div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)" }}>ready to run</div>
                </div>
              )}
            </div>

            <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 12 }}>
              Last scored {new Date(snapshot.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ borderBottom: "1px solid var(--border)", padding: "0 32px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", gap: 0 }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "14px 16px", fontSize: 13, fontWeight: 500,
                borderTop: "none", borderLeft: "none", borderRight: "none",
                borderBottom: `2px solid ${tab === t.key ? accent : "transparent"}`,
                color: tab === t.key ? "var(--text-2)" : "var(--text-dim)",
                background: "transparent",
                cursor: "pointer", transition: "color 0.15s",
                marginBottom: -1,
              }}
            >
              {t.icon}
              {t.label}
              {t.badge !== undefined && t.badge > 0 && (
                <span style={{
                  background: "rgba(59,130,246,0.15)", color: "#60a5fa",
                  borderRadius: 20, padding: "1px 7px", fontSize: 10, fontWeight: 700,
                }}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 32px" }}>

        {tab === "overview" && (
          <>
            {rescoreError && (
              <div style={{
                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 10, padding: "12px 16px", marginBottom: 20,
                fontSize: 13, color: "#ef4444",
              }}>
                <strong>Scoring failed:</strong> {rescoreError}
              </div>
            )}
            {!snapshot ? (
              <div style={{
                border: "1px dashed var(--border-2)", borderRadius: 14,
                padding: "60px 32px", textAlign: "center",
              }}>
                <p style={{ color: "var(--text-dim)", fontSize: 14, marginBottom: 20 }}>
                  No score yet — pull live data from Google Ads to get started.
                </p>
                <button
                  onClick={rescore}
                  disabled={rescoring}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "#1d4ed8", border: "none", borderRadius: 8,
                    color: "#fff", fontSize: 13, fontWeight: 600,
                    padding: "10px 22px", cursor: rescoring ? "not-allowed" : "pointer",
                    opacity: rescoring ? 0.6 : 1,
                  }}
                >
                  {rescoring ? <><Loader2 size={13} className="animate-spin" /> Scoring…</> : <><RefreshCw size={13} /> Score this account</>}
                </button>
              </div>
            ) : (
              <>
                {/* Account Targets — feeds ECONOMICS scoring */}
                <AccountTargetsPanel
                  accountId={id}
                  currency={account.currency}
                  initial={{
                    targetRoas:         account.targetRoas,
                    targetCpa:          account.targetCpa,
                    grossMarginPercent: account.grossMarginPercent,
                    landingPageUrl:     account.landingPageUrl,
                    country:            account.country,
                    businessModel:      account.businessModel,
                    monthlyChurnRate:   account.monthlyChurnRate,
                  }}
                  onSaved={(v) => setAccount(prev => prev ? { ...prev, ...v } : prev)}
                />

                {/* Account Brief — feeds AI context */}
                <ClientContextPanel
                  accountId={id}
                  initial={account.clientContext}
                  onSaved={(v) => setAccount(prev => prev ? { ...prev, clientContext: v } : prev)}
                />

                {/* AI Intelligence Brief */}
                <IntelligencePanel accountId={id} />

                <div style={{ marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", color: "var(--text-dim)" }}>
                    Bucket health
                  </span>
                </div>
                {/* Landing page AI CRO review */}
                <LandingAnalysisPanel accountId={id} landingPageUrl={account.landingPageUrl ?? null} />

                {/* Product page AI audit */}
                <PDPAnalysisPanel accountId={id} />

                <ScoreBuckets buckets={buckets} accountId={id} />

                <ScoreHistory accountId={id} governingConstraint={constraint} />

                <div style={{
                  background: "var(--surface)", border: "1px solid var(--surface-3)", borderRadius: 12,
                  padding: "20px 22px", marginTop: 20,
                }}>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7 }}>
                    <strong style={{ color: "var(--text-2)" }}>{label}</strong> is your governing constraint —
                    the single bottleneck blocking growth. Fix this before anything downstream.
                    Go to the <strong style={{ color: "var(--text-2)" }}>Actions</strong> tab for prioritized moves,
                    or use the <strong style={{ color: "var(--text-2)" }}>AI Advisor</strong> to think it through.
                  </p>
                </div>
              </>
            )}
          </>
        )}

        {tab === "actions" && (
          <>
            <div style={{ marginBottom: 18, display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", color: "var(--text-dim)" }}>
                Recommended actions
              </span>
              <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
                Governing constraint first · ⚡ = safe to automate · ⚠ = requires client
              </span>
            </div>
            <ActionList
              actions={actions}
              accountId={id}
              onTabChange={(t) => setTab(t as Tab)}
              onStatusChange={handleStatusChange}
              onExecute={handleExecute}
            />
          </>
        )}

        {tab === "products" && (
          <>
            <div style={{ marginBottom: 16, display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", color: "var(--text-dim)" }}>
                Product performance — last 30 days
              </span>
              <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
                Shopping &amp; Performance Max · sorted by revenue
              </span>
            </div>
            <ProductPerformance accountId={id} currency={account.currency} />
          </>
        )}

        {tab === "search-terms" && (
          <>
            <div style={{ marginBottom: 16, display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", color: "var(--text-dim)" }}>
                Search term report — last 90 days
              </span>
              <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
                Exclude = 0 conv. + {">"}€30 spent · Watch = 0 conv. + €5–30 spent
              </span>
            </div>
            <SearchTermReport accountId={id} />
          </>
        )}

        {tab === "playbook" && (
          <PlaybookView
            accountId={id}
            accountName={account.name}
            hasSnapshot={!!snapshot}
          />
        )}

        {tab === "chat" && snapshot && (
          <div style={{
            height: 580, borderRadius: 14, border: "1px solid var(--border)",
            background: "var(--bg-deep)", overflow: "hidden",
          }}>
            <ChatAssistant
              accountId={id}
              constraintBucket={label}
              constraintReason={snapshot.constraintReason}
            />
          </div>
        )}

        {tab === "chat" && !snapshot && (
          <div style={{
            border: "1px dashed var(--border-2)", borderRadius: 14,
            padding: "60px 32px", textAlign: "center", color: "var(--text-dim)", fontSize: 13,
          }}>
            Run a constraint score first to unlock the advisor.
          </div>
        )}

        {tab === "sops" && (
          <>
            <div style={{ marginBottom: 18, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", color: "var(--text-dim)" }}>
                  SOP Progress
                </span>
                <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
                  Check off steps as you complete them — progress is saved per account
                </span>
              </div>
              <a
                href="/sops"
                style={{ fontSize: 11, color: "#60a5fa", textDecoration: "none" }}
              >
                Manage SOPs →
              </a>
            </div>
            <SopChecklist accountId={id} />
          </>
        )}

        {tab === "notes" && (
          <>
            <div style={{ marginBottom: 18, display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", color: "var(--text-dim)" }}>
                Change log
              </span>
              <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
                Internal notes, observations, and change history
              </span>
            </div>
            <NotesLog accountId={id} />
          </>
        )}
      </div>
    </div>
  );
}
