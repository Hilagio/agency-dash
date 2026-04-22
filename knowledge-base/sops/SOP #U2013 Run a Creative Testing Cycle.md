# SOP – Run a Creative Testing Cycle
Created: 2026-02-14

SOP_ID: SOP_88
Status: Done
Category: Creative
Primary Outcome: Creative variants tested across formats, winners identified and deployed, losers replaced, learnings documented
Agent_Executable: No
Human_Approval_Required: No
Domain: Creative
Pillar: 8

## Purpose

This SOP runs a structured creative testing cycle across all Google Ads formats: Search RSAs, PMax assets, Demand Gen creatives, responsive display ads, and video ads. It connects format-specific testing methods into a single repeatable cadence so every format gets tested, measured, and refreshed systematically.

> ❓ **The big question:** Which creative elements are winning, which are dragging down performance, and what do you test next across every ad format?

---

## What this SOP is NOT

This SOP does **not:**

- Teach the Iteration Loop methodology for RSAs (See: [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md))
- Run PMax campaign-level optimization (See: [SOP – Run PMax Ecommerce Optimization Cycle](../sops/SOP – Run PMax Ecommerce Optimization Cycle.md) or [SOP – Run PMax Lead Gen-SaaS Optimization Cycle](../sops/SOP – Run PMax Lead Gen-SaaS Optimization Cycle.md))
- Run Demand Gen campaign optimization (See: [SOP – Run Demand Gen Optimization Cycle](../sops/SOP – Run Demand Gen Optimization Cycle.md))
- Run Display and Video campaign optimization (See: [SOP – Run Display & Video Campaign Optimization Cycle](../sops/SOP – Run Display & Video Campaign Optimization Cycle.md))
- Write initial RSAs or compose ad copy (See: [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md))
- Explain testing theory or experiment design (See: [Testing and Experimentation Mental Model](../mental-models/Testing and Experimentation Mental Model.md))

**Key distinction:** This is a cross-format coordination SOP. It routes you to the right format-specific SOP for execution, then brings results back together for learning documentation and the next cycle.

### When to run this SOP

Run monthly as a recurring cadence. Each cycle covers all active ad formats.
| Condition | Required |
|-----------|----------|
| At least one campaign per format has been live 4+ weeks | Yes |
| Previous cycle's changes have had 2+ weeks to accumulate data | Yes |
| Creative foundation is solid (RSAs deployed, PMax assets populated, Demand Gen creative launched) | Yes |
| Conversion tracking is verified and stable | Yes |

> 💡 **First cycle prerequisite:** Complete format-specific setup SOPs before running this cycle. You cannot test creative that has not been deployed.

---

### Before you start

**Required inputs:**

- Access to Google Ads with Editor permissions
- Asset-level performance data for all active formats
- Previous cycle's learning log (or blank template for first cycle)
- Hypothesis backlog (from prior cycles, customer research, or competitor analysis)

**Reference documents (have open):**
| Document | Used for |
|----------|----------|
| [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md) | Search RSA testing methodology |
| [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md) | Iteration Loop methodology (Templatize, Aggregate, Diagnose, Iterate) |
| [Headline Angle Catalog](../catalogs/Headline Angle Catalog.md) | Headline angle ideas for new variants |
| [Demand Gen Performance Reference](../references/Demand Gen Performance Reference.md) | Demand Gen benchmarks and creative format data |
| [Testing and Experimentation Mental Model](../mental-models/Testing and Experimentation Mental Model.md) | Statistical significance and experiment design |
| [Description Expansion Catalog](../catalogs/Description Expansion Catalog.md) | Description patterns for new variants |
| [Image Creative Reference](../references/Image Creative Reference.md) | Image specs and creative guidelines |
| [Video Creative Reference](../references/Video Creative Reference.md) | Video specs and format guidelines |

---

## Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1** | Define test hypotheses | Hypothesis document per format |
| **Phase 2** | Set up test variants by format | New creative variants deployed |
| **Phase 3** | Launch tests with proper controls | Tests running with clean baselines |
| **Phase 4** | Monitor during test period | Monitoring log confirming no contamination |
| **Phase 5** | Analyze results and declare winners | Winner/loser classification per format |
| **Phase 6** | Deploy winners and document learnings | Learning log updated, losers replaced |
| **Phase 7** | Schedule next cycle | Next cycle date set, hypothesis backlog refreshed |

---

## Phase 1️⃣: Define test hypotheses

Every test starts with a hypothesis. Never test randomly.

### 1.1 Review prior cycle learnings

1. Open the learning log from the previous cycle
2. Review actions marked "test next cycle"
3. Pull forward any hypotheses that were deferred due to volume or timing
4. Note which formats had inconclusive results (need longer run or higher volume)

### 1.2 Generate new hypotheses

Use these sources to create hypotheses for each format:

| Source | What to extract | Example hypothesis |
|--------|----------------|-------------------|
| Customer reviews | Repeated praise or complaints | "If we add 'no contract' as a Risk Removal headline, CPI will improve because 40% of reviews mention commitment fears" |
| Competitor ads | Messaging gaps or overused angles | "If we highlight '24/7 live support' in PMax headlines, we differentiate because no competitor mentions it" |
| Sales/support team | Common objections and questions | "If we address 'setup time' in Demand Gen video hooks, CTR will improve because it is the top objection" |
| Prior test results | Patterns across formats | "If the 'social proof' angle won in Search RSAs, testing user count overlays in Display images should improve CVR" |
| Seasonal relevance | Timely offers or themes | "If we add Q4 budget messaging in January, relevance improves for annual planners" |

> 💡 **These are example sources, not an exhaustive list.** Any signal about customer behavior, market conditions, or creative performance can generate a valid hypothesis. The key is that every test starts from a documented reason, not random exploration.

### 1.3 Write hypotheses per format

Use this format for each hypothesis:

> **Hypothesis format:** "If we [CHANGE] in [FORMAT], then [KPI] will [DIRECTION] because [REASON]".

Create 1-3 hypotheses per active format. Do not overload a single cycle with more than you can measure.

| Format | Max hypotheses per cycle | Why |
|--------|--------------------------|-----|
| Search RSAs | 2-3 (per cluster) | Limited headline slots, need data per angle |
| PMax assets | 1-2 (per asset group) | Max 2 swaps per asset type per cycle |
| Demand Gen | 2-3 (per ad group) | Multiple creative formats to compare |
| Display | 1-2 | Lower conversion volume, longer data accumulation |
| Video | 1-2 | Production effort per variant is higher |

---

## Phase 2️⃣: Set up test variants by format

### 2.1 Search RSAs

Follow the Iteration Loop methodology. This SOP does not replace it: it coordinates timing.

1. Identify the testing cluster and slot to test
2. Create the variant headline or description based on your hypothesis
3. Apply the variant across the cluster using the template approach

**Key rules:**

| Rule | Rationale |
|------|-----------|
| Use CPI/RPI columns as primary metric | Business outcome, not CTR |
| Use label-based pattern testing | Enables aggregation across ad groups |
| Ignore Ad Strength score | Completeness checklist, not performance signal |
| Test one slot at a time per cluster | Isolates the variable |

> ↪️ **Full RSA testing process:** See [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md).

### 2.2 PMax assets

PMax asset testing follows the same Iteration Loop methodology as RSA testing: Templatize, Aggregate, Diagnose, Iterate.

1. **Templatize:** Assign each asset slot to a specific angle type (value proposition, social proof, risk removal, etc.) so you can compare angles across asset groups, not just individual assets
2. **Aggregate:** Use actual asset-level performance data (impressions, clicks, conversions per asset). Pool results across asset groups that share the same angle template to reach meaningful data volumes
3. **Diagnose:** Classify each asset using the performance tier system: Strong, Adequate, Underperforming, Data-starved, Zero-conversion (minimum 1,000 impressions per asset type)
4. **Iterate:** Replace the 1-2 weakest assets per type with variants that test a different angle or sub-angle. Maintain angle diversity across the asset group

**Key rules:**

| Rule | Rationale |
|------|-----------|
| Use conversions per impression as primary metric | Normalized for exposure differences |
| Templatize angles across asset groups | Enables aggregated analysis, avoids data poverty |
| Ignore Ad Strength entirely | Completeness indicator, not performance predictor |
| Max 2 swaps per asset type per cycle | Preserves measurement clarity |

> ↪️ **Methodology foundation:** PMax asset testing follows the same Iteration Loop methodology as RSA testing. See [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md) for the full framework.

### 2.3 Demand Gen creatives

Demand Gen supports multiple creative formats: video, single image, and carousel. Test format performance and creative variation simultaneously.

1. Review current creative performance per ad group (CTR, conversions, CPA)
2. Identify underperforming creatives (below ad group average on conversions per impression)
3. Create new variants based on your hypotheses

**Format-level tests:**

| Test type | What you compare | When to run |
|-----------|-----------------|-------------|
| Video vs. image vs. carousel | Format performance head-to-head | First 1-3 cycles (exploration) |
| UGC-style vs. polished production | Creative style effectiveness | When budget supports both versions |
| Audience-creative combinations | Which creative works for which audience | After format winners are identified |

**Creative variant rules:**

| Rule | Rationale |
|------|-----------|
| Include at least one video AND one image per ad group | Covers YouTube (video) and Discover/Gmail (image) |
| Test 3-5 variations per format | Gives Google options to optimize across |
| Keep video under 30 seconds | Short-form outperforms in feed contexts |
| Size images to 1200x628 and 1200x1200 | Covers all Demand Gen placements |

> ↪️ **For Demand Gen benchmarks and format data:** See [Demand Gen Performance Reference](../references/Demand Gen Performance Reference.md).

### 2.4 Responsive display ads

Display creative testing focuses on individual elements within responsive display ads.

1. Review asset-level reports for current responsive display ads
2. Identify the weakest element type (headline, description, image, logo)
3. Create 1-2 replacement variants for the weakest element

**Element testing priority:**

| Priority | Element | Impact level | Test approach |
|----------|---------|-------------|---------------|
| 1 | Images (landscape + square) | Highest: visual-first format | Swap weakest image, test different visual approach |
| 2 | Headlines (short + long) | High: primary text element | Test different angles (benefit vs. proof vs. urgency) |
| 3 | Descriptions | Medium | Test different value propositions or CTAs |
| 4 | Logos | Low (unless missing) | Ensure brand visibility, test with/without |

### 2.5 Video ads

Video testing involves higher production effort. Plan variants strategically.

1. Review current video performance (view rate, CTR, conversions per view)
2. Identify underperforming videos (below campaign average on conversions per view)
3. Create variants testing one element per hypothesis

**Video element tests:**

| Element | What to test | How to isolate |
|---------|-------------|----------------|
| Hook (first 5 seconds) | Different opening: question vs. pain point vs. stat vs. product demo | Keep body and CTA identical, change only the hook |
| Length | 15s vs. 30s vs. 60s | Same message adapted to different durations |
| Format | Talking head vs. animation vs. product demo vs. UGC | Keep message consistent, change delivery style |
| CTA placement | End card vs. mid-roll vs. persistent overlay | Same video, different CTA timing |

> ⚠️ **Video testing is slower:** Production costs and lower conversion volumes mean video test cycles take 4-8 weeks to produce actionable data. Plan accordingly.

### 2.6 Asset-level optimization across all formats

Beyond ad-level testing, Demand Gen, Display, and Video campaigns provide asset-level performance data that enables creative optimization at a granular level:

1. **Format-level tests first:** Determine which creative format performs best (video vs. image vs. carousel for Demand Gen, different image approaches for Display). This is the "big picture" testing priority
2. **Then zoom into asset-level:** Once format winners are identified, optimize individual assets within the winning format: tweak headlines, descriptions, images, hooks, and CTAs
3. **Testing maturity curve:** Early cycles focus on format discovery (broad). Mature accounts focus on asset-level refinement within proven formats (narrow). This follows the same testing maturity progression as the Iteration Loop: angle type vs. angle type first, then sub-angle vs. sub-angle, then asset vs. asset

---

## Phase 3️⃣: Launch tests with proper controls

### 3.1 Establish clean baselines

Before deploying any variant, record current performance for each format:

| Metric to record | Search RSAs | PMax | Demand Gen | Display | Video |
|-------------------|------------|------|------------|---------|-------|
| Impressions | Per asset | Per asset | Per creative | Per asset | Per video |
| Clicks | Per asset | Per asset | Per creative | Per asset | Per video |
| Conversions | Per asset | Per asset | Per creative | Per asset | Per video |
| Primary KPI (CPI/RPI) | Per cluster | Per asset group | Per ad group | Per campaign | Per campaign |
| Date range | Last 14-30 days | Last 14-30 days | Last 14-30 days | Last 14-30 days | Last 14-30 days |

### 3.2 Deploy variants

1. Deploy all format-specific variants on the same day (or within a 2-day window)
2. Label new variants with test ID for tracking (format: `[FORMAT]-[DATE]-[NUMBER]`)
3. Verify all new assets are approved and serving
4. Record the launch date for each format

### 3.3 Set control rules

During the test period, do not:

- Change bid strategies or targets
- Adjust budgets by more than 10%
- Add or remove audience segments
- Modify landing pages
- Deploy additional creative changes outside this cycle

> ⚠️ **Contamination kills tests:** If you change something else during the test period, you cannot isolate which change caused the result. Freeze all other variables for the duration.

---

## Phase 4️⃣: Monitor during test period

### 4.1 Test duration by format

| Format | Minimum test duration | Minimum data threshold |
|--------|----------------------|----------------------|
| Search RSAs | 2-4 weeks | 1,000+ impressions per asset across cluster |
| PMax assets | 2-4 weeks | 1,000+ impressions per asset type |
| Demand Gen | 3-4 weeks (includes learning) | 30+ conversions per ad group |
| Display | 3-4 weeks | 1,000+ impressions per asset |
| Video | 4-8 weeks | 500+ views per video, 10+ conversions |

### 4.2 Weekly monitoring checks

Run these checks weekly during the test period:

1. Verify all test variants are still approved and serving
2. Check for contamination (unplanned changes by team members, automated suggestions applied)
3. Confirm no format is catastrophically underperforming (>50% worse than control on primary KPI)
4. Log any external events that could affect results (seasonal shifts, competitor changes, promotions)

### 4.3 Early termination rules

| Condition | Action |
|-----------|--------|
| Variant is 50%+ worse than control after 1 week of data | Pause the variant, document as failed hypothesis |
| Account-level emergency (tracking break, budget issue) | Pause the cycle, restart after resolution |
| External event contaminating results (major promotion, seasonality shift) | Extend the test period, note the event |

Do not terminate early because one variant "looks better". Wait for minimum thresholds.

---

## Phase 5️⃣: Analyze results and declare winners

### 5.1 Pull performance data per format

At the end of the test period, extract data for each format using the same metrics from Phase 3.

### 5.2 Apply format-specific analysis

**Search RSAs:** Use the Iteration Loop quadrant analysis:

| Quadrant | Profile | Action |
|----------|---------|--------|
| Champions | High CPI/RPI, High AIS | Protect |
| Hidden Gems | High CPI/RPI, Low AIS | Increase exposure |
| Silent Killers | Low CPI/RPI, High AIS | Remove immediately |
| Trash | Low CPI/RPI, Low AIS | Replace next cycle |

**PMax assets:** Classify by performance tier:

| Tier | Criteria | Action |
|------|----------|--------|
| Strong | Above-average conversions per impression | Keep |
| Underperforming | Below-average conversions per impression after 1,000+ impressions | Replace |
| Zero-conversion | 1,000+ impressions, zero conversions | Replace immediately |

**Demand Gen:** Compare across formats and variants:

| Comparison | Primary metric | Secondary metric |
|------------|---------------|-----------------|
| Video vs. image vs. carousel | Conversions per impression | CTR |
| UGC vs. polished | CVR | CPA |
| Audience-creative pairing | CPA | Conversion volume |

**Display:** Compare element-level performance:

| Metric | Use for |
|--------|---------|
| CTR by asset combination | Identifying which headlines/images drive clicks |
| CVR by asset combination | Identifying which combinations convert |
| Impressions by asset | Understanding which assets Google favors |

**Video:** Compare video-level performance:

| Metric | Use for |
|--------|---------|
| View rate | Hook effectiveness |
| CTR | CTA effectiveness |
| Conversions per view | Overall creative quality |
| Cost per view | Efficiency |

**Demand Gen, Display, Video: primary metric for performance-driven campaigns**

When running Demand Gen, Display, or Video campaigns with performance goals (conversions, revenue), use CPI (Conversions Per Impression) or RPI (Revenue Per Impression) as the primary creative metric, consistent with the Iteration Loop methodology. Do not rely on CTR alone.

For campaigns with view-through conversions (VTCs), use a blended conversion metric:

> **Blended conversions** = click-through conversions + (VTCs x discount factor of 0.3-0.5)

This acknowledges that view-through conversions have real but lower value than click-through conversions. Use 0.3 for conservative accounts, 0.5 when VTC validation data supports it.

> ↪️ **VTC handling methodology:** See [Demand Gen Performance Reference](../references/Demand Gen Performance Reference.md) for the full VTC framework.

**Non-performance goals (awareness, reach):** When campaigns target awareness rather than conversions, use CPM, view rate, and frequency as primary metrics. CPI/RPI does not apply.

### 5.3 Statistical significance check

Before declaring any winner, verify the result is not random noise:

| Effect size | Approximate conversions needed per variant |
|-------------|-------------------------------------------|
| 20%+ difference | 100-200 |
| 10-20% difference | 300-500 |
| 5-10% difference | 1,000+ |
| <5% difference | Inconclusive at most volumes |

If a result does not reach significance, classify it as "directional" and extend the test or add the hypothesis to the next cycle.

> ↪️ **For statistical significance framework:** See [Testing and Experimentation Mental Model](../mental-models/Testing and Experimentation Mental Model.md).

**Target 80%+ statistical significance** before declaring winners. This aligns with the RSA Testing methodology where conversion thresholds are designed to reach this confidence level.

**When low volumes prevent reaching significance:**

| Volume situation | Action |
|-----------------|--------|
| Test running 4+ weeks, approaching but not reaching 80% significance | Extend test period by 2 weeks |
| Test running 6+ weeks, still below 80% significance | Classify as "directional": deploy tentatively, continue monitoring |
| Test running 8+ weeks with very low data | End test. The format or campaign lacks sufficient volume for asset-level testing. Consolidate variants and optimize at a higher level (ad-level or campaign-level) |
| Consistently unable to reach significance | Re-evaluate testing scope: test bigger changes (format-level) rather than subtle asset variations |

> ↪️ **Data poverty solution:** The Iteration Loop addresses data poverty through aggregation across ad groups and asset groups. The same principle applies here: pool data across campaigns or ad groups when individual tests lack volume.

---

## Phase 6️⃣: Deploy winners and document learnings

### 6.1 Deploy winners

| Format | Winner deployment action |
|--------|--------------------------|
| Search RSAs | Promote winning asset, remove Silent Killers, maintain template consistency across cluster |
| PMax | Keep Strong-tier assets, replace Underperforming with next hypothesis variant |
| Demand Gen | Scale winning creative format, pause losing variants, test new variations of winner |
| Display | Replace weakest element with proven winner, test next element in priority order |
| Video | Scale winning video (increase budget/audience), produce variations of winning hook/format |

### 6.2 Update the learning log

For each hypothesis tested, record:

```
TEST ID: [FORMAT]-[DATE]-[NUMBER]
FORMAT: [Search RSA / PMax / Demand Gen / Display / Video]
TEST DATES: [Start] to [End]

HYPOTHESIS:
"If we [CHANGE], then [KPI] will [DIRECTION] because [REASON]".

RESULT:
[Data table: variant, impressions, conversions, primary KPI]

VERDICT:
[CONFIRMED / REJECTED / INCONCLUSIVE]

LEARNINGS:
- [What worked and why]
- [What failed and why]
- [Cross-format implications]

ACTIONS:
- [PROMOTE / KEEP TESTING / REMOVE / DEFER]

NEXT HYPOTHESIS:
[What this result tells you to test next]
```

### 6.3 Extract cross-format patterns

After documenting individual results, look for patterns across formats:

| Pattern to look for | Example | Action |
|--------------------|---------|--------|
| Angle wins across multiple formats | "Social proof" headlines win in RSAs AND PMax | Double down on social proof across all formats |
| Format-specific preferences | UGC video wins in Demand Gen but polished wins in Display | Tailor creative style to format |
| Audience-creative alignment | Risk Removal messaging wins for cold audiences, CTA messaging wins for warm | Segment creative by audience temperature |

---

## Phase 7️⃣: Schedule next cycle

### 7.1 Set the next cycle date

| Current cycle outcome | Next cycle timing |
|----------------------|------------------|
| Clear winners deployed, losers replaced | 4 weeks from deployment (standard cadence) |
| Inconclusive results needing more data | 2 weeks extension, then re-analyze |
| Major winners found | 3 weeks (accelerate to test variations of winners) |
| No active tests remain | Immediately generate new hypotheses and start Phase 1 |

### 7.2 Refresh the hypothesis backlog

1. Add "next hypothesis" entries from this cycle's learning log
2. Add new hypotheses from customer research, competitor monitoring, and sales feedback
3. Prioritize by expected impact and available data volume
4. Remove hypotheses that were tested and conclusively resolved

### 7.3 Monthly creative refresh checklist

At the end of each monthly cycle, verify:

- [ ] All tested losers have been replaced (no underperformers lingering)
- [ ] New variants are deployed for the next test period
- [ ] Demand Gen creative has been refreshed within the last 60 days (prevents ad fatigue)
- [ ] Video ads have been reviewed for view rate degradation
- [ ] PMax auto-generated assets have been checked and disabled where appropriate
- [ ] Learning log is up to date with all cycle findings
- [ ] Hypothesis backlog has 3+ hypotheses ready for the next cycle

---

## Validation & definition of done

This SOP is complete when:

- [ ] Hypotheses defined for all active formats (Phase 1)
- [ ] Variants created and deployed per format-specific rules (Phase 2)
- [ ] Clean baselines recorded before test launch (Phase 3)
- [ ] Test period completed without contamination (Phase 4)
- [ ] Results analyzed with statistical significance check (Phase 5)
- [ ] Winners deployed, losers replaced, learning log updated (Phase 6)
- [ ] Next cycle scheduled and hypothesis backlog refreshed (Phase 7)

---

## Exit → entry bridge

| Next step | When |
|-----------|------|
| Run this SOP again | Next scheduled cycle (3-4 weeks) |
| Deep-dive into RSA testing | Iteration Loop needs more cycles within a cluster |
| Deep-dive into PMax assets | Asset group needs structural changes (splitting) |
| Demand Gen creative refresh | Creative fatigue detected (CTR declining 2+ weeks) |

**If issues require format-specific execution:**

| Issue | Route to |
|-------|----------|
| RSA testing methodology | [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md) |
| PMax asset replacement | Phase 2.2 of this SOP + [SOP – Run PMax Ecommerce Optimization Cycle](../sops/SOP – Run PMax Ecommerce Optimization Cycle.md) or [SOP – Run PMax Lead Gen-SaaS Optimization Cycle](../sops/SOP – Run PMax Lead Gen-SaaS Optimization Cycle.md) Phase 4 |
| Demand Gen optimization | [SOP – Run Demand Gen Optimization Cycle](../sops/SOP – Run Demand Gen Optimization Cycle.md) |
| Display and Video optimization | [SOP – Run Display & Video Campaign Optimization Cycle](../sops/SOP – Run Display & Video Campaign Optimization Cycle.md) |
| Headline angle ideas | [Headline Angle Catalog](../catalogs/Headline Angle Catalog.md) |
| Experiment design questions | [Testing and Experimentation Mental Model](../mental-models/Testing and Experimentation Mental Model.md) |

---

## Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Testing randomly without hypotheses | No structured approach to idea generation | Use hypothesis format, draw from customer research and prior results |
| Ignoring Ad Strength | Over-indexing on the score | Ad Strength is a completeness checklist, not a performance signal |
| Changing other variables during tests | Urgency to optimize everything at once | Freeze all non-test variables for the duration |
| Not documenting learnings | Rush to deploy winners | Complete the learning log before starting the next cycle |
| Same-angle replacements | Defaulting to similar phrasing | Deliberately choose a different angle type or sub-angle for each replacement |
| Testing across formats without coordination | Each format runs on its own schedule | Use this SOP to synchronize cycle timing |
| Skipping the statistical check | Declaring winners based on small differences | Verify minimum conversion thresholds before acting |
| Never refreshing Demand Gen creative | Assuming evergreen creative | Refresh every 60 days to prevent ad fatigue |
| Over-testing video | Too many variants with low conversion volume | Limit to 1-2 video hypotheses per cycle, extend timelines |

---

## Related documents

| Document | Relationship |
|----------|--------------|
| [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md) | Execution: Search RSA testing methodology |
| [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md) | Foundation: Iteration Loop methodology applied across all formats |
| [Testing and Experimentation Mental Model](../mental-models/Testing and Experimentation Mental Model.md) | Foundation: experiment design and statistical significance |
| [Headline Angle Catalog](../catalogs/Headline Angle Catalog.md) | Reference: headline angle ideas for new variants |
| [Demand Gen Performance Reference](../references/Demand Gen Performance Reference.md) | Reference: Demand Gen benchmarks and creative format data |
| [SOP – Run Demand Gen Optimization Cycle](../sops/SOP – Run Demand Gen Optimization Cycle.md) | Parallel: Demand Gen optimization process |
| [SOP – Run Display & Video Campaign Optimization Cycle](../sops/SOP – Run Display & Video Campaign Optimization Cycle.md) | Parallel: Display and Video optimization process |
| [Description Expansion Catalog](../catalogs/Description Expansion Catalog.md) | Reference: description patterns for new variants |

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