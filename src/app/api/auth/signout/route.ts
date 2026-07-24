import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/session";

function getOrigin(req: NextRequest): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.RAILWAY_PUBLIC_DOMAIN) return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  const host  = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") ?? (process.env.NODE_ENV === "production" ? "https" : "http");
  if (host) return `${proto}://${host}`;
  return new URL(req.url).origin;
}

export async function POST(req: NextRequest) {
  await clearSessionCookie();
  // 303 See Other: correct status for POST → GET redirect (browser will GET /login)
  return NextResponse.redirect(`${getOrigin(req)}/login`, { status: 303 });
}

// The Settings "Sign out" is a plain <a href> — a GET. Without this handler the
// link 405'd and signing out was impossible from the UI.
export async function GET(req: NextRequest) {
  await clearSessionCookie();
  return NextResponse.redirect(`${getOrigin(req)}/login`, { status: 303 });
}
