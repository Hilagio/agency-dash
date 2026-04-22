# SOP – Audit and Optimize an Existing Landing Page
Created: 2026-02-04
Updated: 2026-04-02

SOP_ID: SOP_19
Status: Done
Category: Creative
Agent_Executable: No
Human_Approval_Required: Yes
Primary Outcome: Identified conversion leaks on an existing LP with prioritized fixes applied and validated
Secondary Outcomes: Baseline metrics documented, optimization hypothesis log started, improved conversion rate
Domain: Landing Pages
Pillar: 2

## Purpose

This SOP walks you through auditing an existing landing page against the LP Hierarchy and Conversion Amplifier standards, identifying conversion leaks, and applying prioritized fixes.

> ❓ **The big question:** Why isn't this landing page converting at the rate it should, and what are the highest-impact fixes?

---

## What this SOP is NOT

This SOP does **not:**

- Build a new LP from scratch (See: [SOP – Build a High-Converting Landing Page](../sops/SOP – Build a High-Converting Landing Page.md))
- Explain LP structure theory (See: [LP Hierarchy Mental Model](../mental-models/LP Hierarchy Mental Model.md))
- Run A/B tests (See: *Testing Mental Model* [TBD, Phase 6])
- Fix conversion tracking issues (See: *Conversion Tracking SOPs* [TBD, Phase 2])

## When to run this SOP

Run this SOP when:

- An existing LP has a conversion rate below expectations
- Bounce rate is above 60% on a paid traffic LP
- CPA is above target despite good traffic quality indicators (CTR, QS)
- Before scaling spend on a campaign (audit the LP first)

---

## Before you start

### Required inputs

- Access to the live landing page
- Google Ads performance data (CVR, bounce rate, CPA, traffic volume)
- GA4 or analytics data (scroll depth, time on page, device breakdown)
- The ad copy/campaign that drives traffic to this LP

### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [LP Quality Checklist](../checklists/LP Quality Checklist.md) | Structured audit criteria |
| [LP Hierarchy Mental Model](../mental-models/LP Hierarchy Mental Model.md) | Section structure standard |
| [LP Headline Catalog](../catalogs/LP Headline Catalog.md) | Fix patterns for headlines |
| [LP CTA Catalog](../catalogs/LP CTA Catalog.md) | Fix patterns for CTAs |
| [LP Section Catalog](../catalogs/LP Section Catalog.md) | Fix patterns for sections |

---

## Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Baseline** | Document current performance | Performance snapshot |
| **Phase 2️⃣: Structural audit** | Check LP against hierarchy and checklist | Gap list with severity |
| **Phase 3️⃣: Diagnose** | Identify where visitors drop off | Prioritized issue list |
| **Phase 4️⃣: Fix** | Apply highest-impact changes | Updated LP |
| **Phase 5️⃣: Validate** | Confirm fixes improved performance | Before/after comparison |

---

## Phase 1️⃣: Baseline

### 1.1 Record current metrics

| Metric | Value | Source |
|--------|-------|--------|
| Monthly traffic (sessions) | | GA4 |
| Conversion rate | | Google Ads or GA4 |
| Bounce rate | | GA4 |
| Average time on page | | GA4 |
| Scroll depth (% reaching bottom) | | GA4 scroll tracking |
| CPA | | Google Ads |
| Mobile vs desktop CVR split | | GA4 |
| Primary traffic source ad copy | | Google Ads |

### 1.2 Screenshot the current page

Capture full-page screenshots of both mobile and desktop versions. These become the "before" reference.

---

## Phase 2️⃣: Structural audit

### 2.1 Run the LP Quality Checklist

Open the [LP Quality Checklist](../checklists/LP Quality Checklist.md) and evaluate every item. Record each failure.

### 2.2 Section-by-section assessment

For each of the 7 hierarchy sections, assess:

| Section | Present? | Quality (1-5) | Issues found |
|---------|----------|---------------|-------------|
| 1. Hero | | | |
| 2. Benefits | | | |
| 3. Trust/Authority | | | |
| 4. Social Proof | | | |
| 5. Objection Handling | | | |
| 6. Urgency/Scarcity | | | |
| 7. CTA (repeated) | | | |

### 2.3 Check one-page-one-goal

- [ ] Navigation removed or minimized
- [ ] No competing links leading away from conversion
- [ ] Footer stripped to legal requirements only
- [ ] No social media icons on the page

### 2.4 Check message match

Open the ad that drives traffic. Compare side by side:

- [ ] LP headline reflects ad headline language
- [ ] LP visuals match ad visuals (if Display/Video)
- [ ] Offer promised in ad matches offer on page
- [ ] Primary keyword appears in LP headline (for Search traffic)

---

## Phase 3️⃣: Diagnose

### 3.1 Identify drop-off points

| Symptom | Likely cause | Investigation |
|---------|-------------|---------------|
| High bounce rate (>60%) | Hero section fails the 5-second test | Check headline clarity, message match, load speed |
| Low scroll depth (<30% reach mid-page) | Benefits section doesn't hook | Check benefit framing (features vs outcomes?) |
| Scroll but no conversion | Objections unaddressed, CTA weak | Check objection handling, guarantee, CTA copy |
| Mobile CVR much lower than desktop | Mobile experience broken | Check mobile responsiveness, form usability, CTA tap targets |
| High form abandonment | Too many fields or unclear next step | Reduce fields, add progress indicator, clarify what happens after submission |

### 3.2 Prioritize issues

Rank all findings by impact and effort:

| Priority | Impact | Effort | Fix first |
|----------|--------|--------|-----------|
| **P1: Quick wins** | High impact | Low effort | Fix immediately |
| **P2: Strategic fixes** | High impact | High effort | Schedule next |
| **P3: Optimizations** | Low impact | Low effort | Batch with other changes |
| **P4: Defer** | Low impact | High effort | Only if all else is done |

### 3.3 Create prioritized fix list

| # | Issue | Section | Priority | Fix description | Catalog reference |
|---|-------|---------|----------|----------------|------------------|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |

---

## Phase 4️⃣: Fix

### 4.1 Apply P1 fixes first

For each P1 fix:

1. Reference the relevant catalog for patterns ([LP Headline Catalog](../catalogs/LP Headline Catalog.md), [LP CTA Catalog](../catalogs/LP CTA Catalog.md), [LP Section Catalog](../catalogs/LP Section Catalog.md))
2. Draft the replacement content
3. Implement the change
4. Verify the change renders correctly on mobile and desktop

### 4.2 Common fix patterns

| Issue | Fix |
|-------|-----|
| Vague headline | Rewrite using outcome-focused pattern from headline catalog |
| No CTA above fold | Add primary CTA to hero section |
| Feature-focused benefits | Rewrite using FAB framework (Feature → Advantage → Benefit) |
| Anonymous testimonials | Replace with named testimonials including photo, company, specific results |
| Generic stock images | Replace with real product shots, team photos, or customer results |
| Multiple competing CTAs | Remove all secondary navigation, consolidate to one primary CTA |
| Missing guarantee | Add specific guarantee near primary CTA |
| Slow load time | Compress images, minimize scripts, remove unnecessary elements |
| Too many form fields | Remove all non-essential fields |

### 4.3 Re-run checklist

After fixes, re-run the [LP Quality Checklist](../checklists/LP Quality Checklist.md). All items must pass.

---

## Phase 5️⃣: Validate

### 5.1 Allow data collection

After deploying fixes, allow at least:
- 50+ conversions for statistically meaningful comparison
- 2 weeks minimum for seasonal normalization

### 5.2 Compare before/after

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Conversion rate | | | |
| Bounce rate | | | |
| Average time on page | | | |
| CPA | | | |

### 5.3 Document learnings

Record what changed and why. This builds an optimization hypothesis log:

| Change made | Expected impact | Actual impact | Keep/revert |
|-------------|----------------|---------------|-------------|
| | | | |
| | | | |

---

## Validation and definition of done

This SOP is complete when:

- [ ] Baseline metrics documented
- [ ] Full structural audit completed using LP Quality Checklist
- [ ] Drop-off points diagnosed with evidence
- [ ] Prioritized fix list created
- [ ] P1 fixes applied and verified
- [ ] LP Quality Checklist passes after fixes
- [ ] Validation period started with monitoring in place

---

## Exit → Entry bridge

After validation:

| Outcome | Next step |
|---------|-----------|
| CVR improved significantly | Move to P2 fixes, then consider A/B testing further optimizations |
| CVR unchanged | Re-diagnose: the fixes targeted the wrong issue. Re-run Phase 3 diagnosis. |
| CVR decreased | Revert changes, re-diagnose from Phase 3 |

**Recurring schedule:**

| Cadence | Action |
|---------|--------|
| Monthly | Check LP metrics against baseline |
| Quarterly | Re-run full structural audit |
| Before scaling spend | Always audit LP before increasing budget significantly |

---

## Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Changing everything at once | Can't attribute improvement to any single change | Prioritize and apply fixes in batches |
| No baseline captured | No way to measure improvement | Always record Phase 1 metrics before changing anything |
| Evaluating too early | Not enough data for valid comparison | Wait for 50+ conversions minimum |
| Fixing cosmetic issues first | Design tweaks rarely move CVR significantly | Focus on hero, offer, and objections first |
| Ignoring mobile | Over 50% of traffic is mobile for many verticals | Always check mobile experience separately |

---

## Quick reference: support library

| Document | Type | Used in |
|----------|------|---------|
| [LP Quality Checklist](../checklists/LP Quality Checklist.md) | Checklist | Phases 2 and 4 |
| [LP Hierarchy Mental Model](../mental-models/LP Hierarchy Mental Model.md) | Mental Model | Phase 2 |
| [LP Headline Catalog](../catalogs/LP Headline Catalog.md) | Catalog | Phase 4 |
| [LP CTA Catalog](../catalogs/LP CTA Catalog.md) | Catalog | Phase 4 |
| [LP Section Catalog](../catalogs/LP Section Catalog.md) | Catalog | Phase 4 |

---

## Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Build a High-Converting Landing Page](../sops/SOP – Build a High-Converting Landing Page.md) | Upstream: initial build process |
| *Testing Mental Model* [TBD, Phase 6] | Downstream: structured A/B testing after audit fixes |

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
