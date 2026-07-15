/**
 * Structured brand document (§agent → files out). The agent fills this from the
 * account conversation + live data; a fixed template renders it in the ecomtrada
 * house style. Keeping content structured — not model-emitted HTML — guarantees
 * every deliverable is on-brand.
 *
 * `format` "doc" → a flowing report (findings, summaries, docs). "deck" → the
 * same content laid out as brand slides (one section per page), for a
 * client-ready presentation. Both print cleanly to PDF.
 */
export type DocLanguage = "en" | "nl";
export type DocFormat = "doc" | "deck";

export interface DocStat {
  key: string;                 // "Tracked ROAS"
  value: string;               // "1.54x"
  sub?: string;                // "target 2.6x"
  tone?: "good" | "bad" | "grad" | "neutral";
}
export interface DocSection {
  heading: string;
  lead?: string;               // paragraph (supports **bold**)
  bullets?: string[];
  stats?: DocStat[];
  table?: { columns: string[]; rows: string[][] };
  callout?: string;            // a highlighted takeaway
}
export interface DocContent {
  language: DocLanguage;
  format: DocFormat;
  client: string;
  docType: string;             // "Findings", "Account Review", "Q3 Summary" — the header eyebrow
  title: string;               // the headline
  subtitle?: string;           // header sub-line (date, scope)
  sections: DocSection[];
}
