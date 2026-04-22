# Google Ads Alerts and Rules Reference
Created: 2026-02-11

Agent_Readable: Yes
Category: Monitoring
Human_Facing: Yes
Reference Type: Cheat Sheets
Status: Done
Support_ID: CHEATSHEET_46
Domain: Operational
Pillar: 0

## Purpose

Documents the Google Ads automated rules system: rule types, available conditions, frequency options, scope, scheduling mechanics, and notification settings. Also covers where native rules fall short and what alternatives exist.

---

## What this reference is / What this is NOT

**This reference:**

- Documents all automated rule types and their capabilities
- Explains available conditions, frequencies, and scope options
- Covers rule scheduling mechanics and notification settings
- Maps rule patterns to the three monitoring layers
- Lists limitations and alternatives beyond native rules

**This reference does NOT:**

- Provide step-by-step alert setup (See: [SOP – Configure Account Alerts](../sops/SOP – Configure Account Alerts.md))
- Recommend which alerts to configure (See: [Alert Configuration Checklist](../checklists/Alert Configuration Checklist.md))
- Provide automation implementation recipes (See: [Monitoring Automation Reference](../references/Monitoring Automation Reference.md))

---

## Quick reference: rule types

| **Rule type** | **Available for** | **Available actions** |
|---------------|-------------------|----------------------|
| **Ad rules** | Ads across campaigns/ad groups | Enable, Pause, Change labels, Send email |
| **Campaign rules** | Campaigns | Enable, Pause, Change budgets, Change labels, Send email |
| **Ad group rules** | Ad groups | Enable, Pause, Change bids, Change labels, Send email |
| **Keyword rules** | Keywords | Enable, Pause, Change bids, Change final URLs, Change labels, Send email |
| **Display keyword rules** | Display keywords | Enable, Pause, Change bids |
| **Asset group rules** | Asset groups (PMax) | Enable, Pause |

> 💡 "Send email" rules are the foundation of an alerting system. They notify without taking action, giving you control over the response.

---

## Rule configuration by monitoring layer

Native Google Ads rules map to the three monitoring layers differently. Some layers are well-served by rules, others require supplementation.

| **Monitoring layer** | **Rule pattern** | **What rules can do** | **What rules cannot do** |
|---------------------|------------------|-----------------------|--------------------------|
| **Layer 1️⃣: Health/governance** | Status-based email alerts | Alert on disapprovals, zero conversions, zero impressions, budget status | Check URL health, verify tag firing, detect feed errors, scan Change History |
| **Layer 2️⃣: Performance alerts** | Threshold-based email alerts | Alert when metrics cross absolute thresholds (CPA > $X, ROAS < Y%) | Calculate relative % changes, compare to rolling baselines, filter by minimum volume |
| **Layer 3️⃣: Target monitoring** | Budget and efficiency rules | Alert on budget pacing, efficiency degradation | Calculate pacing rate, compare to monthly targets, aggregate multi-campaign performance |

> ↪️ **For the three-layer monitoring framework:** See: [Account Monitoring Mental Model](../mental-models/Account Monitoring Mental Model.md).

---

## Available conditions

Rules can be triggered based on any combination of performance metrics and entity attributes. Conditions vary significantly by rule type.

### Performance metric conditions

Available across all rule types (Ad, Campaign, Ad Group, Keyword):

| **Metric** | **Operators** | **Example** |
|------------|---------------|-------------|
| Impressions | >, <, =, >=, <= | Impressions < 10 (last 7 days) |
| Clicks | >, <, =, >=, <= | Clicks < 5 (last 7 days) |
| Cost | >, <, =, >=, <= | Cost > €500 (last 7 days) |
| CTR | >, <, =, >=, <= | CTR < 1% (last 14 days) |
| Avg. CPC | >, <, =, >=, <= | Avg. CPC > €10 |
| Conversions | >, <, =, >=, <= | Conversions = 0 (last 7 days) |
| Cost/conv. | >, <, =, >=, <= | Cost/conv. > €100 |
| Conv. rate | >, <, =, >=, <= | Conv. rate < 1% |
| Conv. value | >, <, =, >=, <= | Conv. value < €1000 |
| ROAS (Conv. value/cost) | >, <, =, >=, <= | ROAS < 200% |
| Impression share | >, <, =, >=, <= | Search IS < 50% |
| Quality Score | >, <, =, >=, <= | QS < 5 (keywords only) |
| Search lost IS (budget) | >, <, =, >=, <= | Lost IS (budget) > 20% |
| Search lost IS (rank) | >, <, =, >=, <= | Lost IS (rank) > 30% |

### Campaign-only condition categories

Campaign rules have a significantly richer condition set than other rule types:

| **Category** | **Key metrics** | **Use case** |
|--------------|-----------------|--------------|
| **Setup** | Number of eligible/disapproved ads, keywords, ad groups, RSAs, sitelinks, images | Monitor structural health (e.g., alert if disapproved ads > 0) |
| **Change History** | All changes, budget/bid/keyword/status/targeting/ad/network changes | Detect unauthorized modifications |
| **Competitive Metrics** | Full IS breakdown (search, top, abs. top, budget, rank), click share, relative CTR | Monitor competitive position |
| **Budget Simulator** | Recommended budget, estimated additional interactions/cost at recommended budget | Identify constrained campaigns |
| **Attributes** | Campaign type, bid strategy type, target CPA/ROAS, status reason, optimization score, daily budget, conversion goals | Filter by campaign configuration |

### Entity attribute conditions

| **Attribute** | **Available for** | **Example** |
|---------------|-------------------|-------------|
| Campaign name | Campaigns | Contains "Brand" |
| Ad group name | Ad groups | Contains "Exact" |
| Keyword text | Keywords | Contains "buy" |
| Ad text | Ads | Contains "Sale" |
| Label | All | Has label "Priority" |
| Status | All | Is enabled/paused |
| Campaign type | Campaigns | Search, Shopping, etc. |

### Custom columns as conditions

Any custom columns created in the account can be used as conditions in rules. This extends rule capabilities beyond built-in metrics.

---

## Frequency options

| **Frequency** | **How it works** | **Best for** |
|---------------|------------------|--------------|
| **Once** | Runs one time at the specified date/time | Promotional events, one-time adjustments |
| **Hourly** | Runs every hour within a specified time window | Intra-day monitoring, budget caps, click caps |
| **Daily** | Runs every day at the specified time | Ongoing monitoring, budget alerts |
| **Weekly** | Runs on the specified day and time each week | Performance reviews, weekly checks |
| **Monthly** | Runs on the specified date and time each month | Monthly budget resets, periodic reviews |

### Data range options

| **Range** | **Description** | **Best for** |
|-----------|-----------------|--------------|
| Today | Data from today only | Intra-day monitoring |
| Yesterday | Yesterday's data | Daily performance checks |
| Last 7 days | Rolling 7-day window | Weekly trend monitoring |
| Last 14 days | Rolling 14-day window | Bi-weekly performance checks |
| Last 30 days | Rolling 30-day window | Monthly performance and conversion-based rules |
| Last business week | Monday through Friday of the prior week | B2B performance checks |
| This month | Current calendar month to date | Monthly budget cap rules |
| Last month | Previous full calendar month | Month-over-month comparisons |
| All time | All available historical data | Lifetime performance thresholds |

> ⚠️ **Use longer data ranges for conversion-based rules:** Conversions take time to report. A rule checking "conversions = 0 in the last day" will fire false positives due to conversion lag. Use 7-day or 14-day windows minimum for conversion metrics.

---

## Scope options

| **Level** | **What it controls** | **Selection options** |
|-----------|---------------------|----------------------|
| **Campaign** | Rules apply to selected campaigns | All campaigns, specific campaigns, by label |
| **Ad group** | Rules apply to selected ad groups | All ad groups, specific ad groups, by label |
| **Keyword** | Rules apply to selected keywords | All keywords, specific keywords, by label |
| **Ad** | Rules apply to selected ads | All ads, specific ads, by label |

### Using labels for scope

Labels provide the most flexible scoping mechanism:
- Apply a label (e.g., "Monitor-Daily") to entities you want rules to cover
- Set rule scope to "All [entities] with label: Monitor-Daily"
- Add or remove entities from monitoring by adding or removing labels

---

## Notification settings

| **Option** | **What it does** |
|------------|------------------|
| **Every time this rule runs** | Sends email every time the rule runs, even if no action taken |
| **Only if there are changes or errors** | Sends email only when the rule takes action or encounters errors |
| **Only if there are errors** | Sends email only when the rule encounters errors |
| **No emails** | Rule runs silently (only visible in rule history) |

You can add one or more email addresses as recipients.

**Best practice:** Use "only if there are changes or errors" for action rules (pause, enable, bid changes). Use "every time this rule runs" for send-email-only monitoring rules to confirm the rule is active.

---

## Rule execution mechanics

| **Behavior** | **Detail** |
|-------------|-----------|
| **Execution window** | Rules scheduled for a specific time may run within a 2-hour window of that time |
| **Actions per rule** | Up to 5 actions per rule, executed in the order you set |
| **Condition logic** | All conditions within a single action use AND logic: all must be met |
| **Rule order** | Multiple rules on the same entity execute in creation order |
| **Conflict handling** | If two rules conflict (one enables, one pauses), both execute in order |
| **MCC ownership** | Rules owned by an MCC can apply across all sub-accounts |
| **Preview** | Use "Preview results" before saving to verify rule logic |
| **History** | All rule executions are logged in the Rules history |
| **Data freshness** | Rules evaluate data at execution time: hourly rules may have incomplete "today" data |

---

## Rule management

### Accessing rules

1. Navigate to Tools & Settings
2. Under Bulk Actions, select Rules
3. View all rules, their status, and execution history

### Rule actions

| **Action** | **What it does** |
|------------|------------------|
| Enable/Pause | Toggle rule active status |
| Edit | Modify conditions, frequency, or actions |
| Preview | See which entities currently match conditions |
| Run now | Execute the rule immediately |
| View history | See past executions and actions taken |
| Remove | Delete the rule permanently |

---

## Practical use cases

### Schedule ads for promotions

**One-time event (e.g., Memorial Day):** Create promotional ads in advance, keep them paused. Set two one-time rules: Rule 1 enables ads containing "Memorial Day" at the start of the weekend. Rule 2 pauses those same ads at the end. Use the Ad text condition to target the right ads.

**Recurring promotion (e.g., Free Shipping weekends):** Two weekly rules: Rule 1 enables ads containing "Free Shipping" every Saturday at 1:00 AM. Rule 2 pauses them every Sunday at 11:00 PM. Same concept works at the campaign level.

### Pause low performers

**High CPA keywords:** Daily rule that pauses keywords with Cost/conv. > target AND Conversions > minimum threshold (e.g., >100), using 30-day data. The conversion threshold ensures you act on statistically meaningful data.

**Low CTR ads:** Daily rule that pauses ads with CTR < 0.2% AND Impressions >= 1,000, using 14-day data.

### Budget control

**Mid-day budget check:** Daily campaign rule to send email if cost exceeds a threshold by noon. Lets you decide whether to increase the budget for the rest of the day.

**Monthly spend cap:** Daily campaign rule that pauses campaigns when cost exceeds your monthly cap using "This month" data range.

**Scale high performers:** Weekly rule that increases budget by 10% for campaigns with conversions > threshold AND cost/conv. < target. Set a maximum budget limit as a safety measure.

### Labeling by performance

Use "Change labels" actions to auto-tag entities based on conditions: add a "Top Performer" label to keywords with ROAS > 5, or a "Review Needed" label to ads with CTR < 1% and significant spend.

---

## Tips and best practices

### Safety measures

- **Always set min/max limits** for bid and budget rules. Continuous bid increases lead to unnecessarily high CPCs. Continuous decreases kill traffic.
- **Always preview before saving:** A single rule can affect a large portion of your account.
- **Start with "Once" frequency:** Monitor the actual impact before switching to a recurring schedule.

### Data and timing

- **Use enough data:** Rules on conversion metrics need 7-30 day windows to account for conversion lag. Add minimum impression/click thresholds as secondary conditions.
- **Stagger start times:** Schedule rules at different times so the earliest runs first. Do not schedule overlapping rules on the same entities.
- **Account for the 2-hour execution window:** A rule scheduled for 9:00 AM may run anytime between 9:00 AM and 11:00 AM.

### Bid rule cautions

- **Watch for CTR-bid spirals:** A rule that lowers bids when CTR is low can create a negative spiral: lower bid → lower position → lower CTR → lower bid. Add impression share or position conditions as safeguards.
- **Percentage reversal formula:** When using increase/decrease rules in pairs (e.g., raise bids during peak hours, lower them off-peak), the decrease percentage is not the same as the increase. Formula: `decrease % = (100 * increase %) / (100 + increase %)`. Example: 25% increase requires 20% decrease to return to original. 50% increase requires 33.3% decrease.

---

## Limitations

| **Limitation** | **Detail** | **Workaround** |
|----------------|-----------|----------------|
| **No cross-account rules** | Rules are per account (MCC-level rules are limited) | Use MCC Scripts for cross-account logic |
| **No real-time triggers** | Rules run on schedule, not instantly when conditions change | Use third-party tools for real-time monitoring |
| **2-hour execution window** | Rules may run up to 2 hours after scheduled time | Factor this into time-sensitive scheduling |
| **Limited math** | Cannot create calculated fields (e.g., "if CPA > 2x target") | Use Scripts for computed conditions |
| **No rule chaining** | Rules cannot trigger other rules | Use Scripts for sequential logic |
| **Conversion lag** | Short data windows produce unreliable conversion-based triggers | Use 7+ day data windows for conversion metrics |
| **No relative comparisons** | Cannot compare current to prior period (e.g., "30% higher than last week") | Use Scripts or third-party tools |
| **No minimum volume filters** | Cannot add "only if > 100 clicks" as a secondary condition alongside performance thresholds | Use Scripts for volume-filtered alerts |
| **Asset group rules extremely limited** | Only Enable/Pause, 3 metrics, no email, no labels | Use third-party tools for PMax monitoring |
| **Display keyword rules limited** | No Send email, no Change labels actions | Use Scripts or manual monitoring |
| **No URL checking** | Cannot verify HTTP status of landing pages | Use Scripts (UrlFetchApp) or uptime tools |
| **No feed health access** | Cannot monitor Merchant Center or product status | Use Merchant Center alerts + feed tools |

---

## Beyond native rules

Native rules cover basic threshold monitoring but have significant gaps. Here is what each alternative tool type adds:

| **Capability** | **Native rules** | **Google Ads Scripts** | **Third-party tools** | **AI agents** |
|----------------|-----------------|----------------------|----------------------|---------------|
| **Absolute threshold alerts** | Yes | Yes | Yes | Yes |
| **Relative % change detection** | No | Yes (custom calculation) | Yes (built-in) | Yes |
| **Baseline management** | No | Yes (Sheets integration) | Yes (automatic) | Yes |
| **Minimum volume filtering** | No | Yes (custom logic) | Yes (built-in) | Yes |
| **Cross-account monitoring** | Limited | Yes (MCC scripts) | Yes | Yes |
| **URL health checking** | No | Yes (UrlFetchApp) | Yes | Yes |
| **Feed health monitoring** | No | Partial (Shopping API) | Yes (feed tools) | Yes |
| **Change History scanning** | No | No | Yes (some tools) | Yes |
| **Multi-metric composite alerts** | No | Yes | Yes (some tools) | Yes |
| **Custom notification channels** | Email only | Email + Sheets + Slack (via webhook) | In-app + email + Slack | Yes |
| **Scheduling flexibility** | Hourly to monthly | Hourly to daily | Real-time to daily | Yes |

### Google Ads Scripts overview

Google Ads Scripts provide JavaScript-based automation with full Google Ads API access. They run on Google's servers (no hosting needed), can read and write account data, send emails, write to Google Sheets, and make external HTTP calls.

**Key capabilities for monitoring:**
- Custom metric calculations (relative % changes, rolling averages, composite metrics)
- Scheduled execution (hourly, daily, weekly)
- Multi-account execution via MCC scripts
- Google Sheets integration for baselines and dashboards
- Email notifications with custom formatting
- URL checking via UrlFetchApp
- Labeling entities based on custom conditions

**Limitations:** 30-minute execution limit per run, JavaScript only, no real-time triggers, limited external API access.

### Third-party tool categories

| **Category** | **Examples** | **Strength** |
|--------------|-------------|-------------|
| **Comprehensive monitoring** | TrueClicks, Adalysis | Full Layer 1️⃣ + Layer 2️⃣ coverage, governance checks, anomaly detection |
| **Feed-focused** | Channable, DataFeedWatch | Shopping feed health, product-level monitoring |

> ↪️ **For automation implementation details:** See: [Monitoring Automation Reference](../references/Monitoring Automation Reference.md) for specific recipes using each tool type.

---

## Common mistakes

| **Mistake** | **Problem** | **Fix** |
|-------------|-------------|---------|
| Short data window on conversion rules | False positives from conversion lag | Use 7+ day data windows |
| Too many action rules | Rules conflict or over-optimize | Prefer email alerts over automatic actions |
| No preview before saving | Rule matches unintended entities | Always preview before saving |
| Forgetting rule history check | Rules fire incorrectly without notice | Review rule history weekly |
| Using rules for everything | Complex logic fails with basic conditions | Use Scripts or third-party tools for advanced monitoring |
| No minimum volume consideration | Alerts fire on low-data entities | Add Scripts or tool-based filtering for minimum volume |
| Overlapping rules on same entities | Both rules execute, causing conflicts | Stagger times, ensure rules don't conflict |
| No bid/budget limits set | Continuous increases spiral out of control | Always set min/max limits on bid and budget rules |

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Account Monitoring Mental Model](../mental-models/Account Monitoring Mental Model.md) | Framework: three monitoring layers |
| [Monitoring Automation Reference](../references/Monitoring Automation Reference.md) | Reference: automation recipes beyond native rules |
| [SOP – Configure Account Alerts](../sops/SOP – Configure Account Alerts.md) | Execution: step-by-step alert setup |
| [Alert Configuration Checklist](../checklists/Alert Configuration Checklist.md) | Validation: which alerts to configure |
| [Optimization Cadence Mental Model](../mental-models/Optimization Cadence Mental Model.md) | Foundation: alert frequency alignment |

---

## Version details

- **Version:** 3.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer
- **Changelog:** v3.0: Major expansion from source. Added Asset Group and Display Keyword rule types. Added Hourly frequency, additional data ranges (This month, Last month, All time). Expanded campaign-only conditions (Setup, Change History, Competitive Metrics, Budget Simulator, Attributes). Added practical use cases and tips/best practices sections. AI agents column updated to "Yes" across all capabilities. Removed Multi-purpose optimization and Bid management tool categories. Updated feed-focused tool examples. Expanded limitations table with workarounds. v2.0: Added "Rule configuration by monitoring layer" section, "Beyond native rules" section with Scripts and third-party tool coverage, expanded limitations, sentence case headings

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
