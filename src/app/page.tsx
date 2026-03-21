"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { BUCKET_LABELS } from "@/lib/engine/types";
import { Zap, RefreshCw, Loader2, ChevronRight, Plus } from "lucide-react";
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
    snap.scoreMeasurement,
    snap.scoreTraffic,
    snap.scoreConversion,
    snap.scoreFunnel,
    snap.scoreEconomics
  );
}

const BUCKET_COLOR: Record<ConstraintBucket, string> = {
  MEASUREMENT: "#c084fc",
  TRAFFIC:     "#60a5fa",
  CONVERSION:  "#fb923c",
  FUNNEL:      "#fbbf24",
  ECONOMICS:   "#4ade80",
};

const BUCKET_BG: Record<ConstraintBucket, string> = {
  MEASUREMENT: "rgba(192, 132, 252, 0.12)",
  TRAFFIC:     "rgba(96, 165, 250, 0.12)",
  CONVERSION:  "rgba(251, 146, 60, 0.12)",
  FUNNEL:      "rgba(251, 191, 36, 0.12)",
  ECONOMICS:   "rgba(74, 222, 128, 0.12)",
};

function scoreColor(s: number): string {
  if (s >= 80) return "#4ade80";
  if (s >= 60) return "#fbbf24";
  if (s >= 40) return "#fb923c";
  return "#f87171";
}

function healthLabel(s: number): { label: string; color: string } {
  if (s >= 70) return { label: "Healthy",  color: "#4ade80" };
  if (s >= 50) return { label: "At Risk",  color: "#fbbf24" };
  return             { label: "Critical",  color: "#f87171" };
}

const BUCKETS: ConstraintBucket[] = ["MEASUREMENT", "TRAFFIC", "CONVERSION", "FUNNEL", "ECONOMICS"];

const GOOGLE_LOGO = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// ─── Login screen ─────────────────────────────────────────────────────────────

function LoginPage() {
  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg)", color: "var(--text)",
      display: "flex", flexDirection: "column",
    }}>
      {/* Minimal header */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 32px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: "#fff",
          }}>C</div>
          <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: "-0.3px" }}>
            Constraint Optimizer
          </span>
        </div>
        <ThemeToggle />
      </header>

      {/* Centered login card */}
      <div style={{
        flex: 1,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 24px",
      }}>
        <div style={{
          width: "100%", maxWidth: 420, textAlign: "center",
        }}>
          {/* Logo */}
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, fontWeight: 700, color: "#fff",
            margin: "0 auto 28px",
            boxShadow: "0 8px 32px rgba(59,130,246,0.3)",
          }}>C</div>

          <h1 style={{
            fontSize: 26, fontWeight: 700, letterSpacing: "-0.6px",
            color: "var(--text)", marginBottom: 10,
          }}>
            Constraint Optimizer
          </h1>

          <p style={{
            fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6,
            marginBottom: 40, maxWidth: 320, margin: "0 auto 40px",
          }}>
            Find and fix the single constraint bottlenecking your Google Ads performance.
          </p>

          {/* Connect button */}
          <a
            href="/api/auth/google-ads"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
              background: "var(--surface)", border: "1px solid var(--border-3)",
              borderRadius: 12, color: "var(--text-2)",
              fontSize: 14, fontWeight: 600,
              padding: "13px 28px",
              textDecoration: "none", width: "100%",
              transition: "background 0.15s, border-color 0.15s",
              boxSizing: "border-box",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "var(--surface-hover)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-3)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "var(--surface)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-3)";
            }}
          >
            {GOOGLE_LOGO}
            Continue with Google
          </a>

          <p style={{
            fontSize: 11, color: "var(--text-faint)", marginTop: 16, lineHeight: 1.5,
          }}>
            Grants read access to your Google Ads MCC.{" "}
            <span style={{ color: "var(--text-dim)" }}>No data is shared.</span>
          </p>

          {/* Feature hints */}
          <div style={{
            display: "flex", gap: 8, justifyContent: "center", marginTop: 48,
            flexWrap: "wrap",
          }}>
            {[
              { color: "#c084fc", text: "Constraint scoring" },
              { color: "#60a5fa", text: "AI advisor" },
              { color: "#4ade80", text: "1-click fixes" },
            ].map((f) => (
              <div key={f.text} style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "var(--surface)", border: "1px solid var(--border-2)",
                borderRadius: 20, padding: "5px 12px",
                fontSize: 12, color: "var(--text-muted)",
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: f.color }} />
                {f.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

export default function HomePage() {
  const searchParams = useSearchParams();
  const authError = searchParams.get("auth_error");

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [scoring, setScoring] = useState<string | null>(null);
  const [scoringAll, setScoringAll] = useState(false);
  const [showImporter, setShowImporter] = useState(false);
  const [connected, setConnected] = useState<boolean | null>(null);
  const [autoImporting, setAutoImporting] = useState(false);
  const [autoImportError, setAutoImportError] = useState<string | null>(null);
  const [scoreAllResult, setScoreAllResult] = useState<{
    succeeded: string[];
    failed: { name: string; error: string }[];
  } | null>(null);

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
      .then((r) => r.json())
      .then((d) => {
        setConnected(d.connected);
        if (d.connected) loadAccounts();
        else setLoading(false);
      })
      .catch(() => { setConnected(false); setLoading(false); });
  }, [loadAccounts]);

  // Auto-import all accounts on first connection (when no accounts exist yet)
  useEffect(() => {
    if (!connected || loading || accounts.length > 0 || autoImporting) return;
    let cancelled = false;
    async function autoImport() {
      setAutoImporting(true);
      setAutoImportError(null);
      try {
        const res = await fetch("/api/google-ads/accounts");
        if (!res.ok) {
          const d = await res.json();
          setAutoImportError(d.error ?? "Could not load accounts from MCC.");
          return;
        }
        const mccAccounts: { googleAdsId: string; name: string; currency: string }[] = await res.json();
        if (mccAccounts.length === 0 || cancelled) return;
        await Promise.all(mccAccounts.map((a) =>
          fetch("/api/google-ads/accounts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ googleAdsId: a.googleAdsId, name: a.name, currency: a.currency }),
          })
        ));
        if (!cancelled) await loadAccounts();
      } catch {
        if (!cancelled) setAutoImportError("Network error while importing accounts.");
      } finally {
        if (!cancelled) setAutoImporting(false);
      }
    }
    autoImport();
    return () => { cancelled = true; };
  }, [connected, loading, accounts.length, autoImporting, loadAccounts]);

  const runScore = async (accountId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setScoring(accountId);
    try {
      await fetch(`/api/accounts/${accountId}/snapshot?source=google-ads`, { method: "POST" });
      await loadAccounts();
    } finally {
      setScoring(null);
    }
  };

  const runScoreAll = async () => {
    setScoringAll(true);
    setScoreAllResult(null);
    try {
      const res = await fetch("/api/accounts/score-all", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setScoreAllResult(data);
        await loadAccounts();
      }
    } finally {
      setScoringAll(false);
    }
  };

  // While checking connection status, show a minimal loader
  if (connected === null) {
    return (
      <div style={{
        minHeight: "100vh", background: "var(--bg)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Loader2 size={20} className="animate-spin" style={{ color: "var(--text-dim)" }} />
      </div>
    );
  }

  // Not connected → full login page
  if (connected === false) {
    return <LoginPage />;
  }

  // Sort by priority: lowest minScore first (most critical at top)
  const sorted = [...accounts].sort((a, b) => {
    const sa = a.snapshots?.[0] ? minScore(a.snapshots[0]) : 100;
    const sb = b.snapshots?.[0] ? minScore(b.snapshots[0]) : 100;
    return sa - sb;
  });

  const withSnaps = accounts.filter((a) => a.snapshots?.[0]);
  const critical  = withSnaps.filter((a) => minScore(a.snapshots[0]) < 50).length;
  const atRisk    = withSnaps.filter((a) => { const s = minScore(a.snapshots[0]); return s >= 50 && s < 70; }).length;
  const healthy   = withSnaps.filter((a) => minScore(a.snapshots[0]) >= 70).length;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>

      {/* Header */}
      <header style={{
        borderBottom: "1px solid var(--border)",
        padding: "0 32px",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        background: "var(--header-bg)",
        backdropFilter: "blur(12px)",
        zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: "#fff",
          }}>C</div>
          <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: "-0.3px" }}>
            Constraint Optimizer
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 5,
            fontSize: 12, color: "var(--text-muted)",
            background: "var(--surface-2)", border: "1px solid var(--border-2)",
            borderRadius: 8, padding: "6px 12px",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", flexShrink: 0 }} />
            Google Ads
          </div>

          <button
            onClick={() => setShowImporter(!showImporter)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "var(--surface-2)", border: "1px solid var(--border-2)",
              borderRadius: 8, color: "var(--text-muted)", fontSize: 13, fontWeight: 500,
              padding: "7px 14px", cursor: "pointer",
            }}
          >
            <Plus size={14} />
            Add accounts
          </button>

          {accounts.length > 1 && (
            <button
              onClick={runScoreAll}
              disabled={scoringAll || !!scoring}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: scoringAll ? "var(--surface-2)" : "#1d4ed8",
                border: "1px solid " + (scoringAll ? "var(--border-2)" : "#2563eb"),
                borderRadius: 8, color: scoringAll ? "var(--text-muted)" : "#fff",
                fontSize: 13, fontWeight: 500,
                padding: "7px 14px", cursor: scoringAll ? "not-allowed" : "pointer",
                opacity: scoringAll || !!scoring ? 0.6 : 1,
                transition: "all 0.15s",
              }}
            >
              {scoringAll
                ? <><Loader2 size={13} className="animate-spin" /> Scoring…</>
                : <><Zap size={13} /> Score all</>}
            </button>
          )}

          <ThemeToggle />
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>

        {/* Auth error banner */}
        {authError && (
          <div style={{
            background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)",
            borderRadius: 10, padding: "12px 16px", marginBottom: 20,
            fontSize: 13, color: "#f87171",
          }}>
            {authError === "missing_developer_token"
              ? "Developer token not set — add GOOGLE_ADS_DEVELOPER_TOKEN to your environment."
              : authError === "no_accounts"
              ? "No accessible Google Ads accounts found for this Google account."
              : `Authentication error: ${authError}`}
          </div>
        )}

        {/* Auto-import loading state */}
        {autoImporting && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.15)",
            borderRadius: 10, padding: "12px 16px", marginBottom: 20,
            fontSize: 13, color: "#60a5fa",
          }}>
            <Loader2 size={14} className="animate-spin" />
            Importing accounts from your MCC…
          </div>
        )}

        {/* Auto-import error */}
        {autoImportError && !autoImporting && (
          <div style={{
            background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)",
            borderRadius: 10, padding: "12px 16px", marginBottom: 20,
            fontSize: 13, color: "#f87171",
          }}>
            {autoImportError}
            <button
              onClick={() => { setAutoImportError(null); setAutoImporting(false); }}
              style={{ marginLeft: 12, fontSize: 11, color: "#f87171", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Importer panel (for manual use) */}
        {showImporter && (
          <div style={{ marginBottom: 28 }}>
            <AccountImporter
              onImported={() => { loadAccounts(); setShowImporter(false); }}
              onAuthFailed={() => setConnected(false)}
            />
          </div>
        )}

        {/* Score all result banner */}
        {scoreAllResult && (
          <div style={{
            background: scoreAllResult.failed.length > 0 ? "rgba(251,191,36,0.08)" : "rgba(74,222,128,0.08)",
            border: "1px solid " + (scoreAllResult.failed.length > 0 ? "rgba(251,191,36,0.2)" : "rgba(74,222,128,0.2)"),
            borderRadius: 10, padding: "12px 16px", marginBottom: 20,
            fontSize: 13,
            color: scoreAllResult.failed.length > 0 ? "#fbbf24" : "#4ade80",
          }}>
            {scoreAllResult.succeeded.length} accounts scored successfully
            {scoreAllResult.failed.length > 0 && ` · ${scoreAllResult.failed.length} failed: ${scoreAllResult.failed.map(f => f.name).join(", ")}`}
          </div>
        )}

        {/* Portfolio summary */}
        {withSnaps.length > 0 && (
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12, marginBottom: 32,
          }}>
            {[
              { label: "Total accounts", value: accounts.length, color: "var(--text-muted)" },
              { label: "Critical",  value: critical,  color: "#f87171" },
              { label: "At Risk",   value: atRisk,    color: "#fbbf24" },
              { label: "Healthy",   value: healthy,   color: "#4ade80" },
            ].map((stat) => (
              <div key={stat.label} style={{
                background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 12,
                padding: "16px 20px",
              }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: stat.color, letterSpacing: "-1px" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Section label */}
        {accounts.length > 0 && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 12,
          }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", color: "var(--text-dim)" }}>
              Priority ranking
            </span>
            <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
              Most critical first
            </span>
          </div>
        )}

        {/* Account list */}
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "80px 0", color: "var(--text-dim)" }}>
            <Loader2 size={18} className="animate-spin" />
            <span style={{ fontSize: 14 }}>Loading accounts…</span>
          </div>
        ) : sorted.length === 0 ? (
          <div style={{
            border: "1px dashed var(--border-3)", borderRadius: 16,
            padding: "60px 32px", textAlign: "center",
          }}>
            {autoImporting ? (
              <p style={{ color: "var(--text-dim)", fontSize: 14 }}>Importing accounts from your MCC…</p>
            ) : autoImportError ? (
              <>
                <p style={{ color: "#f87171", fontSize: 14, marginBottom: 8 }}>{autoImportError}</p>
                <p style={{ color: "var(--text-faint)", fontSize: 13 }}>
                  Click <strong style={{ color: "var(--text-muted)" }}>Add accounts</strong> to retry manually.
                </p>
              </>
            ) : (
              <>
                <p style={{ color: "var(--text-dim)", fontSize: 14, marginBottom: 8 }}>No accounts yet.</p>
                <p style={{ color: "var(--text-faint)", fontSize: 13 }}>
                  Click <strong style={{ color: "var(--text-muted)" }}>Add accounts</strong> to import from your MCC.
                </p>
              </>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {sorted.map((account, idx) => {
              const snap = account.snapshots?.[0];
              const bucket = snap?.governingConstraint as ConstraintBucket | undefined;
              const minS   = snap ? minScore(snap) : null;
              const health = minS !== null ? healthLabel(minS) : null;
              const isScoring = scoring === account.id;

              return (
                <Link
                  key={account.id}
                  href={`/accounts/${account.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 14,
                    padding: "18px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    cursor: "pointer",
                    transition: "border-color 0.15s, background 0.15s",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-3)";
                    (e.currentTarget as HTMLDivElement).style.background = "var(--surface-hover)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLDivElement).style.background = "var(--surface)";
                  }}
                  >
                    {/* Priority rank */}
                    <div style={{
                      width: 32, height: 32, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      borderRadius: 8,
                      background: minS !== null && minS < 50 ? "rgba(248,113,113,0.1)" : "var(--surface-2)",
                      border: "1px solid " + (minS !== null && minS < 50 ? "rgba(248,113,113,0.2)" : "var(--border-2)"),
                      fontSize: 13, fontWeight: 700,
                      color: minS !== null && minS < 50 ? "#f87171" : "var(--text-dim)",
                    }}>
                      {idx + 1}
                    </div>

                    {/* Account info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
                        <span style={{
                          fontSize: 14, fontWeight: 600, color: "var(--text-2)",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {account.name}
                        </span>
                        {bucket && (
                          <span style={{
                            fontSize: 10, fontWeight: 600, letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            background: BUCKET_BG[bucket],
                            color: BUCKET_COLOR[bucket],
                            padding: "2px 8px", borderRadius: 20,
                            flexShrink: 0,
                          }}>
                            {BUCKET_LABELS[bucket]}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-dim)" }}>
                        {account.googleAdsId}
                        {account.industry ? ` · ${account.industry}` : ""}
                      </div>

                      {/* 5 bucket mini bars */}
                      {snap ? (
                        <div style={{ display: "flex", gap: 4, marginTop: 10, alignItems: "center" }}>
                          {BUCKETS.map((b) => {
                            const score = {
                              MEASUREMENT: snap.scoreMeasurement,
                              TRAFFIC:     snap.scoreTraffic,
                              CONVERSION:  snap.scoreConversion,
                              FUNNEL:      snap.scoreFunnel,
                              ECONOMICS:   snap.scoreEconomics,
                            }[b];
                            const isGov = snap.governingConstraint === b;
                            return (
                              <div key={b} style={{ flex: 1 }}>
                                <div style={{
                                  fontSize: 9, color: isGov ? BUCKET_COLOR[b] : "var(--text-faint)",
                                  marginBottom: 3, fontWeight: isGov ? 700 : 400,
                                  letterSpacing: "0.3px",
                                }}>
                                  {b.slice(0, 3)}
                                </div>
                                <div style={{ height: 3, background: "var(--surface-3)", borderRadius: 2, overflow: "hidden" }}>
                                  <div style={{
                                    height: "100%", width: `${score}%`,
                                    background: isGov ? scoreColor(score) : "var(--border-3)",
                                    borderRadius: 2,
                                  }} />
                                </div>
                                <div style={{
                                  fontSize: 9, color: isGov ? scoreColor(score) : "var(--text-faint)",
                                  marginTop: 2, fontWeight: isGov ? 700 : 400,
                                }}>
                                  {score}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 8, fontStyle: "italic" }}>
                          Not scored yet
                        </div>
                      )}
                    </div>

                    {/* Right side */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, flexShrink: 0 }}>
                      {health && (
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: health.color }} />
                          <span style={{ fontSize: 12, fontWeight: 500, color: health.color }}>{health.label}</span>
                        </div>
                      )}

                      <button
                        onClick={(e) => runScore(account.id, e)}
                        disabled={isScoring}
                        style={{
                          display: "flex", alignItems: "center", gap: 5,
                          background: "transparent", border: "1px solid var(--border-2)",
                          borderRadius: 6, color: "var(--text-dim)", fontSize: 11, fontWeight: 500,
                          padding: "4px 10px", cursor: isScoring ? "not-allowed" : "pointer",
                          opacity: isScoring ? 0.5 : 1,
                        }}
                      >
                        {isScoring
                          ? <><Loader2 size={10} className="animate-spin" /> Scoring…</>
                          : <><RefreshCw size={10} /> Rescore</>}
                      </button>
                    </div>

                    <ChevronRight size={16} style={{ color: "var(--border-3)", flexShrink: 0 }} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
