/**
 * POST /api/diagnostics/account/[id]/audit-page — run a pre-flight page audit
 * (12 personas judge the landing/product page) and stream progress via SSE.
 * GET — list past audits, or ?auditId= to fetch one (with the rendered report).
 *
 * The offer comes from the client context, the intent from the account's stored
 * search terms (or a pasted intent source for a pre-launch page).
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { runPageAudit } from "@/lib/audit/run";
import { renderAuditHtml } from "@/lib/audit/report";
import type { PageType } from "@/lib/audit/personas";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;
  if (!(await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId }, select: { id: true } }))) return forbidden();
  const auditId = req.nextUrl.searchParams.get("auditId");
  if (auditId) {
    const a = await prisma.pageAudit.findFirst({ where: { id: auditId, accountId: id } });
    if (!a) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json({ audit: { ...a, personas: JSON.parse(a.personas), fixes: JSON.parse(a.fixes) } });
  }
  const audits = await prisma.pageAudit.findMany({
    where: { accountId: id }, orderBy: { createdAt: "desc" }, take: 20,
    select: { id: true, url: true, pageType: true, renderMode: true, score: true, total: true, submit: true, createdAt: true, createdBy: true },
  });
  return NextResponse.json({ audits });
}

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;
  const account = await prisma.account.findFirst({
    where: { id, organizationId: ctx.orgId },
    select: { id: true, name: true, clientName: true, businessModel: true, landingPageUrl: true },
  });
  if (!account) return forbidden();

  const body = await req.json().catch(() => ({})) as { url?: string; pageType?: string; intentSource?: string };
  const url = (body.url || account.landingPageUrl || "").trim();
  if (!/^https?:\/\//i.test(url)) return NextResponse.json({ error: "A valid page URL is required (set the account's landing-page URL or pass one)." }, { status: 400 });
  const pageType: PageType = body.pageType === "leadgen" || body.pageType === "ecom"
    ? body.pageType
    : (account.businessModel === "lead_gen" || account.businessModel === "service" ? "leadgen" : "ecom");

  // Offer from the client context; intent from the stored search terms (or pasted).
  const cc = await prisma.clientContext.findUnique({ where: { accountId: id } }).catch(() => null);
  const offer = [
    `Client: ${account.clientName || account.name}`,
    cc?.goal && `Goal: ${cc.goal}`,
    cc?.usps && `USPs: ${cc.usps}`,
    cc?.makeOrBreak && `What makes or breaks it: ${cc.makeOrBreak}`,
    cc?.audienceNuances && `Audience: ${cc.audienceNuances}`,
  ].filter(Boolean).join("\n");

  let intentSource = (body.intentSource || "").trim();
  if (!intentSource) {
    const since = new Date(); since.setUTCDate(since.getUTCDate() - 30);
    const terms = await prisma.searchTermDaily.findMany({
      where: { accountId: id, date: { gte: since.toISOString().slice(0, 10) } },
      select: { searchTerm: true, cost: true },
    });
    const agg = new Map<string, number>();
    for (const t of terms) agg.set(t.searchTerm, (agg.get(t.searchTerm) ?? 0) + t.cost);
    intentSource = [...agg.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25).map(([t]) => t).join(", ");
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (o: unknown) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(o)}\n\n`));
      try {
        const result = await runPageAudit({ url, pageType, offer, intentSource }, (msg) => send({ status: msg }));
        const html = renderAuditHtml(result, new Date().toISOString().slice(0, 10));
        const saved = await prisma.pageAudit.create({
          data: {
            accountId: id, url: result.url, pageType, renderMode: result.renderMode,
            score: result.score, understand: result.understand, submit: result.convert, total: result.total,
            summary: result.summary, personas: JSON.stringify(result.personas), fixes: JSON.stringify(result.fixes),
            html, createdBy: ctx.email,
          },
        }).catch(() => null);
        send({ done: true, auditId: saved?.id ?? null, score: result.score, grade: result.grade, label: result.label, renderMode: result.renderMode, renderError: result.renderError });
        controller.close();
      } catch (e) {
        send({ error: e instanceof Error ? e.message : "Audit failed." });
        controller.close();
      }
    },
  });
  return new NextResponse(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" } });
}
