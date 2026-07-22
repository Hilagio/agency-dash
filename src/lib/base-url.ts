/**
 * The canonical public origin for building absolute URLs (client share links,
 * Shopify Flow webhook URLs, OAuth redirects).
 *
 * Precedence lets the app move to a custom domain (e.g. https://ai.ecomtrada.nl)
 * by setting ONE env var, without touching code:
 *   1. NEXT_PUBLIC_BASE_URL / APP_BASE_URL — explicit canonical origin (set this
 *      to the custom domain once its DNS + Railway custom-domain are live).
 *   2. RAILWAY_PUBLIC_DOMAIN — Railway's auto-injected domain (the default today).
 *   3. the production Railway URL as a last-resort fallback.
 */
export function publicOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_BASE_URL || process.env.APP_BASE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const domain = process.env.RAILWAY_PUBLIC_DOMAIN;
  if (domain) return `https://${domain}`;
  return "https://agency-dash-production.up.railway.app";
}
