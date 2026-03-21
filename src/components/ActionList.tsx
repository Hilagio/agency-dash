"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Zap, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { ConstraintBadge } from "./ConstraintBadge";
import { BUCKET_LABELS } from "@/lib/engine/types";

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

interface Props {
  actions: Action[];
  onStatusChange?: (id: string, status: "APPROVED" | "DISMISSED") => void;
  onExecute?: (id: string) => void;
}

const IMPACT_STYLES: Record<string, string> = {
  HIGH:   "bg-red-100 text-red-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  LOW:    "bg-gray-100 text-gray-600",
};

const EFFORT_STYLES: Record<string, string> = {
  EASY:   "bg-green-100 text-green-700",
  MEDIUM: "bg-blue-100 text-blue-700",
  HARD:   "bg-orange-100 text-orange-700",
};

export function ActionList({ actions, onStatusChange, onExecute }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [executing, setExecuting] = useState<string | null>(null);

  if (actions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-gray-400">
        No pending actions — account is healthy!
      </div>
    );
  }

  const handleExecute = async (id: string) => {
    setExecuting(id);
    await onExecute?.(id);
    setExecuting(null);
  };

  return (
    <div className="space-y-2">
      {actions.map((action) => (
        <div
          key={action.id}
          className={`rounded-xl border transition-all ${
            action.status === "EXECUTED"
              ? "border-green-200 bg-green-50 opacity-60"
              : action.status === "DISMISSED"
              ? "border-gray-100 bg-gray-50 opacity-40"
              : action.isEscalation
              ? "border-amber-200 bg-amber-50"
              : "border-gray-100 bg-white hover:border-gray-200"
          }`}
        >
          <div className="flex items-start gap-3 p-4">
            {action.isEscalation && (
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
            )}
            {action.safeToAutomate && !action.isEscalation && (
              <Zap className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
            )}
            {!action.safeToAutomate && !action.isEscalation && (
              <div className="mt-0.5 h-4 w-4 flex-shrink-0" />
            )}

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <ConstraintBadge bucket={action.bucket as Parameters<typeof ConstraintBadge>[0]["bucket"]} />
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${IMPACT_STYLES[action.impact]}`}>
                  {action.impact} impact
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${EFFORT_STYLES[action.effort]}`}>
                  {action.effort} effort
                </span>
                {action.safeToAutomate && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                    1-click
                  </span>
                )}
                {action.isEscalation && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                    client escalation
                  </span>
                )}
              </div>

              <p className="font-medium text-gray-900 text-sm">{action.title}</p>

              {expanded === action.id && (
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {action.description}
                </p>
              )}
            </div>

            <div className="flex flex-shrink-0 items-center gap-1">
              <button
                onClick={() => setExpanded(expanded === action.id ? null : action.id)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                {expanded === action.id ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {action.status === "PENDING" && (
                <>
                  {action.safeToAutomate && (
                    <button
                      onClick={() => onStatusChange?.(action.id, "APPROVED")}
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => onStatusChange?.(action.id, "DISMISSED")}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-500"
                    title="Dismiss"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </>
              )}

              {action.status === "APPROVED" && action.safeToAutomate && (
                <button
                  onClick={() => handleExecute(action.id)}
                  disabled={executing === action.id}
                  className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                >
                  <Zap className="h-3 w-3" />
                  {executing === action.id ? "Running…" : "Execute"}
                </button>
              )}

              {action.status === "EXECUTED" && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
