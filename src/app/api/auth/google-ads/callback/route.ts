/**
 * GET /api/auth/google-ads/callback
 *
 * Google redirects here after OAuth consent.
 * Exchanges the code for tokens and shows the refresh token + accessible customer IDs.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code  = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return page(errorScreen(`OAuth error: <code>${error}</code>`));
  }

  if (!code) {
    return page(errorScreen("No authorization code returned by Google."));
  }

  const clientId     = process.env.GOOGLE_ADS_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET!;
  const redirectUri  = `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/auth/google-ads/callback`;

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
    return page(errorScreen(`Token exchange failed: ${tokens.error ?? "no refresh token returned"}`));
  }

  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  if (!developerToken) {
    await saveCredentials(tokens.refresh_token, []);
    return page(successScreen(tokens.refresh_token, [], null, true, true));
  }

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

  const customersData = await customersRes.json() as { resourceNames?: string[]; error?: { message?: string; code?: number } };

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

  // Auto-save credentials to DB — no manual copy-paste needed
  await saveCredentials(tokens.refresh_token, customerIds);

  return page(successScreen(tokens.refresh_token, customerIds, customersError, false, true));
}

// ─── DB persistence ───────────────────────────────────────────────────────────

async function saveCredentials(refreshToken: string, customerIds: string[]): Promise<void> {
  try {
    await prisma.oAuthCredential.upsert({
      where:  { id: "singleton" },
      update: { refreshToken, customerIds: JSON.stringify(customerIds) },
      create: { id: "singleton", refreshToken, customerIds: JSON.stringify(customerIds) },
    });
  } catch (e) {
    console.error("[oauth] failed to save credentials to DB:", e);
  }
}

// ─── HTML builders ────────────────────────────────────────────────────────────

function page(body: string): NextResponse {
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
      background: #0d0d0d;
      color: #e8e8e8;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", system-ui, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }

    .card {
      background: #161616;
      border: 1px solid #2a2a2a;
      border-radius: 20px;
      padding: 48px;
      width: 100%;
      max-width: 560px;
      box-shadow: 0 32px 80px rgba(0,0,0,0.6);
    }

    .icon-wrap {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
      font-size: 24px;
    }
    .icon-wrap.success { background: rgba(52, 199, 89, 0.12); }
    .icon-wrap.error   { background: rgba(255, 59, 48, 0.12); }

    h1 {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.4px;
      color: #ffffff;
      margin-bottom: 6px;
    }

    .subtitle {
      font-size: 14px;
      color: #666;
      margin-bottom: 36px;
      line-height: 1.5;
    }

    .section-label {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      color: #555;
      margin-bottom: 8px;
    }

    .field-row {
      display: flex;
      align-items: center;
      background: #111;
      border: 1px solid #222;
      border-radius: 10px;
      padding: 12px 14px;
      gap: 10px;
      margin-bottom: 24px;
    }

    .field-value {
      flex: 1;
      font-family: "SF Mono", "Fira Code", monospace;
      font-size: 12px;
      color: #a0a0a0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      min-width: 0;
    }

    .copy-btn {
      flex-shrink: 0;
      background: #222;
      border: 1px solid #333;
      border-radius: 7px;
      color: #ccc;
      font-size: 12px;
      font-weight: 500;
      padding: 5px 12px;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
      font-family: inherit;
    }
    .copy-btn:hover { background: #2a2a2a; color: #fff; }
    .copy-btn.copied { background: rgba(52,199,89,0.15); color: #34c759; border-color: rgba(52,199,89,0.3); }

    select {
      width: 100%;
      background: #111;
      border: 1px solid #222;
      border-radius: 10px;
      color: #e8e8e8;
      font-size: 14px;
      font-family: inherit;
      padding: 13px 14px;
      appearance: none;
      -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23555' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 14px center;
      cursor: pointer;
      margin-bottom: 12px;
    }
    select:focus { outline: none; border-color: #3a3a3a; }

    .env-preview {
      display: flex;
      align-items: center;
      background: #111;
      border: 1px solid #222;
      border-radius: 10px;
      padding: 12px 14px;
      gap: 10px;
      margin-bottom: 24px;
    }

    .env-key {
      font-family: "SF Mono", "Fira Code", monospace;
      font-size: 12px;
      color: #555;
      white-space: nowrap;
    }

    .env-val {
      font-family: "SF Mono", "Fira Code", monospace;
      font-size: 12px;
      color: #a0a0a0;
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .divider {
      border: none;
      border-top: 1px solid #1e1e1e;
      margin: 28px 0;
    }

    .warn-box {
      background: rgba(255, 159, 10, 0.08);
      border: 1px solid rgba(255, 159, 10, 0.2);
      border-radius: 10px;
      padding: 14px 16px;
      font-size: 13px;
      color: #ff9f0a;
      line-height: 1.5;
    }

    .err-box {
      background: rgba(255, 59, 48, 0.08);
      border: 1px solid rgba(255, 59, 48, 0.2);
      border-radius: 10px;
      padding: 14px 16px;
      font-size: 13px;
      color: #ff3b30;
      line-height: 1.6;
    }

    .err-box a { color: #ff6b61; }

    .step {
      display: flex;
      gap: 14px;
      align-items: flex-start;
      margin-bottom: 16px;
    }
    .step-num {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      background: #1e1e1e;
      border: 1px solid #2a2a2a;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 600;
      color: #666;
    }
    .step-text {
      font-size: 13px;
      color: #888;
      padding-top: 3px;
      line-height: 1.5;
    }

    code {
      font-family: "SF Mono", "Fira Code", monospace;
      font-size: 11px;
      background: #1e1e1e;
      border: 1px solid #2a2a2a;
      padding: 2px 6px;
      border-radius: 4px;
      color: #aaa;
    }
  </style>
</head>
<body>
  <div class="card">
    ${body}
  </div>
  <script>
    function copyText(text, btnId) {
      navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById(btnId);
        if (!btn) return;
        btn.textContent = 'Copied';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
      });
    }

    function onAccountChange(sel) {
      const id = sel.value;
      const envVal = document.getElementById('env-val');
      const fullEnv = document.getElementById('full-env');
      if (envVal) envVal.textContent = id;
      if (fullEnv) fullEnv.dataset.val = 'GOOGLE_ADS_CUSTOMER_ID=' + id;
    }
  </script>
</body>
</html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}

function successScreen(
  refreshToken: string,
  customerIds: string[],
  customersError: string | null,
  missingDevToken: boolean,
  savedToDB: boolean = false,
): string {
  const tokenEnv = `GOOGLE_ADS_REFRESH_TOKEN=${refreshToken}`;
  const baseUrl  = process.env.NEXT_PUBLIC_BASE_URL ?? "";

  const savedBanner = savedToDB
    ? `<div style="background:rgba(74,222,128,0.08);border:1px solid rgba(74,222,128,0.2);border-radius:10px;padding:12px 16px;margin-bottom:24px;font-size:13px;color:#4ade80;">
        ✓ Credentials saved automatically — no copy-paste needed.
      </div>`
    : "";

  const accountSection = missingDevToken
    ? `<div class="warn-box">
        <strong>Developer token not set.</strong><br>
        Add <code>GOOGLE_ADS_DEVELOPER_TOKEN</code> to Railway Variables, then re-run the OAuth flow to auto-fetch your account list.
      </div>`
    : customersError
    ? `<div class="err-box">
        Could not fetch accounts: ${customersError}<br><br>
        If this is a 501 error, <a href="https://console.cloud.google.com/apis/library/googleads.googleapis.com" target="_blank">enable the Google Ads API</a> in your Cloud project.
      </div>`
    : customerIds.length === 0
    ? `<div class="warn-box">No accessible Google Ads accounts found for this Google account.</div>`
    : `<p class="section-label">Select your account</p>
       <select id="account-select" onchange="onAccountChange(this)">
         ${customerIds.map((id, i) => `<option value="${id}"${i === 0 ? " selected" : ""}>${id}</option>`).join("")}
       </select>
       <div class="env-preview" id="full-env" data-val="GOOGLE_ADS_CUSTOMER_ID=${customerIds[0]}">
         <span class="env-key">GOOGLE_ADS_CUSTOMER_ID=</span>
         <span class="env-val" id="env-val">${customerIds[0]}</span>
         <button class="copy-btn" id="btn-cid" onclick="copyText(document.getElementById('full-env').dataset.val, 'btn-cid')">Copy</button>
       </div>`;

  const hasAccounts = !missingDevToken && !customersError && customerIds.length > 0;

  return `
    <div class="icon-wrap success">✓</div>
    <h1>Connected to Google Ads</h1>
    <p class="subtitle">${savedToDB ? "Credentials saved automatically." : "Copy these values into your Railway Variables."}</p>

    ${savedBanner}

    ${hasAccounts ? accountSection : ""}

    ${!hasAccounts ? `
      <p class="section-label">Refresh token</p>
      <div class="field-row">
        <span class="field-value">${tokenEnv}</span>
        <button class="copy-btn" id="btn-rt" onclick="copyText('${tokenEnv}', 'btn-rt')">Copy</button>
      </div>
      <hr class="divider" />
      ${accountSection}
    ` : ""}

    ${hasAccounts ? `
    <hr class="divider" />
    <a href="${baseUrl}/" style="display:flex;align-items:center;justify-content:center;gap:8px;background:#1d4ed8;border-radius:10px;color:#fff;font-size:14px;font-weight:600;padding:13px;text-decoration:none;margin-top:4px;">
      Go to dashboard →
    </a>
    ` : `
    <hr class="divider" />
    <div class="step">
      <div class="step-num">1</div>
      <div class="step-text">Copy the refresh token into Railway Variables</div>
    </div>
    <div class="step">
      <div class="step-num">2</div>
      <div class="step-text">Select your account and copy <code>GOOGLE_ADS_CUSTOMER_ID</code> into Railway Variables</div>
    </div>
    <div class="step">
      <div class="step-num">3</div>
      <div class="step-text">Redeploy, then return to the dashboard and score an account</div>
    </div>
    `}
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
