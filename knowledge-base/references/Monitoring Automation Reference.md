# Monitoring Automation Reference

Support_ID: REF_47
Status: Done
Category: Monitoring
Reference Type: Reference
Agent_Readable: Yes
Human_Facing: Yes
Domain: Operational
Pillar: 0

## Purpose

Provides implementation-level guidance for automating monitoring checks across all three monitoring layers. This is the "how" reference: specific patterns for rules, scripts, and third-party tools that automate detection so you spend time on decisions, not scanning.

---

## What this is NOT

This reference does **not:**

- Explain the monitoring framework (See: [Account Monitoring Mental Model](../mental-models/Account Monitoring Mental Model.md))
- Document native rule mechanics (See: [Google Ads Alerts and Rules Reference](../references/Google Ads Alerts and Rules Reference.md))
- Provide step-by-step alert setup procedures (See: [SOP – Configure Account Alerts](../sops/SOP – Configure Account Alerts.md))
- Recommend which alerts to configure (See: [Alert Configuration Checklist](../checklists/Alert Configuration Checklist.md))

---

## Quick reference: automation tools comparison

| **Tool type** | **Setup effort** | **Cost** | **Best for** | **Limitations** |
|---------------|-----------------|---------|-------------|-----------------|
| **Google Ads rules** | Low | Free | Simple threshold alerts (Layer 1️⃣ status checks, Layer 2️⃣ absolute thresholds) | No relative comparisons, no minimum volume filtering, no cross-account |
| **Google Ads Scripts** | Medium-high | Free | Custom logic, relative comparisons, Sheets dashboards, URL checking | JavaScript expertise required, 30-min execution limit, maintenance burden |
| **Third-party tools** | Low-medium | €50-500+/mo | Comprehensive monitoring, governance checks, anomaly detection, multi-account | Subscription cost, vendor lock-in, may not cover all use cases |
| **AI agents/skills** | Medium | Varies | Complex diagnosis, natural language alerts, context-aware monitoring, multi-step investigation, root cause analysis | Newer technology, requires prompt engineering, cost can be unpredictable |

---

## Tier 1️⃣: Google Ads rules

Free, minutes to set up. Start here for basic coverage of Layer 1️⃣ status checks and Layer 2️⃣ absolute thresholds.

### Layer 1️⃣ health checks

| **Check** | **Rule configuration** | **Frequency** |
|-----------|----------------------|---------------|
| Zero conversions | Email if conversions = 0, last 7 days. Label-scope to converting campaigns | Daily |
| Ad disapprovals | Email if ad status = Disapproved, all ads scope | Daily |
| Asset disapprovals | Email if asset status = Disapproved, all assets scope | Daily |
| Zero eligible ads | Email if impressions = 0 AND status = Enabled, last 3 days | Daily |
| Bid strategy issues | Campaign Attributes: Status reason + Bid strategy type. No direct "Misconfigured" condition: use Status reason | Daily |

### Layer 2️⃣ threshold alerts

| **Check** | **Rule configuration** | **Frequency** | **Data window** |
|-----------|----------------------|---------------|-----------------|
| CPA exceeds target | Email if Cost/conv. > [target CPA], Conversions > 0 | Daily | Last 14 days |
| ROAS below target | Email if Conv. value/cost < [target ROAS] | Daily | Last 14 days |
| Budget overspend | Email if Cost > [120% of daily budget] | Daily | Previous day |
| CPC surge | Email if Avg. CPC > [150% of expected CPC] | Daily | Last 7 days |
| Impression share collapse | Email if Search IS < [minimum acceptable IS] | Weekly | Last 7 days |

> ⚠️ **Rules cannot filter by minimum volume:** A campaign with 2 clicks and €50 CPA will trigger a CPA alert even though the data is meaningless. For volume-filtered alerts, use Scripts (Tier 2️⃣) or third-party tools (Tier 3️⃣).

### What rules cannot do

Rules only support absolute thresholds and status-based conditions. They cannot:

- Compare metrics to baselines or prior periods (relative % changes)
- Filter by minimum conversion volume
- Check URLs, feed health, or Change History
- Calculate pacing or compare to targets
- Run cross-account

For these checks, add Scripts (Tier 2️⃣) or third-party tools (Tier 3️⃣).

---

## Tier 2️⃣: Google Ads Scripts

Free, requires JavaScript expertise. Adds relative comparisons, URL health checking, pacing dashboards, and all Layer 3️⃣ target monitoring. Combined with Tier 1️⃣, covers approximately 80% of monitoring needs.

### Scripts: capabilities and limits

**Can do:**

- Read all campaign, ad group, keyword, and ad data
- Write changes (bids, budgets, labels, status)
- Send emails (MailApp)
- Read/write Google Sheets (SpreadsheetApp)
- Make HTTP requests (UrlFetchApp) for URL checking and webhook notifications
- Run on schedule (hourly to monthly)
- Run across accounts (MCC scripts)
- Access Shopping/Merchant data (limited)

**Cannot do:**

- Run in real-time (minimum scheduling is hourly)
- Execute for more than 30 minutes per run
- Access Change History programmatically
- Access Google Analytics data directly
- Run complex machine learning models

### Layer 1️⃣ health checks (scripts add)

These checks require logic that rules cannot handle.

| **Check** | **Implementation** | **Frequency** |
|-----------|--------------------|---------------|
| Conversion volume drop >50% | Compare 7d conversion total to prior 7d, account-level aggregation | Daily |
| Conversion action status | Check ConversionAction status via API, email if not "ENABLED" | Daily |
| 404 errors on final URLs | UrlFetchApp HTTP check on all active final URLs, email broken URLs with campaign/ad group context | Weekly |
| Redirect chain detection | Follow redirects, flag chains >2 hops, output to Sheets | Weekly |
| Feed processing errors | Content API integration, pull Merchant Center diagnostics | Daily |
| Missing feed attributes | Attribute coverage check against required fields | Weekly |
| Product coverage drop | Weekly product count comparison vs. baseline in Sheets | Weekly |
| Extended learning (>14 days) | Track bid strategy learning start date in Sheets, flag if >14d | Daily |
| Bid strategy target deviation | Compare actual CPA/ROAS to bid strategy target, flag if >30% for 14+ days | Weekly |
| Settings snapshot comparison | Snapshot settings weekly in Sheets, compare to prior | Weekly |
| Network/location drift | Check campaign settings vs. expected values, flag deviations | Weekly |

### Layer 2️⃣ fluctuation alerts (scripts add)

Rules cannot do relative comparisons. Scripts compare current metrics to baselines.

| **Check** | **Implementation** | **Frequency** |
|-----------|--------------------|---------------|
| CPA rose >30% vs. baseline | 7d CPA vs. 14d rolling average stored in Sheets | Daily/weekly |
| Conversion volume dropped >40% | 7d conversions vs. prior 7d, account-level | Daily |
| CTR declined >20% | 7d CTR vs. 14d rolling average | Weekly |
| Spend anomaly >2x normal | Yesterday's spend vs. 14d daily average, campaign-level | Daily |

### Baseline management

Baselines underpin all fluctuation alerts. They must be maintained and updated.

| **Approach** | **Implementation** | **Pros** | **Cons** |
|-------------|-------------------|---------|---------|
| **Rolling average** | Script writes 14-day or 30-day rolling averages to Sheets weekly | Simple, adapts to trends | Lags behind sudden shifts, can normalize degradation |
| **Same period last year** | Script pulls YoY data for seasonal comparison | Accounts for seasonality | Requires 12+ months of data, business changes confound |
| **Statistical bands** | Script calculates mean + standard deviation, sets bands | More precise, filters noise well | More complex to implement, requires sufficient data |

> 💡 **Recalibrate monthly:** Baselines that never update normalize poor performance. Run a monthly recalibration (manually or via script) to ensure your "normal" reflects current reality, not last quarter's.

### Layer 3️⃣ target monitoring (scripts add)

Rules do not support Layer 3️⃣ checks. Scripts handle all pacing, target comparison, and reporting automation.

| **Check** | **Implementation** | **Frequency** |
|-----------|--------------------|---------------|
| Monthly budget pacing | (Monthly budget - MTD spend) / remaining days, output to Sheets | Daily |
| Pacing alert | Email if daily required spend >150% or <50% of original daily budget | Daily |
| Multi-campaign pacing | Aggregate pacing across campaign groups, output to Sheets | Daily |
| CPA vs. target | Calculate weekly/monthly CPA, compare to target, Sheets + email if off track | Weekly |
| ROAS vs. target | Calculate weekly/monthly ROAS, compare to target, Sheets + email if off track | Weekly |
| Conversion volume vs. goal | Compare MTD conversions to monthly target pace, email if behind | Weekly |
| Daily pacing dashboard | Write pacing data to Sheets | Daily |
| Weekly performance summary | Email formatted summary of key metrics vs. targets | Weekly |
| Monthly executive report | Automated report generation | Monthly |

---

## Tier 3️⃣: Third-party tools

Paid (€50-500+/mo), low setup effort. Covers most Tier 1️⃣ + Tier 2️⃣ checks automatically with zero maintenance, plus capabilities that scripts cannot provide.

### Tool landscape

| **Tool type** | **What it covers** | **Layer coverage** |
|---------------|-------------------|-------------------|
| **Comprehensive monitoring** (TrueClicks, Adalysis) | Governance, anomaly detection, quality scores, wasted spend, competitor analysis | Layer 1️⃣ + Layer 2️⃣ (strong), Layer 3️⃣ (partial) |
| **Feed monitoring** (Channable, DataFeedWatch) | Product feed health, attribute coverage, pricing, competitor pricing | Layer 1️⃣ (feed-specific) |

### What third-party tools uniquely add

These capabilities are difficult or impossible to replicate with rules and scripts alone.

| **Capability** | **Layer** | **Why scripts can't match** |
|----------------|----------|---------------------------|
| Change History monitoring | Layer 1️⃣ | No API access: scripts cannot read Change History programmatically |
| Continuous tag monitoring | Layer 1️⃣ | Scripts run on schedule (minimum hourly), tools monitor continuously |
| Real-time uptime monitoring | Layer 1️⃣ | Scripts are scheduled, tools provide real-time page health |
| PMax asset-level scanning | Layer 1️⃣ | Asset group rules are extremely limited (Enable/Pause only, 3 metrics) |
| Comprehensive governance scanning | Layer 1️⃣ | Tools check dozens of settings simultaneously, scripts require custom code per check |
| Feed-specific monitoring | Layer 1️⃣ | Dedicated feed tools (Channable, DataFeedWatch) provide deeper attribute analysis than Content API scripts |
| Multi-metric anomaly detection | Layer 2️⃣ | Tools maintain automatic baselines and detect anomalies across metrics without manual threshold configuration |
| Automatic baseline management | Layer 2️⃣ | Zero maintenance: tool recalibrates internally (trade-off: less control over methodology) |

> 💡 **Third-party tools overlap heavily with Tier 1️⃣ + Tier 2️⃣:** Most comprehensive tools (TrueClicks, Adalysis) also handle ad disapprovals, zero-conversion alerts, bid strategy monitoring, and basic fluctuation detection. The value is coverage breadth and zero maintenance, not unique checks.

---

## Tier 4️⃣: AI agents and skills

Advanced, cost varies. AI agents add reasoning and diagnosis on top of any tier. They do not replace detection (Tiers 1️⃣-3️⃣) but add investigation and decision support.

| **Capability** | **Layer** | **What it does** |
|----------------|----------|-----------------|
| Root cause diagnosis | Layer 1️⃣ | Investigates why tracking broke, why a bid strategy is stuck in learning, why URLs are failing |
| Policy analysis and appeal drafting | Layer 1️⃣ | Analyzes disapproval patterns, drafts policy-compliant appeals |
| Cross-system validation | Layer 1️⃣ | Compares Google Ads data against backend/CRM to identify discrepancies |
| Feed error diagnosis | Layer 1️⃣ | Diagnoses feed attribute issues, suggests optimization priorities |
| Multi-factor efficiency diagnosis | Layer 2️⃣ | Investigates CPA/ROAS changes considering multiple variables (competition, seasonality, landing pages) |
| Volume change investigation | Layer 2️⃣ | Determines whether volume changes are internal (settings, bids) or external (seasonality, competition) |
| Change impact analysis | Layer 1️⃣/2️⃣ | Traces cascading effects of account changes across campaigns and metrics |
| Growth trajectory analysis | Layer 3️⃣ | Forecasts whether current pace will hit targets, suggests reallocation |
| Natural language reporting | Layer 3️⃣ | Generates insight-driven narrative summaries instead of raw data tables |

> 💡 **AI agents are a complement, not a replacement:** Use Tiers 1️⃣-3️⃣ for detection and alerting. Use AI agents for investigation, diagnosis, and decision support when alerts fire.

---

## When to use what: decision guide

```
What do you need to automate?
│
├─ Simple threshold alert (CPA > $X, conversions = 0)
│  └─ Google Ads RULE (free, fast to set up)
│
├─ Relative % change alert (CPA rose 30% vs. baseline)
│  └─ Google Ads SCRIPT or THIRD-PARTY TOOL
│
├─ URL health checking
│  └─ Google Ads SCRIPT (UrlFetchApp) or THIRD-PARTY TOOL
│
├─ Feed health monitoring
│  └─ Merchant Center alerts + THIRD-PARTY FEED TOOL
│
├─ Comprehensive governance checks
│  └─ THIRD-PARTY TOOL (TrueClicks, Adalysis)
│
├─ Custom dashboards and pacing
│  └─ Google Ads SCRIPT + Sheets
│
├─ Change History monitoring
│  └─ THIRD-PARTY TOOL (no API access for scripts)
│
├─ Multi-account monitoring at scale
│  └─ MCC SCRIPT or THIRD-PARTY TOOL
│
└─ Complex diagnosis, root cause analysis, context-aware investigation
   └─ AI AGENT/SKILL (combines API access with reasoning)
```

---

## Implementation priority

Automate checks in this order for maximum impact with minimum effort:

| **Priority** | **Check** | **Why first** |
|-------------|-----------|---------------|
| 1 | Ad disapproval alerts | Free, 2-minute setup, catches high-impact breakage |
| 2 | Zero conversion alerts | Free, 2-minute setup, catches tracking failures |
| 3 | Budget overspend alerts | Free, prevents budget waste |
| 4 | CPA/ROAS threshold alerts | Free, catches efficiency degradation |
| 5 | URL health checking | Moderate effort, catches wasted spend on broken pages |
| 6 | Pacing dashboard | Moderate effort, replaces manual pacing calculations |
| 7 | Fluctuation alerts (% change) | Higher effort, catches drift that absolute thresholds miss |
| 8 | Baseline management | Higher effort, improves alert accuracy over time |
| 9 | Comprehensive governance | Subscription cost, but covers dozens of checks automatically |
| 10 | Feed health monitoring | Subscription cost, essential for ecommerce |

> 💡 **Start with Google rules (priorities 1-4):** They are free, take minutes to set up, and cover the most critical Layer 1️⃣ and Layer 2️⃣ checks. Add Scripts and third-party tools as your monitoring matures.

---

## Vertical-specific automation notes

### Ecommerce

| **Additional check** | **Implementation** | **Why** |
|---------------------|-------------------|---------|
| Product feed health | Merchant Center alerts + feed tool | Feed errors directly reduce product visibility and revenue |
| Product-level ROAS | Script: flag products below ROAS threshold | Product mix shifts affect overall performance |
| Inventory sync | Feed tool: alert on out-of-stock products still advertising | Wasted spend on unavailable products |
| Competitor pricing | Merchant Center price competitiveness report | Price changes affect conversion rates |

### Lead Gen

| **Additional check** | **Implementation** | **Why** |
|---------------------|-------------------|---------|
| Backend lead delivery | CRM integration check (Script or third-party) | Leads not reaching CRM = lost pipeline |
| Lead quality signals | Script: compare frontend conversions to CRM-qualified leads | Frontend metrics may hide quality degradation |
| Offline conversion import health | Script: verify recent offline conversion uploads exist | Stale offline data degrades bid strategy performance |

### SaaS

| **Additional check** | **Implementation** | **Why** |
|---------------------|-------------------|---------|
| Trial signup tracking | Script: verify trial signup conversion action is recording | Trial signups are the primary conversion event |
| Trial-to-paid funnel | CRM/product analytics integration | Advertising efficiency depends on downstream conversion |
| Multi-touch attribution | Third-party attribution tool | SaaS buying cycles are long, last-click attribution misleads |

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Account Monitoring Mental Model](../mental-models/Account Monitoring Mental Model.md) | Framework: three monitoring layers this doc implements |
| [Google Ads Alerts and Rules Reference](../references/Google Ads Alerts and Rules Reference.md) | Reference: native rule mechanics and limitations |
| [Anomaly Detection Mental Model](../mental-models/Anomaly Detection Mental Model.md) | Framework: what constitutes signal vs. noise for Layer 2️⃣ |
| [Alert Configuration Checklist](../checklists/Alert Configuration Checklist.md) | Validation: which alerts to have configured |
| [Account Health Checklist](../checklists/Account Health Checklist.md) | Validation: Layer 1️⃣ checks that automation supports |
| [SOP – Configure Account Alerts](../sops/SOP – Configure Account Alerts.md) | Execution: step-by-step alert setup |
| [Optimization Cadence Mental Model](../mental-models/Optimization Cadence Mental Model.md) | Foundation: automation aligned with cadence tiers |

---

## Version details

- **Version:** 3.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer
- **Changelog:** v3.0: Restructured from monitoring-layer organization (Layer 1/2/3 with tool-type columns per check) to tool-tier organization (Tier 1-4). Each check now appears once at its lowest capable tier. Removed redundant Tool-specific capabilities section (merged into tier introductions). v2.0: Fixed product coverage drop to Native + Script (Merchant Center native protection). Corrected bid strategy "Misconfigured" check wording (use Status reason attribute). Added Asset group disapproval note for PMax. Added AI agent/skill option to decision guide. Removed Multi-purpose optimization and Bid management tool categories. Updated feed tool examples (Channable, DataFeedWatch).

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
