# SOP – Cluster and Map Keywords
Created: 2026-02-04
Updated: 2026-04-02

SOP_ID: SOP_41
Agent_Executable: No
Category: Targeting
Domain: Search
Human_Approval_Required: No
Pillar: 7
Primary Outcome: Keyword clusters organized by creative theme, prioritized, with intent labels and landing page mappings
Status: Done

### Purpose

This SOP transforms a raw keyword list into organized, prioritized clusters mapped to creative themes and landing pages.

> ❓ **The big question:** Which keywords belong together, which get cut, and where does each cluster point?

This is the bridge between keyword research and campaign structure. Every cluster becomes one ad group with one creative theme and one landing page.

---

### What this SOP is NOT

This SOP does **not:**

- Research or discover keywords (See: SOP – Research Keywords)
- Build the campaign structure from clusters (See: SOP – Build Search Campaign Structure)
- Write the RSAs for each cluster (See: [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md))
- Decide match types for individual keywords (See: [Match Type Reference](../references/Match Type Reference.md))
- Manage negative keywords (See: [Negative Keyword Reference](../references/Negative Keyword Reference.md))

### When to run this SOP

Run this SOP when:

- You have a completed keyword list from the Research SOP
- You are building a new Search campaign from scratch
- You are restructuring an existing campaign with new keyword data
- You are expanding into a new product or service line

---

### Before you start

#### Required inputs

- Completed keyword list from the Research SOP (exported with search volume, competition, and CPC data)
- Business offering details: products, services, pricing tiers
- List of existing landing pages with their URLs and primary topic
- Access to a spreadsheet tool (Google Sheets, Excel)

#### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Modern Search Campaign Mental Model](../mental-models/Modern Search Campaign Mental Model.md) | Understanding how clusters map to campaign structure |
| [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md) | The Single Ad Test and ad group logic |
| [Keyword Set Quality Checklist](../checklists/Keyword Set Quality Checklist.md) | Validating final cluster quality |
| [Match Type Reference](../references/Match Type Reference.md) | Understanding match type behavior during grouping |
| [Keyword and Match Type Selection Guidelines](../guidelines/Keyword and Match Type Selection Guidelines.md) | Match type selection context |

---

### Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Color-Code Keywords** | Filter irrelevant and doubtful keywords | Clean keyword list (green/orange/red) |
| **Phase 2️⃣: Group by Creative Theme** | Cluster keywords that share one RSA | Named clusters with keyword assignments |
| **Phase 3️⃣: Prioritize Clusters** | Rank clusters by business impact | Ordered cluster list with priority scores |
| **Phase 4️⃣: Assign Intent Labels** | Tag each cluster with search intent | Intent-labeled clusters |
| **Phase 5️⃣: Map to Landing Pages** | Connect each cluster to a destination | Cluster-to-LP mapping with gap flags |

---

## Phase 1️⃣: Color-Code Keywords

### 1.1 Set up the worksheet

Create a spreadsheet with these columns:

| Column | Source |
|--------|--------|
| Keyword | Research SOP output |
| Search Volume | Research SOP output |
| Competition | Research SOP output |
| Estimated CPC | Research SOP output |
| Color Code | This phase |
| Cluster Name | Phase 2 |
| Intent Label | Phase 4 |
| Landing Page | Phase 5 |

### 1.2 Apply color codes

Review every keyword and assign one color:

| Color | Meaning | Action |
|-------|---------|--------|
| Red | Irrelevant to the business | Exclude immediately |
| Orange | Doubtful, needs further review | Hold for secondary evaluation |
| Green | Clearly relevant, maps to a product or service | Include |

**Red criteria (exclude immediately):**

1. Keyword describes a product or service you do not offer
2. Keyword targets a geography you do not serve
3. Keyword describes a different industry or use case entirely
4. Keyword is purely informational AND you have no conversion path for that intent (no lead magnet, free tool, or consultation funnel)

**Green criteria (include):**

1. Keyword directly describes what you sell
2. Keyword describes a problem your product or service solves
3. Keyword includes commercial or transactional modifiers relevant to your offering
4. Keyword matches an existing landing page topic

**Orange criteria (hold for review):**

1. Keyword is adjacent to your offering but not a direct match
2. Keyword targets an audience segment you are unsure about
3. Keyword has commercial viability but low search volume
4. Keyword could be relevant depending on product roadmap or seasonal offering

### 1.3 Process orange keywords

For each orange keyword, answer this question: "If someone searched this, could I serve them a relevant landing page and fulfill their intent?"

- Yes: Move to green
- No: Move to red
- Uncertain: Keep as orange and flag for business owner input

### 1.4 Extract red keywords to negative list

Move all red keywords to a separate negative keyword list. These become campaign-level or account-level negatives during campaign build.

> ⚠️ **Do not delete red keywords:** Move them to a dedicated negative keyword sheet. They inform your negative keyword strategy in the campaign build phase.

### 1.5 Phase 1 output

- Green keywords: ready for clustering
- Orange keywords: flagged for business owner review (max 10-15% of total list)
- Red keywords: documented on a negative keyword sheet

---

## Phase 2️⃣: Group by Creative Theme

### 2.1 Apply the Single Ad Test

For each pair of green keywords, ask: "Can one RSA serve both of these keywords effectively?"

- Yes: They belong in the same cluster
- No: They belong in separate clusters

The Single Ad Test is the defining rule. If the same headline, description, and landing page make sense for two keywords, they share a cluster. If one keyword would need a meaningfully different ad, it gets its own cluster.

> ↪️ **See [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md)** for the full framework behind the Single Ad Test.

### 2.2 Group synonyms and close variants

Within each cluster, group keywords that are variations of the same concept:

| Group together | Examples |
|----------------|----------|
| Synonyms | "lawyer" and "attorney", "software" and "tool" |
| Close variants | "running shoes" and "running shoe" |
| Word order changes | "cheap flights london" and "london cheap flights" |
| Modifier variations | "best crm software" and "top crm software" |

These share one ad group. The match type system handles variant matching within the group.

### 2.3 Name each cluster

Assign a descriptive name to each cluster that reflects the creative theme:

| Naming pattern | Example |
|----------------|---------|
| Product/service + modifier | "CRM Software - Enterprise" |
| Problem + solution | "Back Pain - Physiotherapy" |
| Category + intent | "Running Shoes - Purchase" |

The cluster name becomes the ad group name in campaign build.

### 2.4 Assign keywords to clusters

Place every green keyword into exactly one cluster. No keyword belongs to multiple clusters.

If a keyword could fit two clusters, place it in the cluster where it has the strongest creative fit (where the RSA headline would be most relevant).

### 2.5 Validate cluster size

Check each cluster against these ranges:

| Cluster size | Action |
|--------------|--------|
| 1-3 keywords | Consider merging with a related cluster if the Single Ad Test passes |
| 4-20 keywords | Typical healthy cluster |
| 21+ keywords | Review for split opportunities: are there sub-themes that need different ads? |

> 💡 **Cluster size is a signal, not a rule:** A cluster of 2 high-volume keywords is valid if they need their own creative theme. A cluster of 25 keywords is fine if they all pass the Single Ad Test.

---

## Phase 3️⃣: Prioritize Clusters

### 3.1 Score each cluster

Evaluate every cluster across five dimensions:

| Dimension | What to assess | High priority signal |
|-----------|---------------|---------------------|
| Search volume | Sum of monthly search volume across all keywords in the cluster | Higher aggregate volume |
| Competition | Average competition level (low/medium/high) | Lower competition |
| CPC viability | Average CPC relative to your target CPA or ROAS | CPC within profitable range |
| Intent strength | Proportion of transactional and commercial keywords | Higher proportion of buying intent |
| Business margin | Revenue potential of the product or service this cluster represents | Higher margin offerings |

### 3.2 Create the priority ranking

Rank clusters into three tiers:

| Tier | Criteria | Action |
|------|----------|--------|
| Tier 1: Launch first | High volume + strong intent + viable CPC + high margin | Build these ad groups first |
| Tier 2: Launch second | Moderate volume or moderate intent, still profitable | Build after Tier 1 is live and performing |
| Tier 3: Test later | Low volume, high competition, or uncertain ROI | Queue for later expansion or seasonal activation |

### 3.3 Record priority scores

Add the tier assignment to each cluster in your worksheet. Include a one-line rationale for the ranking.

| Cluster Name | Tier | Rationale |
|--------------|------|-----------|
| (from Phase 2) | (1, 2, or 3) | (one sentence: why this tier) |

---

## Phase 4️⃣: Assign Intent Labels

### 4.1 Label each cluster

Assign one primary intent label per cluster based on the dominant keyword intent:

| Intent label | Signal words | User goal |
|--------------|-------------|-----------|
| Transactional | buy, purchase, order, pricing, quote, hire, book | Ready to convert |
| Commercial investigation | best, compare, review, vs, top, alternative | Evaluating options before buying |
| Informational | what is, how to, guide, definition, examples | Learning, not buying |
| Navigational | brand name, specific product name | Looking for a specific brand or site |

### 4.2 Determine the dominant intent

If a cluster contains keywords with mixed intent:

1. Count keywords per intent category
2. Assign the label of the majority
3. If split evenly, label as the higher-intent category (transactional > commercial > informational)

### 4.3 Flag informational clusters

Mark any cluster labeled "Informational" for secondary review. These clusters:

- May not justify paid search spend
- Could be better served by SEO or content marketing
- Should only remain if they have a clear conversion path (lead magnet, free tool, consultation)

If no conversion path exists, move the cluster to Tier 3 or remove entirely.

> ⚠️ **Include informational keywords only when:** (1) your ad messaging matches the informational intent, (2) your landing page fulfills the user's need, and (3) you have a clear conversion funnel (free guide, quiz, tool, consultation offer). Evaluate the full path from query to conversion before including.

---

## Phase 5️⃣: Map to Landing Pages

### 5.1 Match clusters to existing pages

For each cluster, identify the most relevant existing landing page:

1. Review your list of existing landing pages
2. Match based on topic alignment: does the page content directly address what the keyword cluster is about?
3. Verify the page has a clear conversion action (form, purchase, signup, call)

### 5.2 Evaluate landing page fit

For each cluster-to-page mapping, confirm:

| Check | Pass | Fail |
|-------|------|------|
| Page topic matches cluster theme | The page directly addresses the keyword topic | Page is tangentially related or generic |
| Page has a conversion action | Clear CTA visible above the fold | No CTA or buried CTA |
| Page loads correctly | No errors, mobile responsive | Broken page or poor mobile experience |

### 5.3 Flag gaps

For clusters without a suitable landing page:

1. Add "LP NEEDED" in the Landing Page column
2. Document what the page should cover (topic, offer, conversion action)
3. Flag these clusters as blocked until the landing page is created

| Cluster Name | LP Status | Required Page Description |
|--------------|-----------|--------------------------|
| (cluster) | LP NEEDED | (topic, offer, conversion action needed) |

### 5.4 Record final mappings

Complete the Landing Page column in your worksheet for every cluster:

| Cluster Name | Landing Page URL | LP Status |
|--------------|-----------------|-----------|
| (from Phase 2) | (URL or "LP NEEDED") | (Ready / Needs Update / LP NEEDED) |

---

### Validation & definition of done

This SOP is complete when:

- [ ] Every keyword is color-coded (red, orange, or green)
- [ ] Red keywords are documented on a negative keyword sheet
- [ ] Orange keywords are resolved (moved to green or red) or flagged for business owner review (max 10-15% of list)
- [ ] Every green keyword belongs to exactly one cluster
- [ ] Each cluster passes the Single Ad Test
- [ ] Each cluster has a descriptive name
- [ ] All clusters are ranked into Tier 1, 2, or 3
- [ ] Every cluster has a primary intent label
- [ ] Informational clusters are reviewed and justified or removed
- [ ] Every cluster is mapped to a landing page or flagged as "LP NEEDED"
- [ ] Final worksheet is exported and ready for campaign build

Run all clusters through the [Keyword Set Quality Checklist](../checklists/Keyword Set Quality Checklist.md) before proceeding.

---

### Exit → Entry bridge

Once all clusters are validated and mapped:

| Next step | Action |
|-----------|--------|
| Tier 1 clusters ready | Begin SOP – Build Search Campaign Structure with Tier 1 clusters |
| LP gaps identified | Route landing page creation before building ad groups for those clusters |
| Negative keyword sheet complete | Feed into negative keyword setup during campaign build |

**If issues arise:**

| Issue | Route to |
|-------|----------|
| Keywords don't pass the Single Ad Test within any cluster | Re-evaluate cluster boundaries, split further |
| No suitable landing pages for high-priority clusters | Prioritize landing page creation before campaign launch |
| Orange keywords remain unresolved | Escalate to business owner for product/service scope confirmation |

---

### Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Clusters too broad (fail the Single Ad Test) | Grouping by topic instead of creative theme | Apply the Single Ad Test to every keyword pair in the cluster |
| Clusters too narrow (1-2 keywords each) | Over-splitting on minor variations | Merge synonyms and close variants into one cluster |
| Skipping the red/orange/green step | Rushing to grouping without filtering | Always color-code first: it prevents polluted clusters |
| Ignoring informational keywords | Including them without a conversion path | Flag informational clusters and require a conversion mechanism or remove |
| Mapping clusters to generic homepage | No dedicated landing pages available | Flag as "LP NEEDED" and block the cluster until a relevant page exists |
| Not prioritizing clusters | Trying to launch everything at once | Tier the clusters and launch Tier 1 first for faster learnings |

---

### Quick reference: Support library

| Document | Type | Used in |
|----------|------|---------|
| [Modern Search Campaign Mental Model](../mental-models/Modern Search Campaign Mental Model.md) | Mental Model | Phase 2 (cluster logic) |
| [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md) | Mental Model | Phase 2 (Single Ad Test) |
| [Keyword Set Quality Checklist](../checklists/Keyword Set Quality Checklist.md) | Checklist | Validation |
| [Match Type Reference](../references/Match Type Reference.md) | Reference | Phase 2 (variant grouping) |
| [Keyword and Match Type Selection Guidelines](../guidelines/Keyword and Match Type Selection Guidelines.md) | Guideline | Phase 2 (grouping context) |
| [Negative Keyword Reference](../references/Negative Keyword Reference.md) | Reference | Phase 1 (red keywords) |

---

### Related SOPs

| SOP | Relationship |
|-----|--------------|
| SOP – Research Keywords | Upstream (provides the raw keyword list) |
| SOP – Build Search Campaign Structure | Downstream (uses clusters to build ad groups) |
| [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md) | Downstream (writes ads for each cluster) |
| [SOP – Promote Search Terms to Keywords](../sops/SOP – Promote Search Terms to Keywords.md) | Parallel (ongoing keyword refinement after launch) |

---

### Version details

- **Version:** 1.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

### Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

(c) 2026 PPC Mastery B.V. All rights reserved.
