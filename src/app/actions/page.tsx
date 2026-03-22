"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Zap, AlertTriangle, Clock, CheckCircle2, Loader2, ChevronRight } from "lucide-react";

interface Account {
  id:         string;
  name:       string;
  googleAdsId: string;
}

interface Action {
  id:            string;
  bucket:        string;
  title:         string;
  description:   string;
  impact:        string;
  effort:        string;
  safeToAutomate: boolean;
  isEscalation:  boolean;
  status:        string;
  createdAt:     string;
  account:       Account;
}

const BUCKET_COLOR: Record<string, string> = {
  MEASUREMENT: "#c084fc",
  TRAFFIC:     "#60a5fa",
  CONVERSION:  "#fb923c",
  FUNNEL:      "#fbbf24",
  ECONOMICS:   "#4ade80",
};

const BUCKET_LABEL: Record<string, string> = {
  MEASUREMENT: "Measurement",
  TRAFFIC:     "Traffic",
  CONVERSION:  "Conversion",
  FUNNEL:      "Funnel",
  ECONOMICS:   "Economics",
};

const IMPACT_COLOR: Record<string, string> = {
  HIGH:   "#ef4444",
  MEDIUM: "#f97316",
  LOW:    "#94a3b8",
};

const EFFORT_LABEL: Record<string, string> = {
  EASY:   "Quick win",
  MEDIUM: "Some work",
  HARD:   "Big lift",
};

function ActionCard({ action, onDismiss, onApprove }: {
  action: Action;
  onDismiss: (id: string) => void;
  onApprove: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const bucketColor = BUCKET_COLOR[action.bucket] ?? "#60a5fa";

  return (
    <div style={{
      border: "1px solid var(--border)",
      borderLeft: `3px solid ${bucketColor}`,
      borderRadius: 10, background: "var(--surface)",
      overflow: "hidden",
    }}>
      {/* Main row */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, padding: "14px 18px", cursor: "pointer", alignItems: "start" }}
        onClick={() => setExpanded(e => !e)}
      >
        <div>
          {/* Meta row */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
            <Link
              href={`/accounts/${action.account.id}`}
              onClick={e => e.stopPropagation()}
              style={{
                fontSize: 11, fontWeight: 700, color: "var(--text-muted)",
                textDecoration: "none", letterSpacing: "-0.2px",
              }}
            >
              {action.account.name}
            </Link>
            <span style={{ color: "var(--border-2)" }}>·</span>
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: "0.3px",
              color: bucketColor,
              background: bucketColor + "15",
              padding: "2px 7px", borderRadius: 20,
            }}>
              {BUCKET_LABEL[action.bucket] ?? action.bucket}
            </span>
            <span style={{
              fontSize: 10, fontWeight: 600, color: IMPACT_COLOR[action.impact] ?? "var(--text-dim)",
            }}>
              {action.impact}
            </span>
            <span style={{ fontSize: 10, color: "var(--text-faint)" }}>
              {EFFORT_LABEL[action.effort] ?? action.effort}
            </span>
            {action.safeToAutomate && (
              <span style={{ fontSize: 10, color: "#22c55e", display: "flex", alignItems: "center", gap: 3 }}>
                <Zap size={9} /> Automatable
              </span>
            )}
            {action.isEscalation && (
              <span style={{ fontSize: 10, color: "#f97316", display: "flex", alignItems: "center", gap: 3 }}>
                <AlertTriangle size={9} /> Client action
              </span>
            )}
          </div>

          {/* Title */}
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)", margin: 0, lineHeight: 1.4 }}>
            {action.title}
          </p>
        </div>

        <ChevronRight size={14} style={{
          color: "var(--text-faint)", marginTop: 2, flexShrink: 0,
          transform: expanded ? "rotate(90deg)" : "none",
          transition: "transform 0.15s",
        }} />
      </div>

      {/* Expanded description + actions */}
      {expanded && (
        <div style={{ borderTop: "1px solid var(--border)", padding: "14px 18px", background: "var(--bg)" }}>
          <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.65, marginBottom: 16 }}>
            {action.description}
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => onApprove(action.id)}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                background: "#1d4ed8", border: "none", borderRadius: 6,
                color: "#fff", fontSize: 12, fontWeight: 600, padding: "6px 14px", cursor: "pointer",
              }}
            >
              <CheckCircle2 size={12} /> Mark approved
            </button>
            <button
              onClick={() => onDismiss(action.id)}
              style={{
                background: "transparent", border: "1px solid var(--border-2)",
                borderRadius: 6, color: "var(--text-dim)", fontSize: 12, padding: "6px 12px", cursor: "pointer",
              }}
            >
              Dismiss
            </button>
            <Link
              href={`/accounts/${action.account.id}?tab=actions`}
              style={{
                marginLeft: "auto", display: "flex", alignItems: "center", gap: 5,
                fontSize: 12, color: "var(--text-dim)", textDecoration: "none",
              }}
            >
              View in account <ChevronRight size={11} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ActionsPage() {
  const [actions, setActions]   = useState<Action[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState<"ALL" | "HIGH" | "EASY">("ALL");

  useEffect(() => {
    fetch("/api/actions")
      .then(r => r.json())
      .then(d => { setActions(d); setLoading(false); });
  }, []);

  const patch = async (id: string, status: "APPROVED" | "DISMISSED") => {
    await fetch(`/api/actions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setActions(prev => prev.filter(a => a.id !== id));
  };

  const filtered = actions.filter(a => {
    if (filter === "HIGH") return a.impact === "HIGH";
    if (filter === "EASY") return a.effort === "EASY";
    return true;
  });

  const highCount  = actions.filter(a => a.impact === "HIGH").length;
  const easyCount  = actions.filter(a => a.effort === "EASY").length;
  const autoCount  = actions.filter(a => a.safeToAutomate).length;
  const escalCount = actions.filter(a => a.isEscalation).length;

  // Group by account for context
  const accountCount = new Set(actions.map(a => a.account.id)).size;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>

      <header style={{
        borderBottom: "1px solid var(--border)", padding: "0 28px", height: 52,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, background: "var(--header-bg)", backdropFilter: "blur(12px)", zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-dim)", fontSize: 13, textDecoration: "none" }}>
            <ArrowLeft size={14} /> All accounts
          </Link>
          <span style={{ color: "var(--border-2)" }}>|</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Action queue</span>
          {!loading && actions.length > 0 && (
            <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
              {actions.length} pending across {accountCount} accounts
            </span>
          )}
        </div>
      </header>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "24px 24px" }}>

        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "80px 0", color: "var(--text-dim)", fontSize: 13 }}>
            <Loader2 size={16} className="animate-spin" /> Loading actions…
          </div>
        ) : actions.length === 0 ? (
          <div style={{ border: "1px dashed var(--border-2)", borderRadius: 12, padding: "60px 32px", textAlign: "center" }}>
            <CheckCircle2 size={28} style={{ color: "#22c55e", marginBottom: 16 }} />
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No pending actions — all caught up.</p>
          </div>
        ) : (
          <>
            {/* Stats + filters */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
              {[
                { key: "ALL",  label: `All ${actions.length}` },
                { key: "HIGH", label: `${highCount} High impact` },
                { key: "EASY", label: `${easyCount} Quick wins` },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as typeof filter)}
                  style={{
                    padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500,
                    cursor: "pointer",
                    background: filter === key ? "#1d4ed8" : "var(--surface)",
                    color:      filter === key ? "#fff"    : "var(--text-muted)",
                    border:     filter === key ? "none"    : "1px solid var(--border-2)",
                  }}
                >
                  {label}
                </button>
              ))}

              {/* Summary chips */}
              <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
                {autoCount > 0 && (
                  <span style={{ fontSize: 11, color: "#22c55e", display: "flex", alignItems: "center", gap: 4 }}>
                    <Zap size={11} /> {autoCount} automatable
                  </span>
                )}
                {escalCount > 0 && (
                  <span style={{ fontSize: 11, color: "#f97316", display: "flex", alignItems: "center", gap: 4 }}>
                    <AlertTriangle size={11} /> {escalCount} need client
                  </span>
                )}
                <span style={{ fontSize: 11, color: "var(--text-faint)", display: "flex", alignItems: "center", gap: 4 }}>
                  <Clock size={11} /> Work through top to bottom
                </span>
              </div>
            </div>

            {/* Action list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filtered.map(action => (
                <ActionCard
                  key={action.id}
                  action={action}
                  onDismiss={id => patch(id, "DISMISSED")}
                  onApprove={id => patch(id, "APPROVED")}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
