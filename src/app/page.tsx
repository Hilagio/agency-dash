"use client";

/**
 * Portfolio cockpit — the one screen the team opens first.
 * Not a table to scan: the flagged accounts (from the nightly checks) surface
 * as cards up top — what's wrong, the numbers, one click into the read. Healthy
 * accounts collapse out of the way; opportunities get their own shelf.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck, Settings as SettingsIcon, ListChecks, BookOpen,
  Loader2, ArrowRight, Sprout, Activity, ShoppingBag, AlertTriangle, CheckCircle2, XCircle, Star, Sparkles,
  ChevronDown, TrendingUp, Plus,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

type Colour = "red" | "yellow" | "green" | "unknown";
interface Row {
  id: string; name: string; clientName: string | null; ownerName: string | null;
  status: Colour; hasData: boolean; watched: boolean; computedAt: string | null;
  spend: number; roas: number | null; poas: number | null; orders: number | null;
  revenue: number | null; dataVerified: boolean; hasOrderData: boolean; shopifyConnected: boolean;
  reconciliationMismatch: boolean;
  worstSignal: { title: string; severity: string } | null;
  problemCount: number; opportunityCount: number;
  briefing: string | null; briefingAt: string | null;
  worklist: WorklistItem | null;
}
interface WorklistItem { headline: string; action: string; minutes: number; skill: string; confidence: string; category: string }
interface Portfolio {
  accounts: Row[];
  counts: Record<Colour, number>;
  total: number; unverified: number; verified: number; noOrderData: number; withData: number; watchedCount: number;
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

// The one-line issue shown on a flagged card: the nightly briefing if we have
// it (the agent's own words), else the strongest signal, plainly.
function issueText(a: Row): string {
  if (a.briefing) return a.briefing;
  if (a.reconciliationMismatch) return "Tracking mismatch — Google Ads conversions don't match real orders. Fix before trusting the numbers.";
  if (a.worstSignal) return a.worstSignal.title + (a.problemCount > 1 ? ` · +${a.problemCount - 1} more` : "");
  if (!a.hasData) return "Awaiting data — pull to see what's happening.";
  return "Flagged — open to see what's going on.";
}

function relTime(iso: string | null): string {
  if (!iso) return "";
  const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? "yesterday" : `${d}d ago`;
}

export default function PortfolioHome() {
  const [name, setName] = useState<string | null>(null);
  const [data, setData] = useState<Portfolio | null>(null);
  const [health, setHealth] = useState<Health | null>(null);
  const [loading, setLoading] = useState(true);
  const [nowMs, setNowMs] = useState<number | null>(null);
  const [view, setView] = useState<"mine" | "all">("all");
  const [, setViewLoaded] = useState(false);
  const [busyWatch, setBusyWatch] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);
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
      const saved = typeof window !== "undefined" ? window.localStorage.getItem("portfolioView") : null;
      setView(saved === "mine" || saved === "all" ? saved : (pf?.watchedCount ? "mine" : "all"));
      setViewLoaded(true);
      setLoading(false);
      fetch("/api/google-ads/health", { credentials: "include" }).then(r => r.json()).then(setHealth).catch(() => setHealth({ ok: false, error: "unreachable" }));
    })();
  }, []);

  function chooseView(v: "mine" | "all") {
    setView(v);
    if (typeof window !== "undefined") window.localStorage.setItem("portfolioView", v);
  }

  // Pull 90 days for every account, a small pool at a time. Safe to parallelise
  // now that the memory-heavy per-row tables are capped to 30 days server-side —
  // the old OOM was from pulling 90 days of those; the 90-day window is now just
  // light campaign metrics. The nightly cron keeps it fresh after this.
  async function backfillAll() {
    if (!data || backfill.running) return;
    const ids = data.accounts.map(a => a.id);
    setBackfill({ running: true, done: 0, total: ids.length });
    const POOL = 4;
    let cursor = 0;
    async function worker() {
      while (cursor < ids.length) {
        const id = ids[cursor++];
        try {
          await fetch(`/api/diagnostics/account/${id}/refresh`, {
            method: "POST", credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ days: 90 }),
          });
        } catch { /* keep going — one failure shouldn't stop the batch */ }
        setBackfill(b => ({ ...b, done: b.done + 1 }));
      }
    }
    await Promise.all(Array.from({ length: POOL }, () => worker()));
    await fetch("/api/diagnostics/briefings", { method: "POST", credentials: "include" }).catch(() => null);
    await fetch("/api/diagnostics/worklist", { method: "POST", credentials: "include" }).catch(() => null);
    const pf = await fetch("/api/diagnostics/portfolio", { credentials: "include" }).then(r => r.ok ? r.json() : null).catch(() => null);
    if (pf) setData(pf);
    setBackfill({ running: false, done: ids.length, total: ids.length });
  }

  async function toggleWatch(id: string, next: boolean) {
    setBusyWatch(prev => new Set(prev).add(id));
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

  // Cockpit buckets (visible list is already sorted worst-first by the API).
  const flagged = visible.filter(a => a.status === "red" || a.status === "yellow");
  const opportunities = visible.filter(a => a.status === "green" && a.opportunityCount > 0);
  const calm = visible.filter(a => a.status === "green" && a.opportunityCount === 0);
  const awaiting = visible.filter(a => a.status === "unknown");

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <nav style={{
        display: "flex", alignItems: "center", gap: 16, height: 58, padding: "0 26px",
        position: "sticky", top: 0, zIndex: 9, background: "var(--header-bg)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 800, letterSpacing: "-0.4px", fontSize: 15 }}>
          <div style={{ width: 27, height: 27, borderRadius: 8, background: "linear-gradient(135deg, #33cc80, #1c8a52)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, boxShadow: "0 2px 10px rgba(51,204,128,0.4)" }}>E</div>
          Ecomtrada AI
        </div>
        <div style={{ display: "flex", gap: 2, marginLeft: 8 }}>
          <Link href="/" style={navLink(true)}>Cockpit</Link>
          <Link href="/ownership" style={navLink(false)}><ShieldCheck size={13} /> Ownership</Link>
          <Link href="/actions" style={navLink(false)}><ListChecks size={13} /> Actions</Link>
          <Link href="/audit" style={navLink(false)}><Sparkles size={13} /> Quick audit</Link>
          <Link href="/shopping" style={navLink(false)}><ShoppingBag size={13} /> Shopping</Link>
          <Link href="/sops" style={navLink(false)}><BookOpen size={13} /> SOPs</Link>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <ThemeToggle />
          <Link href="/settings" style={{ display: "flex", width: 32, height: 32, borderRadius: 8, border: "1px solid var(--border-2)", background: "var(--surface)", alignItems: "center", justifyContent: "center", color: "var(--text-3)" }} title="Settings">
            <SettingsIcon size={15} />
          </Link>
        </div>
      </nav>

      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "22px 26px 80px" }}>
        {/* Header: greeting + summary chips + health */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 18 }}>
          <div>
            <div style={eyebrow}>Cockpit · {nowMs ? new Date(nowMs).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }) : " "}</div>
            <h1 style={{ fontSize: 25, fontWeight: 800, letterSpacing: "-0.8px", margin: "6px 0 0" }}>
              Good {partOfDay}, <span style={{ color: "var(--accent)" }}>{first}</span> <Sprout size={20} style={{ verticalAlign: -2, color: "var(--accent)" }} />
            </h1>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <SummaryChip color={STATUS_COLOR.red} label="Immediate" value={c.red} />
            <SummaryChip color={STATUS_COLOR.yellow} label="Action" value={c.yellow} />
            <SummaryChip color={STATUS_COLOR.green} label="Under control" value={c.green} muted />
            <HealthChip health={health} />
            <Link href="/stores" title="Add or manage accounts" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 10, fontSize: 12, fontWeight: 600, textDecoration: "none", color: "var(--text-3)", background: "var(--surface)", border: "1px solid var(--border)" }}>
              <Plus size={12} /> Add accounts
            </Link>
            {data && data.total > 0 && (
              <button onClick={backfillAll} disabled={backfill.running} title="Pull 90 days for every account"
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: backfill.running ? "default" : "pointer", color: backfill.running ? "var(--text-3)" : "var(--accent)", background: "var(--accent-dim)", border: "1px solid color-mix(in srgb, var(--accent) 30%, var(--border))" }}>
                {backfill.running ? <><Loader2 size={12} className="animate-spin" /> Backfilling {backfill.done}/{backfill.total}…</> : <><Activity size={12} /> Refresh all</>}
              </button>
            )}
          </div>
        </div>

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
              <div style={{ marginBottom: 14, padding: "12px 15px", borderRadius: 12, fontSize: 12.5, color: "var(--text-3)", background: "var(--surface-2)", border: "1px dashed var(--border-2)", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <Activity size={15} style={{ color: "var(--text-dim)", flexShrink: 0 }} />
                <span>No diagnostic data yet — pull 90 days for every account to fill the numbers in. After this, the nightly refresh keeps it current.</span>
                <button onClick={backfillAll} disabled={backfill.running} style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: backfill.running ? "default" : "pointer", color: "#fff", background: "var(--accent)", border: "none" }}>
                  {backfill.running ? <><Loader2 size={13} className="animate-spin" /> Backfilling {backfill.done}/{backfill.total}…</> : <>Backfill all accounts</>}
                </button>
              </div>
            )}

            {/* My accounts / All */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <div style={{ display: "inline-flex", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 10, padding: 3 }}>
                <button onClick={() => chooseView("mine")} style={segBtn(view === "mine")}>
                  <Star size={12} style={{ fill: view === "mine" ? "currentColor" : "none" }} /> My accounts{watchedCount ? ` · ${watchedCount}` : ""}
                </button>
                <button onClick={() => chooseView("all")} style={segBtn(view === "all")}>All · {data.total}</button>
              </div>
            </div>

            {view === "mine" && visible.length === 0 ? (
              <div style={{ ...card, padding: "40px 20px", textAlign: "center", color: "var(--text-muted)" }}>
                <Star size={24} style={{ color: "var(--accent)", marginBottom: 8 }} />
                <div style={{ fontWeight: 600, color: "var(--text-2)" }}>No accounts pinned yet</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>Switch to <button onClick={() => chooseView("all")} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: 13, padding: 0, textDecoration: "underline" }}>All accounts</button> and tap the star on the ones you manage.</div>
              </div>
            ) : (
            <>
              {/* NEEDS ATTENTION — the flagged accounts, cockpit-style */}
              {flagged.length > 0 ? (
                <section style={{ marginBottom: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 11, flexWrap: "wrap" }}>
                    <AlertTriangle size={15} style={{ color: "var(--danger)" }} />
                    <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: "-0.3px" }}>Needs attention</span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{flagged.length} account{flagged.length === 1 ? "" : "s"} flagged by the nightly checks — worst first</span>
                    {(() => {
                      const withPlan = flagged.filter(a => a.worklist);
                      const mins = withPlan.reduce((s, a) => s + (a.worklist?.minutes ?? 0), 0);
                      if (!withPlan.length) return null;
                      return <span style={{ marginLeft: "auto", fontSize: 11.5, fontWeight: 600, color: "var(--accent)", background: "var(--accent-dim)", border: "1px solid color-mix(in srgb, var(--accent) 25%, var(--border))", borderRadius: 999, padding: "3px 11px" }}>Your day: {withPlan.length} action{withPlan.length === 1 ? "" : "s"} · ~{mins < 60 ? `${mins} min` : `${(mins / 60).toFixed(1)}h`}</span>;
                    })()}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    {flagged.map(a => <RadarCard key={a.id} a={a} busy={busyWatch.has(a.id)} onWatch={() => toggleWatch(a.id, !a.watched)} />)}
                  </div>
                </section>
              ) : (
                <section style={{ ...card, padding: "26px 20px", textAlign: "center", marginBottom: 18, background: "linear-gradient(160deg, var(--accent-dim), transparent), var(--surface)", border: "1px solid color-mix(in srgb, var(--accent) 22%, var(--border))" }}>
                  <CheckCircle2 size={24} style={{ color: "var(--accent)", marginBottom: 6 }} />
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Nothing on fire{view === "mine" ? " on your accounts" : ""}</div>
                  <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 3 }}>
                    {calm.length + opportunities.length} account{calm.length + opportunities.length === 1 ? "" : "s"} under control{awaiting.length ? ` · ${awaiting.length} awaiting data` : ""}. The nightly checks flag anything that slips.
                  </div>
                </section>
              )}

              {/* OPPORTUNITIES — healthy accounts with headroom */}
              {opportunities.length > 0 && (
                <section style={{ marginBottom: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 11 }}>
                    <TrendingUp size={15} style={{ color: "var(--accent)" }} />
                    <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: "-0.3px" }}>Opportunities</span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>healthy accounts with room to grow — bring these to the client</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {opportunities.map(a => (
                      <Link key={a.id} href={`/diagnose/${a.id}`} style={{ textDecoration: "none", color: "inherit", display: "inline-flex", alignItems: "center", gap: 9, padding: "9px 13px", borderRadius: 10, background: "var(--surface)", border: "1px solid var(--border)" }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = "color-mix(in srgb, var(--accent) 40%, var(--border))")}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)" }} />
                        <span style={{ fontWeight: 700, fontSize: 12.5 }}>{a.name}</span>
                        <span style={{ fontSize: 12, color: "var(--accent)" }}>{a.opportunityCount} {a.opportunityCount === 1 ? "opportunity" : "opportunities"}</span>
                        {a.poas != null && <span style={{ fontSize: 11.5, color: "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>POAS {a.poas.toFixed(2)}</span>}
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* EVERYTHING ELSE — the full list, collapsed by default when there's a fire */}
              <section>
                <button onClick={() => setShowAll(s => !s)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", background: "none", border: "none", cursor: "pointer", padding: "6px 2px", color: "var(--text-2)" }}>
                  <ChevronDown size={16} style={{ transform: showAll ? "none" : "rotate(-90deg)", transition: "transform .15s", color: "var(--text-dim)" }} />
                  <span style={{ fontSize: 13, fontWeight: 700 }}>All accounts</span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{visible.length} total · {calm.length} under control{awaiting.length ? ` · ${awaiting.length} awaiting data` : ""}</span>
                </button>
                {showAll && (
                  <div style={{ ...card, overflowX: "auto", marginTop: 10 }}>
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
                              <button title={a.watched ? "Unpin" : "Pin to My accounts"} onClick={() => toggleWatch(a.id, !a.watched)} disabled={busyWatch.has(a.id)}
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
                                {a.dataVerified && <span title="conversions reconcile with real orders" style={{ fontSize: 10, color: "var(--accent)", border: "1px solid color-mix(in srgb, var(--accent) 35%, var(--border-2))", borderRadius: 5, padding: "1px 5px" }}>verified</span>}
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
              </section>
            </>
            )}

            <div style={{ margin: "16px 4px 0" }}>
              {view !== "mine" && data.noOrderData > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-muted)", marginBottom: 10, padding: "9px 13px", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: 10 }}>
                  <ShieldCheck size={14} style={{ color: "var(--text-dim)", flexShrink: 0 }} />
                  <span>{data.noOrderData} account{data.noOrderData === 1 ? "" : "s"} have no order data — connect Shopify or upload a sales CSV to verify their conversions against real orders.</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "var(--text-muted)", flexWrap: "wrap", gap: 8 }}>
                <span>{view === "mine" ? `${visible.length} pinned` : `${data.total} accounts`} · {data.withData} with data{data.verified ? ` · ${data.verified} verified` : ""}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><ShoppingBag size={12} /> {data.accounts.filter(a => a.shopifyConnected).length} Shopify connected</span>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function RadarCard({ a, busy, onWatch }: { a: Row; busy: boolean; onWatch: () => void }) {
  const red = a.status === "red";
  return (
    <div style={{
      ...card, position: "relative", padding: "13px 15px",
      borderColor: red ? "color-mix(in srgb, var(--danger) 45%, var(--border))" : "color-mix(in srgb, var(--accent-2) 40%, var(--border))",
      background: red ? "linear-gradient(160deg, color-mix(in srgb, var(--danger) 7%, transparent), transparent), var(--surface)" : "var(--surface)",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <span title={STATUS_LABEL[a.status]} style={{ width: 10, height: 10, borderRadius: "50%", background: STATUS_COLOR[a.status], flexShrink: 0, marginTop: 4, boxShadow: red ? "0 0 0 4px color-mix(in srgb, var(--danger) 18%, transparent)" : "none" }} />
        <Link href={`/diagnose/${a.id}`} style={{ textDecoration: "none", color: "inherit", flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: "-0.3px" }}>{a.name}</span>
            {a.clientName && <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{a.clientName}</span>}
            <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4, color: red ? "var(--danger)" : "var(--accent-2)" }}>{STATUS_LABEL[a.status]}</span>
            {a.briefingAt && <span style={{ fontSize: 11, color: "var(--text-dim)" }}>· noticed {relTime(a.briefingAt)}</span>}
          </div>
          <div style={{ fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.5, marginTop: 4 }}>{issueText(a)}</div>
          {a.worklist && (
            <div style={{ marginTop: 8, padding: "8px 11px", borderRadius: 9, background: "var(--accent-dim)", border: "1px solid color-mix(in srgb, var(--accent) 22%, var(--border))" }}>
              <div style={{ fontSize: 12.5, color: "var(--text)", lineHeight: 1.45 }}><strong style={{ color: "var(--accent)" }}>Next:</strong> {a.worklist.action}</div>
              <div style={{ display: "flex", gap: 7, marginTop: 6, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--text-2)", background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 6, padding: "2px 7px" }}>~{a.worklist.minutes} min</span>
                {a.worklist.skill && a.worklist.skill !== "none" && (
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: a.worklist.skill === "off-platform" ? "var(--danger, #dc2626)" : "var(--accent)", background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 6, padding: "2px 7px", fontFamily: a.worklist.skill.startsWith("/") ? "ui-monospace, monospace" : "inherit" }}>{a.worklist.skill === "off-platform" ? "off-platform (client)" : a.worklist.skill}</span>
                )}
                <span style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.3 }}>{a.worklist.confidence} confidence</span>
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: 16, marginTop: 9, flexWrap: "wrap" }}>
            {a.hasData && <Stat label="Spend 7d" value={money(a.spend)} />}
            {a.poas != null && <Stat label="POAS" value={a.poas.toFixed(2)} danger={a.poas < 1} />}
            {a.roas != null && <Stat label="ROAS" value={a.roas.toFixed(2)} />}
            {a.orders != null && <Stat label="Orders" value={String(a.orders)} />}
          </div>
        </Link>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <button title={a.watched ? "Unpin" : "Pin to My accounts"} onClick={onWatch} disabled={busy}
            style={{ background: "none", border: "none", cursor: busy ? "default" : "pointer", display: "inline-flex", padding: 2, color: a.watched ? "#e0a92e" : "var(--text-dim)" }}>
            <Star size={15} style={{ fill: a.watched ? "currentColor" : "none" }} />
          </button>
          <Link href={`/diagnose/${a.id}`} title="Open the read" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 8, background: red ? "var(--danger)" : "var(--accent)", color: "#fff" }}>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", lineHeight: 1.25 }}>
      <span style={{ fontSize: 13.5, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: danger ? "var(--danger)" : "var(--text)" }}>{value}</span>
      <span style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</span>
    </span>
  );
}

function SummaryChip({ color, label, value, muted }: { color: string; label: string; value: number; muted?: boolean }) {
  // Quiet by default: the "all fine" bucket gets a neutral grey dot so the
  // red/amber counts are what draw the eye.
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 12px", borderRadius: 10, background: "var(--surface)", border: "1px solid var(--border)" }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: muted ? "var(--text-dim)" : color }} />
      <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-0.4px", color: muted ? "var(--text-3)" : "var(--text)" }}>{value}</span>
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
  // Quiet when healthy: a neutral pill, not a filled green one. Colour (red) only
  // appears when the Google Ads API is actually failing.
  return (
    <div title={ok ? `Live API OK · ${health.accountCount} accessible accounts` : (health.hint ?? health.error)}
      style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 10, fontSize: 12, fontWeight: 600,
        color: ok ? "var(--text-muted)" : "var(--danger)",
        background: ok ? "var(--surface)" : "color-mix(in srgb, var(--danger) 10%, transparent)",
        border: `1px solid ${ok ? "var(--border)" : "color-mix(in srgb, var(--danger) 30%, transparent)"}` }}>
      {ok ? <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--text-dim)", flexShrink: 0 }} /> : <XCircle size={12} />} Google Ads{ok && health.accountCount != null ? ` · ${health.accountCount}` : ""}
    </div>
  );
}
