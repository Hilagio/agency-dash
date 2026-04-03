"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckCircle, XCircle, Zap, AlertTriangle,
  ChevronDown, ChevronUp, Loader2, Copy, Check,
  ExternalLink, Sparkles, FileText, Clock, CheckCheck, UserPlus,
} from "lucide-react";
import { ConstraintBadge } from "./ConstraintBadge";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Action {
  id:            string;
  bucket:        string;
  title:         string;
  description:   string;
  impact:        string;
  effort:        string;
  safeToAutomate: boolean;
  actionType:    string;
  status:        string;
  isEscalation:  boolean;
  executionLog?: string;
  snoozedUntil?: string | null;
  assignedTo?:   string | null;
  doneNote?:     string | null;
}

interface SearchTermRow {
  searchTerm: string;
  campaignId: string;
  campaignName: string;
  clicks: number;
  conversions: number;
  costEur: number;
  recommendation: "EXCLUDE" | "WATCH" | "KEEP";
}

interface OrgMember {
  email: string;
  name:  string | null;
}

interface Props {
  actions:          Action[];
  accountId:        string;
  orgMembers?:      OrgMember[];
  onTabChange?:     (tab: string) => void;
  onStatusChange?:  (id: string, status: "APPROVED" | "DISMISSED") => void;
  onExecute?:       (id: string) => void;
  onActionUpdate?:  (id: string, updates: Partial<Action>) => void;
}

// ─── Bucket accent colours (match the account page) ──────────────────────────

const BUCKET_BORDER: Record<string, string> = {
  MEASUREMENT: "#c084fc",
  TRAFFIC:     "#60a5fa",
  CONVERSION:  "#fb923c",
  FUNNEL:      "#fbbf24",
  ECONOMICS:   "#4ade80",
};

// ─── Pill ─────────────────────────────────────────────────────────────────────

const IMPACT_STYLE: Record<string, { bg: string; color: string }> = {
  HIGH:   { bg: "rgba(248,113,113,0.12)", color: "#f87171" },
  MEDIUM: { bg: "rgba(251,191,36,0.12)",  color: "#fbbf24" },
  LOW:    { bg: "rgba(100,116,139,0.1)",  color: "#64748b" },
};
const EFFORT_STYLE: Record<string, { bg: string; color: string }> = {
  EASY:   { bg: "rgba(74,222,128,0.1)",  color: "#4ade80" },
  MEDIUM: { bg: "rgba(96,165,250,0.1)",  color: "#60a5fa" },
  HARD:   { bg: "rgba(251,146,60,0.1)",  color: "#fb923c" },
};

function Pill({ label, style }: { label: string; style: { bg: string; color: string } }) {
  return (
    <span style={{
      background: style.bg, color: style.color,
      borderRadius: 20, fontSize: 10, fontWeight: 600,
      padding: "2px 8px", letterSpacing: "0.3px",
    }}>
      {label}
    </span>
  );
}

// ─── Action-type detectors ────────────────────────────────────────────────────

function isSearchTermAction(action: Action) {
  const t = action.title.toLowerCase();
  const at = action.actionType.toUpperCase();
  return t.includes("search term") || t.includes("negative") ||
         at.includes("SEARCH") || at.includes("NEGATIVE") || at.includes("EXCLUDE");
}

function isCroAction(action: Action) {
  const t = action.title.toLowerCase();
  return action.bucket === "CONVERSION" && (
    t.includes("landing") || t.includes("cvr") ||
    t.includes("conversion rate") || t.includes("page experience")
  );
}

function isCtrAction(action: Action) {
  const t = action.title.toLowerCase();
  return action.bucket === "TRAFFIC" && (
    t.includes("ctr") || t.includes("headline") || t.includes("ad copy") ||
    t.includes("quality score") || t.includes("ad relevance") || t.includes("click-through")
  );
}

// ─── Search term preview ──────────────────────────────────────────────────────

function SearchTermPreview({
  accountId,
  onTabChange,
}: {
  accountId: string;
  onTabChange?: (tab: string) => void;
}) {
  const [terms, setTerms] = useState<SearchTermRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/accounts/${accountId}/search-terms`)
      .then(r => r.ok ? r.json() : [])
      .then((data: SearchTermRow[]) => {
        const top = data
          .filter(t => t.recommendation === "EXCLUDE")
          .sort((a, b) => b.costEur - a.costEur)
          .slice(0, 8);
        setTerms(top);
        setLoading(false);
      })
      .catch(() => { setTerms([]); setLoading(false); });
  }, [accountId]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-faint)", fontSize: 11, padding: "8px 0" }}>
        <Loader2 size={11} className="animate-spin" /> Loading search terms…
      </div>
    );
  }

  if (!terms || terms.length === 0) {
    return (
      <div style={{ fontSize: 11, color: "var(--text-faint)", padding: "8px 0" }}>
        No high-spend irrelevant terms found — run a rescore to pull fresh data.
      </div>
    );
  }

  const totalWasted = terms.reduce((s, t) => s + t.costEur, 0);
  const allTermsText = terms.map(t => t.searchTerm).join("\n");

  const copy = () => {
    navigator.clipboard.writeText(allTermsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ marginTop: 2 }}>
      {/* Wasted banner */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        fontSize: 11, color: "#ef4444", fontWeight: 600, marginBottom: 8,
      }}>
        <AlertTriangle size={11} />
        €{totalWasted.toFixed(2)} spent over 90 days — 0 conversions, {">"}€30 each
      </div>

      {/* Terms table */}
      <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", marginBottom: 10 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
              {["Search term", "Clicks", "Spend"].map((h, i) => (
                <th key={i} style={{
                  fontSize: 10, fontWeight: 600, color: "var(--text-faint)",
                  padding: "5px 10px", textAlign: i === 0 ? "left" : "right",
                  textTransform: "uppercase", letterSpacing: "0.4px",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {terms.map((term, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: i < terms.length - 1 ? "1px solid var(--border)" : "none",
                  background: i % 2 === 0 ? "var(--bg)" : "var(--surface)",
                }}
              >
                <td style={{ padding: "6px 10px", fontSize: 11, fontFamily: "monospace", color: "#ef4444" }}>
                  {term.searchTerm}
                </td>
                <td style={{ padding: "6px 10px", fontSize: 11, color: "var(--text-muted)", textAlign: "right" }}>
                  {term.clicks}
                </td>
                <td style={{ padding: "6px 10px", fontSize: 11, color: "#ef4444", textAlign: "right", fontWeight: 600 }}>
                  €{term.costEur.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          onClick={copy}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            background: copied ? "rgba(74,222,128,0.1)" : "var(--surface-2)",
            border: `1px solid ${copied ? "rgba(74,222,128,0.25)" : "var(--border-2)"}`,
            borderRadius: 6, color: copied ? "#4ade80" : "var(--text-muted)",
            fontSize: 11, fontWeight: 500, padding: "5px 10px", cursor: "pointer",
          }}
        >
          {copied ? <Check size={10} /> : <Copy size={10} />}
          {copied ? "Copied!" : "Copy all as negatives"}
        </button>

        {onTabChange && (
          <button
            onClick={() => onTabChange("search-terms")}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "transparent", border: "1px solid var(--border-2)",
              borderRadius: 6, color: "var(--text-dim)",
              fontSize: 11, fontWeight: 500, padding: "5px 10px", cursor: "pointer",
            }}
          >
            <ExternalLink size={10} /> View all in Search Terms tab
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Inline AI brief (CRO or CTR) ────────────────────────────────────────────

// Minimal markdown → HTML: bold, headings, bullets
function renderMarkdown(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("## ")) return (
      <div key={i} style={{ fontWeight: 700, fontSize: 13, color: "var(--text-2)", marginTop: 14, marginBottom: 4 }}>
        {line.slice(3)}
      </div>
    );
    if (line.startsWith("### ")) return (
      <div key={i} style={{ fontWeight: 600, fontSize: 12, color: "var(--text-2)", marginTop: 10, marginBottom: 2 }}>
        {line.slice(4)}
      </div>
    );
    if (line.startsWith("- ") || line.startsWith("* ")) return (
      <div key={i} style={{ display: "flex", gap: 6, marginTop: 2 }}>
        <span style={{ color: "var(--text-dim)", flexShrink: 0 }}>·</span>
        <span>{renderInline(line.slice(2))}</span>
      </div>
    );
    if (/^\d+\./.test(line)) {
      const dot = line.indexOf(". ");
      return (
        <div key={i} style={{ display: "flex", gap: 6, marginTop: 2 }}>
          <span style={{ color: "var(--text-dim)", flexShrink: 0, minWidth: 16 }}>{line.slice(0, dot + 1)}</span>
          <span>{renderInline(line.slice(dot + 2))}</span>
        </div>
      );
    }
    if (line.trim() === "") return <div key={i} style={{ height: 4 }} />;
    return <div key={i} style={{ marginTop: 2 }}>{renderInline(line)}</div>;
  });
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i} style={{ color: "var(--text-2)", fontWeight: 600 }}>{part.slice(2, -2)}</strong>
      : part
  );
}

function InlineAiBrief({
  accountId,
  type,
  actionTitle,
  actionDescription,
}: {
  accountId: string;
  type: "cro" | "ctr";
  actionTitle: string;
  actionDescription?: string;
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setLoading(true);
    setStarted(true);
    setText("");
    setError(null);

    try {
      const res = await fetch(`/api/accounts/${accountId}/inline-brief`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, actionTitle, actionDescription }),
      });
      if (!res.ok || !res.body) throw new Error("Failed to start stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const data = JSON.parse(line.slice(6)) as { text?: string; done?: boolean; error?: string };
          if (data.error) throw new Error(data.error);
          if (data.text) setText(prev => prev + data.text);
          if (data.done) break;
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!started) {
    return (
      <button
        onClick={generate}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          background: type === "cro"
            ? "rgba(251,146,60,0.1)"
            : "rgba(96,165,250,0.1)",
          border: `1px solid ${type === "cro" ? "rgba(251,146,60,0.2)" : "rgba(96,165,250,0.2)"}`,
          borderRadius: 7, color: type === "cro" ? "#fb923c" : "#60a5fa",
          fontSize: 11, fontWeight: 600, padding: "6px 14px", cursor: "pointer",
          marginTop: 2,
        }}
      >
        <Sparkles size={11} />
        {type === "cro" ? "Generate CRO Brief" : "Generate headline ideas"}
        <span style={{ fontSize: 10, opacity: 0.65, fontWeight: 400 }}>· AI</span>
      </button>
    );
  }

  return (
    <div style={{
      marginTop: 12,
      background: "var(--bg-deep)",
      border: "1px solid var(--border)",
      borderRadius: 10, overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 14px", borderBottom: "1px solid var(--border)",
        background: "var(--surface)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, color: "var(--text-dim)" }}>
          {type === "cro" ? <FileText size={11} /> : <Sparkles size={11} />}
          {type === "cro" ? "CRO Brief" : "CTR Improvement Brief"}
          {loading && <Loader2 size={10} className="animate-spin" style={{ color: "var(--text-faint)" }} />}
        </div>
        {text && !loading && (
          <button
            onClick={copyText}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "transparent", border: "none", cursor: "pointer",
              color: copied ? "#4ade80" : "var(--text-dim)", fontSize: 10,
            }}
          >
            {copied ? <Check size={10} /> : <Copy size={10} />}
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "14px 16px", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7 }}>
        {error && <span style={{ color: "#ef4444" }}>{error}</span>}
        {!error && text === "" && loading && (
          <span style={{ color: "var(--text-faint)" }}>Generating…</span>
        )}
        {text && renderMarkdown(text)}
      </div>
    </div>
  );
}

// ─── Snooze dropdown ─────────────────────────────────────────────────────────

const SNOOZE_OPTIONS = [
  { label: "3 days",  days: 3 },
  { label: "7 days",  days: 7 },
  { label: "14 days", days: 14 },
];

function addDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function fmtSnooze(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function initials(name: string | null, email: string) {
  if (name) return name.split(" ").map(p => p[0]).join("").toUpperCase().slice(0, 2);
  return email.slice(0, 2).toUpperCase();
}

// ─── Main ActionList ──────────────────────────────────────────────────────────

type ViewFilter = "open" | "snoozed" | "done" | "all";

export function ActionList({ actions: initialActions, accountId, orgMembers, onTabChange, onStatusChange, onExecute, onActionUpdate }: Props) {
  const [actions, setActions]   = useState<Action[]>(initialActions);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [executing, setExecuting] = useState<string | null>(null);
  const [filter, setFilter]     = useState<ViewFilter>("open");
  const [snoozeOpen, setSnoozeOpen] = useState<string | null>(null);
  const [assignOpen, setAssignOpen] = useState<string | null>(null);
  const snoozeRef = useRef<HTMLDivElement>(null);
  const assignRef = useRef<HTMLDivElement>(null);

  // Keep local actions in sync if parent re-renders with fresh props
  useEffect(() => { setActions(initialActions); }, [initialActions]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (snoozeRef.current && !snoozeRef.current.contains(e.target as Node)) setSnoozeOpen(null);
      if (assignRef.current && !assignRef.current.contains(e.target as Node)) setAssignOpen(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const patch = async (actionId: string, updates: Partial<Action>) => {
    // Optimistic update
    setActions(prev => prev.map(a => a.id === actionId ? { ...a, ...updates } : a));
    onActionUpdate?.(actionId, updates);
    await fetch(`/api/accounts/${accountId}/actions`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ actionId, ...updates }),
    });
  };

  const markDone = (id: string) => patch(id, { status: "DISMISSED" });

  const snooze = (id: string, days: number) => {
    setSnoozeOpen(null);
    patch(id, { status: "PENDING", snoozedUntil: addDays(days) });
  };

  const unsnooze = (id: string) => patch(id, { snoozedUntil: null });

  const assign = (id: string, email: string | null) => {
    setAssignOpen(null);
    patch(id, { assignedTo: email });
  };

  const handleExecute = async (id: string) => {
    setExecuting(id);
    await onExecute?.(id);
    setExecuting(null);
  };

  // ── Classify actions into view buckets ──────────────────────────────────────
  const now = new Date();
  const classify = (a: Action): ViewFilter => {
    if (a.status === "DISMISSED" || a.status === "EXECUTED" || a.status === "DONE") return "done";
    if (a.snoozedUntil && new Date(a.snoozedUntil) > now) return "snoozed";
    return "open";
  };

  const counts: Record<string, number> = { open: 0, snoozed: 0, done: 0 };
  actions.forEach(a => { counts[classify(a)]++; });

  const visible = filter === "all" ? actions : actions.filter(a => classify(a) === filter);

  const TABS: { key: ViewFilter; label: string; count?: number }[] = [
    { key: "open",    label: "Open",    count: counts.open },
    { key: "snoozed", label: "Snoozed", count: counts.snoozed },
    { key: "done",    label: "Done",    count: counts.done },
    { key: "all",     label: "All",     count: actions.length },
  ];

  return (
    <div>
      {/* ── Filter tabs ─────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{
              fontSize: 12, fontWeight: 500, padding: "5px 12px", borderRadius: 7,
              border: `1px solid ${filter === tab.key ? "var(--border-2)" : "transparent"}`,
              background: filter === tab.key ? "var(--surface)" : "transparent",
              color: filter === tab.key ? "var(--text-2)" : "var(--text-faint)",
              cursor: "pointer",
            }}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span style={{
                marginLeft: 6, fontSize: 10, fontWeight: 600,
                background: tab.key === "open" && filter !== "open" && counts.open > 0
                  ? "rgba(248,113,113,0.15)" : "var(--surface-2)",
                color: tab.key === "open" && filter !== "open" && counts.open > 0
                  ? "#f87171" : "var(--text-faint)",
                borderRadius: 10, padding: "1px 6px",
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {visible.length === 0 && (
        <div style={{ border: "1px dashed var(--border-2)", borderRadius: 12, padding: "40px 32px", textAlign: "center", color: "var(--text-very-dim)", fontSize: 13 }}>
          {filter === "open" ? "No open actions — account looks healthy." : `No ${filter} actions.`}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {visible.map((action) => {
          const bucket      = classify(action);
          const isDone      = bucket === "done";
          const isSnoozed   = bucket === "snoozed";
          const isExpanded  = expanded === action.id;
          const accent      = BUCKET_BORDER[action.bucket] ?? "#60a5fa";

          const showSearchTerms = isExpanded && isSearchTermAction(action);
          const showCro         = isExpanded && isCroAction(action);
          const showCtr         = isExpanded && isCtrAction(action);

          return (
            <div
              key={action.id}
              style={{
                background: isDone    ? "var(--bg-deep)"
                          : isSnoozed ? "var(--bg-deep)"
                          : "var(--surface)",
                border: `1px solid ${
                  isDone    ? "var(--border)"
                  : isSnoozed ? "rgba(96,165,250,0.15)"
                  : action.isEscalation ? "rgba(251,191,36,0.15)"
                  : "var(--surface-3)"
                }`,
                borderRadius: 12,
                borderLeft: `3px solid ${isDone ? "var(--border)" : isSnoozed ? "#60a5fa" : accent}`,
                opacity: isDone ? 0.45 : 1,
                transition: "opacity 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px" }}>

                {/* Icon */}
                <div style={{ flexShrink: 0, marginTop: 2 }}>
                  {action.isEscalation
                    ? <AlertTriangle size={14} style={{ color: "#fbbf24" }} />
                    : action.safeToAutomate
                    ? <Zap size={14} style={{ color: "#60a5fa" }} />
                    : <div style={{ width: 14 }} />}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 7 }}>
                    <ConstraintBadge bucket={action.bucket as Parameters<typeof ConstraintBadge>[0]["bucket"]} />
                    <Pill label={`${action.impact} impact`} style={IMPACT_STYLE[action.impact] ?? IMPACT_STYLE.LOW} />
                    <Pill label={`${action.effort} effort`} style={EFFORT_STYLE[action.effort] ?? EFFORT_STYLE.MEDIUM} />
                    {action.safeToAutomate && (
                      <Pill label="1-click" style={{ bg: "rgba(96,165,250,0.1)", color: "#60a5fa" }} />
                    )}
                    {action.isEscalation && (
                      <Pill label="client escalation" style={{ bg: "rgba(251,191,36,0.1)", color: "#fbbf24" }} />
                    )}
                    {isSnoozed && action.snoozedUntil && (
                      <Pill label={`snoozed until ${fmtSnooze(action.snoozedUntil)}`} style={{ bg: "rgba(96,165,250,0.1)", color: "#60a5fa" }} />
                    )}
                    {action.assignedTo && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(100,116,139,0.1)", borderRadius: 20, fontSize: 10, fontWeight: 600, padding: "2px 8px", color: "var(--text-dim)", letterSpacing: "0.3px" }}>
                        <span style={{ width: 14, height: 14, borderRadius: "50%", background: "var(--surface-2)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: "var(--text-2)" }}>
                          {initials(null, action.assignedTo)}
                        </span>
                        {action.assignedTo.split("@")[0]}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <p style={{ fontSize: 13, fontWeight: 600, color: isDone ? "var(--text-dim)" : "var(--text-2)", marginBottom: 2 }}>
                    {action.title}
                  </p>

                  {/* Expanded section */}
                  {isExpanded && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                      <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 12 }}>
                        {action.description}
                      </p>
                      {showSearchTerms && <SearchTermPreview accountId={accountId} onTabChange={onTabChange} />}
                      {showCro && <InlineAiBrief accountId={accountId} type="cro" actionTitle={action.title} actionDescription={action.description} />}
                      {showCtr && <InlineAiBrief accountId={accountId} type="ctr" actionTitle={action.title} actionDescription={action.description} />}
                      {action.executionLog && (
                        <div style={{ marginTop: 8, background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: 8, padding: "8px 12px", fontSize: 11, color: "#4ade80", lineHeight: 1.6 }}>
                          {action.executionLog}
                        </div>
                      )}
                      {action.doneNote && (
                        <div style={{ marginTop: 8, background: "rgba(100,116,139,0.06)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", fontSize: 11, color: "var(--text-muted)", lineHeight: 1.6 }}>
                          Note: {action.doneNote}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>

                  {/* Expand toggle */}
                  <button
                    onClick={() => setExpanded(isExpanded ? null : action.id)}
                    style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-faint)", padding: 4, borderRadius: 6, display: "flex" }}
                  >
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {/* Open actions: Done + Snooze + Assign + Approve/Execute */}
                  {!isDone && !isSnoozed && (
                    <>
                      {/* Assign */}
                      {orgMembers && orgMembers.length > 0 && (
                        <div style={{ position: "relative" }} ref={assignOpen === action.id ? assignRef : undefined}>
                          <button
                            onClick={() => setAssignOpen(assignOpen === action.id ? null : action.id)}
                            title="Assign to"
                            style={{ background: "transparent", border: "none", cursor: "pointer", color: action.assignedTo ? "var(--text-2)" : "var(--text-faint)", padding: 4, borderRadius: 6, display: "flex" }}
                          >
                            <UserPlus size={13} />
                          </button>
                          {assignOpen === action.id && (
                            <div style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 9, padding: "6px 0", zIndex: 50, minWidth: 160, boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
                              {action.assignedTo && (
                                <button onClick={() => assign(action.id, null)} style={{ display: "block", width: "100%", textAlign: "left", padding: "6px 12px", fontSize: 11, color: "#f87171", background: "none", border: "none", cursor: "pointer" }}>
                                  Unassign
                                </button>
                              )}
                              {orgMembers.map(m => (
                                <button
                                  key={m.email}
                                  onClick={() => assign(action.id, m.email)}
                                  style={{ display: "block", width: "100%", textAlign: "left", padding: "6px 12px", fontSize: 12, color: action.assignedTo === m.email ? "var(--text)" : "var(--text-2)", background: action.assignedTo === m.email ? "var(--surface-2)" : "none", border: "none", cursor: "pointer" }}
                                >
                                  {m.name ?? m.email}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Snooze */}
                      <div style={{ position: "relative" }} ref={snoozeOpen === action.id ? snoozeRef : undefined}>
                        <button
                          onClick={() => setSnoozeOpen(snoozeOpen === action.id ? null : action.id)}
                          title="Snooze"
                          style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-faint)", padding: 4, borderRadius: 6, display: "flex" }}
                        >
                          <Clock size={13} />
                        </button>
                        {snoozeOpen === action.id && (
                          <div style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 9, padding: "6px 0", zIndex: 50, minWidth: 120, boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
                            {SNOOZE_OPTIONS.map(o => (
                              <button
                                key={o.days}
                                onClick={() => snooze(action.id, o.days)}
                                style={{ display: "block", width: "100%", textAlign: "left", padding: "6px 12px", fontSize: 12, color: "var(--text-2)", background: "none", border: "none", cursor: "pointer" }}
                              >
                                {o.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Done */}
                      <button
                        onClick={() => markDone(action.id)}
                        title="Mark as done"
                        style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-faint)", padding: 4, borderRadius: 6, display: "flex" }}
                      >
                        <CheckCheck size={14} />
                      </button>

                      {/* Approve (automatable) */}
                      {action.status === "PENDING" && action.safeToAutomate && !isSearchTermAction(action) && (
                        <button
                          onClick={() => onStatusChange?.(action.id, "APPROVED")}
                          style={{ background: "var(--btn-primary)", border: "none", borderRadius: 7, color: "#fff", fontSize: 11, fontWeight: 500, padding: "5px 12px", cursor: "pointer" }}
                        >
                          Approve
                        </button>
                      )}

                      {/* Execute (approved automatable) */}
                      {action.status === "APPROVED" && action.safeToAutomate && !isSearchTermAction(action) && (
                        <button
                          onClick={() => handleExecute(action.id)}
                          disabled={executing === action.id}
                          style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 7, color: "#4ade80", fontSize: 11, fontWeight: 600, padding: "5px 12px", cursor: executing === action.id ? "not-allowed" : "pointer", opacity: executing === action.id ? 0.6 : 1 }}
                        >
                          {executing === action.id ? <><Loader2 size={10} className="animate-spin" /> Running…</> : <><Zap size={10} /> Execute</>}
                        </button>
                      )}
                    </>
                  )}

                  {/* Snoozed: unsnooze button */}
                  {isSnoozed && (
                    <button
                      onClick={() => unsnooze(action.id)}
                      style={{ fontSize: 11, color: "#60a5fa", background: "transparent", border: "1px solid rgba(96,165,250,0.2)", borderRadius: 6, padding: "3px 8px", cursor: "pointer" }}
                    >
                      Unsnooze
                    </button>
                  )}

                  {/* Done: checkmark */}
                  {isDone && <CheckCircle size={14} style={{ color: "var(--text-faint)" }} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
