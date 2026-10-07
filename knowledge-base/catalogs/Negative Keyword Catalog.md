# Negative Keyword Catalog
Created: 2026-02-04

Support_ID: CATALOG_13
Status: Done
Category: Targeting
Reference Type: Catalog
Agent_Readable: Yes
Human_Facing: Yes
Domain: Search
Pillar: 7

### Purpose

This catalog lists reusable **negative keyword patterns** organized by category and vertical, used to prevent wasted spend on irrelevant, low-intent, or misaligned search traffic.

It covers the three required list types (irrelevant, poor-performing, branded) plus vertical-specific patterns and final URL expansion page exclusions.

---

### What this is / What this is NOT

**This catalog:**

- Lists negative keyword examples by category and vertical
- Provides recommended match types for each pattern
- Includes final URL expansion page exclusion patterns
- Explains why each category prevents waste

**This catalog does NOT:**

- Explain negative keyword mechanics, match type behavior, or conflict resolution (see: [Negative Keyword Reference](../references/Negative Keyword Reference.md))
- Provide step-by-step execution for adding negatives (belongs to SOPs)
- Teach search term report analysis (see: [Search Term Report Reference](../references/Search Term Report Reference.md))
- Define match type rules or syntax (see: [Match Type Reference](../references/Match Type Reference.md))

---

## Negative keyword list structure

Every account carries at least three negative keyword lists. Larger accounts segment further.

### Required lists (minimum)

| List | Scope | Linked to |
| --- | --- | --- |
| Irrelevant keywords | Terms that never convert for your business | All campaigns |
| Poor-performing keywords/ngrams | Terms with data proving poor performance | All campaigns |
| Branded keywords | Your own brand terms | Non-brand campaigns only |

### Optional lists (recommended at scale)

| List | Scope | Linked to |
| --- | --- | --- |
| Competitor brands | Named competitors you do not want to bid on | All campaigns (unless running competitor campaigns) |
| Specific brands not sold | Brands in your category you do not carry | Shopping and Search campaigns |
| Spam prevention | Explicit, fraudulent, or nonsense terms | All campaigns |
| URL exclusions | Page-level exclusions for final URL expansion | Campaigns with final URL expansion only |

> 💡 **Use shared negative keyword lists:** Account-level shared lists apply changes to all linked campaigns at once. Never add the same negative to individual campaigns one by one.

---

## Match type defaults for negatives

Each pattern in this catalog carries a recommended match type. The choice follows from what the pattern has to cover.

| Match type | Reach for it when |
| --- | --- |
| Negative broad (default) | Single-word blockers or any-order multi-word blockers |
| Negative phrase | Specific ngram sequences where word order carries the bad intent |
| Negative exact | One precise query that must not affect related terms |

> ⚠️ **Negative broad is the default:** Phrase covers multi-word ngrams where word order matters. Exact applies only where broad or phrase would over-block. Blocking behavior per match type is defined in [Negative Keyword Reference](../references/Negative Keyword Reference.md).

> ↪️ For full match type mechanics and conflict resolution rules, see [Negative Keyword Reference](../references/Negative Keyword Reference.md).

---

## Lead Gen negatives (by category)

> ⚠️ **No universal negatives:** Every account is unique. Adding default or "universal" negative keyword lists without checking them against your specific business can block relevant traffic and shoot yourself in the foot. Always build negative keyword lists from your own search term report data and keyword research. The vertical-specific patterns below are starting points for evaluation, not ready-to-apply lists.

### Service-type exclusions

| Negative | Match type | Why it works |
| --- | --- | --- |
| `volunteer` | Broad | Non-paid engagement, no commercial value |
| `pro bono` | Broad | Seeking free services |
| `nonprofit` | Broad | Often seeking donated services (unless you serve nonprofits) |
| `government grant` | Broad | Seeking funding, not purchasing services |
| `"do it yourself"` | Phrase | Self-service intent, not hiring a professional |

### Education/certification terms

| Negative | Match type | Why it works |
| --- | --- | --- |
| `certification` | Broad | Seeking credentials, not hiring a service provider |
| `course` | Broad | Learning intent, not buying a service |
| `degree` | Broad | Academic program search |
| `training` | Broad | Self-improvement, not purchase intent |
| `exam` | Broad | Testing/credential context |

### Wrong buyer stage

| Negative | Match type | Why it works |
| --- | --- | --- |
| `sample` | Broad | Seeking free examples, not committing to a service |
| `example` | Broad | Research phase, low conversion probability |
| `case study` | Broad | Research/learning intent (unless your funnel targets this) |
| `comparison` | Broad | Early-stage research, low immediate conversion |
| `vs` | Broad | Comparison shopping, often not ready to buy |

> 💡 **Lead Gen nuance:** Terms like "comparison" and "case study" can be legitimate for top-of-funnel lead gen. Only add these as negatives if your campaigns target bottom-of-funnel intent exclusively.

---

## SaaS negatives (by category)

### Integration/compatibility terms

| Negative | Match type | Why it works |
| --- | --- | --- |
| `plugin` | Broad | Seeking add-ons, not a standalone product |
| `extension` | Broad | Browser extension intent, not SaaS purchase |
| `api` | Broad | Developer research, not end-user purchase (unless you sell API access) |
| `github` | Broad | Open-source developer intent |
| `script` | Broad | DIY automation, not looking for a paid tool |

### Pricing research terms

| Negative | Match type | Why it works |
| --- | --- | --- |
| `pricing` | Broad | Often just comparison research with no purchase intent |
| `cost` | Broad | Similar to pricing: early-stage, low-converting |
| `"how much"` | Phrase | Price-only research without commitment signals |
| `discount code` | Broad | Seeking existing customer promotions, low new-customer value |
| `lifetime deal` | Broad | Bargain-hunter segment, often low LTV |

> ⚠️ **"Pricing" and "cost" are controversial:** Some SaaS companies convert well on pricing queries. Check your search term report data before adding these. If your pricing page converts, keep these terms active.

### Wrong product category

| Negative | Match type | Why it works |
| --- | --- | --- |
| `excel` | Broad | Seeking spreadsheet solutions, not SaaS (unless your tool replaces Excel) |
| `spreadsheet` | Broad | Same as Excel: manual tool preference |
| `"google sheets"` | Phrase | Free alternative preference |
| `wordpress` | Broad | CMS-specific search, not SaaS (unless you integrate with WordPress) |
| `self-hosted` | Broad | Seeking on-premise, not cloud SaaS |

---

## Ecommerce negatives (by category)

### Used/secondhand terms

| Negative | Match type | Why it works |
| --- | --- | --- |
| `used` | Broad | Seeking secondhand, not new products |
| `refurbished` | Broad | Seeking discounted pre-owned items |
| `secondhand` | Broad | Same as used: pre-owned intent |
| `"for sale by owner"` | Phrase | Peer-to-peer sale, not retail |
| `vintage` | Broad | Antique/retro intent, not new product purchase |

> ⚠️ **Exception: refurbished sellers:** If you sell refurbished or vintage products, do not add these negatives.

### Rental/non-purchase terms

| Negative | Match type | Why it works |
| --- | --- | --- |
| `rent` | Broad | Rental intent, not purchase |
| `lease` | Broad | Leasing intent, not outright purchase |
| `borrow` | Broad | Temporary-use intent |
| `"for rent"` | Phrase | Explicit rental search |
| `subscription box` | Broad | Seeking recurring subscription, not one-time purchase (unless you sell subscription boxes) |

### Repair/parts terms

| Negative | Match type | Why it works |
| --- | --- | --- |
| `repair` | Broad | Fixing existing product, not buying new |
| `fix` | Broad | Same as repair: maintenance intent |
| `replacement parts` | Broad | Seeking components, not full product |
| `manual` | Broad | Seeking product documentation, not purchase |
| `troubleshoot` | Broad | Problem-solving, not buying |

### Wrong product attributes

| Negative | Match type | Why it works |
| --- | --- | --- |
| `wholesale` | Broad | Bulk buyer intent, wrong customer type for retail |
| `bulk` | Broad | Same as wholesale: B2B quantity intent |
| `commercial` | Broad | Business/industrial grade, not consumer retail |
| `industrial` | Broad | Manufacturing context, not consumer |
| `sample` | Broad | Seeking free product samples, not purchasing |

> 💡 **Wholesale exception:** If you sell B2B or offer wholesale pricing, move these to campaign-level negatives on consumer-only campaigns.

---

## Branded keyword negatives

Branded negatives prevent your brand terms from triggering in non-brand campaigns. This keeps brand and non-brand performance data clean.

### Your own brand terms

All variations of the brand name belong in one shared list, linked to non-brand campaigns.

| Pattern | Example (fictional brand "Acme CRM") | Match type |
| --- | --- | --- |
| Full brand name | `acme crm` | Broad |
| Brand abbreviation | `acme` | Broad |
| Common misspelling | `acmee crm` | Broad |
| Brand + product | `acme crm software` | Broad |
| Brand domain | `acmecrm.com` | Broad |

### Competitor brand terms

Accounts with no competitor campaigns keep competitor brand names in a shared list linked to all campaigns.

| Pattern | Example | Match type |
| --- | --- | --- |
| Competitor name | `competitor name` | Broad |
| Competitor + product | `competitor software` | Broad |
| Competitor domain | `competitorbrand.com` | Broad |
| Competitor misspelling | `competitor misspelling` | Broad |

> ⚠️ **If you run competitor campaigns,** link the competitor negatives list to all campaigns except your competitor-targeting campaigns. This isolates competitor traffic to the correct campaign.

---

## Final URL expansion page exclusion patterns

Final URL expansion matches to any indexed page on the site. The patterns below name the pages that waste spend or create poor entry experiences, applied as campaign URL exclusions.

### URL-based exclusions

| Page type | URL pattern to exclude | Why exclude |
| --- | --- | --- |
| Terms and conditions | `/terms`, `/terms-and-conditions` | Legal page, no conversion intent |
| Privacy policy | `/privacy`, `/privacy-policy` | Legal page, no conversion intent |
| Contact page | `/contact`, `/contact-us` | Low commercial value as a landing page |
| About page | `/about`, `/about-us` | Informational, not transactional |
| Cart/checkout | `/cart`, `/checkout` | Mid-transaction page, confusing as entry point |
| Login/account | `/login`, `/account`, `/password` | Existing customer flow, not acquisition |
| Blog index | `/blog` (index page only) | Too broad for targeted ad delivery |
| Help/support | `/help`, `/support`, `/faq` | Post-purchase support intent |

> ⚠️ **Do not automatically exclude all blog pages:** Individual blog posts can drive relevant expansion traffic. Exclude the blog index page, then monitor search term reports for individual posts. Exclude specific posts only if they drive irrelevant traffic.

### Content-based exclusions

Page feed rules and campaign URL exclusion settings block pages carrying specific content signals.

| Content signal | Why exclude |
| --- | --- |
| "out of stock" | Sends traffic to unavailable products, wastes spend |
| "unavailable" | Same as out of stock: no conversion possible |
| "coming soon" | Product not yet available for purchase |
| "discontinued" | Product no longer sold |
| "sold out" | Temporary unavailability, creates poor experience |
| "404" or "page not found" | Broken page, guaranteed bounce |

### URL exclusion by page type (ecommerce-specific)

| Page type | Exclude? | Rationale |
| --- | --- | --- |
| Product pages | No | Primary conversion pages |
| Category pages | Test first | Works for broad queries |
| Blog posts | Test first | Exclude only if data shows poor performance |
| Brand/manufacturer pages | Test first | Can capture brand-level intent |
| Clearance/sale pages | No | High conversion potential |
| Size guides/specs | Yes | Informational, low conversion |
| Shipping info | Yes | Post-decision page, not discovery |

---

### Quick reference: Support library

| Document | Type | Used for |
| --- | --- | --- |
| [Negative Keyword Reference](../references/Negative Keyword Reference.md) | Reference | Match type mechanics, conflict resolution, list management rules |
| [Search Term Report Reference](../references/Search Term Report Reference.md) | Reference | Reading and interpreting search term data |
| [Match Type Reference](../references/Match Type Reference.md) | Reference | Positive and negative match type behavior |

---

### Related SOPs

| SOP | Relationship |
| --- | --- |
| [SOP – Build Search Campaign Structure](../sops/SOP – Build Search Campaign Structure.md) | Uses this catalog for initial negative keyword list population (Phase 3.3) |
| [SOP – Promote Search Terms to Keywords](../sops/SOP – Promote Search Terms to Keywords.md) | Reverse workflow: promotes good terms, this catalog blocks bad ones |
| [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md) | Feeds new irrelevant term negatives into this catalog's categories |
| [SOP – Run N-gram Analysis](../sops/SOP – Run N-gram Analysis.md) | Feeds performance-based negatives from aggregated N-gram data |

---

### Related documents

| Document | Relationship |
| --- | --- |
| [Negative Keyword Reference](../references/Negative Keyword Reference.md) | Companion doc: mechanics and rules |
| [Search Term Report Reference](../references/Search Term Report Reference.md) | Data source for identifying new negatives |
| [Match Type Reference](../references/Match Type Reference.md) | Match type behavior for positive and negative keywords |

---

### Version details

- **Version:** 2.0
- **Last Updated:** June 2026
- **Creator:** Bob Meijer

---

### Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

(c) 2026 PPC Mastery B.V. All rights reserved.
