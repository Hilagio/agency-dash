# SOP – Run PMax Lead Gen-SaaS Optimization Cycle
Created: 2026-03-31

SOP_ID: SOP_93
Status: Done
Category: PMax
Primary Outcome: Complete PMax lead gen/SaaS optimization cycle with search terms, assets, conversion quality, channels, and structure reviewed
Agent_Executable: No
Human_Approval_Required: No
Domain: PMax
Pillar: 6

## Purpose

This SOP runs the optimization routine for lead gen and SaaS Performance Max campaigns. It covers search terms, negative keywords, asset performance, channel allocation, audience signals, brand defense, structural review, conversion quality, and placements.

> ❓ **The big question:** What do I check, how often, and in what order to keep a lead gen/SaaS PMax campaign producing quality leads?

**The core principle: quality over volume.** PMax for lead gen optimizes toward whatever conversion signal you give it. If that signal is raw form submissions, PMax will generate high volumes of low-quality leads. Offline conversion import with a quality signal (MQL, SQL, or revenue) is the foundation everything else rests on.

---

## What this SOP is NOT

This SOP does **not:**

- Launch new PMax campaigns (See: [SOP – Launch PMax for Lead Gen-SaaS](../sops/SOP – Launch PMax for Lead Gen-SaaS.md))
- Optimize ecommerce PMax campaigns (See: [SOP – Run PMax Ecommerce Optimization Cycle](../sops/SOP – Run PMax Ecommerce Optimization Cycle.md))
- Set up offline conversion tracking (See: [SOP – Set Up Offline Conversion Tracking](../sops/SOP – Set Up Offline Conversion Tracking.md))
- Decide whether PMax is the right campaign type (See: [PMax Configuration Guidelines](../guidelines/PMax Configuration Guidelines.md))
- Replace general account-level performance reviews (See: [SOP – Run a Weekly Performance Review](../sops/SOP – Run a Weekly Performance Review.md))

## When to run this SOP

**Run when:** PMax lead gen/SaaS campaign has exited learning (4+ weeks post-launch), has 30+ conversions/month on quality signal, and at least 2 weeks have passed since any structural change.

**Do NOT run when:** Campaign is in learning period, was launched less than 4 weeks ago, or you made structural changes (asset group split, bid strategy change) less than 2 weeks ago.

---

## Before you start

### Prerequisites

> ⚠️ **Offline conversion import must be active and verified.** If the campaign is optimizing on raw form submissions instead of a quality signal (MQL, SQL, or revenue), stop and fix this first. PMax without a quality signal generates volume, not value. See [SOP – Set Up Offline Conversion Tracking](../sops/SOP – Set Up Offline Conversion Tracking.md).

### Optimization cadence

| Phase | Cadence | Why |
|-------|---------|-----|
| 1. Health check | Every cycle | Catches broken fundamentals first |
| 2. Search term review | Weekly | Query drift happens fast |
| 3. Negative keyword management | Weekly | Directly follows search term review |
| 4. Asset performance | Bi-weekly | Assets need 2+ weeks for meaningful signals |
| 5. Channel allocation | Monthly | Channel shifts are gradual |
| 6. Audience signals | Monthly | Signal changes need 4+ weeks to show impact |
| 7. Brand defense | Monthly | Brand cannibalization patterns are stable week-to-week |
| 8. Structural review | Monthly | Structural changes trigger learning periods |
| 9. Conversion quality review | Monthly | Quality trends need 30+ days of data |
| 10. Placement review | Monthly | Placement patterns emerge over weeks |

**Time totals:** Weekly cycle (Phases 1-3): ~30 min. Bi-weekly (Phases 1-4): ~45 min. Monthly (all phases): ~110 min.

### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [PMax Campaign Health Checklist](../checklists/PMax Campaign Health Checklist.md) | Phase 1 |
| [PMax Configuration Guidelines](../guidelines/PMax Configuration Guidelines.md) | Phase 5, 8 |
| [PMax Asset Group Strategy Reference](../references/PMax Asset Group Strategy Reference.md) | Phase 8 |
| [Brand Separation Reference](../references/Brand Separation Reference.md) | Phase 7 |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Phase 9 |

---

## Phase 1️⃣: Health check (every cycle, 5 min)

1. Run the [PMax Campaign Health Checklist](../checklists/PMax Campaign Health Checklist.md)
2. Verify campaign status, budget utilization, conversion tracking
3. Confirm the campaign is **not** in a learning period
4. **Verify offline conversion import is active:** Check that quality-signal conversions (MQL, SQL, revenue) are being imported within the expected delay window

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
| **Converting, relevant** | Quality conversions at acceptable CPA | No action |
| **Non-converting, high spend** | Spent 3x target CPA with zero conversions | Add to negative keyword list |
| **Irrelevant traffic** | Query unrelated to service/product | Add to negative keyword list |
| **Brand queries** | Contains your brand name | Note for Phase 7 |
| **Competitor queries** | Contains competitor brand names | Evaluate: converting or wasting? |
| **Low-intent informational** | "what is", "how to", "free" | Exclude unless top-of-funnel intent desired |
| **Job seekers / non-buyer intent** | "jobs", "careers", "salary", "internship" | Add to negative keyword list |

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

5. Validate: no conflicting negatives blocking high-performing queries, lists organized by category (irrelevant terms, competitors, brand terms, job-seeker terms)

---

## Phase 4️⃣: Asset performance (bi-weekly, 15 min)

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

> 💡 **Lead gen creative angles to test:** Product screenshots vs. people photos, feature-led vs. benefit-led vs. problem-solution, testimonial-focused vs. demo-focused, urgency-based vs. value-based.

> ↪️ **Methodology foundation:** See [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md) for the Iteration Loop framework. For multi-format creative testing coordination, see [SOP – Run a Creative Testing Cycle](../sops/SOP – Run a Creative Testing Cycle.md).

---

## Phase 5️⃣: Channel allocation (monthly, 10 min)

PMax distributes spend across Search, Display, Video, Gmail, and Discover. Channel-level data is available in the interface and via the API.

1. Navigate to the PMax campaign > **Insights** > **Campaign insights** for channel breakdown
2. Compare against healthy ranges:

| Channel | Healthy range | Flag if... |
|---------|--------------|------------|
| Search | 40-60% | Below 30% or above 70% |
| Display | 10-25% | Above 30% with low conversions |
| Video | 5-20% | Above 25% with no video assets |
| Gmail/Discover | 5-15% | Above 20% with low engagement |

3. Diagnose unexpected shifts:
   - Display spiking: review placements (Phase 10), check creative quality
   - Video spiking without video assets: disable auto-generated video
   - Search unusually high: check brand cannibalization (Phase 7)
   - Gmail/Discover dominating: check audience signal quality, review creative engagement

---

## Phase 6️⃣: Audience signals (monthly, 10 min)

Audience signals are critical for lead gen/SaaS PMax. Without strong signals, lead quality degrades.

1. Navigate to asset group > **Audience signals**
2. Check which signals drive conversions, compare to campaign averages
3. Update segments:

| Signal type | Priority | Review action |
|-------------|----------|---------------|
| **Customer Match (closed customers/SQLs)** | Highest | Refresh with latest CRM data (quarterly minimum). Minimum 1,000+ matched users. |
| **Website converters** | High | Verify lists are populating correctly |
| **High-intent visitors** | High | Demo page viewers, pricing page visitors, free trial starters |
| **Custom segments** | Medium | Add new competitor URLs, relevant search terms |
| **In-market audiences** | Lower | Add or remove based on conversion data |

4. Remove signals that consistently underperform campaign averages after 4+ weeks
5. Add signals based on converting patterns from Search campaigns

> ⚠️ **Customer Match is the most important signal for lead gen PMax.** If your Customer Match list is stale (>90 days old) or too small (<1,000 users), prioritize refreshing it before other signal optimization.

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

Lead gen/SaaS PMax structure is organized by service type, offer, or audience segment (not by product listing groups).

### 8.1 Asset group review

1. Review asset group organization against these thresholds:

| Check | Action |
|-------|--------|
| Groups with <30 conversions/month on quality signal | Consider consolidating |
| Groups with >200 conversions/month | Consider splitting for granular control |
| Groups mixing unrelated services or offers | Split into coherent groups |
| Groups with different margin profiles sharing a campaign | Consider separate campaigns |

2. **Split** when: volume supports it (100+ conversions/month on quality signal), distinct services/offers exist, different offers need different messaging or landing pages
3. **Consolidate** when: groups have <30 conversions/month, target similar audiences, or one group adds no incremental value

### 8.2 Campaign structure review

| Structure | When to use | Minimum volume |
|-----------|-------------|----------------|
| Single campaign, single asset group | One offer, one audience | 30+ conversions/month |
| Single campaign, multiple asset groups | One offer, different angles or audiences | 30+ per asset group |
| Multiple campaigns | Different offers with different margins or value | 30+ per campaign on quality signal |

> ⚠️ **Structural changes trigger learning periods.** Maximum one structural change per month, then wait 4 weeks.

> ↪️ **For asset group strategy:** See [PMax Asset Group Strategy Reference](../references/PMax Asset Group Strategy Reference.md).

---

## Phase 9️⃣: Conversion quality review (monthly, 15 min)

This phase is unique to lead gen/SaaS. Raw conversion volume is meaningless without quality validation.

### 9.1 Check offline conversion import health

1. Verify that offline conversions (MQL, SQL, revenue) are being imported within the expected delay window
2. Check for gaps: any days with zero imports when there should be data?
3. Confirm the correct conversion action is set as the primary bidding signal

### 9.2 Evaluate lead quality

1. Compare quality metrics over the last 30 days vs. prior 30 days:

| Metric | What to check |
|--------|---------------|
| Form submission → MQL rate | Trending down = quality degradation |
| MQL → SQL rate | Trending down = audience quality issue |
| SQL → Close rate | Trending down = targeting or offer issue |
| Average deal value | Declining = PMax finding cheaper but lower-value leads |

2. If quality is declining while volume is stable or growing, PMax is optimizing for easy leads, not good leads. Tighten audience signals, review search terms for low-intent patterns, or shift the conversion signal downstream (e.g., from MQL to SQL).

### 9.3 Campaign-level quality comparison

If running PMax alongside Search campaigns, compare lead quality between channels. PMax should produce leads of comparable quality. If PMax leads convert at significantly lower rates downstream, investigate audience signals and channel allocation.

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

- [ ] Health check passed, offline conversion import verified
- [ ] Search terms reviewed, exclusion candidates identified
- [ ] Negative keyword lists updated and linked
- [ ] Asset performance reviewed, underperformers flagged (bi-weekly)
- [ ] Channel allocation assessed (monthly)
- [ ] Audience signals reviewed, Customer Match freshness verified (monthly)
- [ ] Brand defense checked (monthly)
- [ ] Structural opportunities assessed (monthly)
- [ ] Conversion quality reviewed, quality trends documented (monthly)
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
| Next bi-weekly cycle | Phases 1-4 |
| Next monthly cycle | All 10 phases |

**If issues require deeper investigation:**

| Issue | Route to |
|-------|----------|
| Search term quality problems | [SOP – Manage PMax Search Terms and Brand Defense](../sops/SOP – Manage PMax Search Terms and Brand Defense.md) |
| Asset performance declining | [SOP – Run a Creative Testing Cycle](../sops/SOP – Run a Creative Testing Cycle.md) (Phase 2.2 for PMax) |
| Brand cannibalization | [Brand Separation Reference](../references/Brand Separation Reference.md) |
| Offline conversion import broken | [SOP – Set Up Offline Conversion Tracking](../sops/SOP – Set Up Offline Conversion Tracking.md) |
| Lead quality declining | Review Phase 9. If systemic, shift bidding to a more downstream conversion signal. |
| Campaign type question | [PMax Configuration Guidelines](../guidelines/PMax Configuration Guidelines.md) |

---

## Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Optimizing during learning | Impatience after changes | Check learning status in Phase 1 first |
| Replacing all assets at once | Wanting to "fix everything" | Max 1-2 swaps per type per cycle |
| Ignoring search terms | "PMax handles it automatically" | Weekly review is non-negotiable |
| Structural changes weekly | Over-optimization | Monthly maximum, then wait 4 weeks |
| Optimizing on form submissions | No offline conversion import | Fix the conversion signal before running PMax |
| Stale Customer Match list | "We uploaded it once" | Refresh quarterly at minimum |
| Ignoring lead quality | "Volume looks great" | Phase 9 quality review is non-negotiable |
| No documentation between cycles | Seems unnecessary | Continuity catches trends you'd miss |

---

## Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Launch PMax for Lead Gen-SaaS](../sops/SOP – Launch PMax for Lead Gen-SaaS.md) | Upstream (initial setup) |
| [SOP – Set Up Offline Conversion Tracking](../sops/SOP – Set Up Offline Conversion Tracking.md) | Prerequisite (quality signal) |
| [SOP – Manage PMax Search Terms and Brand Defense](../sops/SOP – Manage PMax Search Terms and Brand Defense.md) | Deep-dive for Phases 2, 3, 7 |
| [SOP – Run a Creative Testing Cycle](../sops/SOP – Run a Creative Testing Cycle.md) | Multi-format creative testing coordination |
| [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md) | Iteration Loop methodology applied to PMax assets |
| [SOP – Run N-gram Analysis](../sops/SOP – Run N-gram Analysis.md) | Used in Phase 3 |
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
