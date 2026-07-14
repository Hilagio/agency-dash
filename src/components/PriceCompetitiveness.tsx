"use client";

import { useEffect, useState } from "react";
import { Loader2, AlertTriangle, TrendingUp, TrendingDown, Minus, RefreshCw, ExternalLink, Download } from "lucide-react";

interface PriceCompRow {
  itemId:           string;
  title:            string;
  brand:            string;
  yourPriceMicros:  number;
  benchmarkMicros:  number;
  currencyCode:     string;
  countryCode:      string;
  priceDiffPercent: number;
  status:           "competitive" | "above" | "well_above" | "below";
  spendMicros:      number;
}

interface ApiResponse {
  merchantId?:       string;
  products?:         PriceCompRow[];
  scopeMissing?:     boolean;
  noMerchantCenter?: boolean;
  error?:            string;
  apiError?:         string;
}

function microsToPrice(micros: number, currency: string): string {
  const amount = micros / 1_000_000;
  const sym = currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency === "USD" ? "$" : currency + " ";
  return `${sym}${amount.toFixed(2)}`;
}

function exportXml(products: PriceCompRow[], merchantId: string) {
  const now = new Date().toISOString().split("T")[0];

  const escXml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const rows = products.map(p => {
    const price      = (p.yourPriceMicros / 1_000_000).toFixed(2);
    const benchPrice = (p.benchmarkMicros / 1_000_000).toFixed(2);
    const spend      = (p.spendMicros / 1_000_000).toFixed(2);
    return [
      `    <product>`,
      `      <id>${escXml(p.itemId)}</id>`,
      `      <title>${escXml(p.title)}</title>`,
      `      <brand>${escXml(p.brand)}</brand>`,
      `      <country>${escXml(p.countryCode)}</country>`,
      `      <price currency="${escXml(p.currencyCode)}">${price}</price>`,
      `      <benchmarkPrice currency="${escXml(p.currencyCode)}">${benchPrice}</benchmarkPrice>`,
      `      <priceDiffPercent>${p.priceDiffPercent > 0 ? "+" : ""}${p.priceDiffPercent.toFixed(1)}</priceDiffPercent>`,
      `      <status>${p.status}</status>`,
      p.spendMicros > 0 ? `      <adSpend currency="${escXml(p.currencyCode)}" period="last30d">${spend}</adSpend>` : "",
      `    </product>`,
    ].filter(Boolean).join("\n");
  }).join("\n");

  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<priceCompetitivenessReport>`,
    `  <generated>${now}</generated>`,
    `  <merchantId>${escXml(merchantId)}</merchantId>`,
    `  <note>benchmarkPrice = Google median competitor price. price = current product price as reported by Merchant Center. adSpend = Google Ads spend on this product over the last 30 days.</note>`,
    `  <products>`,
    rows,
    `  </products>`,
    `</priceCompetitivenessReport>`,
  ].join("\n");

  const blob = new Blob([xml], { type: "application/xml" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `price-competitiveness-${now}.xml`;
  a.click();
  URL.revokeObjectURL(url);
}

const STATUS_CONFIG = {
  competitive: { color: "#22c55e", bg: "rgba(34,197,94,0.08)",  border: "rgba(34,197,94,0.2)",  label: "Competitive", icon: Minus        },
  below:       { color: "#22c55e", bg: "rgba(34,197,94,0.08)",  border: "rgba(34,197,94,0.2)",  label: "Below mkt",  icon: TrendingDown  },
  above:       { color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", label: "Above mkt",  icon: TrendingUp    },
  well_above:  { color: "#ef4444", bg: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.2)",  label: "Too high",   icon: TrendingUp    },
} as const;

type SortKey = "priceDiffPercent" | "yourPrice" | "benchmarkPrice" | "title" | "spend";
type FilterKey = "all" | "above" | "well_above" | "competitive" | "below";

export function PriceCompetitiveness({ accountId, merchantCenterId }: { accountId: string; merchantCenterId?: string | null }) {
  const [data,    setData]    = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [sort,    setSort]    = useState<SortKey>("priceDiffPercent");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const [filter,  setFilter]  = useState<FilterKey>("all");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/accounts/${accountId}/price-competitiveness`);
      setData(await res.json());
    } catch {
      setData({ error: "Failed to load price data" });
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when the merchantCenterId is saved (key change triggers remount,
  // but we also watch it explicitly to reload without unmounting)
  useEffect(() => { load(); }, [accountId, merchantCenterId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "60px 0", justifyContent: "center", color: "var(--text-dim)", fontSize: 13 }}>
      <Loader2 size={16} className="animate-spin" /> Fetching Merchant Center price data…
    </div>
  );

  if (!data) return null;

  // ── Graceful states ──────────────────────────────────────────────────────────

  if (data.error) return (
    <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 10, padding: "16px 20px", fontSize: 13, color: "#f87171" }}>
      {data.error}
    </div>
  );

  if (data.scopeMissing) return (
    <div style={{ border: "1px dashed var(--border-2)", borderRadius: 12, padding: "36px 32px", textAlign: "center" }}>
      <AlertTriangle size={24} style={{ color: "#f59e0b", marginBottom: 12 }} />
      <p style={{ color: "var(--text-2)", fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Reconnect Google to enable price intelligence</p>
      <p style={{ color: "var(--text-faint)", fontSize: 12, marginBottom: 16 }}>
        Merchant Center access requires an updated Google permission. Click below to reconnect — it only takes a moment.
      </p>
      <a
        href={`/api/auth/google-ads?returnTo=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : "/")}`}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "var(--accent)", color: "#fff",
          padding: "8px 18px", borderRadius: 7, fontSize: 12, fontWeight: 600,
          textDecoration: "none",
        }}
      >
        <ExternalLink size={12} /> Reconnect Google
      </a>
      {data.apiError && (
        <details style={{ marginTop: 16, textAlign: "left" }}>
          <summary style={{ fontSize: 11, color: "var(--text-faint)", cursor: "pointer" }}>API error detail</summary>
          <pre style={{ fontSize: 10, color: "var(--text-faint)", marginTop: 6, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
            {data.apiError}
          </pre>
        </details>
      )}
    </div>
  );

  if (data.noMerchantCenter) return (
    <div style={{ border: "1px dashed var(--border-2)", borderRadius: 12, padding: "32px", textAlign: "center" }}>
      <p style={{ color: "var(--text-dim)", fontSize: 14, marginBottom: 6 }}>Merchant Center not found automatically</p>
      <p style={{ color: "var(--text-faint)", fontSize: 12, lineHeight: 1.6 }}>
        Auto-discovery via Google Ads returned no linked Merchant Center.<br />
        Enter your Merchant Center ID manually using the field above — find it at{" "}
        <strong>merchant center → Settings → Business info</strong>.
      </p>
    </div>
  );

  const products = data.products ?? [];

  if (products.length === 0) return (
    <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-faint)", fontSize: 13 }}>
      No price competitiveness data available. Google needs at least 3 competitor price signals per product.
    </div>
  );

  // ── Summary counts ───────────────────────────────────────────────────────────

  const wellAboveCount = products.filter(p => p.status === "well_above").length;
  const aboveCount     = products.filter(p => p.status === "above").length;
  const competCount    = products.filter(p => p.status === "competitive").length;
  const belowCount     = products.filter(p => p.status === "below").length;
  const hasSpend       = products.some(p => p.spendMicros > 0);

  // ── Filter + sort ────────────────────────────────────────────────────────────

  let visible = filter === "all" ? [...products] : products.filter(p => p.status === filter);

  visible.sort((a, b) => {
    let va: number, vb: number;
    if (sort === "priceDiffPercent")  { va = a.priceDiffPercent;  vb = b.priceDiffPercent;  }
    else if (sort === "yourPrice")    { va = a.yourPriceMicros;   vb = b.yourPriceMicros;   }
    else if (sort === "benchmarkPrice") { va = a.benchmarkMicros; vb = b.benchmarkMicros;   }
    else if (sort === "spend")        { va = a.spendMicros;         vb = b.spendMicros;         }
    else { return sortDir === "desc" ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title); }
    return sortDir === "desc" ? vb - va : va - vb;
  });

  const setColumn = (key: SortKey) => {
    if (sort === key) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSort(key); setSortDir("desc"); }
  };
  const sortIcon = (key: SortKey) => sort === key ? (sortDir === "desc" ? " ↓" : " ↑") : "";

  // Grid: product | your price | benchmark | gap % | spend (conditional) | status
  const gridCols = hasSpend
    ? "1fr 110px 110px 75px 90px 80px"
    : "1fr 110px 110px 75px 80px";

  return (
    <div>

      {/* Toolbar: filter chips + export */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
        {([
          ["well_above", `Too high (${wellAboveCount})`],
          ["above",      `Above mkt (${aboveCount})`],
          ["competitive",`Competitive (${competCount})`],
          ["below",      `Below mkt (${belowCount})`],
        ] as [FilterKey, string][]).map(([key, label]) => {
          const cfg = STATUS_CONFIG[key as keyof typeof STATUS_CONFIG];
          const isActive = filter === key;
          return (
            <button
              key={key}
              onClick={() => setFilter(f => f === key ? "all" : key)}
              style={{
                fontSize: 11, fontWeight: 500,
                padding: "5px 12px", borderRadius: 6, cursor: "pointer",
                border:     `1px solid ${isActive ? cfg.border : "var(--border-2)"}`,
                background: isActive ? cfg.bg : "transparent",
                color:      isActive ? cfg.color : "var(--text-muted)",
              }}
            >
              {label}
            </button>
          );
        })}

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button
            onClick={() => exportXml(visible, data.merchantId ?? "")}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "var(--surface)", border: "1px solid var(--border-2)",
              borderRadius: 7, color: "var(--text-dim)", fontSize: 11, padding: "5px 10px", cursor: "pointer",
            }}
          >
            <Download size={11} /> Export XML
          </button>
          <button
            onClick={load}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "var(--surface)", border: "1px solid var(--border-2)",
              borderRadius: 7, color: "var(--text-dim)", fontSize: 11, padding: "5px 10px", cursor: "pointer",
            }}
          >
            <RefreshCw size={11} /> Refresh
          </button>
        </div>
      </div>

      {/* Alert: products priced too high */}
      {wellAboveCount > 0 && filter !== "competitive" && filter !== "below" && (
        <div style={{
          background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)",
          borderRadius: 8, padding: "10px 16px", marginBottom: 12,
          fontSize: 12, color: "#ef4444", display: "flex", alignItems: "center", gap: 8,
        }}>
          <AlertTriangle size={13} />
          <strong>{wellAboveCount} product{wellAboveCount > 1 ? "s" : ""}</strong> are priced &gt;15% above the market benchmark — competitors with similar prices and strong reviews will outperform these listings.
        </div>
      )}

      {/* Context note */}
      <div style={{
        background: "rgba(51, 204, 128,0.05)", border: "1px solid rgba(51, 204, 128,0.12)",
        borderRadius: 8, padding: "9px 14px", marginBottom: 14,
        fontSize: 11, color: "var(--text-muted)",
      }}>
        Benchmark = median competitor price reported by Google. Gap % = (your price − benchmark) ÷ benchmark. Spend = last 30 days Google Ads.
      </div>

      {visible.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-faint)", fontSize: 13 }}>
          No products match this filter.
        </div>
      ) : (
        <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
          {/* Table header */}
          <div style={{
            display: "grid", gridTemplateColumns: gridCols,
            gap: 8, padding: "7px 16px",
            background: "var(--surface)", borderBottom: "1px solid var(--border)",
          }}>
            {[
              { key: "title",           label: "Product"    },
              { key: "yourPrice",       label: "Your price" },
              { key: "benchmarkPrice",  label: "Benchmark"  },
              { key: "priceDiffPercent",label: "Gap %"      },
              ...(hasSpend ? [{ key: "spend", label: "Spend 30d" }] : []),
              { key: null,              label: "Status"     },
            ].map(({ key, label }, i) => (
              <span
                key={i}
                onClick={key ? () => setColumn(key as SortKey) : undefined}
                style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  color: sort === key ? "var(--text-muted)" : "var(--text-faint)",
                  textAlign: i === 0 ? "left" : "right",
                  cursor: key ? "pointer" : "default",
                  userSelect: "none",
                }}
              >
                {label}{key ? sortIcon(key as SortKey) : ""}
              </span>
            ))}
          </div>

          {/* Rows */}
          {visible.map((p, i) => {
            const cfg      = STATUS_CONFIG[p.status];
            const Icon     = cfg.icon;
            const isAtRisk = p.status === "well_above";
            return (
              <div
                key={`${p.itemId}-${p.countryCode}`}
                style={{
                  display: "grid", gridTemplateColumns: gridCols,
                  gap: 8, padding: "9px 16px",
                  borderBottom: i < visible.length - 1 ? "1px solid var(--border)" : "none",
                  background: "var(--bg)",
                  borderLeft: isAtRisk ? "2px solid #ef4444" : "2px solid transparent",
                }}
              >
                {/* Product */}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.title || p.itemId}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-faint)", marginTop: 1 }}>
                    {[p.brand, p.itemId, p.countryCode].filter(Boolean).join(" · ")}
                  </div>
                </div>

                {/* Your price */}
                <div style={{ textAlign: "right", fontSize: 12, color: "var(--text-muted)" }}>
                  {microsToPrice(p.yourPriceMicros, p.currencyCode)}
                </div>

                {/* Benchmark */}
                <div style={{ textAlign: "right", fontSize: 12, color: "var(--text-faint)", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                  {microsToPrice(p.benchmarkMicros, p.currencyCode)}
                </div>

                {/* Gap % */}
                <div style={{
                  textAlign: "right", fontSize: 12, fontWeight: 600,
                  color: cfg.color,
                  display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3,
                }}>
                  <Icon size={11} />
                  {p.priceDiffPercent > 0 ? "+" : ""}{p.priceDiffPercent.toFixed(1)}%
                </div>

                {/* Spend (conditional column) */}
                {hasSpend && (
                  <div style={{ textAlign: "right", fontSize: 12, color: "var(--text-dim)", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                    {p.spendMicros > 0
                      ? microsToPrice(p.spendMicros, p.currencyCode)
                      : <span style={{ color: "var(--text-faint)", fontStyle: "italic" }}>—</span>}
                  </div>
                )}

                {/* Status badge */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                  <span style={{
                    fontSize: 10, fontWeight: 600, letterSpacing: "0.3px",
                    background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
                    padding: "2px 8px", borderRadius: 20,
                  }}>
                    {cfg.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
        {[
          { color: "#ef4444", label: "Well above market (>15%)" },
          { color: "#f59e0b", label: "Above market (3–15%)" },
          { color: "#22c55e", label: "Competitive or below (≤3%)" },
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
