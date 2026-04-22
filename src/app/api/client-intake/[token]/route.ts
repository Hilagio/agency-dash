import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ token: string }> };

// GET — fetch account name for the welcome screen (public, no auth)
export async function GET(_req: NextRequest, { params }: Params) {
  const { token } = await params;
  const account = await prisma.account.findUnique({
    where: { intakeToken: token },
    select: { name: true, intakeCompletedAt: true },
  });
  if (!account) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ name: account.name, completed: !!account.intakeCompletedAt });
}

// POST — submit intake form (public, no auth)
export async function POST(req: NextRequest, { params }: Params) {
  const { token } = await params;

  const account = await prisma.account.findUnique({ where: { intakeToken: token } });
  if (!account) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (account.intakeCompletedAt) {
    return NextResponse.json({ error: "Already submitted" }, { status: 409 });
  }

  const body = await req.json() as {
    businessName:        string;
    websiteUrl:          string;
    uniqueSellingPoints: string;
    monthlyBudget:       number | null;
    targetRoas:          number | null;
    targetLocations:     string;
    cookieBanner:        string;
    conversionTracking:  string;
    productHeroPro:      boolean;
    specialPromotions:   string;
    reportEmail:         string;
    tosAccepted:         boolean;
  };

  if (!body.tosAccepted) {
    return NextResponse.json({ error: "Terms of service must be accepted" }, { status: 400 });
  }

  // Build clientContext from the intake answers
  const contextParts: string[] = [];
  if (body.uniqueSellingPoints) contextParts.push(`USPs: ${body.uniqueSellingPoints}`);
  if (body.targetLocations)     contextParts.push(`Target locations: ${body.targetLocations}`);
  if (body.cookieBanner)        contextParts.push(`Cookie banner: ${body.cookieBanner}`);
  if (body.conversionTracking)  contextParts.push(`Conversion tracking: ${body.conversionTracking}`);
  if (body.specialPromotions)   contextParts.push(`Special promotions: ${body.specialPromotions}`);
  contextParts.push(`ProductHero Pro: ${body.productHeroPro ? "Yes" : "No"}`);

  await prisma.account.update({
    where: { intakeToken: token },
    data: {
      name:               body.businessName || account.name,
      landingPageUrl:     body.websiteUrl   || account.landingPageUrl,
      monthlyBudget:      body.monthlyBudget ?? account.monthlyBudget,
      targetRoas:         body.targetRoas   ?? account.targetRoas,
      clientContext:      contextParts.join("\n"),
      reportEmail:        body.reportEmail  || null,
      tosAcceptedAt:      new Date(),
      intakeCompletedAt:  new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}
