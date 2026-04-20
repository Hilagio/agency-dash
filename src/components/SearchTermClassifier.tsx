"use client";

import { useState } from "react";
import { Loader2, Brain, CheckSquare, Square, XCircle } from "lucide-react";
import type { ClassifiedTerm, QueryCategory } from "@/app/api/accounts/[id]/search-terms/classify/route";

const CATEGORY_COLORS: Record<QueryCategory, string> = {
  "Off-Brand":   "#f87171",
  "Low Intent":  "#fbbf24",
  "Informational": "#60a5fa",
  "High Intent": "#4ade80",
};

const CATEGORY_ORDER: QueryCategory[] = ["Off-Brand", "Low Intent", "Informational", "High Intent"];

export function SearchTermClassifier({
  accountId,
  onClose,
}: {
  accountId: string;
  onClose: () => void;
}) {
  const [terms, setTerms]         = useState<ClassifiedTerm[]>([]);
  const [loading, setLoading]     = useState(false);
  const [executing, setExecuting] = useState(false);
  const [message, setMessage]     = useState<string | null>(null);
  const [error, setError]         = useState<string | null>(null);
  const [selected, setSelected]   = useState<Set<string>>(new Set());
  const [filter, setFilter]       = useState<QueryCategory | "all">("all");

  async function runClassifier() {
    setLoading(true);
    setError(null);
    setMessage(null);
    setTerms([]);
    setSelected(new Set());
    try {
      const res  = await fetch(`/api/accounts/${accountId}/search-terms/classify`);
      const json = await res.json() as { terms?: ClassifiedTerm[]; message?: string; error?: string };
      if (json.error) { setError(json.error); return; }
      if (json.message) { setMessage(json.message); return; }
      setTerms(json.terms ?? []);
      // Pre-select Off-Brand + Low Intent by default
      const autoSelect = new Set((json.terms ?? [])
        .filter(t => t.category === "Off-Brand" || t.category === "Low Intent")
        .map(t => t.term));
      setSelected(autoSelect);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  async function addAsNegatives() {
    if (selected.size === 0) return;
    setExecuting(true);
    try {
      const res  = await fetch(`/api/accounts/${accountId}/search-terms/exclude-offbrand`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ terms: [...selected] }),
      });
      const json = await res.json() as { result?: string; error?: string };
      if (json.error) { setError(json.error); return; }
      setMessage(json.result ?? "Negatives added successfully.");
      setTerms(prev => prev.filter(t => !selected.has(t.term)));
      setSelected(new Set());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setExecuting(false);
    }
  }

  const visible = filter === "all" ? terms : terms.filter(t => t.category === filter);

  const categoryCounts = CATEGORY_ORDER.reduce<Record<string, number>>((acc, cat) => {
    acc[cat] = terms.filter(t => t.category === cat).length;
    return acc;
  }, {});

  function toggleAll(cat?: QueryCategory) {
    const pool = cat ? terms.filter(t => t.category === cat) : terms;
    const allSelected = pool.every(t => selected.has(t.term));
    setSelected(prev => {
      const next = new Set(prev);
      for (const t of pool) {
        if (allSelected) next.delete(t.term);
        else next.add(t.term);
      }
      return next;
    });
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <div style={{
        background: "var(--bg)", border: "1px solid var(--border)",
        borderRadius: 14, width: "100%", maxWidth: 780,
        maxHeight: "90vh", display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px", borderBottom: "1px solid var(--border)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Brain size={16} style={{ color: "var(--text-muted)" }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Search Query Classifier</span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-faint)" }}>
            <XCircle size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: "auto", padding: "16px 20px" }}>
          {terms.length === 0 && !loading && !message && (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
                Fetches the top 100 zero-conversion search terms from the last 30 days and classifies each by intent using AI.
                Off-Brand and Low Intent terms are pre-selected for exclusion.
              </p>
              <button
                onClick={runClassifier}
                style={{
                  background: "var(--accent)", color: "#fff", border: "none",
                  borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Run Classifier
              </button>
            </div>
          )}

          {loading && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "48px 0", color: "var(--text-dim)", fontSize: 13 }}>
              <Loader2 size={16} className="animate-spin" />
              Fetching search terms and classifying with AI…
            </div>
          )}

          {error && (
            <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#f87171" }}>
              {error}
            </div>
          )}

          {message && (
            <div style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#4ade80" }}>
              {message}
            </div>
          )}

          {terms.length > 0 && (
            <>
              {/* Category filter tabs */}
              <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
                <FilterTab label={`All (${terms.length})`} active={filter === "all"} color="var(--text-muted)" onClick={() => setFilter("all")} />
                {CATEGORY_ORDER.map(cat => (
                  <FilterTab
                    key={cat}
                    label={`${cat} (${categoryCounts[cat] ?? 0})`}
                    active={filter === cat}
                    color={CATEGORY_COLORS[cat]}
                    onClick={() => setFilter(cat)}
                  />
                ))}
              </div>

              {/* Select all for current filter */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <button
                  onClick={() => toggleAll(filter === "all" ? undefined : filter as QueryCategory)}
                  style={{ fontSize: 11, color: "var(--text-faint)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                >
                  <CheckSquare size={12} />
                  Select all {filter === "all" ? "" : filter}
                </button>
                <span style={{ fontSize: 11, color: "var(--text-faint)" }}>·</span>
                <span style={{ fontSize: 11, color: "var(--text-faint)" }}>{selected.size} selected</span>
              </div>

              {/* Terms table */}
              <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "24px 1fr 110px 70px 60px 55px", gap: 8, padding: "6px 12px", background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
                  {["", "Query", "Category", "Spend", "Clicks", "Conf."].map((h, i) => (
                    <span key={i} style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", color: "var(--text-faint)", textAlign: i > 1 ? "right" : "left" }}>
                      {h}
                    </span>
                  ))}
                </div>
                {visible.map((t, i) => (
                  <div
                    key={t.term}
                    onClick={() => setSelected(prev => {
                      const next = new Set(prev);
                      if (next.has(t.term)) next.delete(t.term);
                      else next.add(t.term);
                      return next;
                    })}
                    style={{
                      display: "grid", gridTemplateColumns: "24px 1fr 110px 70px 60px 55px",
                      gap: 8, padding: "8px 12px", cursor: "pointer",
                      borderBottom: i < visible.length - 1 ? "1px solid var(--border)" : "none",
                      background: selected.has(t.term) ? "rgba(99,102,241,0.05)" : "var(--bg)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {selected.has(t.term)
                        ? <CheckSquare size={13} style={{ color: "var(--accent)" }} />
                        : <Square size={13} style={{ color: "var(--text-faint)" }} />}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.term}</div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{
                        fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4,
                        background: `${CATEGORY_COLORS[t.category]}18`,
                        color: CATEGORY_COLORS[t.category],
                      }}>{t.category}</span>
                    </div>
                    <div style={{ textAlign: "right", fontSize: 12, color: "var(--text-muted)" }}>€{t.spend.toFixed(2)}</div>
                    <div style={{ textAlign: "right", fontSize: 12, color: "var(--text-muted)" }}>{t.clicks}</div>
                    <div style={{ textAlign: "right", fontSize: 11, color: "var(--text-faint)" }}>{t.confidence}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {terms.length > 0 && (
          <div style={{
            padding: "12px 20px", borderTop: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <button
              onClick={runClassifier}
              disabled={loading}
              style={{ fontSize: 12, color: "var(--text-faint)", background: "none", border: "none", cursor: "pointer" }}
            >
              Re-run classifier
            </button>
            <button
              onClick={addAsNegatives}
              disabled={selected.size === 0 || executing}
              style={{
                background: selected.size > 0 ? "#f87171" : "var(--surface)",
                color: selected.size > 0 ? "#fff" : "var(--text-faint)",
                border: "none", borderRadius: 8, padding: "8px 18px",
                fontSize: 12, fontWeight: 600, cursor: selected.size > 0 ? "pointer" : "default",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              {executing && <Loader2 size={12} className="animate-spin" />}
              Add {selected.size > 0 ? selected.size : ""} as negatives
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterTab({ label, active, color, onClick }: { label: string; active: boolean; color: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 11, fontWeight: 500, padding: "4px 10px", borderRadius: 6,
        border: `1px solid ${active ? color : "var(--border-2)"}`,
        background: active ? `${color}12` : "transparent",
        color: active ? color : "var(--text-muted)",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}
