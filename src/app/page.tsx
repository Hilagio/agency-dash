"use client";

/**
 * Portfolio home — the one screen the team lives in.
 * All accounts, worst-first, with their core numbers (spend, POAS/ROAS, orders,
 * flags). Each row drills into the per-account cockpit at /diagnose/[id].
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck, Settings as SettingsIcon, Store, ListChecks, BookOpen,
  Loader2, ArrowRight, Sprout, Activity, ShoppingBag, AlertTriangle, CheckCircle2, XCircle,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

type Colour = "red" | "yellow" | "green" | "unknown";
interface Row {
  id: string; name: string; clientName: string | null; ownerName: string | null;
  status: Colour; hasData: boolean;
  spend: number; roas: number | null; poas: number | null; orders: number | null;
  revenue: number | null; dataVerified: boolean; shopifyConnected: boolean;
  reconciliationMismatch: boolean;
  worstSignal: { title: string; severity: string } | null;
  problemCount: number; opportunityCount: number;
}
interface Portfolio {
  accounts: Row[];
  counts: Record<Colour, number>;
  total: number; unverified: number; withData: number;
}
interface Health { ok: boolean; accountCount?: number; error?: string; hint?: string }

const STATUS_COLOR: Record<Colour, string> = {
  red: "var(--danger)", yellow: "var(--accent-2)", green: "var(--accent)", unknown: "var(--text-dim)",
};
const STATUS_LABEL: Record<Colour, string> = {
  red: "Immediate", yellow: "Action needed", green: "Under control", unknown: "No data",
};

const card: React.CSSProperties = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16 };
const eyebrow: React.CSSProperties = { fontSize: 11, letterSpacing: 0.6, textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 };
const navLink = (active: boolean): React.CSSProperties => ({
  display: "flex", alignItems: "center", gap: 6, fontSize: 13, padding: "7px 12px", borderRadius: 8, textDecoration: "none",
  color: active ? "var(--text)" : "var(--text-3)", background: active ? "var(--accent-dim)" : "transparent", fontWeight: active ? 600 : 500,
});
const money = (n: number) => `€${Math.round(n).toLocaleString("en-GB")}`;

export default function PortfolioHome() {
  const [name, setName] = useState<string | null>(null);
  const [data, setData] = useState<Portfolio | null>(null);
  const [health, setHealth] = useState<Health | null>(null);
  const [loading, setLoading] = useState(true);
  const [nowMs, setNowMs] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNowMs(Date.now());
    (async () => {
      const [me, pf] = await Promise.all([
        fetch("/api/auth/me", { credentials: "include" }).then(r => r.ok ? r.json() : { user: null }).catch(() => ({ user: null })),
        fetch("/api/diagnostics/portfolio", { credentials: "include" }).then(r => r.ok ? r.json() : null).catch(() => null),
      ]);
      setName(me?.user?.name ?? (me?.user?.email ? String(me.user.email).split("@")[0] : null));
      setData(pf);
      setLoading(false);
      // Health probe is independent (can be slow / fail) — load it after.
      fetch("/api/google-ads/health", { credentials: "include" }).then(r => r.json()).then(setHealth).catch(() => setHealth({ ok: false, error: "unreachable" }));
    })();
  }, []);

  const hour = nowMs != null ? new Date(nowMs).getHours() : 9;
  const partOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  const first = (name ?? "there").split(" ")[0];
  const c = data?.counts ?? { red: 0, yellow: 0, green: 0, unknown: 0 };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <nav style={{
        display: "flex", alignItems: "center", gap: 16, height: 58, padding: "0 26px",
        position: "sticky", top: 0, zIndex: 9, background: "var(--header-bg)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 800, letterSpacing: "-0.4px", fontSize: 15 }}>
          <div style={{ width: 27, height: 27, borderRadius: 8, background: "linear-gradient(135deg, #33cc80, #1c8a52)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, boxShadow: "0 2px 10px rgba(51,204,128,0.4)" }}>A</div>
          agency-dash
        </div>
        <div style={{ display: "flex", gap: 2, marginLeft: 8 }}>
          <Link href="/" style={navLink(true)}>Portfolio</Link>
          <Link href="/stores" style={navLink(false)}><Store size={13} /> Stores</Link>
          <Link href="/ownership" style={navLink(false)}><ShieldCheck size={13} /> Ownership</Link>
          <Link href="/actions" style={navLink(false)}><ListChecks size={13} /> Actions</Link>
          <Link href="/sops" style={navLink(false)}><BookOpen size={13} /> SOPs</Link>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <ThemeToggle />
          <Link href="/settings" style={{ display: "flex", width: 32, height: 32, borderRadius: 8, border: "1px solid var(--border-2)", background: "var(--surface)", alignItems: "center", justifyContent: "center", color: "var(--text-3)" }} title="Settings">
            <SettingsIcon size={15} />
          </Link>
        </div>
      </nav>

      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "22px 26px 80px" }}>
        {/* Header: greeting + summary chips + health */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 16 }}>
          <div>
            <div style={eyebrow}>Portfolio · {nowMs ? new Date(nowMs).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }) : " "}</div>
            <h1 style={{ fontSize: 25, fontWeight: 800, letterSpacing: "-0.8px", margin: "6px 0 0" }}>
              Good {partOfDay}, <span style={{ color: "var(--accent)" }}>{first}</span> <Sprout size={20} style={{ verticalAlign: -2, color: "var(--accent)" }} />
            </h1>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <SummaryChip color={STATUS_COLOR.red} label="Immediate" value={c.red} />
            <SummaryChip color={STATUS_COLOR.yellow} label="Action" value={c.yellow} />
            <SummaryChip color={STATUS_COLOR.green} label="Under control" value={c.green} />
            <HealthChip health={health} />
          </div>
        </div>

        {/* Portfolio table */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 64 }}><Loader2 size={22} className="animate-spin" style={{ color: "var(--text-dim)" }} /></div>
        ) : !data || data.total === 0 ? (
          <div style={{ ...card, padding: "44px 20px", textAlign: "center", color: "var(--text-muted)" }}>
            <Sprout size={26} style={{ color: "var(--accent)", marginBottom: 8 }} />
            <div style={{ fontWeight: 600, color: "var(--text-2)" }}>No accounts yet</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Add stores on the Stores screen to start.</div>
          </div>
        ) : (
          <>
            {data.withData === 0 && (
              <div style={{ marginBottom: 12, padding: "11px 15px", borderRadius: 12, fontSize: 12.5, color: "var(--text-3)", background: "var(--surface-2)", border: "1px dashed var(--border-2)", display: "flex", alignItems: "center", gap: 9 }}>
                <Activity size={15} style={{ color: "var(--text-dim)", flexShrink: 0 }} />
                No diagnostic data yet — run the back-fill (POST /api/diagnostics/ingest &#123;&quot;days&quot;:90&#125;) and the nightly signals, then the numbers fill in here.
              </div>
            )}
            <div style={{ ...card, overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 760 }}>
                <thead>
                  <tr style={{ color: "var(--text-muted)", textAlign: "right" }}>
                    <th style={{ textAlign: "left", padding: "11px 16px", fontWeight: 600 }}>Account</th>
                    <th style={{ padding: "11px 10px", fontWeight: 600 }}>Spend 7d</th>
                    <th style={{ padding: "11px 10px", fontWeight: 600 }}>POAS</th>
                    <th style={{ padding: "11px 10px", fontWeight: 600 }}>ROAS</th>
                    <th style={{ padding: "11px 10px", fontWeight: 600 }}>Orders</th>
                    <th style={{ textAlign: "left", padding: "11px 14px", fontWeight: 600 }}>Flag</th>
                    <th style={{ textAlign: "left", padding: "11px 14px", fontWeight: 600 }}>Owner</th>
                    <th style={{ padding: "11px 14px", fontWeight: 600 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {data.accounts.map(a => (
                    <tr key={a.id} style={{ borderTop: "1px solid var(--border)" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-2)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <td style={{ padding: "11px 16px" }}>
                        <Link href={`/diagnose/${a.id}`} style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 10 }}>
                          <span title={STATUS_LABEL[a.status]} style={{ width: 9, height: 9, borderRadius: "50%", background: STATUS_COLOR[a.status], flexShrink: 0, boxShadow: a.status === "red" ? "0 0 0 3px color-mix(in srgb, var(--danger) 20%, transparent)" : "none" }} />
                          <span style={{ minWidth: 0 }}>
                            <span style={{ fontWeight: 700, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 220 }}>{a.name}</span>
                            {a.clientName && <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{a.clientName}</span>}
                          </span>
                          {!a.dataVerified && a.hasData && <span title="not reconciled against real orders yet" style={{ fontSize: 10, color: "var(--text-dim)", border: "1px solid var(--border-2)", borderRadius: 5, padding: "1px 5px" }}>unverified</span>}
                        </Link>
                      </td>
                      <td style={{ padding: "11px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: "var(--text-2)" }}>{a.hasData ? money(a.spend) : "—"}</td>
                      <td style={{ padding: "11px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 600, color: a.poas != null ? (a.poas < 1 ? "var(--danger)" : "var(--accent)") : "var(--text-dim)" }}>{a.poas != null ? a.poas.toFixed(2) : "—"}</td>
                      <td style={{ padding: "11px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: "var(--text-3)" }}>{a.roas != null ? a.roas.toFixed(2) : "—"}</td>
                      <td style={{ padding: "11px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: "var(--text-3)" }}>{a.orders != null ? a.orders : "—"}</td>
                      <td style={{ padding: "11px 14px", maxWidth: 240 }}>
                        {a.reconciliationMismatch ? (
                          <span style={{ fontSize: 12, color: "var(--danger)", display: "inline-flex", alignItems: "center", gap: 5 }}><AlertTriangle size={12} /> Tracking mismatch</span>
                        ) : a.worstSignal ? (
                          <span style={{ fontSize: 12.5, color: a.worstSignal.severity === "red" ? "var(--danger)" : "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                            {a.worstSignal.title}{a.problemCount > 1 ? ` +${a.problemCount - 1}` : ""}
                          </span>
                        ) : a.opportunityCount > 0 ? (
                          <span style={{ fontSize: 12, color: "var(--accent)" }}>{a.opportunityCount} opportunity{a.opportunityCount === 1 ? "" : "s"}</span>
                        ) : a.hasData ? (
                          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>—</span>
                        ) : (
                          <span style={{ fontSize: 12, color: "var(--text-dim)" }}>awaiting data</span>
                        )}
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 12.5, color: "var(--text-3)" }}>{a.ownerName ?? <span style={{ color: "var(--text-dim)" }}>—</span>}</td>
                      <td style={{ padding: "11px 14px", textAlign: "right" }}>
                        <Link href={`/diagnose/${a.id}`} style={{ color: "var(--text-dim)", display: "inline-flex" }}><ArrowRight size={15} /></Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "var(--text-muted)", margin: "10px 4px 0", flexWrap: "wrap", gap: 8 }}>
              <span>{data.total} accounts · {data.withData} with data{data.unverified ? ` · ${data.unverified} unverified` : ""}</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><ShoppingBag size={12} /> {data.accounts.filter(a => a.shopifyConnected).length} Shopify connected</span>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function SummaryChip({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 12px", borderRadius: 10, background: "var(--surface)", border: "1px solid var(--border)" }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
      <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-0.4px" }}>{value}</span>
      <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{label}</span>
    </div>
  );
}

function HealthChip({ health }: { health: Health | null }) {
  if (!health) return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 10, background: "var(--surface)", border: "1px solid var(--border)", fontSize: 12, color: "var(--text-muted)" }}>
      <Loader2 size={12} className="animate-spin" /> Google Ads
    </div>
  );
  const ok = health.ok;
  return (
    <div title={ok ? `Live API OK · ${health.accountCount} accessible accounts` : (health.hint ?? health.error)}
      style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 10, fontSize: 12, fontWeight: 600,
        color: ok ? "var(--accent)" : "var(--danger)",
        background: ok ? "var(--accent-dim)" : "color-mix(in srgb, var(--danger) 10%, transparent)",
        border: `1px solid ${ok ? "color-mix(in srgb, var(--accent) 30%, transparent)" : "color-mix(in srgb, var(--danger) 30%, transparent)"}` }}>
      {ok ? <CheckCircle2 size={12} /> : <XCircle size={12} />} Google Ads{ok && health.accountCount != null ? ` · ${health.accountCount}` : ""}
    </div>
  );
}
