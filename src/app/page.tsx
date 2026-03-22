"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { BUCKET_LABELS } from "@/lib/engine/types";
import { Zap, RefreshCw, Loader2, Plus, AlertTriangle, TrendingUp, BookOpen } from "lucide-react";
import { AccountImporter } from "@/components/AccountImporter";
import { ThemeToggle } from "@/components/ThemeToggle";

type ConstraintBucket = "MEASUREMENT" | "TRAFFIC" | "CONVERSION" | "FUNNEL" | "ECONOMICS";

interface Snapshot {
  scoreMeasurement: number;
  scoreTraffic: number;
  scoreConversion: number;
  scoreFunnel: number;
  scoreEconomics: number;
  governingConstraint: string;
  constraintReason: string;
  roas: number;
  budgetUtil: number;
  createdAt: string;
}

interface Account {
  id: string;
  name: string;
  googleAdsId: string;
  industry: string | null;
  monthlyBudget: number | null;
  currency: string;
  snapshots: Snapshot[];
}

function minScore(snap: Snapshot): number {
  return Math.min(
    snap.scoreMeasurement, snap.scoreTraffic, snap.scoreConversion,
    snap.scoreFunnel, snap.scoreEconomics,
  );
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
  if (s >= 50) return "#eab308";
  return "#ef4444";
}

function fmt(n: number, digits = 1) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toFixed(digits);
}

// ─── Login screen ──────────────────────────────────────────────────────────────

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
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, fontWeight: 700, color: "#fff", margin: "0 auto 24px",
        }}>C</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 8, letterSpacing: "-0.4px" }}>
          Constraint Optimizer
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 32, lineHeight: 1.6 }}>
          Find and fix the single bottleneck limiting your Google Ads performance.
        </p>
        <a href="/api/auth/google-ads" style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
          background: "var(--surface)", border: "1px solid var(--border-3)",
          borderRadius: 10, color: "var(--text-2)", fontSize: 13, fontWeight: 600,
          padding: "12px 24px", textDecoration: "none", width: "100%", boxSizing: "border-box",
        }}>
          {GOOGLE_LOGO} Continue with Google
        </a>
      </div>
    </div>
  );
}

// ─── Account row ───────────────────────────────────────────────────────────────

function AccountRow({
  account, index, scoring, onRescore,
}: {
  account: Account;
  index: number;
  scoring: boolean;
  onRescore: (id: string, e: React.MouseEvent) => void;
}) {
  const snap    = account.snapshots[0];
  const score   = snap ? minScore(snap) : null;
  const bucket  = snap?.governingConstraint as ConstraintBucket | undefined;
  const color   = score !== null ? scoreColor(score) : "var(--text-dim)";

  const severityBar = score !== null && score < 50 ? "#ef4444"
    : score !== null && score < 70 ? "#eab308"
    : null;

  return (
    <Link href={`/accounts/${account.id}`} style={{ textDecoration: "none", display: "block" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "40px 1fr 80px 80px 64px 120px 80px",
          alignItems: "center",
          gap: 12,
          padding: "12px 20px",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg)",
          cursor: "pointer",
          transition: "background 0.1s",
          borderLeft: severityBar ? `3px solid ${severityBar}` : "3px solid transparent",
          paddingLeft: 17,
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--surface)"}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--bg)"}
      >
        {/* Rank */}
        <span style={{ fontSize: 12, color: "var(--text-faint)", textAlign: "center" }}>{index + 1}</span>

        {/* Name + ID */}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {account.name}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 1 }}>{account.googleAdsId}</div>
        </div>

        {/* Health score — made impossible to ignore */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {score !== null ? (
            <div style={{
              display: "inline-flex", flexDirection: "column", alignItems: "center",
              background: color + "18",
              border: `1px solid ${color}40`,
              borderRadius: 8, padding: "4px 10px", minWidth: 52,
            }}>
              <span style={{ fontSize: 17, fontWeight: 800, color, letterSpacing: "-0.8px", lineHeight: 1 }}>
                {Math.round(score)}
              </span>
              <span style={{ fontSize: 9, fontWeight: 700, color, letterSpacing: "0.5px", textTransform: "uppercase", marginTop: 1 }}>
                {score < 50 ? "Critical" : score < 70 ? "At risk" : "OK"}
              </span>
            </div>
          ) : (
            <div style={{ fontSize: 11, color: "var(--text-faint)", fontStyle: "italic" }}>—</div>
          )}
        </div>

        {/* ROAS */}
        <div style={{ textAlign: "right" }}>
          {snap && snap.roas > 0 ? (
            <>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-2)", letterSpacing: "-0.3px" }}>{fmt(snap.roas)}x</div>
              <div style={{ fontSize: 10, color: "var(--text-faint)" }}>ROAS</div>
            </>
          ) : (
            <div style={{ fontSize: 11, color: "var(--text-faint)" }}>—</div>
          )}
        </div>

        {/* Budget util */}
        <div style={{ textAlign: "right" }}>
          {snap && snap.budgetUtil > 0 ? (
            <>
              <div style={{ fontSize: 13, fontWeight: 600, color: snap.budgetUtil > 0.9 ? "#22c55e" : snap.budgetUtil > 0.6 ? "var(--text-2)" : "#ef4444", letterSpacing: "-0.3px" }}>
                {Math.round(snap.budgetUtil * 100)}%
              </div>
              <div style={{ fontSize: 10, color: "var(--text-faint)" }}>budget</div>
            </>
          ) : (
            <div style={{ fontSize: 11, color: "var(--text-faint)" }}>—</div>
          )}
        </div>

        {/* Constraint */}
        <div>
          {bucket ? (
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: "0.4px", textTransform: "uppercase",
              color: BUCKET_COLOR[bucket],
              background: BUCKET_COLOR[bucket] + "18",
              padding: "3px 8px", borderRadius: 20,
            }}>
              {BUCKET_LABELS[bucket]}
            </span>
          ) : (
            <span style={{ fontSize: 11, color: "var(--text-faint)", fontStyle: "italic" }}>not scored</span>
          )}
        </div>

        {/* Rescore */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={(e) => onRescore(account.id, e)}
            disabled={scoring}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "transparent", border: "1px solid var(--border-2)",
              borderRadius: 6, color: "var(--text-dim)", fontSize: 11,
              padding: "4px 10px", cursor: scoring ? "not-allowed" : "pointer",
              opacity: scoring ? 0.4 : 1,
            }}
          >
            {scoring ? <Loader2 size={10} className="animate-spin" /> : <RefreshCw size={10} />}
            {scoring ? "…" : "Rescore"}
          </button>
        </div>
      </div>
    </Link>
  );
}

// ─── Main dashboard ────────────────────────────────────────────────────────────

function HomePageInner() {
  const searchParams   = useSearchParams();
  const authError      = searchParams.get("auth_error");

  const [accounts, setAccounts]             = useState<Account[]>([]);
  const [loading, setLoading]               = useState(true);
  const [scoring, setScoring]               = useState<string | null>(null);
  const [scoringAll, setScoringAll]         = useState(false);
  const [scoringProgress, setScoringProgress] = useState<{ done: number; total: number } | null>(null);
  const [showImporter, setShowImporter]     = useState(false);
  const [connected, setConnected]           = useState<boolean | null>(null);
  const [autoImporting, setAutoImporting]   = useState(false);
  const [autoImportError, setAutoImportError] = useState<string | null>(null);
  const autoImportAttempted = useRef(false);

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/accounts");
      if (res.ok) setAccounts(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/auth/google-ads/status")
      .then(r => r.json())
      .then(d => { setConnected(d.connected); if (d.connected) loadAccounts(); else setLoading(false); })
      .catch(() => { setConnected(false); setLoading(false); });
  }, [loadAccounts]);

  // Auto-import then auto-score on first connection
  useEffect(() => {
    if (!connected || loading || accounts.length > 0 || autoImportAttempted.current) return;
    autoImportAttempted.current = true;
    let cancelled = false;

    async function run() {
      setAutoImporting(true);
      setAutoImportError(null);
      try {
        const res = await fetch("/api/google-ads/accounts");
        if (!res.ok) { setAutoImportError((await res.json()).error ?? "Could not load accounts."); return; }
        const mccAccounts: { googleAdsId: string; name: string; currency: string }[] = await res.json();
        if (cancelled) return;
        if (mccAccounts.length === 0) { setAutoImportError("No accounts found under this Google Ads account."); return; }

        // Import all
        await Promise.all(mccAccounts.map(a =>
          fetch("/api/google-ads/accounts", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ googleAdsId: a.googleAdsId, name: a.name, currency: a.currency }),
          })
        ));
        if (cancelled) return;
        await loadAccounts();

        // Auto-score all immediately after import
        if (!cancelled) {
          setScoringAll(true);
          const scoreRes = await fetch("/api/accounts/score-all", { method: "POST" });
          if (scoreRes.ok && !cancelled) await loadAccounts();
          setScoringAll(false);
        }
      } catch {
        if (!cancelled) setAutoImportError("Network error while importing accounts.");
      } finally {
        if (!cancelled) setAutoImporting(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [connected, loading, accounts.length, loadAccounts]);

  const runScore = async (accountId: string, e: React.MouseEvent) => {
    e.preventDefault();
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
      // Score one by one for progress tracking
      const unscored = accounts.filter(a => !a.snapshots[0]);
      const all      = accounts;
      const toScore  = unscored.length > 0 ? unscored : all;
      setScoringProgress({ done: 0, total: toScore.length });
      for (let i = 0; i < toScore.length; i++) {
        await fetch(`/api/accounts/${toScore[i].id}/snapshot?source=google-ads`, { method: "POST" });
        setScoringProgress({ done: i + 1, total: toScore.length });
      }
      await loadAccounts();
    } finally {
      setScoringAll(false);
      setScoringProgress(null);
    }
  };

  // Stats
  const scored   = accounts.filter(a => a.snapshots[0]);
  const critical = scored.filter(a => minScore(a.snapshots[0]) < 50).length;
  const atRisk   = scored.filter(a => { const s = minScore(a.snapshots[0]); return s >= 50 && s < 70; }).length;
  const healthy  = scored.filter(a => minScore(a.snapshots[0]) >= 70).length;

  // Sort: critical first, then unscored
  const sorted = [...accounts].sort((a, b) => {
    const sa = a.snapshots[0] ? minScore(a.snapshots[0]) : 101;
    const sb = b.snapshots[0] ? minScore(b.snapshots[0]) : 101;
    return sa - sb;
  });

  if (connected === null) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 size={18} className="animate-spin" style={{ color: "var(--text-dim)" }} />
      </div>
    );
  }
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
          <div style={{
            width: 24, height: 24, borderRadius: 6,
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, color: "#fff",
          }}>C</div>
          <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: "-0.3px", color: "var(--text)" }}>
            Constraint Optimizer
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {accounts.length > 0 && (
            <button onClick={runScoreAll} disabled={scoringAll || !!scoring} style={{
              display: "flex", alignItems: "center", gap: 6,
              background: scoringAll ? "var(--surface-2)" : "#1d4ed8",
              border: "none", borderRadius: 7, color: scoringAll ? "var(--text-muted)" : "#fff",
              fontSize: 12, fontWeight: 600, padding: "6px 14px", cursor: scoringAll ? "not-allowed" : "pointer",
              opacity: scoringAll || !!scoring ? 0.7 : 1,
            }}>
              {scoringAll
                ? <><Loader2 size={12} className="animate-spin" />
                    {scoringProgress ? `${scoringProgress.done}/${scoringProgress.total}` : "Scoring…"}</>
                : <><Zap size={12} /> Score all</>}
            </button>
          )}
          <Link href="/sops" style={{
            display: "flex", alignItems: "center", gap: 5,
            background: "var(--surface)", border: "1px solid var(--border-2)",
            borderRadius: 7, color: "var(--text-muted)", fontSize: 12,
            padding: "6px 12px", textDecoration: "none",
          }}>
            <BookOpen size={12} /> SOPs
          </Link>
          <button onClick={() => setShowImporter(!showImporter)} style={{
            display: "flex", alignItems: "center", gap: 5,
            background: "var(--surface)", border: "1px solid var(--border-2)",
            borderRadius: 7, color: "var(--text-muted)", fontSize: 12,
            padding: "6px 12px", cursor: "pointer",
          }}>
            <Plus size={12} /> Add accounts
          </button>
          <ThemeToggle />
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px" }}>

        {/* Auth error */}
        {authError && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#ef4444" }}>
            {authError === "missing_developer_token" ? "Developer token not set." : `Auth error: ${authError}`}
          </div>
        )}

        {/* Auto-import progress */}
        {(autoImporting || scoringAll) && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#60a5fa" }}>
            <Loader2 size={13} className="animate-spin" />
            {autoImporting ? "Importing accounts from Google Ads…" : scoringProgress
              ? `Scoring accounts… ${scoringProgress.done} / ${scoringProgress.total}`
              : "Scoring all accounts…"}
          </div>
        )}

        {/* Auto-import error */}
        {autoImportError && !autoImporting && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#ef4444", display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={13} />
            {autoImportError}
            <button onClick={() => { setAutoImportError(null); autoImportAttempted.current = false; }}
              style={{ marginLeft: "auto", fontSize: 11, color: "#ef4444", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
              Retry
            </button>
          </div>
        )}

        {/* Importer panel */}
        {showImporter && (
          <div style={{ marginBottom: 20 }}>
            <AccountImporter onImported={() => { loadAccounts(); setShowImporter(false); }} onAuthFailed={() => setConnected(false)} />
          </div>
        )}

        {/* Stats bar */}
        {scored.length > 0 && (
          <div style={{ display: "flex", gap: 20, marginBottom: 20, padding: "12px 20px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10 }}>
            <Stat label="Total" value={accounts.length} color="var(--text-muted)" />
            <div style={{ width: 1, background: "var(--border)" }} />
            <Stat label="Critical" value={critical} color="#ef4444" />
            <Stat label="At risk" value={atRisk} color="#eab308" />
            <Stat label="Healthy" value={healthy} color="#22c55e" />
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
              <TrendingUp size={13} style={{ color: "var(--text-dim)" }} />
              <span style={{ fontSize: 12, color: "var(--text-dim)" }}>{scored.length} scored</span>
            </div>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "60px 0", color: "var(--text-dim)", fontSize: 13 }}>
            <Loader2 size={16} className="animate-spin" /> Loading accounts…
          </div>
        ) : sorted.length === 0 ? (
          <div style={{ border: "1px dashed var(--border-3)", borderRadius: 12, padding: "48px 32px", textAlign: "center" }}>
            <p style={{ color: "var(--text-dim)", fontSize: 14, marginBottom: 6 }}>No accounts yet.</p>
            <p style={{ color: "var(--text-faint)", fontSize: 12 }}>Click <strong>Add accounts</strong> to import from your Google Ads MCC.</p>
          </div>
        ) : (
          <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
            {/* Table header */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "40px 1fr 80px 80px 64px 120px 80px",
              gap: 12, padding: "8px 20px",
              background: "var(--surface)",
              borderBottom: "1px solid var(--border)",
            }}>
              {["#", "Account", "Score", "ROAS", "Budget", "Bottleneck", ""].map((h, i) => (
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
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 size={18} className="animate-spin" style={{ color: "var(--text-dim)" }} />
      </div>
    }>
      <HomePageInner />
    </Suspense>
  );
}
