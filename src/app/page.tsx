"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { BUCKET_LABELS } from "@/lib/engine/types";
import {
  Zap, RefreshCw, Loader2, Plus, AlertTriangle, TrendingUp,
  BookOpen, ListChecks, TrendingDown, Pencil, Check, X, Settings, LogOut,
  Trash2, Search,
} from "lucide-react";
import { AccountImporter } from "@/components/AccountImporter";
import { ThemeToggle } from "@/components/ThemeToggle";

interface SessionUser {
  userId: string;
  orgId:  string | null;
  email:  string;
  name:   string | null;
}

type ConstraintBucket = "MEASUREMENT" | "TRAFFIC" | "CONVERSION" | "FUNNEL" | "ECONOMICS";

interface Snapshot {
  scoreMeasurement: number;
  scoreTraffic:     number;
  scoreConversion:  number;
  scoreFunnel:      number;
  scoreEconomics:   number;
  governingConstraint: string;
  constraintReason: string;
  roas:       number;
  budgetUtil: number;
  createdAt:  string;
}

interface Account {
  id:            string;
  name:          string;
  googleAdsId:   string;
  industry:      string | null;
  monthlyBudget: number | null;
  currency:      string;
  snapshots:     Snapshot[];
  scoreDelta:    number | null;
  prevScoredAt:  string | null;
}

function minScore(snap: Snapshot): number {
  return Math.min(snap.scoreMeasurement, snap.scoreTraffic, snap.scoreConversion, snap.scoreFunnel, snap.scoreEconomics);
}

const BUCKET_COLOR: Record<ConstraintBucket, string> = {
  MEASUREMENT: "#a855f7",
  TRAFFIC:     "#3b82f6",
  CONVERSION:  "#f97316",
  FUNNEL:      "#eab308",
  ECONOMICS:   "#22c55e",
};

function scoreColor(s: number) {
  if (s >= 70) return "#22c55e";
  if (s >= 45) return "#eab308";
  return "#ef4444";
}

function fmt(n: number, digits = 1) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toFixed(digits);
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
        <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #6366f1, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: "#fff", margin: "0 auto 24px" }}>C</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 8, letterSpacing: "-0.4px" }}>Constraint Optimizer</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 32, lineHeight: 1.6 }}>Find and fix the single bottleneck limiting your Google Ads performance.</p>
        <a href="/api/auth/google-ads" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: "var(--surface)", border: "1px solid var(--border-3)", borderRadius: 10, color: "var(--text-2)", fontSize: 13, fontWeight: 600, padding: "12px 24px", textDecoration: "none", width: "100%", boxSizing: "border-box" }}>
          {GOOGLE_LOGO} Continue with Google
        </a>
      </div>
    </div>
  );
}

// ─── Industry inline editor ───────────────────────────────────────────────────

const INDUSTRY_OPTIONS = [
  "ecommerce","fashion","optics","beauty","horeca","food","electronics","furniture",
  "automotive","health","dental","fitness","travel","home_improvement","cleaning",
  "education","driving_school","b2b","saas","technology","finance","legal","real_estate",
];

function IndustryEditor({ accountId, current, onSaved }: { accountId: string; current: string | null; onSaved: (v: string | null) => void }) {
  const [open, setOpen]   = useState(false);
  const [value, setValue] = useState(current ?? "");

  const save = async () => {
    await fetch(`/api/accounts/${accountId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ industry: value || null }),
    });
    onSaved(value || null);
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={e => { e.preventDefault(); setOpen(true); }}
        style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          background: "none", border: "none", cursor: "pointer",
          color: current ? "var(--text-faint)" : "#f97316",
          fontSize: 10, padding: 0,
        }}
      >
        {current
          ? <><span>{current}</span><Pencil size={9} /></>
          : <><span style={{ fontWeight: 600 }}>Set industry</span><Pencil size={9} /></>}
      </button>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }} onClick={e => e.preventDefault()}>
      <select
        value={value}
        onChange={e => setValue(e.target.value)}
        autoFocus
        style={{
          fontSize: 11, padding: "2px 6px", borderRadius: 5,
          border: "1px solid var(--border-2)", background: "var(--surface)",
          color: "var(--text-2)", outline: "none",
        }}
      >
        <option value="">— none —</option>
        {INDUSTRY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <button onClick={save} style={{ background: "none", border: "none", cursor: "pointer", color: "#22c55e", display: "flex" }}><Check size={13} /></button>
      <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-faint)", display: "flex" }}><X size={13} /></button>
    </div>
  );
}

// ─── Account row ──────────────────────────────────────────────────────────────

function AccountRow({
  account, index, scoring, onRescore, onIndustryUpdate, onRemove,
}: {
  account:   Account;
  index:     number;
  scoring:   boolean;
  onRescore: (id: string, e: React.MouseEvent) => void;
  onIndustryUpdate: (id: string, industry: string | null) => void;
  onRemove:  (id: string) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [removing, setRemoving]           = useState(false);
  const snap  = account.snapshots[0];
  const score = snap ? minScore(snap) : null;
  const color = score !== null ? scoreColor(score) : "var(--text-dim)";
  const delta = account.scoreDelta;
  const bucket = snap?.governingConstraint as ConstraintBucket | undefined;

  const severityBar = score !== null && score < 50 ? "#ef4444"
    : score !== null && score < 70 ? "#eab308"
    : null;

  const deltaColor = delta === null ? "var(--text-faint)"
    : delta > 0  ? "#22c55e"
    : delta < 0  ? "#ef4444"
    : "var(--text-faint)";

  return (
    <Link href={`/accounts/${account.id}`} style={{ textDecoration: "none", display: "block" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "36px 1fr 160px 72px 60px 130px 76px",
          alignItems: "center",
          gap: 12,
          padding: "11px 20px 11px 17px",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg)",
          cursor: "pointer",
          transition: "background 0.1s",
          borderLeft: severityBar ? `3px solid ${severityBar}` : "3px solid transparent",
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--surface)"}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--bg)"}
      >
        {/* Rank */}
        <span style={{ fontSize: 12, color: "var(--text-faint)", textAlign: "center" }}>{index + 1}</span>

        {/* Name + industry editor */}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {account.name}
          </div>
          <div style={{ marginTop: 2 }}>
            <IndustryEditor
              accountId={account.id}
              current={account.industry}
              onSaved={v => onIndustryUpdate(account.id, v)}
            />
          </div>
        </div>

        {/* Health — 5 bucket traffic lights */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
          {delta !== null && delta !== 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 1, fontSize: 10, fontWeight: 600, color: deltaColor }}>
              {delta > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {delta > 0 ? `+${delta}` : delta}
            </div>
          )}
          {snap ? (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 5 }}>
              {(
                [
                  ["scoreMeasurement", "M"] as const,
                  ["scoreTraffic",     "T"] as const,
                  ["scoreConversion",  "W"] as const,
                  ["scoreFunnel",      "F"] as const,
                  ["scoreEconomics",   "E"] as const,
                ] as [keyof Snapshot, string][]
              ).map(([key, initial]) => {
                const s = snap[key] as number;
                const dotColor = s >= 70 ? "#22c55e" : s >= 45 ? "#eab308" : "#ef4444";
                return (
                  <div key={key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: dotColor }} />
                    <span style={{ fontSize: 8, color: "var(--text-faint)", lineHeight: 1 }}>{initial}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ fontSize: 11, color: "var(--text-faint)", fontStyle: "italic" }}>—</div>
          )}
        </div>

        {/* ROAS */}
        <div style={{ textAlign: "right" }}>
          {snap && snap.roas > 0 ? (
            <>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)", letterSpacing: "-0.3px" }}>{fmt(snap.roas)}x</div>
              <div style={{ fontSize: 10, color: "var(--text-faint)" }}>ROAS</div>
            </>
          ) : <div style={{ fontSize: 11, color: "var(--text-faint)" }}>—</div>}
        </div>

        {/* Budget util */}
        <div style={{ textAlign: "right" }}>
          {snap && snap.budgetUtil > 0 ? (
            <>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "-0.3px", color: snap.budgetUtil > 0.9 ? "#22c55e" : snap.budgetUtil > 0.6 ? "var(--text-2)" : "#ef4444" }}>
                {Math.round(snap.budgetUtil * 100)}%
              </div>
              <div style={{ fontSize: 10, color: "var(--text-faint)" }}>budget</div>
            </>
          ) : <div style={{ fontSize: 11, color: "var(--text-faint)" }}>—</div>}
        </div>

        {/* Constraint */}
        <div>
          {bucket ? (
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: "0.4px", textTransform: "uppercase",
              color: BUCKET_COLOR[bucket], background: BUCKET_COLOR[bucket] + "18",
              padding: "3px 8px", borderRadius: 20,
            }}>
              {BUCKET_LABELS[bucket]}
            </span>
          ) : (
            <span style={{ fontSize: 11, color: "var(--text-faint)", fontStyle: "italic" }}>not scored</span>
          )}
        </div>

        {/* Actions: rescore + remove */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 4 }}
          onClick={e => { e.preventDefault(); e.stopPropagation(); }}>
          {confirmDelete ? (
            <>
              <span style={{ fontSize: 11, color: "var(--text-dim)", whiteSpace: "nowrap" }}>Remove?</span>
              <button
                onClick={async e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setRemoving(true);
                  await fetch(`/api/accounts/${account.id}`, { method: "DELETE" });
                  onRemove(account.id);
                }}
                disabled={removing}
                style={{ padding: "3px 8px", borderRadius: 5, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}
              >
                {removing ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
              </button>
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); setConfirmDelete(false); }}
                style={{ padding: "3px 6px", borderRadius: 5, background: "none", border: "1px solid var(--border-2)", color: "var(--text-faint)", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center" }}
              >
                <X size={10} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={e => onRescore(account.id, e)}
                disabled={scoring}
                style={{ display: "flex", alignItems: "center", gap: 4, background: "transparent", border: "1px solid var(--border-2)", borderRadius: 6, color: "var(--text-dim)", fontSize: 11, padding: "4px 10px", cursor: scoring ? "not-allowed" : "pointer", opacity: scoring ? 0.4 : 1 }}
              >
                {scoring ? <Loader2 size={10} className="animate-spin" /> : <RefreshCw size={10} />}
                {scoring ? "…" : "Rescore"}
              </button>
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); setConfirmDelete(true); }}
                title="Remove account"
                style={{ padding: "4px 6px", borderRadius: 6, background: "none", border: "1px solid var(--border-2)", color: "var(--text-faint)", cursor: "pointer", display: "flex", alignItems: "center", opacity: 0.5 }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; (e.currentTarget as HTMLButtonElement).style.color = "#ef4444"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(239,68,68,0.3)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.5"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-faint)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-2)"; }}
              >
                <Trash2 size={10} />
              </button>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Morning brief ────────────────────────────────────────────────────────────

function MorningBrief({ accounts }: { accounts: Account[] }) {
  const scored = accounts.filter(a => a.snapshots[0]);
  if (scored.length === 0) return null;

  // Accounts that dropped since last score
  const dropped = accounts
    .filter(a => a.scoreDelta !== null && a.scoreDelta <= -5)
    .sort((a, b) => (a.scoreDelta ?? 0) - (b.scoreDelta ?? 0))
    .slice(0, 3);

  // Accounts that became critical (score < 50) — regardless of delta
  const newCritical = accounts.filter(a => {
    const s = a.snapshots[0] ? minScore(a.snapshots[0]) : null;
    return s !== null && s < 50;
  });

  // Accounts without industry set (affects CVR accuracy)
  const noIndustry = accounts.filter(a => !a.industry && a.snapshots[0]).length;

  if (dropped.length === 0 && newCritical.length === 0 && noIndustry === 0) return null;

  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 10, padding: "14px 20px", marginBottom: 20,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.6px", textTransform: "uppercase", color: "var(--text-dim)" }}>
          Today
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {dropped.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <TrendingDown size={13} style={{ color: "#ef4444", flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "var(--text-2)", fontWeight: 500 }}>
              {dropped.length === 1 ? "1 account dropped" : `${dropped.length} accounts dropped`} since last score:
            </span>
            {dropped.map(a => (
              <Link key={a.id} href={`/accounts/${a.id}`} style={{ textDecoration: "none" }}>
                <span style={{
                  fontSize: 12, fontWeight: 600, color: "#ef4444",
                  background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                  padding: "2px 8px", borderRadius: 20,
                }}>
                  {a.name} {a.scoreDelta}
                </span>
              </Link>
            ))}
          </div>
        )}

        {newCritical.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={13} style={{ color: "#ef4444", flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "var(--text-2)", fontWeight: 500 }}>
              <span style={{ color: "#ef4444", fontWeight: 700 }}>{newCritical.length}</span> accounts in critical range — need immediate attention
            </span>
          </div>
        )}

        {noIndustry > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: "#f97316", fontWeight: 700 }}>{noIndustry}</span>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
              accounts have no industry set — CVR benchmarks are generic. Click the industry field below to fix.
            </span>
          </div>
        )}
      </div>
    </div>
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
  const autoImportAttempted = useRef(false);

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/accounts");
      if (res.ok) setAccounts(await res.json());
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    // Load session user and Google Ads status in parallel
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
    // Wait for the initial loadAccounts() to finish before deciding to import.
    // This prevents a race where the import's loadAccounts() result gets
    // overwritten by the stale initial fetch (which started before DB had data).
    if (!connected || loading || autoImportAttempted.current) return;
    // If accounts already loaded from DB, nothing to import.
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

  const handleIndustryUpdate = useCallback((id: string, industry: string | null) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, industry } : a));
  }, []);

  const handleRemove = useCallback((id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
  }, []);

  const scored   = accounts.filter(a => a.snapshots[0]);
  const critical = scored.filter(a => minScore(a.snapshots[0]) < 45).length;
  const atRisk   = scored.filter(a => { const s = minScore(a.snapshots[0]); return s >= 45 && s < 70; }).length;
  const healthy  = scored.filter(a => minScore(a.snapshots[0]) >= 70).length;

  const q = search.trim().toLowerCase();
  const sorted = [...accounts]
    .filter(a => !q || a.name.toLowerCase().includes(q) || (a.industry ?? "").toLowerCase().includes(q))
    .sort((a, b) => {
      const sa = a.snapshots[0] ? minScore(a.snapshots[0]) : 101;
      const sb = b.snapshots[0] ? minScore(b.snapshots[0]) : 101;
      return sa - sb;
    });

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
        borderBottom: "1px solid var(--border)", padding: "0 24px", height: 52,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, background: "var(--header-bg)",
        backdropFilter: "blur(12px)", zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: "linear-gradient(135deg, #6366f1, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>C</div>
          <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: "-0.3px", color: "var(--text)" }}>Constraint Optimizer</span>
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
          <Link href="/actions" style={{ display: "flex", alignItems: "center", gap: 5, background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 7, color: "var(--text-muted)", fontSize: 12, padding: "6px 12px", textDecoration: "none" }}>
            <ListChecks size={12} /> Actions
          </Link>
          <Link href="/sops" style={{ display: "flex", alignItems: "center", gap: 5, background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 7, color: "var(--text-muted)", fontSize: 12, padding: "6px 12px", textDecoration: "none" }}>
            <BookOpen size={12} /> SOPs
          </Link>
          <button onClick={() => setShowImporter(!showImporter)} style={{ display: "flex", alignItems: "center", gap: 5, background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 7, color: "var(--text-muted)", fontSize: 12, padding: "6px 12px", cursor: "pointer" }}>
            <Plus size={12} /> Add accounts
          </button>
          <ThemeToggle />
          <Link href="/settings" style={{ display: "flex", alignItems: "center", gap: 5, background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 7, color: "var(--text-muted)", fontSize: 12, padding: "6px 12px", textDecoration: "none" }} title="Settings">
            <Settings size={12} />
          </Link>
          {sessionUser && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff" }}>
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

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px" }}>

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

        {/* Morning brief */}
        <MorningBrief accounts={accounts} />

        {/* Stats bar */}
        {scored.length > 0 && (
          <div style={{ display: "flex", gap: 20, marginBottom: 16, padding: "12px 20px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, alignItems: "center" }}>
            <Stat label="Total" value={accounts.length} color="var(--text-muted)" />
            <div style={{ width: 1, background: "var(--border)", alignSelf: "stretch" }} />
            <Stat label="Critical" value={critical} color="#ef4444" />
            <Stat label="At risk" value={atRisk} color="#eab308" />
            <Stat label="Healthy" value={healthy} color="#22c55e" />
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
              <TrendingUp size={13} style={{ color: "var(--text-dim)" }} />
              <span style={{ fontSize: 12, color: "var(--text-dim)" }}>{scored.length} scored</span>
            </div>
          </div>
        )}

        {/* Search */}
        {accounts.length > 0 && (
          <div style={{ position: "relative", marginBottom: 12 }}>
            <Search size={13} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)", pointerEvents: "none" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search accounts…"
              style={{
                width: "100%", boxSizing: "border-box",
                padding: "8px 12px 8px 34px",
                background: "var(--surface)", border: "1px solid var(--border-2)",
                borderRadius: 8, color: "var(--text-2)", fontSize: 13, outline: "none",
                fontFamily: "inherit",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "var(--border-3)")}
              onBlur={e => (e.currentTarget.style.borderColor = "var(--border-2)")}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-faint)", display: "flex", padding: 2 }}
              >
                <X size={12} />
              </button>
            )}
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "60px 0", color: "var(--text-dim)", fontSize: 13 }}>
            <Loader2 size={16} className="animate-spin" /> Loading accounts…
          </div>
        ) : sorted.length === 0 ? (
          <div style={{ border: "1px dashed var(--border-3)", borderRadius: 12, padding: "48px 32px", textAlign: "center" }}>
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
            <div style={{ display: "grid", gridTemplateColumns: "36px 1fr 160px 72px 60px 130px 76px", gap: 12, padding: "7px 20px 7px 17px", background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
              {["#", "Account / Industry", "Health", "ROAS", "Budget", "Bottleneck", ""].map((h, i) => (
                <span key={i} style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.6px", textTransform: "uppercase", color: "var(--text-faint)", textAlign: i >= 2 && i <= 4 ? "right" : "left" }}>{h}</span>
              ))}
            </div>

            {sorted.map((account, idx) => (
              <AccountRow
                key={account.id}
                account={account}
                index={idx}
                scoring={scoring === account.id}
                onRescore={runScore}
                onIndustryUpdate={handleIndustryUpdate}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
      <span style={{ fontSize: 20, fontWeight: 700, color, letterSpacing: "-0.8px" }}>{value}</span>
      <span style={{ fontSize: 11, color: "var(--text-dim)" }}>{label}</span>
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
