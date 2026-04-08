/**
 * POST /api/accounts/[id]/peers/compare
 *
 * Streaming AI gap analysis: explains why one account outperforms another,
 * bucket by bucket, with specific numbers and actionable root causes.
 *
 * Body: { compareWithId: string }
 *
 * INTERNAL ONLY — never shown to clients.
 */
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { BUCKET_LABELS, ConstraintSignals } from "@/lib/engine/types";
import { AGENCY_PHILOSOPHY } from "@/lib/agencyPhilosophy";

type Params = { params: Promise<{ id: string }> };

const client = new Anthropic();

function pct(v: number, d = 1) { return `${(v * 100).toFixed(d)}%`; }
function money(v: number, c = "EUR") {
  const s = c === "EUR" ? "€" : c === "GBP" ? "£" : "$";
  return `${s}${v.toFixed(2)}`;
}

function buildAccountBlock(
  account: { name: string; industry: string | null; country: string | null; businessModel: string | null; currency: string; targetRoas: number | null; targetCpa: number | null; grossMarginPercent: number | null },
  snap: { scoreMeasurement: number; scoreTraffic: number; scoreConversion: number; scoreFunnel: number; scoreEconomics: number; governingConstraint: string; constraintReason: string; rawSignals: string }
): string {
  const label = BUCKET_LABELS[snap.governingConstraint as keyof typeof BUCKET_LABELS] ?? snap.governingConstraint;
  let signals: ConstraintSignals | null = null;
  try { signals = JSON.parse(snap.rawSignals) as ConstraintSignals; } catch { /* ignore */ }

  const scores = [
    `  Measurement: ${Math.round(snap.scoreMeasurement)}/100`,
    `  Traffic:     ${Math.round(snap.scoreTraffic)}/100`,
    `  Conversion:  ${Math.round(snap.scoreConversion)}/100`,
    `  Funnel:      ${Math.round(snap.scoreFunnel)}/100`,
    `  Economics:   ${Math.round(snap.scoreEconomics)}/100`,
  ].join("\n");

  const cur = account.currency;
  const metrics: string[] = [];
  if (signals) {
    const t = signals.traffic;
    const e = signals.economics;
    const c = signals.conversion;
    if (t.clickThroughRate > 0)          metrics.push(`CTR: ${pct(t.clickThroughRate, 2)}`);
    if (t.searchImpressionShare > 0)     metrics.push(`IS: ${pct(t.searchImpressionShare)}`);
    if (t.impressionShareLost_budget > 0) metrics.push(`IS lost (budget): ${pct(t.impressionShareLost_budget)}`);
    if (t.impressionShareLost_rank > 0)  metrics.push(`IS lost (rank): ${pct(t.impressionShareLost_rank)}`);
    if (t.averageCpc > 0)                metrics.push(`Avg CPC: ${money(t.averageCpc, cur)}`);
    if (t.qualityScoreCount > 0)         metrics.push(`Avg QS: ${t.qualityScoreAvg.toFixed(1)}/10`);
    if (c.conversionRate > 0)            metrics.push(`CVR: ${pct(c.conversionRate, 2)}`);
    if (e.actualRoas > 0)                metrics.push(`ROAS: ${e.actualRoas.toFixed(2)}x${account.targetRoas ? ` (target: ${account.targetRoas}x)` : ""}`);
    if (e.actualCpa > 0)                 metrics.push(`CPA: ${money(e.actualCpa, cur)}${account.targetCpa ? ` (target: ${money(account.targetCpa, cur)})` : ""}`);
    if (e.budgetUtilizationPercent > 0)  metrics.push(`Budget util: ${pct(e.budgetUtilizationPercent)}`);
    if (account.grossMarginPercent)      metrics.push(`Gross margin: ${pct(account.grossMarginPercent)}`);
  }

  return `ACCOUNT: ${account.name}
Industry: ${account.industry ?? "?"} | Country: ${account.country ?? "?"} | Business model: ${account.businessModel ?? "?"} | Currency: ${cur}

Bucket scores:
${scores}

Governing constraint: ${label}
Why: ${snap.constraintReason}

Key metrics:
${metrics.length ? metrics.map(m => `  ${m}`).join("\n") : "  No signal data available"}`;
}

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;
  const { compareWithId } = await req.json() as { compareWithId: string };

  // Load both accounts — must belong to same org
  const [accountA, accountB] = await Promise.all([
    prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } }),
    prisma.account.findFirst({ where: { id: compareWithId, organizationId: ctx.orgId } }),
  ]);
  if (!accountA || !accountB) return forbidden();

  // Load latest snapshots for both
  const [snapA, snapB] = await Promise.all([
    prisma.constraintSnapshot.findFirst({ where: { accountId: id },            orderBy: { createdAt: "desc" } }),
    prisma.constraintSnapshot.findFirst({ where: { accountId: compareWithId }, orderBy: { createdAt: "desc" } }),
  ]);

  if (!snapA || !snapB) {
    return NextResponse.json({ error: "One or both accounts have no scored snapshot yet. Run scoring first." }, { status: 400 });
  }

  const blockA = buildAccountBlock(accountA, snapA);
  const blockB = buildAccountBlock(accountB, snapB);

  // Determine which is the leader (higher min bucket score = more balanced)
  const minA = Math.min(snapA.scoreMeasurement, snapA.scoreTraffic, snapA.scoreConversion, snapA.scoreFunnel, snapA.scoreEconomics);
  const minB = Math.min(snapB.scoreMeasurement, snapB.scoreTraffic, snapB.scoreConversion, snapB.scoreFunnel, snapB.scoreEconomics);
  const leader = minA >= minB ? accountA.name : accountB.name;
  const laggard = minA >= minB ? accountB.name : accountA.name;

  const prompt = `You are doing a performance gap analysis between two ${accountA.industry ?? "ecommerce"} accounts managed by the same agency in the same market.

${AGENCY_PHILOSOPHY}

⚠ INTERNAL AGENCY ANALYSIS — not for client communication. Be blunt and specific.

--- ACCOUNT A ---
${blockA}

--- ACCOUNT B ---
${blockB}

---

Based on the data above, ${leader} is outperforming ${laggard}. Explain why, and what ${laggard} needs to fix to close the gap.

Use EXACTLY this structure:

## Performance gap: ${leader} vs ${laggard}

**Who's ahead and by how much**
One paragraph. Compare the key metrics directly — ROAS, CTR, CVR, IS, CPC, QS, etc. Use actual numbers. Quantify the gap (e.g. "ROAS 4.1x vs 2.3x — a 1.8x gap").

**Root cause of the gap — bucket by bucket**
Go through each of the 5 buckets where scores differ by 10+ points. For each divergence:
- Name the specific metric that's different
- Name the most likely cause (not generic — what about this account type and market makes this the root cause?)
- State the consequence: how does this upstream difference cascade into downstream results?

Skip buckets where scores are similar (within 10 points).

**What ${laggard} should do differently**
Numbered list, max 4 actions. Each action:
- Starts with the bucket it addresses
- Names the specific metric to move
- Gives a concrete tactic (not "improve CTR" — "add 3 ad copy variants testing price anchoring vs. free returns messaging")
- States the expected effect on the gap

**What ${leader} does well to preserve**
One short paragraph. What is the leading account doing right that explains its edge? This is the "don't break what's working" note.

HARD RULES:
- Only cite numbers that appear in the data above. Zero fabrication.
- Do not say "consider" or "may want to". Give direct instructions.
- If a score difference could have multiple root causes, name both and say which is more likely given the account type.
- Do not mention client names in any advice framing — refer to them as "${leader}" and "${laggard}" throughout.`;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const aiStream = await client.messages.stream({
          model:      "claude-sonnet-4-6",
          max_tokens: 1500,
          system: `You are a senior performance analyst at a Google Ads agency. You have deep expertise in diagnosing why similar accounts in the same market achieve different results. You think in systems: upstream constraints create downstream symptoms. You write for agency specialists, not clients — be direct, use real numbers, name root causes.`,
          messages: [{ role: "user", content: prompt }],
        });

        for await (const chunk of aiStream) {
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
    headers: {
      "Content-Type":  "text/event-stream",
      "Cache-Control": "no-cache",
      Connection:      "keep-alive",
    },
  });
}
