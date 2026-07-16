/**
 * The 12 personas that judge the page. Half are FIXED edge archetypes (the
 * sceptic, the price-first buyer, the one in a hurry on mobile, the novice) —
 * the blind-spots your keywords never hand you, so they run every time. The
 * other half are INTENT-derived (from the account's search terms, or pasted
 * keyword/hook research for a pre-launch page) plus the client's known buyers.
 * They're page-type aware: ecom personas judge "would I buy", lead-gen "would
 * I submit".
 */

export type PageType = "ecom" | "leadgen";
export type Device = "mobile" | "desktop";

export interface Persona {
  id: string;
  name: string;
  device: Device;
  intent: string;       // what they arrived wanting
  arrivedFrom: string;  // the source they came through
  brief: string;        // extra colour for the judge subagent
  source: "archetype" | "intent" | "client";
}

// Fixed edge archetypes — the coverage your intent clusters miss.
export function fixedArchetypes(pageType: PageType): Persona[] {
  const action = pageType === "ecom" ? "buy" : "enquire";
  const common: Persona[] = [
    { id: "A1", name: "The sceptic", device: "mobile", intent: "burned by a bad purchase/provider before, doubts it's legit", arrivedFrom: "ad", brief: `Needs a proof/trust step before they'd ${action}. Looks for reviews, guarantees, real results, returns.`, source: "archetype" },
    { id: "A2", name: "Price-first buyer", device: "mobile", intent: "cares about price and value above all", arrivedFrom: "ad", brief: "Wants the price/cost obvious and fast. Bounces if they have to hunt for it or it feels hidden.", source: "archetype" },
    { id: "A3", name: "In a hurry, on mobile", device: "mobile", intent: "skims fast, low patience, thumb-scrolling", arrivedFrom: "ad", brief: `Decides in seconds above the fold. If the core offer and the ${action} action aren't instantly clear and reachable on a phone, they leave.`, source: "archetype" },
    { id: "A4", name: "The novice", device: "mobile", intent: "little prior knowledge, unsure if this is for them", arrivedFrom: "search", brief: "Jargon and assumed knowledge scare them off. Needs plain language and reassurance it suits a beginner.", source: "archetype" },
    { id: "A5", name: "Just browsing", device: "mobile", intent: "no active intent to buy yet, curious", arrivedFrom: "ad", brief: `Unlikely to ${action} today; judge whether the page gives a lower-commitment next step to hold them (newsletter, guide, save).`, source: "archetype" },
    pageType === "ecom"
      ? { id: "A6", name: "Comparison shopper", device: "desktop", intent: "comparing this against other sellers/products", arrivedFrom: "search", brief: "Wants shipping, returns, delivery time, stock and differentiators clear enough to choose without leaving to check elsewhere.", source: "archetype" }
      : { id: "A6", name: "Comparing providers", device: "desktop", intent: "shortlisting a few providers, needs to justify the choice", arrivedFrom: "search", brief: "Wants the differentiator, proof and specifics up front to shortlist you without digging.", source: "archetype" },
  ];
  return common;
}

// The prompt for the model that turns the offer + intent source into the
// remaining ~6 intent/client personas. Kept here so run.ts stays orchestration.
export function personaBuilderPrompt(pageType: PageType, offer: string, intentSource: string, count: number): string {
  const action = pageType === "ecom" ? "buy the product / add to cart" : "submit the form / enquire";
  return `You build realistic visitor personas for a conversion audit of a ${pageType === "ecom" ? "product/landing" : "lead-gen landing"} page. The conversion action is: ${action}.

THE OFFER / BUSINESS CONTEXT:
${offer || "(not provided)"}

WHERE THE TRAFFIC / INTENT COMES FROM (real search terms, keyword research, or ad/video hooks):
${intentSource || "(not provided — infer plausible intent from the offer)"}

Produce EXACTLY ${count} distinct personas that arrive with the REAL reasons people arrive with, derived from the intent source above (and the client's likely buyers). Vary device realistically (mostly mobile for ad traffic). Each must feel like a specific person, not a segment.

Return ONLY a JSON array, each item:
{"name": "short label", "device": "mobile"|"desktop", "intent": "what they arrived wanting, first person-ish", "arrivedFrom": "the source", "brief": "one sentence on what would make them ${action} or bounce"}`;
}
