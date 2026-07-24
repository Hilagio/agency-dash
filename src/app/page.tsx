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
  Loader2, ArrowRight, Sprout, Activity, ShoppingBag, AlertTriangle, CheckCircle2, XCircle, Star, Sparkles, RefreshCw,
  ChevronDown, TrendingUp, Plus, Search, EyeOff, LogOut, UserPlus,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AccountImporter } from "@/components/AccountImporter";

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
  worklistDoneAt: string | null;
}
interface WorklistItem { headline: string; action: string; minutes: number; skill: string; confidence: string; category: string }
interface HiddenAccount { id: string; name: string; clientName: string | null; reason: "archived" | "inactive" }
interface SyncIssues { skipped: { page: string; reason: string }[]; errors: string[]; at: string | null }
interface MccMissing { count: number; names: string[]; syncedAt: string | null }
interface JoinRequest { id: string; email: string; name: string | null }
interface Workspace { main: { id: string; name: string; accounts: number; isCurrent: boolean; isMember: boolean } | null; myRole: string | null; joinRequestStatus: string | null }
interface Portfolio {
  accounts: Row[];
  hidden?: HiddenAccount[];
  syncIssues?: SyncIssues | null;
  mccMissing?: MccMissing | null;
  myRole?: string | null;
  joinRequests?: JoinRequest[];
  pendingJoinCount?: number;
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
  const [showDone, setShowDone] = useState(false);
  const [openRows, setOpenRows] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [unarchiving, setUnarchiving] = useState<Set<string>>(new Set());
  const [importOpen, setImportOpen] = useState(false);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [wsBusy, setWsBusy] = useState(false);
  // Invite a teammate by email — logging in with that email IS accepting.
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"SPECIALIST" | "ADMIN">("SPECIALIST");
  const [inviteBusy, setInviteBusy] = useState(false);
  const [inviteMsg, setInviteMsg] = useState<string | null>(null);

  async function sendInvite() {
    const email = inviteEmail.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || inviteBusy) return;
    setInviteBusy(true); setInviteMsg(null);
    try {
      const r = await fetch("/api/org/invites", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: inviteRole }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { setInviteMsg(j.error ?? "Couldn't create the invite."); return; }
      setInviteMsg(`${email} is invited — the moment they sign in with that Google account, they're in this workspace${inviteRole === "ADMIN" ? " as admin" : ""}. Already signed in? They just sign out and back in once.`);
      setInviteEmail("");
    } finally { setInviteBusy(false); }
  }

  // Ask to join the team workspace / switch into it once approved.
  async function requestJoin() {
    setWsBusy(true);
    try {
      await fetch("/api/org/join-request", { method: "POST", credentials: "include" });
      const ws = await fetch("/api/org/workspace", { credentials: "include" }).then(r => r.ok ? r.json() : null).catch(() => null);
      if (ws) setWorkspace(ws);
    } finally { setWsBusy(false); }
  }
  async function switchToMain() {
    if (!workspace?.main) return;
    setWsBusy(true);
    try {
      const r = await fetch("/api/org/switch", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId: workspace.main.id }),
      });
      if (r.ok) window.location.reload();
    } finally { setWsBusy(false); }
  }
  async function decideJoin(requestId: string, approve: boolean) {
    await fetch("/api/org/join-request", {
      method: "PATCH", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, approve }),
    }).catch(() => null);
    await reloadPortfolio();
  }

  async function reloadPortfolio() {
    const pf = await fetch("/api/diagnostics/portfolio", { credentials: "include" }).then(x => x.ok ? x.json() : null).catch(() => null);
    if (pf) setData(pf);
  }

  // Freshly imported accounts have no data yet (status "unknown", buried in the
  // collapsed list) — kick their first pull immediately and open the full list
  // so they're visibly THERE, then reload once statuses land.
  async function onAccountsImported(_importedIds: string[]) {
    setShowAll(true);
    if (view === "mine") chooseView("all");
    const pf: Portfolio | null = await fetch("/api/diagnostics/portfolio", { credentials: "include" }).then(x => x.ok ? x.json() : null).catch(() => null);
    if (pf) setData(pf);
    // Pull first data for every account that has none yet (covers the imports).
    const queue = (pf?.accounts ?? []).filter(r => !r.hasData).map(r => r.id);
    const worker = async () => {
      for (;;) {
        const id = queue.shift();
        if (!id) return;
        await fetch(`/api/diagnostics/account/${id}/refresh`, {
          method: "POST", credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ days: 30 }),
        }).catch(() => null);
      }
    };
    await Promise.all(Array.from({ length: 4 }, () => worker()));
    await reloadPortfolio();
  }

  // Bring an archived account back into the cockpit, then refresh the list.
  async function unarchive(id: string) {
    setUnarchiving(prev => new Set(prev).add(id));
    try {
      const r = await fetch(`/api/accounts/${id}`, {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archived: false }),
      });
      if (r.ok) {
        const pf = await fetch("/api/diagnostics/portfolio", { credentials: "include" }).then(x => x.ok ? x.json() : null).catch(() => null);
        if (pf) setData(pf);
      }
    } finally {
      setUnarchiving(prev => { const n = new Set(prev); n.delete(id); return n; });
    }
  }

  // Tick / untick an account's worklist action — optimistic, reverts on failure.
  async function toggleDone(id: string, next: boolean) {
    const stamp = next ? new Date().toISOString() : null;
    setData(prev => prev && ({ ...prev, accounts: prev.accounts.map(a => a.id === id ? { ...a, worklistDoneAt: stamp } : a) }));
    try {
      const r = await fetch(`/api/accounts/${id}/worklist-done`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" }, body: JSON.stringify({ done: next, source: "cockpit" }),
      });
      if (!r.ok) throw new Error();
    } catch {
      setData(prev => prev && ({ ...prev, accounts: prev.accounts.map(a => a.id === id ? { ...a, worklistDoneAt: next ? null : a.worklistDoneAt } : a) }));
    }
  }
  const toggleOpen = (id: string) => setOpenRows(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
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
      fetch("/api/org/workspace", { credentials: "include" }).then(r => r.ok ? r.json() : null).then(async (ws: Workspace | null) => {
        if (!ws) return;
        // The team workspace IS the default. A member whose session is parked
        // in another org (personal org from onboarding, stale cookie) gets
        // switched over automatically — once per tab, so a deliberate switch
        // elsewhere isn't fought on every load.
        if (ws.main && !ws.main.isCurrent && ws.main.isMember && !window.sessionStorage.getItem("wsAutoSwitched")) {
          window.sessionStorage.setItem("wsAutoSwitched", "1");
          const r = await fetch("/api/org/switch", {
            method: "POST", credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ organizationId: ws.main.id }),
          }).catch(() => null);
          if (r?.ok) { window.location.reload(); return; }
        }
        setWorkspace(ws);
      }).catch(() => null);
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

  // Stray-user rescue: this session isn't in the team workspace (the org
  // holding the client accounts). Offer the way home: switch if already a
  // member, otherwise request access from an admin. Rendered BOTH in the
  // normal cockpit and in the zero-accounts empty state — the empty state is
  // exactly where stray users land.
  const workspaceBanner = workspace?.main && !workspace.main.isCurrent ? (
    <div style={{ ...card, border: "1px solid color-mix(in srgb, var(--accent) 40%, var(--border))", padding: "14px 18px", marginBottom: 14, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
      <ShieldCheck size={16} style={{ color: "var(--accent)", flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.5, flex: 1, minWidth: 220 }}>
        <b>This isn&rsquo;t the team workspace.</b> The Ecomtrada workspace &ldquo;{workspace.main.name}&rdquo; holds {workspace.main.accounts} client accounts — that&rsquo;s where the team works together.
      </span>
      {workspace.main.isMember ? (
        <button onClick={switchToMain} disabled={wsBusy} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "#fff", background: "var(--btn-primary, var(--accent))", border: "none", borderRadius: 9, padding: "8px 15px", cursor: wsBusy ? "default" : "pointer" }}>
          {wsBusy ? <Loader2 size={13} className="animate-spin" /> : null} Switch to team workspace
        </button>
      ) : workspace.joinRequestStatus === "pending" ? (
        <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--accent-2)" }}>Access requested — waiting for an admin to approve.</span>
      ) : (
        <button onClick={requestJoin} disabled={wsBusy} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "#fff", background: "var(--btn-primary, var(--accent))", border: "none", borderRadius: 9, padding: "8px 15px", cursor: wsBusy ? "default" : "pointer" }}>
          {wsBusy ? <Loader2 size={13} className="animate-spin" /> : null} Request access
        </button>
      )}
    </div>
  ) : null;

  const hour = nowMs != null ? new Date(nowMs).getHours() : 9;
  const partOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  const first = (name ?? "there").split(" ")[0];
  const c = data?.counts ?? { red: 0, yellow: 0, green: 0, unknown: 0 };
  const allAccounts = data?.accounts ?? [];
  const watchedCount = data?.watchedCount ?? 0;
  // Search cuts across the My/All toggle — when you're looking for a specific
  // account, "it's not pinned" shouldn't make it invisible.
  const q = query.trim().toLowerCase();
  const matches = (name: string, client?: string | null, owner?: string | null) =>
    name.toLowerCase().includes(q) || (client ?? "").toLowerCase().includes(q) || (owner ?? "").toLowerCase().includes(q);
  const visible = q
    ? allAccounts.filter(a => matches(a.name, a.clientName, a.ownerName))
    : view === "mine" ? allAccounts.filter(a => a.watched) : allAccounts;
  const hiddenMatches = q ? (data?.hidden ?? []).filter(h => matches(h.name, h.clientName)) : [];

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
          <a href="/api/auth/signout" title={`Sign out${name ? ` (${name})` : ""}`} style={{ display: "flex", width: 32, height: 32, borderRadius: 8, border: "1px solid var(--border-2)", background: "var(--surface)", alignItems: "center", justifyContent: "center", color: "var(--text-3)" }}>
            <LogOut size={15} />
          </a>
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
            {/* One combined triage bar — the three counts in a single element so
                the red/amber lead the eye instead of three competing boxes. */}
            <div style={{ display: "inline-flex", alignItems: "stretch", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
              {[
                { color: STATUS_COLOR.red, value: c.red, label: "immediate", strong: true },
                { color: STATUS_COLOR.yellow, value: c.yellow, label: "action", strong: true },
                { color: "var(--text-dim)", value: c.green, label: "ok", strong: false },
              ].map((s, i) => (
                <div key={s.label} title={`${s.value} ${s.label}`} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 13px", borderLeft: i ? "1px solid var(--border)" : "none" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-0.4px", color: s.strong ? "var(--text)" : "var(--text-3)" }}>{s.value}</span>
                  <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{s.label}</span>
                </div>
              ))}
            </div>
            <HealthChip health={health} />
            {/* Utility actions — quiet, icon-only so they don't compete with triage. */}
            {(data?.myRole === "OWNER" || data?.myRole === "ADMIN") && (
              <>
                <button onClick={() => setImportOpen(true)} title="Add accounts — pick them straight from the Google Ads MCC" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 10, cursor: "pointer", color: "var(--text-3)", background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <Plus size={15} />
                </button>
                <button onClick={() => { setInviteOpen(true); setInviteMsg(null); }} title="Invite a teammate into this workspace" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 34, padding: "0 13px", gap: 6, borderRadius: 10, cursor: "pointer", fontSize: 12.5, fontWeight: 700, color: "var(--text-3)", background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <UserPlus size={14} /> Invite
                </button>
              </>
            )}
            {data && data.total > 0 && (
              <button onClick={backfillAll} disabled={backfill.running} title="Refresh all — pull 90 days for every account"
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, height: 34, width: backfill.running ? "auto" : 34, padding: backfill.running ? "0 12px" : 0, borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: backfill.running ? "default" : "pointer", color: backfill.running ? "var(--text-3)" : "var(--text-3)", background: "var(--surface)", border: "1px solid var(--border)" }}>
                {backfill.running ? <><Loader2 size={13} className="animate-spin" /> {backfill.done}/{backfill.total}</> : <RefreshCw size={15} />}
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
              <span className="skeleton" style={{ width: 16, height: 16, borderRadius: 4 }} />
              <span className="skeleton" style={{ width: 130, height: 13 }} />
              <span className="skeleton" style={{ width: 200, height: 11 }} />
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ ...card, padding: "16px 18px", opacity: 1 - i * 0.16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 11 }}>
                  <span className="skeleton" style={{ width: 9, height: 9, borderRadius: "50%" }} />
                  <span className="skeleton" style={{ width: 130, height: 14 }} />
                  <span className="skeleton" style={{ width: 74, height: 11, borderRadius: 999 }} />
                </div>
                <span className="skeleton" style={{ display: "block", width: "92%", height: 11, marginBottom: 6 }} />
                <span className="skeleton" style={{ display: "block", width: "78%", height: 11, marginBottom: 14 }} />
                <div style={{ display: "flex", gap: 22 }}>
                  <span className="skeleton" style={{ width: 60, height: 20 }} />
                  <span className="skeleton" style={{ width: 44, height: 20 }} />
                </div>
              </div>
            ))}
          </div>
        ) : !data || data.total === 0 ? (
          <>
            {workspaceBanner}
            <div style={{ ...card, padding: "44px 20px", textAlign: "center", color: "var(--text-muted)" }}>
              <Sprout size={26} style={{ color: "var(--accent)", marginBottom: 8 }} />
              <div style={{ fontWeight: 600, color: "var(--text-2)" }}>
                {workspaceBanner ? "Your accounts live in the team workspace" : "No accounts yet"}
              </div>
              <div style={{ fontSize: 13, marginTop: 4 }}>
                {workspaceBanner
                  ? "Use the banner above to switch into it (or request access) — everything the team manages is there."
                  : "Add them straight from the Google Ads MCC with the + button above."}
              </div>
            </div>
          </>
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

            {/* The Notion sync report is deliberately NOT shown here — accounts
                come from the MCC now and Notion is optional enrichment; its
                issues live in Settings next to the sync button, not on the
                cockpit's front door. */}

            {/* Stray-user rescue (also rendered in the zero-accounts state). */}
            {workspaceBanner}

            {/* Pending requests exist but this user can't approve them — say so
                instead of hiding them (an invisible stuck request is a bug report). */}
            {(data.pendingJoinCount ?? 0) > 0 && (data.joinRequests?.length ?? 0) === 0 && (
              <div style={{ ...card, border: "1px solid color-mix(in srgb, var(--accent-2) 40%, var(--border))", padding: "12px 16px", marginBottom: 14, fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.55 }}>
                <b>{data.pendingJoinCount} access request{data.pendingJoinCount === 1 ? "" : "s"} pending for this workspace</b> — but your role here is {data.myRole ?? "not set"}, and only an OWNER or ADMIN can approve. Ask an admin, or if you should be the owner of this workspace, sign out and back in once (ownerless workspaces self-heal on login).
              </div>
            )}

            {/* Pending join requests — one-click approval for OWNER/ADMIN. */}
            {(data.joinRequests?.length ?? 0) > 0 && (
              <div style={{ ...card, border: "1px solid color-mix(in srgb, var(--accent) 40%, var(--border))", padding: "12px 16px", marginBottom: 14 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>Access requests for this workspace</div>
                {data.joinRequests!.map(r => (
                  <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, color: "var(--text-2)" }}>{r.name ?? r.email}<span style={{ color: "var(--text-muted)", fontSize: 11.5 }}> · {r.email}</span></span>
                    <span style={{ marginLeft: "auto" }} />
                    <button onClick={() => decideJoin(r.id, true)} style={{ fontSize: 12, fontWeight: 700, color: "#fff", background: "var(--btn-primary, var(--accent))", border: "none", borderRadius: 7, padding: "5px 12px", cursor: "pointer" }}>Approve as teammate</button>
                    <button onClick={() => decideJoin(r.id, false)} style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: 7, padding: "5px 12px", cursor: "pointer" }}>Deny</button>
                  </div>
                ))}
              </div>
            )}

            {/* Accounts that live in the Google Ads MCC but not in the system —
                the gap between "what exists" and "what we watch", one click to close.
                Adding accounts is an admin call, so members don't see the banner. */}
            {(data.myRole === "OWNER" || data.myRole === "ADMIN") && data.mccMissing && data.mccMissing.count > 0 && (
              <div style={{ ...card, border: "1px solid color-mix(in srgb, var(--accent) 35%, var(--border))", padding: "12px 16px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <Plus size={15} style={{ color: "var(--accent)", flexShrink: 0 }} />
                <span style={{ fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.5 }}>
                  <b>{data.mccMissing.count} account{data.mccMissing.count === 1 ? "" : "s"} in the Google Ads MCC {data.mccMissing.count === 1 ? "isn't" : "aren't"} in the system yet</b>
                  {data.mccMissing.names.length > 0 && <span style={{ color: "var(--text-muted)" }}> — {data.mccMissing.names.join(", ")}{data.mccMissing.count > data.mccMissing.names.length ? "…" : ""}</span>}
                </span>
                <button onClick={() => setImportOpen(true)} style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: "#fff", background: "var(--btn-primary, var(--accent))", border: "none", borderRadius: 8, padding: "6px 13px", cursor: "pointer", flexShrink: 0 }}>
                  Review &amp; add
                </button>
              </div>
            )}

            {/* My accounts / All + search */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <div style={{ display: "inline-flex", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 10, padding: 3 }}>
                <button onClick={() => chooseView("mine")} style={segBtn(view === "mine")}>
                  <Star size={12} style={{ fill: view === "mine" ? "currentColor" : "none" }} /> My accounts{watchedCount ? ` · ${watchedCount}` : ""}
                </button>
                <button onClick={() => chooseView("all")} style={segBtn(view === "all")}>All · {data.total}</button>
              </div>
              <div style={{ position: "relative", flex: "1 1 220px", maxWidth: 340, marginLeft: "auto" }}>
                <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)", pointerEvents: "none" }} />
                <input
                  value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="Search accounts…"
                  style={{ width: "100%", fontSize: 13, padding: "8px 30px 8px 32px", borderRadius: 10, border: "1px solid var(--border-2)", background: "var(--surface)", color: "var(--text)", fontFamily: "inherit" }}
                />
                {query && (
                  <button onClick={() => setQuery("")} title="Clear search" style={{ position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", padding: 2, display: "inline-flex" }}>
                    <XCircle size={14} />
                  </button>
                )}
              </div>
            </div>

            {q && visible.length === 0 && hiddenMatches.length === 0 ? (
              <div style={{ ...card, padding: "36px 20px", textAlign: "center", color: "var(--text-muted)" }}>
                <Search size={22} style={{ marginBottom: 8, color: "var(--text-dim)" }} />
                <div style={{ fontWeight: 600, color: "var(--text-2)" }}>No account matches &ldquo;{query.trim()}&rdquo;</div>
                <div style={{ fontSize: 12.5, marginTop: 5, lineHeight: 1.6 }}>
                  Hidden (archived / Notion-inactive) accounts would show here too — so this account isn&rsquo;t in the system yet.
                  It comes in via the Notion Stores database: status <b>Active</b> + a filled <b>Google Ads Customer ID</b>, synced nightly.
                </div>
              </div>
            ) : !q && view === "mine" && visible.length === 0 ? (
              <div style={{ ...card, padding: "40px 20px", textAlign: "center", color: "var(--text-muted)" }}>
                <Star size={24} style={{ color: "var(--accent)", marginBottom: 8 }} />
                <div style={{ fontWeight: 600, color: "var(--text-2)" }}>No accounts pinned yet</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>Switch to <button onClick={() => chooseView("all")} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: 13, padding: 0, textDecoration: "underline" }}>All accounts</button> and tap the star on the ones you manage.</div>
              </div>
            ) : (
            <>
              {/* TODAY'S ACTIONS — the flagged accounts as a checkable to-do list.
                  One line per account: tick it off when handled; the reasoning
                  paragraph stays behind the chevron for whoever wants it. */}
              {q && flagged.length === 0 ? null : flagged.length > 0 ? (
                <section style={{ marginBottom: 18 }}>
                  {(() => {
                    const todo = flagged.filter(a => !a.worklistDoneAt);
                    const done = flagged.filter(a => !!a.worklistDoneAt);
                    const mins = todo.reduce((s, a) => s + (a.worklist?.minutes ?? 0), 0);
                    return (
                      <>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 11, flexWrap: "wrap" }}>
                          <ListChecks size={15} style={{ color: "var(--danger)" }} />
                          <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: "-0.3px" }}>Today&rsquo;s actions</span>
                          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{todo.length} open · worst first{mins ? ` · ~${mins < 60 ? `${mins} min` : `${(mins / 60).toFixed(1)}h`}` : ""}</span>
                          {done.length > 0 && (
                            <button onClick={() => setShowDone(s => !s)} style={{ marginLeft: "auto", fontSize: 11.5, fontWeight: 600, color: "var(--accent)", background: "var(--accent-dim)", border: "1px solid color-mix(in srgb, var(--accent) 25%, var(--border))", borderRadius: 999, padding: "3px 11px", cursor: "pointer" }}>
                              ✓ {done.length} done today{showDone ? " — hide" : ""}
                            </button>
                          )}
                        </div>
                        <div style={{ ...card, overflow: "hidden" }}>
                          {todo.map((a, i) => (
                            <ActionRow key={a.id} a={a} first={i === 0} open={openRows.has(a.id)}
                              onToggleOpen={() => toggleOpen(a.id)} onDone={() => toggleDone(a.id, true)} />
                          ))}
                          {todo.length === 0 && (
                            <div style={{ padding: "22px 18px", textAlign: "center", fontSize: 13, color: "var(--text-muted)" }}>
                              <CheckCircle2 size={18} style={{ color: "var(--accent)", verticalAlign: -4, marginRight: 7 }} />
                              All actions ticked off — nice. The nightly checks bring tomorrow&rsquo;s list.
                            </div>
                          )}
                        </div>
                        {showDone && done.length > 0 && (
                          <div style={{ ...card, overflow: "hidden", marginTop: 8, opacity: 0.75 }}>
                            {done.map((a, i) => (
                              <ActionRow key={a.id} a={a} first={i === 0} done open={openRows.has(a.id)}
                                onToggleOpen={() => toggleOpen(a.id)} onDone={() => toggleDone(a.id, false)} />
                            ))}
                          </div>
                        )}
                      </>
                    );
                  })()}
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
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{visible.length} {q ? "matching" : "total"} · {calm.length} under control{awaiting.length ? ` · ${awaiting.length} awaiting data` : ""}</span>
                </button>
                {(showAll || !!q) && (
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

              {/* HIDDEN MATCHES — accounts that exist but are filtered out of the
                  cockpit. Only surfaced by search: the answer to "where did
                  account X go" with the reason and, where possible, the fix. */}
              {hiddenMatches.length > 0 && (
                <section style={{ marginTop: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8, color: "var(--text-muted)", fontSize: 12.5, fontWeight: 700 }}>
                    <EyeOff size={13} /> Hidden accounts matching your search
                  </div>
                  <div style={{ ...card, overflow: "hidden", opacity: 0.85 }}>
                    {hiddenMatches.map((h, i) => (
                      <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", borderTop: i ? "1px solid var(--border)" : "none", fontSize: 13 }}>
                        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--text-dim)", flexShrink: 0 }} />
                        <span style={{ fontWeight: 700 }}>{h.name}</span>
                        {h.clientName && <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{h.clientName}</span>}
                        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: 6, padding: "2px 8px" }}>
                          {h.reason === "archived" ? "archived here" : "inactive in Notion"}
                        </span>
                        <span style={{ marginLeft: "auto" }} />
                        {h.reason === "archived" ? (
                          <button onClick={() => unarchive(h.id)} disabled={unarchiving.has(h.id)}
                            style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: "var(--accent)", background: "var(--accent-dim)", border: "1px solid color-mix(in srgb, var(--accent) 30%, var(--border))", borderRadius: 7, padding: "5px 12px", cursor: unarchiving.has(h.id) ? "default" : "pointer" }}>
                            {unarchiving.has(h.id) ? <Loader2 size={12} className="animate-spin" /> : null} Bring back
                          </button>
                        ) : (
                          <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>Set its Status to &ldquo;Active&rdquo; in the Notion Stores database — it returns on the next sync.</span>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
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

      {/* Invite a teammate — type the email, done. Signing in with that email
          IS accepting: no link to share, no request/approve dance. */}
      {inviteOpen && (
        <div onClick={() => setInviteOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "12vh 16px 40px" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 16, width: "100%", maxWidth: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.4)", padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 15, fontWeight: 700 }}>Invite a teammate</span>
              <button onClick={() => setInviteOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 4 }}><XCircle size={17} /></button>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-faint)", marginBottom: 12 }}>They log in with this Google account and land straight in this workspace — nothing else needed.</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && sendInvite()}
                placeholder="name@company.com" type="email" autoFocus
                style={{ flex: "1 1 200px", fontSize: 13, padding: "9px 12px", borderRadius: 9, border: "1px solid var(--border-2)", background: "var(--surface)", color: "var(--text)", fontFamily: "inherit" }} />
              <div style={{ display: "inline-flex", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 9, padding: 3 }}>
                {(["SPECIALIST", "ADMIN"] as const).map(r => (
                  <button key={r} onClick={() => setInviteRole(r)} style={{ fontSize: 11.5, fontWeight: 700, padding: "5px 11px", borderRadius: 7, border: "none", cursor: "pointer", background: inviteRole === r ? "var(--surface)" : "transparent", color: inviteRole === r ? "var(--text)" : "var(--text-3)" }}>
                    {r === "SPECIALIST" ? "Teammate" : "Admin"}
                  </button>
                ))}
              </div>
              <button onClick={sendInvite} disabled={inviteBusy} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "#fff", background: "var(--btn-primary, var(--accent))", border: "none", borderRadius: 9, padding: "9px 16px", cursor: inviteBusy ? "default" : "pointer" }}>
                {inviteBusy ? <Loader2 size={13} className="animate-spin" /> : <UserPlus size={13} />} Invite
              </button>
            </div>
            {inviteMsg && <div style={{ marginTop: 10, fontSize: 12.5, color: inviteMsg.includes("invited") ? "var(--accent)" : "var(--danger)", lineHeight: 1.5 }}>{inviteMsg}</div>}
          </div>
        </div>
      )}

      {/* Import accounts straight from the Google Ads MCC — the MCC is the
          source of truth for what exists; ticking here is the source of truth
          for what's relevant. Notion (if connected) only enriches afterwards. */}
      {importOpen && (
        <div onClick={() => setImportOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "7vh 16px 40px", overflowY: "auto" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 640 }}>
            <AccountImporter onImported={onAccountsImported} onClose={() => setImportOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

/** One line of the to-do list: tick it, scan it, expand it, or open the account. */
function ActionRow({ a, first, open, done, onToggleOpen, onDone }: { a: Row; first: boolean; open: boolean; done?: boolean; onToggleOpen: () => void; onDone: () => void }) {
  const red = a.status === "red";
  // The one-liner: the planned action's short headline; else the strongest
  // signal; else the first sentence of the briefing.
  const oneLiner = a.worklist?.headline || a.worklist?.action || a.worstSignal?.title
    || (a.briefing ? a.briefing.split(/(?<=[.!?])\s/)[0] : "Open to see what's going on.");
  return (
    <div style={{ borderTop: first ? "none" : "1px solid var(--border)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px" }}>
        <button onClick={onDone} title={done ? "Mark as not done" : "Mark this action as done"}
          style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
            border: done ? "none" : "1.5px solid var(--border-3, var(--border-2))", background: done ? "var(--accent)" : "transparent", color: "#fff" }}>
          {done && <CheckCircle2 size={14} />}
        </button>
        <span title={STATUS_LABEL[a.status]} style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_COLOR[a.status], flexShrink: 0, boxShadow: red && !done ? "0 0 0 3px color-mix(in srgb, var(--danger) 16%, transparent)" : "none" }} />
        <Link href={`/diagnose/${a.id}`} style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>{a.name}</Link>
        <span onClick={onToggleOpen} style={{ flex: 1, minWidth: 0, fontSize: 12.5, color: done ? "var(--text-dim)" : "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: "pointer", textDecoration: done ? "line-through" : "none" }}>
          {oneLiner}
        </span>
        {a.worklist?.minutes ? <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--text-2)", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: 6, padding: "2px 7px", flexShrink: 0 }}>~{a.worklist.minutes}m</span> : null}
        {a.worklist?.skill === "off-platform" && <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--danger, #dc2626)", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: 6, padding: "2px 7px", flexShrink: 0 }}>client</span>}
        <span style={{ fontSize: 11.5, color: "var(--text-muted)", fontVariantNumeric: "tabular-nums", flexShrink: 0, minWidth: 52, textAlign: "right" }}>{a.hasData ? money(a.spend) : ""}</span>
        <button onClick={onToggleOpen} title={open ? "Hide the reasoning" : "Why is this flagged?"}
          style={{ background: "none", border: "none", cursor: "pointer", display: "inline-flex", padding: 3, color: "var(--text-dim)", flexShrink: 0 }}>
          <ChevronDown size={15} style={{ transform: open ? "none" : "rotate(-90deg)", transition: "transform .12s" }} />
        </button>
        <Link href={`/diagnose/${a.id}`} title="Open the account" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: 7, background: done ? "var(--surface-2)" : red ? "var(--danger)" : "var(--accent)", color: done ? "var(--text-3)" : "#fff", flexShrink: 0 }}>
          <ArrowRight size={14} />
        </Link>
      </div>
      {open && (
        <div style={{ padding: "0 14px 12px 52px" }}>
          {a.briefing && <div style={{ fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.55 }}>{a.briefing}</div>}
          {a.worklist && a.worklist.action !== oneLiner && (
            <div style={{ fontSize: 12.5, color: "var(--text)", lineHeight: 1.5, marginTop: 7 }}><strong style={{ color: "var(--accent)" }}>Next:</strong> {a.worklist.action}</div>
          )}
          <div style={{ display: "flex", gap: 16, marginTop: 9, flexWrap: "wrap" }}>
            {a.hasData && <Stat label="Spend 7d" value={money(a.spend)} />}
            {a.poas != null && <Stat label="POAS" value={a.poas.toFixed(2)} danger={a.poas < 1} />}
            {a.roas != null && <Stat label="ROAS" value={a.roas.toFixed(2)} />}
            {a.orders != null && <Stat label="Orders" value={String(a.orders)} />}
            {a.briefingAt && <Stat label="Noticed" value={relTime(a.briefingAt)} />}
          </div>
        </div>
      )}
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
