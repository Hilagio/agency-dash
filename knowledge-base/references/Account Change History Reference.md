# Account Change History Reference
Created: 2026-02-11

Agent_Readable: Yes
Category: Monitoring
Human_Facing: Yes
Reference Type: Cheat Sheets
Status: Done
Support_ID: CHEATSHEET_47
Domain: Operational
Pillar: 0

## Purpose

Documents the Google Ads Change History feature: what changes are logged, how to access and filter the log, how to interpret change types, and how to use change history for performance diagnosis.

---

## What this reference is / What this is NOT

**This reference:**

- Documents what changes are tracked in Google Ads Change History
- Explains how to access, filter, and read the change log
- Covers operator attribution and change type interpretation
- Provides guidance on correlating changes with performance shifts

**This reference does NOT:**

- Diagnose performance issues (See: [SOP – Investigate Performance Anomalies](../sops/SOP – Investigate Performance Anomalies.md))
- Cover Google Ads audit procedures (those use Change History as one input)
- Provide competitive change tracking (See: [Auction Insights Reference](../references/Auction Insights Reference.md))

---

## Quick reference: Change categories

| **Category** | **What is logged** | **Examples** |
|--------------|--------------------|-------------|
| **Status changes** | Enable, pause, remove entities | Campaign paused, ad group enabled |
| **Budget changes** | Daily budget modifications | Budget increased from €50 to €75 |
| **Bid changes** | Bid and target modifications | tCPA changed from €20 to €25 |
| **Bid strategy changes** | Strategy type switches | Switched from Maximize Clicks to tCPA |
| **Keyword changes** | Add, remove, match type, status | Added keyword [running shoes] |
| **Ad changes** | New ads, edits, removals | New RSA created in ad group X |
| **Asset changes** | Sitelinks, callouts, images added/removed | Sitelink "Free Shipping" added |
| **Targeting changes** | Location, audience, network modifications | Added audience segment "In-market" |
| **Setting changes** | Campaign and account settings | Ad rotation changed to "Optimize" |
| **Conversion changes** | Conversion action modifications | Conversion window changed to 30 days |
| **Automated changes** | Changes made by Google's automation | Auto-applied recommendation |

---

## Accessing Change History

### Where it lives

Change history sits at account level, in the left navigation of the Campaigns menu. It takes a date range plus the filters below. The diagnostic procedure that uses it is owned by [SOP - Investigate Performance Anomalies](../sops/SOP – Investigate Performance Anomalies.md).

### Filtering options

| **Filter** | **Options** | **Use case** |
|------------|------------|--------------|
| **Date range** | Any standard or custom range | Isolate changes around a performance shift |
| **Change source** | User, automated rule, API, Google Ads Editor, recommendation, system | Identify who or what made the change |
| **Change type** | Status, budget, bid, keyword, ad, setting, etc. | Focus on specific change categories |
| **Campaign** | Specific campaigns | Narrow to affected campaigns |
| **User** | Specific account users | Audit individual operator activity |

---

## Change sources

| **Source** | **What it means** | **Logged as** |
|------------|-------------------|---------------|
| **Google Ads web** | Manual change via the web interface | User email address |
| **Google Ads Editor** | Change via the desktop application | User email address + "Editor" |
| **Google Ads API** | Change via API (third-party tools, scripts) | API user or tool name |
| **Automated rule** | Change triggered by a saved rule | "Automated rule: [rule name]" |
| **Auto-applied recommendation** | Google applied a recommendation automatically | "Auto-applied recommendation" |
| **System** | Google system changes (policy, algorithm) | "System" |
| **Bulk upload** | Changes via bulk sheet upload | User email + "Bulk upload" |

> ⚠️ **"Auto-applied recommendation" and "System" are the two sources with no operator behind them.** Both record changes Google made to the account without a user action.

---

## Interpreting changes

### What to look for when diagnosing performance shifts

Internal causes of an unexpected performance shift usually sit in the 1-7 days of change history before the shift.

| **Performance change** | **Check for these changes** |
|------------------------|-----------------------------|
| CPA increased suddenly | Bid strategy changes, budget changes, new broad keywords added |
| Impressions dropped | Keywords paused, budget reduced, targeting narrowed, ads disapproved |
| CTR dropped | New ads with weaker copy, keyword match type changes, audience changes |
| Conversions dropped to zero | Conversion action modified, tracking tag changes, landing page URL changes |
| Spend spiked | Budget increased, bid strategy loosened, new campaigns enabled |
| Quality Score dropped | Landing page URL changed, ad copy changed, keyword-ad group misalignment |

### Correlating changes with performance

The correlation procedure, from dating the shift through to ruling out external factors, is owned by [SOP - Investigate Performance Anomalies](../sops/SOP – Investigate Performance Anomalies.md), Phase 2.

---

## Change History retention

| **Detail** | **Specification** |
|-----------|-------------------|
| Retention period | 2 years of change history |
| Granularity | Individual change level |
| Export | Can be downloaded as CSV or report |
| Access | Available to all users with account access |

---

## Common mistakes

| **Mistake** | **Problem** | **Fix** |
|-------------|-------------|---------|
| Ignoring automated changes | Google's auto-applied recommendations alter the account without notice | Review "system" and "auto-applied" changes weekly |
| Not checking Change History before diagnosing | Missing an obvious internal cause of performance change | Always check Change History first when investigating |
| Looking at too narrow a date range | Changes can take days to impact performance | Check 7 days before the performance shift |
| Forgetting API and Editor changes | Third-party tools and Editor changes may not be obvious | Filter by all sources, not just web interface |
| Not documenting intentional changes | Cannot distinguish intended changes from accidental ones | Log intentional changes with notes in your review docs |

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [SOP – Investigate Performance Anomalies](../sops/SOP – Investigate Performance Anomalies.md) | Execution: uses Change History in Phase 1 |
| [SOP – Run a Weekly Performance Review](../sops/SOP – Run a Weekly Performance Review.md) | Execution: correlates changes with weekly findings |
| [Google Ads Alerts and Rules Reference](../references/Google Ads Alerts and Rules Reference.md) | Reference: automated rules that appear in Change History |
| [Anomaly Detection Mental Model](../mental-models/Anomaly Detection Mental Model.md) | Foundation: distinguishing internal vs. external causes |

---

## Version details

- **Version:** 2.0
- **Last Updated:** October 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
