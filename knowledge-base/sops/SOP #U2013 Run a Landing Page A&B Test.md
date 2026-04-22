# SOP – Run a Landing Page A/B Test
Created: 2026-02-14

SOP_ID: SOP_90
Status: Done
Category: Landing Pages
Primary Outcome: Landing page A/B test executed, statistically significant winner identified, winning variant deployed
Agent_Executable: No
Human_Approval_Required: Yes
Domain: Landing Pages
Pillar: 2

### Purpose

This SOP walks you through selecting a test candidate, forming a hypothesis, running a controlled landing page A/B test, analyzing results, and deploying the winning variant.

> ❓ **The big question:** Which version of this landing page converts more visitors into customers, and how do I prove it with confidence?

Landing page optimization without testing is guesswork. This SOP turns landing page improvement into a repeatable, evidence-based process.

---

### What this SOP is NOT

This SOP does **not:**

- Fix foundational landing page issues (See: [SOP – Improve Landing Page Experience](../sops/SOP – Improve Landing Page Experience.md))
- Build a new landing page from scratch (See: [SOP – Build a High-Converting Landing Page](../sops/SOP – Build a High-Converting Landing Page.md))
- Run campaign-level experiments in Google Ads (See: [SOP – Run a Campaign Experiment](../sops/SOP – Run a Campaign Experiment.md))
- Explain testing theory and decision frameworks (See: [Testing and Experimentation Mental Model](../mental-models/Testing and Experimentation Mental Model.md))
- Detail Google Ads experiment configuration options (See: [Experiment Configuration Reference](../references/Experiment Configuration Reference.md))

**Key distinction:**

This SOP is for **ongoing conversion rate optimization** on landing pages that already meet baseline quality standards. Fix foundational issues first with [SOP – Improve Landing Page Experience](../sops/SOP – Improve Landing Page Experience.md) before running tests.

### When to run this SOP

| Trigger | Condition |
|---------|-----------|
| Scheduled cadence | Quarterly per high-traffic landing page |
| Performance plateau | CVR has been flat for 30+ days despite stable traffic quality |
| Post-repair validation | After fixing foundational LP issues, test further improvements |
| Pre-scale preparation | Before increasing budget on a campaign, optimize its LP first |

**Frequency:** One active A/B test per high-traffic landing page at a time. Rotate quarterly.

---

### Before you start

#### Required inputs

- Landing page that passes baseline quality (LP Experience = Average or Above Average)
- Minimum 1,000 monthly visitors to the test page (more is better)
- Current conversion rate data by landing page (minimum 30 days)
- Access to landing page builder or development resources to create variants
- Analytics tool with conversion tracking (GA4 or equivalent)

#### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Testing and Experimentation Mental Model](../mental-models/Testing and Experimentation Mental Model.md) | Deciding what to test and when |
| [Experiment Configuration Reference](../references/Experiment Configuration Reference.md) | Split test settings and statistical requirements |
| [SOP – Improve Landing Page Experience](../sops/SOP – Improve Landing Page Experience.md) | Baseline LP quality checks |
| [SOP – Run a Campaign Experiment](../sops/SOP – Run a Campaign Experiment.md) | Campaign-level experiment setup (if using Google Ads experiments) |

---

### Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Select test candidate** | Identify the highest-impact page to test | Selected landing page with baseline metrics |
| **Phase 2️⃣: Form hypothesis and design variant** | Define what to change and why | Documented hypothesis + variant design |
| **Phase 3️⃣: Set up test infrastructure** | Configure the split test | Live A/B test with correct traffic allocation |
| **Phase 4️⃣: Monitor test during runtime** | Watch for issues without interfering | Running test with no contamination |
| **Phase 5️⃣: Analyze results and declare winner** | Evaluate data and reach a conclusion | Statistically valid winner or documented inconclusive result |
| **Phase 6️⃣: Deploy winner and document learnings** | Roll out the winning variant and capture knowledge | Winner live, learnings recorded |

---

## Phase 1️⃣: Select test candidate

### 1.1 Identify high-impact pages

Pull your landing page performance data from Google Ads (Campaigns > Insights & Reports > Landing Pages) and sort by traffic volume.

Focus on pages that meet both criteria:

- **High traffic:** Top pages by click volume (more traffic = faster test results)
- **Below-benchmark CVR:** Conversion rate below your account average or industry benchmark

| Priority | Page profile | Why test here |
|----------|-------------|---------------|
| 1 | High traffic + below-benchmark CVR | Largest improvement potential, fastest statistical significance |
| 2 | High traffic + average CVR | Good volume for fast results, incremental gains compound |
| 3 | Medium traffic + below-benchmark CVR | Meaningful improvement potential, longer test duration needed |
| 4 | Low traffic + any CVR | Too slow to reach significance, skip until traffic grows |

### 1.2 Record baseline metrics

Document the current state for your selected page:

| Metric | Current value | Source | Date range |
|--------|--------------|--------|------------|
| Monthly visitors (clicks) | ___ | Google Ads | Last 30 days |
| Conversion rate | ___% | Google Ads | Last 30 days |
| Bounce rate | ___% | GA4 | Last 30 days |
| Avg. time on page | ___ | GA4 | Last 30 days |
| Primary CPA | $/___ | Google Ads | Last 30 days |
| Monthly conversions | ___ | Google Ads | Last 30 days |

### 1.3 Confirm test readiness

Before proceeding, verify:

- [ ] Landing Page Experience = Average or Above Average
- [ ] Page receives 1,000+ monthly visitors
- [ ] Page generates 30+ monthly conversions (minimum for meaningful results)
- [ ] No other active tests running on this page
- [ ] Conversion tracking is accurate and verified
- [ ] No major campaigns changes planned during test period

> ⚠️ **Volume gate:** If a page generates fewer than 30 conversions per month, A/B testing will take too long to produce reliable results. Focus testing efforts on higher-volume pages and make best-judgment changes on low-volume pages instead.

---

## Phase 2️⃣: Form hypothesis and design variant

### 2.1 Select the test element

Choose one element to test. Test the highest-impact elements first:

| Priority | Element | Typical impact | Example change |
|----------|---------|---------------|----------------|
| 1 | Headline / offer | High | "Free Quote in 60 Seconds" vs. "Save 30% on Your First Project" |
| 2 | Above-the-fold layout | High | Hero image + form vs. video + CTA button |
| 3 | Form design (fields, steps, friction) | Medium-High | Multi-step form vs. single-step form, fewer fields |
| 4 | CTA button (copy, size, placement) | Medium-High | "Get Started Free" vs. "Request a Quote", above-fold vs. below |
| 5 | Social proof type and placement | Medium | Testimonials vs. client logos vs. review scores |
| 6 | Hero section format | Medium | Static image vs. video vs. illustration |
| 7 | Value proposition framing | Medium | Features-first vs. benefits-first vs. outcomes-first |
| 8 | Trust signals | Medium | Guarantees, certifications, security badges, partner logos |
| 9 | Section order / page flow | Medium | Reorder content blocks to match user intent progression |
| 10 | Navigation presence | Medium | Full nav bar vs. minimal nav vs. no nav |

> 💡 **Start at the top:** Headline and offer changes typically produce 2-5x the lift of lower-priority elements. Work your way down the priority list across quarterly test cycles.

> 💡 **This list is not exhaustive.** It provides starting priorities. For the full range of testable elements, see: [LP Quality Checklist](../checklists/LP Quality Checklist.md), [LP Hierarchy Mental Model](../mental-models/LP Hierarchy Mental Model.md), [LP Headline Catalog](../catalogs/LP Headline Catalog.md), [LP CTA Catalog](../catalogs/LP CTA Catalog.md), [LP Section Catalog](../catalogs/LP Section Catalog.md), [SOP – Build a High-Converting Landing Page](../sops/SOP – Build a High-Converting Landing Page.md), and [SOP – Audit and Optimize an Existing Landing Page](../sops/SOP – Audit and Optimize an Existing Landing Page.md).

### 2.2 Write the hypothesis

Document a specific, testable hypothesis:

**Template:**
```
If we [change X element] from [current state] to [new state],
then [primary metric] will [improve/increase] by [estimated %]
because [rationale based on data or user behavior observation].
```

**Example:**
```
If we change the hero headline from "Professional Roofing Services"
to "Licensed Roofers in [City] - Free Quote in 60 Seconds",
then conversion rate will increase by 15-25%
because the current headline lacks specificity and a clear value proposition,
and our bounce rate data shows 72% of visitors leave without scrolling.
```

### 2.3 Define success criteria

| Element | Definition |
|---------|------------|
| Primary metric | Conversion rate (CVR) |
| Success threshold | Minimum 10% relative improvement (e.g., 3.0% to 3.3%) |
| Guardrail metric 1 | Bounce rate (should not increase by more than 5%) |
| Guardrail metric 2 | Average time on page (should not decrease significantly) |
| Confidence level | 95% (standard) |

### 2.4 Design the variant

Build one variant (Version B) that changes only the element being tested.

**Design rules:**

| Rule | Why |
|------|-----|
| Change only one element | Isolating the variable lets you attribute the result to that specific change |
| Make the change meaningful | Small tweaks (button color, font size) rarely produce measurable lift |
| Keep everything else identical | Same layout, same images (unless testing visuals), same form fields |
| Test on the same URL structure | Avoid introducing URL differences that could affect tracking |

> ⚠️ **One variable only:** If you change the headline AND the CTA AND the layout, you learn nothing about which change caused the result. Test one element per cycle.

---

## Phase 3️⃣: Set up test infrastructure

### 3.1 Choose your testing method

| Method | Best for | Setup |
|--------|----------|-------|
| **Landing page builder A/B test** (Unbounce, Instapage, Leadpages, VWO) | Dedicated landing pages | Built-in split testing, easiest setup |
| **Google Optimize successor / third-party tool** (VWO, Optimizely, Convert) | Website pages you control | JavaScript-based overlay, no new URL needed |
| **Google Ads Ad Variations** | Campaign-level URL split | 50/50 Final URL split, compare CVR, CPA, ROAS, AOV |
| **Manual URL split** | When no tools are available | Two URLs, traffic split via campaign settings or ad rotation |

**Recommended:** Use your landing page builder's built-in A/B test if available. It handles traffic splitting, statistical calculations, and variant serving automatically.

### 3.2 Configure the test

| Setting | Value | Rationale |
|---------|-------|-----------|
| Traffic split | 50/50 | Fastest path to statistical significance |
| Minimum duration | 14 days | Captures weekly traffic patterns (2 full business cycles) |
| Minimum conversions per variant | 100+ | Required for reliable statistical significance at 95% confidence |
| Targeting | All traffic to this page | Segmented tests reduce sample size and delay results |

**Calculate estimated test duration:**

```
Conversions needed per variant: 100 (minimum for 95% confidence at 10% MDE)
Total conversions needed: 200

Monthly conversions on this page: ___
Daily conversion rate: Monthly ÷ 30 = ___

At 50/50 split, each variant gets: Daily ÷ 2 = ___ conversions/day
Days to reach 100 per variant: 100 ÷ (Daily ÷ 2) = ___ days

Minimum duration: MAX(calculated days, 14 days)
```

> 💡 **MDE = Minimum Detectable Effect:** With 100 conversions per variant, you can reliably detect a 15-20% relative lift at 95% confidence. For detecting smaller effects (10%), you need 300-500 conversions per variant.

### 3.3 Set up using Google Ads Ad Variations (if applicable)

If testing via Google Ads Ad Variations rather than a landing page tool:

1. Navigate to Campaigns > Experiments > Ad Variations
2. Select the campaigns to include in the test
3. Create an "Update URLs" variation pointing to your variant landing page
4. Configure 50/50 traffic split and set the schedule based on your duration calculation
5. Launch the variation and monitor in the Experiments dashboard

Ad Variations allow direct comparison of CVR, CPA, ROAS, and AOV between control and variant URLs across selected campaigns.

(See: [SOP – Run a Campaign Experiment](../sops/SOP – Run a Campaign Experiment.md) and [Experiment Configuration Reference](../references/Experiment Configuration Reference.md) for detailed setup steps)

### 3.4 Pre-launch validation

Before going live, verify:

- [ ] Variant page loads correctly on desktop and mobile
- [ ] Conversion tracking fires on both control and variant
- [ ] Form submissions or checkout flows work on both versions
- [ ] Page speed is comparable between control and variant
- [ ] Analytics tracking is configured for both URLs (if using separate URLs)
- [ ] No other tests are running on this page or campaign

---

## Phase 4️⃣: Monitor test during runtime

### 4.1 Set monitoring schedule

| Timeframe | What to check | Action |
|-----------|---------------|--------|
| Day 1 | Both variants receiving traffic | Verify 50/50 split is working |
| Day 2-3 | No technical issues (broken forms, tracking gaps) | Fix immediately if found, restart test clock |
| Weekly | Traffic distribution still balanced, no external disruptions | Document any anomalies |
| End date | Full results ready for analysis | Proceed to Phase 5 |

### 4.2 Hands-off rules during the test

| DO | DO NOT |
|----|--------|
| Monitor for technical failures | Peek at results and stop early because one "looks" better |
| Document external events that could affect results (promotions, seasonality, outages) | Change anything on either page during the test |
| Watch for catastrophic failure (variant CVR drops 50%+) | Adjust traffic split mid-test |
| Ensure traffic volume stays consistent | Run other tests on the same page simultaneously |

### 4.3 Early termination criteria

Only stop a test early if:

| Condition | Action |
|-----------|--------|
| Variant conversion rate drops 50%+ AND this holds for 7+ days | End test, keep control, investigate |
| Technical failure (broken tracking, page errors) | Pause, fix, restart with fresh data |
| External event invalidates test (site-wide outage, major promotion launched) | End, document, restart after conditions normalize |

> ⚠️ **Do not end early because one variant "looks" better:** Random variation creates streaks, especially in the first week. Commit to the full planned duration.

---

## Phase 5️⃣: Analyze results and declare winner

### 5.1 Wait for completion criteria

Before analyzing, confirm both conditions are met:

- [ ] Test ran for at least 14 days (two full weekly cycles)
- [ ] Each variant received at least 100 conversions (or your pre-calculated minimum)

If only one condition is met, extend the test until both are satisfied.

### 5.2 Record results

| Metric | Control (A) | Variant (B) | Difference | Stat. significant? |
|--------|------------|-------------|------------|---------------------|
| Visitors | ___ | ___ | — | — |
| Conversions | ___ | ___ | ___% | Yes / No |
| Conversion rate | ___% | ___% | ___% relative | Yes / No (p < 0.05) |
| Bounce rate | ___% | ___% | ___% | — |
| Avg. time on page | ___ | ___ | ___ | — |

### 5.3 Interpret results

| Result | Interpretation | Action |
|--------|---------------|--------|
| Variant wins on primary metric (95% confidence) | Variant is genuinely better | Deploy variant (Phase 6) |
| Control wins on primary metric (95% confidence) | Original page is better | Keep control, document why hypothesis was wrong |
| No statistical significance after full duration | Cannot distinguish between versions | Keep control (simpler), form new hypothesis |
| Variant wins on primary but fails guardrail metric | Improvement comes at a cost | Evaluate trade-off: is the CVR lift worth the guardrail decline? |

### 5.4 Segment analysis (optional, informative only)

If your testing tool supports segmentation, check whether results differ by:

| Segment | Why check |
|---------|-----------|
| Device (mobile vs. desktop) | Variant may win on one device but lose on another |
| Traffic source (branded vs. non-branded) | Different intent levels may respond differently |
| Day of week | B2B pages may show different patterns weekday vs. weekend |

> ⚠️ **Segment analysis is informative, not decisive:** Your primary decision is based on the overall result. Use segments to generate hypotheses for future tests, not to cherry-pick a winner.

---

## Phase 6️⃣: Deploy winner and document learnings

### 6.1 Deploy the winning variant

If the variant won:

1. Make the variant the new default page
2. Remove the A/B test split (all traffic goes to the winner)
3. Update any campaign final URLs if you used separate URLs
4. Verify conversion tracking still works on the now-permanent page

If the control won (or results were inconclusive):

1. Remove the variant
2. End the test
3. All traffic returns to the original page

### 6.2 Document learnings

Record the test outcome for your optimization knowledge base:

```
LANDING PAGE A/B TEST RESULTS
=============================
Page: [Landing page URL]
Test dates: [Start] to [End]
Element tested: [Headline / CTA / Layout / etc.]
Hypothesis: [What you expected and why]

Control (A): [Description of original]
Variant (B): [Description of change]

Results:
| Metric         | Control | Variant | Diff    | Significant? |
|----------------|---------|---------|---------|--------------|
| Conversion rate | ___% | ___% | ___% | Yes/No |
| Bounce rate     | ___% | ___% | ___% | — |
| Time on page    | ___  | ___  | ___  | — |

Winner: [A / B / Inconclusive]
Deployed: [Yes / No]

Key learning:
[What this test taught you about your audience, messaging, or page design]

Next test:
[What to test next based on what you learned]
```

### 6.3 Plan the next test

After documenting, identify the next test in the priority sequence:

| Current test element | Next test to consider |
|---------------------|----------------------|
| Headline / offer | Above-the-fold layout |
| Above-the-fold layout | Form / CTA |
| Form / CTA | Social proof |
| Social proof | Page speed optimizations |
| Completed full cycle | Return to headline / offer with new angle |

Queue the next test for the following quarter (or sooner if traffic volume allows faster test cycles).

---

### Validation / definition of done

This SOP is complete when:

- [ ] Test candidate selected based on traffic volume and CVR gap
- [ ] Hypothesis documented with expected outcome and rationale
- [ ] Test ran for minimum 14 days AND minimum conversions reached per variant
- [ ] Results analyzed with statistical significance evaluated
- [ ] Winner deployed OR control retained with documented reasoning
- [ ] Learnings recorded in optimization knowledge base
- [ ] Next test identified and queued

---

### Exit → entry bridge

After completing a landing page A/B test:

| Timeframe | Action |
|-----------|--------|
| Immediately | Deploy winner, remove test infrastructure |
| 7 days post-deploy | Monitor deployed winner for stable performance (no regression) |
| 14 days post-deploy | Confirm CVR lift holds in production with full traffic |
| Next quarter | Begin next test cycle on this page (next element in priority list) |

**Routing after completion:**

| Outcome | Next step |
|---------|-----------|
| Winner deployed, CVR improved | Queue next element test for this page, consider testing same element on other high-traffic pages |
| Control retained | Form new hypothesis based on learnings, test a different element or angle |
| Inconclusive | Increase traffic to the page or test a bolder change (larger expected effect size) |
| LP Experience dropped during test | Run [SOP – Improve Landing Page Experience](../sops/SOP – Improve Landing Page Experience.md) to restore baseline |

---

### Related documents

| Document | Type | Relationship |
|----------|------|-------------|
| [SOP – Monitor Landing Page Performance](../sops/SOP – Monitor Landing Page Performance.md) | SOP | Upstream: identifies pages needing optimization |
| [SOP – Improve Landing Page Experience](../sops/SOP – Improve Landing Page Experience.md) | SOP | Prerequisite: fixes baseline LP issues before testing |
| [Experiment Configuration Reference](../references/Experiment Configuration Reference.md) | Reference | Split test settings and statistical requirements |
| [SOP – Run a Campaign Experiment](../sops/SOP – Run a Campaign Experiment.md) | SOP | Parallel: campaign-level experiment setup method |
| [Testing and Experimentation Mental Model](../mental-models/Testing and Experimentation Mental Model.md) | Mental Model | Framework: when to test and how to evaluate results |

---

### Version details

- **Version:** 2.0
- **Last Updated:** March 2026
- **Creator:** Bob Meijer

---

### Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
