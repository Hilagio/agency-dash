"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { BUCKET_LABELS } from "@/lib/engine/types";
import { Zap, RefreshCw, Loader2, ChevronRight, Plus } from "lucide-react";
import { AccountImporter } from "@/components/AccountImporter";

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

function MiniScoreBar({ score, active }: { score: number; active: boolean }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{
        height: 3,
        borderRadius: 2,
        background: "#1e1e1e",
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          width: `${score}%`,
          borderRadius: 2,
          background: active ? scoreColor(score) : "#333",
          transition: "width 0.5s ease",
        }} />
      </div>
    </div>
  );
}

export default function HomePage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [scoring, setScoring] = useState<string | null>(null);
  const [scoringAll, setScoringAll] = useState(false);
  const [showImporter, setShowImporter] = useState(false);
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

  useEffect(() => { loadAccounts(); }, [loadAccounts]);

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
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#f0f0f0" }}>

      {/* Header */}
      <header style={{
        borderBottom: "1px solid #1a1a1a",
        padding: "0 32px",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        background: "rgba(10,10,10,0.9)",
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

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => setShowImporter(!showImporter)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "#1a1a1a", border: "1px solid #2a2a2a",
              borderRadius: 8, color: "#aaa", fontSize: 13, fontWeight: 500,
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
                background: scoringAll ? "#1a1a1a" : "#1d4ed8",
                border: "1px solid " + (scoringAll ? "#2a2a2a" : "#2563eb"),
                borderRadius: 8, color: scoringAll ? "#666" : "#fff",
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
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>

        {/* Importer panel */}
        {showImporter && (
          <div style={{ marginBottom: 28 }}>
            <AccountImporter onImported={() => { loadAccounts(); setShowImporter(false); }} />
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
              { label: "Total accounts", value: accounts.length, color: "#888" },
              { label: "Critical",  value: critical,  color: "#f87171" },
              { label: "At Risk",   value: atRisk,    color: "#fbbf24" },
              { label: "Healthy",   value: healthy,   color: "#4ade80" },
            ].map((stat) => (
              <div key={stat.label} style={{
                background: "#111", border: "1px solid #1e1e1e", borderRadius: 12,
                padding: "16px 20px",
              }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: stat.color, letterSpacing: "-1px" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{stat.label}</div>
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
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", color: "#444" }}>
              Priority ranking
            </span>
            <span style={{ fontSize: 11, color: "#444" }}>
              Most critical first
            </span>
          </div>
        )}

        {/* Account list */}
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "80px 0", color: "#444" }}>
            <Loader2 size={18} className="animate-spin" />
            <span style={{ fontSize: 14 }}>Loading accounts…</span>
          </div>
        ) : sorted.length === 0 ? (
          <div style={{
            border: "1px dashed #222", borderRadius: 16,
            padding: "60px 32px", textAlign: "center",
          }}>
            <p style={{ color: "#555", fontSize: 14 }}>No accounts yet.</p>
            <p style={{ color: "#333", fontSize: 13, marginTop: 6 }}>
              Click <strong style={{ color: "#666" }}>Add accounts</strong> above to import from your MCC.
            </p>
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
                    background: "#111",
                    border: "1px solid #1a1a1a",
                    borderRadius: 14,
                    padding: "18px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    cursor: "pointer",
                    transition: "border-color 0.15s, background 0.15s",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#2a2a2a";
                    (e.currentTarget as HTMLDivElement).style.background = "#141414";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#1a1a1a";
                    (e.currentTarget as HTMLDivElement).style.background = "#111";
                  }}
                  >
                    {/* Priority rank */}
                    <div style={{
                      width: 32, height: 32, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      borderRadius: 8,
                      background: minS !== null && minS < 50 ? "rgba(248,113,113,0.1)" : "#1a1a1a",
                      border: "1px solid " + (minS !== null && minS < 50 ? "rgba(248,113,113,0.2)" : "#222"),
                      fontSize: 13, fontWeight: 700,
                      color: minS !== null && minS < 50 ? "#f87171" : "#444",
                    }}>
                      {idx + 1}
                    </div>

                    {/* Account info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
                        <span style={{
                          fontSize: 14, fontWeight: 600, color: "#e8e8e8",
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
                      <div style={{ fontSize: 11, color: "#444" }}>
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
                                  fontSize: 9, color: isGov ? BUCKET_COLOR[b] : "#333",
                                  marginBottom: 3, fontWeight: isGov ? 700 : 400,
                                  letterSpacing: "0.3px",
                                }}>
                                  {b.slice(0, 3)}
                                </div>
                                <div style={{ height: 3, background: "#1e1e1e", borderRadius: 2, overflow: "hidden" }}>
                                  <div style={{
                                    height: "100%", width: `${score}%`,
                                    background: isGov ? scoreColor(score) : "#2a2a2a",
                                    borderRadius: 2,
                                  }} />
                                </div>
                                <div style={{
                                  fontSize: 9, color: isGov ? scoreColor(score) : "#333",
                                  marginTop: 2, fontWeight: isGov ? 700 : 400,
                                }}>
                                  {score}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div style={{ fontSize: 11, color: "#333", marginTop: 8, fontStyle: "italic" }}>
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
                          background: "transparent", border: "1px solid #222",
                          borderRadius: 6, color: "#555", fontSize: 11, fontWeight: 500,
                          padding: "4px 10px", cursor: isScoring ? "not-allowed" : "pointer",
                          opacity: isScoring ? 0.5 : 1,
                        }}
                      >
                        {isScoring
                          ? <><Loader2 size={10} className="animate-spin" /> Scoring…</>
                          : <><RefreshCw size={10} /> Rescore</>}
                      </button>
                    </div>

                    <ChevronRight size={16} style={{ color: "#2a2a2a", flexShrink: 0 }} />
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
