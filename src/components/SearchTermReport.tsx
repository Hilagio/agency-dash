"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Loader2, RefreshCw, AlertTriangle, Eye, CheckCircle2,
  Ban, X, ChevronDown, ChevronUp,
} from "lucide-react";

interface SearchTermRow {
  searchTerm:     string;
  campaignId:     string;
  campaignName:   string;
  clicks:         number;
  conversions:    number;
  costEur:        number;
  source:         "search" | "pmax";
  recommendation: "EXCLUDE" | "WATCH" | "KEEP";
}

interface Campaign {
  id:         string;
  name:       string;
  source:     "search" | "pmax";
  terms:      SearchTermRow[];
  wastedCost: number;
}

// Unique key for a (campaign, term) pair — used for checkbox state
function termKey(row: SearchTermRow) {
  return `${row.campaignId}::${row.searchTerm}`;
}

const REC_STYLE: Record<string, { bg: string; border: string; color: string; label: string }> = {
  EXCLUDE: { bg: "rgba(239,68,68,0.07)",  border: "rgba(239,68,68,0.2)",  color: "#ef4444", label: "Exclude" },
  WATCH:   { bg: "rgba(234,179,8,0.07)",  border: "rgba(234,179,8,0.2)",  color: "#ca8a04", label: "Watch"   },
  KEEP:    { bg: "rgba(34,197,94,0.07)",  border: "rgba(34,197,94,0.2)",  color: "#16a34a", label: "Keep"    },
};

// ─── Push preview modal ───────────────────────────────────────────────────────

interface PushModalProps {
  selectedRows: SearchTermRow[];
  accountId:    string;
  onClose:      () => void;
  onSuccess:    (pushed: number) => void;
}

function PushModal({ selectedRows, accountId, onClose, onSuccess }: PushModalProps) {
  const [pushing, setPushing]   = useState(false);
  const [result,  setResult]    = useState<{ pushed: number; skipped: number; log: string[] } | null>(null);
  const [error,   setError]     = useState<string | null>(null);

  // Auto-close 2 s after a successful push so the user sees the updated list
  useEffect(() => {
    if (!result || result.pushed === 0) return;
    const t = setTimeout(onClose, 2000);
    return () => clearTimeout(t);
  }, [result, onClose]);

  // Group by campaign for display
  const byCampaign = new Map<string, { name: string; source: string; terms: SearchTermRow[] }>();
  for (const row of selectedRows) {
    if (!byCampaign.has(row.campaignId)) {
      byCampaign.set(row.campaignId, { name: row.campaignName, source: row.source, terms: [] });
    }
    byCampaign.get(row.campaignId)!.terms.push(row);
  }

  const push = async () => {
    setPushing(true);
    setError(null);
    try {
      const res = await fetch(`/api/accounts/${accountId}/push-negatives`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          terms: selectedRows.map(r => ({
            searchTerm: r.searchTerm,
            campaignId: r.campaignId,
            source:     r.source,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Push failed");
      setResult(data);
      onSuccess(data.pushed);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setPushing(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.6)",
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 16, padding: "28px 32px", width: 560, maxHeight: "80vh",
        overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>
              Push {selectedRows.length} negative{selectedRows.length !== 1 ? "s" : ""} to Google Ads
            </div>
            <div style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 3 }}>
              All terms will be added as <strong style={{ color: "var(--text-dim)" }}>EXACT match</strong> negatives — safe for both Search and PMax
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-faint)", display: "flex" }}>
            <X size={16} />
          </button>
        </div>

        {/* Result state */}
        {result ? (
          <div>
            <div style={{
              background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)",
              borderRadius: 10, padding: "16px 20px", marginBottom: 16,
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#22c55e", marginBottom: 4 }}>
                {result.pushed} negative{result.pushed !== 1 ? "s" : ""} added successfully
                {result.skipped > 0 && ` · ${result.skipped} already existed`}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-faint)", lineHeight: 1.7 }}>
                {result.log.map((l, i) => <div key={i}>{l}</div>)}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: "100%", padding: "10px", borderRadius: 8,
                background: "var(--bg)", border: "1px solid var(--border-2)",
                color: "var(--text-dim)", fontSize: 13, cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Live account warning */}
            <div style={{
              background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.25)",
              borderRadius: 9, padding: "10px 14px", marginBottom: 16,
              display: "flex", alignItems: "flex-start", gap: 10,
            }}>
              <AlertTriangle size={14} style={{ color: "#ca8a04", flexShrink: 0, marginTop: 1 }} />
              <div style={{ fontSize: 12, color: "#92400e", lineHeight: 1.6 }}>
                <strong style={{ color: "#ca8a04" }}>Dit wordt direct doorgevoerd in het live Google Ads account.</strong>
                {" "}Er is geen undo — controleer de selectie zorgvuldig voor je bevestigt.
                EXACT-match negatieven blokkeren alleen exact deze zoektermen; verwante of converterende varianten blijven gewoon lopen.
              </div>
            </div>

            {/* Preview: grouped by campaign */}
            <div style={{ marginBottom: 20 }}>
              {[...byCampaign.entries()].map(([campId, camp]) => (
                <div key={campId} style={{
                  border: "1px solid var(--border)", borderRadius: 10,
                  overflow: "hidden", marginBottom: 10,
                }}>
                  <div style={{
                    padding: "8px 14px", background: "var(--bg)",
                    borderBottom: "1px solid var(--border)",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)" }}>{camp.name}</span>
                    {camp.source === "pmax" && (
                      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.4px", textTransform: "uppercase", background: "rgba(139,92,246,0.12)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.25)", padding: "1px 6px", borderRadius: 10 }}>PMax</span>
                    )}
                    <span style={{ fontSize: 11, color: "var(--text-faint)", marginLeft: "auto" }}>{camp.terms.length} term{camp.terms.length !== 1 ? "s" : ""}</span>
                  </div>
                  <div style={{ padding: "8px 14px", display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {camp.terms.map(t => (
                      <span key={t.searchTerm} style={{
                        fontSize: 11, fontFamily: "monospace",
                        background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)",
                        color: "#ef4444", padding: "2px 8px", borderRadius: 5,
                      }}>
                        [{t.searchTerm}]
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div style={{
                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 8, padding: "10px 14px", marginBottom: 14,
                fontSize: 12, color: "#ef4444",
              }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1, padding: "10px", borderRadius: 8,
                  background: "none", border: "1px solid var(--border-2)",
                  color: "var(--text-dim)", fontSize: 13, cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={push}
                disabled={pushing}
                style={{
                  flex: 2, padding: "10px", borderRadius: 8,
                  background: pushing ? "rgba(239,68,68,0.4)" : "#dc2626",
                  border: "none", color: "#fff", fontSize: 13,
                  fontWeight: 600, cursor: pushing ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                {pushing
                  ? <><Loader2 size={13} className="animate-spin" /> Pushing to Google Ads…</>
                  : <><Ban size={13} /> Confirm &amp; push negatives</>}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function SearchTermReport({ accountId }: { accountId: string }) {
  const [rows,     setRows]     = useState<SearchTermRow[] | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [filter,   setFilter]   = useState<"EXCLUDE" | "WATCH" | "KEEP" | "ALL">("EXCLUDE");

  // Selection state: set of "campaignId::searchTerm" keys
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);

  // Per-campaign collapse state
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSelected(new Set());
    try {
      const res = await fetch(`/api/accounts/${accountId}/search-terms`);
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error ?? "Failed to load");
      }
      setRows(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "60px 0", justifyContent: "center", color: "var(--text-dim)", fontSize: 13 }}>
        <Loader2 size={16} className="animate-spin" /> Fetching search terms from Google Ads…
      </div>
    );
  }
  if (error) {
    return (
      <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 10, padding: "16px 20px" }}>
        <p style={{ fontSize: 13, color: "#ef4444", marginBottom: 8 }}>{error}</p>
        <button onClick={load} style={{ fontSize: 12, color: "var(--text-dim)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Retry</button>
      </div>
    );
  }
  if (!rows) return null;

  // Derived stats
  const excludeRows = rows.filter(r => r.recommendation === "EXCLUDE");
  const watchRows   = rows.filter(r => r.recommendation === "WATCH");
  const keepRows    = rows.filter(r => r.recommendation === "KEEP");
  const hasPmax     = rows.some(r => r.source === "pmax");
  const wastedTotal = excludeRows.filter(r => r.source === "search").reduce((s, r) => s + r.costEur, 0);

  // Filtered + grouped
  const byFilter     = filter === "ALL" ? rows : rows.filter(r => r.recommendation === filter);
  const campaigns    = new Map<string, Campaign>();
  for (const row of byFilter) {
    if (!campaigns.has(row.campaignId)) {
      campaigns.set(row.campaignId, { id: row.campaignId, name: row.campaignName, source: row.source, terms: [], wastedCost: 0 });
    }
    const camp = campaigns.get(row.campaignId)!;
    camp.terms.push(row);
    if (row.recommendation === "EXCLUDE") camp.wastedCost += row.costEur;
  }
  const campaignList = [...campaigns.values()].sort((a, b) => b.wastedCost - a.wastedCost);

  // Selectable rows = only EXCLUDE-recommended terms in current view
  const selectableRows = byFilter.filter(r => r.recommendation === "EXCLUDE");
  const allSelectableKeys = new Set(selectableRows.map(termKey));
  const selectedInView = [...selected].filter(k => allSelectableKeys.has(k));
  const allSelected = allSelectableKeys.size > 0 && selectedInView.length === allSelectableKeys.size;

  const toggleTerm = (row: SearchTermRow) => {
    const key = termKey(row);
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelected(prev => {
        const next = new Set(prev);
        allSelectableKeys.forEach(k => next.delete(k));
        return next;
      });
    } else {
      setSelected(prev => new Set([...prev, ...allSelectableKeys]));
    }
  };

  const selectedRows = rows.filter(r => selected.has(termKey(r)));

  const toggleCollapse = (campId: string) => {
    setCollapsed(prev => {
      const next = new Set(prev);
      if (next.has(campId)) next.delete(campId); else next.add(campId);
      return next;
    });
  };

  return (
    <div>
      {/* Summary strip */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 12 }}>
          {[
            { rec: "EXCLUDE" as const, count: excludeRows.length, extra: wastedTotal > 0 ? `€${wastedTotal.toFixed(0)} wasted (Search)` : "0 conversions, high clicks" },
            { rec: "WATCH"   as const, count: watchRows.length,   extra: "accumulating spend or clicks" },
            { rec: "KEEP"    as const, count: keepRows.length,     extra: "converting or low volume" },
          ].map(({ rec, count, extra }) => {
            const s = REC_STYLE[rec];
            return (
              <button
                key={rec}
                onClick={() => { setFilter(f => f === rec ? "ALL" : rec); setSelected(new Set()); }}
                style={{
                  display: "flex", flexDirection: "column", gap: 2,
                  background: filter === rec ? s.bg : "var(--surface)",
                  border: `1px solid ${filter === rec ? s.border : "var(--border)"}`,
                  borderRadius: 8, padding: "10px 16px", cursor: "pointer", textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {rec === "EXCLUDE" && <AlertTriangle size={12} style={{ color: s.color }} />}
                  {rec === "WATCH"   && <Eye            size={12} style={{ color: s.color }} />}
                  {rec === "KEEP"    && <CheckCircle2   size={12} style={{ color: s.color }} />}
                  <span style={{ fontSize: 18, fontWeight: 800, color: s.color, letterSpacing: "-0.8px" }}>{count}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: s.color }}>{s.label}</span>
                </div>
                <div style={{ fontSize: 10, color: "var(--text-faint)" }}>{extra}</div>
              </button>
            );
          })}
        </div>

        <button
          onClick={load}
          style={{
            marginLeft: "auto", display: "flex", alignItems: "center", gap: 6,
            background: "var(--surface)", border: "1px solid var(--border-2)",
            borderRadius: 7, color: "var(--text-dim)", fontSize: 11, padding: "6px 12px", cursor: "pointer",
          }}
        >
          <RefreshCw size={11} /> Refresh
        </button>
      </div>

      {/* Info banners */}
      {wastedTotal > 0 && filter !== "KEEP" && (
        <div style={{
          background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)",
          borderRadius: 8, padding: "10px 16px", marginBottom: 12,
          fontSize: 12, color: "#ef4444", display: "flex", alignItems: "center", gap: 8,
        }}>
          <AlertTriangle size={13} />
          <strong>€{wastedTotal.toFixed(2)}</strong> spent on Search / Shopping queries with zero conversions.
        </div>
      )}
      {hasPmax && filter !== "KEEP" && (
        <div style={{
          background: "rgba(234,179,8,0.05)", border: "1px solid rgba(234,179,8,0.15)",
          borderRadius: 8, padding: "10px 16px", marginBottom: 16,
          fontSize: 12, color: "#ca8a04", display: "flex", alignItems: "center", gap: 8,
        }}>
          <Eye size={13} />
          PMax terms tonen alleen clicks &amp; conversies — Google geeft geen kosten per zoekterm voor PMax. EXACT-match negatieven werken wel.
        </div>
      )}

      {/* Selection toolbar */}
      {selectableRows.length > 0 && (
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 9, padding: "8px 14px", marginBottom: 12,
        }}>
          {/* Select-all checkbox */}
          <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", userSelect: "none" }}>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              style={{ width: 14, height: 14, accentColor: "#ef4444", cursor: "pointer" }}
            />
            <span style={{ fontSize: 12, color: "var(--text-dim)" }}>
              {allSelected ? "Deselect all" : `Select all ${selectableRows.length} Exclude terms`}
            </span>
          </label>

          {selected.size > 0 && (
            <>
              <span style={{ fontSize: 12, color: "var(--text-faint)" }}>
                {selected.size} selected
              </span>
              <button
                onClick={() => setShowModal(true)}
                style={{
                  marginLeft: "auto",
                  display: "flex", alignItems: "center", gap: 6,
                  background: "#dc2626", border: "none", borderRadius: 7,
                  color: "#fff", fontSize: 12, fontWeight: 600,
                  padding: "6px 14px", cursor: "pointer",
                }}
              >
                <Ban size={12} /> Push {selected.size} as EXACT negative{selected.size !== 1 ? "s" : ""}
              </button>
              <button
                onClick={() => setSelected(new Set())}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-faint)", display: "flex" }}
              >
                <X size={13} />
              </button>
            </>
          )}
        </div>
      )}

      {campaignList.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-faint)", fontSize: 13 }}>
          No search terms match this filter.
        </div>
      )}

      {/* Per-campaign tables */}
      {campaignList.map(campaign => {
        const isCollapsed = collapsed.has(campaign.id);
        const campSelectableKeys = new Set(
          campaign.terms.filter(t => t.recommendation === "EXCLUDE").map(termKey)
        );
        const campSelectedCount = [...selected].filter(k => campSelectableKeys.has(k)).length;
        const campAllSelected = campSelectableKeys.size > 0 && campSelectedCount === campSelectableKeys.size;

        const toggleCampAll = () => {
          if (campAllSelected) {
            setSelected(prev => { const n = new Set(prev); campSelectableKeys.forEach(k => n.delete(k)); return n; });
          } else {
            setSelected(prev => new Set([...prev, ...campSelectableKeys]));
          }
        };

        return (
          <div key={campaign.id} style={{
            border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", marginBottom: 16,
          }}>
            {/* Campaign header */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 16px", background: "var(--surface)",
              borderBottom: isCollapsed ? "none" : "1px solid var(--border)",
            }}>
              {/* Campaign-level select-all */}
              {campSelectableKeys.size > 0 && (
                <input
                  type="checkbox"
                  checked={campAllSelected}
                  onChange={toggleCampAll}
                  style={{ width: 13, height: 13, accentColor: "#ef4444", cursor: "pointer", flexShrink: 0 }}
                />
              )}
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}>{campaign.name}</span>
              {campaign.source === "pmax" && (
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.4px", textTransform: "uppercase", background: "rgba(139,92,246,0.12)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.25)", padding: "1px 6px", borderRadius: 10 }}>PMax</span>
              )}
              {campaign.wastedCost > 0 && (
                <span style={{ fontSize: 11, color: "#ef4444" }}>€{campaign.wastedCost.toFixed(2)} wasted</span>
              )}
              {campSelectedCount > 0 && (
                <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 600 }}>
                  {campSelectedCount} selected
                </span>
              )}
              <button
                onClick={() => toggleCollapse(campaign.id)}
                style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "var(--text-faint)", display: "flex" }}
              >
                {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </button>
            </div>

            {!isCollapsed && (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <th style={{ width: 32, padding: "6px 8px 6px 16px" }} />
                    {["Search term", "Clicks", "Conv.", "Spend", "Status"].map((h, i) => (
                      <th key={i} style={{
                        fontSize: 10, fontWeight: 600, color: "var(--text-faint)",
                        letterSpacing: "0.5px", textTransform: "uppercase",
                        padding: "6px 16px 6px 8px", textAlign: i === 0 ? "left" : "right",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {campaign.terms.map((row, i) => {
                    const s   = REC_STYLE[row.recommendation];
                    const key = termKey(row);
                    const isSelected   = selected.has(key);
                    const isSelectable = row.recommendation === "EXCLUDE";

                    return (
                      <tr
                        key={i}
                        onClick={() => isSelectable && toggleTerm(row)}
                        style={{
                          borderBottom: "1px solid var(--border)",
                          background: isSelected
                            ? "rgba(239,68,68,0.06)"
                            : i % 2 === 0 ? "var(--bg)" : "var(--surface)",
                          cursor: isSelectable ? "pointer" : "default",
                        }}
                      >
                        <td style={{ padding: "8px 8px 8px 16px" }}>
                          {isSelectable && (
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleTerm(row)}
                              onClick={e => e.stopPropagation()}
                              style={{ width: 13, height: 13, accentColor: "#ef4444", cursor: "pointer" }}
                            />
                          )}
                        </td>
                        <td style={{ padding: "8px 8px", fontSize: 12, color: "var(--text-2)", fontFamily: "monospace" }}>
                          {row.searchTerm}
                        </td>
                        <td style={{ padding: "8px 8px", fontSize: 12, color: "var(--text-muted)", textAlign: "right" }}>
                          {row.clicks}
                        </td>
                        <td style={{ padding: "8px 8px", fontSize: 12, textAlign: "right",
                          color: row.conversions > 0 ? "#22c55e" : "var(--text-faint)",
                          fontWeight: row.conversions > 0 ? 600 : 400,
                        }}>
                          {row.conversions > 0 ? row.conversions.toFixed(1) : "—"}
                        </td>
                        <td style={{ padding: "8px 8px", fontSize: 12, textAlign: "right",
                          color: row.source === "pmax" ? "var(--text-faint)" : row.recommendation === "EXCLUDE" ? "#ef4444" : "var(--text-muted)",
                          fontWeight: row.source !== "pmax" && row.recommendation === "EXCLUDE" ? 600 : 400,
                          fontStyle: row.source === "pmax" ? "italic" : "normal",
                        }}>
                          {row.source === "pmax" ? "—" : `€${row.costEur.toFixed(2)}`}
                        </td>
                        <td style={{ padding: "8px 16px 8px 8px", textAlign: "right" }}>
                          <span style={{
                            fontSize: 10, fontWeight: 600, letterSpacing: "0.3px",
                            background: s.bg, color: s.color, border: `1px solid ${s.border}`,
                            padding: "2px 8px", borderRadius: 20,
                          }}>
                            {s.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        );
      })}

      {/* Push modal */}
      {showModal && (
        <PushModal
          selectedRows={selectedRows}
          accountId={accountId}
          onClose={() => setShowModal(false)}
          onSuccess={(pushed) => {
            if (pushed > 0) {
              // Optimistically remove the successfully-pushed terms from local state.
              // Google Ads marks them EXCLUDED so they won't appear on next fetch either.
              const pushedKeys = new Set(selectedRows.map(termKey));
              setRows(prev => prev ? prev.filter(r => !pushedKeys.has(termKey(r))) : null);
            }
            setTimeout(() => setSelected(new Set()), 800);
          }}
        />
      )}
    </div>
  );
}
