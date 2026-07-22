"use client";

/**
 * Public, read-only CLIENT performance page — opened via an unguessable share
 * link (/share/<token>). No login. Client-facing, so the copy is Dutch and the
 * framing is a calm performance overview: spend, revenue, ROAS/POAS, a trend,
 * and top products. Deliberately NOT the internal diagnosis — no problems,
 * hypotheses, or agency jargon. Data comes from /api/share/<token> (curated).
 */
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

interface Win { days: number; spend: number; conversions: number; roas: number | null; poas: number | null; orders: number | null; revenue: number | null; partial: boolean }
interface Day { date: string; spend: number; conversions: number; conversionValue: number; revenue: number }
interface Product { name: string; spend: number; clicks: number; conversions: number; roas: number | null }
interface Data { account: { name: string; client: string | null }; lang: "nl" | "en"; currency: string; hasCommerce: boolean; windows: Win[]; days: Day[]; products: Product[]; generatedAt: string }

// Client-facing copy in both languages; the link's language is chosen at creation.
const COPY = {
  nl: {
    eyebrow: "Google Ads · Prestatieoverzicht", loading: "Laden…",
    unavailTitle: "Dit overzicht is niet beschikbaar", unavailBody: "De link klopt niet meer of is verlopen. Vraag je accountmanager om een nieuwe.",
    periods: { 7: "7 dagen", 30: "30 dagen", 90: "90 dagen" },
    adSpend: "Advertentiekosten", revenue: "Omzet", viaAds: "via Google Ads", roasSub: "omzet ÷ kosten", orders: "Bestellingen",
    conversions: "Conversies", roasSubConv: "waarde ÷ kosten", poasSub: "winst na marge",
    trend: "Verloop", cost: "Kosten", revenueShort: "Omzet",
    topTitle: "Best presterende producten", last30: "laatste 30 dagen",
    product: "Product", clicks: "Klikken", updated: "Bijgewerkt", managed: "Beheerd door Ecomtrada", locale: "nl-NL",
  },
  en: {
    eyebrow: "Google Ads · Performance overview", loading: "Loading…",
    unavailTitle: "This overview isn't available", unavailBody: "The link is no longer valid or has expired. Ask your account manager for a new one.",
    periods: { 7: "7 days", 30: "30 days", 90: "90 days" },
    adSpend: "Ad spend", revenue: "Revenue", viaAds: "via Google Ads", roasSub: "revenue ÷ spend", orders: "Orders",
    conversions: "Conversions", roasSubConv: "value ÷ spend", poasSub: "profit after margin",
    trend: "Trend", cost: "Spend", revenueShort: "Revenue",
    topTitle: "Top performing products", last30: "last 30 days",
    product: "Product", clicks: "Clicks", updated: "Updated", managed: "Managed by Ecomtrada", locale: "en-GB",
  },
} as const;

export default function ClientSharePage() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);

  useEffect(() => {
    fetch(`/api/share/${token}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((d: Data) => setData(d))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [token]);

  const loc = data?.lang === "en" ? "en-GB" : "nl-NL";
  const money = (n: number | null | undefined) => n == null ? "—" : `${data?.currency ?? "€"}${Math.round(n).toLocaleString(loc)}`;
  const num = (n: number | null | undefined) => n == null ? "—" : Math.round(n).toLocaleString(loc);
  const win = data?.windows.find(w => w.days === period);

  // Trend series scaled to the chosen period (last N days).
  const series = useMemo(() => (data?.days ?? []).slice(-period), [data, period]);
  const maxVal = Math.max(1, ...series.map(d => Math.max(d.spend, d.revenue || d.conversionValue)));

  if (loading) return <Shell><div style={{ padding: "80px 0", textAlign: "center", color: "var(--text-muted)" }}>{COPY.nl.loading}</div></Shell>;
  if (error || !data) return (
    <Shell>
      <div style={{ padding: "80px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>{COPY.nl.unavailTitle}</div>
        <div style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 8 }}>{COPY.nl.unavailBody}</div>
      </div>
    </Shell>
  );

  const t = COPY[data.lang === "en" ? "en" : "nl"];
  const showCommerce = data.hasCommerce;
  const kpis: { label: string; value: string; sub?: string }[] = [
    { label: t.adSpend, value: money(win?.spend) },
    ...(showCommerce
      ? [{ label: t.revenue, value: money(win?.revenue), sub: t.viaAds }, { label: "ROAS", value: win?.roas != null ? `${win.roas.toFixed(2)}×` : "—", sub: t.roasSub }, { label: t.orders, value: num(win?.orders) }]
      : [{ label: t.conversions, value: num(win?.conversions) }, { label: "ROAS", value: win?.roas != null ? `${win.roas.toFixed(2)}×` : "—", sub: t.roasSubConv }]),
    ...(showCommerce && win?.poas != null ? [{ label: "POAS", value: `${win.poas.toFixed(2)}×`, sub: t.poasSub }] : []),
  ];

  return (
    <Shell>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 22 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: "var(--accent)" }}>{t.eyebrow}</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.8px", margin: "6px 0 0", color: "var(--text)" }}>{data.account.client || data.account.name}</h1>
        </div>
        {/* Period filter */}
        <div style={{ display: "inline-flex", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 10, padding: 3 }}>
          {([7, 30, 90] as const).map(d => (
            <button key={d} onClick={() => setPeriod(d)}
              style={{ fontSize: 12.5, fontWeight: 600, padding: "6px 13px", borderRadius: 8, border: "none", cursor: "pointer", background: period === d ? "var(--surface)" : "transparent", color: period === d ? "var(--text)" : "var(--text-3)", boxShadow: period === d ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>
              {t.periods[d]}
            </button>
          ))}
        </div>
      </div>

      {/* KPI tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 20 }}>
        {kpis.map(k => (
          <div key={k.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "16px 18px" }}>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.4 }}>{k.label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.6px", color: "var(--text)", marginTop: 6, fontVariantNumeric: "tabular-nums" }}>{k.value}</div>
            {k.sub && <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* Trend */}
      {series.length > 1 && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "18px 20px", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{t.trend}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-muted)" }}><i style={{ width: 10, height: 10, borderRadius: 3, background: "var(--accent)" }} /> {t.cost}</span>
            {showCommerce && <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-muted)" }}><i style={{ width: 10, height: 10, borderRadius: 3, background: "var(--accent-2, #d98a00)" }} /> {t.revenueShort}</span>}
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 140 }}>
            {series.map((d) => {
              const rev = showCommerce ? d.revenue : d.conversionValue;
              return (
                <div key={d.date} title={`${d.date} · ${t.cost} ${money(d.spend)}${showCommerce ? ` · ${t.revenueShort} ${money(d.revenue)}` : ""}`} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 1, height: "100%" }}>
                  {showCommerce && <div style={{ height: `${(rev / maxVal) * 100}%`, background: "var(--accent-2, #d98a00)", opacity: 0.85, borderRadius: "2px 2px 0 0", minHeight: rev > 0 ? 2 : 0 }} />}
                  <div style={{ height: `${(d.spend / maxVal) * 100}%`, background: "var(--accent)", opacity: 0.85, borderRadius: showCommerce ? 0 : "2px 2px 0 0", minHeight: d.spend > 0 ? 2 : 0 }} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top products */}
      {data.products.length > 0 && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "15px 20px 4px", fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{t.topTitle} <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)" }}>· {t.last30}</span></div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 460 }}>
              <thead>
                <tr style={{ color: "var(--text-muted)", textAlign: "right" }}>
                  <th style={{ textAlign: "left", padding: "10px 20px", fontWeight: 600 }}>{t.product}</th>
                  <th style={{ padding: "10px 12px", fontWeight: 600 }}>{t.cost}</th>
                  <th style={{ padding: "10px 12px", fontWeight: 600 }}>{t.clicks}</th>
                  <th style={{ padding: "10px 12px", fontWeight: 600 }}>{t.conversions}</th>
                  <th style={{ padding: "10px 20px", fontWeight: 600 }}>ROAS</th>
                </tr>
              </thead>
              <tbody>
                {data.products.map((p, i) => (
                  <tr key={i} style={{ borderTop: "1px solid var(--border)", textAlign: "right", color: "var(--text-2)" }}>
                    <td style={{ textAlign: "left", padding: "10px 20px", fontWeight: 600, color: "var(--text)", maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</td>
                    <td style={{ padding: "10px 12px", fontVariantNumeric: "tabular-nums" }}>{money(p.spend)}</td>
                    <td style={{ padding: "10px 12px", fontVariantNumeric: "tabular-nums" }}>{num(p.clicks)}</td>
                    <td style={{ padding: "10px 12px", fontVariantNumeric: "tabular-nums" }}>{num(p.conversions)}</td>
                    <td style={{ padding: "10px 20px", fontVariantNumeric: "tabular-nums", fontWeight: 600, color: p.roas != null && p.roas >= 2 ? "var(--accent)" : "var(--text-2)" }}>{p.roas != null ? `${p.roas.toFixed(2)}×` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div style={{ marginTop: 24, textAlign: "center", fontSize: 12, color: "var(--text-muted)" }}>
        {t.updated} {new Date(data.generatedAt).toLocaleDateString(loc, { day: "numeric", month: "long", year: "numeric" })} · {t.managed}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div style={{ height: 56, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", padding: "0 24px", background: "var(--header-bg, var(--surface))" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 800, letterSpacing: "-0.4px", fontSize: 15, color: "var(--text)" }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: "linear-gradient(135deg, #33cc80, #1c8a52)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800 }}>E</div>
          Ecomtrada
        </div>
      </div>
      <main style={{ maxWidth: 940, margin: "0 auto", padding: "28px 24px 80px" }}>{children}</main>
    </div>
  );
}
