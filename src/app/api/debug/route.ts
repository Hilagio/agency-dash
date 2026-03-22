import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const env = {
    GOOGLE_ADS_CLIENT_ID:        !!process.env.GOOGLE_ADS_CLIENT_ID,
    GOOGLE_ADS_CLIENT_SECRET:    !!process.env.GOOGLE_ADS_CLIENT_SECRET,
    GOOGLE_ADS_DEVELOPER_TOKEN:  !!process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
    GOOGLE_ADS_REFRESH_TOKEN:    !!process.env.GOOGLE_ADS_REFRESH_TOKEN,
    DATABASE_URL:                (process.env.DATABASE_URL ?? "").replace(/:\/\/.*@/, "://***@"),
  };

  let db: object = { error: "DB unreachable" };
  let tokenTest: object = { skipped: true };

  try {
    const cred = await prisma.oAuthCredential.findUnique({ where: { id: "singleton" } });
    db = cred
      ? {
          hasRefreshToken: !!cred.refreshToken,
          refreshTokenPrefix: cred.refreshToken?.slice(0, 12) + "...",
          customerIds: cred.customerIds,
          loginCustomerId: cred.loginCustomerId,
          updatedAt: cred.updatedAt,
        }
      : { row: "none — need to OAuth" };

    const refreshToken = cred?.refreshToken ?? process.env.GOOGLE_ADS_REFRESH_TOKEN;
    if (refreshToken && process.env.GOOGLE_ADS_CLIENT_ID && process.env.GOOGLE_ADS_CLIENT_SECRET) {
      const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type:    "refresh_token",
          refresh_token: refreshToken,
          client_id:     process.env.GOOGLE_ADS_CLIENT_ID,
          client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
        }),
      });
      const data = await res.json() as Record<string, unknown>;
      tokenTest = res.ok
        ? { valid: true, scope: data.scope }
        : { valid: false, error: data.error, description: data.error_description };
    }
  } catch (e) {
    db = { error: e instanceof Error ? e.message : String(e) };
  }

  return NextResponse.json({ env, db, tokenTest });
}
