/**
 * POST /api/accounts/[id]/intelligence
 *
 * Streams a concise, context-aware intelligence brief for the account.
 * Uses all available signal data, client context, and account targets to
 * produce a sharp analyst-grade summary — not generic advice.
 */
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { scoreConstraints } from "@/lib/engine";
import { ConstraintSignals, BUCKET_LABELS } from "@/lib/engine/types";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { AGENCY_PHILOSOPHY } from "@/lib/agencyPhilosophy";
import { fetchSlackMessages, formatSlackForContext } from "@/lib/integrations/slack";
import { fetchProductPerformance, fetchCampaignBreakdown, fetchPriorPeriodProducts } from "@/lib/integrations/google-ads";
import { getMerchantCenterIds, fetchPriceCompetitiveness } from "@/lib/integrations/merchant-center";
import { searchKnowledge } from "@/lib/knowledge-search";

type Params = { params: Promise<{ id: string }> };

const client = new Anthropic();

export async function POST(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;

  const [account, notionConn, slackConn] = await Promise.all([
    prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } }),
    prisma.notionConnection.findUnique({
      where:   { organizationId: ctx.orgId },
      include: { pageCache: { orderBy: { fetchedAt: "desc" } } },
    }),
    prisma.slackConnection.findUnique({ where: { organizationId: ctx.orgId } }),
  ]);
  if (!account) return forbidden();

  const snapshot = await prisma.constraintSnapshot.findFirst({
    where: { accountId: id },
    orderBy: { createdAt: "desc" },
    include: { actions: { orderBy: { impact: "asc" }, take: 5 } },
  });

  if (!snapshot) {
    return NextResponse.json({ error: "No snapshot found" }, { status: 404 });
  }

  // Re-run scorer to get per-bucket signals
  let signals: ConstraintSignals | null = null;
  let bucketSignals: Record<string, string[]> = {};
  try {
    signals = JSON.parse(snapshot.rawSignals) as ConstraintSignals;
    const result = scoreConstraints(signals);
    bucketSignals = Object.fromEntries(result.buckets.map(b => [b.bucket, b.signals]));
  } catch { /* proceed without signals */ }

  // ─── Build context blocks ─────────────────────────────────────────────────

  const buckets = [
    { key: "MEASUREMENT", score: snapshot.scoreMeasurement },
    { key: "TRAFFIC",     score: snapshot.scoreTraffic },
    { key: "CONVERSION",  score: snapshot.scoreConversion },
    { key: "FUNNEL",      score: snapshot.scoreFunnel },
    { key: "ECONOMICS",   score: snapshot.scoreEconomics },
  ];

  const bucketBlock = buckets
    .map(b => {
      const issues = bucketSignals[b.key] ?? [];
      const label = BUCKET_LABELS[b.key as keyof typeof BUCKET_LABELS];
      const issueStr = issues.length ? `\n    Issues: ${issues.join(" | ")}` : "";
      return `  ${label}: ${Math.round(b.score)}/100${issueStr}`;
    })
    .join("\n");

  const governing = BUCKET_LABELS[snapshot.governingConstraint as keyof typeof BUCKET_LABELS] ?? snapshot.governingConstraint;

  const targetsBlock = [
    account.targetRoas         != null ? `Target ROAS: ${account.targetRoas}x` : null,
    account.targetCpa          != null ? `Target CPA: ${account.targetCpa}` : null,
    account.grossMarginPercent != null ? `Gross margin: ${Math.round(account.grossMarginPercent * 100)}% (break-even ROAS: ${(1 / account.grossMarginPercent).toFixed(1)}x)` : null,
  ].filter(Boolean).join(" | ") || "No targets set";

  // ── Account type detection ────────────────────────────────────────────────
  // Lead gen: explicit businessModel OR funnel signals show CPL with no ecommerce revenue
  const isLeadGen = account.businessModel === "lead_gen" || account.businessModel === "service"
    || (!account.businessModel && signals?.funnel?.costPerLead != null && signals.funnel.costPerLead > 0 && (signals?.economics?.actualRoas ?? 0) === 0);

  // Shopping/PMax: feed-based (no keyword QS) AND not lead gen
  const isShoppingAccount = !isLeadGen && (signals?.traffic
    ? signals.traffic.qualityScoreCount === 0
    : account.businessModel === "ecommerce" || account.businessModel === "dtc" || account.businessModel === "dropship");

  // Check if there is enough real data to give a meaningful analysis
  const hasRealData = signals != null && (
    (signals.economics.actualRoas > 0 || signals.economics.actualCpa > 0) ||
    (signals.funnel?.costPerLead ?? 0) > 0 ||
    signals.traffic.clickThroughRate > 0
  );
  const dataAge = snapshot.createdAt
    ? Math.round((Date.now() - new Date(snapshot.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  let metricsBlock = "";
  if (signals) {
    const t = signals.traffic;
    const e = signals.economics;
    const c = signals.conversion;
    const f = signals.funnel;
    const rows = [
      `CTR (14d): ${(t.clickThroughRate * 100).toFixed(2)}%`,
      (!isShoppingAccount && t.qualityScoreCount > 0)
        ? `Quality Score: ${t.qualityScoreAvg.toFixed(1)}/10 (${t.qualityScoreCount} keywords)`
        : isShoppingAccount ? `Feed-based (Shopping/PMax) — QS not applicable` : null,
      `IS lost to budget (14d): ${Math.round(t.impressionShareLost_budget * 100)}%`,
      `IS lost to rank (14d): ${Math.round(t.impressionShareLost_rank * 100)}%`,
      // Ecommerce metrics
      (!isLeadGen && e.actualRoas > 0) ? `Actual ROAS (14d): ${e.actualRoas.toFixed(2)}x` : null,
      (!isLeadGen && e.actualRoas === 0 && !isLeadGen) ? `Actual ROAS (14d): NOT AVAILABLE via campaign resource — use PRODUCT PERFORMANCE Account ROAS below if present` : null,
      (!isLeadGen && e.actualCpa  > 0) ? `Actual CPA (14d): ${e.actualCpa.toFixed(0)}` : null,
      // Lead gen metrics
      (isLeadGen && f?.costPerLead   > 0)                          ? `CPL (14d): ${e.actualCpa > 0 ? e.actualCpa.toFixed(0) : f.costPerLead.toFixed(0)} (target: ${account.targetCpa ?? "not set"})` : null,
      (isLeadGen && f?.leadToSaleRate > 0)                         ? `Lead-to-sale rate: ${(f.leadToSaleRate * 100).toFixed(1)}%` : null,
      (isLeadGen && f?.averageLeadQualityScore > 0)                 ? `Avg lead quality: ${f.averageLeadQualityScore.toFixed(1)}/10` : null,
      (isLeadGen)                                                   ? `Offline conversion import: ${f?.offlineConversionImportActive ? "active" : "NOT active — sales not tracked back to clicks"}` : null,
      c.conversionRate > 0 ? `${isLeadGen ? "Form CVR" : "CVR"} (14d): ${(c.conversionRate * 100).toFixed(2)}% (benchmark: ${(c.industryBenchmarkConversionRate * 100).toFixed(1)}%)` : null,
      `Budget utilisation (30d): ${Math.round(e.budgetUtilizationPercent * 100)}%`,
      !hasRealData ? `⚠ LOW DATA WARNING: This account has very little performance data. Scores are based on setup signals, not conversion history.` : null,
    ].filter(Boolean);
    metricsBlock = rows.join(" | ");
  }

  const clientBrief = account.clientContext
    ? `\nCLIENT BRIEF:\n${account.clientContext}`
    : "";

  const notionContext = notionConn && notionConn.pageCache.length > 0
    ? `\nAGENCY KNOWLEDGE BASE (from Notion):\n` +
      notionConn.pageCache.map(p => `--- ${p.title} ---\n${p.content}`).join("\n\n").slice(0, 4000)
    : "";

  let slackContext = "";
  let slackError = "";
  if (!slackConn) {
    slackError = "No Slack connection configured for this organisation (add bot token in Settings → Slack).";
  } else if (!account.slackChannelId) {
    slackError = "No Slack channel linked to this account.";
  } else {
    try {
      const msgs = await fetchSlackMessages(slackConn.botToken, account.slackChannelId, 90);
      slackContext = msgs.length > 0 ? "\n" + formatSlackForContext(msgs, account.slackChannelName!) : "";
      if (msgs.length === 0) slackError = `Slack channel #${account.slackChannelName} returned 0 messages — bot may not be invited to this channel. Run /invite @<botname> inside the channel.`;
    } catch (e) {
      slackError = `Slack fetch failed: ${e instanceof Error ? e.message : String(e)}`;
    }
  }

  // ── Campaign breakdown (all accounts) ────────────────────────────────────────
  let campaignContext = "";
  if (account.googleAdsId) {
    try {
      const breakdown = await Promise.race([
        fetchCampaignBreakdown(account.googleAdsId, ctx.orgId).catch(() => [] as Awaited<ReturnType<typeof fetchCampaignBreakdown>>),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error("campaign breakdown timed out")), 15_000)),
      ]);
      if (breakdown.length > 0) {
        const curr = account.currency === "EUR" ? "€" : account.currency === "GBP" ? "£" : "$";
        const lines = [`\nCAMPAIGN BREAKDOWN (last 30 days):`];
        for (const c of breakdown) {
          const roasStr = c.roas > 0 ? ` | ROAS ${c.roas.toFixed(2)}x` : " | ROAS n/a";
          const cvrStr  = c.cvr  > 0 ? ` | CVR ${(c.cvr * 100).toFixed(2)}%` : "";
          const typeStr = c.channelType ? ` [${c.channelType}]` : "";
          lines.push(`  - ${c.campaignName}${typeStr}: ${curr}${Math.round(c.spend)} spend${roasStr}${cvrStr}`);
        }
        campaignContext = lines.join("\n");
      }
    } catch { /* non-fatal */ }
  }

  // ── Product + pricing context (all ecommerce accounts — not just Shopping/PMax) ─
  let productContext = "";
  if (account.googleAdsId && !isLeadGen) {
    try {
      const productTimeout = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error("product+MCC fetch timed out")), 20_000)
      );
      const [productData, priorProducts, mcIds] = await Promise.race([
        Promise.all([
          fetchProductPerformance(account.googleAdsId, ctx.orgId).catch(() => null),
          fetchPriorPeriodProducts(account.googleAdsId, ctx.orgId).catch(() => []),
          getMerchantCenterIds(account.googleAdsId, ctx.orgId).catch(() => [] as string[]),
        ]),
        productTimeout.then(() => [null, [], [] as string[]] as const),
      ]);

      // Price competitiveness — use first Merchant Center ID
      let priceRows: { itemId: string; title: string; priceDiffPercent: number; status: string; benchmarkMicros: number; currencyCode: string }[] = [];
      if (mcIds.length > 0) {
        try {
          const priceData = await Promise.race([
            fetchPriceCompetitiveness(mcIds[0], ctx.orgId),
            new Promise<never>((_, reject) => setTimeout(() => reject(new Error("price comp timed out")), 10_000)),
          ]);
          priceRows = priceData.products ?? [];
        } catch { /* non-fatal */ }
      }

      if (productData?.products?.length) {
        const curr = account.currency === "EUR" ? "€" : account.currency === "GBP" ? "£" : "$";
        const priceMap = new Map(priceRows.map(p => [p.itemId, p]));

        // Top products by revenue
        const topByRevenue = [...productData.products]
          .filter(p => p.revenue > 0 || p.conversions > 0)
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 8);

        // Products with spend but zero conversions
        const noConv = [...productData.products]
          .filter(p => p.cost > 20 && p.conversions === 0)
          .sort((a, b) => b.cost - a.cost)
          .slice(0, 5);

        const formatProduct = (p: typeof productData.products[0]) => {
          const pc = priceMap.get(p.itemId);
          const priceNote = pc
            ? ` | price ${pc.priceDiffPercent > 0 ? "+" : ""}${pc.priceDiffPercent.toFixed(0)}% vs market (${pc.status})`
            : "";
          const eff = productData.roas > 0 ? ` | ROAS ${p.roas.toFixed(1)}x` : "";
          return `  - ${p.title || p.itemId}: ${p.conversions.toFixed(0)} sales, ${curr}${Math.round(p.revenue)} rev, ${curr}${Math.round(p.cost)} spend${eff}, CTR ${(p.ctr * 100).toFixed(1)}%${priceNote}`;
        };

        const lines = [`\nPRODUCT PERFORMANCE (last 30 days, ${productData.products.length} total products):`];
        lines.push(`Account ROAS: ${productData.roas.toFixed(2)}x | Total revenue: ${curr}${Math.round(productData.totalRevenue)} | Total spend: ${curr}${Math.round(productData.totalCost)}`);

        if (topByRevenue.length > 0) {
          lines.push(`\nTop revenue-generating products:`);
          topByRevenue.forEach(p => lines.push(formatProduct(p)));
        }

        if (noConv.length > 0) {
          lines.push(`\nProducts spending budget with zero conversions (consider excluding or reviewing pricing):`);
          noConv.forEach(p => {
            const pc = priceMap.get(p.itemId);
            const priceNote = pc ? ` | price ${pc.priceDiffPercent > 0 ? "+" : ""}${pc.priceDiffPercent.toFixed(0)}% vs market` : "";
            lines.push(`  - ${p.title || p.itemId}: ${curr}${Math.round(p.cost)} spent, ${p.clicks} clicks, 0 sales${priceNote}`);
          });
        }

        // Overall price competitiveness summary
        if (priceRows.length > 0) {
          const wellAbove = priceRows.filter(p => p.status === "well_above").length;
          const above     = priceRows.filter(p => p.status === "above").length;
          const below     = priceRows.filter(p => p.status === "below" || p.status === "competitive").length;
          lines.push(`\nPrice competitiveness (${priceRows.length} products with benchmark data): ${wellAbove} well above market, ${above} above market, ${below} competitive/below market`);
        }

        // Labelizer health (only when custom_label_0 data is available)
        const dist = productData.labelDistribution ?? [];
        const hasLabels = dist.some(d => d.label !== "unlabeled");
        if (hasLabels) {
          const totalLabeledCost   = dist.reduce((s, d) => s + d.cost, 0);
          const totalLabeledProds  = dist.reduce((s, d) => s + d.products, 0);
          const unlabeled          = dist.find(d => d.label === "unlabeled");
          const unlabeledPct       = totalLabeledProds > 0
            ? Math.round((unlabeled?.products ?? 0) / totalLabeledProds * 100)
            : 0;
          const labelLines = dist
            .map(d => {
              const costPct = totalLabeledCost > 0 ? Math.round(d.cost / totalLabeledCost * 100) : 0;
              const roas    = d.cost > 0 ? (d.revenue / d.cost).toFixed(2) : "n/a";
              return `  ${d.label}: ${d.products} products, ${costPct}% of spend, ROAS ${roas}x`;
            });
          lines.push(`\nLABELIZER HEALTH (custom_label_0):`);
          lines.push(`  ${totalLabeledProds} active products (${unlabeledPct}% unlabeled = still in testing or unclassified)`);
          labelLines.forEach(l => lines.push(l));
          lines.push(`  NOTE: "unlabeled" = new products being tested this week (Villain testing cycle) or products awaiting first impression.`);
          lines.push(`  Sidekicks = too few clicks/conversions to classify yet. Villains = failed test — spending without return. Heroes = proven performers.`);
        }

        // Prior-period comparison (31–60 days ago) — surfaces seasonality and feed pivots
        if (priorProducts && priorProducts.length > 0) {
          const priorMap = new Map(priorProducts.map(p => [p.itemId, p]));

          const droppedOff = productData.products
            .filter(p => {
              const prev = priorMap.get(p.itemId);
              return prev && prev.conversions >= 2 && p.conversions < prev.conversions * 0.5;
            })
            .sort((a, b) => (priorMap.get(b.itemId)?.conversions ?? 0) - (priorMap.get(a.itemId)?.conversions ?? 0))
            .slice(0, 6);

          const emerging = productData.products
            .filter(p => {
              const prev = priorMap.get(p.itemId);
              return p.conversions >= 2 && (!prev || prev.conversions === 0);
            })
            .sort((a, b) => b.conversions - a.conversions)
            .slice(0, 4);

          const disappeared = priorProducts
            .filter(p => p.conversions >= 3 && !productData.products.find(c => c.itemId === p.itemId))
            .slice(0, 4);

          if (droppedOff.length > 0 || emerging.length > 0 || disappeared.length > 0) {
            lines.push(`\nPERIOD-OVER-PERIOD SHIFT (last 30d vs 31–60 days ago — use this to spot seasonality, feed pivots, or bid changes):`);
            if (droppedOff.length > 0) {
              lines.push(`Products that converted 31–60d ago but are underperforming now:`);
              droppedOff.forEach(p => {
                const prev = priorMap.get(p.itemId)!;
                lines.push(`  - "${p.title}": ${prev.conversions.toFixed(0)} sales → ${p.conversions.toFixed(0)} now (-${Math.round((1 - p.conversions / prev.conversions) * 100)}%)`);
              });
            }
            if (emerging.length > 0) {
              lines.push(`Products newly converting in the last 30 days (were not converting before):`);
              emerging.forEach(p => lines.push(`  - "${p.title}": ${p.conversions.toFixed(0)} sales, ${curr}${Math.round(p.revenue)} rev`));
            }
            if (disappeared.length > 0) {
              lines.push(`Products with sales 31–60d ago that are no longer receiving traffic/spend:`);
              disappeared.forEach(p => lines.push(`  - "${p.title}": ${p.conversions.toFixed(0)} sales prev period, now absent`));
            }
          }
        }

        productContext = lines.join("\n");
      }
    } catch { /* non-fatal — intelligence still runs without product data */ }
  }

  const accountTypeNote = isLeadGen
    ? `ACCOUNT TYPE: Lead generation (${account.businessModel ?? "service/lead gen"}). This is NOT an ecommerce account. Do not mention ROAS, product feeds, or purchase revenue. Focus on: CPL vs target, lead volume, lead quality, form CVR, offline conversion import status, search intent quality, funnel handoff to sales team.`
    : isShoppingAccount
    ? `ACCOUNT TYPE: Ecommerce — Shopping/Performance Max (feed-based). Do NOT mention Quality Score. Focus on: product-level ROAS, feed titles, product labels (Heroes/Sidekicks/Zombies), price vs market benchmark, IS lost to rank (bid), zero-conversion products.`
    : `ACCOUNT TYPE: Ecommerce — Search-driven (runs Search campaigns for an online store). This IS a revenue-focused ecommerce account. Focus on: actual ROAS vs target ROAS, product-level performance, pricing vs competitors, CVR on product landing pages, search term hygiene, and keyword intent alignment with buyer stage. Quality Score is relevant but secondary to ROAS and conversion outcomes.`;

  const dataWarning = !hasRealData
    ? `\n⚠ DATA WARNING: This account has very limited performance history (${dataAge != null ? `scored ${dataAge} days ago` : "recently scored"}). The scores reflect setup quality, not conversion outcomes. Do NOT fabricate performance trends. Instead, describe what the setup signals suggest and what to watch for as data accumulates.`
    : "";

  const governingScore = Math.round(
    snapshot.governingConstraint === "MEASUREMENT" ? snapshot.scoreMeasurement :
    snapshot.governingConstraint === "TRAFFIC"     ? snapshot.scoreTraffic     :
    snapshot.governingConstraint === "CONVERSION"  ? snapshot.scoreConversion  :
    snapshot.governingConstraint === "FUNNEL"      ? snapshot.scoreFunnel      :
    snapshot.scoreEconomics
  );

  const businessModelLabel: Record<string, string> = {
    ecommerce: "Ecommerce",
    dtc:       "Direct-to-consumer (DTC)",
    dropship:  "Ecommerce (dropshipping fulfilment model — retailer, not manufacturer)",
    lead_gen:  "Lead generation",
    service:   "Service / lead generation",
    saas:      "SaaS",
  };
  const modelLabel = account.businessModel ? (businessModelLabel[account.businessModel] ?? account.businessModel) : null;

  const prompt = `ACCOUNT: ${account.name}
INDUSTRY: ${account.industry ?? "not set"} | CURRENCY: ${account.currency}${modelLabel ? ` | BUSINESS MODEL: ${modelLabel}` : ""}
${accountTypeNote}
${dataWarning}

GOVERNING CONSTRAINT: ${governing} — score ${governingScore}/100

BUCKET SCORES:
${bucketBlock}

LIVE METRICS [all metrics = last 14 days unless labelled otherwise | snapshot age: ${dataAge != null ? `${dataAge}d` : "recent"}]:
${metricsBlock || "insufficient data"}

TARGETS: ${targetsBlock}
${clientBrief}${campaignContext}${productContext}${notionContext}${slackContext}

---

Produce a 5-line at-a-glance brief. Use EXACTLY this format — no headers, no paragraphs, no bullet sub-lists:

**Bottleneck:** [bucket name] — [one-line diagnosis naming the specific problem, not just the bucket label]
**Numbers:** [2–4 key metrics separated by · — cite actual values from the data above, always state the time window e.g. "ROAS 2.55x (30d)"]
**Root cause:** [one sentence — most likely specific cause, or two candidates with the distinguishing signal. Name specific campaigns if CAMPAIGN BREAKDOWN is available.]
**Priority action:** [one concrete action a specialist can execute today — specific enough to act on without a follow-up question]
**Watch:** [one metric · target threshold · timeframe]

HARD RULES:
- Maximum 80 words total across all 5 lines.
- Every number must appear in the data provided above. Zero fabrication.
- No filler. No explanation of what metrics mean. Write for someone who already knows Google Ads.
- Do not recommend a budget increase if ROAS is below target.
- FRAMING RULE: refer to the client by name or "the account". Never call them a "dropshipper".
- ROAS RULE: If LIVE METRICS shows "ROAS NOT AVAILABLE via campaign resource", use the Account ROAS from the PRODUCT PERFORMANCE block. NEVER write "ROAS 0.00x" or "ROAS is 0" — if you have no ROAS from either source, omit ROAS entirely.
- TIME WINDOW RULE: always state the time window next to every metric you cite (e.g. "CVR 1.04% (14d)", "ROAS 2.55x (30d)"). Never cite a bare number without its window.
${isLeadGen ? `- Never mention ROAS, product feeds, or Shopping. Focus on CPL, form CVR, lead quality, offline conversion import.` : `- For Shopping/PMax accounts: never mention Quality Score.`}
${slackContext ? "- If a team change in the last 14 days correlates with a metric shift, name it in Root cause." : ""}`;

  const systemPrompt = isLeadGen
    ? `You are the senior lead generation Google Ads specialist at a Dutch performance agency. You have deep expertise in B2B and B2C lead gen campaigns — search intent mapping, CPL optimisation, lead quality vs volume trade-offs, offline conversion tracking, CRM integration, and funnel handoff.

You think like a revenue operations expert: you don't just care about leads, you care about leads that turn into clients. You diagnose the full funnel — from keyword intent to form submission to sales outcome.

You write for understudies. Your brief tells a junior specialist exactly what to do this week: which campaigns to adjust, which keywords to exclude, what to say to the client about their landing page or lead follow-up process, and what metric to watch in 7 days.

You never use generic advice. Every sentence cites actual numbers from the data provided. You never mention ROAS or product feeds — they are irrelevant for this account type.

${AGENCY_PHILOSOPHY}`
    : `You are the senior ecommerce Google Ads specialist at a Dutch performance agency. You have deep expertise in Shopping, Performance Max, feed optimisation, product segmentation (Heroes/Sidekicks/Zombies/Villains via ProductHero), conversion rate diagnosis, and scaling strategy.

You think like a diagnostician, not a commentator. You find the one thing blocking growth and prescribe the exact fix. You write for understudies — someone reading your brief should know exactly what to do this week without needing to ask a follow-up question.

You never explain what a metric is. You never say "you may want to consider". You never give advice that applies to every account equally. Everything you write is specific to THIS account's numbers and account type.

${AGENCY_PHILOSOPHY}`;

  // ── Agentic KB lookup ─────────────────────────────────────────────────────
  // Ask Claude what SOP to retrieve, execute the search, inject results.
  // This keeps Claude's reasoning grounded in the agency's actual playbook.
  const kbTool: Anthropic.Messages.Tool = {
    name: "search_knowledge_base",
    description: "Search the agency's PPC Mastery knowledge base for the most relevant SOP, checklist, or guideline for this account's constraint. Call this ONCE with a specific query — e.g. 'search term hygiene SQR exclusion process' or 'landing page CVR CRO checklist' or 'budget pacing IS lost'. The exact SOP steps will be injected into your brief.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "Specific query to find the right SOP or checklist. Be precise about the problem, not generic.",
        },
      },
      required: ["query"],
    },
  };

  let kbSection = "";
  const conversationMessages: Anthropic.Messages.MessageParam[] = [
    { role: "user", content: prompt },
  ];

  try {
    // Phase 1: Force Claude to decide what SOP to look up (fast, non-streaming)
    const toolCallResponse = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 400,
      system: systemPrompt,
      tools: [kbTool],
      tool_choice: { type: "any" },
      messages: conversationMessages,
    });

    const toolUseBlock = toolCallResponse.content.find(b => b.type === "tool_use");
    if (toolUseBlock && toolUseBlock.type === "tool_use") {
      const query = (toolUseBlock.input as { query: string }).query ?? "";
      const kbResults = searchKnowledge(query, snapshot.governingConstraint);

      if (kbResults) {
        kbSection = `\n\n---\n${kbResults}`;
      }

      // Add the tool exchange to the conversation so the final call has full context
      conversationMessages.push({ role: "assistant", content: toolCallResponse.content });
      conversationMessages.push({
        role: "user",
        content: [{
          type: "tool_result",
          tool_use_id: toolUseBlock.id,
          content: kbResults || "No matching SOP found — rely on your own expertise.",
        }],
      });
    }
  } catch { /* KB tool call failed — proceed without it */ }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const aiStream = await client.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 400,
          system: systemPrompt,
          messages: conversationMessages,
        });

        for await (const chunk of aiStream) {
          if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`));
          }
        }
        // Stream the KB section as a separate labelled block after the main brief
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, slackError: slackError || undefined })}\n\n`));
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
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
