# SOP – Manage Display and Video Placements
Created: 2026-02-14
Updated: 2026-04-01

SOP_ID: SOP_84
Status: Done
Category: Upper Funnel
Primary Outcome: Placement reports reviewed, underperforming and brand-unsafe placements excluded, placement exclusion lists maintained
Agent_Executable: No
Human_Approval_Required: No
Domain: Upper Funnel
Pillar: 0

## Purpose

Procedure for auditing, evaluating, and excluding underperforming or brand-unsafe placements across Display, Video, Demand Gen, and PMax campaigns. Covers mobile app exclusions, performance-based exclusion, brand safety configuration, PMax-specific placement review, Demand Gen channel evaluation, and ongoing exclusion list management.

> ❓ **The big question:** Are your ads appearing on high-quality, brand-safe placements that drive real engagement, or are they bleeding budget into mobile games, parked domains, and bot-traffic sites?

Every Display and Video campaign accumulates bad placements over time. Without active management, these placements consume budget without producing conversions. This SOP provides the full placement management workflow referenced by the monthly optimization cycle.

---

## What this SOP is NOT

This SOP does **not:**

- Optimize audiences, creative, bidding, or budgets (See: [SOP – Run Display & Video Campaign Optimization Cycle](../sops/SOP – Run Display & Video Campaign Optimization Cycle.md))
- Cover content targeting methods like topics or keywords (See: [Content Targeting Reference](../references/Content Targeting Reference.md))
- Set up new Display, Video, or Demand Gen campaigns from scratch
- Replace account-level brand safety setup done at launch

## When to run this SOP

| Trigger | Frequency |
|---------|-----------|
| Monthly optimization cycle (Phase 2) | Monthly |
| After launching new Display or Video campaigns | 2 weeks post-launch, then monthly |
| Sudden CPA spike on Display or Video | As needed |
| Account onboarding (inherited account) | Immediately |
| After enabling new campaign types (Demand Gen, PMax) | Within first week of data |

---

## Before you start

### Required inputs

- Access to Google Ads account with active Display, Video, Demand Gen, or PMax campaigns
- 30 days of performance data minimum (14 days acceptable for post-launch review)
- Existing placement exclusion lists (if any)
- Backend conversion data for validating placement quality (recommended)

### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Placement Performance Reference](../references/Placement Performance Reference.md) | Metric thresholds, exclusion categories, decision guide |
| [Display & Video Campaign Health Checklist](../checklists/Display & Video Campaign Health Checklist.md) | Pre-check before placement review |
| [Demand Gen Performance Reference](../references/Demand Gen Performance Reference.md) | Demand Gen channel and placement context |

### Time allocation

| Section | Time |
|---------|------|
| Phase 1️⃣: Export placement data | 10 min |
| Phase 2️⃣: Default exclusions (mobile apps, known bad) | 10 min |
| Phase 3️⃣: Performance-based exclusion | 20 min |
| Phase 4️⃣: Brand safety review | 10 min |
| Phase 5️⃣: PMax and Demand Gen specific review | 10 min |
| Phase 6️⃣: Exclusion list management | 10 min |
| **Total** | **70 min** |

> ⚠️ **Time-box to 90 minutes maximum:** Placement review can spiral into line-by-line analysis. Focus on placements that consume meaningful budget. A placement with 10 impressions does not warrant investigation.

---

## Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Export placement data** | Gather placement reports across all campaign types | Exported placement data, sorted by spend |
| **Phase 2️⃣: Default exclusions** | Remove known-bad placement categories | Mobile apps excluded, known-bad domains excluded |
| **Phase 3️⃣: Performance-based exclusion** | Remove placements failing performance thresholds | Individual placements excluded based on data |
| **Phase 4️⃣: Brand safety review** | Configure content suitability and sensitive categories | Brand safety settings verified and applied |
| **Phase 5️⃣: PMax and Demand Gen review** | Review campaign-type-specific placement data | PMax placement report reviewed, Demand Gen channels evaluated |
| **Phase 6️⃣: Exclusion list management** | Consolidate, organize, and share exclusion lists | Updated account-level exclusion lists |

---

## Phase 1️⃣: Export placement data (10 min)

### 1.1 Pull placement reports for Display and Video campaigns

All placement data is exported from the same location:

1. In Google Ads, navigate to **Insights & reports > When and where ads showed > Where ads showed**
2. Set date range to last 30 days
3. Filter by campaign type (Display, Video) to export separately
4. Export the full report (includes websites, YouTube channels, and app placements)
5. Sort by cost descending to prioritize high-spend placements

### 1.2 Pull PMax placement data

PMax placement data requires selecting the campaign first:

1. Select the PMax campaign in Google Ads
2. Navigate to **Insights & reports > When and where ads showed > Where ads showed**
3. Export the placement data (impression-level only: no clicks or conversions per placement)
4. For channel allocation: select the PMax campaign, then navigate to **Insights & reports > Channel performance** and export

> ⚠️ **PMax provides impression data only:** You will see which placements received impressions, but not clicks or conversions per placement. Evaluate PMax placements on brand safety and relevance, not performance metrics.

### 1.3 Pull Demand Gen placement and channel data

1. Export placement data from **Insights & reports > When and where ads showed > Where ads showed** (filter to Demand Gen campaigns)
2. For channel performance: open the Demand Gen campaign and segment by **Network** to see performance across YouTube, Discover, Gmail, and GDN

---

## Phase 2️⃣: Default exclusions (10 min)

Apply these exclusions regardless of performance data. These are always-exclude categories.

### 2.1 Exclude mobile app placements

Mobile apps are the single biggest source of wasted Display spend. Accidental clicks from gaming apps, children's apps, and interstitial ad placements produce high click volume with near-zero conversion value.

1. Navigate to **Content > Exclusions > App categories** (account level recommended)
2. Exclude all app categories (Games, Utilities, Entertainment, all others)
3. Verify exclusions are applied at the account level so they cover all campaigns

**Exception:** If running an app install campaign, do not exclude the app categories relevant to your target audience. All other campaign types should have apps excluded.

### 2.2 Exclude known-bad domain patterns

Review placement data for domains matching these patterns and exclude immediately without waiting for performance thresholds:

| Pattern | Example | Why exclude |
|---------|---------|-------------|
| Parked domains / MFA sites | `bestdeals123.xyz`, sites with 90%+ ad coverage | No real audience, bot traffic, wasted impressions |
| Random or keyword-stuffed domains | `abc123xyz.com`, `bestcheaponlinedealsnow.com` | Ad arbitrage, bot networks, programmatic registration |
| High-risk TLDs | `.click`, `.download`, `.bid`, `.win`, `.loan` | TLD purpose designed for user action, correlates with ad arbitrage |

> ↪️ **Full domain quality patterns.** See [Placement Performance Reference](../references/Placement Performance Reference.md) for the complete TLD risk framework and domain quality signals.

> 💡 **Build a running blocklist:** Maintain a spreadsheet or shared doc with known-bad domains you encounter over time. Add these to your account-level exclusion list during each review.

### 2.3 Verify existing default exclusions are still applied

1. Navigate to Tools > Shared library > Placement exclusion lists
2. Confirm all previously created exclusion lists are still applied to the correct campaigns
3. Check that new campaigns added since the last review have exclusion lists applied

### Phase 2 verification

- [ ] All app categories excluded at account level (or confirmed exception for app install campaigns)
- [ ] Mobile app categories excluded across all non-app-install campaigns
- [ ] Known-bad domain patterns reviewed and excluded
- [ ] Existing exclusion lists verified as applied to all current campaigns

---

## Phase 3️⃣: Performance-based exclusion (20 min)

Review individual placements that pass default exclusion filters but fail performance thresholds. Apply the minimum data thresholds from the [Placement Performance Reference](../references/Placement Performance Reference.md) before taking action.

### 3.1 Minimum data thresholds

Do not exclude a placement unless it meets these minimums:

| Threshold | Minimum required | Why |
|-----------|-----------------|-----|
| Impressions | 1,000+ | Smaller samples produce unreliable metrics |
| Clicks (for CPA/ROAS evaluation) | 100+ | CPA/ROAS with fewer than 100 clicks is statistically meaningless |
| Time period | 30+ days | Short windows miss delayed conversions |

### 3.2 Display placement evaluation

Sort your exported Display placement report by cost descending. Work through the top 50 placements by spend. For each placement, apply the decision criteria:

| Signal | Threshold | Action |
|--------|-----------|--------|
| High impressions, zero clicks | 1,000+ impressions, 0 clicks | Exclude (likely bot traffic or invisible ad slot) |
| Abnormally high CTR | CTR > 10% | Flag for manual review (may be accidental clicks, but verify before excluding) |
| High CTR, zero conversions | CTR > 3%, 0 conversions, 100+ clicks | Flag for manual review (investigate before excluding) |
| High bounce rate | Bounce rate > 90% (if Analytics linked) | Exclude (low-quality traffic) |
| CPA far above average | CPA > 3x campaign average with 100+ clicks | Exclude |
| CPA above average | CPA 1.5-3x campaign average | Monitor, do not exclude yet |
| CPA at or below average | CPA within campaign target | Keep, consider managed placement |

### 3.3 Video placement evaluation

Sort YouTube channel and video placements by cost descending. Review the top 30 placements by spend.

| Signal | Action |
|--------|--------|
| Kids/children's content (not targeting parents) | Exclude: wrong audience, COPPA compliance risk |
| Music/lyric video channels with zero engagement | Exclude: passive viewers who skip or ignore ads |
| Generated or spam content channels | Exclude |
| Channel under 90 days old with high impression volume | Flag: likely content farm or newly-created spam channel |
| Many videos, few subscribers (ratio over 50:1 videos-to-subscribers) | Flag: ad-revenue operation, not genuine audience |
| Video content language does not match target market | Exclude: audience mismatch |
| Video marked "Made for Kids" (unless targeting parents) | Exclude: wrong audience, restricted ad formats |
| Comments disabled with zero engagement signals | Flag: investigate content quality before excluding |
| High view rate + conversions | Keep, consider managed placement |
| Low view rate, high spend | Investigate: ad-content mismatch or wrong audience |

For systematic YouTube channel and video analysis at scale, use Google Ads Scripts with YouTube Data API access. Manual review is viable for the top 10-20 video placements by spend.

> ↪️ **YouTube quality framework:** See [Placement Performance Reference](../references/Placement Performance Reference.md) for the full four-dimension YouTube placement quality signal framework.

### 3.4 Apply exclusions at the correct level

| Exclusion type | Apply at | When to use |
|----------------|----------|-------------|
| Universal bad placement | Account level (shared exclusion list) | Parked domains, MFA sites, brand-unsafe content |
| Campaign-specific poor performer | Campaign level | Placement performs badly for one campaign but may work for others |
| Ad group-specific poor performer | Ad group level | Granular exclusion when performance varies within a campaign |

> ⚠️ **Always prefer account-level exclusion lists:** Excluding the same domain across 15 individual campaigns creates maintenance chaos. Use shared exclusion lists from Tools > Shared library.

### Phase 3 verification

- [ ] Top 50 Display placements by spend reviewed against performance thresholds
- [ ] Top 30 Video placements by spend reviewed against quality criteria
- [ ] Exclusion list updated with newly identified poor performers
- [ ] Exclusions applied at the correct level (account, campaign, or ad group)

---

## Phase 4️⃣: Brand safety review (10 min)

### 4.1 Verify content suitability settings

1. Navigate to Admin > Account settings > Content suitability (or Settings > Content exclusions at campaign level)
2. Check the inventory type setting:

| Inventory type | What it includes | When to use |
|----------------|-----------------|-------------|
| Expanded | All monetizable content including sensitive | Never recommended |
| Standard | Excludes most sensitive content | Default for most advertisers |
| Limited | Only vetted, brand-safe content | Premium brands, regulated industries |

3. If set to Expanded, change to Standard immediately
4. If your client is in a regulated industry or is brand-sensitive, set to Limited

### 4.2 Review sensitive content category exclusions

Navigate to content exclusions and ensure the following sensitive categories are excluded:

| Category | Exclude? |
|----------|----------|
| Tragedy and conflict | Yes (always) |
| Sensitive social issues | Yes (always) |
| Profanity and rough language | Yes (for most brands) |
| Sexually suggestive content | Yes (always) |
| Sensational and shocking | Yes (always) |
| Below the fold | Recommended (low visibility) |

### 4.3 Verify digital content label exclusions

| Label | Content type | Action |
|-------|-------------|--------|
| DL-G | General audiences | Include |
| DL-PG | Parental guidance | Include (review for sensitive brands) |
| DL-T | Teen content | Review based on brand |
| DL-MA | Mature audiences | Exclude (always) |
| Not yet labeled | Unclassified content | Exclude for safety |

### 4.4 Spot-check placement brand safety

Review the top 10 placements by impressions from your exported reports. Manually visit or check 3-5 of the highest-impression websites to verify:

- Content is appropriate for your brand
- The site has real editorial content (not just ads)
- Language and geography match your target market
- No competing brands are prominently featured

If any placement fails brand safety, add it to the account-level exclusion list.

### Phase 4 verification

- [ ] Inventory type confirmed as Standard or Limited (not Expanded)
- [ ] Content suitability sensitive categories excluded per table above
- [ ] Digital content labels DL-MA and "Not yet labeled" excluded
- [ ] Top 10 placements by impressions spot-checked for brand safety

---

## Phase 5️⃣: PMax and Demand Gen specific review (10 min)

### 5.1 PMax placement review

PMax provides impression-level data only. You cannot see clicks or conversions per placement, and you cannot target specific placements. Focus on brand safety and relevance.

1. Open each PMax campaign > Insights tab > Placements
2. Review the list of websites, YouTube channels, and apps that received impressions
3. Flag any placement that:

| Issue | Action |
|-------|--------|
| Brand-unsafe website or channel | Add to account-level exclusion list |
| Mobile app placement (if apps are unwanted) | Verify app exclusions are applied at account level |
| Suspicious domain pattern (random characters, etc.) | Add to account-level exclusion list |

4. Check PMax channel allocation in the Insights tab to understand where spend is flowing (Search, Shopping, Display, Video, Gmail, Discover)

> 💡 **PMax exclusions are account-level only:** You cannot exclude placements at the PMax campaign level. Any exclusion you add to the account-level shared list will also apply to PMax.

> ⚠️ **Manual review alone is insufficient for PMax at scale.** PMax generates far more placement data than a human can review line by line. For accounts with 3+ PMax campaigns, use Google Ads Scripts to pull placement data via `performance_max_placement_view` and flag domains matching TLD risk and domain anatomy patterns from the [Placement Performance Reference](../references/Placement Performance Reference.md). Reserve manual review for the flagged placements.

### 5.2 Demand Gen placement review

Demand Gen serves across YouTube, Discover, Gmail, and GDN. You can select specific channels at the ad group level.

1. Review channel-level performance data (segment the Demand Gen campaign by **Network**):

| Channel | What to check |
|---------|---------------|
| YouTube | Video view rate, engagement, channel quality |
| Discover | CTR, conversion rate, audience relevance |
| Gmail | Open rate proxy (CTR), conversion rate |
| GDN | Placement quality (same criteria as Display) |

2. If one channel consumes disproportionate budget with poor performance, create separate ad groups with specific channel selections to control allocation (See: [SOP – Launch a Demand Gen Campaign](../sops/SOP – Launch a Demand Gen Campaign.md), Phase 2.6)

3. Apply the same account-level exclusion lists to cover Demand Gen placements
4. Review any GDN placements surfaced in Demand Gen reporting and exclude poor performers

> ↪️ **Demand Gen benchmarks and attribution:** See: [Demand Gen Performance Reference](../references/Demand Gen Performance Reference.md)

---

## Phase 6️⃣: Exclusion list management (10 min)

### 6.1 Consolidate exclusion lists

1. Navigate to Tools > Shared library > Placement exclusion lists
2. Review all existing lists:

| List type | Naming convention | Contents |
|-----------|------------------|----------|
| Brand safety | `Brand Safety - [Account Name]` | Universal brand-unsafe placements |
| Mobile apps | `Mobile App Exclusions` | All app categories |
| Performance-based | `Low Performers - [Month Year]` | Placements failing performance thresholds |
| Known bad | `Known Bad Domains` | MFA sites, parked domains, bot-traffic domains |

3. Merge overlapping lists to reduce clutter. Keep lists under the Google Ads limit of 65,000 placements per list.

### 6.2 Apply lists to all campaigns

1. Verify every active Display, Video, and Demand Gen campaign has all relevant exclusion lists applied
2. Check that newly launched campaigns since the last review have lists applied

### 6.3 Document changes

Record what was done in this session:

| Item | Value |
|------|-------|
| Date of review | [Today's date] |
| Placements reviewed | [Count] |
| New exclusions added | [Count] |
| Campaigns affected | [List] |
| Lists updated | [List names] |
| Next review date | [Date, typically next month] |

Compare this month's findings to previous months. Track month-over-month:

| Metric | What it shows | Concerning trend |
|--------|--------------|-----------------|
| Total flagged placements | Volume of quality issues | Steady increase month over month |
| % of impressions from low-barrier TLDs | Proportion of risky extensions | Increasing without new campaigns |
| New exclusions added per cycle | Rate of new bad placements appearing | Accelerating despite active management |

If any trend worsens for 3+ consecutive months, investigate campaign targeting and automation settings that may be driving the deterioration.

### 6.4 Automated exclusion patterns

For accounts with 3+ campaigns or $5,000+/month Display/Video spend, use Google Ads Scripts for automated placement monitoring. For smaller accounts, manual review is sufficient. Effective script patterns include:

| Script pattern | What it does | Threshold |
|----------------|-------------|-----------|
| Zero-click exclusion | Flags placements with 1,000+ impressions and 0 clicks | Daily scan |
| High-CTR flag | Flags placements with CTR > 10% for manual review | Weekly scan |
| CPA-based exclusion | Flags placements with CPA > 3x campaign average and 100+ clicks | Weekly scan |
| Domain pattern matching | Flags domains matching suspicious URL patterns | On each run |
| TLD concentration analysis | Aggregates spend/conversions by TLD, flags zero-conversion TLD clusters | Weekly scan |
| Domain anatomy scoring | Flags domains matching 2+ structural or intent patterns per Reference | On each run |
| YouTube channel authority | Flags channels with suspicious age, upload pattern, or subscriber ratio | Weekly scan |

> ⚠️ **Always review before bulk-excluding:** Scripts should flag placements for review, not auto-exclude without human verification. A new high-quality placement may initially show low metrics before accumulating sufficient data.

---

## Validation & definition of done

This SOP is complete when:

- [ ] Placement reports exported for all active Display, Video, Demand Gen, and PMax campaigns
- [ ] Mobile app placements excluded across all non-app-install campaigns
- [ ] Known-bad domains (parked, MFA, suspicious patterns) excluded
- [ ] Top 50 Display placements by spend reviewed against performance thresholds
- [ ] Top 30 Video placements by spend reviewed against quality criteria
- [ ] Content suitability set to Standard or Limited (never Expanded)
- [ ] Sensitive content categories excluded
- [ ] Digital content labels reviewed (DL-MA and unlabeled excluded)
- [ ] PMax placement report reviewed for brand safety issues
- [ ] Demand Gen channel performance reviewed
- [ ] Account-level exclusion lists updated and applied to all campaigns
- [ ] Changes documented with date, counts, and next review date

---

## Exit → entry bridge

| Timeframe | Action |
|-----------|--------|
| Same day | Apply all exclusions identified in this review |
| This week | Set up or update automated exclusion scripts (if applicable) |
| Next month | Re-run this SOP as part of the monthly optimization cycle |

**If significant issues found:**

| Issue | Route to |
|-------|----------|
| Campaigns still serving on excluded placements | Verify exclusion lists are applied at correct level, check for campaign-level overrides |
| PMax spending heavily on Display/Video with low ROAS | Review PMax asset group structure and audience signals |
| Demand Gen GDN placements consistently poor | Create channel-specific ad groups or adjust creative mix |
| Brand safety violations on high-visibility placements | Escalate to client, tighten to Limited inventory type |
| Recurring bad placements each month | Investigate whether optimized targeting or audience expansion is enabled |

---

## Related documents

| Document | Type | Relationship |
|----------|------|--------------|
| [Placement Performance Reference](../references/Placement Performance Reference.md) | Reference | Metric thresholds, exclusion categories, decision guide |
| [Display & Video Campaign Health Checklist](../checklists/Display & Video Campaign Health Checklist.md) | Checklist | Pre-check before placement review |
| [SOP – Run Display & Video Campaign Optimization Cycle](../sops/SOP – Run Display & Video Campaign Optimization Cycle.md) | SOP | Parent SOP (this SOP is Phase 2 in detail) |
| [Demand Gen Performance Reference](../references/Demand Gen Performance Reference.md) | Reference | Demand Gen channel benchmarks and attribution |
| [Content Targeting Reference](../references/Content Targeting Reference.md) | Reference | Topic, placement, and content exclusion targeting |
| [Upper Funnel Campaign Structure Mental Model](../mental-models/Upper Funnel Campaign Structure Mental Model.md) | Mental Model | Structural context for where placements fit |

---

## Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Skipping mobile app exclusion | "The default must be fine" | Apps are never fine by default. Exclude all app categories from day one. |
| Excluding placements with insufficient data | Reacting to 2 days of data on a new placement | Enforce minimum thresholds: 1,000 impressions or 100 clicks before acting |
| Reviewing only top 10 placements | "The rest are small" | Work through the top 50 by spend. Dozens of small bad placements add up. |
| Not applying exclusion lists to new campaigns | New campaigns launch without inheriting account-level lists | Verify list application every time a new campaign is created |
| Leaving inventory type on Expanded | Default not changed after campaign creation | Set Standard or Limited as part of every campaign launch |
| One-time review instead of monthly | "I cleaned placements last quarter" | New bad placements appear constantly. Monthly reviews are non-negotiable. |
| Excluding PMax placements at campaign level | Attempting to apply exclusions that PMax does not support | PMax only accepts account-level exclusions |
| Trusting automated scripts without review | Script excludes a new premium placement prematurely | Scripts flag, humans decide. Always review before applying bulk exclusions. |

---

## Version details

- **Version:** 5.0
- **Last Updated:** April 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
