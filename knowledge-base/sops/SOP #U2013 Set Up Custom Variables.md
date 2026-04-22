# SOP – Set Up Custom Variables
Created: 2026-02-04

Agent_Executable: No
Category: Measurement
Human_Approval_Required: No
Primary Outcome: Custom business dimensions sending with conversion data, visible in Google Ads segments
SOP_ID: SOP_29
Status: Done
Domain: Measurement
Pillar: 5

### Purpose

This SOP walks you through defining custom business variables, implementing them via gtag or Offline Conversion Tracking (OCT) import, creating them in Google Ads, and validating that they appear as segmentation options in your reports.

> ❓ **The big question:** Can you segment your conversion data by business dimensions that matter to you (lead score, product category, hotel name, room rate)?

---

### What this SOP is NOT

This SOP does **not:**

- Set up basic conversion tracking (prerequisite: conversion action must already exist)
- Configure conversion adjustments (See: [SOP – Configure Conversion Adjustments](../sops/SOP – Configure Conversion Adjustments.md))
- Explain how to use custom variable data for bidding decisions (downstream optimization)
- Cover GTM-based implementation (custom variables are NOT available via GTM)

### When to run this SOP

Run this SOP when:

- You need to segment conversions by business-specific dimensions
- Standard Google Ads segments (campaign, device, location) are insufficient
- You want to analyze conversion quality beyond just count and value
- You need to pass lead scores, product categories, or booking details with conversions

---

### Before you start

#### Required inputs

- Google Ads account with active conversion action(s)
- gtag.js implementation on conversion pages, or an OCT import workflow in place
- Developer access to modify the conversion snippet (for gtag method)
- Business data to populate variable values (from CRM, booking system, or backend)
- Up to 5 custom variables per conversion action (Google Ads limit)

#### Reference documents (have open)

| Document | Used for |
|----------|----------|
| Google Ads Custom Variables documentation | Variable naming and limits |
| Backend/CRM data dictionary | Available business dimensions |

> ⚠️ **Custom variables are NOT available via GTM:** You must use either the gtag.js method or the OCT import method. If your tracking is GTM-only, coordinate with your developer to add gtag parameters.

---

### Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Define Variables** | Identify which business dimensions to track | Documented variable list with names and value types |
| **Phase 2A: Implement via gtag** | Add custom parameters to the conversion snippet | Conversion snippet sending custom variable data |
| **Phase 2B: Implement via OCT Import** | Add custom variable columns to upload template | Upload template with cv.variable_name columns |
| **Phase 3️⃣: Create in Google Ads** | Register variables in the Google Ads interface | Custom variables created and enabled |
| **Phase 4️⃣: Validate** | Verify data appears in reports and segments | Custom variable segments available in campaign reports |

---

## Phase 1️⃣: Define Variables

### 1.1 Brainstorm business dimensions

Identify the dimensions that would provide the most actionable insight when segmenting your conversion data.

| Vertical | Example variables | Why useful |
|----------|------------------|-----------|
| Hotels/Travel | `hotel_name`, `room_rate`, `booking_type`, `length_of_stay` | Understand which properties and booking types drive value |
| Lead gen | `lead_score`, `lead_source`, `service_type`, `deal_size` | Segment conversions by quality and potential value |
| Ecommerce | `product_category`, `margin_tier`, `customer_segment` | Analyze which product types convert from ads |
| SaaS | `plan_type`, `trial_source`, `company_size` | Identify which segments convert to paid plans |

### 1.2 Finalize your variable list

Select up to 5 custom variables per conversion action. For each one, document:

| Variable name | Data type | Example values | Source system |
|---------------|-----------|----------------|---------------|
| `lead_score` | Numeric | `85`, `42`, `91` | CRM scoring model |
| `service_type` | String | `consulting`, `implementation`, `audit` | Form selection field |
| `deal_size` | String | `small`, `medium`, `enterprise` | CRM deal record |

> 💡 **Prioritize actionable dimensions:** Choose variables that would change your bidding or campaign decisions if you could see them in reports. Skip vanity dimensions.

### 1.3 Name your variables

Use lowercase with underscores. Keep names descriptive and under 40 characters.

| Do | Don't |
|-----|-------|
| `lead_score` | `LS` |
| `room_rate` | `Room Rate!!!` |
| `product_category` | `the_category_of_the_product_purchased` |

---

## Phase 2A: Implement via gtag

### 2A.1 Add custom parameters to the conversion snippet

For each conversion action, add custom variable parameters using the `cv.` prefix:

```javascript
gtag('event', 'conversion', {
  'send_to': 'AW-XXXXXXX/YYYYYYY',
  'value': 5000.00,
  'currency': 'USD',
  'transaction_id': 'LEAD-2026-0201-a7b3c9',
  'cv.lead_score': '85',
  'cv.service_type': 'consulting',
  'cv.deal_size': 'enterprise'
});
```

### 2A.2 Developer instructions

Send this to your developer:

1. On the conversion confirmation page, populate each `cv.` parameter dynamically
2. Pull values from the backend/CRM at page render time
3. All values must be strings (even numeric values)
4. If a value is unavailable for a specific conversion, omit the parameter (do not send empty strings)

### 2A.3 Test the snippet

1. Complete a test conversion
2. Open browser Network tab
3. Filter for requests to `googleads.g.doubleclick.net`
4. Verify the custom variable parameters appear in the request payload

---

## Phase 2B: Implement via OCT Import

### 2B.1 Add custom variable columns to your upload template

If you use Offline Conversion Tracking imports, add columns for each custom variable:

| Column header format | Example |
|---------------------|---------|
| `cv.variable_name` | `cv.lead_score` |

### 2B.2 Prepare the upload file

Your upload template should include:

| Google Click ID | Conversion Name | Conversion Time | Conversion Value | Conversion Currency | cv.lead_score | cv.service_type |
|----------------|-----------------|-----------------|------------------|--------------------:|---------------|-----------------|
| EAIaIQob... | Lead Submit | 2026-02-01 14:30:00 | 5000 | USD | 85 | consulting |
| EAIaIQob... | Lead Submit | 2026-02-01 15:45:00 | 2000 | USD | 42 | audit |

### 2B.3 Upload with custom variable data

1. Go to Google Ads > Goals > Conversions > Uploads
2. Upload your file with the custom variable columns included
3. Verify the upload completes without errors related to custom variable columns

> ⚠️ **Column headers must match exactly:** Use the `cv.` prefix followed by the exact variable name you will create in Phase 3. Case matters.

---

## Phase 3️⃣: Create in Google Ads

### 3.1 Navigate to Custom Variables

1. Open Google Ads
2. Go to Tools > Measurement > Conversions
3. Click "Custom Variables" in the left navigation

### 3.2 Create each variable

For each variable from your Phase 1 list:

1. Click the "+" button to create a new custom variable
2. Enter the variable name (must match the `cv.` parameter name exactly, without the `cv.` prefix)
3. Save

### 3.3 Enable the variables

1. After creating each variable, verify it shows as "Enabled"
2. Confirm the total count does not exceed 5 per conversion action

| Variable name | Status | Matching parameter |
|---------------|--------|--------------------|
| lead_score | Enabled | cv.lead_score |
| service_type | Enabled | cv.service_type |
| deal_size | Enabled | cv.deal_size |

---

## Phase 4️⃣: Validate

### 4.1 Check the Custom Variables page

1. Go to Tools > Measurement > Conversions > Custom Variables
2. After 24-48 hours, check that recent values appear for each variable
3. Verify the value distribution looks correct (not all blank, not all the same)

### 4.2 Segment campaign reports

1. Go to Campaigns or Ad Groups report
2. Click Segment > Conversions > Custom Variable
3. Select one of your custom variables
4. Verify the report breaks down by the variable values

| What you should see | What it means |
|---------------------|--------------|
| Conversion data split by variable values | Data flowing correctly |
| Custom variable option not available | Variable not created in Phase 3, or no data received yet |
| All conversions under "(not set)" | Parameters not being sent with conversions |

### 4.3 Final checklist

- [ ] Variables defined with clear names and expected values
- [ ] Implementation method chosen (gtag or OCT import)
- [ ] Custom parameters sending with conversion data
- [ ] Variables created and enabled in Google Ads
- [ ] Custom variable segments appear in campaign reports
- [ ] Value distribution matches expected business data

---

### Validation and definition of done

This SOP is complete when:

- [ ] Up to 5 custom variables are defined and documented
- [ ] Variables are sending data via gtag or OCT import
- [ ] Variables are created and enabled in Google Ads
- [ ] Custom variable segmentation is available in campaign reports
- [ ] At least 10 conversions show correct custom variable values

---

### Exit → Entry bridge

Once custom variables are active:

| Timeframe | Action |
|-----------|--------|
| Immediately | Begin segmenting conversion reports by custom dimensions |
| After 7 days | Validate data accuracy against backend records |
| After 30 days | Use insights to inform bidding and campaign structure decisions |

**If issues arise:**

| Issue | Route to |
|-------|----------|
| Values not appearing in reports | Check parameter naming matches between snippet and Google Ads |
| All conversions show "(not set)" | Developer: verify parameters are populated dynamically |
| Variable limit reached | Prioritize the 5 most actionable dimensions, remove unused ones |

---

### FAQ

**Q: Why can't I use GTM for custom variables?**

A: Google Ads custom variables require the `cv.` parameter prefix in the conversion tag, which is only supported via the gtag.js snippet or OCT import. GTM's Google Ads conversion tag does not expose this field.

**Q: Can I change variable values after they're sent?**

A: No. Custom variable values are set at conversion time and cannot be adjusted retroactively. For post-conversion corrections, use conversion adjustments instead.

**Q: Do custom variables affect Smart Bidding?**

A: Not directly. Custom variables are for reporting segmentation only. Smart Bidding uses conversion value, not custom variable values, for optimization.

---

### Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Implement Transaction ID Deduplication](../sops/SOP – Implement Transaction ID Deduplication.md) | Parallel: transaction IDs are sent alongside custom variables |
| [SOP – Configure Conversion Adjustments](../sops/SOP – Configure Conversion Adjustments.md) | Downstream: adjustments can correct values but not custom variables |
| [SOP – Configure Google Consent Mode](../sops/SOP – Configure Google Consent Mode.md) | Upstream: consent mode must be active for data collection |

---

### Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Variable name mismatch | `cv.` parameter name doesn't match Google Ads variable name | Copy-paste names, verify exact match |
| All values "(not set)" | Developer sends empty strings instead of omitting | Omit the parameter when no value exists |
| Numeric values not segmenting correctly | Values sent as numbers instead of strings | Ensure all values are sent as strings |
| Exceeding 5-variable limit | Trying to add more than 5 variables | Prioritize during Phase 1, retire unused variables |

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
