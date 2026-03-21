"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RefreshCw, MessageSquare, ListChecks, BarChart2 } from "lucide-react";
import { ScoreBuckets } from "@/components/ScoreBuckets";
import { ActionList } from "@/components/ActionList";
import { ChatAssistant } from "@/components/ChatAssistant";
import { BUCKET_LABELS } from "@/lib/engine/types";

type Tab = "overview" | "actions" | "chat";

interface Snapshot {
  id: string;
  createdAt: string;
  governingConstraint: string;
  constraintReason: string;
  scoreMeasurement: number;
  scoreTraffic: number;
  scoreConversion: number;
  scoreFunnel: number;
  scoreEconomics: number;
  actions: Action[];
}

interface Action {
  id: string;
  bucket: string;
  title: string;
  description: string;
  impact: string;
  effort: string;
  safeToAutomate: boolean;
  actionType: string;
  status: string;
  isEscalation: boolean;
}

interface Account {
  id: string;
  name: string;
  googleAdsId: string;
  industry: string | null;
  monthlyBudget: number | null;
  currency: string;
}

function buildBuckets(snap: Snapshot) {
  return [
    { bucket: "MEASUREMENT", score: snap.scoreMeasurement, isGoverning: snap.governingConstraint === "MEASUREMENT", signals: [] },
    { bucket: "TRAFFIC",     score: snap.scoreTraffic,     isGoverning: snap.governingConstraint === "TRAFFIC",     signals: [] },
    { bucket: "CONVERSION",  score: snap.scoreConversion,  isGoverning: snap.governingConstraint === "CONVERSION",  signals: [] },
    { bucket: "FUNNEL",      score: snap.scoreFunnel,      isGoverning: snap.governingConstraint === "FUNNEL",      signals: [] },
    { bucket: "ECONOMICS",   score: snap.scoreEconomics,   isGoverning: snap.governingConstraint === "ECONOMICS",   signals: [] },
  ];
}

const CONSTRAINT_BG: Record<string, string> = {
  MEASUREMENT: "from-purple-600 to-purple-800",
  TRAFFIC:     "from-blue-600 to-blue-800",
  CONVERSION:  "from-orange-500 to-orange-700",
  FUNNEL:      "from-yellow-500 to-yellow-700",
  ECONOMICS:   "from-green-600 to-green-800",
};

export default function AccountPage() {
  const { id } = useParams<{ id: string }>();
  const [account, setAccount] = useState<Account | null>(null);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [actions, setActions] = useState<Action[]>([]);
  const [tab, setTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [acctRes, snapRes] = await Promise.all([
        fetch(`/api/accounts`),
        fetch(`/api/accounts/${id}/snapshot`),
      ]);

      if (!acctRes.ok) throw new Error("Failed to load account");
      const accounts: Account[] = await acctRes.json();
      const acct = accounts.find((a) => a.id === id);
      if (!acct) throw new Error("Account not found");
      setAccount(acct);

      if (snapRes.ok) {
        const snap: Snapshot = await snapRes.json();
        setSnapshot(snap);
        setActions(snap.actions ?? []);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (actionId: string, status: "APPROVED" | "DISMISSED") => {
    await fetch(`/api/actions/${actionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setActions((prev) =>
      prev.map((a) => (a.id === actionId ? { ...a, status } : a))
    );
  };

  const handleExecute = async (actionId: string) => {
    const res = await fetch(`/api/actions/${actionId}`, { method: "POST" });
    if (res.ok) {
      const updated: Action = await res.json();
      setActions((prev) => prev.map((a) => (a.id === actionId ? updated : a)));
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-red-600">{error ?? "Account not found"}</p>
        <Link href="/" className="text-blue-600 hover:underline">← Back to accounts</Link>
      </div>
    );
  }

  const buckets = snapshot ? buildBuckets(snapshot) : [];
  const constraint = snapshot?.governingConstraint ?? "MEASUREMENT";
  const constraintLabel = BUCKET_LABELS[constraint as keyof typeof BUCKET_LABELS] ?? constraint;
  const gradientClass = CONSTRAINT_BG[constraint] ?? "from-gray-600 to-gray-800";

  const pendingActions = actions.filter((a) => a.status === "PENDING");
  const automatable = pendingActions.filter((a) => a.safeToAutomate);

  const TABS: { key: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { key: "overview", label: "Constraint Overview", icon: <BarChart2 className="h-4 w-4" /> },
    { key: "actions",  label: "Actions", icon: <ListChecks className="h-4 w-4" />, badge: pendingActions.length },
    { key: "chat",     label: "Advisor", icon: <MessageSquare className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen">
      {/* Top nav */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-3">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
            All accounts
          </Link>
        </div>
      </div>

      {/* Constraint hero */}
      {snapshot && (
        <div className={`bg-gradient-to-r ${gradientClass} text-white`}>
          <div className="mx-auto max-w-5xl px-6 py-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium opacity-80">{account.name}</p>
                <h1 className="mt-1 text-2xl font-bold">
                  Governing Constraint: {constraintLabel}
                </h1>
                <p className="mt-1 max-w-xl text-sm opacity-90">{snapshot.constraintReason}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {automatable.length > 0 && (
                  <div className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                    {automatable.length} action{automatable.length !== 1 ? "s" : ""} ready to run
                  </div>
                )}
                <button
                  onClick={load}
                  className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium hover:bg-white/20"
                >
                  <RefreshCw className="h-3 w-3" />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-6">
          <nav className="flex gap-0">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  tab === t.key
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                {t.icon}
                {t.label}
                {t.badge !== undefined && t.badge > 0 && (
                  <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-xs font-bold text-blue-700">
                    {t.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-6 py-6">
        {tab === "overview" && (
          <div>
            {!snapshot ? (
              <div className="rounded-xl border border-dashed border-gray-200 p-12 text-center text-gray-400">
                No snapshot available for this account yet.
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Bucket Health Scores</h2>
                  <p className="text-xs text-gray-400">
                    Last scored {new Date(snapshot.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <ScoreBuckets buckets={buckets} />

                <div className="mt-6 rounded-xl border border-gray-100 bg-white p-5">
                  <h3 className="mb-3 font-semibold text-gray-900 text-sm">What this means</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      The <strong>{constraintLabel}</strong> bucket is your governing constraint — the single biggest
                      bottleneck blocking performance growth. All optimization effort should focus here first.
                    </p>
                    <p>
                      Fixing downstream buckets (later in the sequence) while this is broken will produce
                      sub-optimal or misleading results.
                    </p>
                    <p>
                      Switch to the <strong>Actions</strong> tab to see the prioritized list of moves,
                      or use the <strong>Advisor</strong> to reason through the problem.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {tab === "actions" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">Recommended Actions</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Governing constraint first. <span className="text-blue-600">⚡ 1-click</span> = safe to automate.{" "}
                  <span className="text-amber-600">⚠ escalation</span> = requires client.
                </p>
              </div>
            </div>
            <ActionList
              actions={actions}
              onStatusChange={handleStatusChange}
              onExecute={handleExecute}
            />
          </div>
        )}

        {tab === "chat" && snapshot && (
          <div className="h-[600px] rounded-xl border border-gray-100 bg-gray-50 overflow-hidden">
            <ChatAssistant
              accountId={id}
              constraintBucket={constraintLabel}
              constraintReason={snapshot.constraintReason}
            />
          </div>
        )}

        {tab === "chat" && !snapshot && (
          <div className="rounded-xl border border-dashed border-gray-200 p-12 text-center text-gray-400">
            Run a constraint score first before using the advisor.
          </div>
        )}
      </div>
    </div>
  );
}
