"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2, RefreshCw, Printer, FileText, AlertTriangle } from "lucide-react";

interface SavedPlan {
  id:         string;
  createdAt:  string;
  content:    string;
  snapshotId: string | null;
}

// ─── Minimal markdown renderer ────────────────────────────────────────────────
// Handles the specific structure produced by the action plan prompt.

function renderMarkdown(md: string): React.ReactNode[] {
  const lines  = md.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // h1
    if (line.startsWith("# ")) {
      nodes.push(
        <h1 key={i} style={{
          fontSize: 22, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.5px",
          margin: "32px 0 10px", paddingBottom: 10,
          borderBottom: "2px solid var(--accent)",
          lineHeight: 1.3,
        }}>
          {inlineRender(line.slice(2))}
        </h1>
      );
      i++; continue;
    }

    // h2
    if (line.startsWith("## ")) {
      nodes.push(
        <h2 key={i} style={{
          fontSize: 16, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.3px",
          margin: "24px 0 8px", lineHeight: 1.4,
        }}>
          {inlineRender(line.slice(3))}
        </h2>
      );
      i++; continue;
    }

    // h3
    if (line.startsWith("### ")) {
      nodes.push(
        <h3 key={i} style={{
          fontSize: 14, fontWeight: 600, color: "var(--text-2)", letterSpacing: "-0.2px",
          margin: "18px 0 6px", lineHeight: 1.4,
        }}>
          {inlineRender(line.slice(4))}
        </h3>
      );
      i++; continue;
    }

    // Horizontal rule
    if (line.startsWith("---")) {
      nodes.push(<hr key={i} style={{ border: "none", borderTop: "1px solid var(--border)", margin: "28px 0" }} />);
      i++; continue;
    }

    // Table (pipe syntax)
    if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      nodes.push(<MarkdownTable key={`tbl-${i}`} lines={tableLines} />);
      continue;
    }

    // Bullet list
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        items.push(lines[i].slice(2));
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`} style={{ margin: "8px 0 12px", paddingLeft: 20 }}>
          {items.map((item, j) => (
            <li key={j} style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7, marginBottom: 3 }}>
              {inlineRender(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      nodes.push(
        <ol key={`ol-${i}`} style={{ margin: "8px 0 12px", paddingLeft: 24 }}>
          {items.map((item, j) => (
            <li key={j} style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7, marginBottom: 4 }}>
              {inlineRender(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Empty line
    if (!line.trim()) { i++; continue; }

    // Paragraph
    nodes.push(
      <p key={i} style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.75, margin: "0 0 10px" }}>
        {inlineRender(line)}
      </p>
    );
    i++;
  }

  return nodes;
}

function MarkdownTable({ lines }: { lines: string[] }) {
  const rows = lines
    .filter(l => !l.match(/^\|[\s:|-]+\|$/)) // skip separator rows
    .map(l =>
      l.split("|")
        .slice(1, -1)
        .map(cell => cell.trim())
    );

  if (rows.length === 0) return null;
  const [header, ...body] = rows;

  return (
    <div style={{ overflowX: "auto", margin: "12px 0 20px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            {header.map((cell, i) => (
              <th key={i} style={{
                padding: "8px 12px", textAlign: "left", fontWeight: 600,
                fontSize: 11, letterSpacing: "0.4px", textTransform: "uppercase",
                color: "var(--text-dim)", borderBottom: "2px solid var(--border-3)",
                background: "var(--surface-2)", whiteSpace: "nowrap",
              }}>
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri} style={{ borderBottom: "1px solid var(--border)" }}>
              {row.map((cell, ci) => (
                <td key={ci} style={{
                  padding: "9px 12px", fontSize: 13, color: "var(--text-2)", lineHeight: 1.5,
                  fontWeight: ci === 0 ? 600 : 400,
                }}>
                  {inlineRender(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function inlineRender(text: string): React.ReactNode {
  // Bold: **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  if (parts.length === 1) return text;
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**")
          ? <strong key={i} style={{ fontWeight: 700, color: "var(--text)" }}>{part.slice(2, -2)}</strong>
          : part
      )}
    </>
  );
}

// ─── Print styles injected dynamically ────────────────────────────────────────

const PRINT_STYLE = `
@media print {
  body > * { display: none !important; }
  body > #__next { display: block !important; }
  #action-plan-print-root { display: block !important; }
  #action-plan-print-root .no-print { display: none !important; }
  #action-plan-print-root .plan-content { max-width: 100% !important; padding: 0 !important; }
  h1 { font-size: 18pt !important; }
  h2 { font-size: 13pt !important; }
  h3 { font-size: 11pt !important; }
  p, li, td, th { font-size: 10pt !important; }
  table { page-break-inside: avoid; }
  h1, h2, h3 { page-break-after: avoid; }
}
`;

// ─── Main component ───────────────────────────────────────────────────────────

export function ActionPlanTab({ accountId, accountName }: {
  accountId:   string;
  accountName: string;
}) {
  const [plan, setPlan]         = useState<SavedPlan | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const abortRef = useRef<AbortController | null>(null);

  // Inject print styles once
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = PRINT_STYLE;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  // Load existing plan on mount
  const loadPlan = useCallback(async () => {
    setLoadingPlan(true);
    try {
      const res = await fetch(`/api/accounts/${accountId}/action-plan`);
      if (res.ok) {
        const data = await res.json();
        setPlan(data);
      }
    } finally {
      setLoadingPlan(false);
    }
  }, [accountId]);

  useEffect(() => { loadPlan(); }, [loadPlan]);

  const generate = async () => {
    setStreaming(true);
    setStreamedText("");
    setError(null);
    abortRef.current = new AbortController();

    try {
      const res = await fetch(`/api/accounts/${accountId}/action-plan`, {
        method: "POST",
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "Failed to generate plan.");
        setStreaming(false);
        return;
      }

      const reader  = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer    = "";
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const payload = JSON.parse(line.slice(6));
            if (payload.error) { setError(payload.error); break; }
            if (payload.text)  { accumulated += payload.text; setStreamedText(t => t + payload.text); }
            if (payload.done)  {
              // Reload from DB to get the persisted record
              await loadPlan();
              setStreamedText("");
            }
          } catch { /* malformed chunk */ }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError(err instanceof Error ? err.message : "Generation failed");
      }
    } finally {
      setStreaming(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const displayContent = streaming ? streamedText : (plan?.content ?? null);

  return (
    <div id="action-plan-print-root" style={{ minHeight: 400 }}>

      {/* Toolbar */}
      <div className="no-print" style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 20, flexWrap: "wrap", gap: 10,
      }}>
        <div>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", color: "var(--text-dim)" }}>
            Action Plan
          </span>
          {plan && (
            <span style={{ fontSize: 11, color: "var(--text-faint)", marginLeft: 10 }}>
              Generated {new Date(plan.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          )}
          {streaming && (
            <span style={{ fontSize: 11, color: "var(--accent)", marginLeft: 10, display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Loader2 size={11} className="animate-spin" /> Generating…
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {displayContent && !streaming && (
            <button
              onClick={handlePrint}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                background: "transparent", border: "1px solid var(--border-2)",
                borderRadius: 7, color: "var(--text-dim)", fontSize: 12, fontWeight: 500,
                padding: "7px 12px", cursor: "pointer",
              }}
            >
              <Printer size={13} /> Print / Save PDF
            </button>
          )}
          <button
            onClick={generate}
            disabled={streaming}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              background: streaming ? "var(--surface-2)" : "var(--btn-primary)",
              border: "none", borderRadius: 7,
              color: streaming ? "var(--text-muted)" : "#fff",
              fontSize: 12, fontWeight: 600, padding: "7px 14px",
              cursor: streaming ? "not-allowed" : "pointer",
            }}
          >
            {streaming
              ? <><Loader2 size={12} className="animate-spin" /> Generating…</>
              : plan
                ? <><RefreshCw size={12} /> Regenerate</>
                : <><FileText size={12} /> Generate Plan</>
            }
          </button>
        </div>
      </div>

      {/* Print header (only visible when printing) */}
      <div style={{ display: "none" }} className="print-only">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Performance Action Plan
            </div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{accountName}</div>
          </div>
          {plan && (
            <div style={{ fontSize: 11, color: "#999", textAlign: "right" }}>
              Generated {new Date(plan.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: 8, padding: "12px 16px", marginBottom: 16,
          display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#ef4444",
        }}>
          <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
          {error}
        </div>
      )}

      {/* Empty state */}
      {!displayContent && !streaming && !error && (
        <div style={{
          border: "1px dashed var(--border-3)", borderRadius: 12,
          padding: "60px 32px", textAlign: "center",
        }}>
          {loadingPlan ? (
            <Loader2 size={18} className="animate-spin" style={{ color: "var(--text-dim)", margin: "0 auto" }} />
          ) : (
            <>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
              <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>
                No action plan yet
              </p>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20, maxWidth: 380, margin: "0 auto 20px" }}>
                Generate a 30 & 90 day action plan based on this account&apos;s diagnostic scores, KPIs, and current performance data.
              </p>
              <button
                onClick={generate}
                style={{
                  background: "var(--btn-primary)", border: "none", borderRadius: 8,
                  color: "#fff", fontSize: 13, fontWeight: 600, padding: "10px 20px",
                  cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
                }}
              >
                <FileText size={14} /> Generate Plan
              </button>
            </>
          )}
        </div>
      )}

      {/* Plan content */}
      {displayContent && (
        <div className="plan-content" style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 12, padding: "32px 40px", maxWidth: 820,
        }}>
          {/* Print-only header */}
          <div style={{ display: "none" }}>
            <style>{`@media print { .print-header { display: block !important; } }`}</style>
            <div className="print-header" style={{ borderBottom: "2px solid #4f46e5", paddingBottom: 20, marginBottom: 32 }}>
              <div style={{ fontSize: 10, color: "#666", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>
                Google Ads Performance Plan
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#09090b" }}>{accountName}</div>
              {plan && (
                <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>
                  {new Date(plan.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </div>
              )}
            </div>
          </div>

          {renderMarkdown(displayContent)}

          {streaming && (
            <span style={{
              display: "inline-block", width: 2, height: 16,
              background: "var(--accent)", borderRadius: 1,
              animation: "blink 1s step-end infinite",
              marginLeft: 2, verticalAlign: "middle",
            }} />
          )}
        </div>
      )}
    </div>
  );
}
