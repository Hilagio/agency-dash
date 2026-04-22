# SOP – Configure Conversion Adjustments
Created: 2026-02-04

Agent_Executable: No
Category: Measurement
Human_Approval_Required: No
Primary Outcome: Conversion adjustments (restate/retract) uploading regularly to correct conversion data
SOP_ID: SOP_30
Status: Done
Domain: Measurement
Pillar: 5

### Purpose

This SOP walks you through preparing a conversion adjustment upload template, populating it with return/cancellation data, uploading adjustments to Google Ads, and validating the adjusted values in your reports.

> ❓ **The big question:** Are your Smart Bidding algorithms learning from accurate, post-sale conversion data that reflects returns, cancellations, and value changes?

---

### What this SOP is NOT

This SOP does **not:**

- Set up basic conversion tracking (prerequisite: conversion action must already exist)
- Implement transaction ID deduplication (See: [SOP – Implement Transaction ID Deduplication](../sops/SOP – Implement Transaction ID Deduplication.md))
- Configure offline conversion imports for new conversions (separate workflow)
- Adjust bidding strategies based on adjusted data (downstream optimization)

### When to run this SOP

Run this SOP when:

- Products are returned or orders are cancelled after conversion tracking fires
- Lead quality varies and you want to retract low-quality conversions
- Conversion values change after the initial transaction (partial refunds, upsells)
- Smart Bidding is optimizing against inaccurate conversion data

---

### Before you start

#### Required inputs

- Google Ads account with purchase or lead conversion actions active
- Transaction IDs or GCLIDs for each conversion to adjust
- Backend data on returns, cancellations, or value changes
- Exact conversion action names as they appear in Google Ads
- Adjustment data within 55 days of the original conversion

#### Reference documents (have open)

| Document | Used for |
|----------|----------|
| Google Ads conversion action names | Exact names for the upload template |
| Backend/ERP export of returns and cancellations | Source data for adjustments |
| Google Ads upload template format | Column structure and formatting |

---

### Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Prepare Upload Template** | Create the Google Sheet with correct columns and formatting | Ready-to-populate adjustment template |
| **Phase 2️⃣: Populate with Adjustment Data** | Fill the template with return/cancellation data from backend | Completed adjustment file |
| **Phase 3️⃣: Upload** | Submit adjustments to Google Ads | Processed upload with confirmation |
| **Phase 4️⃣: Validate** | Verify adjusted values appear in reports | Conversion adjustment segment showing correct data |

---

## Phase 1️⃣: Prepare Upload Template

### 1.1 Create the template

Create a Google Sheet or CSV with these exact column headers:

| Column | Required | Description |
|--------|----------|-------------|
| Order ID | Yes (or GCLID) | Transaction ID from the original conversion |
| Google Click ID | Yes (or Order ID) | GCLID from the original click |
| Conversion Name | Yes | Exact name of the conversion action in Google Ads |
| Adjustment Time | Yes | When the adjustment occurred (return date, cancellation date) |
| Adjustment Type | Yes | `RESTATE` or `RETRACT` |
| Adjusted Value | Conditional | New conversion value (RESTATE only) |
| Adjusted Currency Code | Conditional | Currency code (RESTATE only) |

### 1.2 Set the timezone

At the top of the file (row 1), add the timezone parameter:

```
Parameters:TimeZone=America/New_York
```

Use the IANA timezone that matches your Google Ads account timezone.

### 1.3 Understand adjustment types

| Type | What it does | When to use | Value columns |
|------|-------------|-------------|---------------|
| RESTATE | Changes the conversion value | Partial refund, price adjustment, upsell | Required: new value and currency |
| RETRACT | Removes the conversion entirely | Full cancellation, fraudulent order, spam lead | Leave value columns EMPTY |

> ⚠️ **RETRACT rows must leave value columns empty:** Including a value in a RETRACT row causes the upload to fail. Only RESTATE rows include adjusted value and currency.

---

## Phase 2️⃣: Populate with Adjustment Data

### 2.1 Export return and cancellation data

1. Export from your backend/ERP: all returns, cancellations, and value changes since the last upload
2. Include the transaction ID (order ID) for each record
3. Include the date of the return/cancellation
4. Include the refund amount (for partial refunds) or full cancellation flag

### 2.2 Map to the upload format

For each adjustment record:

**Full cancellation (RETRACT):**

| Order ID | Google Click ID | Conversion Name | Adjustment Time | Adjustment Type | Adjusted Value | Adjusted Currency Code |
|----------|----------------|-----------------|-----------------|-----------------|----------------|----------------------|
| ORD-98765 | | Purchase | 2026-01-28 14:30:00 | RETRACT | | |

**Partial refund (RESTATE):**

| Order ID | Google Click ID | Conversion Name | Adjustment Time | Adjustment Type | Adjusted Value | Adjusted Currency Code |
|----------|----------------|-----------------|-----------------|-----------------|----------------|----------------------|
| ORD-98766 | | Purchase | 2026-01-29 10:15:00 | RESTATE | 75.00 | USD |

**Lead retraction (RETRACT):**

| Order ID | Google Click ID | Conversion Name | Adjustment Time | Adjustment Type | Adjusted Value | Adjusted Currency Code |
|----------|----------------|-----------------|-----------------|-----------------|----------------|----------------------|
| LEAD-a7b3c9 | | Lead Submit | 2026-01-30 09:00:00 | RETRACT | | |

### 2.3 Include ALL adjustments, not just Google-attributed

Upload adjustments for all conversions, regardless of attribution source. Google Ads matches by transaction ID or GCLID and only applies adjustments to Google-attributed conversions. Non-matching rows are safely ignored.

> 💡 **Upload everything, let Google match:** Sending all returns and cancellations is simpler than filtering to Google-only conversions. Google ignores rows it cannot match.

### 2.4 Use exact conversion action names

1. Go to Google Ads > Goals > Conversions > Summary
2. Copy the exact name of each conversion action
3. Paste into the Conversion Name column

The name must match exactly, including capitalization and spacing.

---

## Phase 3️⃣: Upload

### 3.1 Manual upload

1. Go to Google Ads > Goals > Conversions > Uploads
2. Click the "+" button
3. Select "Upload file" and choose your CSV or Google Sheet
4. Review the preview for errors
5. Click "Apply"

### 3.2 Scheduled upload (recommended for ongoing use)

1. Go to Google Ads > Goals > Conversions > Uploads > Schedules
2. Create a new schedule
3. Link to a Google Sheet that is updated regularly
4. Set frequency: daily or weekly depending on return volume
5. Save the schedule

| Upload frequency | Best for | Minimum return volume |
|-----------------|----------|----------------------|
| Daily | High-volume ecommerce (100+ daily returns) | 50+ adjustments per upload |
| Weekly | Medium-volume or lead gen | 10+ adjustments per upload |
| Bi-weekly | Low-volume businesses | Any |

### 3.3 Review upload results

After upload, check the processing status:

| Status | Meaning | Action |
|--------|---------|--------|
| Successfully applied | Adjustment processed | None |
| Not matched | Transaction ID/GCLID not found | Verify ID accuracy, check conversion happened within 55 days |
| Error | Column format or data issue | Fix the flagged rows and re-upload |

> ⚠️ **Upload ASAP for best Smart Bidding impact:** The sooner adjustments reach Google Ads, the sooner Smart Bidding learns from corrected data. Delays reduce the bidding benefit.

---

## Phase 4️⃣: Validate

### 4.1 Check the Conversion Adjustment segment

1. Go to Google Ads > Campaigns
2. Click Segment > Conversions > Conversion Adjustment
3. Review the data:

| Segment value | What it shows |
|---------------|--------------|
| Original | The initially recorded conversion data |
| Adjusted | The corrected data after adjustments |
| Retracted | Conversions that were fully removed |

### 4.2 Verify adjusted values

1. Select a specific campaign or date range where you know adjustments were applied
2. Compare the "Adjusted" conversion value against your backend records
3. Confirm retracted conversions no longer count toward the total

### 4.3 Monitor adjustment coverage

Track your adjustment rate over time:

| Metric | How to calculate | Healthy range |
|--------|-----------------|---------------|
| Adjustment rate | Adjusted conversions / Total conversions | Depends on business, but consistent month-over-month |
| Retraction rate | Retracted conversions / Total conversions | Should match your return/cancellation rate |
| Average adjustment lag | Days between conversion and adjustment upload | Under 14 days ideal |

### 4.4 Final checklist

- [ ] Upload template has correct columns and timezone setting
- [ ] RETRACT rows have empty value columns
- [ ] RESTATE rows have adjusted value and currency
- [ ] Conversion action names match Google Ads exactly
- [ ] Upload processed successfully (check status)
- [ ] Conversion Adjustment segment shows adjusted data
- [ ] Scheduled upload is active (for ongoing use)

---

### Validation and definition of done

This SOP is complete when:

- [ ] Upload template is created with correct format
- [ ] First batch of adjustments is uploaded successfully
- [ ] Google Ads shows adjusted conversion data in the Conversion Adjustment segment
- [ ] RETRACT and RESTATE types are both verified
- [ ] Ongoing upload schedule is configured (daily or weekly)

---

### Exit → Entry bridge

Once conversion adjustments are flowing:

| Timeframe | Action |
|-----------|--------|
| Immediately | Smart Bidding begins learning from corrected data |
| After 7 days | Compare adjusted conversion data against backend |
| After 30 days | Evaluate Smart Bidding performance improvement from cleaner data |

**If issues arise:**

| Issue | Route to |
|-------|----------|
| Upload errors on specific rows | Check column formatting and conversion action names |
| Adjustments not matching | Verify transaction IDs match original conversions |
| Smart Bidding not improving | Check adjustment lag: upload faster, ensure consistent volume |

---

### FAQ

**Q: How soon after a return should I upload the adjustment?**

A: As soon as possible. Adjustments uploaded within 7 days of the original conversion have the most impact on Smart Bidding. The maximum window is 55 days.

**Q: What if I only have the GCLID, not the Order ID?**

A: You can use either. GCLID is the Google Click ID from the original click. Order ID is the transaction ID sent with the conversion. One is sufficient.

**Q: Do adjustments affect historical reporting?**

A: Yes. Adjusted values replace original values in all reports, including historical date ranges. The original value is still visible via the Conversion Adjustment segment.

---

### Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Implement Transaction ID Deduplication](../sops/SOP – Implement Transaction ID Deduplication.md) | Upstream: transaction IDs are required for adjustment matching |
| [SOP – Set Up Cart Data and Profit Tracking](../sops/SOP – Set Up Cart Data and Profit Tracking.md) | Parallel: adjustments correct the profit data cart tracking provides |
| [SOP – Set Up Data Exclusions](../sops/SOP – Set Up Data Exclusions.md) | Related: data exclusions handle tracking outages, adjustments handle individual conversion corrections |

---

### Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| RETRACT rows include a value | Template error, value not cleared | Always leave value and currency empty for RETRACT |
| Conversion name mismatch | Name in file doesn't match Google Ads exactly | Copy-paste from Google Ads, never type manually |
| Adjustments uploaded too late | Batch process runs infrequently | Set up daily or weekly scheduled uploads |
| Missing transaction IDs | Original conversion didn't send a transaction ID | Fix deduplication first (SOP_28), then adjustments work |

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
