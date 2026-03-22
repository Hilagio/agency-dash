/**
 * GET /api/auth/me — current session info
 */
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ user: null });
  return NextResponse.json({
    user: {
      userId: session.userId,
      orgId:  session.orgId,
      email:  session.email,
      name:   session.name,
    },
  });
}
