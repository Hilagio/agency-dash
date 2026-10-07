# SOP – Run Demand Gen Optimization Cycle
Created: 2026-02-14
Updated: 2026-06-01

SOP_ID: SOP_80
Status: Done
Category: Upper Funnel
Primary Outcome: Demand Gen optimization cycle complete with audience, creative, placement, and bidding actions documented
Agent_Executable: No
Human_Approval_Required: No
Domain: Upper Funnel
Pillar: 0

## Purpose

Structured optimization cycle for Demand Gen campaigns covering health, audiences, placements, creative, bidding progression, feed integration, and brand safety.

> ❓ **The big question:** Is this Demand Gen campaign progressing toward its targets, or are there issues holding it back?

Run bi-weekly for performance review (Phases 1-3, 5). Run monthly for all phases including creative refresh and structural changes.

---

## What this SOP is NOT

This SOP does **not:**

- Launch a new Demand Gen campaign (See: [SOP – Launch a Demand Gen Campaign](../sops/SOP – Launch a Demand Gen Campaign.md))
- Execute deep audience optimization across all campaign types (See: [SOP – Optimize Audience Performance](../sops/SOP – Optimize Audience Performance.md))
- Validate initial campaign configuration (See: [Demand Gen Campaign Health Checklist](../checklists/Demand Gen Campaign Health Checklist.md))

## When to run this SOP

- Demand Gen campaign has been live for 30+ days
- Bi-weekly or monthly performance review is due
- Performance is declining after the initial learning phase
- Before scaling budget on a Demand Gen campaign

---

## Before you start

> ⚠️ **Demand Gen operates on upper-funnel economics.** CPA of 1.5-2x Non-Branded Search tCPA is normal. ROAS of 50-70% of Non-Branded Search tROAS is expected. Use Google Ads as source of truth (not GA4).

### Required inputs

- Demand Gen campaign live for 30+ days
- Google Ads account access with previous cycle notes
- Demand Gen-specific KPI targets (not Search targets)

### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Demand Gen Campaign Health Checklist](../checklists/Demand Gen Campaign Health Checklist.md) | Phase 1 |
| [Demand Gen Performance Reference](../references/Demand Gen Performance Reference.md) | Benchmarks, all phases |
| [Audience Targeting Guidelines](../guidelines/Audience Targeting Guidelines.md) | Phase 2 expansion decisions |
| [SOP – Optimize Audience Performance](../sops/SOP – Optimize Audience Performance.md) | Phase 2 escalation |

### Time allocation

| Phase | Bi-weekly | Monthly |
|-------|-----------|---------|
| Phase 1️⃣: Health check | 5 min | 5 min |
| Phase 2️⃣: Audience spot-check | 10 min | 10 min |
| Phase 3️⃣: Placement and frequency | 5 min | 5 min |
| Phase 4️⃣: Creative optimization | Skip | 10 min |
| Phase 5️⃣: Bidding optimization | 5 min | 5 min |
| Phase 6️⃣: Feed integration (DPA only) | Skip | 5 min |
| Phase 7️⃣: Brand safety | Skip | 5 min |
| **Total** | **25 min** | **45 min** |

---

## Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣** | Health check | Pass/fail status |
| **Phase 2️⃣** | Audience spot-check | Audience actions or escalation |
| **Phase 3️⃣** | Placement and frequency | Channel balance verified |
| **Phase 4️⃣** | Creative optimization (monthly) | Fatigue assessed, refresh planned |
| **Phase 5️⃣** | Bidding optimization | Strategy maturity progressed |
| **Phase 6️⃣** | Feed integration (monthly, DPA only) | Feed health verified |
| **Phase 7️⃣** | Brand safety (monthly) | Exclusion settings verified |

---

## Phase 1️⃣: Health check (5 min)

1. Run [Demand Gen Campaign Health Checklist](../checklists/Demand Gen Campaign Health Checklist.md)
2. If any critical area fails, fix in this priority order: Bidding > Audiences > Creative > Placements > Feed > Brand safety

**Verification:** All campaigns serving, conversion tracking active, no disapproved ads.

---

## Phase 2️⃣: Audience spot-check (10 min)

### 2.1 Audience CPA review

1. Navigate to Audiences, keywords, and content > Audiences
2. Review CPA/ROAS per audience segment

| Finding | Action |
|---------|--------|
| All audiences within 1.5x target | No action. Move to 2.2. |
| One audience CPA > 2x target with 50+ clicks | Pause or replace that audience. |
| Multiple audiences failing | Schedule [SOP – Optimize Audience Performance](../sops/SOP – Optimize Audience Performance.md). |

### 2.2 Lookalike reach check

Review current lookalike reach setting against performance:

| Current performance | Action |
|--------------------|--------|
| CPA on target, volume too low | Expand: Narrow → Balanced, or Balanced → Broad |
| CPA on target, volume sufficient | Hold current setting |
| CPA too high | Tighten reach OR replace seed audience with higher-quality list |

Allow 14+ days after any reach change before evaluating.

### 2.3 Optimized targeting check

For each ad group, check the "Total: Expansion and optimized targeting" row:

| Expanded CPA vs targeted CPA | Action |
|-------------------------------|--------|
| < 1.5x | Keep ON |
| 1.5-2x | Monitor 14+ more days |
| > 2x | Turn OFF |

### 2.4 Quick demographics check

Review CPA/ROAS across Age, Gender, Parental status, Household income.

| Condition | Action |
|-----------|--------|
| Group CPA > 2x campaign average with 50+ clicks | Flag for exclusion |
| "Unknown" > 20% of budget with CPA > 1.5x average | Flag for review (do not exclude without 30+ days of data) |

> ↪️ **Deep audience work.** For demographics optimization, combined segments, audience insights, and expansion testing: [SOP – Optimize Audience Performance](../sops/SOP – Optimize Audience Performance.md).

**Verification:** No audience CPA-broken (>2x target) without a plan. Expansion impact documented. Lookalike reach aligned with performance.

---

## Phase 3️⃣: Placement and frequency (5 min)

### 3.1 Channel distribution check

Segment by placement/channel. Check if any single channel consumes >75% of budget:

| Finding | Action |
|---------|--------|
| Balanced distribution across YouTube/Discover/Gmail | No action |
| One channel >75% of budget with acceptable CPA | Acceptable if CPA is on target |
| One channel >75% of budget with CPA > 2x target | Create separate ad groups per channel to control allocation |
| Channel with zero conversions after 30+ days | Exclude via ad group structure |

> ⚠️ **Do not disable placements based on last-click CPA alone.** Check view-through conversion columns before deciding.

### 3.2 View-through assessment

| View-through % of total | Action |
|--------------------------|--------|
| <30% | Healthy. No action. |
| 30-60% | Flag for backend validation. |
| >60% | Shorten view-through window or exclude from bidding. |

### 3.3 GDN placement check

The Google Display Network serves as a channel inside Demand Gen. When the GDN channel carries meaningful spend, review its placements directly.

1. Filter "Where ads showed" to GDN placements (websites and apps), sort by cost descending
2. Review the top 50 GDN placements by spend

| Finding | Action |
|---------|--------|
| Top GDN placements are relevant, converting, or brand-safe | No action |
| 1-2 bad placements in top 10 | Exclude them now |
| 3+ bad placements, or mobile app placements not excluded | Schedule [SOP – Manage Demand Gen and Video Placements](../sops/SOP – Manage Demand Gen and Video Placements.md) |

### 3.4 Frequency check

Monitor frequency metrics. If frequency >5/week with declining CTR: expand audience size or refresh creative.

**Verification:** No channel consuming disproportionate budget with poor CPA. GDN placements reviewed. VTC reliance documented.

---

## Phase 4️⃣: Creative optimization (10 min, monthly only)

### 4.1 Fatigue detection

| Signal | Threshold | Action |
|--------|-----------|--------|
| CTR declining | 2+ consecutive weeks | Queue replacement creative |
| Frequency rising | >5 impressions/user per 7 days | Add new creative variants |
| CPA rising, audience stable | CPA up 20%+ over 14 days | Test creative first |

### 4.2 Refresh process

1. Identify fatigued assets by format (image/video)
2. Add new assets alongside existing ones (do not remove immediately)
3. Allow 14 days for new assets to gather data
4. Pause underperforming assets after replacements prove out

### 4.3 Asset completeness

Strong serving on the GDN channel depends on every asset slot being filled so Google can assemble responsive layouts. For each ad group:

1. Confirm all image slots, headlines, descriptions, and the logo are populated
2. Replace any image asset running 90+ days without conversions

**Verification:** All asset slots filled. No image asset running 90+ days without conversions.

### 4.4 Creative testing

Test one variable at a time. Minimum 14-day test duration per variable:

| Test | What to compare |
|------|----------------|
| UGC vs polished | Engagement rate and CPA |
| Static image vs video | CTR and conversion rate |
| Offer-led vs problem-led | CPA and conversion volume |

**Verification:** No creative running 60+ days unchanged. Refresh plan documented if fatigue detected.

---

## Phase 5️⃣: Bidding optimization (5 min)

### 5.1 Maturity assessment

Check where the campaign sits on the bidding migration path:

| Stage | Current strategy | Move to | When |
|-------|-----------------|---------|------|
| Launch | Maximize Clicks | Maximize Conversions (no target) | 15+ conversions in 30 days |
| Learning | Maximize Conversions | tCPA or tROAS | 30+ conversions in 30 days, stable performance |
| Targeting | tCPA/tROAS | Tighter targets | 50+ conversions per ad group per 30 days |

> ⚠️ **Set initial targets at current performance.** When adding a tCPA or tROAS target, use actual 30-day average. Do not set aspirational targets at migration.

### 5.2 Target tightening

For campaigns on tCPA/tROAS: tighten in 5-10% increments with 14-day wait between adjustments. Maximum 15% tightening per cycle. If volume drops >30%, loosen by 5%.

**Verification:** Bid strategy matches campaign maturity. Target changes documented with rationale.

---

## Phase 6️⃣: Feed integration review (5 min, monthly, DPA only)

Skip this phase if the campaign does not use Dynamic Product Ads.

| Check | Verify |
|-------|--------|
| Feed status | Active, no errors in Merchant Center |
| Product count | Expected number approved |
| Disapprovals | <5% of products disapproved |
| Image quality | No placeholder or low-resolution images |
| Price accuracy | Prices match landing page |

**Verification:** Feed is active with <5% disapprovals.

---

## Phase 7️⃣: Brand safety (5 min, monthly only)

| Setting | Expected |
|---------|----------|
| Inventory type | Standard or Limited (never Expanded) |
| Content exclusions | Sensitive categories excluded |
| Digital content labels | DL-MA excluded at minimum |

Review "Where ads showed" for brand-inappropriate placements and add to exclusion list.

**Verification:** All brand safety settings match expected values.

---

## Validation and definition of done

This SOP is complete when:

- [ ] Health checklist run, results documented
- [ ] Audience CPA outliers identified (escalated if needed)
- [ ] Lookalike reach setting aligned to performance
- [ ] Optimized targeting impact measured
- [ ] Demographics reviewed, outliers flagged
- [ ] Channel distribution checked, exclusions updated
- [ ] GDN placements reviewed (escalated to Manage Placements SOP if needed)
- [ ] VTC reliance assessed
- [ ] Creative fatigue assessed (monthly)
- [ ] Asset slots confirmed filled, stale image assets pruned (monthly)
- [ ] Bidding maturity assessed, migration/tightening documented
- [ ] Feed health verified (monthly, DPA only)
- [ ] Brand safety settings confirmed (monthly)
- [ ] Next review date scheduled

---

## Exit → entry bridge

| Timeframe | Action |
|-----------|--------|
| Same day | Quick fixes (exclusions, expansion toggles) |
| This week | Creative refresh production (if needed) |
| 14 days | Evaluate audience and bidding changes |
| Next cycle | Review all changes, document results |

**If deeper investigation needed:**

| Issue | Route to |
|-------|----------|
| Deep audience optimization | [SOP – Optimize Audience Performance](../sops/SOP – Optimize Audience Performance.md) |
| Deep placement analysis | [SOP – Manage Demand Gen and Video Placements](../sops/SOP – Manage Demand Gen and Video Placements.md) |
| Campaign setup issues | [SOP – Launch a Demand Gen Campaign](../sops/SOP – Launch a Demand Gen Campaign.md) |
| Attribution questions | [Demand Gen Performance Reference](../references/Demand Gen Performance Reference.md) |
| Bidding strategy selection | [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md) |

---

## Related documents

| Document | Type | Relationship |
|----------|------|--------------|
| [Demand Gen Campaign Health Checklist](../checklists/Demand Gen Campaign Health Checklist.md) | Checklist | Phase 1 |
| [Demand Gen Performance Reference](../references/Demand Gen Performance Reference.md) | Reference | All phases |
| [Audience Targeting Guidelines](../guidelines/Audience Targeting Guidelines.md) | Guideline | Phase 2 |
| [Audience Targeting Reference](../references/Audience Targeting Reference.md) | Reference | Phase 2 |
| [SOP – Optimize Audience Performance](../sops/SOP – Optimize Audience Performance.md) | SOP | Phase 2 escalation |
| [Placement Performance Reference](../references/Placement Performance Reference.md) | Reference | Phase 3 |
| [SOP – Manage Demand Gen and Video Placements](../sops/SOP – Manage Demand Gen and Video Placements.md) | SOP | Phase 3 escalation |
| [Upper Funnel Campaign Structure Mental Model](../mental-models/Upper Funnel Campaign Structure Mental Model.md) | Mental Model | Strategic context |

---

## Common failures

| Failure | How to avoid |
|---------|--------------|
| Comparing to Search benchmarks | Set DG-specific targets from day one |
| Optimizing before 30 days | Calendar-block first review at day 30 |
| Changing too many variables at once | One major change per cycle |
| Ignoring view-through conversions | Always check VTC columns before disabling placements |
| Tightening bid targets too fast | Max 15% per cycle, 5-10% per step |
| Using GA4 as source of truth | Use Google Ads for Demand Gen metrics |
| Leaving optimized targeting ON without measuring | Check expansion row every cycle |

---

## Version details

- **Version:** 5.0
- **Last Updated:** June 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
