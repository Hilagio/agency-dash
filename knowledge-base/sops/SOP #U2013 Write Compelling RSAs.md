# SOP – Write Compelling RSAs
Created: 2026-02-04

SOP_ID: SOP_5
Status: Done
Category: Creative
Primary Outcome: Deployed RSA with 7-8 headlines, 2-3 descriptions, testing-ready structure
Secondary Outcomes: Higher Expected CTR, improved Ad Rank, Iteration Loop-ready
Agent_Executable: No
Human_Approval_Required: No
Domain: Creative
Pillar: 8

### Purpose

This SOP assembles a complete, competitive **Responsive Search Ad** from documented offer angles.

> ❓ **The big question:** Do I have a testing-ready RSA that covers all necessary persuasion angles without causing data poverty?

This SOP is the **assembly layer:** It connects your prioritized angles to finished ad assets using the Support Library catalogs.

---

### What this SOP is NOT

This SOP does **not:**

- Design or fix your offer (See: [SOP – Create an Irresistible Offer](../sops/SOP – Create an Irresistible Offer.md))
- Extract or prioritize offer angles (See: [SOP – Craft Your Offer Angles](../sops/SOP – Craft Your Offer Angles.md))
- Fix ad relevance issues (See: [SOP – Improve Ad Relevance](../sops/SOP – Improve Ad Relevance.md))
- Test creative variations (See: [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md))
- Teach headline/description writing (See: [Headline Angle Catalog](../catalogs/Headline Angle Catalog.md), [Description Expansion Catalog](../catalogs/Description Expansion Catalog.md))

### When to run this SOP

Run this SOP when:

- Setting up a new Search campaign or ad group
- Refreshing creative after offer changes
- Rebuilding RSAs flagged for quality issues
- Expanding to new ad groups with documented angles

---

### Before you start

#### Required inputs

- Completed [SOP – Craft Your Offer Angles](../sops/SOP – Craft Your Offer Angles.md) with:
    - Traffic temperature classification
    - Angle priorities set
    - 6 angles documented with proof points
    - Slot distribution mapped
- Target ad group identified
- Keyword list for the ad group
- Access to Google Ads Editor or UI

#### Reference documents (have open)

| Document | Used for |
| --- | --- |
| Your Offer Angles document | Proof points for each angle |
| [Headline Angle Catalog](../catalogs/Headline Angle Catalog.md) | Headline patterns by type |
| [Description Expansion Catalog](../catalogs/Description Expansion Catalog.md) | Description patterns |
| [Extension Leverage Catalog](../catalogs/Extension Leverage Catalog.md) | Extension options |
| [Dynamic Text Reference](../references/Dynamic Text Reference.md) | If using dynamic text |

---

### Decision gate: Static vs. Dynamic RSA

Before assembling, determine your approach:

| If... | Then... | Additional setup |
| --- | --- | --- |
| **Ecommerce with dynamic pricing/inventory** | Plan for Ad Customizers from the start | [SOP – Set Up Dynamic Ad Customizers](../sops/SOP – Set Up Dynamic Ad Customizers.md) |
| **High keyword variation needing relevance control** | Consider keyword-level customizers | [SOP – Set Up Keyword-Level Ad Customizers](../sops/SOP – Set Up Keyword-Level Ad Customizers.md) |
| **Time-limited promotions with real deadlines** | Use countdown timers | [Dynamic Text Reference](../references/Dynamic Text Reference.md) |
| **Lead Gen / SaaS with stable offers** | Static RSA is sufficient | This SOP only |

> 💡 **Ecommerce accounts:** If you have dynamic pricing, rotating promotions, or inventory-based messaging, set up your customizer feeds *before* writing headlines. Your RSA syntax depends on those attribute names.

**Decision flow:**

```
Is pricing/inventory dynamic?
│
├─ YES → Set up customizer feeds first → Return here
│
└─ NO → Do keywords need granular relevance control?
         │
         ├─ YES → Set up keyword-level customizers → Return here
         │
         └─ NO → Proceed with static RSA
```

---

### Why 7-8 headlines (not 15)

More headlines = more combinations = less data per combination = slower learning.

| # Headlines | # 3-Headline combinations | Min. impressions needed |
| --- | --- | --- |
| 6 | 120 | 12,000 |
| 8 | 336 | 33,600 |
| 15 | 2,730 | 273,000 |

**This SOP targets 7-8 headlines and 2-3 descriptions.** 

This provides enough variety for Google to optimize while generating actionable data for the Iteration Loop (See [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md).

---

### Execution framework

| Phase | Purpose | Output |
| --- | --- | --- |
| **Phase 1️⃣: Headlines** | Compose 7-8 headlines covering prioritized angles | 7-8 validated headlines |
| **Phase 2️⃣: Descriptions** | Compose 2-3 descriptions that expand without repeating | 2-3 validated descriptions |
| **Phase 3️⃣: Extensions** | Select and compose relevant extensions | Complete extension package |
| **Phase 4️⃣: Deploy** | Upload assets and configure settings | Live RSA |

---

## Phase 1️⃣: Compose headlines

### 1.1 Slot distribution

Your [SOP – Craft Your Offer Angles](../sops/SOP – Craft Your Offer Angles.md) output includes a slot distribution. Use this standard template:

| Slot | Headline type | Purpose |
| --- | --- | --- |
| H1 | **Relevance Anchor** | Match the search query |
| H2 | **Value Proposition** | Core offer + main benefit |
| H3 | **USP / Benefit** | Why you're different |
| H4 | **Social Proof** | Trust + credibility |
| H5 | **Risk Removal** | Lower barrier to action |
| H6 | **Call-to-Action** | What to do next |
| H7 | **[Lead Angle x2]** | Second slot for priority angle |
| H8 | **(Optional)** | Only if high-volume ad group |

**H7 assignment by traffic temperature:**

| Traffic | H7 should be |
| --- | --- |
| ❄️ Cold | Problem/Pain (second variation) |
| 🌤️ Warm | USP or Value Prop (second variation) |
| 🔥 Hot | Social Proof or Risk Removal (second variation) |

### 1.2 Write headlines

For each slot, apply your proof points using patterns from the [Headline Angle Catalog](../catalogs/Headline Angle Catalog.md).

#### H1: Relevance Anchor

| Method | When to use | Reference |
| --- | --- | --- |
| Static | Branded, sensitive, controlled | [Headline Angle Catalog](../catalogs/Headline Angle Catalog.md) → Type 1 |
| DKI | Extensive keyword lists | [Dynamic Text Reference](../references/Dynamic Text Reference.md) |
| Keyword-level customizers | Need granular relevance control | [SOP – Set Up Keyword-Level Ad Customizers](../sops/SOP – Set Up Keyword-Level Ad Customizers.md) |

**If using DKI:** Default text must stand alone. 

Bad: `{KeyWord:Products}`. Good: `{KeyWord:CRM Software}`.

#### H2-H7: Angle headlines

For each remaining slot:

1. **Identify the angle type** from the slot distribution
2. **Pull your proof point** from your Offer Angles document
3. **Find a pattern** in the [Headline Angle Catalog](../catalogs/Headline Angle Catalog.md) (Type 2-7)
4. **Apply your proof point** to the pattern
5. **Verify ≤30 characters**

**If using dynamic pricing/promos (Ecommerce):**

| Angle type | Static example | Dynamic alternative |
| --- | --- | --- |
| Value Prop | "Premium Sofas From €999" | "`{CUSTOMIZER.ProductName:Sofas}` From `{CUSTOMIZER.PriceFrom:€999}`" |
| CTA | "Get 20% Off Today" | "Get `{CUSTOMIZER.Discount:20%}` Off Today" |
| Urgency | "Sale Ends Friday" | "Sale Ends `{COUNTDOWN(date):Soon}`" |

See [Dynamic Text Reference](../references/Dynamic Text Reference.md) for full attribute list.

#### CTA tone by traffic temperature

| Traffic | CTA tone | Examples |
| --- | --- | --- |
| ❄️ Cold | Soft, educational | "See How It Works", "Learn More" |
| 🌤️ Warm | Medium, exploratory | "Get Your Free Demo", "Compare Plans" |
| 🔥 Hot | Direct, transactional | "Start Free Trial", "Get Started Now" |

### 1.3 Validate headlines

Run all headlines through the [Headline Quality Checklist](../checklists/Headline Quality Checklist.md).

### 1.4 Headline worksheet

| Slot | Angle type | Your headline | Chars |
| --- | --- | --- | --- |
| H1 | Relevance Anchor |  | /30 |
| H2 | Value Proposition |  | /30 |
| H3 | USP / Benefit |  | /30 |
| H4 | Social Proof |  | /30 |
| H5 | Risk Removal |  | /30 |
| H6 | Call-to-Action |  | /30 |
| H7 | [Lead angle x2] |  | /30 |
| H8 | [Optional] |  | /30 |

---

## Phase 2️⃣: Compose descriptions

### 2.1 Description strategy

Descriptions **expand on headlines:** They don't repeat them.

**Target: 2-3 descriptions**

| Slot | Pattern | Purpose |
| --- | --- | --- |
| D1 | **Problem + Solution** | Validate pain, present your answer |
| D2 | **Proof + CTA** | Build trust, drive action |
| D3 | **(Optional) Offer + Urgency** | Promotion details + deadline |

> 💡 **Include core keyword in D1:** Google bolds text matching the search query. **More bold = more visual prominence.**

### 2.2 Write descriptions

For each slot, use patterns from the [Description Expansion Catalog](../catalogs/Description Expansion Catalog.md).

#### D1: Problem + Solution

**Pattern:** `[Problem acknowledgment]. [Your solution + benefit].`

Find examples in [Description Expansion Catalog](../catalogs/Description Expansion Catalog.md) → Section A, Type 1.

#### D2: Proof + CTA

**Pattern:** `[Proof point/social proof]. [CTA with benefit].`

Find examples in [Description Expansion Catalog](../catalogs/Description Expansion Catalog.md) → Section B, Pattern 3.

#### D3: Offer + Urgency (Optional)

**Pattern:** `[Offer details]. [Deadline/scarcity].`

> ⚠️ **Only include D3 if you have authentic urgency:** Fake scarcity damages trust. No real deadline? Skip D3 or use pure risk removal.

**If using dynamic promos (Ecommerce):**

| Static | Dynamic |
| --- | --- |
| "Sale ends Sunday: 20% off + free shipping". | "`{CUSTOMIZER.PromoText:Sale}`: `{CUSTOMIZER.Discount:15%}` off. Ends `{COUNTDOWN(date):soon}`". |

See [Description Expansion Catalog](../catalogs/Description Expansion Catalog.md) → Section B for combined patterns with dynamic variants.

### 2.3 Validate descriptions

Run all descriptions through the [Description Quality Checklist](../checklists/Description Quality Checklist.md).

### 2.4 Description worksheet

| Slot | Pattern | Your description | Chars |
| --- | --- | --- | --- |
| D1 | Problem + Solution |  | /90 |
| D2 | Proof + CTA |  | /90 |
| D3 | Offer + Urgency (optional) |  | /90 |

---

## Phase 3️⃣: Compose extensions

### 3.1 Select extension types

Use the [Extension Leverage Catalog](../catalogs/Extension Leverage Catalog.md) to identify which extensions to create.

**Core extensions (required):**

| Extension | Minimum | Purpose |
| --- | --- | --- |
| Sitelinks | 4 | Navigate to key pages |
| Callouts | 4 | Highlight benefits/features |
| Structured Snippets | 2 headers | Categorize offerings |
| Business Name | 1 | Brand identity |
| Business Logo | 1 | Visual recognition |

**Situational extensions:**

| Extension | Best for | Skip if |
| --- | --- | --- |
| Image | All | No quality images |
| Promotion | Active sales | No real promotion |
| Price | Competitive/transparent pricing | Complex pricing |
| Call | Phone leads valuable | No phone support |
| Location | Local businesses | National/digital only |
| Lead Form | Testing in-ad capture | Complex qualification |

### 3.2 Compose extensions

Use patterns from the [Description Expansion Catalog](../catalogs/Description Expansion Catalog.md).

**Key principle:** Extensions add information. They don't duplicate RSA content.

**Sitelink strategy (cover different intents):**

| Intent | Example |
| --- | --- |
| Learn | "How It Works" |
| Compare | "See Pricing" |
| Trust | "Case Studies" |
| Try | "Free Demo" |

**Callout strategy (cover different benefits):**

| Category | Example |
| --- | --- |
| Trust | "Google Premier Partner" |
| Value | "Free Consultation" |
| Speed | "Same-Day Response" |
| Risk | "No Contracts" |

### 3.3 Validate extensions

Run through the [Extension Coverage Checklist](../checklists/Extension Coverage Checklist.md).

---

## Phase 4️⃣: Deploy & configure

### 4.1 Upload assets

1. Open Google Ads Editor or UI
2. Navigate to target ad group
3. Create new Responsive Search Ad
4. Enter all headlines
5. Enter all descriptions
6. Set Final URL
7. Add display path

### 4.2 Pinning decisions

> ⚠️ **Default: Don't pin:** Pinning restricts Google's optimization. Only pin when you have a strong structural reason.

| When to pin | Action |
| --- | --- |
| Relevance anchor must always show | Pin H1 to Position 1 |
| Legal/compliance requirement | Pin required text |
| Brand guideline | Pin brand message to Position 1 or 2 |

| When NOT to pin | Why |
| --- | --- |
| "I want this headline to show more" | Let Google optimize |
| "This is my best headline" | Test it, don't assume |
| "I want control" | Pinning usually hurts performance |

### 4.3 Add extensions

Navigate to Ads & Assets → Assets and add extensions at appropriate levels:

| Level | What to add |
| --- | --- |
| Account | Business name, logo, universal sitelinks |
| Campaign | Campaign-specific extensions |
| Ad Group | Theme-specific extensions (if needed) |

### 4.4 Final checklist

- [ ]  All headlines entered correctly
- [ ]  All descriptions entered correctly
- [ ]  Final URL correct
- [ ]  Display path set
- [ ]  Pins applied only where necessary
- [ ]  Extensions attached
- [ ]  Save and publish
- [ ]  Monitor approval (1-2 business days)

---

### Validation & definition of done

This SOP is complete when:

- [ ]  7-8 headlines composed and validated
- [ ]  2-3 descriptions composed and validated
- [ ]  All core extensions composed and validated
- [ ]  RSA uploaded and submitted for review
- [ ]  All assets approved (no disapprovals)

---

### Exit → Entry bridge

Once RSA is live and approved:

| Timeframe | Action |
| --- | --- |
| Days 1-7 | Monitor approval status, fix any disapprovals |
| Days 7-14 | Monitor initial performance (CTR, conversions) |
| Day 14+ | Begin [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md) |

**If issues arise:**

| Issue | Route to |
| --- | --- |
| Ad Relevance = Below Average | [SOP – Improve Ad Relevance](../sops/SOP – Improve Ad Relevance.md) |
| Expected CTR = Below Average | [SOP – Improve Expected CTR](../sops/SOP – Improve Expected CTR.md) |
| LP Experience = Below Average | [SOP – Improve Landing Page Experience](../sops/SOP – Improve Landing Page Experience.md) |

---

### FAQ

**Q: Why 7-8 headlines instead of the maximum 15?**

A: More headlines = more combinations = less data per combination = slower learning. With 15 headlines, Google creates 2,730 possible 3-headline combinations. You'd need ~273,000 impressions for meaningful data. With 8 headlines, you need ~33,600. Start lean, experiment with headlines through the Iteration Loop once you have performance data.

**Q: Should I always pin H1?**

A: By default, no. Pin H1 only if your relevance anchor *must* appear in every ad (brand guidelines, compliance, or critical relevance signal). If you're unsure, don't pin and let Google optimize. You can always add pins later if data shows a need.

**Q: What if I don't have proof points for all 6 angles?**

A: Go back to [SOP – Craft Your Offer Angles](../sops/SOP – Craft Your Offer Angles.md). If you genuinely can't find proof for an angle (e.g., no social proof exists), skip that slot and double up on your strongest angle. But even better: Run this SOP: [SOP – Create an Irresistible Offer](../sops/SOP – Create an Irresistible Offer.md).

**Q: Can I use the same RSA across multiple ad groups?**

A: No, not literally as you’ll sacrifice relevance. To prepare for ad copy testing, you should ideally templatelize your RSAs when applicable. (See: [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md)).

**Q: Should I write descriptions before or after headlines?**

A: After. Headlines establish your core messages. Descriptions expand on those messages. If you write descriptions first, you risk repetition or misalignment.

**Q: What's the minimum viable RSA if I'm short on time?**

A: 6 headlines (one per core angle) + 2 descriptions + 4 sitelinks + 4 callouts. This is the floor. Anything less and you're handicapping performance.

---

### Quick reference: Support library

| Document | Type | Used in |
| --- | --- | --- |
| [SOP – Craft Your Offer Angles](../sops/SOP – Craft Your Offer Angles.md) | SOP | Prerequisite |
| [Headline Angle Catalog](../catalogs/Headline Angle Catalog.md) | Catalog | Phase 1 |
| [Headline Quality Checklist](../checklists/Headline Quality Checklist.md) | Checklist | Phase 1 |
| [Description Expansion Catalog](../catalogs/Description Expansion Catalog.md) | Catalog | Phase 2 |
| [Description Quality Checklist](../checklists/Description Quality Checklist.md) | Checklist | Phase 2 |
| [Extension Leverage Catalog](../catalogs/Extension Leverage Catalog.md) | Catalog | Phase 3 |
| [Extension Coverage Checklist](../checklists/Extension Coverage Checklist.md) | Checklist | Phase 3 |
| [Dynamic Text Reference](../references/Dynamic Text Reference.md) | Reference | If using dynamic |
| [Keyword Ad Customizer Attribute Catalog](../catalogs/Keyword Ad Customizer Attribute Catalog.md) | Catalog | If using keyword customizers |
| [Dynamic Ad Customizer Attribute Catalog](../catalogs/Dynamic Ad Customizer Attribute Catalog.md) | Catalog | If using dynamic customizers |

---

### Related SOPs

| SOP | Relationship |
| --- | --- |
| [SOP – Create an Irresistible Offer](../sops/SOP – Create an Irresistible Offer.md) | Upstream (offer must be solid) |
| [SOP – Craft Your Offer Angles](../sops/SOP – Craft Your Offer Angles.md) | Upstream (prerequisite) |
| [SOP – Improve Ad Relevance](../sops/SOP – Improve Ad Relevance.md) | Parallel (if relevance issues) |
| [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md) | Downstream (ongoing optimization) |
| [SOP – Set Up Keyword-Level Ad Customizers](../sops/SOP – Set Up Keyword-Level Ad Customizers.md) | Conditional (if needed) |
| [SOP – Set Up Dynamic Ad Customizers](../sops/SOP – Set Up Dynamic Ad Customizers.md) | Conditional (if needed) |

---

### Common failures

| Failure | Why it happens | How to avoid |
| --- | --- | --- |
| Too many headlines (15) | Followed old best practices | Stick to 7-8 |
| All headlines same angle | Didn't follow slot structure | One headline per angle type |
| Descriptions repeat headlines | Copy-paste mentality | Descriptions expand, not repeat |
| Weak DKI default | Rushed setup | Default must stand alone |
| Wrong CTA tone | Ignored traffic temperature | Match CTA to awareness stage |
| Pinned everything | Wanted "control" | Pin only H1 if anything |
| Skipped extensions | Ran out of time | Extensions are required |
| Started with customizers before feeds ready | Eager to personalize | Set up feeds first, then write RSA |

---

### Version details

- **Version:** 4.0
- **Last Updated:** January 2026
- **Creator:** Bob Meijer

---

### Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

© 2026 PPC Mastery B.V. All rights reserved.