"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { BUCKET_LABELS } from "@/lib/engine/types";
import {
  Zap, RefreshCw, Loader2, Plus, AlertTriangle, TrendingUp,
  BookOpen, ListChecks, TrendingDown, Check, X, Settings, LogOut,
  Trash2, Search, ChevronUp, ChevronDown, ShieldCheck,
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
        <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #33cc80, #1c8a52)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: "#fff", margin: "0 auto 24px" }}>C</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 8, letterSpacing: "-0.4px" }}>Constraint Optimizer</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 32, lineHeight: 1.6 }}>Find and fix the single bottleneck limiting your Google Ads performance.</p>
        <a href="/api/auth/google-ads" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: "var(--surface)", border: "1px solid var(--border-3)", borderRadius: 10, color: "var(--text-2)", fontSize: 13, fontWeight: 600, padding: "12px 24px", textDecoration: "none", width: "100%", boxSizing: "border-box" }}>
          {GOOGLE_LOGO} Continue with Google
        </a>
      </div>
    </div>
  );
}

// ─── Account card ─────────────────────────────────────────────────────────────

function AccountCard({
  account, scoring, onRescore, onRemove,
}: {
  account:   Account;
  scoring:   boolean;
  onRescore: (id: string, e: React.MouseEvent) => void;
  onRemove:  (id: string) => void;
}) {
  const [hovered, setHovered]           = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [removing, setRemoving]           = useState(false);

  const snap   = account.snapshots[0];
  const score  = snap ? minScore(snap) : null;
  const delta  = account.scoreDelta;
  const bucket = snap?.governingConstraint as ConstraintBucket | undefined;

  const isCritical = score !== null && score < 45;
  const isAtRisk   = score !== null && score >= 45 && score < 70;
  const isHealthy  = score !== null && score >= 70;

  const accentColor = isCritical ? "#ef4444" : isAtRisk ? "#eab308" : isHealthy ? "#22c55e" : "var(--border-3)";
  const deltaColor  = delta === null ? "var(--text-faint)" : delta > 0 ? "#22c55e" : delta < 0 ? "#ef4444" : "var(--text-faint)";

  return (
    <Link href={`/accounts/${account.id}`} style={{ textDecoration: "none", display: "block" }}>
      <div
        style={{
          background: "var(--surface)",
          border: `1px solid ${hovered ? "var(--border-3)" : "var(--border)"}`,
          borderRadius: 14,
          overflow: "hidden",
          cursor: "pointer",
          transition: "border-color 0.15s, box-shadow 0.15s",
          boxShadow: hovered ? "0 4px 24px rgba(0,0,0,0.18)" : "0 1px 3px rgba(0,0,0,0.08)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); if (!confirmDelete) return; }}
      >
        {/* Top accent bar */}
        <div style={{ height: 3, background: accentColor, transition: "background 0.2s" }} />

        <div style={{ padding: "16px 18px 15px" }}>

          {/* Row 1: Name + Score */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: 14, fontWeight: 700, color: "var(--text)",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                letterSpacing: "-0.3px", lineHeight: 1.3,
              }}>
                {account.name}
              </div>
              {account.industry && (
                <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 3 }}>{account.industry}</div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2, flexShrink: 0 }}>
              {score !== null ? (
                <span style={{
                  fontSize: 26, fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1,
                  color: scoreColor(score),
                }}>
                  {score}
                </span>
              ) : (
                <span style={{ fontSize: 13, color: "var(--text-faint)", fontStyle: "italic", lineHeight: 1 }}>—</span>
              )}
              {delta !== null && delta !== 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 10, fontWeight: 600, color: deltaColor }}>
                  {delta > 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                  {delta > 0 ? `+${delta}` : delta}
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Health buckets */}
          {snap ? (
            <div style={{ display: "flex", gap: 5, marginBottom: 14 }}>
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
                  <div
                    key={key}
                    title={`${initial}: ${Math.round(s)}`}
                    style={{
                      flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                      background: dotColor + "14", borderRadius: 7, padding: "6px 0",
                    }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: dotColor }} />
                    <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.3px", color: "var(--text-dim)" }}>{initial}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ height: 38, display: "flex", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontSize: 11, color: "var(--text-faint)", fontStyle: "italic" }}>Not scored yet</span>
            </div>
          )}

          {/* Row 3: Metrics + Constraint */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <div style={{ display: "flex", gap: 6 }}>
              {snap && snap.roas > 0 && (
                <div style={{
                  background: "var(--surface-2)", borderRadius: 6, padding: "4px 10px",
                  fontSize: 12, fontWeight: 700, color: "var(--text-2)", letterSpacing: "-0.3px",
                  display: "flex", alignItems: "baseline", gap: 4,
                }}>
                  {fmt(snap.roas)}x
                  <span style={{ fontSize: 9, fontWeight: 500, color: "var(--text-dim)", letterSpacing: 0 }}>ROAS</span>
                </div>
              )}
              {snap && snap.budgetUtil > 0 && (
                <div style={{
                  background: "var(--surface-2)", borderRadius: 6, padding: "4px 10px",
                  fontSize: 12, fontWeight: 700, letterSpacing: "-0.3px",
                  color: snap.budgetUtil > 0.9 ? "#22c55e" : snap.budgetUtil > 0.6 ? "var(--text-2)" : "#ef4444",
                  display: "flex", alignItems: "baseline", gap: 4,
                }}>
                  {Math.round(snap.budgetUtil * 100)}%
                  <span style={{ fontSize: 9, fontWeight: 500, color: "var(--text-dim)", letterSpacing: 0 }}>budget</span>
                </div>
              )}
            </div>

            {bucket && (
              <span style={{
                fontSize: 10, fontWeight: 600, letterSpacing: "0.4px", textTransform: "uppercase",
                color: BUCKET_COLOR[bucket], background: BUCKET_COLOR[bucket] + "18",
                padding: "3px 8px", borderRadius: 20, flexShrink: 0,
              }}>
                {BUCKET_LABELS[bucket]}
              </span>
            )}
          </div>

          {/* Row 4: Actions (visible on hover) */}
          <div
            style={{
              display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4,
              marginTop: 12, opacity: hovered ? 1 : 0, transition: "opacity 0.15s",
            }}
            onClick={e => { e.preventDefault(); e.stopPropagation(); }}
          >
            {confirmDelete ? (
              <>
                <span style={{ fontSize: 11, color: "var(--text-dim)", marginRight: 4 }}>Remove?</span>
                <button
                  onClick={async e => {
                    e.preventDefault(); e.stopPropagation();
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
                  {scoring ? "…" : "Score"}
                </button>
                <button
                  onClick={e => { e.preventDefault(); e.stopPropagation(); setConfirmDelete(true); }}
                  title="Remove account"
                  style={{ padding: "4px 6px", borderRadius: 6, background: "none", border: "1px solid var(--border-2)", color: "var(--text-faint)", cursor: "pointer", display: "flex", alignItems: "center" }}
                >
                  <Trash2 size={10} />
                </button>
            </>
          )}
        </div>

        </div>{/* card body */}
      </div>{/* outer card */}
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
  const [sortBy, setSortBy]     = useState<"score" | "name" | "roas" | "budget" | "bucket">("score");
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

  const handleRemove = useCallback((id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
  }, []);

  const toggleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir(col === "score" ? "asc" : "desc"); }
  };

  const scored   = accounts.filter(a => a.snapshots[0]);
  const critical = scored.filter(a => minScore(a.snapshots[0]) < 45).length;
  const atRisk   = scored.filter(a => { const s = minScore(a.snapshots[0]); return s >= 45 && s < 70; }).length;
  const healthy  = scored.filter(a => minScore(a.snapshots[0]) >= 70).length;

  const q = search.trim().toLowerCase();
  const sorted = [...accounts]
    .filter(a => !q || a.name.toLowerCase().includes(q) || (a.industry ?? "").toLowerCase().includes(q))
    .filter(a => !filterBucket || a.snapshots[0]?.governingConstraint === filterBucket)
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortBy === "score") {
        const sa = a.snapshots[0] ? minScore(a.snapshots[0]) : 101;
        const sb = b.snapshots[0] ? minScore(b.snapshots[0]) : 101;
        return (sa - sb) * dir;
      }
      if (sortBy === "name") return a.name.localeCompare(b.name) * dir;
      if (sortBy === "roas") {
        const ra = a.snapshots[0]?.roas ?? -1;
        const rb = b.snapshots[0]?.roas ?? -1;
        return (ra - rb) * dir;
      }
      if (sortBy === "budget") {
        const ba = a.snapshots[0]?.budgetUtil ?? -1;
        const bb = b.snapshots[0]?.budgetUtil ?? -1;
        return (ba - bb) * dir;
      }
      if (sortBy === "bucket") {
        const ba = a.snapshots[0]?.governingConstraint ?? "ZZZ";
        const bb = b.snapshots[0]?.governingConstraint ?? "ZZZ";
        return ba.localeCompare(bb) * dir;
      }
      return 0;
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
          <div style={{ width: 24, height: 24, borderRadius: 6, background: "linear-gradient(135deg, #33cc80, #1c8a52)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>C</div>
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
          <Link href="/ownership" style={{ display: "flex", alignItems: "center", gap: 5, background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 7, color: "var(--text-muted)", fontSize: 12, padding: "6px 12px", textDecoration: "none" }}>
            <ShieldCheck size={12} /> Ownership
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
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg, #33cc80, #1c8a52)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff" }}>
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
          <div style={{ display: "flex", gap: 16, marginBottom: 12, padding: "10px 20px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, alignItems: "center", flexWrap: "wrap" }}>
            <Stat label="Total" value={accounts.length} color="var(--text-muted)" />
            <div style={{ width: 1, background: "var(--border)", alignSelf: "stretch" }} />
            <Stat label="Critical" value={critical} color="#ef4444" />
            <Stat label="At risk" value={atRisk} color="#eab308" />
            <Stat label="Healthy" value={healthy} color="#22c55e" />
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              {/* Bucket filter chips */}
              {(Object.keys(BUCKET_COLOR) as ConstraintBucket[])
                .filter(b => accounts.some(a => a.snapshots[0]?.governingConstraint === b))
                .map(b => (
                  <button
                    key={b}
                    onClick={() => setFilterBucket(filterBucket === b ? null : b)}
                    style={{
                      fontSize: 10, fontWeight: 600, letterSpacing: "0.4px", textTransform: "uppercase",
                      color: filterBucket === b ? "#fff" : BUCKET_COLOR[b],
                      background: filterBucket === b ? BUCKET_COLOR[b] : BUCKET_COLOR[b] + "18",
                      border: `1px solid ${BUCKET_COLOR[b]}40`,
                      padding: "3px 9px", borderRadius: 20, cursor: "pointer",
                      transition: "background 0.15s, color 0.15s",
                    }}
                  >
                    {BUCKET_LABELS[b]}
                  </button>
                ))}
              {filterBucket && (
                <button onClick={() => setFilterBucket(null)} style={{ fontSize: 10, color: "var(--text-dim)", background: "none", border: "1px solid var(--border-2)", borderRadius: 20, padding: "3px 8px", cursor: "pointer" }}>
                  Clear
                </button>
              )}
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
          <>
            {/* Sort toolbar */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: "var(--text-faint)", fontWeight: 500, marginRight: 2 }}>Sort:</span>
              {(
                [
                  { col: "score",  label: "Score"      },
                  { col: "name",   label: "Name"        },
                  { col: "roas",   label: "ROAS"        },
                  { col: "budget", label: "Budget"      },
                  { col: "bucket", label: "Bottleneck"  },
                ] as { col: typeof sortBy; label: string }[]
              ).map(({ col, label }) => {
                const active = sortBy === col;
                const Icon = active ? (sortDir === "asc" ? ChevronUp : ChevronDown) : null;
                return (
                  <button
                    key={col}
                    onClick={() => toggleSort(col)}
                    style={{
                      display: "flex", alignItems: "center", gap: 3,
                      fontSize: 11, fontWeight: active ? 700 : 500,
                      color: active ? "var(--text)" : "var(--text-dim)",
                      background: active ? "var(--surface-2)" : "transparent",
                      border: `1px solid ${active ? "var(--border-3)" : "var(--border)"}`,
                      borderRadius: 6, padding: "4px 10px", cursor: "pointer",
                      transition: "all 0.1s",
                    }}
                  >
                    {label}
                    {Icon && <Icon size={10} />}
                  </button>
                );
              })}
            </div>

            {/* Card grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 14,
            }}>
              {sorted.map((account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  scoring={scoring === account.id}
                  onRescore={runScore}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </>
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
