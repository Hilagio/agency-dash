/**
 * Generate a structured DocContent (findings / report / deck) from the account
 * conversation + live data, in the ecomtrada voice. The model authors STRUCTURED
 * content only; the renderer puts it in the house style.
 */
import Anthropic from "@anthropic-ai/sdk";
import type { DocContent, DocFormat, DocLanguage } from "./types";

const client = new Anthropic();

const SHAPE = `{
  "docType": string,            // short label for the deliverable, e.g. "Findings", "Account Review", "Q3 Summary"
  "title": string,              // the headline (no markdown)
  "subtitle": string,           // one line: scope / period / date
  "sections": [                 // 3–8 sections, ordered as a client would read them
    {
      "heading": string,        // short section title
      "lead": string,           // 1–3 sentence paragraph; use **bold** for the key phrase (optional)
      "bullets": string[],      // optional; concise points, **bold** allowed
      "stats": [ { "key": string, "value": string, "sub": string, "tone": "good"|"bad"|"grad"|"neutral" } ], // optional; headline numbers
      "table": { "columns": string[], "rows": string[][] },  // optional; e.g. metric / now / target
      "callout": string         // optional; one highlighted takeaway
    }
  ]
}`;

const DOC_SYSTEM = `You are a senior strategist at Ecomtrada, a Dutch ecommerce PPC agency, writing a client-ready deliverable. You are given the internal conversation about an account plus its live numbers. Turn that into a polished, honest, on-brand document the account team can send (or present) to the client.

Rules:
- Ground EVERYTHING in the material provided — the conversation and the numbers. NEVER invent figures. If something is a hypothesis, frame it as one.
- Client-ready tone: clear, confident, specific, no internal jargon or hedging-by-committee. This goes to the client, so it should read like Ecomtrada's expert point of view — but never over-promise.
- Lead with what matters. Structure it the way a client reads: the situation, what the data shows, what we recommend / will do, what we need from them.
- Use real numbers in stats and tables where they strengthen the point. Keep prose tight.
- Match the requested LANGUAGE exactly (English or Dutch). Write natural, native Dutch when nl.
- Respect the requested FORMAT: "doc" = a flowing report; "deck" = presentation slides, so make each section one focused slide (a heading + a tight point, fewer words per section).

Return ONLY a JSON object (no prose, no code fences) matching this shape:
${SHAPE}`;

function stripFences(s: string): string {
  const t = s.trim();
  if (t.startsWith("```")) return t.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  return t;
}

export async function generateDoc(opts: {
  client: string;
  request: string;
  format: DocFormat;
  language: DocLanguage;
  context: string;
}): Promise<DocContent> {
  const user = `CLIENT: ${opts.client}
LANGUAGE: ${opts.language === "nl" ? "Dutch (nl)" : "English (en)"}
FORMAT: ${opts.format === "deck" ? "deck (presentation slides)" : "doc (flowing report)"}
WHAT THE TEAM ASKED FOR: ${opts.request || "A clear findings document from the conversation and data below."}

--- ACCOUNT CONVERSATION & DATA (ground the document in this) ---
${opts.context}`;

  const msg = await client.messages
    .stream({
      model: "claude-opus-4-8",
      max_tokens: 4096,
      system: DOC_SYSTEM,
      messages: [{ role: "user", content: user }],
    })
    .finalMessage();

  const text = msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map(b => b.text)
    .join("");

  const parsed = JSON.parse(stripFences(text)) as Partial<DocContent>;
  return {
    language: opts.language,
    format: opts.format,
    client: opts.client,
    docType: parsed.docType || "Findings",
    title: parsed.title || `${opts.client} — ${parsed.docType || "Findings"}`,
    subtitle: parsed.subtitle,
    sections: Array.isArray(parsed.sections) ? parsed.sections : [],
  };
}
