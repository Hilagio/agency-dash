/**
 * GET /api/auth/google-ads/callback
 *
 * Google redirects here after OAuth consent.
 * Automatically:
 *  1. Exchanges code for tokens
 *  2. Fetches accessible customer accounts (with names)
 *  3. Detects the MCC (manager) account and stores it as loginCustomerId
 *  4. Saves everything to DB
 *  5. Redirects to the dashboard
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface CustomerInfo {
  id: string;
  name: string;
  isManager: boolean;
}

// ─── Fetch customer names via GAQL ────────────────────────────────────────────
// We try each accessible customer as potential MCC login.
// The first one that can run a customer_client query is the MCC.
// We then fetch descriptive names for all customers using the MCC.

async function fetchCustomerInfoViaGaql(
  developerToken: string,
  refreshToken: string,
  clientId: string,
  clientSecret: string,
  customerIds: string[],
): Promise<{ customers: CustomerInfo[]; detectedMccId: string | null }> {
  const { GoogleAdsApi } = await import("google-ads-api");
  const client = new GoogleAdsApi({ client_id: clientId, client_secret: clientSecret, developer_token: developerToken });

  // Try each ID as potential MCC — must have customer.manager = true
  for (const candidateId of customerIds) {
    try {
      const mccCustomer = client.Customer({ customer_id: candidateId, refresh_token: refreshToken });

      // Check if this account is a manager (MCC)
      const selfRows = await mccCustomer.query(
        "SELECT customer.id, customer.descriptive_name, customer.manager FROM customer LIMIT 1"
      );
      const selfIsManager = selfRows[0]?.customer?.manager ?? false;

      // Skip non-manager accounts — they're client accounts, not MCCs
      if (!selfIsManager) continue;

      // This IS an MCC — fetch all sub-accounts for names
      const clientRows = await mccCustomer.query(`
        SELECT customer_client.id, customer_client.descriptive_name, customer_client.manager
        FROM customer_client
        LIMIT 500
      `);

      // Build a name map from GAQL results
      const nameMap = new Map<string, { name: string; isManager: boolean }>();
      nameMap.set(candidateId, {
        name: selfRows[0]?.customer?.descriptive_name ?? `Account ${candidateId}`,
        isManager: true,
      });
      for (const r of clientRows) {
        const id = String(r.customer_client?.id ?? "");
        if (id) {
          nameMap.set(id, {
            name: r.customer_client?.descriptive_name ?? `Account ${id}`,
            isManager: r.customer_client?.manager ?? false,
          });
        }
      }

      // Map all accessible customer IDs with names from this MCC
      const customers = customerIds.map((id) => ({
        id,
        name: nameMap.get(id)?.name ?? `Account ${id}`,
        isManager: nameMap.get(id)?.isManager ?? false,
      }));

      return { customers, detectedMccId: candidateId };
    } catch {
      // Auth error or unreachable — try next
    }
  }

  // Nothing worked — return bare IDs
  return {
    customers: customerIds.map((id) => ({ id, name: `Account ${id}`, isManager: false })),
    detectedMccId: customerIds[0] ?? null,
  };
}

// ─── DB persistence ───────────────────────────────────────────────────────────

async function saveCredentials(
  refreshToken: string,
  customerIds: string[],
  loginCustomerId: string | null,
): Promise<void> {
  try {
    await prisma.oAuthCredential.upsert({
      where:  { id: "singleton" },
      update: {
        refreshToken,
        customerIds: JSON.stringify(customerIds),
        ...(loginCustomerId ? { loginCustomerId } : {}),
      },
      create: {
        id: "singleton",
        refreshToken,
        customerIds: JSON.stringify(customerIds),
        loginCustomerId: loginCustomerId ?? undefined,
      },
    });
  } catch (e) {
    console.error("[oauth] failed to save credentials to DB:", e);
  }
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code  = searchParams.get("code");
  const error = searchParams.get("error");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  if (error) {
    return page(errorScreen(`OAuth error: <code>${error}</code>`), baseUrl);
  }

  if (!code) {
    return page(errorScreen("No authorization code returned by Google."), baseUrl);
  }

  const clientId     = process.env.GOOGLE_ADS_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET!;
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  const redirectUri  = `${baseUrl}/api/auth/google-ads/callback`;

  // ── 1. Exchange code for tokens ─────────────────────────────────────────────
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const tokens = await tokenRes.json() as {
    access_token?: string;
    refresh_token?: string;
    error?: string;
  };

  if (tokens.error || !tokens.refresh_token) {
    return page(
      errorScreen(`Token exchange failed: ${tokens.error ?? "no refresh token returned"}`),
      baseUrl
    );
  }

  // ── 2. No developer token → save refresh token only, show manual step ───────
  if (!developerToken) {
    await saveCredentials(tokens.refresh_token, [], null);
    return page(missingDevTokenScreen(), baseUrl);
  }

  // ── 3. List accessible customers ────────────────────────────────────────────
  let customerIds: string[] = [];
  let customersError: string | null = null;

  const customersRes = await fetch(
    "https://googleads.googleapis.com/v23/customers:listAccessibleCustomers",
    {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        "developer-token": developerToken,
      },
    }
  );

  const customersData = await customersRes.json() as {
    resourceNames?: string[];
    error?: { message?: string; code?: number };
  };

  if (!customersRes.ok || customersData.error) {
    const errMsg = typeof customersData.error === "object"
      ? (customersData.error?.message ?? JSON.stringify(customersData.error))
      : JSON.stringify(customersData);
    customersError = errMsg;
  } else {
    customerIds = (customersData.resourceNames ?? []).map((r: string) =>
      r.replace("customers/", "")
    );
  }

  if (customersError || customerIds.length === 0) {
    await saveCredentials(tokens.refresh_token, customerIds, null);
    return page(errorScreen(
      customersError
        ? `Could not fetch accounts: ${customersError}`
        : "No accessible Google Ads accounts found for this Google account."
    ), baseUrl);
  }

  // ── 4. Fetch names + detect MCC via GAQL ────────────────────────────────────
  const { customers, detectedMccId } = await fetchCustomerInfoViaGaql(
    developerToken,
    tokens.refresh_token,
    clientId,
    clientSecret,
    customerIds,
  );

  const loginCustomerId = detectedMccId;

  // ── 5. Save everything ──────────────────────────────────────────────────────
  await saveCredentials(tokens.refresh_token, customerIds, loginCustomerId);

  // ── 6. Show success and redirect ─────────────────────────────────────────────
  return page(successScreen(customers, loginCustomerId, baseUrl), baseUrl);
}

// ─── HTML helpers ─────────────────────────────────────────────────────────────

function page(body: string, baseUrl: string): NextResponse {
  void baseUrl;
  return new NextResponse(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Google Ads — Connected</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0d0d0d; color: #e8e8e8;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", system-ui, sans-serif;
      min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px;
    }
    .card {
      background: #161616; border: 1px solid #2a2a2a; border-radius: 20px;
      padding: 48px; width: 100%; max-width: 520px;
      box-shadow: 0 32px 80px rgba(0,0,0,0.6);
    }
    .icon-wrap {
      width: 56px; height: 56px; border-radius: 16px;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 24px; font-size: 24px;
    }
    .icon-wrap.success { background: rgba(52,199,89,0.12); }
    .icon-wrap.error   { background: rgba(255,59,48,0.12); }
    h1 { font-size: 22px; font-weight: 700; letter-spacing: -0.4px; color: #fff; margin-bottom: 6px; }
    .subtitle { font-size: 14px; color: #666; margin-bottom: 28px; line-height: 1.5; }
    .saved-banner {
      background: rgba(74,222,128,0.08); border: 1px solid rgba(74,222,128,0.2);
      border-radius: 10px; padding: 12px 16px; margin-bottom: 24px;
      font-size: 13px; color: #4ade80;
    }
    .section-label {
      font-size: 11px; font-weight: 600; letter-spacing: 0.8px;
      text-transform: uppercase; color: #555; margin-bottom: 10px;
    }
    .account-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 28px; }
    .account-row {
      display: flex; align-items: center; justify-content: space-between;
      background: #111; border: 1px solid #222; border-radius: 10px; padding: 12px 16px;
    }
    .account-name { font-size: 14px; font-weight: 500; color: #e0e0e0; }
    .account-id { font-size: 11px; color: #555; margin-top: 2px; font-family: "SF Mono", monospace; }
    .mcc-badge {
      font-size: 10px; font-weight: 600; letter-spacing: 0.4px; text-transform: uppercase;
      background: rgba(59,130,246,0.12); color: #60a5fa;
      padding: 3px 8px; border-radius: 20px; flex-shrink: 0;
    }
    .btn {
      display: flex; align-items: center; justify-content: center;
      width: 100%; background: #1d4ed8; border-radius: 12px; color: #fff;
      font-size: 14px; font-weight: 600; padding: 14px; text-decoration: none;
      transition: background 0.15s;
    }
    .btn:hover { background: #1e40af; }
    .err-box {
      background: rgba(255,59,48,0.08); border: 1px solid rgba(255,59,48,0.2);
      border-radius: 10px; padding: 14px 16px; font-size: 13px; color: #ff3b30; line-height: 1.6;
    }
    .warn-box {
      background: rgba(255,159,10,0.08); border: 1px solid rgba(255,159,10,0.2);
      border-radius: 10px; padding: 14px 16px; font-size: 13px; color: #ff9f0a; line-height: 1.5;
    }
    code {
      font-family: "SF Mono", monospace; font-size: 11px;
      background: #1e1e1e; border: 1px solid #2a2a2a;
      padding: 2px 6px; border-radius: 4px; color: #aaa;
    }
  </style>
</head>
<body>
  <div class="card">
    ${body}
  </div>
</body>
</html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}

function successScreen(
  customers: CustomerInfo[],
  loginCustomerId: string | null,
  baseUrl: string,
): string {
  const managers = customers.filter((c) => c.isManager);
  const clients  = customers.filter((c) => !c.isManager);

  const accountRows = (list: CustomerInfo[], label?: string) => {
    if (list.length === 0) return "";
    return `
      ${label ? `<p class="section-label">${label}</p>` : ""}
      <div class="account-list">
        ${list.map((c) => `
          <div class="account-row">
            <div>
              <div class="account-name">${esc(c.name)}</div>
              <div class="account-id">${c.id}</div>
            </div>
            ${c.isManager ? `<span class="mcc-badge">MCC</span>` : ""}
          </div>
        `).join("")}
      </div>
    `;
  };

  return `
    <div class="icon-wrap success">✓</div>
    <h1>Connected to Google Ads</h1>
    <p class="subtitle">${customers.length} account${customers.length !== 1 ? "s" : ""} found · Ready to use</p>

    <div class="saved-banner">
      ✓ Credentials saved automatically — no setup needed.
    </div>

    ${managers.length > 0 ? accountRows(managers, "Manager accounts (MCC)") : ""}
    ${clients.length > 0 ? accountRows(clients, clients.length > 0 && managers.length > 0 ? "Client accounts" : undefined) : ""}

    <a href="${baseUrl}/" class="btn">Go to dashboard →</a>
  `;
}

function missingDevTokenScreen(): string {
  return `
    <div class="icon-wrap success">✓</div>
    <h1>Almost there</h1>
    <p class="subtitle">Refresh token saved. One more step needed.</p>
    <div class="warn-box">
      <strong>Developer token not set.</strong><br><br>
      Add <code>GOOGLE_ADS_DEVELOPER_TOKEN</code> to your environment variables,
      then sign in again to complete setup.
    </div>
  `;
}

function errorScreen(message: string): string {
  return `
    <div class="icon-wrap error">✕</div>
    <h1>Something went wrong</h1>
    <p class="subtitle">Authentication could not be completed.</p>
    <div class="err-box">${message}</div>
  `;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
