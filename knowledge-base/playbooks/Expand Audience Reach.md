# Expand Audience Reach
Created: 2026-02-04

Playbook_ID: 2
Status: Done
Category: Audiences
Bucket: Audiences
Verticals: E-com, Lead Gen, SaaS
Agent_Routable: No
Human_Override_Required: No
Primary Outcome: Validated audience infrastructure ready for controlled expansion
Secondary Outcome: Clear expansion path identified and routed to correct SOP
Playbook Type: Router / Decision Tree
Execution: Via linked SOP assets
Domain: Audiences
Pillar: 7

---

## Read this first

Audience expansion is **not** about adding more segments or enabling every available feature.

It is the result of having:

1. **High-quality PMax signals** that give Google accurate data to learn from
2. **Properly configured targeting** across Display, Video, and Demand Gen campaigns
3. **Active first-party data** (Customer Match) refreshed and matched at healthy rates

This playbook **does not contain tactics**. It tells you **which audience foundation to fix first** and routes you to the correct SOP.

> Never expand audience reach before your foundation is solid. Expanding on weak signals or misconfigured targeting wastes budget on low-quality traffic.

---

## How to prioritize

Use audience coverage and data quality to determine your starting point.

**Prioritization logic:**

```
1. Are PMax signals high-quality and layered? → If NO, fix first
2. Are Display/Video/DG audiences configured correctly? → If NO, fix next
3. Is Customer Match active and refreshed? → If NO, fix next
4. All foundations solid? → Proceed to expansion
```

Work through the phases in order. Do not skip ahead.

---

## Phase 1️⃣: Signal quality check

### What you're checking

Do your Performance Max asset groups have **high-quality, layered audience signals** that give Google accurate starting data?

### Signals

- PMax asset groups have no audience signals configured
- Only Tier 4-5 signals used (affinity, demographics only)
- Customer Match list is missing, stale, or below 1,000 matched users
- Custom segments use generic terms instead of converting search queries
- Search themes duplicate active Search campaign keywords

### Decision

| If... | Then... |
|-------|---------|
| Any PMax asset group lacks Tier 1-2 signals | **STOP:** Run [SOP – Set Up Audience Signals](../sops/SOP – Set Up Audience Signals.md) |
| All PMax asset groups have layered Tier 1-3 signals | **PASS:** Proceed to Phase 2 |
| No PMax campaigns exist | **PASS:** Proceed to Phase 2 |

> Signal quality determines learning speed. PMax with only demographic signals takes significantly longer to optimize than PMax with Customer Match + website converters + custom segments.

---

## Phase 2️⃣: Targeting coverage check

### What you're checking

Are your Display, Video, and Demand Gen campaigns **properly configured** with the right audience segments, targeting mode, and expansion settings?

### Signals

- Campaigns using Observation mode when Targeting is needed
- Optimized targeting ON for remarketing campaigns (should be OFF)
- No exclusions configured (serving to existing customers unintentionally)
- Audience overlap between campaigns (wasting budget on the same users)
- Lookalike segments using low-quality seed lists (all visitors instead of converters)

### Decision

| If... | Then... |
|-------|---------|
| Any campaign has incorrect targeting mode or expansion settings | **STOP:** Run [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md) |
| All campaigns have correct configuration | **PASS:** Proceed to Phase 3 |
| No Display/Video/DG campaigns exist | **PASS:** Proceed to Phase 3 |

---

## Phase 3️⃣: First-party data check

### What you're checking

Is Customer Match **active, properly formatted, and regularly refreshed** across your campaigns?

### Signals

- No Customer Match list uploaded
- Match rate below 29%
- List not refreshed in 30+ days
- Only email identifiers uploaded (no phone/address)
- List size below 1,000 matched users
- No refresh schedule or ownership documented

### Decision

| If... | Then... |
|-------|---------|
| Customer Match is missing, stale, or poorly matched | **STOP:** Run [SOP – Build Customer Match Lists](../sops/SOP – Build Customer Match Lists.md) |
| Customer Match is active, refreshed, and well-matched | **PASS:** Proceed to Phase 4 |

> Customer Match is the single highest-impact audience asset. A well-maintained Customer Match list improves signal quality (PMax), targeting precision (Display/Video/DG), and lookalike quality (Demand Gen) simultaneously.

---

## Phase 4️⃣: Expansion readiness

### What you're checking

All audience foundations are solid. The account is ready for **controlled audience expansion**.

### Expansion routes

| Expansion type | When to use | Action |
|---------------|-------------|--------|
| **Broaden PMax signals** | Current signals are narrow (efficiency-focused) | Add Tier 3-4 signals: more custom segments, adjacent in-market categories, search themes (if no Search cannibalization risk) |
| **Add Demand Gen lookalikes** | Customer Match list is 1,000+ and Demand Gen is active | Create lookalike segment from high-value customer seed: start with Balanced reach |
| **Test new audience segments** | Current audiences performing well, budget available | Add 1-2 new in-market or custom segments to existing campaigns: use Observation mode first to measure before committing |
| **Expand to new campaign types** | Remarketing performing well, ready for prospecting | Launch prospecting campaign (Display or Demand Gen) with custom segments + in-market targeting |
| **Add Customer Match segments** | Only "All customers" list exists | Create high-value, churned, and product-specific segments for differentiated targeting |

### Expansion rules

1. **Expand one dimension at a time:** Add signals OR broaden targeting OR launch new campaign, not all three simultaneously
2. **Measure before committing:** Use Observation mode or small budgets to validate new audiences before scaling
3. **Warm → Cool → Cold:** Expand temperature gradually per the [Audience Strategy Mental Model](../mental-models/Audience Strategy Mental Model.md)
4. **Each expansion funds the next:** Warm audience profits fund cool audience testing: cool audience profits fund cold audience testing

---

## The flow

```
START
│
├─ Phase 1: PMax signals layered and high-quality?
│   ├─ NO → STOP → SOP – Set Up Audience Signals
│   └─ YES → Continue
│
├─ Phase 2: Display/Video/DG targeting configured correctly?
│   ├─ NO → STOP → SOP – Set Up Audience Targeting
│   └─ YES → Continue
│
├─ Phase 3: Customer Match active and refreshed?
│   ├─ NO → STOP → SOP – Build Customer Match Lists
│   └─ YES → Continue
│
└─ Phase 4: All foundations solid → Expansion ready
    ├─ Broaden PMax signals
    ├─ Add Demand Gen lookalikes
    ├─ Test new audience segments
    ├─ Expand to new campaign types
    └─ Add Customer Match segments
```

---

## After all phases pass: Ongoing optimization

Once all audience foundations are solid and initial expansion is live:

1. **Monitor signal performance:** Review PMax asset group performance by audience signal quality tier monthly
2. **Refresh Customer Match:** Maintain weekly/monthly refresh cadence
3. **Test and graduate:** Move successful Observation-mode audiences to Targeting mode
4. **Expand temperature:** Gradually move from warm → cool → cold audiences as performance data accumulates
5. **Re-run this playbook:** Quarterly, to verify foundations remain solid before further expansion

---

## Validation & time windows

Audience changes are lagging indicators. Use these windows before evaluating results:
| Change type | Expected signal window |
|-------------|----------------------|
| PMax signal changes | 14-21 days (learning period restart) |
| Targeting mode changes | 7-14 days |
| New audience segments | 14-30 days (need sufficient impressions) |
| Lookalike segment launch | 14-30 days |
| Customer Match refresh | 24-48 hours (matching), 7 days (impact) |

### What to track

| Metric | What it tells you |
|--------|------------------|
| Conversion volume | Are new audiences driving incremental conversions? |
| CPA / ROAS by audience | Is expansion maintaining efficiency? |
| Reach / Impressions | Is the audience pool actually growing? |
| New vs. returning users | Are you reaching genuinely new people? |
| Audience overlap (Insights) | Are campaigns competing for the same users? |

---

## Knowledge base

This playbook routes to the following SOPs:

### Core SOPs

| SOP | Purpose | When to run |
|-----|---------|-------------|
| [SOP – Set Up Audience Signals](../sops/SOP – Set Up Audience Signals.md) | Configure PMax audience signals | PMax signals missing or low-quality |
| [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md) | Configure Display/Video/DG targeting | Targeting misconfigured |
| [SOP – Build Customer Match Lists](../sops/SOP – Build Customer Match Lists.md) | Create and maintain Customer Match | No Customer Match or stale lists |

### Supporting documents

| Document | Type | Purpose |
|----------|------|---------|
| [Audience Strategy Mental Model](../mental-models/Audience Strategy Mental Model.md) | Mental Model | Conceptual framework for expansion phases |
| [Audience Signal Catalog](../catalogs/Audience Signal Catalog.md) | Catalog | Signal type options for PMax |
| [Audience Segment Catalog](../catalogs/Audience Segment Catalog.md) | Catalog | Segment type options for Display/Video/DG |
| [Audience Signal Quality Checklist](../checklists/Audience Signal Quality Checklist.md) | Checklist | Validates PMax signal setup |
| [Audience Targeting Launch Checklist](../checklists/Audience Targeting Launch Checklist.md) | Checklist | Validates targeting setup |
| [Audience Targeting Health Checklist](../checklists/Audience Targeting Health Checklist.md) | Checklist | Validates ongoing targeting health |
| [Audience Signals Reference](../references/Audience Signals Reference.md) | Reference | Signal specs and limits |
| [Audience Targeting Reference](../references/Audience Targeting Reference.md) | Reference | Targeting specs and limits |

---

## Definition of done

This playbook is complete when:

- [ ] All PMax asset groups have layered Tier 1-3 signals
- [ ] All Display/Video/DG campaigns have correct targeting mode and expansion settings
- [ ] Customer Match is active, matched at 29%+, and on a refresh schedule
- [ ] At least one expansion action identified and initiated
- [ ] Measurement plan in place to evaluate expansion impact

**At this point:**

1. Monitor expansion performance over the validation window
2. Re-run this playbook quarterly to verify audience health
3. Expand to additional audience types as performance data validates

---

## Common failures

| Failure | Why it happens | How to avoid |
|---------|---------------|--------------|
| Expanding before fixing signal quality | Skipping Phases 1-3 | Follow phase order strictly |
| Adding all available audiences at once | More = better thinking | Expand one dimension at a time |
| No measurement plan for expansion | Excitement to launch | Define metrics and windows before expanding |
| Expanding cold audiences before warm ones perform | Impatience | Warm → cool → cold progression |
| Ignoring Customer Match | "We'll do it later" | Customer Match is the highest-impact single action |
| Not excluding existing customers from prospecting | Oversight | Always verify exclusions when expanding |

---

## Version details

- **Version:** 1.0
- **Last Updated:** January 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

© 2026 PPC Mastery B.V. All rights reserved.
