"use client";

/**
 * Public, read-only CLIENT performance page — opened via an unguessable share
 * link (/share/<token>). No login. Client-facing: bilingual (NL/EN, chosen at
 * link creation), a calm-but-lively performance overview with product photos,
 * period-over-period gamification, a playful revenue equivalent, and a
 * downloadable Instagram-story card. Deliberately NOT the internal diagnosis.
 */
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

interface Win { days: number; spend: number; conversions: number; roas: number | null; poas: number | null; orders: number | null; revenue: number | null; partial: boolean }
interface Delta { spend: number | null; revenue: number | null; conversions: number | null }
interface Day { date: string; spend: number; conversions: number; conversionValue: number; revenue: number }
interface Product { name: string; image: string | null; spend: number; clicks: number; conversions: number; roas: number | null }
interface Data { account: { name: string; client: string | null }; lang: "nl" | "en"; currency: string; hasCommerce: boolean; windows: Win[]; deltas: Record<number, Delta>; days: Day[]; products: Product[]; generatedAt: string }

// Playful "you could have bought…" items, cheapest → priciest. We pick the
// fanciest one the revenue affords a satisfying count of.
const ITEMS: { p: number; nl: string; en: string; e: string }[] = [
  { p: 3.5, nl: "cappuccino’s", en: "cappuccinos", e: "☕" },
  { p: 13, nl: "bioscooptickets", en: "cinema tickets", e: "🎬" },
  { p: 45, nl: "pizza-avonden", en: "pizza nights", e: "🍕" },
  { p: 120, nl: "paar sneakers", en: "pairs of sneakers", e: "👟" },
  { p: 260, nl: "festivaltickets", en: "festival tickets", e: "🎫" },
  { p: 900, nl: "vliegtickets naar Barcelona", en: "flights to Barcelona", e: "✈️" },
  { p: 3500, nl: "scooters", en: "scooters", e: "🛵" },
  { p: 14000, nl: "stadsauto’s", en: "city cars", e: "🚗" },
  { p: 55000, nl: "elektrische auto’s", en: "electric cars", e: "🔋" },
  { p: 250000, nl: "vakantiehuisjes", en: "holiday homes", e: "🏡" },
];
function equivalent(revenue: number, lang: "nl" | "en"): { text: string; emoji: string } | null {
  if (revenue < ITEMS[0].p) return null;
  let pick = ITEMS[0];
  for (const it of ITEMS) if (revenue / it.p >= 1.5) pick = it; // fanciest with a count ≥ ~1.5
  const count = Math.max(1, Math.floor(revenue / pick.p));
  return { text: `${count.toLocaleString(lang === "en" ? "en-GB" : "nl-NL")} ${lang === "en" ? pick.en : pick.nl}`, emoji: pick.e };
}

const COPY = {
  nl: {
    eyebrow: "Google Ads · Prestatieoverzicht", loading: "Laden…",
    unavailTitle: "Dit overzicht is niet beschikbaar", unavailBody: "De link klopt niet meer of is verlopen. Vraag je accountmanager om een nieuwe.",
    periods: { 7: "7 dagen", 30: "30 dagen", 90: "90 dagen" } as Record<number, string>,
    adSpend: "Advertentiekosten", revenue: "Omzet", viaAds: "via Google Ads", roasSub: "omzet ÷ kosten", orders: "Bestellingen",
    conversions: "Conversies", roasSubConv: "waarde ÷ kosten", poasSub: "winst na marge",
    trend: "Verloop", cost: "Kosten", revenueShort: "Omzet",
    topTitle: "Best presterende producten", last30: "laatste 30 dagen",
    product: "Product", clicks: "Klikken", updated: "Bijgewerkt", managed: "Beheerd door Ecomtrada", locale: "nl-NL",
    vsPrev: "t.o.v. vorige periode", couldBuy: "Met deze omzet had je kunnen kopen", story: "Deel als story", generating: "Bezig…",
    storyReturn: "voor elke € terug", storyHeadline: "in omzet uit Google Ads",
  },
  en: {
    eyebrow: "Google Ads · Performance overview", loading: "Loading…",
    unavailTitle: "This overview isn't available", unavailBody: "The link is no longer valid or has expired. Ask your account manager for a new one.",
    periods: { 7: "7 days", 30: "30 days", 90: "90 days" } as Record<number, string>,
    adSpend: "Ad spend", revenue: "Revenue", viaAds: "via Google Ads", roasSub: "revenue ÷ spend", orders: "Orders",
    conversions: "Conversions", roasSubConv: "value ÷ spend", poasSub: "profit after margin",
    trend: "Trend", cost: "Spend", revenueShort: "Revenue",
    topTitle: "Top performing products", last30: "last 30 days",
    product: "Product", clicks: "Clicks", updated: "Updated", managed: "Managed by Ecomtrada", locale: "en-GB",
    vsPrev: "vs. previous period", couldBuy: "With this revenue you could've bought", story: "Share as story", generating: "Working…",
    storyReturn: "back for every €", storyHeadline: "in revenue from Google Ads",
  },
} as const;

export default function ClientSharePage() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch(`/api/share/${token}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((d: Data) => setData(d))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [token]);

  const loc = data?.lang === "en" ? "en-GB" : "nl-NL";
  const cur = data?.currency ?? "€";
  const money = (n: number | null | undefined) => n == null ? "—" : `${cur}${Math.round(n).toLocaleString(loc)}`;
  const num = (n: number | null | undefined) => n == null ? "—" : Math.round(n).toLocaleString(loc);
  const win = data?.windows.find(w => w.days === period);
  const delta = data?.deltas?.[period];

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
  const equiv = showCommerce && win?.revenue ? equivalent(win.revenue, data.lang) : null;

  // Delta badge (green up / red down) — shown on the "good = up" metric.
  const Badge = ({ v }: { v: number | null | undefined }) => v == null ? null : (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 700, marginLeft: 8, padding: "1px 7px", borderRadius: 999, color: v >= 0 ? "var(--accent)" : "var(--danger, #dc2626)", background: v >= 0 ? "var(--accent-dim, rgba(51,204,128,0.12))" : "color-mix(in srgb, var(--danger, #dc2626) 12%, transparent)" }}>
      {v >= 0 ? "▲" : "▼"} {Math.abs(v)}%
    </span>
  );

  const kpis: { label: string; value: string; sub?: React.ReactNode; delta?: number | null }[] = [
    { label: t.adSpend, value: money(win?.spend) },
    ...(showCommerce
      ? [{ label: t.revenue, value: money(win?.revenue), sub: t.viaAds, delta: delta?.revenue }, { label: "ROAS", value: win?.roas != null ? `${win.roas.toFixed(2)}×` : "—", sub: t.roasSub }, { label: t.orders, value: num(win?.orders), delta: delta?.conversions }]
      : [{ label: t.conversions, value: num(win?.conversions), delta: delta?.conversions }, { label: "ROAS", value: win?.roas != null ? `${win.roas.toFixed(2)}×` : "—", sub: t.roasSubConv }]),
    ...(showCommerce && win?.poas != null ? [{ label: "POAS", value: `${win.poas.toFixed(2)}×`, sub: t.poasSub }] : []),
  ];

  async function downloadStory() {
    if (!data || !win) return;
    setBusy(true);
    try {
      const svg = buildStorySvg(data, win, equiv, t, cur, loc);
      const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          const c = document.createElement("canvas"); c.width = 1080; c.height = 1920;
          const cx = c.getContext("2d")!; cx.drawImage(img, 0, 0, 1080, 1920);
          c.toBlob((png) => {
            if (png) { const a = document.createElement("a"); a.href = URL.createObjectURL(png); a.download = "ecomtrada-story.png"; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }
            URL.revokeObjectURL(url); resolve();
          }, "image/png");
        };
        img.onerror = () => { URL.revokeObjectURL(url); resolve(); };
        img.src = url;
      });
    } finally { setBusy(false); }
  }

  return (
    <Shell>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 22 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: "var(--accent)" }}>{t.eyebrow}</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.8px", margin: "6px 0 0", color: "var(--text)" }}>{data.account.client || data.account.name}</h1>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "inline-flex", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 10, padding: 3 }}>
            {([7, 30, 90] as const).map(d => (
              <button key={d} onClick={() => setPeriod(d)}
                style={{ fontSize: 12.5, fontWeight: 600, padding: "6px 13px", borderRadius: 8, border: "none", cursor: "pointer", background: period === d ? "var(--surface)" : "transparent", color: period === d ? "var(--text)" : "var(--text-3)", boxShadow: period === d ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>
                {t.periods[d]}
              </button>
            ))}
          </div>
          <button onClick={downloadStory} disabled={busy}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "#fff", border: "none", cursor: busy ? "default" : "pointer", background: "linear-gradient(135deg, #33cc80, #1c8a52)", padding: "8px 14px", borderRadius: 10, boxShadow: "0 2px 10px rgba(51,204,128,0.35)" }}>
            {busy ? t.generating : `📲 ${t.story}`}
          </button>
        </div>
      </div>

      {/* KPI tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 14 }}>
        {kpis.map(k => (
          <div key={k.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "16px 18px" }}>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.4 }}>{k.label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.6px", color: "var(--text)", marginTop: 6, fontVariantNumeric: "tabular-nums", display: "flex", alignItems: "center", flexWrap: "wrap" }}>{k.value}<Badge v={k.delta} /></div>
            {k.sub ? <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>{k.sub}</div> : (k.delta != null && <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{t.vsPrev}</div>)}
          </div>
        ))}
      </div>

      {/* Playful revenue equivalent */}
      {equiv && (
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: "linear-gradient(120deg, var(--accent-dim, rgba(51,204,128,0.12)), transparent)", border: "1px solid color-mix(in srgb, var(--accent) 30%, var(--border))", borderRadius: 14, padding: "14px 18px", marginBottom: 20 }}>
          <span style={{ fontSize: 30, lineHeight: 1 }}>{equiv.emoji}</span>
          <span style={{ fontSize: 14.5, color: "var(--text-2)" }}>{t.couldBuy}: <strong style={{ color: "var(--text)" }}>{equiv.text}</strong> 😄</span>
        </div>
      )}

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

      {/* Top products with thumbnails */}
      {data.products.length > 0 && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "16px 18px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>{t.topTitle} <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)" }}>· {t.last30}</span></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.products.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 4px", borderTop: i ? "1px solid var(--border)" : "none" }}>
                <Thumb name={p.name} image={p.image} rank={i + 1} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1 }}>{money(p.spend)} · {num(p.clicks)} {t.clicks.toLowerCase()} · {num(p.conversions)} {t.conversions.toLowerCase()}</div>
                </div>
                {p.roas != null && (
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: p.roas >= 2 ? "var(--accent)" : "var(--text-2)", fontVariantNumeric: "tabular-nums" }}>{p.roas.toFixed(2)}×</div>
                    <div style={{ fontSize: 10.5, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.4 }}>ROAS</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 24, textAlign: "center", fontSize: 12, color: "var(--text-muted)" }}>
        {t.updated} {new Date(data.generatedAt).toLocaleDateString(loc, { day: "numeric", month: "long", year: "numeric" })} · {t.managed}
      </div>
    </Shell>
  );
}

/** Product thumbnail: the Shopify image, else a coloured tile with the initial. */
function Thumb({ name, image, rank }: { name: string; image: string | null; rank: number }) {
  const [ok, setOk] = useState(true);
  const hues = [150, 32, 210, 340, 270, 12, 190, 90];
  const hue = hues[rank % hues.length];
  if (image && ok) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt="" onError={() => setOk(false)} style={{ width: 46, height: 46, borderRadius: 10, objectFit: "cover", flexShrink: 0, background: "var(--surface-2)" }} />;
  }
  return (
    <div style={{ width: 46, height: 46, borderRadius: 10, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 18, background: `linear-gradient(135deg, hsl(${hue} 65% 52%), hsl(${hue} 60% 38%))` }}>
      {(name.trim()[0] || "•").toUpperCase()}
    </div>
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

// ── Instagram-story card (1080×1920), pure SVG so it exports to PNG cleanly ──
function esc(s: string): string { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function buildStorySvg(data: Data, win: Win, equiv: { text: string; emoji: string } | null, t: typeof COPY[keyof typeof COPY], cur: string, loc: string): string {
  const m = (n: number | null | undefined) => n == null ? "—" : `${cur}${Math.round(n).toLocaleString(loc)}`;
  const client = esc(data.account.client || data.account.name);
  const roas = win.roas != null ? `${win.roas.toFixed(2)}×` : "—";
  const revenue = win.revenue != null ? m(win.revenue) : m(win.spend);
  const headline = data.hasCommerce ? t.storyHeadline : (data.lang === "en" ? "in conversion value from Google Ads" : "aan conversiewaarde uit Google Ads");
  const period = esc(t.periods[win.days]);
  const equivLine = equiv ? esc(`${equiv.emoji}  ${equiv.text}`) : "";
  const F = "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920" font-family="${F}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0d1512"/><stop offset="1" stop-color="#0a0f0d"/>
    </linearGradient>
    <linearGradient id="acc" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#33cc80"/><stop offset="1" stop-color="#1c8a52"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1920" fill="url(#bg)"/>
  <circle cx="900" cy="220" r="380" fill="#33cc80" opacity="0.08"/>
  <circle cx="150" cy="1600" r="320" fill="#33cc80" opacity="0.06"/>
  <!-- brand -->
  <g transform="translate(90,150)">
    <rect width="64" height="64" rx="18" fill="url(#acc)"/>
    <text x="32" y="46" font-size="38" font-weight="800" fill="#fff" text-anchor="middle">E</text>
    <text x="86" y="44" font-size="34" font-weight="800" fill="#fff">Ecomtrada</text>
  </g>
  <text x="90" y="330" font-size="30" font-weight="700" letter-spacing="2" fill="#33cc80">GOOGLE ADS · ${period.toUpperCase()}</text>
  <text x="90" y="410" font-size="70" font-weight="800" fill="#ffffff">${client}</text>
  <!-- ROAS hero -->
  <text x="86" y="700" font-size="250" font-weight="800" fill="url(#acc)">${esc(roas)}</text>
  <text x="90" y="790" font-size="40" font-weight="600" fill="#c9d4cf">${esc(data.lang === "en" ? "ROAS · " + t.storyReturn : "ROAS · " + t.storyReturn)}</text>
  <!-- revenue -->
  <g transform="translate(90,980)">
    <rect width="900" height="200" rx="28" fill="#121b17" stroke="#1f2c26"/>
    <text x="48" y="86" font-size="34" font-weight="600" fill="#8fa39a">${esc(data.hasCommerce ? t.revenue : t.conversions)}</text>
    <text x="48" y="160" font-size="86" font-weight="800" fill="#ffffff">${esc(revenue)}</text>
    <text x="852" y="130" font-size="30" fill="#8fa39a" text-anchor="end">${esc(headline)}</text>
  </g>
  ${equiv ? `<g transform="translate(90,1240)">
    <rect width="900" height="150" rx="28" fill="#0f1a14" stroke="#1c3a2a"/>
    <text x="48" y="66" font-size="30" font-weight="600" fill="#8fa39a">${esc(t.couldBuy)}</text>
    <text x="48" y="118" font-size="44" font-weight="800" fill="#33cc80">${equivLine}</text>
  </g>` : ""}
  <!-- spend + orders footnote (two lines to stay within the frame) -->
  <text x="90" y="1500" font-size="38" font-weight="700" fill="#c9d4cf">${esc(t.adSpend)}: ${esc(m(win.spend))}</text>
  ${win.orders != null ? `<text x="90" y="1560" font-size="38" font-weight="700" fill="#c9d4cf">${esc(t.orders)}: ${esc(win.orders.toLocaleString(loc))}</text>` : ""}
  <text x="90" y="1840" font-size="30" fill="#6b7a72">${esc(t.managed)}</text>
</svg>`;
}
