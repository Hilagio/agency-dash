"use client";

/**
 * Compact live 90-day-plan card for the account page — the CRM glue between
 * the account and the /plans board. Shows where the plan stands (day X of 90,
 * progress, next step + owner) and the LAST CHANGE (who, what, when), with
 * one-click routes to the board, the checklist and the plan generator.
 * Self-contained: fetches its own data, renders nothing heavy.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList, ChevronRight } from "lucide-react";

interface Action { action: string; who: string; when: string; dropped?: boolean }
interface LiveResp {
  active: boolean;
  startedAt?: string;
  content?: { phases?: { title: string; actions?: Action[] }[] };
  states?: { path: string; status: string; assignee: string | null }[];
  events?: { at: string; by: string | null; detail: string }[];
}

const ago = (iso: string) => {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  return d <= 0 ? "today" : d === 1 ? "yesterday" : `${d}d ago`;
};

export function LivePlanCard({ accountId }: { accountId: string }) {
  const [data, setData] = useState<LiveResp | null>(null);

  useEffect(() => {
    fetch(`/api/accounts/${accountId}/plan/live`, { credentials: "include" })
      .then(r => (r.ok ? r.json() : null)).then(j => { if (j) setData(j); }).catch(() => {});
  }, [accountId]);

  if (!data) return null;

  const card: React.CSSProperties = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14 };

  if (!data.active) {
    return (
      <div style={{ ...card, marginTop: 12, padding: "11px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <ClipboardList size={15} style={{ color: "var(--text-dim)", flexShrink: 0 }} />
        <span style={{ fontSize: 12.5, color: "var(--text-3)", flex: 1 }}>No live 90-day plan on this account yet.</span>
        <Link href={`/plan/${accountId}`} style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", textDecoration: "none", whiteSpace: "nowrap" }}>Create &amp; activate a plan →</Link>
      </div>
    );
  }

  // Progress + next open action, dropped actions excluded.
  const states = new Map((data.states ?? []).map(s => [s.path, s]));
  let total = 0, done = 0;
  let next: { action: string; phase: string; assignee: string | null } | null = null;
  (data.content?.phases ?? []).forEach((ph, pi) => (ph.actions ?? []).forEach((a, ai) => {
    if (a.dropped) return;
    total += 1;
    const st = states.get(`p${pi}a${ai}`);
    if (st?.status === "done") done += 1;
    else if (!next) next = { action: a.action, phase: ph.title, assignee: st?.assignee ?? null };
  }));
  const day = data.startedAt ? Math.min(90, Math.max(1, Math.floor((Date.now() - new Date(data.startedAt).getTime()) / 86_400_000) + 1)) : 1;
  const last = data.events?.[0];
  const finished = total > 0 && done >= total;

  return (
    <div style={{ ...card, marginTop: 12, padding: "13px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <ClipboardList size={15} style={{ color: "var(--accent)", flexShrink: 0 }} />
        <span style={{ fontSize: 12.5, fontWeight: 700 }}>Live 90-day plan</span>
        <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>day {day} of 90</span>
        <div style={{ flex: 1, minWidth: 90, height: 7, borderRadius: 4, background: "var(--surface-2)", border: "1px solid var(--border-2)", overflow: "hidden" }}>
          <div style={{ width: `${total > 0 ? (done / total) * 100 : 0}%`, height: "100%", background: "var(--accent)" }} />
        </div>
        <span style={{ fontSize: 11.5, color: "var(--text-3)", fontVariantNumeric: "tabular-nums" }}>{done}/{total}</span>
        <Link href={`/plans?open=${accountId}`} style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 700, color: "var(--accent)", textDecoration: "none", whiteSpace: "nowrap" }}>Open on team board <ChevronRight size={13} /></Link>
      </div>
      {!finished && next && (
        <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 7, lineHeight: 1.5 }}>
          <b style={{ color: "var(--text-muted)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: 0.4 }}>Next</b>{" "}
          {(next as { action: string }).action}
          <span style={{ color: "var(--text-dim)" }}> · {(next as { assignee: string | null }).assignee ? (next as { assignee: string | null }).assignee!.split("@")[0] : "unassigned"}</span>
        </div>
      )}
      {last && (
        <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          <b>Last change</b> {ago(last.at)}{last.by ? ` · ${last.by.split("@")[0]}` : ""} — {last.detail}
        </div>
      )}
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <a href={`/api/accounts/${accountId}/plan/live?format=checklist`} target="_blank" rel="noreferrer" style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-3)", textDecoration: "underline" }}>Checklist</a>
        <a href={`/api/accounts/${accountId}/plan/live?format=html`} target="_blank" rel="noreferrer" style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-3)", textDecoration: "underline" }}>Client document</a>
        <Link href={`/plan/${accountId}`} style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-3)", textDecoration: "underline" }}>Update the plan</Link>
      </div>
    </div>
  );
}
