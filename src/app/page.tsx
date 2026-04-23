"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { BUCKET_LABELS } from "@/lib/engine/types";
import {
  Zap, RefreshCw, Loader2, Plus, AlertTriangle,
  X, Settings, LogOut, Search, ChevronUp, ChevronDown, UserCircle,
} from "lucide-react";
import { AccountImporter } from "@/components/AccountImporter";
import { ThemeToggle } from "@/components/ThemeToggle";

interface SessionUser {
  userId: string;
  orgId:  string | null;
  email:  string;
  name:   string | null;
  role:   string;
}

type ConstraintBucket = "MEASUREMENT" | "TRAFFIC" | "CONVERSION" | "FUNNEL" | "ECONOMICS";

interface Snapshot {
  governingConstraint: string;
  constraintReason:    string;
  roas:                number;
  budgetUtil:          number;
  spend30d:            number;
  createdAt:           string;
}

interface Account {
  id:               string;
  name:             string;
  googleAdsId:      string;
  industry:         string | null;
  monthlyBudget:    number | null;
  currency:         string;
  snapshots:        Snapshot[];
  scoreDelta:       number | null;
  prevScoredAt:     string | null;
  assignedUserId:   string | null;
  assignedUserName: string | null;
}

const BUCKET_COLOR: Record<ConstraintBucket, string> = {
  MEASUREMENT: "#a855f7",
  TRAFFIC:     "#3b82f6",
  CONVERSION:  "#f97316",
  FUNNEL:      "#eab308",
  ECONOMICS:   "#22c55e",
};

function fmtCurrency(n: number, currency: string): string {
  if (n === 0) return "—";
  const symbol = currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$";
  if (n >= 1_000_000) return `${symbol}${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${symbol}${(n / 1_000).toFixed(0)}k`;
  return `${symbol}${n.toFixed(0)}`;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(h / 24);
  if (h < 1)  return "just now";
  if (h < 24) return `${h}h ago`;
  if (d < 7)  return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// ─── Login screen ─────────────────────────────────────────────────────────────

const GOOGLE_LOGO = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

function LoginPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", maxWidth: 360, padding: "0 24px" }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #c49a0a, #9a7808)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: "#fff", margin: "0 auto 24px" }}>C</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 8, letterSpacing: "-0.4px" }}>Agency Dashboard</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 32, lineHeight: 1.6 }}>Find and fix the single bottleneck limiting your Google Ads performance.</p>
        <a href="/api/auth/google-ads" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: "var(--surface)", border: "1px solid var(--border-3)", borderRadius: 10, color: "var(--text-2)", fontSize: 13, fontWeight: 600, padding: "12px 24px", textDecoration: "none", width: "100%", boxSizing: "border-box" }}>
          {GOOGLE_LOGO} Continue with Google
        </a>
      </div>
    </div>
  );
}

// ─── Bucket pill ──────────────────────────────────────────────────────────────

function BucketPill({ bucket }: { bucket: ConstraintBucket | string }) {
  const color = BUCKET_COLOR[bucket as ConstraintBucket] ?? "var(--text-dim)";
  return (
    <span style={{
      display: "inline-block",
      fontSize: 10, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase",
      color, background: color + "18", border: `1px solid ${color}30`,
      padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap",
    }}>
      {BUCKET_LABELS[bucket as ConstraintBucket] ?? bucket}
    </span>
  );
}

// ─── Account row ──────────────────────────────────────────────────────────────

function AccountRow({
  account, scoring, onRescore, onRemove,
}: {
  account:   Account;
  scoring:   boolean;
  onRescore: (id: string, e: React.MouseEvent) => void;
  onRemove:  (id: string) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [removing, setRemoving]           = useState(false);

  const snap   = account.snapshots[0];
  const bucket = snap?.governingConstraint as ConstraintBucket | undefined;

  const spend = snap?.spend30d
    ? fmtCurrency(snap.spend30d, account.currency)
    : account.monthlyBudget
    ? fmtCurrency(account.monthlyBudget * (snap?.budgetUtil ?? 0), account.currency)
    : "—";

  const hasData = !!snap;

  return (
    <tr style={{
      borderBottom: "1px solid var(--border)",
      transition: "background 0.1s",
    }}
      onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-2)")}
      onMouseLeave={e => (e.currentTarget.style.background = "")}
    >
      {/* Account name */}
      <td style={{ padding: "14px 16px" }}>
        <Link href={`/accounts/${account.id}`} style={{ textDecoration: "none" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", letterSpacing: "-0.2px", lineHeight: 1.3 }}>
            {account.name}
          </div>
          {account.industry && (
            <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>{account.industry}</div>
          )}
        </Link>
      </td>

      {/* Manager */}
      <td style={{ padding: "14px 16px" }}>
        {account.assignedUserName ? (
          <span style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 5 }}>
            <UserCircle size={13} style={{ color: "var(--text-dim)", flexShrink: 0 }} />
            {account.assignedUserName}
          </span>
        ) : (
          <span style={{ fontSize: 13, color: "var(--text-faint)" }}>—</span>
        )}
      </td>

      {/* 30d spend */}
      <td style={{ padding: "14px 16px", textAlign: "right" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: spend === "—" ? "var(--text-faint)" : "var(--text-2)", letterSpacing: "-0.3px" }}>
          {spend}
        </span>
        {snap?.budgetUtil != null && snap.budgetUtil > 0 && snap.budgetUtil < 0.9 && (
          <div style={{ fontSize: 11, color: "#f97316", marginTop: 2 }}>
            {Math.round(snap.budgetUtil * 100)}% utilised
          </div>
        )}
      </td>

      {/* Bottleneck */}
      <td style={{ padding: "14px 16px" }}>
        {bucket ? (
          <BucketPill bucket={bucket} />
        ) : (
          <span style={{ fontSize: 13, color: "var(--text-faint)" }}>—</span>
        )}
      </td>

      {/* Constraint summary — single line, ellipsis */}
      <td style={{ padding: "14px 16px" }}>
        {snap?.constraintReason ? (
          <span style={{
            fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5,
            display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            maxWidth: 360,
          }}
            title={snap.constraintReason}
          >
            {snap.constraintReason}
          </span>
        ) : (
          <span style={{ fontSize: 13, color: "var(--text-faint)", fontStyle: "italic" }}>
            {hasData ? "—" : "Not scored yet"}
          </span>
        )}
      </td>

      {/* Last scored */}
      <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
        <span style={{ fontSize: 12, color: "var(--text-dim)" }}>
          {snap ? timeAgo(snap.createdAt) : "—"}
        </span>
      </td>

      {/* Actions */}
      <td style={{ padding: "12px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {confirmDelete ? (
            <>
              <button
                onClick={async e => {
                  e.preventDefault(); e.stopPropagation();
                  setRemoving(true);
                  await fetch(`/api/accounts/${account.id}`, { method: "DELETE" });
                  onRemove(account.id);
                }}
                disabled={removing}
                style={{ padding: "3px 8px", borderRadius: 5, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", fontSize: 11, cursor: "pointer" }}
              >
                {removing ? <Loader2 size={10} className="animate-spin" /> : "Remove"}
              </button>
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); setConfirmDelete(false); }}
                style={{ padding: "3px 6px", borderRadius: 5, background: "none", border: "1px solid var(--border-2)", color: "var(--text-faint)", fontSize: 11, cursor: "pointer" }}
              >
                <X size={10} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={e => onRescore(account.id, e)}
                disabled={scoring}
                style={{ display: "flex", alignItems: "center", gap: 3, background: "transparent", border: "1px solid var(--border-2)", borderRadius: 6, color: "var(--text-dim)", fontSize: 11, padding: "4px 9px", cursor: scoring ? "not-allowed" : "pointer", opacity: scoring ? 0.4 : 1, whiteSpace: "nowrap" }}
              >
                {scoring ? <Loader2 size={10} className="animate-spin" /> : <RefreshCw size={10} />}
                {scoring ? "…" : "Score"}
              </button>
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); setConfirmDelete(true); }}
                title="Remove account"
                style={{ padding: "4px 6px", borderRadius: 6, background: "none", border: "1px solid var(--border-2)", color: "var(--text-faint)", cursor: "pointer", display: "flex", alignItems: "center" }}
              >
                <X size={10} />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── Sortable column header ────────────────────────────────────────────────────

function ColHeader({
  label, col, sortBy, sortDir, onSort, align = "left",
}: {
  label:   string;
  col:     string;
  sortBy:  string;
  sortDir: "asc" | "desc";
  onSort:  (col: string) => void;
  align?:  "left" | "right";
}) {
  const active = sortBy === col;
  return (
    <th
      onClick={() => onSort(col)}
      style={{
        padding: "10px 16px", textAlign: align,
        fontSize: 11, fontWeight: 700, letterSpacing: "0.4px", textTransform: "uppercase",
        color: active ? "var(--text)" : "var(--text-faint)",
        cursor: "pointer", userSelect: "none", whiteSpace: "nowrap",
        borderBottom: "1px solid var(--border)",
        background: "var(--surface)",
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
        {label}
        {active && (sortDir === "asc" ? <ChevronUp size={11} /> : <ChevronDown size={11} />)}
      </span>
    </th>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

function HomePageInner() {
  const searchParams = useSearchParams();
  const authError    = searchParams.get("auth_error");

  const [accounts, setAccounts]               = useState<Account[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [scoring, setScoring]                 = useState<string | null>(null);
  const [scoringAll, setScoringAll]           = useState(false);
  const [scoringProgress, setScoringProgress] = useState<{ done: number; total: number } | null>(null);
  const [showImporter, setShowImporter]       = useState(false);
  const [connected, setConnected]             = useState<boolean | null>(null);
  const [autoImporting, setAutoImporting]     = useState(false);
  const [autoImportError, setAutoImportError] = useState<string | null>(null);
  const [importStep, setImportStep]           = useState("");
  const [sessionUser, setSessionUser]         = useState<SessionUser | null>(null);
  const [search, setSearch]                   = useState("");
  const [sortBy, setSortBy]     = useState<string>("name");
  const [sortDir, setSortDir]   = useState<"asc" | "desc">("asc");
  const [filterBucket, setFilterBucket] = useState<ConstraintBucket | null>(null);
  const autoImportAttempted = useRef(false);

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/accounts");
      if (res.ok) setAccounts(await res.json());
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(d => { if (d.user) setSessionUser(d.user); })
      .catch(() => {});

    fetch("/api/auth/google-ads/status")
      .then(r => r.json())
      .then(d => { setConnected(d.connected); if (d.connected) loadAccounts(); else setLoading(false); })
      .catch(() => { setConnected(false); setLoading(false); });
  }, [loadAccounts]);

  useEffect(() => {
    if (!connected || loading || autoImportAttempted.current) return;
    if (accounts.length > 0) { autoImportAttempted.current = true; return; }
    autoImportAttempted.current = true;
    async function run() {
      setAutoImporting(true);
      setAutoImportError(null);
      setImportStep("Connecting to Google Ads…");
      const abort = new AbortController();
      const timer = setTimeout(() => abort.abort(), 60_000);
      try {
        const res = await fetch("/api/google-ads/accounts", { signal: abort.signal });
        if (!res.ok) { setAutoImportError((await res.json()).error ?? "Could not load accounts."); return; }
        const mccAccounts: { googleAdsId: string; name: string; currency: string }[] = await res.json();
        if (mccAccounts.length === 0) { setAutoImportError("No accounts found."); return; }
        setImportStep(`Importing ${mccAccounts.length} accounts…`);
        const bulkRes = await fetch("/api/google-ads/accounts/bulk", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ accounts: mccAccounts }), signal: abort.signal });
        if (!bulkRes.ok) { setAutoImportError((await bulkRes.json()).error ?? "Import failed."); return; }
        setImportStep("Loading dashboard…");
        await loadAccounts();
      } catch (e) {
        const msg = e instanceof Error && e.name === "AbortError" ? "Import timed out. Try again." : "Network error while importing.";
        setAutoImportError(msg);
      } finally { clearTimeout(timer); setAutoImporting(false); setImportStep(""); }
    }
    run();
  }, [connected, loading, loadAccounts]);

  const runScore = async (accountId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setScoring(accountId);
    try {
      await fetch(`/api/accounts/${accountId}/snapshot?source=google-ads`, { method: "POST" });
      await loadAccounts();
    } finally { setScoring(null); }
  };

  const runScoreAll = async () => {
    setScoringAll(true);
    setScoringProgress(null);
    try {
      const toScore = accounts;
      setScoringProgress({ done: 0, total: toScore.length });
      for (let i = 0; i < toScore.length; i++) {
        await fetch(`/api/accounts/${toScore[i].id}/snapshot?source=google-ads`, { method: "POST" });
        setScoringProgress({ done: i + 1, total: toScore.length });
      }
      await loadAccounts();
    } finally { setScoringAll(false); setScoringProgress(null); }
  };

  const handleRemove = useCallback((id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
  }, []);

  const toggleSort = (col: string) => {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("asc"); }
  };

  const isSpecialist = sessionUser?.role === "SPECIALIST";
  const q = search.trim().toLowerCase();

  const sorted = [...accounts]
    .filter(a => !q || a.name.toLowerCase().includes(q) || (a.industry ?? "").toLowerCase().includes(q))
    .filter(a => !filterBucket || a.snapshots[0]?.governingConstraint === filterBucket)
    .filter(a => !isSpecialist || a.assignedUserId === sessionUser?.userId)
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortBy === "name")    return a.name.localeCompare(b.name) * dir;
      if (sortBy === "manager") return (a.assignedUserName ?? "").localeCompare(b.assignedUserName ?? "") * dir;
      if (sortBy === "spend") {
        const sa = a.snapshots[0]?.spend30d ?? (a.monthlyBudget ?? 0) * (a.snapshots[0]?.budgetUtil ?? 0);
        const sb = b.snapshots[0]?.spend30d ?? (b.monthlyBudget ?? 0) * (b.snapshots[0]?.budgetUtil ?? 0);
        return (sa - sb) * dir;
      }
      if (sortBy === "bucket") {
        const ba = a.snapshots[0]?.governingConstraint ?? "ZZZ";
        const bb = b.snapshots[0]?.governingConstraint ?? "ZZZ";
        return ba.localeCompare(bb) * dir;
      }
      if (sortBy === "scored") {
        const ta = a.snapshots[0] ? new Date(a.snapshots[0].createdAt).getTime() : 0;
        const tb = b.snapshots[0] ? new Date(b.snapshots[0].createdAt).getTime() : 0;
        return (ta - tb) * dir;
      }
      return 0;
    });

  // Bucket distribution for filter chips
  const bucketCounts = new Map<string, number>();
  for (const a of accounts) {
    const b = a.snapshots[0]?.governingConstraint;
    if (b) bucketCounts.set(b, (bucketCounts.get(b) ?? 0) + 1);
  }

  if (connected === null) return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Loader2 size={18} className="animate-spin" style={{ color: "var(--text-dim)" }} />
    </div>
  );
  if (connected === false) return <LoginPage />;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>

      {/* Header */}
      <header style={{
        borderBottom: "1px solid var(--border)", padding: "0 28px", height: 52,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, background: "var(--header-bg)",
        backdropFilter: "blur(12px)", zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: "linear-gradient(135deg, #c49a0a, #9a7808)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>C</div>
          <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: "-0.3px", color: "var(--text)" }}>Agency Dashboard</span>
          {accounts.length > 0 && (
            <span style={{ fontSize: 11, color: "var(--text-faint)", marginLeft: 4 }}>
              {accounts.length} account{accounts.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {accounts.length > 0 && (
            <button onClick={runScoreAll} disabled={scoringAll || !!scoring} style={{
              display: "flex", alignItems: "center", gap: 6,
              background: scoringAll ? "var(--surface-2)" : "var(--btn-primary)",
              border: "none", borderRadius: 7, color: scoringAll ? "var(--text-muted)" : "#fff",
              fontSize: 12, fontWeight: 600, padding: "6px 14px", cursor: scoringAll ? "not-allowed" : "pointer",
              opacity: scoringAll || !!scoring ? 0.7 : 1,
            }}>
              {scoringAll
                ? <><Loader2 size={12} className="animate-spin" />{scoringProgress ? `${scoringProgress.done}/${scoringProgress.total}` : "Scoring…"}</>
                : <><Zap size={12} /> Score all</>}
            </button>
          )}
          <button onClick={() => setShowImporter(!showImporter)} style={{ display: "flex", alignItems: "center", gap: 5, background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 7, color: "var(--text-muted)", fontSize: 12, padding: "6px 12px", cursor: "pointer" }}>
            <Plus size={12} /> Add accounts
          </button>
          <ThemeToggle />
          <Link href="/settings" style={{ display: "flex", alignItems: "center", gap: 5, background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 7, color: "var(--text-muted)", fontSize: 12, padding: "6px 12px", textDecoration: "none" }} title="Settings">
            <Settings size={12} />
          </Link>
          {sessionUser && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg, #c49a0a, #9a7808)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff" }}>
                {(sessionUser.name ?? sessionUser.email).charAt(0).toUpperCase()}
              </div>
              <button
                onClick={() => { const f = document.createElement("form"); f.method = "POST"; f.action = "/api/auth/signout"; document.body.appendChild(f); f.submit(); }}
                title="Sign out"
                style={{ display: "flex", alignItems: "center", background: "none", border: "none", cursor: "pointer", color: "var(--text-faint)", padding: 0 }}
              >
                <LogOut size={11} />
              </button>
            </div>
          )}
        </div>
      </header>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 28px" }}>

        {authError && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#ef4444" }}>
            {authError === "missing_developer_token" ? "Developer token not set." : `Auth error: ${authError}`}
          </div>
        )}

        {(autoImporting || scoringAll) && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#60a5fa" }}>
            <Loader2 size={13} className="animate-spin" />
            {autoImporting ? (importStep || "Importing accounts from Google Ads…") : scoringProgress ? `Scoring accounts… ${scoringProgress.done} / ${scoringProgress.total}` : "Scoring all accounts…"}
          </div>
        )}

        {autoImportError && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#ef4444", display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={13} /> {autoImportError}
            <button onClick={() => { setAutoImportError(null); autoImportAttempted.current = false; }} style={{ marginLeft: "auto", fontSize: 11, color: "#ef4444", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Retry</button>
          </div>
        )}

        {showImporter && (
          <div style={{ marginBottom: 20 }}>
            <AccountImporter onImported={() => { loadAccounts(); setShowImporter(false); }} onClose={() => setShowImporter(false)} onAuthFailed={() => setConnected(false)} />
          </div>
        )}

        {/* Toolbar: search + bucket filters */}
        {accounts.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: "1 1 240px", maxWidth: 320 }}>
              <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)", pointerEvents: "none" }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search accounts…"
                style={{
                  width: "100%", boxSizing: "border-box",
                  padding: "7px 10px 7px 30px",
                  background: "var(--surface)", border: "1px solid var(--border-2)",
                  borderRadius: 7, color: "var(--text-2)", fontSize: 12, outline: "none",
                  fontFamily: "inherit",
                }}
                onFocus={e => (e.currentTarget.style.borderColor = "var(--border-3)")}
                onBlur={e => (e.currentTarget.style.borderColor = "var(--border-2)")}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-faint)", display: "flex", padding: 2 }}>
                  <X size={11} />
                </button>
              )}
            </div>

            {/* Bucket filter chips */}
            <span style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 500 }}>Filter:</span>
            {(Object.keys(BUCKET_COLOR) as ConstraintBucket[])
              .filter(b => bucketCounts.has(b))
              .map(b => {
                const count = bucketCounts.get(b) ?? 0;
                const active = filterBucket === b;
                const color = BUCKET_COLOR[b];
                return (
                  <button
                    key={b}
                    onClick={() => setFilterBucket(active ? null : b)}
                    title={`${count} accounts`}
                    style={{
                      display: "flex", alignItems: "center", gap: 5,
                      fontSize: 12, fontWeight: active ? 700 : 500,
                      color: active ? "#fff" : color,
                      background: active ? color : "transparent",
                      border: `1px solid ${active ? color : color + "50"}`,
                      padding: "4px 12px", borderRadius: 20, cursor: "pointer",
                      transition: "all 0.1s",
                    }}
                  >
                    {BUCKET_LABELS[b]}
                    {active && <span style={{ fontWeight: 600, opacity: 0.85 }}>{count}</span>}
                  </button>
                );
              })}
            {filterBucket && (
              <button onClick={() => setFilterBucket(null)} style={{ fontSize: 11, color: "var(--text-faint)", background: "none", border: "1px solid var(--border-2)", borderRadius: 20, padding: "4px 10px", cursor: "pointer" }}>
                Clear
              </button>
            )}
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "80px 0", color: "var(--text-dim)", fontSize: 13 }}>
            <Loader2 size={16} className="animate-spin" /> Loading accounts…
          </div>
        ) : sorted.length === 0 ? (
          <div style={{ border: "1px dashed var(--border-3)", borderRadius: 12, padding: "60px 32px", textAlign: "center" }}>
            {search ? (
              <>
                <p style={{ color: "var(--text-dim)", fontSize: 14, marginBottom: 6 }}>No accounts match &ldquo;{search}&rdquo;</p>
                <button onClick={() => setSearch("")} style={{ fontSize: 12, color: "#3b82f6", background: "none", border: "none", cursor: "pointer" }}>Clear search</button>
              </>
            ) : (
              <>
                <p style={{ color: "var(--text-dim)", fontSize: 14, marginBottom: 6 }}>No accounts yet.</p>
                <p style={{ color: "var(--text-faint)", fontSize: 12 }}>Click <strong>Add accounts</strong> to import from your Google Ads MCC.</p>
              </>
            )}
          </div>
        ) : (
          <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <ColHeader label="Account"    col="name"    sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} />
                  <ColHeader label="Manager"    col="manager" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} />
                  <ColHeader label="30d Spend"  col="spend"   sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} align="right" />
                  <ColHeader label="Bottleneck" col="bucket"  sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} />
                  <ColHeader label="Constraint" col="constraint" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} />
                  <ColHeader label="Scored"     col="scored"  sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} />
                  <th style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", background: "var(--surface)", width: 120 }} />
                </tr>
              </thead>
              <tbody>
                {sorted.map(account => (
                  <AccountRow
                    key={account.id}
                    account={account}
                    scoring={scoring === account.id}
                    onRescore={runScore}
                    onRemove={handleRemove}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}><Loader2 size={18} className="animate-spin" style={{ color: "var(--text-dim)" }} /></div>}>
      <HomePageInner />
    </Suspense>
  );
}
