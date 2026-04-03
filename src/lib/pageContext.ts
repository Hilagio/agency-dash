/**
 * extractPageContext
 *
 * Processes raw HTML to extract reliable CRO signals even when the page
 * is JavaScript-rendered (Shopify, Next.js, etc.) and the body is empty.
 *
 * Extracts:
 *  - JSON-LD structured data (Product, Organization, FAQPage, etc.)
 *  - Open Graph / Twitter meta tags
 *  - Page title and meta description
 *  - Detected ecommerce platform and third-party tools
 *  - Any server-side rendered body text
 *  - JS-rendering detection
 */

export interface PageContext {
  /** True when body content is absent and page relies on client-side rendering */
  isJsRendered: boolean;
  /** Detected platform e.g. "Shopify", "WooCommerce", "Magento", "Next.js" */
  platform:     string | null;
  /** JSON-LD objects found in <script type="application/ld+json"> tags */
  jsonLd:       object[];
  /** Key meta / og / twitter tags */
  meta:         Record<string, string>;
  /** Third-party tools detected from script src patterns */
  tools:        string[];
  /** First 3 KB of body text (SSR content) — empty for pure CSR */
  bodyText:     string;
  /**
   * Pre-formatted context string to paste directly into a Claude prompt.
   * Contains everything Claude needs to do a meaningful audit.
   */
  summary:      string;
}

// ─── Platform / tool fingerprints ─────────────────────────────────────────────

const PLATFORM_PATTERNS: [RegExp, string][] = [
  [/cdn\.shopify\.com|Shopify\.theme|shopify-section/i,           "Shopify"],
  [/woocommerce|wc-add-to-cart|wc_cart/i,                         "WooCommerce"],
  [/Magento_|mage\/|mage-init/i,                                   "Magento"],
  [/__NEXT_DATA__|_next\/static/i,                                  "Next.js"],
  [/data-reactroot|__reactFiber/i,                                  "React"],
  [/__vue_|data-v-/i,                                              "Vue.js"],
  [/PrestaShop|prestashop/i,                                       "PrestaShop"],
  [/bigcommerce|BigCommerce/i,                                     "BigCommerce"],
];

const TOOL_PATTERNS: [RegExp, string][] = [
  [/yotpo\.com|yotpo/i,           "Yotpo (reviews)"],
  [/trustpilot\.com/i,            "Trustpilot"],
  [/judge\.me/i,                  "Judge.me (reviews)"],
  [/okendo/i,                     "Okendo (reviews)"],
  [/reviews\.io/i,                "Reviews.io"],
  [/stamped\.io/i,                "Stamped.io (reviews)"],
  [/klaviyo/i,                    "Klaviyo (email)"],
  [/attentive/i,                  "Attentive (SMS)"],
  [/postscript/i,                 "Postscript (SMS)"],
  [/hotjar/i,                     "Hotjar (heatmaps)"],
  [/tripadvisor/i,                "TripAdvisor"],
  [/loox/i,                       "Loox (photo reviews)"],
  [/recharge/i,                   "Recharge (subscriptions)"],
  [/bold\.commerce/i,             "Bold Commerce"],
  [/gorgias/i,                    "Gorgias (support chat)"],
  [/tidio/i,                      "Tidio (chat)"],
  [/intercom/i,                   "Intercom (chat)"],
  [/klarna/i,                     "Klarna (BNPL)"],
  [/afterpay|clearpay/i,          "Afterpay/Clearpay (BNPL)"],
  [/affirm/i,                     "Affirm (BNPL)"],
  [/schema\.org.*Product/i,       "Product schema markup"],
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractJsonLd(html: string): object[] {
  const results: object[] = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(m[1].trim());
      // Flatten @graph arrays
      if (Array.isArray(parsed)) results.push(...parsed);
      else if (parsed?.["@graph"]) results.push(...parsed["@graph"]);
      else results.push(parsed);
    } catch {
      // malformed JSON-LD — skip
    }
  }
  return results;
}

function extractMeta(html: string): Record<string, string> {
  const meta: Record<string, string> = {};
  const re = /<meta\s+([^>]+)>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const attrs = m[1];
    const nameM    = /(?:name|property)=["']([^"']+)["']/i.exec(attrs);
    const contentM = /content=["']([^"']*?)["']/i.exec(attrs);
    if (nameM && contentM) meta[nameM[1].toLowerCase()] = contentM[1];
  }
  // Page title
  const titleM = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  if (titleM) meta["title"] = titleM[1].trim();
  return meta;
}

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function detectPlatform(html: string): string | null {
  for (const [re, name] of PLATFORM_PATTERNS) {
    if (re.test(html)) return name;
  }
  return null;
}

function detectTools(html: string): string[] {
  return TOOL_PATTERNS.filter(([re]) => re.test(html)).map(([, name]) => name);
}

function isJsRendered(html: string): boolean {
  // Extract body content
  const bodyM = /<body[\s\S]*?>([\s\S]*?)<\/body>/i.exec(html);
  if (!bodyM) return true;
  const bodyText = stripTags(bodyM[1]);
  // Fewer than 200 characters of visible text in body = almost certainly CSR
  return bodyText.length < 200;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function extractPageContext(html: string, url: string): PageContext {
  const jsonLd    = extractJsonLd(html);
  const meta      = extractMeta(html);
  const tools     = detectTools(html);
  const platform  = detectPlatform(html);
  const jsRender  = isJsRendered(html);

  // Best-effort body text for SSR pages
  const bodyM    = /<body[\s\S]*?>([\s\S]*?)<\/body>/i.exec(html);
  const bodyText = bodyM ? stripTags(bodyM[1]).slice(0, 3000) : "";

  // Build summary string for Claude
  const parts: string[] = [`URL: ${url}`];

  if (platform) parts.push(`Platform: ${platform}`);
  if (tools.length) parts.push(`Third-party tools detected: ${tools.join(", ")}`);

  if (jsRender) {
    parts.push(
      `⚠ JS-RENDERED PAGE (${platform ?? "SPA"}): The HTML body is empty by design — content loads at runtime via JavaScript. ` +
      "THIS IS NOT AN ISSUE. Do not flag the empty body, missing SSR content, or crawlability in your issues list. " +
      "Audit only what you can see: structured data, meta tags, og tags, and detected third-party tools."
    );
  }

  if (meta["title"]) parts.push(`Page title: ${meta["title"]}`);
  if (meta["description"]) parts.push(`Meta description: ${meta["description"]}`);
  if (meta["og:title"]) parts.push(`OG title: ${meta["og:title"]}`);
  if (meta["og:description"]) parts.push(`OG description: ${meta["og:description"]}`);
  if (meta["og:image"]) parts.push(`OG image: ${meta["og:image"]}`);
  if (meta["viewport"]) parts.push(`Viewport: ${meta["viewport"]}`);

  if (jsonLd.length > 0) {
    parts.push(`\nJSON-LD structured data:\n${JSON.stringify(jsonLd, null, 2).slice(0, 8000)}`);
  }

  if (!jsRender && bodyText) {
    parts.push(`\nPage body text (SSR):\n${bodyText}`);
  }

  return {
    isJsRendered: jsRender,
    platform,
    jsonLd,
    meta,
    tools,
    bodyText,
    summary: parts.join("\n"),
  };
}
