# SOP – Implement Transaction ID Deduplication
Created: 2026-02-04

Agent_Executable: No
Category: Measurement
Human_Approval_Required: No
Primary Outcome: Unique transaction IDs sent with every conversion, preventing duplicate counting
SOP_ID: SOP_28
Status: Done
Domain: Measurement
Pillar: 5

### Purpose

This SOP walks you through identifying a unique transaction ID source, configuring it in your conversion tag, and verifying that Google Ads deduplicates repeat submissions of the same conversion.

> ❓ **The big question:** Are your conversion numbers inflated by duplicate counts from page refreshes, back-button clicks, or multiple tag fires?

---

### What this SOP is NOT

This SOP does **not:**

- Set up conversion actions in Google Ads (prerequisite: conversion action must already exist)
- Configure conversion adjustments for value changes after the fact (See: [SOP – Configure Conversion Adjustments](../sops/SOP – Configure Conversion Adjustments.md))
- Fix tracking gaps from missing tags or consent issues (See: [SOP – Configure Google Consent Mode](../sops/SOP – Configure Google Consent Mode.md))

### When to run this SOP

Run this SOP when:

- Setting up any new conversion action
- Conversion counts in Google Ads consistently exceed backend order/lead counts
- Users can refresh the thank-you or confirmation page
- Multiple conversion tags fire on the same page (GTM, gtag, third-party platforms)

---

### Before you start

#### Required inputs

- Google Ads account with active conversion action(s)
- Google Tag Manager container or gtag.js implementation
- Access to modify the data layer on conversion confirmation pages
- A unique identifier source (order ID, form submission ID, or equivalent)

#### Reference documents (have open)

| Document | Used for |
|----------|----------|
| Google Tag Manager workspace | Tag and variable configuration |
| Backend/platform documentation | Transaction ID field identification |

---

### Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Identify Transaction ID Source** | Determine the unique ID for each conversion event | Documented ID source per conversion type |
| **Phase 2️⃣: Configure in GTM or gtag** | Pass the transaction ID to the conversion tag | Conversion tag sending unique transaction_id |
| **Phase 3️⃣: Validate** | Debug and verify unique IDs are sent | Every conversion fires with a populated, unique ID |
| **Phase 4️⃣: Verify Deduplication** | Confirm Google Ads rejects duplicate submissions | Duplicate test conversion counted only once |

---

## Phase 1️⃣: Identify Transaction ID Source

### 1.1 Map each conversion type to its ID source

| Conversion type | Unique ID source | Where to find it |
|----------------|-----------------|-------------------|
| Ecommerce purchase | Order ID | Platform generates at checkout (Shopify order_id, WooCommerce order number) |
| Lead form submission | Form submission ID | CRM assigns on submit, or generate via backend |
| Phone call | Call tracking ID | Call tracking platform provides |
| App install | Install ID | Mobile measurement partner provides |

### 1.2 Ecommerce: use the order ID

Every ecommerce platform generates a unique order ID at checkout. This is the transaction ID.

1. Identify the platform's order ID field name
2. Confirm it is available on the purchase confirmation page
3. Verify it is unique per order (never reused)

### 1.3 Lead gen: create a unique form submission ID

Lead forms often lack a built-in unique ID. Create one:

1. Brief your developer to generate a unique ID on each form submission
2. Options: UUID, timestamp + random string, CRM record ID
3. Pass this ID to the confirmation page data layer

```javascript
// Example: developer generates a unique ID server-side
dataLayer.push({
  'event': 'form_submit',
  'transaction_id': 'LEAD-2026-0201-a7b3c9'
});
```

> ⚠️ **Never use the user's email or phone as a transaction ID:** These are not unique per submission (a user can submit multiple forms). Use a system-generated unique identifier.

---

## Phase 2️⃣: Configure in GTM or gtag

### 2A: GTM configuration

#### Step 1️⃣: Create the data layer variable

1. Go to Variables > User-Defined Variables > New
2. Variable type: Data Layer Variable
3. Data Layer Variable Name: `transaction_id`
4. Name the variable: `DLV - transaction_id`
5. Save

#### Step 2️⃣: Populate the Transaction ID field in the conversion tag

1. Go to Tags > select your Google Ads conversion tag
2. Find the "Transaction ID" field (under the conversion value section)
3. Set it to `{{DLV - transaction_id}}`
4. Save and publish

> 💡 **One variable, all conversion tags:** If you have multiple conversion tags (purchase, lead, etc.), populate the Transaction ID field in every one. Use the same data layer variable name across conversion types.

### 2B: gtag configuration (alternative)

Add the `transaction_id` parameter to your conversion snippet:

```javascript
// Ecommerce example
gtag('event', 'conversion', {
  'send_to': 'AW-XXXXXXX/YYYYYYY',
  'value': 149.97,
  'currency': 'USD',
  'transaction_id': 'ORD-98765'
});

// Lead gen example
gtag('event', 'conversion', {
  'send_to': 'AW-XXXXXXX/ZZZZZZZ',
  'transaction_id': 'LEAD-2026-0201-a7b3c9'
});
```

The developer populates the `transaction_id` value dynamically from the backend.

---

## Phase 3️⃣: Validate

### 3.1 Debug in GTM

1. Open GTM Preview mode
2. Complete a test conversion (purchase or form submit)
3. Click the conversion event in the debug panel
4. Verify the conversion tag shows a populated `transaction_id` value
5. Confirm the value matches the order ID or form submission ID from the backend

### 3.2 Check for blank transaction IDs

1. Complete 3-5 test conversions
2. For each one, verify the transaction ID is:
   - Present (not blank or undefined)
   - Unique (different for each conversion)
   - Matching the backend record

| Check | Expected result | If it fails |
|-------|----------------|-------------|
| Transaction ID present | Non-empty string in debug panel | Data layer variable not populated, check developer implementation |
| Transaction ID unique | Different value per conversion | ID generation logic is reusing values |
| Transaction ID matches backend | ID in GTM equals ID in CRM/platform | Wrong data layer field name |

### 3.3 Check all conversion paths

Test transaction ID population on every conversion path:

- Desktop checkout
- Mobile checkout
- Express checkout (PayPal, Apple Pay, etc.)
- Guest checkout vs logged-in checkout
- Each form type (contact, quote request, demo request)

---

## Phase 4️⃣: Verify Deduplication

### 4.1 Submit the same conversion twice

1. Complete a test conversion (note the transaction ID)
2. Refresh the confirmation page (this fires the conversion tag again with the same transaction ID)
3. Wait 24 hours

### 4.2 Check Google Ads

1. Go to Google Ads > Goals > Conversions > conversion action detail
2. Look at the conversion count for the test period
3. Confirm the duplicate submission was counted only once

| Result | Status | Action |
|--------|--------|--------|
| One conversion recorded | Deduplication working | Complete |
| Two conversions recorded | Transaction ID not being sent | Re-check Phase 2 configuration |

### 4.3 Final checklist

- [ ] Every conversion type has a unique ID source identified
- [ ] Data layer pushes transaction_id on every conversion event
- [ ] Transaction ID field is populated in every conversion tag
- [ ] No blank or undefined transaction IDs in debug testing
- [ ] Duplicate submission test shows only one conversion in Google Ads

---

### Validation and definition of done

This SOP is complete when:

- [ ] Transaction ID is sent with every conversion tag fire
- [ ] IDs are unique per conversion event
- [ ] No blank transaction IDs across any conversion path
- [ ] Duplicate submission test confirms deduplication is working
- [ ] All conversion types (purchase, lead, etc.) have transaction IDs configured

---

### Exit → Entry bridge

Once transaction ID deduplication is active:

| Timeframe | Action |
|-----------|--------|
| Immediately | Proceed to other measurement SOPs (cart data, new customer tracking) |
| After 7 days | Compare Google Ads conversion count vs backend count for accuracy |
| Monthly | Spot-check for drift between Google Ads and backend numbers |

**If issues arise:**

| Issue | Route to |
|-------|----------|
| Conversion counts still exceed backend | Check all conversion paths for missing transaction IDs |
| Transaction IDs showing as blank | Developer: check data layer push timing vs tag firing |
| Discrepancy between Google Ads and backend | Run a conversion audit: compare IDs in both systems |

---

### FAQ

**Q: What happens if the transaction ID field is left blank?**

A: Google Ads treats every tag fire as a unique conversion. Page refreshes, back-button clicks, and multi-device confirmations all count as separate conversions, inflating your numbers.

**Q: Does deduplication work across devices?**

A: Yes. If the same transaction ID is sent from different devices or browsers, Google deduplicates to a single conversion.

**Q: Should I use the same transaction ID for Google Ads and GA4?**

A: Yes. Use the same `transaction_id` value for both. This also enables cross-platform reconciliation.

---

### Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Configure Google Consent Mode](../sops/SOP – Configure Google Consent Mode.md) | Upstream: consent mode must be active |
| [SOP – Set Up Cart Data and Profit Tracking](../sops/SOP – Set Up Cart Data and Profit Tracking.md) | Parallel: cart data uses the same transaction ID |
| [SOP – Set Up New Customer Tracking](../sops/SOP – Set Up New Customer Tracking.md) | Parallel: new customer data on the same conversion event |
| [SOP – Configure Conversion Adjustments](../sops/SOP – Configure Conversion Adjustments.md) | Downstream: adjustments reference transaction IDs |

---

### Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Blank transaction IDs on some pages | Data layer fires before ID is available | Ensure server-side ID generation completes before data layer push |
| Duplicate conversions persist | Transaction ID field mapped to wrong variable | Double-check variable name in GTM matches data layer key exactly |
| IDs not unique | Using timestamp without random component | Add a random suffix or use UUIDs |
| Express checkout missing IDs | Different checkout flow skips data layer | Test all checkout paths, including PayPal/Apple Pay |

---

### Version details

- **Version:** 1.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

### Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
