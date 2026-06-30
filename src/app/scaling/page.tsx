"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RefreshCw, Loader2, TrendingUp, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { ScalingRow } from "@/app/api/scaling/route";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(h / 24);
  if (h < 1)  return "just now";
  if (h < 24) return `${h}h ago`;
  if (d < 7)  return `${d}d ago`;
  if (d < 60) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function RoasCell({ val, target }: { val: number | null; target: number | null }) {
  if (val === null) return <span style={{ color: "var(--text-faint)", fontSize: 13 }}>—</span>;
  const color = target
    ? val >= target ? "#22c55e" : val >= target * 0.85 ? "#f97316" : "#ef4444"
    : "var(--text)";
  return (
    <span style={{ fontSize: 13, fontWeight: 600, color }}>{val.toFixed(2)}x</span>
  );
}

function VerdictBadge({ row }: { row: ScalingRow }) {
  if (!row.scaling) {
    return (
      <span style={{ fontSize: 12, color: "var(--text-faint)", fontStyle: "italic" }}>
        {row.scalingError ?? "No data"}
      </span>
    );
  }
  const { readyToScale } = row.scaling;
  return (
    <span style={{
      display: "inline-block", fontSize: 11, fontWeight: 700,
      padding: "3px 10px", borderRadius: 20,
      background: readyToScale ? "rgba(34,197,94,0.12)" : "rgba(113,113,122,0.10)",
      color: readyToScale ? "#22c55e" : "var(--text-dim)",
    }}>
      {readyToScale ? "↑ Ready to scale" : "Not yet"}
    </span>
  );
}

export default function ScalingPage() {
  const [rows, setRows]       = useState<ScalingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/scaling");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ScalingRow[] = await res.json();
      setRows(data);
      setFetchedAt(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const readyCount = rows.filter(r => r.scaling?.readyToScale).length;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex" }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, flexShrink: 0, borderRight: "1px solid var(--border)",
        background: "var(--surface)", display: "flex", flexDirection: "column",
        height: "100vh", position: "sticky", top: 0,
      }}>
        <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid var(--border)" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "inherit" }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.3px" }}>ecomtrada<span style={{ color: "#F9C31F" }}>.</span></div>
            </div>
          </Link>
        </div>
        <nav style={{ padding: "10px 10px", flex: 1 }}>
          <Link href="/" style={{
            display: "flex", alignItems: "center", gap: 9,
            padding: "8px 10px", borderRadius: 7,
            color: "var(--text-muted)", fontSize: 13, fontWeight: 400,
            textDecoration: "none", transition: "background 0.12s", marginBottom: 1,
          }}
          onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = "var(--surface-2)"}
          onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = "transparent"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
            </svg>
            Dashboard
          </Link>
          <div style={{
            display: "flex", alignItems: "center", gap: 9,
            padding: "8px 10px", borderRadius: 7,
            background: "var(--accent-dim)",
            color: "var(--text)", fontSize: 13, fontWeight: 600, marginBottom: 1,
          }}>
            <TrendingUp size={14} style={{ color: "var(--accent)" }} />
            Scaling
          </div>
          <Link href="/settings" style={{
            display: "flex", alignItems: "center", gap: 9,
            padding: "8px 10px", borderRadius: 7,
            color: "var(--text-muted)", fontSize: 13, fontWeight: 400,
            textDecoration: "none", transition: "background 0.12s",
          }}
          onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = "var(--surface-2)"}
          onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = "transparent"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a1 1 0 0 0-1.41 0l-.71.71a7 7 0 0 0-9.9 9.9l-.71.71a1 1 0 1 0 1.41 1.41l.71-.71a7 7 0 0 0 9.9-9.9l.71-.71a1 1 0 0 0 0-1.41z"/>
            </svg>
            Settings
          </Link>
        </nav>
        <div style={{ padding: "12px 14px", borderTop: "1px solid var(--border)" }}>
          <ThemeToggle />
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "32px 32px" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", margin: 0, letterSpacing: "-0.4px" }}>
                Scaling overview
              </h1>
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "4px 0 0" }}>
                ROAS trends and last budget increase across all accounts.
                {fetchedAt && !loading && (
                  <span style={{ color: "var(--text-faint)" }}> · Fetched {timeAgo(fetchedAt.toISOString())}</span>
                )}
              </p>
            </div>
            <button
              onClick={load}
              disabled={loading}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "var(--surface-2)", border: "1px solid var(--border-2)",
                borderRadius: 8, color: "var(--text-muted)", fontSize: 13, fontWeight: 500,
                padding: "8px 14px", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.5 : 1,
              }}
            >
              {loading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
              Refresh
            </button>
          </div>

          {/* Summary chips */}
          {!loading && rows.length > 0 && (
            <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
              <div style={{
                padding: "8px 16px", borderRadius: 10,
                background: readyCount > 0 ? "rgba(34,197,94,0.08)" : "var(--surface)",
                border: `1px solid ${readyCount > 0 ? "rgba(34,197,94,0.25)" : "var(--border)"}`,
                fontSize: 13,
              }}>
                <span style={{ fontWeight: 700, color: readyCount > 0 ? "#22c55e" : "var(--text-muted)" }}>
                  {readyCount}
                </span>
                <span style={{ color: "var(--text-muted)", marginLeft: 5 }}>
                  {readyCount === 1 ? "account" : "accounts"} ready to scale
                </span>
              </div>
              <div style={{
                padding: "8px 16px", borderRadius: 10,
                background: "var(--surface)", border: "1px solid var(--border)", fontSize: 13,
              }}>
                <span style={{ fontWeight: 700, color: "var(--text-muted)" }}>
                  {rows.filter(r => r.scaling && !r.scaling.readyToScale).length}
                </span>
                <span style={{ color: "var(--text-muted)", marginLeft: 5 }}>not ready</span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              padding: "12px 16px", borderRadius: 10, marginBottom: 20,
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
              fontSize: 13, color: "#ef4444",
            }}>
              {error}
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: 12, padding: "60px 0", color: "var(--text-muted)",
            }}>
              <Loader2 size={24} className="animate-spin" style={{ color: "var(--accent)" }} />
              <span style={{ fontSize: 14 }}>
                Fetching live ROAS data from Google Ads…
              </span>
              <span style={{ fontSize: 12, color: "var(--text-faint)" }}>
                This pulls fresh data for each account — usually 10–30s
              </span>
            </div>
          )}

          {/* Table */}
          {!loading && rows.length > 0 && (
            <div style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 12, overflow: "hidden",
            }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Account", "Last scaled", "7d ROAS", "14d ROAS", "30d ROAS", "IS lost (7d)", "Verdict"].map(h => (
                      <th key={h} style={{
                        padding: "10px 16px", textAlign: "left",
                        fontSize: 11, fontWeight: 600, letterSpacing: "0.4px",
                        textTransform: "uppercase", color: "var(--text-faint)",
                        background: "var(--surface-2)",
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr
                      key={row.id}
                      style={{ borderBottom: i < rows.length - 1 ? "1px solid var(--border)" : "none" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-2)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "")}
                    >
                      {/* Account */}
                      <td style={{ padding: "14px 16px" }}>
                        <Link href={`/accounts/${row.id}`} style={{ textDecoration: "none" }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", letterSpacing: "-0.2px" }}>
                            {row.name}
                          </div>
                          {row.industry && (
                            <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>{row.industry}</div>
                          )}
                          {row.targetRoas && (
                            <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 1 }}>
                              Target: {row.targetRoas}x
                            </div>
                          )}
                        </Link>
                      </td>

                      {/* Last scaled */}
                      <td style={{ padding: "14px 16px" }}>
                        {row.lastScaledDate ? (
                          <div>
                            <div style={{ fontSize: 13, color: "var(--text)" }}>
                              {timeAgo(row.lastScaledDate)}
                            </div>
                            {row.lastScaledFrom != null && row.lastScaledTo != null && (
                              <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>
                                {row.currency === "EUR" ? "€" : row.currency === "GBP" ? "£" : "$"}
                                {row.lastScaledFrom}/d → {row.currency === "EUR" ? "€" : row.currency === "GBP" ? "£" : "$"}
                                {row.lastScaledTo}/d
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <span style={{ fontSize: 12, color: "var(--text-faint)", fontStyle: "italic" }}>
                              No change detected
                            </span>
                            {row.scaling?.currentDailyBudget != null && (
                              <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>
                                Current: {row.currency === "EUR" ? "€" : row.currency === "GBP" ? "£" : "$"}
                                {Math.round(row.scaling.currentDailyBudget)}/d
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      {/* ROAS windows */}
                      <td style={{ padding: "14px 16px" }}>
                        <RoasCell val={row.scaling?.roas7d ?? null} target={row.targetRoas} />
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <RoasCell val={row.scaling?.roas14d ?? null} target={row.targetRoas} />
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <RoasCell val={row.scaling?.roas30d ?? null} target={row.targetRoas} />
                      </td>

                      {/* IS lost to budget (7d) */}
                      <td style={{ padding: "14px 16px" }}>
                        {row.scaling?.budgetUtil7d != null ? (
                          <span style={{
                            fontSize: 13, fontWeight: 600,
                            color: row.scaling.budgetUtil7d > 0.15 ? "#f97316"
                                 : row.scaling.budgetUtil7d > 0.05 ? "#eab308"
                                 : "var(--text-muted)",
                          }}>
                            {Math.round(row.scaling.budgetUtil7d * 100)}%
                          </span>
                        ) : (
                          <span style={{ fontSize: 13, color: "var(--text-faint)" }}>—</span>
                        )}
                      </td>

                      {/* Verdict */}
                      <td style={{ padding: "14px 16px" }}>
                        <div>
                          <VerdictBadge row={row} />
                          {row.scaling?.scalingNote && (
                            <div style={{
                              fontSize: 11, color: "var(--text-muted)", marginTop: 5,
                              lineHeight: 1.4, maxWidth: 240,
                            }}>
                              {row.scaling.scalingNote}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && rows.length === 0 && !error && (
            <div style={{
              padding: "60px 0", textAlign: "center",
              color: "var(--text-muted)", fontSize: 14,
            }}>
              No accounts found.
              <Link href="/" style={{ display: "block", marginTop: 12, color: "var(--accent)", fontSize: 13 }}>
                ← Back to dashboard
              </Link>
            </div>
          )}

          <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 20, lineHeight: 1.6 }}>
            ROAS = conv. value / cost (all campaigns, last N days to yesterday). ·
            IS lost to budget is search-only — 0% for Shopping/PMax is expected. ·
            Last scaled = detected from consecutive account scores (budget stored at each rescore).
            Accounts without a budget history yet will show "Not detected yet" until rescored twice.
          </p>
        </div>
      </main>
    </div>
  );
}
