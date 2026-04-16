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
  // joined from price-competitiveness
  priceDiffPercent?: number;
  priceStatus?:      "competitive" | "above" | "well_above" | "below";
}

interface ShoppingOverview {
  hasShoppingCampaigns: boolean;
  noShoppingFeedData?:  boolean;
  fromMerchantFeed?:    boolean;
  hasMore?:             boolean;
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

interface PriceCompRow {
  itemId:          string;
  priceDiffPercent: number;
  status:          "competitive" | "above" | "well_above" | "below";
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

function priceDiffLabel(diff: number, status: string) {
  const sign = diff > 0 ? "+" : "";
  const pct  = `${sign}${diff.toFixed(0)}%`;
  if (status === "well_above") return { label: pct, color: "#f87171" };
  if (status === "above")      return { label: pct, color: "#fbbf24" };
  if (status === "below")      return { label: pct, color: "#60a5fa" };
  return { label: pct, color: "#4ade80" };
}

type SortKey = "conversions" | "cost" | "clicks" | "priceDiffPercent";
type SortDir = "desc" | "asc";

export function ProductPerformance({ accountId, currency }: { accountId: string; currency: string }) {
  const [data, setData]               = useState<ShoppingOverview | null>(null);
  const [loading, setLoading]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [page, setPage]               = useState(0);
  const [sortKey, setSortKey]         = useState<SortKey>("conversions");
  const [sortDir, setSortDir]         = useState<SortDir>("desc");
  const [filter, setFilter]           = useState<"all" | "no-conversions" | "overpriced">("all");
  const [hasPriceData, setHasPriceData] = useState(false);
  const [priceMap, setPriceMap]         = useState<Map<string, PriceCompRow>>(new Map());

  const currSym = currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$";

  // Initial load: products page 0 + price competitiveness in parallel
  useEffect(() => {
    setLoading(true);
    setPage(0);
    Promise.all([
      fetch(`/api/accounts/${accountId}/products?page=0`).then(r => r.json()),
      fetch(`/api/accounts/${accountId}/price-competitiveness`).then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([prod, price]) => {
      if ("error" in prod) { setError(prod.error); return; }
      const overview = prod as ShoppingOverview;

      let pm = new Map<string, PriceCompRow>();
      if (price?.products?.length) {
        pm = new Map<string, PriceCompRow>(
          (price.products as PriceCompRow[]).map((p: PriceCompRow) => [p.itemId, p])
        );
        setPriceMap(pm);
        setHasPriceData(true);
      }

      overview.products = overview.products.map(p => {
        const pc = pm.get(p.itemId);
        return pc ? { ...p, priceDiffPercent: pc.priceDiffPercent, priceStatus: pc.status } : p;
      });

      setData(overview);
    })
    .catch(e => setError(e.message))
    .finally(() => setLoading(false));
  }, [accountId]);

  function loadMore() {
    const nextPage = page + 1;
    setLoadingMore(true);
    fetch(`/api/accounts/${accountId}/products?page=${nextPage}`)
      .then(r => r.json())
      .then((prod: ShoppingOverview) => {
        if ("error" in prod) return;
        const newProducts = prod.products.map(p => {
          const pc = priceMap.get(p.itemId);
          return pc ? { ...p, priceDiffPercent: pc.priceDiffPercent, priceStatus: pc.status } : p;
        });
        setData(prev => prev ? {
          ...prev,
          hasMore: prod.hasMore,
          products: [...prev.products, ...newProducts],
        } : prev);
        setPage(nextPage);
      })
      .catch(() => {/* silently ignore load-more errors */})
      .finally(() => setLoadingMore(false));
  }

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

  if (data.noShoppingFeedData) return (
    <div style={{ border: "1px dashed var(--border-2)", borderRadius: 12, padding: "48px 32px", textAlign: "center" }}>
      <Package size={28} style={{ color: "var(--text-faint)", marginBottom: 12 }} />
      <p style={{ color: "var(--text-dim)", fontSize: 14, marginBottom: 4 }}>Campaigns found, but no Shopping product data</p>
      <p style={{ color: "var(--text-faint)", fontSize: 12, lineHeight: 1.7, maxWidth: 420, margin: "0 auto" }}>
        The {data.campaignCount} active PMax/Shopping campaign{data.campaignCount !== 1 ? "s" : ""} had no impressions
        via the Shopping surface in the last 30 days. This usually means the campaign has no product feed linked
        or is serving exclusively on Search/Display/YouTube.
      </p>
    </div>
  );

  // Sort + filter products
  let products = [...data.products];

  if (filter === "no-conversions") products = products.filter(p => p.cost > 0 && p.conversions === 0);
  if (filter === "overpriced")     products = products.filter(p => p.priceStatus === "above" || p.priceStatus === "well_above");

  products.sort((a, b) => {
    const va = (a[sortKey] ?? 0) as number;
    const vb = (b[sortKey] ?? 0) as number;
    return sortDir === "desc" ? vb - va : va - vb;
  });

  const setSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const sortIcon = (key: SortKey) => sortKey === key ? (sortDir === "desc" ? " ↓" : " ↑") : "";

  const noConversions = data.products.filter(p => p.cost > 0 && p.conversions === 0).length;
  const overpriced    = data.products.filter(p => p.priceStatus === "above" || p.priceStatus === "well_above").length;

  const cols = hasPriceData
    ? "1fr 70px 80px 80px 70px 80px"
    : "1fr 70px 80px 80px 70px";

  return (
    <div>

      {/* Feed-only banner: MC catalog fallback — no Shopping data available */}
      {data.fromMerchantFeed && (
        <div style={{
          background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)",
          borderRadius: 8, padding: "10px 16px", marginBottom: 16,
          fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 8,
        }}>
          <Package size={13} style={{ flexShrink: 0 }} />
          Showing product catalog from Merchant Center — no Shopping surface data available in the last 30 days.
        </div>
      )}

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
        {([
          { f: "all",       label: `All (${data.products.length})`,       color: "var(--text-dim)" },
          { f: "no-conversions", label: `Spend, no conversions (${noConversions})`, color: "#fbbf24" },
          ...(hasPriceData ? [{ f: "overpriced", label: `Above market price (${overpriced})`, color: "#f87171" }] : []),
        ] as { f: string; label: string; color: string }[]).map(({ f, label, color }) => (
          <button
            key={f}
            onClick={() => setFilter(f as typeof filter)}
            style={{
              fontSize: 11, fontWeight: 500,
              padding: "4px 10px", borderRadius: 6,
              border: `1px solid ${filter === f ? color : "var(--border-2)"}`,
              background: filter === f ? `${color}12` : "transparent",
              color: filter === f ? color : "var(--text-muted)",
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      {products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-faint)", fontSize: 13 }}>
          No products match this filter.
        </div>
      ) : (
        <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: cols, gap: 8, padding: "7px 16px", background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
            {[
              { key: null,               label: "Product" },
              { key: "clicks",           label: "Clicks" },
              { key: "conversions",      label: "Conversions" },
              { key: "cost",             label: "Cost" },
              { key: null,               label: "CTR" },
              ...(hasPriceData ? [{ key: "priceDiffPercent", label: "vs Market" }] : []),
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
            const noSale   = p.cost > 0 && p.conversions === 0;
            const priceInfo = (p.priceDiffPercent != null && p.priceStatus)
              ? priceDiffLabel(p.priceDiffPercent, p.priceStatus)
              : null;

            return (
              <div
                key={p.itemId}
                style={{
                  display: "grid", gridTemplateColumns: cols,
                  gap: 8, padding: "9px 16px",
                  borderBottom: i < products.length - 1 ? "1px solid var(--border)" : "none",
                  background: "var(--bg)",
                  borderLeft: noSale ? "2px solid #fbbf24" : "2px solid transparent",
                }}
              >
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
                <Cell value={p.cost > 0 ? `${currSym}${fmt(p.cost)}` : "—"} />
                <Cell value={p.impressions > 0 ? `${(p.ctr * 100).toFixed(1)}%` : "—"} />
                {hasPriceData && (
                  <Cell
                    value={priceInfo?.label ?? "—"}
                    color={priceInfo?.color}
                    bold={!!priceInfo}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Load more */}
      {data.hasMore && (
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button
            onClick={loadMore}
            disabled={loadingMore}
            style={{
              background: "var(--surface)", border: "1px solid var(--border-2)",
              borderRadius: 8, padding: "8px 20px", fontSize: 12, color: "var(--text-2)",
              cursor: loadingMore ? "default" : "pointer", display: "inline-flex", alignItems: "center", gap: 6,
            }}
          >
            {loadingMore && <Loader2 size={12} className="animate-spin" />}
            {loadingMore ? "Loading…" : "Load 10 more"}
          </button>
        </div>
      )}

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
        {[
          { color: "#fbbf24", label: "Spend with no conversions" },
          ...(hasPriceData ? [
            { color: "#f87171", label: "Price above market" },
            { color: "#60a5fa", label: "Price below market" },
          ] : []),
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



