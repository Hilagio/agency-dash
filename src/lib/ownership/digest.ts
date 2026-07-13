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
  status: OwnershipStatus;
  reasons: RuleResult[];
}

const EMOJI: Record<OwnershipStatus, string> = { green: "🟢", yellow: "🟡", red: "🔴" };
const LABEL: Record<OwnershipStatus, string> = {
  green: "Under control", yellow: "Action needed", red: "Immediate action",
};
const RANK: Record<OwnershipStatus, number> = { red: 0, yellow: 1, green: 2 };

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
  const counts = { green: 0, yellow: 0, red: 0 };
  for (const e of entries) counts[e.status]++;

  const header = [
    `🕵️ *Ownership shadow digest* — ${formatDate(now)}`,
    `Pilot: ${entries.length} account${entries.length === 1 ? "" : "s"} · ` +
      `${EMOJI.green} ${counts.green}  ${EMOJI.yellow} ${counts.yellow}  ${EMOJI.red} ${counts.red}`,
  ].join("\n");

  if (entries.length === 0) {
    return header + "\n\n_No accounts have ownership enabled yet._";
  }

  const sorted = [...entries].sort((a, b) => RANK[a.status] - RANK[b.status] || a.name.localeCompare(b.name));

  const lines: string[] = [];
  for (const e of sorted) {
    const client = e.clientName ? ` (${e.clientName})` : "";
    lines.push(`\n${EMOJI[e.status]} *${e.name}*${client} — ${LABEL[e.status]}${ownerTag(e.ownerName)}`);
    if (e.status !== "green") {
      for (const r of e.reasons) lines.push(`    • ${r.message}`);
    }
  }

  return header + "\n" + lines.join("\n");
}
