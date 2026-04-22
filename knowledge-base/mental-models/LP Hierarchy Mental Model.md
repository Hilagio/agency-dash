# LP Hierarchy Mental Model
Created: 2026-02-04
Updated: 2026-04-02

Support_ID: MENTALMODEL_16
Status: Done
Category: Strategic
Reference Type: Mental Model
Agent_Readable: Yes
Human_Facing: Yes
Domain: Landing Pages
Pillar: 2

## Purpose

This mental model provides the information architecture for landing pages: which sections to include, in what order, and what psychological question each section must answer.

> ❓ **The core question:** What is the optimal sequence of information on a landing page to move a visitor from "just arrived" to "converted"?

The hierarchy follows the natural psychology of buying decisions. Each section builds on the previous one. Skip a section and conversions leak.

---

## What this is NOT

This mental model does **not:**

- Explain the full landing page creation methodology (See: [Conversion Amplifier Mental Model](../mental-models/Conversion Amplifier Mental Model.md))
- Provide specific copywriting examples or formulas (See: [LP Section Catalog](../catalogs/LP Section Catalog.md), [LP Headline Catalog](../catalogs/LP Headline Catalog.md), [LP CTA Catalog](../catalogs/LP CTA Catalog.md))
- Cover A/B testing for section order or content (See: [Testing and Experimentation Mental Model](../mental-models/Testing and Experimentation Mental Model.md))
- Explain design implementation (covered in Step 4 of [Conversion Amplifier Mental Model](../mental-models/Conversion Amplifier Mental Model.md))
- Apply to ecommerce pages: ecommerce has its own standalone framework (See: [Ecommerce Conversion Engine Mental Model](../mental-models/Ecommerce Conversion Engine Mental Model.md))

---

## The 7-Section Hierarchy Blueprint

| # | Section | Visitor's question | Goal | Position |
|---|---------|-------------------|------|----------|
| 1 | **Hero** | What exactly is being offered? | Capture attention, communicate core value, establish relevance | Above the fold |
| 2 | **Benefits** | How will this help me? | Show outcomes and transformation, connect to desires | First scroll |
| 3 | **Trust/Authority** | Why should I believe you? | Establish credibility through credentials, certifications, expertise | After benefits |
| 4 | **Social Proof** | What do others say about this? | Provide third-party validation through testimonials, case studies, statistics | After trust |
| 5 | **Objection Handling** | What if it doesn't work? | Remove mental friction, address doubts, provide guarantees | Middle of page |
| 6 | **Urgency/Scarcity** | Why should I act now? | Create legitimate FOMO, time-based or supply-based pressure | Before final CTA |
| 7 | **Call to Action** | What should I do next? | Provide clear direction, reinforce value, trigger conversion | Repeated throughout + final |

> 💡 **The sections follow a psychological progression:** Trust must be established before social proof is effective (you believe peers only after you believe the source). Objections must be handled before urgency makes sense (pressure on an unconvinced visitor causes bounces, not conversions).

---

## Section 1: Hero

The hero section makes or breaks the page. 80% of visitors decide whether to stay based on the hero section alone. You have 3-5 seconds to capture attention.

### Required elements

| Element | Purpose | Guidelines |
|---------|---------|-----------|
| **Primary headline** | Communicate core value proposition | Under 10 words, outcome-focused, no jargon, instantly understandable |
| **Supporting sub-headline** | Expand on the headline with specifics | Under 2 sentences, add context or specificity, don't repeat the headline |
| **Visual element** | Reinforce the message | Product shot, transformation image, or demo video. Never generic stock photos |
| **Primary CTA** | Tell the visitor what to do | Benefit-driven text, contrasting color, prominently placed |

### Optional elements

- **Microcopy** near CTA: Risk removal ("No credit card required"), social proof ("Join 10K+ marketers"), or trust ("Rated 4.8/5")
- **Secondary CTA:** Lower-commitment alternative ("Download 2 free chapters" when primary is "Buy now"). Use sparingly.
- **Anchor navigation:** Links to sections on the same page

### Hero section mistakes

- Vague headlines that don't communicate value ("Welcome to Our Platform")
- Overloading with too much information above the fold
- Focusing on features instead of outcomes
- Generic stock images or AI-generated visuals that don't reinforce the message
- Hiding the value proposition below the fold
- Missing message match with the ad that drove the click

---

## Section 2: Benefits

Benefits answer "what's in it for me?" People buy dream outcomes, not specifications.

### Features vs. benefits

| | Features | Benefits |
|--|----------|----------|
| **What it is** | Factual description of capability | How the capability improves the visitor's life |
| **Example** | "Bluetooth 5.0 connectivity" | "Work comfortably for hours without ear pain" |
| **Focus** | The product | The visitor |

### Three benefit angles

Combine these for maximum impact:

| Angle | Focus | Example |
|-------|-------|---------|
| **Functional** | Time, cost, ease, results | "Save 5 hours per week on reporting" |
| **Business** | Efficiency, resources, compliance | "Reduce customer acquisition costs by 30%" |
| **Personal** | Stress, confidence, recognition | "Stop worrying about campaign performance at 2am" |

### Frameworks for finding benefits

- **FAB (Feature → Advantage → Benefit):** "24/7 support" → "Get help anytime" → "Never be stuck with an issue, even at midnight"
- **"So what?" technique:** Keep asking "So what?" until you reach the true emotional benefit. "CRM integrates with Gmail" → So what? → "See customer data while reading emails" → So what? → "Personalized service without extra work" → So what? → "Higher customer satisfaction and retention" (that's the benefit)

---

## Section 3: Trust/Authority

Trust must be established before social proof is effective. Visitors need to believe you before they'll believe what others say about you.

### Two types of trust elements

| Type | Purpose | Examples |
|------|---------|---------|
| **Institutional trust** | Prove the business is legitimate | ISO certifications, SOC 2 compliance, GDPR badges, security indicators, industry associations |
| **Expertise trust** | Prove knowledge and capability | Awards, media mentions, professional credentials, thought leadership, specific results ("43% average ROI increase") |

**Which to emphasize depends on vertical:**

- **Regulated industries** (finance, health, legal): Lead with institutional trust
- **Service/consulting** (marketing, tech): Lead with expertise trust
- **B2C products:** Balance both: institutional trust for safety, expertise for credibility

### Trust element rules

- Be specific: "SOC 2 Type 2 certified" beats "We can be trusted"
- Back up claims: "43% average ROI increase in 90 days" must link to supporting data
- Use real credentials: Fake or obscure awards hurt more than help

---

## Section 4: Social Proof

Social proof taps into the human tendency to look to others for guidance. It answers: "Do others like this?"

### Five types of social proof

| Type | What it is | When to use |
|------|-----------|-------------|
| **Testimonials** | Direct quotes from customers | Always: specific results, before/after, objection handling |
| **Case studies** | Detailed success stories | Complex solutions, high-ticket offers, B2B |
| **Statistical proof** | Numbers showing scale and effectiveness | "Used by 50K businesses", "99.9% uptime" |
| **Expert endorsements** | Recognition from industry authorities | When relevant experts exist and are recognizable |
| **Third-party validation** | Ratings from external platforms (G2, Capterra, Trustpilot) | SaaS, services, any product with external reviews |

### Social proof rules

- **Real and verifiable:** Full names, photos, company names, links to profiles. Anonymous testimonials create suspicion.
- **Specific:** "Best course ever" is weak. "Generated 253% more conversions in 90 days" is strong.
- **Unpolished when appropriate:** "Ugly proof" (screenshots, real chat messages, raw data) acts as scroll-stoppers and feels authentic.
- **Matched to visitor segment:** Show testimonials from peers. Agency testimonials for agency visitors, freelancer testimonials for freelancers.

---

## Section 5: Objection Handling

Even the most interested visitors have doubts. Address them proactively before they become conversion barriers.

### Common objection types

| Objection type | Visitor's concern | Handling technique |
|---------------|-------------------|-------------------|
| **Price** | "It's too expensive" | ROI demonstrations, payment plans, cost-of-inaction framing, value stacking, price anchoring |
| **Value** | "Is it worth it?" | Specific results, comparison tables, case studies with ROI |
| **Implementation** | "It's too complicated" | Process clarifications, step-by-step visuals, support commitments |
| **Timing** | "Not the right time" | Cost of inaction, deadline-driven events, progressive deadlines |
| **Trust** | "Can I believe these claims?" | Verifiable social proof, guarantees, expert endorsements |
| **Fit** | "Is this right for my situation?" | Segment-matched testimonials, case studies from similar businesses |

### Five objection handling techniques

| Technique | What it does | Example |
|-----------|-------------|---------|
| **Guarantee statements** | Remove fear of loss through risk reversal | "60-day money-back guarantee, no questions asked" |
| **FAQ sections** | Address common concerns in Q&A format | Pricing, implementation, timeline, commitment questions |
| **Value framing** | Reposition price against value or alternatives | ROI calculators, comparison tables, value stacks |
| **Process clarifications** | Remove complexity fears with clear steps | "Step 1: Upload photos (5 min). Step 2: AI processes (2 hrs). Step 3: Download (5 min)" |
| **Specific testimonials** | Use social proof that directly addresses the objection | Place testimonial about implementation ease next to "how it works" section |

### Guarantee guidelines

- Be specific: "60-day, no-risk guarantee" beats "satisfaction guaranteed"
- Make the claim process simple and transparent
- Don't hide limitations in fine print
- Place guarantees near conversion points

---

## Section 6: Urgency/Scarcity

Urgency and scarcity answer "why act now?" Even convinced visitors delay action without a clear reason.

### Urgency vs. scarcity

| | Urgency | Scarcity |
|--|---------|---------|
| **Based on** | Time | Supply |
| **Mechanism** | Limited window of opportunity | Limited quantity or availability |
| **Creates** | Sense that delay = permanent loss | Sense that hesitation = missing out |

### Urgency techniques

| Technique | How it works | Example |
|-----------|-------------|---------|
| **Limited time offers** | Special pricing for a defined period | "60% off for the next 37 hours" |
| **Deadline-driven events** | Tied to specific dates | "Masterclass starts June 10th, registration closes Friday" |
| **Progressive deadlines** | Decreasing benefits over time | "Early bird: €200. After May 15: €249. After May 25: €299" |
| **Time-sensitive bonuses** | Extra value that disappears | "First 25 buyers get a 1-on-1 coaching call" |

### Scarcity techniques

| Technique | How it works | Example |
|-----------|-------------|---------|
| **Limited quantity** | Genuine supply or capacity constraints | "Only 8 spots left in the June cohort" |
| **Exclusive access** | Available to a select group only | "Waitlist only: we onboard 5 new clients per month" |
| **Offer exclusivity** | Elements only for specific segments | "Founding member pricing locked for life, increases for new members after July 1" |

### Critical rules

- Only use legitimate techniques. Fake countdown timers and artificial scarcity destroy trust.
- Explain why the limitation exists (builds credibility)
- Establish value and trust before introducing urgency (urgency on an unconvinced visitor causes bounces)
- Use specific dates and numbers, not "expires soon" or "limited availability"

---

## Section 7: Call to Action

The CTA is the final trigger. It must provide clear direction at the moment of decision.

### CTA principles

| Principle | Guidance |
|-----------|---------|
| **Value-focused** | Emphasize what visitors get, not what they do: "Get my free assessment" not "Submit" |
| **Specific** | Include what happens next: "Schedule my free 15-minute consultation" not "Schedule now" |
| **First-person** | "Start my free trial" creates psychological ownership vs. "Start your free trial" |
| **Contrasting** | CTA button must visually pop against the background |
| **Repeated** | Place CTAs after key persuasion points throughout the page, not just at the bottom |

### CTA placement strategy

Place CTAs near specific conversion elements for maximum impact:

| Placement | Pair with | Purpose |
|-----------|----------|---------|
| Hero section | Core value proposition | Capture ready-to-act visitors immediately |
| After benefits | Value reinforcement | Convert visitors sold on outcomes |
| After social proof | Credibility reminder | Convert visitors sold on trust |
| After objection handling | Guarantee statement | Convert visitors whose doubts are now resolved |
| After urgency/scarcity | Deadline reminder | Convert visitors who need a push |
| Final section | Full value recap | Last chance conversion |

### Microcopy around CTAs

Add small supporting text near CTAs to reinforce conversion:

- Risk removal: "No credit card required", "Cancel anytime"
- Social proof: "Join 10K+ marketers", "Rated 4.8/5 by 2,300 users"
- Urgency: "Only 7 spots left", "Offer ends in 14 hours"
- Value: "Includes all 300 templates", "Save €200 today"

---

## Practical application

### Hierarchy by awareness level

| Awareness | Hero emphasis | Benefits emphasis | Trust depth | Social proof volume | Objection handling | Urgency level |
|-----------|-------------|------------------|------------|-------------------|--------------------|--------------|
| **Most Aware** | Direct offer, pricing | Minimal (they know) | Light | Light | Minimal | Strong |
| **Product Aware** | Key differentiators | Moderate | Moderate | Heavy (proof they need) | Moderate | Moderate |
| **Solution Aware** | Outcome-focused | Heavy | Heavy | Heavy | Heavy (vs alternatives) | Moderate |
| **Problem Aware** | Problem agitation | Heavy (education needed) | Heavy | Heavy | Heavy | Light |
| **Unaware** | Problem introduction | Educational first | Heavy | Moderate | Light | Light |

### Long-form vs. short-form pages

| Factor | Long-form | Short-form |
|--------|-----------|-----------|
| **Awareness level** | Lower awareness (need education) | Higher awareness (ready to act) |
| **Price point** | Higher (need justification) | Lower (impulse-friendly) |
| **Complexity** | Complex solution | Simple product |
| **All 7 sections** | Yes, fully developed | Condensed: Hero + proof + CTA may suffice |

---

## Key principles

1. **Follow the psychological sequence:** Each section answers the visitor's next natural question. Disrupting the order creates friction.
2. **Hero section wins or loses the page:** Invest disproportionate effort in the first thing visitors see.
3. **One page, one goal:** Every element either drives conversion or is a leak. Remove everything else.
4. **Trust before proof, proof before pressure:** Establish credibility, then validate with others, then create urgency.
5. **Match the page to the traffic:** Different awareness levels need different section emphasis and page lengths.

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Conversion Amplifier Mental Model](../mental-models/Conversion Amplifier Mental Model.md) | This hierarchy is Step 2 of the Conversion Amplifier Framework |
| [Google Ads Success Formula Mental Model](../mental-models/Google Ads Success Formula Mental Model.md) | Landing pages are Pillar 2 in the formula |
| [Awareness Stage Mental Model](../mental-models/Awareness Stage Mental Model.md) | Maps awareness levels to messaging and page approaches |
| [LP Section Catalog](../catalogs/LP Section Catalog.md) | Content patterns for each section |
| [LP Quality Checklist](../checklists/LP Quality Checklist.md) | Validation gate for completed landing pages |

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
