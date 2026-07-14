"use client";

/**
 * Diagnostic workspace (BUILD-SPEC §9) — the landing page for a flagged account.
 *
 * Value-first, never a chore (§5): it leads with one honest headline, shows the
 * numbers, shows *what it already checked*, and hands the specialist the
 * questions to ask. It never names a cause (§9) — that boundary is printed on
 * the page. From here you can jump to the full analysis if you want to dig.
 */
import { useEffect, useState, Fragment } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ArrowUpRight, Loader2, CheckCircle2, AlertTriangle, HelpCircle,
  ShieldCheck, Sprout, XCircle, MinusCircle, TrendingUp, ShoppingBag, RefreshCw, ChevronRight, Sparkles,
} from "lucide-react";

/** Minimal inline markdown: render **bold** segments safely as React nodes. */
function renderInline(text: string): React.ReactNode {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i} style={{ color: "var(--text)" }}>{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>);
}

/**
 * Block-level markdown for the Expert read. Handles the shapes the model
 * actually emits — `**The read**` / `**1. Likely why**` section headers, `---`
 * rules, `#` headings, `-`/`*`/`1.` bullets — instead of dumping raw asterisks.
 */
function renderMarkdown(md: string): React.ReactNode {
  const blocks: React.ReactNode[] = [];
  let k = 0;
  for (const raw of md.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    // Horizontal rule (---, ***, ___, or a stray --).
    if (/^([-*_])\1+$/.test(line) || line === "--") {
      blocks.push(<hr key={k++} style={{ border: "none", borderTop: "1px solid var(--border-2)", margin: "13px 0" }} />);
      continue;
    }
    // Markdown heading (# … ######).
    let m = line.match(/^#{1,6}\s+(.*)$/);
    if (m) {
      blocks.push(<div key={k++} style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.3, color: "var(--accent)", margin: "16px 0 6px" }}>{renderInline(m[1])}</div>);
      continue;
    }
    // A line that is entirely bold → treat as a section header, dropping any
    // leading ordinal ("**1. The read**" → "THE READ").
    m = line.match(/^\*\*(.+?)\*\*[:.]?$/);
    if (m) {
      const label = m[1].replace(/^\d+[.)]\s*/, "");
      blocks.push(<div key={k++} style={{ fontSize: 12.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4, color: "var(--accent)", margin: "16px 0 7px" }}>{renderInline(label)}</div>);
      continue;
    }
    // List item (-, *, or 1.).
    m = line.match(/^(?:[-*•]|\d+[.)])\s+(.*)$/);
    if (m) {
      blocks.push(
        <div key={k++} style={{ display: "flex", gap: 9, margin: "0 0 6px", alignItems: "flex-start" }}>
          <span style={{ color: "var(--accent)", lineHeight: 1.6, flexShrink: 0 }}>•</span>
          <span style={{ flex: 1 }}>{renderInline(m[1])}</span>
        </div>
      );
      continue;
    }
    // Paragraph.
    blocks.push(<p key={k++} style={{ margin: "0 0 10px" }}>{renderInline(line)}</p>);
  }
  return blocks;
}

type Status = "green" | "yellow" | "red";
interface Fact { label: string; value: string; context?: string; tone: "bad" | "warn" | "good" | "neutral"; }
interface Observation { key: string; text: string; }
interface CheckRun { label: string; result: "ruled_out" | "flagged" | "not_available"; detail: string; }
interface Question { text: string; because: string; }
interface Diagnosis {
  accountId: string; name: string; clientName?: string | null;
  status: Status; dataVerified: boolean; computedAt: string;
  headline: string; unverifiedNote?: string;
  facts: Fact[]; observations: Observation[]; checksRun: CheckRun[];
  questions: Question[]; opportunities: { text: string }[]; boundary: string;
}
interface WindowRow {
  days: number; coverageDays: number; partial: boolean;
  spend: number; conversions: number; roas: number | null;
  orders: number | null; revenue: number | null; poas: number | null;
}
interface Trend { acuteDrop: boolean; spendSpike: boolean; note: string | null; }
interface ShopifyStatus { appConfigured: boolean; connected: boolean; shopDomain: string | null; lastSyncAt: string | null; }
interface TrackingStatus { status: "verified" | "broken" | null; note: string | null; setAt: string | null; setBy: string | null; }
interface ProductPage { url: string; name: string; spend: number; clicks: number; conversions: number; conversionValue: number; roas: number | null; }
interface VariantLine {
  variantKey: string; label: string;
  spend: number; clicks: number; adConversions: number;
  units: number; revenue: number; poas: number | null; thin: boolean; spendNoSales: boolean;
}
interface ProductGroup {
  productKey: string; title: string;
  spend: number; clicks: number; adConversions: number;
  units: number; revenue: number; poas: number | null; roas: number | null;
  variantCount: number; thinVariantCount: number; variants: VariantLine[];
  excludeCandidate: boolean; excludeReason: string | null;
  wastedSpend: number; underperformReason: string | null;
}
interface ProductDiagnostic {
  groups: ProductGroup[];
  excludeCandidates: ProductGroup[];
  underperformers: ProductGroup[];
  concentration: { topShare: number; top3Share: number; productCount: number; breadth: "concentrated" | "balanced" | "broad" | "unknown" };
}

const STATUS_COLOR: Record<Status, string> = { green: "var(--accent)", yellow: "var(--accent-2)", red: "var(--danger)" };
const STATUS_LABEL: Record<Status, string> = { green: "Under control", yellow: "Action needed", red: "Immediate action" };
const TONE_COLOR: Record<Fact["tone"], string> = { bad: "var(--danger)", warn: "var(--accent-2)", good: "var(--accent)", neutral: "var(--text)" };

const card: React.CSSProperties = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16 };
const eyebrow: React.CSSProperties = { fontSize: 11, letterSpacing: 0.6, textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 };

function CheckIcon({ result }: { result: CheckRun["result"] }) {
  if (result === "ruled_out") return <CheckCircle2 size={16} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 1 }} />;
  if (result === "flagged") return <XCircle size={16} style={{ color: "var(--danger)", flexShrink: 0, marginTop: 1 }} />;
  return <MinusCircle size={16} style={{ color: "var(--text-dim)", flexShrink: 0, marginTop: 1 }} />;
}

export default function DiagnosePage() {
  const { id } = useParams<{ id: string }>();
  const search = useSearchParams();
  const [diag, setDiag] = useState<Diagnosis | null>(null);
  const [windows, setWindows] = useState<WindowRow[]>([]);
  const [trend, setTrend] = useState<Trend | null>(null);
  const [shopify, setShopify] = useState<ShopifyStatus | null>(null);
  const [products, setProducts] = useState<ProductDiagnostic | null>(null);
  const [productPages, setProductPages] = useState<ProductPage[]>([]);
  const [wins, setWins] = useState<string[]>([]);
  const [insight, setInsight] = useState<string | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightErr, setInsightErr] = useState<string | null>(null);
  const [tracking, setTracking] = useState<TrackingStatus | null>(null);
  const [trackingSaving, setTrackingSaving] = useState<"verified" | "broken" | "clear" | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shopDomain, setShopDomain] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const toggle = (k: string) => setExpanded(prev => { const n = new Set(prev); if (n.has(k)) n.delete(k); else n.add(k); return n; });

  async function load() {
    try {
      const r = await fetch(`/api/diagnostics/account/${id}`, { credentials: "include" });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        setError(j.error ? `${j.error} (HTTP ${r.status})` : `Request failed (HTTP ${r.status})`);
        setLoading(false);
        return;
      }
      const j = await r.json();
      setError(null);
      setDiag(j.diagnosis);
      setWindows(j.windows ?? []);
      setTrend(j.trend ?? null);
      setShopify(j.shopify ?? null);
      setProducts(j.products ?? null);
      setProductPages(j.productPages ?? []);
      setWins(j.wins ?? []);
      setTracking(j.tracking ?? null);
    } catch (e) { setError(e instanceof Error ? e.message : "Network error"); }
    setLoading(false);
  }

  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  function connectShopify() {
    const shop = shopDomain.trim();
    if (!shop) return;
    window.location.href = `/api/shopify/install?accountId=${encodeURIComponent(id)}&shop=${encodeURIComponent(shop)}`;
  }
  async function syncNow() {
    setSyncing(true);
    try {
      await fetch(`/api/shopify/sync`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId: id, days: 60 }),
      });
      await load();
    } finally { setSyncing(false); }
  }

  const [refreshing, setRefreshing] = useState(false);
  const [refreshMsg, setRefreshMsg] = useState<string | null>(null);
  async function refreshData() {
    setRefreshing(true); setRefreshMsg(null);
    try {
      const r = await fetch(`/api/diagnostics/account/${id}/refresh`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days: 30 }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || j.error) {
        setRefreshMsg(`Couldn't pull data: ${j.error ?? `HTTP ${r.status}`}`);
      } else if (!j.ok) {
        setRefreshMsg("Google Ads returned no data for this window (is the account active?).");
      } else {
        setRefreshMsg(`Pulled ${j.pulled?.metricDays ?? 0} metric-days, ${j.pulled?.productRows ?? 0} product rows · Shopify: ${j.pulled?.shopify ?? "—"}.`);
      }
      await load();
    } catch (e) {
      setRefreshMsg(e instanceof Error ? e.message : "Network error");
    } finally { setRefreshing(false); }
  }

  async function getInsight() {
    setInsightLoading(true); setInsightErr(null);
    try {
      const r = await fetch(`/api/diagnostics/account/${id}/insight`, { method: "POST", credentials: "include" });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || j.error) setInsightErr(j.error ?? `HTTP ${r.status}`);
      else setInsight(j.insight ?? "");
    } catch (e) { setInsightErr(e instanceof Error ? e.message : "Failed"); }
    finally { setInsightLoading(false); }
  }

  // Record the team's tracking verdict, then re-run the read so it reasons from
  // certainty. Clearing (null) drops back to "unknown".
  async function setTrackingStatus(status: "verified" | "broken" | null) {
    setTrackingSaving(status ?? "clear");
    try {
      const r = await fetch(`/api/diagnostics/account/${id}/tracking`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.tracking) {
        setTracking({ status: j.tracking.trackingStatus, note: j.tracking.trackingNote, setAt: j.tracking.trackingSetAt, setBy: j.tracking.trackingSetBy });
        // Re-reason if a read is already on screen (or was requested).
        if (insight || insightErr) await getInsight();
      }
    } finally { setTrackingSaving(null); }
  }

  const shopifyMsg = search.get("shopify");
  const shopifyReason = search.get("reason");

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <nav style={{
        display: "flex", alignItems: "center", gap: 16, height: 58, padding: "0 26px",
        position: "sticky", top: 0, zIndex: 9, background: "var(--header-bg)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-3)", textDecoration: "none", fontSize: 13, fontWeight: 500 }}>
          <ArrowLeft size={15} /> Portfolio
        </Link>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={refreshData} disabled={refreshing} style={{
            display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600,
            color: "#fff", border: "none", background: "var(--btn-primary, var(--accent))", padding: "7px 14px", borderRadius: 8, cursor: refreshing ? "default" : "pointer",
          }}>
            {refreshing ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />} {refreshing ? "Pulling…" : "Refresh data"}
          </button>
          <Link href={`/accounts/${id}`} style={{
            display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, textDecoration: "none",
            color: "var(--text-3)", border: "1px solid var(--border-2)", background: "var(--surface)", padding: "7px 13px", borderRadius: 8,
          }}>
            Full analysis <ArrowUpRight size={13} />
          </Link>
        </div>
      </nav>
      {refreshMsg && (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "10px 26px 0" }}>
          <div style={{ fontSize: 12.5, padding: "9px 13px", borderRadius: 10, background: "var(--surface-2)", border: "1px solid var(--border-2)", color: "var(--text-3)" }}>{refreshMsg}</div>
        </div>
      )}

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "26px 26px 90px" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
            <Loader2 size={22} className="animate-spin" style={{ color: "var(--text-dim)" }} />
          </div>
        ) : error || !diag ? (
          <div style={{ ...card, padding: "40px 28px", textAlign: "center", color: "var(--text-muted)" }}>
            <AlertTriangle size={26} style={{ color: "var(--accent-2)", marginBottom: 10 }} />
            <div style={{ fontWeight: 600, color: "var(--text-2)" }}>Couldn&rsquo;t load this diagnosis</div>
            {error ? (
              <div style={{ fontSize: 13, marginTop: 8, color: "var(--danger)", fontFamily: "ui-monospace, monospace", wordBreak: "break-word", maxWidth: 560, margin: "8px auto 0" }}>{error}</div>
            ) : (
              <div style={{ fontSize: 13, marginTop: 6 }}>The account may not be in the pilot yet, or has no data ingested.</div>
            )}
            <button onClick={() => { setLoading(true); setError(null); load(); }} style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: "var(--text-2)", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "7px 14px", cursor: "pointer" }}>
              <RefreshCw size={13} /> Retry
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <span style={{
                fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20, whiteSpace: "nowrap",
                color: STATUS_COLOR[diag.status], background: "color-mix(in srgb, currentColor 14%, transparent)",
                display: "inline-flex", alignItems: "center", gap: 7,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_COLOR[diag.status] }} />
                {STATUS_LABEL[diag.status]}
              </span>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                assessed {new Date(diag.computedAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.8px", margin: "2px 0 2px" }}>
              {diag.name}{diag.clientName ? <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: 18 }}> · {diag.clientName}</span> : null}
            </h1>

            {/* Headline */}
            <div id="overview" style={{
              ...card, border: `1px solid ${diag.status === "green" ? "var(--border)" : "var(--border-2)"}`,
              padding: "20px 22px", marginTop: 16, scrollMarginTop: 116,
              background: diag.status === "green"
                ? "linear-gradient(160deg, var(--accent-dim), transparent), var(--surface)"
                : `linear-gradient(160deg, color-mix(in srgb, ${STATUS_COLOR[diag.status]} 10%, transparent), transparent), var(--surface)`,
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                {diag.status === "green"
                  ? <Sprout size={22} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }} />
                  : <AlertTriangle size={22} style={{ color: STATUS_COLOR[diag.status], flexShrink: 0, marginTop: 2 }} />}
                <div style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.4 }}>{diag.headline}</div>
              </div>
            </div>

            {/* §4.9 unverified banner */}
            {diag.unverifiedNote && (
              <div style={{
                marginTop: 12, padding: "11px 15px", borderRadius: 12, fontSize: 12.5,
                color: "var(--text-3)", background: "var(--surface-2)", border: "1px dashed var(--border-2)",
                display: "flex", alignItems: "center", gap: 9,
              }}>
                <ShieldCheck size={15} style={{ color: "var(--text-dim)", flexShrink: 0 }} /> {diag.unverifiedNote}
              </div>
            )}

            {/* Shopify connect / status banner */}
            {shopifyMsg === "connected" && (
              <div style={{ marginTop: 12, padding: "11px 15px", borderRadius: 12, fontSize: 13, color: "var(--accent)", background: "var(--accent-dim)", border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)", display: "flex", alignItems: "center", gap: 9 }}>
                <CheckCircle2 size={15} /> Shopify connected. Click <b>Sync orders</b> below to pull the order history.
              </div>
            )}
            {shopifyMsg === "error" && (
              <div style={{ marginTop: 12, padding: "11px 15px", borderRadius: 12, fontSize: 13, color: "var(--danger)", background: "color-mix(in srgb, var(--danger) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--danger) 30%, transparent)", display: "flex", alignItems: "center", gap: 9 }}>
                <XCircle size={15} /> Shopify connection failed{shopifyReason ? `: ${shopifyReason}` : ""}.
              </div>
            )}

            {/* Section nav — jump within the cockpit, no scrolling hunt */}
            <SectionNav items={[
              { id: "overview", label: "Overview" },
              ...(windows.some(w => w.spend > 0) ? [{ id: "trends", label: "Trends" }] : []),
              ...(products && products.groups.length ? [{ id: "products", label: "Products" }] : []),
              ...((diag.observations.length || diag.checksRun.length || diag.questions.length) ? [{ id: "diagnosis", label: "Diagnosis" }] : []),
              ...(shopify ? [{ id: "data", label: "Data & connections" }] : []),
            ]} />

            {/* Expert read (PPC OS) — the "don't figure it out yourself" layer */}
            <div style={{ ...card, border: "1px solid color-mix(in srgb, var(--accent) 30%, var(--border))", padding: "15px 17px", marginTop: 14, background: "linear-gradient(160deg, var(--accent-dim), transparent), var(--surface)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <Sparkles size={16} style={{ color: "var(--accent)" }} />
                <span style={{ fontSize: 13.5, fontWeight: 700 }}>Expert read</span>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>PPC OS</span>
                {!insight && (
                  <button onClick={getInsight} disabled={insightLoading} style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: "#fff", background: "var(--btn-primary, var(--accent))", border: "none", borderRadius: 8, padding: "7px 14px", cursor: insightLoading ? "default" : "pointer" }}>
                    {insightLoading ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />} {insightLoading ? "Thinking…" : "Get the read"}
                  </button>
                )}
                {insight && (
                  <button onClick={getInsight} disabled={insightLoading} title="Regenerate" style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "var(--text-3)", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: 7, padding: "5px 10px", cursor: insightLoading ? "default" : "pointer" }}>
                    {insightLoading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />} Regenerate
                  </button>
                )}
              </div>
              {insightErr && <div style={{ fontSize: 12.5, color: "var(--danger)", marginTop: 10 }}>{insightErr}</div>}
              {insight && (
                <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-2)", marginTop: 12 }}>
                  {renderMarkdown(insight)}
                </div>
              )}
              {!insight && !insightErr && !insightLoading && (
                <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 8 }}>A short, direct read — what&rsquo;s happening, the likely why, and the next move — grounded in your PPC OS methodology.</div>
              )}

              {/* Resolve-and-re-reason: confirm the read's #1 assumption (tracking)
                  so it reasons from certainty instead of hedging every ROAS figure. */}
              <div style={{ marginTop: 14, paddingTop: 13, borderTop: "1px solid var(--border-2)" }}>
                {tracking?.status === "verified" ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "var(--accent)" }}>
                      <ShieldCheck size={15} /> Conversion tracking verified working
                    </span>
                    <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                      {tracking.setBy ? `by ${tracking.setBy}` : ""}{tracking.setAt ? ` · ${new Date(tracking.setAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}` : ""} — ROAS figures treated as real
                    </span>
                    <button onClick={() => setTrackingStatus(null)} disabled={!!trackingSaving} style={{ marginLeft: "auto", fontSize: 11.5, fontWeight: 600, color: "var(--text-3)", background: "none", border: "none", cursor: trackingSaving ? "default" : "pointer", textDecoration: "underline" }}>
                      {trackingSaving === "clear" ? "…" : "Change"}
                    </button>
                  </div>
                ) : tracking?.status === "broken" ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "var(--danger)" }}>
                      <AlertTriangle size={15} /> Conversion tracking confirmed broken
                    </span>
                    <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                      {tracking.setBy ? `by ${tracking.setBy}` : ""}{tracking.setAt ? ` · ${new Date(tracking.setAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}` : ""} — fix tracking before trusting any ROAS
                    </span>
                    <button onClick={() => setTrackingStatus(null)} disabled={!!trackingSaving} style={{ marginLeft: "auto", fontSize: 11.5, fontWeight: 600, color: "var(--text-3)", background: "none", border: "none", cursor: trackingSaving ? "default" : "pointer", textDecoration: "underline" }}>
                      {trackingSaving === "clear" ? "…" : "Change"}
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Checked conversion tracking? Confirm it and the read re-reasons:</span>
                    <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
                      <button onClick={() => setTrackingStatus("verified")} disabled={!!trackingSaving} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "var(--accent)", background: "var(--accent-dim)", border: "1px solid color-mix(in srgb, var(--accent) 35%, var(--border))", borderRadius: 7, padding: "5px 11px", cursor: trackingSaving ? "default" : "pointer" }}>
                        {trackingSaving === "verified" ? <Loader2 size={12} className="animate-spin" /> : <ShieldCheck size={13} />} Verified working
                      </button>
                      <button onClick={() => setTrackingStatus("broken")} disabled={!!trackingSaving} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "var(--danger)", background: "color-mix(in srgb, var(--danger) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--danger) 30%, var(--border))", borderRadius: 7, padding: "5px 11px", cursor: trackingSaving ? "default" : "pointer" }}>
                        {trackingSaving === "broken" ? <Loader2 size={12} className="animate-spin" /> : <AlertTriangle size={13} />} Confirmed broken
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Facts */}
            {diag.facts.length > 0 && (
              <>
                <SectionTitle>The numbers</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
                  {diag.facts.map((f, i) => (
                    <div key={i} style={{ ...card, padding: "13px 15px" }}>
                      <div style={{ ...eyebrow, marginBottom: 6 }}>{f.label}</div>
                      <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: "-0.6px", color: TONE_COLOR[f.tone] }}>{f.value}</div>
                      {f.context && <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 3 }}>{f.context}</div>}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Issues — what's wrong, instantly (right under the numbers) */}
            {diag.observations.length > 0 && (
              <>
                <SectionTitle>Issues</SectionTitle>
                <div style={{ ...card, padding: "6px 4px" }}>
                  {diag.observations.map((o, i) => (
                    <div key={i} style={{ display: "flex", gap: 11, padding: "11px 16px", borderBottom: i < diag.observations.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <AlertTriangle size={15} style={{ color: diag.status === "red" ? "var(--danger)" : "var(--accent-2)", flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 14, lineHeight: 1.5, color: "var(--text-2)" }}>{o.text}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* What's working — earned praise (§5A), balances the warnings */}
            {wins.length > 0 && (
              <>
                <SectionTitle>What&rsquo;s working</SectionTitle>
                <div style={{ ...card, padding: "6px 4px", border: "1px solid color-mix(in srgb, var(--accent) 25%, var(--border))" }}>
                  {wins.map((w, i) => (
                    <div key={i} style={{ display: "flex", gap: 11, padding: "11px 16px", borderBottom: i < wins.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <CheckCircle2 size={15} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 14, lineHeight: 1.5, color: "var(--text-2)" }}>{w}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Underperforming products — ranked by wasted spend */}
            {products && products.underperformers.length > 0 && (
              <>
                <SectionTitle>Underperforming products — most wasted spend first</SectionTitle>
                <div style={{ ...card, overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, minWidth: 560 }}>
                    <thead>
                      <tr style={{ color: "var(--text-muted)", textAlign: "right" }}>
                        <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600 }}>Product</th>
                        <th style={{ padding: "10px 8px", fontWeight: 600 }}>Spend</th>
                        <th style={{ padding: "10px 8px", fontWeight: 600 }}>Wasted</th>
                        <th style={{ padding: "10px 8px", fontWeight: 600 }}>ROAS</th>
                        <th style={{ padding: "10px 8px", fontWeight: 600 }}>POAS</th>
                        <th style={{ padding: "10px 8px", fontWeight: 600 }}>Conv.</th>
                        <th style={{ padding: "10px 8px", fontWeight: 600 }}>Units</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.underperformers.slice(0, 10).map(p => (
                        <tr key={p.productKey} style={{ borderTop: "1px solid var(--border)", textAlign: "right", color: "var(--text-2)" }}>
                          <td style={{ textAlign: "left", padding: "9px 14px", fontWeight: 600, color: "var(--text)", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            <span style={{ color: "var(--danger)", marginRight: 6 }}>●</span>{p.title}
                          </td>
                          <td style={{ padding: "9px 8px", fontVariantNumeric: "tabular-nums" }}>{fmtMoney(p.spend)}</td>
                          <td style={{ padding: "9px 8px", fontVariantNumeric: "tabular-nums", color: "var(--danger)", fontWeight: 600 }}>{fmtMoney(p.wastedSpend)}</td>
                          <td style={{ padding: "9px 8px", fontVariantNumeric: "tabular-nums" }}>{p.roas != null ? p.roas.toFixed(2) : "—"}</td>
                          <td style={{ padding: "9px 8px", fontVariantNumeric: "tabular-nums", color: p.poas != null && p.poas < 1 ? "var(--danger)" : "var(--text-2)" }}>{p.poas != null ? p.poas.toFixed(2) : "—"}</td>
                          <td style={{ padding: "9px 8px", fontVariantNumeric: "tabular-nums" }}>{Math.round(p.adConversions)}</td>
                          <td style={{ padding: "9px 8px", fontVariantNumeric: "tabular-nums" }}>{p.units || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)", margin: "8px 4px 0" }}>
                  &ldquo;Wasted&rdquo; = spend not returning (all of it when nothing converts, or the share above break-even POAS). Full product breakdown below.
                </div>
              </>
            )}

            {/* Product performance — winners & losers, by spend (Google Ads) */}
            {productPages.length > 0 && (
              <>
                <SectionTitle>Product performance — where the spend goes (last 7 days)</SectionTitle>
                <div style={{ ...card, overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, minWidth: 520 }}>
                    <thead>
                      <tr style={{ color: "var(--text-muted)", textAlign: "right" }}>
                        <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600 }}>Product</th>
                        <th style={{ padding: "10px 8px", fontWeight: 600 }}>Spend</th>
                        <th style={{ padding: "10px 8px", fontWeight: 600 }}>Clicks</th>
                        <th style={{ padding: "10px 8px", fontWeight: 600 }}>Conv.</th>
                        <th style={{ padding: "10px 14px", fontWeight: 600 }}>ROAS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productPages.slice(0, 12).map(p => {
                        const bad = p.roas == null || p.roas < 1;
                        const good = p.roas != null && p.roas >= 2;
                        return (
                          <tr key={p.url} style={{ borderTop: "1px solid var(--border)", textAlign: "right", color: "var(--text-2)" }}>
                            <td style={{ textAlign: "left", padding: "9px 14px", fontWeight: 600, color: "var(--text)", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              <span title={p.roas == null || p.roas < 1 ? "spend, no return" : "converting"} style={{ color: bad ? "var(--danger)" : good ? "var(--accent)" : "var(--text-dim)", marginRight: 7 }}>●</span>
                              {p.name}
                            </td>
                            <td style={{ padding: "9px 8px", fontVariantNumeric: "tabular-nums" }}>{fmtMoney(p.spend)}</td>
                            <td style={{ padding: "9px 8px", fontVariantNumeric: "tabular-nums" }}>{p.clicks || "—"}</td>
                            <td style={{ padding: "9px 8px", fontVariantNumeric: "tabular-nums", color: p.conversions < 1 ? "var(--danger)" : "var(--text-2)" }}>{Math.round(p.conversions)}</td>
                            <td style={{ padding: "9px 14px", fontVariantNumeric: "tabular-nums", fontWeight: 600, color: bad ? "var(--danger)" : good ? "var(--accent)" : "var(--text-2)" }}>{p.roas != null ? p.roas.toFixed(2) : "—"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)", margin: "8px 4px 0" }}>
                  Green = converting (ROAS ≥ 2), red = spend with little/no return. From Google Ads landing pages; connect Shopify to add real units &amp; revenue.
                </div>
              </>
            )}

            {/* Multi-window trend (§4) */}
            {windows.some(w => w.spend > 0) && (
              <>
                <div id="trends" style={{ scrollMarginTop: 116 }} />
                <SectionTitle>Across windows — spotting drift vs the baseline</SectionTitle>
                {trend?.note && (
                  <div style={{
                    marginBottom: 10, padding: "10px 14px", borderRadius: 10, fontSize: 12.5, fontWeight: 500,
                    color: "var(--accent-2)", background: "color-mix(in srgb, var(--accent-2) 12%, transparent)",
                    border: "1px solid color-mix(in srgb, var(--accent-2) 30%, transparent)",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <AlertTriangle size={14} style={{ flexShrink: 0 }} /> {trend.note}
                  </div>
                )}
                <div style={{ ...card, overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 520 }}>
                    <thead>
                      <tr style={{ color: "var(--text-muted)", textAlign: "right" }}>
                        <th style={{ textAlign: "left", padding: "11px 14px", fontWeight: 600 }}>Window</th>
                        <th style={{ padding: "11px 10px", fontWeight: 600 }}>Spend</th>
                        <th style={{ padding: "11px 10px", fontWeight: 600 }}>ROAS</th>
                        <th style={{ padding: "11px 10px", fontWeight: 600 }}>POAS</th>
                        <th style={{ padding: "11px 10px", fontWeight: 600 }}>Orders</th>
                        <th style={{ padding: "11px 14px", fontWeight: 600 }}>Conv.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {windows.map((w, i) => (
                        <tr key={w.days} style={{ borderTop: "1px solid var(--border)", textAlign: "right", color: w.partial ? "var(--text-dim)" : "var(--text-2)" }}>
                          <td style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: w.partial ? "var(--text-dim)" : "var(--text)" }}>
                            {w.days}d{w.partial ? <span title={`only ${w.coverageDays} days of history`} style={{ fontSize: 10, color: "var(--text-dim)", marginLeft: 6 }}>partial</span> : null}
                          </td>
                          <td style={{ padding: "10px 10px", fontVariantNumeric: "tabular-nums" }}>{fmtMoney(w.spend)}</td>
                          <td style={{ padding: "10px 10px", fontVariantNumeric: "tabular-nums", color: cmpColor(w.roas, windows, i, "roas") }}>{w.roas != null ? w.roas.toFixed(2) : "—"}</td>
                          <td style={{ padding: "10px 10px", fontVariantNumeric: "tabular-nums", color: cmpColor(w.poas, windows, i, "poas") }}>{w.poas != null ? w.poas.toFixed(2) : "—"}</td>
                          <td style={{ padding: "10px 10px", fontVariantNumeric: "tabular-nums" }}>{w.orders != null ? w.orders : "—"}</td>
                          <td style={{ padding: "10px 14px", fontVariantNumeric: "tabular-nums" }}>{Math.round(w.conversions)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)", margin: "8px 4px 0" }}>
                  Each window ends yesterday. POAS and Orders need Shopify connected. &ldquo;partial&rdquo; = history doesn&rsquo;t yet cover the full window — back-fill 90 days to fill it in.
                </div>
              </>
            )}

            {/* Product breakdown — ad spend vs real sales, variant→product (§4/§8) */}
            {products && products.groups.length > 0 && (
              <>
                <div id="products" style={{ scrollMarginTop: 116 }} />
                {products.excludeCandidates.length > 0 && (
                  <>
                    <SectionTitle>Feed candidates — spend, no conversions (judged at product level)</SectionTitle>
                    <div style={{ ...card, border: "1px solid color-mix(in srgb, var(--danger) 30%, transparent)", padding: "6px 4px", marginBottom: 4 }}>
                      {products.excludeCandidates.map(p => (
                        <div key={p.productKey} style={{ display: "flex", gap: 11, padding: "11px 16px", borderBottom: "1px solid var(--border)" }}>
                          <AlertTriangle size={16} style={{ color: "var(--danger)", flexShrink: 0, marginTop: 2 }} />
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 700 }}>{p.title}</div>
                            <div style={{ fontSize: 12.5, color: "var(--text-3)", marginTop: 2 }}>{p.excludeReason} — a candidate to exclude from the feed.</div>
                          </div>
                        </div>
                      ))}
                      <div style={{ fontSize: 11.5, color: "var(--text-muted)", padding: "8px 16px" }}>
                        Individual variants are often too thin to judge — this call is made on the rolled-up product. The system flags the candidate; the specialist makes the exclusion.
                      </div>
                    </div>
                  </>
                )}

                <SectionTitle>By product — what the ads did vs what actually sold</SectionTitle>
                <div style={{ ...card, overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, minWidth: 580 }}>
                    <thead>
                      <tr style={{ color: "var(--text-muted)", textAlign: "right" }}>
                        <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600 }}>Product</th>
                        <th style={{ padding: "10px 8px", fontWeight: 600 }}>Spend</th>
                        <th style={{ padding: "10px 8px", fontWeight: 600 }}>Clicks</th>
                        <th style={{ padding: "10px 8px", fontWeight: 600 }}>Conv.</th>
                        <th style={{ padding: "10px 8px", fontWeight: 600 }}>Units</th>
                        <th style={{ padding: "10px 8px", fontWeight: 600 }}>Revenue</th>
                        <th style={{ padding: "10px 14px", fontWeight: 600 }}>POAS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.groups.slice(0, 15).map(p => {
                        const open = expanded.has(p.productKey);
                        const canExpand = p.variants.length > 1;
                        return (
                          <Fragment key={p.productKey}>
                            <tr
                              onClick={() => canExpand && toggle(p.productKey)}
                              style={{ borderTop: "1px solid var(--border)", textAlign: "right", color: "var(--text-2)", cursor: canExpand ? "pointer" : "default" }}>
                              <td style={{ textAlign: "left", padding: "9px 14px", fontWeight: 600, color: "var(--text)", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {canExpand
                                  ? <ChevronRight size={13} style={{ verticalAlign: -2, marginRight: 5, color: "var(--text-dim)", transform: open ? "rotate(90deg)" : "none", transition: "transform .12s" }} />
                                  : <span style={{ display: "inline-block", width: 18 }} />}
                                {p.excludeCandidate && <span title="spend, no conversions" style={{ color: "var(--danger)", marginRight: 6 }}>●</span>}
                                {p.title}
                                {p.variantCount > 1 && <span style={{ fontSize: 11, color: "var(--text-dim)", marginLeft: 7 }}>{p.variantCount} variants{p.thinVariantCount ? `, ${p.thinVariantCount} thin` : ""}</span>}
                              </td>
                              <td style={{ padding: "9px 8px", fontVariantNumeric: "tabular-nums" }}>{p.spend > 0 ? fmtMoney(p.spend) : "—"}</td>
                              <td style={{ padding: "9px 8px", fontVariantNumeric: "tabular-nums" }}>{p.clicks || "—"}</td>
                              <td style={{ padding: "9px 8px", fontVariantNumeric: "tabular-nums", color: p.excludeCandidate ? "var(--danger)" : "var(--text-2)" }}>{Math.round(p.adConversions)}</td>
                              <td style={{ padding: "9px 8px", fontVariantNumeric: "tabular-nums" }}>{p.units || "—"}</td>
                              <td style={{ padding: "9px 8px", fontVariantNumeric: "tabular-nums" }}>{p.revenue > 0 ? fmtMoney(p.revenue) : "—"}</td>
                              <td style={{ padding: "9px 14px", fontVariantNumeric: "tabular-nums", color: p.poas != null ? (p.poas < 1 ? "var(--danger)" : "var(--accent)") : "var(--text-dim)" }}>{p.poas != null ? p.poas.toFixed(2) : "—"}</td>
                            </tr>
                            {open && p.variants.map(v => (
                              <tr key={v.variantKey} style={{ textAlign: "right", color: "var(--text-3)", background: "var(--surface-2)", fontSize: 12 }}>
                                <td style={{ textAlign: "left", padding: "7px 14px 7px 37px", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {v.spendNoSales && <span style={{ color: "var(--danger)", marginRight: 5 }}>●</span>}
                                  {v.label}
                                  {v.thin && <span title="too little data to judge alone" style={{ fontSize: 10, color: "var(--text-dim)", marginLeft: 6 }}>thin</span>}
                                </td>
                                <td style={{ padding: "7px 8px", fontVariantNumeric: "tabular-nums" }}>{v.spend > 0 ? fmtMoney(v.spend) : "—"}</td>
                                <td style={{ padding: "7px 8px", fontVariantNumeric: "tabular-nums" }}>{v.clicks || "—"}</td>
                                <td style={{ padding: "7px 8px", fontVariantNumeric: "tabular-nums" }}>{Math.round(v.adConversions)}</td>
                                <td style={{ padding: "7px 8px", fontVariantNumeric: "tabular-nums" }}>{v.units || "—"}</td>
                                <td style={{ padding: "7px 8px", fontVariantNumeric: "tabular-nums" }}>{v.revenue > 0 ? fmtMoney(v.revenue) : "—"}</td>
                                <td style={{ padding: "7px 14px", fontVariantNumeric: "tabular-nums" }}>{v.poas != null ? v.poas.toFixed(2) : "—"}</td>
                              </tr>
                            ))}
                          </Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)", margin: "8px 4px 0" }}>
                  {products.concentration.breadth !== "unknown" && (
                    <>Revenue is <b>{products.concentration.breadth}</b> — top product is {Math.round(products.concentration.topShare * 100)}% of sales, top 3 are {Math.round(products.concentration.top3Share * 100)}%. </>
                  )}
                  Click a product to see its variants. Ads roll up from item/variant level; units &amp; revenue need Shopify connected. Last 7 days.
                </div>
              </>
            )}

            {/* Diagnosis (checks → questions) — issues are surfaced up top now */}
            <div id="diagnosis" style={{ scrollMarginTop: 116 }} />

            {/* Checks already run — §5, show the work */}
            {diag.checksRun.length > 0 && (
              <>
                <SectionTitle>What I already checked</SectionTitle>
                <div style={{ ...card, padding: "6px 4px" }}>
                  {diag.checksRun.map((c, i) => (
                    <div key={i} style={{ display: "flex", gap: 11, padding: "12px 16px", borderBottom: i < diag.checksRun.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <CheckIcon result={c.result} />
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{c.label}</div>
                        <div style={{ fontSize: 13, color: "var(--text-3)", marginTop: 2, lineHeight: 1.45 }}>{c.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Questions for the specialist — §9, the heart of it */}
            {diag.questions.length > 0 && (
              <>
                <SectionTitle>Questions for you to ask</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {diag.questions.map((q, i) => (
                    <div key={i} style={{ ...card, border: "1px solid var(--border-2)", padding: "15px 17px" }}>
                      <div style={{ display: "flex", gap: 11 }}>
                        <HelpCircle size={18} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 1 }} />
                        <div style={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.45 }}>{q.text}</div>
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 7, paddingLeft: 29 }}>Because: {q.because}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Opportunities — §5A, bring a win */}
            {diag.opportunities.length > 0 && (
              <>
                <SectionTitle>Worth a look — a win, not a fire</SectionTitle>
                <div style={{ ...card, padding: "6px 4px" }}>
                  {diag.opportunities.map((o, i) => (
                    <div key={i} style={{ display: "flex", gap: 11, padding: "12px 16px", borderBottom: i < diag.opportunities.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <TrendingUp size={16} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 13.5, lineHeight: 1.5, color: "var(--text-2)" }}>{o.text}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Data & connections */}
            {shopify && (
              <>
                <div id="data" style={{ scrollMarginTop: 116 }} />
                <SectionTitle>Data &amp; connections</SectionTitle>
                <div style={{ ...card, padding: "15px 17px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: shopify.connected ? 4 : 10 }}>
                    <ShoppingBag size={16} style={{ color: shopify.connected ? "var(--accent)" : "var(--text-dim)" }} />
                    <span style={{ fontSize: 13.5, fontWeight: 700 }}>Order feed (Shopify)</span>
                    {shopify.connected && (
                      <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 8 }}>
                        {shopify.shopDomain} · synced {shopify.lastSyncAt ? new Date(shopify.lastSyncAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "never"}
                        <button onClick={syncNow} disabled={syncing} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "var(--text-2)", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: 7, padding: "5px 10px", cursor: syncing ? "default" : "pointer" }}>
                          {syncing ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />} Sync orders
                        </button>
                      </span>
                    )}
                  </div>
                  {!shopify.connected && (
                    shopify.appConfigured ? (
                      <>
                        <div style={{ fontSize: 12.5, color: "var(--text-3)", marginBottom: 10 }}>
                          Connect this client&rsquo;s store to reconcile real orders against Google Ads and unlock POAS. Enter their <code>.myshopify.com</code> domain.
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <input
                            value={shopDomain} onChange={e => setShopDomain(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && connectShopify()}
                            placeholder="acme.myshopify.com"
                            style={{ flex: 1, fontSize: 13, padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border-2)", background: "var(--surface-2)", color: "var(--text)" }}
                          />
                          <button onClick={connectShopify} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#fff", background: "var(--btn-primary, var(--accent))", border: "none", borderRadius: 8, padding: "9px 16px", cursor: "pointer" }}>
                            Connect <ArrowUpRight size={14} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>
                        The Shopify app isn&rsquo;t set up yet. Add <code>SHOPIFY_API_KEY</code> and <code>SHOPIFY_API_SECRET</code> on Railway, then the connect button appears here.
                      </div>
                    )
                  )}
                </div>
              </>
            )}

            {/* §9 boundary — always visible */}
            <div style={{
              marginTop: 28, padding: "14px 18px", borderRadius: 12, textAlign: "center",
              fontSize: 12.5, fontStyle: "italic", color: "var(--text-muted)",
              background: "var(--surface-2)", border: "1px solid var(--border)",
            }}>
              {diag.boundary}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function fmtMoney(n: number): string {
  return `€${Math.round(n).toLocaleString("en-GB")}`;
}

/** Tint a window's ROAS/POAS relative to the longest (baseline) window. */
function cmpColor(v: number | null, rows: WindowRow[], i: number, key: "roas" | "poas"): string {
  if (v == null) return "var(--text-dim)";
  const base = rows[rows.length - 1]?.[key];
  if (base == null || i === rows.length - 1) return "var(--text-2)";
  if (v >= base * 1.1) return "var(--accent)";
  if (v <= base * 0.75) return "var(--danger)";
  return "var(--text-2)";
}

function SectionNav({ items }: { items: { id: string; label: string }[] }) {
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  return (
    <div style={{
      position: "sticky", top: 58, zIndex: 8, marginTop: 14,
      background: "var(--bg)", padding: "8px 0", borderBottom: "1px solid var(--border)",
      display: "flex", gap: 6, flexWrap: "wrap",
    }}>
      {items.map(it => (
        <button key={it.id} onClick={() => go(it.id)} style={{
          fontSize: 12.5, fontWeight: 600, color: "var(--text-3)", background: "var(--surface)",
          border: "1px solid var(--border-2)", borderRadius: 999, padding: "6px 14px", cursor: "pointer",
        }}>{it.label}</button>
      ))}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: 13, fontWeight: 700, color: "var(--text-2)", margin: "26px 4px 11px", letterSpacing: "-0.2px" }}>{children}</h2>;
}
