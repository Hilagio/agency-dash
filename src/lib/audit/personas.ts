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

// Fixed edge archetypes — the coverage your intent clusters miss. Three anchors
// run EVERY audit (sceptic, price-first, in-a-hurry — the classic leak points,
// kept stable so scores stay comparable between runs); the other three ROTATE
// from a wider pool so repeated audits see the page through fresh eyes.
export function fixedArchetypes(pageType: PageType): Persona[] {
  const action = pageType === "ecom" ? "buy" : "enquire";
  const anchors: Persona[] = [
    { id: "A1", name: "The sceptic", device: "mobile", intent: "burned by a bad purchase/provider before, doubts it's legit", arrivedFrom: "ad", brief: `Needs a proof/trust step before they'd ${action}. Looks for reviews, guarantees, real results, returns.`, source: "archetype" },
    { id: "A2", name: "Price-first buyer", device: "mobile", intent: "cares about price and value above all", arrivedFrom: "ad", brief: "Wants the price/cost obvious and fast. Bounces if they have to hunt for it or it feels hidden.", source: "archetype" },
    { id: "A3", name: "In a hurry, on mobile", device: "mobile", intent: "skims fast, low patience, thumb-scrolling", arrivedFrom: "ad", brief: `Decides in seconds above the fold. If the core offer and the ${action} action aren't instantly clear and reachable on a phone, they leave.`, source: "archetype" },
  ];
  const pool: Persona[] = [
    { id: "R1", name: "The novice", device: "mobile", intent: "little prior knowledge, unsure if this is for them", arrivedFrom: "search", brief: "Jargon and assumed knowledge scare them off. Needs plain language and reassurance it suits a beginner.", source: "archetype" },
    { id: "R2", name: "Just browsing", device: "mobile", intent: "no active intent to buy yet, curious", arrivedFrom: "ad", brief: `Unlikely to ${action} today; judge whether the page gives a lower-commitment next step to hold them (newsletter, guide, save).`, source: "archetype" },
    pageType === "ecom"
      ? { id: "R3", name: "Comparison shopper", device: "desktop", intent: "comparing this against other sellers/products", arrivedFrom: "search", brief: "Wants shipping, returns, delivery time, stock and differentiators clear enough to choose without leaving to check elsewhere.", source: "archetype" }
      : { id: "R3", name: "Comparing providers", device: "desktop", intent: "shortlisting a few providers, needs to justify the choice", arrivedFrom: "search", brief: "Wants the differentiator, proof and specifics up front to shortlist you without digging.", source: "archetype" },
    pageType === "ecom"
      ? { id: "R4", name: "Gift buyer under time pressure", device: "mobile", intent: "buying this as a gift, needs it to arrive in time and feel right", arrivedFrom: "ad", brief: "Judges delivery promise, gift options and whether the page makes the choice feel safe for someone else.", source: "archetype" }
      : { id: "R4", name: "Delegated researcher", device: "desktop", intent: "researching on behalf of a boss/partner who decides", arrivedFrom: "search", brief: "Needs shareable specifics (pricing, scope, proof) to sell it internally — vagueness kills the handoff.", source: "archetype" },
    { id: "R5", name: "Deal hunter", device: "mobile", intent: "wants a discount, checks for codes, bundles and free shipping thresholds", arrivedFrom: "ad", brief: `Hunts for the deal angle; judges whether the offer feels like good value or full-price friction before they'd ${action}.`, source: "archetype" },
    { id: "R6", name: "The careful reader (55+)", device: "desktop", intent: "reads everything before committing, wary of small print", arrivedFrom: "search", brief: "Small text, vague terms and missing contact info erode trust. Wants a phone number, clear terms, no surprises.", source: "archetype" },
    { id: "R7", name: "Returning visitor, almost convinced", device: "mobile", intent: "second visit — was interested last time, came back to decide", arrivedFrom: "direct", brief: `One nagging doubt left; judge whether the page resolves final objections (stock, sizing/spec, guarantee) or re-sells what they already know.`, source: "archetype" },
    { id: "R8", name: "Quality-first buyer", device: "desktop", intent: "price matters less than materials, durability and provenance", arrivedFrom: "search", brief: "Looks for specifics: materials, origin, certifications, care. Marketing superlatives without substance push them away.", source: "archetype" },
  ];
  // Rotate: pick 3 from the pool at random per run.
  const rotated = [...pool].sort(() => Math.random() - 0.5).slice(0, 3)
    .map((p, i) => ({ ...p, id: `A${4 + i}` }));
  return [...anchors, ...rotated];
}

// The prompt for the model that turns the offer + intent source (and, when no
// real traffic data exists, the page itself) into the remaining ~6 intent/client
// personas. Kept here so run.ts stays orchestration.
export function personaBuilderPrompt(pageType: PageType, offer: string, intentSource: string, count: number, pageSummary = ""): string {
  const action = pageType === "ecom" ? "buy the product / add to cart" : "submit the form / enquire";
  const hasIntent = !!intentSource.trim();

  // WHERE THE PERSONAS COME FROM:
  //  • Real search terms provided  → build from them faithfully. A search that
  //    doesn't match the page is a REAL traffic/targeting problem worth surfacing.
  //  • No traffic data (standalone) → ground the personas in the ACTUAL page
  //    below so they're realistic buyers for what this page really sells. Do NOT
  //    invent a different product category — that manufactures a fake mismatch.
  const sourcing = hasIntent
    ? `WHERE THE TRAFFIC / INTENT COMES FROM (real search terms, keyword research, or ad/video hooks):
${intentSource}

Build the personas faithfully from these real sources. If a search term clearly doesn't match what the page sells, keep that persona anyway — that mismatch is a real targeting problem the audit should reveal.`
    : `NO real traffic/keyword data was provided, so derive the personas from the ACTUAL PAGE below. They must be realistic people who would plausibly be shopping for THIS product / offer. Do NOT invent a different product category than what the page actually sells.

THE ACTUAL PAGE (what it really sells — ground every persona in this):
${pageSummary || "(page content unavailable — infer conservatively from the offer)"}`;

  return `You build realistic visitor personas for a conversion audit of a ${pageType === "ecom" ? "product/landing" : "lead-gen landing"} page. The conversion action is: ${action}.

THE OFFER / BUSINESS CONTEXT:
${offer || "(not provided)"}

${sourcing}

Produce EXACTLY ${count} distinct personas that arrive with the REAL reasons people arrive with. Vary device realistically (mostly mobile for ad traffic). Each must feel like a specific person, not a segment — give them varied names, ages and life situations, and do NOT reuse stock persona clichés; a re-run of this audit should meet different people.

Return ONLY a JSON array, each item:
{"name": "short label", "device": "mobile"|"desktop", "intent": "what they arrived wanting, first person-ish", "arrivedFrom": "the source", "brief": "one sentence on what would make them ${action} or bounce"}`;
}
