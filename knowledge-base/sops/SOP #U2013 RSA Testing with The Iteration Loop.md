# SOP – RSA Testing with The Iteration Loop
Created: 2026-02-04

SOP_ID: SOP_4
Status: Done
Category: Creative
Primary Outcome: Maximize CPI / RPI / PPI through systematic creative testing
Secondary Outcomes: Improved Expected CTR, higher conversion rates, scalable creative process
Agent_Executable: No
Human_Approval_Required: No
Domain: Creative
Pillar: 8

### Purpose

This SOP provides a **systematic framework for continuous RSA creative testing** across your Google Ads account.

> ❓ **The big question:** Which creative angles, messages, and assets drive the best business outcomes (conversions, revenue, profit)?

---

### What this SOP is NOT

This SOP does **not**:

- Fix semantic mismatch (See: [SOP – Improve Ad Relevance](../sops/SOP – Improve Ad Relevance.md))
- Teach you how to write headlines (See: [Headline Angle Catalog](../catalogs/Headline Angle Catalog.md))
- Teach you how to write descriptions (See: [Description Expansion Catalog](../catalogs/Description Expansion Catalog.md))
- Provide one-time fixes (See: [SOP – Improve Expected CTR](../sops/SOP – Improve Expected CTR.md))
- Compose initial RSAs (See: [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md))

**Key distinction:**

This is an *ongoing optimization system*, not a one-time repair task. Your RSA foundation must be solid before running this loop.

> Most advertisers test ads randomly. This framework turns creative testing into a repeatable, scalable system.

### When to run this SOP

Run this SOP if **all** of the following are true:

- Ad Relevance = *Average* or *Above Average*
- Expected CTR = *Average* or *Above Average* (or actively being repaired)
- RSA is deployed with testing-ready structure (7-8 headlines, 2-3 descriptions)
- You want to systematically improve creative performance over time

> 💡 **Prerequisites:** Complete the foundational creative SOPs first:
> - [SOP – Create an Irresistible Offer](../sops/SOP – Create an Irresistible Offer.md) (offer audit passing)
> - [SOP – Craft Your Offer Angles](../sops/SOP – Craft Your Offer Angles.md) (6 angles documented + traffic temperature classified)
> - [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md) (RSA deployed with 7-8 headlines)
> - [SOP – Improve Ad Relevance](../sops/SOP – Improve Ad Relevance.md) (Ad Relevance ≠ Below Average)
> - [SOP – Improve Expected CTR](../sops/SOP – Improve Expected CTR.md) (Expected CTR ≠ Below Average)
> Testing on a broken foundation wastes time and produces misleading results.

---

### Before you start

**Required:**

- Completed foundational creative SOPs (see prerequisites above)
- RSA deployed via [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md)
- Defined testing cluster(s)
- Access to asset-level performance data
- Decision on primary KPI (CPI, RPI, or PPI)
- Learning log (simple spreadsheet or tool)

**Recommended:**

- Access to customer reviews and feedback
- Access to competitor ads
- AI tool for asset generation (optional)

---

### Framework overview: The Iteration Loop

The Iteration Loop consists of **4 pillars**:

| Pillar | Purpose |
| --- | --- |
| 1️⃣ **Templatize** | Assign slots to specific angle types across a cluster |
| 2️⃣ **Aggregate** | Pool data across ad groups to reach statistical significance |
| 3️⃣ **Diagnose** | Classify assets into actionable quadrants |
| 4️⃣ **Iterate** | Test hypotheses, learn, repeat |

**The big idea:**

- Stop testing ads inside isolated ad groups.
- Start testing **templatized angles** across the account.
- Use **asset-level data** as the core dataset.
- Judge assets on **CPI/RPI/PPI + AIS**, not CTR or Ad Strength.

---

### The Data Poverty Problem

Before diving into the framework, understand why traditional RSA testing fails:

**The math:**

| # Headlines | # 2-Headline combinations | # 3-Headline combinations | Min. Impressions needed |
| --- | --- | --- | --- |
| 6 | 9 | 120 | 12,000 |
| 9 | 72 | 504 | 50,400 |
| 8 | 56 | 336 | 33,600 |
| 10 | 90 | 720 | 72,000 |
| 15 | 210 | 2,730 | 273,000 |

A 15-headline RSA has up to **2,730 three-headline combinations**. 

Most ad groups never accumulate enough impressions for Google to learn which combinations work.

**The Solution:**

- Limit RSAs to **7-8 headlines** and **2-3 descriptions**
- Use **templates** so the same angles appear across multiple ad groups
- **Aggregate** data across ad groups to reach statistical significance

---

## Pillar 1️⃣: Templatize

### 1.1 Define your testing clusters

**Goal:** Group ad groups that can share the same RSA template.

A **cluster** is a set of ad groups with similar intent that can use identical creative (except for the relevance anchor slot).

**Common clusters:**

| Cluster | Description | Example Ad Groups |
| --- | --- | --- |
| Non-brand Generic | Core product/service terms | "crm software", "sales crm", "crm platform" |
| Non-brand Category | Specific categories | "enterprise crm", "small business crm" |
| Competitor | Competitor terms | "[competitor] alternative", "[competitor] vs" |

**Action:**

1. List all ad groups in your account.
2. Group by shared intent and messaging needs.
3. Name each cluster.
4. Start with your highest-volume cluster.

---

### 1.2 Create the RSA template

**Goal:** Assign each headline slot a specific angle type (from [Headline Angle Catalog](../catalogs/Headline Angle Catalog.md)).

**The 7 canonical angle types**

Every RSA is built from these angle types:

| # | Angle type | What it does |
| --- | --- | --- |
| 1 | **Relevance Anchor** | Match the search query |
| 2 | **Value Proposition** | Core offer + main benefit |
| 3 | **Problem/Pain** | Mirror the searcher's frustration |
| 4 | **USP / Benefit** | Why you're different/better |
| 5 | **Social Proof** | Trust signals + credentials |
| 6 | **Risk Removal** | Lower barrier to action |
| 7 | **Call-to-Action** | What to do next |

**Standard template (7-8 headlines, 2-3 descriptions)**

| Slot | Angle type | Purpose | Example |
| --- | --- | --- | --- |
| H1 | **Relevance Anchor** | Match the search query | `\{KeyWord:CRM Software\}` |
| H2 | **Value Proposition** | Core offer + main benefit | "All-in-One Sales Platform" |
| H3 | **USP / Benefit** | Why you're different/better | "Setup in Just 2 Minutes" |
| H4 | **Social Proof** | Trust signals + credentials | "Trusted by 50,000+ Teams" |
| H5 | **Risk Removal** | Lower barrier to action | "No Credit Card Required" |
| H6 | **Call-to-Action** | What to do next | "Start Your Free Trial” |
| H7 | **[Variable]** | 2nd headline for lead angle | (see note below) |
| H8 | **[Optional]** | Additional angle (high-volume only) | (if 10k+ impressions/month) |
| D1 | **Problem + Solution** | Pain recognition + benefit (include keyword) | "Tired of deals slipping through? Our CRM software keeps your pipeline organized.” |
| D2 | **Proof + CTA** | Trust + action driver | "Join 12,000+ teams who've transformed their sales. Start your free trial today!” |
| D3 | **Risk + Urgency (optional)** | Remove final barriers | "No credit card required. Start free and upgrade when ready.” |

**Note on the variable slot (H7)**

Your initial RSA (from [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md)) assigns H7 based on **traffic temperature** from your [SOP – Craft Your Offer Angles](../sops/SOP – Craft Your Offer Angles.md) document:

| Traffic temperature | H7 angle type | Why |
| --- | --- | --- |
| ❄️ Cold (Unaware/Problem Aware) | Problem/Pain (2nd variation) | They need to feel understood |
| 🌤️ Warm (Solution Aware) | USP or Value Proposition (2nd variation) | They're comparing solutions |
| 🔥 Hot (Product/Most Aware) | Social Proof or Risk Removal (2nd variation) | They need final push |

**For aggregation purposes:** Tag H7 by its actual angle type (e.g., "USP"), not by its slot number. This ensures proper aggregation in Pillar 2.

**Note on Urgency**

Urgency is a *modifier*, not a core angle type. Apply urgency to any headline as needed:

- "Start Your Free Trial" → "Start Your Free Trial Today"
- "Get 20% Off" → "Get 20% Off - Ends Friday"

Don't dedicate a slot to urgency alone. Weave it into other angle types when appropriate, or include it in D3 if you have authentic time-limited offers.

**Why templates work**

- H3 is **always** "USP / Benefit" across all ad groups in the cluster.
- This means you can aggregate all H3 data to see which USP angle wins.
- Without templates, every ad group is an isolated experiment with insufficient data.

---

### 1.3 Apply template across cluster

**Goal:** Deploy the same template to all ad groups in the cluster.

**Rules:**

1. **Same slots, same angle types:** H3 = USP / Benefit everywhere in the cluster.
2. **Only H1 changes:** The relevance anchor adapts to each ad group.
3. **All other slots identical:** Same USP headline, same CTA, same Social Proof.
4. **One RSA per ad group:** No competing RSAs splitting traffic.

**Example:**

| Ad Group | H1 (Relevance Anchor) | H3 (USP / Benefit) | H4 (Social Proof) |
| --- | --- | --- | --- |
| CRM Software | `\{KeyWord:CRM Software\}` | "Setup in 2 Minutes" | "Trusted by 50,000+ Teams" |
| Sales CRM | `\{KeyWord:Sales CRM\}` | "Setup in 2 Minutes" | "Trusted by 50,000+ Teams" |
| Enterprise CRM | `\{KeyWord:Enterprise CRM\}` | "Setup in 2 Minutes" | "Trusted by 50,000+ Teams" |

> 20 ad groups × 5,000 impressions each = 100,000 impressions for "Setup in 2 Minutes". **Now you have real data to work with.**

---

## Pillar 2️⃣: Aggregate

### 2.1 Extract asset-level data

**Goal:** Pull performance data for each asset across the cluster.

**Where to find data:**

- Google Ads UI: Assets → Performance → Headlines
- Export to spreadsheet
- Or use API/tool for automation

**Required metrics:**

| Metric | Source |
| --- | --- |
| Impressions | Asset performance report |
| Clicks | Asset performance report |
| Conversions | Asset performance report |
| Conversion Value | Asset performance report |
| Cost | Asset performance report |

---

### 2.2 Calculate performance metrics

**Goal:** Compute the metrics that matter.

**Primary KPIs:**

| Metric | Formula | Use Case |
| --- | --- | --- |
| **CPI** | Conversions ÷ Impressions | Lead Gen / SaaS |
| **RPI** | Revenue ÷ Impressions | Ecommerce |
| **PPI** | (Revenue - Cost) ÷ Impressions | Ecommerce with margins |

**Visibility metric:**

| Metric | Formula | Meaning |
| --- | --- | --- |
| **AIS** | Asset Impressions ÷ Total Ad Impressions | How often the asset shows |

> ⚠️ **Do not use CTR as your primary metric:** High-CTR assets can attract unqualified clicks. CPI/RPI measures actual business outcomes.

---

### 2.3 Aggregate by angle type and sub-angle

**Goal:** Pool data across ad groups to see patterns.

**Process:**

1. Tag each asset with its **angle type** using the 7 canonical types:
    - Relevance Anchor
    - Value Proposition
    - Problem/Pain
    - USP / Benefit
    - Social Proof
    - Risk Removal
    - Call-to-Action
2. Tag each asset with its **sub-angle** if applicable:
    - Problem/Pain: Tool Chaos
    - Problem/Pain: Missed Deals
    - Social Proof: User Count
    - Social Proof: Rating
    - etc.
3. Sum metrics across all ad groups in the cluster.
4. Calculate aggregated CPI/RPI and average AIS.

> ⚠️ **Variable slot handling:** If H7 is a second USP headline, tag it as "USP / Benefit", not as "H7". The angle type is what matters for aggregation, not the slot position.

**Example aggregated view:**

| Angle | Headline type | Sub-angle | Angle type | Total conv. | CPI | Avg AIS |
| --- | --- | --- | --- | --- | --- | --- |
| Benefit | Problem/Pain | Tool Chaos | "End Spreadsheet Chaos" | 0.25% | 34% | 124,000 |
| Benefit | Problem/Pain | Missed Deals | Missed Deals | 178 | 24% |  |
| Social Proof | User Count | "Trusted by 50,000+ Teams" | 156,000 | User count | 390 | 42% |
| Risk Reversal | Risk Removal | "Try Free for 14 Days" | 67,000 | 201 | Trial | 18% |

> Instead of 5k impressions per asset in isolation, you have 100k+ per angle type. Patterns emerge and decisions become clear.

---

## Pillar 3️⃣: Diagnose

### 3.1 The Performance Quadrants

**Goal:** Classify assets into actionable categories.

**The 2×2 Grid:**

|  | High AIS | Low AIS |
| --- | --- | --- |
| **High CPI/RPI** | ✅ **Champions** | 🚀 **Hidden Gems** |
| **Low CPI/RPI** | 💀 **Silent Killers** | 🗑️ **Trash** |

**Quadrant Definitions:**

| Quadrant | Profile | What it means |
| --- | --- | --- |
| **Champions** | High CPI, High AIS | Your best assets. Google shows them often AND they convert well. |
| **Hidden Gems** | High CPI, Low AIS | Great converters that Google isn't showing enough. Opportunity! |
| **Silent Killers** | Low CPI, High AIS | Google shows them a lot, but they don't convert. Dragging down performance. |
| **Trash** | Low CPI, Low AIS | Bad converters that rarely show anyway. Low priority. |

**How to define "High" vs "Low":**

| Metric | High | Low |
| --- | --- | --- |
| CPI/RPI | Above cluster average | Below cluster average |
| AIS | Above 25% | Below 15% |

*Adjust thresholds based on your asset count and data volume.*

---

### 3.2 Quadrant actions

**Goal:** Take the right action for each quadrant.

| Quadrant | Action | Priority | How |
| --- | --- | --- | --- |
| **Champions** | **Protect** | - | Don't touch. Document in learning log. |
| **Hidden Gems** | **Increase exposure** | High | Pin to position 1, or add variations in descriptions |
| **Silent Killers** | **Kill immediately** | Critical | Remove or replace with new hypothesis |
| **Trash** | **Replace when convenient** | Low | Swap out during next iteration cycle |

> 💡 **“Silent Killers” are the priority:** They're actively hurting performance because Google shows them frequently. Remove them first.

---

### 3.3 Angle type-level diagnosis

**Goal:** Identify winning and losing angle types at the aggregate level.

**Angle type performance summary:**

| Angle Type | Avg CPI | Avg AIS | Verdict |
| --- | --- | --- | --- |
| Problem/Pain | 0.27% | 32% | ✅ Champion type: test more sub-angles |
| Value Proposition | 0.23% | 29% | ✅ Continue testing variations |
| Social Proof | 0.25% | 42% | ✅ Champion type: protect |
| Risk Removal | 0.30% | 18% | 🚀 Hidden gem: increase exposure |
| USP / Benefit | 0.19% | 26% | ⚠️ Underperforming: test new sub-angles |
| Call-to-Action | 0.22% | 24% | ⚠️ Test stronger CTAs |

**Key questions:**

1. Which angle types are clearly winning? → Double down with sub-angle tests.
2. Which angle types are clearly losing? → Test new sub-angles or reduce slot priority.
3. Which angle types need more data? → Maintain or slightly increase exposure.

---

## Pillar 4️⃣: Iterate

### 4.1 The testing hierarchy

**Goal:** Test at the right level of granularity.

| Level | What you're testing | Example | When to use |
| --- | --- | --- | --- |
| **Headline Type vs. Type** | Big categories against each other | Problem/Pain vs. Social Proof vs. Risk Removal | **Angle Type vs. Type** |
| **Sub-angle vs. Sub-angle** | Variations within a headline type | Problem: Tool Chaos vs. Problem: Missed Deals | Refining winners |
| **Asset vs. Asset** | Phrasing within a sub-angle | "End Spreadsheet Chaos" vs. "Stop the Chaos" | Optimizing proven angles |

**Rule:** Start broad (angle type level), then go narrow (asset level) as you learn.

---

### 4.2 Testing Maturity Phases

**Goal:** Match your testing approach to account maturity.

#### Phase 1️⃣: Exploration (New account / new offer)

| Focus | Angle Type vs. Angle Type testing |
| --- | --- |
| Goal | Discover 2-3 winning angle types |
| Template | Include all 7 angle types |
| Duration | First 1–3 months |

**Actions:**

- Test all 7 angle types
- Don't optimize phrasing yet. Find winning concepts first
- Expect high variance; some types will underperform

#### Phase 2️⃣: Consolidation (Proven basic winners)

| Focus | Mix of angle type and sub-angle testing |
| --- | --- |
| Goal | Stabilize template, push winners to high AIS |
| Template | Emphasize 4-5 proven angle types |
| Duration | Months 3-6 |

**Actions:**

- Reduce emphasis on losing angle types
- Test sub-angles within winners (e.g., Problem: Tool Chaos vs. Problem: Lead Quality)
- Increase exposure for Hidden Gems
- Document Champions

#### Phase 3️⃣: Refinement (mature account)

| Focus | Asset vs. asset testing |
| --- | --- |
| Goal | Squeeze extra CPI/RPI from best angle types |
| Template | Stable with proven Champion types |
| Duration | Ongoing |

**Actions:**

- Test phrasing variations within proven sub-angles
- Small tweaks: hooks, word order, specificity, formatting
- Occasionally probe new angle types to detect shifts

---

### 4.3 Hypothesis-driven testing

**Goal:** Never test randomly. Always have a hypothesis.

> 💡 **Hypothesis format:** "If we [CHANGE], then [KPI] will [IMPROVE] because [REASON]".

**Hypothesis sources:**

| Source | What to look for | Example |
| --- | --- | --- |
| **Offer Angles** 
(from [SOP – Craft Your Offer Angles](../sops/SOP – Craft Your Offer Angles.md)) | **Offer Angles** 
(from [SOP – Craft Your Offer Angles](../sops/SOP – Craft Your Offer Angles.md)) | "If we test a 'Risk Removal' headline, CPI will improve because our guarantee is stronger than competitors" |
| Customer reviews | Repeated praise/complaints | "If we emphasize 'easy setup' in Problem/Pain, CPI will improve because it's mentioned in 70% of positive reviews" |
| Competitor ads | Gaps in messaging | "If we highlight '24/7 support' in USP/Benefit, we'll differentiate because no competitor mentions it" |
| Sales team | Common objections | "If we address pricing concerns in Risk Removal, CVR will improve because it's the #1 objection" |
| Support tickets | Pain points | "If we emphasize 'no learning curve' in Problem/Pain, CPI will improve because onboarding is a top complaint" |
| Quadrant analysis | Hidden Gems | "If we increase exposure for 'Free Trial' Risk Removal, overall CPI will improve because it's a Hidden Gem" |

**Connecting to your Offer Angles document:**

The angles document from [SOP – Craft Your Offer Angles](../sops/SOP – Craft Your Offer Angles.md) is your hypothesis goldmine. Each angle type can generate multiple headline and description tests:

| Angle type | Sub-angle ideas to test |
| --- | --- |
| **Problem/Pain** | Different symptoms, different frustrations, different failed alternatives |
| **Value Proposition** | Different benefits, different outcomes, different framings |
| **USP / Benefit** | Speed, ease, technology, specialization, audience fit |
| **Social Proof** | User counts, ratings, named customers, credentials, results achieved |
| **Risk Removal** | Different guarantee types, different trial framings, different commitment levels |
| **Call-to-Action** | Soft vs. hard CTAs, benefit-focused CTAs, urgency CTA |

> ⚠️ **Traffic temperature affects hypothesis priority:** If you're optimizing a cold traffic cluster, prioritize Problem/Pain sub-angle tests. For hot traffic, prioritize Social Proof and Risk Removal tests. Reference your traffic classification from [SOP – Craft Your Offer Angles](../sops/SOP – Craft Your Offer Angles.md) .

---

### 4.4 AI-powered asset generation

**Goal:** Use AI to generate asset variations at scale.

**Three "generation modes":**

| Mode | Purpose | Prompt example |
| --- | --- | --- |
| **Iterate** | Micro-tweaks on winners | "Write 5 variations of this Problem/Pain headline that maintain the same frustration: [headline]" |
| **Explore** | New sub-angles within same type | "Write 10 Problem/Pain headlines emphasizing [tool chaos] for [CRM software]. Vary the phrasing". |
| **Reinvent** | New angles entirely | "Based on these customer reviews, what Problem/Pain angles are we missing? Suggest 5 new approaches". |

**AI input sources:**

- Your 6-angle extraction document ([SOP – Craft Your Offer Angles](../sops/SOP – Craft Your Offer Angles.md) )
- Competitor ad scraping
- Customer review mining
- Search result analysis
- Learning log from past tests

> 💡 **Human approval required:** AI generates, humans approve. Every asset must pass review before deployment.

---

### 4.5 The learning log

**Goal:** Build your knowledge base about what works.

**Learning log entry template:**

```jsx
═══════════════════════════════════════════════════════
TEST ID: [CLUSTER]-[DATE]-[NUMBER]
═══════════════════════════════════════════════════════

CLUSTER: Non-brand CRM
TEST DATES: 2026-01-15 to 2026-01-29
TEST LEVEL: Sub-angle vs. Sub-angle

───────────────────────────────────────────────────────
HYPOTHESIS
───────────────────────────────────────────────────────
"If we test 'Missed Deals' as a Problem/Pain sub-angle 
instead of 'Tool Chaos', CPI will improve because sales 
teams care more about lost revenue than organization".

───────────────────────────────────────────────────────
ANGLE TYPE TESTED
───────────────────────────────────────────────────────
Slot: H4 (Problem/Pain)

Control (Tool Chaos):
- "End Spreadsheet Chaos"

Challenger (Missed Deals):
- "Stop Losing Deals to Chaos"
- "No More Missed Follow-Ups"

───────────────────────────────────────────────────────
RESULTS
───────────────────────────────────────────────────────
| Asset                       | Impressions | Conv. | CPI   | AIS |
|-----------------------------|-------------|-------|-------|-----|
| End Spreadsheet Chaos       | 87,000      | 218   | 0.25% | 38% |
| Stop Losing Deals to Chaos  | 45,000      | 126   | 0.28% | 20% |
| No More Missed Follow-Ups   | 31,000      | 84    | 0.27% | 14% |

WINNER: "Stop Losing Deals to Chaos" (Missed Deals)
- Highest CPI, but needs more exposure
- Both Missed Deals headlines outperform Tool Chaos on CPI

───────────────────────────────────────────────────────
VERDICT
───────────────────────────────────────────────────────
✅ HYPOTHESIS CONFIRMED

Missed Deals sub-angle outperforms Tool Chaos at the sub-angle level.
Both challengers are Hidden Gems worth scaling.

───────────────────────────────────────────────────────
LEARNINGS
───────────────────────────────────────────────────────
- Revenue/deal-focused pain resonates more than organization pain
- "Losing Deals" framing slightly better than "Missed Follow-Ups"
- Tool Chaos may work better in descriptions (lower stakes)

───────────────────────────────────────────────────────
ACTIONS
───────────────────────────────────────────────────────
🚀 PROMOTE: "Stop Losing Deals to Chaos"
🚀 KEEP TESTING: "No More Missed Follow-Ups"
⬇️ DEMOTE: "End Spreadsheet Chaos" (move to D2 or remove)

───────────────────────────────────────────────────────
NEXT HYPOTHESIS
───────────────────────────────────────────────────────
Test "Lost Revenue" vs "Missed Deals" framing within 
the Problem/Pain angle type.

═══════════════════════════════════════════════════════
```

> After a couple of months, you'll have a playbook of proven angles specific to your market that no competitor has.

---

### The Iteration Cycle

**Cadence:** Every 2-8 weeks (depending on your volumes)

```jsx
   Week 1:         Week 2:         Week 3:         Week 4:
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ DEPLOY   │ →  │ COLLECT  │ →  │ DIAGNOSE │ →  │ ITERATE  │
│          │    │  DATA    │    │          │    │          │
│New assets│    │Let tests │    │Quadrant  │    │Actions + │
│go live   │    │run       │    │analysis  │    │learning  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                                      │
                                                      ▼
                                                 ┌─────────┐
                                                 │  NEXT   │
                                                 │  CYCLE  │
                                                 └─────────┘
```

**Cycle checklist:**

- [ ]  Extract asset-level data for cluster
- [ ]  Calculate CPI/RPI and AIS for each asset
- [ ]  Aggregate by angle type and sub-angle
- [ ]  Plot quadrants
- [ ]  Identify Silent Killers → Remove
- [ ]  Identify Hidden Gems → Increase exposure
- [ ]  Document Champions
- [ ]  Update learning log
- [ ]  Generate hypotheses for next cycle (reference your 6-angle document)
- [ ]  Create new assets based on hypotheses
- [ ]  Deploy to cluster

---

### Validation & definition of done

#### Cycle completion criteria

Each iteration cycle is complete when:

- [ ]  All Silent Killers identified and removed
- [ ]  All Hidden Gems identified and exposure increased
- [ ]  Learning log updated with findings
- [ ]  Next cycle hypotheses documented
- [ ]  New assets deployed

#### Ongoing success metrics

Track these metrics over time:

| Metric | Target | Timeframe |
| --- | --- | --- |
| Cluster CPI/RPI | Improving trend | Quarter over quarter |
| Silent Killer count | Zero | Every cycle |
| Champion count | Increasing | Over time |
| Learning log entries | Growing | Every cycle |

> ⚠️ **This SOP never "ends":** The Iteration Loop is continuous optimization. Even mature accounts should run cycles to stay ahead of competition.

---

### Common failure modes

| Failure mode | Symptom | Root cause | Fix |
| --- | --- | --- | --- |
| **Data poverty** | Can't reach significance | Too many assets, too little traffic | Reduce to 7-8 headlines, aggregate across ad groups |
| **Random testing** | No clear learnings | Testing without hypotheses | Use hypothesis framework + 6-angle document |
| **CTR chasing** | High CTR, low conversions | Wrong metric | Switch to CPI/RPI |
| **Template drift** | Can't aggregate data | Ad groups have different structures | Enforce template consistency |
| **Template inconsistency** | Can't aggregate data | Different angle types in same slot across cluster | Enforce template: same slot = same angle type within cluster |
| **Silent killer blindness** | Declining CPI | Not running quadrant analysis | Run diagnosis phase every cycle |
| **Premature optimization** | Testing words before concepts | Asset-level tests before type-level | Start with angle type vs. type |
| **Learning amnesia** | Repeating failed tests | Not maintaining learning log | Document every test |
| **Weak angle foundation** | Nothing compelling to test | Skipped upstream SOPs | Return to Craft Your Offer Angles |

---

### Tools & Implementation

#### Manual implementation (Spreadsheets)

1. **Templatize:** Document template in a spreadsheet, manually apply to all ad groups
2. **Aggregate:** Export asset reports monthly, tag angle types, sum in pivot tables
3. **Diagnose:** Calculate CPI/AIS, plot quadrants manually
4. **Iterate:** Generate hypotheses in doc, create assets, deploy manually

✅ **Pros:** Free, full control

❌ **Cons:** Time-intensive, easy to miss cycles

#### Tool-assisted implementation (Loop AI or similar)

1. **Templatize:** Auto-apply templates across ad groups
2. **Aggregate:** Auto-import and angle type mapping
3. **Diagnose:** Live KPI + AIS quadrant dashboards
4. **Iterate:** AI generation with approval workflow, auto-push to Google Ads

✅ **Pros:** Scalable, consistent, faster cycles

❌ **Cons:** Tool dependency, cost

---

### FAQ

**Q: How often should I run cycles?**

A: Every 2-8 weeks for active optimization, dependent on your account’s volume.

**Q: How many assets should I test per cycle?**

A: 2-3 new assets per slot per cycle. More fragments your data.

**Q: What if I don't have enough traffic?**

A: Combine more ad groups into a single cluster, or extend cycle length to 8-12 weeks.

**Q: Should I still look at Google's asset labels?**

A: Only as a sanity check. Your CPI/RPI analysis is the source of truth.

**Q: How does this relate to Expected CTR?**

A: Expected CTR improvement is a byproduct. As you find better-converting assets, CTR typically improves too. But CPI/RPI is the goal, not CTR.

**Q: Can I run this alongside other tests (bid strategies, audiences)?**

A: Yes, but be aware of confounding factors. Creative testing is safest when other variables are stable.

**Q: Where do I get ideas for new assets to test?**

A: Your SOP – Craft Your Offer Angles document is your primary source. Each of the 6 angles can generate dozens of headline and description variations.

**Q: What if I'm struggling to come up with new hypotheses?**

A: Return to your 6-angle extraction. Review customer reviews, competitor ads, and sales team feedback. If your angles document is thin, you may need to revisit SOP – Create an Irresistible Offer.

**Q: What if my H7 varies by cluster because of traffic temperature?**

A: That's expected. Tag H7 by its actual angle type (e.g., "USP" or "Social Proof"), not by slot number. Aggregation works by angle type, not position. Just ensure consistency *within* each cluster.

**Q: Should I include D3 in my RSA?**

A: Only if you have authentic urgency (real deadlines, limited availability). D3 is optional. If you don't have genuine urgency, stick with D1-D2.

**Q: How does traffic temperature affect my testing priorities?**

A: Your traffic temperature (from [SOP – Craft Your Offer Angles](../sops/SOP – Craft Your Offer Angles.md)) tells you which angle types to prioritize for testing. Cold traffic clusters should prioritize Problem/Pain sub-angle tests. Hot traffic clusters should prioritize Social Proof and Risk Removal tests.

---

### Related documents

| Document | Relationship |
| --- | --- |
| [SOP – Create an Irresistible Offer](../sops/SOP – Create an Irresistible Offer.md)  | Foundational (offer must be solid) |
| [Headline Angle Catalog](../catalogs/Headline Angle Catalog.md) | Foundational (6 angles + traffic temperature feed your hypotheses) |
| [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md)  | Foundational (creates testing-ready RSA structure) |
| [Awareness Stage Mental Model](../mental-models/Awareness Stage Mental Model.md)  | Reference (traffic temperature context) |
| [Headline Angle Catalog](../catalogs/Headline Angle Catalog.md)  | Reference (7 angle types define your template) |
| [Description Expansion Catalog](../catalogs/Description Expansion Catalog.md)  | Reference (description patterns) |
| [Extension Leverage Catalog](../catalogs/Extension Leverage Catalog.md)  | Parallel (extension testing) |
| [SOP – Improve Ad Relevance](../sops/SOP – Improve Ad Relevance.md)  | Prerequisite |
| [SOP – Improve Expected CTR](../sops/SOP – Improve Expected CTR.md)  | Prerequisite / Parallel |
| [SOP – Improve Landing Page Experience](../sops/SOP – Improve Landing Page Experience.md)  | Parallel |
| [SOP – Run a Creative Testing Cycle](../sops/SOP – Run a Creative Testing Cycle.md) | Upstream (coordinates testing across Search, PMax, Demand Gen, Display) |

---

### Version details

- **Version:** 3.0
- **Last Updated:** January 2026
- **Creator:** Bob Meijer

---

### Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

© 2026 PPC Mastery B.V. All rights reserved.