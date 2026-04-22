# Data Exclusions Reference
Created: 2026-02-04

Support_ID: CHEATSHEET_23
Status: Done
Category: Operational
Reference Type: Cheat Sheets
Agent_Readable: Yes
Human_Facing: Yes
Domain: Measurement
Pillar: 5

## Purpose

Documents the Data Exclusions feature for telling Smart Bidding to ignore specific time periods where conversion data was compromised. Covers when to use, configuration options, limitations, and the distinction from Conversion Adjustments.

---

## What this reference is / What this is NOT

**This reference:**

- Defines what Data Exclusions do and when to use them
- Documents configuration options, scope, and limitations
- Explains the difference between Data Exclusions and Conversion Adjustments
- Lists common mistakes and decision criteria

**This reference does NOT:**

- Cover individual conversion corrections (See: [Conversion Adjustments Reference](../references/Conversion Adjustments Reference.md))
- Explain conversion action settings (See: [Conversion Action Reference](../references/Conversion Action Reference.md))
- Provide step-by-step tracking setup (See: [SOP – Set Up Google Ads Conversion Tracking](../sops/SOP – Set Up Google Ads Conversion Tracking.md))

---

## What Data Exclusions do

Data Exclusions tell Smart Bidding to ignore all conversion data from a specific time period. During the excluded window, Smart Bidding acts as if no conversion data exists: it does not learn from that period's results and does not factor them into bid predictions.

This is critical when a technical failure causes conversion data to be artificially low (or zero) for a period of time. Without an exclusion, Smart Bidding interprets the low conversions as poor performance and reduces bids, creating a recovery spiral that can take weeks to correct.

---

## When to use Data Exclusions

| Scenario | Why exclude |
|----------|-----------|
| Conversion tracking outage | Pixel stopped firing, conversions dropped to zero |
| Website downtime | Site was unreachable, no conversions possible |
| Payment processor failure | Checkout broken, purchases could not complete |
| Tagging error deployment | GTM update broke conversion tags |
| 404 errors on conversion pages | Thank-you page or checkout confirmation returning errors |
| Server-side tagging disruption | Server container went down, data stopped flowing |
| CMS update broke tracking | Platform update removed or altered conversion scripts |
| Consent Mode misconfiguration | CMP update blocked all consent signals |

### When NOT to use Data Exclusions

| Situation | Why not | Use instead |
|-----------|---------|-------------|
| Individual conversions are wrong | Exclusions work on time periods, not individual records | [Conversion Adjustments](../references/Conversion Adjustments Reference.md) (RESTATE/RETRACT) |
| Seasonal dip in performance | Low conversions are real data, not tracking errors | Let Smart Bidding learn from the seasonal pattern |
| Campaign restructure caused volume drop | Performance change is real, not a data error | Give the algorithm time to recalibrate |
| Budget reduction lowered conversions | Fewer conversions are expected with less spend | Adjust targets, not data |

---

## Quick reference: Data Exclusions vs. Conversion Adjustments

| | Data Exclusions | Conversion Adjustments |
|--|----------------|----------------------|
| **Scope** | Time period (all conversions in window) | Individual conversions |
| **Purpose** | Ignore corrupted data periods | Correct specific conversion values or remove specific conversions |
| **Trigger** | Tracking outage, site downtime | Returns, cancellations, fraud, upsells |
| **Identifier needed** | None (time-based) | Transaction ID or GCLID |
| **Maximum duration** | 14 days per exclusion | No time limit |
| **Affects** | Smart Bidding predictions only | Reporting columns and Smart Bidding |
| **Location** | Tools > Bid Strategies > Advanced Controls | Tools > Conversions > Uploads |

---

## Configuration

### Location in Google Ads

1. Go to Tools and Settings
2. Click Shared Library
3. Click Bid Strategies
4. On the left side, click Advanced Controls
5. On the top, click Data Exclusions

### Settings

| Setting | Description | Options |
|---------|------------|---------|
| **Name** | Descriptive label for the exclusion | Free text (e.g., "Payment processor outage Jan 5-6") |
| **Description** | Details about what happened | Free text (optional but recommended) |
| **Start date and time** | When the issue began | Date picker + time (hour precision) |
| **End date and time** | When the issue was resolved | Date picker + time (hour precision) |
| **Scope** | Which campaigns are affected | All campaigns, specific campaign types, or specific campaigns |
| **Device targeting** | Which devices were affected | All devices, or specific devices (computer, mobile, tablet) |

### Scope options

| Scope | Use when |
|-------|---------|
| All campaigns | Tracking outage affected the entire account (e.g., global pixel failure) |
| Specific campaign types | Only certain campaign types were affected (e.g., Search but not Shopping) |
| Specific campaigns | Only individual campaigns were affected (e.g., campaigns using a specific landing page) |

### Device targeting

| Device scope | Use when |
|-------------|---------|
| All devices | Issue affected all traffic regardless of device |
| Computer only | Desktop checkout was broken but mobile worked |
| Mobile only | Mobile-specific payment issue or responsive design failure |
| Tablet only | Tablet-specific rendering issue on conversion page |

> 💡 **Be specific with scope and devices:** If only mobile checkout was broken, exclude only mobile devices. Excluding all devices when only one was affected removes valid data that Smart Bidding needs.

---

## Limitations

| Limitation | Detail |
|-----------|--------|
| **Maximum 14 days per exclusion** | A single exclusion cannot span more than 14 days |
| **Can chain multiple exclusions** | For longer outages, create consecutive 14-day exclusions |
| **Do not exclude more than 2-3 weeks total** | Extended exclusions starve the algorithm of data, degrading bid quality |
| **Smart Bidding only** | Data Exclusions affect automated bidding strategies only, not manual CPC |
| **Cannot retroactively fix reports** | Exclusions tell Smart Bidding to ignore the period, they do not change reported conversion numbers |
| **Hour precision** | Start and end times are set to the hour, not the minute |

> ⚠️ **Do not use Data Exclusions for periods longer than 2-3 weeks:** Extended exclusions deprive Smart Bidding of the data it needs to make accurate predictions. If your tracking was broken for more than 3 weeks, consider resetting bid strategy learning periods instead of excluding the entire window.

---

## Best practices

| Practice | Why |
|----------|-----|
| Apply the exclusion as soon as the issue is identified | The longer Smart Bidding trains on bad data, the harder recovery becomes |
| Document the issue in the exclusion name and description | Future reference for you and your team |
| Set precise start and end times | Avoid excluding valid data before or after the issue |
| Match scope to the actual impact | Only exclude campaigns and devices that were affected |
| Verify tracking is fully restored before setting the end time | Premature end time means Smart Bidding resumes learning from still-broken data |
| Log all exclusions in your tracking audit trail | Useful for diagnosing future performance anomalies |

---

## Impact on Smart Bidding

When a Data Exclusion is active:

| Aspect | Behavior |
|--------|----------|
| Bid predictions | Algorithm ignores excluded period, uses surrounding data |
| Learning phase | Excluded period does not count toward or against learning |
| Recovery | Algorithm resumes normal learning after the excluded period ends |
| Historical reports | Conversion data still visible in reports (exclusion only affects bidding) |

### Without Data Exclusions (what goes wrong)

1. Tracking breaks, conversions drop to zero
2. Smart Bidding sees zero conversions and interprets it as poor performance
3. Algorithm drastically reduces bids
4. Traffic drops, even after tracking is fixed
5. Low traffic means fewer conversions, reinforcing the low-bid signal
6. Recovery takes 2-4 weeks of gradually rebuilding

### With Data Exclusions (correct approach)

1. Tracking breaks, conversions drop to zero
2. You apply a Data Exclusion for the affected period
3. Smart Bidding ignores the period entirely
4. Once tracking is restored, bidding resumes from pre-outage baselines
5. Recovery is immediate

---

## Common mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Not applying exclusion after tracking outage | Smart Bidding tanks bids based on zero-conversion data | Apply exclusion immediately when an outage is detected |
| Excluding too long a period (4+ weeks) | Algorithm is starved of data, predictions degrade | Keep exclusions under 2-3 weeks total, consider bid strategy reset for longer outages |
| Using Data Exclusions instead of Conversion Adjustments | Time-period exclusion when only specific conversions are wrong | Use Conversion Adjustments for individual conversion corrections |
| Excluding all campaigns when only one was affected | Valid data removed from unaffected campaigns | Scope the exclusion to affected campaigns only |
| Excluding all devices when only mobile was broken | Valid desktop/tablet data removed | Scope to affected devices only |
| Setting end time before tracking is confirmed restored | Smart Bidding resumes learning from still-broken data | Verify tracking is working before finalizing end time |
| Forgetting to document the exclusion | Future performance anomalies cannot be traced | Always use descriptive names and descriptions |

---

## Decision guide: which tool to use

| Situation | Tool | Why |
|-----------|------|-----|
| Pixel stopped firing for 3 days | Data Exclusion | Time-period issue affecting all conversions |
| Customer returned a €500 order | Conversion Adjustment (RETRACT) | Individual conversion correction |
| Payment processor was down for 6 hours | Data Exclusion | Time-period issue preventing conversions |
| Lead turned out to be fraudulent | Conversion Adjustment (RETRACT) | Individual conversion removal |
| Website was in maintenance mode overnight | Data Exclusion | Time-period issue, no conversions possible |
| Customer's order value changed from €500 to €377 | Conversion Adjustment (RESTATE) | Individual value correction |
| GTM container had wrong trigger for 2 days | Data Exclusion | Time-period tracking error |
| Test conversion needs to be removed | Conversion Adjustment (RETRACT) | Individual conversion removal |

---

## Related documents

| Document | Relationship |
|----------|--------------|
| [Conversion Adjustments Reference](../references/Conversion Adjustments Reference.md) | Individual conversion corrections (complementary feature) |
| [Conversion Action Reference](../references/Conversion Action Reference.md) | Conversion action settings and types |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Volume thresholds affected by excluded periods |
| [Measurement Maturity Mental Model](../mental-models/Measurement Maturity Mental Model.md) | Where data exclusions fit in the measurement stack |
| [Conversion Tracking Configuration Guidelines](../guidelines/Conversion Tracking Configuration Guidelines.md) | Recommended configuration including exclusion protocols |
| [Conversion Data Quality Checklist](../checklists/Conversion Data Quality Checklist.md) | Validates that outages have exclusions applied |
| [SOP – Set Up Google Ads Conversion Tracking](../sops/SOP – Set Up Google Ads Conversion Tracking.md) | Tracking setup that prevents outages |

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
