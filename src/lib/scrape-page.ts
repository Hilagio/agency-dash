/**
 * Scrapes a landing page URL and extracts structured content for CRO analysis.
 * Returns a compact representation that fits within a prompt without overwhelming it.
 */

export interface ScrapedPage {
  url:         string;
  title:       string;
  metaDesc:    string;
  h1:          string[];
  h2:          string[];
  ctas:        string[];   // button text, prominent links
  formFields:  string[];   // labels + placeholders
  bodyText:    string;     // first ~1200 chars of visible copy
  prices:      string[];   // any price mentions
  uspBullets:  string[];   // li items that look like USPs
  error?:      string;
}

// Strip HTML tags, collapse whitespace
function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

// Extract all matches of a pattern from HTML
function extractAll(html: string, pattern: RegExp): string[] {
  const results: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(html)) !== null) {
    const text = stripTags(m[1] ?? "").trim();
    if (text && text.length > 1 && text.length < 200) results.push(text);
  }
  return [...new Set(results)]; // deduplicate
}

export async function scrapePage(url: string): Promise<ScrapedPage> {
  let html: string;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AgencyDash/1.0; CRO analysis bot)",
        "Accept": "text/html",
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { url, title: "", metaDesc: "", h1: [], h2: [], ctas: [], formFields: [], bodyText: "", prices: [], uspBullets: [], error: `HTTP ${res.status}` };
    html = await res.text();
  } catch (e) {
    return { url, title: "", metaDesc: "", h1: [], h2: [], ctas: [], formFields: [], bodyText: "", prices: [], uspBullets: [], error: e instanceof Error ? e.message : "Fetch failed" };
  }

  // Remove scripts, styles, nav, footer — they add noise
  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<head[\s\S]*?<\/head>/gi, "");

  // Title
  const titleMatch = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  const title = stripTags(titleMatch?.[1] ?? "").slice(0, 120);

  // Meta description
  const metaMatch = /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i.exec(html)
    ?? /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i.exec(html);
  const metaDesc = (metaMatch?.[1] ?? "").slice(0, 200);

  // Headings
  const h1 = extractAll(cleaned, /<h1[^>]*>([\s\S]*?)<\/h1>/gi).slice(0, 4);
  const h2 = extractAll(cleaned, /<h2[^>]*>([\s\S]*?)<\/h2>/gi).slice(0, 6);

  // CTAs — buttons and anchor tags with short text
  const buttonTexts = extractAll(cleaned, /<button[^>]*>([\s\S]*?)<\/button>/gi);
  const anchorTexts = extractAll(cleaned, /<a[^>]*>([\s\S]*?)<\/a>/gi)
    .filter(t => t.length < 60 && /koop|bestel|buy|shop|get|start|try|gratis|free|aanvragen|download|ontdek|discover|bekijk|view|meer|more/i.test(t));
  const ctas = [...new Set([...buttonTexts, ...anchorTexts])].slice(0, 10);

  // Form fields
  const labelTexts  = extractAll(cleaned, /<label[^>]*>([\s\S]*?)<\/label>/gi);
  const inputPhs    = extractAll(cleaned, /<input[^>]+placeholder=["']([^"']+)["']/gi);
  const textareaPhs = extractAll(cleaned, /<textarea[^>]+placeholder=["']([^"']+)["']/gi);
  const formFields  = [...new Set([...labelTexts, ...inputPhs, ...textareaPhs])].slice(0, 12);

  // Prices
  const pricePattern = /(?:€|£|\$|USD|EUR)\s?\d+[\d.,]*/g;
  const prices = [...new Set((cleaned.match(pricePattern) ?? []))].slice(0, 8);

  // USP bullets — li items that are short and benefit-oriented
  const liTexts = extractAll(cleaned, /<li[^>]*>([\s\S]*?)<\/li>/gi)
    .filter(t => t.length > 10 && t.length < 120);
  const uspBullets = liTexts.slice(0, 10);

  // Body text — extract text from main/article/section, fall back to full body
  const mainMatch = /<main[\s\S]*?>([\s\S]*?)<\/main>/i.exec(cleaned)
    ?? /<article[\s\S]*?>([\s\S]*?)<\/article>/i.exec(cleaned)
    ?? /<section[\s\S]*?>([\s\S]*?)<\/section>/i.exec(cleaned);
  const bodySource = mainMatch ? mainMatch[1] : cleaned;
  const bodyText = stripTags(bodySource).replace(/\s+/g, " ").trim().slice(0, 1400);

  return { url, title, metaDesc, h1, h2, ctas, formFields, bodyText, prices, uspBullets };
}

/** Format scraped page into a compact prompt block */
export function formatPageForPrompt(page: ScrapedPage): string {
  if (page.error) return `[Page scrape failed: ${page.error} — base recommendations on client brief only]`;

  const lines: string[] = [`LANDING PAGE: ${page.url}`];

  if (page.title)              lines.push(`Title: ${page.title}`);
  if (page.metaDesc)           lines.push(`Meta description: ${page.metaDesc}`);
  if (page.h1.length)          lines.push(`H1: ${page.h1.join(" | ")}`);
  if (page.h2.length)          lines.push(`H2 headings: ${page.h2.join(" | ")}`);
  if (page.ctas.length)        lines.push(`CTAs / buttons: ${page.ctas.join(" | ")}`);
  if (page.formFields.length)  lines.push(`Form fields: ${page.formFields.join(" | ")}`);
  if (page.prices.length)      lines.push(`Prices visible: ${page.prices.join(", ")}`);
  if (page.uspBullets.length)  lines.push(`Bullet points / USPs: ${page.uspBullets.join(" | ")}`);
  if (page.bodyText)           lines.push(`\nPage copy (first ~1200 chars):\n${page.bodyText}`);

  return lines.join("\n");
}
