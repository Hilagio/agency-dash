/**
 * POST /api/accounts/[id]/ad-copy — the PPC OS ad-copy-maker, in-platform.
 *
 * Composes responsive search ads (per testing cluster) and PMax text assets
 * for THIS account, following the PPC OS ad-copy doctrine verbatim (the
 * skill's reference docs, vendored under knowledge-base/skill-refs). Grounded
 * in the live campaign structure, search terms and the Client Context Pack.
 *
 * Output: a review document in the house style (saved to the account's
 * library) + a Google Ads Editor import file (TSV). NOTHING is ever written
 * to the Google Ads account — compose, review, import by hand: the same
 * approval boundary the original skill enforces.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import fs from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { runAgentTool } from "@/lib/diagnostics/agent-tools";
import { ppcOsMcp, PPC_OS_SYSTEM_NOTE } from "@/lib/integrations/ppc-os";
import { renderDocHtml } from "@/lib/doc/render";
import type { DocContent, DocLanguage, DocSection } from "@/lib/doc/types";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

type Params = { params: Promise<{ id: string }> };
const client = new Anthropic();

interface RsaSet { campaign: string; adGroup: string; cluster?: string; finalUrl?: string; headlines: { text: string; type?: string }[]; descriptions: { text: string }[] }
interface PmaxSet { campaign: string; assetGroup: string; headlines: string[]; longHeadlines: string[]; descriptions: string[] }
interface AdCopyOut { rsas?: RsaSet[]; pmax?: PmaxSet[]; notes?: string[] }

/** The vendored PPC OS ad-copy doctrine — read once, cached. */
let DOCTRINE: string | null = null;
function doctrine(): string {
  if (DOCTRINE !== null) return DOCTRINE;
  const root = path.join(process.cwd(), "knowledge-base", "skill-refs", "ad-copy-maker");
  const files = ["composition.md", "headline-catalog.md", "description-catalog.md", "quality-checklists.md", "pmax-mode.md"];
  const parts: string[] = [];
  for (const f of files) {
    try { parts.push(`\n===== PPC OS DOCTRINE: ${f} =====\n${fs.readFileSync(path.join(root, f), "utf8")}`); } catch { /* stripped build */ }
  }
  DOCTRINE = parts.join("\n");
  return DOCTRINE;
}

const SYSTEM_HEAD = `You are the PPC OS ad-copy-maker, running inside Ecomtrada AI for a Dutch ecommerce PPC agency. You compose responsive search ads per testing cluster and Performance Max text assets for ONE account, following the PPC OS doctrine below to the letter — the seven headline types, the slot model, the description patterns and expansion rule, claim integrity, and every quality checklist.

HARD RULES:
- Headlines ≤ 30 characters. Descriptions ≤ 90. PMax: headlines ≤ 30, long headlines ≤ 90, descriptions ≤ 90. Count characters yourself; an over-length asset is a defect.
- Ground every claim in the CLIENT CONTEXT PACK and the live data — claim integrity means no invented USPs, prices, guarantees or shipping promises. If proof for an angle is missing, use a different angle.
- Write in the requested language, native quality.
- Compose for the campaigns/ad groups that exist in the LIVE CAMPAIGN STRUCTURE — use their real names so the Editor import lands correctly. Skip brand campaigns unless asked.
- NOTHING you produce is applied automatically — the team reviews the artifact and imports the Editor file by hand.

After composing, return ONLY a JSON object (no prose, no fences):
{"rsas":[{"campaign":"real name","adGroup":"real or proposed name","cluster":"intent cluster label","finalUrl":"", "headlines":[{"text":"≤30 chars","type":"one of the seven headline types"}],"descriptions":[{"text":"≤90 chars"}]}],"pmax":[{"campaign":"","assetGroup":"","headlines":["≤30"],"longHeadlines":["≤90"],"descriptions":["≤90"]}],"notes":["anything the team must know — gaps, assumptions, angles that lack proof"]}
Per RSA: 7-12 headlines spanning the headline types, 3-4 descriptions. Per PMax asset group: up to 15 headlines, up to 5 long headlines, up to 4 descriptions. Only include "pmax" when the structure has PMax campaigns (or the team asked); only include "rsas" when there are search campaigns (or the team asked).`;

const esc = (s: string) => String(s ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " ");

/** Google Ads Editor import (TSV) — mirrors the PPC OS editor-csv contract. */
function editorTsv(rsas: RsaSet[]): string {
  const headers = ["Campaign", "Ad Group", "Ad type", "Labels", "Final URL", ...Array.from({ length: 15 }, (_, i) => `Headline ${i + 1}`), ...Array.from({ length: 4 }, (_, i) => `Description ${i + 1}`)];
  const lines = [headers.join("\t")];
  for (const r of rsas) {
    const row: Record<string, string> = Object.fromEntries(headers.map(h => [h, ""]));
    row["Campaign"] = esc(r.campaign); row["Ad Group"] = esc(r.adGroup);
    row["Ad type"] = "Responsive search ad"; row["Labels"] = "ecomtrada-ai";
    row["Final URL"] = esc(r.finalUrl ?? "");
    r.headlines.slice(0, 15).forEach((h, i) => { row[`Headline ${i + 1}`] = esc(h.text); });
    r.descriptions.slice(0, 4).forEach((d, i) => { row[`Description ${i + 1}`] = esc(d.text); });
    lines.push(headers.map(h => row[h]).join("\t"));
  }
  return lines.join("\n");
}

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;

  const account = await prisma.account.findFirst({
    where: { id, organizationId: ctx.orgId },
    select: { id: true, name: true, clientName: true, currency: true, googleAdsId: true, merchantCenterId: true, organizationId: true, landingPageUrl: true },
  });
  if (!account) return forbidden();

  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const language: DocLanguage = body?.language === "nl" ? "nl" : "en";
  const focus = typeof body?.request === "string" ? body.request.trim() : "";

  const clientCtx = await prisma.clientContext.findUnique({ where: { accountId: id } }).catch(() => null);
  const L: string[] = [`ACCOUNT: ${account.clientName || account.name}`];
  if (account.landingPageUrl) L.push(`Site: ${account.landingPageUrl}`);
  const cc = clientCtx;
  if (cc?.usps) L.push(`USPs (the ONLY claim sources, with the site): ${cc.usps}`);
  if (cc?.audienceNuances) L.push(`Audience nuances: ${cc.audienceNuances}`);
  if (cc?.goal) L.push(`Goal: ${cc.goal}`);
  if (cc?.makeOrBreak) L.push(`Make-or-break: ${cc.makeOrBreak}`);
  if (cc?.anythingElse) L.push(`Constraints: ${cc.anythingElse}`);

  if (account.googleAdsId) {
    const toolAcc = { id, googleAdsId: account.googleAdsId, organizationId: account.organizationId, currency: account.currency, merchantCenterId: account.merchantCenterId };
    const boxed = (p: Promise<string>) => Promise.race([p, new Promise<string>((_, rej) => setTimeout(() => rej(new Error("timeout")), 20_000))]);
    const pulls = await Promise.allSettled([
      boxed(runAgentTool("get_campaign_overview", {}, toolAcc)),
      boxed(runAgentTool("get_search_terms", {}, toolAcc)),
      boxed(runAgentTool("get_ad_strength", {}, toolAcc)),
    ]);
    const labels = ["LIVE CAMPAIGN STRUCTURE", "SEARCH TERMS (cluster by real intent)", "CURRENT RSA COVERAGE (ad strength — underbuilt ads first)"];
    pulls.forEach((p, i) => {
      if (p.status === "fulfilled" && p.value && !/^error/i.test(p.value)) L.push(`\n${labels[i]}:\n${p.value.slice(0, 4500)}`);
      else L.push(`\n${labels[i]}: unavailable — note it and compose from the context pack + site.`);
    });
  }

  const userMsg = `LANGUAGE: ${language === "nl" ? "Dutch (nl)" : "English (en)"}
${focus ? `TEAM INSTRUCTION (binding — e.g. which campaigns, which mode): ${focus}\n` : ""}
--- ACCOUNT MATERIAL ---
${L.join("\n")}

Compose the ad copy per the doctrine. Return only the JSON object.`;

  const encoder = new TextEncoder();
  const send = (c: ReadableStreamDefaultController, o: unknown) => c.enqueue(encoder.encode(`data: ${JSON.stringify(o)}\n\n`));

  const stream = new ReadableStream({
    async start(controller) {
      try {
        send(controller, { status: "composing" });
        const ppc = ppcOsMcp();
        const msgs: Array<{ role: "user" | "assistant"; content: unknown }> = [{ role: "user", content: userMsg }];
        let acc = "", ticks = 0;
        for (let round = 0; round < 5; round++) {
          const s = client.beta.messages.stream({
            model: "claude-opus-4-8",
            max_tokens: 24_000,
            thinking: { type: "adaptive" },
            ...(ppc ? { betas: ppc.betas, mcp_servers: ppc.mcp_servers, tools: ppc.tools } : {}),
            system: SYSTEM_HEAD + (ppc ? PPC_OS_SYSTEM_NOTE : "") + doctrine(),
            messages: msgs as Parameters<typeof client.beta.messages.stream>[0]["messages"],
          });
          for await (const ev of s) {
            if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") {
              acc += ev.delta.text;
              if (++ticks % 15 === 0) send(controller, { status: "writing", chars: acc.length });
            }
          }
          const fm = await s.finalMessage();
          if (fm.stop_reason !== "pause_turn") break;
          msgs.push({ role: "assistant", content: fm.content });
        }

        const a = acc.indexOf("{"), b = acc.lastIndexOf("}");
        let out: AdCopyOut | null = null;
        if (a >= 0 && b > a) { try { out = JSON.parse(acc.slice(a, b + 1)) as AdCopyOut; } catch { out = null; } }
        const rsas = (out?.rsas ?? []).filter(r => r?.campaign && Array.isArray(r.headlines) && r.headlines.length > 0);
        const pmax = (out?.pmax ?? []).filter(p => p?.assetGroup && Array.isArray(p.headlines));
        if (!rsas.length && !pmax.length) { send(controller, { error: "The composer returned nothing usable — try again (optionally name the campaigns to cover)." }); controller.close(); return; }

        // Enforce the length contract server-side; over-length assets are
        // dropped and counted rather than silently imported broken.
        let dropped = 0;
        for (const r of rsas) {
          r.headlines = r.headlines.filter(h => { const ok = h.text && h.text.length <= 30; if (!ok) dropped++; return ok; });
          r.descriptions = (r.descriptions ?? []).filter(d => { const ok = d.text && d.text.length <= 90; if (!ok) dropped++; return ok; });
        }
        for (const p of pmax) {
          p.headlines = (p.headlines ?? []).filter(t => { const ok = t && t.length <= 30; if (!ok) dropped++; return ok; });
          p.longHeadlines = (p.longHeadlines ?? []).filter(t => { const ok = t && t.length <= 90; if (!ok) dropped++; return ok; });
          p.descriptions = (p.descriptions ?? []).filter(t => { const ok = t && t.length <= 90; if (!ok) dropped++; return ok; });
        }

        // Review artifact in the house style → the account's document library.
        const nl = language === "nl";
        const sections: DocSection[] = [];
        for (const r of rsas) {
          sections.push({
            heading: `${r.campaign} › ${r.adGroup}${r.cluster ? ` · ${r.cluster}` : ""}`,
            table: { columns: [nl ? "Kop" : "Headline", "Type", nl ? "Tekens" : "Chars"], rows: r.headlines.map(h => [h.text, h.type ?? "", String(h.text.length)]) },
            bullets: r.descriptions.map(d => `${d.text} *(${d.text.length})*`),
            callout: r.finalUrl ? `Final URL: ${r.finalUrl}` : undefined,
          });
        }
        for (const p of pmax) {
          sections.push({
            heading: `PMax · ${p.campaign} › ${p.assetGroup}`,
            table: { columns: [nl ? "Asset" : "Asset", nl ? "Tekst" : "Text", nl ? "Tekens" : "Chars"], rows: [
              ...p.headlines.map(t => ["Headline", t, String(t.length)]),
              ...p.longHeadlines.map(t => ["Long headline", t, String(t.length)]),
              ...p.descriptions.map(t => ["Description", t, String(t.length)]),
            ] },
          });
        }
        if (out?.notes?.length || dropped > 0) {
          sections.push({ heading: nl ? "Voor het team" : "For the team", bullets: [...(out?.notes ?? []), ...(dropped > 0 ? [nl ? `${dropped} te lange assets zijn weggelaten.` : `${dropped} over-length assets were dropped.`] : [])] });
        }
        sections.push({ heading: nl ? "Hoe te importeren" : "How to import", lead: nl
          ? "Niets is automatisch doorgevoerd. Review dit document, download het Editor-bestand (TSV) en importeer het in Google Ads Editor — daar keur je elke advertentie definitief goed."
          : "Nothing was applied automatically. Review this document, download the Editor file (TSV) and import it in Google Ads Editor — final approval happens there." });

        const doc: DocContent = {
          language, format: "doc", client: account.clientName || account.name,
          docType: "Ad Copy", title: nl ? `${account.clientName || account.name} — Advertentieteksten (RSA & PMax)` : `${account.clientName || account.name} — Ad Copy (RSA & PMax)`,
          subtitle: `${rsas.length} RSA${rsas.length === 1 ? "" : "s"} · ${pmax.length} PMax asset group${pmax.length === 1 ? "" : "s"} · ${new Date().toISOString().slice(0, 10)}`,
          sections,
        };
        const html = renderDocHtml(doc);
        const safe = (account.clientName || account.name).replace(/[^a-z0-9]+/gi, "-").toLowerCase();
        const saved = await prisma.generatedDoc.create({
          data: { accountId: id, title: doc.title, docType: doc.docType, format: "doc", language, filename: `${safe}-ad-copy.html`, html, createdBy: ctx.email },
          select: { id: true, title: true, docType: true, format: true, language: true, filename: true, createdBy: true, createdAt: true },
        }).catch(() => null);

        send(controller, { done: true, html, filename: `${safe}-ad-copy.html`, csv: rsas.length ? editorTsv(rsas) : null, csvFilename: `${safe}-rsas-editor.csv`, saved, counts: { rsas: rsas.length, pmax: pmax.length, dropped } });
      } catch (err) {
        send(controller, { error: err instanceof Error ? err.message : "Ad copy composition failed" });
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive" } });
}
