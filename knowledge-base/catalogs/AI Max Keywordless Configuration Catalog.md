# AI Max Keywordless Configuration Catalog
Created: 2026-06-04
Updated: 2026-07-13

Support_ID: CATALOG_17
Status: Done
Category: Structure
Reference Type: Catalog
Agent_Readable: Yes
Human_Facing: Yes
Applies_To: Search, AI Max
Schema_Version: CAT_v2
Domain: Search
Pillar: 6

## Purpose

Lists the configurations for serving keywordlessly or steering landing-page selection in AI Max for Search, built from two levers (final URL expansion on or off, and where URL inclusions live) plus campaign structure. Each configuration is given with what serves, pros, cons, when to use it, when to avoid it, and an example.

---

## What this catalog is / What this is NOT

**This catalog:**

- Lists the viable AI Max keywordless and landing-page configurations
- Gives the pros, cons, and choose/avoid conditions for each
- Provides a concrete example per configuration

**This catalog does NOT:**

- Explain the conceptual framework for choosing (See: [AI Max for Search Mental Model](../mental-models/AI Max for Search Mental Model.md))
- Document the underlying mechanics, toggles, and dependencies (See: [AI Max for Search Reference](../references/AI Max for Search Reference.md))
- Provide inclusion, exclusion, and page-feed syntax (See: [Final URL Expansion & Page Feed Reference](<../references/Final URL Expansion & Page Feed Reference.md>))
- Provide step-by-step setup (See: [SOP – Configure AI Max for Search](<../sops/SOP – Configure AI Max for Search.md>))

---

## Configuration fundamentals

These constraints decide which configurations are possible and how they have to be structured.
| Constraint | Consequence |
|------------|-------------|
| Text customization is required to add URL inclusions (and for final URL expansion) | Any campaign that uses inclusions has text customization on |
| Search term matching is required for URL inclusions to serve | URL inclusions (dynamic ad targets) only activate when search term matching is on for the ad group. With it off, they stay "Eligible, Pending" and never serve |
| Text customization is a campaign-level setting | It applies to every ad group in that campaign. Inclusions cannot coexist with hand-controlled, text-customization-off RSAs in the same campaign |
| Final URL expansion is a campaign-level switch | On means open discovery for every ad group. Off means no dynamic page swap. It cannot be on for some ad groups and off for others in one campaign |
| Pinned RSA assets break when expansion is on, or when an inclusion routes to a different URL | If pins must hold, you need expansion off and no inclusion-driven URL swap |
| Text customization on requires text guidelines before launch | A campaign with text customization on and no text guidelines (up to 25 term exclusions, up to 40 messaging restrictions) is not launch-ready |
| Text customization on puts the campaign on the AI Max auto-upgrade path | Google auto-upgrades campaigns with text customization on to AI Max on its announced schedule. A configuration that forces text customization on is a deliberate opt-in to that upgrade |

> ⚠️ **Default stance: text customization stays off.** It turns on only when the configuration requires it (URL inclusions and final URL expansion force it on) or when it is deliberately chosen for reach. When a configuration turns it on, the launch rule applies: configure text guidelines before launch. Guidelines can be copied from an existing campaign (replace or add to existing) and messaging restrictions can define a tone of voice to adhere to, or one to avoid.

> 💡 **URL inclusions depend on search term matching, they do not self-target.** Unlike a legacy Dynamic Search Ads target, a URL inclusion does not match queries on its own. Search term matching's keywordless arm matches queries to your pages, and the inclusion only scopes which pages are eligible. So search term matching must be on for the ad group. With it off, the dynamic ad targets stay "Eligible, Pending" and never serve. This applies to keywordless ad groups (A1, A2) and to inclusions added to keyword ad groups (A3).

---

## Decision gate: the two axes

Two axes decide the configuration. The first controls reach, the second controls structure and reporting.
| Axis | Options | What it controls |
|------|---------|------------------|
| Final URL expansion | Off (scoped to your URLs) or On (open discovery) | How far Google can roam for landing pages |
| Where inclusions live | Existing keyword ad group, dedicated keywordless ad group, or separate campaign | Theme cleanliness, reporting, and whether text customization touches your keyword ad groups |

→ For the conceptual framing behind these axes: See [AI Max for Search Mental Model](../mental-models/AI Max for Search Mental Model.md)
→ For inclusion, exclusion, and page-feed syntax: See [Final URL Expansion & Page Feed Reference](<../references/Final URL Expansion & Page Feed Reference.md>)

> 💡 **Text customization is a forcing constraint, not the only reason to split.** Because text customization is campaign-level and mandatory for inclusions, wanting hand-controlled RSAs (text customization off) on your keyword ad groups forces keywordless inclusions into a separate campaign (A2 or B3) regardless of anything else. That sits on top of the usual campaign-segmentation drivers: a separate keywordless campaign also earns its own existence when it needs a different budget, bid strategy, target, or conversion goal (keywordless economics and conversion rates often differ from your keyword campaigns). See [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md) for the full segment-versus-consolidate decision.

---

## Configurations at a glance

| # | Configuration | Final URL expansion | Inclusions location | Structure |
|---|---------------|---------------------|---------------------|-----------|
| A1 | Dedicated keywordless ad group in the keyword campaign | Off | Keywordless ad group | Single campaign |
| A2 | Separate standalone keywordless campaign | Off | Keywordless ad group | Separate campaign |
| A3 | Inclusions on existing keyword ad groups | Off | Keyword ad group | Single campaign |
| B1 | Open discovery, no inclusions | On | None | Single campaign |
| B2 | Steered discovery on keyword ad groups | On | Keyword ad group | Single campaign |
| B3 | Separate discovery campaign | On | Keywordless ad group or page feed | Separate campaign |
| C1 | Keyword-only baseline | Off | None | Single campaign |

> 💡 **Page feeds are a scoping mechanism, not a configuration.** Inclusions can be defined as URL rules or as page-feed custom labels. A page feed with custom labels (stock, margin, brand) scopes any configuration that uses inclusions at catalog scale, most naturally A2 and B3.

---

## Family A: final URL expansion off (scoped, DSA-style)

In every Family A setup, keyword ad groups keep serving on their keywords with fixed final URLs (no page swap). Keywordless serving is contained to the URLs you name. This is the closest equivalent to the old Dynamic Search Ads model.

### A1: dedicated keywordless ad group in the keyword campaign

Keyword ad groups serve on keywords to fixed URLs. One keywordless ad group (no keywords, URL inclusions only, search term matching on) serves on exactly its inclusion URLs.
| Pros | Cons |
|------|------|
| One campaign, shared budget, negatives, and bidding signals | Text customization is forced on for the whole campaign, so keyword RSAs also receive generated assets |
| Mirrors the old "DSA ad group inside a Search campaign" pattern | Keyword and keywordless performance share one campaign's reporting |
| Least campaign proliferation | |

| Use when | Avoid when |
|----------|-----------|
| You are comfortable with text customization on your keyword ad groups | You want hand-controlled RSAs (text customization off) on keyword ad groups: impossible here, use A2 |
| You want keywordless coverage without managing another campaign | You need clean keyword-versus-keywordless reporting |

**Example (Lead Gen):** A "Services" search campaign with keyword ad groups per service, plus one keywordless ad group with URL inclusions on `/services/*` to catch long-tail service queries Google maps to those pages.

### A2: separate standalone keywordless campaign

Keyword campaigns stay untouched with text customization off and fixed RSAs. A separate campaign carries the keywordless inclusions with text customization on, search term matching on, and final URL expansion off.
| Pros | Cons |
|------|------|
| Full isolation: keyword ad groups are unchanged | More campaigns to manage |
| Independent budget and target for keywordless | Budget fragmentation |
| Clean reporting, the exact analogue of a standalone DSA campaign | Cross-campaign query overlap to watch |

| Use when | Avoid when |
|----------|-----------|
| You want full manual RSA control on keyword ad groups | The account is small or budget-constrained and a second campaign would starve learning |
| You need a different budget, bid strategy, target, or conversion goal for keywordless, or clean attribution (the normal reasons to segment a campaign) | |
| This is the cleanest option for most structured accounts | |

**Example (Ecommerce):** A "Keywordless - Categories" campaign, text customization on, final URL expansion off, one ad group per category with URL inclusions on that category path (`/collections/dining-tables`). Keyword and Shopping campaigns keep text customization off.

### A3: inclusions on existing keyword ad groups

The same ad group serves both ways, but only with search term matching on: keyword matches go to the fixed URL, plus keywordless coverage scoped to the inclusion URLs.
> ⚠️ **The inclusion coverage requires search term matching on.** With search term matching on, the ad group serves both ways. With it off, the dynamic ad targets stay "Eligible, Pending" and only the keywords serve.

| Pros | Cons |
|------|------|
| Zero restructuring, bolts scoped keywordless reach onto current ad groups | Blends two matching mechanisms in one ad group, muddying attribution |
| | Risks theme drift if inclusion pages do not match the keyword theme |
| | Text customization forced on. The messiest of the three |

| Use when | Avoid when |
|----------|-----------|
| You want a fast, low-effort scoped-coverage add | You value tight ad-group theming or clean attribution: use A1 or A2 |
| Reporting cleanliness is not a concern | |

**Example:** Adding a URL inclusion on `/guides/*` to an existing broad-match "resume tips" ad group to extend coverage to guide pages, accepting blended reporting.

> 💡 **Legacy DSA did not let you mix keywords and dynamic targets in one ad group.** A3 is newly possible, but the old separation instinct still holds: isolating keywordless coverage in its own ad group or campaign is almost always cleaner.

---

## Family B: final URL expansion on (open discovery)

Expansion applies across the whole campaign. Inclusions can steer it, but they cannot contain it: an ad group with inclusions still receives your URLs plus anything else Google judges relevant.

### B1: open discovery, no inclusions

Any indexed page Google judges relevant (minus URL exclusions) can serve, across all ad groups.
| Pros | Cons |
|------|------|
| Maximum reach and page discovery | Least control, ads can land on any page |
| Least setup | Pinning breaks, text customization forced on |

| Use when | Avoid when |
|----------|-----------|
| Your pages are uniformly high quality | Page quality is uneven |
| You want Google to find pages you did not map | You need control over which pages advertise |

**Example:** A search campaign with final URL expansion on and URL exclusions for `/cart`, `/account`, `/login`, letting Google route each query to its best-matched product or category page.

### B2: steered discovery on keyword ad groups

Inclusions bias each ad group toward your intended pages, but expansion still serves other relevant pages too.
| Pros | Cons |
|------|------|
| Biases themed ad groups toward known-good pages | Not containment: still expands beyond your set |
| Keeps discovery on while nudging relevance | Pinning still breaks |

| Use when | Avoid when |
|----------|-----------|
| You want discovery with a thumb on the scale per ad group | You actually want only your URLs: that is Family A |

**Example:** A "Dining furniture" ad group with final URL expansion on and a URL inclusion on `/collections/dining-tables`, so dining queries lean to that page but related pages can still serve.

### B3: separate discovery campaign

The standalone-campaign structure of A2 but with discovery on. A dedicated prospecting campaign kept apart from keyword campaigns.
| Pros | Cons |
|------|------|
| Isolates discovery from keyword campaigns | Same overlap-management caveats as A2 |
| Independent budget for prospecting | Budget fragmentation |

| Use when | Avoid when |
|----------|-----------|
| You want Google to find new pages, isolated from keywords | You want containment to a named set: use A2 |

**Example:** A "Discovery" campaign, final URL expansion on, broad URL inclusions across your main content hubs, funded as a separate prospecting budget.

### Page feeds: catalog-scale scoping for any configuration

A page feed with custom labels defines the URL set as data instead of hand-entered rules. Inclusions then target labels, and the feed refreshes on a schedule.
| Pros | Cons |
|------|------|
| Catalog-scale page control (stock, margin, brand filtering) | Feed setup and maintenance (hosting, refresh cadence) |
| Scheduled refresh keeps the eligible set current | |

| Use when | Avoid when |
|----------|-----------|
| Ecommerce or high-SKU accounts needing catalog-scale page control (in A2 or B3) | Small catalogs where hand-entered URL inclusions are enough |

**Example:** An ecommerce page feed of in-stock product URLs labeled by category and margin tier, with ad groups targeting `high_margin` labels, used to scope an A2 keywordless campaign (expansion off) or a B3 discovery campaign (expansion on within the feed).

---

## Family C: baseline

### C1: keyword-only control

AI Max is off. Every ad group serves on its keywords with fixed URLs, and there are no inclusions. This is the starting point the escalating test sequence measures every configuration above against, see [SOP – Configure AI Max for Search](<../sops/SOP – Configure AI Max for Search.md>).
| Use when | Avoid when |
|----------|-----------|
| You want a measurement baseline to test every setup above against | You have proven keywordless coverage adds incremental value |

**Example:** Your existing keyword campaign before adding any inclusions, used as the control arm when measuring a keywordless test.

---

## Configuration selection by goal

| Goal | Configuration |
|------|---------------|
| Keep hand-controlled RSAs (text customization off) on keyword ad groups | A2 (the only option that allows it) |
| Scoped keywordless, comfortable with text customization everywhere, one campaign | A1 |
| Maximum reach on a high-quality site | B1, plus URL exclusions |
| Catalog-scale page control (stock, margin, brand) | Page-feed labels, used in A2 or B3 |
| Dedicated discovery or prospecting, isolated from keywords | B3 |
| Quick scoped add, reporting cleanliness not a concern | A3 (validate first) |
| Measurement baseline | C1 |

> 💡 **The cleanest, most defensible setup is A2 (a contained DSA replacement with full keyword control), scoped with page-feed labels at catalog scale.** A3 and putting inclusions on keyword ad groups under expansion are where accounts tend to create messes.

---

## Common mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Expecting inclusions to contain expansion when final URL expansion is on | Ads still serve beyond your set (B2) | Turn final URL expansion off for containment (Family A) |
| Mixing keywordless inclusions into a keyword campaign to keep RSAs hand-controlled | Text customization is forced on the whole campaign | Use a separate campaign (A2) |
| Putting inclusions on keyword ad groups for clean keywordless coverage | Blended matching, muddy attribution (A3) | Isolate keywordless in its own ad group (A1) or campaign (A2) |
| Running a keywordless ad group with search term matching off | Dynamic ad targets stay "Eligible, Pending" and never serve | Keep search term matching on for every ad group that uses URL inclusions |
| Final URL expansion on with no URL exclusions | Ads land on cart, login, and utility pages | Add campaign URL exclusions for all utility pages |
| Trying to run open discovery and a contained set in one campaign | The campaign-level switch cannot do both | Use two campaigns (one Family B, one Family A) |

---

## Related documents

| Document | Relationship |
|----------|-------------|
| [AI Max for Search Mental Model](../mental-models/AI Max for Search Mental Model.md) | Upstream (conceptual framework, the two axes, when to choose) |
| [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md) | Upstream (segment-versus-consolidate decision: budget, bid strategy, targets, goals) |
| [AI Max for Search Reference](../references/AI Max for Search Reference.md) | Upstream (toggles, dependencies, behavior tables) |
| [Final URL Expansion & Page Feed Reference](<../references/Final URL Expansion & Page Feed Reference.md>) | Upstream (inclusion, exclusion, and page-feed syntax) |
| [SOP – Configure AI Max for Search](<../sops/SOP – Configure AI Max for Search.md>) | Execution (sets up the chosen configuration) |

---

## Version details

- **Version:** 5.0
- **Last Updated:** July 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
