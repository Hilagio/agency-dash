/**
 * GET /api/google-ads/accounts
 * Lists all accessible customer accounts (MCC or direct).
 *
 * POST /api/google-ads/accounts
 * Body: { googleAdsId, name, currency, industry?, monthlyBudget? }
 * Imports a Google Ads account into the local accounts table.
 *
 * MCC listing uses the Google Ads REST API (not gRPC) so AbortController
 * gives us real hard timeouts instead of Promise.race workarounds.
 */
import { NextRequest, NextResponse } from "next/server";
import { GoogleAdsApi } from "google-ads-api";
import { prisma } from "@/lib/db";
import { isGoogleAdsConfigured } from "@/lib/integrations/google-ads";
import { getAuthContext, unauthorized } from "@/lib/auth";

const GADS_REST_BASE = "https://googleads.googleapis.com/v18";
const DEV_TOKEN      = process.env.GOOGLE_ADS_DEVELOPER_TOKEN!;

// ─── OAuth helpers ─────────────────────────────────────────────────────────────

async function getOrgRefreshToken(orgId: string): Promise<string> {
  const cred = await prisma.oAuthCredential.findUnique({ where: { organizationId: orgId } });
  if (cred?.refreshToken) return cred.refreshToken;
  if (process.env.GOOGLE_ADS_REFRESH_TOKEN) return process.env.GOOGLE_ADS_REFRESH_TOKEN;
  throw new Error("No refresh token available");
}

async function getAccessToken(refreshToken: string): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id:     process.env.GOOGLE_ADS_CLIENT_ID!,
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type:    "refresh_token",
    }),
  });
  const json = await res.json() as { access_token?: string; error?: string };
  if (!json.access_token) throw new Error(`Token exchange failed: ${json.error ?? "unknown"}`);
  return json.access_token;
}

// ─── REST GAQL helper ──────────────────────────────────────────────────────────

interface GaqlRow { [key: string]: unknown }

async function restQuery(
  accessToken: string,
  customerId: string,
  gaql: string,
  loginCustomerId?: string,
  timeoutMs = 15_000,
): Promise<GaqlRow[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const headers: Record<string, string> = {
    Authorization:           `Bearer ${accessToken}`,
    "developer-token":       DEV_TOKEN,
    "Content-Type":          "application/json",
  };
  if (loginCustomerId) headers["login-customer-id"] = loginCustomerId;

  try {
    const res = await fetch(`${GADS_REST_BASE}/customers/${customerId}/googleAds:search`, {
      method:  "POST",
      headers,
      body:    JSON.stringify({ query: gaql }),
      signal:  controller.signal,
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Google Ads REST ${res.status}: ${body}`);
    }

    const json = await res.json() as { results?: GaqlRow[]; nextPageToken?: string };
    return json.results ?? [];
  } finally {
    clearTimeout(timer);
  }
}

// ─── MCC helpers ───────────────────────────────────────────────────────────────

async function getAccessibleCustomerIds(
  client: GoogleAdsApi,
  refreshToken: string,
  orgId: string,
): Promise<string[]> {
  const cred = await prisma.oAuthCredential.findUnique({ where: { organizationId: orgId } });
  const cached: string[] = JSON.parse(cred?.customerIds ?? "[]");
  if (cached.length > 0) return cached;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);
  let ids: string[] = [];
  try {
    const response = await client.listAccessibleCustomers(refreshToken);
    ids = (response.resource_names ?? []).map((r: string) => r.replace("customers/", ""));
  } finally {
    clearTimeout(timer);
  }

  if (ids.length > 0 && cred) {
    await prisma.oAuthCredential.update({
      where: { organizationId: orgId },
      data:  { customerIds: JSON.stringify(ids) },
    }).catch(() => {});
  }

  return ids;
}

async function findMccId(
  accessToken: string,
  candidateIds: string[],
  orgId: string,
): Promise<string | null> {
  // 1. env var — always trusted, no query needed
  const envId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || process.env.GOOGLE_ADS_CUSTOMER_ID;
  if (envId) return envId;

  // 2. DB cache — trusted without re-validation (manager status doesn't change)
  const cred = await prisma.oAuthCredential.findUnique({ where: { organizationId: orgId } });
  if (cred?.loginCustomerId) return cred.loginCustomerId;

  // 3. Live discovery — query each candidate via REST (real AbortController timeout)
  for (const id of candidateIds) {
    try {
      const rows = await restQuery(accessToken, id, "SELECT customer.manager FROM customer LIMIT 1", undefined, 8_000);
      if (rows[0] && (rows[0] as { customer?: { manager?: boolean } }).customer?.manager) {
        await prisma.oAuthCredential.update({ where: { organizationId: orgId }, data: { loginCustomerId: id } }).catch(() => {});
        return id;
      }
    } catch { /* not a manager or timed out — try next */ }
  }

  return null;
}

// ─── Route handlers ────────────────────────────────────────────────────────────

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
    const accessToken  = await getAccessToken(refreshToken);

    const client = new GoogleAdsApi({
      client_id:       process.env.GOOGLE_ADS_CLIENT_ID!,
      client_secret:   process.env.GOOGLE_ADS_CLIENT_SECRET!,
      developer_token: DEV_TOKEN,
    });

    const customerIds = await getAccessibleCustomerIds(client, refreshToken, ctx.orgId);
    console.log(`[google-ads/accounts] orgId=${ctx.orgId} customerIds(${customerIds.length})=${customerIds.slice(0, 5).join(",")}`);

    if (customerIds.length === 0) {
      return NextResponse.json(
        { error: "No Google Ads accounts accessible with these credentials." },
        { status: 404 }
      );
    }

    const mccId = await findMccId(accessToken, customerIds, ctx.orgId);
    console.log(`[google-ads/accounts] mccId=${mccId ?? "(none)"}`);

    let accounts: { googleAdsId: string; name: string; currency: string; isManager: boolean; resourceName: string }[];

    if (mccId) {
      // List all non-manager client accounts via REST with a hard 20s timeout
      const rows = await restQuery(
        accessToken,
        mccId,
        `SELECT
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
          AND customer_client.test_account = false`,
        mccId,
        20_000,
      );

      accounts = rows.map((r) => {
        const cc = (r as { customerClient?: { id?: string; descriptiveName?: string; currencyCode?: string; clientCustomer?: string } }).customerClient ?? {};
        return {
          googleAdsId:  String(cc.id ?? ""),
          name:         cc.descriptiveName ?? `Account ${cc.id}`,
          currency:     cc.currencyCode ?? "USD",
          isManager:    false,
          resourceName: cc.clientCustomer ?? "",
        };
      }).filter(a => a.googleAdsId);

    } else {
      // No MCC — query each account directly via REST
      accounts = (await Promise.all(
        customerIds.map(async (id) => {
          try {
            const rows = await restQuery(
              accessToken, id,
              "SELECT customer.id, customer.descriptive_name, customer.currency_code FROM customer LIMIT 1",
              undefined, 8_000,
            );
            const c = (rows[0] as { customer?: { id?: string; descriptiveName?: string; currencyCode?: string } } | undefined)?.customer ?? {};
            return { googleAdsId: id, name: c.descriptiveName ?? `Account ${id}`, currency: c.currencyCode ?? "USD", isManager: false, resourceName: `customers/${id}` };
          } catch {
            return null;
          }
        })
      )).filter((a): a is NonNullable<typeof a> => a !== null);
    }

    const existing    = await prisma.account.findMany({ where: { organizationId: ctx.orgId }, select: { googleAdsId: true } });
    const importedIds = new Set(existing.map((a) => a.googleAdsId));

    return NextResponse.json(accounts.map((a) => ({ ...a, imported: importedIds.has(a.googleAdsId) })));

  } catch (err) {
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
    where:  { googleAdsId: body.googleAdsId },
    update: { name: body.name, currency: body.currency ?? "USD", industry: body.industry ?? null, monthlyBudget: body.monthlyBudget ?? null, organizationId: ctx.orgId },
    create: { googleAdsId: body.googleAdsId, name: body.name, currency: body.currency ?? "USD", industry: body.industry ?? null, monthlyBudget: body.monthlyBudget ?? null, organizationId: ctx.orgId },
  });

  return NextResponse.json(account, { status: 201 });
}
