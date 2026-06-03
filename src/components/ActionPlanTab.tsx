"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2, RefreshCw, Printer, FileText, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import type { ProductComparison } from "@/app/api/accounts/[id]/action-plan/route";

interface PlanSettings {
  targetRoas:   string;
  monthlyGoal:  string;
  contextNotes: string;
}

interface Metrics {
  actualRoas:     number | null;
  spend30d:       number | null;
  conversionRate: number | null;
}

interface SavedPlan {
  id:         string;
  createdAt:  string;
  content:    string;
  snapshotId: string | null;
}

// ─── Seasonal indices (ecommerce — indexed so May = 1.0) ─────────────────────
const SEASONALITY = [0.72, 0.68, 0.83, 0.90, 1.00, 0.88, 0.78, 0.76, 0.90, 0.98, 1.42, 1.58];
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTH_FULL  = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// ─── Growth projection chart ──────────────────────────────────────────────────

function GrowthChart({
  metrics,
  targetRoas,
  currency,
}: {
  metrics:    Metrics;
  targetRoas: number | null;
  currency:   string;
}) {
  const { actualRoas, spend30d } = metrics;
  if (!actualRoas || !spend30d || actualRoas === 0) return null;

  const sym = currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency === "PLN" ? "PLN " : "$";
  const currentRevenue = spend30d * actualRoas;
  const currentMonthIdx = new Date().getMonth();
  const effectiveTarget = targetRoas ?? (actualRoas * 1.30);

  const chartData = Array.from({ length: 6 }, (_, i) => {
    const monthIdx = (currentMonthIdx + i) % 12;
    const seasonalFactor = SEASONALITY[monthIdx] / SEASONALITY[currentMonthIdx];

    // Current trajectory: flat ROAS, seasonal adjustment only
    const baseRevenue = currentRevenue * seasonalFactor;

    // With plan: ROAS ramps up toward target over 3 months
    const roasProgress = i === 0 ? 0 : Math.min(1, i / 3);
    const plannedRoas   = actualRoas + (effectiveTarget - actualRoas) * roasProgress;
    const plannedRevenue = spend30d * plannedRoas * seasonalFactor;

    return {
      month:          MONTH_NAMES[monthIdx],
      isCurrent:      i === 0,
      baseRevenue:    Math.round(baseRevenue),
      plannedRevenue: Math.round(plannedRevenue),
      seasonalNote:   monthIdx === 10 || monthIdx === 11 ? "Peak" : monthIdx === 1 || monthIdx === 6 || monthIdx === 7 ? "Slow" : null,
    };
  });

  const maxRevenue = Math.max(...chartData.flatMap(d => [d.baseRevenue, d.plannedRevenue]));
  const fmtK = (n: number) => n >= 1000 ? `${sym}${(n / 1000).toFixed(0)}k` : `${sym}${n}`;

  const W = 560, H = 180, PAD = 40, BAR_GROUP_W = 64, BAR_W = 20, GAP = 4;

  return (
    <div style={{ marginBottom: 28, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-2)", letterSpacing: "-0.2px" }}>
          Revenue Projection
        </span>
        <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
          seasonal baseline vs. with this plan — based on current {sym}{Math.round(currentRevenue / 1000)}k/mo
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H + 60}`} style={{ width: "100%", maxWidth: W, display: "block" }}>
        {/* Y-axis ticks */}
        {[0, 0.25, 0.5, 0.75, 1].map(t => {
          const y = PAD + (H - PAD) * (1 - t);
          const val = Math.round(maxRevenue * t);
          return (
            <g key={t}>
              <line x1={PAD} x2={W - 10} y1={y} y2={y} stroke="var(--border)" strokeWidth="1" />
              <text x={PAD - 6} y={y + 4} textAnchor="end" fontSize="9" fill="var(--text-very-dim)">
                {fmtK(val)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {chartData.map((d, i) => {
          const x = PAD + i * ((W - PAD) / 6);
          const baseH   = ((d.baseRevenue / maxRevenue) * (H - PAD));
          const planH   = ((d.plannedRevenue / maxRevenue) * (H - PAD));
          const baseY   = PAD + (H - PAD) - baseH;
          const planY   = PAD + (H - PAD) - planH;
          const cx      = x + BAR_GROUP_W / 2;

          return (
            <g key={i}>
              {/* Base bar */}
              <rect
                x={cx - BAR_W - GAP / 2}
                y={baseY}
                width={BAR_W}
                height={baseH}
                fill={d.isCurrent ? "var(--text-dim)" : "var(--surface-3)"}
                rx="2"
                opacity={d.isCurrent ? 1 : 0.7}
              />
              {/* Plan bar */}
              <rect
                x={cx + GAP / 2}
                y={planY}
                width={BAR_W}
                height={planH}
                fill={d.plannedRevenue > d.baseRevenue ? "var(--accent)" : "var(--surface-3)"}
                rx="2"
                opacity={d.isCurrent ? 0.4 : 0.9}
              />
              {/* Revenue labels */}
              {!d.isCurrent && d.plannedRevenue > d.baseRevenue && (
                <text x={cx + GAP / 2 + BAR_W / 2} y={planY - 4} textAnchor="middle" fontSize="8" fill="var(--accent)" fontWeight="600">
                  {fmtK(d.plannedRevenue)}
                </text>
              )}
              {/* Month label */}
              <text x={cx} y={H + PAD + 4} textAnchor="middle" fontSize="10" fill={d.isCurrent ? "var(--text)" : "var(--text-dim)"} fontWeight={d.isCurrent ? "700" : "400"}>
                {d.month}
              </text>
              {/* Seasonal note */}
              {d.seasonalNote && (
                <text x={cx} y={H + PAD + 16} textAnchor="middle" fontSize="8" fill={d.seasonalNote === "Peak" ? "#22c55e" : "#f97316"}>
                  {d.seasonalNote}
                </text>
              )}
              {/* Current month marker */}
              {d.isCurrent && (
                <text x={cx} y={H + PAD + 16} textAnchor="middle" fontSize="8" fill="var(--text-dim)">
                  now
                </text>
              )}
            </g>
          );
        })}

        {/* Legend */}
        <rect x={PAD} y={H + PAD + 26} width={10} height={10} fill="var(--surface-3)" rx="2" />
        <text x={PAD + 13} y={H + PAD + 35} fontSize="9" fill="var(--text-dim)">Current pace (seasonal)</text>
        <rect x={PAD + 130} y={H + PAD + 26} width={10} height={10} fill="var(--accent)" rx="2" />
        <text x={PAD + 143} y={H + PAD + 35} fontSize="9" fill="var(--text-dim)">With this plan</text>
      </svg>
    </div>
  );
}

// ─── Product performance UI ───────────────────────────────────────────────────

function ProductSection({ cmp, currency }: { cmp: ProductComparison; currency: string }) {
  const sym = currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency === "PLN" ? "PLN " : "$";
  const fmt = (n: number) => n >= 1000 ? `${sym}${(n / 1000).toFixed(1)}k` : `${sym}${Math.round(n)}`;
  const totalChg = cmp.priorRevenue > 0
    ? ((cmp.totalRevenue - cmp.priorRevenue) / cmp.priorRevenue * 100).toFixed(0)
    : null;

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-2)", letterSpacing: "-0.2px" }}>
          Product Performance — Last 30 Days
        </span>
        {totalChg !== null && (
          <span style={{ fontSize: 11, color: Number(totalChg) >= 0 ? "#22c55e" : "#ef4444" }}>
            {Number(totalChg) >= 0 ? "+" : ""}{totalChg}% vs prior period
          </span>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* Winners */}
        {cmp.winners.length > 0 && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", color: "#22c55e", marginBottom: 10 }}>
              ↑ Growing
            </div>
            {cmp.winners.slice(0, 5).map((p, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6, gap: 8 }}>
                <span style={{ fontSize: 12, color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }} title={p.title}>
                  {p.title.length > 38 ? p.title.slice(0, 38) + "…" : p.title}
                </span>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", letterSpacing: "-0.3px" }}>{fmt(p.revenue)}</span>
                  {p.pctChange != null && (
                    <span style={{ fontSize: 11, color: p.pctChange >= 0 ? "#22c55e" : "#f97316", fontWeight: 600 }}>
                      {p.pctChange > 0 ? "+" : ""}{p.pctChange}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Declining */}
        {cmp.declining.length > 0 && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", color: "#ef4444", marginBottom: 10 }}>
              ↓ Declining
            </div>
            {cmp.declining.slice(0, 5).map((p, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6, gap: 8 }}>
                <span style={{ fontSize: 12, color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }} title={p.title}>
                  {p.title.length > 38 ? p.title.slice(0, 38) + "…" : p.title}
                </span>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", letterSpacing: "-0.3px" }}>{fmt(p.revenue)}</span>
                  <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 600 }}>{p.pctChange}%</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New arrivals */}
        {cmp.newArrivals.length > 0 && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", color: "var(--accent)", marginBottom: 10 }}>
              ✦ New This Period ({cmp.newArrivals.length} products)
            </div>
            {cmp.newArrivals.slice(0, 5).map((p, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6, gap: 8 }}>
                <span style={{ fontSize: 12, color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }} title={p.title}>
                  {p.title.length > 38 ? p.title.slice(0, 38) + "…" : p.title}
                </span>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", letterSpacing: "-0.3px" }}>{fmt(p.revenue)}</span>
                  <span style={{ fontSize: 11, color: "var(--text-dim)" }}>{p.conversions} orders</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dropouts */}
        {cmp.dropouts.length > 0 && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 10 }}>
              ✕ Dropped to Zero
            </div>
            {cmp.dropouts.slice(0, 5).map((p, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6, gap: 8 }}>
                <span style={{ fontSize: 12, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }} title={p.title}>
                  {p.title.length > 38 ? p.title.slice(0, 38) + "…" : p.title}
                </span>
                <span style={{ fontSize: 12, color: "var(--text-dim)", flexShrink: 0 }}>was {fmt(p.priorRevenue)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Minimal markdown renderer ────────────────────────────────────────────────

function renderMarkdown(md: string): React.ReactNode[] {
  const lines  = md.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("# ")) {
      nodes.push(<h1 key={i} style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.5px", margin: "28px 0 10px", paddingBottom: 10, borderBottom: "2px solid var(--accent)", lineHeight: 1.3 }}>{inlineRender(line.slice(2))}</h1>);
      i++; continue;
    }
    if (line.startsWith("## ")) {
      nodes.push(<h2 key={i} style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.3px", margin: "22px 0 8px", lineHeight: 1.4 }}>{inlineRender(line.slice(3))}</h2>);
      i++; continue;
    }
    if (line.startsWith("### ")) {
      nodes.push(<h3 key={i} style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)", margin: "16px 0 5px" }}>{inlineRender(line.slice(4))}</h3>);
      i++; continue;
    }
    if (line.startsWith("---")) {
      nodes.push(<hr key={i} style={{ border: "none", borderTop: "1px solid var(--border)", margin: "24px 0" }} />);
      i++; continue;
    }
    if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) { tableLines.push(lines[i]); i++; }
      nodes.push(<MarkdownTable key={`t${i}`} lines={tableLines} />);
      continue;
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) { items.push(lines[i].slice(2)); i++; }
      nodes.push(<ul key={`u${i}`} style={{ margin: "6px 0 12px", paddingLeft: 20 }}>{items.map((it, j) => <li key={j} style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.75, marginBottom: 3 }}>{inlineRender(it)}</li>)}</ul>);
      continue;
    }
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) { items.push(lines[i].replace(/^\d+\. /, "")); i++; }
      nodes.push(<ol key={`o${i}`} style={{ margin: "6px 0 12px", paddingLeft: 24 }}>{items.map((it, j) => <li key={j} style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.75, marginBottom: 4 }}>{inlineRender(it)}</li>)}</ol>);
      continue;
    }
    if (!line.trim()) { i++; continue; }
    nodes.push(<p key={i} style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.75, margin: "0 0 10px" }}>{inlineRender(line)}</p>);
    i++;
  }
  return nodes;
}

function MarkdownTable({ lines }: { lines: string[] }) {
  const rows = lines
    .filter(l => !l.match(/^\|[\s:|-]+\|$/))
    .map(l => l.split("|").slice(1, -1).map(c => c.trim()));
  if (!rows.length) return null;
  const [header, ...body] = rows;
  return (
    <div style={{ overflowX: "auto", margin: "12px 0 20px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            {header.map((c, i) => <th key={i} style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, fontSize: 11, letterSpacing: "0.4px", textTransform: "uppercase", color: "var(--text-dim)", borderBottom: "2px solid var(--border-3)", background: "var(--surface-2)", whiteSpace: "nowrap" }}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri} style={{ borderBottom: "1px solid var(--border)" }}>
              {row.map((c, ci) => <td key={ci} style={{ padding: "9px 12px", fontSize: 13, color: "var(--text-2)", fontWeight: ci === 0 ? 600 : 400, lineHeight: 1.5 }}>{inlineRender(c)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function inlineRender(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  if (parts.length === 1) return text;
  return <>{parts.map((p, i) => p.startsWith("**") && p.endsWith("**") ? <strong key={i} style={{ fontWeight: 700, color: "var(--text)" }}>{p.slice(2, -2)}</strong> : p)}</>;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ActionPlanTab({
  accountId,
  accountName,
  targetRoasDefault,
  currency,
}: {
  accountId:        string;
  accountName:      string;
  targetRoasDefault: number | null;
  currency:         string;
}) {
  const [plan, setPlan]                   = useState<SavedPlan | null>(null);
  const [metrics, setMetrics]             = useState<Metrics | null>(null);
  const [products, setProducts]           = useState<ProductComparison | null>(null);
  const [streaming, setStreaming]         = useState(false);
  const [streamedText, setStreamedText]   = useState("");
  const [error, setError]                 = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan]     = useState(true);
  const [showSettings, setShowSettings]   = useState(false);
  const [settings, setSettings]           = useState<PlanSettings>({
    targetRoas:   targetRoasDefault != null ? String(targetRoasDefault) : "",
    monthlyGoal:  "",
    contextNotes: "",
  });
  const abortRef = useRef<AbortController | null>(null);

  const loadPlan = useCallback(async () => {
    setLoadingPlan(true);
    try {
      const res = await fetch(`/api/accounts/${accountId}/action-plan`);
      if (res.ok) {
        const data = await res.json() as { plan: SavedPlan | null; metrics: Metrics | null };
        setPlan(data.plan);
        setMetrics(data.metrics);
        if (!settings.targetRoas && data.metrics?.actualRoas) {
          // no target set yet — don't auto-fill, user should set it
        }
      }
    } finally {
      setLoadingPlan(false);
    }
  }, [accountId, settings.targetRoas]);

  useEffect(() => { loadPlan(); }, [loadPlan]);

  // If no plan yet, show settings form by default
  useEffect(() => {
    if (!loadingPlan && !plan) setShowSettings(true);
  }, [loadingPlan, plan]);

  const generate = async () => {
    setStreaming(true);
    setStreamedText("");
    setError(null);
    setShowSettings(false);
    setProducts(null);
    abortRef.current = new AbortController();

    try {
      const res = await fetch(`/api/accounts/${accountId}/action-plan`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          targetRoas:   settings.targetRoas   ? parseFloat(settings.targetRoas)   : null,
          monthlyGoal:  settings.monthlyGoal  ? parseFloat(settings.monthlyGoal)  : null,
          contextNotes: settings.contextNotes || null,
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        setError(body.error ?? "Failed to generate plan.");
        setStreaming(false);
        return;
      }

      const reader  = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer    = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const payload = JSON.parse(line.slice(6)) as { error?: string; text?: string; products?: ProductComparison; done?: boolean };
            if (payload.error)    { setError(payload.error); break; }
            if (payload.products) { setProducts(payload.products); }
            if (payload.text)     { setStreamedText(t => t + payload.text!); }
            if (payload.done)     { await loadPlan(); setStreamedText(""); }
          } catch { /* malformed */ }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setStreaming(false);
    }
  };

  const sym = currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency === "PLN" ? "PLN " : "$";
  const displayContent = streaming ? streamedText : (plan?.content ?? null);
  const currentMonth = MONTH_FULL[new Date().getMonth()];

  return (
    <div>
      {/* ── Toolbar ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", color: "var(--text-dim)" }}>
            30 & 90 Day Action Plan
          </span>
          {plan && !streaming && (
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
            <button onClick={() => window.print()} style={{ display: "flex", alignItems: "center", gap: 5, background: "transparent", border: "1px solid var(--border-2)", borderRadius: 7, color: "var(--text-dim)", fontSize: 12, fontWeight: 500, padding: "7px 12px", cursor: "pointer" }}>
              <Printer size={13} /> Print / PDF
            </button>
          )}
          {plan && !streaming && (
            <button onClick={() => setShowSettings(s => !s)} style={{ display: "flex", alignItems: "center", gap: 5, background: "transparent", border: "1px solid var(--border-2)", borderRadius: 7, color: "var(--text-dim)", fontSize: 12, padding: "7px 12px", cursor: "pointer" }}>
              <RefreshCw size={12} /> Regenerate
            </button>
          )}
        </div>
      </div>

      {/* ── Settings form ── */}
      {showSettings && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 10, padding: "20px 24px", marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>
            Plan Settings — {currentMonth}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-dim)", display: "block", marginBottom: 6 }}>
                Target ROAS this period
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  step="0.1"
                  placeholder={targetRoasDefault != null ? String(targetRoasDefault) : "e.g. 4.0"}
                  value={settings.targetRoas}
                  onChange={e => setSettings(s => ({ ...s, targetRoas: e.target.value }))}
                  style={{ width: "100%", boxSizing: "border-box", padding: "8px 30px 8px 10px", background: "var(--input-bg)", border: "1px solid var(--border-2)", borderRadius: 7, color: "var(--text)", fontSize: 13, outline: "none" }}
                />
                <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)", fontSize: 12 }}>×</span>
              </div>
              {metrics?.actualRoas != null && (
                <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 4 }}>
                  Current ROAS: {metrics.actualRoas.toFixed(2)}×
                </div>
              )}
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-dim)", display: "block", marginBottom: 6 }}>
                Monthly revenue goal (optional)
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)", fontSize: 12 }}>{sym}</span>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={settings.monthlyGoal}
                  onChange={e => setSettings(s => ({ ...s, monthlyGoal: e.target.value }))}
                  style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px 8px 26px", background: "var(--input-bg)", border: "1px solid var(--border-2)", borderRadius: 7, color: "var(--text)", fontSize: 13, outline: "none" }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-dim)", display: "block", marginBottom: 6 }}>
              Context / focus for this plan
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Spring collection launching next month. Client wants to focus on dresses and tops. Main competitor is running heavy promotions."
              value={settings.contextNotes}
              onChange={e => setSettings(s => ({ ...s, contextNotes: e.target.value }))}
              style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", background: "var(--input-bg)", border: "1px solid var(--border-2)", borderRadius: 7, color: "var(--text)", fontSize: 13, outline: "none", resize: "vertical", fontFamily: "inherit" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            {plan && (
              <button onClick={() => setShowSettings(false)} style={{ background: "transparent", border: "1px solid var(--border-2)", borderRadius: 7, color: "var(--text-dim)", fontSize: 12, padding: "8px 16px", cursor: "pointer" }}>
                Cancel
              </button>
            )}
            <button
              onClick={generate}
              disabled={streaming}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--btn-primary)", border: "none", borderRadius: 7, color: "#fff", fontSize: 13, fontWeight: 600, padding: "9px 20px", cursor: "pointer" }}
            >
              <FileText size={14} /> Generate Plan
            </button>
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "12px 16px", marginBottom: 16, display: "flex", gap: 8, fontSize: 13, color: "#ef4444" }}>
          <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} /> {error}
        </div>
      )}

      {/* ── Empty state ── */}
      {!displayContent && !streaming && !error && !showSettings && (
        <div style={{ border: "1px dashed var(--border-3)", borderRadius: 12, padding: "60px 32px", textAlign: "center" }}>
          {loadingPlan
            ? <Loader2 size={18} className="animate-spin" style={{ color: "var(--text-dim)", margin: "0 auto" }} />
            : <>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
                <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>No action plan yet</p>
                <p style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 380, margin: "0 auto 20px" }}>
                  Generate a 30 & 90 day growth plan with product performance data, seasonal projections, and specific recommendations.
                </p>
                <button onClick={() => setShowSettings(true)} style={{ background: "var(--btn-primary)", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, padding: "10px 20px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <FileText size={14} /> Set Up Plan
                </button>
              </>
          }
        </div>
      )}

      {/* ── Plan content ── */}
      {(displayContent || streaming) && (
        <div>
          {/* Growth chart */}
          {metrics?.actualRoas && metrics?.spend30d && (
            <GrowthChart
              metrics={metrics}
              targetRoas={settings.targetRoas ? parseFloat(settings.targetRoas) : targetRoasDefault}
              currency={currency}
            />
          )}

          {/* Product performance */}
          {products && <ProductSection cmp={products} currency={currency} />}

          {/* Streamed/saved plan text */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "32px 40px", maxWidth: 820 }}>
            {/* Print header */}
            <div className="print-only" style={{ borderBottom: "2px solid var(--accent)", paddingBottom: 20, marginBottom: 32, display: "none" }}>
              <div style={{ fontSize: 10, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>Google Ads Growth Plan</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text)" }}>{accountName}</div>
              {plan && <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 4 }}>{new Date(plan.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</div>}
            </div>

            {renderMarkdown(displayContent ?? "")}

            {streaming && (
              <span style={{ display: "inline-block", width: 2, height: 16, background: "var(--accent)", borderRadius: 1, animation: "blink 1s step-end infinite", marginLeft: 2, verticalAlign: "middle" }} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
