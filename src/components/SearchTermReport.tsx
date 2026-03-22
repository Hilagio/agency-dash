"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, RefreshCw, AlertTriangle, Eye, CheckCircle2, Copy, Check } from "lucide-react";

interface SearchTermRow {
  searchTerm:     string;
  campaignId:     string;
  campaignName:   string;
  clicks:         number;
  conversions:    number;
  costEur:        number;
  recommendation: "EXCLUDE" | "WATCH" | "KEEP";
}

interface Campaign {
  id:    string;
  name:  string;
  terms: SearchTermRow[];
  wastedCost: number;
}

const REC_STYLE: Record<string, { bg: string; border: string; color: string; label: string }> = {
  EXCLUDE: { bg: "rgba(239,68,68,0.07)",  border: "rgba(239,68,68,0.2)",  color: "#ef4444", label: "Exclude" },
  WATCH:   { bg: "rgba(234,179,8,0.07)",  border: "rgba(234,179,8,0.2)",  color: "#ca8a04", label: "Watch"   },
  KEEP:    { bg: "rgba(34,197,94,0.07)",  border: "rgba(34,197,94,0.2)",  color: "#16a34a", label: "Keep"    },
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} style={{
      background: "var(--surface-2)", border: "1px solid var(--border-2)",
      borderRadius: 5, padding: "3px 8px", cursor: "pointer",
      display: "flex", alignItems: "center", gap: 4,
      fontSize: 10, color: "var(--text-muted)",
    }}>
      {copied ? <Check size={10} /> : <Copy size={10} />}
      {copied ? "Copied" : "Copy list"}
    </button>
  );
}

export function SearchTermReport({ accountId }: { accountId: string }) {
  const [rows, setRows]       = useState<SearchTermRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [filter, setFilter]   = useState<"EXCLUDE" | "WATCH" | "KEEP" | "ALL">("EXCLUDE");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
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
        <button onClick={load} style={{ fontSize: 12, color: "var(--text-dim)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
          Retry
        </button>
      </div>
    );
  }

  if (!rows) return null;

  // Summary stats
  const excludeRows = rows.filter(r => r.recommendation === "EXCLUDE");
  const watchRows   = rows.filter(r => r.recommendation === "WATCH");
  const keepRows    = rows.filter(r => r.recommendation === "KEEP");
  const wastedTotal = excludeRows.reduce((s, r) => s + r.costEur, 0);

  // Group by campaign
  const byFilter = filter === "ALL" ? rows : rows.filter(r => r.recommendation === filter);
  const campaigns = new Map<string, Campaign>();
  for (const row of byFilter) {
    const key = row.campaignId;
    if (!campaigns.has(key)) {
      campaigns.set(key, { id: key, name: row.campaignName, terms: [], wastedCost: 0 });
    }
    const camp = campaigns.get(key)!;
    camp.terms.push(row);
    if (row.recommendation === "EXCLUDE") camp.wastedCost += row.costEur;
  }

  const campaignList = [...campaigns.values()].sort((a, b) => b.wastedCost - a.wastedCost);

  return (
    <div>
      {/* Summary strip */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 12 }}>
          {[
            { rec: "EXCLUDE" as const, count: excludeRows.length, extra: `€${wastedTotal.toFixed(0)} spent, 0 conv.` },
            { rec: "WATCH"   as const, count: watchRows.length,   extra: "€5–30 spent, worth watching" },
            { rec: "KEEP"    as const, count: keepRows.length,     extra: "converting or minimal spend" },
          ].map(({ rec, count, extra }) => {
            const s = REC_STYLE[rec];
            return (
              <button
                key={rec}
                onClick={() => setFilter(f => f === rec ? "ALL" : rec)}
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

      {wastedTotal > 0 && filter !== "KEEP" && (
        <div style={{
          background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)",
          borderRadius: 8, padding: "10px 16px", marginBottom: 16,
          fontSize: 12, color: "#ef4444", display: "flex", alignItems: "center", gap: 8,
        }}>
          <AlertTriangle size={13} />
          <strong>€{wastedTotal.toFixed(2)}</strong> spent over 90 days on queries with zero conversions and {">"}€30 each.
          Adding these as negative keywords stops future spend immediately.
        </div>
      )}

      {campaignList.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-faint)", fontSize: 13 }}>
          No search terms match this filter.
        </div>
      )}

      {/* Per-campaign tables */}
      {campaignList.map(campaign => {
        const excludeTerms = campaign.terms.filter(t => t.recommendation === "EXCLUDE").map(t => t.searchTerm);
        return (
          <div key={campaign.id} style={{
            border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", marginBottom: 16,
          }}>
            {/* Campaign header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 16px", background: "var(--surface)",
              borderBottom: "1px solid var(--border)",
            }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}>{campaign.name}</span>
                {campaign.wastedCost > 0 && (
                  <span style={{ fontSize: 11, color: "#ef4444", marginLeft: 10 }}>
                    €{campaign.wastedCost.toFixed(2)} wasted
                  </span>
                )}
              </div>
              {excludeTerms.length > 0 && (
                <CopyButton text={excludeTerms.join("\n")} />
              )}
            </div>

            {/* Terms table */}
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Search term", "Clicks", "Conv.", "Spend", "Status"].map((h, i) => (
                    <th key={i} style={{
                      fontSize: 10, fontWeight: 600, color: "var(--text-faint)",
                      letterSpacing: "0.5px", textTransform: "uppercase",
                      padding: "6px 16px", textAlign: i === 0 ? "left" : "right",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {campaign.terms.map((row, i) => {
                  const s = REC_STYLE[row.recommendation];
                  return (
                    <tr
                      key={i}
                      style={{
                        borderBottom: "1px solid var(--border)",
                        background: i % 2 === 0 ? "var(--bg)" : "var(--surface)",
                      }}
                    >
                      <td style={{ padding: "8px 16px", fontSize: 12, color: "var(--text-2)", fontFamily: "monospace" }}>
                        {row.searchTerm}
                      </td>
                      <td style={{ padding: "8px 16px", fontSize: 12, color: "var(--text-muted)", textAlign: "right" }}>
                        {row.clicks}
                      </td>
                      <td style={{ padding: "8px 16px", fontSize: 12, textAlign: "right",
                        color: row.conversions > 0 ? "#22c55e" : "var(--text-faint)",
                        fontWeight: row.conversions > 0 ? 600 : 400,
                      }}>
                        {row.conversions > 0 ? row.conversions.toFixed(1) : "—"}
                      </td>
                      <td style={{ padding: "8px 16px", fontSize: 12, color: row.recommendation === "EXCLUDE" ? "#ef4444" : "var(--text-muted)", textAlign: "right", fontWeight: row.recommendation === "EXCLUDE" ? 600 : 400 }}>
                        €{row.costEur.toFixed(2)}
                      </td>
                      <td style={{ padding: "8px 16px", textAlign: "right" }}>
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
          </div>
        );
      })}
    </div>
  );
}
