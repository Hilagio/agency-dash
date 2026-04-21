"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Loader2, TrendingUp, Download } from "lucide-react";
import type { ViewKey, MetricRow } from "@/app/api/accounts/[id]/metrics/route";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ExplorerData {
  rows:      MetricRow[];
  view:      ViewKey;
  dateRange: string;
  currency:  string;
}

type SortKey = keyof MetricRow;

const VIEW_OPTIONS: { key: ViewKey; label: string }[] = [
  { key: "campaign",   label: "Campaign" },
  { key: "ad_group",   label: "Ad group" },
  { key: "device",     label: "Device" },
  { key: "age",        label: "Age range" },
  { key: "gender",     label: "Gender" },
  { key: "income",     label: "Income bracket" },
  { key: "parental",   label: "Parental status" },
  { key: "geo",        label: "Country / Region" },
  { key: "dayofweek",  label: "Day of week" },
  { key: "hour",       label: "Hour of day" },
  { key: "keyword",    label: "Keyword" },
  { key: "searchterm", label: "Search term" },
  { key: "product",    label: "Product" },
];

const DATE_OPTIONS = [
  { key: "3d",     label: "3d" },
  { key: "7d",     label: "7d" },
  { key: "14d",    label: "14d" },
  { key: "30d",    label: "30d" },
  { key: "90d",    label: "90d" },
  { key: "custom", label: "Custom" },
];

type MetricConfig = {
  key: keyof MetricRow;
  label: string;
  fmt: (v: number, sym: string) => string;
  pct?: boolean;
};

const METRIC_COLS: MetricConfig[] = [
  { key: "impressions",     label: "Impr.",      fmt: v => fmtNum(v) },
  { key: "clicks",          label: "Clicks",     fmt: v => fmtNum(v) },
  { key: "ctr",             label: "CTR",        fmt: v => `${(v * 100).toFixed(2)}%`, pct: true },
  { key: "cost",            label: "Cost",       fmt: (v, s) => `${s}${fmtNum(v, 2)}` },
  { key: "avgCpc",          label: "Avg CPC",    fmt: (v, s) => `${s}${fmtNum(v, 2)}` },
  { key: "conversions",     label: "Conv.",      fmt: v => fmtNum(v, 1) },
  { key: "conversionRate",  label: "CVR",        fmt: v => `${(v * 100).toFixed(2)}%`, pct: true },
  { key: "revenue",         label: "Rev.",       fmt: (v, s) => `${s}${fmtNum(v, 0)}` },
  { key: "roas",            label: "ROAS",       fmt: v => v.toFixed(2) },
  { key: "cpa",             label: "CPA",        fmt: (v, s) => v > 0 ? `${s}${fmtNum(v, 2)}` : "—" },
  { key: "cpm",             label: "CPM",        fmt: (v, s) => `${s}${fmtNum(v, 2)}` },
  { key: "impressionShare", label: "IS%",        fmt: v => v > 0 ? `${(v * 100).toFixed(0)}%` : "—", pct: true },
  { key: "isLostBudget",    label: "Lost budget",fmt: v => v > 0 ? `${(v * 100).toFixed(0)}%` : "—", pct: true },
  { key: "isLostRank",      label: "Lost rank",  fmt: v => v > 0 ? `${(v * 100).toFixed(0)}%` : "—", pct: true },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtNum(v: number, decimals = 0) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 10_000)    return `${(v / 1_000).toFixed(0)}k`;
  if (v >= 1_000)     return `${(v / 1_000).toFixed(1)}k`;
  return v.toFixed(decimals);
}

function currencySymbol(c: string) {
  return c === "EUR" ? "€" : c === "GBP" ? "£" : "$";
}

// ─── Scatter plot ─────────────────────────────────────────────────────────────

function ScatterPlot({ rows, xKey, yKey, sizeKey, currency }: {
  rows:     MetricRow[];
  xKey:     keyof MetricRow;
  yKey:     keyof MetricRow;
  sizeKey?: keyof MetricRow;
  currency: string;
}) {
  const W = 560, H = 340, PAD = { top: 16, right: 16, bottom: 40, left: 56 };

  const xVals = rows.map(r => Number(r[xKey]));
  const yVals = rows.map(r => Number(r[yKey]));
  const sVals = sizeKey ? rows.map(r => Number(r[sizeKey])) : null;

  const xMin = Math.min(...xVals), xMax = Math.max(...xVals);
  const yMin = Math.min(...yVals), yMax = Math.max(...yVals);
  const sMax = sVals ? Math.max(...sVals) : 1;

  const toX = (v: number) => xMax > xMin
    ? PAD.left + ((v - xMin) / (xMax - xMin)) * (W - PAD.left - PAD.right)
    : W / 2;
  const toY = (v: number) => yMax > yMin
    ? H - PAD.bottom - ((v - yMin) / (yMax - yMin)) * (H - PAD.top - PAD.bottom)
    : H / 2;
  const toR = (v: number) => sMax > 0 ? 4 + (v / sMax) * 10 : 6;

  const xMetric = METRIC_COLS.find(m => m.key === xKey);
  const yMetric = METRIC_COLS.find(m => m.key === yKey);
  const sym = currencySymbol(currency);

  const [hovered, setHovered] = useState<number | null>(null);

  // Correlation coefficient
  const n = rows.length;
  if (n < 2) return <div style={{ color: "var(--text-faint)", fontSize: 12 }}>Not enough data for correlation.</div>;

  const xMean = xVals.reduce((a, b) => a + b, 0) / n;
  const yMean = yVals.reduce((a, b) => a + b, 0) / n;
  const num   = xVals.reduce((s, x, i) => s + (x - xMean) * (yVals[i] - yMean), 0);
  const denX  = Math.sqrt(xVals.reduce((s, x) => s + (x - xMean) ** 2, 0));
  const denY  = Math.sqrt(yVals.reduce((s, y) => s + (y - yMean) ** 2, 0));
  const r     = denX * denY > 0 ? num / (denX * denY) : 0;

  const corLabel = Math.abs(r) > 0.7 ? "strong" : Math.abs(r) > 0.4 ? "moderate" : "weak";
  const corDir   = r > 0 ? "positive" : "negative";

  return (
    <div>
      {/* Correlation badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <TrendingUp size={13} style={{ color: "#c49a0a" }} />
        <span style={{ fontSize: 12, color: "var(--text-dim)" }}>
          Pearson r = <strong style={{ color: Math.abs(r) > 0.4 ? "#c49a0a" : "var(--text-2)" }}>{r.toFixed(3)}</strong>
          {" "}— {corLabel} {corDir} correlation ({n} rows)
        </span>
      </div>

      <div style={{ position: "relative", display: "inline-block" }}>
        <svg width={W} height={H} style={{ overflow: "visible" }}>
          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map(t => (
            <g key={t}>
              <line
                x1={PAD.left} y1={PAD.top + t * (H - PAD.top - PAD.bottom)}
                x2={W - PAD.right} y2={PAD.top + t * (H - PAD.top - PAD.bottom)}
                stroke="var(--border)" strokeWidth={1}
              />
              <line
                x1={PAD.left + t * (W - PAD.left - PAD.right)} y1={PAD.top}
                x2={PAD.left + t * (W - PAD.left - PAD.right)} y2={H - PAD.bottom}
                stroke="var(--border)" strokeWidth={1}
              />
            </g>
          ))}

          {/* Axes */}
          <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={H - PAD.bottom} stroke="var(--border-2)" strokeWidth={1.5} />
          <line x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom} stroke="var(--border-2)" strokeWidth={1.5} />

          {/* Axis labels */}
          <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={11} fill="var(--text-dim)">{xMetric?.label ?? String(xKey)}</text>
          <text x={10} y={H / 2} textAnchor="middle" fontSize={11} fill="var(--text-dim)" transform={`rotate(-90, 10, ${H / 2})`}>{yMetric?.label ?? String(yKey)}</text>

          {/* Points */}
          {rows.map((row, i) => {
            const cx = toX(xVals[i]);
            const cy = toY(yVals[i]);
            const rr = sVals ? toR(sVals[i]) : 6;
            const isHov = hovered === i;
            return (
              <g key={i}>
                <circle
                  cx={cx} cy={cy} r={rr}
                  fill={isHov ? "#c49a0a" : "rgba(196,154,10,0.55)"}
                  stroke={isHov ? "#a5b4fc" : "rgba(196,154,10,0.3)"}
                  strokeWidth={1}
                  style={{ cursor: "pointer", transition: "r 0.1s" }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
                {isHov && (
                  <text
                    x={cx} y={cy - rr - 4}
                    textAnchor="middle" fontSize={10}
                    fill="var(--text-2)"
                    style={{ pointerEvents: "none" }}
                  >
                    {row.label.length > 24 ? row.label.slice(0, 22) + "…" : row.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover tooltip */}
        {hovered !== null && (() => {
          const row = rows[hovered];
          const xV = xVals[hovered];
          const yV = yVals[hovered];
          return (
            <div style={{
              position: "absolute",
              left: toX(xV) + 12,
              top: toY(yV) - 10,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8, padding: "8px 12px",
              fontSize: 11, color: "var(--text-2)",
              pointerEvents: "none",
              zIndex: 10, minWidth: 140,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}>
              <div style={{ fontWeight: 600, marginBottom: 4, color: "var(--text)" }}>{row.label}</div>
              {row.sublabel && <div style={{ color: "var(--text-faint)", marginBottom: 4 }}>{row.sublabel}</div>}
              <div>{xMetric?.label}: <strong>{xMetric?.fmt(xV, sym)}</strong></div>
              <div>{yMetric?.label}: <strong>{yMetric?.fmt(yV, sym)}</strong></div>
              {sizeKey && sVals && (
                <div>{METRIC_COLS.find(m => m.key === sizeKey)?.label}: <strong>{METRIC_COLS.find(m => m.key === sizeKey)?.fmt(sVals[hovered], sym)}</strong></div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MetricExplorer({ accountId }: { accountId: string }) {
  const [view, setView]           = useState<ViewKey>("campaign");
  const [dr, setDr]               = useState("30d");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [data, setData]           = useState<ExplorerData | null>(null);
  const [error, setError]         = useState<string | null>(null);
  const [sortKey, setSortKey]     = useState<SortKey>("cost");
  const [sortAsc, setSortAsc]     = useState(false);
  const [mode, setMode]           = useState<"table" | "scatter">("table");
  const [xKey, setXKey]           = useState<keyof MetricRow>("ctr");
  const [yKey, setYKey]           = useState<keyof MetricRow>("conversionRate");
  const [sizeKey, setSizeKey]     = useState<keyof MetricRow>("cost");

  const fetch_ = useCallback(async (v: ViewKey, d: string, cs?: string, ce?: string) => {
    if (d === "custom" && (!cs || !ce)) return;
    setLoading(true);
    setError(null);
    try {
      const body: Record<string, string> = { view: v, dateRange: d };
      if (d === "custom" && cs && ce) { body.customStart = cs; body.customEnd = ce; }
      const res = await fetch(`/api/accounts/${accountId}/metrics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed");
      setData(json as ExplorerData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => { fetch_(view, dr, customStart, customEnd); }, [view, dr, fetch_]); // eslint-disable-line react-hooks/exhaustive-deps

  const sorted = useMemo(() => {
    if (!data) return [];
    return [...data.rows].sort((a, b) => {
      const av = Number(a[sortKey] ?? 0);
      const bv = Number(b[sortKey] ?? 0);
      return sortAsc ? av - bv : bv - av;
    });
  }, [data, sortKey, sortAsc]);

  const sym = data ? currencySymbol(data.currency) : "$";

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortAsc(prev => !prev);
    else { setSortKey(key); setSortAsc(false); }
  }

  function exportCsv() {
    if (!sorted.length) return;
    const headers = ["Label", "Sublabel", ...METRIC_COLS.map(m => m.label)];
    const rows = sorted.map(r => [
      `"${r.label.replace(/"/g, '""')}"`,
      `"${(r.sublabel ?? "").replace(/"/g, '""')}"`,
      ...METRIC_COLS.map(m => Number(r[m.key]).toFixed(4)),
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `metrics-${view}-${dr === "custom" ? `${customStart}_${customEnd}` : dr}.csv`;
    a.click();
  }

  return (
    <div>
      {/* Controls */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20, alignItems: "center" }}>
        {/* View selector */}
        <select
          value={view}
          onChange={e => setView(e.target.value as ViewKey)}
          style={{
            background: "var(--surface)", border: "1px solid var(--border-2)",
            borderRadius: 8, padding: "7px 12px", fontSize: 13, color: "var(--text-2)",
            cursor: "pointer", outline: "none",
          }}
        >
          {VIEW_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
        </select>

        {/* Date range */}
        <div style={{ display: "flex", gap: 2, background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 8, overflow: "hidden" }}>
          {DATE_OPTIONS.map(o => (
            <button
              key={o.key}
              onClick={() => setDr(o.key)}
              style={{
                padding: "7px 14px", fontSize: 12, fontWeight: 500,
                background: dr === o.key ? "rgba(196,154,10,0.15)" : "transparent",
                color: dr === o.key ? "#c49a0a" : "var(--text-dim)",
                border: "none", cursor: "pointer",
              }}
            >
              {o.label}
            </button>
          ))}
        </div>

        {/* Custom date pickers */}
        {dr === "custom" && (
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              type="date"
              value={customStart}
              onChange={e => setCustomStart(e.target.value)}
              style={{
                background: "var(--surface)", border: "1px solid var(--border-2)",
                borderRadius: 8, padding: "6px 10px", fontSize: 12, color: "var(--text-2)", outline: "none",
              }}
            />
            <span style={{ fontSize: 12, color: "var(--text-faint)" }}>→</span>
            <input
              type="date"
              value={customEnd}
              onChange={e => setCustomEnd(e.target.value)}
              style={{
                background: "var(--surface)", border: "1px solid var(--border-2)",
                borderRadius: 8, padding: "6px 10px", fontSize: 12, color: "var(--text-2)", outline: "none",
              }}
            />
            <button
              onClick={() => fetch_(view, "custom", customStart, customEnd)}
              disabled={!customStart || !customEnd}
              style={{
                padding: "6px 14px", fontSize: 12, fontWeight: 500, borderRadius: 8,
                background: customStart && customEnd ? "rgba(196,154,10,0.15)" : "var(--surface)",
                color: customStart && customEnd ? "#c49a0a" : "var(--text-faint)",
                border: "1px solid var(--border-2)", cursor: customStart && customEnd ? "pointer" : "default",
              }}
            >
              Apply
            </button>
          </div>
        )}

        {/* Mode toggle */}
        <div style={{ display: "flex", gap: 2, background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 8, overflow: "hidden" }}>
          {(["table", "scatter"] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                padding: "7px 14px", fontSize: 12, fontWeight: 500,
                background: mode === m ? "rgba(196,154,10,0.15)" : "transparent",
                color: mode === m ? "#c49a0a" : "var(--text-dim)",
                border: "none", cursor: "pointer",
              }}
            >
              {m === "table" ? "Table" : "Scatter"}
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        {data && (
          <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
            {sorted.length} rows
          </span>
        )}

        <button
          onClick={exportCsv}
          disabled={!sorted.length}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "transparent", border: "1px solid var(--border-2)",
            borderRadius: 8, color: "var(--text-dim)", fontSize: 12, fontWeight: 500,
            padding: "6px 12px", cursor: sorted.length ? "pointer" : "not-allowed",
            opacity: sorted.length ? 1 : 0.4,
          }}
        >
          <Download size={12} /> CSV
        </button>
      </div>

      {/* Loading / error */}
      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-dim)", fontSize: 13, padding: "40px 0" }}>
          <Loader2 size={14} className="animate-spin" /> Loading {VIEW_OPTIONS.find(v => v.key === view)?.label}…
        </div>
      )}

      {error && !loading && (
        <div style={{
          background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#ef4444",
        }}>
          {error}
        </div>
      )}

      {/* Scatter axis selectors */}
      {!loading && !error && data && mode === "scatter" && (
        <div style={{ marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "var(--text-faint)" }}>X axis:</span>
          <select value={xKey} onChange={e => setXKey(e.target.value as keyof MetricRow)}
            style={{ background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 6, padding: "5px 10px", fontSize: 12, color: "var(--text-2)" }}>
            {METRIC_COLS.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
          </select>
          <span style={{ fontSize: 12, color: "var(--text-faint)" }}>Y axis:</span>
          <select value={yKey} onChange={e => setYKey(e.target.value as keyof MetricRow)}
            style={{ background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 6, padding: "5px 10px", fontSize: 12, color: "var(--text-2)" }}>
            {METRIC_COLS.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
          </select>
          <span style={{ fontSize: 12, color: "var(--text-faint)" }}>Bubble size:</span>
          <select value={sizeKey} onChange={e => setSizeKey(e.target.value as keyof MetricRow)}
            style={{ background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 6, padding: "5px 10px", fontSize: 12, color: "var(--text-2)" }}>
            {METRIC_COLS.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
          </select>
        </div>
      )}

      {/* Scatter plot */}
      {!loading && !error && data && mode === "scatter" && sorted.length > 0 && (
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 12, padding: "20px 24px", overflowX: "auto",
        }}>
          <ScatterPlot rows={sorted} xKey={xKey} yKey={yKey} sizeKey={sizeKey} currency={data.currency} />
        </div>
      )}

      {/* Table */}
      {!loading && !error && data && mode === "table" && (
        <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid var(--border)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
                <th style={{
                  textAlign: "left", padding: "10px 14px",
                  color: "var(--text-dim)", fontWeight: 600, fontSize: 11,
                  position: "sticky", left: 0, background: "var(--surface)", minWidth: 180,
                  letterSpacing: "0.5px", textTransform: "uppercase",
                }}>
                  {VIEW_OPTIONS.find(v => v.key === view)?.label ?? "Label"}
                </th>
                {METRIC_COLS.map(m => (
                  <th
                    key={m.key}
                    onClick={() => handleSort(m.key)}
                    style={{
                      textAlign: "right", padding: "10px 12px",
                      color: sortKey === m.key ? "#c49a0a" : "var(--text-dim)",
                      fontWeight: 600, fontSize: 11, cursor: "pointer",
                      whiteSpace: "nowrap", letterSpacing: "0.5px", textTransform: "uppercase",
                      userSelect: "none",
                    }}
                  >
                    {m.label}{sortKey === m.key ? (sortAsc ? " ↑" : " ↓") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((row, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: "1px solid var(--border)",
                    background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                  }}
                >
                  <td style={{
                    padding: "9px 14px",
                    position: "sticky", left: 0,
                    background: i % 2 === 0 ? "var(--bg)" : "var(--bg-alt, var(--bg))",
                    borderRight: "1px solid var(--border)",
                  }}>
                    <div style={{ fontWeight: 500, color: "var(--text-2)", fontSize: 12 }}>
                      {row.label}
                    </div>
                    {row.sublabel && (
                      <div style={{ fontSize: 10, color: "var(--text-faint)", marginTop: 1 }}>
                        {row.sublabel}
                      </div>
                    )}
                  </td>
                  {METRIC_COLS.map(m => {
                    const v = Number(row[m.key]);
                    return (
                      <td
                        key={m.key}
                        style={{
                          textAlign: "right", padding: "9px 12px",
                          color: sortKey === m.key ? "var(--text-2)" : "var(--text-muted)",
                          fontWeight: sortKey === m.key ? 600 : 400,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {m.fmt(v, sym)}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td
                    colSpan={METRIC_COLS.length + 1}
                    style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-faint)", fontSize: 13 }}
                  >
                    No data for this view and date range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
