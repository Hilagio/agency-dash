/**
 * GET /api/google-ads/accounts
 *
 * Lists all accessible customer accounts under the MCC.
 * Used by the account selector UI to let specialists pick which
 * account to import/score.
 *
 * POST /api/google-ads/accounts
 * Body: { googleAdsId, name, currency, industry?, monthlyBudget? }
 * Imports a Google Ads account into the local accounts table.
 */
import { NextRequest, NextResponse } from "next/server";
import { GoogleAdsApi } from "google-ads-api";
import { prisma } from "@/lib/db";
import { isGoogleAdsConfigured } from "@/lib/integrations/google-ads";

function getClient() {
  return new GoogleAdsApi({
    client_id:       process.env.GOOGLE_ADS_CLIENT_ID!,
    client_secret:   process.env.GOOGLE_ADS_CLIENT_SECRET!,
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
  });
}

export async function GET() {
  if (!isGoogleAdsConfigured()) {
    return NextResponse.json(
      { error: "Google Ads not configured", authUrl: "/api/auth/google-ads" },
      { status: 422 }
    );
  }

  try {
    const client = getClient();

    // Use the MCC customer to list all accessible leaf accounts
    const mccId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || process.env.GOOGLE_ADS_CUSTOMER_ID!;

    const mccCustomer = client.Customer({
      customer_id:   mccId,
      refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
    });

    // CustomerClient gives us all accounts under the MCC
    const rows = await mccCustomer.query(`
      SELECT
        customer_client.client_customer,
        customer_client.descriptive_name,
        customer_client.id,
        customer_client.currency_code,
        customer_client.manager,
        customer_client.status,
        customer_client.test_account
      FROM customer_client
      WHERE customer_client.status = 'ENABLED'
        AND customer_client.manager = false
        AND customer_client.test_account = false
    `);

    const accounts = rows.map((r) => ({
      googleAdsId:  String(r.customer_client?.id ?? ""),
      name:         r.customer_client?.descriptive_name ?? `Account ${r.customer_client?.id}`,
      currency:     r.customer_client?.currency_code ?? "USD",
      isManager:    r.customer_client?.manager ?? false,
      resourceName: r.customer_client?.client_customer ?? "",
    }));

    // Also mark which ones are already imported into our DB
    const existing = await prisma.account.findMany({
      select: { googleAdsId: true },
    });
    const importedIds = new Set(existing.map((a) => a.googleAdsId));

    return NextResponse.json(
      accounts.map((a) => ({ ...a, imported: importedIds.has(a.googleAdsId) }))
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    googleAdsId: string;
    name: string;
    currency?: string;
    industry?: string;
    monthlyBudget?: number;
  };

  if (!body.googleAdsId || !body.name) {
    return NextResponse.json({ error: "googleAdsId and name are required" }, { status: 400 });
  }

  const account = await prisma.account.upsert({
    where: { googleAdsId: body.googleAdsId },
    update: {
      name:          body.name,
      currency:      body.currency ?? "USD",
      industry:      body.industry ?? null,
      monthlyBudget: body.monthlyBudget ?? null,
    },
    create: {
      googleAdsId:   body.googleAdsId,
      name:          body.name,
      currency:      body.currency ?? "USD",
      industry:      body.industry ?? null,
      monthlyBudget: body.monthlyBudget ?? null,
    },
  });

  return NextResponse.json(account, { status: 201 });
}
