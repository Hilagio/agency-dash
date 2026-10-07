# Transaction ID Reference
Created: 2026-02-04
Updated: 2026-08-27

Support_ID: CHEATSHEET_20
Status: Done
Category: Operational
Reference Type: Cheat Sheets
Agent_Readable: Yes
Human_Facing: Yes
Domain: Measurement
Pillar: 5

## Purpose

Documents transaction ID deduplication for Google Ads conversion tracking, covering all verticals (ecommerce, lead gen, SaaS), the ID sources available per vertical, and the role transaction IDs play in enabling Conversion Adjustments.

---

## What this reference is / What this is NOT

**This reference:**

- Explains the duplicate conversion problem and how transaction IDs solve it
- Documents the transaction ID sources available per vertical
- Clarifies the difference between transaction ID dedup and conversion counting settings
- Covers the transaction ID requirement for Conversion Adjustments

**This reference does NOT:**

- Provide step-by-step conversion tracking setup (See: [SOP – Set Up Google Ads Conversion Tracking](../sops/SOP – Set Up Google Ads Conversion Tracking.md))
- Cover conversion action settings in detail (See: [Conversion Action Reference](../references/Conversion Action Reference.md))
- Explain offline conversion tracking upload procedures (See: [SOP – Set Up Offline Conversion Tracking](../sops/SOP – Set Up Offline Conversion Tracking.md))

---

## Quick reference: transaction ID

| **Element** | **Details** |
|-------------|------------|
| **Parameter name** | `transaction_id` (GTM and gtag) |
| **Format** | String, unique per conversion event |
| **Max length** | 64 characters |
| **Dedup window** | Google ignores duplicate transaction IDs within the conversion window |
| **Required for** | Deduplication, Conversion Adjustments (restate, retract) |
| **Applies to** | All verticals: ecommerce (order ID), lead gen (form ID), SaaS (signup ID) |

---

## The duplicate conversion problem

### How duplicates happen

| **Cause** | **What happens** | **Frequency** |
|----------|-----------------|---------------|
| Page refresh on thank-you page | Conversion tag fires again on reload | Very common |
| Browser back/forward navigation | User returns to confirmation page, tag fires again | Common |
| Bookmark of confirmation page | User revisits bookmarked URL, tag fires again | Occasional |
| Bot/crawler visits | Automated visits to confirmation URLs | Occasional |
| Multiple tabs | User opens confirmation in multiple tabs | Occasional |

### Impact without deduplication

**Real example:** An ecommerce account without transaction IDs reports a 600% conversion rate on branded campaigns. Smart Bidding receives inflated signals, overbids on every auction, and the account bleeds budget on phantom conversions.

| **Metric** | **Without transaction ID** | **With transaction ID** |
|-----------|---------------------------|------------------------|
| Reported conversions | Inflated (duplicates counted) | Accurate (duplicates ignored) |
| CPA | Artificially low | True cost per acquisition |
| ROAS | Artificially high | True return on ad spend |
| Smart Bidding behavior | Overbids based on inflated signals | Bids based on accurate data |

---

## How transaction ID deduplication works

1. Each conversion event includes a unique `transaction_id`
2. Google receives the conversion with the transaction ID
3. If a conversion with the same `transaction_id` has already been recorded within the conversion window, Google ignores the duplicate
4. Only the first conversion per unique transaction ID is counted

> 💡 **Transaction ID dedup is passive and automatic:** No setting switches it on. A conversion tag carrying the `transaction_id` parameter is deduplicated by Google without further configuration.

> ↪️ **One exception:** A conversion action set to external attribution cannot use transaction ID deduplication. The conditions are in [Offline Conversion Tracking Reference](../references/Offline Conversion Tracking Reference.md).

---

## Transaction ID vs. counting setting

These are two different deduplication mechanisms. They are not interchangeable.

| | **Transaction ID** | **Counting (Every vs. One)** |
|--|-------------------|------------------------------|
| **Level** | Per conversion event | Per ad interaction (click) |
| **What it deduplicates** | Same conversion fired multiple times | Multiple different conversions from one click |
| **Example** | User refreshes order confirmation: 1 order, tag fires 3 times | User makes 3 separate purchases after 1 click: 3 orders |
| **With transaction ID + "Every"** | 3 fires, 1 conversion counted (same ID) | 3 purchases, 3 conversions counted (different IDs) |
| **Without transaction ID + "One"** | 3 fires, 1 conversion counted (one per click) | 3 purchases, 1 conversion counted (one per click) |

> ⚠️ **The two mechanisms cover different cases:** Transaction ID prevents duplicate fires of the same conversion. The counting setting governs how multiple distinct conversions from one click are counted. Counting settings per vertical live in [Conversion Action Reference](../references/Conversion Action Reference.md).

---

## Transaction ID by vertical

### Ecommerce

| **Source** | **Transaction ID value** | **Example** |
|-----------|------------------------|-------------|
| Order management system | Order ID / confirmation number | `ORD-2024-78432` |
| Shopify | `order_id` from checkout | `#1042` |
| WooCommerce | `order_id` from wc_order | `WC-5678` |
| Custom platform | Database order primary key | `TXN_98765` |

### Lead gen

| **Source** | **Transaction ID value** | **Example** |
|-----------|------------------------|-------------|
| CRM system | Lead/form submission ID | `LEAD-2024-4521` |
| Form plugin (Gravity Forms, etc.) | Entry ID | `GF-entry-1234` |
| Custom backend | UUID generated at form submit | `f47ac10b-58cc-4372-a567-0e02b2c3d479` |
| Timestamp-based (fallback) | Timestamp + user identifier hash | `1706745600-a1b2c3` |

### SaaS

| **Source** | **Transaction ID value** | **Example** |
|-----------|------------------------|-------------|
| User management system | User/account ID | `USR-20240201-789` |
| Subscription platform | Subscription ID | `SUB-stripe-pi_3abc` |
| Trial signup | Trial session ID | `TRIAL-2024-5432` |

> ⚠️ **Random client-side IDs that regenerate on page load defeat deduplication:** A transaction ID carries the same value on every load of the same conversion page, which is what a server-generated ID tied to the transaction record gives you.

---

## Where transaction IDs are configured

Both tagging paths carry the value in the `transaction_id` parameter of the conversion event. In GTM it comes from a Data Layer Variable populated by the purchase or form-submission data layer push. In gtag it sits directly in the event payload.

> ↪️ **Full configuration procedure:** See [SOP – Implement Transaction ID Deduplication](../sops/SOP – Implement Transaction ID Deduplication.md), Phase 2.

---

## Transaction ID and Conversion Adjustments

Transaction IDs are required for Conversion Adjustments. Without a transaction ID, a conversion cannot be adjusted after it has been recorded.

| **Adjustment type** | **What it does** | **Requires transaction ID** |
|--------------------|-----------------|---------------------------|
| Restate | Change the conversion value (e.g., partial refund, updated lead value) | Yes |
| Retract | Remove the conversion entirely (e.g., cancelled order, spam lead) | Yes |

**Example flow:**

1. Customer purchases for €200 (transaction ID: `ORD-12345`)
2. Customer returns one item worth €80
3. Upload a restate adjustment: transaction ID `ORD-12345`, new value €120
4. Google Ads updates reporting and Smart Bidding learns from the corrected value

---

## Developer requirements

A transaction ID implementation has to satisfy all of the following:

| **Requirement** | **Details** |
|-----------------|------------|
| Parameter name | `transaction_id` in data layer push |
| Value source | Order ID (ecommerce) or unique form submission ID (lead gen) |
| Generation timing | Server-side, at the moment of successful transaction/submission |
| Persistence | Same ID must appear on every load of the same confirmation page |
| Format | String, max 64 characters, no special characters besides hyphens and underscores |
| Data layer event | Push with the purchase or form_submission event |

---

## Common mistakes

| **Mistake** | **Problem** | **Fix** |
|-------------|-------------|---------|
| No transaction ID implemented | Duplicate conversions inflate data, Smart Bidding overbids | Implement transaction ID for all conversion actions |
| Client-side random ID on page load | New ID on every refresh, dedup fails completely | Use server-generated ID tied to actual transaction record |
| Relying on counting "One" instead of transaction ID | "One" prevents multiple distinct conversions, not duplicate fires of same conversion | Use both: transaction ID for dedup, counting for business logic |
| Transaction ID missing on some conversion paths | Partial dedup: some paths deduped, others not | Audit all conversion paths (web, app, phone) for coverage |
| Not implementing for lead gen | "Lead gen doesn't have orders" mindset | Create unique form submission IDs server-side |
| Forgetting transaction ID blocks Conversion Adjustments | Cannot restate or retract conversions later | Always include transaction ID, even if you don't use adjustments yet |

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Conversion Action Reference](../references/Conversion Action Reference.md) | Counting settings that complement transaction ID deduplication |
| [Measurement Maturity Mental Model](../mental-models/Measurement Maturity Mental Model.md) | Transaction ID is a foundational measurement requirement |
| [Cart Data and Profit Tracking Reference](../references/Cart Data and Profit Tracking Reference.md) | Cart Data sends transaction ID alongside product-level data |
| [Custom Variables Reference](../references/Custom Variables Reference.md) | Custom variables sent alongside transaction ID in conversion events |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Removing duplicate conversions may reduce volume below thresholds |
| [Offline Conversion Tracking Reference](../references/Offline Conversion Tracking Reference.md) | External attribution rules out transaction ID deduplication |

---

## Version details

- **Version:** 2.0
- **Last Updated:** August 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
