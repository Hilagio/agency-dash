/**
 * GET /api/auth/google-ads/callback
 *
 * Google redirects here after OAuth consent.
 * Exchanges the code for tokens and shows the refresh token + accessible customer IDs.
 * Copy these into your .env file.
 */
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return new NextResponse(
      html(`<h2 style="color:red">OAuth error: ${error}</h2>`),
      { headers: { "Content-Type": "text/html" } }
    );
  }

  if (!code) {
    return new NextResponse(
      html(`<h2 style="color:red">No code returned by Google.</h2>`),
      { headers: { "Content-Type": "text/html" } }
    );
  }

  const clientId     = process.env.GOOGLE_ADS_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET!;
  const redirectUri  = `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/auth/google-ads/callback`;

  // Exchange code for tokens
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
    return new NextResponse(
      html(`<h2 style="color:red">Token exchange failed</h2><pre>${JSON.stringify(tokens, null, 2)}</pre>`),
      { headers: { "Content-Type": "text/html" } }
    );
  }

  // Fetch accessible Google Ads customer IDs
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  if (!developerToken) {
    return new NextResponse(
      html(`
        <h1 style="color:green">✓ Authentication successful</h1>
        <p>Copy your refresh token into Railway Variables:</p>
        <pre style="background:#f4f4f4;padding:16px;border-radius:8px;font-size:13px;word-break:break-all">GOOGLE_ADS_REFRESH_TOKEN=${tokens.refresh_token}</pre>
        <p style="background:#fff3cd;padding:12px;border-radius:6px;border-left:4px solid #ffc107">
          <strong>GOOGLE_ADS_DEVELOPER_TOKEN is not set.</strong> Add it to Railway Variables, then re-run the OAuth flow to auto-fetch customer IDs.
        </p>
      `),
      { headers: { "Content-Type": "text/html" } }
    );
  }

  let customerIds: string[] = [];
  let customersError: string | null = null;
  const customersRes = await fetch(
    "https://googleads.googleapis.com/v19/customers:listAccessibleCustomers",
    {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
      },
    }
  );
  const customersData = await customersRes.json() as { resourceNames?: string[]; error?: unknown };
  if (!customersRes.ok || customersData.error) {
    customersError = JSON.stringify(customersData, null, 2);
  } else {
    customerIds = (customersData.resourceNames ?? []).map((r: string) =>
      r.replace("customers/", "")
    );
  }

  const is501 = customersError?.includes('"code": 501') || customersError?.includes('"code":501');
  const customerSection = customersError
    ? `<h3 style="color:red">Could not fetch customer IDs</h3>
       ${is501 ? `<p style="background:#fff3cd;padding:12px;border-radius:6px;border-left:4px solid #ffc107">
         <strong>Fix:</strong> The Google Ads API is not enabled in your Cloud project.<br>
         Go to <a href="https://console.cloud.google.com/apis/library/googleads.googleapis.com" target="_blank">
         console.cloud.google.com → APIs &amp; Services → Google Ads API</a> and click <strong>Enable</strong>, then try again.
       </p>` : ""}
       <pre style="background:#fff0f0;padding:12px;border-radius:6px;font-size:12px">${customersError}</pre>`
    : customerIds.length === 0
    ? `<p style="color:orange">No accessible Google Ads accounts found for this Google account.</p>`
    : `<h3>Accessible Google Ads accounts:</h3><ul>${customerIds.map(id => `<li><code>${id}</code></li>`).join("")}</ul>`;

  return new NextResponse(
    html(`
      <h1 style="color:green">✓ Authentication successful</h1>
      <p>Copy your refresh token into Railway Variables:</p>
      <pre style="background:#f4f4f4;padding:16px;border-radius:8px;font-size:13px;word-break:break-all">GOOGLE_ADS_REFRESH_TOKEN=${tokens.refresh_token}</pre>
      ${customerSection}
      ${customerIds.length > 0 ? `<p>Also add to Railway Variables:<br><pre style="background:#f4f4f4;padding:16px;border-radius:8px;font-size:13px">GOOGLE_ADS_CUSTOMER_ID=${customerIds[0]}</pre></p>` : ""}
    `),
    { headers: { "Content-Type": "text/html" } }
  );
}

function html(body: string): string {
  return `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:700px;margin:40px auto;padding:0 20px">${body}</body></html>`;
}
