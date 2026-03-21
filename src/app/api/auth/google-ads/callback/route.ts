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
  let customerIds: string[] = [];
  try {
    const customersRes = await fetch(
      "https://googleads.googleapis.com/v19/customers:listAccessibleCustomers",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
          "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
        },
      }
    );
    const customersData = await customersRes.json() as { resourceNames?: string[] };
    customerIds = (customersData.resourceNames ?? []).map((r: string) =>
      r.replace("customers/", "")
    );
  } catch {
    customerIds = ["(could not fetch — add manually)"];
  }

  return new NextResponse(
    html(`
      <h1 style="color:green">✓ Authentication successful</h1>
      <p>Add these to your <code>.env</code> file:</p>
      <pre style="background:#f4f4f4;padding:16px;border-radius:8px;font-size:14px">
GOOGLE_ADS_REFRESH_TOKEN="${tokens.refresh_token}"
GOOGLE_ADS_CUSTOMER_ID="${customerIds[0] ?? ""}"
# All accessible customer IDs:
# ${customerIds.join("\n# ")}
      </pre>
      <p style="color:#666">Then restart the dev server. You can close this tab.</p>
    `),
    { headers: { "Content-Type": "text/html" } }
  );
}

function html(body: string): string {
  return `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:700px;margin:40px auto;padding:0 20px">${body}</body></html>`;
}
