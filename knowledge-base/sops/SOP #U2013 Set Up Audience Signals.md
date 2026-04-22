# SOP – Set Up Audience Signals
Created: 2026-02-04
Updated: 2026-04-01

SOP_ID: SOP_11
Status: Done
Category: Audiences
Primary Outcome: PMax asset group with layered, high-quality audience signals and validated exclusions
Secondary Outcomes: Faster machine learning ramp-up, improved early campaign performance, reduced wasted spend during learning
Agent_Executable: No
Human_Approval_Required: No
Domain: Audiences
Pillar: 7

### Purpose

This SOP configures **audience signals for a Performance Max asset group** using a layered, quality-first approach.

> ❓ **The big question:** Does this PMax asset group have high-quality, layered audience signals that give Google the best possible starting data for optimization?

---

### What this SOP is NOT

This SOP does **not:**

- Create Customer Match lists (See: [SOP – Build Customer Match Lists](../sops/SOP – Build Customer Match Lists.md))
- Configure Display, Video, or Demand Gen audience targeting (See: [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md))
- Teach the signal vs. targeting framework (See: [Audience Strategy Mental Model](../mental-models/Audience Strategy Mental Model.md))
- List all signal options and examples (See: [Audience Signal Catalog](../catalogs/Audience Signal Catalog.md))

### When to run this SOP

Run this SOP when:

- Setting up a new Performance Max campaign or asset group
- Optimizing signals on an existing PMax asset group with poor performance
- Adding new first-party data assets (new Customer Match list, new website segments)
- Auditing PMax signal coverage during account reviews

---

### Before you start

#### Required inputs

- Access to Google Ads account with PMax campaign (or campaign being created)
- Asset group identified (one asset group = one run of this SOP)
- Google Tag installed and firing on all key pages
- Customer Match list uploaded (if available, see [SOP – Build Customer Match Lists](../sops/SOP – Build Customer Match Lists.md))

#### Reference documents (have open)

| Document | Used for |
|----------|---------|
| [Audience Signal Catalog](../catalogs/Audience Signal Catalog.md) | Signal type selection and examples |
| [Audience Signals Reference](../references/Audience Signals Reference.md) | Signal specs and limits |
| [Audience Signal Quality Checklist](../checklists/Audience Signal Quality Checklist.md) | Final validation |

---

### Decision gate: New build vs. signal optimization

| If... | Then... |
|-------|---------|
| **Setting up a new PMax asset group** | Run all four phases in sequence |
| **Optimizing signals on an existing asset group** | Start at Phase 2 (audit existing signals first, then layer) |
| **Customer Match list not yet available** | Skip Customer Match in Phase 2, proceed with other signals, return to add Customer Match when ready |

---

## Execution

### Phase 1️⃣: Audit existing data assets

**Goal:** Inventory all first-party data available for signal configuration.

#### Step 1.1: Check Customer Match lists

1. Navigate to **Tools & Settings → Audience Manager → Customer lists**
2. Document available lists using the table below
3. Usability criteria: 1,000+ matched users, updated within 30 days

| List name | Size (matched) | Last updated | Usable? |
|-----------|---------------|--------------|---------|
| [Record each list] | [Number] | [Date] | Yes/No |

#### Step 1.2: Check website audience segments

1. Navigate to **Tools & Settings → Audience Manager → Your data segments**
2. Document available segments using the table below
3. Usability criteria: 100+ users (1,000+ recommended)

| Segment name | Size | Membership duration | Usable? |
|-------------|------|--------------------| --------|
| All visitors | [Number] | [Days] | Yes/No |
| All converters | [Number] | [Days] | Yes/No |
| [Product/service page visitors] | [Number] | [Days] | Yes/No |

#### Step 1.3: Check YouTube data

1. If YouTube channel is linked: document subscriber count and video viewer segments
2. If no YouTube channel: note as unavailable and skip YouTube signals

#### Step 1.4: Document data asset inventory

| Data asset | Available | Quality | Action needed |
|-----------|-----------|---------|---------------|
| Customer Match | Yes/No | Size + recency | Upload/refresh if needed |
| Website converters | Yes/No | Size | Create segment if missing |
| All website visitors | Yes/No | Size | Create segment if missing |
| YouTube users | Yes/No | Channel linked? | Link channel if available |

**Phase 1 output:** Complete inventory of available data assets with quality assessment.

**Verification:** Data asset inventory table completed with quality assessment for each asset, and any missing segments flagged for creation.

---

### Phase 2️⃣: Build signal stack

**Goal:** Layer signals from highest to lowest quality using the signal quality hierarchy.

> ⚠️ **Add all Tier 1-2 signals before launching:** Do not launch a PMax campaign without Customer Match, website converters, and all website visitors configured. These are the minimum for effective machine learning ramp-up.

#### Step 2.1: Add Tier 1 signals (highest priority)

Add these first, they carry the most weight:

| Signal | Source | Configuration |
|--------|--------|--------------|
| Customer Match | Audience Manager | Select your primary customer list (all customers for growth, top 20% for efficiency) |
| Website converters | Your data segments | Select converter segment with 90-540 day window |

#### Step 2.2: Add Tier 2 signals

| Signal | Source | Configuration |
|--------|--------|--------------|
| All website visitors | Your data segments | Select all-visitor segment with 30-90 day window |
| YouTube engaged users | Your data segments | Select YouTube viewers/subscribers (if available) |

#### Step 2.3: Add Tier 3 signals

Create custom segments if they don't already exist:

1. Navigate to **Audience Manager → Custom segments → New custom segment**
2. Create a search term segment:
   - Add 10-15 highest-converting search terms from your Search campaigns
   - Pull terms from Search Terms report, filtered by conversions
   - Avoid brand terms and single-word generics
3. Create a URL/app segment (optional):
   - Add 10-15 direct competitor URLs and industry publication URLs
   - Use specific pages, not homepages

> ↪️ For term and URL examples by vertical: See [Audience Signal Catalog](../catalogs/Audience Signal Catalog.md)

#### Step 2.4: Add Tier 4-5 signals (selective)

| Signal | When to add | Configuration |
|--------|-------------|--------------|
| In-market segments | Always: add 1-2 relevant categories | Select the most specific in-market category for your product/service |
| Life events | Only if a specific life event triggers your purchases | Select relevant life events |
| Affinity segments | Only for brand awareness goals | Layer with higher-quality signals, never use alone |
| Demographics | Only to narrow by household income or parental status | Add as filter on top of other signals |

> ↪️ **Browse segment names:** See [Audience Segments Reference](../references/Audience Segments Reference.md) for the full list of in-market, affinity, and life event segments available in Google Ads.

#### Step 2.5: Review signal stack

Your completed signal stack should look like this:

| Layer | Signal type | Configured? |
|-------|------------|-------------|
| 1 | Customer Match | ☐ |
| 2 | Website converters | ☐ |
| 3 | All website visitors | ☐ |
| 4 | YouTube users (if available) | ☐ |
| 5 | Custom segment (search terms) | ☐ |
| 6 | Custom segment (URLs) | ☐ |
| 7 | In-market segments (1-2) | ☐ |

**Phase 2 output:** All relevant signals added to the asset group.

**Verification:** All Tier 1-2 signals show as configured in the asset group, at least one custom segment added, and signal stack review table has all applicable rows checked.

---

### Phase 3️⃣: Configure search themes

**Goal:** Add search themes only where appropriate, with cannibalization risk managed.

#### Step 3.1: Evaluate search theme need

| Question | If YES | If NO |
|----------|--------|-------|
| Do you run Search campaigns for these keywords? | Do NOT add search themes (high cannibalization risk) | Proceed to Step 3.2 |
| Is PMax your only search-eligible campaign? | Add search themes for primary categories | Skip search themes entirely |
| Are you comfortable with PMax taking search inventory? | Add search themes selectively | Skip search themes entirely |

#### Step 3.2: Add search themes (if proceeding)

1. In the asset group settings, navigate to **Search themes**
2. Add category-level themes (broad, not specific keywords):
   - Example: "google ads management" (category) not "google ads management agency pricing" (long-tail)
3. Maximum: 25 search themes per asset group
4. Do NOT duplicate keywords from active Search campaigns

#### Step 3.3: Document search theme decisions

| Search theme | Added? | Reason |
|-------------|--------|--------|
| [Theme 1] | Yes/No | [Rationale] |
| [Theme 2] | Yes/No | [Rationale] |

> ⚠️ **Search themes carry real risk:** In Bob's case study, PMax search themes cannibalized the dedicated Search campaign. Removing them caused Shopping spend to jump from 22% to 70% and revived Search performance. Only add search themes if you deliberately want PMax to compete for that search inventory.

**Phase 3 output:** Search theme configuration documented with cannibalization risk assessed.

**Verification:** Search theme decision table documented with rationale, and no themes duplicate keywords from active Search campaigns.

---

### Phase 4️⃣: Set exclusions and validate

**Goal:** Configure exclusions and run the quality checklist.

#### Step 4.1: Set audience exclusions

| Exclusion | When to apply | How to configure |
|-----------|--------------|-----------------|
| Recent converters | Always (unless short purchase cycle) | Exclude converter segment (7-30 day window) at campaign level |
| Existing customers | New customer acquisition campaigns | Exclude Customer Match list at campaign level |
| Brand keywords | Protecting Search campaign | Add brand terms as negative keywords at campaign level |

1. Navigate to campaign-level settings → Audience exclusions
2. Add relevant exclusion segments
3. Verify exclusions are applied at campaign level (not just asset group)

#### Step 4.2: Run validation checklist

Run the [Audience Signal Quality Checklist](../checklists/Audience Signal Quality Checklist.md). Address any failing items before launching.

#### Step 4.3: Document final configuration

| Asset group | Signal types used | Search themes | Exclusions | Checklist passed |
|------------|------------------|---------------|------------|-----------------|
| [Name] | [List types] | [Yes/No + count] | [List exclusions] | ☐ |

**Phase 4 output:** Exclusions configured, quality checklist passed, configuration documented.

**Verification:** Exclusions applied at campaign level (not asset group), Audience Signal Quality Checklist passes, and final configuration table completed.

---

### Validation & definition of done

This SOP is complete when:

- [ ] All available Tier 1-2 signals are configured
- [ ] At least one Tier 3 custom segment is added
- [ ] Search themes are configured only where cannibalization risk is accepted
- [ ] Exclusions are set at campaign level
- [ ] [Audience Signal Quality Checklist](../checklists/Audience Signal Quality Checklist.md) passes

---

### Exit → Entry bridge

| After completing this SOP... | Route to... |
|-----------------------------|-------------|
| Need to create a Customer Match list | [SOP – Build Customer Match Lists](../sops/SOP – Build Customer Match Lists.md) |
| Ready to expand audience reach | [Expand Audience Reach](../playbooks/Expand Audience Reach.md) |
| Need to set up Display/Video/DG targeting | [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md) |

---

### FAQ

**Q: How many signals should I add per asset group?**
A: Aim for 5-7 signal types minimum. See [Audience Strategy Mental Model](../mental-models/Audience Strategy Mental Model.md) for signal layering rationale.

**Q: Do signals restrict who sees my ads?**
A: No, signals are hints, not targeting controls. See [Audience Strategy Mental Model](../mental-models/Audience Strategy Mental Model.md) for the signal vs. targeting framework.

**Q: Should I use the same signals for every asset group?**
A: No, customize signals per asset group theme. See [Audience Signal Catalog](../catalogs/Audience Signal Catalog.md) for examples by vertical.

**Q: When should I remove search themes?**
A: Remove search themes if PMax is cannibalizing Search campaign impressions or share.

---

### Quick reference

| Document | Type | Used for |
|----------|------|---------|
| [Audience Signal Catalog](../catalogs/Audience Signal Catalog.md) | Catalog | Signal type selection and examples |
| [Audience Signals Reference](../references/Audience Signals Reference.md) | Reference | Signal specs, limits, hierarchy |
| [Audience Signal Quality Checklist](../checklists/Audience Signal Quality Checklist.md) | Checklist | Final validation |
| [Audience Strategy Mental Model](../mental-models/Audience Strategy Mental Model.md) | Mental Model | Conceptual framework |

---

### Common failures

| Failure | Why it happens | How to avoid |
|---------|---------------|--------------|
| Using only demographics as signals | Misunderstanding signal hierarchy | Always start with Tier 1-2 first-party data |
| Dumping 100+ keywords in custom segments | More = better thinking | Use 10-15 highest-converting terms only |
| Adding search themes while running Search campaigns | Not understanding cannibalization risk | Check for active Search campaigns before adding themes |
| Not setting exclusions | Overlooking exclusion setup | Always configure exclusions in Phase 4 |
| Copying identical signals across asset groups | Efficiency shortcut | Customize signals per asset group theme |
| Skipping Customer Match because list is "too small" | Perfectionism | Upload what you have, even 1,000 users helps |

---

### Version details

- **Version:** 3.0
- **Last Updated:** April 2026
- **Creator:** Bob Meijer

---

### Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

© 2026 PPC Mastery B.V. All rights reserved.
