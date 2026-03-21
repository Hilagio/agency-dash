"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Zap, AlertTriangle, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { ConstraintBadge } from "./ConstraintBadge";

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
  executionLog?: string;
}

interface Props {
  actions: Action[];
  onStatusChange?: (id: string, status: "APPROVED" | "DISMISSED") => void;
  onExecute?: (id: string) => void;
}

const IMPACT_STYLE: Record<string, { bg: string; color: string }> = {
  HIGH:   { bg: "rgba(248,113,113,0.1)",  color: "#f87171" },
  MEDIUM: { bg: "rgba(251,191,36,0.1)",   color: "#fbbf24" },
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

export function ActionList({ actions, onStatusChange, onExecute }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [executing, setExecuting] = useState<string | null>(null);

  if (actions.length === 0) {
    return (
      <div style={{
        border: "1px dashed var(--border-2)", borderRadius: 12,
        padding: "40px 32px", textAlign: "center",
        color: "var(--text-very-dim)", fontSize: 13,
      }}>
        No pending actions — account looks healthy.
      </div>
    );
  }

  const handleExecute = async (id: string) => {
    setExecuting(id);
    await onExecute?.(id);
    setExecuting(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {actions.map((action) => {
        const isDone      = action.status === "EXECUTED";
        const isDismissed = action.status === "DISMISSED";
        const isExpanded  = expanded === action.id;

        const borderColor = isDone      ? "rgba(74,222,128,0.2)"
                          : isDismissed ? "var(--border)"
                          : action.isEscalation ? "rgba(251,191,36,0.15)"
                          : "var(--surface-3)";

        const bgColor = isDone      ? "rgba(74,222,128,0.04)"
                      : isDismissed ? "var(--bg-deep)"
                      : action.isEscalation ? "rgba(251,191,36,0.03)"
                      : "var(--surface)";

        return (
          <div
            key={action.id}
            style={{
              background: bgColor,
              border: `1px solid ${borderColor}`,
              borderRadius: 12,
              opacity: isDismissed ? 0.4 : 1,
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
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 6 }}>
                  <ConstraintBadge bucket={action.bucket as Parameters<typeof ConstraintBadge>[0]["bucket"]} />
                  <Pill label={`${action.impact} impact`} style={IMPACT_STYLE[action.impact] ?? IMPACT_STYLE.LOW} />
                  <Pill label={`${action.effort} effort`} style={EFFORT_STYLE[action.effort] ?? EFFORT_STYLE.MEDIUM} />
                  {action.safeToAutomate && (
                    <Pill label="1-click" style={{ bg: "rgba(96,165,250,0.1)", color: "#60a5fa" }} />
                  )}
                  {action.isEscalation && (
                    <Pill label="client escalation" style={{ bg: "rgba(251,191,36,0.1)", color: "#fbbf24" }} />
                  )}
                </div>

                {/* Title */}
                <p style={{ fontSize: 13, fontWeight: 500, color: isDone ? "#4ade80" : isDismissed ? "var(--text-dim)" : "var(--text-2)" }}>
                  {action.title}
                </p>

                {/* Expanded description */}
                {isExpanded && (
                  <p style={{
                    marginTop: 10, fontSize: 12, color: "var(--text-muted)",
                    lineHeight: 1.7,
                    paddingTop: 10, borderTop: "1px solid var(--border)",
                  }}>
                    {action.description}
                  </p>
                )}

                {/* Execution log */}
                {isDone && action.executionLog && isExpanded && (
                  <div style={{
                    marginTop: 8,
                    background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.15)",
                    borderRadius: 8, padding: "8px 12px",
                    fontSize: 11, color: "#4ade80", lineHeight: 1.6,
                  }}>
                    {action.executionLog}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>

                {/* Expand toggle */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : action.id)}
                  style={{
                    background: "transparent", border: "none", cursor: "pointer",
                    color: "var(--text-faint)", padding: 4, borderRadius: 6, display: "flex",
                  }}
                >
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {action.status === "PENDING" && (
                  <>
                    {action.safeToAutomate && (
                      <button
                        onClick={() => onStatusChange?.(action.id, "APPROVED")}
                        style={{
                          background: "#1d4ed8", border: "none", borderRadius: 7,
                          color: "#fff", fontSize: 11, fontWeight: 500,
                          padding: "5px 12px", cursor: "pointer",
                        }}
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => onStatusChange?.(action.id, "DISMISSED")}
                      title="Dismiss"
                      style={{
                        background: "transparent", border: "none", cursor: "pointer",
                        color: "var(--text-faint)", padding: 4, borderRadius: 6, display: "flex",
                      }}
                    >
                      <XCircle size={14} />
                    </button>
                  </>
                )}

                {action.status === "APPROVED" && action.safeToAutomate && (
                  <button
                    onClick={() => handleExecute(action.id)}
                    disabled={executing === action.id}
                    style={{
                      display: "flex", alignItems: "center", gap: 5,
                      background: "rgba(74,222,128,0.15)",
                      border: "1px solid rgba(74,222,128,0.25)",
                      borderRadius: 7, color: "#4ade80",
                      fontSize: 11, fontWeight: 600,
                      padding: "5px 12px", cursor: executing === action.id ? "not-allowed" : "pointer",
                      opacity: executing === action.id ? 0.6 : 1,
                    }}
                  >
                    {executing === action.id
                      ? <><Loader2 size={10} className="animate-spin" /> Running…</>
                      : <><Zap size={10} /> Execute</>}
                  </button>
                )}

                {isDone && (
                  <CheckCircle size={14} style={{ color: "#4ade80" }} />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
