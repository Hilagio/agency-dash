# SOP – Monitor Landing Page Performance
Created: 2026-02-14

SOP_ID: SOP_89
Status: Done
Category: Landing Pages
Primary Outcome: Landing page performance tracked, underperforming pages identified, optimization or testing actions routed
Agent_Executable: No
Human_Approval_Required: No
Domain: Landing Pages
Pillar: 2

## Purpose

This SOP establishes a recurring review process for landing page performance across your Google Ads account. It identifies underperforming pages, diagnoses the likely cause, and routes each issue to the correct optimization or testing workflow.

> ❓ **The big question:** Which landing pages are costing you conversions, and what should you do about them?

Landing pages degrade over time. Competitors improve their pages, audience expectations shift, and seasonal patterns change conversion behavior. Without systematic monitoring, underperforming pages silently drain budget for weeks or months before anyone notices.

---

## What this SOP is NOT

This SOP does **not:**

- Build new landing pages (See: [SOP – Build a High-Converting Landing Page](../sops/SOP – Build a High-Converting Landing Page.md))
- Execute the actual optimization fixes (See: [SOP – Audit and Optimize an Existing Landing Page](../sops/SOP – Audit and Optimize an Existing Landing Page.md))
- Repair Quality Score landing page experience issues (See: [SOP – Improve Landing Page Experience](../sops/SOP – Improve Landing Page Experience.md))
- Validate LP structure or checklist items (See: [LP Quality Checklist](../checklists/LP Quality Checklist.md))

**Key distinction:** This SOP is a recurring monitoring and triage process. It identifies problems and routes them. Other SOPs execute the fixes.

## When to run this SOP

| Page traffic level | Review cadence | Rationale |
|--------------------|----------------|-----------|
| High-traffic pages (500+ sessions/week) | Bi-weekly | Enough data to detect meaningful shifts quickly |
| Standard pages (100-500 sessions/week) | Monthly | Need 2-4 weeks of data for reliable trends |
| Low-traffic pages (<100 sessions/week) | Quarterly | Insufficient weekly data for signal |

> ⚠️ **Do not skip low-traffic pages entirely:** Low traffic does not mean low importance. These pages may serve high-intent keywords with strong CPA potential. Review them less frequently, but still review them.

---

## Before you start

### Required inputs

- Access to Google Ads account (Landing Pages report)
- Access to GA4 or equivalent analytics platform
- Access to Google PageSpeed Insights or Lighthouse
- Documented target KPIs (CVR, CPA, ROAS) per campaign or landing page
- Previous review notes (if this is not the first run)

### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [LP Quality Checklist](../checklists/LP Quality Checklist.md) | Quick structural checks when diagnosing issues |
| [SOP – Improve Landing Page Experience](../sops/SOP – Improve Landing Page Experience.md) | Route for Quality Score LP Experience issues |
| [SOP – Audit and Optimize an Existing Landing Page](../sops/SOP – Audit and Optimize an Existing Landing Page.md) | Route for full LP optimization |

### Time allocation

| Phase | Time |
|-------|------|
| Pull LP performance data | 10 min |
| Analyze page-level metrics | 15 min |
| Segment by traffic source and campaign | 10 min |
| Diagnose underperformers | 15 min |
| Route actions | 5 min |
| Document and schedule follow-up | 5 min |
| **Total** | **60 min** |

---

## Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Pull LP performance data** | Collect all LP metrics in one view | Performance snapshot per page |
| **Phase 2️⃣: Analyze page-level metrics** | Evaluate CVR, speed, and bounce against thresholds | Flagged pages with metric breaches |
| **Phase 3️⃣: Segment by traffic source and campaign** | Determine if issues are page-wide or source-specific | Segmented issue list |
| **Phase 4️⃣: Diagnose underperformers** | Identify the root cause for each flagged page | Diagnosis per page |
| **Phase 5️⃣: Route actions** | Assign each issue to the correct workflow | Action routing log |
| **Phase 6️⃣: Document and schedule follow-up** | Record findings and set next review date | Review report |

---

## Phase 1️⃣: Pull LP performance data

### 1.1 Pull the Landing Pages report

1. Open Google Ads
2. Navigate to Campaigns > Insights & Reports > Landing Pages
3. Set date range to the review period (14 days for bi-weekly, 30 days for monthly, 90 days for quarterly)
4. Add columns if not already present: Clicks, Impressions, CTR, Conversions, Conv. Rate, Cost, CPA, Conv. Value, ROAS, Mobile Speed Score

### 1.2 Pull analytics data

Open GA4 (or your analytics platform) and pull the following for each landing page:

| Metric | Source | Why it matters |
|--------|--------|----------------|
| Bounce rate | GA4 | High bounce signals poor message match or slow load |
| Avg. session duration | GA4 | Low duration signals visitors don't engage |
| Scroll depth (if tracked) | GA4 | Low scroll means above-the-fold content fails to hook |
| Device breakdown (mobile vs desktop CVR) | GA4 | Mobile-specific issues are invisible in aggregate data |

### 1.3 Run page speed checks

For each active landing page (or at minimum the top 10 by spend):

1. Open [PageSpeed Insights](https://pagespeed.web.dev/)
2. Enter the landing page URL
3. Record both mobile and desktop performance scores
4. Record Core Web Vitals: LCP, INP, CLS

### 1.4 Compile the performance snapshot

Create or update your tracking sheet with one row per landing page:

| Landing page URL | Sessions | Conversions | CVR | Conv. Value | ROAS | Bounce rate | Avg. duration | CPA | Mobile speed | Desktop speed | LCP (mobile) |
|------------------|----------|-------------|-----|-------------|------|-------------|---------------|-----|--------------|---------------|--------------|
| /offer-a | | | | | | | | | | | |
| /offer-b | | | | | | | | | | | |

---

## Phase 2️⃣: Analyze page-level metrics

### 2.1 Apply threshold checks

Flag any page that breaches one or more of these thresholds:

| Metric | Threshold trigger | Severity |
|--------|-------------------|----------|
| CVR | Below 50% of account-wide average CVR for that campaign type | High |
| ROAS | Below 50% of campaign target ROAS (for value-based campaigns) | High |
| CPA | Above 2x campaign target CPA (for CPA-based campaigns) | High |
| CVR | Declining for 3+ consecutive review periods | High |
| Bounce rate | Above 70% for Lead Gen/SaaS, above 50% for dedicated LP (non-homepage) | Medium |
| Mobile PageSpeed score | Below 50 | Medium |
| Desktop PageSpeed score | Below 70 | Low |
| LCP (mobile) | Above 4 seconds | Medium |
| CLS | Above 0.25 | Low |
| Mobile CVR vs desktop CVR | Mobile CVR less than 40% of desktop CVR | High |
| Avg. session duration | Below 15 seconds | Medium |

> 💡 **Use your own baselines:** The thresholds above are starting points. After 2-3 review cycles, replace them with thresholds based on your own account averages. A page converting at 2% might be fine in one vertical and terrible in another.

### 2.2 Categorize flagged pages

For each flagged page, assign a category:

| Category | Criteria | Example |
|----------|----------|---------|
| **CVR/ROAS problem** | CVR or ROAS below threshold or declining trend | Page converts at 1.2% vs. account average of 3.5%, or ROAS 1.5 vs. target 4.0 |
| **Speed problem** | Mobile or desktop speed below threshold | Mobile PageSpeed score 32 |
| **Engagement problem** | High bounce, low duration, low scroll | 78% bounce rate, 8 seconds avg. duration |
| **Mobile problem** | Mobile CVR significantly below desktop | Desktop CVR 4.1%, mobile CVR 0.9% |
| **Multiple problems** | Two or more categories flagged | Low CVR + slow mobile + high bounce |

---

## Phase 3️⃣: Segment by traffic source and campaign

### 3.1 Segment each flagged page

A landing page might perform well for one traffic source and poorly for another. Before diagnosing, segment:

1. In Google Ads, filter the Landing Pages report by campaign
2. In GA4, segment landing page performance by source/medium

### 3.2 Check campaign-level segmentation

| Landing page | Campaign A CVR | Campaign A ROAS | Campaign B CVR | Campaign B ROAS | Overall CVR | Overall ROAS |
|-------------|----------------|-----------------|----------------|-----------------|-------------|--------------|
| /offer-a | | | | | | |

Look for:

- **One campaign dragging down the average:** The page is fine, but one campaign sends mismatched traffic
- **All campaigns underperforming:** The page itself is the issue
- **New campaigns underperforming:** Message match problem with new ad copy

### 3.3 Check keyword-level final URL mapping

For Search campaigns, verify that keywords route to the correct landing pages:

1. Open the Keywords report
2. Add the "Final URL" column
3. Sort by spend (highest first)
4. Check: does each keyword's final URL match the searcher's intent?

| Keyword | Final URL | Intent match? | Issue |
|---------|-----------|---------------|-------|
| "emergency plumber [city]" | /services | No | Generic page, not emergency-specific |
| "crm free trial" | /pricing | No | Pricing page, not trial signup |
| "running shoes women" | /running-shoes | Partial | Category page, not filtered for women |

> ⚠️ **Wrong-page routing is invisible in aggregate data:** A landing page with "acceptable" CVR might actually contain a mix of high-converting correct traffic and zero-converting misrouted traffic. Keyword-level analysis exposes this.

---

## Phase 4️⃣: Diagnose underperformers

### 4.1 Diagnosis framework

For each flagged page, work through the diagnosis tree:

**If CVR is low:**

| Check | Finding | Likely cause |
|-------|---------|-------------|
| Is bounce rate high? | Yes | Message match failure or slow load: visitors leave immediately |
| Is bounce rate normal but CVR still low? | Yes | Page engages but fails to convert: CTA, offer, or trust issue |
| Is the problem mobile-only? | Yes | Mobile UX issue: tap targets, form usability, responsive layout |
| Is the problem one campaign only? | Yes | Traffic mismatch: wrong audience or wrong ad message for this page |
| Is CVR declining over time? | Yes | Competitor improvement, audience fatigue, or seasonal shift |

**If speed is the problem:**

| Check | Finding | Likely cause |
|-------|---------|-------------|
| LCP above 4s? | Yes | Hero image too large, slow server response, or render-blocking resources |
| CLS above 0.25? | Yes | Images without dimensions, late-loading ad/widget scripts, dynamic content shifts |
| Mobile score much lower than desktop? | Yes | Unoptimized images for mobile, excessive JavaScript |

**If engagement is low (high bounce, low duration):**

| Check | Finding | Likely cause |
|-------|---------|-------------|
| Does the headline match the ad? | No | Message match failure |
| Does the page load in under 3 seconds? | No | Speed-driven abandonment |
| Is the value proposition clear within 5 seconds? | No | Hero section fails the 5-second test |
| Is there a clear next step above the fold? | No | Missing or buried CTA |

### 4.2 Record diagnosis per page

| Landing page | Category | Root cause | Confidence | Evidence |
|-------------|----------|-----------|------------|----------|
| /offer-a | CVR problem | Message match: headline doesn't reflect top keywords | High | 73% bounce rate, keyword "free trial" but no trial mention on page |
| /offer-b | Speed problem | Uncompressed hero image (4.2 MB) | High | Mobile LCP 6.1s, PageSpeed 28 |
| /offer-c | Mobile problem | Form fields too small on mobile, no mobile-optimized CTA | Medium | Desktop CVR 4.2%, mobile CVR 0.8% |

---

## Phase 5️⃣: Route actions

### 5.1 Route each diagnosed issue

Based on the diagnosis, route to the correct workflow:

| Diagnosis | Action | Route to |
|-----------|--------|----------|
| **Message match failure** | Align LP headline with top keywords/ad copy, or implement DTR | [SOP – Improve Landing Page Experience](../sops/SOP – Improve Landing Page Experience.md) (Section 2.1) |
| **Hero/offer/CTA weakness** | Full LP audit and optimization | [SOP – Audit and Optimize an Existing Landing Page](../sops/SOP – Audit and Optimize an Existing Landing Page.md) |
| **Page speed below threshold** | Technical speed optimization | [SOP – Improve Landing Page Experience](../sops/SOP – Improve Landing Page Experience.md) (Section 2.6) |
| **Mobile UX issues** | Mobile-specific fixes | [SOP – Improve Landing Page Experience](../sops/SOP – Improve Landing Page Experience.md) (Section 2.6) |
| **Wrong keyword-to-page mapping** | Reassign final URLs at keyword level | Update keyword final URLs in Google Ads or Google Ads Editor |
| **Traffic source mismatch** | Review ad copy or audience targeting for the underperforming campaign | Campaign-level ad review |
| **Conversion fatigue (declining trend, no obvious cause)** | Run an A/B test with a new variant | [SOP – Run a Landing Page A&B Test](../sops/SOP – Run a Landing Page A&B Test.md) |
| **Page needs full rebuild** | LP is fundamentally broken (multiple severe issues) | [SOP – Build a High-Converting Landing Page](../sops/SOP – Build a High-Converting Landing Page.md) |

### 5.2 Prioritize actions

| Priority | Criteria | Action timeline |
|----------|----------|-----------------|
| P1: Critical | High-traffic page with CVR below 50% of benchmark, or page speed below 30 | Fix within 1 week |
| P2: High | Any threshold breach on a page receiving significant spend | Fix within 2 weeks |
| P3: Standard | Minor threshold breaches, low-traffic pages, engagement-only issues | Schedule for next optimization cycle |
| P4: Monitor | Page close to threshold but not breaching, or recently fixed (still validating) | Review again next cycle |

### 5.3 Build the action log

| # | Landing page | Diagnosis | Priority | Action | Route to | Owner | Due date |
|---|-------------|-----------|----------|--------|----------|-------|----------|
| 1 | | | | | | | |
| 2 | | | | | | | |
| 3 | | | | | | | |

---

## Phase 6️⃣: Document and schedule follow-up

### 6.1 Record the review

Use this template:

```
LP Performance Review
=====================
Account: [Name]
Period: [Start date] - [End date]
Reviewer: [Name]
Review type: Bi-weekly / Monthly / Quarterly

SUMMARY
-------
Total active landing pages: [#]
Pages flagged: [#]
Pages within thresholds: [#]

FLAGGED PAGES
-------------
1. [URL] - [Category] - [Diagnosis] - [Priority] - [Action]
2. [URL] - [Category] - [Diagnosis] - [Priority] - [Action]

KEYWORD ROUTING ISSUES
----------------------
[Any final URL mismatches found]

ACTIONS FROM PREVIOUS REVIEW
-----------------------------
1. [Action] - [Status: Done / In progress / Blocked]

SPEED SCORES
------------
[Any pages with mobile score changes >10 points]

NEXT REVIEW DATE
----------------
[Date]
```

### 6.2 Track trends across reviews

Maintain a running log to spot multi-period trends:

| Landing page | Review 1 CVR | Review 2 CVR | Review 3 CVR | Trend |
|-------------|-------------|-------------|-------------|-------|
| /offer-a | 3.2% | 2.8% | 2.1% | Declining |
| /offer-b | 1.5% | 2.3% | 2.9% | Improving |

> 💡 **Three-review trends are more reliable than single-period snapshots:** A page that declines for three consecutive reviews has a real problem. A single-period dip is often noise.

### 6.3 Schedule next review

Set a calendar reminder for the next review based on your cadence. Carry forward any P4 (monitor) items for re-evaluation.

---

## Validation & definition of done

This SOP is complete when:

- [ ] Performance data pulled for all active landing pages
- [ ] Page-level metrics checked against thresholds
- [ ] Traffic segmented by source/campaign for flagged pages
- [ ] Keyword-level final URL mapping verified (Search campaigns)
- [ ] Each underperforming page diagnosed with root cause
- [ ] Actions routed to the correct SOP or workflow
- [ ] Action log created with priorities, owners, and due dates
- [ ] Review documented and next review date scheduled
- [ ] Previous review actions checked for completion

---

## Exit → entry bridge

After completing this review:

| Outcome | Next step |
|---------|-----------|
| Pages flagged with CVR or engagement issues | Route to [SOP – Audit and Optimize an Existing Landing Page](../sops/SOP – Audit and Optimize an Existing Landing Page.md) |
| Pages flagged with speed or mobile issues | Route to [SOP – Improve Landing Page Experience](../sops/SOP – Improve Landing Page Experience.md) |
| Pages declining with no obvious cause | Route to [SOP – Run a Landing Page A&B Test](../sops/SOP – Run a Landing Page A&B Test.md) |
| Keyword-to-page mismatches found | Fix final URLs in Google Ads Editor, then re-monitor next cycle |
| All pages within thresholds | No action needed: schedule next review |

**Recurring schedule:**

| Cadence | Scope |
|---------|-------|
| Bi-weekly | High-traffic pages only (500+ sessions/week) |
| Monthly | All active landing pages |
| Quarterly | Full review including low-traffic pages, speed re-tests, and trend analysis |

---

## Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Only checking aggregate CVR | Misses source-specific and keyword-level routing issues | Always segment by campaign and check keyword final URLs |
| Ignoring mobile performance | Mobile data is buried in aggregate numbers | Check mobile vs desktop CVR split for every flagged page |
| No baseline thresholds | Without benchmarks, every page looks "fine" | Set thresholds after your first review cycle using account averages |
| Reacting to single-period dips | Normal variance in small data sets | Wait for 2-3 consecutive reviews showing the same pattern |
| Skipping speed checks | "It loads fast for me" is not a valid test | Use PageSpeed Insights every review cycle, especially mobile |
| No follow-through on actions | Issues identified but never fixed | Track action completion at the start of every review |
| Monitoring without acting | Reviews become administrative busywork | Every review must produce at least one actionable output |

---

## Quick reference: support library

| Document | Type | Used in |
|----------|------|---------|
| [LP Quality Checklist](../checklists/LP Quality Checklist.md) | Checklist | Phase 4 (diagnosis) |
| [SOP – Improve Landing Page Experience](../sops/SOP – Improve Landing Page Experience.md) | SOP | Phase 5 (routing for speed/mobile/message match) |
| [SOP – Audit and Optimize an Existing Landing Page](../sops/SOP – Audit and Optimize an Existing Landing Page.md) | SOP | Phase 5 (routing for full LP optimization) |
| [SOP – Run a Landing Page A&B Test](../sops/SOP – Run a Landing Page A&B Test.md) | SOP | Phase 5 (routing for test-based optimization) |
| [Landing Page Quality Score Mental Model](../mental-models/Landing Page Quality Score Mental Model.md) | Mental Model | Understanding how LP performance affects Quality Score |

---

## Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Improve Landing Page Experience](../sops/SOP – Improve Landing Page Experience.md) | Downstream: fix Quality Score LP Experience issues |
| [SOP – Audit and Optimize an Existing Landing Page](../sops/SOP – Audit and Optimize an Existing Landing Page.md) | Downstream: full audit and optimization |
| [SOP – Build a High-Converting Landing Page](../sops/SOP – Build a High-Converting Landing Page.md) | Downstream: rebuild when page is beyond repair |
| [SOP – Run a Landing Page A&B Test](../sops/SOP – Run a Landing Page A&B Test.md) | Downstream: test-based optimization for declining pages |
| [SOP – Run a Weekly Performance Review](../sops/SOP – Run a Weekly Performance Review.md) | Parallel: account-level review may surface LP issues |

---

## Version details

- **Version:** 3.0
- **Last Updated:** March 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
