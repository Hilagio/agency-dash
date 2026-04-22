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

Documents new vs. returning customer data implementation, the New Customer Acquisition (NCA) goal for Performance Max and Shopping campaigns, and segmented analysis methods for customer type reporting.

---

## What this reference is / What this is NOT

**This reference:**

- Defines the new_customer parameter and how to implement it
- Documents GTM and gtag setup methods for customer type tracking
- Explains the NCA goal and its bidding modes in PMax
- Provides reporting and analysis guidance for new vs. returning segments

**This reference does NOT:**

- Provide step-by-step PMax campaign setup (See: future SOP: Set Up Performance Max Campaign)
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
| **Used by** | NCA goal in PMax and Shopping campaigns |
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

> ⚠️ **Server-side lookup is required for accuracy:** Cookie-based methods fail when users clear cookies, switch devices, or use private browsing. Always use a database lookup against email or account ID.

### GTM setup

**Step 1️⃣: Push to data layer**

Your developer adds the `new_customer` value to the purchase data layer push:

```javascript
dataLayer.push({
  'event': 'purchase',
  'transaction_id': 'ORD-12345',
  'value': 149.99,
  'currency': 'USD',
  'new_customer': true
});
```

**Step 2️⃣: Create data layer variable**

| **Setting** | **Value** |
|-------------|----------|
| Variable type | Data Layer Variable |
| Variable name | `new_customer` |
| Data Layer version | Version 2 |

**Step 3️⃣: Configure conversion tag**

1. Open your Google Ads Conversion Tracking tag
2. Scroll to "New customer data" section
3. Check "Send new customer data"
4. Data source: Data Layer
5. Map the `new_customer` variable

### gtag setup

Add the `new_customer` parameter to the purchase event:

```javascript
gtag('event', 'purchase', {
  'send_to': 'AW-XXXXXXXXX/XXXXXXXXXXXXX',
  'transaction_id': 'ORD-12345',
  'value': 149.99,
  'currency': 'USD',
  'new_customer': true
});
```

---

## Viewing new customer data

### Report segmentation

| **Step** | **Action** |
|----------|-----------|
| 1 | Open any campaign, ad group, or keyword report in Google Ads |
| 2 | Click the "Segment" icon |
| 3 | Select Conversions > New vs. Returning Customers |
| 4 | Report splits each row into "New" and "Returning" segments |

### Key metrics to compare

| **Metric** | **New customers** | **Returning customers** | **What to look for** |
|-----------|-------------------|------------------------|---------------------|
| Conversions | Volume of first-time buyers | Volume of repeat buyers | High returning % in non-branded = problem |
| CPA | True acquisition cost | Re-conversion cost | New CPA is the real growth metric |
| Conv. value | First-order value | Repeat-order value | Returning often has higher AOV |
| Conv. rate | First-time conversion rate | Repeat conversion rate | Returning converts at higher rates (expected) |

---

## NCA goal in Performance Max

### What it does

The New Customer Acquisition (NCA) goal tells PMax to prioritize acquiring new customers over re-converting existing ones. It uses the `new_customer` parameter and Customer Match lists to identify who is new.

### Two NCA modes

| **Mode** | **Behavior** | **Best for** |
|---------|-------------|-------------|
| **Value mode (bid higher)** | Adds a bonus value to new customer conversions, making Google bid more aggressively for them | Accounts that want both new and returning customer conversions |
| **New customers only** | Only counts and optimizes for new customer conversions | Accounts focused purely on customer acquisition |

### NCA setup requirements

| **Requirement** | **Details** |
|-----------------|------------|
| `new_customer` parameter | Must be implemented on conversion tag (see setup above) |
| Customer Match list | Upload existing customer email list so Google can identify returning customers |
| PMax or Shopping campaign | NCA goal only available in these campaign types |
| Conversion tracking | Purchase conversion action must be active and primary |

### Value mode configuration

In value mode, you set an additional value for new customers:

| **Setting** | **What to enter** | **Example** |
|-------------|------------------|-------------|
| New customer value | Estimated customer lifetime value minus first-order value | If CLV = €500 and AOV = €100, enter €400 |

Google adds this value to each new customer conversion, causing Smart Bidding to bid higher for users it identifies as likely new customers.

> 💡 **Start conservative with new customer value:** Begin at 50% of your estimated additional CLV and increase gradually. Setting the value too high causes Smart Bidding to overpay for new customers at the expense of total profitability.

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

- **Version:** 1.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
