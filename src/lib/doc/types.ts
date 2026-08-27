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

/**
 * One-click "Audit & Growth Plan" preset — mirrors the team's proven audit
 * layout (executive summary → numbered findings with evidence tables → phased
 * plan → website recommendations → gated growth → in short) so the deliverable
 * is duplicatable for any account. The UI passes this as the request.
 */
export const AUDIT_REQUEST = `A complete "Google Ads Account Audit & Growth Plan" in this EXACT section order (our house audit layout):
1. "Executive summary" — the period and spend reviewed, the one-line story of WHY results are what they are, and the reassurance of what is fixable and in what order.
2. "What we found" — numbered findings, worst first, each as its own section: a short bold claim + evidence in plain client language. Use tables for campaign/geo/search-term evidence with the real numbers. Cover (where the material supports it): conversion tracking state, wasted spend / wrong audience, searches that can't convert, visibility & quality, account structure, and website/landing-page issues.
3. "The plan" — 3-4 phases with week labels in the heading (e.g. "Phase 1 — Get measurement right · WEEK 1"), 3-5 concrete action bullets each. Foundation first, growth second; measurement fixes always precede any spend.
4. "Website recommendations (for your team)" — only if site issues came up: concrete trust/conversion fixes the client's own team should make.
5. "Growth opportunity" — future levers (new markets, budget), explicitly gated behind a healthy foundation — not launch-day activity.
6. "In short" — a closing summary the client can quote, plus the decision(s) we still need from them as a callout.
docType must be "Audit & Growth Plan". Title: a human line like "Where your budget went — and how to make it work".`;

