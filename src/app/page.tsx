"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { BUCKET_LABELS } from "@/lib/engine/types";
import { AlertCircle, CheckCircle, TrendingDown, ArrowRight, RefreshCw, Loader2 } from "lucide-react";
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

function overallHealth(score: number): { label: string; color: string; icon: React.ReactNode } {
  if (score >= 70) return { label: "Healthy", color: "text-green-600", icon: <CheckCircle className="h-4 w-4" /> };
  if (score >= 50) return { label: "At Risk", color: "text-yellow-600", icon: <TrendingDown className="h-4 w-4" /> };
  return { label: "Critical", color: "text-red-600", icon: <AlertCircle className="h-4 w-4" /> };
}

export default function HomePage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [scoring, setScoring] = useState<string | null>(null);

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

  const runScore = async (accountId: string) => {
    setScoring(accountId);
    try {
      await fetch(`/api/accounts/${accountId}/snapshot?source=google-ads`, { method: "POST" });
      await loadAccounts();
    } finally {
      setScoring(null);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Constraint Optimizer</h1>
              <p className="text-sm text-gray-500">Fix the right thing first.</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              {accounts.length} accounts
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            <strong>Core principle:</strong> Every account has one governing constraint.
            Fix it before touching anything else. Sequence: Measurement → Traffic → Conversion → Funnel → Economics.
          </p>
        </div>

        {/* MCC account importer */}
        <div className="mb-6">
          <AccountImporter onImported={loadAccounts} />
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading accounts…
          </div>
        ) : accounts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 p-12 text-center">
            <p className="text-gray-500">No accounts yet.</p>
            <p className="mt-1 text-sm text-gray-400">
              Import from your MCC above, or run{" "}
              <code className="rounded bg-gray-100 px-1 text-xs">npm run db:seed</code> for demo data.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {accounts.map((account) => {
              const snap = account.snapshots?.[0];
              const bucket = snap?.governingConstraint as ConstraintBucket | undefined;
              const min = snap ? minScore(snap) : 100;
              const health = overallHealth(min);
              const isScoring = scoring === account.id;

              return (
                <div key={account.id} className="rounded-xl border border-gray-100 bg-white shadow-sm">
                  <Link
                    href={`/accounts/${account.id}`}
                    className="group block p-5 hover:bg-gray-50 rounded-t-xl transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h2 className="font-semibold text-gray-900 group-hover:text-blue-700">
                          {account.name}
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {account.googleAdsId} · {account.industry ?? "General"} · {account.currency}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 flex-shrink-0 text-gray-300 group-hover:text-blue-500 mt-1" />
                    </div>

                    {snap ? (
                      <>
                        {bucket && (
                          <div className="mt-4 flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${
                              bucket === "MEASUREMENT" ? "bg-purple-500" :
                              bucket === "TRAFFIC"     ? "bg-blue-500"   :
                              bucket === "CONVERSION"  ? "bg-orange-500" :
                              bucket === "FUNNEL"      ? "bg-yellow-500" : "bg-green-600"
                            }`} />
                            <span className="text-xs font-medium text-gray-700">
                              Constraint: {BUCKET_LABELS[bucket]}
                            </span>
                          </div>
                        )}

                        <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                          {snap.constraintReason}
                        </p>

                        <div className="mt-4 space-y-1.5">
                          {(
                            [
                              ["MEASUREMENT", snap.scoreMeasurement],
                              ["TRAFFIC",     snap.scoreTraffic],
                              ["CONVERSION",  snap.scoreConversion],
                              ["FUNNEL",      snap.scoreFunnel],
                              ["ECONOMICS",   snap.scoreEconomics],
                            ] as [ConstraintBucket, number][]
                          ).map(([b, score]) => (
                            <div key={b} className="flex items-center gap-2">
                              <span className="w-20 flex-shrink-0 text-xs text-gray-400 truncate">
                                {BUCKET_LABELS[b]}
                              </span>
                              <div className="flex-1 h-1 rounded-full bg-gray-100">
                                <div
                                  className={`h-full rounded-full ${
                                    score >= 80 ? "bg-green-400" :
                                    score >= 60 ? "bg-yellow-400" :
                                    score >= 40 ? "bg-orange-400" : "bg-red-500"
                                  }`}
                                  style={{ width: `${score}%` }}
                                />
                              </div>
                              <span className="w-6 flex-shrink-0 text-right text-xs tabular-nums text-gray-500">
                                {score}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className={`mt-3 flex items-center gap-1 text-xs font-medium ${health.color}`}>
                          {health.icon}
                          {health.label}
                        </div>
                      </>
                    ) : (
                      <p className="mt-3 text-xs text-gray-400 italic">
                        No score yet — run scoring below
                      </p>
                    )}
                  </Link>

                  {/* Score action — outside the Link */}
                  <div className="border-t border-gray-50 px-5 py-3">
                    <button
                      onClick={() => runScore(account.id)}
                      disabled={isScoring}
                      className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-blue-700 disabled:opacity-50"
                    >
                      {isScoring ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <RefreshCw className="h-3.5 w-3.5" />
                      )}
                      {isScoring ? "Scoring from Google Ads…" : "Score from Google Ads"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
