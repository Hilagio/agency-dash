/**
 * Google Shopping competitive scan via ScraperAPI's structured endpoint. For a
 * query we get the real Shopping SERP — which merchants rank, at what price, in
 * what position — so we can see how a client stacks up against competitors.
 * Key from the env (never hard-coded).
 */

export interface ShoppingRow {
  position: number;
  title: string;
  merchant: string;   // the seller ("source")
  price: string;      // as shown, e.g. "€ 100,00"
  priceValue: number | null;
  link: string | null;
  isYou: boolean;     // matched the highlight term (the client's shop/brand)
}

export interface ShoppingScan {
  query: string;
  tld: string;
  rows: ShoppingRow[];
  stats: { sellers: number; min: number | null; median: number | null; max: number | null };
  you: { position: number; priceValue: number | null; vsMedianPct: number | null } | null;
}

export async function fetchGoogleShopping(query: string, tld = "nl", highlight = ""): Promise<ShoppingScan> {
  const key = process.env.SCRAPERAPI_KEY;
  if (!key) throw new Error("Google Shopping needs a ScraperAPI key — add SCRAPERAPI_KEY on Railway.");

  const api = new URL("https://api.scraperapi.com/structured/google/shopping");
  api.searchParams.set("api_key", key);
  api.searchParams.set("query", query);
  api.searchParams.set("tld", tld); // country edition (nl, com, de, …) — 'country' is rejected here

  const res = await fetch(api.toString(), { signal: AbortSignal.timeout(70_000) });
  if (!res.ok) throw new Error(`Google Shopping fetch failed (${res.status}). Try again, or a different term.`);
  const j = await res.json() as { shopping_results?: Array<Record<string, unknown>>; message?: string };
  // ScraperAPI occasionally returns just a { message } (busy/soft rate-limit)
  // with no shopping_results key — that's transient, not "no results". Surface
  // it as a retryable error rather than silently reporting zero sellers.
  if (!Array.isArray(j.shopping_results) && j.message) {
    throw new Error(`Google Shopping is busy right now (${String(j.message).slice(0, 80)}). Try again in a moment.`);
  }

  const hl = highlight.trim().toLowerCase();
  const rows: ShoppingRow[] = (j.shopping_results ?? [])
    .map((r): ShoppingRow => {
      const merchant = String(r.source ?? "");
      const title = String(r.title ?? "");
      const priceValue = typeof r.extracted_price === "number" ? r.extracted_price : (Number(r.extracted_price) || null);
      const link = typeof r.product_link === "string" ? r.product_link : (typeof r.link === "string" && !String(r.link).includes("api.scraperapi.com") ? String(r.link) : null);
      const isYou = !!hl && (merchant.toLowerCase().includes(hl) || title.toLowerCase().includes(hl));
      return { position: Number(r.position) || 0, title, merchant, price: String(r.price ?? ""), priceValue, link, isYou };
    })
    .filter(r => r.title);

  const prices = rows.map(r => r.priceValue).filter((n): n is number => typeof n === "number" && n > 0).sort((a, b) => a - b);
  const median = prices.length ? prices[Math.floor((prices.length - 1) / 2)] : null;
  const stats = { sellers: rows.length, min: prices[0] ?? null, median, max: prices[prices.length - 1] ?? null };

  const mine = rows.filter(r => r.isYou).sort((a, b) => a.position - b.position)[0] ?? null;
  const you = mine
    ? { position: mine.position, priceValue: mine.priceValue, vsMedianPct: mine.priceValue && median ? Math.round(((mine.priceValue - median) / median) * 100) : null }
    : null;

  return { query, tld, rows, stats, you };
}
