/**
 * POST /api/auth/google-ads/disconnect
 * Clears stored OAuth credentials for the current org.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized } from "@/lib/auth";

export async function POST() {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  try {
    await prisma.oAuthCredential.delete({ where: { organizationId: ctx.orgId } });
  } catch {
    // ignore if nothing to delete
  }
  return NextResponse.json({ ok: true });
}
