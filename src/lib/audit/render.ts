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
  // Image FACTS — so a text-only judge can never hallucinate "no photos".
  imageCount: number;    // content images detected (icons/logos filtered out)
  imageAlts: string[];   // first alt texts (what the photos are of)
  heroImage: string | null; // og:image or the first big content image (absolute URL)
  blocked?: boolean;     // the site refused us (WAF/403/challenge) — not a page fault
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
  // Content images: rendered large enough to matter (kills icons/logos/pixels).
  const imgs = q('img').filter(el => (el.naturalWidth || el.width || 0) >= 150 && (el.naturalHeight || el.height || 0) >= 150);
  const og = (document.querySelector('meta[property="og:image"]') || {}).content || '';
  return {
    title: document.title || '',
    metaDescription: (document.querySelector('meta[name=description]') || {}).content || '',
    headings, ctas, formFields, priceHints,
    bodyText: body,
    imageCount: imgs.length,
    imageAlts: imgs.map(el => el.getAttribute('alt') || '').filter(Boolean).slice(0, 10),
    heroImage: og || (imgs[0] ? (imgs[0].currentSrc || imgs[0].src || '') : ''),
  };
}`;

async function renderWithBrowser(url: string): Promise<PageDossier> {
  // Runtime require (not a static import) so webpack never tries to bundle
  // Playwright, and a missing package/browser degrades cleanly to fetch.
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-eval
  const req = eval("require") as NodeRequire;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chromium = req("playwright-core").chromium as any;
  // Resolve a Chromium binary. Priority: explicit env override → the bundled
  // serverless build from @sparticuz/chromium (works on Railway with no system
  // install) → Playwright's own lookup. On any failure renderPage falls back to
  // a plain fetch, so a missing browser degrades cleanly rather than erroring.
  let execPath = process.env.PLAYWRIGHT_CHROMIUM_PATH
    || (process.env.PLAYWRIGHT_BROWSERS_PATH ? `${process.env.PLAYWRIGHT_BROWSERS_PATH}/chromium` : undefined);
  let extraArgs: string[] = ["--no-sandbox", "--disable-dev-shm-usage"];
  if (!execPath) {
    try {
      const spart = req("@sparticuz/chromium");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mod = (spart.default ?? spart) as { executablePath: () => Promise<string>; args: string[] };
      execPath = await mod.executablePath();
      extraArgs = [...new Set([...(mod.args ?? []), ...extraArgs])];
    } catch { /* no serverless chromium — let Playwright resolve its own */ }
  }
  const browser = await chromium.launch({ headless: true, ...(execPath ? { executablePath: execPath } : {}), args: extraArgs });
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
      imageCount: d.imageCount ?? 0,
      imageAlts: uniq(d.imageAlts ?? []),
      heroImage: d.heroImage ? new URL(d.heroImage, finalUrl).toString() : null,
    };
  } finally { await browser.close().catch(() => {}); }
}

async function renderWithFetch(url: string): Promise<PageDossier> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Upgrade-Insecure-Requests": "1",
    },
    redirect: "follow",
  });
  const html = await res.text();
  return dossierFromHtml(url, res.url || url, html, res.status, "fetch");
}

/**
 * Shared HTML → dossier: block detection + light extraction. Used by both the
 * plain fetch and the ScraperAPI paths so they produce comparable dossiers.
 */
function dossierFromHtml(url: string, finalUrl: string, html: string, status: number, renderMode: "browser" | "fetch"): PageDossier {
  const rawTitle = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").toLowerCase();
  const badStatus = status === 401 || status === 403 || status === 429 || status >= 500;
  const wallTitle = /access denied|forbidden|attention required|just a moment|are you human|verify you are (a )?human|captcha|request blocked|blocked/i.test(rawTitle);
  if (badStatus || wallTitle || html.length < 500) {
    return {
      url, finalUrl, renderMode,
      title: "", metaDescription: "", headings: [], ctas: [], formFields: [], priceHints: [], bodyText: "",
      imageCount: 0, imageAlts: [], heroImage: null,
      blocked: true,
      error: `The site refused our request (HTTP ${status}${rawTitle ? `, "${rawTitle.slice(0, 40)}"` : ""}). It's behind bot protection that blocks automated requests${renderMode === "browser" ? " even through the render service" : ""} — this is an access issue, not a fault in the page.`,
    };
  }
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

  // Image FACTS from raw HTML — src/data-src/srcset all count (lazy-loaded
  // Shopify galleries live in data-src), icons/logos/pixels filtered by name.
  const imgTags = html.match(/<img[^>]*>/gi) ?? [];
  const NOISE = /logo|icon|sprite|favicon|pixel|badge|payment|flag|\.svg/i;
  const contentImgs = imgTags.map(tag => ({
    src: tag.match(/(?:data-src|data-srcset|srcset|src)=["']([^"' ,]+)/i)?.[1] ?? "",
    alt: tag.match(/alt=["']([^"']+)["']/i)?.[1] ?? "",
    tag,
  })).filter(i => i.src && !NOISE.test(i.src) && !/width=["']?\d?\d["']?/.test(i.tag));
  const ogImage = html.match(/<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i)?.[1]
    ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1] ?? null;
  const abs = (s: string | null): string | null => { try { return s ? new URL(s, finalUrl).toString() : null; } catch { return null; } };

  return {
    url, finalUrl, renderMode, title, metaDescription, headings, ctas, formFields, priceHints, bodyText,
    imageCount: contentImgs.length,
    imageAlts: uniq(contentImgs.map(i => i.alt).filter(Boolean)).slice(0, 10),
    heroImage: abs(ogImage) ?? abs(contentImgs[0]?.src ?? null),
  };
}

/**
 * Render via ScraperAPI — renders JS and (with premium) routes through
 * residential IPs, so it gets past the bot protection / 429s that block a direct
 * server request. The only reliable path for auditing arbitrary external sites.
 * API key from the env (never hard-coded). Throws on a ScraperAPI-level failure
 * so renderPage can fall back to a local render.
 */
async function renderViaScraperApi(url: string): Promise<PageDossier> {
  const key = process.env.SCRAPERAPI_KEY;
  if (!key) throw new Error("SCRAPERAPI_KEY not set");
  const call = async (extra?: string): Promise<Response> => {
    const api = new URL("https://api.scraperapi.com/");
    api.searchParams.set("api_key", key);
    api.searchParams.set("url", url);
    api.searchParams.set("render", "true"); // execute JS
    if (extra) api.searchParams.set(extra, "true");
    return fetch(api.toString(), { signal: AbortSignal.timeout(75_000) });
  };
  // Cheapest first: plain render (10 credits). Testing showed it already gets
  // past a lot — and premium sometimes 500s where plain render succeeds. Escalate
  // to ultra_premium (residential + harder anti-bot, ~30 credits) only if plain
  // render fails outright or comes back as a block/challenge page.
  let res = await call();
  let dossier = res.ok ? dossierFromHtml(url, url, await res.text(), 200, "browser") : null;
  if (!res.ok || dossier?.blocked) {
    const up = await call("ultra_premium");
    if (up.ok) {
      const d2 = dossierFromHtml(url, url, await up.text(), 200, "browser");
      if (!d2.blocked) return d2;
      dossier = dossier ?? d2;
    } else if (!dossier) {
      throw new Error(`ScraperAPI ${res.status}/${up.status}: ${(await up.text().catch(() => "")).slice(0, 120)}`);
    }
  }
  if (!dossier) throw new Error(`ScraperAPI ${res.status}`);
  return dossier;
}

export async function renderPage(url: string): Promise<PageDossier> {
  // Prefer ScraperAPI when configured — the only path that reliably renders JS
  // AND gets past bot protection on arbitrary external sites. Falls back to a
  // local browser, then a plain fetch (each with block detection).
  if (process.env.SCRAPERAPI_KEY) {
    try { return await renderViaScraperApi(url); }
    catch { /* ScraperAPI unavailable (key/credits/transient) — try local render */ }
  }
  try {
    return await renderWithBrowser(url);
  } catch (browserErr) {
    try {
      return await renderWithFetch(url);
    } catch (fetchErr) {
      return {
        url, finalUrl: url, renderMode: "fetch", title: "", metaDescription: "",
        headings: [], ctas: [], formFields: [], priceHints: [], bodyText: "",
        imageCount: 0, imageAlts: [], heroImage: null,
        error: `Couldn't render the page. Browser: ${browserErr instanceof Error ? browserErr.message : browserErr}. Fetch: ${fetchErr instanceof Error ? fetchErr.message : fetchErr}`,
      };
    }
  }
}
