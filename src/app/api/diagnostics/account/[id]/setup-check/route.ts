/**
 * POST /api/diagnostics/account/[id]/setup-check — the tracking & consent
 * pre-flight for onboarding. Fetches the account's landing page (SSRF-guarded)
 * and reports FACTS: which Google tags are present, whether Consent Mode is
 * set up, whether a CMP is detected, and how Ads conversions reconcile against
 * real orders. The specialist (or the agent) judges what the facts mean.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

type Params = { params: Promise<{ id: string }> };

interface SetupCheck { key: string; label: string; status: "ok" | "warn" | "fail" | "na"; detail: string }

function isSafePublicUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:" && u.protocol !== "http:") return false;
    const h = u.hostname.toLowerCase();
    if (h === "localhost" || h.endsWith(".local") || h.endsWith(".internal")) return false;
    if (/^\d+\.\d+\.\d+\.\d+$/.test(h)) {
      const [a, b] = h.split(".").map(Number);
      if (a === 10 || a === 127 || a === 0 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 169 && b === 254)) return false;
    }
    if (h.includes(":")) return false; // raw IPv6 — skip
    return true;
  } catch { return false; }
}

const CMP_SIGNATURES: [string, RegExp][] = [
  ["Cookiebot", /cookiebot/i],
  ["OneTrust", /onetrust|optanon/i],
  ["Usercentrics", /usercentrics/i],
  ["Complianz", /complianz|cmplz/i],
  ["CookieYes", /cookieyes/i],
  ["Iubenda", /iubenda/i],
  ["Shopify Customer Privacy", /shopify.*customer[-_]?privacy|customer[-_]?privacy.*shopify/i],
];

export async function POST(_req: Request, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;
  const account = await prisma.account.findFirst({
    where: { id, organizationId: ctx.orgId },
    select: { id: true, landingPageUrl: true },
  });
  if (!account) return forbidden();

  // Which page to scan: the configured landing page, else the page taking the
  // most ad spend in the last 30 days (that's where tracking has to work).
  let url = account.landingPageUrl;
  if (!url || !/^https?:\/\//i.test(url)) {
    const since = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
    const pages = await prisma.metricProductDaily.groupBy({
      by: ["landingPageUrl"],
      where: { accountId: id, date: { gte: since } },
      _sum: { spend: true },
      orderBy: { _sum: { spend: "desc" } },
      take: 5,
    });
    url = pages.map(p => p.landingPageUrl).find(u => /^https?:\/\//i.test(u)) ?? null;
  }

  const checks: SetupCheck[] = [];

  if (!url || !isSafePublicUrl(url)) {
    checks.push({ key: "page", label: "Landing page", status: "na", detail: "No public landing-page URL on file to scan — set one on the account or pull Google Ads data first." });
  } else {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(url, {
        signal: controller.signal,
        redirect: "follow",
        headers: { "User-Agent": "Mozilla/5.0 (compatible; EcomtradaSetupCheck/1.0)", Accept: "text/html" },
      });
      clearTimeout(timer);
      const html = (await res.text()).slice(0, 800_000);
      if (!res.ok) {
        // A 403/429 bot-block page isn't the real storefront — judging tags on
        // it would produce false "tracking broken" verdicts.
        checks.push({ key: "page", label: "Landing page", status: "warn", detail: `${url} answered HTTP ${res.status} (likely bot protection) — couldn't read the real page. Verify the tags manually with Google Tag Assistant.` });
        throw { skip: true };
      }

      const hasGtagJs = /googletagmanager\.com\/gtag\/js/i.test(html);
      const hasGtm = /googletagmanager\.com\/gtm\.js|GTM-[A-Z0-9]{4,}/.test(html);
      const awIds = [...new Set(html.match(/AW-\d{6,}/g) ?? [])];
      const gaIds = [...new Set(html.match(/G-[A-Z0-9]{6,12}/g) ?? [])];
      const consentDefault = /["']consent["']\s*,\s*["']default["']/.test(html);
      const consentAny = /gtag\(\s*["']consent["']/.test(html) || consentDefault;
      const cmp = CMP_SIGNATURES.find(([, re]) => re.test(html))?.[0] ?? null;

      checks.push({ key: "page", label: "Landing page", status: "ok", detail: `Scanned ${url}.` });
      checks.push(hasGtagJs || hasGtm
        ? { key: "tag", label: "Google tag", status: "ok", detail: `${hasGtm ? "Google Tag Manager" : "gtag.js"} found${gaIds.length ? ` · GA4: ${gaIds.slice(0, 2).join(", ")}` : ""}.` }
        : { key: "tag", label: "Google tag", status: "fail", detail: "No gtag.js or GTM container found in the page HTML — conversion tracking can't fire from this page. (A server-side or app-embedded setup wouldn't show here — verify in Tag Assistant.)" });
      checks.push(awIds.length
        ? { key: "aw", label: "Ads conversion tag", status: "ok", detail: `Google Ads tag present (${awIds.slice(0, 2).join(", ")}).` }
        : { key: "aw", label: "Ads conversion tag", status: hasGtm ? "warn" : "fail", detail: hasGtm ? "No AW- id visible in the HTML — it may load through GTM, so verify the conversion tag fires in Tag Assistant." : "No AW- conversion id found — Google Ads conversions likely aren't measured on this page." });
      checks.push(consentAny
        ? { key: "consent", label: "Consent Mode", status: consentDefault ? "ok" : "warn", detail: consentDefault ? `Consent Mode default command found${cmp ? ` · CMP: ${cmp}` : ""}.` : `A gtag consent call is present but no 'default' command was seen — check the CMP configuration${cmp ? ` (${cmp})` : ""}.` }
        : { key: "consent", label: "Consent Mode", status: cmp ? "warn" : "fail", detail: cmp ? `A CMP (${cmp}) is present but no Consent Mode signals were found in the HTML — EEA conversions may be dropped instead of modelled. It may be configured server-side; verify in Tag Assistant.` : "No Consent Mode and no consent banner detected — for EEA traffic this loses conversion data and risks compliance issues." });
    } catch (err) {
      const skipped = typeof err === "object" && err !== null && "skip" in err;
      if (!skipped) {
        checks.push({ key: "page", label: "Landing page", status: "warn", detail: `Couldn't fetch ${url} (${err instanceof Error && err.name === "AbortError" ? "timed out" : "fetch failed"}) — the site may block bots; check the tags manually with Tag Assistant.` });
      }
    }
  }

  // Reconciliation: Ads conversions vs real orders over the last 14 full days.
  const start = new Date(Date.now() - 14 * 864e5).toISOString().slice(0, 10);
  const end = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  const [adsAgg, orderAgg] = await Promise.all([
    prisma.metricDaily.aggregate({ where: { accountId: id, date: { gte: start, lte: end } }, _sum: { conversions: true } }),
    prisma.orderDaily.aggregate({ where: { accountId: id, date: { gte: start, lte: end } }, _sum: { orders: true } }),
  ]);
  const adsConv = Math.round(adsAgg._sum.conversions ?? 0);
  const orders = orderAgg._sum.orders ?? 0;
  if (!orders) {
    checks.push({ key: "recon", label: "Ads vs real orders", status: "na", detail: "No order data yet — connect Shopify (live or CSV) to reconcile Ads conversions against real orders." });
  } else {
    const gap = Math.round(((adsConv - orders) / orders) * 100);
    const status = Math.abs(gap) <= 20 ? "ok" : Math.abs(gap) <= 35 ? "warn" : "fail";
    checks.push({ key: "recon", label: "Ads vs real orders", status, detail: `Last 14d: Google Ads counted ${adsConv} conversions vs ${orders} real orders (${gap === 0 ? "matched" : gap < 0 ? `Ads ${Math.abs(gap)}% below` : `Ads ${gap}% above`}).` });
  }

  return NextResponse.json({ url, checks, ranAt: new Date().toISOString() });
}
