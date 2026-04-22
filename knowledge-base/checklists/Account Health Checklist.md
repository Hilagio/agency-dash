# Account Health Checklist
Created: 2026-02-11

Support_ID: CHECKLIST_25
Status: Done
Category: Monitoring
Reference Type: Checklist
Agent_Readable: Yes
Human_Facing: Yes
Domain: Operational
Pillar: 0

## Purpose

Validates that all Layer 1️⃣ (health/governance) checks pass: the account is structurally sound, tracking works, ads are approved, landing pages load, and no unauthorized changes occurred. This checklist focuses on binary pass/fail checks, not performance analysis.

---

## What this checklist validates

This checklist confirms:

- Conversion tracking is functional and logging events
- Active ads and assets are not disapproved or broken
- Landing page URLs are functional
- Bid strategies are running without errors or limitations
- Feed health is acceptable (Shopping/PMax)
- No unauthorized settings changes occurred

This checklist does **NOT**:

- Analyze performance trends (that is Layer 2️⃣/3️⃣: See: [SOP – Run a Weekly Performance Review](../sops/SOP – Run a Weekly Performance Review.md))
- Diagnose root causes (See: [SOP – Investigate Performance Anomalies](../sops/SOP – Investigate Performance Anomalies.md))
- Cover monthly strategic checks (See: [Monthly Performance Review Checklist](../checklists/Monthly Performance Review Checklist.md))
- Validate alert configuration (See: [Alert Configuration Checklist](../checklists/Alert Configuration Checklist.md))

> ↪️ **Monitoring layer context:** This checklist covers Layer 1️⃣ (health/governance) of the [Account Monitoring Mental Model](../mental-models/Account Monitoring Mental Model.md). Always complete Layer 1️⃣ checks before reviewing Layer 2️⃣ (performance) or Layer 3️⃣ (targets). If tracking is broken, performance data is unreliable.

---

## When to use

Run this checklist:

- Every business day as part of daily triage (10-15 minutes)
- After launching a new campaign (run daily for the first 7 days)
- After making significant account changes (bids, budgets, tracking)

**Frequency flexibility:**

| Account context | Default frequency | Increase when | Decrease when |
|----------------|-------------------|---------------|---------------|
| 200+ (high) | Daily automated + manual review of alerts | After major launches, tracking changes | Never: daily Layer 1️⃣ is always non-negotiable |
| 50-200 (medium) | Daily automated + manual review of alerts | After major launches | Never |
| 15-50 (low) | Daily automated + weekly manual review | After major launches | When alert coverage is comprehensive and mature |
| <15 (very low) | Daily automated + weekly manual review | After major launches | When alert coverage is comprehensive and mature |

---

## Checklist

### Conversion tracking health

- [ ] Primary conversion actions are active (not "no recent conversions" or "inactive")
- [ ] No new conversion tracking warnings in the Diagnostics tab
- [ ] Enhanced conversions (if configured) show healthy match rates
- [ ] Conversion volume is within expected range (not zero, not abnormally low)
- [ ] Conversion value tracking is functional (if configured)

### Ad and asset compliance

- [ ] No campaigns have zero eligible ads
- [ ] No ad groups without active ads
- [ ] No new ad disapprovals on active campaigns
- [ ] No disapproved RSA headline or description assets
- [ ] No disapproved assets across all asset types (sitelinks, callouts, structured snippets, images, calls, prices, promotions)
- [ ] Ads serving with restrictions are reviewed (limited approval status)
- [ ] Previously flagged disapprovals have been addressed or appealed

### URL and landing page health

- [ ] No 404 errors reported on high-volume final URLs
- [ ] No broken keyword-level final URLs
- [ ] No broken DSA target URLs
- [ ] No broken asset URLs (sitelinks, callouts with URLs)
- [ ] No redirect chain issues on ad final URLs
- [ ] No redirect chain issues on keyword-level URLs
- [ ] All active landing pages use HTTPS
- [ ] Final URL expansion (if enabled) is not sending traffic to irrelevant pages
- [ ] Mobile landing pages are loading (check mobile-specific URLs if used)

### Bid strategy status

- [ ] No bid strategies show "Limited" or "Misconfigured" status
- [ ] Bid strategies in "Learning" status are expected (recent changes)
- [ ] No portfolio bid strategies show warnings

### Change History

- [ ] No unexpected changes appear in Change History (auto-applied recommendations, system changes)
- [ ] Auto-apply settings have not been re-enabled
- [ ] No changes by unknown users

### Feed health (Shopping/PMax only)

- [ ] No Merchant Center account-level issues or critical feed processing errors
- [ ] Feed processing status is healthy and freshness is within expected window
- [ ] Product disapproval count has not spiked and product warnings are reviewed
- [ ] No large unexpected changes in active product count (including high-volume products stopped showing)
- [ ] No broken Shopping final URL or mobile link URLs
- [ ] No inventory sync issues (advertising out-of-stock products)

### Performance Max health (PMax only)

- [ ] No disapproved asset groups
- [ ] No disapproved individual PMax assets
- [ ] No auto-generated text assets serving unintentionally
- [ ] No auto-generated video assets serving unintentionally
- [ ] Audience signals are configured on all asset groups
- [ ] Asset coverage is sufficient (all required asset types populated)

### Asset coverage (Search)

- [ ] Active campaigns have sitelink assets assigned
- [ ] Active campaigns have callout assets assigned
- [ ] Active campaigns have structured snippet assets assigned

### Backend pipeline health (Lead Gen only)

- [ ] Leads are reaching the CRM (check last 24 hours of lead delivery)
- [ ] No integration errors between Google Ads and CRM
- [ ] Offline conversion imports are recent and complete (if applicable)

### Trial and signup tracking (SaaS only)

- [ ] Trial signup conversion action is recording
- [ ] Signup volume is within expected range
- [ ] No broken steps in the signup funnel

---

## Automation coverage

Each check category has different automation potential. Use this table to prioritize what to automate first.

| **Check category** | **Automation potential** | **Primary tools** | **AI agents/skills** |
|---------------------|-------------------------|-------------------|----------------------|
| Conversion tracking health | High | Google rules (zero conv), scripts (volume drop, tag status), third-party tools (continuous monitoring) | Root cause analysis when tracking breaks, cross-checking tag configuration |
| Ad and asset compliance | High | Google rules (status = disapproved), third-party tools (granular asset-level scanning) | Policy violation pattern detection, appeal drafting |
| URL and landing page health | Medium-high | Scripts (UrlFetchApp for HTTP checks), third-party tools (real-time uptime monitoring) | Diagnosing redirect chains, page content validation |
| Bid strategy status | Medium | Google rules (status-based, limited), scripts (learning duration, target deviation) | Diagnosing why a strategy is stuck in learning, recommending fixes |
| Campaign settings and Change History | Medium | Third-party tools (Change History scanning), scripts (settings snapshots) | Change impact analysis, detecting unintended cascading effects |
| Feed health | High | Merchant Center native alerts, feed tools (Channable, DataFeedWatch), scripts (Content API) | Feed error diagnosis, attribute optimization suggestions |
| Performance Max health | Medium | Third-party tools (asset-level scanning), Google rules (asset group status, very limited) | Asset strength improvement recommendations, audience signal analysis |
| Asset coverage | Medium | Third-party tools (coverage gap detection), scripts (asset count checks) | Asset gap prioritization, copy suggestions for missing assets |
| Backend pipeline health | Low-medium | CRM integration monitoring, scripts (offline conversion upload checks) | Pipeline failure diagnosis, data reconciliation |

> ↪️ **For implementation recipes:** See: [Monitoring Automation Reference](../references/Monitoring Automation Reference.md) for specific rule, script, and tool patterns for each check category.

---

## Spend and delivery: a note on scope

Spend anomalies and delivery patterns are **Layer 2️⃣** (performance alerts), not Layer 1️⃣. They are detected by automated performance alerts, not by this health checklist.

If you notice a dramatic spend anomaly during your Layer 1️⃣ scan (e.g., a campaign spending 5x normal), flag it for investigation. But the systematic detection of spend and delivery deviations belongs in your alert configuration (See: [Alert Configuration Checklist](../checklists/Alert Configuration Checklist.md)), not in a manual daily scan.

---

## Quick reference

| Document | Relationship |
|----------|--------------|
| [Account Monitoring Mental Model](../mental-models/Account Monitoring Mental Model.md) | Framework: this checklist covers Layer 1️⃣ |
| [SOP – Run a Daily Account Health Check](../sops/SOP – Run a Daily Account Health Check.md) | Execution: daily triage procedure using this checklist |
| [Optimization Cadence Mental Model](../mental-models/Optimization Cadence Mental Model.md) | Foundation: daily cadence tier definition |
| [Anomaly Detection Mental Model](../mental-models/Anomaly Detection Mental Model.md) | Foundation: distinguishing signal from noise |
| [Alert Configuration Checklist](../checklists/Alert Configuration Checklist.md) | Companion: automate detection of health check items |
| [Monitoring Automation Reference](../references/Monitoring Automation Reference.md) | Reference: automation recipes for Layer 1️⃣ checks |
| [Budget Pacing Reference](../references/Budget Pacing Reference.md) | Reference: budget pacing mechanics |
| [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md) | Reference: post-launch specific checks |

---

## Version details

- **Version:** 4.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer
- **Changelog:** v4.0: Consolidated per-asset-type disapproval checks and feed health checks to reduce granularity. Added AI agents/skills column to Automation coverage table. v3.0: Removed inline tool annotations. Enhanced checks from TrueClicks and Adalysis sources: expanded ad/asset compliance (12 checks), URL health (9 checks), feed health (10 checks). Added Performance Max health section (7 checks), asset coverage section (3 checks), campaign settings checks (auto text assets, broad match). Replaced inline annotations with "Automation coverage" section. v2.0: Renamed from "Daily Monitoring Checklist" to "Account Health Checklist" (Layer 1️⃣ focus). Added automation indicators, frequency flexibility, vertical-specific sections (Shopping, Lead Gen, SaaS). Moved spend/delivery anomalies to Layer 2️⃣ scope note. Sentence case headings.

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
