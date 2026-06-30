// Shared "author the 90-day plan" step. Takes the gathered GrowthPlanData (from live API
// or manual upload) and has Claude write the plan the Ecomtrada way, returning the
// structured content + the render context for the branded template.
//
// Server-only (imports the Anthropic SDK). Used by both growth-plan routes.

import Anthropic from "@anthropic-ai/sdk";
import { GrowthPlanData, GrowthPlanContent, GrowthPlanRender, ContextPack } from "./growthPlanTypes";

const client = new Anthropic();

export const PLAN_MARKER = "GROWTHPLAN_V3";

/** The 90-day window the plan covers, from today forward. */
export function planPeriodLabel(): string {
  const start = new Date();
  const end = new Date(); end.setDate(start.getDate() + 90);
  const f = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  return `${f(start)} – ${f(end)}`;
}

// The Ecomtrada way — distilled from NINETYDAYPLANCONTEXT.md.
const SYSTEM_PROMPT = `You are a senior Ecomtrada strategist writing a client-facing 90-day Google Ads plan.
Ecomtrada runs Google Ads for webshops. This plan is THE ANCHOR of the client relationship: every
weekly update is measured against exactly its goals. A confident-but-wrong plan at a thin margin
loses a client — accuracy and honesty beat polish.

THE ECOMTRADA PRINCIPLES (non-negotiable):
1. Root cause from data, never assumption. Diagnose the client-specific constraint (volume, stock,
   feed, website conversion, pricing/margin, channel mix). It varies — never default to one.
2. The make-or-break factor. Every plan turns on one client-specific thing that is invisible in the
   numbers. It is supplied in the Context Pack — build the strategy AROUND it. If it is missing, say
   plainly that the plan is provisional until it's provided, and ask for it in "what we need from you".
3. Partner, not button-pusher. Google Ads is one part of the machine. If website, pricing, feed or
   margin is the real constraint, say so — with data.
4. Honest, safe promises. Take the client's goal and make it REALISTIC. If they want 3× but 2× is
   realistic, write 2× and say so. Promise with a margin of safety, then over-deliver.
5. Name uncomfortable findings early. Surfacing problems on day 1 is what they pay for.
6. Profit, not vanity ROAS. Break-even ROAS = 1 ÷ margin. If margin/COGS is missing or assumed, say
   so and push to get real COGS in (steer on POAS). At a thin margin a "good ROAS" can still be a loss.

INTERPRETATION RULES (what the data does NOT tell you):
- Out-of-stock ≠ current waste. Never call an OOS product a villain. Plan revenue only on winners
  that can actually return — NOT limited editions or items the Context Pack flags as un-restockable.
- Stock-outs break campaign learning. If the Context Pack mentions limited editions / restock issues,
  treat that as a core strategic constraint, not a footnote.
- Ads are usually a fraction of total store revenue. When Shopify total revenue is given, state
  Google's share of it so the client sees the scale headroom.
- The trend across 90 → 30 → 14 day windows IS the diagnosis. A softening ROAS as spend ramps is the
  NORMAL, healthy scaling curve — not a reason to stop — as long as it stays above the KPI.

VOICE: direct, honest operator. Short sentences. No hype, no jargon-as-smokescreen. Translate every
metric into what it means for the client's business. Write the strategy/subtitle LAST: "today here →
day 90 there → how". Use the client's language (en/nl) as instructed.

OUTPUT: a single valid JSON object matching the schema given by the user. No markdown fences, no
commentary. In any prose field you may use **bold** to emphasise the few numbers/phrases that matter
(used sparingly, like the gold highlights in the brand). Keep each finding/lever body to 2–3 sentences.`;

function renderContextPack(pack: ContextPack | null, scalingStrategy: string | null): string {
  if (!pack && !scalingStrategy) return "No Context Pack supplied — flag the plan as provisional and request it (especially the make-or-break factor).";
  const lines: string[] = [];
  const add = (label: string, v?: string | null) => { if (v && v.trim()) lines.push(`- ${label}: ${v.trim()}`); };
  add("Goal & ambition (target/proven ROAS)", pack?.goalAmbition);
  add("Scaling strategy", scalingStrategy);
  add("USPs & positioning", pack?.usps);
  add("Audience nuances", pack?.audience);
  add("⭐ Make-or-break factor", pack?.makeOrBreak);
  add("Constraints (budget/countries/no-go)", pack?.constraints);
  add("Stock inputs (core list, limited editions, restock cadence)", pack?.stockInputs);
  if (!pack?.makeOrBreak || !pack.makeOrBreak.trim()) {
    lines.push("- ⚠ Make-or-break factor is BLANK — the plan will be generic; request it explicitly.");
  }
  return lines.join("\n");
}

function buildSchema(language: string): string {
  return `OUTPUT JSON SCHEMA (all prose in ${language === "nl" ? "Dutch" : "English"}):
{
  "subtitle": string,  // one strategic line for the header: goal · KPI · what we'll do · market · vertical · period · AM
  "strategyLead": string,  // 4-6 sentence narrative: where they are -> the constraint -> the 90-day job
  "standToday": [ { "big": string, "body": string } ],  // EXACTLY 4 finding cards. "big" = headline number+label (e.g. "4.72 ROAS", "~$57/day", "5.5% conv"). "body" starts with a **bold lead-in**.
  "honestRead": string,  // the uncomfortable truths; use "• " bullets separated by \\n; cover margin/COGS and the ROAS-softens-as-you-ramp read
  "momentumNote": string,  // 1-2 sentences interpreting the 90->30->14 trend
  "levers": [ { "big": string, "body": string } ],  // 3-4 levers. "big" like "1 · Scale", "2 · Brand", "3 · Feed", "+ Profit"
  "phases": [ { "title": string, "rows": [ { "action": string, "who": "Ecomtrada"|"Client"|"Together", "when": string } ] } ],  // EXACTLY 3 phases (Unlock/Foundation, Scale, Grow/Q4)
  "forecastIntro": string,  // 2-3 sentences restating the goal and the realistic ambition
  "goals": [ { "goal": string, "now": string, "target": string, "assessment": string, "expand"?: boolean } ],  // 3-5 rows. Mark the headline growth goal with "expand": true.
  "forecastRead": string,  // "The honest read:" — the realistic outcome with a safety margin
  "seasonalNote": string,  // seasonal context for this vertical over the next 90 days
  "needs": string[]  // 3-4 client-side asks, each a **bold lead-in** then the ask. Include the make-or-break factor and any stock inputs.
}`;
}

/** Author the plan. Returns the content + the render context for the template. */
export async function authorGrowthPlan(
  data: GrowthPlanData,
): Promise<{ content: GrowthPlanContent; render: GrowthPlanRender }> {
  const prompt = `Write the 90-day plan for this account. Base every claim on the data below; where margin/COGS is assumed or Shopify is not connected, say so and push to get real COGS in.

THE CONTEXT PACK (the human "why" — build the strategy around the make-or-break factor):
${renderContextPack(data.contextPack, data.scalingStrategy)}

ACCOUNT DATA (JSON):
${JSON.stringify(
    { client: data.client, currency: data.currency, market: data.market, vertical: data.vertical,
      periodLabel: data.periodLabel, amName: data.amName, targetRoas: data.targetRoas, google: data.google, shopify: data.shopify },
    null, 2,
  )}

NOTES:
- Currency is ${data.currency}. Target ROAS (KPI) ${data.targetRoas ?? "not set — infer from break-even and ask to confirm"}.
- break-even ${data.google.breakEven}${data.google.breakEvenAssumed ? " (ASSUMED — margin unknown, must be confirmed)" : ""}.
- Shopify is ${data.shopify ? "connected — you may quote gross margin and Google's share of total revenue as fact" : "NOT connected — you cannot quote gross margin or Google's share of total revenue as fact; frame COGS/POAS as the thing to set up"}.
- Use the campaign reads (budgetLimited / biddingLimited) to name specific unlock opportunities.
- Momentum chart is rendered from the window data automatically — your momentumNote should interpret it.

${buildSchema(data.language)}

Return ONLY the JSON object.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const rawText = response.content[0].type === "text" ? response.content[0].text : "";
  const jsonStr = rawText.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/```\s*$/, "").trim();
  const content = JSON.parse(jsonStr) as GrowthPlanContent;

  const render: GrowthPlanRender = {
    client: data.client,
    currency: data.currency,
    subtitle: content.subtitle,
    windows: [data.google.windows.d90, data.google.windows.d30, data.google.windows.d14],
  };

  return { content, render };
}
