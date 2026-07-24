# Improvements log

A running record of what changed, where, and why — judged against the prime
directive: **clean UI + seamless UX, everything simpler.** Newest first.

## 2026-07-24 (later 4) — Page audit: sees the photo, counts the images, rotates personas

Feedback: the audit claimed a product page had no images (it had plenty) and
based its verdict on that; and every run met the same personas.

- **Image facts, not guesses.** Both render paths now extract content images —
  including lazy-loaded Shopify galleries (`data-src`/`srcset`), with
  icons/logos filtered out — plus alt texts and the og:image. The dossier
  states "IMAGES: N content images detected" as fact, and the judges are
  explicitly forbidden to claim photos are missing or judge visuals they
  can't see. (Verified live: a page previously reported without images now
  reports 62.)
- **The personas SEE the product.** The page's hero/product photo is fetched
  (8s timeout, type/size-guarded) and attached as a real image to every
  persona judgement and the fix synthesis — visual reactions are now grounded
  in the actual photo instead of imagination.
- **Fresh eyes per run.** Three anchor archetypes stay fixed for score
  comparability (sceptic, price-first, in-a-hurry); the other three rotate
  from a pool of eight (gift buyer, deal hunter, careful 55+ reader,
  returning visitor, quality-first…). The intent-persona builder is told to
  vary names/ages/situations between runs. Same-y audits are gone by design.

## 2026-07-24 (later 3) — Lead generation as a business type

Some clients are lead-gen — added as a fourth onboarding chip ("Lead
generation" → `lead_gen`, which the CVR benchmarks and prompts already
understand). The setup checklist adapts: the "Connect order data" step
completes itself for lead-gen clients (no store, nothing to reconcile), and
the quiet auto-stamp for already-set-up accounts applies the same rule.

## 2026-07-24 (later 2) — The team workspace claims stray accounts

"Ik kan gewoon geen accounts importeren" — accounts that teammates imported
into their personal orgs before the team flow existed blocked the main
workspace's import (one Google Ads id = one account). The rule is now: **the
team workspace is authoritative**.

- Importing from the main workspace CLAIMS a stray account: it moves — with
  all its data (metrics, orders, briefings, everything keyed by accountId) —
  into the main workspace, reactivated, owner link cleared. New
  `lib/workspace.ts` (`mainWorkspaceId`, `claimAccount`).
- The Notion sync claims the same way when it runs for the main workspace.
- The reverse is refused: a personal org importing an account that lives in
  the team workspace gets "managed in the team workspace — request access
  there instead".
- Verified both directions end-to-end locally (claim moves the row + child
  data; steal attempt 409s).

## 2026-07-24 (later) — Team workspace with roles: request access, approve, switch

The domain auto-join wasn't enough (teammates log in with non-company emails)
— built the full flow the team needs:

- **Stray users get rescued in-app.** A cockpit banner tells anyone outside
  the team workspace: "This isn't the team workspace — Ecomtrada holds N
  client accounts" with **Request access** (or **Switch to team workspace**
  if already a member — one click, no sign-out dance; the session cookie is
  swapped in place).
- **Admins approve from the cockpit.** Pending requests show for OWNER/ADMIN
  with "Approve as teammate" / "Deny" (new `OrgJoinRequest`, migration
  `0041`). Approval grants the SPECIALIST role.
- **Roles mean something now**: adding accounts (MCC import) is OWNER/ADMIN
  only — enforced server-side (403) and the "+"/MCC-gap banner are hidden for
  specialists. Specialists see, manage and favorite everything else.
- End-to-end verified locally with a second user: request → approve →
  switch → team accounts visible as SPECIALIST → import correctly refused.

## 2026-07-24 — One agency, one workspace: teammates land in the team org

Live report: teammates couldn't import MCC accounts ("Nothing was imported")
and saw a cockpit with 2 accounts instead of 29. Root cause: every first login
went through /onboard and created a personal, empty organization — the team
was split across islands, and the cross-org guard (correctly) blocked imports
of accounts that already lived in Lennard's org. Fixed at the door:

- **Same company domain → same workspace.** On every login, a user with a
  private email domain (e.g. @ecomtrada.nl) is made a member of the biggest
  same-domain organization if they aren't already, and the session lands in
  whichever of their orgs holds the most accounts — never the accidental
  empty one. Stray personal orgs become harmless.
- **The importer tells the truth**: failed imports now show the per-account
  reason (e.g. "already exists in your team's main workspace — sign out and
  back in") instead of "Nothing was imported — try again."

For the team: sign out and back in once — you'll land in the shared
workspace with all accounts, and import works from there.

## 2026-07-23 (night 2) — MCC importer rebuilt in-house-style · client portal v4

- **MCC importer rebuilt** ("deze komt uit de oude versie"): new house-style
  modal — auto-loads the MCC list, search, tap-to-tick rows, "Select all new",
  bulk import with a small request pool. After import the cockpit expands the
  full list, switches to All, and kicks the first data pull for every account
  without data — imports now VISIBLY land instead of hiding as "unknown" in a
  collapsed section. Legacy raw Notion 404s stored in the old sync report are
  translated to the share-the-database instruction at read time too.
- **Client portal v4** (Luna feedback): "Bestellingen 0" next to €85k is gone —
  the tile shows real store orders only when Shopify has CURRENT data, else
  the conversions Google Ads measured (labelled "gemeten via Google Ads").
  Bestsellers get a fallback: when ads land on collections/root (no per-page
  product rows), the list is built from real Shopify sales (live or CSV) with
  "N verkocht". The revenue equivalent is now a visual (emoji row scaled to
  the count) with correct singular/plural ("1 elektrische auto", not "1
  elektrische auto's"). More air everywhere: wider container, bigger hero,
  roomier tiles/cards, taller trend chart.

## 2026-07-23 (night) — Stale done-ticks can't hide the cockpit; nightly runs un-broken

Live report: "nu zie ik mn stores niet meer in de cockpit" — all 27 flagged
accounts sat under "done today" because ticks from a previous day were never
cleared. Root causes, both fixed:

- **The nightly briefing/worklist runs were producing EMPTY output** (the
  audit's Tier-1 finding, now actually fixed): claude-sonnet-5 runs adaptive
  thinking by default and `max_tokens` caps thinking + output together — at
  200/900 tokens the thinking ate the whole budget. Both calls now pass
  `thinking: { type: "disabled" }` with roomier caps (400/1200). With the runs
  writing fresh actions again, done-flags clear nightly as designed.
- **"Done" is now day-scoped as a hard guarantee**: the API treats a done-mark
  from a previous Amsterdam calendar day as expired (`lib/diagnostics/done.ts`),
  so even if a nightly run fails, yesterday's ticks can never blank today's
  action list.

## 2026-07-23 (evening) — Google Ads MCC is the account source; Notion enriches

"Waarom haal je niet gewoon alle stores op uit Google Ads en dat wij ze dan
aanvinken?" — exactly. The MCC importer existed but was buried on the legacy
/stores page; it now opens from the cockpit's "+" button: load every account
in the MCC, search, tick the relevant ones (or Import all). Importing also
REVIVES an account that was deactivated by Notion or archived by hand, and can
never move an account between organizations. Notion becomes optional
enrichment (client name, Slack channel, budget) — the sync's adopt-by-customer-id
links a Notion store onto an MCC-imported account instead of duplicating it.

## 2026-07-23 (later still) — Stale Notion links: the actual missing-accounts case

Diagnosed live for Solution Clothing (332-700-5811) and Lydia Boutique: both
are PERFECT in the Notion Stores DB (Active, customer id filled, no
duplicates) — verified directly against the database. So the block is on our
side: an existing Account row holds the same Google Ads customer id but links
to a Notion page that no longer exists (a rebuilt/recreated Stores page gets a
new page id), and the unique-id check made the sync fail on those stores every
night, silently. The sync now recognises a STALE link (page id not present in
the current Stores DB) and re-links the account to the live page — same-run
duplicates still error loudly by name.

## 2026-07-23 (later) — Missing accounts explained & findable · cockpit search · business type · product segments

Feedback: "some of our key accounts are not in here, why not" + "why is there
no search option" + onboarding should ask dropshipper/branded/brand + "product
data should be segmented based on metrics":

- **Why accounts go missing — fixed and visible.** Accounts enter the system
  ONLY via the nightly Notion Stores sync, and three things silently swallowed
  them: (1) a store whose "Google Ads Customer ID" is empty in Notion was
  skipped with no trace — the skip report is now stored (migration `0039`) and
  shown as a cockpit banner naming each store and what to fill in; (2) a store
  whose customer id already existed on a manually-imported account hit a
  unique-constraint error forever — the sync now ADOPTS that account and links
  the Notion page onto it; (3) archived/Notion-inactive accounts were
  invisible — search now reveals them with the reason and a one-click "Bring
  back" for archived ones (Notion-inactive ones say exactly what to flip in
  Notion).
- **Search.** Search box on the cockpit — filters by account, client and
  owner, cuts across the My/All toggle (searching is about finding, not about
  what's pinned), auto-expands the full list, and includes hidden accounts. A
  no-match state explains how accounts enter the system.
- **Business type in onboarding.** The context step asks Dropshipper /
  Branded dropshipper / Brand (one tap, saved to `Account.businessModel`) —
  it steers the CVR benchmark the diagnostics judge against (new multipliers
  for `branded_dropship` 0.80 and `brand` 1.10) and flows into every agent
  prompt that reads the business model.
- **Products segmented by the metrics.** The Products table is no longer a
  flat list: rows group into **Draining spend** (spend without return, worst
  first) → **Winners** (returning well, biggest first) → **Selling, barely
  advertised** (real sales with almost no spend — untapped) → the rest
  (capped, "no clear verdict"). Same columns, same variant expansion — the
  triage is the table now.

## 2026-07-23 — Deeper Shopify · Products front-and-center · guided onboarding · verify-after-done

Feedback: "we are not getting enough information from Shopify even though we
can", the landing-pages tab is "scuffed" (no revenue, no sizes), context
questions repeat themselves, and ticking an action just crosses it out with no
check. All four addressed:

- **Shopify depth without the API.** The CSV upload now accepts THREE Shopify
  reports and recognises each file from its header (drop them all on one
  button): "Sales over time" (daily orders/revenue), **"Sales by product
  [variant]"** (per-product, per-size units & net sales → lights up the
  ads-vs-sold product join for every CSV account) and **"Sales by discount"**
  (new `DiscountDaily`, migration `0038`: which codes drive orders, what they
  give away). The Sidekick prompt in the connect modal asks for all three. The
  OAuth path pulls discount codes from the same orders query at no extra cost.
- **The agent sees it too.** `get_shopify_data` now reports discount-code
  performance (orders, revenue, amount given away, prior→recent movement) as
  neutral facts, and points at the product-variant CSV when per-product data
  is missing.
- **Products, not landing pages.** The "Products — what the ads did vs what
  actually sold" table (real revenue, variant/size split, catalog join) is now
  the FIRST evidence section with its own tab, and gained a **ROAS column
  computed from real revenue ÷ spend**. The landing-pages table is renamed
  "Product pages — the ads view", gains an "Ads revenue" column, and states
  plainly that its numbers are Google-attributed.
- **Context: 5 questions instead of 9.** Goal/KPI/target-ROAS merged into
  "What does success look like?"; ads-history/scaling/constraints merged into
  "History & constraints". Old answers fold into the merged fields on open
  (labelled) and the legacy columns are cleared on save so the agent is never
  fed the same fact twice. Completeness counts (x/5) migrate transparently.
- **Guided onboarding.** Un-set-up accounts get a 4-step checklist at the top
  of the account page: connect order data → answer the 5 questions → **run the
  tracking & consent check** (new endpoint scans the landing page for
  gtag/GTM, the AW- conversion tag, Consent Mode and CMPs — SSRF-guarded, and
  refuses to judge a bot-blocked page — plus Ads-vs-orders reconciliation) →
  run the first read. Accounts that are already fully set up are stamped
  quietly; "Skip setup" is always available.
- **A tick is a claim, not proof.** Marking an action done on the account page
  auto-sends a verification message to the agent ("verify whether it actually
  happened — keep flagging if not"); from the cockpit the claim is stored in
  agent memory so the next read verifies it. Done can no longer hide a live
  issue.

## 2026-07-22 — Cockpit: checkable action list · audit PDF/print + always-English

Feedback on the cockpit with 27 flagged accounts: "this is making me blind to
the problems — I don't want to read them." Reading is now optional; doing is
the interface:

- **Today's actions.** The flagged section is a checklist, not prose: one row
  per account — checkbox, status dot, name, the single next action (from the
  nightly worklist), ~minutes chip, "client" chip when the fix is off-platform,
  spend, and a chevron that expands the full briefing for the rare deep-read.
  Header totals the open items and estimated minutes; ticked rows collapse into
  a "✓ N done today" toggle; an all-ticked day shows a clean empty state.
- **Mark as complete, everywhere.** New `worklistDoneAt/worklistDoneBy` on
  `Account` (migration `0037`) + `POST /api/accounts/[id]/worklist-done`. The
  same checkbox sits on the account page's "Next:" line (strike-through when
  done). The nightly worklist run clears the flag whenever it writes a new
  action, so yesterday's tick never hides today's problem.
- **Audit report survives Save-as-PDF.** `renderAuditHtml` now emits a full
  HTML document with embedded print CSS: `print-color-adjust:exact` keeps the
  score ring, hero and chart bars from vanishing; `break-inside:avoid` stops
  cards splitting across pages; the KPI and persona `auto-fit` grids get fixed
  print columns (4 / 2) so the PDF aligns instead of collapsing to one column.
  Bar segments carry their labels inline ("6 hesitant") with a min-width so
  small segments stay readable.
- **Audits are always English.** All three audit prompts (persona builder,
  judge, fixes) now pin the output language to English regardless of the
  page's language (French sites were producing French reports); the page's own
  copy may still be quoted verbatim.

## 2026-07-22 — Client dashboard v3: revenue-led, real bestsellers, photos without Shopify

Feedback from the live Celiora link ("dit is gewoon een random lijst… revenue
staat er niet bij… foto's ontbreken… story is nietszeggend") — rebuilt in the
style of the client platform the team built before:

- **Revenue front and center.** New `adRevenue` (Google-Ads conversion value)
  in every window — every account has it, Shopify or not. The page now leads
  with a hero banner ("€12.031 omzet uit €5.075 aan advertenties — dat is 2,4×
  terug"), friendly KPI tiles (Verdiend / Rendement / Geïnvesteerd / Bestellingen)
  and a plain-language summary sentence. Tiered honest headline (uitstekend /
  goed / neutraal) — no fake celebration on a weak period.
- **Bestsellers, not an inventory dump.** Top **5** by revenue *generated*,
  homepage/root pages and zero-conversion rows excluded, value shown big per
  product (ROAS demoted to the sub-line).
- **Photos without Shopify.** New `PageImage` cache (migration `0036`) +
  `src/lib/page-image.ts`: the product page's own `og:image` is fetched
  server-side (SSRF-guarded, 4s timeout, ≤5 per request, weekly cache) when the
  Shopify catalog has no image. Coloured-initial tile stays as last fallback.
- **Story card fixed + revenue-led.** Bug: accounts without Shopify showed the
  *ad spend* labelled as conversion value (spend fallback) — now uses
  `adRevenue`. The card leads with revenue, then return, spend, the #1
  bestseller (name + value), and the playful equivalent. Hero font auto-scales
  so long amounts fit.
- Fixed light palette for the share page (client deliverable — always the same
  look, independent of the app theme).

## 2026-07-21 — Client dashboard v2: photos, gamification, shareable story

Made the client share page feel alive and postable (vs. a plain table):

- **Product photos** in the top-products list — `imageUrl` on `Product`
  (migration `0035`) + `featuredImage` pulled in the catalog sync; matched to
  landing-page products by title, with a coloured-initial tile fallback when no
  image (or the image fails to load).
- **Gamification** — period-over-period deltas (`deltas` in `/api/share`) shown
  as ▲/▼ badges on revenue and orders/conversions ("▲210% vs. previous period").
- **Playful revenue equivalent** — "with this revenue you could've bought
  4 scooters 😄" (a fanciness-scaled tangible; NL/EN).
- **Downloadable Instagram-story card** — a "Deel als story" button renders a
  1080×1920 pure-SVG card (ROAS hero, revenue, the equivalent, spend/orders) and
  exports it to PNG client-side (no library, no cross-origin taint) — ready to
  post straight to a story.

Deferred (data-sensitive, needs care): a "better than X% of comparable stores"
percentile — it touches other clients' data, so it gets its own anonymised pass.

## 2026-07-21 — Client-facing share dashboard (read-only, per-account link)

A public, read-only performance page a specialist can share with a client —
the Google Ads analogue of a social-media client dashboard.

- **`/share/[token]`** — a clean, Dutch, Ecomtrada-branded page: period filter
  (7/30/90d), KPI tiles (advertentiekosten, omzet, ROAS, bestellingen, POAS), a
  spend-vs-omzet trend, and a best-products table. Deliberately NOT the internal
  diagnosis — no problems, hypotheses, or agency jargon; a calm performance
  overview only. `noindex`.
- **`/api/share/[token]`** — public but token-gated; returns ONLY curated
  client-safe metrics for the one account (never notes, signals, diagnosis, or
  any other account). Rejects malformed tokens without a DB hit.
- **`shareToken` on Account** (migration `0033`, additive/idempotent) — a 256-bit
  unguessable per-account token, minted on demand.
- **`/api/accounts/[id]/share-link`** (authed, org-scoped) — mint/rotate the link.
- **Diagnose page** — a "Client link" button copies the share URL.
- **proxy.ts** — `/share` + `/api/share` added to the public allowlist.

**Per-link language (NL/EN, chosen at creation).** `shareLang` on Account
(migration `0034`), set via `?lang=` on the share-link endpoint and picked with
a small NL/EN chooser on the "Client link" button. The public page is fully
bilingual; the internal app stays English.

**Custom-domain ready.** New `publicOrigin()` helper (`src/lib/base-url.ts`)
resolves the canonical origin, preferring `NEXT_PUBLIC_BASE_URL` / `APP_BASE_URL`
over `RAILWAY_PUBLIC_DOMAIN`. Share links now build from it, so pointing the app
at a custom domain (e.g. `https://ai.ecomtrada.nl`) is one env var — no code
change. (DNS + Railway custom-domain + Google OAuth redirect URIs are the
human-side steps.)

## 2026-07-20 — Funnel is data, not a tool; tools state numbers, agent reasons

Two changes aligning with the app's design: the agent is an autonomous analyst,
so tools should surface neutral data and the *analysis* is the reasoning.

- **`get_shopify_data` — stripped the interpretive verdicts.** It no longer says
  "basket size is shrinking, look at discounting" or "suspect a tracking break";
  it returns the numbers and deltas only ("AOV €45 vs €60 (down 25%)", "Ads 33%
  below orders"). The agent interprets. Deterministic aggregation stays in the
  tool (LLMs miscount rows); the conclusions move to the model.
- **Conversion funnel is now part of the account data the agent reads — not a
  tool it must call.** `fetchConversionFunnel` (`google-ads.ts`) pulls the
  account's conversion actions segmented by category (PURCHASE plus
  micro-conversions like ADD_TO_CART / BEGIN_CHECKOUT where configured),
  recent-15d vs prior-15d, via `all_conversions`. The insight route injects it
  into the LIVE SNAPSHOT block, so "where paid traffic drops off between cart and
  checkout" is simply in front of the agent to reason over. Best-effort
  (9s timeout, dropped silently if slow or if only a purchase action exists) — it
  never blocks the read. No bespoke funnel tool.

Note: the live Google Ads query couldn't be exercised in the dev sandbox (no Ads
credentials there); it typechecks, builds, and is fully guarded, but the GAQL
should be watched on its first real run.

## 2026-07-20 — Shopify context: AOV-drop + per-product movement

Extends `get_shopify_data` (`src/lib/diagnostics/agent-tools.ts`) beyond
"is tracking broken" so the agent can answer more of the questions a specialist
actually asks — all from data already stored, no schema change:

- **AOV drop as its own signal.** The recent-vs-prior trend now includes AOV
  ("AOV €45 vs €60, down 25% — basket size is shrinking, look at discounting /
  product mix"), so a shrinking-basket problem is caught even when order count
  holds.
- **Per-product movement.** Where per-product sales exist, the tool names the
  top sellers, which products are **falling** (€2,520→€420), which are **rising**,
  and which are **newly emerging** (no prior sales) — so "what's selling", "where's
  the drop", and "what's coming up" are answerable in one pull.
- **Honest availability.** Per-product needs a live Shopify connection; the "Sales
  over time" CSV is order totals only, and the tool now says exactly that instead
  of silently omitting products.

Still a genuine gap (needs new ingestion + a product decision): the
**add-to-cart → begin-checkout → purchase funnel rate**. No path ingests
behavioral funnel events today. The best fit for a PPC tool is the ad-side funnel
from Google Ads micro-conversion actions (`add_to_cart` / `begin_checkout`),
which would be a new Google Ads pull rather than Shopify. Deferred pending that
decision.

## 2026-07-20 — Trustworthy reconciliation check + richer Shopify context

Found by driving the app end-to-end as a specialist (seeded a realistically
flagged account, rendered the diagnose page in a browser).

- **`src/lib/diagnostics/engine.ts` — "What I already checked" contradicted the
  numbers.** `buildChecks` declared "Ads conversions reconcile with orders
  within tolerance — tracking looks intact" whenever a `reconciliation` object
  was present and no upstream `conversions_vs_orders` signal had fired — even
  when the account showed 3 Ads conversions against 48 real orders (a 94% gap)
  right above it. It now computes the delta from `reconciliation` itself and
  flags the check with the actual gap ("Ads counted 3 conversions against 48
  real orders (94% gap)…") when it exceeds tolerance, only claiming "intact"
  when the numbers really are close.
- **`src/lib/diagnostics/agent-tools.ts` — `get_shopify_data` gave the agent a
  flat lump sum.** It returned only total orders, total revenue, and top
  sellers. For the flagship "did sales really drop, or is only tracking broken?"
  question it now also returns: **AOV**, a **recent-vs-prior order trend** (last
  N/2 days vs the prior N/2 — "14 vs 63 orders, down 78%"), and a **direct
  Ads-vs-Shopify reconciliation line** for the same window ("Google Ads counted
  3 conversions vs 48 real orders — a 94% shortfall → suspect a tracking break,
  not a demand drop"). All derived from data already stored (`OrderDaily`,
  `MetricDaily`) — no schema change. Also flags when the shop's order currency
  differs from the Ads account currency.
- **`/diagnose/[id]` — dev-facing empty state.** The Shopify order-feed card told
  specialists to "Add `SHOPIFY_API_KEY` … on Railway"; it now points them to the
  CSV-upload flow ("same real orders & POAS") instead.

**Why simpler:** the read stops contradicting itself, and the AI gets the trend
+ reconciliation that actually answer the most common flagged case — so the
specialist reaches the right conclusion faster.

## 2026-07-20 — One-tap "Ask AI" on the evidence sections

**What:** On `/diagnose/[id]`, the four data-heavy evidence sections
(across-windows trend, underperforming products, landing pages, by-product
breakdown) now carry a quiet "Ask AI" chip next to their titles. One tap
scrolls to the Ecomtrada AI conversation and sends a targeted question about
that section ("where is spend going to pages that don't convert?"), reusing
the existing chat stream — no new surface, no typing.

Also fixed: the attachment-size error said "max 8 MB" while the actual cap is
5 MB, and a stale comment claimed a 6-file cap (it's 4).

**Why simpler:** asking the AI becomes the fastest path through every table —
the assistant is the front door, not a side panel (master-prompt objective 3).

## 2026-07-20 — Shopping compare grounded in the real Shopify catalog

**What:** The ingested Shopify product catalog (previously write-only — synced
but never read) now powers the per-product Google Shopping compare.

- `prisma/schema.prisma` + migration `0032_product_catalog_enrichment`:
  `Product` gains `barcode` (GTIN/EAN), `vendor`, and `url` (public product
  page). Additive + idempotent.
- `src/lib/integrations/shopify.ts`: the catalog sync now pulls handle, vendor,
  `onlineStoreUrl` and the first variant's barcode; the stored `url` prefers
  `onlineStoreUrl` (respects custom domains).
- `src/lib/diagnostics/products.ts`: new pure `attachCatalog()` joins catalog
  rows onto product groups — by real id (`pid:` ↔ Shopify GID) first, then
  normalised title. Covered in `products.test.ts`.
- `/api/diagnostics/account/[id]`: product groups now carry
  `catalog { price, gtin, url, vendor }`, and the Shopify block exposes
  `shopName` (derived from the shop domain).
- `/diagnose/[id]` → Shopping compare: "Your product" now shows the **exact
  store price** (labelled "store price") instead of an average of revenue ÷
  units (still the honest fallback, labelled "avg sold"), plus the GTIN and a
  link to the client's own product page. The "your shop" highlight is
  pre-seeded from the connected Shopify domain, so the client's own listing is
  spotted without typing.
- `src/lib/integrations/scraperapi-shopping.ts`: self-listing match now
  compares alphanumerics only, so "Cherie Boutique", "cherie-boutique" and
  "cherieboutique.nl" all count as the same shop.
- Agent tool `get_shopping_competitors`: auto-derives the highlight from the
  connected store when none is given, and cites the client's own catalog
  listing (exact price + GTIN, and vs-median) even when the scrape doesn't
  surface their shop.

**Why simpler:** the specialist no longer reasons from a proxy number or types
the shop name by hand — one click on a product shows the real listing against
the market. (Addresses master-prompt objectives 5 and 7.)

**Follow-up still required (external):** the Merchant API price-competitiveness
benchmark stays blocked until GCP project `ecomtrada-webapp` is registered in
Merchant Center (one-time Google-side action). Catalog data appears for an
account after its next Shopify sync (nightly, or "Sync orders" on the account).
