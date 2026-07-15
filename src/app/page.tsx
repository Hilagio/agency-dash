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
  Loader2, ArrowRight, Sprout, Activity, ShoppingBag, AlertTriangle, CheckCircle2, XCircle, Star, Sparkles,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

type Colour = "red" | "yellow" | "green" | "unknown";
interface Row {
  id: string; name: string; clientName: string | null; ownerName: string | null;
  status: Colour; hasData: boolean; watched: boolean;
  spend: number; roas: number | null; poas: number | null; orders: number | null;
  revenue: number | null; dataVerified: boolean; shopifyConnected: boolean;
  reconciliationMismatch: boolean;
  worstSignal: { title: string; severity: string } | null;
  problemCount: number; opportunityCount: number;
  briefing: string | null; briefingAt: string | null;
}
interface Portfolio {
  accounts: Row[];
  counts: Record<Colour, number>;
  total: number; unverified: number; withData: number; watchedCount: number;
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
const segBtn = (active: boolean): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600,
  padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer",
  background: active ? "var(--surface)" : "transparent",
  color: active ? "var(--text)" : "var(--text-3)",
  boxShadow: active ? "0 1px 3px rgba(0,0,0,0.10)" : "none",
});

export default function PortfolioHome() {
  const [name, setName] = useState<string | null>(null);
  const [data, setData] = useState<Portfolio | null>(null);
  const [health, setHealth] = useState<Health | null>(null);
  const [loading, setLoading] = useState(true);
  const [nowMs, setNowMs] = useState<number | null>(null);
  const [view, setView] = useState<"mine" | "all">("all");
  const [viewLoaded, setViewLoaded] = useState(false);
  const [busyWatch, setBusyWatch] = useState<Set<string>>(new Set());
  const [backfill, setBackfill] = useState<{ running: boolean; done: number; total: number }>({ running: false, done: 0, total: 0 });

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
      // Open on "My accounts" if the user has any, unless they've chosen otherwise.
      const saved = typeof window !== "undefined" ? window.localStorage.getItem("portfolioView") : null;
      setView(saved === "mine" || saved === "all" ? saved : (pf?.watchedCount ? "mine" : "all"));
      setViewLoaded(true);
      setLoading(false);
      // Health probe is independent (can be slow / fail) — load it after.
      fetch("/api/google-ads/health", { credentials: "include" }).then(r => r.json()).then(setHealth).catch(() => setHealth({ ok: false, error: "unreachable" }));
    })();
  }, []);

  function chooseView(v: "mine" | "all") {
    setView(v);
    if (typeof window !== "undefined") window.localStorage.setItem("portfolioView", v);
  }

  // One-time history load: pull data for every account, ONE AT A TIME so the app
  // never holds more than a single account's data in memory (concurrent pulls of
  // 90-day data OOM'd the process). The nightly cron keeps it fresh after this.
  async function backfillAll() {
    if (!data || backfill.running) return;
    const ids = data.accounts.map(a => a.id);
    setBackfill({ running: true, done: 0, total: ids.length });
    let done = 0;
    for (const id of ids) {
      try {
        await fetch(`/api/diagnostics/account/${id}/refresh`, {
          method: "POST", credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ days: 90 }),
        });
      } catch { /* keep going — one failure shouldn't stop the batch */ }
      done++;
      setBackfill(b => ({ ...b, done }));
    }
    // Freshly-pulled data → regenerate the morning briefings so the dash greets
    // the team with what it noticed, without waiting for the nightly run.
    await fetch("/api/diagnostics/briefings", { method: "POST", credentials: "include" }).catch(() => null);
    const pf = await fetch("/api/diagnostics/portfolio", { credentials: "include" }).then(r => r.ok ? r.json() : null).catch(() => null);
    if (pf) setData(pf);
    setBackfill({ running: false, done, total: ids.length });
  }

  async function toggleWatch(id: string, next: boolean) {
    setBusyWatch(prev => new Set(prev).add(id));
    // Optimistic update.
    setData(prev => prev && ({
      ...prev,
      accounts: prev.accounts.map(a => a.id === id ? { ...a, watched: next } : a),
      watchedCount: prev.watchedCount + (next ? 1 : -1),
    }));
    try {
      const r = await fetch("/api/me/watch", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId: id, watch: next }),
      });
      if (!r.ok) throw new Error();
    } catch {
      // Revert on failure.
      setData(prev => prev && ({
        ...prev,
        accounts: prev.accounts.map(a => a.id === id ? { ...a, watched: !next } : a),
        watchedCount: prev.watchedCount + (next ? -1 : 1),
      }));
    } finally {
      setBusyWatch(prev => { const n = new Set(prev); n.delete(id); return n; });
    }
  }

  const hour = nowMs != null ? new Date(nowMs).getHours() : 9;
  const partOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  const first = (name ?? "there").split(" ")[0];
  const c = data?.counts ?? { red: 0, yellow: 0, green: 0, unknown: 0 };
  const allAccounts = data?.accounts ?? [];
  const watchedCount = data?.watchedCount ?? 0;
  const visible = view === "mine" ? allAccounts.filter(a => a.watched) : allAccounts;

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
            {data && data.total > 0 && (
              <button onClick={backfillAll} disabled={backfill.running} title="Pull 90 days for every account"
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: backfill.running ? "default" : "pointer", color: backfill.running ? "var(--text-3)" : "var(--accent)", background: "var(--accent-dim)", border: "1px solid color-mix(in srgb, var(--accent) 30%, var(--border))" }}>
                {backfill.running ? <><Loader2 size={12} className="animate-spin" /> Backfilling {backfill.done}/{backfill.total}…</> : <><Activity size={12} /> Refresh all</>}
              </button>
            )}
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
              <div style={{ marginBottom: 12, padding: "12px 15px", borderRadius: 12, fontSize: 12.5, color: "var(--text-3)", background: "var(--surface-2)", border: "1px dashed var(--border-2)", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <Activity size={15} style={{ color: "var(--text-dim)", flexShrink: 0 }} />
                <span>No diagnostic data yet — pull 90 days for every account to fill the numbers in. After this, the nightly refresh keeps it current.</span>
                <button onClick={backfillAll} disabled={backfill.running} style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: backfill.running ? "default" : "pointer", color: "#fff", background: "var(--accent)", border: "none" }}>
                  {backfill.running ? <><Loader2 size={13} className="animate-spin" /> Backfilling {backfill.done}/{backfill.total}…</> : <>Backfill all accounts</>}
                </button>
              </div>
            )}
            {/* My accounts / All */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
              <div style={{ display: "inline-flex", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 10, padding: 3 }}>
                <button onClick={() => chooseView("mine")} style={segBtn(view === "mine")}>
                  <Star size={12} style={{ fill: view === "mine" ? "currentColor" : "none" }} /> My accounts{watchedCount ? ` · ${watchedCount}` : ""}
                </button>
                <button onClick={() => chooseView("all")} style={segBtn(view === "all")}>All · {data.total}</button>
              </div>
              {view === "mine" && watchedCount > 0 && <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>The accounts you work on, pinned here.</span>}
            </div>

            {/* Morning briefing (§agent) — what the platform noticed overnight,
                each line a conversation waiting to be opened. */}
            {(() => {
              const briefed = visible.filter(a => a.briefing && (a.status === "red" || a.status === "yellow"));
              if (!briefed.length) return null;
              return (
                <div style={{ ...card, padding: "14px 16px", marginBottom: 14, background: "linear-gradient(160deg, var(--accent-dim), transparent), var(--surface)", border: "1px solid color-mix(in srgb, var(--accent) 24%, var(--border))" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <Sparkles size={15} style={{ color: "var(--accent)" }} />
                    <span style={{ fontSize: 13, fontWeight: 700 }}>What I noticed{view === "mine" ? " on your accounts" : ""}</span>
                    <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{briefed.length} {briefed.length === 1 ? "account needs" : "accounts need"} a look — open one to dig in</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {briefed.map(a => (
                      <Link key={a.id} href={`/diagnose/${a.id}`} style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 11px", borderRadius: 9, background: "var(--surface)", border: "1px solid var(--border-2)" }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = "color-mix(in srgb, var(--accent) 40%, var(--border))")}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border-2)")}>
                        <span title={STATUS_LABEL[a.status]} style={{ width: 9, height: 9, borderRadius: "50%", background: STATUS_COLOR[a.status], flexShrink: 0, marginTop: 5 }} />
                        <span style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: 12.5, fontWeight: 700, marginRight: 7 }}>{a.name}</span>
                          <span style={{ fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.5 }}>{a.briefing}</span>
                        </span>
                        <ArrowRight size={14} style={{ color: "var(--text-dim)", flexShrink: 0, marginTop: 3 }} />
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })()}

            {view === "mine" && visible.length === 0 ? (
              <div style={{ ...card, padding: "40px 20px", textAlign: "center", color: "var(--text-muted)" }}>
                <Star size={24} style={{ color: "var(--accent)", marginBottom: 8 }} />
                <div style={{ fontWeight: 600, color: "var(--text-2)" }}>No accounts pinned yet</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>Switch to <button onClick={() => chooseView("all")} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: 13, padding: 0, textDecoration: "underline" }}>All accounts</button> and tap the star on the ones you manage.</div>
              </div>
            ) : (
            <div style={{ ...card, overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 760 }}>
                <thead>
                  <tr style={{ color: "var(--text-muted)", textAlign: "right" }}>
                    <th style={{ width: 34 }}></th>
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
                  {visible.map(a => (
                    <tr key={a.id} style={{ borderTop: "1px solid var(--border)" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-2)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <td style={{ padding: "11px 0 11px 14px", width: 34 }}>
                        <button title={a.watched ? "Unpin from My accounts" : "Pin to My accounts"} onClick={() => toggleWatch(a.id, !a.watched)} disabled={busyWatch.has(a.id)}
                          style={{ background: "none", border: "none", cursor: busyWatch.has(a.id) ? "default" : "pointer", display: "inline-flex", padding: 4, color: a.watched ? "#e0a92e" : "var(--text-dim)" }}>
                          <Star size={15} style={{ fill: a.watched ? "currentColor" : "none" }} />
                        </button>
                      </td>
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
            )}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "var(--text-muted)", margin: "10px 4px 0", flexWrap: "wrap", gap: 8 }}>
              <span>{view === "mine" ? `${visible.length} pinned` : `${data.total} accounts`} · {data.withData} with data{data.unverified ? ` · ${data.unverified} unverified` : ""}</span>
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
