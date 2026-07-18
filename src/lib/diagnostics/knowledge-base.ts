/**
 * The agency's knowledge base — the SOPs, mental models, checklists, guidelines,
 * playbooks and theory in /knowledge-base — loaded so the diagnostic agent can
 * actually search and cite them (via consult_playbook), not leave them as dead
 * files. Read from disk once and cached; degrades to empty if the directory
 * isn't present (e.g. a stripped build), so callers never break.
 */
import fs from "node:fs";
import path from "node:path";

export interface KbDoc {
  category: string; // human label — "SOP", "Mental model", "Checklist", …
  title: string;    // cleaned file name
  text: string;
  lc: string;       // lower-cased text, precomputed for search
}

// The reasoning docs the agent benefits from. references/ and catalogs/ are raw
// reference data, left out of the searchable set for now (add later if useful).
const DIRS: Record<string, string> = {
  sops: "SOP",
  "mental-models": "Mental model",
  checklists: "Checklist",
  guidelines: "Guideline",
  playbooks: "Playbook",
  theory: "Theory",
};

let CACHE: KbDoc[] | null = null;

function cleanTitle(file: string): string {
  return file
    .replace(/\.md$/i, "")
    .replace(/^SOP\s*#?\S*\s+/i, "") // drop the "SOP #U2013 " numbering prefix
    .replace(/\s+/g, " ")
    .trim();
}

export function loadKnowledgeBase(): KbDoc[] {
  if (CACHE) return CACHE;
  const root = path.join(process.cwd(), "knowledge-base");
  const docs: KbDoc[] = [];
  for (const [dir, label] of Object.entries(DIRS)) {
    let files: string[];
    try { files = fs.readdirSync(path.join(root, dir)).filter(f => f.toLowerCase().endsWith(".md")); }
    catch { continue; }
    for (const f of files) {
      try {
        const text = fs.readFileSync(path.join(root, dir, f), "utf8");
        if (text.trim()) docs.push({ category: label, title: cleanTitle(f) || f, text, lc: text.toLowerCase() });
      } catch { /* skip unreadable file */ }
    }
  }
  CACHE = docs;
  return docs;
}

/** e.g. "90 SOPs, 34 mental models, 20 checklists, …" — for the index reply. */
export function knowledgeBaseSummary(): string {
  const byCat = new Map<string, number>();
  for (const d of loadKnowledgeBase()) byCat.set(d.category, (byCat.get(d.category) ?? 0) + 1);
  return [...byCat.entries()].map(([c, n]) => `${n} ${c.toLowerCase()}${n === 1 ? "" : "s"}`).join(", ") || "no docs found";
}
