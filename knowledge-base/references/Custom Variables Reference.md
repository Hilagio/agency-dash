# Custom Variables Reference
Created: 2026-02-04

Support_ID: CHEATSHEET_21
Status: Done
Category: Operational
Reference Type: Cheat Sheets
Agent_Readable: Yes
Human_Facing: Yes
Domain: Measurement
Pillar: 5

## Purpose

Documents custom conversion variables for enriching Google Ads conversion data with business-specific dimensions such as lead scores, product categories, customer tiers, and any other attribute relevant to your business.

---

## What this reference is / What this is NOT

**This reference:**

- Defines what custom variables are and what they enable
- Documents both implementation methods (gtag and OCT import)
- Explains variable creation, activation, and naming requirements
- Provides practical examples for ecommerce, lead gen, and SaaS verticals

**This reference does NOT:**

- Provide step-by-step conversion tracking setup (See: [Conversion Action Reference](../references/Conversion Action Reference.md))
- Cover offline conversion tracking upload procedures (See: future SOP: Set Up Offline Conversion Tracking)
- Explain how to build scoring models for lead qualification (See: future SOP: Set Up Scoring Model Segmentation)

---

## Quick reference: custom variables

| **Element** | **Details** |
|-------------|------------|
| **What they do** | Send business-specific dimensions with each conversion event |
| **Max variables** | Up to 5 custom variables per conversion action |
| **Implementation methods** | gtag (hardcoded snippet) or OCT import (offline upload) |
| **NOT available via** | GTM (no native support, workarounds unreliable) |
| **Where to view** | Campaign reports > Segments > Conversions > Custom Variables |
| **Variable creation** | Tools > Conversions > Custom Variables in Google Ads UI |
| **Naming rule** | Variable names in tags/uploads must exactly match names in Google Ads UI |

> ⚠️ **Custom variables are NOT available via GTM:** Despite various workarounds attempted, GTM does not natively support custom conversion variables. Use the gtag method (hardcoded snippet) or OCT import method instead.

---

## What custom variables enable

Custom variables let you segment conversion data by dimensions Google Ads does not track natively. This transforms your Google Ads reports from "how many conversions" to "what kind of conversions".

### Without custom variables

| **Campaign** | **Conversions** | **CPA** | **Value** |
|-------------|----------------|---------|----------|
| Campaign A | 50 | €40 | €5,000 |
| Campaign B | 30 | €60 | €3,600 |

You see totals. You cannot distinguish high-value conversions from low-value ones within each campaign.

### With custom variables

| **Campaign** | **Conversions** | **CPA** | **Lead Score** | **Company Size** |
|-------------|----------------|---------|---------------|-----------------|
| Campaign A | 50 | €40 | 30 = Score A, 20 = Score B | 25 = Enterprise, 25 = SMB |
| Campaign B | 30 | €60 | 25 = Score A, 5 = Score B | 28 = Enterprise, 2 = SMB |

Now you see Campaign B delivers 83% high-score leads and 93% enterprise companies, making its higher CPA worthwhile.

---

## Implementation method 1: gtag (hardcoded)

### How it works

Add custom parameters directly to the conversion event snippet on your confirmation page. Google Ads reads these parameters and maps them to your defined custom variables.

### Setup steps

**Step 1️⃣: Create custom variables in Google Ads**

| **Action** | **Where** |
|-----------|----------|
| Navigate to Tools > Measurement > Conversions | Google Ads UI |
| Click "Custom Variables" tab | Top navigation within Conversions |
| Click "+ Custom Variable" | Create each variable |
| Enter variable name (e.g., `lead_score`) | Must match exactly what you send in the tag |
| Save and enable | Variable is now active |

**Step 2️⃣: Add parameters to conversion snippet**

```javascript
gtag('event', 'conversion', {
  'send_to': 'AW-XXXXXXXXX/XXXXXXXXXXXXX',
  'transaction_id': 'LEAD-2024-4521',
  'value': 500,
  'currency': 'USD',
  'lead_score': 'A',
  'company_size': 'Enterprise',
  'monthly_spend': '10000-50000'
});
```

**Step 3️⃣: Verify data flow**

Custom variable data appears in reports within 24-48 hours of the first conversion with variable data.

### gtag parameter rules

| **Rule** | **Details** |
|----------|------------|
| Parameter names | Must exactly match the custom variable name created in Google Ads UI |
| Parameter values | String values (Google treats all values as categorical segments) |
| Case sensitivity | Variable names are case-sensitive: `lead_score` is not `Lead_Score` |
| Empty values | Omitting a parameter for some conversions is allowed (shows as "unspecified") |
| Max parameters | Up to 5 custom variables per conversion event |

---

## Implementation method 2: OCT import (offline conversion upload)

### How it works

Include custom variable columns in your offline conversion upload file. This method works for any conversion imported via Offline Conversion Tracking, including CRM-based lead qualification events.

### Setup steps

**Step 1️⃣: Create custom variables in Google Ads**

Same process as gtag: Tools > Measurement > Conversions > Custom Variables. Create each variable before uploading.

**Step 2️⃣: Add columns to upload template**

Add columns using the `cv.` prefix followed by the exact variable name:

| **Standard columns** | **Custom variable columns** |
|---------------------|---------------------------|
| `Google Click ID` | `cv.lead_score` |
| `Conversion Name` | `cv.company_size` |
| `Conversion Time` | `cv.monthly_spend` |
| `Conversion Value` | |
| `Conversion Currency` | |

**Example upload row:**

| Google Click ID | Conversion Name | Conversion Time | Conversion Value | Conversion Currency | cv.lead_score | cv.company_size |
|----------------|----------------|-----------------|-----------------|--------------------|--------------:|----------------:|
| EAIaIQobChMI... | Qualified Lead | 2024-02-01 14:30:00 | 500 | USD | A | Enterprise |

### OCT column rules

| **Rule** | **Details** |
|----------|------------|
| Column prefix | Always `cv.` followed by exact variable name |
| Variable must exist first | Create in Google Ads UI before uploading |
| Column is optional per row | Rows without a value show as "unspecified" in reports |
| Values are strings | Even numeric values are treated as categorical segments |
| Upload frequency | Include custom variable columns in every upload batch |

---

## Variable activation

### Manual creation (recommended)

Create each variable manually in Google Ads before sending data. This ensures exact name matching and avoids surprises.

| **Step** | **Action** |
|----------|-----------|
| 1 | Go to Tools > Measurement > Conversions |
| 2 | Click "Custom Variables" tab |
| 3 | Click "+ Custom Variable" |
| 4 | Enter name (must match tag/upload parameter exactly) |
| 5 | Save |
| 6 | Repeat for each variable (max 5) |

### Auto-detection (gtag only)

For gtag implementations, Google can auto-detect new parameters sent with conversion events and prompt you to activate them. This is less reliable than manual creation.

| **Auto-detection behavior** | **Details** |
|----------------------------|------------|
| Detection delay | May take several days after first conversion with new parameter |
| Activation required | You still need to manually activate the detected variable |
| Not available for OCT | Only works with gtag, not offline uploads |
| Recommendation | Use manual creation for predictable, immediate activation |

---

## Viewing custom variable data

### Report segmentation

| **Step** | **Action** |
|----------|-----------|
| 1 | Open any campaign, ad group, or keyword report |
| 2 | Click the "Segment" icon |
| 3 | Select Conversions > Custom Variables |
| 4 | Choose the specific variable to segment by |
| 5 | Each row splits into segments based on variable values |

### Analysis examples

| **Question** | **Segment by** | **What to look for** |
|-------------|---------------|---------------------|
| Which campaigns bring high-score leads? | `lead_score` | Campaigns with highest % of Score A leads |
| Which keywords attract enterprise clients? | `company_size` | Keywords with disproportionate enterprise share |
| Which ad groups drive high monthly-spend leads? | `monthly_spend` | Ad groups where 50K+ monthly spend leads cluster |

---

## Practical examples by vertical

### Hotel chain (ecommerce)

| **Variable** | **Example values** | **Analysis enabled** |
|-------------|-------------------|---------------------|
| `hotel_name` | "Grand Plaza", "Harbor View", "Mountain Lodge" | Which campaigns drive bookings for which properties |
| `room_rate_category` | "Budget", "Standard", "Premium", "Suite" | Which keywords attract high-value room bookings |
| `customer_loyalty_status` | "New", "Silver", "Gold", "Platinum" | Campaign acquisition vs. retention split |

### Lead gen (B2B services)

| **Variable** | **Example values** | **Analysis enabled** |
|-------------|-------------------|---------------------|
| `company_size` | "1-10", "11-50", "51-200", "201-1000", "1000+" | Which campaigns attract enterprise vs. SMB |
| `monthly_spend` | "Under 5K", "5K-25K", "25K-100K", "100K+" | Identify campaigns driving high-value prospects |
| `lead_score` | "A", "B", "C", "D" | True lead quality by campaign, keyword, ad group |

### SaaS

| **Variable** | **Example values** | **Analysis enabled** |
|-------------|-------------------|---------------------|
| `plan_type` | "Free", "Starter", "Professional", "Enterprise" | Which campaigns drive paid vs. free signups |
| `team_size` | "Solo", "Small Team", "Department", "Organization" | Campaign performance by user segment |
| `use_case` | "Marketing", "Sales", "Support", "Engineering" | Which verticals respond to which campaigns |

---

## Common mistakes

| **Mistake** | **Problem** | **Fix** |
|-------------|-------------|---------|
| Attempting GTM implementation | GTM does not support custom conversion variables natively | Use gtag (hardcoded) or OCT import method |
| Variable name mismatch between tag and UI | Data sent but not mapped, appears as "unspecified" | Copy-paste variable names to ensure exact match (case-sensitive) |
| Creating variables after sending data | Historical data without variables cannot be retroactively tagged | Create variables in Google Ads UI before sending first conversion |
| Using numeric values expecting numeric analysis | All values are categorical strings, not numbers | Design value ranges as categories ("Under 5K", "5K-25K") not raw numbers |
| Exceeding 5 variable limit | Cannot add more than 5 variables per conversion action | Prioritize the 5 most actionable dimensions |
| Not including cv. prefix in OCT uploads | Google ignores columns without the prefix | Always use `cv.variable_name` format in upload headers |

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Conversion Action Reference](../references/Conversion Action Reference.md) | Conversion action settings that custom variables attach to |
| [Measurement Maturity Mental Model](../mental-models/Measurement Maturity Mental Model.md) | Custom variables are an advanced measurement enrichment |
| [Transaction ID Reference](../references/Transaction ID Reference.md) | Transaction IDs sent alongside custom variables |
| [New Customer Data Reference](../references/New Customer Data Reference.md) | New customer parameter complements custom variables |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Segmenting by custom variable requires sufficient volume per segment |

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
