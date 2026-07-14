/**
 * POST /api/accounts/[id]/persona/generate
 * Streams an AI-generated target persona narrative from persona data.
 */
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import type {
  DemographicRow, IncomeRow, ParentalRow,
  GeoRow, DayHourRow, AudienceInterestRow,
} from "@/lib/integrations/google-ads";

type Params = { params: Promise<{ id: string }> };

const client = new Anthropic();

interface PersonaRequest {
  demographics: DemographicRow[];
  income:       IncomeRow[];
  parental:     ParentalRow[];
  geo:          GeoRow[];
  dayHour:      DayHourRow[];
  interests:    AudienceInterestRow[];
  currency:     string;
  industry:     string | null;
  businessModel: string | null;
}

function pct(v: number, total: number) {
  return total > 0 ? `${((v / total) * 100).toFixed(0)}%` : "?%";
}

function buildPersonaPrompt(d: PersonaRequest, accountName: string): string {
  const currency = d.currency;
  const sym = currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$";

  // Devices
  const devices = d.demographics.filter(r => r.dimension === "device");
  const totalDeviceCost = devices.reduce((s, r) => s + r.costMicros, 0);
  const deviceLines = devices.map(r =>
    `  ${r.label}: ${pct(r.costMicros, totalDeviceCost)} spend, CVR ${r.clicks > 0 ? ((r.conversions / r.clicks) * 100).toFixed(1) : 0}%`
  ).join("\n");

  // Age
  const ages = d.demographics.filter(r => r.dimension === "age" && r.label !== "UNKNOWN");
  const totalAgeCost = ages.reduce((s, r) => s + r.costMicros, 0);
  const ageLines = ages.map(r =>
    `  ${r.label.replace("AGE_RANGE_", "").replace("_", "–")}: ${pct(r.costMicros, totalAgeCost)} spend, ${r.conversions.toFixed(0)} conv`
  ).join("\n");

  // Gender
  const genders = d.demographics.filter(r => r.dimension === "gender" && r.label !== "UNKNOWN");
  const totalGenderCost = genders.reduce((s, r) => s + r.costMicros, 0);
  const genderLines = genders.map(r =>
    `  ${r.label}: ${pct(r.costMicros, totalGenderCost)} spend`
  ).join("\n");

  // Income
  const totalIncomeCost = d.income.reduce((s, r) => s + r.costMicros, 0);
  const incomeLines = d.income.map(r =>
    `  ${r.label}: ${pct(r.costMicros, totalIncomeCost)} spend, ${r.conversions.toFixed(0)} conv`
  ).join("\n");

  // Parental
  const totalParentalCost = d.parental.reduce((s, r) => s + r.costMicros, 0);
  const parentalLines = d.parental.map(r =>
    `  ${r.label}: ${pct(r.costMicros, totalParentalCost)} spend`
  ).join("\n");

  // Geo top 10
  const geoLines = d.geo.slice(0, 10).map(r =>
    `  ${r.name} (${r.countryCode}): ${sym}${(r.costMicros / 1_000_000).toFixed(0)} spend, ${r.conversions.toFixed(0)} conv`
  ).join("\n");

  // Day of week best/worst
  const days = d.dayHour.filter(r => r.dimension === "day");
  const daysSorted = [...days].sort((a, b) => b.conversions - a.conversions);
  const bestDays  = daysSorted.slice(0, 3).map(d => d.label.slice(0, 3)).join(", ");
  const worstDays = daysSorted.slice(-2).map(d => d.label.slice(0, 3)).join(", ");

  // Hours — cluster into morning/afternoon/evening/night
  const hours = d.dayHour.filter(r => r.dimension === "hour");
  const periods: Record<string, number> = { "Night (0–6)": 0, "Morning (7–11)": 0, "Afternoon (12–17)": 0, "Evening (18–23)": 0 };
  hours.forEach(h => {
    const hr = parseInt(h.label);
    if (hr < 7) periods["Night (0–6)"] += h.conversions;
    else if (hr < 12) periods["Morning (7–11)"] += h.conversions;
    else if (hr < 18) periods["Afternoon (12–17)"] += h.conversions;
    else periods["Evening (18–23)"] += h.conversions;
  });
  const peakPeriod = Object.entries(periods).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "unknown";

  // Interests top 15
  const interestLines = d.interests.slice(0, 15).map(r =>
    `  ${r.name} [${r.type}]: ${r.clicks} clicks, ${r.conversions.toFixed(0)} conv`
  ).join("\n");

  return `You are building a data-driven target persona for the Google Ads account: ${accountName}.
${d.industry ? `Industry: ${d.industry}` : ""}${d.businessModel ? ` | Business model: ${d.businessModel}` : ""}

DATA (last 30 days from Google Ads API):

DEVICE:
${deviceLines || "  No device data"}

AGE:
${ageLines || "  No age data"}

GENDER:
${genderLines || "  No gender data"}

HOUSEHOLD INCOME:
${incomeLines || "  No income data"}

PARENTAL STATUS:
${parentalLines || "  No parental data"}

TOP GEOGRAPHIES:
${geoLines || "  No geo data"}

BEHAVIOR:
  Best days: ${bestDays || "n/a"}
  Worst days: ${worstDays || "n/a"}
  Peak conversion period: ${peakPeriod}

AUDIENCE INTERESTS / SEGMENTS:
${interestLines || "  No audience data"}

---

Write a structured target persona using ONLY this data. Format:

## Primary Persona

**Name:** (a fictional but realistic first name)
**Age:** (most likely age range based on data)
**Gender:** (based on data, or "Mixed" if roughly equal)
**Device:** (primary device)
**Location:** (top 1–3 countries/cities)
**Income:** (based on income data)
**Life stage:** (based on parental + age data)

### Interests & Behaviour
(3–5 bullet points derived from the interest/audience segments. Be specific about category names from the data.)

### When They Buy
(1–2 sentences about day/hour patterns — when conversions peak)

### What This Means for the Account
(2–3 bullet points on targeting implications — bid adjustments, scheduling, audience exclusions, creative tone)

### Data Gaps
(Briefly list what Google Ads does NOT expose: ethnicity, precise income, psychographics, purchase intent depth. Do not invent data for these gaps.)

Keep it concise and grounded in the numbers. Do not add assumptions not supported by the data.`;
}

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;
  const account = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } });
  if (!account) return forbidden();

  const body = await req.json() as PersonaRequest;

  const prompt = buildPersonaPrompt(body, account.name);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = await client.messages.stream({
          model:      "claude-sonnet-5",
          max_tokens: 1500,
          messages:   [{ role: "user", content: prompt }],
        });
        for await (const chunk of anthropicStream) {
          if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Stream error";
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
        controller.close();
      }
    },
  });

  return new NextResponse(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
  });
}
