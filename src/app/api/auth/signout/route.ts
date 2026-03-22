import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/session";

export async function POST(req: NextRequest) {
  await clearSessionCookie();
  const origin = process.env.NEXT_PUBLIC_BASE_URL ?? new URL(req.url).origin;
  return NextResponse.redirect(`${origin}/login`);
}
