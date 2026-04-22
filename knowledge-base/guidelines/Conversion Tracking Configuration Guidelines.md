# Conversion Tracking Configuration Guidelines
Created: 2026-02-04

Support_ID: GUIDELINE_3
Status: Done
Category: Operational
Reference Type: Guideline
Agent_Readable: Yes
Human_Facing: Yes
Domain: Measurement
Pillar: 5

## Purpose

Provides recommended configuration settings for all conversion tracking features across verticals. Use this as the single source of truth for how each conversion tracking feature should be configured.

---

## What this is / What this is NOT

**This guideline:**

- Recommends specific settings for conversion action configuration
- Prioritizes tracking features by vertical and spend level
- Defines attribution, consent, and enhancement recommendations
- Lists exception conditions for each recommendation

**This guideline does NOT:**

- Explain what each feature does (See: [Conversion Action Reference](../references/Conversion Action Reference.md))
- Provide step-by-step setup instructions (See: [SOP – Set Up Google Ads Conversion Tracking](../sops/SOP – Set Up Google Ads Conversion Tracking.md))
- Validate that setup is complete (See: [Conversion Tracking Setup Checklist](../checklists/Conversion Tracking Setup Checklist.md))
- Cover the strategic framework for measurement maturity (See: [Measurement Maturity Mental Model](../mental-models/Measurement Maturity Mental Model.md))

---

## Conversion action configuration

### Recommended settings by vertical

| Setting | Ecommerce | Lead Gen | SaaS |
|---------|-----------|----------|------|
| **Goal category** | Purchase | Lead / Submit Lead Form | Sign-up / Purchase |
| **Optimization** | Primary | Primary | Primary |
| **Attribution model** | Data-Driven | Data-Driven | Data-Driven |
| **Click-through window** | 30 days (adjust per Path Metrics) | 30-60 days (adjust per sales cycle) | 30-60 days (adjust per trial length) |
| **View-through window** | 1 day | 1 day | 1 day |
| **Engaged-view window** | 3 days | 3 days | 3 days |
| **Counting method** | Every | One | One |
| **Value type** | Dynamic (actual revenue) | Dynamic (estimated or actual deal value) | Dynamic (subscription value) |

### Click-through window calibration

Do not accept the 30-day default without checking your actual conversion lag:

1. Go to Goals > Measurement > Attribution > Path Metrics
2. Check "Average days to conversion"
3. Set the click-through window to at least 2x the average conversion lag

| Average conversion lag | Recommended window |
|-----------------------|-------------------|
| 1-3 days | 7-14 days |
| 4-7 days | 14-30 days |
| 8-14 days | 30-60 days |
| 15-30 days | 60-90 days |

### View-through and engaged-view windows

Keep view-through at 1 day and engaged-view at 3 days unless you have specific upper-funnel attribution needs. Longer windows inflate conversion counts with passive attributions.

**Exception:** Increase view-through to 3-7 days when running dedicated YouTube or Display campaigns and you want to measure their assisted conversion impact through a separate secondary conversion action.

---

## Foundation feature recommendations

These are the core tracking technologies. Implement them in priority order.

| Feature | Recommendation | Minimum spend | Vertical | Priority |
|---------|---------------|--------------|----------|----------|
| Google Ads Conversion Tracking (GACT) | Always implement | Any | All | 1 (required) |
| Transaction ID | Always implement | Any | All | 1 (required) |
| Enhanced Conversions | Always implement | Any | All | 2 (required) |
| Server-Side Tagging (SST) | Recommended | €5,000+/month | All | 3 (recommended) |
| Offline Conversion Tracking (OCT) | Required | Any | Lead Gen, SaaS | 2 (required for lead gen/SaaS) |

### GACT (Google Ads Conversion Tracking)

**Always implement:** This is the foundation. GACT provides the most accurate conversion data for Google Ads Smart Bidding because it tracks within the Google Ads ecosystem directly.

**Exception:** None. Every Google Ads account needs GACT.

### Transaction ID

**Always implement:** Transaction IDs serve two purposes: deduplication (prevents counting the same conversion twice) and enabling Conversion Adjustments (RESTATE/RETRACT).

For ecommerce: pass the order ID as the transaction_id parameter.
For lead gen: pass a unique form submission ID or CRM record ID.

**Exception:** None. The cost of implementation is minimal and the benefits are significant.

### Enhanced Conversions

**Always implement:** Enhanced Conversions use hashed first-party data (email, phone, address) to recover conversions lost to cookie restrictions and cross-device paths.

Minimum data: email address (hashed automatically by the tag).
Recommended data: email + phone number + name + address.

**Exception:** None. Enhanced Conversions are free, privacy-safe, and improve data quality.

### Server-Side Tagging (SST)

**Recommended for accounts spending €5,000+/month:** SST moves tag processing from the browser to a server you control, improving data quality, page speed, and resilience to ad blockers.

Requirements: Google Cloud server container, custom subdomain with SSL, developer involvement.

**Exception:** Accounts under €5,000/month may not justify the infrastructure cost. Revisit when spend grows.

### Offline Conversion Tracking (OCT)

**Required for Lead Gen and SaaS:** OCT imports downstream conversion data (qualified leads, closed deals, subscription purchases) from your CRM back into Google Ads, giving Smart Bidding real business outcomes instead of form submissions.

**Exception:** Ecommerce accounts rarely need OCT unless tracking in-store conversions driven by online ads.

---

## Enhancement feature recommendations

Implement these after the foundation is solid. Priority order varies by vertical.

### Ecommerce priority order

| Priority | Feature | What it does | Recommendation |
|----------|---------|-------------|----------------|
| 1 | Cart Data | Sends product-level purchase data | Implement: enables product-level ROAS analysis |
| 2 | COGS in product feed | Adds cost-of-goods-sold to Shopping/PMax | Implement: enables profit-based bidding |
| 3 | Conversion Adjustments | Corrects for returns and upsells | Schedule regular uploads (daily or weekly) |
| 4 | New Customer Data | Identifies new vs. returning customers | Implement when running NCA (New Customer Acquisition) campaigns |
| 5 | Custom Variables | Segments conversions by custom dimensions | Implement when default segments are insufficient |

### Lead Gen priority order

| Priority | Feature | What it does | Recommendation |
|----------|---------|-------------|----------------|
| 1 | OCT (GCLID-based) | Imports CRM outcomes to Google Ads | Required: upload qualified leads and closed deals |
| 2 | Conversion Adjustments | Updates lead values as deals progress | Schedule uploads as CRM stages update |
| 3 | Custom Variables | Segments by lead source, quality tier, etc. | Implement when default segments are insufficient |
| 4 | New Customer Data | Identifies new vs. existing customers | Implement when acquisition vs. retention distinction matters |

### SaaS priority order

| Priority | Feature | What it does | Recommendation |
|----------|---------|-------------|----------------|
| 1 | OCT (GCLID-based) | Imports trial-to-paid and subscription data | Required: upload paid conversions and LTV data |
| 2 | Conversion Adjustments | Updates subscription values (upgrades, churn) | Schedule uploads as subscription status changes |
| 3 | Custom Variables | Segments by plan type, trial source, etc. | Implement when default segments are insufficient |
| 4 | New Customer Data | Identifies new signups vs. returning users | Implement when acquisition campaigns are distinct |

---

## Attribution recommendations

### Model selection

**Always use Data-Driven Attribution (DDA):** It provides the most accurate credit distribution across touchpoints. Last Click Attribution systematically under-credits upper and mid-funnel interactions.

**Exception:** None. DDA is the recommended default for all accounts.

### GA4 cross-channel attribution

If importing GA4 events as conversion actions, consider enabling the "paid and organic channels" attribution setting in GA4. This reduces over-attribution to paid clicks by including organic touchpoints in the model.

| Setting | Effect | Recommended for |
|---------|--------|----------------|
| Google paid channels only (default) | All credit goes to Google Ads touchpoints | Accounts that only use Google Ads |
| Paid and organic channels | Credit distributed across paid and organic Google touchpoints | Accounts with significant organic traffic |

### Over-attribution calibration

Google Ads typically over-attributes conversions compared to backend data. Know your over-attribution ratio and adjust targets accordingly.

**Recalibration formula:** If Google reports 300% ROAS but backend shows 220%, set target ROAS to ~410% in Google Ads (300 / 220 x 300) to achieve real 300% performance.

---

## Consent Mode recommendations

### When required

| Region | Requirement |
|--------|------------|
| EU/EEA | Required by law (GDPR) |
| UK | Required by law (UK GDPR) |
| California | Recommended (CCPA) |
| All other regions | Recommended (future-proofing) |

### Implementation

| Setting | Recommendation |
|---------|---------------|
| CMP (Consent Management Platform) | Use a Google-certified CMP from the CMP gallery in GTM |
| Consent Mode version | V2 (required since March 2024) |
| Consent signals | Enable all four: `ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization` |
| Default consent state | Set to "denied" for EU/EEA users, "granted" for other regions |
| Conversion modeling | Enabled automatically when Consent Mode is active |

### Consent Mode health check

After implementation, verify in Google Ads:

| Check | Expected |
|-------|----------|
| Consent Mode status | Active |
| Conversion modeling | Active, showing modeled conversions |
| Modeling uplift | 5-20% (reasonable range) |

> ⚠️ **If modeling uplift exceeds 50%, investigate:** This suggests a very high consent denial rate or a misconfiguration. Check that your CMP is displaying correctly and that the default consent state is set appropriately for each region.

---

## Conversion Adjustments recommendations

| Vertical | Recommendation | Frequency |
|----------|---------------|-----------|
| Ecommerce | Schedule regular uploads for returns and partial returns | Daily or weekly |
| Lead Gen | Upload as CRM stages update (lead qualified, deal closed, deal lost) | Weekly or as events occur |
| SaaS | Upload as subscription events happen (upgrade, downgrade, churn) | Weekly or as events occur |

**Upload all adjustments, not just Google-attributed ones:** You cannot determine which conversions Google attributed. Upload everything and let Google match.

**Exception:** If your return rate is under 2% and average order values are consistent, the impact of adjustments is minimal. Still recommended but lower priority.

---

## Data Exclusions recommendations

| Situation | Action | Timing |
|-----------|--------|--------|
| Tracking outage detected | Apply Data Exclusion immediately | Within hours of detection |
| Website downtime | Apply exclusion covering the full downtime window | As soon as site is restored |
| Payment processor failure | Apply exclusion for affected period and devices | As soon as processor is restored |
| Tagging error deployed | Apply exclusion, then fix the tag | Immediately |

**Document every tracking outage** in a log (spreadsheet or project management tool) and apply the corresponding Data Exclusion within 24 hours.

**Exception:** If the outage lasted less than 1 hour and affected less than 5% of daily traffic, the impact on Smart Bidding is negligible. Use judgment.

---

## Configuration verification

After setting up or auditing conversion tracking, verify these settings:

| Feature | Check | Expected |
|---------|-------|----------|
| Primary conversion action | Exists and fires correctly | At least one macro conversion set to Primary |
| Attribution model | Set to DDA | Data-Driven for all conversion actions |
| Click-through window | Matches sales cycle | 2x average conversion lag |
| Counting method | Matches vertical | Every (ecommerce), One (lead gen/SaaS) |
| Transaction ID | Populated on conversions | Unique value per conversion |
| Enhanced Conversions | Enabled and healthy | Diagnostics page shows active status |
| Consent Mode | Active with modeling | V2 signals active, modeling within 5-20% |
| Conversion Adjustments | Uploading regularly | Schedule configured (ecommerce, lead gen) |
| Data Exclusions | Applied for any outages | No unaddressed tracking outages |

---

## Exception conditions summary

| Recommendation | Exception | Alternative |
|---------------|-----------|-------------|
| DDA attribution | None | Always use DDA |
| 30-day click window | Sales cycle shorter or longer | Calibrate via Path Metrics |
| 1-day view-through | Upper funnel measurement needs | Increase to 3-7 days on a separate secondary action |
| SST implementation | Spend under €5,000/month | Revisit when spend grows |
| OCT for lead gen | None for lead gen/SaaS | Always implement for these verticals |
| Daily adjustment uploads | Return rate under 2% | Weekly is acceptable |
| Consent Mode | Non-EU/EEA accounts with no regulatory requirement | Still recommended for future-proofing |

---

## Related documents

| Document | Relationship |
|----------|--------------|
| [Conversion Action Reference](../references/Conversion Action Reference.md) | Detailed settings for each conversion action option |
| [Conversion Adjustments Reference](../references/Conversion Adjustments Reference.md) | RESTATE and RETRACT adjustment types |
| [Data Exclusions Reference](../references/Data Exclusions Reference.md) | Time-period data exclusion feature |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Minimum volumes for bid strategies |
| [Measurement Maturity Mental Model](../mental-models/Measurement Maturity Mental Model.md) | Strategic framework for measurement progression |
| [Conversion Tracking Setup Checklist](../checklists/Conversion Tracking Setup Checklist.md) | Validates setup completeness |
| [Conversion Data Quality Checklist](../checklists/Conversion Data Quality Checklist.md) | Validates ongoing data quality |
| [SOP – Set Up Google Ads Conversion Tracking](../sops/SOP – Set Up Google Ads Conversion Tracking.md) | Step-by-step implementation |

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
