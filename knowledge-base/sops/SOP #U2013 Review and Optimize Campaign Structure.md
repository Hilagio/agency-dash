# SOP – Review and Optimize Campaign Structure
Created: 2026-02-14

SOP_ID: SOP_86
Status: Done
Category: Operational
Primary Outcome: Campaign structure evaluated, consolidation or split actions executed, ad group relevance gaps resolved
Agent_Executable: No
Human_Approval_Required: Yes
Domain: Search
Pillar: 6

## Purpose

This SOP walks you through evaluating your Search campaign structure, identifying when campaigns should be consolidated or split, resolving ad group relevance gaps, and verifying that impression volume is distributed effectively across ad groups.

> ❓ **The big question:** Is your current campaign structure helping or hurting performance, and what specific structural changes will unlock better results?

Campaign structure degrades over time. What started as a clean architecture accumulates redundant campaigns, fragmented budgets, and ad groups where keyword-to-ad relevance has drifted. This SOP provides a quarterly structural review that catches these issues before they compound into performance problems.

---

## What this SOP is NOT

This SOP does **not:**

- Optimize bids, budgets, or bid strategies (See: [SOP – Handle Budget-Limited Campaigns](../sops/SOP – Handle Budget-Limited Campaigns.md))
- Rebuild a campaign from scratch (See: [SOP – Launch a Search Campaign](../sops/SOP – Launch a Search Campaign.md))
- Cover Shopping, PMax, or Display campaign structures (each has its own structural model)
- Provide the conceptual framework for why structure matters (See: [Modern Search Campaign Mental Model](../mental-models/Modern Search Campaign Mental Model.md))
- Run a full optimization cycle across all levers (See: [SOP – Run Search Campaign Optimization Cycle](../sops/SOP – Run Search Campaign Optimization Cycle.md))

---

## When to run this SOP

Run this SOP on a quarterly cadence. Run it outside cadence when:

| Trigger | Why |
|---------|-----|
| A campaign has fewer than 30 conversions/month for 2+ consecutive months | Insufficient data for smart bidding to optimize effectively |
| You discover redundant targeting across campaigns | Campaigns are competing against each other in the same auction |
| Budget is fragmented across 5+ campaigns with similar intent | Small budgets starve each campaign of learning data |
| A high-performing campaign is budget-limited and shares budget allocation with low performers | Strong performers are being dragged down by structural mixing |
| After major account changes (new product lines, market exit, rebrand) | Structure needs to reflect current business reality |

---

## Before you start

### Required inputs

- Access to Google Ads account with full editing permissions
- Campaign performance data for the last 90 days (conversions, CPA/ROAS, cost, impression share)
- Ad group performance data for the last 90 days (impressions, clicks, conversions, Quality Score)
- Keyword-level Quality Score data with sub-component breakdown
- Search term reports for the last 30 days
- Current daily budgets per campaign

### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Modern Search Campaign Mental Model](../mental-models/Modern Search Campaign Mental Model.md) | Consolidation-first philosophy and three golden rules |
| [Campaign Scaling Mental Model](../mental-models/Campaign Scaling Mental Model.md) | Scaling axis framework for split decisions |
| [SOP – Handle Budget-Limited Campaigns](../sops/SOP – Handle Budget-Limited Campaigns.md) | Copy + Paste method reference |
| [SOP – Run Search Campaign Optimization Cycle](../sops/SOP – Run Search Campaign Optimization Cycle.md) | Post-restructure optimization routing |
| [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md) | Phase 4 ad group restructuring decisions |
| [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md) | Phase 4 RSA creation for new ad groups |

---

## Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Campaign-level analysis** | Evaluate conversion volume, budget utilization, and targeting overlap per campaign | Baseline performance snapshot, campaigns flagged for action |
| **Phase 2️⃣: Consolidation assessment** | Identify campaigns that should be merged | Consolidation plan with target campaign mapping |
| **Phase 3️⃣: Split assessment** | Identify campaigns that should be separated using the Copy + Paste method | Split plan with segment definitions and budget allocation |
| **Phase 4️⃣: Ad group restructuring** | Resolve keyword-to-ad relevance gaps and Quality Score clusters | Ad group moves, new ad groups created, RSAs updated |
| **Phase 5️⃣: Volume distribution check** | Verify impressions are concentrated in viable ad groups | Low-volume ad groups paused or merged |
| **Phase 6️⃣: Documentation and scheduling** | Record all changes, set monitoring checkpoints | Change log, 30-day monitoring plan |

---

## Phase 1️⃣: Campaign-level analysis

### 1.1 Build the campaign performance snapshot

Pull data for the last 90 days and populate this table for every active Search campaign:

| Campaign | Monthly conversions (avg) | CPA or ROAS | IS Lost (Budget) % | IS Lost (Rank) % | Daily budget | Budget utilization % | Active ad groups |
|----------|--------------------------|-------------|---------------------|-------------------|--------------|---------------------|------------------|
| | | | | | | | |

Budget utilization = (actual spend / daily budget) x 100, averaged over 90 days.

### 1.2 Flag campaigns for structural review

Apply these flags to each campaign:

| Flag | Condition | Implication |
|------|-----------|-------------|
| **Low volume** | Fewer than 30 conversions/month for 2+ months AND no portfolio bid strategy is being used | Smart bidding cannot optimize reliably. A portfolio bid strategy pools data across campaigns, potentially providing sufficient volume |
| **Budget-starved** | IS Lost (Budget) above 20% AND campaign is profitable | Structural fix may free budget without increasing spend |
| **Redundant targeting** | Two or more campaigns targeting the same keyword themes or audience segments | Internal auction competition, fragmented data |
| **Mixed performance** | Campaign contains ad groups with CPA spread of more than 3x between best and worst | High performers subsidizing low performers |
| **Underutilized** | Budget utilization below 50% for 30+ days | Budget is allocated but not being spent, reallocation opportunity |

### 1.3 Check for targeting overlap

Compare keyword lists across campaigns. Two campaigns overlap when:

1. They contain the same keywords or close variants in different match types
2. Their search term reports show 20%+ overlap in matched queries
3. They target the same geographic and audience segments with similar intent themes

Document every overlap pair with the estimated wasted spend from internal competition.

> 💡 **Search term evidence:** Pull search term reports for each campaign and compare the top 100 queries by cost. Queries appearing in multiple campaigns' reports are direct evidence of internal auction competition.

**Output:** Campaign performance snapshot with flags applied and overlap pairs documented.

---

## Phase 2️⃣: Consolidation assessment

### 2.1 Identify consolidation candidates

A campaign is a consolidation candidate when it meets one or more of these criteria:

| Criterion | Threshold | Why consolidation helps |
|-----------|-----------|------------------------|
| Low monthly conversions | Fewer than 30/month | Merging provides the combined volume smart bidding needs |
| Redundant targeting | 20%+ query overlap with another campaign | Eliminates internal competition, concentrates data |
| Fragmented budget | Low daily budgets on campaigns with similar intent and goals | Combined budget enables better auction coverage and faster learning |
| Identical bid strategy and targets | Same tCPA/tROAS target, same bid strategy | No structural reason to keep them separate |
| Same creative theme | Keywords in both campaigns could be served by the same RSA | Consolidation does not sacrifice relevance |

> ⚠️ **Do not consolidate campaigns that have valid structural reasons for separation:** Valid reasons include: different geographic targets with different CPAs, different product lines requiring different landing pages, different bid strategy types, or mandated budget isolation (e.g., brand vs. non-brand).

> 💡 **Alternative to consolidation:** If campaigns share the same bid strategy type and similar targets but have valid structural reasons to remain separate (different landing pages, different creative themes), consider linking them to a **portfolio bid strategy** instead of merging. A portfolio bid strategy pools conversion data across campaigns, giving smart bidding the volume it needs without losing structural separation. See [SOP – Set Up Portfolio Bid Strategies](../sops/SOP – Set Up Portfolio Bid Strategies.md).

### 2.2 Plan the consolidation

For each consolidation pair or group:

1. Select the **surviving campaign**: the one with the most conversion history and best Quality Scores
2. Map which ad groups from the absorbed campaign will move into the surviving campaign
3. Check for keyword conflicts: if both campaigns have the same keyword, keep the version with higher Quality Score
4. Check for conflicting negative keywords: review negative keyword lists on both campaigns. After merging, negatives from the absorbed campaign may block high-performing queries in the surviving campaign. Remove any negatives that conflict with active keywords in the consolidated campaign
5. Plan the budget: surviving campaign gets the combined budget of all merged campaigns
6. Verify the surviving campaign's bid strategy can handle the increased volume

### 2.3 Execute the consolidation

1. **In Google Ads Editor:** Copy ad groups from the absorbed campaign into the surviving campaign
2. **Pause** (do not delete) the absorbed campaign's ad groups after copying
3. **Increase the daily budget** of the surviving campaign to match the combined total
4. **Keep the absorbed campaign paused** for 30 days as a rollback safety net
5. **Delete the absorbed campaign** only after 30 days of stable performance in the surviving campaign

> 💡 **Pause, do not delete:** Keeping the absorbed campaign paused for 30 days allows you to revert if the consolidation causes unexpected performance drops. Deletion is permanent.

**Output:** Consolidation plan executed, absorbed campaigns paused, budgets combined.

---

## Phase 3️⃣: Split assessment

### 3.1 Identify split candidates

A campaign is a split candidate when:

| Criterion | Signal | Why splitting helps |
|-----------|--------|---------------------|
| Divergent intent tiers | Ad groups serving informational and transactional queries in the same campaign | Different intents need different bids, budgets, and landing pages |
| Budget-limited with mixed performance | IS Lost (Budget) above 20% AND CPA spread of 3x+ between best and worst ad groups | High performers are budget-starved because low performers consume the shared budget |
| Different performance tiers | Some ad groups consistently convert at half the CPA / twice the ROAS of others with 90+ days of data | Independent budgets let you fund winners and constrain losers |
| Geographic divergence | Performance varies dramatically by location within the same campaign | Location-based splits enable geo-specific budgets and targets |

> 💡 **Before splitting, consider alternatives:**
> - **Portfolio bid strategy:** If the issue is that mixed-performance ad groups prevent smart bidding from setting appropriate bids, a portfolio bid strategy across campaigns can share conversion data without requiring a full split.
> - **Shared budget:** If the issue is budget allocation between segments, a shared budget lets Google allocate dynamically without structural separation.
> Only proceed with a split when portfolio bid strategies and shared budgets cannot address the performance divergence.

> ⚠️ **Only split when both resulting campaigns will have enough volume:** Each campaign needs at least 15 conversions per month to sustain smart bidding. Splitting a 40-conversion campaign into two 20-conversion campaigns is viable. Splitting a 20-conversion campaign into two 10-conversion campaigns creates two data-starved campaigns.

### 3.2 Execute the split using the Copy + Paste method

The Copy + Paste method preserves learning on the stronger segment by keeping it in the original campaign and moving the weaker segment out.

1. **Copy the entire campaign** in Google Ads Editor (Copy > Paste as new campaign)
2. **In the ORIGINAL campaign:** Pause the weaker segment (the ad groups, keywords, or locations you are splitting off). The original campaign retains its full history, Quality Scores, and bid strategy learning for the stronger segment
3. **In the NEW (copied) campaign:** Pause the stronger segment. The new campaign runs the weaker segment independently
4. **Set independent budgets:** Allocate a higher share to the original campaign (strong performers), a lower share to the new campaign (weaker segment being tested independently)
5. **Keep bid strategy settings identical** in both campaigns initially. Adjust targets only after 2-4 weeks of independent data

> 💡 **Why move the weaker segment OUT of the original:** The original campaign preserves its conversion history and bid strategy learning. Moving the stronger segment out would reset the learning on your best performers, the exact opposite of what you want.

### 3.3 Post-split monitoring

| Timeframe | Action |
|-----------|--------|
| Day 1-3 | Verify both campaigns are serving impressions without errors |
| Week 1 | Learning period: do not make changes unless a campaign is not serving at all |
| Week 2-3 | Compare performance between the two campaigns against pre-split baselines |
| Week 4 | Evaluate: is the original campaign performing better without the drag of the weaker segment? |
| Week 4 decision | If the weaker segment campaign is unprofitable after 4 weeks, pause it and reallocate budget to the original |

**Output:** Split plan executed, independent budgets set, monitoring schedule created.

---

## Phase 4️⃣: Ad group restructuring

> ↪️ **Framework reference:** Ad group restructuring decisions are governed by the [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md). The core rule: consolidate by default, split only when one RSA cannot credibly serve all keywords (the Single Ad Test). Use DKI, ad customizers, and keyword-level final URLs before splitting.

### 4.1 Audit keyword-to-ad relevance

For every ad group with 100+ monthly impressions, check whether the keywords match the RSA messaging:

1. Pull the keyword list for the ad group
2. Read the RSA headlines and descriptions
3. Ask: "Does this RSA credibly speak to every keyword in this ad group?"

| If... | Then... |
|-------|---------|
| All keywords share the same intent and the RSA addresses that intent | No action needed |
| Some keywords represent a different intent or product category | Move those keywords to a new ad group with a tailored RSA |
| Keywords match the RSA but Quality Score sub-component "Ad Relevance" is Below Average | The RSA needs keyword-specific headlines, not an ad group restructure |

### 4.2 Identify Quality Score clusters

Group keywords by Quality Score to find structural patterns:

| QS range | Typical structural cause | Structural fix |
|----------|------------------------|----------------|
| QS 7-10 | Well-matched ad group | No structural change needed |
| QS 5-6 | Moderate relevance gap | Check if splitting into tighter ad groups improves Ad Relevance |
| QS 1-4 | Severe mismatch between keyword, ad, and landing page | Move keyword to a dedicated ad group with intent-matched RSA and landing page |

> ↪️ **QS improvement execution:** This phase identifies structural causes of low Quality Score. For the full QS improvement workflow, route to [Improve Quality Score](../playbooks/Improve Quality Score.md).

### 4.3 Execute ad group moves

For each keyword that needs to move:

1. Create the new ad group in the same campaign (or the appropriate campaign if consolidation/splits changed the structure)
2. Write a new RSA tailored to the keyword cluster's intent
3. Set the landing page URL to the most relevant page for that intent
4. Pause the keyword in the old ad group
5. Add the keyword to the new ad group
6. Copy relevant negative keywords from the old ad group

> ⚠️ **Do not move more than 30% of a campaign's keywords in a single round:** Large-scale moves destabilize bid strategy learning. If more than 30% of keywords need restructuring, execute in two rounds separated by 2 weeks.

**Output:** Keyword-to-ad relevance gaps resolved, new ad groups created with tailored RSAs.

---

## Phase 5️⃣: Volume distribution check

### 5.1 Pull ad group impression data

Export the last 90 days of ad group data. Focus on:

| Metric | Target | Action if below |
|--------|--------|-----------------|
| Monthly impressions per ad group | 4,000+ (1,000/week) | Evaluate for merge or pause |
| Monthly clicks per ad group | 50+ | Below 50 clicks provides almost no learning signal |
| Monthly conversions per ad group | 1+ | Zero-conversion ad groups after 90 days need diagnosis |

> ↪️ **Volume threshold source:** 1,000 impressions/week (4,000/month) per ad group is the minimum for actionable asset-level data. See [Modern Search Campaign Mental Model](../mental-models/Modern Search Campaign Mental Model.md).

### 5.2 Classify ad groups by viability

| Classification | Criteria | Action |
|----------------|----------|--------|
| **Healthy** | 4,000+ monthly impressions, converting | No action |
| **Low volume, converting** | Under 4,000 monthly impressions but generating conversions | Merge into a related ad group with compatible intent if possible |
| **Low volume, not converting** | Under 4,000 monthly impressions, zero conversions in 90 days | Pause unless the keywords are strategically important for coverage |
| **High volume, not converting** | 4,000+ monthly impressions, zero conversions in 90 days | Diagnose: landing page, keyword intent, or ad relevance issue. Do not pause without investigation |

### 5.3 Merge low-volume ad groups

When merging:

1. Select the receiving ad group (the one with more history and better Quality Scores)
2. Move keywords from the low-volume ad group into the receiving ad group
3. Check that the receiving ad group's RSA still covers the intent of the incoming keywords
4. If not, update the RSA headlines to include the new intent
5. Pause the empty ad group after moving all keywords

### 5.4 Verify volume concentration

After merges, recalculate: what percentage of total campaign impressions are concentrated in ad groups with 4,000+ monthly impressions?

| Concentration | Assessment |
|---------------|------------|
| 90%+ of impressions in healthy ad groups | Good. Structure supports efficient optimization |
| 70-89% | Acceptable. Monitor low-volume ad groups for future consolidation |
| Below 70% | Structure is too fragmented. Revisit Phase 4 for additional merges |

**Output:** Low-volume ad groups merged or paused, impression concentration verified.

---

## Phase 6️⃣: Documentation and scheduling

### 6.1 Record all structural changes

Document every change made during this review:

| Change type | Details to record |
|-------------|-------------------|
| Campaign consolidated | Which campaigns were merged, surviving campaign name, combined budget |
| Campaign split | Original campaign, new campaign, segment definitions, budget allocation |
| Ad group created | Campaign, ad group name, keyword cluster, RSA summary |
| Ad group merged | Source ad group, receiving ad group, keywords moved |
| Ad group paused | Campaign, ad group name, reason for pause |
| Keywords moved | From ad group, to ad group, count, reason |

### 6.2 Set monitoring checkpoints

| Timeframe | Check |
|-----------|-------|
| Week 1 | All campaigns and ad groups are serving, no errors or disapprovals |
| Week 2 | Bid strategies have exited learning period, impressions are flowing as expected |
| Week 4 | Compare performance against pre-restructure baselines: CPA, ROAS, conversion volume |
| Week 8 | Full performance evaluation: did the structural changes improve or hurt overall account performance? |

### 6.3 Schedule next quarterly review

Set a calendar reminder for the next structural review in 90 days. Include the baseline metrics from this review for comparison.

**Output:** Change log completed, monitoring checkpoints set, next review scheduled.

---

## Validation & definition of done

This SOP is complete when:

- [ ] Campaign-level performance snapshot built with flags applied (Phase 1)
- [ ] Targeting overlap documented for all campaign pairs (Phase 1)
- [ ] Consolidation candidates identified and merged into surviving campaigns (Phase 2)
- [ ] Split candidates identified and separated using the Copy + Paste method (Phase 3)
- [ ] Ad group keyword-to-ad relevance audited and gaps resolved (Phase 4)
- [ ] Quality Score clusters identified and structural fixes applied (Phase 4)
- [ ] Low-volume ad groups merged or paused (Phase 5)
- [ ] Impression concentration verified at 70%+ in healthy ad groups (Phase 5)
- [ ] All changes documented with monitoring checkpoints set (Phase 6)
- [ ] Next quarterly review scheduled (Phase 6)

---

## Exit → entry bridge

After completing the structural review:

| Timeframe | Action |
|-----------|--------|
| Week 1-2 | Monitor restructured campaigns through learning period, no changes |
| Week 3-4 | Compare against pre-restructure baselines, flag anomalies |
| Week 4+ | Resume normal optimization cadence on the new structure |
| 90 days | Run this SOP again for the next quarterly review |

**If issues arise after restructuring:**

| Issue | Route to |
|-------|----------|
| Consolidated campaign underperforms vs. pre-merge baseline | Revert: re-enable the paused absorbed campaign, pause the merged ad groups |
| Split campaigns both lack volume | Re-merge using the consolidation process in Phase 2 |
| Budget-limited after restructuring | [SOP – Handle Budget-Limited Campaigns](../sops/SOP – Handle Budget-Limited Campaigns.md) |
| Quality Score drops after keyword moves | [Improve Quality Score](../playbooks/Improve Quality Score.md) |
| Performance anomaly during monitoring period | [SOP – Investigate Performance Anomalies](../sops/SOP – Investigate Performance Anomalies.md) |

---

## Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Splitting campaigns with insufficient volume | Assumption that separation always improves performance | Verify both resulting campaigns will have 15+ monthly conversions before splitting |
| Consolidating campaigns with legitimately different targets | Treating all overlap as waste | Check for valid structural reasons (different geos, products, bid strategies) before merging |
| Moving the strong segment out of the original campaign | Misunderstanding which segment to move | Always move the WEAKER segment out. The original campaign preserves its history and learning |
| Restructuring more than 30% of keywords at once | Trying to fix everything in one pass | Execute in rounds of 30% max, separated by 2 weeks |
| Skipping the monitoring period | Assuming the changes worked | Run the full 8-week monitoring schedule before making additional structural changes |
| Deleting paused campaigns too early | Wanting a clean account | Keep absorbed campaigns paused for 30 days as a rollback safety net |

---

## Related documents

| Document | Type | Relationship |
|----------|------|--------------|
| [Modern Search Campaign Mental Model](../mental-models/Modern Search Campaign Mental Model.md) | Mental Model | Consolidation-first philosophy and three golden rules |
| [Campaign Scaling Mental Model](../mental-models/Campaign Scaling Mental Model.md) | Mental Model | Scaling axis framework for deciding when to split vs. consolidate |
| [SOP – Handle Budget-Limited Campaigns](../sops/SOP – Handle Budget-Limited Campaigns.md) | SOP | Copy + Paste method reference, budget constraint resolution |
| [SOP – Run Search Campaign Optimization Cycle](../sops/SOP – Run Search Campaign Optimization Cycle.md) | SOP | Post-restructure optimization routing |
| [Improve Quality Score](../playbooks/Improve Quality Score.md) | Playbook | QS improvement routing after structural changes |
| [SOP – Launch a Search Campaign](../sops/SOP – Launch a Search Campaign.md) | SOP | When restructuring reveals the need for a new campaign |
| [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md) | Mental Model | Ad group consolidation vs. segmentation principles |
| [SOP – Set Up Portfolio Bid Strategies](../sops/SOP – Set Up Portfolio Bid Strategies.md) | SOP | Alternative to consolidation for volume-starved campaigns |
| [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md) | SOP | RSA creation when new ad groups are built in Phase 4 |

---

## Version details

- **Version:** 2.0
- **Last Updated:** March 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.