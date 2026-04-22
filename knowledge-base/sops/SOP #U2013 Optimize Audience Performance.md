# SOP – Optimize Audience Performance
Created: 2026-02-14
Updated: 2026-04-01

SOP_ID: SOP_85
Status: Done
Category: Audiences
Primary Outcome: Audience segments analyzed, underperformers removed or adjusted, high-performers scaled, targeting mode optimized
Agent_Executable: No
Human_Approval_Required: No
Domain: Audiences
Pillar: 7

## Purpose

This SOP runs a structured audience performance review for Display, Video, and Demand Gen campaigns. It evaluates every audience segment by type, removes or adjusts underperformers, scales high-performers, and validates that targeting mode, expansion settings, and list health are aligned with current campaign goals.

> ❓ **The big question:** Which audience segments are driving efficient conversions, which are wasting spend, and what structural changes will improve audience-level performance?

Most advertisers add audiences at launch and never revisit them. Lists go stale, observation-mode segments never graduate, underperforming segments accumulate spend, and lookalike reach settings never progress beyond their initial configuration. This SOP replaces that neglect with a structured monthly review that keeps audience infrastructure clean, current, and performing.

---

## What this SOP is NOT

This SOP does **not:**

- Set up audiences from scratch (See: [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md))
- Configure Performance Max audience signals (See: [SOP – Set Up Audience Signals](../sops/SOP – Set Up Audience Signals.md))
- Build or upload Customer Match lists (See: [SOP – Build Customer Match Lists](../sops/SOP – Build Customer Match Lists.md))
- Route to the correct audience foundation when infrastructure is missing (See: [Expand Audience Reach](../playbooks/Expand Audience Reach.md))
- Cover Demand Gen-specific optimization beyond audiences (See: [SOP – Run Demand Gen Optimization Cycle](../sops/SOP – Run Demand Gen Optimization Cycle.md))

> ↪️ **Scope boundary:** This SOP optimizes existing audience performance across Display, Video, and Demand Gen. It does not cover PMax, where audiences function as signals and cannot be evaluated at the segment level. For PMax signal quality, run [SOP – Set Up Audience Signals](../sops/SOP – Set Up Audience Signals.md).

---

## When to run this SOP

Run this SOP on a recurring cadence based on campaign maturity:

| Campaign maturity | Recommended cadence | Rationale |
|-------------------|---------------------|-----------|
| First 90 days | Monthly | Audiences need time to accumulate meaningful data |
| 90+ days, 50+ monthly conversions | Monthly | Sufficient data for segment-level analysis |
| 90+ days, 100+ monthly conversions | Bi-weekly (light) + Monthly (full) | High volume enables more frequent lightweight checks |

Run immediately (outside cadence) when:

- A specific audience segment's CPA exceeds 3x the campaign average / ROAS drops below 33% of campaign average for 14+ consecutive days
- A remarketing list drops below 100 users (delivery stops)
- Audience overlap report shows 50%+ overlap between campaigns targeting the same users
- After adding new audience segments or changing targeting mode

---

## Before you start

### Required inputs

- Access to Google Ads account with Display, Video, or Demand Gen campaigns live for 30+ days
- Documented target KPIs per campaign (CPA, ROAS, or CPL targets)
- Previous cycle's audience review notes and carry-forward items
- Audience Manager access for list health review

### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Audience Strategy Mental Model](../mental-models/Audience Strategy Mental Model.md) | Temperature framework and expansion logic |
| [Audience Targeting Reference](../references/Audience Targeting Reference.md) | Targeting modes, expansion settings, demographics, combined segments, audience insights |
| [Audience Targeting Health Checklist](../checklists/Audience Targeting Health Checklist.md) | Validation |
| [Audience Segment Catalog](../catalogs/Audience Segment Catalog.md) | Combined segment patterns and demographics optimization patterns |
| [Content Targeting Reference](../references/Content Targeting Reference.md) | Content targeting expansion (Phase 8.4) |
| [Demand Gen Performance Reference](../references/Demand Gen Performance Reference.md) | Demand Gen benchmarks and lookalike progression |
| Previous cycle's notes | Continuity and carry-forward items |

### Time allocation

| Section | Time |
|---------|------|
| Phase 1️⃣: Export and segment | 10 min |
| Phase 2️⃣: Remarketing analysis | 15 min |
| Phase 3️⃣: Prospecting analysis | 15 min |
| Phase 4️⃣: Targeting mode review | 10 min |
| Phase 5️⃣: Bid adjustments | 5 min |
| Phase 6️⃣: List health maintenance | 10 min |
| **Phases 1-6 subtotal** | **65 min** |
| Phase 7️⃣: Demographics optimization (monthly) | 10 min |
| Phase 8️⃣: Combined segments and audience insights (monthly) | 15 min |
| Phase 9️⃣: Optimized targeting and expansion testing (monthly) | 10 min |
| **Phases 7-9 subtotal** | **35 min** |
| **Full monthly cycle total** | **100 min** |

Bi-weekly light checks run Phases 1-6 only (~65 min). Monthly full cycles run all 9 phases (~100 min). Accounts with fewer than 5 audience segments complete in under 45 minutes for a light check.

---

## Execution framework

| Phase | Purpose | Cadence | Output |
|-------|---------|---------|--------|
| **Phase 1️⃣: Export and segment** | Pull audience data and organize by type | Every cycle | Structured performance dataset |
| **Phase 2️⃣: Remarketing analysis** | Evaluate remarketing segment performance | Every cycle | Remarketing action list |
| **Phase 3️⃣: Prospecting analysis** | Evaluate in-market, custom, and lookalike segments | Every cycle | Prospecting action list |
| **Phase 4️⃣: Targeting mode review** | Validate observation vs. targeting decisions | Every cycle | Mode change recommendations |
| **Phase 5️⃣: Bid adjustments** | Apply audience-level bid modifiers (manual bidding) | Every cycle | Bid adjustment log |
| **Phase 6️⃣: List health maintenance** | Verify list sizes, freshness, and exclusions | Monthly | List health report |
| **Phase 7️⃣: Demographics optimization** | Review and optimize demographic performance | Monthly | Demographics action list |
| **Phase 8️⃣: Combined segments and audience insights** | Discover new segments, build combined audiences | Monthly | Discovery and testing plan |
| **Phase 9️⃣: Optimized targeting and expansion testing** | Audit and test expansion settings | Monthly | Expansion settings audit |

---

## Phase 1️⃣: Export and segment

### 1.1 Pull audience performance data

Navigate to Google Ads > Audiences, keywords, and content > Audiences. Set the date range to the last 30 days (use 60 days for low-volume campaigns with fewer than 30 conversions per month).

Export the following columns for every audience segment across all in-scope campaigns:

| Column | Purpose |
|--------|---------|
| Audience segment name | Identification |
| Segment type | Classification (remarketing, in-market, custom, lookalike, affinity) |
| Campaign / Ad group | Location |
| Targeting setting | Targeting or Observation |
| Impressions | Reach indicator |
| Clicks | Engagement indicator |
| CTR | Engagement rate |
| Conversions | Performance indicator |
| Cost | Spend tracking |
| CPA or ROAS | Efficiency metric |
| Conv. Value | Revenue tracking (for value-based campaigns) |
| Value/Conv. | Per-conversion revenue (for value-based campaigns) |
| Conv. rate | Quality indicator |

### 1.2 Classify segments by type

Organize every audience segment into one of four categories:

| Category | Segment types included | Temperature |
|----------|----------------------|-------------|
| **Remarketing** | Website visitors, cart/form abandoners, product viewers, Customer Match, YouTube engaged | Hot / Warm |
| **Prospecting: custom** | Custom segments (search terms, URLs, apps) | Cool |
| **Prospecting: predefined** | In-market, life events, detailed demographics | Cold |
| **Prospecting: modeled** | Lookalike segments (Demand Gen only), affinity | Cold / Coldest |

### 1.3 Flag segments for review

Mark any segment meeting these criteria for deeper analysis in Phases 2-3:

| Flag | Condition |
|------|-----------|
| Underperformer | CPA > 2x campaign average / ROAS < 50% of campaign average for 14+ days (flag for review: action decisions in Phases 2-3 require 30+ days and 50+ clicks) |
| Zero converter | 0 conversions with 50+ clicks |
| Low volume | Fewer than 100 impressions in 30 days |
| High performer | CPA < 50% of campaign average / ROAS > 2x campaign average with 10+ conversions |
| New segment | Added in the last 30 days (insufficient data, monitor only) |

**Phase 1 output:** Classified audience performance dataset with flagged segments.

**Verification:** Every audience segment is categorized (remarketing/prospecting) and flagged segments are marked for Phase 2-3 review.

---

## Phase 2️⃣: Remarketing analysis

### 2.1 Evaluate remarketing segments by recency

Remarketing performance degrades as users move further from their last interaction. Compare CPA across membership duration windows:

| Duration window | Expected performance | Action if efficiency is below target |
|-----------------|---------------------|-------------------------------|
| 1-7 days | Best (highest intent) | Check ad frequency and creative fatigue first |
| 8-14 days | Strong | Verify creative still matches user's stage |
| 15-30 days | Good | Acceptable CPA range is wider |
| 31-60 days | Moderate | Tighten if CPA exceeds 1.5x target / ROAS below 67% of target |
| 61-90 days | Declining | Pause if CPA exceeds 2x target / ROAS below 50% of target |
| 90+ days | Weakest | Pause unless high-value product with long purchase cycle |

> 💡 **Shorter windows outperform longer windows in almost every vertical:** If your 7-day remarketing list has sufficient volume (1,000+ users), prioritize budget there over 30-day or 60-day lists.

### 2.2 Evaluate Customer Match performance

| Metric | Healthy | Action needed |
|--------|---------|---------------|
| Match rate | 40%+ | Below 29%: add phone and address data |
| List size (matched) | 1,000+ | Below 1,000: insufficient for reliable delivery |
| CPA/ROAS vs. campaign avg | At or below campaign average CPA / At or above campaign average ROAS | Above 1.5x CPA / Below 67% ROAS: segment the list by customer value |
| Last refresh | Within 30 days | Over 30 days: refresh immediately |

If Customer Match CPA is above target, segment the list:

| Segment | Definition | Expected performance |
|---------|------------|---------------------|
| High-value customers | Top 20% by LTV or order value | Best: use for lookalike seeds, upsell campaigns |
| Active customers | Purchased in last 90 days | Strong: re-engagement, cross-sell |
| Lapsed customers | No purchase in 180+ days | Moderate: win-back messaging required |
| All customers | Unsegmented full list | Baseline: split into above segments when possible |

### 2.3 Evaluate converters exclusion

Verify that recent converters are excluded from remarketing campaigns to avoid wasting spend on users who already converted:

| Purchase cycle | Exclusion window | Rationale |
|----------------|-----------------|-----------|
| Impulse / low-value | 7-14 days | Short consideration cycle |
| Standard | 14-30 days | Allow time for returns/cancellations |
| High-value / long-cycle | 30-60 days | Extended decision period |
| Subscription / SaaS | Until churn | Exclude active subscribers entirely |

If no converter exclusion is in place, add one immediately. This is the single highest-impact waste reduction available.

### 2.4 Decide: keep, adjust, or pause

Apply this decision framework to every remarketing segment:

| Performance | Volume (30-day conversions) | Action |
|-------------|----------------------------|--------|
| Efficiency on target (CPA/ROAS) | 10+ | Keep. Consider scaling budget |
| Efficiency on target (CPA/ROAS) | <10 | Keep. Do not change: low volume needs time |
| CPA 1-1.5x target / ROAS 67-100% of target | 10+ | Adjust: shorten membership duration or refresh creative |
| CPA 1.5-2x target / ROAS 50-67% of target | 10+ | Adjust: tighten duration, check landing page, review frequency |
| CPA > 2x target / ROAS < 50% of target | 10+ | Pause segment. Route to diagnosis |
| CPA > 2x target / ROAS < 50% of target | <10 | Pause segment. Insufficient data and poor efficiency |

**Phase 2 output:** Remarketing action list with keep/adjust/pause decisions per segment.

**Verification:** Every remarketing segment has a documented action (keep/adjust/pause). Converter exclusions are in place for all campaigns.

---

## Phase 3️⃣: Prospecting analysis

### 3.1 Evaluate custom segments

Custom segments (search terms, URLs, apps) are the highest-quality prospecting audiences. Review performance against campaign-level targets:

| Metric | Action threshold |
|--------|-----------------|
| CPA below campaign average / ROAS above campaign average | High performer: scale by increasing budget allocation |
| CPA within 1-1.5x campaign average / ROAS 67-100% of campaign average | On track: hold, monitor next cycle |
| CPA > 1.5x campaign average / ROAS < 67% of campaign average for 30+ days | Underperformer: review keyword/URL list quality |
| 0 conversions, 100+ clicks | Misaligned intent: rebuild segment with different inputs |

For underperforming custom segments, diagnose the input quality:

| Input type | Common problem | Fix |
|------------|---------------|-----|
| Search terms | Too broad or informational | Replace with transactional, high-converting queries |
| URLs | Irrelevant competitor sites | Replace with direct competitors and industry-specific sites |
| Apps | Wrong app category | Replace with apps your ideal customer actually uses |

### 3.2 Evaluate in-market and life event segments

In-market and life event segments are Google-defined and have limited optimization levers. The primary decision is keep or remove:

| Performance | Action |
|-------------|--------|
| Efficiency on target with 10+ conversions | Keep active |
| Efficiency within 1.5x CPA / 67% ROAS target, 5-10 conversions | Hold for one more cycle |
| CPA > 2x target / ROAS < 50% of target for 30+ days | Remove from targeting, add to exclusions if needed |
| 0 conversions in 30 days with 200+ clicks | Remove immediately |

> ⚠️ **In-market segments shift over time:** Google updates the composition of in-market segments based on user behavior. A segment performing well three months ago may have drifted. Review quarterly even if performance appears stable.

### 3.3 Evaluate lookalike segments (Demand Gen only)

> ⚠️ **Skip this section if you have no Demand Gen campaigns.** Lookalike segments are exclusive to Demand Gen.

Review lookalike performance using the reach progression framework:

| Current state | Performance | Reach adjustment |
|---------------|-------------|------------------|
| Narrow reach, Efficiency on target | Volume sufficient | Hold current setting |
| Narrow reach, Efficiency on target | Volume too low | Expand to Balanced |
| Balanced reach, Efficiency on target | Volume sufficient | Hold. Test Broad in separate ad group if scaling |
| Balanced reach, Efficiency on target | Volume too low | Expand to Broad |
| Any reach, CPA > 2x target / ROAS < 50% of target | Any volume | Tighten one level (Broad to Balanced, Balanced to Narrow) |
| Narrow reach, CPA > 2x target / ROAS < 50% of target | Any volume | Replace seed audience with higher-quality list |

> ↪️ **Lookalike seed quality tiers:** See [Demand Gen Performance Reference](../references/Demand Gen Performance Reference.md) for seed quality hierarchy. Repeat purchasers and high-LTV customers produce the best lookalikes.

Allow 14+ days after any reach change before evaluating results.

### 3.4 Evaluate affinity segments

Affinity segments are the coldest prospecting audience. They serve awareness goals, not conversion goals:

| Goal | Affinity segment action |
|------|------------------------|
| Awareness / reach | Evaluate on reach and CPM, not CPA |
| Conversion | Remove affinity segments: they are too cold for direct-response |
| Data collection (Observation mode) | Keep for insights, do not allocate dedicated budget |

### 3.5 Decide: keep, adjust, or remove

Apply this decision framework to every prospecting segment:

| Performance | Data sufficiency (clicks) | Action |
|-------------|--------------------------|--------|
| Efficiency on target (CPA/ROAS) | 50+ clicks | Keep. Consider scaling |
| CPA 1-1.5x target / ROAS 67-100% of target | 50+ clicks | Adjust: review landing page alignment, test creative |
| CPA > 2x target / ROAS < 50% of target for 30+ days | 100+ clicks | Remove from targeting. Replace with alternative segment |
| Insufficient data | <50 clicks in 30 days | Hold one more cycle. If still insufficient, pause |

**Phase 3 output:** Prospecting action list with keep/adjust/remove decisions per segment.

**Verification:** Every prospecting segment has a documented action (keep/adjust/remove). No segment with CPA >2x target and 100+ clicks remains active without an action plan.

---

## Phase 4️⃣: Targeting mode review

### 4.1 Audit observation-mode segments

Pull all segments currently in Observation mode. These segments collect performance data without restricting delivery.

For each observation-mode segment, evaluate graduation readiness:

| Criteria | Threshold for graduation to Targeting |
|----------|---------------------------------------|
| Data collected | 100+ clicks, 14+ days |
| Performance signal | Clear efficiency signal (CPA or ROAS) |
| Statistical significance | At least 10 conversions for reliable comparison |

### 4.2 Graduate or retire observation segments

| Observation segment result | Action |
|---------------------------|--------|
| Efficiency better than campaign average (CPA below / ROAS above) with 10+ conversions | Graduate to Targeting mode in its own ad group |
| Efficiency at campaign average | Hold in Observation for one more cycle |
| CPA above 2x campaign average / ROAS below 50% of campaign average | Remove from Observation: this audience underperforms |
| Insufficient data after 60 days | Remove: segment is too small for meaningful insights |

> 💡 **Observation mode is for learning, not permanent collection:** Every observation-mode segment should have a graduation date. If a segment has been in Observation for 90+ days without a clear signal, remove it and test something else.

### 4.3 Review targeting-mode settings

For all segments in Targeting mode, verify alignment:

| Campaign goal | Correct mode | Optimized targeting | Common mistake |
|---------------|-------------|--------------------|-|
| Remarketing | Targeting | OFF | Optimized targeting ON dilutes remarketing precision |
| Prospecting (conversion goal) | Targeting | Verify ON or OFF is intentional (see Phase 9 for testing) | Leaving ON without measuring its impact |
| Prospecting (awareness goal) | Targeting | ON | Setting OFF when reach is the goal |
| Data collection | Observation | N/A | Using Targeting when you want insights across all users |

### 4.4 Review optimized targeting impact

For campaigns with optimized targeting enabled:

1. Compare performance of your selected audiences vs. the expanded reach Google found
2. If expanded reach CPA is more than 2x your selected audience CPA, turn optimized targeting OFF
3. If expanded reach CPA is comparable or better, keep it ON

> ⚠️ **Optimized targeting can silently shift your audience:** When enabled, Google may spend the majority of your budget outside your selected audiences. Check the audience breakdown regularly, not just campaign-level metrics.

**Phase 4 output:** Mode change recommendations and optimized targeting decisions.

**Verification:** No observation segment has been dormant for 60+ days without a documented action. All remarketing campaigns have expansion OFF.

---

## Phase 5️⃣: Bid adjustments

> ⚠️ **This phase applies only to campaigns using Manual CPC bidding:** Smart Bidding campaigns (tCPA, tROAS, Maximize Conversions, Maximize Conversion Value) handle audience-level bid optimization automatically. Skip this phase for Smart Bidding campaigns.

### 5.1 Calculate audience bid adjustments

For campaigns on Manual CPC bidding, apply bid adjustments to observation-mode audiences based on their relative performance:

| Audience efficiency vs. campaign average | Bid adjustment | Rationale |
|-----------------------------------|----------------|-----------|
| CPA 50%+ below average / ROAS 50%+ above average | +20% to +40% | Increase exposure to high-performing audience |
| CPA 20-50% below average / ROAS 20-50% above average | +10% to +20% | Moderate increase for good performers |
| Within 20% of average (CPA/ROAS) | No adjustment | Performance is in line with expectations |
| CPA 20-50% above average / ROAS 20-50% below average | -10% to -20% | Reduce exposure to underperformers |
| CPA 50%+ above average / ROAS 50%+ below average | -30% to -50% | Significant reduction or consider removal |

### 5.2 Apply adjustments incrementally

1. Change bid adjustments by a maximum of 20% per cycle
2. Allow 14 days between adjustment changes
3. Document every adjustment with the data that drove the decision
4. Review adjustments in the next cycle to confirm the expected impact materialized

### 5.3 Monitor adjustment stack

When multiple bid adjustments interact (audience + device + location), the combined effect can be extreme:

| Scenario | Combined effect |
|----------|----------------|
| Audience +30%, Device +20%, Location +15% | Total: +1.30 x 1.20 x 1.15 = +79% bid increase |
| Audience -30%, Device -20% | Total: 0.70 x 0.80 = -44% bid decrease |

Verify that stacked adjustments do not push actual bids outside your acceptable range.

**Phase 5 output:** Bid adjustment log with rationale per audience segment.

**Verification:** All adjustments are within 20% change per cycle. No stacked adjustments exceed acceptable bid range.

---

## Phase 6️⃣: List health maintenance

### 6.1 Review remarketing list sizes

Navigate to Tools > Audience Manager > Your data segments. Check every remarketing list:

| List size | Status | Action |
|-----------|--------|--------|
| 10,000+ | Healthy | No action needed |
| 1,000-10,000 | Adequate | Monitor: ensure list is growing, not shrinking |
| 100-1,000 | At risk | Limited delivery: consider broadening list criteria |
| Below 100 | Critical | Delivery stopped: broaden criteria or merge with larger list |

### 6.2 Review membership duration settings

Ensure membership durations match your purchase cycle:

| Product type | Recommended max duration | Rationale |
|-------------|--------------------------|-----------|
| Impulse / low consideration | 14-30 days | Intent decays quickly |
| Standard consideration | 30-60 days | Balanced recency and reach |
| High-value / long cycle | 60-180 days | Extended research period |
| B2B / enterprise | 180-540 days | Very long sales cycles |

If a remarketing list's membership duration exceeds your purchase cycle by more than 2x, shorten it. Long durations fill lists with low-intent users who inflate audience size without improving performance.

### 6.3 Verify Customer Match freshness

| Metric | Healthy | Action needed |
|--------|---------|---------------|
| Last upload date | Within 30 days | Over 30 days: schedule refresh immediately |
| Match rate | 40%+ | Below 29%: add phone and address identifiers |
| List size (matched) | 1,000+ | Below 1,000: combine CRM sources or wait for growth |
| Data completeness | Email + phone + address | Email only: add additional identifiers to improve match rate |

### 6.4 Clean up unused lists

Remove or archive audience lists that meet any of these criteria:

| Criteria | Action |
|----------|--------|
| Not used in any campaign for 90+ days | Archive or delete |
| Membership size below 100 for 60+ days | Delete (cannot serve anyway) |
| Duplicate of another list (same criteria, same source) | Delete the duplicate |
| Created for a one-time test, test concluded | Archive |

### 6.5 Verify exclusion list freshness

| Exclusion list | Refresh requirement |
|----------------|---------------------|
| Recent converters | Auto-populating via Google Tag (verify tag is firing) |
| Customer Match (all customers) | Refresh with Customer Match upload cadence |
| Competitor brand lists | Review quarterly for new competitors |

**Phase 6 output:** List health report with actions taken.

**Verification:** All remarketing lists are above 100 users. Customer Match refreshed within 30 days. No unused lists older than 90 days remain.

---

## Phase 7️⃣: Demographics optimization (monthly only)

> ⚠️ **Demographics are a layer, not standalone targeting:** This phase optimizes demographic performance within your existing audience segments. Demographics alone are not a targeting strategy.

### 7.1 Pull demographic performance data

Navigate to Audiences, keywords, and content > Demographics. Use the same date range as Phase 1 (last 30 days, or 60 days for low-volume campaigns). Review each dimension:

| Dimension | Where to find | What to check |
|-----------|--------------|---------------|
| Age | Demographics > Age | CPA/ROAS by age bracket |
| Gender | Demographics > Gender | CPA/ROAS by gender |
| Parental status | Demographics > Parental status | CPA/ROAS by parental status |
| Household income | Demographics > Household income | CPA/ROAS by income tier (select countries) |

### 7.2 Identify demographic outliers

Flag demographic groups meeting these criteria:

| Condition | Action |
|-----------|--------|
| CPA > 2x campaign average with 50+ clicks | Candidate for exclusion (Smart Bidding) or bid reduction (Manual CPC) |
| ROAS < 50% of campaign average with 50+ clicks | Candidate for exclusion or bid reduction |
| 0 conversions with 100+ clicks | Strong exclusion candidate |
| CPA < 50% of campaign average with 10+ conversions | High performer: consider bid increase (Manual CPC) |
| "Unknown" > 20% of budget with CPA > 1.5x average | Flag for review. Only exclude if CPA > 2x campaign average persists for 30+ days with 50+ clicks |
| Insufficient data (< 50 clicks) | Hold for one more cycle |

### 7.3 Apply demographic adjustments

| Bidding type | Available action | How to apply |
|-------------|-----------------|--------------|
| Manual CPC | Bid adjustments per demographic group | Audiences, keywords, and content > Demographics > Edit bid adjustment. Adjust in 10-20% increments per cycle |
| Smart Bidding (tCPA/tROAS) | Exclude underperforming demographic groups | Audiences, keywords, and content > Demographics > Exclude. Bid adjustments do not apply under Smart Bidding |

> ⚠️ **Excluding "Unknown" removes 15-30% of inventory:** The "Unknown" segment represents users whose demographic data Google cannot determine. Excluding it significantly reduces your addressable audience. Only exclude after 30+ days of consistently poor performance with sufficient data.

### 7.4 Demand Gen optimized targeting demographic behavior

> ⚠️ **Skip this section if you have no Demand Gen campaigns with optimized targeting ON.**

When optimized targeting is ON in Demand Gen campaigns, Google may serve ads to users beyond your selected demographic criteria. Review demographic performance to check for this:

1. Compare demographic distribution with optimized targeting ON vs. your intended targeting
2. If demographics outside your intended selections show CPA > 2x campaign average: restrict demographic behavior to age and gender only in ad group settings, or turn optimized targeting OFF
3. If expanded demographics perform at or below campaign average: keep current settings

**Phase 7 output:** Demographics action list with adjustments and exclusions documented.

**Verification:** No demographic group with CPA >2x and 50+ clicks remains active without a documented action.

---

## Phase 8️⃣: Combined segments and audience insights (monthly only)

### 8.1 Review existing combined segment performance

For every combined segment in use, evaluate using the same keep/adjust/remove framework as Phase 3:

| Performance | Action |
|-------------|--------|
| Efficiency on target (CPA/ROAS) with 50+ clicks | Keep. Consider scaling budget allocation |
| CPA 1-1.5x target / ROAS 67-100% of target | Adjust: diagnose which component is the weak link |
| CPA > 2x target / ROAS < 50% of target for 30+ days | Remove. Rebuild with different component segments |
| Insufficient data (< 50 clicks in 30 days) | Hold one more cycle |

For underperforming combined segments, diagnose component quality:

| Diagnosis approach | How |
|-------------------|-----|
| Test components individually | Run each component segment in its own ad group for 30 days |
| Check audience size | Verify the combined segment has not shrunk below deliverable size |
| Review component relevance | Are the individual segments still aligned with your product/audience? |

### 8.2 Use audience insights for discovery

Navigate to Google Ads > Insights page > Audience insight cards. Review the persona insights table:

| Column | What it tells you |
|--------|-------------------|
| Audience segment | Name of the segment driving conversions |
| Type | Segment type (in-market, affinity, detailed demographic, life events) |
| Share of conversions | Percentage of conversions attributed to this segment |
| Index | How overrepresented this segment is among your converters vs. the general population |

**Action framework:**

| Index | Share of conversions | Action |
|-------|---------------------|--------|
| > 3x | Any | High priority: add as targeting segment if not already targeted |
| 1.5-3x | > 5% | Medium priority: evaluate for addition, test in separate ad group |
| 1.5-3x | < 5% | Low priority: monitor in next cycle |
| < 1.5x | Any | No action: proportional to general population |

Also check Audience Manager > Your data insights for first-party audience performance across campaigns.

### 8.3 Build new combined segments from insights

When audience insights reveal high-index untargeted segments, build combined segments to test them:

| Discovery | Combined segment to build | Test approach |
|-----------|--------------------------|---------------|
| High-index in-market segment | Discovered in-market AND existing high-performing custom segment | Separate ad group, optimized targeting OFF, 30-day test |
| High-index affinity segment | Discovered affinity AND In-market (for precision) AND NOT existing customers | Separate ad group, small budget, 30-day test |
| High-index life event | Life event AND relevant In-market AND NOT converters | Separate ad group, 30-day test |
| DG: high-index segment | Lookalike OR discovered custom segment (same ad group) | Google-recommended DG structure |

> 💡 **Test one new combined segment per cycle:** Adding multiple new audiences simultaneously makes attribution impossible. Test one, measure for 30 days, then test the next.

### 8.4 Content targeting expansion (Display/Video only)

> ⚠️ **Skip this section if you only manage Demand Gen campaigns.** Content targeting is not available in Demand Gen.

If your Display or Video campaigns use only audience targeting with no content targeting, evaluate whether content targeting could complement your existing setup:

1. Review audience insights for content themes: which types of content are your converting audiences consuming?
2. If clear content themes emerge, test adding 3-5 topic categories with AND logic (audience + topics) in a separate ad group
3. Allow 30 days for evaluation
4. Compare audience-only ad group vs. audience + content ad group

> ↪️ **Content targeting specs and testing approach:** See [Content Targeting Reference](../references/Content Targeting Reference.md) for targeting types, limits, and the full expansion testing framework.

**Phase 8 output:** Discovery and testing plan with new combined segments queued and content targeting expansion evaluated.

**Verification:** At most one new combined segment queued for testing this cycle. High-index untargeted segments documented.

---

## Phase 9️⃣: Optimized targeting and expansion testing (monthly only)

### 9.1 Audit current expansion settings

Review every in-scope campaign and document the current expansion setting:

| Campaign type | Feature name | Where to find |
|---------------|-------------|---------------|
| Display | Optimized targeting | Ad group settings |
| Video (Sales/Leads/Traffic goals) | Optimized targeting | Ad group settings |
| Video (Consideration/Awareness goals) | Audience expansion | Ad group settings |
| Demand Gen | Optimized targeting | Ad group settings |

> ⚠️ **Optimized targeting and audience expansion are different features:** Optimized targeting finds users most likely to convert based on conversion data. Audience expansion finds more users similar to your selected audience for reach. They apply to different campaign types and should not be conflated.

For each campaign, document:

| Campaign | Feature | Current setting | Last changed | Notes |
|----------|---------|----------------|-------------|-------|
| [Campaign name] | Optimized targeting / Audience expansion | ON / OFF | [Date] | [Any context] |

**Verify all remarketing campaigns have the setting OFF.** This is non-negotiable: expansion on remarketing defeats the purpose of audience restriction.

### 9.2 Measure expansion impact

For campaigns with optimized targeting or audience expansion enabled, navigate to Audiences, keywords, and content > Audiences > Show table. Look for the "Total: Expansion and optimized targeting" row.

| Metric | Interpretation | Action |
|--------|---------------|--------|
| Expanded CPA < 1.5x targeted CPA | Expansion is working efficiently | Keep ON |
| Expanded CPA 1.5-2x targeted CPA | Borderline: monitor over 14+ days | Hold, evaluate next cycle |
| Expanded CPA > 2x targeted CPA | Expansion is inefficient | Turn OFF |
| Expansion delivers < 5% of total conversions | Low risk, low impact | Keep ON for additional volume |
| Expansion delivers > 50% of total conversions | Your audience selections may be too narrow | Review selected audiences before turning expansion OFF |

### 9.3 Structured test methodology

For campaigns where expansion has never been tested (always ON or always OFF):

| Step | Action | Duration |
|------|--------|----------|
| 1 | Run 30 days with expansion OFF (baseline) | 30 days |
| 2 | Turn expansion ON, run 30 days (test) | 30 days |
| 3 | Compare CPA/ROAS between periods | After 60 days total |
| 4 | If expansion CPA < 1.5x baseline: keep ON | Permanent decision |
| 5 | If expansion CPA > 2x baseline: keep OFF | Permanent decision |

> 💡 **Test one campaign at a time:** Stagger expansion tests across campaigns. With 3 campaigns, test Campaign 1 in Cycle 1 (months 1-2), Campaign 2 in Cycle 2 (months 3-4), Campaign 3 in Cycle 3 (months 5-6). Do not enable or disable expansion across all campaigns simultaneously.

For Video campaigns with consideration/awareness goals: test audience expansion using the same methodology. This is a separate feature from optimized targeting and should be tested independently.

### 9.4 Optimize signal quality (when expansion is ON)

When optimized targeting is ON, your selected audiences function as signals. Improving signal quality improves expansion performance:

| Campaign type | Signal inputs | How to improve |
|---------------|-------------|----------------|
| Display | Audience segments, custom segments, Customer Match, keywords, topics | Replace broad segments with high-performing specific ones. Add converting search terms as keywords. Add relevant topics. |
| Video (Sales/Leads/Traffic) | Audience segments, custom segments, Customer Match | Replace broad segments with high-performing ones. Placements do NOT serve as signals. |
| Demand Gen | Audience segments, custom segments, Customer Match | Replace broad segments with highest-LTV Customer Match. Add high-converting keyword custom segments. |

**Phase 9 output:** Expansion settings audit with test plan for untested campaigns.

**Verification:** All remarketing campaigns have expansion OFF. At most one new expansion test started this cycle. All existing expansion settings have a documented CPA comparison.

---

## Validation & definition of done

This SOP is complete when:

- [ ] Phase 1: Audience data exported and segments classified by type
- [ ] Phase 2: Remarketing segments evaluated, underperformers paused or adjusted
- [ ] Phase 3: Prospecting segments evaluated, underperformers removed or replaced
- [ ] Phase 4: Observation-mode segments graduated, retired, or held with documented rationale
- [ ] Phase 5: Bid adjustments applied (manual bidding campaigns only) or confirmed as not applicable
- [ ] Phase 6: List sizes verified, membership durations validated, Customer Match refreshed, unused lists archived
- [ ] Phase 7 (monthly): Demographics reviewed, outliers addressed, adjustments or exclusions applied
- [ ] Phase 8 (monthly): Audience insights reviewed, combined segments evaluated, new segments queued for testing
- [ ] Phase 9 (monthly): Expansion settings audited, expansion impact measured, test plan created for untested campaigns
- [ ] All changes documented with rationale and date
- [ ] Next review date scheduled

---

## Exit → entry bridge

After completing the optimization cycle:

| Timeframe | Action |
|-----------|--------|
| Same day | Execute immediate removals and pauses |
| This week | Refresh Customer Match lists if overdue |
| 14 days | Evaluate impact of targeting mode changes and bid adjustments |
| Next cycle | Review all changes from this cycle before starting new analysis |

**If issues require escalation:**

| Issue type | Route to |
|------------|----------|
| Audience infrastructure is missing or fundamentally broken | [Expand Audience Reach](../playbooks/Expand Audience Reach.md) |
| Need to rebuild audience targeting from scratch | [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md) |
| Customer Match list needs building or major overhaul | [SOP – Build Customer Match Lists](../sops/SOP – Build Customer Match Lists.md) |
| Demand Gen campaign needs full optimization (not just audiences) | [SOP – Run Demand Gen Optimization Cycle](../sops/SOP – Run Demand Gen Optimization Cycle.md) |
| Performance anomaly unrelated to audiences | [SOP – Investigate Performance Anomalies](../sops/SOP – Investigate Performance Anomalies.md) |

---

## Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Never reviewing audience performance | "Set and forget" after initial setup | Calendar-block monthly audience reviews |
| Evaluating audiences with insufficient data | Reacting to 7 days of data | Require 30 days and 50+ clicks minimum before decisions |
| Keeping stale remarketing lists | Not checking Audience Manager | Run Phase 6 every cycle, verify list sizes and freshness |
| Ignoring observation-mode segments | Adding segments and never analyzing | Set graduation dates: 60 days max in Observation |
| Applying Search-level CPA expectations to cold audiences | Expecting cold audiences to perform like remarketing | Set separate CPA targets by audience temperature |
| Stacking too many bid adjustments | Optimizing each lever independently | Monitor combined adjustment effects every cycle |
| Expanding lookalikes too quickly | Jumping from Narrow straight to Broad | Progress one level at a time, validate for 14+ days |
| No converter exclusion on remarketing | Oversight during setup | Verify exclusions exist every cycle in Phase 2 |
| Never reviewing demographics | Missing easy optimization: excluding 0-conversion demo groups | Run Phase 7 monthly, review all demographic dimensions |
| Leaving optimized targeting ON without measuring impact | Expansion may be inefficient but undetected | Check "Total: Expansion and optimized targeting" row in Phase 9 |
| Ignoring audience insights | Missing high-performing untargeted segments | Check Insights page monthly in Phase 8 for high-index segments |
| Never testing combined segments | Using only simple segments when precision is needed | Build combined segments from insights discoveries in Phase 8 |

---

## Related documents

| Document | Type | Relationship |
|----------|------|--------------|
| [Audience Strategy Mental Model](../mental-models/Audience Strategy Mental Model.md) | Mental Model | Temperature framework and signal vs. targeting distinction |
| [Audience Targeting Reference](../references/Audience Targeting Reference.md) | Reference | Targeting modes, expansion settings, segment specs |
| [Audience Targeting Guidelines](../guidelines/Audience Targeting Guidelines.md) | Guideline | Recommended settings, expansion decisions, demographic optimization |
| [Audience Segments Reference](../references/Audience Segments Reference.md) | Reference | Full list of Google predefined audience segment names |
| [Audience Targeting Health Checklist](../checklists/Audience Targeting Health Checklist.md) | Checklist | Validates ongoing targeting health |
| [Demand Gen Performance Reference](../references/Demand Gen Performance Reference.md) | Reference | Lookalike progression, Demand Gen benchmarks |
| [Audience Segment Catalog](../catalogs/Audience Segment Catalog.md) | Catalog | Segment selection, combined segments, demographics patterns |
| [Content Targeting Reference](../references/Content Targeting Reference.md) | Reference | Content targeting specs for Display/Video (Phase 8.4) |
| [Expand Audience Reach](../playbooks/Expand Audience Reach.md) | Playbook | Audience foundation routing and expansion decisions |
| [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md) | SOP | Initial audience targeting configuration |
| [SOP – Set Up Audience Signals](../sops/SOP – Set Up Audience Signals.md) | SOP | PMax signal configuration (separate system) |
| [SOP – Build Customer Match Lists](../sops/SOP – Build Customer Match Lists.md) | SOP | Customer Match list creation and refresh |
| [SOP – Run Demand Gen Optimization Cycle](../sops/SOP – Run Demand Gen Optimization Cycle.md) | SOP | Full Demand Gen optimization (audiences + creative + bidding) |
| [SOP – Run Search Campaign Optimization Cycle](../sops/SOP – Run Search Campaign Optimization Cycle.md) | SOP | Search optimization cycle (parallel workflow) |

---

## Version details

- **Version:** 4.0
- **Last Updated:** April 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
