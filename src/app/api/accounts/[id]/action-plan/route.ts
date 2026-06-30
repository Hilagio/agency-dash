import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { scoreConstraints } from "@/lib/engine";
import { ConstraintSignals, BUCKET_LABELS } from "@/lib/engine/types";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { fetchLiveRoas } from "@/lib/integrations/google-ads";

type Params = { params: Promise<{ id: string }> };

const client = new Anthropic();

// ─── Plan schema (v2) ─────────────────────────────────────────────────────────

export interface PlanAction {
  title:              string;
  clientExplanation:  string;   // plain language: what we'll do and why
  steps:              string[]; // max 3 concrete steps
  timeline:           string;   // e.g. "Week 1–2"
  expectedOutcome:    string;   // specific metric expectation
}

export interface PlanPhase {
  month:  string;
  theme:  string;
  points: string[];
}

export interface PlanV2 {
  summary:        string;       // 1 sentence: current state → what we'll achieve
  clientMessage:  string;       // 1–2 sentences: client-facing framing
  actions:        PlanAction[]; // max 3
  phases:         PlanPhase[];  // exactly 3 (one per month)
  seasonalNote:   string;       // what to expect seasonally in the next 3 months
  productInsight: string | null;
  targets: {
    month:   string;
    revenue: string;
    roas:    string;
    focus:   string;
  }[];
}

export interface StoredPlan {
  version:       2;
  plan:          PlanV2;
  settings:      { targetRoas: number | null; monthlyGoal: number | null; contextNotes: string | null; liveRoas: number | null; liveSpend: number | null; };
  generatedAt:   string;  // ISO date
  snapshotDate:  string;  // when the underlying snapshot was taken
}

// ─── GET: return plan + metrics ───────────────────────────────────────────────

export async function GET(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;

  const account = await prisma.account.findFirst({
    where:  { id, organizationId: ctx.orgId },
    select: { id: true },
  });
  if (!account) return forbidden();

  const [record, snapshot] = await Promise.all([
    prisma.clientActionPlan.findFirst({
      where:    { accountId: id },
      orderBy:  { createdAt: "desc" },
      select:   { id: true, createdAt: true, content: true, snapshotId: true },
    }),
    prisma.constraintSnapshot.findFirst({
      where:   { accountId: id },
      orderBy: { createdAt: "desc" },
      select:  { rawSignals: true, createdAt: true },
    }),
  ]);

  // Parse stored plan first — it contains live ROAS from generation time
  let plan: StoredPlan | null = null;
  if (record?.content) {
    try {
      const parsed = JSON.parse(record.content) as StoredPlan;
      if (parsed.version === 2) plan = parsed;
    } catch { /* old format or invalid */ }
  }

  // Build metrics: prefer liveRoas stored in plan (all_conversions_value at generation time)
  // over snapshot rawSignals (may be stale or use conversions_value)
  let metrics: {
    actualRoas: number | null;
    spend30d:   number | null;
    snapshotAt: string | null;
  } | null = null;

  if (plan?.settings.liveRoas != null && plan.settings.liveRoas > 0) {
    metrics = {
      actualRoas: plan.settings.liveRoas,
      spend30d:   plan.settings.liveSpend ?? null,
      snapshotAt: snapshot?.createdAt.toISOString() ?? null,
    };
  } else if (snapshot) {
    try {
      const sig  = JSON.parse(snapshot.rawSignals) as ConstraintSignals;
      const roas = sig.economics?.actualRoas ?? null;
      metrics = {
        actualRoas: roas && roas > 0 ? roas : null,
        spend30d:   sig.economics?.totalSpend ?? null,
        snapshotAt: snapshot.createdAt.toISOString(),
      };
    } catch { /* no metrics */ }
  }

  return NextResponse.json({ plan, metrics });
}

// ─── POST: generate plan ──────────────────────────────────────────────────────

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;

  const body = await req.json().catch(() => ({})) as {
    targetRoas?:    number | null;
    monthlyGoal?:   number | null;
    contextNotes?:  string | null;
    productContext?: string | null; // serialized product data from client
  };

  const account = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } });
  if (!account) return forbidden();

  const snapshot = await prisma.constraintSnapshot.findFirst({
    where:   { accountId: id },
    orderBy: { createdAt: "desc" },
    include: {
      actions: {
        orderBy: { impact: "asc" },
        take:    6,
        where:   { status: { in: ["PENDING", "IN_PROGRESS"] } },
      },
    },
  });

  if (!snapshot) {
    return NextResponse.json({ error: "Score the account first to generate a plan." }, { status: 404 });
  }

  // Parse signals
  let signals: ConstraintSignals | null = null;
  let bucketSignals: Record<string, string[]> = {};
  try {
    signals = JSON.parse(snapshot.rawSignals) as ConstraintSignals;
    const result = scoreConstraints(signals);
    bucketSignals = Object.fromEntries(result.buckets.map(b => [b.bucket, b.signals]));
  } catch { /* proceed */ }

  const eco  = signals?.economics;
  const conv = signals?.conversion;

  // Fetch live ROAS from Google Ads (all_conversions_value) — more reliable than
  // snapshot economics which may have been scored with conversions_value only.
  let liveRoasData: { roas: number; spend30d: number } | null = null;
  try {
    liveRoasData = await fetchLiveRoas(account.googleAdsId, ctx.orgId);
    if (liveRoasData.roas === 0) liveRoasData = null;
  } catch { /* fall back to snapshot */ }

  const effectiveTargetRoas = body.targetRoas ?? account.targetRoas ?? null;
  const snapshotRoas        = (eco?.actualRoas && eco.actualRoas > 0) ? eco.actualRoas : null;
  const actualRoas          = liveRoasData?.roas ?? snapshotRoas;
  const spend30d            = liveRoasData?.spend30d ?? eco?.totalSpend ?? null;
  const revenue30d          = (actualRoas && spend30d) ? Math.round(actualRoas * spend30d) : null;
  const cvr                 = conv?.conversionRate ?? null;

  const isLeadGen = ["lead_gen", "service"].includes(account.businessModel ?? "");

  const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const now         = new Date();
  const m           = now.getMonth();
  const currentMonth  = MONTH_NAMES[m];
  const month1        = MONTH_NAMES[(m + 1) % 12];
  const month2        = MONTH_NAMES[(m + 2) % 12];
  const month3        = MONTH_NAMES[(m + 3) % 12];

  const seasonalCtx: Record<number, string> = {
    0: "January is a slow recovery month post-holidays. Traffic is high but intent is fragmented. Focus on efficiency.",
    1: "February is typically the lowest-revenue month. Expect lower volume — this is a good time to optimise structure.",
    2: "March: spring recovery begins. Spring/summer inventory gains traction.",
    3: "April: spring buying accelerates. Warmer categories and seasonal items pick up.",
    4: "May: stable. Slightly ahead of the summer slowdown — good time to test and prepare for summer.",
    5: "June: early summer slowdown for most fashion categories. Focus on summer-relevant products.",
    6: "July: summer dip. Lower competition — good for feed and campaign structure improvements.",
    7: "August: similar to July. Back-to-school categories start recovering late August.",
    8: "September: strong recovery. Autumn collections launch. Demand accelerates.",
    9: "October: one of the stronger non-peak months. Pre-Black Friday awareness starts.",
    10: "November: Black Friday drives the highest revenue of the year.",
    11: "December: holiday peak. ROAS may dip late December as intent shifts.",
  };

  // Build bucket context — exclude tracking noise unless it IS the governing constraint
  const relevantBuckets = [
    { key: "MEASUREMENT", score: snapshot.scoreMeasurement },
    { key: "TRAFFIC",     score: snapshot.scoreTraffic },
    { key: "CONVERSION",  score: snapshot.scoreConversion },
    { key: "FUNNEL",      score: snapshot.scoreFunnel },
    { key: "ECONOMICS",   score: snapshot.scoreEconomics },
  ]
    .filter(b => b.key !== "MEASUREMENT" || snapshot.governingConstraint === "MEASUREMENT")
    .map(b => {
      const issues = (bucketSignals[b.key] ?? [])
        .filter(s => !s.includes("never fired") && !s.includes("not fired"))
        .slice(0, 2);
      return `  ${BUCKET_LABELS[b.key as keyof typeof BUCKET_LABELS]}: ${Math.round(b.score)}/100${issues.length ? ` — ${issues.join("; ")}` : ""}`;
    })
    .join("\n");

  const governing = BUCKET_LABELS[snapshot.governingConstraint as keyof typeof BUCKET_LABELS] ?? snapshot.governingConstraint;

  const actionsContext = snapshot.actions.length
    ? snapshot.actions.map((a, i) => `${i+1}. ${a.title} — ${a.description}`).join("\n")
    : "No pending recommendations.";

  const businessLabel: Record<string, string> = {
    ecommerce: "Ecommerce", dtc: "DTC", dropship: "Ecommerce (dropshipping)",
    lead_gen: "Lead gen", service: "Service", subscription: "Subscription",
  };

  const prompt = `You are writing a 90-day action plan for a Google Ads client.
This is a CLIENT-FACING document — write in clear, plain language. No agency jargon.
Tone: professional, confident, reassuring. Like a trusted advisor, not a vendor.

ACCOUNT: ${account.name}
INDUSTRY: ${account.industry ?? "not set"}
${account.businessModel ? `TYPE: ${businessLabel[account.businessModel] ?? account.businessModel}` : ""}
CURRENCY: ${account.currency}
CURRENT MONTH: ${currentMonth}
NEXT 3 MONTHS: ${month1}, ${month2}, ${month3}
SEASONAL CONTEXT: ${seasonalCtx[m]}

CURRENT PERFORMANCE:
${actualRoas != null ? `- ROAS: ${actualRoas.toFixed(2)}×` : "- ROAS: not tracked (lead-gen or no conversion value)"}
${effectiveTargetRoas ? `- Target ROAS: ${effectiveTargetRoas}×` : ""}
${spend30d ? `- Monthly ad spend: ${account.currency} ${Math.round(spend30d).toLocaleString()}` : ""}
${revenue30d ? `- Monthly revenue from ads: ${account.currency} ${revenue30d.toLocaleString()}` : ""}
${cvr && cvr > 0 ? `- Conversion rate: ${(cvr * 100).toFixed(2)}%` : ""}
${body.monthlyGoal ? `- Client's revenue goal: ${account.currency} ${body.monthlyGoal.toLocaleString()}/month` : ""}

PRIMARY BOTTLENECK: ${governing}
REASON: ${snapshot.constraintReason}

DIAGNOSTIC SCORES:
${relevantBuckets}

PENDING ACTIONS (from diagnostic system):
${actionsContext}

${body.productContext ? `PRODUCT PERFORMANCE (last 30 days vs prior 30 days):\n${body.productContext}\n` : ""}
${account.clientContext ? `ACCOUNT CONTEXT:\n${account.clientContext}\n` : ""}
${body.contextNotes ? `MANAGER NOTES FOR THIS PLAN:\n${body.contextNotes}\n` : ""}

---

Output ONLY a valid JSON object matching this exact schema. No markdown, no explanation, no extra text — just the JSON.

{
  "summary": "[1 sentence: what ROAS is now → what we'll achieve → timeframe. Include specific numbers.]",
  "clientMessage": "[1-2 sentences in plain language: why this plan, what the client should understand about the 90 days ahead.]",
  "actions": [
    {
      "title": "[Short action title — 4-6 words]",
      "clientExplanation": "[1-2 sentences in plain client language: what we're doing and why it will improve their results. No technical terms.]",
      "steps": [
        "[Specific step 1 — concrete enough to execute]",
        "[Specific step 2]",
        "[Specific step 3 — max 3 steps]"
      ],
      "timeline": "[e.g. Week 1–2]",
      "expectedOutcome": "[Specific expected improvement — e.g. +0.4 ROAS within 3 weeks]"
    }
  ],
  "phases": [
    {
      "month": "${month1}",
      "theme": "[4-6 word theme for month 1]",
      "points": [
        "[What we'll do — client language, 1 line]",
        "[Point 2]",
        "[Point 3]",
        "[Point 4 max]"
      ]
    },
    {
      "month": "${month2}",
      "theme": "[Theme for month 2]",
      "points": ["[Point 1]", "[Point 2]", "[Point 3]", "[Point 4 max]"]
    },
    {
      "month": "${month3}",
      "theme": "[Theme for month 3]",
      "points": ["[Point 1]", "[Point 2]", "[Point 3]", "[Point 4 max]"]
    }
  ],
  "seasonalNote": "[1-2 sentences on what to expect over the next 3 months seasonally: what months look like revenue-wise, what this means for the client's expectations.]",
  "productInsight": ${body.productContext ? '"[1-2 sentences on the biggest product opportunity or concern based on the performance data. Name specific products if possible. null if no product data.]"' : 'null'},
  "targets": [
    {
      "month": "${month1}",
      "revenue": "[Realistic revenue target in ${account.currency} — account for seasonality]",
      "roas": "[Realistic ROAS target for this month e.g. 4.5×]",
      "focus": "[One-line strategic focus for this month]"
    },
    { "month": "${month2}", "revenue": "...", "roas": "...", "focus": "..." },
    { "month": "${month3}", "revenue": "...", "roas": "...", "focus": "..." }
  ]
}

RULES:
- Write for the CLIENT — they are the business owner, not a Google Ads expert.
- Actions should explain what we're doing in terms of results ("we'll improve the product selection shown to your best customers"), not technical methods ("we'll adjust PMax asset groups").
- ${isLeadGen ? "Never mention ROAS — this is lead-gen. Focus on cost per lead, lead volume, lead quality." : "Reference specific product names where product data is provided."}
- Revenue targets must account for seasonal patterns described above.
- ROAS targets must be realistic — don't set targets above ${effectiveTargetRoas ?? (actualRoas ? (actualRoas * 1.4).toFixed(1) : 5)} for the 3-month horizon.
- Never mention budget utilization, impression share, or tracking issues unless the governing constraint is MEASUREMENT.
- Each action's clientExplanation should be something a business owner would genuinely find useful and reassuring.`;

  try {
    const response = await client.messages.create({
      model:      "claude-sonnet-4-6",
      max_tokens: 2000,
      system:     "You are a senior Google Ads strategist writing a client-facing plan. You output only valid JSON. No markdown fences, no explanation — just the JSON object.",
      messages:   [{ role: "user", content: prompt }],
    });

    const rawText = response.content[0].type === "text" ? response.content[0].text : "";

    // Parse JSON — strip any accidental markdown fences
    const jsonStr = rawText.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/```\s*$/, "").trim();
    const planJson = JSON.parse(jsonStr) as PlanV2;

    const stored: StoredPlan = {
      version:      2,
      plan:         planJson,
      settings: {
        targetRoas:   body.targetRoas   ?? null,
        monthlyGoal:  body.monthlyGoal  ?? null,
        contextNotes: body.contextNotes ?? null,
        liveRoas:     actualRoas        ?? null,
        liveSpend:    spend30d          ?? null,
      },
      generatedAt:  new Date().toISOString(),
      snapshotDate: snapshot.createdAt.toISOString(),
    };

    await prisma.clientActionPlan.create({
      data: {
        accountId:  id,
        content:    JSON.stringify(stored),
        snapshotId: snapshot.id,
      },
    });

    return NextResponse.json({ ok: true, plan: stored });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
