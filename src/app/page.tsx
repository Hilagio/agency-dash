/**
 * Home: Account selector — shows all accounts with their current constraint health.
 */
import Link from "next/link";
import { prisma } from "@/lib/db";
import { BUCKET_LABELS } from "@/lib/engine/types";
import { AlertCircle, CheckCircle, TrendingDown, ArrowRight } from "lucide-react";

type ConstraintBucket = "MEASUREMENT" | "TRAFFIC" | "CONVERSION" | "FUNNEL" | "ECONOMICS";

const BUCKET_BAR_COLORS: Record<ConstraintBucket, string> = {
  MEASUREMENT: "bg-purple-500",
  TRAFFIC:     "bg-blue-500",
  CONVERSION:  "bg-orange-500",
  FUNNEL:      "bg-yellow-500",
  ECONOMICS:   "bg-green-600",
};

function minScore(snap: {
  scoreMeasurement: number;
  scoreTraffic: number;
  scoreConversion: number;
  scoreFunnel: number;
  scoreEconomics: number;
}): number {
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

export default async function HomePage() {
  const accounts = await prisma.account.findMany({
    orderBy: { name: "asc" },
    include: {
      snapshots: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

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
        <div className="mb-8 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            <strong>Core principle:</strong> Every account has one governing constraint.
            Fix it before touching anything else. Sequence: Measurement → Traffic → Conversion → Funnel → Economics.
          </p>
        </div>

        {accounts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 p-12 text-center">
            <p className="text-gray-500">No accounts yet. Run the seed script to add demo accounts.</p>
            <code className="mt-2 block text-sm text-gray-400">npm run db:seed</code>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {accounts.map((account) => {
              const snap = account.snapshots[0];
              const bucket = snap?.governingConstraint as ConstraintBucket | undefined;
              const min = snap ? minScore(snap) : 100;
              const health = overallHealth(min);

              return (
                <Link
                  key={account.id}
                  href={`/accounts/${account.id}`}
                  className="group rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-gray-900 group-hover:text-blue-700">
                        {account.name}
                      </h2>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {account.googleAdsId} · {account.industry ?? "General"}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-gray-300 group-hover:text-blue-500 mt-1" />
                  </div>

                  {snap ? (
                    <>
                      {bucket && (
                        <div className="mt-4 flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${BUCKET_BAR_COLORS[bucket]}`} />
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
                      No snapshot yet — open to run scoring
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
