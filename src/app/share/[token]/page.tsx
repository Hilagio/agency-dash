"use client";

/**
 * Public, read-only CLIENT performance page (/share/<token>) — no login,
 * bilingual (NL/EN chosen at link creation). Modeled on a friendly client
 * dashboard: revenue-led hero ("€X omzet uit €Y advertenties — Z× terug"),
 * plain-language KPI tiles, a top-5 bestsellers list (by generated revenue,
 * with product photos), a trend, a playful revenue equivalent, and a
 * downloadable Instagram-story card. Deliberately NOT the internal diagnosis.
 *
 * Styling is a fixed light palette (independent of the app theme): this page is
 * a client deliverable and should always look the same.
 */
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

interface Win { days: number; spend: number; conversions: number; adRevenue: number; roas: number | null; poas: number | null; orders: number | null; revenue: number | null; partial: boolean }
interface Delta { spend: number | null; revenue: number | null; adRevenue: number | null; conversions: number | null }
interface Day { date: string; spend: number; conversions: number; conversionValue: number; revenue: number }
interface Product { name: string; image: string | null; value: number; spend: number; clicks: number; conversions: number; roas: number | null }
interface Data { account: { name: string; client: string | null }; lang: "nl" | "en"; currency: string; hasCommerce: boolean; mode?: "ecom" | "leadgen"; windows: Win[]; deltas: Record<number, Delta>; days: Day[]; products: Product[]; bestsellerSource?: "ads" | "store"; generatedAt: string }

// Playful "you could have bought…" items, cheapest → priciest: [singular, plural].
const ITEMS: { p: number; nl: [string, string]; en: [string, string]; e: string }[] = [
  { p: 3.5, nl: ["cappuccino", "cappuccino’s"], en: ["cappuccino", "cappuccinos"], e: "☕" },
  { p: 13, nl: ["bioscoopticket", "bioscooptickets"], en: ["cinema ticket", "cinema tickets"], e: "🎬" },
  { p: 45, nl: ["pizza-avond", "pizza-avonden"], en: ["pizza night", "pizza nights"], e: "🍕" },
  { p: 120, nl: ["paar sneakers", "paar sneakers"], en: ["pair of sneakers", "pairs of sneakers"], e: "👟" },
  { p: 260, nl: ["festivalticket", "festivaltickets"], en: ["festival ticket", "festival tickets"], e: "🎫" },
  { p: 900, nl: ["vliegticket naar Barcelona", "vliegtickets naar Barcelona"], en: ["flight to Barcelona", "flights to Barcelona"], e: "✈️" },
  { p: 3500, nl: ["scooter", "scooters"], en: ["scooter", "scooters"], e: "🛵" },
  { p: 14000, nl: ["stadsauto", "stadsauto’s"], en: ["city car", "city cars"], e: "🚗" },
  { p: 55000, nl: ["elektrische auto", "elektrische auto’s"], en: ["electric car", "electric cars"], e: "🚙" },
  { p: 250000, nl: ["vakantiehuisje", "vakantiehuisjes"], en: ["holiday home", "holiday homes"], e: "🏡" },
];
function equivalent(revenue: number, lang: "nl" | "en"): { text: string; emoji: string; count: number } | null {
  if (revenue < ITEMS[0].p) return null;
  let pick = ITEMS[0];
  for (const it of ITEMS) if (revenue / it.p >= 1.5) pick = it;
  const count = Math.max(1, Math.floor(revenue / pick.p));
  const forms = lang === "en" ? pick.en : pick.nl;
  return { text: `${count.toLocaleString(lang === "en" ? "en-GB" : "nl-NL")} ${count === 1 ? forms[0] : forms[1]}`, emoji: pick.e, count };
}

const COPY = {
  nl: {
    loading: "Laden…", unavailTitle: "Dit overzicht is niet beschikbaar",
    unavailBody: "De link klopt niet meer of is verlopen. Vraag je accountmanager om een nieuwe.",
    greetM: "Goedemorgen", greetA: "Goedemiddag", greetE: "Goedenavond",
    sub: "Zo presteren je Google Ads",
    periods: { 7: "7 dagen", 30: "30 dagen", 90: "90 dagen" } as Record<number, string>,
    heroGreat: "Je advertenties verdienen uitstekend! 🚀", heroGood: "Je advertenties presteren goed 👍", heroOk: "Je advertenties draaien — hier is het overzicht",
    heroLine: (rev: string, spend: string) => `${rev} omzet uit ${spend} aan advertenties`,
    heroReturn: (r: string) => `Dat is ${r} van je investering terug`,
    made: "Verdiend", madeSub: "omzet via Google Ads", ret: "Rendement", retSub: "voor elke €1 aan advertenties", invested: "Geïnvesteerd", investedSub: "totale advertentiekosten",
    orders: "Bestellingen", poasSub: "winst na marge",
    summary: (one: string, rev: string) => `Voor elke €1 aan advertenties kwam er ${one} aan omzet terug. In totaal ${rev} omzet via Google Ads.`,
    vsPrev: "t.o.v. vorige periode", couldBuy: "Met deze omzet had je kunnen kopen",
    trend: "Verloop", cost: "Kosten", revenueShort: "Omzet",
    topTitle: "Jouw bestsellers", topSub: "top 5 op gegenereerde omzet · laatste 30 dagen",
    generated: "omzet", convs: "conversies", clicks: "klikken", sold: "verkocht", ordersAds: "gemeten via Google Ads",
    story: "Deel als story", generating: "Bezig…", storyRevLabel: "Omzet via Google Ads", storyReturn: (r: string) => `${r} van je investering terug`,
    bestseller: "Bestseller", adSpend: "Advertentiekosten",
    updated: "Bijgewerkt", managed: "Beheerd door Ecomtrada", locale: "nl-NL",
    // Lead-gen variant
    lgHeroGreat: "Je advertenties leveren volop aanvragen op! 🚀", lgHeroGood: "Je advertenties leveren mooi aanvragen op 👍",
    lgHeroLine: (n: string, spend: string) => `${n} aanvragen uit ${spend} aan advertenties`,
    lgHeroSub: (cpl: string) => `Dat is gemiddeld ${cpl} per aanvraag`,
    leads: "Aanvragen", leadsSub: "via Google Ads", cpl: "Kosten per aanvraag", cplSub: "gemiddeld deze periode",
    lgSummary: (n: string, cpl: string) => `Je advertenties leverden ${n} aanvragen op, voor gemiddeld ${cpl} per aanvraag.`,
    lgPerDay: (n: string) => `Dat zijn er gemiddeld ${n} per werkdag`,
    storyLeadsLabel: "Aanvragen via Google Ads", storyCpl: (c: string) => `${c} per aanvraag`,
  },
  en: {
    loading: "Loading…", unavailTitle: "This overview isn't available",
    unavailBody: "The link is no longer valid or has expired. Ask your account manager for a new one.",
    greetM: "Good morning", greetA: "Good afternoon", greetE: "Good evening",
    sub: "Here's how your Google Ads are performing",
    periods: { 7: "7 days", 30: "30 days", 90: "90 days" } as Record<number, string>,
    heroGreat: "Your ads are making excellent money! 🚀", heroGood: "Your ads are performing well 👍", heroOk: "Your ads at a glance",
    heroLine: (rev: string, spend: string) => `${rev} revenue from ${spend} spent`,
    heroReturn: (r: string) => `That's a ${r} return on your investment`,
    made: "Money made", madeSub: "revenue via Google Ads", ret: "Return", retSub: "for every €1 on ads", invested: "Invested", investedSub: "total ad spend",
    orders: "Orders", poasSub: "profit after margin",
    summary: (one: string, rev: string) => `For every €1 you spent on ads, ${one} came back in revenue. That's ${rev} total revenue via Google Ads.`,
    vsPrev: "vs. previous period", couldBuy: "With this revenue you could've bought",
    trend: "Trend", cost: "Spend", revenueShort: "Revenue",
    topTitle: "Your bestsellers", topSub: "top 5 by revenue generated · last 30 days",
    generated: "revenue", convs: "conversions", clicks: "clicks", sold: "sold", ordersAds: "measured via Google Ads",
    story: "Share as story", generating: "Working…", storyRevLabel: "Revenue via Google Ads", storyReturn: (r: string) => `${r} return on your investment`,
    bestseller: "Bestseller", adSpend: "Ad spend",
    updated: "Updated", managed: "Managed by Ecomtrada", locale: "en-GB",
    // Lead-gen variant
    lgHeroGreat: "Your ads are bringing in plenty of leads! 🚀", lgHeroGood: "Your ads are bringing in solid leads 👍",
    lgHeroLine: (n: string, spend: string) => `${n} leads from ${spend} spent`,
    lgHeroSub: (cpl: string) => `That's an average of ${cpl} per lead`,
    leads: "Leads", leadsSub: "via Google Ads", cpl: "Cost per lead", cplSub: "average this period",
    lgSummary: (n: string, cpl: string) => `Your ads brought in ${n} leads, at an average of ${cpl} per lead.`,
    lgPerDay: (n: string) => `That's an average of ${n} per working day`,
    storyLeadsLabel: "Leads via Google Ads", storyCpl: (c: string) => `${c} per lead`,
  },
} as const;

// Fixed light palette — the page is a client deliverable, always the same look.
const C = {
  bg: "#f5f7f9", card: "#ffffff", border: "#e6eaef", text: "#101828", muted: "#667085", faint: "#98a2b3",
  green: "#12b76a", greenDark: "#027a48", greenBg: "#ecfdf3",
  blueBg: "#eff4ff", blueDark: "#1d4ed8", purpleBg: "#f5f0ff", purpleDark: "#6d28d9",
  red: "#d92d20", redBg: "#fef3f2", amber: "#d97706",
};

export default function ClientSharePage() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);
  const [busy, setBusy] = useState(false);
  const [hour, setHour] = useState(12);

  useEffect(() => {
    setHour(new Date().getHours());
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
  const maxVal = Math.max(1, ...series.map(d => Math.max(d.spend, d.conversionValue)));

  if (loading) return <Shell><div style={{ padding: "80px 0", textAlign: "center", color: C.muted }}>{COPY.nl.loading}</div></Shell>;
  if (error || !data) return (
    <Shell>
      <div style={{ padding: "80px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{COPY.nl.unavailTitle}</div>
        <div style={{ fontSize: 14, color: C.muted, marginTop: 8 }}>{COPY.nl.unavailBody}</div>
      </div>
    </Shell>
  );

  const t = COPY[data.lang === "en" ? "en" : "nl"];
  const greet = hour < 12 ? t.greetM : hour < 18 ? t.greetA : t.greetE;
  const isLead = data.mode === "leadgen";
  const revenue = win?.adRevenue ?? 0;             // ad-attributed revenue — every account has this
  const roas = win?.roas ?? null;
  const roasStr = roas != null ? `${roas.toFixed(1).replace(".", data.lang === "en" ? "." : ",")}×` : "—";
  // Lead-gen: leads + cost per lead take the place of revenue + ROAS.
  const leads = Math.round(win?.conversions ?? 0);
  const cplV = win && leads > 0 ? win.spend / leads : null;
  const cplStr = cplV != null ? `${cur}${cplV.toFixed(2).replace(".", data.lang === "en" ? "." : ",")}` : "—";
  const heroTitle = isLead
    ? (leads > 0 && (delta?.conversions ?? 0) >= 15 ? t.lgHeroGreat : leads > 0 ? t.lgHeroGood : t.heroOk)
    : (roas == null ? t.heroOk : roas >= 3 ? t.heroGreat : roas >= 1.5 ? t.heroGood : t.heroOk);
  const equiv = !isLead && revenue > 0 ? equivalent(revenue, data.lang) : null;
  const revDelta = data.hasCommerce ? (delta?.revenue ?? delta?.adRevenue) : delta?.adRevenue;
  const perWorkday = leads >= 5 ? leads / (period * (5 / 7)) : null;

  const Badge = ({ v }: { v: number | null | undefined }) => v == null ? null : (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 700, marginLeft: 8, padding: "2px 8px", borderRadius: 999, color: v >= 0 ? C.greenDark : C.red, background: v >= 0 ? C.greenBg : C.redBg }}>
      {v >= 0 ? "▲" : "▼"} {Math.abs(v)}%
    </span>
  );

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
      {/* Greeting + controls */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 26 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.6px", margin: 0, color: C.text }}>{greet}, {data.account.client || data.account.name}! ✨</h1>
          <div style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>{t.sub}</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "inline-flex", background: "#eef1f4", border: `1px solid ${C.border}`, borderRadius: 10, padding: 3 }}>
            {([7, 30, 90] as const).map(d => (
              <button key={d} onClick={() => setPeriod(d)}
                style={{ fontSize: 12.5, fontWeight: 600, padding: "6px 13px", borderRadius: 8, border: "none", cursor: "pointer", background: period === d ? "#fff" : "transparent", color: period === d ? C.text : C.muted, boxShadow: period === d ? "0 1px 3px rgba(16,24,40,0.1)" : "none" }}>
                {t.periods[d]}
              </button>
            ))}
          </div>
          <button onClick={downloadStory} disabled={busy}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "#fff", border: "none", cursor: busy ? "default" : "pointer", background: "linear-gradient(135deg, #12b76a, #027a48)", padding: "8px 14px", borderRadius: 10, boxShadow: "0 2px 8px rgba(18,183,106,0.35)" }}>
            {busy ? t.generating : `📲 ${t.story}`}
          </button>
        </div>
      </div>

      {/* Hero banner — revenue-led (ecom) or leads-led (lead-gen) */}
      <div style={{ background: "linear-gradient(135deg, #12b76a, #059669)", borderRadius: 20, padding: "38px 28px", textAlign: "center", color: "#fff", marginBottom: 20, boxShadow: "0 8px 24px rgba(18,183,106,0.25)" }}>
        <div style={{ fontSize: 15, fontWeight: 700, opacity: 0.95 }}>{heroTitle}</div>
        <div style={{ fontSize: "clamp(24px, 4.5vw, 40px)", fontWeight: 800, letterSpacing: "-1px", margin: "10px 0 6px" }}>
          {isLead ? t.lgHeroLine(num(leads), money(win?.spend)) : t.heroLine(money(revenue), money(win?.spend))}
        </div>
        {isLead
          ? (cplV != null && <div style={{ fontSize: 15, opacity: 0.95 }}>{t.lgHeroSub(cplStr)}</div>)
          : (roas != null && <div style={{ fontSize: 15, opacity: 0.95 }}>{t.heroReturn(roasStr)}</div>)}
      </div>

      {/* KPI tiles. Orders: real store orders when Shopify has CURRENT data,
          else the conversions Google Ads measured — never a bare 0 next to a
          five-figure revenue number. */}
      {isLead ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 20 }}>
          <Tile bg={C.greenBg} iconBg={C.green} icon="📥" label={t.leads} value={num(leads)} sub={t.leadsSub} badge={<Badge v={delta?.conversions} />} />
          <Tile bg={C.blueBg} iconBg={C.blueDark} icon="🎯" label={t.cpl} value={cplStr} sub={t.cplSub} />
          <Tile bg={C.purpleBg} iconBg={C.purpleDark} icon="💳" label={t.invested} value={money(win?.spend)} sub={t.investedSub} badge={<Badge v={delta?.spend} />} />
        </div>
      ) : (() => {
        const realOrders = data.hasCommerce && win?.orders != null && win.orders > 0 ? win.orders : null;
        const shownOrders = realOrders ?? (win && win.conversions >= 1 ? Math.round(win.conversions) : null);
        return (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 20 }}>
            <Tile bg={C.greenBg} iconBg={C.green} icon="€" label={t.made} value={money(revenue)} sub={t.madeSub} badge={<Badge v={revDelta} />} />
            <Tile bg={C.blueBg} iconBg={C.blueDark} icon="🏆" label={t.ret} value={roasStr} sub={t.retSub} />
            <Tile bg={C.purpleBg} iconBg={C.purpleDark} icon="💳" label={t.invested} value={money(win?.spend)} sub={t.investedSub} />
            {shownOrders != null && <Tile bg="#fff7ed" iconBg={C.amber} icon="📦" label={t.orders} value={num(shownOrders)} sub={realOrders != null ? t.vsPrev : t.ordersAds} badge={<Badge v={delta?.conversions} />} />}
          </div>
        );
      })()}

      {/* Quick summary sentence */}
      {isLead ? (leads > 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 20px", textAlign: "center", fontSize: 14.5, color: C.text, marginBottom: 20 }}>
          {t.lgSummary(num(leads), cplStr)}
        </div>
      )) : (roas != null && roas > 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 20px", textAlign: "center", fontSize: 14.5, color: C.text, marginBottom: 20 }}>
          {t.summary(`${cur}${roas.toFixed(2).replace(".", data.lang === "en" ? "." : ",")}`, money(revenue))}
        </div>
      ))}

      {/* Lead-gen: the playful per-workday visual */}
      {isLead && perWorkday != null && (
        <div style={{ background: C.greenBg, border: `1px solid #c7ecd9`, borderRadius: 16, padding: "20px 22px", marginBottom: 20, textAlign: "center" }}>
          <div style={{ fontSize: 42, lineHeight: 1.1, letterSpacing: 4 }}>{"📅"}</div>
          <div style={{ fontSize: 14.5, color: C.text, marginTop: 10 }}><strong>{t.lgPerDay(perWorkday >= 10 ? String(Math.round(perWorkday)) : perWorkday.toFixed(1).replace(".", data.lang === "en" ? "." : ","))}</strong> 😄</div>
        </div>
      )}

      {/* Playful revenue equivalent — with the visual to match */}
      {equiv && (
        <div style={{ background: C.greenBg, border: `1px solid #c7ecd9`, borderRadius: 16, padding: "20px 22px", marginBottom: 20, textAlign: "center" }}>
          <div style={{ fontSize: 42, lineHeight: 1.1, letterSpacing: 4 }}>
            {equiv.emoji.repeat(Math.min(equiv.count, 5))}
          </div>
          <div style={{ fontSize: 14.5, color: C.text, marginTop: 10 }}>{t.couldBuy}: <strong>{equiv.text}</strong> 😄</div>
        </div>
      )}

      {/* Bestsellers — top 5 by generated revenue, with photos (ecom only) */}
      {!isLead && data.products.length > 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "22px 24px", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: C.text }}>🔥 {t.topTitle}</span>
            <span style={{ fontSize: 12, color: C.muted }}>{t.topSub}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {data.products.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderTop: i ? `1px solid ${C.border}` : "none" }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: i === 0 ? C.amber : C.faint, width: 18, textAlign: "center" }}>{i + 1}</span>
                <Thumb name={p.name} image={p.image} rank={i} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                    {data.bestsellerSource === "store"
                      ? `${num(p.conversions)} ${t.sold}`
                      : `${num(p.conversions)} ${t.convs} · ${num(p.clicks)} ${t.clicks}${p.roas != null ? ` · ROAS ${p.roas.toFixed(1)}×` : ""}`}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 17, fontWeight: 800, color: C.greenDark, fontVariantNumeric: "tabular-nums" }}>{money(p.value)}</div>
                  <div style={{ fontSize: 10.5, color: C.faint, textTransform: "uppercase", letterSpacing: 0.4 }}>{t.generated}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trend */}
      {series.length > 1 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "22px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{t.trend}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: C.muted }}><i style={{ width: 10, height: 10, borderRadius: 3, background: C.green }} /> {isLead ? t.leads : t.revenueShort}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: C.muted }}><i style={{ width: 10, height: 10, borderRadius: 3, background: "#cbd5e1" }} /> {t.cost}</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 180 }}>
            {(() => {
              // Lead-gen plots leads vs cost — different units, so each series
              // gets its own scale; ecom keeps the shared money scale.
              const maxLeads = Math.max(1, ...series.map(d => d.conversions));
              const maxSpend = Math.max(1, ...series.map(d => d.spend));
              return series.map((d) => (
                <div key={d.date} title={isLead ? `${d.date} · ${t.leads} ${num(d.conversions)} · ${t.cost} ${money(d.spend)}` : `${d.date} · ${t.revenueShort} ${money(d.conversionValue)} · ${t.cost} ${money(d.spend)}`} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 1, height: "100%" }}>
                  <div style={{ height: `${((isLead ? d.conversions / maxLeads : d.conversionValue / maxVal)) * 100}%`, background: C.green, borderRadius: "2px 2px 0 0", minHeight: (isLead ? d.conversions : d.conversionValue) > 0 ? 2 : 0 }} />
                  <div style={{ height: `${((isLead ? (d.spend / maxSpend) * 0.35 : d.spend / maxVal)) * 100}%`, background: "#cbd5e1", minHeight: d.spend > 0 ? 2 : 0 }} />
                </div>
              ));
            })()}
          </div>
        </div>
      )}

      <div style={{ marginTop: 22, textAlign: "center", fontSize: 12, color: C.faint }}>
        {t.updated} {new Date(data.generatedAt).toLocaleDateString(loc, { day: "numeric", month: "long", year: "numeric" })} · {t.managed}
      </div>
    </Shell>
  );
}

function Tile({ bg, iconBg, icon, label, value, sub, badge }: { bg: string; iconBg: string; icon: string; label: string; value: string; sub: string; badge?: React.ReactNode }) {
  return (
    <div style={{ background: bg, borderRadius: 16, padding: "20px 20px", display: "flex", gap: 14, alignItems: "center" }}>
      <div style={{ width: 42, height: 42, borderRadius: 12, background: iconBg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, flexShrink: 0 }}>{icon}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: C.muted }}>{label}</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: "-0.5px", fontVariantNumeric: "tabular-nums", display: "flex", alignItems: "center", flexWrap: "wrap" }}>{value}{badge}</div>
        <div style={{ fontSize: 11.5, color: C.faint }}>{sub}</div>
      </div>
    </div>
  );
}

/** Product thumbnail: catalog/page photo, else a coloured tile with the initial. */
function Thumb({ name, image, rank }: { name: string; image: string | null; rank: number }) {
  const [ok, setOk] = useState(true);
  const hues = [150, 32, 210, 340, 270];
  const hue = hues[rank % hues.length];
  if (image && ok) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt="" onError={() => setOk(false)} style={{ width: 52, height: 52, borderRadius: 12, objectFit: "cover", flexShrink: 0, background: "#eef1f4", border: `1px solid ${C.border}` }} />;
  }
  return (
    <div style={{ width: 52, height: 52, borderRadius: 12, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 20, background: `linear-gradient(135deg, hsl(${hue} 65% 52%), hsl(${hue} 60% 38%))` }}>
      {(name.trim()[0] || "•").toUpperCase()}
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <div style={{ height: 56, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", padding: "0 24px", background: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 800, letterSpacing: "-0.4px", fontSize: 15, color: C.text }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: "linear-gradient(135deg, #12b76a, #027a48)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800 }}>E</div>
          Ecomtrada
        </div>
      </div>
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "38px 26px 80px", fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" }}>{children}</main>
    </div>
  );
}

// ── Instagram-story card (1080×1920) — revenue-led, exports to PNG ───────────
function esc(s: string): string { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function fitText(s: string, max: number): string { return s.length > max ? s.slice(0, max - 1) + "…" : s; }
function buildStorySvg(data: Data, win: Win, equiv: { text: string; emoji: string } | null, t: typeof COPY[keyof typeof COPY], cur: string, loc: string): string {
  const m = (n: number | null | undefined) => n == null ? "—" : `${cur}${Math.round(n).toLocaleString(loc)}`;
  const client = esc(fitText(data.account.client || data.account.name, 20));
  // Lead-gen story leads with the lead count; ecom with revenue.
  const isLead = data.mode === "leadgen";
  const leadCount = Math.round(win.conversions);
  const cpl = leadCount > 0 ? `${cur}${(win.spend / leadCount).toFixed(2)}` : null;
  const heroValue = isLead ? leadCount.toLocaleString(loc) : m(win.adRevenue);
  const heroLabel = isLead ? t.storyLeadsLabel : t.storyRevLabel;
  const heroSub = isLead ? (cpl ? t.storyCpl(cpl) : null) : (win.roas != null ? t.storyReturn(`${win.roas.toFixed(1)}×`) : null);
  // Scale the hero so long amounts still fit the 900px text area.
  const heroSize = heroValue.length <= 8 ? 210 : heroValue.length <= 11 ? 165 : 130;
  const period = esc(t.periods[win.days]);
  const top = isLead ? undefined : data.products[0];
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
  <circle cx="150" cy="1650" r="320" fill="#33cc80" opacity="0.06"/>
  <g transform="translate(90,140)">
    <rect width="64" height="64" rx="18" fill="url(#acc)"/>
    <text x="32" y="46" font-size="38" font-weight="800" fill="#fff" text-anchor="middle">E</text>
    <text x="86" y="44" font-size="34" font-weight="800" fill="#fff">Ecomtrada</text>
  </g>
  <text x="90" y="320" font-size="30" font-weight="700" letter-spacing="2" fill="#33cc80">GOOGLE ADS · ${period.toUpperCase()}</text>
  <text x="90" y="400" font-size="66" font-weight="800" fill="#ffffff">${client}</text>
  <!-- Hero: revenue (ecom) or lead count (lead-gen) -->
  <text x="90" y="600" font-size="34" font-weight="600" fill="#8fa39a">${esc(heroLabel)}</text>
  <text x="84" y="${600 + heroSize + 30}" font-size="${heroSize}" font-weight="800" fill="url(#acc)">${esc(heroValue)}</text>
  ${heroSub ? `<text x="90" y="${600 + heroSize + 110}" font-size="42" font-weight="700" fill="#ffffff">${esc(heroSub)}</text>` : ""}
  <!-- Spend card -->
  <g transform="translate(90,1080)">
    <rect width="900" height="150" rx="28" fill="#121b17" stroke="#1f2c26"/>
    <text x="48" y="64" font-size="30" font-weight="600" fill="#8fa39a">${esc(t.adSpend)}</text>
    <text x="48" y="122" font-size="60" font-weight="800" fill="#ffffff">${esc(m(win.spend))}</text>
  </g>
  ${top ? `<g transform="translate(90,1270)">
    <rect width="900" height="170" rx="28" fill="#0f1a14" stroke="#1c3a2a"/>
    <text x="48" y="64" font-size="30" font-weight="600" fill="#8fa39a">🔥 ${esc(t.bestseller)}</text>
    <text x="48" y="118" font-size="40" font-weight="800" fill="#ffffff">${esc(fitText(top.name, 34))}</text>
    <text x="852" y="118" font-size="40" font-weight="800" fill="#33cc80" text-anchor="end">${esc(m(top.value))}</text>
  </g>` : ""}
  ${equiv ? `<g transform="translate(90,1480)">
    <rect width="900" height="150" rx="28" fill="#0f1a14" stroke="#1c3a2a"/>
    <text x="48" y="64" font-size="30" font-weight="600" fill="#8fa39a">${esc(t.couldBuy)}</text>
    <text x="48" y="118" font-size="42" font-weight="800" fill="#33cc80">${esc(`${equiv.emoji}  ${equiv.text}`)}</text>
  </g>` : ""}
  <text x="90" y="1830" font-size="30" fill="#6b7a72">${esc(t.managed)}</text>
</svg>`;
}
