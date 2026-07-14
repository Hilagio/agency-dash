"use client";

/**
 * Diagnostic workspace (BUILD-SPEC §9) — the landing page for a flagged account.
 *
 * Value-first, never a chore (§5): it leads with one honest headline, shows the
 * numbers, shows *what it already checked*, and hands the specialist the
 * questions to ask. It never names a cause (§9) — that boundary is printed on
 * the page. From here you can jump to the full analysis if you want to dig.
 */
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ArrowUpRight, Loader2, CheckCircle2, AlertTriangle, HelpCircle,
  ShieldCheck, Sprout, XCircle, MinusCircle, TrendingUp, ShoppingBag, RefreshCw,
} from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [shopDomain, setShopDomain] = useState("");
  const [syncing, setSyncing] = useState(false);

  async function load() {
    try {
      const r = await fetch(`/api/diagnostics/account/${id}`, { credentials: "include" });
      if (!r.ok) { setError(true); setLoading(false); return; }
      const j = await r.json();
      setDiag(j.diagnosis);
      setWindows(j.windows ?? []);
      setTrend(j.trend ?? null);
      setShopify(j.shopify ?? null);
    } catch { setError(true); }
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

  const shopifyMsg = search.get("shopify");
  const shopifyReason = search.get("reason");

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <nav style={{
        display: "flex", alignItems: "center", gap: 16, height: 58, padding: "0 26px",
        position: "sticky", top: 0, zIndex: 9, background: "var(--header-bg)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-3)", textDecoration: "none", fontSize: 13, fontWeight: 500 }}>
          <ArrowLeft size={15} /> Today
        </Link>
        <div style={{ marginLeft: "auto" }}>
          <Link href={`/accounts/${id}`} style={{
            display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, textDecoration: "none",
            color: "var(--text-3)", border: "1px solid var(--border-2)", background: "var(--surface)", padding: "7px 13px", borderRadius: 8,
          }}>
            Full account analysis <ArrowUpRight size={13} />
          </Link>
        </div>
      </nav>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "26px 26px 90px" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
            <Loader2 size={22} className="animate-spin" style={{ color: "var(--text-dim)" }} />
          </div>
        ) : error || !diag ? (
          <div style={{ ...card, padding: "48px 28px", textAlign: "center", color: "var(--text-muted)" }}>
            <AlertTriangle size={26} style={{ color: "var(--accent-2)", marginBottom: 10 }} />
            <div style={{ fontWeight: 600, color: "var(--text-2)" }}>Couldn&rsquo;t load this diagnosis</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>The account may not be in the pilot yet, or has no data ingested.</div>
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
            <div style={{
              ...card, border: `1px solid ${diag.status === "green" ? "var(--border)" : "var(--border-2)"}`,
              padding: "20px 22px", marginTop: 16,
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

            {/* Commerce (Shopify order feed) */}
            {shopify && (
              <div style={{ ...card, padding: "15px 17px", marginTop: 12 }}>
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
            )}

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

            {/* Multi-window trend (§4) */}
            {windows.some(w => w.spend > 0) && (
              <>
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

            {/* Observations */}
            {diag.observations.length > 0 && (
              <>
                <SectionTitle>What I&rsquo;m seeing</SectionTitle>
                <div style={{ ...card, padding: "6px 4px" }}>
                  {diag.observations.map((o, i) => (
                    <div key={i} style={{ display: "flex", gap: 11, padding: "11px 16px", borderBottom: i < diag.observations.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--text-dim)", flexShrink: 0, marginTop: 7 }} />
                      <span style={{ fontSize: 14, lineHeight: 1.5, color: "var(--text-2)" }}>{o.text}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: 13, fontWeight: 700, color: "var(--text-2)", margin: "26px 4px 11px", letterSpacing: "-0.2px" }}>{children}</h2>;
}
