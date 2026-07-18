/**
 * POST /api/shopping — Google Shopping competitive scan for a query.
 * Body: { query, tld?, highlight? }. Session-authed. Returns the ranked sellers,
 * their prices, and where the highlighted shop/brand stands.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthContext, unauthorized } from "@/lib/auth";
import { fetchGoogleShopping } from "@/lib/integrations/scraperapi-shopping";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const body = await req.json().catch(() => ({})) as { query?: string; tld?: string; highlight?: string };
  const query = (body.query || "").trim();
  if (!query) return NextResponse.json({ error: "Enter a product or search term." }, { status: 400 });
  const tld = (body.tld || "nl").trim().toLowerCase().replace(/[^a-z.]/g, "") || "nl";
  const highlight = (body.highlight || "").trim();

  try {
    const scan = await fetchGoogleShopping(query, tld, highlight);
    return NextResponse.json(scan);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Shopping scan failed." }, { status: 502 });
  }
}
