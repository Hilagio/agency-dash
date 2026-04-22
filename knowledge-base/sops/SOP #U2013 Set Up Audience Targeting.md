# SOP – Set Up Audience Targeting
Created: 2026-02-04
Updated: 2026-02-05

SOP_ID: SOP_12
Status: Done
Category: Audiences
Primary Outcome: Campaign with correctly configured audience segments, targeting mode, expansion settings, and exclusions
Secondary Outcomes: Proper audience isolation between campaigns, brand safety coverage, data collection via observation mode
Agent_Executable: No
Human_Approval_Required: No
Domain: Audiences
Pillar: 7

### Purpose

This SOP configures **audience targeting for Display, Video, or Demand Gen campaigns** with correct segment selection, targeting mode, expansion settings, and exclusions.

> ❓ **The big question:** Does this campaign target the right audience segments with the correct targeting mode, expansion settings, and exclusions for its goal?

---

### What this SOP is NOT

This SOP does **not:**

- Configure Performance Max audience signals (See: [SOP – Set Up Audience Signals](../sops/SOP – Set Up Audience Signals.md))
- Create Customer Match lists (See: [SOP – Build Customer Match Lists](../sops/SOP – Build Customer Match Lists.md))
- List all segment options and examples (See: [Audience Segment Catalog](../catalogs/Audience Segment Catalog.md))
- Teach signals vs. targeting concepts (See: [Audience Strategy Mental Model](../mental-models/Audience Strategy Mental Model.md))

### When to run this SOP

Run this SOP when:

- Setting up a new Display, Video, or Demand Gen campaign
- Adding audience targeting to an existing campaign
- Restructuring audience targeting during campaign audits
- Launching lookalike segments in Demand Gen

---

### Before you start

#### Required inputs

- Campaign type determined (Display, Video, or Demand Gen)
- Campaign goal defined (remarketing, prospecting, awareness, or data collection)
- Access to Google Ads account
- Google Tag installed and firing (for remarketing segments)
- Customer Match list uploaded (if using, see [SOP – Build Customer Match Lists](../sops/SOP – Build Customer Match Lists.md))

#### Reference documents (have open)

| Document | Used for |
|----------|---------|
| [Audience Segment Catalog](../catalogs/Audience Segment Catalog.md) | Segment type selection and examples |
| [Audience Targeting Reference](../references/Audience Targeting Reference.md) | Targeting specs, modes, and limits |
| [Audience Targeting Launch Checklist](../checklists/Audience Targeting Launch Checklist.md) | Final validation |

---

### Decision gate: Campaign type determines available features

| Feature | Display | Video | Demand Gen |
|---------|---------|-------|------------|
| Remarketing segments | ✅ | ✅ | ✅ |
| Customer Match | ✅ | ✅ | ✅ |
| Custom segments | ✅ | ✅ | ✅ |
| In-market / Affinity | ✅ | ✅ | ✅ |
| Lookalike segments | ❌ | ❌ | ✅ |
| Content targeting (topics/placements) | ✅ | ✅ | ❌ |
| Optimized targeting | ✅ | ✅ | ✅ |
| Targeting vs. Observation mode | ✅ | ✅ | ❌ |
| Dynamic remarketing | ✅ | ✅ | ❌ |

Confirm your campaign type, then proceed to Phase 1.

---

## Execution

### Phase 1️⃣: Define targeting goal and select approach

**Goal:** Determine the campaign's audience strategy based on its objective.

#### Step 1.1: Classify campaign goal

| Campaign goal | Primary segment types | Targeting mode | Optimized targeting |
|--------------|----------------------|----------------|-------------------|
| **Remarketing** | Website visitors, Customer Match | Targeting | OFF |
| **Prospecting** | Custom segments, in-market, lookalikes | Targeting | Test ON/OFF |
| **Brand awareness** | Affinity, broad in-market, life events | Targeting | ON |
| **Data collection** | Any segment | Observation | N/A |

#### Step 1.2: Select temperature approach

| Goal | Temperature focus | Segment types |
|------|------------------|---------------|
| Remarketing | 🔥 Hot + 🌡️ Warm | Cart/form abandoners, product viewers, all visitors, Customer Match |
| Prospecting | ❄️ Cool + ❄️ Cold | Custom segments, in-market, lookalikes |
| Awareness | ❄️ Cold + 🧊 Coldest | Affinity, life events, broad in-market |

**Phase 1 output:** Campaign goal classified, temperature approach selected.

---

### Phase 2️⃣: Build audience stack

**Goal:** Select and configure the right audience segments from the catalog.

#### Step 2.1: Select primary audience segments

Navigate to your campaign → **Audiences, keywords, and content → Audiences → Edit audience segments**.

For remarketing campaigns:

1. Select **Your data** tab
2. Add website visitor segments matching your goal:
   - Cart/form abandoners (7-14 day window) for recovery
   - Product/service page viewers (14-30 days) for re-engagement
   - All visitors (30-90 days) for broad remarketing
3. Add Customer Match segments if available

For prospecting campaigns:

1. Select **Custom segments** tab
2. Add or create custom segments:
   - Search term segment (10-15 converting queries)
   - URL segment (10-15 competitor/industry URLs)
3. Select **In-market** tab
4. Add 1-3 relevant in-market categories
5. For Demand Gen: Add lookalike segments based on high-value seed lists

For awareness campaigns:

1. Select **Affinity** tab, add relevant affinity categories
2. Select **Life events** tab, add relevant triggers
3. Select **In-market** tab, add broad category segments

→ For segment examples by vertical: See [Audience Segment Catalog](../catalogs/Audience Segment Catalog.md)

> ↪️ **Browse segment names:** See [Audience Segments Reference](../references/Audience Segments Reference.md) for the full list of in-market, affinity, and life event segments available in Google Ads.

#### Step 2.2: Consider combined segments

If you need sharper targeting, create combined segments:

1. Navigate to **Audience Manager → Combined segments → New combined segment**
2. Use AND logic to layer segments: e.g., In-market (CRM software) AND Custom segment (CRM keywords)
3. Use NOT logic to exclude: e.g., AND NOT existing customers

#### Step 2.3: Configure Demand Gen lookalikes (if applicable)

1. Navigate to campaign → Audiences → Lookalike segments
2. Select seed list (use highest-quality: converters, high-LTV customers)
3. Set reach: Narrow (efficiency) / Balanced (default) / Broad (scale)
4. Verify seed list has 1,000+ matched users

**Phase 2 output:** All audience segments selected and added to the campaign.

---

### Phase 3️⃣: Configure targeting mode and expansion settings

**Goal:** Set the correct targeting mode and optimized targeting/expansion settings.

#### Step 3.1: Set targeting mode (Display/Video only)

| Mode | Effect | When to use |
|------|--------|-------------|
| **Targeting** | Restricts ad delivery to selected audiences | Remarketing, conversion-focused prospecting |
| **Observation** | Shows ads broadly, collects audience data | Data collection, learning phase |

1. In your ad group → Audiences → Settings
2. Select **Targeting** or **Observation**
3. Verify the setting is correct for each ad group

#### Step 3.2: Configure optimized targeting

| Campaign goal | Optimized targeting | Rationale |
|--------------|-------------------|-----------|
| Remarketing (strict) | OFF | Preserve audience restriction |
| Prospecting (conversions) | ON | Let Google find additional converters |
| Brand awareness | ON | Maximize qualified reach |

1. Navigate to ad group settings → Optimized targeting
2. Toggle ON or OFF based on the table above
3. If ON: provide your audience segments as "hints", Google will find similar users

> ⚠️ **Optimized targeting overrides your selections:** When enabled, Google may reduce or stop showing ads to your selected audiences if it finds better-performing users elsewhere. Keep it OFF when audience precision matters more than volume.

#### Step 3.3: Configure audience expansion (Video only)

For Video campaigns with brand consideration or awareness goals:

1. Navigate to ad group settings → Audience expansion
2. Set expansion level based on reach goals
3. Expansion finds users similar to your selected audience, broader than targeting, narrower than no audience

#### Step 3.4: Review Demand Gen demographic expansion

For Demand Gen campaigns:

1. Check if demographic expansion is enabled (may override demographic selections)
2. Restrict to age/gender only if demographic precision is critical (may limit performance)

**Phase 3 output:** Targeting mode and expansion settings configured for each ad group.

---

### Phase 4️⃣: Set exclusions and validate

**Goal:** Configure exclusions and run the quality checklist.

#### Step 4.1: Set audience exclusions

| Exclusion | When to apply | Configuration |
|-----------|--------------|---------------|
| Recent converters | Remarketing campaigns | Exclude converter segment (7-30 day window) |
| Existing customers | New customer acquisition | Exclude Customer Match (all customers) |
| Current visitors | Prospecting-only campaigns | Exclude all website visitors segment |

1. Navigate to campaign → Audiences → Exclusions
2. Add relevant exclusion segments
3. Verify exclusions don't conflict with targeting (e.g., don't exclude the audience you're targeting)

#### Step 4.2: Set content exclusions (Display/Video only)

1. Navigate to campaign → Content → Exclusions
2. Exclude brand-unsafe categories:
   - Sensitive social issues
   - Tragedy and conflict
   - Adult content (unless relevant)
3. Exclude irrelevant placements (known low-quality sites/apps)

#### Step 4.3: Set frequency capping (Display/Video only)

1. Navigate to campaign settings → Frequency capping
2. Set impression caps based on campaign type:
   - Remarketing: 3-5 impressions per user per day
   - Prospecting: 2-3 impressions per user per day
   - Awareness: 1-2 impressions per user per day

#### Step 4.4: Run validation checklist

Run the [Audience Targeting Launch Checklist](../checklists/Audience Targeting Launch Checklist.md). Address any failing items before launching.

#### Step 4.5: Document final configuration

| Ad group | Segments | Mode | Optimized targeting | Exclusions | Checklist passed |
|----------|----------|------|--------------------| -----------|-----------------|
| [Name] | [List types] | Targeting/Observation | ON/OFF | [List exclusions] | ☐ |

**Phase 4 output:** Exclusions configured, frequency caps set, quality checklist passed, configuration documented.

---

### Validation & definition of done

This SOP is complete when:

- [ ] Audience segments match campaign goal (remarketing/prospecting/awareness)
- [ ] Targeting mode is set correctly (Targeting or Observation)
- [ ] Optimized targeting is ON or OFF per goal
- [ ] Exclusions are configured (converters, customers, content)
- [ ] Frequency capping is set (Display/Video)
- [ ] [Audience Targeting Launch Checklist](../checklists/Audience Targeting Launch Checklist.md) passes

---

### Exit → Entry bridge

| After completing this SOP... | Route to... |
|-----------------------------|-------------|
| Need to create a Customer Match list | [SOP – Build Customer Match Lists](../sops/SOP – Build Customer Match Lists.md) |
| Need to set up PMax signals instead | [SOP – Set Up Audience Signals](../sops/SOP – Set Up Audience Signals.md) |
| Ready to expand audience reach | [Expand Audience Reach](../playbooks/Expand Audience Reach.md) |

---

### FAQ

**Q: Should I use Targeting or Observation mode?**
A: Use Targeting when you know who you want to reach (remarketing, focused prospecting). Use Observation when you want to learn which audiences perform best without restricting delivery.

**Q: Should I enable optimized targeting?**
A: ON for prospecting and awareness campaigns where you want Google to find additional converters. OFF for remarketing campaigns where you need strict audience control.

**Q: How many audience segments should I add per ad group?**
A: For remarketing, 1-3 specific segments. For prospecting, 2-5 segments across types. Avoid adding too many, it dilutes targeting clarity and makes performance analysis difficult.

**Q: Can I use the same audience across multiple campaigns?**
A: Yes, but set different exclusions per campaign to avoid overlap. Remarketing and prospecting campaigns should have mutually exclusive audiences.

---

### Quick reference

| Document | Type | Used for |
|----------|------|---------|
| [Audience Segment Catalog](../catalogs/Audience Segment Catalog.md) | Catalog | Segment selection and examples |
| [Audience Targeting Reference](../references/Audience Targeting Reference.md) | Reference | Targeting specs, modes, limits |
| [Audience Targeting Launch Checklist](../checklists/Audience Targeting Launch Checklist.md) | Checklist | Final validation |
| [Audience Strategy Mental Model](../mental-models/Audience Strategy Mental Model.md) | Mental Model | Conceptual framework |

---

### Common failures

| Failure | Why it happens | How to avoid |
|---------|---------------|--------------|
| Using Observation when Targeting is needed | Defaulting to Google's suggestion | Consciously set mode based on campaign goal |
| Leaving optimized targeting ON for remarketing | Not checking default settings | Verify setting per ad group after setup |
| No exclusions configured | Oversight during setup | Always run Phase 4 before launching |
| Overlapping audiences across campaigns | No isolation strategy | Use exclusions to separate remarketing from prospecting |
| Lookalike seed list too small | Using all visitors as seed | Seed with converters or high-value customers (1,000+ minimum) |
| Adding every available in-market segment | More = better thinking | Select 1-3 most relevant categories only |

---

### Version details

- **Version:** 2.0
- **Last Updated:** January 2026
- **Creator:** Bob Meijer

---

### Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

© 2026 PPC Mastery B.V. All rights reserved.
