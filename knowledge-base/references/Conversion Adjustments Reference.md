# Conversion Adjustments Reference
Created: 2026-02-04

Support_ID: CHEATSHEET_22
Status: Done
Category: Operational
Reference Type: Cheat Sheets
Agent_Readable: Yes
Human_Facing: Yes
Domain: Measurement
Pillar: 5

## Purpose

Documents the two types of conversion adjustments (RESTATE and RETRACT) for correcting conversion data after the initial conversion event. Covers upload format, requirements, timing, and reporting impact.

---

## What this reference is / What this is NOT

**This reference:**

- Defines RESTATE and RETRACT adjustment types with use cases
- Documents the upload format, required columns, and configuration
- Explains the impact on reporting and Smart Bidding
- Lists prerequisites and common mistakes

**This reference does NOT:**

- Explain how to set up conversion tracking (See: [SOP – Set Up Google Ads Conversion Tracking](../sops/SOP – Set Up Google Ads Conversion Tracking.md))
- Cover time-period-based data corrections (See: [Data Exclusions Reference](../references/Data Exclusions Reference.md))
- Define conversion action types or settings (See: [Conversion Action Reference](../references/Conversion Action Reference.md))
- Provide the strategic framework for measurement maturity (See: [Measurement Maturity Mental Model](../mental-models/Measurement Maturity Mental Model.md))

---

## Why conversion adjustments exist

A customer's path does not end at conversion. Purchases get returned, reservations get cancelled, leads turn out to be fraudulent, and upsells happen after the initial transaction. Without adjustments, Google Ads data drifts from reality, and Smart Bidding optimizes toward inaccurate signals.

Conversion adjustments solve this by letting you correct individual conversion records after the fact: change the value (RESTATE) or remove the conversion entirely (RETRACT).

---

## Quick reference: adjustment types

| Type | What it does | Conversion count | Conversion value | Use when |
|------|-------------|-----------------|-----------------|----------|
| **RESTATE** | Changes the conversion value, keeps the conversion | Unchanged | Updated to new value | Partial return, upsell, lead value update |
| **RETRACT** | Removes the conversion entirely | Reduced by 1 | Set to zero | Full return, fraud, test conversion, cancellation |

---

## 1. RESTATE: change the value, keep the conversion

RESTATE adjusts the monetary value of a conversion without removing it from your conversion count. Use this when a conversion is still valid but the value changed.

### RESTATE examples

| Scenario | Original value | Adjusted value | Why |
|----------|---------------|----------------|-----|
| Partial return (ecommerce) | €500 | €377 | Customer returned one item from the order |
| Upsell after purchase (ecommerce) | €500 | €750 | Customer added items post-checkout |
| Lead value update (lead gen) | €100 (estimated) | €2,500 (actual deal value) | CRM updated with actual closed deal value |
| Subscription upgrade (SaaS) | €29/mo | €99/mo | Customer upgraded plan within attribution window |
| Order price adjustment (ecommerce) | €200 | €180 | Post-purchase discount or coupon applied |

### How RESTATE affects data

| Metric | Impact |
|--------|--------|
| Conversions column | No change |
| Conversion value column | Updated to new value |
| CPA | No change (count unchanged) |
| ROAS | Updated (value changed) |
| Smart Bidding (tCPA) | No direct impact from value change |
| Smart Bidding (tROAS) | Algorithm learns from corrected values |

---

## 2. RETRACT: remove the conversion entirely

RETRACT permanently removes a conversion from your data. The conversion and its value are both removed from your primary reporting columns.

### RETRACT examples

| Scenario | Why retract |
|----------|------------|
| Fully returned order | Customer returned the entire order, no revenue generated |
| Fraudulent transaction | Payment reversed due to fraud |
| Test conversion | Internal test order polluting data |
| Cancelled reservation | Customer cancelled before service was delivered |
| Duplicate order | System error created a duplicate conversion |
| Chargeback | Payment processor reversed the charge |

### How RETRACT affects data

| Metric | Impact |
|--------|--------|
| Conversions column | Reduced by 1 |
| Conversion value column | Reduced by original value |
| CPA | Increases (fewer conversions, same cost) |
| ROAS | Decreases (less value, same cost) |
| Smart Bidding (tCPA) | Algorithm learns to avoid similar patterns |
| Smart Bidding (tROAS) | Algorithm learns to avoid similar patterns |

---

## 3. Prerequisites

Before you can upload conversion adjustments, you must have one of these identifiers already in place:

| Identifier | Used for | How to implement |
|------------|----------|-----------------|
| **Transaction ID** | Online conversions (ecommerce) | Pass the `transaction_id` parameter in your purchase event tag |
| **GCLID** | Offline conversions (lead gen, SaaS) | Capture the GCLID from the URL and store it in your CRM |

> ⚠️ **Transaction ID or GCLID must be in place BEFORE you need adjustments:** You cannot retroactively add a transaction ID to past conversions. If you do not have either identifier configured, conversion adjustments will not work.

---

## 4. Upload format

The upload file (Google Sheet or CSV) requires six columns:

| Column | Description | Required | Example |
|--------|------------|----------|---------|
| **Order ID / GCLID** | Transaction ID (ecommerce) or Google Click ID (lead gen) | Yes | `ORD-12345` or `CjwKCAjw...` |
| **Conversion Name** | Exact name of the conversion action in Google Ads | Yes | `Purchase` |
| **Adjustment Time** | Date and time the adjustment event occurred (not the upload date) | Yes | `2026-01-15 14:30:00` |
| **Adjustment Type** | `RESTATE` or `RETRACT` | Yes | `RETRACT` |
| **Adjusted Value** | New conversion value (RESTATE only) | RESTATE only | `377.00` |
| **Adjusted Value Currency** | ISO currency code | RESTATE only | `USD` or `EUR` |

### Critical upload rules

1. **Use the event date, not the upload date:** The Adjustment Time must be when the return/cancellation/upsell happened, not when you are uploading the file.
2. **Leave value columns empty for RETRACT:** If you enter a value (even zero) with a RETRACT type, Google returns an error.
3. **Use exact conversion action names:** The Conversion Name must match the name in Google Ads exactly, including capitalization and spacing.
4. **Upload ALL adjustments, not just Google-attributed ones:** You cannot know which orders were attributed to Google Ads. Upload every adjustment from your backend. Google matches the ones it can and ignores the rest. Errors for unmatched conversions are expected and harmless.
5. **Use ISO currency codes:** Look up the correct code for your currency (USD, EUR, GBP, etc.).

---

## 5. Upload methods

| Method | How | Best for |
|--------|-----|----------|
| **Manual upload** | Google Ads > Tools > Measurement > Conversions > Uploads > click "+" | Low-volume accounts, testing |
| **Scheduled Google Sheets** | Link a Google Sheet and set an upload schedule | Medium-volume accounts, automated exports |
| **Google Ads API** | Programmatic upload via API | High-volume accounts, full automation |

### Manual upload steps

1. Go to Tools > Measurement > Conversions > Uploads
2. Click the "+" button to create a new upload
3. Select your file (Google Sheet or CSV)
4. Review the preview for errors
5. Confirm the upload

### Scheduled uploads

1. Prepare a Google Sheet in the required format
2. Automate the Sheet population from your ecommerce platform or CRM (work with your developer)
3. In Google Ads, link the Sheet as a scheduled upload source
4. Set the frequency (daily recommended for ecommerce)

---

## 6. Timing

Upload conversion adjustments as soon as possible after the event occurs. The sooner the data reaches Google Ads, the faster Smart Bidding can incorporate the corrected signals.

| Timing | Impact |
|--------|--------|
| Same day | Maximum bidding benefit, most accurate real-time data |
| Within 1 week | Strong bidding benefit, minor reporting lag |
| Within 30 days | Moderate bidding benefit, noticeable reporting lag |
| After 30+ days | Minimal bidding benefit, historical correction only |

> 💡 **Automate your adjustment uploads:** For ecommerce accounts with meaningful return rates, work with your developer to push returned/adjusted orders to a Google Sheet automatically. Daily scheduled uploads keep your data clean and your bidding sharp.

---

## 7. Impact on reporting

After uploading adjustments, you can view their impact in Google Ads:

**How to view:** Add the segment Conversions > Conversion Adjustment to any report. This shows the original conversion data alongside the adjustments applied.

| Report column | Shows |
|---------------|-------|
| Conversions | Updated count (after RETRACT removals) |
| Conversion value | Updated value (after RESTATE and RETRACT) |
| All conversions | Updated count including secondary actions |
| Conversion adjustment | The delta between original and adjusted data |

---

## 8. Impact on bidding

| Strategy | Impact of RESTATE | Impact of RETRACT |
|----------|------------------|------------------|
| Target CPA | No direct impact (count unchanged) | Algorithm learns which clicks led to retracted conversions |
| Target ROAS | Algorithm adjusts to corrected values | Algorithm adjusts to zero value for retracted conversions |
| Maximize Conversions | No direct impact | Algorithm learns to avoid retracted patterns |
| Maximize Conversion Value | Algorithm adjusts to corrected values | Algorithm adjusts to zero value |

Both adjustment types provide Smart Bidding with more accurate historical data, leading to better bid predictions over time. This is especially valuable for ecommerce accounts with significant return rates.

---

## Common mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| No Transaction ID configured | Cannot adjust online conversions | Implement Transaction ID in purchase event tag before needing adjustments |
| Entering a value for RETRACT | Upload returns an error | Leave Adjusted Value and Currency columns empty for RETRACT rows |
| Using upload date instead of event date | Adjustment is logged at wrong time, distorts time-based reports | Use the date the return/cancellation/upsell actually happened |
| Only uploading Google-attributed adjustments | Misses adjustments for conversions you cannot identify as Google-attributed | Upload all adjustments from your backend, let Google match them |
| Wrong conversion action name | Adjustment fails to match | Copy the exact name from Google Ads (case-sensitive) |
| Uploading months after the event | Minimal bidding benefit | Automate uploads, target same-day or within one week |
| Not uploading partial returns | ROAS data inflated by unreturned portion | RESTATE with the actual retained value |

---

## Decision guide: RESTATE vs. RETRACT

| Situation | Use | Rationale |
|-----------|-----|-----------|
| Customer returned part of an order | RESTATE | Conversion is valid, value changed |
| Customer returned the entire order | RETRACT | No revenue, conversion should not exist |
| Customer upgraded or added items | RESTATE | Conversion is valid, value increased |
| Lead qualified with known deal value | RESTATE | Update estimated value to actual value |
| Fraudulent order detected | RETRACT | Conversion was not legitimate |
| Test/internal conversion | RETRACT | Should never have been counted |
| Customer cancelled before delivery | RETRACT | No revenue generated |
| Price adjustment after purchase | RESTATE | Conversion is valid, value decreased |

---

## Related documents

| Document | Relationship |
|----------|--------------|
| [Conversion Action Reference](../references/Conversion Action Reference.md) | Conversion action types and settings that adjustments modify |
| [Data Exclusions Reference](../references/Data Exclusions Reference.md) | Time-period-based data corrections (different from individual adjustments) |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Volume requirements affected by retracted conversions |
| [Measurement Maturity Mental Model](../mental-models/Measurement Maturity Mental Model.md) | Where conversion adjustments fit in the measurement stack |
| [Conversion Tracking Configuration Guidelines](../guidelines/Conversion Tracking Configuration Guidelines.md) | Recommended configuration including adjustment scheduling |
| [Conversion Data Quality Checklist](../checklists/Conversion Data Quality Checklist.md) | Validates that adjustments are being uploaded regularly |
| [SOP – Set Up Google Ads Conversion Tracking](../sops/SOP – Set Up Google Ads Conversion Tracking.md) | Implementation steps including Transaction ID setup |

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
