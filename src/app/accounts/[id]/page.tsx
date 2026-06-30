"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RefreshCw, MessageSquare, ListChecks, BarChart2, Loader2, Search, BookOpen, ClipboardList, Send, Pencil, X, CheckSquare, Sparkles, Package, Brain, FlaskConical, Zap, Copy, Check, Users, Wand2, FileText, BarChart } from "lucide-react";
import { ScoreBuckets } from "@/components/ScoreBuckets";
import { ScoreHistory } from "@/components/ScoreHistory";
import { ActionList } from "@/components/ActionList";
import { AccountSetupWizard } from "@/components/AccountSetupWizard";
import { ChatAssistant } from "@/components/ChatAssistant";
import { SearchTermReport } from "@/components/SearchTermReport";
import { PlaybookView } from "@/components/PlaybookView";
import { ProductPerformance } from "@/components/ProductPerformance";
import { PriceCompetitiveness } from "@/components/PriceCompetitiveness";
import { PersonaView } from "@/components/PersonaView";
import { MetricExplorer } from "@/components/MetricExplorer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AdCopyTab } from "@/components/AdCopyTab";
import { ProactiveFeed } from "@/components/ProactiveFeed";
import { ActionPlanTab } from "@/components/ActionPlanTab";
import ProductAnalyzer from "@/components/product-engine/ProductAnalyzer";
import GrowthPlanGenerator from "@/components/product-engine/GrowthPlanGenerator";
import { BUCKET_LABELS } from "@/lib/engine/types";

type Tab = "overview" | "actions" | "products" | "search-terms" | "ads" | "persona" | "explorer" | "playbook" | "chat" | "notes" | "sops" | "peers" | "plan" | "product-engine";

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
              background: "var(--btn-primary)", border: "none", borderRadius: 6,
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
  slackChannelId:     string | null;
  slackChannelName:   string | null;
  peerGroupId:        string | null;
  merchantCenterId:   string | null;
  intakeToken:        string | null;
  intakeCompletedAt:  string | null;
  assignedUserId:     string | null;
  reportEmail:        string | null;
}

// ─── Client Context Panel ─────────────────────────────────────────────────────

function ClientContextPanel({
  accountId,
  landingPageUrl,
  initial,
  onSaved,
}: {
  accountId:      string;
  landingPageUrl: string | null;
  initial:        string | null;
  onSaved:        (value: string) => void;
}) {
  const [editing,   setEditing]   = useState(false);
  const [value,     setValue]     = useState(initial ?? "");
  const [saving,    setSaving]    = useState(false);
  const [crawling,  setCrawling]  = useState(false);
  const [crawlErr,  setCrawlErr]  = useState<string | null>(null);

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
    setCrawlErr(null);
  };

  const generateFromWebsite = async () => {
    setCrawling(true);
    setCrawlErr(null);
    try {
      const res = await fetch(`/api/accounts/${accountId}/crawl-brief`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setValue(data.brief);
      setEditing(true);
    } catch (e) {
      setCrawlErr(e instanceof Error ? e.message : "Could not generate brief");
    } finally {
      setCrawling(false);
    }
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
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {!editing && landingPageUrl && (
            <button
              onClick={generateFromWebsite}
              disabled={crawling}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                background: "transparent", border: "1px solid var(--border-2)",
                borderRadius: 6, cursor: crawling ? "not-allowed" : "pointer",
                color: "var(--text-dim)", fontSize: 11, padding: "3px 8px",
                opacity: crawling ? 0.6 : 1,
              }}
            >
              {crawling ? <Loader2 size={10} className="animate-spin" /> : <Zap size={10} />}
              {crawling ? "Crawling…" : "Generate from website"}
            </button>
          )}
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
      </div>

      {crawlErr && (
        <p style={{ fontSize: 11, color: "#ef4444", margin: "0 0 8px" }}>{crawlErr}</p>
      )}

      {!editing && value && (
        <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7, whiteSpace: "pre-wrap", margin: 0 }}>
          {value}
        </p>
      )}

      {!editing && !value && (
        <p style={{ fontSize: 12, color: "var(--text-faint)", lineHeight: 1.7, margin: 0 }}>
          {landingPageUrl
            ? <>No brief yet — klik <strong style={{ color: "var(--text-dim)" }}>Generate from website</strong> om automatisch te vullen, of voeg handmatig toe.</>
            : "No brief yet — add context so the AI gives better advice: what the client sells, landing page URL, target CPA/ROAS, key USPs."}
        </p>
      )}

      {editing && (
        <>
          <textarea
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder={"What does this client sell?\nTarget audience?\nKey USPs and differentiators?\nSeasonal or promotional context?"}
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
                background: "var(--btn-primary)", border: "none", borderRadius: 6,
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
  monthlyBudget:      number | null;
  targetRoas:         number | null;
  targetCpa:          number | null;
  grossMarginPercent: number | null;
  landingPageUrl:     string | null;
  country:            string | null;
  businessModel:      string | null;
  monthlyChurnRate:   number | null;
}

interface SpendPoint { month: string; spend: number; roas: number | null; cpa: number | null }

// Signals from the latest constraint snapshot — used for signal-based k estimation
interface LatestSignals {
  traffic?: {
    impressionShareLost_budget?: number;
    searchImpressionShare?: number;
    clickThroughRate?: number;
    clickThroughRateBaseline?: number;
  };
  conversion?: {
    conversionRate?: number;
    conversionRateBaseline?: number;
  };
}

// Estimate k from current account signals when historical data is insufficient.
// Logic: how much headroom does this account have before hitting saturation?
//
// High IS-lost-to-budget (> 30%) → account is demand-constrained, not supply-constrained.
//   Scaling budget recovers lost impressions → relatively flat curve (k ≈ -0.08)
//
// Medium IS-lost-to-budget (10–30%) → some headroom left (k ≈ -0.15)
//
// Low IS-lost-to-budget (< 10%) + strong IS → account is near saturation,
//   further spend reaches lower-intent queries → steeper curve (k ≈ -0.30 to -0.40)
//
// CTR well below baseline → traffic quality already degrading at current spend (k steeper)
// CVR well below baseline → landing page bottleneck, not spend, limits returns (k steeper)
function estimateKFromSignals(signals: LatestSignals | null): { k: number; reason: string } {
  if (!signals?.traffic) return { k: -0.28, reason: "no signals — generic curve" };

  const isLostBudget = signals.traffic.impressionShareLost_budget ?? 0;
  const searchIS     = signals.traffic.searchImpressionShare ?? 0;
  const ctr          = signals.traffic.clickThroughRate ?? 0;
  const ctrBase      = signals.traffic.clickThroughRateBaseline ?? 0;
  const cvr          = signals.conversion?.conversionRate ?? 0;
  const cvrBase      = signals.conversion?.conversionRateBaseline ?? 0;

  let k = -0.20; // starting point
  const reasons: string[] = [];

  // Budget headroom: high IS-lost-to-budget = scaling stays efficient
  if (isLostBudget > 0.35) {
    k += 0.14; // flatter — lots of demand not being captured yet
    reasons.push(`${Math.round(isLostBudget * 100)}% IS lost to budget → room to scale`);
  } else if (isLostBudget > 0.15) {
    k += 0.07;
    reasons.push(`${Math.round(isLostBudget * 100)}% IS lost to budget → moderate headroom`);
  } else if (searchIS > 0.6) {
    k -= 0.10; // high IS already captured → approaching saturation
    reasons.push(`${Math.round(searchIS * 100)}% IS already captured → near saturation`);
  }

  // CTR degradation: if CTR is well below baseline, quality is already slipping
  if (ctrBase > 0 && ctr > 0 && ctr / ctrBase < 0.75) {
    k -= 0.08;
    reasons.push("CTR below baseline → traffic quality degrading");
  }

  // CVR degradation: if CVR is below baseline, scaling hits worse traffic first
  if (cvrBase > 0 && cvr > 0 && cvr / cvrBase < 0.80) {
    k -= 0.07;
    reasons.push("CVR below baseline → conversion quality dropping");
  }

  return {
    k: Math.max(-0.55, Math.min(-0.05, k)),
    reason: reasons.join("; ") || "signal-based estimate",
  };
}

// Fit a power-law efficiency curve to real monthly spend/ROAS data.
// Returns the exponent `k` for efficiency(x) = x^k, where x = spend / medianSpend.
// Negative k = diminishing returns (ROAS drops as spend rises).
// Falls back to signal-based estimate, then generic -0.28 if no signals available.
function fitEfficiencyCurve(
  points: SpendPoint[],
  useRoas: boolean,
  signals: LatestSignals | null
): { k: number; source: "historical" | "signals" | "generic"; label: string } {
  // Try the preferred metric first; if no points have it, try the other one
  // (e.g. targetRoas set but account is lead-gen with no conversion value → fall back to CPA shape)
  let valid = points.filter(p => p.spend > 0 && (useRoas ? p.roas : p.cpa) != null);
  if (valid.length < 4) {
    const altValid = points.filter(p => p.spend > 0 && (useRoas ? p.cpa : p.roas) != null);
    if (altValid.length > valid.length) valid = altValid;
  }

  if (valid.length >= 4) {
    const spends   = [...valid.map(p => p.spend)].sort((a, b) => a - b);
    const medSpend = spends[Math.floor(spends.length / 2)];

    if (medSpend > 0) {
      // Build efficiency values — prefer roas, then inverse-cpa
      const efficiencies = valid.map(p =>
        p.roas != null ? p.roas : p.cpa != null ? 1 / p.cpa : null
      ).filter((v): v is number => v != null && v > 0);

      if (efficiencies.length >= 4) {
        const sortedEff = [...efficiencies].sort((a, b) => a - b);
        const medEff = sortedEff[Math.floor(sortedEff.length / 2)];
        if (medEff > 0) {
          const logPairs = valid
            .map((p, i) => ({
              logX: Math.log(p.spend / medSpend),
              logY: Math.log(efficiencies[i] / medEff),
            }))
            .filter(p => isFinite(p.logX) && isFinite(p.logY) && Math.abs(p.logX) > 0.05);

          if (logPairs.length >= 3) {
            const sumXX = logPairs.reduce((s, p) => s + p.logX * p.logX, 0);
            const sumXY = logPairs.reduce((s, p) => s + p.logX * p.logY, 0);
            const k = Math.max(-0.6, Math.min(0, sumXY / sumXX));
            return { k, source: "historical", label: `${valid.length}mo real data` };
          }
        }
      }
    }
  }

  // Signal-based fallback — uses IS, CTR, CVR from latest snapshot
  if (signals?.traffic) {
    const { k, reason } = estimateKFromSignals(signals);
    const monthCount = valid.length;
    const prefix = monthCount > 0 ? `${monthCount}mo data + ` : "";
    return { k, source: "signals", label: `${prefix}${reason}` };
  }

  return { k: -0.28, source: "generic", label: "generic curve — no account data" };
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
  const [curvePoints,   setCurvePoints]   = useState<SpendPoint[] | null>(null);
  const [curveSignals,  setCurveSignals]  = useState<LatestSignals | null>(null);
  const [actualRoas,    setActualRoas]    = useState<number | null>(null);
  const [actualCpa,     setActualCpa]     = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/accounts/${accountId}/spend-curve`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (!d) return;
        if (d.points) setCurvePoints(d.points);
        if (d.signals) setCurveSignals(d.signals);
        // Derive actual ROAS/CPA from the most recent month with data
        if (d.points?.length > 0) {
          const last = [...d.points].sort((a: SpendPoint, b: SpendPoint) => b.month.localeCompare(a.month))[0];
          if (last.roas != null) setActualRoas(last.roas);
          if (last.cpa  != null) setActualCpa(last.cpa);
        }
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);
  const initVals = () => ({
    monthlyBudget:      initial.monthlyBudget      != null ? String(initial.monthlyBudget)                        : "",
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

  const hasAny = initial.monthlyBudget != null || initial.targetRoas != null || initial.targetCpa != null
    || initial.grossMarginPercent != null || !!initial.landingPageUrl || !!initial.country
    || !!initial.businessModel || initial.monthlyChurnRate != null;

  const save = async () => {
    setSaving(true);
    const body: AccountTargets = {
      monthlyBudget:      vals.monthlyBudget      !== "" ? parseFloat(vals.monthlyBudget)         : null,
      targetRoas:         vals.targetRoas         !== "" ? parseFloat(vals.targetRoas)             : null,
      targetCpa:          vals.targetCpa          !== "" ? parseFloat(vals.targetCpa)              : null,
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
          {initial.monthlyBudget != null && (
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-2)", letterSpacing: "-0.5px", lineHeight: 1 }}>{currSym}{initial.monthlyBudget.toLocaleString()}</div>
              <div style={{ fontSize: 10, color: "var(--text-faint)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.4px" }}>Monthly Budget</div>
            </div>
          )}
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

      {/* Budget projection — only when both budget and a return target are set */}
      {!editing && initial.monthlyBudget != null && (initial.targetRoas != null || initial.targetCpa != null) && (() => {
        const budget  = initial.monthlyBudget!;
        const useRoas = initial.targetRoas != null;
        const { k, source, label } = fitEfficiencyCurve(curvePoints ?? [], useRoas, curveSignals);

        // Actual vs target gap
        const targetRoas = initial.targetRoas;
        const targetCpa  = initial.targetCpa;
        const roasGapPct = (actualRoas != null && targetRoas != null && targetRoas > 0)
          ? ((actualRoas - targetRoas) / targetRoas) * 100 : null;
        const cpaGapPct  = (actualCpa != null && targetCpa != null && targetCpa > 0)
          ? ((targetCpa - actualCpa) / targetCpa) * 100 : null; // positive = better than target

        const sourceColor  = source === "historical" ? "#16a34a" : source === "signals" ? "#2563eb" : "#ca8a04";
        const sourceBg     = source === "historical" ? "rgba(34,197,94,0.1)" : source === "signals" ? "rgba(37,99,235,0.1)" : "rgba(234,179,8,0.1)";
        const sourceBorder = source === "historical" ? "rgba(34,197,94,0.2)" : source === "signals" ? "rgba(37,99,235,0.2)" : "rgba(234,179,8,0.2)";

        const budgetMultipliers = [0.5, 0.75, 1, 1.5, 2, 3];
        const rows = budgetMultipliers.map(multiplier => {
          const spend      = Math.round(budget * multiplier);
          const efficiency = Math.min(1.2, Math.max(0.4, Math.pow(multiplier, k)));
          // Use actual ROAS as baseline if available, else target
          const baseRoas   = actualRoas ?? targetRoas ?? 1;
          const baseCpa    = actualCpa  ?? targetCpa  ?? 1;
          let returnLabel  = "";
          if (useRoas) {
            returnLabel = `${currSym}${Math.round(spend * baseRoas * efficiency).toLocaleString()} rev.`;
          } else {
            returnLabel = `${Math.round(spend / baseCpa * efficiency)} conv.`;
          }
          return { spend, returnLabel, efficiency, isBase: multiplier === 1, multiplier };
        });

        return (
          <div style={{ marginTop: 16, borderTop: "1px solid var(--border)", paddingTop: 14 }}>
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.6px", textTransform: "uppercase", color: "var(--text-faint)" }}>
                Budget scenarios
              </div>
              <div style={{ fontSize: 9, fontWeight: 600, padding: "1px 6px", borderRadius: 10, background: sourceBg, color: sourceColor, border: `1px solid ${sourceBorder}` }}>
                {label}
              </div>

              {/* Actual vs target ROAS/CPA */}
              {useRoas && actualRoas != null && targetRoas != null && (
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 11, color: "var(--text-faint)" }}>Actual ROAS:</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: roasGapPct != null && roasGapPct >= 0 ? "#22c55e" : "#ef4444", letterSpacing: "-0.3px" }}>
                    {actualRoas.toFixed(1)}x
                  </span>
                  <span style={{ fontSize: 10, color: "var(--text-faint)" }}>vs</span>
                  <span style={{ fontSize: 11, color: "var(--text-dim)" }}>{targetRoas}x target</span>
                  {roasGapPct != null && (
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 10,
                      background: roasGapPct >= 0 ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                      color: roasGapPct >= 0 ? "#16a34a" : "#ef4444",
                      border: `1px solid ${roasGapPct >= 0 ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                    }}>
                      {roasGapPct >= 0 ? "+" : ""}{roasGapPct.toFixed(0)}%
                    </span>
                  )}
                </div>
              )}
              {!useRoas && actualCpa != null && targetCpa != null && (
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 11, color: "var(--text-faint)" }}>Actual CPA:</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: cpaGapPct != null && cpaGapPct >= 0 ? "#22c55e" : "#ef4444", letterSpacing: "-0.3px" }}>
                    {currSym}{actualCpa.toFixed(0)}
                  </span>
                  <span style={{ fontSize: 10, color: "var(--text-faint)" }}>vs</span>
                  <span style={{ fontSize: 11, color: "var(--text-dim)" }}>{currSym}{targetCpa} target</span>
                  {cpaGapPct != null && (
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 10,
                      background: cpaGapPct >= 0 ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                      color: cpaGapPct >= 0 ? "#16a34a" : "#ef4444",
                      border: `1px solid ${cpaGapPct >= 0 ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                    }}>
                      {cpaGapPct >= 0 ? "+" : ""}{cpaGapPct.toFixed(0)}%
                    </span>
                  )}
                </div>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6 }}>
              {rows.map(r => (
                <div key={r.multiplier} style={{
                  background: r.isBase ? "rgba(59,130,246,0.1)" : "var(--bg)",
                  border: `1px solid ${r.isBase ? "rgba(59,130,246,0.3)" : "var(--border)"}`,
                  borderRadius: 8, padding: "10px 8px", textAlign: "center",
                }}>
                  <div style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 4 }}>{r.multiplier}x</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-2)", letterSpacing: "-0.3px" }}>{currSym}{r.spend.toLocaleString()}</div>
                  <div style={{ fontSize: 10, color: "var(--text-faint)", margin: "3px 0" }}>/mo</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: r.isBase ? "#60a5fa" : "var(--text-muted)", marginTop: 4 }}>{r.returnLabel}</div>
                  {k < -0.03 && <div style={{ fontSize: 9, color: "var(--text-faint)", marginTop: 2 }}>{Math.round(r.efficiency * 100)}% eff.</div>}
                </div>
              ))}
            </div>
            {/* SVG chart — real dots + fitted curve + target line */}
            {useRoas && (curvePoints ?? []).filter(p => p.roas != null && p.spend > 0).length > 0 && (() => {
              const validPts = (curvePoints ?? []).filter(p => p.roas != null && p.spend > 0);
              const baseRoas = actualRoas ?? targetRoas ?? 1;
              const maxSpend = budget * 3.2;
              const isFlat   = k > -0.03; // effectively no diminishing returns detected

              // Chart dimensions — use viewBox for responsiveness
              const W = 600; const H = 200;
              const PAD = { top: 12, right: 20, bottom: 36, left: 44 };
              const cW = W - PAD.left - PAD.right;
              const cH = H - PAD.top  - PAD.bottom;

              // Axis ranges — round y-axis to nice values
              const allRoas  = validPts.map(p => p.roas!);
              const rawMin   = Math.max(0, Math.min(...allRoas) * 0.75);
              const rawMax   = Math.max(...allRoas, targetRoas ?? 0) * 1.2;
              const range    = rawMax - rawMin;
              const step     = range <= 2 ? 0.5 : range <= 5 ? 1 : 2;
              const roasMin  = Math.floor(rawMin / step) * step;
              const roasMax  = Math.ceil(rawMax / step) * step;

              const sx = (spend: number) => PAD.left + (spend / maxSpend) * cW;
              const sy = (roas: number)  => PAD.top  + cH - ((roas - roasMin) / (roasMax - roasMin)) * cH;

              // Fitted curve — only render when k shows meaningful curvature
              let curvePath = "";
              if (!isFlat) {
                const pts: string[] = [];
                for (let i = 0; i <= 60; i++) {
                  const spendX = budget * (0.3 + (i / 60) * 2.7);
                  const eff    = Math.min(1.2, Math.max(0.4, Math.pow(spendX / budget, k)));
                  const roasY  = Math.min(roasMax, Math.max(roasMin, baseRoas * eff));
                  pts.push(`${i === 0 ? "M" : "L"}${sx(spendX).toFixed(1)},${sy(roasY).toFixed(1)}`);
                }
                curvePath = pts.join(" ");
              }

              // Y-axis ticks at step intervals
              const yTickVals: number[] = [];
              for (let v = roasMin; v <= roasMax + 0.001; v += step) yTickVals.push(parseFloat(v.toFixed(2)));

              // X-axis ticks
              const xTickSpends = [0.5, 1, 1.5, 2, 2.5, 3].map(m => budget * m);

              return (
                <div style={{ marginTop: 16 }}>
                  <svg viewBox={`0 0 ${W} ${H}`} style={{ display: "block", width: "100%", overflow: "visible" }}>
                    <defs>
                      <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.12} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    {yTickVals.map((v, i) => (
                      <line key={i}
                        x1={PAD.left} y1={sy(v)} x2={PAD.left + cW} y2={sy(v)}
                        stroke="var(--border)" strokeWidth={0.5} strokeDasharray={i === 0 ? "0" : "4,4"}
                      />
                    ))}

                    {/* Target ROAS line */}
                    {targetRoas != null && targetRoas >= roasMin && targetRoas <= roasMax + step && (
                      <>
                        <line
                          x1={PAD.left} y1={sy(targetRoas)} x2={PAD.left + cW} y2={sy(targetRoas)}
                          stroke="#22c55e" strokeWidth={1.5} strokeDasharray="6,4" opacity={0.7}
                        />
                        <text x={PAD.left + cW - 4} y={sy(targetRoas) - 5}
                          fontSize={9} fill="#22c55e" textAnchor="end" opacity={0.85}>
                          target {targetRoas}x
                        </text>
                      </>
                    )}

                    {/* Current budget vertical line */}
                    <line
                      x1={sx(budget)} y1={PAD.top} x2={sx(budget)} y2={PAD.top + cH}
                      stroke="#60a5fa" strokeWidth={1} strokeDasharray="4,3" opacity={0.45}
                    />
                    <text x={sx(budget)} y={PAD.top + cH + 22}
                      fontSize={9} fill="#60a5fa" textAnchor="middle" opacity={0.8}>now</text>

                    {/* Fitted curve + fill — only when k is meaningful */}
                    {!isFlat && curvePath && (
                      <>
                        <path
                          d={`${curvePath} L${(PAD.left + cW).toFixed(1)},${(PAD.top + cH).toFixed(1)} L${PAD.left.toFixed(1)},${(PAD.top + cH).toFixed(1)} Z`}
                          fill="url(#curveGrad)"
                        />
                        <path d={curvePath} fill="none" stroke="#3b82f6" strokeWidth={2} opacity={0.7} />
                      </>
                    )}

                    {/* Real data dots */}
                    {validPts.map((p, i) => {
                      const x = sx(p.spend);
                      const y = sy(p.roas!);
                      if (x < PAD.left - 4 || x > PAD.left + cW + 4) return null;
                      return (
                        <g key={i}>
                          <circle cx={x} cy={y} r={4.5} fill="#f97316" stroke="var(--surface)" strokeWidth={1.5} opacity={0.9} />
                          <title>{p.month}: {currSym}{p.spend.toLocaleString()} → {p.roas!.toFixed(2)}x ROAS</title>
                        </g>
                      );
                    })}

                    {/* Y-axis labels */}
                    {yTickVals.map((v, i) => (
                      <text key={i} x={PAD.left - 8} y={sy(v) + 4}
                        fontSize={9} fill="var(--text-faint)" textAnchor="end">
                        {v % 1 === 0 ? `${v}x` : `${v.toFixed(1)}x`}
                      </text>
                    ))}

                    {/* X-axis labels */}
                    {xTickSpends.map((s, i) => (
                      <text key={i} x={sx(s)} y={H - 6}
                        fontSize={9} fill="var(--text-faint)" textAnchor="middle">
                        {currSym}{s >= 1000 ? `${(s / 1000).toFixed(0)}k` : s.toFixed(0)}
                      </text>
                    ))}

                    {/* Axis lines */}
                    <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + cH} stroke="var(--border)" strokeWidth={1} />
                    <line x1={PAD.left} y1={PAD.top + cH} x2={PAD.left + cW} y2={PAD.top + cH} stroke="var(--border)" strokeWidth={1} />
                  </svg>

                  {/* Legend — below chart as HTML, no overlap */}
                  <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap", paddingLeft: PAD.left }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f97316" }} />
                      <span style={{ fontSize: 10, color: "var(--text-faint)" }}>Monthly ROAS</span>
                    </div>
                    {!isFlat && (
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <div style={{ width: 16, height: 2, background: "#3b82f6", borderRadius: 1 }} />
                        <span style={{ fontSize: 10, color: "var(--text-faint)" }}>Efficiency curve (k={k.toFixed(2)})</span>
                      </div>
                    )}
                    {targetRoas != null && (
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <div style={{ width: 16, height: 0, borderTop: "1.5px dashed #22c55e" }} />
                        <span style={{ fontSize: 10, color: "var(--text-faint)" }}>Target {targetRoas}x</span>
                      </div>
                    )}
                    {isFlat && (
                      <span style={{ fontSize: 10, color: "var(--text-faint)", fontStyle: "italic" }}>
                        No diminishing returns detected — scenarios assume linear scaling
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}

            <div style={{ fontSize: 10, color: "var(--text-very-dim)", marginTop: 6 }}>
              Returns based on {actualRoas != null ? "actual" : "target"} {useRoas ? `${(actualRoas ?? targetRoas)?.toFixed(1)}x ROAS` : `${currSym}${(actualCpa ?? targetCpa)?.toFixed(0)} CPA`} · k={k.toFixed(2)} · {label}
            </div>
          </div>
        );
      })()}

      {editing && (
        <>
          {/* Monthly budget — full width, prominent */}
          <label style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
            <span style={{ fontSize: 10, color: "var(--text-faint)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" }}>Agreed Monthly Budget</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 7, padding: "6px 10px" }}>
              <span style={{ fontSize: 11, color: "var(--text-faint)" }}>{currSym}</span>
              <input
                type="number" step="100" min="0" placeholder="e.g. 3000"
                value={vals.monthlyBudget}
                onChange={e => setVals(v => ({ ...v, monthlyBudget: e.target.value }))}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--text)", fontSize: 13, fontFamily: "inherit", minWidth: 0 }}
              />
              <span style={{ fontSize: 11, color: "var(--text-faint)" }}>/mo</span>
            </div>
            <span style={{ fontSize: 10, color: "var(--text-very-dim)" }}>Approved client budget — prevents budget IS loss being flagged as a constraint</span>
          </label>

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
              style={{ background: "var(--btn-primary)", border: "none", borderRadius: 6, color: "#fff", fontSize: 11, fontWeight: 600, padding: "5px 14px", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1 }}
            >
              {saving ? "Saving…" : "Save targets"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Slack Channel Panel ──────────────────────────────────────────────────────

function SlackChannelPanel({
  accountId,
  initialChannelId,
  initialChannelName,
  onSaved,
}: {
  accountId: string;
  initialChannelId:   string | null;
  initialChannelName: string | null;
  onSaved: (id: string | null, name: string | null) => void;
}) {
  const [channels, setChannels]   = useState<{ id: string; name: string }[] | null>(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [saving, setSaving]       = useState(false);
  const [open, setOpen]           = useState(false);
  const [search, setSearch]       = useState("");
  const [selected, setSelected]   = useState<{ id: string; name: string } | null>(
    initialChannelId && initialChannelName ? { id: initialChannelId, name: initialChannelName } : null
  );

  const fetchChannels = async () => {
    if (channels) { setOpen(true); return; }
    setLoading(true);
    setError(null);
    const res = await fetch("/api/integrations/slack/channels");
    if (res.ok) {
      const { channels: ch } = await res.json();
      setChannels(ch);
      setOpen(true);
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Failed to load channels");
    }
    setLoading(false);
  };

  const pick = async (ch: { id: string; name: string } | null) => {
    setSelected(ch);
    setOpen(false);
    setSearch("");
    setSaving(true);
    await fetch(`/api/accounts/${accountId}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ slackChannelId: ch?.id ?? null, slackChannelName: ch?.name ?? null }),
    });
    onSaved(ch?.id ?? null, ch?.name ?? null);
    setSaving(false);
  };

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "14px 20px", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", color: "var(--text-dim)" }}>
            Slack channel
          </span>
          <span style={{ fontSize: 11, color: "var(--text-faint)", marginLeft: 8 }}>
            feeds AI change-log context
          </span>
        </div>
        {!open && (
          <button
            onClick={fetchChannels}
            disabled={loading || saving}
            style={{ fontSize: 11, color: "var(--text-dim)", background: "transparent", border: "none", cursor: loading || saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 4, padding: "2px 4px" }}
          >
            {loading || saving ? <Loader2 size={11} className="animate-spin" /> : <Pencil size={10} />}
            {selected ? "Change" : "Select channel"}
          </button>
        )}
        {open && (
          <button onClick={() => setOpen(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-faint)", display: "flex" }}>
            <X size={12} />
          </button>
        )}
      </div>

      {!open && selected && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10 }}>
          <MessageSquare size={12} style={{ color: "#4ade80", flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: "var(--text-2)" }}>#{selected.name}</span>
          <button
            onClick={() => pick(null)}
            style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-faint)", background: "transparent", border: "none", cursor: "pointer" }}
          >
            Remove
          </button>
        </div>
      )}

      {!open && selected && (
        <p style={{ fontSize: 11, color: "var(--text-faint)", margin: "6px 0 0", lineHeight: 1.5 }}>
          Make sure the bot is invited to <strong style={{ color: "var(--text-dim)" }}>#{selected.name}</strong> — run{" "}
          <code style={{ background: "var(--surface-2, rgba(255,255,255,0.06))", padding: "1px 5px", borderRadius: 4, fontFamily: "monospace" }}>/invite @dashboard</code>{" "}
          inside that channel so it can read messages.
        </p>
      )}

      {!open && !selected && (
        <p style={{ fontSize: 12, color: "var(--text-faint)", margin: "8px 0 0" }}>
          No channel linked. Connect a Slack channel to give AI change-log context.
        </p>
      )}

      {error && <p style={{ fontSize: 12, color: "#ef4444", margin: "8px 0 0" }}>{error}</p>}

      {open && channels && (
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          <input
            autoFocus
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search channels…"
            style={{ padding: "6px 10px", borderRadius: 7, border: "1px solid var(--border-2)", background: "var(--bg)", color: "var(--text)", fontSize: 12, outline: "none", width: "100%", boxSizing: "border-box" }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 2, maxHeight: 200, overflowY: "auto" }}>
          {channels.filter(ch => !search || ch.name.toLowerCase().includes(search.toLowerCase())).map(ch => (
            <button
              key={ch.id}
              onClick={() => pick(ch)}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 7, cursor: "pointer",
                background: selected?.id === ch.id ? "rgba(74,222,128,0.1)" : "transparent",
                border: `1px solid ${selected?.id === ch.id ? "rgba(74,222,128,0.3)" : "transparent"}`,
                textAlign: "left", fontSize: 13, color: "var(--text-2)", width: "100%",
              }}
            >
              <MessageSquare size={11} style={{ color: "var(--text-faint)", flexShrink: 0 }} />
              #{ch.name}
              {selected?.id === ch.id && <span style={{ marginLeft: "auto", color: "#4ade80" }}><CheckSquare size={11} /></span>}
            </button>
          ))}
          {channels.filter(ch => !search || ch.name.toLowerCase().includes(search.toLowerCase())).length === 0 && (
            <p style={{ fontSize: 12, color: "var(--text-faint)", margin: "4px 0" }}>No channels match "{search}"</p>
          )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Markdown renderer (used by IntelligencePanel) ────────────────────────────

function renderIntelligence(text: string, streaming: boolean): React.ReactNode {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;

  const inline = (raw: string): React.ReactNode => {
    const parts = raw.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/);
    return parts.map((p, idx) => {
      if (p.startsWith("**") && p.endsWith("**"))
        return <strong key={idx} style={{ color: "var(--text-2)", fontWeight: 600 }}>{p.slice(2, -2)}</strong>;
      if (p.startsWith("*") && p.endsWith("*"))
        return <em key={idx}>{p.slice(1, -1)}</em>;
      if (p.startsWith("`") && p.endsWith("`"))
        return <code key={idx} style={{ fontFamily: "monospace", fontSize: 11, background: "var(--surface-2)", borderRadius: 3, padding: "1px 4px", color: "#a0c4ff" }}>{p.slice(1, -1)}</code>;
      return <span key={idx}>{p}</span>;
    });
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      nodes.push(
        <h3 key={i} style={{ fontSize: 14, fontWeight: 700, color: "var(--text-2)", margin: "0 0 10px", lineHeight: 1.3 }}>
          {inline(line.slice(3))}
        </h3>
      );
      i++; continue;
    }
    if (line.startsWith("### ")) {
      nodes.push(
        <p key={i} style={{ fontSize: 12, fontWeight: 700, color: "var(--text-3)", margin: "10px 0 4px", textTransform: "uppercase", letterSpacing: "0.4px" }}>
          {inline(line.slice(4))}
        </p>
      );
      i++; continue;
    }
    if (line.trim() === "") {
      nodes.push(<div key={i} style={{ height: 8 }} />);
      i++; continue;
    }
    nodes.push(
      <p key={i} style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.75, margin: 0 }}>
        {inline(line)}
      </p>
    );
    i++;
  }

  if (streaming) {
    nodes.push(<span key="cur" style={{ display: "inline-block", width: 2, height: 13, background: "#c084fc", marginLeft: 2, verticalAlign: "middle", animation: "chat-blink 0.9s step-start infinite" }} />);
  }
  return <>{nodes}</>;
}

// ─── AI Intelligence Panel ────────────────────────────────────────────────────

function IntelligencePanel({ accountId, autoRun, onContinueInAdvisor }: { accountId: string; autoRun?: boolean; onContinueInAdvisor?: (brief: string, question: string) => void }) {
  const [text, setText]               = useState("");
  const [loading, setLoading]         = useState(false);
  const [done, setDone]               = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [slackWarning, setSlackWarning] = useState<string | null>(null);
  const [copied, setCopied]           = useState(false);
  const hasAutoRun = useRef(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useEffect(() => {
    if (autoRun && !hasAutoRun.current) {
      hasAutoRun.current = true;
      generate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRun]);

  const generate = async () => {
    if (loading) return;
    setLoading(true);
    setText("");
    setDone(false);
    setError(null);
    setSlackWarning(null);

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
          if (payload.done)  {
            setDone(true);
            if (payload.slackError) setSlackWarning(payload.slackError);
            break;
          }
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
        <div style={{ display: "flex", gap: 6 }}>
          {done && text && (
            <button
              onClick={copyToClipboard}
              title="Copy to clipboard"
              style={{
                display: "flex", alignItems: "center", gap: 5,
                background: copied ? "rgba(74,222,128,0.1)" : "transparent",
                border: `1px solid ${copied ? "rgba(74,222,128,0.3)" : "var(--border-2)"}`,
                borderRadius: 7, padding: "5px 12px",
                fontSize: 11, fontWeight: 500,
                color: copied ? "#4ade80" : "var(--text-dim)",
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {copied ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
            </button>
          )}
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
                : <><Sparkles size={11} /> Run brief</>}
          </button>
        </div>
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
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {renderIntelligence(text, loading && !done)}
        </div>
      )}

      {slackWarning && (
        <p style={{ fontSize: 11, color: "#f59e0b", margin: "10px 0 0", lineHeight: 1.5 }}>
          ⚠ {slackWarning}
        </p>
      )}

      {done && text && onContinueInAdvisor && (
        <div style={{ marginTop: 14, borderTop: "1px solid var(--border)", paddingTop: 12 }}>
          <p style={{ fontSize: 11, color: "var(--text-faint)", margin: "0 0 8px", letterSpacing: "0.3px" }}>
            Go deeper →
          </p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[
              "Walk me through the full diagnosis",
              "What are the exact steps to fix this?",
              "What do I tell the client?",
              "What should I check in the search terms?",
            ].map(q => (
              <button
                key={q}
                onClick={() => onContinueInAdvisor(text, q)}
                style={{
                  fontSize: 11, fontWeight: 500,
                  color: "#c084fc",
                  background: "rgba(192,132,252,0.07)",
                  border: "1px solid rgba(192,132,252,0.2)",
                  borderRadius: 20, padding: "5px 12px",
                  cursor: "pointer", whiteSpace: "nowrap",
                  transition: "background 0.1s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(192,132,252,0.14)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(192,132,252,0.07)")}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Merchant Center ID row ───────────────────────────────────────────────────

function MerchantCenterIdRow({ accountId, initial, onSaved }: {
  accountId: string;
  initial:   string | null;
  onSaved:   (v: string | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value,   setValue]   = useState(initial ?? "");
  const [saving,  setSaving]  = useState(false);

  const save = async () => {
    setSaving(true);
    await fetch(`/api/accounts/${accountId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ merchantCenterId: value.trim() || null }),
    });
    onSaved(value.trim() || null);
    setSaving(false);
    setEditing(false);
  };

  return (
    <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
      {!editing ? (
        <>
          <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
            Merchant Center ID:&nbsp;
            <strong style={{ color: initial ? "var(--text-2)" : "#f87171" }}>
              {initial ?? "not set — VS MARKET will show —"}
            </strong>
          </span>
          <button
            onClick={() => setEditing(true)}
            style={{ background: "none", border: "1px solid var(--border-2)", borderRadius: 6, padding: "2px 9px", fontSize: 10, color: "var(--text-dim)", cursor: "pointer" }}
          >
            <Pencil size={10} style={{ display: "inline", marginRight: 3, verticalAlign: "middle" }} />Edit
          </button>
        </>
      ) : (
        <>
          <input
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="e.g. 123456789"
            style={{
              background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 7,
              color: "var(--text)", fontSize: 12, padding: "5px 10px", outline: "none",
              fontFamily: "inherit", width: 160,
            }}
            autoFocus
          />
          <button onClick={save} disabled={saving} style={{ background: "var(--btn-primary)", border: "none", borderRadius: 7, color: "#fff", fontSize: 11, padding: "5px 12px", cursor: "pointer" }}>
            {saving ? "Saving…" : "Save"}
          </button>
          <button onClick={() => { setValue(initial ?? ""); setEditing(false); }} style={{ background: "none", border: "1px solid var(--border-2)", borderRadius: 7, color: "var(--text-dim)", fontSize: 11, padding: "5px 10px", cursor: "pointer" }}>
            Cancel
          </button>
        </>
      )}
    </div>
  );
}

// ─── Peers Panel ─────────────────────────────────────────────────────────────

interface PeerSnapshot {
  scoredAt:            string;
  scoreMeasurement:    number;
  scoreTraffic:        number;
  scoreConversion:     number;
  scoreFunnel:         number;
  scoreEconomics:      number;
  governingConstraint: string;
  constraintReason:    string;
  metrics: {
    ctr: number; isLostBudget: number; isLostRank: number; impressionShare: number;
    cvr: number; actualRoas: number; actualCpa: number; budgetUtil: number;
    avgCpc: number; qualityScoreAvg: number; qualityScoreCount: number;
  } | null;
}

interface Peer {
  id: string;
  name: string;
  industry: string | null;
  country: string | null;
  businessModel: string | null;
  currency: string;
  targetRoas: number | null;
  targetCpa: number | null;
  peerGroupId: string | null;
  snapshot: PeerSnapshot | null;
}

interface PeersData {
  matchMode: "group" | "auto" | "none";
  peerGroupId: string | null;
  own: { id: string; name: string; snapshot: PeerSnapshot | null };
  peers: Peer[];
}

function ScoreBar({ label, value, compareValue }: { label: string; value: number; compareValue?: number }) {
  const color = value >= 70 ? "#4ade80" : value >= 45 ? "#fbbf24" : "#f87171";
  const cmpColor = compareValue !== undefined
    ? (compareValue >= 70 ? "#4ade80" : compareValue >= 45 ? "#fbbf24" : "#f87171")
    : undefined;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
      <span style={{ fontSize: 10, color: "var(--text-faint)", width: 84, flexShrink: 0, letterSpacing: "0.3px" }}>{label}</span>
      <div style={{ flex: 1, height: 5, background: "var(--bg)", borderRadius: 3, position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${Math.min(value, 100)}%`, background: color, borderRadius: 3, transition: "width 0.4s" }} />
      </div>
      <span style={{ fontSize: 10, color, width: 26, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{Math.round(value)}</span>
      {compareValue !== undefined && (
        <>
          <span style={{ fontSize: 10, color: "var(--text-faint)" }}>vs</span>
          <span style={{ fontSize: 10, color: cmpColor, width: 26, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{Math.round(compareValue)}</span>
        </>
      )}
    </div>
  );
}

function PeersPanel({ accountId, accountName, peerGroupId }: {
  accountId:   string;
  accountName: string;
  peerGroupId: string | null;
}) {
  const [data, setData]               = useState<PeersData | null>(null);
  const [loadingPeers, setLoadingPeers] = useState(false);
  const [groupInput, setGroupInput]   = useState(peerGroupId ?? "");
  const [editingGroup, setEditingGroup] = useState(false);
  const [savingGroup, setSavingGroup] = useState(false);

  const [selectedPeerId, setSelectedPeerId] = useState<string | null>(null);
  const [analysisText, setAnalysisText]     = useState("");
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisDone, setAnalysisDone]     = useState(false);
  const [analysisCopied, setAnalysisCopied] = useState(false);

  const fetchPeers = async () => {
    setLoadingPeers(true);
    try {
      const res = await fetch(`/api/accounts/${accountId}/peers`);
      if (res.ok) setData(await res.json());
    } finally {
      setLoadingPeers(false);
    }
  };

  useEffect(() => { fetchPeers(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const saveGroup = async () => {
    setSavingGroup(true);
    await fetch(`/api/accounts/${accountId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ peerGroupId: groupInput.trim() || null }),
    });
    setSavingGroup(false);
    setEditingGroup(false);
    fetchPeers();
  };

  const runCompare = async (peerId: string) => {
    setSelectedPeerId(peerId);
    setAnalysisText("");
    setAnalysisDone(false);
    setAnalysisCopied(false);
    setAnalysisLoading(true);

    try {
      const res = await fetch(`/api/accounts/${accountId}/peers/compare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ compareWithId: peerId }),
      });
      if (!res.ok || !res.body) throw new Error("Compare failed");

      const reader = res.body.getReader();
      const dec = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const line of dec.decode(value).split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const payload = JSON.parse(line.slice(6));
          if (payload.text) setAnalysisText(prev => prev + payload.text);
          if (payload.done) { setAnalysisDone(true); break; }
          if (payload.error) throw new Error(payload.error);
        }
      }
    } catch (e) {
      setAnalysisText(`Error: ${e instanceof Error ? e.message : "Unknown error"}`);
      setAnalysisDone(true);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const pct = (v: number, d = 1) => `${(v * 100).toFixed(d)}%`;

  const BUCKET_KEYS: Array<{ key: keyof PeerSnapshot; label: string }> = [
    { key: "scoreMeasurement", label: "Measurement" },
    { key: "scoreTraffic",     label: "Traffic"     },
    { key: "scoreConversion",  label: "Conversion"  },
    { key: "scoreFunnel",      label: "Funnel"      },
    { key: "scoreEconomics",   label: "Economics"   },
  ];

  const selectedPeer = data?.peers.find(p => p.id === selectedPeerId);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Internal badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)",
          borderRadius: 6, padding: "3px 10px", fontSize: 10, fontWeight: 700,
          color: "#fbbf24", letterSpacing: "0.8px", textTransform: "uppercase",
        }}>
          Internal only
        </div>
        <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
          Competitor accounts under the same agency management. Never share with clients.
        </span>
      </div>

      {/* Peer group config */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "14px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.7px", textTransform: "uppercase", color: "var(--text-dim)" }}>
              Peer group
            </span>
            {!editingGroup && (
              <p style={{ fontSize: 12, color: data?.peerGroupId ? "var(--text-2)" : "var(--text-faint)", margin: "3px 0 0" }}>
                {data?.peerGroupId
                  ? <>Group: <strong>{data.peerGroupId}</strong></>
                  : data?.matchMode === "auto"
                    ? "Auto-matched by industry + country"
                    : "No group set — assign one or ensure industry + country are filled in"}
              </p>
            )}
          </div>
          {!editingGroup && (
            <button
              onClick={() => setEditingGroup(true)}
              style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "1px solid var(--border-2)", borderRadius: 7, padding: "4px 10px", fontSize: 11, color: "var(--text-dim)", cursor: "pointer" }}
            >
              <Pencil size={11} /> Edit group
            </button>
          )}
        </div>

        {editingGroup && (
          <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center" }}>
            <input
              value={groupInput}
              onChange={e => setGroupInput(e.target.value)}
              placeholder="e.g. polish-fashion"
              style={{
                flex: 1, background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 8,
                color: "var(--text)", fontSize: 12, padding: "7px 12px", outline: "none", fontFamily: "inherit",
              }}
            />
            <button
              onClick={saveGroup}
              disabled={savingGroup}
              style={{ background: "var(--btn-primary)", border: "none", borderRadius: 8, color: "#fff", fontSize: 12, fontWeight: 500, padding: "7px 16px", cursor: "pointer" }}
            >
              {savingGroup ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => { setGroupInput(peerGroupId ?? ""); setEditingGroup(false); }}
              style={{ background: "none", border: "1px solid var(--border-2)", borderRadius: 8, color: "var(--text-dim)", fontSize: 12, padding: "7px 12px", cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Peers list */}
      {loadingPeers && (
        <div style={{ padding: "24px 0", textAlign: "center", color: "var(--text-faint)", fontSize: 12 }}>
          <Loader2 size={14} className="animate-spin" style={{ display: "inline", marginRight: 6 }} />
          Loading peers…
        </div>
      )}

      {!loadingPeers && data?.matchMode === "none" && (
        <div style={{ background: "var(--surface)", border: "1px dashed var(--border-2)", borderRadius: 12, padding: "32px 24px", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "var(--text-faint)", margin: 0 }}>
            Set a peer group name above, or fill in <strong>Industry</strong> and <strong>Country</strong> in account settings for auto-matching.
          </p>
        </div>
      )}

      {!loadingPeers && data && data.peers.length === 0 && data.matchMode !== "none" && (
        <div style={{ background: "var(--surface)", border: "1px dashed var(--border-2)", borderRadius: 12, padding: "32px 24px", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "var(--text-faint)", margin: 0 }}>
            No other accounts matched.{" "}
            {data.matchMode === "auto"
              ? "Add more accounts with the same industry + country, or assign them all to the same peer group."
              : `Add the same peer group name "${data.peerGroupId}" to the other accounts.`}
          </p>
        </div>
      )}

      {!loadingPeers && data && data.peers.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {data.matchMode === "auto" && (
            <p style={{ fontSize: 11, color: "var(--text-faint)", margin: 0 }}>
              Auto-matched by industry + country. Assign a peer group name for precise control.
            </p>
          )}
          {data.peers.map(peer => (
            <div
              key={peer.id}
              style={{
                background: "var(--surface)", border: `1px solid ${selectedPeerId === peer.id ? "rgba(192,132,252,0.4)" : "var(--border)"}`,
                borderRadius: 12, padding: "14px 18px",
                transition: "border-color 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{peer.name}</span>
                  {peer.snapshot && (
                    <span style={{
                      marginLeft: 8, fontSize: 10, padding: "2px 7px", borderRadius: 5,
                      background: "rgba(248,113,113,0.1)", color: "#f87171", fontWeight: 500,
                    }}>
                      {BUCKET_LABELS[peer.snapshot.governingConstraint as keyof typeof BUCKET_LABELS] ?? peer.snapshot.governingConstraint}
                    </span>
                  )}
                  {!peer.snapshot && (
                    <span style={{ marginLeft: 8, fontSize: 11, color: "var(--text-faint)" }}>No snapshot yet</span>
                  )}
                </div>
                {peer.snapshot && (
                  <button
                    onClick={() => runCompare(peer.id)}
                    disabled={analysisLoading}
                    style={{
                      display: "flex", alignItems: "center", gap: 5,
                      background: selectedPeerId === peer.id ? "rgba(192,132,252,0.1)" : "none",
                      border: "1px solid rgba(192,132,252,0.25)", borderRadius: 7,
                      padding: "5px 12px", fontSize: 11, fontWeight: 500, color: "#c084fc",
                      cursor: analysisLoading ? "not-allowed" : "pointer", opacity: analysisLoading ? 0.6 : 1,
                    }}
                  >
                    <Sparkles size={11} />
                    {selectedPeerId === peer.id && analysisLoading ? "Analysing…" : "Explain the gap"}
                  </button>
                )}
              </div>

              {peer.snapshot ? (
                <div>
                  {/* Score bars — this account vs peer */}
                  {BUCKET_KEYS.map(({ key, label }) => (
                    <ScoreBar
                      key={key}
                      label={label}
                      value={peer.snapshot![key as keyof PeerSnapshot] as number}
                      compareValue={data.own.snapshot ? data.own.snapshot[key as keyof PeerSnapshot] as number : undefined}
                    />
                  ))}

                  {/* Key metrics row */}
                  {peer.snapshot.metrics && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px", marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
                      {peer.snapshot.metrics.ctr > 0 && (
                        <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
                          CTR <strong style={{ color: "var(--text-2)" }}>{pct(peer.snapshot.metrics.ctr, 2)}</strong>
                          {data.own.snapshot?.metrics?.ctr ? <> vs <span style={{ color: "var(--text-dim)" }}>{pct(data.own.snapshot.metrics.ctr, 2)}</span></> : null}
                        </span>
                      )}
                      {peer.snapshot.metrics.cvr > 0 && (
                        <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
                          CVR <strong style={{ color: "var(--text-2)" }}>{pct(peer.snapshot.metrics.cvr, 2)}</strong>
                          {data.own.snapshot?.metrics?.cvr ? <> vs <span style={{ color: "var(--text-dim)" }}>{pct(data.own.snapshot.metrics.cvr, 2)}</span></> : null}
                        </span>
                      )}
                      {peer.snapshot.metrics.actualRoas > 0 && (
                        <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
                          ROAS <strong style={{ color: "var(--text-2)" }}>{peer.snapshot.metrics.actualRoas.toFixed(2)}x</strong>
                          {data.own.snapshot?.metrics?.actualRoas ? <> vs <span style={{ color: "var(--text-dim)" }}>{data.own.snapshot.metrics.actualRoas.toFixed(2)}x</span></> : null}
                        </span>
                      )}
                      {peer.snapshot.metrics.impressionShare > 0 && (
                        <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
                          IS <strong style={{ color: "var(--text-2)" }}>{pct(peer.snapshot.metrics.impressionShare)}</strong>
                          {data.own.snapshot?.metrics?.impressionShare ? <> vs <span style={{ color: "var(--text-dim)" }}>{pct(data.own.snapshot.metrics.impressionShare)}</span></> : null}
                        </span>
                      )}
                      {peer.snapshot.metrics.avgCpc > 0 && (
                        <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
                          CPC <strong style={{ color: "var(--text-2)" }}>{peer.snapshot.metrics.avgCpc.toFixed(2)}</strong>
                          {data.own.snapshot?.metrics?.avgCpc ? <> vs <span style={{ color: "var(--text-dim)" }}>{data.own.snapshot.metrics.avgCpc.toFixed(2)}</span></> : null}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p style={{ fontSize: 12, color: "var(--text-faint)", margin: 0 }}>Score this account first to compare.</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* AI gap analysis output */}
      {selectedPeerId && (analysisText || analysisLoading) && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <Sparkles size={13} style={{ color: "#c084fc" }} />
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", color: "var(--text-dim)" }}>
                Gap analysis — {accountName} vs {selectedPeer?.name}
              </span>
            </div>
            {analysisDone && analysisText && (
              <button
                onClick={() => { navigator.clipboard.writeText(analysisText).then(() => { setAnalysisCopied(true); setTimeout(() => setAnalysisCopied(false), 2000); }); }}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  background: analysisCopied ? "rgba(74,222,128,0.1)" : "transparent",
                  border: `1px solid ${analysisCopied ? "rgba(74,222,128,0.3)" : "var(--border-2)"}`,
                  borderRadius: 7, padding: "4px 10px", fontSize: 11, fontWeight: 500,
                  color: analysisCopied ? "#4ade80" : "var(--text-dim)", cursor: "pointer",
                }}
              >
                {analysisCopied ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
              </button>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {renderIntelligence(analysisText, analysisLoading && !analysisDone)}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Account Assignment Panel ────────────────────────────────────────────────

interface OrgMember { id: string; role: string; user: { id: string; name: string | null; email: string } }

function AccountAssignmentPanel({
  accountId,
  assignedUserId,
  onSaved,
}: {
  accountId:      string;
  assignedUserId: string | null;
  onSaved:        (userId: string | null) => void;
}) {
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    fetch("/api/org/members").then(r => r.json()).then(setMembers).catch(() => {});
  }, []);

  const save = async (userId: string | null) => {
    setSaving(true);
    try {
      await fetch(`/api/accounts/${accountId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedUserId: userId }),
      });
      onSaved(userId);
    } finally {
      setSaving(false);
    }
  };

  if (members.length === 0) return null;

  return (
    <div style={{
      border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px", marginBottom: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Assigned specialist</span>
        <select
          value={assignedUserId ?? ""}
          onChange={e => save(e.target.value || null)}
          disabled={saving}
          style={{
            background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6,
            color: "var(--text)", fontSize: 12, padding: "5px 10px", cursor: "pointer",
          }}
        >
          <option value="">Unassigned</option>
          {members.map(m => (
            <option key={m.user.id} value={m.user.id}>
              {m.user.name ?? m.user.email}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// ─── Client Intake Panel ─────────────────────────────────────────────────────

function ClientIntakePanel({
  accountId,
  intakeToken,
  intakeCompletedAt,
  onTokenGenerated,
}: {
  accountId:         string;
  intakeToken:       string | null;
  intakeCompletedAt: string | null;
  onTokenGenerated:  (token: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [copied,  setCopied]  = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url    = intakeToken ? `${origin}/client/${intakeToken}` : null;

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/accounts/${accountId}/intake-token`, { method: "POST" });
      const j   = await res.json();
      if (j.token) onTokenGenerated(j.token);
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px", marginBottom: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Client intake form</span>
          {intakeCompletedAt && (
            <span style={{ marginLeft: 8, fontSize: 11, color: "#22c55e",
              background: "rgba(34,197,94,0.1)", padding: "2px 7px", borderRadius: 99 }}>
              ✓ Submitted
            </span>
          )}
          {intakeToken && !intakeCompletedAt && (
            <span style={{ marginLeft: 8, fontSize: 11, color: "var(--text-faint)",
              background: "var(--bg)", padding: "2px 7px", borderRadius: 99, border: "1px solid var(--border)" }}>
              Awaiting client
            </span>
          )}
        </div>
        {!url ? (
          <button
            onClick={generate}
            disabled={loading}
            style={{
              background: "var(--btn-primary)", border: "none", borderRadius: 6,
              color: "#fff", fontSize: 11, fontWeight: 600,
              padding: "5px 14px", cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Generating…" : "Generate link"}
          </button>
        ) : (
          <button
            onClick={copy}
            style={{
              background: "transparent", border: "1px solid var(--border)", borderRadius: 6,
              color: copied ? "#22c55e" : "var(--text-dim)", fontSize: 11, fontWeight: 600,
              padding: "5px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
            }}
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? "Copied!" : "Copy link"}
          </button>
        )}
      </div>
      {url && (
        <div style={{
          background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6,
          padding: "8px 12px", fontSize: 11, color: "var(--text-faint)",
          wordBreak: "break-all", fontFamily: "monospace",
        }}>
          {url}
        </div>
      )}
      {!url && (
        <p style={{ fontSize: 12, color: "var(--text-faint)", margin: 0 }}>
          Generate a shareable link to send to your client. They fill in the intake form and the data flows directly into this account.
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
  isJsRendered?: boolean;
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

  const scoreColor = (s: number) => s >= 70 ? "#4ade80" : s >= 45 ? "#fbbf24" : "#f87171";
  const scoreLabel = (s: number) => s >= 70 ? "Good" : s >= 45 ? "Issues" : "Critical";
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
          {result.isJsRendered && (
            <div style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 10, display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ color: "#fbbf24" }}>⚡</span>
              JS-rendered page — analysis based on structured data, meta tags &amp; detected tools
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: scoreColor(result.score) + "18", border: `1px solid ${scoreColor(result.score)}40`,
              borderRadius: 20, padding: "5px 14px",
            }}>
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: scoreColor(result.score), flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: scoreColor(result.score) }}>{scoreLabel(result.score)}</span>
            </div>
            <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
              CRO review · {result.mobileReady ? "✓ Mobile ready" : "✗ Mobile issues"}
            </span>
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
  checks: { area: string; status: "good" | "warning" | "missing" | "cannot_assess"; note: string }[];
  issues: { severity: "high" | "medium" | "low"; text: string }[];
  topRecommendation: string;
  isJsRendered?: boolean;
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

  const scoreColor = (s: number) => s >= 70 ? "#4ade80" : s >= 45 ? "#fbbf24" : "#f87171";
  const scoreLabel = (s: number) => s >= 70 ? "Good" : s >= 45 ? "Issues" : "Critical";
  const sevColor   = (sev: string) => sev === "high" ? "#f87171" : sev === "medium" ? "#fbbf24" : "var(--text-dim)";
  const statusIcon = (st: string) =>
    st === "good"           ? { icon: "✓", color: "#4ade80" }
    : st === "warning"      ? { icon: "!", color: "#fbbf24" }
    : st === "cannot_assess"? { icon: "?", color: "var(--text-faint)" }
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
          {result.isJsRendered && (
            <div style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 10, display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ color: "#fbbf24" }}>⚡</span>
              JS-rendered page — analysis based on structured data, meta tags &amp; detected tools
            </div>
          )}
          {/* Score */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: scoreColor(result.score) + "18", border: `1px solid ${scoreColor(result.score)}40`,
              borderRadius: 20, padding: "5px 14px",
            }}>
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: scoreColor(result.score), flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: scoreColor(result.score) }}>{scoreLabel(result.score)}</span>
            </div>
            <span style={{ fontSize: 11, color: "var(--text-faint)" }}>PDP audit</span>
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
  const router = useRouter();
  const [account, setAccount] = useState<Account | null>(null);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [actions, setActions] = useState<Action[]>([]);
  const [orgMembers, setOrgMembers] = useState<{ email: string; name: string | null }[]>([]);
  const [tab, setTab] = useState<Tab>("overview");
  const [intelligenceBriefText, setIntelligenceBriefText]         = useState<string | undefined>(undefined);
  const [intelligenceBriefQuestion, setIntelligenceBriefQuestion] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [rescoring, setRescoring] = useState(false);
  const [rescoreError, setRescoreError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [scalingData, setScalingData] = useState<{
    roas3d: number | null; roas7d: number | null;
    roas14d: number | null; roas30d: number | null;
    budgetUtil7d: number | null;
    lastScaledDate: string | null; lastScaledDelta: number | null;
    readyToScale: boolean; scalingNote: string;
  } | null>(null);
  const [scalingLoading, setScalingLoading] = useState(false);

  const deleteAccount = async () => {
    setDeleting(true);
    await fetch(`/api/accounts/${id}`, { method: "DELETE" });
    router.push("/");
  };

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const [acctRes, snapRes, orgRes] = await Promise.all([
        fetch(`/api/accounts`),
        fetch(`/api/accounts/${id}/snapshot`),
        fetch(`/api/org`),
      ]);
      if (!acctRes.ok) throw new Error("Failed to load account");
      const accounts: Account[] = await acctRes.json();
      const acct = accounts.find((a) => a.id === id);
      if (!acct) throw new Error("Account not found");
      setAccount(acct);
      // Show setup wizard if account has no targets configured and user hasn't dismissed it
      const dismissed = typeof window !== "undefined"
        && localStorage.getItem(`setup_dismissed_${acct.id}`) === "1";
      const needsSetup = acct.businessModel == null
        && acct.targetRoas == null
        && acct.targetCpa  == null;
      if (needsSetup && !dismissed) setShowWizard(true);
      if (snapRes.ok) {
        const snap: Snapshot = await snapRes.json();
        setSnapshot(snap);
        setActions(snap.actions ?? []);
      }
      if (orgRes.ok) {
        const org = await orgRes.json() as { members: { user: { email: string; name: string | null } }[] };
        setOrgMembers(org.members.map(m => ({ email: m.user.email, name: m.user.name })));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  // Fetch scaling readiness when account is loaded (non-blocking)
  useEffect(() => {
    if (!account?.googleAdsId || loading) return;
    setScalingLoading(true);
    fetch(`/api/accounts/${id}/scaling`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setScalingData(d); })
      .catch(() => {})
      .finally(() => setScalingLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account?.googleAdsId, loading]);

  // Auto-rescore on load if account has Google Ads connected but no snapshot yet,
  // or if the last snapshot is older than 4 hours.
  useEffect(() => {
    if (loading) return;
    if (rescoring) return;
    const snapAge = snapshot
      ? (Date.now() - new Date(snapshot.createdAt).getTime()) / 1000 / 3600
      : Infinity;
    if (snapAge > 4 && account?.googleAdsId) {
      rescore();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, account?.googleAdsId]);

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
      await load(true); // silent: don't replace the page with a loading spinner
    } catch (e) {
      setRescoreError(e instanceof Error ? e.message : "Network error");
    } finally {
      setRescoring(false);
    }
  };

  const dismissWizard = () => {
    if (account) localStorage.setItem(`setup_dismissed_${account.id}`, "1");
    setShowWizard(false);
  };

  const handleStatusChange = async (actionId: string, status: "APPROVED" | "DISMISSED") => {
    await fetch(`/api/actions/${actionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setActions((prev) => prev.map((a) => (a.id === actionId ? { ...a, status } : a)));
  };

  // ActionList owns the execute fetch and updates its own local state immediately.
  // This callback is called afterwards so the parent's copy also stays consistent.
  const handleExecute = (_actionId: string) => {
    // Nothing needed — ActionList already updated via its own setActions call.
    // If we ever need to refresh parent-level stats, do it here.
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
    { key: "overview",      label: "Intelligence",  icon: <Sparkles     size={14} /> },
    { key: "actions",       label: "Actions",       icon: <ListChecks   size={14} />, badge: pendingActions.length },
    { key: "search-terms",  label: "Search terms",  icon: <Search       size={14} /> },
    { key: "products",      label: "Products",      icon: <Package      size={14} /> },
    { key: "ads",           label: "Ad copy",       icon: <Wand2        size={14} /> },
    { key: "plan",          label: "Action Plan",   icon: <FileText     size={14} /> },
    { key: "product-engine", label: "Product Engine", icon: <BarChart    size={14} /> },
    { key: "chat",          label: "Ask AI",        icon: <MessageSquare size={14} /> },
    { key: "notes",         label: "Notes",         icon: <ClipboardList size={14} /> },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg)", color: "var(--text)", overflow: "hidden" }}>

      {/* ─── Left sidebar ─────────────────────────────────────────────────────── */}
      <aside style={{
        width: 220, flexShrink: 0,
        borderRight: "1px solid var(--border)",
        background: "var(--surface)",
        display: "flex", flexDirection: "column",
        height: "100vh", overflow: "hidden",
      }}>

        {/* Back link */}
        <div style={{ padding: "20px 18px 12px" }}>
          <Link href="/" style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            color: "var(--text-dim)", fontSize: 12, textDecoration: "none",
            transition: "color 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)"}
          onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-dim)"}
          >
            <ArrowLeft size={12} /> All accounts
          </Link>
        </div>

        {/* Account info block */}
        <div style={{ padding: "0 18px 16px", borderBottom: "1px solid var(--border)" }}>
          <h2 style={{
            fontSize: 14, fontWeight: 700, color: "var(--text)",
            margin: "0 0 5px", letterSpacing: "-0.3px", lineHeight: 1.3,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {account.name}
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
            {account.industry && (
              <span style={{
                fontSize: 10, color: "var(--text-dim)", background: "var(--surface-2)",
                border: "1px solid var(--border-2)", borderRadius: 4, padding: "1px 6px",
              }}>
                {account.industry}
              </span>
            )}
            <span style={{ fontSize: 10, color: "var(--text-very-dim)", padding: "1px 0" }}>
              {account.googleAdsId}
            </span>
          </div>
          {snapshot && (
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.3px",
              color: accent, background: accent + "18",
              border: `1px solid ${accent}30`,
              borderRadius: 5, padding: "2px 8px", display: "inline-block",
            }}>
              ▲ {label}
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "10px 10px", overflowY: "auto" }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                display: "flex", alignItems: "center", gap: 9,
                width: "100%", padding: "8px 10px",
                borderRadius: 7, border: "none",
                background: tab === t.key ? "var(--accent-dim)" : "transparent",
                color: tab === t.key ? "var(--text)" : "var(--text-muted)",
                fontSize: 13, fontWeight: tab === t.key ? 600 : 400,
                cursor: "pointer", textAlign: "left",
                transition: "background 0.12s, color 0.12s",
                marginBottom: 1,
              }}
              onMouseEnter={e => {
                if (tab !== t.key) (e.currentTarget as HTMLButtonElement).style.background = "var(--surface-2)";
              }}
              onMouseLeave={e => {
                if (tab !== t.key) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              <span style={{ color: tab === t.key ? "var(--accent)" : "inherit", display: "flex" }}>
                {t.icon}
              </span>
              <span style={{ flex: 1 }}>{t.label}</span>
              {t.badge !== undefined && t.badge > 0 && (
                <span style={{
                  background: "rgba(249,195,31,0.15)", color: "var(--accent)",
                  borderRadius: 20, padding: "0 6px", fontSize: 10, fontWeight: 700,
                  minWidth: 18, textAlign: "center",
                }}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom: rescore + theme toggle + scored date */}
        <div style={{ padding: "12px 14px", borderTop: "1px solid var(--border)" }}>
          {rescoreError && (
            <p style={{ fontSize: 10, color: "#ef4444", margin: "0 0 8px", lineHeight: 1.4 }}>
              {rescoreError.slice(0, 70)}{rescoreError.length > 70 ? "…" : ""}
            </p>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <button
              onClick={rescore}
              disabled={rescoring}
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                background: "transparent", border: "1px solid var(--border-2)",
                borderRadius: 7, color: "var(--text-dim)", fontSize: 11, fontWeight: 500,
                padding: "7px 10px", cursor: rescoring ? "not-allowed" : "pointer",
                opacity: rescoring ? 0.5 : 1,
              }}
            >
              {rescoring ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />}
              {rescoring ? "Scoring…" : "Rescore"}
            </button>
            <ThemeToggle />
          </div>
          <div style={{ fontSize: 10, color: "var(--text-very-dim)", textAlign: "center" }}>
            {snapshot
              ? `Scored ${new Date(snapshot.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
              : "Not scored yet"}
          </div>

          {/* Delete account */}
          {confirmDelete ? (
            <div style={{ marginTop: 10, padding: "8px 10px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8 }}>
              <p style={{ fontSize: 11, color: "#ef4444", margin: "0 0 8px", lineHeight: 1.4 }}>
                Remove this account and all its data? This cannot be undone.
              </p>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={deleteAccount}
                  disabled={deleting}
                  style={{ flex: 1, padding: "5px 0", borderRadius: 6, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", fontSize: 11, fontWeight: 600, cursor: deleting ? "not-allowed" : "pointer" }}
                >
                  {deleting ? <Loader2 size={10} className="animate-spin" style={{ display: "inline" }} /> : "Yes, remove"}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  style={{ padding: "5px 8px", borderRadius: 6, background: "none", border: "1px solid var(--border-2)", color: "var(--text-faint)", fontSize: 11, cursor: "pointer" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              style={{ marginTop: 8, width: "100%", padding: "5px 0", background: "none", border: "none", color: "var(--text-very-dim)", fontSize: 11, cursor: "pointer", textAlign: "center" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-very-dim)")}
            >
              Remove account
            </button>
          )}
        </div>
      </aside>

      {/* ─── Main content ─────────────────────────────────────────────────────── */}
      <main style={{
        flex: 1, minWidth: 0, height: "100vh",
        overflowY: tab === "chat" ? "hidden" : "auto",
        display: "flex", flexDirection: "column",
      }}>

        {/* Chat tab: full-height fill */}
        {tab === "chat" && snapshot && (
          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <ChatAssistant
              accountId={id}
              constraintBucket={label}
              constraintReason={snapshot.constraintReason}
              intelligenceBrief={intelligenceBriefText}
              initialQuestion={intelligenceBriefQuestion}
            />
          </div>
        )}

        {tab === "chat" && !snapshot && (
          <div style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--text-dim)", fontSize: 13,
          }}>
            Run a constraint score first to unlock the advisor.
          </div>
        )}

        {/* All other tabs: scrollable content */}
        {tab !== "chat" && (
          <div style={{ flex: 1, padding: "28px 32px", maxWidth: 860, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>

        {/* Setup wizard — shown on first open when account has no targets */}
        {showWizard && (
          <div style={{ marginBottom: 24 }}>
            <AccountSetupWizard
              accountId={id}
              accountName={account.name}
              currency={account.currency}
              onSaved={(values) => setAccount(prev => prev ? { ...prev, ...values } : prev)}
              onSkip={dismissWizard}
              onScore={() => { dismissWizard(); rescore(); }}
            />
          </div>
        )}

        {tab === "overview" && (
          <>
            {rescoreError && (
              <div style={{
                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 10, padding: "12px 16px", marginBottom: 20,
                fontSize: 13, color: "#ef4444",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
              }}>
                <span><strong>Scoring failed:</strong> {rescoreError}</span>
                <button
                  onClick={rescore}
                  style={{
                    background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
                    borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "#f87171",
                    cursor: "pointer", flexShrink: 0,
                  }}
                >
                  Retry
                </button>
              </div>
            )}
            {!snapshot ? (
              /* Auto-scoring in progress */
              <div style={{
                border: "1px solid var(--border)", borderRadius: 14,
                padding: "48px 32px", textAlign: "center",
              }}>
                {rescoring ? (
                  <>
                    <Loader2 size={22} className="animate-spin" style={{ color: "var(--accent)", margin: "0 auto 14px" }} />
                    <p style={{ color: "var(--text-dim)", fontSize: 14, margin: 0 }}>
                      Analysing account data…
                    </p>
                    <p style={{ color: "var(--text-faint)", fontSize: 12, marginTop: 6 }}>
                      Pulling live data from Google Ads · usually takes 5–15 seconds
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ color: "var(--text-dim)", fontSize: 14, marginBottom: 16 }}>
                      {account?.googleAdsId
                        ? "No data yet — connect Google Ads to start automatic analysis."
                        : "No Google Ads account linked. Add one in account settings."}
                    </p>
                    {account?.googleAdsId && (
                      <button
                        onClick={rescore}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 8,
                          background: "var(--btn-primary)", border: "none", borderRadius: 8,
                          color: "#fff", fontSize: 13, fontWeight: 600,
                          padding: "10px 22px", cursor: "pointer",
                        }}
                      >
                        <RefreshCw size={13} /> Run analysis
                      </button>
                    )}
                  </>
                )}
              </div>
            ) : (
              <>
                {/* ── Constraint summary ──────────────────────────────────── */}
                <div style={{
                  marginBottom: 20, padding: "14px 18px",
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderLeft: `3px solid ${accent}`, borderRadius: 10,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                    {buckets.map(({ bucket: b, score: s, isGoverning }, i) => {
                      const bLabel = BUCKET_LABELS[b as keyof typeof BUCKET_LABELS] ?? b;
                      const bColor = isGoverning ? (CONSTRAINT_ACCENT[b] ?? "#60a5fa") : s < 70 ? "#64748b" : "var(--text-faint)";
                      return (
                        <div key={b} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          {i > 0 && <span style={{ fontSize: 11, color: "var(--border-3)" }}>→</span>}
                          <span style={{
                            fontSize: 11, fontWeight: isGoverning ? 700 : 500, color: bColor,
                            background: isGoverning ? bColor + "15" : "transparent",
                            border: `1px solid ${isGoverning ? bColor + "35" : "transparent"}`,
                            borderRadius: 5, padding: isGoverning ? "2px 8px" : "2px 5px",
                          }}>
                            {isGoverning && "▲ "}{bLabel}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.65, margin: 0 }}>
                    {snapshot.constraintReason}
                  </p>
                </div>

                {/* ── Proactive diagnostic feed ────────────────────────────── */}
                <ProactiveFeed
                  buckets={buckets}
                  onNavigate={(tabKey, question?) => {
                    if (question) setIntelligenceBriefQuestion(question);
                    setTab(tabKey as typeof tab);
                  }}
                />

                {/* ── Diagnosis ───────────────────────────────────────────── */}
                <ScoreBuckets buckets={buckets} accountId={id} />

                {/* AI Intelligence Brief */}
                <IntelligencePanel
                  accountId={id}
                  autoRun={true}
                  onContinueInAdvisor={(brief, question) => {
                    setIntelligenceBriefText(brief);
                    setIntelligenceBriefQuestion(question);
                    setTab("chat");
                  }}
                />

                {/* ── Scaling readiness ────────────────────────────────────── */}
                {(scalingLoading || scalingData) && (
                  <div style={{
                    marginBottom: 20, padding: "16px 18px",
                    background: "var(--surface)", border: "1px solid var(--border)",
                    borderLeft: scalingData
                      ? `3px solid ${scalingData.readyToScale ? "#22c55e" : "var(--text-faint)"}`
                      : "3px solid var(--border)",
                    borderRadius: 10,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", color: "var(--text-faint)" }}>
                        Scaling readiness
                      </span>
                      {scalingLoading && <Loader2 size={11} className="animate-spin" style={{ color: "var(--text-faint)" }} />}
                      {scalingData && (
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                          background: scalingData.readyToScale ? "rgba(34,197,94,0.12)" : "rgba(113,113,122,0.12)",
                          color: scalingData.readyToScale ? "#22c55e" : "var(--text-dim)",
                        }}>
                          {scalingData.readyToScale ? "Ready to scale" : "Not yet"}
                        </span>
                      )}
                    </div>
                    {scalingData && (
                      <>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                          {[
                            { label: "3d",  val: scalingData.roas3d },
                            { label: "7d",  val: scalingData.roas7d },
                            { label: "14d", val: scalingData.roas14d },
                            { label: "30d", val: scalingData.roas30d },
                          ].map(({ label, val }) => (
                            <div key={label} style={{
                              display: "flex", flexDirection: "column", alignItems: "center",
                              background: "var(--surface-2)", borderRadius: 8, padding: "8px 14px", minWidth: 60,
                            }}>
                              <span style={{ fontSize: 10, color: "var(--text-faint)", marginBottom: 3 }}>{label}</span>
                              <span style={{ fontSize: 14, fontWeight: 700, color: val != null ? "var(--text)" : "var(--text-faint)" }}>
                                {val != null ? `${val.toFixed(2)}x` : "—"}
                              </span>
                            </div>
                          ))}
                          {scalingData.budgetUtil7d != null && (
                            <div style={{
                              display: "flex", flexDirection: "column", alignItems: "center",
                              background: "var(--surface-2)", borderRadius: 8, padding: "8px 14px", minWidth: 70,
                            }}>
                              <span style={{ fontSize: 10, color: "var(--text-faint)", marginBottom: 3 }}>IS lost (7d)</span>
                              <span style={{ fontSize: 14, fontWeight: 700, color: scalingData.budgetUtil7d > 0.10 ? "#f97316" : "var(--text)" }}>
                                {Math.round(scalingData.budgetUtil7d * 100)}%
                              </span>
                            </div>
                          )}
                        </div>
                        <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 6px", lineHeight: 1.55 }}>
                          {scalingData.scalingNote}
                        </p>
                        <p style={{ fontSize: 11, color: "var(--text-faint)", margin: 0 }}>
                          {scalingData.lastScaledDate
                            ? `Last budget change: ${scalingData.lastScaledDate}`
                            : "No budget changes detected in last 30 days"}
                        </p>
                      </>
                    )}
                  </div>
                )}

                <ScoreHistory accountId={id} governingConstraint={constraint} />

                {/* ── Account setup ────────────────────────────────────────── */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "32px 0 24px" }}>
                  <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                  <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", color: "var(--text-faint)", whiteSpace: "nowrap" }}>
                    Account setup
                  </span>
                  <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                  {!showWizard && (
                    <button
                      onClick={() => {
                        if (account) localStorage.removeItem(`setup_dismissed_${account.id}`);
                        setShowWizard(true);
                      }}
                      style={{
                        background: "transparent", border: "none", cursor: "pointer",
                        fontSize: 10, color: "var(--text-faint)", padding: "0 2px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Redo setup ↑
                    </button>
                  )}
                </div>

                {/* Account Targets — feeds ECONOMICS scoring */}
                <AccountTargetsPanel
                  accountId={id}
                  currency={account.currency}
                  initial={{
                    monthlyBudget:      account.monthlyBudget,
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

                {/* Slack channel — feeds AI change-log context */}
                <SlackChannelPanel
                  accountId={id}
                  initialChannelId={account.slackChannelId}
                  initialChannelName={account.slackChannelName}
                  onSaved={(chId, chName) => setAccount(prev => prev ? { ...prev, slackChannelId: chId, slackChannelName: chName } : prev)}
                />

                {/* Account assignment */}
                <AccountAssignmentPanel
                  accountId={id}
                  assignedUserId={account.assignedUserId ?? null}
                  onSaved={(uid) => setAccount(prev => prev ? { ...prev, assignedUserId: uid } : prev)}
                />

                {/* Account Brief — feeds AI context */}
                <ClientContextPanel
                  accountId={id}
                  landingPageUrl={account.landingPageUrl ?? null}
                  initial={account.clientContext}
                  onSaved={(v) => setAccount(prev => prev ? { ...prev, clientContext: v } : prev)}
                />

                {/* Client intake form link (replaces Typeform) */}
                <ClientIntakePanel
                  accountId={id}
                  intakeToken={account.intakeToken ?? null}
                  intakeCompletedAt={account.intakeCompletedAt ?? null}
                  onTokenGenerated={(token) => setAccount(prev => prev ? { ...prev, intakeToken: token } : prev)}
                />

                {/* Landing page AI CRO review */}
                <LandingAnalysisPanel accountId={id} landingPageUrl={account.landingPageUrl ?? null} />

                {/* Product page AI audit */}
                <PDPAnalysisPanel accountId={id} />
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
              orgMembers={orgMembers}
              onTabChange={(t) => setTab(t as Tab)}
              onStatusChange={handleStatusChange}
              onExecute={handleExecute}
              onActionUpdate={(actionId, updates) =>
                setActions(prev => prev.map(a => a.id === actionId ? { ...a, ...updates } : a))
              }
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

            <div style={{ marginTop: 32, marginBottom: 16, display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", color: "var(--text-dim)" }}>
                Price competitiveness
              </span>
              <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
                Your price vs median competitor · via Merchant Center
              </span>
            </div>
            <MerchantCenterIdRow accountId={id} initial={account.merchantCenterId} onSaved={v => setAccount(prev => prev ? { ...prev, merchantCenterId: v } : prev)} />
            <PriceCompetitiveness accountId={id} merchantCenterId={account.merchantCenterId} />
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

        {tab === "ads" && (
          <AdCopyTab accountId={id} />
        )}

        {tab === "persona" && (
          <>
            <div style={{ marginBottom: 16, display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", color: "var(--text-dim)" }}>
                Target audience
              </span>
              <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
                Device · Age · Gender · Income · Geo · Interests · Behaviour — last 30 days
              </span>
            </div>
            <PersonaView accountId={id} currency={account.currency} />
          </>
        )}

        {tab === "explorer" && (
          <>
            <div style={{ marginBottom: 16, display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", color: "var(--text-dim)" }}>
                Metrics explorer
              </span>
              <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
                Every metric, every dimension — sort and correlate
              </span>
            </div>
            <MetricExplorer accountId={id} />
          </>
        )}

        {tab === "playbook" && (
          <PlaybookView
            accountId={id}
            accountName={account.name}
            hasSnapshot={!!snapshot}
          />
        )}

        {tab === "peers" && (
          <PeersPanel accountId={id} accountName={account.name} peerGroupId={account.peerGroupId} />
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

        {tab === "plan" && account && (
          <ActionPlanTab
            accountId={id}
            accountName={account.name}
            targetRoasDefault={account.targetRoas}
            currency={account.currency}
          />
        )}

        {tab === "product-engine" && account && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <GrowthPlanGenerator
              accountId={id}
              defaultClient={account.name}
            />
            <ProductAnalyzer
              defaultClient={account.name}
              fetchRows={async () => {
                const res = await fetch(`/api/accounts/${id}/product-rows`);
                if (!res.ok) throw new Error((await res.json()).error ?? "Failed to load product rows");
                return res.json();
              }}
            />
          </div>
        )}
        </div>
        )}
      </main>
    </div>
  );
}
