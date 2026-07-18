/**
 * The agency's operating doctrine (AGENCY_PHILOSOPHY), made CONSULTABLE instead
 * of blanket-injected. The agent pulls a section only when it recognises a
 * trigger — an impression-share / CTR / CVR / ROAS pattern, a segmentation or
 * scaling or bidding question, a lifecycle judgment — so the house playbook
 * informs the read where it fits, without forcing ecommerce/ProductHero framing
 * onto every account or pushing doctrine-driven conclusions the data doesn't back.
 */
import { AGENCY_PHILOSOPHY } from "@/lib/agencyPhilosophy";
import { ECOMTRADA_WAY_OF_WORK } from "@/lib/wayOfWork";
import { loadKnowledgeBase, knowledgeBaseSummary } from "./knowledge-base";

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

// The Ecomtrada Way of Work is our canonical, principle-first thinking; the
// legacy AGENCY_PHILOSOPHY adds the granular pattern library. Index both so a
// trigger can pull whichever section fits — Way of Work leads (listed first).
const SECTIONS = [...parseSections(ECOMTRADA_WAY_OF_WORK), ...parseSections(AGENCY_PHILOSOPHY)];

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
interface Candidate { label: string; title: string; body: string; lc: string; }

// The full searchable corpus: the hand-written doctrine (Way of Work +
// Philosophy) PLUS every SOP / mental model / checklist / guideline in the
// knowledge base. Doctrine is labelled "Playbook"; KB docs carry their category.
function candidates(): Candidate[] {
  const doctrine: Candidate[] = SECTIONS.map(s => ({ label: "Playbook", title: s.title, body: s.body, lc: s.body.toLowerCase() }));
  const kb: Candidate[] = loadKnowledgeBase().map(d => ({ label: d.category, title: d.title, body: d.text, lc: d.lc }));
  return [...doctrine, ...kb];
}

/**
 * Return the doctrine section(s) and knowledge-base doc(s) most relevant to
 * `query` — a keyword search over our whole corpus. Empty/blank or no-match
 * returns what's available so the agent can pick a topic, never a guess. Each
 * hit is excerpted so three long SOPs can't blow the context window.
 */
export function lookupPlaybook(query: string, maxChars = 4200): string {
  const q = tokenize(query);
  const scope = `It covers our doctrine plus ${knowledgeBaseSummary()} — search by naming a task, pattern, or decision.`;
  if (!q.length) return `Our playbook + knowledge base. ${scope}`;

  const scored = candidates().map(c => {
    const titleToks = new Set(tokenize(c.title));
    let score = 0;
    for (const w of q) {
      if (titleToks.has(w)) score += 6; // a title hit is a strong signal
      score += Math.min(c.lc.split(w).length - 1, 4); // body occurrences, capped
    }
    return { c, score };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score);

  if (!scored.length) return `Nothing in our playbook or knowledge base clearly matches that. ${scope}`;

  const perDoc = 1600;
  const picked: string[] = [];
  let used = 0;
  for (const { c } of scored.slice(0, 3)) {
    const excerpt = c.body.length > perDoc ? `${c.body.slice(0, perDoc).trimEnd()} …[truncated]` : c.body;
    const block = `### [${c.label}] ${c.title}\n${excerpt}`;
    if (used + block.length > maxChars && picked.length) break;
    picked.push(block);
    used += block.length;
  }
  return `From our playbook + knowledge base (apply only where it fits THIS account's type and what the data actually shows — doctrine to reason with, not a script to force):\n\n${picked.join("\n\n")}`;
}
