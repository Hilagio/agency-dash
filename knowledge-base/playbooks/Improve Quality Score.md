# Improve Quality Score
Created: 2026-02-04

Playbook_ID: 1
Status: Done
Category: Ad Quality
Bucket: Traffic
Verticals: E-com, Lead Gen, SaaS
Agent_Routable: No
Human_Override_Required: No
Linked solution patterns: Improve Competitiveness (planned)
Domain: Search
Pillar: 6
Primary Outcome: Quality Score ≥ 7 (stable)
Secondary Outcomes: Lower CPC, higher Ad Rank, stronger auction leverage

---

## Read this first

Quality Score is **not** something you optimize directly.

It is the *result* of Google gaining confidence that:

1. Your ad matches the user's intent (**Ad Relevance**)
2. Users are likely to click your ad (**Expected CTR**)
3. The landing page delivers on the promise (**Landing Page Experience**)

This playbook **does not contain tactics**. It tells you **which constraint to fix first** and routes you to the correct SOP.

> Never work on more than **one QS component at the same time**. Fix the upstream constraint, then move forward.

---

## How to prioritize

Use impression-weighted QS to create a personalized priority list, so you can focus on what matters most first.

**Prioritization formula:**

`Priority Score = (10 - Quality Score) × Impressions`

Sort descending. Work on the highest-priority keyword/ad group first.

> Do not run this playbook on dozens of keywords at once. Fix one theme → validate → replicate.

---

## Phase 1️⃣: Ad Relevance

### What you're checking

Does Google believe your ad **meaningfully matches the user's intent**?

### Signals

- Ad Relevance = *Below Average* or *Average*
- RSAs feel generic or interchangeable
- High-volume queries not reflected in ads

### Decision

| If... | Then... |
| --- | --- |
| Ad Relevance = *Below Average* | **STOP:** Run [SOP – Improve Ad Relevance](../sops/SOP – Improve Ad Relevance.md)  |
| Ad Relevance = *Average* or *Above Average* | **PASS:** Proceed to Phase 2 |

> Ad Relevance is a **structural** issue. You fix the foundation (ad group structure, keyword-to-ad alignment) before testing creative angles.

---

## Phase 2️⃣: Expected CTR

### What you're checking

Does Google expect users to **click your ad more often than competitors**?

### Signals

- Expected CTR = *Below Average* or *Average*
- CTR stagnates despite relevance fixes
- Competitors have stronger offers/proof in their ads

> Google's auction and competitive metrics impact your CTR. Compare **apples to apples**. **** Check Auction Insights for context.

### Decision

| If... | Then... |
| --- | --- |
| Expected CTR = *Below Average* | **STOP:** Run [SOP – Improve Expected CTR](../sops/SOP – Improve Expected CTR.md)  |
| Expected CTR = *Average* or *Above Average* | **PASS:** Proceed to Phase 3 |

> Expected CTR is a **competitiveness** issue. Focus on message strength (benefits, social proof, CTAs, differentiation), not just relevance.

---

## Phase 3️⃣: Landing Page Experience

### What you're checking

Does the landing page **continue the ad's promise without friction**?

### Signals

- Landing Page Experience = *Below Average* or *Average*
- Low conversion rate / High bounce rate / Low post-click engagement
- Weak message match between ad and page
- Slow page load or poor mobile experience

### Decision

| If... | Then... |
| --- | --- |
| LP Experience = *Below Average* | **STOP:** Run [SOP – Improve Landing Page Experience](../sops/SOP – Improve Landing Page Experience.md)  |
| LP Experience = *Average* or *Above Average* | **PASS:** Quality Score constraint resolved |

> 💡 **Did you know?** Google uses **conversion rate** as a proxy for good Landing Page Experience. Pages that convert well signal that visitors found what they were looking for.

---

## The flow

Navigate through the pages to see the full Quality Score decision flow from diagnosis to resolution.

<pdf-embed src="/quality-score-flowchart.pdf"></pdf-embed>

---

## After all three pass: The Iteration Loop

Once all three QS components are *Average* or *Above Average*, your foundation is solid.

**Next step:** Move to ongoing creative optimization with [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md).

The Iteration Loop is a **continuous optimization system** for systematically testing and improving RSA creative performance over time.

---

## Validation & time windows

Quality Score updates are **lagging indicators**. Use these windows:

| Fix Type | Expected update window |
| --- | --- |
| Structural fixes (Ad Relevance) | 7-14 days |
| CTR improvements (Expected CTR) | 7-21 days |
| LP experience changes | 14-30 days |

### What to track

| Metric | What It Tells You |
| --- | --- |
| Component movement | Below Avg → Avg → Above Avg |
| CPC trend | Lower CPCs = better Ad Rank efficiency |
| Impression Share (Rank) | Higher share = winning more auctions |
| CTR | Early indicator of Expected CTR improvement |
| Conversion Rate | Early indicator of LP Experience improvement |

> 💡 **Pro tip:** Use a QS history tracker (script or tool) to monitor weekly changes. Clear visualizations help you see the impact of your work over time.

---

## Common failures

| Failure | Why It Happens | How to Avoid |
| --- | --- | --- |
| Working on CTR while relevance is broken | Skipping Phase 1 | Always check Ad Relevance first |
| Redesigning landing pages before fixing ads | Wrong sequence | Follow the phase order |
| Chasing QS increases that hurt CPI/RPI/PPI | QS is a proxy, not the goal | Track business outcomes, not just QS |
| Applying this playbook to too many themes at once | Spreading too thin | Fix one theme, validate, then replicate |
| Treating QS as the goal instead of auction efficiency | Misunderstanding QS purpose | QS enables lower CPCs and better Ad Rank (that's the real goal) |
| Running creative tests on a broken foundation | Premature optimization | Complete Ad Relevance + Expected CTR SOPs first |

---

## Knowledge base

This playbook routes to the following SOPs:

### Core SOPs (Sequential)

| SOP | Purpose | When to Run |
| --- | --- | --- |
| [SOP – Improve Ad Relevance](../sops/SOP – Improve Ad Relevance.md) | Fix semantic mismatch between ad groups, keywords, and RSA assets | Ad Relevance = Below Average |
| [SOP – Improve Expected CTR](../sops/SOP – Improve Expected CTR.md) | Fix baseline RSA competitiveness (missing elements, weak messaging) | Expected CTR = Below Average |
| [SOP – Improve Landing Page Experience](../sops/SOP – Improve Landing Page Experience.md) | Fix foundational LP issues (message match, speed, trust, structure) | LP Experience = Below Average |

### Ongoing Optimization

| SOP | Purpose | When to Run |
| --- | --- | --- |
| [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md) | Systematic creative testing framework | All 3 components = Average+ |

### Supporting SOPs (Referenced within Core SOPs)

- *SOP – Promote Search Terms to Keywords*
- *SOP – Ad Group Structure & Intent Mapping*

---

## Definition of done

This playbook is complete when:

- [ ]  All three QS components are **Average or Above Average**
- [ ]  Quality Score ≥ 7/10 (stable for 14+ days)
- [ ]  CPC has stabilized or decreased
- [ ]  Impression Share (Rank) improved without bid inflation

**At this point:**

1. Replicate the process for the **next priority keyword/theme**
2. Move to [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md) for ongoing creative optimization

---

## Version details

- **Version:** 3.0
- **Last Updated:** April 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General Terms & Conditions ([https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)).

**Permitted:** 

- Using this document to improve your own Google Ads work or serve your clients.

**Prohibited:**

- Incorporating into AI agents, SaaS products, or automated systems offered to third parties.
- Using as training data for machine learning models intended for commercial distribution.
- Redistributing, reselling, or sublicensing.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

© 2026 PPC Mastery B.V. All rights reserved.