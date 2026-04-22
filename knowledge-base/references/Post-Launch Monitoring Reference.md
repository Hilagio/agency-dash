# Post-Launch Monitoring Reference
Created: 2026-02-05

Support_ID: REFERENCE_38
Status: Done
Category: Operational
Reference Type: Technical
Agent_Readable: Yes
Human_Facing: Yes
Domain: Operational
Pillar: 6

## Purpose

Documents the post-launch monitoring cadence, learning period rules, and verification checkpoints for all Google Ads campaign types. This reference provides a single source of truth for what to monitor, when to check, and what to avoid during the learning period.

---

## What this reference is / What this is NOT

**This reference:**

- Documents learning periods by campaign type
- Specifies what NOT to change during learning
- Provides monitoring cadence and verification checkpoints
- Explains red flags vs normal learning volatility

**This reference does NOT:**

- Provide optimization strategies (See: optimization SOPs)
- Cover campaign creation or setup (See: campaign launch SOPs)
- Explain bid strategy selection (See: [Bidding Strategy Mental Model](../mental-models/Bidding Strategy Mental Model.md))

---

## Quick reference: learning periods by campaign type

| Campaign type | Learning period | Minimum evaluation period |
|--------------|-----------------|---------------------------|
| **Search** | 7-14 days | 14 days |
| **Shopping (Standard)** | 1-2 weeks | 14-30 days |
| **PMax** | 2-4 weeks | 30 days |
| **Display** | 2-4 weeks | 30 days |
| **Video** | 2-4 weeks | 30 days |
| **Demand Gen** | 2-4 weeks | 30 days |

> 💡 **Learning period ≠ Evaluation period:** Learning is when the algorithm calibrates. Evaluation requires stable data beyond learning.

---

## What NOT to change during learning

These changes reset the learning period and should be avoided:

| Change | Impact | Wait until |
|--------|--------|------------|
| **Bid target changes** (CPA, ROAS) | Resets learning | After learning period + stable performance |
| **Budget changes >20%** | Significant changes reset learning | Gradual increases (10-20%) are safer |
| **Campaign restructuring** | Resets learning entirely | After 30+ days of stable data |
| **Pausing and re-enabling** | Disrupts learning signals | Only for critical issues |
| **Adding/removing conversion actions** | Changes what algorithm optimizes for | Before launch or after evaluation |
| **Significant audience changes** | Resets targeting signals | After learning period |

---

## What IS okay during learning

These changes do not significantly disrupt learning:

| Action | Why it's safe |
|--------|--------------|
| **Adding negative keywords** | Refines targeting without changing bid signals |
| **Fixing disapproved ads** | Necessary for campaign health |
| **Adding new ads/assets** | Expands options without disrupting existing learning |
| **Small budget increases (<20%)** | Gradual scaling is acceptable |
| **Placement exclusions** (Display/Video) | Quality control without disrupting audience learning |
| **Search term refinement** | Improves relevance |

---

## Monitoring cadence by timeframe

### First 24-48 hours

| Check | What to look for | Action if wrong |
|-------|-----------------|-----------------|
| Campaign status | "Eligible" (not "Limited" or "Disapproved") | Fix limiting factor |
| Impressions | Accumulating (not zero) | Check budget, keywords, ad status |
| Ad approval | All ads approved | Fix policy violations |
| Conversion tracking | Tags firing (check Real-Time in GA4) | Verify tag setup |
| Budget pacing | Spending as expected | Check bid strategy, budget conflicts |

### Days 2-7

| Check | Frequency | Focus |
|-------|-----------|-------|
| Impressions/Clicks | Daily | Trend (growing, stable, declining) |
| CTR | Daily | Within expected range |
| Search terms (Search/Shopping) | Daily | Add negatives for irrelevant queries |
| Budget pacing | Daily | Hitting daily budget? |
| Ad status | Daily | Any new disapprovals? |

### Week 1-2

| Check | Frequency | Focus |
|-------|-----------|-------|
| Performance trends | Every other day | Stabilization vs volatility |
| Learning status | Every other day | "Learning" vs "Learning limited" |
| Conversion volume | Every other day | Meeting threshold expectations |
| Search term quality | 2-3x per week | Continued refinement |

### Week 2-4

| Check | Frequency | Focus |
|-------|-----------|-------|
| Bid strategy status | 2-3x per week | Should exit learning |
| Performance stabilization | 2-3x per week | Less day-to-day volatility |
| Conversion quality | Weekly | Not just volume, but quality |
| Channel mix (PMax/Display/Video) | Weekly | Placement distribution |

### Week 4+

| Check | Frequency | Focus |
|-------|-----------|-------|
| Full performance review | Weekly | Against KPI targets |
| Optimization opportunities | Weekly | Ready for first adjustments |
| Scaling potential | Bi-weekly | Can budget increase? |

---

## Key metrics by campaign type

### Search campaigns

| Metric | Healthy range | Red flag |
|--------|---------------|----------|
| CTR | 2-8% (varies by intent) | <1% sustained |
| Search impression share | Varies by goals | <30% without budget constraint |
| Avg. CPC | Within target range | >3x expected |
| Quality Score | 7+ for branded, 5+ for non-brand | <4 sustained |
| Conversion rate | Varies by vertical | 50%+ decline from baseline |

### Shopping campaigns

| Metric | Healthy range | Red flag |
|--------|---------------|----------|
| CTR | 0.5-2% | <0.3% sustained |
| Impression share | Varies by competition | <20% without budget constraint |
| ROAS | Meeting target | <50% of target after learning |
| Products serving | All eligible products | >20% not serving |

### PMax campaigns

| Metric | Healthy range | Red flag |
|--------|---------------|----------|
| Conversions/week | Meeting volume targets | <50% of budget-implied capacity |
| Learning status | "Eligible" after 2-4 weeks | "Learning limited" sustained |
| Asset performance | Balanced impressions across assets | Multiple assets with zero impressions |
| Channel mix | Varies by setup | Unexpected channel dominance |

### Display campaigns

| Metric | Healthy range | Red flag |
|--------|---------------|----------|
| CTR | 0.1-0.5% (remarketing higher) | <0.05% sustained |
| View-through rate | Platform-dependent | N/A |
| Conversion rate | Lower than Search | No conversions after 14 days with clicks |
| Frequency | 3-7 per user per week | >15 per user per week |

### Video campaigns

| Metric | Healthy range | Red flag |
|--------|---------------|----------|
| View rate | 15-30% (skippable) | <10% sustained |
| CPV | Within bid target | >2x target |
| Watch time | Platform benchmarks | <25% completion (non-skippable) |
| Frequency | 2-5 per user per week | >10 per user per week |

### Demand Gen campaigns

| Metric | Healthy range | Red flag |
|--------|---------------|----------|
| Conversions | Meeting volume targets | <30/month per ad group |
| CPA | Within target | >2x target after learning |
| CTR | 0.5-2% (varies by placement) | <0.2% sustained |
| Asset performance | Balanced impressions across assets | Multiple assets with zero impressions |

---

## Red flags vs normal learning volatility

### Normal learning volatility (do not panic)

| Signal | Why it's normal |
|--------|-----------------|
| Day-to-day CPA swings of 50%+ | Algorithm is testing and calibrating |
| Low volume in first 48 hours | Ramp-up time needed |
| Inconsistent conversion timing | Small sample sizes |
| CPCs higher than expected initially | Algorithm learning optimal bids |
| Some days with zero conversions | Expected in low-volume campaigns |

### Actual red flags (investigate immediately)

| Signal | Likely cause | Action |
|--------|-------------|--------|
| Zero impressions after 24 hours | Budget, targeting, or approval issue | Check campaign status, budget, ad approval |
| Learning status stuck after 4+ weeks | Volume too low | Consolidate campaigns, increase budget |
| All ads disapproved | Policy violation | Review policies, fix ads |
| CTR <0.1% in Search | Relevance problem | Review ad-keyword alignment |
| Spend concentrating on wrong placements (PMax) | Asset or signal misconfiguration | Review asset groups, audience signals |
| Conversion tracking showing zero | Tracking broken | Verify tag implementation |

---

## Learning status indicators

### Google Ads learning statuses

| Status | Meaning | Action |
|--------|---------|--------|
| **Learning** | Algorithm is calibrating | Normal, wait |
| **Eligible** | Learning complete, optimizing | Ready for evaluation |
| **Learning limited** | Cannot learn due to constraint | Fix constraint (budget, targeting, volume) |
| **Limited** | Active constraint limiting delivery | Address limiting factor |

### Common causes of "Learning limited"

| Cause | Fix |
|-------|-----|
| Budget too low | Increase budget or consolidate campaigns |
| Conversion volume too low | Consolidate, broaden targeting, or use higher-funnel conversion |
| Targeting too narrow | Expand audiences or keywords |
| Bid target too aggressive | Relax CPA/ROAS target temporarily |

---

## Post-launch documentation

### What to record at launch

| Field | Purpose |
|-------|---------|
| Launch date | Baseline for timeline calculations |
| Campaign names | Identification |
| Bid strategy and target | Performance baseline |
| Daily budget | Budget baseline |
| Structure summary | Reference for future changes |
| Conversion actions | What's being optimized |
| Initial settings | Audit trail |

### Review milestones to set

| Milestone | Timing | Purpose |
|-----------|--------|---------|
| First-day check | Launch + 1 day | Verify delivery |
| Week 1 review | Launch + 7 days | Trend analysis |
| Week 2 review | Launch + 14 days | Learning period assessment |
| Month 1 review | Launch + 30 days | Full performance evaluation |

> 💡 **Add these as calendar reminders:** Do not rely on memory.

---

## Common mistakes

| Mistake | Why it happens | How to avoid |
|---------|----------------|--------------|
| Changing bid targets during learning | Impatience with volatility | Set calendar reminder for earliest change date |
| Panicking at day 1 metrics | Misunderstanding learning volatility | Trust the process for 7-14 days minimum |
| Not documenting launch settings | No urgency when settings are fresh | Document on launch day |
| Evaluating too early | Pressure to show results | Communicate learning timeline to stakeholders |
| Ignoring "Learning limited" status | Assuming it will resolve | Address constraints proactively |
| Making multiple changes at once | Trying to fix everything | One change at a time, wait for data |

---

## Related documents

| Document | Relationship |
|----------|--------------|
| [Bidding Strategy Mental Model](../mental-models/Bidding Strategy Mental Model.md) | Learning period requirements |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Minimum volume for bid strategies |
| [SOP – Launch a Search Campaign](../sops/SOP – Launch a Search Campaign.md) | Search post-launch specifics |
| [SOP – Launch PMax Feed-Only Campaign](../sops/SOP – Launch PMax Feed-Only Campaign.md) | PMax post-launch specifics |

---

## Version details

- **Version:** 1.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
