# Headline Angle Catalog
Created: 2026-02-04
Updated: 2026-08-14

Support_ID: CATALOG_1
Status: Done
Category: Creative
Reference Type: Catalog
Agent_Readable: Yes
Human_Facing: Yes
Bucket: Creative
Domain: Creative
Pillar: 8

### Purpose

This catalog lists reusable **RSA headline angle patterns** used to compose competitive ads.

It covers different persuasion jobs: relevance, problem recognition, value, proof, risk, and more.

---

### What this is / What this is NOT

**This catalog:**

- Lists headline angle types and pattern templates
- Provides example headlines by vertical (Lead Gen, SaaS, Ecommerce)
- Includes key constraints (30 characters, standalone readability)

**This catalog does NOT:**

- Validate headline quality or completeness (see: [Headline Quality Checklist](../checklists/Headline Quality Checklist.md))
- Prescribe how many headlines to run or what to test next (belongs to SOPs)
- Provide step-by-step execution instructions
- Teach dynamic text setup (see: [Dynamic Text Reference](../references/Dynamic Text Reference.md))

---

## Headline fundamentals

### The 30-character constraint

Google allows 30 characters per headline. This forces precision.

| Character count | Verdict |
| --- | --- |
| 25-30 | ✅ Optimal (maximize real estate) |
| 20-24 | ⚠️ Acceptable (could be tighter) |
| <20 | ❌ Wasted space |

### Headlines work together

RSAs display 2-3 headlines in combination. Each headline should:

- Stand alone (make sense without context)
- Complement others (not repeat the same message)
- Cover different angles (relevance, benefit, proof, action)

---

## Static vs. Dynamic: Decision gate

Two inputs decide the approach:

| If … | Then use … | Reference … |
| --- | --- | --- |
| Value rarely changes | Static headline | This catalog |
| Price/inventory/promo changes | Ad Customizers | [Dynamic Text Reference](../references/Dynamic Text Reference.md) |
| Keyword variation needs | DKI or Keyword Customizers | [Dynamic Text Reference](../references/Dynamic Text Reference.md) |
| Time-limited offer with real deadline | Countdown Timer | [Dynamic Text Reference](../references/Dynamic Text Reference.md) |

→ For syntax, rules, and setup: See [Dynamic Text Reference](../references/Dynamic Text Reference.md)

→ For keyword-level customizer attributes: See [Keyword Ad Customizer Attribute Catalog](../catalogs/Keyword Ad Customizer Attribute Catalog.md)

→ For dynamic customizer attributes (price, inventory, promos): See [Dynamic Ad Customizer Attribute Catalog](../catalogs/Dynamic Ad Customizer Attribute Catalog.md)

> ⚠️ **This catalog focuses on angle patterns, not dynamic syntax:** The examples below are primarily static. Where dynamic variants are especially valuable, they're noted with a reference to the appropriate catalog.

---

## The 7 headline core types

Every RSA needs headlines across these seven types:

| Type | Purpose | Slot recommendation |
| --- | --- | --- |
| Relevance Anchor | Match the search query | H1 |
| Value Proposition | What you offer + main benefit | H2 |
| USP / Benefit | Why you're different/better | H3 |
| Social Proof | Why to trust you | H4 |
| Risk Removal | Lower the barrier | H5 |
| Call-to-Action | What to do next | H6 |
| Problem/Pain | Mirror the searcher's frustration | H7 variable slot |

Slot assignments match the template in [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md). Hold them fixed across every ad group in a testing cluster: aggregation depends on H3 carrying the same angle type everywhere.

> 💡 **The H7 variable slot.** H7 takes a second headline for the lead angle, chosen by traffic temperature. Cold traffic gets a second Problem/Pain headline, warm traffic a second USP or Value Proposition, hot traffic a second Social Proof or Risk Removal. Tag it by its actual angle type, never by its slot number, or the aggregation breaks.

---

## Writing headlines by type

## Type 1️⃣: Relevance anchor

**Purpose:** Signal to Google and the searcher that this ad matches their query.

#### Methods:

| Method | When to Use | Syntax |
| --- | --- | --- |
| **Static Anchoring** | Branded, sensitive, or complex terms | Hard-code the keyword |
| **Dynamic Keyword Insertion (DKI)** | High-volume, predictable keywords | `{KeyWord:Default Text}` |

#### Static anchoring patterns:

| Vertical | Headline | Chars |
| --- | --- | --- |
| Lead Gen | "Google Ads Agency” | 17 |
| SaaS | "Sales CRM Platform” | 18 |
| Ecommerce | "Premium Running Shoes” | 21 |

#### DKI usage note

**Syntax:** `{KeyWord:Default Text}`

**Rule:** Default text must be strong enough to stand alone.

- Bad: `{KeyWord:Our Products}` ← Too generic
- Good: `{KeyWord:CRM Software}` ← Specific fallback

→ For full DKI rules and capitalization options: See [Dynamic Text Reference](../references/Dynamic Text Reference.md)

---

## Type 2️⃣: Problem/Pain

**Purpose:** Mirror the searcher's frustration to create instant recognition.

**Formula:** `[Tired of / Stop / End / No More] + [Their Problem]`

**Alternative Formulas:**

- `[Thing] That Actually [Works]` (Implies current one doesn't)
- `[End/Fix/Solve] + [Specific Symptom]`
- `[Negative Outcome] + [No More]`

#### Lead Gen examples:

| Headline | Chars | Why it works |
| --- | --- | --- |
| "Tired of Unqualified Leads?" | 27 | Mirrors common frustration |
| "Stop Wasting Ad Spend" | 21 | Names the pain directly |
| "Leads That Actually Convert" | 27 | Implies current ones don't |
| "End the Agency Churn" | 20 | Specific B2B pain point |
| "No More Ghost Leads" | 19 | Vivid problem language |
| "Frustrated With Your CPA?" | 25 | Direct pain acknowledgment |

#### SaaS examples:

| Headline | Chars | Why it works |
| --- | --- | --- |
| "CRM Your Team Will Use" | 22 | Implies current one is ignored |
| "Stop Losing Deals to Chaos" | 26 | Names the consequence |
| "End Spreadsheet Chaos" | 21 | Specific problem recognition |
| "No More Missed Follow-Ups" | 25 | Common pain point |
| "Stop the 'Where's That?' Chaos" | 30 | Mirrors internal dialogue |
| "Finally, A CRM That Works" | 25 | Implies past disappointments |

#### Ecommerce examples:

| Headline | Chars | Why it works |
| --- | --- | --- |
| "Furniture That Actually Fits" | 28 | Implies past disappointments |
| "Skip the Assembly Headache" | 26 | Names common pain |
| "No More Delivery Nightmares" | 27 | Problem they've experienced |
| "End Showroom Sticker Shock" | 26 | Specific frustration |
| "Stop Guessing Your Size" | 23 | Fashion/apparel pain |
| "Supplements That Work" | 21 | Implies others don't |

> ⚠️ **Balance problem and solution language:** Your RSA should include BOTH problem-focused headlines (recognition) and solution-focused headlines (aspiration). Not every headline can be negative.

---

## Type 3️⃣: Value proposition

**Purpose:** Communicate what you offer and the primary benefit.

**Formula:** `[Specific Offer] + [Primary Benefit]` or `[Outcome] + [Without Pain Point]`

#### Lead Gen examples:

| Headline | Chars | Why it works |
| --- | --- | --- |
| "Grow Your Pipeline Fast" | 23 | Outcome-focused |
| "More Leads, Less Spend" | 22 | Benefit contrast |
| "Fill Your Sales Calendar" | 24 | Specific outcome |
| "Qualified Leads Delivered" | 25 | What + quality signal |
| "Scale Without Extra Staff" | 25 | Benefit + removes friction |

#### SaaS examples:

| Headline | Chars | Why it works |
| --- | --- | --- |
| "Close Deals 40% Faster" | 22 | Quantified benefit |
| "All-in-One Sales Platform" | 25 | Clarity + scope |
| "Never Miss a Follow-Up" | 22 | Pain point removal |
| "Your Pipeline, Organized" | 24 | Outcome + specificity |
| "Sell More, Manage Less" | 22 | Benefit contrast |

#### Ecommerce examples:

| Headline | Chars | Why it works |
| --- | --- | --- |
| "Designer Quality, Half Price" | 28 | Value + savings |
| "Premium Sofas From €999" | 23 | Product + price anchor |
| "Skip the Retail Markup" | 22 | Pain point removal |
| "Luxury Without the Price Tag" | 28 | Benefit + contrast |
| "Find Your Perfect Fit" | 21 | Outcome + personalization |

> ↪️ **Dynamic variant:** For dynamic pricing headlines, see [Dynamic Ad Customizer Attribute Catalog](../catalogs/Dynamic Ad Customizer Attribute Catalog.md).

---

## Type 4️⃣: Call-to-Action (CTA)

**Purpose:** Tell the searcher exactly what to do next.

**Formula:** `[Action Verb] + [Specific Outcome] + [Modifier]`

#### CTA strength hierarchy:

| Weak | Medium | Strong |
| --- | --- | --- |
| "Contact Us" | "Learn More" | "Get Your Free Quote" |
| "Submit" | "See Pricing" | "Start Free Trial Now" |
| "Click Here" | "Request Demo" | "Book Your Free Audit" |

#### Lead Gen examples:

| Headline | Chars | Intent match |
| --- | --- | --- |
| "Get Your Free Audit" | 19 | High-value lead magnet |
| "Book a Strategy Call" | 20 | Direct consultation |
| "Request a Custom Quote" | 22 | Price-focused intent |
| "Claim Your Free Report" | 22 | Content lead magnet |
| "See Available Time Slots" | 24 | Low-friction booking |

#### SaaS examples:

| Headline | **Chars** | Intent match |
| --- | --- | --- |
| "Start Your Free Trial" | 21 | Transactional |
| "Try Free for 14 Days" | 20 | Time-specific trial |
| "See It in Action" | 16 | Demo-focused |
| "Get Started in Minutes" | 22 | Speed + ease |
| "Create Your Free Account" | 24 | Sign-up focused |

#### Ecommerce examples:

| Headline | Chars | Intent match |
| --- | --- | --- |
| "Shop the Collection" | 19 | Browse intent |
| "Order Free Samples" | 18 | Low-commitment first step |
| "Find Your Size" | 14 | Personalization |
| "Build Your Custom Sofa" | 22 | Configurator |
| "Get 20% Off Today" | 17 | Offer + urgency |

> ↪️ **Dynamic variant:** For dynamic discount CTAs, see [Dynamic Ad Customizer Attribute Catalog](../catalogs/Dynamic Ad Customizer Attribute Catalog.md).

---

## Type 5️⃣: USP / Benefit

**Purpose:** Explain why you're different and why it matters.

**Formula:** `[Differentiator] + [Benefit]` or `[Unique Claim]`

#### Lead Gen examples:

| Headline | Chars | USP type |
| --- | --- | --- |
| "We Only Work With SaaS" | 22 | Specialization |
| "Results in 30 Days" | 18 | Speed |
| "No Long-Term Contracts" | 22 | Flexibility |
| "Avg 40% Lower CPA" | 17 | Quantified result |
| "Senior Experts Only" | 19 | Quality signal |

#### SaaS examples:

| Headline | Chars | USP type |
| --- | --- | --- |
| "Setup in 2 Minutes" | 18 | Speed/ease |
| "No Credit Card Needed" | 21 | Low friction |
| "Built for Remote Teams" | 22 | Audience-specific |
| "50+ Integrations" | 16 | Ecosystem |
| "AI Handles the Busywork" | 23 | Automation benefit |

#### Ecommerce examples:

| Headline | Chars | USP type |
| --- | --- | --- |
| "Delivered Assembled" | 19 | Convenience |
| "100+ Fabrics to Choose" | 22 | Customization |
| "Factory-Direct Pricing" | 22 | Value |
| "Ships Free Over €50" | 19 | Threshold benefit |
| "Handmade in Europe" | 18 | Origin/quality |

> ↪️ **Dynamic variant:** For dynamic shipping/stock USPs, see [Dynamic Ad Customizer Attribute Catalog](../catalogs/Dynamic Ad Customizer Attribute Catalog.md).

---

## Type 6️⃣: Social Proof

**Purpose:** Make claims believable through evidence.

**Formula:** `[Number/Rating] + [Context]` or `[Credential]`

#### Social Proof types:

| Type | Formula | Example |
| --- | --- | --- |
| User count | "Trusted by [#]+ [Audience]" | "Trusted by 50,000+ Teams" |
| Rating | "[Rating]/5 From [#]+ Reviews" | "4.8/5 From 2,000+ Reviews" |
| Volume | "[#]+ [Actions] Delivered" | "1M+ Campaigns Managed" |
| Authority | Category authority | "#1 Rated CRM on G2" |
| Named proof | "[Company] + [#] Others" | "Nike & 500+ Brands" |
| Credentials | "[Certification/Award]" | "Google Premier Partner" |
| Experience | "[#] Years of [Expertise]" | "10+ Years in B2B SaaS" |

#### Lead Gen examples:

| Headline | Chars | Proof type |
| --- | --- | --- |
| "Trusted by 500+ SaaS Cos" | 24 | Count + audience |
| "€50M+ in Managed Spend" | 22 | Volume |
| "Google Premier Partner" | 22 | Credential |
| "Avg 4.9/5 Client Rating" | 23 | Rating |
| "10+ Years in B2B" | 16 | Experience |

#### SaaS examples:

| Headline | Chars | Proof type |
| --- | --- | --- |
| "Trusted by 12,000+ Teams" | 24 | User count |
| "4.8/5 on G2 (2,400 Reviews)" | 27 | Rating + count |
| "G2 Leader, 3 Years Running" | 26 | Authority + duration |
| "Join Spotify & 10K+ Teams" | 25 | Named + count |
| "Award-Winning Platform" | 22 | Authority |

#### Ecommerce examples:

| Headline | Chars | Proof type |
| --- | --- | --- |
| "23,000+ Happy Customers" | 23 | Customer count |
| "4.7/5 (8,400 Reviews)" | 21 | Rating + count |
| "Best-Seller 3 Years Running" | 27 | Volume + duration |
| "As Seen in Vogue & GQ" | 21 | Media authority |
| "#1 in Customer Satisfaction" | 27 | Category authority |

> ⚠️ **Dynamic social proof is rarely necessary:** Ratings and review counts don't change frequently enough to justify the feed maintenance. Static works for most accounts.

---

## Type 7️⃣: Risk Removal

**Purpose:** Lower the barrier to action by addressing hesitation.

**Formula:** `[Guarantee/Trial] + [Terms]` or `[No X Required]`

#### Risk Removal types:

| Type | Formula | Example |
| --- | --- | --- |
| Satisfaction | "Love It or [Outcome]" | "Love It or Money Back" |
| Money-back | "[Period] Money Back" | "60-Day Money Back" |
| Free trial | "Try Free for [Period]" | "Try Free for 14 Days" |
| No commitment | "No [Barrier] Required" | "No Credit Card Required" |
| Easy exit | "Cancel [Ease]" | "Cancel Anytime" |

#### Lead Gen examples:

| Headline | Chars | Risk type |
| --- | --- | --- |
| "No Long-Term Commitment" | 23 | Easy exit |
| "Free Audit, No Obligation" | 25 | No commitment |
| "Month-to-Month Available" | 24 | Flexibility |
| "Satisfaction Guaranteed" | 23 | Guarantee |
| "Results or You Don't Pay" | 24 | Performance guarantee |

#### SaaS examples:

| Headline | Chars | Risk type |
| --- | --- | --- |
| "No Credit Card Required" | 23 | No commitment |
| "Cancel Anytime, No Fees" | 23 | Easy exit |
| "Free Forever Plan" | 17 | No commitment |
| "30-Day Money Back" | 17 | Money-back |
| "Try Before You Buy" | 18 | Trial |

#### Ecommerce examples:

| Headline | Chars | Risk type |
| --- | --- | --- |
| "100-Night Home Trial" | 20 | Extended trial |
| "Free Returns, Always" | 20 | Easy exit |
| "Love It or Full Refund" | 22 | Satisfaction |
| "10-Year Warranty Included" | 25 | Long-term guarantee |
| "Easy 60-Day Returns" | 19 | Specific return window |

---

## Urgency as a modifier

Urgency isn't a core angle. We see it as a **modifier** you can add to any headline type:

| Base Headline | + Urgency Modifier |
| --- | --- |
| "Start Your Free Trial" | "Start Your Free Trial `Today`" |
| "Get 20% Off" | "Get 20% Off `- Ends Friday`" |
| "Join 10,000+ Teams" | "Join 10,000+ Teams `This Month`" |

> 💡 **Use urgency sparingly:** If every headline screams urgency, none of them do.

> ↪️ **Dynamic urgency:** For countdown timer syntax, see [Dynamic Text Reference](../references/Dynamic Text Reference.md).

---

## Price headlines (situational)

For **transactional intent** searches (especially ecommerce), price can be a legitimate headline:

| Headline | Chars | When to use |
| --- | --- | --- |
| "From €29/Month" | 14 | SaaS with competitive pricing |
| "Premium Sofas From €999" | 23 | Ecommerce anchor pricing |
| "Save 40% Today" | 14 | Active promotion |
| "Free Plan Available" | 19 | Freemium SaaS |
| "50% Off First Month" | 19 | Subscription discount |

> 💡 **Only use price headlines if your price is competitive:** If you're premium-priced, lead with value instead.

> ↪️ For dynamic price headlines, see [Dynamic Ad Customizer Attribute Catalog](../catalogs/Dynamic Ad Customizer Attribute Catalog.md).

---

### Quick reference: Support library

| Document | Type | Used for |
| --- | --- | --- |
| [Headline Quality Checklist](../checklists/Headline Quality Checklist.md) | Checklist | Validates headlines after writing |
| [Dynamic Text Reference](../references/Dynamic Text Reference.md) | Reference | DKI, Countdown, Location syntax |
| [Keyword Ad Customizer Attribute Catalog](../catalogs/Keyword Ad Customizer Attribute Catalog.md) | Catalog | Keyword-level customizer attributes |
| [Dynamic Ad Customizer Attribute Catalog](../catalogs/Dynamic Ad Customizer Attribute Catalog.md) | Catalog | Price, inventory, promo attributes |

---

### Related SOPs

| SOP | Relationship |
| --- | --- |
| [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md) | Uses this catalog in Phase 1 |
| [SOP – Improve Ad Relevance](../sops/SOP – Improve Ad Relevance.md) | Uses Type 1 patterns in Phase 3.1 |
| [SOP – Improve Expected CTR](../sops/SOP – Improve Expected CTR.md) | Routes here for headline gaps |
| [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md) | Uses angle types for testing |

---

### Version details

- **Version:** 6.0
- **Last Updated:** August 2026
- **Creator:** Bob Meijer

---

### Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

© 2026 PPC Mastery B.V. All rights reserved.