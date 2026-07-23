/**
 * GET /api/google-ads/accounts
 * Lists all accessible customer accounts (MCC or direct).
 *
 * POST /api/google-ads/accounts
 * Body: { googleAdsId, name, currency, industry?, monthlyBudget? }
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isGoogleAdsConfigured } from "@/lib/integrations/google-ads";
import { getAuthContext, unauthorized } from "@/lib/auth";

const GADS_REST_BASE = "https://googleads.googleapis.com/v23";
const DEV_TOKEN      = process.env.GOOGLE_ADS_DEVELOPER_TOKEN!;

// ─── OAuth ─────────────────────────────────────────────────────────────────────

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

// ─── REST helpers ──────────────────────────────────────────────────────────────

type GaqlRow = Record<string, unknown>;

/** fetch() + AbortController — the only reliable way to enforce timeouts in Node.js */
async function restFetch(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
  const ac = new AbortController();
  const t  = setTimeout(() => ac.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: ac.signal });
  } finally {
    clearTimeout(t);
  }
}

function gadsHeaders(accessToken: string, loginCustomerId?: string, includeContentType = true): Record<string, string> {
  const h: Record<string, string> = {
    Authorization:     `Bearer ${accessToken}`,
    "developer-token": DEV_TOKEN,
  };
  if (includeContentType) h["Content-Type"] = "application/json";
  if (loginCustomerId) h["login-customer-id"] = loginCustomerId;
  return h;
}

/** GAQL query via REST — paginates automatically, throws on timeout or non-2xx */
async function gaqlSearch(
  accessToken: string,
  customerId: string,
  gaql: string,
  loginCustomerId?: string,
  timeoutMs = 15_000,
): Promise<GaqlRow[]> {
  const results: GaqlRow[] = [];
  let pageToken: string | undefined;

  do {
    const body: Record<string, unknown> = { query: gaql };
    if (pageToken) body.pageToken = pageToken;

    const res = await restFetch(
      `${GADS_REST_BASE}/customers/${customerId}/googleAds:search`,
      { method: "POST", headers: gadsHeaders(accessToken, loginCustomerId), body: JSON.stringify(body) },
      timeoutMs,
    );
    if (!res.ok) {
      const errBody = await res.text().catch(() => res.status.toString());
      throw new Error(`Google Ads REST ${res.status}: ${errBody}`);
    }
    const json = await res.json() as { results?: GaqlRow[]; nextPageToken?: string };
    results.push(...(json.results ?? []));
    pageToken = json.nextPageToken;
  } while (pageToken);

  return results;
}

// ─── Customer ID discovery ─────────────────────────────────────────────────────

/** REST equivalent of listAccessibleCustomers — no gRPC */
async function listAccessibleCustomerIds(accessToken: string, timeoutMs = 12_000): Promise<string[]> {
  const res = await restFetch(
    `${GADS_REST_BASE}/customers:listAccessibleCustomers`,
    { method: "GET", headers: gadsHeaders(accessToken, undefined, false) },
    timeoutMs,
  );
  if (!res.ok) {
    const body = await res.text().catch(() => res.status.toString());
    throw new Error(`listAccessibleCustomers ${res.status}: ${body}`);
  }
  const json = await res.json() as { resourceNames?: string[] };
  return (json.resourceNames ?? []).map(r => r.replace("customers/", ""));
}

async function getCustomerIds(accessToken: string, orgId: string): Promise<string[]> {
  const cred   = await prisma.oAuthCredential.findUnique({ where: { organizationId: orgId } });
  const cached: string[] = JSON.parse(cred?.customerIds ?? "[]");
  if (cached.length > 0) {
    console.log(`[gads] customerIds from cache (${cached.length})`);
    return cached;
  }

  console.log("[gads] fetching customerIds via REST listAccessibleCustomers");
  const ids = await listAccessibleCustomerIds(accessToken);
  console.log(`[gads] got ${ids.length} customerIds`);

  if (ids.length > 0 && cred) {
    await prisma.oAuthCredential.update({ where: { organizationId: orgId }, data: { customerIds: JSON.stringify(ids) } }).catch(() => {});
  }
  return ids;
}

// ─── MCC discovery ─────────────────────────────────────────────────────────────

async function findMccId(accessToken: string, candidateIds: string[], orgId: string): Promise<string | null> {
  const envId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || process.env.GOOGLE_ADS_CUSTOMER_ID;
  if (envId) { console.log(`[gads] mccId from env: ${envId}`); return envId; }

  const cred = await prisma.oAuthCredential.findUnique({ where: { organizationId: orgId } });
  if (cred?.loginCustomerId) { console.log(`[gads] mccId from cache: ${cred.loginCustomerId}`); return cred.loginCustomerId; }

  // Parallel discovery — all candidates race, first manager wins
  console.log(`[gads] discovering MCC among ${candidateIds.length} candidates in parallel`);
  try {
    const mccId = await Promise.any(
      candidateIds.map(async (id) => {
        const rows = await gaqlSearch(accessToken, id, "SELECT customer.manager FROM customer LIMIT 1", undefined, 8_000);
        const isManager = !!(rows[0] as { customer?: { manager?: boolean } } | undefined)?.customer?.manager;
        if (!isManager) throw new Error("not manager");
        return id;
      })
    );
    await prisma.oAuthCredential.update({ where: { organizationId: orgId }, data: { loginCustomerId: mccId } }).catch(() => {});
    console.log(`[gads] discovered mccId: ${mccId}`);
    return mccId;
  } catch {
    console.log("[gads] no MCC found among candidates");
    return null;
  }
}

// ─── GET ───────────────────────────────────────────────────────────────────────

export async function GET() {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  if (!(await isGoogleAdsConfigured(ctx.orgId))) {
    return NextResponse.json({ error: "Google Ads not configured", authUrl: "/api/auth/google-ads" }, { status: 422 });
  }

  // Hard 28s outer deadline — Railway times out HTTP at 30s
  const deadline = new Promise<NextResponse>(resolve =>
    setTimeout(() => resolve(NextResponse.json({ error: "Request timed out fetching MCC accounts — try again or set GOOGLE_ADS_LOGIN_CUSTOMER_ID in Railway env vars." }, { status: 504 })), 28_000)
  );

  const work = async (): Promise<NextResponse> => {
    const refreshToken = await getOrgRefreshToken(ctx.orgId);
    console.log("[gads] got refreshToken, exchanging for accessToken");
    const accessToken = await getAccessToken(refreshToken);
    console.log("[gads] got accessToken");

    const customerIds = await getCustomerIds(accessToken, ctx.orgId);
    if (customerIds.length === 0) {
      return NextResponse.json({ error: "No Google Ads accounts accessible with these credentials." }, { status: 404 });
    }

    const mccId = await findMccId(accessToken, customerIds, ctx.orgId);
    console.log(`[gads] mccId=${mccId ?? "(none)"}`);

    let accounts: { googleAdsId: string; name: string; currency: string; isManager: boolean; resourceName: string }[];

    if (mccId) {
      console.log("[gads] querying customer_client");
      const rows = await gaqlSearch(
        accessToken, mccId,
        `SELECT customer_client.client_customer, customer_client.descriptive_name, customer_client.id, customer_client.currency_code, customer_client.manager, customer_client.status, customer_client.test_account
         FROM customer_client
         WHERE customer_client.status = 'ENABLED' AND customer_client.manager = false AND customer_client.test_account = false`,
        mccId, 20_000,
      );
      console.log(`[gads] customer_client returned ${rows.length} rows`);

      accounts = rows.map(r => {
        const cc = (r as { customerClient?: { id?: string; descriptiveName?: string; currencyCode?: string; clientCustomer?: string } }).customerClient ?? {};
        return { googleAdsId: String(cc.id ?? ""), name: cc.descriptiveName ?? `Account ${cc.id}`, currency: cc.currencyCode ?? "USD", isManager: false, resourceName: cc.clientCustomer ?? "" };
      }).filter(a => a.googleAdsId);

    } else {
      console.log("[gads] no MCC, querying individual accounts");
      accounts = (await Promise.all(
        customerIds.map(async id => {
          try {
            const rows = await gaqlSearch(accessToken, id, "SELECT customer.id, customer.descriptive_name, customer.currency_code FROM customer LIMIT 1", undefined, 8_000);
            const c = (rows[0] as { customer?: { id?: string; descriptiveName?: string; currencyCode?: string } } | undefined)?.customer ?? {};
            return { googleAdsId: id, name: c.descriptiveName ?? `Account ${id}`, currency: c.currencyCode ?? "USD", isManager: false, resourceName: `customers/${id}` };
          } catch { return null; }
        })
      )).filter((a): a is NonNullable<typeof a> => a !== null);
    }

    const existing    = await prisma.account.findMany({ where: { organizationId: ctx.orgId }, select: { googleAdsId: true } });
    const importedIds = new Set(existing.map(a => a.googleAdsId));
    return NextResponse.json(accounts.map(a => ({ ...a, imported: importedIds.has(a.googleAdsId) })));
  };

  try {
    return await Promise.race([work(), deadline]);
  } catch (err) {
    let msg: string;
    if (err instanceof Error) msg = err.message;
    else if (err && typeof err === "object") {
      const e = err as Record<string, unknown>;
      msg = String(e.message ?? e.details ?? e.code ?? JSON.stringify(err));
    } else msg = String(err);
    console.error("[gads/accounts] error:", msg);
    const isCredentialError = msg.includes("invalid_grant") || msg.includes("invalid_credentials");
    return NextResponse.json({ error: msg, ...(isCredentialError ? { authUrl: "/api/auth/google-ads" } : {}) }, { status: isCredentialError ? 401 : 502 });
  }
}

// ─── POST ──────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const body = await req.json() as { googleAdsId: string; name: string; currency?: string; industry?: string; monthlyBudget?: number };
  if (!body.googleAdsId || !body.name) return NextResponse.json({ error: "googleAdsId and name are required" }, { status: 400 });

  // Never let an import move an account between organizations.
  const existing = await prisma.account.findUnique({ where: { googleAdsId: body.googleAdsId }, select: { organizationId: true } });
  if (existing && existing.organizationId !== ctx.orgId) {
    return NextResponse.json({ error: "This customer id already belongs to an account in another organization." }, { status: 409 });
  }

  const account = await prisma.account.upsert({
    where:  { googleAdsId: body.googleAdsId },
    // Importing is an explicit "this account is relevant" — it also revives a
    // row that was deactivated (Notion) or archived (manual hide).
    update: { name: body.name, currency: body.currency ?? "USD", industry: body.industry ?? null, monthlyBudget: body.monthlyBudget ?? null, active: true, archived: false },
    create: { googleAdsId: body.googleAdsId, name: body.name, currency: body.currency ?? "USD", industry: body.industry ?? null, monthlyBudget: body.monthlyBudget ?? null, organizationId: ctx.orgId },
  });

  return NextResponse.json(account, { status: 201 });
}
