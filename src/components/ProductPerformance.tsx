"use client";

import { useEffect, useState } from "react";
import { Loader2, TrendingUp, TrendingDown, AlertTriangle, Package, ShoppingBag } from "lucide-react";

interface ProductRow {
  itemId:      string;
  title:       string;
  brand:       string;
  clicks:      number;
  impressions: number;
  ctr:         number;
  conversions: number;
  revenue:     number;
  cost:        number;
  roas:        number;
  cpc:         number;
}

interface ShoppingOverview {
  hasShoppingCampaigns: boolean;
  campaignCount:        number;
  totalCost:            number;
  totalRevenue:         number;
  totalConversions:     number;
  roas:                 number;
  isLostBudget:         number;
  isLostRank:           number;
  disapprovedCount:     number;
  products:             ProductRow[];
}

function fmt(n: number, decimals = 1) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`;
  return n.toFixed(decimals);
}

function roasColor(roas: number, avgRoas: number) {
  if (roas <= 0)           return "var(--text-faint)";
  if (roas >= avgRoas * 1.3) return "#4ade80";
  if (roas >= avgRoas * 0.7) return "var(--text-2)";
  return "#f87171";
}

type SortKey = "revenue" | "roas" | "cost" | "conversions" | "clicks";
type SortDir = "desc" | "asc";

export function ProductPerformance({ accountId, currency }: { accountId: string; currency: string }) {
  const [data, setData]       = useState<ShoppingOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("revenue");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [filter, setFilter]   = useState<"all" | "winners" | "losers" | "no-sales">("all");

  const currSym = currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$";

  useEffect(() => {
    setLoading(true);
    fetch(`/api/accounts/${accountId}/products`)
      .then(r => r.json())
      .then((d: ShoppingOverview | { error: string }) => {
        if ("error" in d) setError(d.error);
        else setData(d);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [accountId]);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "60px 0", color: "var(--text-dim)", fontSize: 13 }}>
      <Loader2 size={16} className="animate-spin" /> Loading product data…
    </div>
  );

  if (error) return (
    <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 10, padding: "16px 20px", fontSize: 13, color: "#f87171" }}>
      {error}
    </div>
  );

  if (!data?.hasShoppingCampaigns) return (
    <div style={{ border: "1px dashed var(--border-2)", borderRadius: 12, padding: "48px 32px", textAlign: "center" }}>
      <ShoppingBag size={28} style={{ color: "var(--text-faint)", marginBottom: 12 }} />
      <p style={{ color: "var(--text-dim)", fontSize: 14, marginBottom: 4 }}>No Shopping or PMax campaigns found</p>
      <p style={{ color: "var(--text-faint)", fontSize: 12 }}>This account doesn't have active Shopping or Performance Max campaigns in the last 30 days.</p>
    </div>
  );

  // Sort + filter products
  let products = [...data.products];

  if (filter === "winners") products = products.filter(p => p.roas >= data.roas * 1.3 && p.cost > 0);
  if (filter === "losers")  products = products.filter(p => p.roas > 0 && p.roas < data.roas * 0.7 && p.cost > 5);
  if (filter === "no-sales") products = products.filter(p => p.cost > 0 && p.conversions === 0);

  products.sort((a, b) => {
    const va = a[sortKey], vb = b[sortKey];
    return sortDir === "desc" ? vb - va : va - vb;
  });

  const setSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const sortIcon = (key: SortKey) => sortKey === key ? (sortDir === "desc" ? " ↓" : " ↑") : "";

  const winners  = data.products.filter(p => p.roas >= data.roas * 1.3 && p.cost > 0).length;
  const losers   = data.products.filter(p => p.roas > 0 && p.roas < data.roas * 0.7 && p.cost > 5).length;
  const noSales  = data.products.filter(p => p.cost > 0 && p.conversions === 0).length;

  return (
    <div>

      {/* Shopping overview cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 20 }}>
        <OverviewCard label="Revenue (30d)" value={`${currSym}${fmt(data.totalRevenue)}`} sub={`${data.campaignCount} campaigns`} />
        <OverviewCard label="ROAS" value={`${data.roas.toFixed(1)}x`} sub={`${currSym}${fmt(data.totalCost)} spend`} color={data.roas >= 2 ? "#4ade80" : data.roas >= 1 ? "#fbbf24" : "#f87171"} />
        <OverviewCard label="Conversions" value={fmt(data.totalConversions, 0)} sub={`${data.products.length} products`} />
        <OverviewCard
          label="IS lost to budget"
          value={`${Math.round(data.isLostBudget * 100)}%`}
          sub="Shopping campaigns"
          color={data.isLostBudget > 0.2 ? "#f87171" : data.isLostBudget > 0.1 ? "#fbbf24" : "#4ade80"}
        />
        <OverviewCard
          label="IS lost to rank"
          value={`${Math.round(data.isLostRank * 100)}%`}
          sub="Feed quality / bid"
          color={data.isLostRank > 0.2 ? "#f87171" : data.isLostRank > 0.1 ? "#fbbf24" : "#4ade80"}
        />
        {data.disapprovedCount > 0 && (
          <OverviewCard
            label="Disapproved"
            value={String(data.disapprovedCount)}
            sub="products"
            color="#f87171"
            icon={<AlertTriangle size={12} style={{ color: "#f87171" }} />}
          />
        )}
      </div>

      {/* Filters + sort */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: "var(--text-faint)", marginRight: 4 }}>Show:</span>
        {(["all", "winners", "losers", "no-sales"] as const).map(f => {
          const labels: Record<typeof f, string> = {
            all:      `All (${data.products.length})`,
            winners:  `Winners (${winners})`,
            losers:   `Underperformers (${losers})`,
            "no-sales": `Spend, no sales (${noSales})`,
          };
          const colors: Record<typeof f, string> = { all: "var(--text-dim)", winners: "#4ade80", losers: "#f87171", "no-sales": "#fbbf24" };
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                fontSize: 11, fontWeight: 500,
                padding: "4px 10px", borderRadius: 6,
                border: `1px solid ${filter === f ? colors[f] : "var(--border-2)"}`,
                background: filter === f ? `${colors[f]}12` : "transparent",
                color: filter === f ? colors[f] : "var(--text-muted)",
                cursor: "pointer",
              }}
            >
              {labels[f]}
            </button>
          );
        })}
      </div>

      {/* Table */}
      {products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-faint)", fontSize: 13 }}>
          No products match this filter.
        </div>
      ) : (
        <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
          {/* Header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 70px 70px 80px 80px 70px 70px",
            gap: 8, padding: "7px 16px",
            background: "var(--surface)", borderBottom: "1px solid var(--border)",
          }}>
            {[
              { key: null,          label: "Product" },
              { key: "clicks",      label: "Clicks" },
              { key: "conversions", label: "Sales" },
              { key: "revenue",     label: "Revenue" },
              { key: "cost",        label: "Cost" },
              { key: "roas",        label: "ROAS" },
              { key: null,          label: "CTR" },
            ].map(({ key, label }, i) => (
              <span
                key={i}
                onClick={key ? () => setSort(key as SortKey) : undefined}
                style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: "0.5px",
                  textTransform: "uppercase", color: sortKey === key ? "var(--text-muted)" : "var(--text-faint)",
                  textAlign: i > 0 ? "right" : "left",
                  cursor: key ? "pointer" : "default",
                  userSelect: "none",
                }}
              >
                {label}{key ? sortIcon(key as SortKey) : ""}
              </span>
            ))}
          </div>

          {/* Rows */}
          {products.map((p, i) => {
            const color = roasColor(p.roas, data.roas);
            const isWinner = p.roas >= data.roas * 1.3 && p.cost > 0;
            const isLoser  = p.roas > 0 && p.roas < data.roas * 0.7 && p.cost > 5;
            const noSale   = p.cost > 0 && p.conversions === 0;

            return (
              <div
                key={p.itemId}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 70px 70px 80px 80px 70px 70px",
                  gap: 8, padding: "9px 16px",
                  borderBottom: i < products.length - 1 ? "1px solid var(--border)" : "none",
                  background: "var(--bg)",
                  borderLeft: isWinner ? "2px solid #4ade80" : isLoser ? "2px solid #f87171" : noSale ? "2px solid #fbbf24" : "2px solid transparent",
                }}
              >
                {/* Product title */}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.title || "—"}
                  </div>
                  {p.brand && (
                    <div style={{ fontSize: 10, color: "var(--text-faint)", marginTop: 1 }}>{p.brand} · {p.itemId}</div>
                  )}
                </div>

                <Cell value={fmt(p.clicks, 0)} />
                <Cell value={p.conversions > 0 ? fmt(p.conversions, 1) : "—"} color={p.conversions === 0 && p.cost > 0 ? "#fbbf24" : undefined} />
                <Cell value={p.revenue > 0 ? `${currSym}${fmt(p.revenue)}` : "—"} />
                <Cell value={p.cost > 0 ? `${currSym}${fmt(p.cost)}` : "—"} />
                <Cell
                  value={p.roas > 0 ? `${p.roas.toFixed(1)}x` : p.cost > 0 ? "0x" : "—"}
                  color={p.cost > 0 ? color : undefined}
                  bold
                />
                <Cell value={p.impressions > 0 ? `${(p.ctr * 100).toFixed(1)}%` : "—"} />
              </div>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
        {[
          { color: "#4ade80", label: "ROAS ≥ 130% of avg" },
          { color: "#f87171", label: "ROAS < 70% of avg" },
          { color: "#fbbf24", label: "Spend with no sales" },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
            <span style={{ fontSize: 10, color: "var(--text-faint)" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function OverviewCard({ label, value, sub, color, icon }: {
  label: string; value: string; sub?: string; color?: string; icon?: React.ReactNode;
}) {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
        {icon}
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", color: "var(--text-faint)" }}>{label}</span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", color: color ?? "var(--text)", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function Cell({ value, color, bold }: { value: string; color?: string; bold?: boolean }) {
  return (
    <div style={{
      textAlign: "right", fontSize: 12,
      fontWeight: bold ? 600 : 400,
      color: color ?? "var(--text-muted)",
      letterSpacing: bold ? "-0.3px" : 0,
      display: "flex", alignItems: "center", justifyContent: "flex-end",
    }}>
      {value}
    </div>
  );
}
