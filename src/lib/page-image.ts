/**
 * Best-effort product-page image lookup (og:image), with a per-account cache —
 * so the client share dashboard shows product photos even without Shopify.
 *
 * Safety: only public http(s) hosts (no localhost/private ranges), a short
 * timeout per fetch, a small per-request budget, and results (including "none
 * found") are cached in PageImage so a page is re-fetched at most weekly.
 */
import { prisma } from "@/lib/db";

const FETCH_TIMEOUT_MS = 4000;
const MAX_FETCHES_PER_REQUEST = 5;
const CACHE_TTL_MS = 7 * 24 * 3600_000;

function isSafePublicUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:" && u.protocol !== "http:") return false;
    const h = u.hostname.toLowerCase();
    if (h === "localhost" || h.endsWith(".local") || h.endsWith(".internal")) return false;
    // Numeric-IP hosts: block private/link-local/loopback ranges.
    if (/^\d+\.\d+\.\d+\.\d+$/.test(h)) {
      const [a, b] = h.split(".").map(Number);
      if (a === 10 || a === 127 || a === 0 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 169 && b === 254)) return false;
    }
    if (h.includes(":")) return false; // raw IPv6 — skip
    return true;
  } catch { return false; }
}

/** Extract og:image / twitter:image from an HTML head. */
function extractImage(html: string, baseUrl: string): string | null {
  const head = html.slice(0, 200_000);
  const m =
    head.match(/<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i) ||
    head.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i) ||
    head.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
  if (!m) return null;
  try {
    const abs = new URL(m[1], baseUrl).toString();
    return abs.startsWith("http") ? abs.slice(0, 1000) : null;
  } catch { return null; }
}

/**
 * Resolve images for the given landing-page URLs, using (and filling) the
 * cache. Never throws; missing/failed pages just come back without an image.
 */
export async function getPageImages(accountId: string, urls: string[]): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  const wanted = [...new Set(urls.filter(u => /^https?:\/\//i.test(u)))];
  if (!wanted.length) return out;

  const cached = await prisma.pageImage.findMany({ where: { accountId, url: { in: wanted } } });
  const byUrl = new Map(cached.map(c => [c.url, c]));
  const now = Date.now();
  const toFetch: string[] = [];
  for (const u of wanted) {
    const c = byUrl.get(u);
    if (c && now - c.fetchedAt.getTime() < CACHE_TTL_MS) {
      if (c.imageUrl) out.set(u, c.imageUrl);
    } else if (isSafePublicUrl(u)) {
      toFetch.push(u);
    }
  }

  await Promise.all(toFetch.slice(0, MAX_FETCHES_PER_REQUEST).map(async (u) => {
    let img: string | null = null;
    try {
      const res = await fetch(u, {
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        headers: { "User-Agent": "Mozilla/5.0 (compatible; EcomtradaBot/1.0)" },
        redirect: "follow",
      });
      if (res.ok && (res.headers.get("content-type") ?? "").includes("html")) {
        img = extractImage(await res.text(), u);
      }
    } catch { /* cache the miss below */ }
    if (img) out.set(u, img);
    await prisma.pageImage.upsert({
      where: { accountId_url: { accountId, url: u } },
      create: { accountId, url: u, imageUrl: img },
      update: { imageUrl: img, fetchedAt: new Date() },
    }).catch(() => null);
  }));

  return out;
}
