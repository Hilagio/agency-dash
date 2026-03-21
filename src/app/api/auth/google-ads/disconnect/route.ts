/**
 * POST /api/auth/google-ads/disconnect
 * Clears stored OAuth credentials so the user can re-authenticate.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST() {
  try {
    await prisma.oAuthCredential.deleteMany({});
  } catch {
    // ignore if nothing to delete
  }
  return NextResponse.json({ ok: true });
}
