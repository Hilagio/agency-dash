# SOP – Run Shopping Campaign Optimization Cycle
Created: 2026-02-14

SOP_ID: SOP_77
Status: Done
Category: Shopping
Primary Outcome: Complete Shopping campaign optimization cycle with feed, product, and bid actions documented
Agent_Executable: No
Human_Approval_Required: No
Domain: Shopping
Pillar: 6

## Purpose

This SOP runs a structured optimization cycle for Standard Shopping campaigns. It orchestrates existing Shopping support documents into a repeatable routine covering feed health, product performance, search terms, bids, and structure.

> ❓ **The big question:** What is the most efficient sequence for optimizing a Shopping campaign, and how do I make sure nothing gets missed?

---

## What this SOP is NOT

This SOP does **not:**

- Set up a product feed from scratch (See: [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md))
- Launch a new Shopping campaign (See: [SOP – Launch Standard Shopping Campaign](../sops/SOP – Launch Standard Shopping Campaign.md))
- Implement performance-based segmentation for the first time (See: [SOP – Set Up Performance-Based Shopping Segmentation](../sops/SOP – Set Up Performance-Based Shopping Segmentation.md))
- Replace general weekly performance reviews (See: [SOP – Run a Weekly Performance Review](../sops/SOP – Run a Weekly Performance Review.md))

## When to run this SOP

| Monthly conversion volume | Recommended cadence |
|---------------------------|---------------------|
| 200+ | Weekly |
| 50-200 | Bi-weekly |
| <50 | Monthly |

Run immediately (outside cadence) when ROAS drops 20%+ for two consecutive periods, Merchant Center flags a disapproval spike, or product catalog changes significantly.

---

## Before you start

### Required inputs

- Google Ads account with Editor access and Google Merchant Center access
- Product-level performance data (minimum 14 days, 30 days preferred)
- Target ROAS or target CPA per campaign
- Previous cycle's action log (for continuity)

### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Shopping Campaign Health Checklist](../checklists/Shopping Campaign Health Checklist.md) | Phase 1 triage |
| [Shopping Product Performance Reference](../references/Shopping Product Performance Reference.md) | Phase 3 product analysis |
| [Product Feed Optimization Guidelines](../guidelines/Product Feed Optimization Guidelines.md) | Phase 2 feed actions |
| [Product Feed Segmentation Mental Model](../mental-models/Product Feed Segmentation Mental Model.md) | Phase 6 structure decisions |

### Time allocation

| Standard cycle (Phases 1-5, 7) | Full cycle (all phases) |
|-|--|
| **70 min** | **85 min** (Phase 6 adds 15 min, monthly only) |

---

## Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Health check** | Identify blocking issues | Issue list with severity |
| **Phase 2️⃣: Feed optimization** | Improve feed quality for top products | Updated titles, prices, labels |
| **Phase 3️⃣: Product performance** | Act on product-level data | Actions per performance tier |
| **Phase 4️⃣: Search term management** | Remove waste, improve relevance | Negative keyword updates |
| **Phase 5️⃣: Bid and budget** | Align bids and budgets with performance | Bid/budget changes |
| **Phase 6️⃣: Structural review** | Verify structure matches catalog (monthly) | Structure adjustments |
| **Phase 7️⃣: Competitive check** | Monitor competitor positioning | Competitive action items |

---

## Phase 1️⃣: Health check (5 min)

### 1.1 Run the checklist

Open [Shopping Campaign Health Checklist](../checklists/Shopping Campaign Health Checklist.md) and work through every section: feed health, product performance, bidding health, structural health.

### 1.2 Classify issues

| Urgency | Definition | Action timing |
|---------|------------|---------------|
| Critical | Disapprovals, feed fetch failing, tracking broken | Fix now, before continuing |
| High | Performance degradation, bid strategy stuck | Fix during this cycle |
| Medium | Optimization opportunities, minor feed gaps | Schedule for next cycle |
| Low | Cosmetic improvements | Add to backlog |

> ⚠️ **Stop here if critical issues exist:** Fix feed fetch failures, disapprovals, or tracking breaks before proceeding.

---

## Phase 2️⃣: Feed optimization (15 min)

### 2.1 Review product title quality

Focus on these segments in priority order:

1. **Best sellers (top 20% by revenue):** highest impact on revenue
2. **High-impression, low-CTR products:** titles failing to convert visibility into clicks
3. **Newly added products:** titles not yet optimized

Check titles against category-specific formulas in [Product Feed Optimization Guidelines](../guidelines/Product Feed Optimization Guidelines.md). Update titles that fail to front-load key attributes, are shorter than 100 characters, or miss brand/product type information. (See: [Product Title Catalog](../catalogs/Product Title Catalog.md) for patterns.)

### 2.2 Check price competitiveness

Open **Merchant Center** > **Performance** > **Competitiveness**. Review the Price Competitiveness report.

| Price position | Action |
|----------------|--------|
| At or below benchmark | No action needed |
| Above benchmark (<15%) | Consider sale pricing for key products |
| Above benchmark (>15%) | Flag for pricing team |

### 2.3 Update custom labels

Verify your labeling tool (ProductHero, Profitmetrics) synced correctly. Check hero/sidekick/villain/zombie distribution for unexpected tier changes. (See: [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md) for strategies.)

---

## Phase 3️⃣: Product performance (15 min)

Go to **Google Ads** > **Products** tab. Set date range to 30 days. Sort by cost (highest first).

> ↪️ **For metric definitions and data minimums:** See [Shopping Product Performance Reference](../references/Shopping Product Performance Reference.md).

### 3.1 Zero-click products

Filter for products with impressions but zero clicks over 30 days.

| Cause | Action |
|-------|--------|
| Poor title | Rewrite per category formula |
| Poor image | Replace with higher quality |
| Price uncompetitive | Flag for pricing team |
| Wrong queries | Add negatives (Phase 4) |

### 3.2 Unprofitable products

Filter for products with ROAS below target and sufficient data (meaningful spend over 30 days). Reduce bids for products with some conversions. Exclude products with significant spend and zero conversions. Investigate landing pages for products with good CTR but poor conversion rate.

### 3.3 Budget-constrained best sellers

Filter for products with click share below 40% and ROAS above target. Check if the constraint is budget or rank. Increase budget or bids accordingly.

---

## Phase 4️⃣: Search term management (15 min)

### 4.1 Review Shopping search terms

Go to Shopping campaign > **Search terms**. Sort by cost. Identify irrelevant queries, competitor brand queries, informational queries ("how to", "reviews"), and overly broad queries with high spend and low conversion.

> ↪️ **For the full search term analysis workflow:** See [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md).

### 4.2 Add negative keywords

Add irrelevant queries to campaign-level or shared negative keyword lists. Use broad match for single-word negatives (e.g., free, used, rental). Use phrase match for multi-word patterns (e.g., "how to", "second hand"). Use exact match only for specific queries you want to block without affecting related terms.

> ↪️ **For match type selection guidance:** See [Negative Keyword Reference](../references/Negative Keyword Reference.md).

### 4.3 Run N-gram analysis (bi-weekly or monthly)

For deeper analysis, run the full procedure in [SOP – Run N-gram Analysis](../sops/SOP – Run N-gram Analysis.md). Focus on Shopping-specific patterns: generic product terms driving waste, competitor brands appearing across multiple queries, and size/color terms indicating wrong product matches.

---

## Phase 5️⃣: Bid and budget (10 min)

### 5.1 Adjust bids

**Manual CPC:** adjust product group bids by performance tier.

| Tier | Bid action |
|------|------------|
| Hero (high ROAS, strong volume) | Increase 10-20% if click share <70% |
| Sidekick (profitable, low volume) | Maintain or increase 5-10% |
| Villain (unprofitable, high spend) | Decrease 20-30% or exclude |
| Zombie (no impressions/clicks) | Set minimum bid to test viability |

**Target ROAS:** verify learning is complete, then evaluate actual vs. target ROAS using the growth-efficiency framework. Do not apply mechanical percentage rules. See [Bid Targets Reference](../references/Bid Targets Reference.md) for target calculation methodology and [Bid Scaling Mental Model](../mental-models/Bid Scaling Mental Model.md) for the growth-efficiency slider approach to target adjustments.

### 5.2 Review budget allocation

Check for "Limited by budget" status. Increase budget on campaigns hitting target ROAS. Decrease and reallocate from underperformers.

### 5.3 Check Shopping vs. PMax overlap

If running both on overlapping products: compare ROAS and volume, verify PMax is not cannibalizing Standard Shopping impression share, and adjust product exclusions if overlap hurts performance.

---

## Phase 6️⃣: Structural review (monthly only)

> ⚠️ **Skip during weekly and bi-weekly cycles:** Structural changes need 30+ days of data.

### 6.1 Review listing group granularity

| Signal | Action |
|--------|--------|
| "Everything else" group has >30% of spend | Subdivide by brand or product type |
| Product groups with <10 impressions/month | Consolidate into broader groups |
| Top products share a group with underperformers | Subdivide to item ID level for heroes |

> 💡 **Not all Shopping campaigns use performance-based (hero/sidekick/villain/zombie) segmentation.** The structural review should match your actual segmentation strategy. See [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md) for alternative approaches and [Product Feed Segmentation Mental Model](../mental-models/Product Feed Segmentation Mental Model.md) for the decision framework.

### 6.2 Review segmentation tier distribution

Check hero/sidekick/villain/zombie split. If villains exceed 20% of products, apply aggressive bid reduction or exclusion. If zombies exceed 40%, test with minimum bids and investigate feed quality. If no tier changes in 60+ days, re-run segmentation. (See: [Product Feed Segmentation Mental Model](../mental-models/Product Feed Segmentation Mental Model.md).)

### 6.3 Consider structural splits

Evaluate brand vs. non-brand separation, hero-only campaigns with dedicated budget, or category splits when different product lines need different ROAS targets.

---

## Phase 7️⃣: Competitive check (10 min)

### 7.1 Auction insights

Go to Shopping campaign > **Auction insights**. Review overlap rate, impression share, and outranking share vs. top competitors. If your impression share is declining, review bids and budget. If outranking share drops, check feed quality and bid levels.

### 7.2 Competitor pricing

Open **Merchant Center** > **Performance** > **Competitiveness**. Note categories where competitors consistently undercut pricing. Compete on feed quality for commodity products. Flag hero product pricing gaps to the pricing team. If you are consistently cheapest, verify margins.

---

## Validation & definition of done

This cycle is complete when:

- [ ] Shopping Campaign Health Checklist run, critical issues resolved
- [ ] Priority product titles reviewed and updated where needed
- [ ] Price competitiveness checked in Merchant Center
- [ ] Zero-click and unprofitable products identified with actions assigned
- [ ] Best sellers checked for click share constraints
- [ ] Shopping search terms reviewed, negatives added
- [ ] Bids adjusted by performance tier or target validated
- [ ] Budget allocation reviewed across Shopping campaigns
- [ ] Competitive positioning checked via auction insights
- [ ] All actions documented in cycle log

---

## Exit → entry bridge

| Timeframe | Action |
|-----------|--------|
| Same day | Execute critical and high-priority actions from Phase 1 |
| Within 3 days | Complete bid adjustments and negative keyword additions |
| Within 7 days | Verify feed changes propagated in Merchant Center |
| Next cycle | Review impact of changes, check carried-forward items |

**If deeper work is needed:**

| Issue | Route to |
|-------|----------|
| Feed needs major overhaul | [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md) |
| First-time segmentation setup | [SOP – Set Up Performance-Based Shopping Segmentation](../sops/SOP – Set Up Performance-Based Shopping Segmentation.md) |
| Systematic search term waste | [SOP – Run N-gram Analysis](../sops/SOP – Run N-gram Analysis.md) |
| Shopping vs. PMax migration | [Shopping Campaign Type Mental Model](../mental-models/Shopping Campaign Type Mental Model.md) |
| Budget-limited across all campaigns | [SOP – Handle Budget-Limited Campaigns](../sops/SOP – Handle Budget-Limited Campaigns.md) |

---

## Quick reference: support library

| Document | Type | Used in |
|----------|------|---------|
| [Shopping Campaign Health Checklist](../checklists/Shopping Campaign Health Checklist.md) | Checklist | Phase 1 |
| [Product Feed Optimization Guidelines](../guidelines/Product Feed Optimization Guidelines.md) | Guideline | Phase 2 |
| [Product Title Catalog](../catalogs/Product Title Catalog.md) | Catalog | Phase 2 |
| [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md) | Catalog | Phase 2, 6 |
| [Shopping Product Performance Reference](../references/Shopping Product Performance Reference.md) | Reference | Phase 3 |
| [Product Feed Segmentation Mental Model](../mental-models/Product Feed Segmentation Mental Model.md) | Mental Model | Phase 6 |
| [Product Feed Quality Checklist](../checklists/Product Feed Quality Checklist.md) | Checklist | Phase 2 |
| [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md) | SOP | Phase 4 |
| [Negative Keyword Reference](../references/Negative Keyword Reference.md) | Reference | Phase 4 |
| [Bid Targets Reference](../references/Bid Targets Reference.md) | Reference | Phase 5 |
| [Bid Scaling Mental Model](../mental-models/Bid Scaling Mental Model.md) | Mental Model | Phase 5 |

---

## Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md) | Prerequisite (feed must exist) |
| [SOP – Launch Standard Shopping Campaign](../sops/SOP – Launch Standard Shopping Campaign.md) | Prerequisite (campaign must be live) |
| [SOP – Set Up Performance-Based Shopping Segmentation](../sops/SOP – Set Up Performance-Based Shopping Segmentation.md) | Upstream (segmentation enables Phase 3/6) |
| [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md) | Called from Phase 4 |
| [SOP – Run N-gram Analysis](../sops/SOP – Run N-gram Analysis.md) | Called from Phase 4 |
| [SOP – Run a Weekly Performance Review](../sops/SOP – Run a Weekly Performance Review.md) | Parallel (general review) |
| [SOP – Handle Budget-Limited Campaigns](../sops/SOP – Handle Budget-Limited Campaigns.md) | Downstream (if budget constraints found) |

---

## Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Optimizing titles for low-volume products | Effort where it does not matter | Focus on top 20% by revenue first |
| Reacting to one week of product data | Small samples, noisy signals | Wait for 30-day windows before product-level decisions |
| Ignoring Merchant Center insights | Only looking at Google Ads | Check GMC competitiveness reports every cycle |
| Adding too many Shopping negatives | Shopping terms are broad by nature | Only negate clearly irrelevant patterns |
| Skipping the structural review | Monthly task deprioritized | Calendar it: first cycle of each month includes Phase 6 |
| Changing bids and structure simultaneously | Cannot isolate cause of change | Change bids OR structure per cycle, not both |

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
