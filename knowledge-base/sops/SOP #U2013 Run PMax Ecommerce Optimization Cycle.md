# SOP – Run PMax Ecommerce Optimization Cycle
Created: 2026-03-31

SOP_ID: SOP_92
Status: Done
Category: PMax
Primary Outcome: Complete PMax ecommerce optimization cycle with search terms, assets, feed, channels, and structure reviewed
Agent_Executable: No
Human_Approval_Required: No
Domain: PMax
Pillar: 6

## Purpose

This SOP runs the optimization routine for ecommerce Performance Max campaigns (both Full Assets and Feed-Only). It covers search terms, negative keywords, asset performance, channel allocation, audience signals, brand defense, structural review, feed health, and placements.

> ❓ **The big question:** What do I check, how often, and in what order to keep an ecommerce PMax campaign performing?

**The core principle: less is sometimes more.** PMax needs time to learn. Over-optimization destroys the algorithm's ability to find patterns. Make deliberate changes, then wait for data. Respect 4-6 week learning periods after significant changes.

> 💡 **Full Assets vs Feed-Only:** This SOP handles both. Feed-Only campaigns skip asset performance (Phase 4) and audience signals (Phase 6) since the product feed is the sole creative and targeting input. Sections with different guidance per type are labeled.

---

## What this SOP is NOT

This SOP does **not:**

- Launch new PMax campaigns (See: [SOP – Launch PMax Full Assets Ecommerce Campaign](../sops/SOP – Launch PMax Full Assets Ecommerce Campaign.md) or [SOP – Launch PMax Feed-Only Campaign](../sops/SOP – Launch PMax Feed-Only Campaign.md))
- Set up product feeds (See: [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md))
- Optimize PMax for lead gen/SaaS (See: [SOP – Run PMax Lead Gen-SaaS Optimization Cycle](../sops/SOP – Run PMax Lead Gen-SaaS Optimization Cycle.md))
- Decide whether PMax is the right campaign type (See: [PMax Configuration Guidelines](../guidelines/PMax Configuration Guidelines.md))
- Replace general account-level performance reviews (See: [SOP – Run a Weekly Performance Review](../sops/SOP – Run a Weekly Performance Review.md))

## When to run this SOP

**Run when:** PMax ecommerce campaign has exited learning (4+ weeks post-launch), has 30+ conversions/month, and at least 2 weeks have passed since any structural change.

**Do NOT run when:** Campaign is in learning period, was launched less than 4 weeks ago, or you made structural changes (asset group split, bid strategy change) less than 2 weeks ago.

---

## Before you start

### Optimization cadence

| Phase | Cadence | Why |
|-------|---------|-----|
| 1. Health check | Every cycle | Catches broken fundamentals first |
| 2. Search term review | Weekly | Query drift happens fast |
| 3. Negative keyword management | Weekly | Directly follows search term review |
| 4. Asset performance (Full Assets only) | Bi-weekly | Assets need 2+ weeks for meaningful signals |
| 5. Channel allocation | Monthly | Channel shifts are gradual |
| 6. Audience signals (Full Assets only) | Monthly | Signal changes need 4+ weeks to show impact |
| 7. Brand defense | Monthly | Brand cannibalization patterns are stable week-to-week |
| 8. Structural review | Monthly | Structural changes trigger learning periods |
| 9. Feed review | Monthly | Feed issues are stable or introduced by feed updates |
| 10. Placement review | Monthly | Placement patterns emerge over weeks |

**Time totals:** Weekly cycle (Phases 1-3): ~30 min. Bi-weekly, Full Assets (Phases 1-4): ~45 min. Monthly, Full Assets (all phases): ~110 min. Monthly, Feed-Only (skip 4, 6): ~85 min.

### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [PMax Campaign Health Checklist](../checklists/PMax Campaign Health Checklist.md) | Phase 1 |
| [PMax Configuration Guidelines](../guidelines/PMax Configuration Guidelines.md) | Phase 5, 8 |
| [PMax Asset Group Strategy Reference](../references/PMax Asset Group Strategy Reference.md) | Phase 8 |
| [Brand Separation Reference](../references/Brand Separation Reference.md) | Phase 7 |
| [Product Feed Optimization Guidelines](../guidelines/Product Feed Optimization Guidelines.md) | Phase 9 |
| [Shopping Product Performance Reference](../references/Shopping Product Performance Reference.md) | Phase 9 |

---

## Phase 1️⃣: Health check (every cycle, 5 min)

1. Run the [PMax Campaign Health Checklist](../checklists/PMax Campaign Health Checklist.md)
2. Verify campaign status, budget utilization, conversion tracking
3. Confirm the campaign is **not** in a learning period

| Trigger | Learning duration |
|---------|-------------------|
| New campaign | 4-6 weeks |
| Bid strategy change | 2-4 weeks |
| Major budget change (>20%) | 1-2 weeks |
| Asset group added/removed | 1-2 weeks |
| Audience signal overhaul | 2-3 weeks |

> ⚠️ **If in learning period, STOP.** Do not proceed to optimization phases. Log the learning period end date and return then. Changes during learning reset the clock and waste data.

---

## Phase 2️⃣: Search term review (weekly, 15 min)

PMax search term reports now work like Search campaign reports: fully visible, with impression, click, and conversion data at the query level.

1. Navigate to the PMax campaign > **Insights and reports** > **Search terms**
2. Set date range to last 7 days, sort by cost (highest first)
3. Review the top 50-100 queries and categorize:

| Category | Criteria | Action |
|----------|----------|--------|
| **Converting, relevant** | Conversions at acceptable ROAS | No action |
| **Non-converting, high spend** | Spent 3x target CPA-equivalent with zero conversions | Add to negative keyword list |
| **Irrelevant traffic** | Query unrelated to products | Add to negative keyword list |
| **Brand queries** | Contains your brand name | Note for Phase 7 |
| **Competitor queries** | Contains competitor brand names | Evaluate: converting or wasting? |
| **Low-intent informational** | "what is", "how to", "free" | Exclude unless top-of-funnel intent desired |

4. Check brand vs. non-brand split: brand should be <30% of impressions. If brand dominates, your PMax reporting is inflated by easy wins.

> ↪️ **For detailed search term management:** See [SOP – Manage PMax Search Terms and Brand Defense](../sops/SOP – Manage PMax Search Terms and Brand Defense.md).

---

## Phase 3️⃣: Negative keyword management (weekly, 10 min)

PMax supports negative keyword lists linked directly to campaigns. Use shared lists the same way you manage negatives in Search.

1. Open **Tools** > **Shared library** > **Negative keyword lists**
2. Add exclusion terms identified in Phase 2
3. Confirm the list is linked to the PMax campaign
4. For campaigns with sufficient volume, run N-gram analysis on 30-day search term exports to identify wasteful patterns at scale

> ↪️ **For the full N-gram workflow:** See [SOP – Run N-gram Analysis](../sops/SOP – Run N-gram Analysis.md).

5. Validate: no conflicting negatives blocking high-performing queries, lists organized by category (irrelevant terms, competitors, brand terms)

---

## Phase 4️⃣: Asset performance (Full Assets only, bi-weekly, 15 min)

> ⚠️ **Feed-Only campaigns: skip this phase.** Feed-Only campaigns have no creative assets to optimize. Product-level performance is reviewed in Phase 9.

PMax provides asset-level performance data: impressions, clicks, and conversions per individual asset. Use these actual metrics. **Ignore Ad Strength, it is not a useful optimization signal.**

1. Navigate to the PMax campaign > asset group > **Assets** tab
2. Review performance columns: impressions, clicks, CTR, conversions, conversion rate
3. Evaluate each asset type (headlines, descriptions, images, videos):

| Tier | Criteria | Action |
|------|----------|--------|
| **Strong** | Above-average CTR and conversion rate | Keep |
| **Adequate** | Average performance, sufficient impressions | Monitor |
| **Underperforming** | Below-average after 1,000+ impressions | Replace |
| **Data-starved** | <500 impressions after 2+ weeks | Check approval status |
| **Zero-conversion** | 1,000+ impressions with zero conversions | Replace immediately |

4. Replace 1-2 weakest assets per type with replacements that test a **different angle**, not minor variations
5. Check for auto-generated videos (Google creates these from your images). Disable if you have your own.

> ⚠️ **Replace one or two assets at a time.** Swapping all assets simultaneously destroys your ability to measure what improved.

> ↪️ **Methodology foundation:** PMax asset optimization follows the same Templatize, Aggregate, Diagnose, Iterate framework as RSA testing. See [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md) for the full methodology. For multi-format creative testing coordination, see [SOP – Run a Creative Testing Cycle](../sops/SOP – Run a Creative Testing Cycle.md).

---

## Phase 5️⃣: Channel allocation (monthly, 10 min)

PMax distributes spend across Search, Shopping, Display, Video, Gmail, and Discover. Channel-level data is available in the interface and via the API.

1. Navigate to the PMax campaign > **Insights** > **Campaign insights** for channel breakdown
2. Compare against healthy ranges:

**Full Assets:**

| Channel | Healthy range | Flag if... |
|---------|--------------|------------|
| Shopping | 40-70% | Below 30% |
| Search | 15-35% | Below 10% or above 50% |
| Display | 5-15% | Above 25% with low conversions |
| Video | 5-15% | Above 20% with no video assets |
| Gmail/Discover | 2-10% | Above 15% with low engagement |

**Feed-Only:**

| Channel | Expected | Flag if... |
|---------|----------|------------|
| Shopping | 85%+ | Below 70% (likely has creative assets accidentally added) |
| Other channels | <15% combined | Above 15% combined spend |

3. Diagnose unexpected shifts:
   - Shopping dropping: check feed/Merchant Center, product disapprovals
   - Display spiking: review placements (Phase 10)
   - Video spiking without video assets: disable auto-generated video
   - Search unusually high: check brand cannibalization (Phase 7)
   - Feed-Only spending on non-Shopping: verify no creative assets were added

---

## Phase 6️⃣: Audience signals (Full Assets only, monthly, 10 min)

> ⚠️ **Feed-Only campaigns: skip this phase.** The product feed is the targeting. Adding audience signals causes Google to expand beyond Shopping.

1. Navigate to asset group > **Audience signals**
2. Check which signals drive conversions, compare to campaign averages
3. Update segments:

| Signal type | Review action |
|-------------|---------------|
| **Customer Match** | Refresh with latest purchaser data (quarterly minimum) |
| **Website visitors** | Verify lists are populating correctly |
| **High-value customers** | Update with latest purchase data |
| **Cart abandoners** | Verify audience is active and growing |
| **Custom segments** | Add new competitor URLs or product search terms |
| **In-market audiences** | Add or remove based on conversion data |

4. Remove signals that consistently underperform campaign averages after 4+ weeks. Add signals based on converting patterns from Search or Shopping campaigns.

---

## Phase 7️⃣: Brand defense (monthly, 10 min)

1. Review Phase 2 search term data for brand queries
2. Cross-reference with Search campaign brand performance
3. Check for cannibalization signals:

| Signal | Meaning |
|--------|---------|
| Brand CPC in PMax higher than Search | PMax is overbidding on brand |
| Search brand campaign volume dropping | PMax cannibalizing Search brand traffic |
| Brand queries driving majority of PMax conversions | Inflated reporting from easy brand wins |

4. Navigate to campaign settings > **Brand exclusions**, verify your brand and all variants are excluded
5. Add any new misspellings that appeared in search terms

> ↪️ **For complete brand separation strategy:** See [Brand Separation Reference](../references/Brand Separation Reference.md) and [SOP – Manage PMax Search Terms and Brand Defense](../sops/SOP – Manage PMax Search Terms and Brand Defense.md).

---

## Phase 8️⃣: Structural review (monthly, 15 min)

### 8.1 Asset group and listing group review

1. Review asset group organization against these thresholds:

| Check | Action |
|-------|--------|
| Groups with <30 conversions/month | Consider consolidating |
| Groups with >200 conversions/month | Consider splitting for granular control |
| Groups mixing unrelated product categories | Split into coherent groups |
| Overlapping listing groups | Eliminate to prevent internal competition |

2. **Split** when: volume supports it (100+ conversions/month), distinct product categories exist, different products need different messaging
3. **Consolidate** when: groups have <30 conversions/month, target similar audiences, or one group adds no incremental value

### 8.2 Performance-based segmentation review

If using performance-based segmentation (hero/sidekick/villain/zombie via ProductHero or similar):

1. Check tier distribution for unexpected changes
2. Verify each campaign segment has sufficient conversion volume (30+ per month)
3. Confirm all segments use the same Target ROAS to allow products to flow naturally between tiers

> 💡 **Not all ecommerce accounts use performance-based segmentation.** Your structural review should match your actual segmentation strategy. See [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md) for alternative approaches and [Product Feed Segmentation Mental Model](../mental-models/Product Feed Segmentation Mental Model.md) for the decision framework.

> ⚠️ **Structural changes trigger learning periods.** Maximum one structural change per month, then wait 4 weeks.

> ↪️ **For asset group strategy:** See [PMax Asset Group Strategy Reference](../references/PMax Asset Group Strategy Reference.md).

---

## Phase 9️⃣: Feed review (monthly, 10 min)

1. Check product coverage in Merchant Center: approval rate >95%, prices and availability matching website
2. Review listing group performance (campaign > asset group > **Listing groups**, sort by cost):

| Performance | Action |
|-------------|--------|
| Converting at target ROAS | Maintain |
| Low volume, acceptable ROAS | Monitor |
| Spending without converting | Exclude or move to separate group |
| Zero impressions | Check feed quality: titles, images, GTINs |

3. Spot-check feed quality: keyword-rich titles, high-quality images, proper categorization, custom labels for segmentation
4. Review product-level CPA/ROAS to identify which products drive conversions vs. drain budget

> ↪️ **For feed optimization:** See [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md).

---

## Phase 🔟: Placement review (monthly, 10 min)

PMax provides impression-level placement data.

1. Navigate to **Insights and reports** > **When and where ads showed** > **Placements**, sort by impressions
2. Flag suspicious placements:

| Red flag | Action |
|----------|--------|
| Mobile app placements with zero conversions | Exclude |
| Content farm domains with high impressions | Exclude |
| Irrelevant YouTube channels | Exclude |
| Any single placement with >5% of spend and zero conversions | Exclude |

3. Apply exclusions via **Tools** > **Content suitability** > **Placement exclusions**

> ⚠️ **Placement exclusions are account-level.** They remove placements from all campaigns. Verify the placement is unwanted everywhere before excluding.

---

## Validation & definition of done

This SOP is complete when:

- [ ] Health check passed, no blockers
- [ ] Search terms reviewed, exclusion candidates identified
- [ ] Negative keyword lists updated and linked
- [ ] Asset performance reviewed, underperformers flagged (Full Assets, bi-weekly)
- [ ] Channel allocation assessed (monthly)
- [ ] Audience signals reviewed (Full Assets, monthly)
- [ ] Brand defense checked (monthly)
- [ ] Structural opportunities assessed (monthly)
- [ ] Feed health verified (monthly)
- [ ] Placements reviewed (monthly)
- [ ] Action items documented with priority and due dates
- [ ] Next cycle date scheduled

---

## Exit → entry bridge

| Timeframe | Action |
|-----------|--------|
| Same day | Execute high-priority fixes (negatives, asset swaps) |
| This week | Complete remaining action items |
| Next weekly cycle | Phases 1-3 |
| Next bi-weekly cycle | Phases 1-4 (Full Assets) |
| Next monthly cycle | All phases |

**If issues require deeper investigation:**

| Issue | Route to |
|-------|----------|
| Search term quality problems | [SOP – Manage PMax Search Terms and Brand Defense](../sops/SOP – Manage PMax Search Terms and Brand Defense.md) |
| Asset performance declining | [SOP – Run a Creative Testing Cycle](../sops/SOP – Run a Creative Testing Cycle.md) (Phase 2.2 for PMax) |
| Brand cannibalization | [Brand Separation Reference](../references/Brand Separation Reference.md) |
| Feed quality issues | [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md) |
| Campaign type question | [PMax Configuration Guidelines](../guidelines/PMax Configuration Guidelines.md) |
| Need to switch between Feed-Only and Full Assets | [SOP – Launch PMax Full Assets Ecommerce Campaign](../sops/SOP – Launch PMax Full Assets Ecommerce Campaign.md) or [SOP – Launch PMax Feed-Only Campaign](../sops/SOP – Launch PMax Feed-Only Campaign.md) |

---

## Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Optimizing during learning | Impatience after changes | Check learning status in Phase 1 first |
| Replacing all assets at once | Wanting to "fix everything" | Max 1-2 swaps per type per cycle |
| Ignoring search terms | "PMax handles it automatically" | Weekly review is non-negotiable |
| Structural changes weekly | Over-optimization | Monthly maximum, then wait 4 weeks |
| Adding assets to Feed-Only campaigns | Thinking more assets = better | Feed-Only means zero assets. Any creative converts it to Full Assets behavior. |
| Ignoring feed quality | "Feed is set and forget" | Monthly feed reviews catch disapprovals and optimization opportunities |
| No documentation between cycles | Seems unnecessary | Continuity catches trends you'd miss |

---

## Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Launch PMax Full Assets Ecommerce Campaign](../sops/SOP – Launch PMax Full Assets Ecommerce Campaign.md) | Upstream (Full Assets setup) |
| [SOP – Launch PMax Feed-Only Campaign](../sops/SOP – Launch PMax Feed-Only Campaign.md) | Upstream (Feed-Only setup) |
| [SOP – Manage PMax Search Terms and Brand Defense](../sops/SOP – Manage PMax Search Terms and Brand Defense.md) | Deep-dive for Phases 2, 3, 7 |
| [SOP – Run a Creative Testing Cycle](../sops/SOP – Run a Creative Testing Cycle.md) | Multi-format creative testing coordination |
| [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md) | Iteration Loop methodology applied to PMax assets |
| [SOP – Run N-gram Analysis](../sops/SOP – Run N-gram Analysis.md) | Used in Phase 3 |
| [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md) | Used in Phase 9 |
| [SOP – Run Shopping Campaign Optimization Cycle](../sops/SOP – Run Shopping Campaign Optimization Cycle.md) | Parallel (Standard Shopping optimization) |
| [SOP – Run a Weekly Performance Review](../sops/SOP – Run a Weekly Performance Review.md) | Account-level review |

---

## Version details

- **Version:** 1.0
- **Last Updated:** March 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
