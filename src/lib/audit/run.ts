/**
 * Run a pre-flight page audit: render the page, send 12 personas through it as
 * independent subagents (the honest part — each judges alone), score conversion
 * confidence, and synthesise a ranked list of fixes tied to the personas each
 * would win back. Page-type aware (ecom = "would buy", lead-gen = "would submit").
 */
import Anthropic from "@anthropic-ai/sdk";
import { renderPage, type PageDossier } from "./render";
import { fixedArchetypes, personaBuilderPrompt, type PageType, type Persona, type Device } from "./personas";

const client = new Anthropic();

export interface PersonaVerdict {
  id: string; name: string; device: Device; source: string;
  intent: string; arrivedFrom: string;
  understood: "yes" | "partly" | "no";
  wouldConvert: "yes" | "hesitant" | "no";
  intentMatch: boolean;
  hurdle: string;
  quote: string;
}
export interface AuditFix {
  rank: number; title: string; problem: string; fix: string;
  effort: "easy" | "medium" | "hard"; impact: "low" | "medium" | "high";
  category: string; personas: string[];
}
export interface AuditResult {
  url: string; finalUrl: string; pageType: PageType; renderMode: "browser" | "fetch";
  score: number; grade: string; label: string;
  understand: number; convert: number; total: number;
  summary: string;
  personas: PersonaVerdict[];
  fixes: AuditFix[];
  renderError?: string;
}

type Progress = (msg: string) => void;
const conversion = (t: PageType) => (t === "ecom" ? "buy / add to cart" : "submit the form / enquire");

function extractJson<T>(text: string, fallback: T): T {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fence ? fence[1] : text;
  const s = raw.indexOf("["), sb = raw.indexOf("{");
  const start = s >= 0 && (sb < 0 || s < sb) ? s : sb;
  const end = Math.max(raw.lastIndexOf("]"), raw.lastIndexOf("}"));
  if (start < 0 || end < 0) return fallback;
  try { return JSON.parse(raw.slice(start, end + 1)) as T; } catch { return fallback; }
}

async function buildIntentPersonas(pageType: PageType, offer: string, intentSource: string, count: number, pageSummary: string): Promise<Persona[]> {
  if (count <= 0) return [];
  try {
    const msg = await client.messages.create({
      model: "claude-sonnet-5", max_tokens: 1500,
      system: "You build realistic visitor personas for a conversion audit. Return only JSON.",
      messages: [{ role: "user", content: personaBuilderPrompt(pageType, offer, intentSource, count, pageSummary) }],
    });
    const text = msg.content.filter(b => b.type === "text").map(b => (b as { text: string }).text).join("");
    const arr = extractJson<Array<{ name: string; device: string; intent: string; arrivedFrom: string; brief: string }>>(text, []);
    return arr.slice(0, count).map((p, i) => ({
      id: `I${i + 1}`, name: p.name || `Visitor ${i + 1}`,
      device: p.device === "desktop" ? "desktop" : "mobile",
      intent: p.intent || "", arrivedFrom: p.arrivedFrom || "search", brief: p.brief || "",
      source: "intent" as const,
    }));
  } catch { return []; }
}

function dossierBlock(d: PageDossier): string {
  return [
    `URL: ${d.finalUrl} (rendered via ${d.renderMode === "browser" ? "a real mobile browser" : "server fetch — JS-rendered content may be partial"})`,
    d.title && `TITLE: ${d.title}`,
    d.metaDescription && `META: ${d.metaDescription}`,
    d.priceHints.length && `PRICES SEEN: ${d.priceHints.join(", ")}`,
    d.headings.length && `HEADINGS (in order): ${d.headings.slice(0, 25).join(" | ")}`,
    d.ctas.length && `BUTTONS / LINKS: ${d.ctas.slice(0, 30).join(" | ")}`,
    d.formFields.length && `FORM FIELDS: ${d.formFields.join(", ")}`,
    d.bodyText && `PAGE TEXT (top): ${d.bodyText}`,
  ].filter(Boolean).join("\n");
}

async function judge(persona: Persona, pageType: PageType, offer: string, dossier: PageDossier): Promise<PersonaVerdict> {
  const sys = `You ARE this one visitor, judging a ${pageType === "ecom" ? "product/landing" : "lead-gen"} page alone and honestly — slightly uncomfortable honesty is the point. The conversion action is to ${conversion(pageType)}. Judge ONLY from what's actually on the page below (you're on ${persona.device}). Don't be nice; if something blocks you, say the specific, nameable thing.`;
  const user = `WHO YOU ARE: ${persona.name} — ${persona.intent}. You arrived from: ${persona.arrivedFrom}. ${persona.brief}

THE OFFER (what the business wants you to do): ${offer || "(infer from the page)"}

THE PAGE:
${dossierBlock(dossier)}

Return ONLY this JSON:
{"understood": "yes"|"partly"|"no", "wouldConvert": "yes"|"hesitant"|"no", "intentMatch": true|false, "hurdle": "the ONE concrete thing stopping or slowing you (empty if none)", "quote": "one first-person sentence in your voice"}
- understood = did you grasp the offer? wouldConvert = would you ${conversion(pageType)} right now? intentMatch = is this page actually about what you came for?`;
  try {
    const msg = await client.messages.create({ model: "claude-sonnet-5", max_tokens: 500, system: sys, messages: [{ role: "user", content: user }] });
    const text = msg.content.filter(b => b.type === "text").map(b => (b as { text: string }).text).join("");
    const v = extractJson<{ understood: string; wouldConvert: string; intentMatch: boolean; hurdle: string; quote: string }>(text, { understood: "partly", wouldConvert: "hesitant", intentMatch: true, hurdle: "", quote: "" });
    const u = v.understood === "yes" || v.understood === "no" ? v.understood : "partly";
    const c = v.wouldConvert === "yes" || v.wouldConvert === "no" ? v.wouldConvert : "hesitant";
    return { id: persona.id, name: persona.name, device: persona.device, source: persona.source, intent: persona.intent, arrivedFrom: persona.arrivedFrom, understood: u, wouldConvert: c, intentMatch: v.intentMatch !== false, hurdle: v.hurdle || "", quote: v.quote || "" };
  } catch {
    return { id: persona.id, name: persona.name, device: persona.device, source: persona.source, intent: persona.intent, arrivedFrom: persona.arrivedFrom, understood: "partly", wouldConvert: "hesitant", intentMatch: true, hurdle: "(the persona couldn't be evaluated)", quote: "" };
  }
}

function scoreOf(verdicts: PersonaVerdict[], dossier: PageDossier): { score: number; understand: number; convert: number } {
  const n = verdicts.length || 1;
  const yesC = verdicts.filter(v => v.wouldConvert === "yes").length;
  const hesC = verdicts.filter(v => v.wouldConvert === "hesitant").length;
  const yesU = verdicts.filter(v => v.understood === "yes").length;
  const partU = verdicts.filter(v => v.understood === "partly").length;
  const match = verdicts.filter(v => v.intentMatch).length;
  const submitScore = ((yesC + 0.5 * hesC) / n) * 50;
  const compScore = ((yesU + 0.5 * partU) / n) * 25;
  const techScore = dossier.error ? 0 : dossier.renderMode === "browser" ? 15 : 11;
  const intentScore = (match / n) * 10;
  return { score: Math.round(submitScore + compScore + techScore + intentScore), understand: yesU, convert: yesC };
}

const gradeOf = (s: number): { grade: string; label: string } =>
  s >= 85 ? { grade: "A", label: "Strong" } : s >= 70 ? { grade: "B", label: "Solid" } :
  s >= 55 ? { grade: "C", label: "Workable" } : s >= 40 ? { grade: "D", label: "Leaky" } : { grade: "E", label: "Not ready" };

async function synthesise(pageType: PageType, offer: string, dossier: PageDossier, verdicts: PersonaVerdict[], rejected: string[]): Promise<{ summary: string; fixes: AuditFix[] }> {
  const vBlock = verdicts.map(v => `- ${v.name} [${v.device}]: understood=${v.understood}, wouldConvert=${v.wouldConvert}, intentMatch=${v.intentMatch}. Hurdle: ${v.hurdle || "none"}. "${v.quote}"`).join("\n");
  const sys = `You are a senior CRO specialist. From the personas' independent verdicts, produce the ranked list of fixes that would win back the most conversions on THIS page. Concrete, page-specific, no generic advice. Rank by effect on intent to ${conversion(pageType)}. The hesitant personas are the lever — each is stuck on a nameable thing.`;
  const user = `OFFER: ${offer}
PAGE (${dossier.renderMode} render): ${dossierBlock(dossier).slice(0, 3500)}

PERSONA VERDICTS:
${vBlock}
${rejected.length ? `\nALREADY REJECTED by the team — do NOT suggest these again: ${rejected.join("; ")}` : ""}

Return ONLY JSON:
{"summary": "2-3 sentences: what's costing conversions and the single biggest lever", "fixes": [{"title": "...", "problem": "what's wrong, cite the personas", "fix": "the concrete change", "effort": "easy"|"medium"|"hard", "impact": "low"|"medium"|"high", "category": "order"|"design"|"copy"|"content"|"trust"|"technical", "personas": ["persona names this wins back"]}]}
Rank fixes best-first (max 6).`;
  try {
    const msg = await client.messages.create({ model: "claude-opus-4-8", max_tokens: 2000, system: sys, messages: [{ role: "user", content: user }] });
    const text = msg.content.filter(b => b.type === "text").map(b => (b as { text: string }).text).join("");
    const parsed = extractJson<{ summary: string; fixes: Array<Omit<AuditFix, "rank">> }>(text, { summary: "", fixes: [] });
    return { summary: parsed.summary || "", fixes: (parsed.fixes || []).slice(0, 6).map((f, i) => ({ rank: i + 1, ...f, personas: Array.isArray(f.personas) ? f.personas : [] })) };
  } catch { return { summary: "", fixes: [] }; }
}

export async function runPageAudit(
  opts: { url: string; pageType: PageType; offer: string; intentSource: string; rejected?: string[] },
  onProgress: Progress = () => {},
): Promise<AuditResult> {
  onProgress("Rendering the page (mobile)…");
  const dossier = await renderPage(opts.url);

  // If we were blocked or the page didn't load, DON'T run 12 personas over a
  // block page and call the page broken — say plainly that we couldn't see it.
  if (dossier.blocked || (dossier.error && !dossier.bodyText && !dossier.title)) {
    onProgress("Couldn't load the page.");
    return {
      url: opts.url, finalUrl: dossier.finalUrl, pageType: opts.pageType, renderMode: dossier.renderMode,
      score: 0, grade: "—", label: "Couldn't load the page",
      understand: 0, convert: 0, total: 0,
      summary: dossier.error ?? "The page couldn't be loaded, so no audit was run.",
      personas: [], fixes: [], renderError: dossier.error,
    };
  }

  const archetypes = fixedArchetypes(opts.pageType);
  onProgress("Building the intent personas from the offer and keywords…");
  // Ground the intent personas in what the page ACTUALLY sells (title, headings,
  // prices, lead text). Without this, a no-context standalone audit lets the
  // model guess the product category and invent mismatched personas.
  const pageSummary = [
    dossier.title && `Title: ${dossier.title}`,
    dossier.metaDescription && `Description: ${dossier.metaDescription}`,
    dossier.priceHints.length && `Prices: ${dossier.priceHints.slice(0, 8).join(", ")}`,
    dossier.headings.length && `Headings: ${dossier.headings.slice(0, 15).join(" | ")}`,
    dossier.bodyText && `Text: ${dossier.bodyText.slice(0, 1200)}`,
  ].filter(Boolean).join("\n");
  const intent = await buildIntentPersonas(opts.pageType, opts.offer, opts.intentSource, 12 - archetypes.length, pageSummary);
  const personas = [...archetypes, ...intent].slice(0, 12);

  // Judge concurrently, small pool, streaming progress as each lands.
  const verdicts: PersonaVerdict[] = [];
  const POOL = 4; let cursor = 0; let done = 0;
  async function worker() {
    while (cursor < personas.length) {
      const p = personas[cursor++];
      const v = await judge(p, opts.pageType, opts.offer, dossier);
      verdicts.push(v); done++;
      onProgress(`Persona ${done}/${personas.length}: ${v.name} — ${v.wouldConvert === "yes" ? "would convert" : v.wouldConvert === "no" ? "gone" : "hesitant"}`);
    }
  }
  await Promise.all(Array.from({ length: POOL }, () => worker()));
  verdicts.sort((a, b) => personas.findIndex(p => p.id === a.id) - personas.findIndex(p => p.id === b.id));

  const { score, understand, convert } = scoreOf(verdicts, dossier);
  const { grade, label } = gradeOf(score);
  onProgress("Ranking the fixes that matter…");
  const { summary, fixes } = await synthesise(opts.pageType, opts.offer, dossier, verdicts, opts.rejected ?? []);

  return {
    url: opts.url, finalUrl: dossier.finalUrl, pageType: opts.pageType, renderMode: dossier.renderMode,
    score, grade, label, understand, convert, total: verdicts.length,
    summary: summary || dossier.error || "", personas: verdicts, fixes, renderError: dossier.error,
  };
}
