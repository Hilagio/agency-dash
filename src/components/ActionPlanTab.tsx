"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, RefreshCw, Printer, FileText, AlertTriangle } from "lucide-react";
import type { StoredPlan } from "@/app/api/accounts/[id]/action-plan/route";

interface PlanSettings {
  targetRoas:   string;
  monthlyGoal:  string;
  contextNotes: string;
}

interface Metrics {
  actualRoas: number | null;
  spend30d:   number | null;
  snapshotAt: string | null;
}

interface SimpleProduct {
  title:       string;
  revenue:     number;
  conversions: number;
  roas:        number;
  cost?:       number;
}

// ─── Seasonal indices (ecommerce — indexed so May = 1.0) ─────────────────────
const SEASONALITY = [0.72, 0.68, 0.83, 0.90, 1.00, 0.88, 0.78, 0.76, 0.90, 0.98, 1.42, 1.58];
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTH_FULL  = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const ACTION_COLORS = ["#F9C31F", "#f59e0b", "#10b981"] as const;

// ─── Revenue projection chart ─────────────────────────────────────────────────

function GrowthChart({
  actualRoas,
  spend30d,
  targetRoas,
  currency,
}: {
  actualRoas: number;
  spend30d:   number;
  targetRoas: number | null;
  currency:   string;
}) {
  const sym = currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency === "PLN" ? "PLN " : "$";
  const currentRevenue   = spend30d * actualRoas;
  const currentMonthIdx  = new Date().getMonth();
  const effectiveTarget  = targetRoas ?? (actualRoas * 1.30);

  const chartData = Array.from({ length: 6 }, (_, i) => {
    const monthIdx      = (currentMonthIdx + i) % 12;
    const seasonalFactor = SEASONALITY[monthIdx] / SEASONALITY[currentMonthIdx];
    const baseRevenue    = currentRevenue * seasonalFactor;
    const roasProgress   = i === 0 ? 0 : Math.min(1, i / 3);
    const plannedRoas    = actualRoas + (effectiveTarget - actualRoas) * roasProgress;
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
  const W = 540, H = 160, PAD = 40, BAR_W = 18, GAP = 3;

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "18px 24px", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 14 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Revenue Projection
        </span>
        <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
          seasonal baseline vs. with this plan — based on {sym}{Math.round(currentRevenue / 1000)}k/mo
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H + 56}`} style={{ width: "100%", maxWidth: W, display: "block" }}>
        {[0, 0.25, 0.5, 0.75, 1].map(t => {
          const y = PAD + (H - PAD) * (1 - t);
          return (
            <g key={t}>
              <line x1={PAD} x2={W - 10} y1={y} y2={y} stroke="var(--border)" strokeWidth="1" />
              <text x={PAD - 6} y={y + 4} textAnchor="end" fontSize="9" fill="var(--text-very-dim)">{fmtK(Math.round(maxRevenue * t))}</text>
            </g>
          );
        })}
        {chartData.map((d, i) => {
          const x     = PAD + i * ((W - PAD) / 6);
          const baseH = (d.baseRevenue / maxRevenue) * (H - PAD);
          const planH = (d.plannedRevenue / maxRevenue) * (H - PAD);
          const cx    = x + 32;
          return (
            <g key={i}>
              <rect x={cx - BAR_W - GAP / 2} y={PAD + (H - PAD) - baseH} width={BAR_W} height={baseH}
                fill={d.isCurrent ? "var(--text-dim)" : "var(--surface-3)"} rx="2" opacity={d.isCurrent ? 1 : 0.7} />
              <rect x={cx + GAP / 2} y={PAD + (H - PAD) - planH} width={BAR_W} height={planH}
                fill={d.plannedRevenue > d.baseRevenue ? "var(--accent)" : "var(--surface-3)"} rx="2" opacity={d.isCurrent ? 0.4 : 0.9} />
              {!d.isCurrent && d.plannedRevenue > d.baseRevenue && (
                <text x={cx + GAP / 2 + BAR_W / 2} y={PAD + (H - PAD) - planH - 4} textAnchor="middle" fontSize="8" fill="var(--accent)" fontWeight="600">
                  {fmtK(d.plannedRevenue)}
                </text>
              )}
              <text x={cx} y={H + PAD + 4} textAnchor="middle" fontSize="10"
                fill={d.isCurrent ? "var(--text)" : "var(--text-dim)"} fontWeight={d.isCurrent ? "700" : "400"}>{d.month}</text>
              {d.seasonalNote && (
                <text x={cx} y={H + PAD + 16} textAnchor="middle" fontSize="8"
                  fill={d.seasonalNote === "Peak" ? "#22c55e" : "#f97316"}>{d.seasonalNote}</text>
              )}
              {d.isCurrent && (
                <text x={cx} y={H + PAD + 16} textAnchor="middle" fontSize="8" fill="var(--text-dim)">now</text>
              )}
            </g>
          );
        })}
        <rect x={PAD} y={H + PAD + 28} width={10} height={10} fill="var(--surface-3)" rx="2" />
        <text x={PAD + 13} y={H + PAD + 37} fontSize="9" fill="var(--text-dim)">Current pace (seasonal)</text>
        <rect x={PAD + 130} y={H + PAD + 28} width={10} height={10} fill="var(--accent)" rx="2" />
        <text x={PAD + 143} y={H + PAD + 37} fontSize="9" fill="var(--text-dim)">With this plan</text>
      </svg>
    </div>
  );
}

// ─── Presentation board ───────────────────────────────────────────────────────

function PlanBoard({
  storedPlan,
  metrics,
  products,
  currency,
  accountName,
  targetRoasOverride,
}: {
  storedPlan:        StoredPlan;
  metrics:           Metrics | null;
  products:          SimpleProduct[] | null;
  currency:          string;
  accountName:       string;
  targetRoasOverride: number | null;
}) {
  const plan      = storedPlan.plan;
  const sym       = currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency === "PLN" ? "PLN " : "$";
  const targetRoas = targetRoasOverride ?? storedPlan.settings.targetRoas ?? null;
  const actualRoas = metrics?.actualRoas ?? null;
  const spend30d   = metrics?.spend30d ?? null;
  const revenue30d = (actualRoas && spend30d) ? Math.round(actualRoas * spend30d) : null;
  // Show top 8 products: first by revenue, then by conversions, then by cost
  const topProducts = products
    ? [...products]
        .sort((a, b) => b.revenue - a.revenue || b.conversions - a.conversions || (b.cost ?? 0) - (a.cost ?? 0))
        .filter(p => p.revenue > 0 || p.conversions > 0 || (p.cost ?? 0) > 1)
        .slice(0, 8)
    : [];

  return (
    <div className="plan-board" style={{ maxWidth: 900 }}>

      {/* ── KPI Strip ─────────────────────────────────────────────────────── */}
      <div className="plan-kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 6 }}>Current ROAS</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: actualRoas ? "var(--text)" : "var(--text-muted)", letterSpacing: "-0.8px" }}>
            {actualRoas ? `${actualRoas.toFixed(2)}×` : "—"}
          </div>
          {targetRoas && <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 2 }}>target {targetRoas.toFixed(1)}×</div>}
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 6 }}>Monthly Spend</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.8px" }}>
            {spend30d ? `${sym}${Math.round(spend30d).toLocaleString()}` : "—"}
          </div>
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 6 }}>Monthly Revenue</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.8px" }}>
            {revenue30d ? `${sym}${revenue30d.toLocaleString()}` : "—"}
          </div>
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 6 }}>Plan Generated</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)", letterSpacing: "-0.3px" }}>
            {new Date(storedPlan.generatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 3 }}>
            Data snapshot {new Date(storedPlan.snapshotDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </div>
        </div>
      </div>

      {/* ── Summary ───────────────────────────────────────────────────────── */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderLeft: "3px solid var(--accent)", borderRadius: 10, padding: "22px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>
          90-Day Plan · {MONTH_FULL[new Date().getMonth()]} {new Date().getFullYear()}
        </div>
        <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", lineHeight: 1.5, margin: "0 0 10px", letterSpacing: "-0.3px" }}>
          {plan.summary}
        </p>
        <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7, margin: 0 }}>
          {plan.clientMessage}
        </p>
      </div>

      {/* ── Action Cards ──────────────────────────────────────────────────── */}
      <div className="plan-3col-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
        {plan.actions.map((action, i) => {
          const color = ACTION_COLORS[i % ACTION_COLORS.length];
          return (
            <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "20px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: color }} />
              <div style={{ fontSize: 10, fontWeight: 700, color: color, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8, marginTop: 4 }}>
                Action {i + 1}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 10, lineHeight: 1.4, letterSpacing: "-0.2px" }}>
                {action.title}
              </div>
              <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.65, margin: "0 0 14px" }}>
                {action.clientExplanation}
              </p>
              <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
                {action.steps.map((step, j) => (
                  <li key={j} style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.6, marginBottom: 4 }}>{step}</li>
                ))}
              </ul>
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 6 }}>
                <span style={{ fontSize: 11, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 5, padding: "3px 8px", color: "var(--text-dim)" }}>
                  {action.timeline}
                </span>
                <span style={{ fontSize: 11, color: color, fontWeight: 600, textAlign: "right", maxWidth: "55%" }}>
                  {action.expectedOutcome}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 90-Day Roadmap ────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 4 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>
          90-Day Roadmap
        </div>
      </div>
      <div className="plan-3col-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
        {plan.phases.map((phase, i) => {
          const color = ACTION_COLORS[i % ACTION_COLORS.length];
          return (
            <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{phase.month}</div>
              </div>
              <div style={{ fontSize: 11, color: "var(--text-dim)", fontStyle: "italic", marginBottom: 12, lineHeight: 1.4 }}>{phase.theme}</div>
              <ul style={{ margin: 0, padding: "0 0 0 14px" }}>
                {phase.points.map((pt, j) => (
                  <li key={j} style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.65, marginBottom: 6 }}>{pt}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* ── Monthly Targets ───────────────────────────────────────────────── */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "18px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 16 }}>
          Monthly Targets
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {plan.targets.map((t, i) => {
            const color = ACTION_COLORS[i % ACTION_COLORS.length];
            return (
              <div key={i} style={{ borderLeft: `2px solid ${color}`, paddingLeft: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>{t.month}</div>
                <div style={{ display: "flex", gap: 20, marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>Revenue</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.4px" }}>{t.revenue}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>ROAS</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.4px" }}>{t.roas}</div>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5 }}>{t.focus}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Product Performance ───────────────────────────────────────────── */}
      {topProducts.length > 0 && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "18px 24px", marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 14 }}>
            Top Products — Last 30 Days
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
            {topProducts.map((p, i) => {
              const hasRevenue = p.revenue > 0;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 4px", borderBottom: i < topProducts.length - 2 ? "1px solid var(--border)" : "none" }}>
                  <span style={{ fontSize: 11, color: "var(--text-very-dim)", fontWeight: 700, minWidth: 20, textAlign: "right" }}>#{i + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={p.title}>
                      {p.title}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 1 }}>
                      {p.conversions > 0 ? `${p.conversions} orders` : `${sym}${Math.round(p.cost ?? 0)} spend`}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    {hasRevenue ? (
                      <>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.3px" }}>
                          {sym}{Math.round(p.revenue).toLocaleString()}
                        </div>
                        {p.roas > 0 && (
                          <div style={{ fontSize: 10, color: "var(--text-dim)" }}>{p.roas.toFixed(1)}× ROAS</div>
                        )}
                      </>
                    ) : (
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{p.conversions} conv.</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Revenue Projection ────────────────────────────────────────────── */}
      {actualRoas != null && spend30d != null && (
        <GrowthChart actualRoas={actualRoas} spend30d={spend30d} targetRoas={targetRoas} currency={currency} />
      )}

      {/* ── Seasonal Note + Product Insight ──────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: plan.productInsight ? "1fr 1fr" : "1fr", gap: 12 }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "18px 20px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8 }}>
            Seasonal Outlook
          </div>
          <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.7, margin: 0 }}>{plan.seasonalNote}</p>
        </div>
        {plan.productInsight && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "18px 20px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8 }}>
              Product Insight
            </div>
            <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.7, margin: 0 }}>{plan.productInsight}</p>
          </div>
        )}
      </div>

    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ActionPlanTab({
  accountId,
  accountName,
  targetRoasDefault,
  currency,
}: {
  accountId:         string;
  accountName:       string;
  targetRoasDefault: number | null;
  currency:          string;
}) {
  const [storedPlan, setStoredPlan]   = useState<StoredPlan | null>(null);
  const [metrics, setMetrics]         = useState<Metrics | null>(null);
  const [products, setProducts]       = useState<SimpleProduct[] | null>(null);
  const [generating, setGenerating]   = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings]       = useState<PlanSettings>({
    targetRoas:   targetRoasDefault != null ? String(targetRoasDefault) : "",
    monthlyGoal:  "",
    contextNotes: "",
  });

  const sym = currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency === "PLN" ? "PLN " : "$";

  const loadPlan = useCallback(async () => {
    setLoadingPlan(true);
    try {
      const res = await fetch(`/api/accounts/${accountId}/action-plan`);
      if (res.ok) {
        const data = await res.json() as { plan: StoredPlan | null; metrics: Metrics | null };
        setStoredPlan(data.plan);
        setMetrics(data.metrics);
        if (data.plan?.settings.targetRoas) {
          setSettings(s => ({ ...s, targetRoas: s.targetRoas || String(data.plan!.settings.targetRoas) }));
        }
      }
    } finally {
      setLoadingPlan(false);
    }
  }, [accountId]);

  // Load products independently (non-blocking)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/accounts/${accountId}/products`);
        if (!res.ok) return;
        const data = await res.json() as { products?: { title: string; revenue: number; conversions: number; roas: number; cost: number }[] };
        if (data.products?.length) {
          setProducts(data.products.map(p => ({ title: p.title, revenue: p.revenue, conversions: p.conversions, roas: p.roas, cost: p.cost })));
        }
      } catch { /* products are optional */ }
    })();
  }, [accountId]);

  useEffect(() => { loadPlan(); }, [loadPlan]);

  useEffect(() => {
    if (!loadingPlan && !storedPlan) setShowSettings(true);
  }, [loadingPlan, storedPlan]);

  const generate = async () => {
    setGenerating(true);
    setError(null);
    setShowSettings(false);

    // Format products as a context string for Claude
    let productContext: string | null = null;
    const planProducts = products
      ? [...products]
          .sort((a, b) => b.revenue - a.revenue || b.conversions - a.conversions || (b.cost ?? 0) - (a.cost ?? 0))
          .filter(p => p.revenue > 0 || p.conversions > 0 || (p.cost ?? 0) > 1)
          .slice(0, 12)
      : [];
    if (planProducts.length > 0) {
      productContext =
        `Top ${planProducts.length} products by activity (last 30 days):\n` +
        planProducts.map((p, i) => {
          const parts = [`${i + 1}. ${p.title}`];
          if (p.revenue > 0) parts.push(`${sym}${Math.round(p.revenue)} revenue`);
          if (p.conversions > 0) parts.push(`${p.conversions} orders`);
          if (p.cost && p.cost > 0) parts.push(`${sym}${Math.round(p.cost)} spend`);
          if (p.roas > 0) parts.push(`ROAS ${p.roas.toFixed(1)}×`);
          return parts.join(" — ");
        }).join("\n");
    }

    try {
      const res = await fetch(`/api/accounts/${accountId}/action-plan`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          targetRoas:    settings.targetRoas   ? parseFloat(settings.targetRoas)   : null,
          monthlyGoal:   settings.monthlyGoal  ? parseFloat(settings.monthlyGoal)  : null,
          contextNotes:  settings.contextNotes || null,
          productContext,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        setError(body.error ?? "Failed to generate plan.");
        return;
      }

      const data = await res.json() as { ok: boolean; plan: StoredPlan };
      if (data.plan) setStoredPlan(data.plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="plan-toolbar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", color: "var(--text-dim)" }}>
            Client Action Plan
          </span>
          {storedPlan && !generating && (
            <span style={{ fontSize: 11, color: "var(--text-faint)", marginLeft: 10 }}>
              {new Date(storedPlan.generatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          )}
          {generating && (
            <span style={{ fontSize: 11, color: "var(--accent)", marginLeft: 10, display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Loader2 size={11} className="animate-spin" /> Generating plan…
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {storedPlan && !generating && (
            <button onClick={() => window.print()} style={{ display: "flex", alignItems: "center", gap: 5, background: "transparent", border: "1px solid var(--border-2)", borderRadius: 7, color: "var(--text-dim)", fontSize: 12, fontWeight: 500, padding: "7px 12px", cursor: "pointer" }}>
              <Printer size={13} /> Print / PDF
            </button>
          )}
          {storedPlan && !generating && (
            <button onClick={() => setShowSettings(s => !s)} style={{ display: "flex", alignItems: "center", gap: 5, background: "transparent", border: "1px solid var(--border-2)", borderRadius: 7, color: "var(--text-dim)", fontSize: 12, padding: "7px 12px", cursor: "pointer" }}>
              <RefreshCw size={12} /> Regenerate
            </button>
          )}
        </div>
      </div>

      {/* ── Settings form ────────────────────────────────────────────────── */}
      {showSettings && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 10, padding: "20px 24px", marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>
            Plan Settings — {MONTH_FULL[new Date().getMonth()]} {new Date().getFullYear()}
          </div>

          {metrics?.actualRoas && (
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16, padding: "8px 12px", background: "var(--surface-2)", borderRadius: 6 }}>
              Current ROAS: <strong style={{ color: "var(--text)" }}>{metrics.actualRoas.toFixed(2)}×</strong>
              {metrics.spend30d && <> · Monthly spend: <strong style={{ color: "var(--text)" }}>{sym}{Math.round(metrics.spend30d).toLocaleString()}</strong></>}
              {metrics.snapshotAt && <> · Data from {new Date(metrics.snapshotAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</>}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-dim)", display: "block", marginBottom: 6 }}>
                Target ROAS for this period
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="number" step="0.1"
                  placeholder={targetRoasDefault != null ? String(targetRoasDefault) : "e.g. 4.0"}
                  value={settings.targetRoas}
                  onChange={e => setSettings(s => ({ ...s, targetRoas: e.target.value }))}
                  style={{ width: "100%", boxSizing: "border-box", padding: "8px 30px 8px 10px", background: "var(--input-bg)", border: "1px solid var(--border-2)", borderRadius: 7, color: "var(--text)", fontSize: 13, outline: "none" }}
                />
                <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)", fontSize: 12 }}>×</span>
              </div>
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
              placeholder="e.g. Spring collection launching next month. Client wants to focus on dresses and tops. Competitor running heavy promotions."
              value={settings.contextNotes}
              onChange={e => setSettings(s => ({ ...s, contextNotes: e.target.value }))}
              style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", background: "var(--input-bg)", border: "1px solid var(--border-2)", borderRadius: 7, color: "var(--text)", fontSize: 13, outline: "none", resize: "vertical", fontFamily: "inherit" }}
            />
          </div>

          {products && (
            <div style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 16 }}>
              ✓ Product data loaded ({products.filter(p => p.revenue > 0).length} products with revenue)
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            {storedPlan && (
              <button onClick={() => setShowSettings(false)} style={{ background: "transparent", border: "1px solid var(--border-2)", borderRadius: 7, color: "var(--text-dim)", fontSize: 12, padding: "8px 16px", cursor: "pointer" }}>
                Cancel
              </button>
            )}
            <button
              onClick={generate}
              disabled={generating}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--btn-primary)", border: "none", borderRadius: 7, color: "#fff", fontSize: 13, fontWeight: 600, padding: "9px 20px", cursor: generating ? "not-allowed" : "pointer", opacity: generating ? 0.7 : 1 }}
            >
              {generating ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
              {generating ? "Generating…" : "Generate Plan"}
            </button>
          </div>
        </div>
      )}

      {/* ── Error ───────────────────────────────────────────────────────── */}
      {error && (
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "12px 16px", marginBottom: 16, display: "flex", gap: 8, fontSize: 13, color: "#ef4444" }}>
          <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} /> {error}
        </div>
      )}

      {/* ── Loading ──────────────────────────────────────────────────────── */}
      {generating && (
        <div style={{ border: "1px dashed var(--border-3)", borderRadius: 12, padding: "60px 32px", textAlign: "center" }}>
          <Loader2 size={24} className="animate-spin" style={{ color: "var(--accent)", margin: "0 auto 16px" }} />
          <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0 }}>
            Building your 90-day plan — this takes about 20–30 seconds…
          </p>
        </div>
      )}

      {/* ── Empty state ──────────────────────────────────────────────────── */}
      {!storedPlan && !generating && !error && !showSettings && (
        <div style={{ border: "1px dashed var(--border-3)", borderRadius: 12, padding: "60px 32px", textAlign: "center" }}>
          {loadingPlan
            ? <Loader2 size={18} className="animate-spin" style={{ color: "var(--text-dim)", margin: "0 auto" }} />
            : (
              <>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
                <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>No action plan yet</p>
                <p style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 400, margin: "0 auto 20px" }}>
                  Generate a 90-day client presentation with growth projections, product performance, seasonal context, and specific recommendations.
                </p>
                <button onClick={() => setShowSettings(true)} style={{ background: "var(--btn-primary)", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, padding: "10px 20px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <FileText size={14} /> Set Up Plan
                </button>
              </>
            )
          }
        </div>
      )}

      {/* ── Plan board ──────────────────────────────────────────────────── */}
      {storedPlan && !generating && (
        <PlanBoard
          storedPlan={storedPlan}
          metrics={metrics}
          products={products}
          currency={currency}
          accountName={accountName}
          targetRoasOverride={settings.targetRoas ? parseFloat(settings.targetRoas) : null}
        />
      )}
    </div>
  );
}
