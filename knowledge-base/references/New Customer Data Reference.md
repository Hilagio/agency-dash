# New Customer Data Reference
Created: 2026-02-04
Updated: 2026-04-02

Support_ID: CHEATSHEET_19
Status: Done
Category: Operational
Reference Type: Cheat Sheets
Agent_Readable: Yes
Human_Facing: Yes
Domain: Measurement
Pillar: 5

## Purpose

Documents new vs. returning customer data implementation, the New Customer Acquisition (NCA) goal and its modes for Performance Max, Search, Shopping, and Demand Gen campaigns, and segmented analysis methods for customer type reporting.

---

## What this reference is / What this is NOT

**This reference:**

- Defines the new_customer parameter and how to implement it
- Documents GTM and gtag setup methods for customer type tracking
- Explains the NCA goal and its bidding modes in PMax
- Provides reporting and analysis guidance for new vs. returning segments

**This reference does NOT:**

- Provide step-by-step implementation (See: [SOP – Set Up New Customer Tracking](../sops/SOP – Set Up New Customer Tracking.md))
- Explain Customer Match list building (See: [SOP – Build Customer Match Lists](../sops/SOP – Build Customer Match Lists.md))
- Cover full conversion action configuration (See: [Conversion Action Reference](../references/Conversion Action Reference.md))

---

## Quick reference: new customer data

| **Element** | **Details** |
|-------------|------------|
| **Parameter name** | `new_customer` |
| **Values** | `true` (new customer) or `false` (returning customer) |
| **Sent with** | Purchase/conversion event |
| **Determined by** | Backend database lookup at conversion time |
| **Where to view** | Campaign report > Segments > Conversions > New vs. Returning Customers |
| **Used by** | NCA modes in Performance Max, Search, Shopping, and Demand Gen campaigns |
| **Developer required** | Yes, for backend new/returning lookup logic |

---

## Why new customer data matters

### The hidden problem

A significant portion of non-branded campaign conversions can come from returning customers. Without new customer data, you cannot distinguish between:

- A campaign acquiring genuinely new customers at €50 CPA
- A campaign re-converting existing customers who would have purchased anyway

**Real-world example:** An ecommerce account discovers 35% of non-branded Search conversions come from returning customers. Actual new customer CPA is €77, not the reported €50. This changes campaign evaluation and budget allocation decisions.

### Three key benefits

| **Benefit** | **What it enables** | **Impact** |
|-------------|-------------------|-----------|
| Segmented analysis | View new vs. returning split by campaign, ad group, keyword | Identify which campaigns actually acquire new customers |
| NCA goal bidding | Bid more aggressively (or exclusively) for new customers in PMax | Higher new customer volume, controlled acquisition cost |
| Strategy reassessment | Rethink budget allocation based on true acquisition rates | Stop overspending on campaigns that mainly re-convert existing customers |

---

## Implementation

### How it works

1. User completes a purchase or conversion on your site
2. Your backend checks whether this user is a new or returning customer
3. The `new_customer` parameter (`true` or `false`) is pushed to the data layer
4. The conversion tag picks up the parameter and sends it to Google Ads
5. Google Ads segments conversion reporting by customer type

### Developer requirement

The new/returning determination requires a server-side database lookup. This is not something that can be solved with client-side JavaScript alone.

| **Method** | **How it works** | **Accuracy** |
|-----------|-----------------|-------------|
| Email match | Check if purchase email exists in customer database | High (most reliable) |
| Account login status | Check if user was logged in with existing account | Medium (misses guest checkouts) |
| Order history lookup | Check if email/phone has prior orders | High |
| Cookie-based (not recommended) | Check for returning visitor cookie | Low (cookies clear, cross-device fails) |

> ⚠️ **Server-side lookup is required for accuracy.** Cookie-based methods fail when users clear cookies, switch devices, or use private browsing. Only a database lookup against email or account ID survives all three.

### GTM path

The `new_customer` value rides on the purchase data layer push, a Data Layer Variable (version 2) named `new_customer` reads it, and the Google Ads Conversion Tracking tag maps that variable under its "New customer data" section.

### gtag path

The `new_customer` parameter is added to the purchase event alongside `transaction_id`, `value` and `currency`.

> ↪️ **For the tag code and the configuration sequence:** See [SOP – Set Up New Customer Tracking](../sops/SOP – Set Up New Customer Tracking.md).

---

## Viewing new customer data

### Report segmentation

The New vs. Returning Customers segment sits under Conversions in the Segment control, and applies to campaign, ad group and keyword reports. Applied, it splits each row into a "New" and a "Returning" line.

### Key metrics to compare

| **Metric** | **New customers** | **Returning customers** | **What to look for** |
|-----------|-------------------|------------------------|---------------------|
| Conversions | Volume of first-time buyers | Volume of repeat buyers | High returning % in non-branded = problem |
| CPA | True acquisition cost | Re-conversion cost | New CPA is the real growth metric |
| Conv. value | First-order value | Repeat-order value | Returning often has higher AOV |
| Conv. rate | First-time conversion rate | Repeat conversion rate | Returning converts at higher rates (expected) |

---

## NCA goals and modes

### What it does

The New Customer Acquisition (NCA) goal tells the campaign to prioritize acquiring new customers over re-converting existing ones. It uses the `new_customer` parameter and Customer Match lists to identify who is new.

### Three NCA modes

| **Mode** | **Behavior** | **Best for** |
|---------|-------------|-------------|
| **Value mode (bid higher)** | Adds a bonus value to new customer conversions, making Google bid more aggressively for them | Accounts that want both new and returning customer conversions |
| **New customers only** | Only counts and optimizes for new customer conversions, stops serving existing customers entirely | Accounts focused purely on customer acquisition |
| **New prospects mode (BETA)** | Goes further than new vs. returning: targets brand-unaware "cold" audiences only. A bundle of automated exclusions filters out anyone who purchased (via Customer Match and tags), searched your brand terms, visited your site or used your app, or engaged with your content or ads across Google and YouTube | Genuine top-of-funnel prospecting where reaching net-new, brand-unaware demand is the explicit goal |

> ⚠️ **New prospects mode is a deliberate, measured bet.** It is the most restrictive mode and hands the most control to Google's automated exclusions. It maximally restricts reachable volume, which pays off only where reaching brand-unaware demand is the explicit goal and incrementality measurement is already in place. Value mode is the default for most accounts, and a volume-sensitive campaign moving to new prospects mode needs a holdout to show the incremental new customers cover the lost volume.

### NCA setup requirements

| **Requirement** | **Details** |
|-----------------|------------|
| `new_customer` parameter | Must be implemented on conversion tag (see setup above) |
| Customer Match list | Upload existing customer email list so Google can identify returning customers |
| Performance Max, Search, Shopping, or Demand Gen campaign | NCA modes are available in these campaign types |
| Conversion tracking | Purchase conversion action must be active and primary |

### Value mode configuration

In value mode, you set an additional value for new customers:

| **Setting** | **What to enter** | **Example** |
|-------------|------------------|-------------|
| New customer value | Estimated customer lifetime value minus first-order value | If CLV = €500 and AOV = €100, enter €400 |

Google adds this value to each new customer conversion, causing Smart Bidding to bid higher for users it identifies as likely new customers.

> 💡 **New customer value starts conservative.** 50% of estimated additional CLV is the opening position, raised gradually. A value set too high has Smart Bidding overpaying for new customers at the expense of total profitability.

---

## Common mistakes

| **Mistake** | **Problem** | **Fix** |
|-------------|-------------|---------|
| Using cookie-based new/returning detection | Inaccurate data: cookie clearing and cross-device usage cause misclassification | Implement server-side database lookup |
| Not uploading Customer Match list with NCA | Google can't identify returning customers accurately, NCA less effective | Upload and regularly refresh customer email list |
| Setting NCA to "new customers only" too aggressively | Significant drop in total conversion volume | Start with value mode, test for 4-6 weeks, then evaluate |
| New customer value set too high | Overbidding for new customers, total ROAS drops | Start at 50% of estimated additional CLV |
| Not checking new/returning split in non-branded campaigns | Overpaying for returning customers you would get organically | Review segment data monthly, adjust strategy accordingly |
| Missing `new_customer` parameter on some conversion paths | Incomplete data, skewed segmentation | Audit all conversion paths (web, app, phone) for parameter coverage |

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Measurement Maturity Mental Model](../mental-models/Measurement Maturity Mental Model.md) | New customer data is an advanced measurement technique |
| [Conversion Action Reference](../references/Conversion Action Reference.md) | Conversion action settings that interact with new customer data |
| [SOP – Build Customer Match Lists](../sops/SOP – Build Customer Match Lists.md) | Customer Match lists required for NCA goal accuracy |
| [Unit Economics Reference](../references/Unit Economics Reference.md) | CLV calculations inform new customer value setting |
| [Transaction ID Reference](../references/Transaction ID Reference.md) | Transaction IDs sent alongside new customer parameter |

---

## Version details

- **Version:** 2.0
- **Last Updated:** June 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
