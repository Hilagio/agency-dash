/**
 * GET /api/accounts/[id]/search-terms/classify
 *
 * Fetches the top 100 search terms with spend but no conversions in the last 30 days,
 * then classifies each using Claude into:
 *   High Intent | Low Intent | Informational | Off-Brand
 *
 * Off-Brand and Low Intent terms are candidates for negative keywords.
 * Specialists review the results in SearchTermClassifier before approving.
 */
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { GoogleAdsApi } from "google-ads-api";

type Params = { params: Promise<{ id: string }> };

export type QueryCategory = "High Intent" | "Low Intent" | "Informational" | "Off-Brand";

export interface ClassifiedTerm {
  term:       string;
  category:   QueryCategory;
  confidence: "high" | "medium" | "low";
  spend:      number;
  clicks:     number;
  impressions: number;
}

function last30Days() {
  const fmt   = (d: Date) => d.toISOString().slice(0, 10);
  const end   = new Date(); end.setDate(end.getDate() - 1);
  const start = new Date(); start.setDate(start.getDate() - 30);
  return { start: fmt(start), end: fmt(end) };
}

async function fetchRawTerms(
  customerId: string,
  orgId: string,
): Promise<{ term: string; spend: number; clicks: number; impressions: number }[]> {
  const cred = await prisma.oAuthCredential.findUnique({ where: { organizationId: orgId } }).catch(() => null);
  const refreshToken = cred?.refreshToken ?? process.env.GOOGLE_ADS_REFRESH_TOKEN;
  if (!refreshToken) return [];

  const client = new GoogleAdsApi({
    client_id:       process.env.GOOGLE_ADS_CLIENT_ID!,
    client_secret:   process.env.GOOGLE_ADS_CLIENT_SECRET!,
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
  });
  const customer = client.Customer({
    customer_id:       customerId,
    login_customer_id: cred?.loginCustomerId ?? process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
    refresh_token:     refreshToken,
  });

  const { start, end } = last30Days();
  const rows = await customer.query(`
    SELECT
      search_term_view.search_term,
      metrics.cost_micros,
      metrics.clicks,
      metrics.impressions,
      metrics.conversions
    FROM search_term_view
    WHERE segments.date BETWEEN '${start}' AND '${end}'
      AND metrics.cost_micros > 0
      AND metrics.conversions < 1
    ORDER BY metrics.cost_micros DESC
    LIMIT 100
  `);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return rows.map((r: any) => ({
    term:        String(r.search_term_view?.search_term ?? ""),
    spend:       Number(r.metrics?.cost_micros ?? 0) / 1_000_000,
    clicks:      Number(r.metrics?.clicks ?? 0),
    impressions: Number(r.metrics?.impressions ?? 0),
  })).filter(r => r.term);
}

async function classifyTerms(
  terms: string[],
  businessName: string,
): Promise<Map<string, { category: QueryCategory; confidence: "high" | "medium" | "low" }>> {
  const client  = new Anthropic();
  const results = new Map<string, { category: QueryCategory; confidence: "high" | "medium" | "low" }>();
  const BATCH   = 20;

  for (let i = 0; i < terms.length; i += BATCH) {
    const batch = terms.slice(i, i + BATCH);
    const numbered = batch.map((t, j) => `${i + j + 1}. ${t}`).join("\n");

    // eslint-disable-next-line no-await-in-loop
    const msg = await client.messages.create({
      model:      "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system:
        `You classify Google Ads search queries for a business called "${businessName}". ` +
        "For each query, output exactly one line: <number>|<category>|<confidence>\n" +
        "Categories: High Intent, Low Intent, Informational, Off-Brand\n" +
        "Confidence: high, medium, low\n" +
        "High Intent = ready to buy / strong purchase signal\n" +
        "Low Intent = vague, early-stage, or price-shopping\n" +
        "Informational = research / how-to / comparison with no clear buy intent\n" +
        "Off-Brand = competitor names, unrelated industries, or clearly irrelevant\n" +
        "Output ONLY the numbered lines, no other text.",
      messages: [{ role: "user", content: numbered }],
    });

    const text = msg.content[0].type === "text" ? msg.content[0].text : "";
    for (const line of text.trim().split("\n")) {
      const parts = line.split("|");
      if (parts.length < 3) continue;
      const idx        = parseInt(parts[0].trim()) - 1;
      const rawCat     = parts[1].trim() as QueryCategory;
      const rawConf    = parts[2].trim().toLowerCase() as "high" | "medium" | "low";
      const term       = terms[idx];
      if (!term) continue;
      const validCats: QueryCategory[] = ["High Intent", "Low Intent", "Informational", "Off-Brand"];
      const category   = validCats.includes(rawCat) ? rawCat : "Informational";
      const confidence = ["high", "medium", "low"].includes(rawConf) ? rawConf : "medium";
      results.set(term, { category, confidence });
    }
  }

  return results;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;
  const account = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } });
  if (!account) return forbidden();

  if (!account.googleAdsId) {
    return NextResponse.json({ error: "No Google Ads account linked" }, { status: 422 });
  }

  try {
    const rawTerms = await fetchRawTerms(account.googleAdsId, ctx.orgId);
    if (rawTerms.length === 0) {
      return NextResponse.json({ terms: [], message: "No zero-conversion search terms with spend found in the last 30 days." });
    }

    const termStrings   = rawTerms.map(r => r.term);
    const businessName  = account.name ?? "this business";
    const classifications = await classifyTerms(termStrings, businessName);

    const classified: ClassifiedTerm[] = rawTerms.map(r => {
      const cls = classifications.get(r.term) ?? { category: "Informational" as QueryCategory, confidence: "low" as const };
      return { ...r, ...cls };
    });

    // Sort: Off-Brand first, then Low Intent, then Informational, then High Intent
    const ORDER: Record<QueryCategory, number> = { "Off-Brand": 0, "Low Intent": 1, "Informational": 2, "High Intent": 3 };
    classified.sort((a, b) => ORDER[a.category] - ORDER[b.category]);

    return NextResponse.json({ terms: classified });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Classification failed: ${msg}` }, { status: 502 });
  }
}
