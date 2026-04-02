/**
 * POST /api/accounts/[id]/chat
 *
 * Streaming chat endpoint for the senior Google Ads specialist assistant.
 * The AI receives full signal context — actual metric values, account targets,
 * business model, and all action recommendations — so it can give specific,
 * data-driven advice rather than generic optimization commentary.
 */
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { BUCKET_LABELS, BUCKET_DESCRIPTIONS, ConstraintSignals } from "@/lib/engine/types";
import { fetchDemographics, fetchSearchTermReport, DemographicRow, SearchTermRow } from "@/lib/integrations/google-ads";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { AGENCY_PHILOSOPHY } from "@/lib/agencyPhilosophy";

type Params = { params: Promise<{ id: string }> };

const client = new Anthropic();

// ─── Formatting helpers ────────────────────────────────────────────────────────

function pct(v: number, decimals = 1): string {
  return `${(v * 100).toFixed(decimals)}%`;
}
function money(v: number, currency = "EUR"): string {
  const sym = currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency === "USD" ? "$" : currency + " ";
  return `${sym}${v.toFixed(2)}`;
}
function score(v: number): string {
  return `${v.toFixed(1)}/10`;
}

// ─── Signal context builder ────────────────────────────────────────────────────

function buildSignalContext(signals: ConstraintSignals, currency: string): string {
  const m = signals.measurement;
  const t = signals.traffic;
  const c = signals.conversion;
  const f = signals.funnel;
  const e = signals.economics;

  const lines: string[] = ["LIVE SIGNAL DATA (actual metric values from last scoring run):"];

  // ── Measurement ──────────────────────────────────────────────────────────────
  lines.push("\n[Measurement]");
  lines.push(`  Conversion tracking active: ${m.conversionTrackingActive ? "YES" : "NO ⚠"}`);
  lines.push(`  Conversion actions: ${m.conversionActionsCount}`);
  lines.push(`  Enhanced conversions: ${m.hasEnhancedConversions ? "enabled" : "NOT enabled"}`);
  if (m.hasEnhancedConversions && m.enhancedConversionsDegraded) {
    lines.push(`  ⚠ Enhanced conversions degraded (conversion volume dropped ≥40%)`);
  }
  lines.push(`  Tag coverage: ${pct(m.tagCoveragePercent)}`);
  lines.push(`  Merchant Center linked: ${m.hasMerchantCenterLinked ? "yes" : "no"}`);
  lines.push(`  Attribution lag: ${m.dateLagDays.toFixed(1)} days`);

  // ── Traffic ──────────────────────────────────────────────────────────────────
  lines.push("\n[Traffic]");
  lines.push(`  Impression share: ${pct(t.searchImpressionShare)}`);
  lines.push(`  IS lost to budget: ${pct(t.impressionShareLost_budget)}`);
  lines.push(`  IS lost to rank: ${pct(t.impressionShareLost_rank)}`);
  lines.push(`  CTR (last 14d): ${pct(t.clickThroughRate, 2)}`);
  if (t.clickThroughRateBaseline > 0) {
    const trend = ((t.clickThroughRate / t.clickThroughRateBaseline) - 1) * 100;
    lines.push(`  CTR vs 6-month baseline: ${trend >= 0 ? "+" : ""}${trend.toFixed(1)}% (baseline: ${pct(t.clickThroughRateBaseline, 2)})`);
  }
  lines.push(`  Avg CPC: ${money(t.averageCpc, currency)}`);
  if (t.qualityScoreCount > 0) {
    lines.push(`  Avg Quality Score: ${score(t.qualityScoreAvg)} (across ${t.qualityScoreCount} keywords)`);
  } else {
    lines.push(`  Feed-only account (Shopping/PMax) — no keyword QS`);
    if (t.productDisapprovalRate > 0) {
      lines.push(`  Product disapproval rate: ${pct(t.productDisapprovalRate)}`);
    }
  }
  lines.push(`  Irrelevant query spend: ${pct(t.irrelevantQueryPercent)}`);

  // ── Conversion ───────────────────────────────────────────────────────────────
  lines.push("\n[Website Conversion]");
  lines.push(`  CVR (last 14d): ${pct(c.conversionRate, 2)}`);
  if (c.conversionRateBaseline > 0) {
    const trend = ((c.conversionRate / c.conversionRateBaseline) - 1) * 100;
    lines.push(`  CVR vs 6-month baseline: ${trend >= 0 ? "+" : ""}${trend.toFixed(1)}% (baseline: ${pct(c.conversionRateBaseline, 2)})`);
  }
  if (c.industryBenchmarkConversionRate > 0) {
    lines.push(`  Industry CVR benchmark: ${pct(c.industryBenchmarkConversionRate, 2)}`);
  }
  if (c.landingPageScore > 0) {
    lines.push(`  Landing page score: ${score(c.landingPageScore)}`);
  }
  if (c.mobileSpeedScore > 0) {
    lines.push(`  Mobile-friendly click rate: ${c.mobileSpeedScore}% (% of mobile clicks going to a mobile-optimised URL — source: Google Ads API. This is NOT a PageSpeed score; run PageSpeed Insights separately for actual load speed.)`);
  }
  if (c.bounceRateEstimate > 0) {
    lines.push(`  Bounce rate: ${pct(c.bounceRateEstimate)}`);
  }

  // ── Funnel ───────────────────────────────────────────────────────────────────
  lines.push("\n[Funnel]");
  if (f.targetCostPerLead > 0) {
    lines.push(`  CPL: ${money(f.costPerLead, currency)} (target: ${money(f.targetCostPerLead, currency)})`);
    const cplGap = ((f.costPerLead / f.targetCostPerLead) - 1) * 100;
    lines.push(`  CPL vs target: ${cplGap >= 0 ? "+" : ""}${cplGap.toFixed(1)}%`);
  } else if (f.costPerLead > 0) {
    lines.push(`  CPL: ${money(f.costPerLead, currency)} (no target set)`);
  }
  if (f.leadToSaleRate > 0) {
    lines.push(`  Lead-to-sale rate: ${pct(f.leadToSaleRate)}`);
  }
  if (f.averageLeadQualityScore > 0) {
    lines.push(`  Lead quality score: ${score(f.averageLeadQualityScore)}`);
  }
  lines.push(`  Offline conversion import: ${f.offlineConversionImportActive ? "active" : "not active"}`);

  // ── Economics ────────────────────────────────────────────────────────────────
  lines.push("\n[Business Economics]");
  if (e.targetRoas > 0) {
    lines.push(`  ROAS: ${e.actualRoas.toFixed(2)}x (target: ${e.targetRoas.toFixed(2)}x${e.actualRoasBaseline > 0 ? `, 6-month baseline: ${e.actualRoasBaseline.toFixed(2)}x` : ""})`);
    const roasGap = ((e.actualRoas / e.targetRoas) - 1) * 100;
    lines.push(`  ROAS vs target: ${roasGap >= 0 ? "+" : ""}${roasGap.toFixed(1)}%`);
  } else if (e.actualRoas > 0) {
    lines.push(`  ROAS: ${e.actualRoas.toFixed(2)}x (no target set${e.actualRoasBaseline > 0 ? `, 6-month baseline: ${e.actualRoasBaseline.toFixed(2)}x` : ""})`);
  }
  if (e.targetCpa > 0 && e.actualCpa > 0) {
    lines.push(`  CPA: ${money(e.actualCpa, currency)} (target: ${money(e.targetCpa, currency)}${e.actualCpaBaseline > 0 ? `, baseline: ${money(e.actualCpaBaseline, currency)}` : ""})`);
    const cpaGap = ((e.actualCpa / e.targetCpa) - 1) * 100;
    lines.push(`  CPA vs target: ${cpaGap >= 0 ? "+" : ""}${cpaGap.toFixed(1)}%`);
  }
  if (e.grossMarginPercent > 0) {
    const breakEven = 1 / e.grossMarginPercent;
    lines.push(`  Gross margin: ${pct(e.grossMarginPercent)} (break-even ROAS: ${breakEven.toFixed(2)}x)`);
  }
  if (e.avgOrderValue > 0) {
    lines.push(`  Avg order value: ${money(e.avgOrderValue, currency)}`);
  }
  if (e.ltv > 0) {
    lines.push(`  Customer LTV: ${money(e.ltv, currency)}`);
  }
  lines.push(`  Budget utilisation: ${pct(e.budgetUtilizationPercent)}`);

  return lines.join("\n");
}

// ─── System prompt builder ─────────────────────────────────────────────────────

function buildDemographicsContext(rows: DemographicRow[], currency: string): string {
  if (rows.length === 0) return "";
  const lines = ["\nDEMOGRAPHICS (last 30 days):"];

  const totalCost = rows.filter(r => r.dimension === "device").reduce((s, r) => s + r.costMicros, 0);
  const fmt = (r: DemographicRow) => {
    const costEur  = (r.costMicros / 1_000_000).toFixed(2);
    const ctr      = r.impressions > 0 ? ((r.clicks / r.impressions) * 100).toFixed(2) : "0";
    const cvr      = r.clicks > 0 ? ((r.conversions / r.clicks) * 100).toFixed(2) : "0";
    const costShare = totalCost > 0 ? ((r.costMicros / totalCost) * 100).toFixed(0) : "?";
    const roas     = r.costMicros > 0 && r.convValue > 0
      ? ` ROAS: ${(r.convValue / (r.costMicros / 1_000_000)).toFixed(2)}x`
      : "";
    return `  ${r.label.replace("AGE_RANGE_", "").replace("_", "–")}: spend ${costShare}% (${money(parseFloat(costEur), currency)}), CTR ${ctr}%, CVR ${cvr}%, conv ${r.conversions.toFixed(1)}${roas}`;
  };

  // UNKNOWN = Google couldn't determine the dimension (common for PMax / broad match).
  // It's not actionable so exclude it from the context — the specialist knows it exists.
  const SKIP = new Set(["UNKNOWN", "UNDETERMINED", "UNSPECIFIED"]);
  const known = (r: DemographicRow) => !SKIP.has(r.label);

  const devices = rows.filter(r => r.dimension === "device" && known(r)).sort((a, b) => b.costMicros - a.costMicros);
  const ages    = rows.filter(r => r.dimension === "age"    && known(r)).sort((a, b) => b.costMicros - a.costMicros);
  const genders = rows.filter(r => r.dimension === "gender" && known(r)).sort((a, b) => b.costMicros - a.costMicros);

  // Note for the model: UNKNOWN entries are omitted (expected for PMax/broad)
  lines.push("(UNKNOWN entries omitted — normal for PMax and broad match campaigns)");

  if (devices.length) { lines.push("Device:"); devices.forEach(r => lines.push(fmt(r))); }
  if (ages.length)    { lines.push("Age:"); ages.forEach(r => lines.push(fmt(r))); }
  if (genders.length) { lines.push("Gender:"); genders.forEach(r => lines.push(fmt(r))); }

  return lines.join("\n");
}

function buildSearchTermContext(rows: SearchTermRow[], currency: string): string {
  if (rows.length === 0) return "";
  const excludes = rows.filter(r => r.recommendation === "EXCLUDE").slice(0, 15);
  const watches  = rows.filter(r => r.recommendation === "WATCH").slice(0, 10);
  const lines    = ["\nSEARCH TERMS (last 90 days — top issues):"];

  if (excludes.length) {
    lines.push(`EXCLUDE candidates (0 conv, high spend):`);
    excludes.forEach(r => {
      const cost = r.source === "search" ? ` ${money(r.costEur, currency)}` : ` ${r.clicks} clicks`;
      lines.push(`  "${r.searchTerm}" [${r.campaignName}]${cost}`);
    });
  }
  if (watches.length) {
    lines.push(`WATCH (0 conv, accumulating spend):`);
    watches.forEach(r => {
      const cost = r.source === "search" ? ` ${money(r.costEur, currency)}` : ` ${r.clicks} clicks`;
      lines.push(`  "${r.searchTerm}" [${r.campaignName}]${cost}`);
    });
  }
  if (excludes.length === 0 && watches.length === 0) {
    lines.push("  No high-waste search terms detected.");
  }
  return lines.join("\n");
}

function buildSystemPrompt(params: {
  accountName:         string;
  currency:            string;
  industry:            string | null;
  country:             string | null;
  businessModel:       string | null;
  monthlyBudget:       number | null;
  targetRoas:          number | null;
  targetCpa:           number | null;
  grossMarginPercent:  number | null;
  governingConstraint: string;
  constraintReason:    string;
  bucketScores:        Record<string, number>;
  allActions:          Array<{ title: string; description: string; impact: string; effort: string; bucket: string }>;
  signals:             ConstraintSignals | null;
  demographics:        DemographicRow[];
  searchTerms:         SearchTermRow[];
  clientContext:       string | null;
  sopContext:          string;
  notionContext:       string;
  correctionContext:   string;
  globalPatternContext: string;
}): string {
  const {
    accountName, currency, industry, country, businessModel, monthlyBudget,
    targetRoas, targetCpa, grossMarginPercent,
    governingConstraint, constraintReason, bucketScores, allActions, signals,
    demographics, searchTerms,
    clientContext, sopContext, notionContext, correctionContext, globalPatternContext,
  } = params;

  const bucketSummary = Object.entries(bucketScores)
    .map(([bucket, score]) => {
      const label = BUCKET_LABELS[bucket as keyof typeof BUCKET_LABELS] ?? bucket;
      const desc  = BUCKET_DESCRIPTIONS[bucket as keyof typeof BUCKET_DESCRIPTIONS] ?? "";
      const bar   = score >= 70 ? "●●●" : score >= 45 ? "●●○" : "●○○";
      return `  ${bar} ${label} (${desc}): ${Math.round(score)}/100`;
    })
    .join("\n");

  const actionSummary = allActions
    .map((a, i) => `  ${i + 1}. [${a.impact} impact · ${a.bucket}] ${a.title}\n     ${a.description}`)
    .join("\n\n");

  const accountMeta = [
    industry     && `Industry: ${industry}`,
    country      && `Market: ${country}`,
    businessModel && `Business model: ${businessModel}`,
    currency     && `Currency: ${currency}`,
    monthlyBudget && `Agreed monthly budget: ${money(monthlyBudget, currency)} (intentionally set by the agency — IS lost to budget is expected and not a problem to escalate)`,
    targetRoas   && `ROAS target: ${targetRoas.toFixed(2)}x`,
    targetCpa    && `CPA target: ${money(targetCpa, currency)}`,
    grossMarginPercent && `Gross margin: ${pct(grossMarginPercent)}`,
  ].filter(Boolean).join("\n");

  const signalContext = signals ? "\n\n" + buildSignalContext(signals, currency) : "";
  const demoContext   = buildDemographicsContext(demographics, currency);
  const stContext     = buildSearchTermContext(searchTerms, currency);
  const clientBriefSection    = clientContext        ? `\n\nCLIENT BRIEF:\n${clientContext}` : "";
  const sopSection            = sopContext           ? `\n\n${sopContext}` : "";
  const notionSection         = notionContext        ? `\n\n${notionContext}` : "";
  const correctionSection     = correctionContext    ? `\n\n${correctionContext}` : "";
  const globalPatternSection  = globalPatternContext ? `\n\n${globalPatternContext}` : "";

  return `You are an expert senior Google Ads specialist embedded in an agency performance platform. You have full access to this account's data — it was fetched directly from Google Ads API and Merchant Center moments before this conversation. Never say you lack access to Google Ads data; everything you need is already provided below.

${AGENCY_PHILOSOPHY}

ACCOUNT: ${accountName}
${accountMeta}

DATA SOURCE: All metrics below are pulled live from this account's Google Ads API. You have the actual numbers — use them. If a specific dimension isn't listed (e.g. a specific campaign's day-parting), say you don't have that level of detail in the current context rather than saying you have no Google Ads access.

CONSTRAINT FRAMEWORK:
Accounts are systems with one governing constraint at any time. Fix the constraint first, then re-score. The sequence is: Measurement → Traffic → Website Conversion → Funnel → Business Economics. Fixing a downstream issue while an upstream constraint exists wastes time.

CURRENT GOVERNING CONSTRAINT: ${BUCKET_LABELS[governingConstraint as keyof typeof BUCKET_LABELS] ?? governingConstraint}
Why: ${constraintReason}

BUCKET HEALTH:
${bucketSummary}

RECOMMENDED ACTIONS (prioritised):
${actionSummary}
${signalContext}${demoContext}${stContext}${clientBriefSection}${sopSection}

YOUR BEHAVIOUR:
- You have real account data. Use specific numbers in every response: "CTR dropped from 2.8% to 1.1%" not "CTR is low".
- If a metric isn't in the data above, say "I don't have that breakdown in the current context" — never say you lack Google Ads access.
- Anchor every answer to the governing constraint unless the user explicitly asks about a different bucket.
- Flag client escalations clearly (website changes, CRM setup, offline conversion import).
- For Shopping/PMax: think feed quality, product segmentation, asset group performance — not keyword QS.
- Be direct. Skip preamble. One problem → one cause → one fix.
- For price competitiveness and competitor pricing: that data is in the Products tab of this account.${notionSection}${correctionSection}${globalPatternSection}`;
}

// ─── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;
  const { message, sessionId } = await req.json() as {
    message: string;
    sessionId?: string;
  };

  // Load everything in parallel
  const [account, sops, notionConn, learnedPatterns] = await Promise.all([
    prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } }),
    prisma.agencySop.findMany({ where: { organizationId: ctx.orgId, isActive: true }, orderBy: { createdAt: "asc" } }),
    prisma.notionConnection.findUnique({
      where:   { organizationId: ctx.orgId },
      include: { pageCache: { orderBy: { fetchedAt: "desc" } } },
    }),
    prisma.learnedPattern.findMany({
      where: { isActive: true, OR: [{ orgId: ctx.orgId }, { orgId: null }] },
      orderBy: { seenCount: "desc" },
      take: 20,
    }),
  ]);

  if (!account) return forbidden();

  const snapshot = await prisma.constraintSnapshot.findFirst({
    where: { accountId: id },
    orderBy: { createdAt: "desc" },
    include: { actions: { orderBy: { impact: "asc" } } },
  });

  if (!snapshot) {
    return NextResponse.json(
      { error: "No constraint snapshot found. Run a scoring first." },
      { status: 400 }
    );
  }

  // Get or create chat session
  let session;
  if (sessionId) {
    session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: { messages: { orderBy: { createdAt: "asc" }, take: 30 } },
    });
  }
  if (!session) {
    session = await prisma.chatSession.create({
      data: { accountId: id },
      include: { messages: true },
    });
  }

  // Save user message
  await prisma.chatMessage.create({
    data: { sessionId: session.id, role: "user", content: message },
  });

  // Parse rawSignals
  let signals: ConstraintSignals | null = null;
  try {
    signals = JSON.parse(snapshot.rawSignals) as ConstraintSignals;
  } catch {
    // If parsing fails, continue without signal detail — prompt degrades gracefully
  }

  // Fetch live demographics + search terms in parallel (non-blocking — fail gracefully)
  const googleAdsId = account.googleAdsId;
  const [demographics, searchTerms]: [DemographicRow[], SearchTermRow[]] = googleAdsId
    ? await Promise.all([
        fetchDemographics(googleAdsId, ctx.orgId).catch((): DemographicRow[] => []),
        fetchSearchTermReport(googleAdsId, ctx.orgId).catch((): SearchTermRow[] => []),
      ])
    : [[], []];

  const bucketScores: Record<string, number> = {
    MEASUREMENT: snapshot.scoreMeasurement,
    TRAFFIC:     snapshot.scoreTraffic,
    CONVERSION:  snapshot.scoreConversion,
    FUNNEL:      snapshot.scoreFunnel,
    ECONOMICS:   snapshot.scoreEconomics,
  };

  const sopContext = sops.length > 0
    ? `AGENCY SOPs (always follow these):\n${sops.map(s => `--- ${s.title} ---\n${s.content}`).join("\n\n").slice(0, 4000)}`
    : "";

  // Notion knowledge base: pages the org has synced
  const notionContext = notionConn && notionConn.pageCache.length > 0
    ? `AGENCY KNOWLEDGE BASE (from Notion — treat as authoritative reference):\n` +
      notionConn.pageCache
        .map(p => `--- ${p.title} ---\n${p.content}`)
        .join("\n\n")
        .slice(0, 6000)
    : "";

  // Learned patterns: org-specific corrections + global patterns promoted from cross-org feedback
  const orgCorrections = await prisma.chatFeedback.findMany({
    where:   { orgId: ctx.orgId, rating: "down", correction: { not: null } },
    orderBy: { createdAt: "desc" },
    take:    10,
  });
  const correctionContext = orgCorrections.length > 0
    ? `TEAM FEEDBACK — PREVIOUSLY CORRECTED PATTERNS (prioritise these):\n` +
      orgCorrections
        .map(f => `- ${f.questionText ? `Q: "${f.questionText.slice(0, 80)}" → ` : ""}Correction: ${f.correction}`)
        .join("\n")
    : "";
  const globalPatternContext = learnedPatterns.length > 0
    ? `LEARNED PATTERNS (validated across accounts):\n` +
      learnedPatterns.map(p => `- [${p.questionType}] ${p.pattern}`).join("\n")
    : "";

  const systemPrompt = buildSystemPrompt({
    accountName:         account.name,
    currency:            account.currency,
    industry:            account.industry ?? null,
    country:             account.country ?? null,
    businessModel:       account.businessModel ?? null,
    monthlyBudget:       account.monthlyBudget ?? null,
    targetRoas:          account.targetRoas ?? null,
    targetCpa:           account.targetCpa ?? null,
    grossMarginPercent:  account.grossMarginPercent ?? null,
    governingConstraint: snapshot.governingConstraint,
    constraintReason:    snapshot.constraintReason,
    bucketScores,
    allActions: snapshot.actions.map(a => ({
      title:       a.title,
      description: a.description,
      impact:      a.impact,
      effort:      a.effort,
      bucket:      a.bucket,
    })),
    signals,
    demographics,
    searchTerms,
    clientContext:        account.clientContext ?? null,
    sopContext,
    notionContext,
    correctionContext,
    globalPatternContext,
  });

  const history = (session.messages ?? []).map(m => ({
    role:    m.role as "user" | "assistant",
    content: m.content,
  }));

  // Stream response
  const encoder = new TextEncoder();
  let fullResponse = "";

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = await client.messages.stream({
          model:      "claude-sonnet-4-6",
          max_tokens: 2048,
          system:     systemPrompt,
          messages: [
            ...history,
            { role: "user", content: message },
          ],
        });

        for await (const chunk of anthropicStream) {
          if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
            const text = chunk.delta.text;
            fullResponse += text;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
          }
        }

        const assistantMessage = await prisma.chatMessage.create({
          data: { sessionId: session!.id, role: "assistant", content: fullResponse },
        });

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ done: true, sessionId: session!.id, messageId: assistantMessage.id })}\n\n`)
        );
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
