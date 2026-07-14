// ─── Shadow-mode digest (AGENTS.md §9) ────────────────────────────────────────
// During the pilot the engine posts NOTHING to client channels. It posts one
// daily digest to the internal ownership channel so the AM can compare the
// engine's colour against their own judgement and we can tune thresholds.
// Pure + presentation-only — no DB / Slack calls here.

import { OwnershipStatus, RuleResult } from "./types";

export interface DigestEntry {
  name: string;
  clientName?: string | null;
  ownerName?: string | null;
  /** null = the account could not be evaluated this run (shown, never dropped). */
  status: OwnershipStatus | null;
  reasons: RuleResult[];
  /** Stale-data or failure note, e.g. "couldn't refresh — showing status from 12 Jul". */
  note?: string;
  /** Absolute URL to the diagnostic workspace for this account, if resolvable. */
  link?: string;
}

// "unknown" (status === null) is a presentation-only bucket for accounts we
// couldn't evaluate — it never touches the DB status enum.
type DisplayStatus = OwnershipStatus | "unknown";
const EMOJI: Record<DisplayStatus, string> = { green: "🟢", yellow: "🟡", red: "🔴", unknown: "⚪" };
const LABEL: Record<DisplayStatus, string> = {
  green: "Under control", yellow: "Action needed", red: "Immediate action", unknown: "Couldn't evaluate",
};
const RANK: Record<DisplayStatus, number> = { red: 0, yellow: 1, unknown: 2, green: 3 };
const disp = (s: OwnershipStatus | null): DisplayStatus => s ?? "unknown";

/** Format a single date as e.g. "13 Jul 2026" (UTC, locale-independent). */
function formatDate(d: Date): string {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function ownerTag(name?: string | null): string {
  return name ? ` · Owner: ${name}` : "";
}

/**
 * Compose the internal shadow digest as Slack mrkdwn text.
 * Accounts are grouped worst-first (red → yellow → green); red/yellow list their
 * triggered reasons, green is a single line.
 */
export function composeShadowDigest(entries: DigestEntry[], now: Date): string {
  const counts: Record<DisplayStatus, number> = { green: 0, yellow: 0, red: 0, unknown: 0 };
  for (const e of entries) counts[disp(e.status)]++;

  const summary =
    `${EMOJI.green} ${counts.green}  ${EMOJI.yellow} ${counts.yellow}  ${EMOJI.red} ${counts.red}` +
    (counts.unknown ? `  ${EMOJI.unknown} ${counts.unknown}` : "");

  const header = [
    `🕵️ *Ownership shadow digest* — ${formatDate(now)}`,
    `Pilot: ${entries.length} account${entries.length === 1 ? "" : "s"} · ${summary}`,
  ].join("\n");

  if (entries.length === 0) {
    return header + "\n\n_No accounts have ownership enabled yet._";
  }

  const sorted = [...entries].sort((a, b) => RANK[disp(a.status)] - RANK[disp(b.status)] || a.name.localeCompare(b.name));

  const lines: string[] = [];
  for (const e of sorted) {
    const d = disp(e.status);
    const client = e.clientName ? ` (${e.clientName})` : "";
    const note = e.note ? ` · _${e.note}_` : "";
    lines.push(`\n${EMOJI[d]} *${e.name}*${client} — ${LABEL[d]}${ownerTag(e.ownerName)}${note}`);
    if (d !== "green") {
      for (const r of e.reasons) lines.push(`    • ${r.message}`);
      if (e.link) lines.push(`    → <${e.link}|Open diagnosis>`);
    }
  }

  return header + "\n" + lines.join("\n");
}
