# Shopify app submission pack — Ecomtrada AI

Everything needed to pass Shopify's **one-time** app review as a read-only analytics
app, so clients can then connect with a single "Install" click. Copy the blocks below
straight into the Dev Dashboard.

> **Key point:** you do **not** need the "Built for Shopify" badge (the 50-installs /
> 5-reviews / Core Web Vitals checklist). That's optional. You only need the basic
> app review. And after approval you can keep the listing **unpublished/unlisted** —
> approved but not shown in App Store search — and still install on clients via link.

---

## 1. Readiness — already done in code ✅

- OAuth install + callback with CSRF state nonce — `/api/shopify/install`, `/api/shopify/callback`
- Minimal read-only scopes — `read_orders,read_products` (no customer PII, no write scopes)
- All three mandatory GDPR compliance webhooks, HMAC-verified — `/api/shopify/webhooks`
  (`customers/data_request`, `customers/redact`, `shop/redact`)
- Public privacy policy — `/privacy`
- Clean uninstall: `shop/redact` deletes the store's data

## 2. App configuration (Dev Dashboard → your app → Configuration)

| Field | Value |
|---|---|
| App URL | `https://agency-dash-production.up.railway.app` |
| Allowed redirection URL | `https://agency-dash-production.up.railway.app/api/shopify/callback` |
| Privacy policy URL | `https://agency-dash-production.up.railway.app/privacy` |
| Scopes | `read_orders`, `read_products` |
| GDPR webhook endpoint (all three topics) | `https://agency-dash-production.up.railway.app/api/shopify/webhooks` |

## 3. Protected Customer Data request (the only real gate)

In **API access → Protected customer data**, request access and paste this reason.
Request **only the top level** ("Protected customer data") — do **NOT** tick any of the
customer-fields boxes (name, email, phone, address); we don't need them.

> Ecomtrada AI reads order-level data (order counts and total sales value per day) and
> product data to reconcile a merchant's real sales against their Google Ads conversion
> tracking, so our agency can advise them on ad performance. We do not access, store, or
> process customer personal fields (name, email, phone, address). Data is aggregated to
> daily totals, never sold or shared, transmitted over HTTPS, and deleted on uninstall.

Data-handling attestations to check: encryption in transit (HTTPS) ✅, encryption at rest ✅,
minimal retention ✅, staff access limited ✅.

## 4. App listing copy (used for review; keep the listing unpublished after)

**Name:** Ecomtrada AI

**Tagline (≤62 chars):** Reconcile real sales with your Google Ads performance

**Short description:**
> Ecomtrada AI connects your store's order data to your Google Ads results so your
> agency can see true, order-verified performance — not just ad-platform numbers.

**Long description:**
> Ecomtrada AI is a read-only analytics connection used by the Ecomtrada agency to
> advise merchants on their Google Ads. It pulls aggregate daily order counts, sales
> value, and product data, and compares them against Google Ads conversions to surface
> tracking gaps, wasted spend, and scaling opportunities. It never modifies your store
> and never accesses customer personal data.

**App category:** Store management → Analytics

## 5. Instructions for the reviewer (paste in the review submission)

> This is a read-only analytics app used by our agency to reconcile order totals against
> Google Ads performance. To test: from our app, open any account and click "Connect
> Shopify", which starts the standard OAuth install on the reviewer's test store. After
> approval, the app reads aggregate order counts, sales value, and product titles only.
> No customer personal data is accessed and the store is never modified. Uninstalling the
> app (or the shop/redact webhook) deletes the store's data. Test login for our app:
> [PROVIDE A TEST LOGIN — see §7].

## 6. Keep it unlisted after approval

After the app is **approved**, do **not** publish the App Store listing (or set it
unlisted). The app is fully installable via its install link while unpublished — your
clients get the one-click install without the app appearing in public search.

## 7. What you (Lennard) still need to provide

- [ ] **A test/demo Shopify store** the reviewer can use (a free dev store works), with a
      couple of test orders on it.
- [ ] **A test login to Ecomtrada AI** for the reviewer (a limited account), referenced in §5.
- [ ] **1–2 screenshots** of the app for the listing (any account's cockpit / diagnosis view).
- [ ] Confirm the **privacy policy** text at `/privacy` reads correctly for your entity
      (I drafted it — check the company details and contact email).
- [ ] The Railway env vars are set: `SHOPIFY_API_KEY`, `SHOPIFY_API_SECRET`,
      `SHOPIFY_SCOPES=read_orders,read_products` (matches the app's configured scopes).

## 8. Submit

Dev Dashboard → your app → **Distribution → Shopify App Store listing → Submit for review**.
Review is typically a couple of weeks. Use the CSV upload as the bridge until it's approved.
