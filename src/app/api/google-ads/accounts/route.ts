/**
 * GET /api/google-ads/accounts
 * Lists all accessible customer accounts under the MCC.
 *
 * POST /api/google-ads/accounts
 * Body: { googleAdsId, name, currency, industry?, monthlyBudget? }
 * Imports a Google Ads account into the local accounts table.
 */
import { NextRequest, NextResponse } from "next/server";
import { GoogleAdsApi } from "google-ads-api";
import { prisma } from "@/lib/db";
import { isGoogleAdsConfigured } from "@/lib/integrations/google-ads";

async function getRefreshToken(): Promise<string> {
  if (process.env.GOOGLE_ADS_REFRESH_TOKEN) return process.env.GOOGLE_ADS_REFRESH_TOKEN;
  const cred = await prisma.oAuthCredential.findUnique({ where: { id: "singleton" } });
  if (cred?.refreshToken) return cred.refreshToken;
  throw new Error("No refresh token available");
}

// Try each candidate ID — the one where customer.manager = true is the MCC.
// Caches the working ID in DB for future requests.
async function discoverMccId(
  client: GoogleAdsApi,
  refreshToken: string,
  candidateIds: string[],
): Promise<string | null> {
  for (const id of candidateIds) {
    try {
      const c = client.Customer({ customer_id: id, refresh_token: refreshToken });
      // Check if this account is actually a manager account
      const rows = await c.query("SELECT customer.id, customer.manager FROM customer LIMIT 1");
      if (!rows[0]?.customer?.manager) continue; // client account, not MCC — skip
      // This IS an MCC — cache it
      await prisma.oAuthCredential.update({
        where: { id: "singleton" },
        data:  { loginCustomerId: id },
      }).catch(() => {});
      return id;
    } catch {
      // Auth error or unreachable — try next
    }
  }
  return null;
}

async function getMccId(client: GoogleAdsApi, refreshToken: string): Promise<string> {
  // 1. env vars first
  const envId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || process.env.GOOGLE_ADS_CUSTOMER_ID;
  if (envId) return envId;

  // 2. DB cached value
  const cred = await prisma.oAuthCredential.findUnique({ where: { id: "singleton" } });
  if (!cred) throw new Error("No credentials in DB");

  const candidateIds: string[] = JSON.parse(cred.customerIds ?? "[]");

  if (cred.loginCustomerId) {
    // Validate the cached value is still a manager account
    try {
      const c = client.Customer({ customer_id: cred.loginCustomerId, refresh_token: refreshToken });
      const rows = await c.query("SELECT customer.manager FROM customer LIMIT 1");
      if (rows[0]?.customer?.manager) return cred.loginCustomerId;
      // Cached ID is not a manager — fall through to rediscover
    } catch {
      // Stale credentials — fall through to discover
    }
  }

  // 3. Auto-discover by trying all accessible customer IDs
  const discovered = await discoverMccId(client, refreshToken, candidateIds);
  if (discovered) return discovered;

  throw new Error(
    "No manager (MCC) account found among the accessible accounts. " +
    "Make sure you authenticated with a Google Ads Manager account."
  );
}

export async function GET() {
  if (!(await isGoogleAdsConfigured())) {
    return NextResponse.json(
      { error: "Google Ads not configured", authUrl: "/api/auth/google-ads" },
      { status: 422 }
    );
  }

  try {
    const refreshToken = await getRefreshToken();
    const client = new GoogleAdsApi({
      client_id:       process.env.GOOGLE_ADS_CLIENT_ID!,
      client_secret:   process.env.GOOGLE_ADS_CLIENT_SECRET!,
      developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
    });

    const mccId = await getMccId(client, refreshToken);
    const mccCustomer = client.Customer({ customer_id: mccId, refresh_token: refreshToken });

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

    const existing = await prisma.account.findMany({ select: { googleAdsId: true } });
    const importedIds = new Set(existing.map((a) => a.googleAdsId));

    return NextResponse.json(accounts.map((a) => ({ ...a, imported: importedIds.has(a.googleAdsId) })));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // Only signal auth failure for real credential errors, not MCC config issues
    const isCredentialError = msg.includes("invalid_grant") || msg.includes("invalid_credentials");
    return NextResponse.json(
      { error: msg, ...(isCredentialError ? { authUrl: "/api/auth/google-ads" } : {}) },
      { status: isCredentialError ? 401 : 502 }
    );
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
