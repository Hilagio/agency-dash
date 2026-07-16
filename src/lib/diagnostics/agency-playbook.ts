/**
 * The agency's operating doctrine (AGENCY_PHILOSOPHY), made CONSULTABLE instead
 * of blanket-injected. The agent pulls a section only when it recognises a
 * trigger — an impression-share / CTR / CVR / ROAS pattern, a segmentation or
 * scaling or bidding question, a lifecycle judgment — so the house playbook
 * informs the read where it fits, without forcing ecommerce/ProductHero framing
 * onto every account or pushing doctrine-driven conclusions the data doesn't back.
 */
import { AGENCY_PHILOSOPHY } from "@/lib/agencyPhilosophy";

interface Section { title: string; body: string }

// Split the doctrine into labelled sections on its own headers: top-level
// "--- TITLE ---" and the pattern-library "== TITLE ==".
function parseSections(doc: string): Section[] {
  const out: Section[] = [];
  let title = "Overview";
  let buf: string[] = [];
  const flush = () => { const body = buf.join("\n").trim(); if (body) out.push({ title, body }); buf = []; };
  for (const line of doc.split("\n")) {
    const m = line.match(/^\s*(?:---\s*(.+?)\s*---|==\s*(.+?)\s*==)\s*$/);
    if (m) { flush(); title = (m[1] ?? m[2] ?? "").trim(); continue; }
    buf.push(line);
  }
  flush();
  return out;
}

const SECTIONS = parseSections(AGENCY_PHILOSOPHY);

const STOP = new Set(["the", "and", "for", "with", "that", "this", "what", "when", "how", "why", "our", "are", "does", "did", "has", "have", "was", "were", "you", "your", "about", "into", "from", "not", "but", "should", "would", "could", "a", "an", "of", "to", "in", "is", "it", "on", "or", "be", "we", "i"]);
const tokenize = (s: string) => s.toLowerCase().match(/[a-z][a-z0-9]{2,}/g)?.filter(w => !STOP.has(w)) ?? [];

/** All section titles — a compact index the agent can steer by. */
export function playbookIndex(): string {
  return SECTIONS.map(s => s.title).join(" · ");
}

/**
 * Return the doctrine section(s) most relevant to `query` — a mini keyword
 * search over our own playbook. Empty/blank query returns the index so the
 * agent can pick a topic; no strong match returns the index too, never a guess.
 */
export function lookupPlaybook(query: string, maxChars = 3200): string {
  const q = tokenize(query);
  if (!q.length) return `Our playbook covers these topics — call again naming the one that fits:\n${playbookIndex()}`;
  const scored = SECTIONS.map(s => {
    const titleToks = new Set(tokenize(s.title));
    const bodyLc = s.body.toLowerCase();
    let score = 0;
    for (const w of q) {
      if (titleToks.has(w)) score += 5;
      const inBody = bodyLc.split(w).length - 1;
      score += Math.min(inBody, 4); // cap so one word can't dominate
    }
    return { s, score };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score);

  if (!scored.length) return `No section of our playbook clearly matches that. Available topics:\n${playbookIndex()}`;

  const picked: string[] = [];
  let used = 0;
  for (const { s } of scored.slice(0, 3)) {
    const block = `### ${s.title}\n${s.body}`;
    if (used + block.length > maxChars && picked.length) break;
    picked.push(block.length > maxChars ? block.slice(0, maxChars) : block);
    used += block.length;
    if (used >= maxChars) break;
  }
  return `From our agency playbook (apply only where it fits THIS account's type and what the data actually shows):\n\n${picked.join("\n\n")}`;
}
