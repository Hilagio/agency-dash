# Search Campaign Health Checklist
Created: 2026-02-14
Updated: 2026-04-02

Support_ID: CHECKLIST_29
Status: Done
Category: Search
Reference Type: Checklist
Agent_Readable: Yes
Human_Facing: Yes
Domain: Search
Pillar: 7

## Purpose

Validates that a Search campaign is healthy across all optimization dimensions before running detailed optimization procedures. Use this checklist to identify which areas need attention, then route to the appropriate SOP or reference for execution.

---

## What this checklist validates

This checklist confirms:

- Keyword portfolio is healthy: quality scores, spend efficiency, match type coverage
- Search terms are controlled: irrelevant queries caught, exclusion lists linked
- Ads are performing and being tested: RSA strength, relevance, iteration status
- Extensions provide sufficient coverage
- Bid strategy is operating within healthy parameters
- Budget is not silently limiting performance
- Campaign structure supports efficient delivery
- Competitive position is monitored

This checklist does **NOT:**

- Execute optimization procedures (those live in campaign optimization SOPs)
- Audit account-level settings (See: [Account Health Checklist](../checklists/Account Health Checklist.md))
- Validate initial campaign setup (See: [Search Campaign Launch Checklist](../checklists/Search Campaign Launch Checklist.md))

---

## When to use

Run this checklist:

- Before running a Search campaign optimization cycle
- During weekly or bi-weekly performance reviews
- When diagnosing Search campaign performance issues
- After inheriting an existing Search campaign for management

---

## Checklist

### Keyword health

- [ ] Fewer than 20% of keywords have QS below 7
- [ ] No non-converting keywords with spend exceeding 2x target CPA and 50+ clicks
- [ ] Every campaign or ad group with Search IS below 70% is listed
- [ ] IS Lost (Budget) and IS Lost (Rank) values documented
- [ ] No duplicate keywords across ad groups or campaigns causing cannibalization

> ↪️ **Quality Score deep dive:** See [Quality Score Reference](../references/Quality Score Reference.md) for component breakdowns and improvement levers.

### Search term health

- [ ] Search term report is pulled for a date range at least as long as the account's conversion lag
- [ ] No new irrelevant query patterns consuming more than 5% of campaign spend
- [ ] N-gram exclusion lists linked to campaign (both non-converting and inefficient lists)
- [ ] Primary irrelevant search term exclusion list linked to campaign
- [ ] Every high-performing search term not yet added as a keyword is listed
- [ ] Every close variant whose CPA exceeds its parent keyword by more than 50% is listed

> ↪️ **Search term analysis:** See [Search Term Report Reference](../references/Search Term Report Reference.md) for report configuration and analysis patterns.

> ↪️ **N-gram methodology:** See [N-gram Analysis Reference](../references/N-gram Analysis Reference.md) for exclusion list building and maintenance.

### Ad health

- [ ] All ad groups have at least one active RSA
- [ ] Asset performance judged by CPI/RPI/PPI and Asset Impression Share (AIS), not by Ad Strength or CTR
- [ ] Every ad group has an active RSA asset test running under the Iteration Loop
- [ ] No RSA has more than 2 pinned positions

### Extension coverage

- [ ] Minimum 4 active sitelinks per campaign
- [ ] Minimum 4 active callouts per campaign
- [ ] Structured snippets configured
- [ ] Auto-generated assets are disabled, or an exception is documented

> ↪️ **Full extension validation:** See [Extension Coverage Checklist](../checklists/Extension Coverage Checklist.md) for the complete extension gate.

### Bid strategy health

- [ ] Bid strategy not in "Learning" or "Learning (limited)" for 14+ days
- [ ] Campaigns on Target CPA or Maximize Conversions have 15+ monthly conversions
- [ ] Campaigns on Target ROAS or Maximize Conversion Value have 30+ monthly conversions
- [ ] Every campaign under 50 monthly conversions has a documented decision
- [ ] Actual CPA/ROAS within 20% of target over the last 14 days
- [ ] No major changes within the last 1-2 conversion cycles (strategy switch, target change > 25%, budget change > 30%, geographic targeting change)

> ↪️ **Bid strategy deep dive:** See [Bid Strategy Health Checklist](../checklists/Bid Strategy Health Checklist.md) for the complete bid strategy validation gate.

### Budget health

- [ ] Every campaign losing more than 10% impression share to budget is flagged
- [ ] Monthly spend pacing on track (within 10% of monthly budget target)

### Structure health

- [ ] Every ad group receives 4,000+ monthly impressions (1,000 per week)
- [ ] Keyword-to-ad relevance verified: keywords in each ad group match ad messaging
- [ ] No ad group runs on a single keyword with fewer than 500 monthly searches

### Competitive health

- [ ] Impression share shift versus the prior period is recorded from Auction Insights
- [ ] Every competitor new to Auction Insights is listed
- [ ] Every overlap rate change above 10 percentage points is flagged

---

## Quick reference

| Document | Relationship |
|----------|-------------|
| [Quality Score Reference](../references/Quality Score Reference.md) | QS component breakdown and improvement levers |
| [Keyword Performance Analysis Mental Model](../mental-models/Keyword Performance Analysis Mental Model.md) | Framework for evaluating keyword portfolio health |
| [Search Term Report Reference](../references/Search Term Report Reference.md) | Search term report configuration and analysis |
| [N-gram Analysis Reference](../references/N-gram Analysis Reference.md) | N-gram exclusion list methodology |
| [Bid Strategy Health Checklist](../checklists/Bid Strategy Health Checklist.md) | Complete bid strategy validation gate |
| [Extension Coverage Checklist](../checklists/Extension Coverage Checklist.md) | Complete extension coverage validation |
| [Search Campaign Launch Checklist](../checklists/Search Campaign Launch Checklist.md) | Initial campaign setup validation |
| [Account Health Checklist](../checklists/Account Health Checklist.md) | Account-level health checks (Layer 1) |

---

## Version details

- **Version:** 2.0
- **Last Updated:** April 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
