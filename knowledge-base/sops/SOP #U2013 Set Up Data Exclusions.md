# SOP – Set Up Data Exclusions
Created: 2026-02-04
Updated: 2026-04-02

Agent_Executable: No
Category: Measurement
Human_Approval_Required: No
Primary Outcome: Data exclusion applied to protect Smart Bidding from corrupted conversion data periods
SOP_ID: SOP_31
Status: Done
Domain: Measurement
Pillar: 5

### Purpose

This SOP walks you through documenting a data corruption event, creating a data exclusion in Google Ads, and validating that Smart Bidding ignores the affected period.

> ❓ **The big question:** Did a tracking outage, site issue, or payment failure corrupt your conversion data, and is Smart Bidding now learning from bad signals?

---

### What this SOP is NOT

This SOP does **not:**

- Fix the underlying tracking issue (diagnose and resolve first, then exclude the bad period)
- Replace conversion adjustments for individual conversion corrections (See: [SOP – Configure Conversion Adjustments](../sops/SOP – Configure Conversion Adjustments.md))
- Provide ongoing data quality monitoring (separate operational process)
- Configure Smart Bidding strategies (downstream SOP)

### When to run this SOP

Run this SOP when:

- Conversion tracking was broken for a period (tag removed, GTM error, consent mode misconfiguration)
- The website or checkout was down, causing zero or near-zero conversions
- A payment processor failure prevented transactions from completing
- A technical issue caused duplicate or inflated conversion counts
- Any event that produced abnormal conversion data for a defined time window

---

### Before you start

#### Required inputs

- Google Ads account with Smart Bidding campaigns active
- Start and end datetime of the data corruption period (as precise as possible)
- Description of what happened (for documentation and future reference)
- Knowledge of which campaigns or devices were affected

#### Reference documents (have open)

| Document | Used for |
|----------|----------|
| Google Ads account | Creating the data exclusion |
| Incident log or monitoring tools | Exact start/end times of the issue |

---

### Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Document the Issue** | Record what happened, when, and what was affected | Incident summary with precise timestamps |
| **Phase 2️⃣: Create Data Exclusion** | Apply the exclusion in Google Ads | Active data exclusion for the affected period |
| **Phase 3️⃣: Validate** | Confirm the exclusion is applied and Smart Bidding adjusts | Verified exclusion in Advanced Controls |

---

## Phase 1️⃣: Document the Issue

### 1.1 Identify the corruption event

Determine which type of issue occurred:

| Event type | Symptoms | Common causes |
|------------|----------|---------------|
| Tracking outage | Zero or near-zero conversions during a period | GTM publish error, tag removed, consent mode misconfiguration |
| Site downtime | No conversions, likely no clicks converting | Server outage, hosting issue, CDN failure |
| Payment failure | Clicks and sessions normal, conversions drop to zero | Payment gateway down, checkout broken |
| Duplicate inflation | Conversion count spikes abnormally | Tag firing multiple times, deduplication broken |

### 1.2 Record the exact timestamps

1. Check your monitoring tools, server logs, or Google Ads hourly data
2. Identify the precise start time (when data first became corrupted)
3. Identify the precise end time (when the issue was resolved and data returned to normal)
4. Record both in the timezone matching your Google Ads account

| Field | Value |
|-------|-------|
| Event description | |
| Start datetime | YYYY-MM-DD HH:MM |
| End datetime | YYYY-MM-DD HH:MM |
| Account timezone | |
| Affected scope | All campaigns / Specific campaigns / Specific devices |

### 1.3 Determine the scope

| If... | Scope to use | What it excludes |
|-------|-------------|-----------------|
| Tracking was broken site-wide | All campaigns | Removes all conversion data from all campaigns for the period |
| Only certain campaign types were affected | Specific campaigns | Removes conversion data from selected campaigns only |
| Issue was device-specific (e.g., mobile checkout broken) | Specific devices | Removes conversion data from Mobile, Desktop, or Tablet only |

> 💡 **Combine scopes when needed.** If mobile tracking broke on only Search campaigns, create the exclusion scoped to those specific campaigns AND the Mobile device type.

---

## Phase 2️⃣: Create Data Exclusion

### 2.1 Navigate to Data Exclusions

1. Open Google Ads
2. Go to Tools > Shared Library > Bid Strategies
3. Click "Advanced Controls" in the top navigation
4. Select "Data Exclusions"

### 2.2 Create the exclusion

1. Click the "+" button to add a new data exclusion
2. Fill in the fields:

| Field | What to enter |
|-------|--------------|
| Name | Descriptive name (e.g., "Checkout outage Jan 28-29") |
| Description | Brief explanation of what happened |
| Start date and time | Exact start of the corrupted period |
| End date and time | Exact end of the corrupted period |
| Scope | Select: All campaigns, specific campaigns, or specific devices |

3. If selecting specific campaigns:
   - Check the campaigns that were affected
   - Leave unaffected campaigns unchecked

4. If selecting specific devices:
   - Check only the affected device types (Computer, Mobile, Tablet)

5. Click Save

### 2.3 Review the exclusion summary

After saving, verify the exclusion details:

- [ ] Date range matches the incident window exactly
- [ ] Scope covers all affected campaigns or devices
- [ ] Name and description are clear for future reference

> ⚠️ **Be precise with timestamps:** Excluding too wide a window removes good data that Smart Bidding needs. Excluding too narrow a window leaves corrupted data in the learning set. Use the most precise timestamps available.

---

## Phase 3️⃣: Validate

### 3.1 Confirm the exclusion is active

1. Return to Tools > Shared Library > Bid Strategies > Advanced Controls > Data Exclusions
2. Verify your exclusion appears in the list
3. Confirm the status shows as active
4. Check that the date range and scope are correct

> ⚠️ **Exclusion active vs bidding impact.** An exclusion shows "Active" in the UI immediately. Smart Bidding takes 24-48 hours to fully adjust its models. Do not evaluate bidding performance for 48 hours after applying an exclusion.

### 3.2 Monitor Smart Bidding behavior

After the exclusion is applied:

| Timeframe | What to check |
|-----------|--------------|
| First 24 hours | Smart Bidding may adjust bids as it recalculates without the excluded data |
| First 7 days | CPA/ROAS targets should stabilize as the algorithm adapts |
| After 14 days | Performance should return to pre-incident levels (assuming the root cause is fixed) |

### 3.3 Verify the root cause is resolved

The data exclusion protects Smart Bidding from bad data, but the underlying issue must also be fixed:

- [ ] Tracking is functioning correctly again
- [ ] Test conversions fire properly
- [ ] Conversion data in the last 24 hours matches backend data

> 💡 **Data exclusions are reactive, not preventive:** They tell Smart Bidding to ignore a past period. Set up monitoring and alerts to catch tracking issues faster in the future.

### 3.4 Final checklist

- [ ] Incident documented with precise start/end timestamps
- [ ] Data exclusion created in Google Ads with correct scope
- [ ] Exclusion appears as active in Advanced Controls
- [ ] Root cause of the data corruption is resolved
- [ ] Smart Bidding is adjusting normally post-exclusion

---

### Limitations

Understand these constraints before relying on data exclusions:

| Limitation | Detail |
|------------|--------|
| Maximum duration | 14 days per individual data exclusion |
| Total exclusion window | Do not use more than 2-3 weeks of total excluded data across all exclusions |
| Retroactive only | Cannot exclude future periods (use seasonality adjustments for anticipated changes) |
| Smart Bidding only | Data exclusions only affect Smart Bidding strategies, not manual bidding |
| Data still visible | Excluded data still appears in reports, the exclusion only affects bid optimization |

> ⚠️ **Do not overuse data exclusions:** Excessive exclusions starve Smart Bidding of learning data. If you need to exclude more than 2-3 weeks total, investigate why tracking issues are recurring and fix the root cause.

---

### Validation and definition of done

This SOP is complete when:

- [ ] Data corruption event is documented with precise timestamps
- [ ] Data exclusion is created and active in Google Ads
- [ ] Scope correctly covers all affected campaigns or devices
- [ ] Root cause of the data issue is identified and resolved
- [ ] Smart Bidding performance is monitored for stabilization

---

### Exit → Entry bridge

Once the data exclusion is applied:

| Timeframe | Action |
|-----------|--------|
| Immediately | Resume normal campaign monitoring |
| After 7 days | Check if Smart Bidding performance has stabilized |
| After 30 days | Review whether the exclusion can be removed (if it was a one-time event) |

**If issues arise:**

| Issue | Route to |
|-------|----------|
| Smart Bidding still erratic after exclusion | Verify exclusion covers the full corrupted period |
| Another tracking outage occurs | Run this SOP again for the new incident |
| Recurring data issues | Implement monitoring and alerting to catch issues faster |

---

### FAQ

**Q: Can I edit a data exclusion after creating it?**

A: Yes. You can update the name, description, date range, and scope of an existing data exclusion. Go to Advanced Controls > Data Exclusions, click the exclusion, and edit.

**Q: Should I delete old data exclusions?**

A: No need. Old data exclusions for past periods have no ongoing impact. Keep them for documentation purposes.

**Q: What is the difference between data exclusions and seasonality adjustments?**

A: Data exclusions tell Smart Bidding to ignore bad data from a past period. Seasonality adjustments tell Smart Bidding to expect a temporary change in conversion rates (like a sale or holiday). Use exclusions for data quality issues, seasonality adjustments for anticipated business changes.

---

### Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Configure Conversion Adjustments](../sops/SOP – Configure Conversion Adjustments.md) | Related: adjustments fix individual conversions, exclusions fix entire periods |
| [SOP – Configure Google Consent Mode](../sops/SOP – Configure Google Consent Mode.md) | Related: consent mode issues are a common cause of tracking outages |
| [SOP – Implement Transaction ID Deduplication](../sops/SOP – Implement Transaction ID Deduplication.md) | Related: deduplication failures may require data exclusions for inflated periods |

---

### Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Exclusion window too broad | Imprecise timestamps, rounding to full days | Use hourly data to pinpoint exact start/end |
| Exclusion window too narrow | Issue started before it was noticed | Check monitoring tools for the actual start time, not the discovery time |
| Forgetting to fix the root cause | Focus on the exclusion, forget the underlying issue | Always resolve the tracking problem first, then create the exclusion |
| Overusing exclusions | Multiple incidents eating into Smart Bidding's learning data | Fix recurring tracking issues instead of excluding repeatedly |
| Applying to wrong campaigns | Not verifying scope | Double-check which campaigns were actually affected before scoping |

---

### Version details

- **Version:** 2.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

### Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
