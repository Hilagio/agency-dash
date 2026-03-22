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
  } catch (e) {
    db = { error: e instanceof Error ? e.message : String(e) };
  }

  return NextResponse.json({ env, db });
}
