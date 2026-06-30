import fs from "fs";
import path from "path";

interface KBFile {
  category: string;
  title: string;
  content: string;
}

let _cache: KBFile[] | null = null;

function loadKB(): KBFile[] {
  if (_cache) return _cache;

  const kbDir = path.join(process.cwd(), "knowledge-base");
  if (!fs.existsSync(kbDir)) return (_cache = []);

  const files: KBFile[] = [];
  for (const category of fs.readdirSync(kbDir)) {
    const catDir = path.join(kbDir, category);
    if (!fs.statSync(catDir).isDirectory()) continue;
    for (const file of fs.readdirSync(catDir)) {
      if (!file.endsWith(".md")) continue;
      try {
        const content = fs.readFileSync(path.join(catDir, file), "utf-8");
        files.push({ category, title: file.replace(/\.md$/, ""), content });
      } catch { /* skip unreadable files */ }
    }
  }

  return (_cache = files);
}

// Which KB categories are most relevant per constraint bucket
const BUCKET_CATEGORIES: Record<string, string[]> = {
  MEASUREMENT: ["checklists", "guidelines", "sops"],
  TRAFFIC:     ["guidelines", "mental-models", "sops"],
  CONVERSION:  ["checklists", "mental-models", "sops"],
  FUNNEL:      ["mental-models", "theory", "sops"],
  ECONOMICS:   ["mental-models", "theory", "guidelines"],
};

// Keywords that boost relevance for each bucket
const BUCKET_KEYWORDS: Record<string, string[]> = {
  MEASUREMENT: ["conversion", "tracking", "tag", "measurement", "goal", "attribution", "gtm"],
  TRAFFIC:     ["keyword", "search term", "match type", "quality score", "impression share", "sqr", "negative"],
  CONVERSION:  ["landing page", "conversion rate", "cvr", "mobile", "cro", "page quality", "speed"],
  FUNNEL:      ["funnel", "lead", "cpl", "offline", "audience", "remarketing"],
  ECONOMICS:   ["roas", "cpa", "budget", "bid", "bidding", "scaling", "profit"],
};

const STOPWORDS = new Set([
  "the","a","an","is","are","was","were","be","been","being","have","has","had",
  "do","does","did","will","would","could","should","may","might","can","to","of",
  "in","for","on","with","at","by","from","as","it","its","this","that","these",
  "those","i","we","you","my","our","your","what","how","why","when","where","which",
  "and","or","but","not","no","so","if","then","than","just","also","very",
]);

function scoreFile(file: KBFile, keywords: string[], constraint: string): number {
  const haystack = `${file.category} ${file.title} ${file.content}`.toLowerCase();
  let score = 0;

  for (const kw of keywords) {
    const matches = haystack.split(kw).length - 1;
    score += matches * 2;
  }

  // Boost files in relevant categories for this constraint
  if ((BUCKET_CATEGORIES[constraint] ?? []).includes(file.category)) score += 12;

  // Boost files whose title/content matches bucket-specific terms
  for (const kw of BUCKET_KEYWORDS[constraint] ?? []) {
    if (haystack.includes(kw)) score += 6;
  }

  return score;
}

export function searchKnowledge(userMessage: string, constraint: string, limit = 4): string {
  const files = loadKB();
  if (files.length === 0) return "";

  const keywords = userMessage
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 3 && !STOPWORDS.has(w));

  const scored = files
    .map(f => ({ file: f, score: scoreFile(f, keywords, constraint) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  if (scored.length === 0) return "";

  const chunks = scored.map(({ file }) => {
    // Keep first 2 500 chars of each file to stay within token budget
    const body = file.content.length > 2500
      ? file.content.slice(0, 2500) + "\n…(truncated)"
      : file.content;
    return `--- [${file.category.toUpperCase()}] ${file.title} ---\n${body}`;
  });

  return `KNOWLEDGE BASE — RELEVANT REFERENCES (PPC Mastery OS):\n\n${chunks.join("\n\n")}`;
}
