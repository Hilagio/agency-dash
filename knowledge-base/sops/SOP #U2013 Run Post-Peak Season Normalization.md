# SOP – Run Post-Peak Season Normalization
Created: 2026-04-04

Agent_Executable: No
Category: Operational
Human_Approval_Required: No
Primary Outcome: Seasonal query waste eliminated, product feed reverted, and seasonal playbook documented for next year
SOP_ID: SOP_95
Secondary Outcomes: Post-peak negative keywords added, Shopping titles restored, Holiday Reflection Checklist completed, YoY baseline saved
Status: ready-to-publish
Domain: Operational
Pillar: 0

### Purpose

This SOP handles the post-peak cleanup and documentation process that preserves learnings and prevents seasonal query waste from eroding performance after a peak event.

> ❓ **The big question:** How do I prevent seasonal traffic from wasting budget after the event ends, and how do I capture what worked for next year?

This SOP covers Phases 4 (continued) and 5 of the Seasonal Optimization Lifecycle. It is triggered by the Exit Bridge of [SOP – Plan and Execute Seasonal Adjustments](../sops/SOP – Plan and Execute Seasonal Adjustments.md).

---

### What this SOP is NOT

This SOP does **not:**

- Cover peak-period execution or immediate post-event reversion (See: [SOP – Plan and Execute Seasonal Adjustments](../sops/SOP – Plan and Execute Seasonal Adjustments.md))
- Define the seasonal optimization framework (See: [Seasonal Optimization Mental Model](../mental-models/Seasonal Optimization Mental Model.md))
- Handle general negative keyword management (See: [SOP – Add Negative Keywords](../sops/SOP – Add Negative Keywords.md))
- Cover general search term analysis (See: [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md))

### When to run this SOP

Run this SOP:

- 1-2 weeks after a seasonal peak event ends
- After completing Phase 4 of [SOP – Plan and Execute Seasonal Adjustments](../sops/SOP – Plan and Execute Seasonal Adjustments.md)
- Before returning to standard optimization cadence

---

### Before you start

#### Required inputs

- Search term reports from the peak period and the 7-14 days after
- Pre-peak vs. peak performance comparison (from Phase 1 of the seasonal SOP)
- Action log from the peak SOP (what was changed: budgets, targets, keywords, extensions, feed)
- Access to Google Ads, Merchant Center, and supplemental feed

#### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Seasonal Optimization Mental Model](../mental-models/Seasonal Optimization Mental Model.md) | Holiday Reflection Checklist structure |
| [Negative Keyword Reference](../references/Negative Keyword Reference.md) | Negative keyword best practices |
| [Search Term Report Reference](../references/Search Term Report Reference.md) | Search term analysis methodology |

---

### Execution framework

| **Phase** | **Purpose** | **Duration** |
|-----------|-----------|-------------|
| 1️⃣ Post-Peak Query Analysis | Identify and negate seasonal queries that no longer convert | 1-2 hours |
| 2️⃣ Shopping Title and Feed Reversion | Remove seasonal terms from supplemental feed | 30 minutes |
| 3️⃣ Seasonal Playbook Documentation | Record learnings using Holiday Reflection Checklist | 1-2 hours |

---

## Phase 1️⃣: Post-Peak Query Analysis

### 1.1 Pull post-peak search term reports

1. In Google Ads, navigate to Insights and reports > Search terms
2. Set the date range to 7-14 days after the event ended
3. Filter by campaign type: Search and Shopping (separately)
4. Sort by cost (highest first)

### 1.2 Identify seasonal queries that no longer convert

Look for queries that match these patterns:

| **Pattern** | **Examples** | **Why it wastes budget** |
|------------|------------|------------------------|
| Event-specific terms | "black friday deals", "cyber monday sale", "black friday [product]" | Searchers clicking on stale results, no purchase intent |
| Time-sensitive queries | "when is black friday", "black friday date", "christmas sale dates" | Pure informational, zero conversion value post-event |
| Expired offer terms | "[brand] 50% off", "[brand] black friday code" | Offer no longer exists, clicks generate refund requests |
| Gift-related terms (post-Christmas) | "christmas gift for [person]", "last minute gift ideas" | No fulfillment possible after shipping deadlines |

### 1.3 Add post-peak negative keywords

1. For broad patterns (event names): add as phrase match negatives at the campaign level or shared list
2. For specific terms: add as exact match negatives
3. Decision: add to shared negative keyword list if the pattern applies across all campaigns

> ⚠️ **Do not negate terms permanently if the event recurs.** Create a seasonal negative keyword list that you activate post-peak and deactivate before next year's event. This prevents accidentally blocking seasonal traffic next year.

### 1.4 Verify seasonal keyword deactivation

1. Confirm all seasonal keywords (tagged/labeled in the seasonal SOP Phase 2.4) are paused
2. Check that no seasonal ad groups are still active
3. Verify seasonal extensions have expired or been removed

---

## Phase 2️⃣: Shopping Title and Feed Reversion

### 2.1 Remove seasonal terms from supplemental feed

1. Open the supplemental feed used to add seasonal terms to product titles
2. Remove or blank out seasonal title modifications (e.g., "Black Friday" prefix)
3. Submit the updated supplemental feed to Merchant Center

### 2.2 Verify reversion in Merchant Center

1. Allow 24-48 hours for Merchant Center to process the updated feed
2. Spot-check 5-10 products in Merchant Center to confirm titles reverted
3. Verify no seasonal `additional_image_link` or `lifestyle_image_link` attributes remain active

### 2.3 Remove seasonal sale prices (if applicable)

1. Remove `sale_price` and `sale_price_effective_date` attributes from the feed (if scheduled end dates did not handle this automatically)
2. Verify sale price badges are no longer showing in Shopping results

---

## Phase 3️⃣: Seasonal Playbook Documentation

### 3.1 Complete the Holiday Reflection Checklist

Create a document (or update last year's) with the following sections:

**Competitor Analysis:**
- How did your competitors behave in terms of impression share?
- What strategies or tactics did your competitors use that seemed effective?
- What can you learn from your competitors' offers and landing pages?
- What can you learn from your competitors' ads and messaging?

**Promotional Offers Analysis:**
- Which promotional offers did great and drove the most conversions?
- Which promotional offers failed miserably?
- How could you have made your offers even more attractive?

**Campaign Performance Analysis:**
- Which campaigns yielded the best ROI? What can you learn from this?
- Were there campaigns that underperformed? What could be the reason?
- Did you hit your targets? If not, what could be the reason?

**Budget & Spend Analysis:**
- What was the increase in ad spend (percentage and absolutes)?
- Did you run into budget limitations? Can you improve future budget planning?

**General:**
- Are there any other remarks worth noting?

### 3.2 Document tactical details

Record specific numbers for next year's Phase 1 input:

| **Item** | **What to record** |
|---------|-------------------|
| SBA percentages used | Exact percentages by campaign type and day |
| Budget levels | Pre-peak, peak, and post-peak daily budgets per campaign |
| Target adjustments | tCPA/tROAS before, during, and after peak |
| Seasonal keywords | Full list of activated/added seasonal keywords |
| Top performing offers | Which offers drove the highest CVR and ROAS |
| Wasted spend | Amount spent on queries that did not convert, by pattern |
| Data Exclusion | Date range used, if applicable |

### 3.3 Save the baseline for next year

1. Export the YoY comparison data (from the seasonal SOP Phase 1) as next year's historical baseline
2. Save the completed Holiday Reflection Checklist alongside the data
3. Store in a consistent location (client folder, shared drive, or internal knowledge base)
4. Note the date and event name clearly in the file name

---

### Validation & Definition of Done

- [ ] Post-peak search term report reviewed and seasonal waste queries identified
- [ ] Negative keywords added for post-peak seasonal patterns
- [ ] All seasonal keywords verified as paused
- [ ] Shopping product titles reverted via supplemental feed
- [ ] Sale prices removed or expired
- [ ] Holiday Reflection Checklist completed with all sections
- [ ] Tactical details documented with specific numbers
- [ ] Baseline data saved for next year

---

### Exit → Entry bridge

| **Timeframe** | **Action** |
|--------------|-----------|
| After completing this SOP | Return to standard optimization cadence per [Optimization Cadence Mental Model](../mental-models/Optimization Cadence Mental Model.md) |
| 2-4 weeks post-peak | Monitor performance stabilization via [SOP – Run a Daily Account Health Check](../sops/SOP – Run a Daily Account Health Check.md) |
| T-8 weeks before next event | Begin [SOP – Plan and Execute Seasonal Adjustments](../sops/SOP – Plan and Execute Seasonal Adjustments.md) using this year's retrospective as Phase 1 input |

---

### FAQ

**Q: How long should I wait before running this SOP?**
A: Start 1 week after the event ends. This gives enough time for post-peak search term patterns to appear while being early enough to prevent weeks of waste.

**Q: Should I permanently negate seasonal terms?**
A: No. Create a seasonal negative keyword list that you activate post-peak and deactivate before the next event. This prevents accidentally blocking valuable seasonal traffic next year.

**Q: What if the client did not run a promotion but competitors did?**
A: Still run Phase 3 (retrospective). Document competitor behavior, IS impact, and CPC changes. This data is valuable for deciding whether to participate next year.

**Q: Can I skip Phase 3 if the event was small?**
A: No. Phase 3 is the highest-leverage 30 minutes in seasonal optimization. The compounding effect of documented learnings year over year is the difference between average and exceptional seasonal performance.

---

### Quick reference: support library

| Document | Type | Used in |
|----------|------|---------|
| [Seasonal Optimization Mental Model](../mental-models/Seasonal Optimization Mental Model.md) | Mental Model | Reflection checklist structure |
| [Negative Keyword Reference](../references/Negative Keyword Reference.md) | Reference | Negative keyword patterns |
| [Search Term Report Reference](../references/Search Term Report Reference.md) | Reference | Search term analysis |

### Related SOPs

| SOP | Relationship |
|-----|-------------|
| [SOP – Plan and Execute Seasonal Adjustments](../sops/SOP – Plan and Execute Seasonal Adjustments.md) | Upstream: Phases 1-4 |
| [SOP – Add Negative Keywords](../sops/SOP – Add Negative Keywords.md) | Related: negative keyword mechanics |
| [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md) | Related: search term analysis |
| [SOP – Run a Daily Account Health Check](../sops/SOP – Run a Daily Account Health Check.md) | Downstream: return to standard monitoring |

---

### Common failures

| **Failure** | **Why it happens** | **How to avoid** |
|-------------|-------------------|-----------------|
| Seasonal queries wasting budget for weeks | No post-peak negative keyword pass | Run Phase 1 within 1 week of event end |
| Shopping titles still showing "Black Friday" in January | Supplemental feed not reverted | Run Phase 2 immediately, verify in Merchant Center |
| Same mistakes repeated next year | No retrospective documented | Run Phase 3 before the event fades from memory |
| Seasonal negatives blocking next year's traffic | Permanently negated seasonal terms | Use a seasonal negative list, deactivate before next event |

---

## Version details

- **Version:** 1.0
- **Last Updated:** April 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
