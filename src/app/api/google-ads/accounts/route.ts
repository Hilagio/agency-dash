/**
 * GET /api/google-ads/accounts
 * Lists all accessible customer accounts (MCC or direct).
 *
 * POST /api/google-ads/accounts
 * Body: { googleAdsId, name, currency, industry?, monthlyBudget? }
 * Imports a Google Ads account into the local accounts table.
 */
import { NextRequest, NextResponse } from "next/server";
import { GoogleAdsApi } from "google-ads-api";
import { prisma } from "@/lib/db";
import { isGoogleAdsConfigured } from "@/lib/integrations/google-ads";
import { getAuthContext, unauthorized } from "@/lib/auth";

/** Rejects after ms if the wrapped promise hasn't settled — guards against gRPC hangs */
function withQueryTimeout<T>(promise: Promise<T>, ms = 8_000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("query timeout")), ms)),
  ]);
}

async function getOrgRefreshToken(orgId: string): Promise<string> {
  const cred = await prisma.oAuthCredential.findUnique({ where: { organizationId: orgId } });
  if (cred?.refreshToken) return cred.refreshToken;
  if (process.env.GOOGLE_ADS_REFRESH_TOKEN) return process.env.GOOGLE_ADS_REFRESH_TOKEN;
  throw new Error("No refresh token available");
}

/**
 * Returns accessible customer IDs from DB cache, or fetches them live
 * via the library's listAccessibleCustomers if the cache is empty.
 * Updates the DB cache when a live fetch is performed.
 */
async function getAccessibleCustomerIds(
  client: GoogleAdsApi,
  refreshToken: string,
  orgId: string,
): Promise<string[]> {
  // Try DB cache first
  const cred = await prisma.oAuthCredential.findUnique({ where: { organizationId: orgId } });
  const cached: string[] = JSON.parse(cred?.customerIds ?? "[]");
  if (cached.length > 0) return cached;

  // Cache miss — call the library directly (uses the correct API version)
  const response = await withQueryTimeout(client.listAccessibleCustomers(refreshToken), 15_000);
  const ids = (response.resource_names ?? []).map((r: string) => r.replace("customers/", ""));

  // Persist back to DB so future requests skip this step
  if (ids.length > 0 && cred) {
    await prisma.oAuthCredential.update({
      where: { organizationId: orgId },
      data:  { customerIds: JSON.stringify(ids) },
    }).catch(() => {});
  }

  return ids;
}

/**
 * Returns the MCC (manager account) ID, or null if none exists.
 * Checks env var → DB cache → live discovery (only if no cache).
 */
async function findMccId(
  client: GoogleAdsApi,
  refreshToken: string,
  candidateIds: string[],
  orgId: string,
): Promise<string | null> {
  // 1. env var override — always trusted
  const envId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || process.env.GOOGLE_ADS_CUSTOMER_ID;
  if (envId) return envId;

  // 2. DB-cached login customer ID — trust it without re-querying.
  //    Manager status doesn't change; a live re-validation is wasteful and can timeout.
  const cred = await prisma.oAuthCredential.findUnique({ where: { organizationId: orgId } });
  if (cred?.loginCustomerId) return cred.loginCustomerId;

  // 3. No cache — discover by querying candidates in batches of 5.
  //    Wrap the entire discovery in a 20s outer timeout so we can't hang the request.
  const discover = async () => {
    const BATCH = 5;
    for (let i = 0; i < candidateIds.length; i += BATCH) {
      const batch = candidateIds.slice(i, i + BATCH);
      try {
        const mccId = await Promise.any(
          batch.map(async (id) => {
            const c = client.Customer({ customer_id: id, refresh_token: refreshToken });
            const rows = await withQueryTimeout(c.query("SELECT customer.id, customer.manager FROM customer LIMIT 1"));
            if (!rows[0]?.customer?.manager) throw new Error("not manager");
            return id;
          })
        );
        await prisma.oAuthCredential.update({
          where: { organizationId: orgId },
          data:  { loginCustomerId: mccId },
        }).catch(() => {});
        return mccId;
      } catch { /* all in batch failed/timed out — try next batch */ }
    }
    return null;
  };

  return Promise.race([
    discover(),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), 20_000)),
  ]);
}

export async function GET() {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  if (!(await isGoogleAdsConfigured(ctx.orgId))) {
    return NextResponse.json(
      { error: "Google Ads not configured", authUrl: "/api/auth/google-ads" },
      { status: 422 }
    );
  }

  try {
    const refreshToken = await getOrgRefreshToken(ctx.orgId);
    const client = new GoogleAdsApi({
      client_id:       process.env.GOOGLE_ADS_CLIENT_ID!,
      client_secret:   process.env.GOOGLE_ADS_CLIENT_SECRET!,
      developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
    });

    // Ensure we have customer IDs (fetched live if cache was empty)
    const customerIds = await getAccessibleCustomerIds(client, refreshToken, ctx.orgId);
    console.log(`[google-ads/accounts] orgId=${ctx.orgId} customerIds(${customerIds.length})=${customerIds.slice(0, 5).join(",")}`);

    if (customerIds.length === 0) {
      return NextResponse.json(
        { error: "No Google Ads accounts accessible with these credentials." },
        { status: 404 }
      );
    }

    // Try to find an MCC among accessible accounts
    const mccId = await findMccId(client, refreshToken, customerIds, ctx.orgId);
    console.log(`[google-ads/accounts] mccId=${mccId ?? "(none)"}`);

    let accounts: { googleAdsId: string; name: string; currency: string; isManager: boolean; resourceName: string }[];

    if (mccId) {
      // List all client accounts under the MCC.
      // login_customer_id must equal the MCC's own ID when querying manager-level resources (customer_client).
      const mccCustomer = client.Customer({ customer_id: mccId, login_customer_id: mccId, refresh_token: refreshToken });
      const rows = await withQueryTimeout(mccCustomer.query(`
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
      `), 15_000);
      accounts = rows.map((r) => ({
        googleAdsId:  String(r.customer_client?.id ?? ""),
        name:         r.customer_client?.descriptive_name ?? `Account ${r.customer_client?.id}`,
        currency:     r.customer_client?.currency_code ?? "USD",
        isManager:    false,
        resourceName: r.customer_client?.client_customer ?? "",
      }));
    } else {
      // No MCC — query each accessible account directly, with timeout so hangs don't block
      accounts = await Promise.all(
        customerIds.map(async (id) => {
          try {
            const c = client.Customer({ customer_id: id, refresh_token: refreshToken });
            const rows = await withQueryTimeout(
              c.query("SELECT customer.id, customer.descriptive_name, customer.currency_code FROM customer LIMIT 1")
            );
            return {
              googleAdsId:  id,
              name:         rows[0]?.customer?.descriptive_name ?? `Account ${id}`,
              currency:     (rows[0]?.customer?.currency_code as string | undefined) ?? "USD",
              isManager:    false,
              resourceName: `customers/${id}`,
            };
          } catch {
            return { googleAdsId: id, name: `Account ${id}`, currency: "USD", isManager: false, resourceName: `customers/${id}` };
          }
        })
      );
    }

    const existing = await prisma.account.findMany({
      where: { organizationId: ctx.orgId },
      select: { googleAdsId: true },
    });
    const importedIds = new Set(existing.map((a) => a.googleAdsId));

    return NextResponse.json(accounts.map((a) => ({ ...a, imported: importedIds.has(a.googleAdsId) })));
  } catch (err) {
    // gRPC errors from google-ads-api are plain objects, not Error instances
    let msg: string;
    if (err instanceof Error) {
      msg = err.message;
    } else if (err && typeof err === "object") {
      const e = err as Record<string, unknown>;
      msg = String(e.message ?? e.details ?? e.code ?? JSON.stringify(err));
    } else {
      msg = String(err);
    }
    console.error("[google-ads/accounts]", msg, err);
    const isCredentialError = msg.includes("invalid_grant") || msg.includes("invalid_credentials");
    return NextResponse.json(
      { error: msg, ...(isCredentialError ? { authUrl: "/api/auth/google-ads" } : {}) },
      { status: isCredentialError ? 401 : 502 }
    );
  }
}

export async function POST(req: NextRequest) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

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
      name:           body.name,
      currency:       body.currency ?? "USD",
      industry:       body.industry ?? null,
      monthlyBudget:  body.monthlyBudget ?? null,
      organizationId: ctx.orgId,
    },
    create: {
      googleAdsId:    body.googleAdsId,
      name:           body.name,
      currency:       body.currency ?? "USD",
      industry:       body.industry ?? null,
      monthlyBudget:  body.monthlyBudget ?? null,
      organizationId: ctx.orgId,
    },
  });

  return NextResponse.json(account, { status: 201 });
}
