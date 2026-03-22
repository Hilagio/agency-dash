/**
 * Auth context helpers for route handlers.
 *
 * The proxy (proxy.ts) reads the session JWT and forwards userId + orgId
 * as request headers so route handlers don't need to re-verify the JWT.
 *
 * Usage in route handlers:
 *   const ctx = await getAuthContext();
 *   if (!ctx) return unauthorized();
 *   // ctx.userId, ctx.orgId
 */
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export interface AuthContext {
  userId: string;
  orgId:  string;
  email:  string;
  name:   string | null;
}

/** Read auth context injected by proxy.ts. Returns null if not authenticated. */
export async function getAuthContext(): Promise<AuthContext | null> {
  const h      = await headers();
  const userId = h.get("x-user-id");
  const orgId  = h.get("x-org-id");
  const email  = h.get("x-user-email");
  const name   = h.get("x-user-name");

  if (!userId || !orgId) return null;
  return { userId, orgId, email: email ?? "", name: name ?? null };
}

/** 401 helper */
export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/** 403 helper */
export function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
