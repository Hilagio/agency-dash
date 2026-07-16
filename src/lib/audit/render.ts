/**
 * Render a landing/product page into a structured "dossier" the persona
 * subagents judge. Primary path: a real headless Chromium (mobile viewport) so
 * JS-rendered Shopify/SPA pages are seen as a visitor sees them. Fallback: a
 * plain fetch + HTML extraction, so the audit still runs where a browser isn't
 * available (e.g. before Chromium is wired into the Railway image).
 */

export interface PageDossier {
  url: string;
  finalUrl: string;
  renderMode: "browser" | "fetch";
  title: string;
  metaDescription: string;
  headings: string[];
  ctas: string[];        // button + prominent link text (the actions on offer)
  formFields: string[];  // input labels / placeholders (lead-gen forms)
  priceHints: string[];  // strings that look like prices
  bodyText: string;      // cleaned visible text, truncated
  error?: string;
}

const MOBILE = { width: 390, height: 844 };
const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n) : s);
const uniq = (a: string[]) => [...new Set(a.map(s => s.trim()).filter(Boolean))];

// The DOM-extraction routine, run either inside the browser (page.evaluate) or
// re-implemented over fetched HTML below. Kept identical in spirit so the two
// render modes produce comparable dossiers.
const EXTRACT = `() => {
  const txt = (el) => (el && el.textContent ? el.textContent.replace(/\\s+/g, ' ').trim() : '');
  const q = (s) => Array.from(document.querySelectorAll(s));
  const headings = q('h1,h2,h3').map(txt).filter(Boolean).slice(0, 40);
  const ctas = q('button, a[role=button], [class*=btn], [class*=button], input[type=submit], a').map(el => txt(el) || el.getAttribute('value') || '').filter(t => t && t.length < 60).slice(0, 60);
  const formFields = q('input, textarea, select').map(el => el.getAttribute('aria-label') || el.getAttribute('placeholder') || el.getAttribute('name') || el.type || '').filter(Boolean).slice(0, 40);
  const body = document.body ? document.body.innerText.replace(/\\s+/g, ' ').trim() : '';
  const priceHints = (body.match(/(?:€|\\$|£|EUR|USD)\\s?\\d[\\d.,]*/g) || []).slice(0, 20);
  return {
    title: document.title || '',
    metaDescription: (document.querySelector('meta[name=description]') || {}).content || '',
    headings, ctas, formFields, priceHints,
    bodyText: body,
  };
}`;

async function renderWithBrowser(url: string): Promise<PageDossier> {
  // Runtime require (not a static import) so webpack never tries to bundle
  // Playwright, and a missing package/browser degrades cleanly to fetch.
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-eval
  const req = eval("require") as NodeRequire;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chromium = req("playwright-core").chromium as any;
  const execPath = process.env.PLAYWRIGHT_CHROMIUM_PATH || (process.env.PLAYWRIGHT_BROWSERS_PATH ? `${process.env.PLAYWRIGHT_BROWSERS_PATH}/chromium` : undefined);
  const browser = await chromium.launch({ headless: true, ...(execPath ? { executablePath: execPath } : {}), args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  try {
    const ctx = await browser.newContext({ viewport: MOBILE, isMobile: true, userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1" });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
    await page.waitForTimeout(2500); // let above-the-fold JS settle
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d = await page.evaluate(EXTRACT as any) as Omit<PageDossier, "url" | "finalUrl" | "renderMode">;
    const finalUrl = page.url();
    return {
      url, finalUrl, renderMode: "browser",
      title: d.title, metaDescription: d.metaDescription,
      headings: uniq(d.headings), ctas: uniq(d.ctas), formFields: uniq(d.formFields), priceHints: uniq(d.priceHints),
      bodyText: clip(d.bodyText, 9000),
    };
  } finally { await browser.close().catch(() => {}); }
}

async function renderWithFetch(url: string): Promise<PageDossier> {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile Safari/604.1" }, redirect: "follow" });
  const html = await res.text();
  const pick = (re: RegExp, all = false): string[] => {
    const out: string[] = []; let m: RegExpExecArray | null;
    const r = new RegExp(re, re.flags.includes("g") ? re.flags : re.flags + "g");
    while ((m = r.exec(html)) && out.length < 80) { out.push((m[1] ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()); if (!all) break; }
    return out;
  };
  const title = (pick(/<title[^>]*>([\s\S]*?)<\/title>/i)[0] ?? "");
  const metaDescription = (html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1] ?? "");
  const headings = uniq(pick(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi, true));
  const ctas = uniq([...pick(/<button[^>]*>([\s\S]*?)<\/button>/gi, true), ...pick(/<a[^>]*>([\s\S]*?)<\/a>/gi, true)].filter(t => t && t.length < 60)).slice(0, 60);
  const formFields = uniq((html.match(/<(?:input|textarea|select)[^>]*>/gi) ?? []).map(tag => (tag.match(/(?:aria-label|placeholder|name)=["']([^"']+)["']/i)?.[1] ?? "")).filter(Boolean)).slice(0, 40);
  const bodyText = clip(html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/gi, " ").replace(/\s+/g, " ").trim(), 9000);
  const priceHints = uniq((bodyText.match(/(?:€|\$|£|EUR|USD)\s?\d[\d.,]*/g) ?? [])).slice(0, 20);
  return { url, finalUrl: res.url || url, renderMode: "fetch", title, metaDescription, headings, ctas, formFields, priceHints, bodyText };
}

export async function renderPage(url: string): Promise<PageDossier> {
  try {
    return await renderWithBrowser(url);
  } catch (browserErr) {
    try {
      const d = await renderWithFetch(url);
      return d;
    } catch (fetchErr) {
      return {
        url, finalUrl: url, renderMode: "fetch", title: "", metaDescription: "",
        headings: [], ctas: [], formFields: [], priceHints: [], bodyText: "",
        error: `Couldn't render the page. Browser: ${browserErr instanceof Error ? browserErr.message : browserErr}. Fetch: ${fetchErr instanceof Error ? fetchErr.message : fetchErr}`,
      };
    }
  }
}
