# SOP – Promote Search Terms to Keywords
Created: 2026-02-04
Updated: 2026-02-15

SOP_ID: SOP_47
Status: Done
Category: Traffic
Primary Outcome: High-signal search terms promoted with control + observability
Secondary Outcomes: Better DKI effectiveness, QS diagnostics, Auction Insights, keyword-level Final URLs
Agent_Executable: No
Human_Approval_Required: No
Domain: Search
Pillar: 7

### Purpose

Query promotion answers one question:

> ❓ **The big question:** Which search terms deserve their own keyword, and which would only fragment data and hurt Smart Bidding?

This SOP decides when to promote a search term to a keyword to gain **control + observability**, without unnecessarily fragmenting data for Smart Bidding.

### Why promote?

Promoting a search term to a keyword unlocks benefits you don't get from search terms alone:

| Benefit | What it gives you |
| --- | --- |
| **Mapping control** | An exact/phrase keyword creates a more predictable "home" for that query instead of letting Google pick from multiple similar keywords. |
| **QS diagnostics** | Quality Score components (Ad Relevance, Expected CTR, LP Experience) are surfaced at the keyword level (exact match). |
| **DKI effectiveness** | Dynamic Keyword Insertion inserts the keyword, not the search term. Better keyword coverage → better headline matching. |
| **Auction Insights visibility** | Competitive metrics (impression share, overlap rate, position above rate, etc) can be derived at the keyword-level for better competitive insights. |
| **Search vs. pMax priority** | Search campaigns often [**take priority**](https://support.google.com/google-ads/answer/2756257?hl=en) over Performance Max when a query exactly matches an eligible keyword. Promotion keeps control in Search. |
| **Keyword-level Final URLs** | Only keywords can have custom Final URLs. Lets you route to a more relevant page without splitting ad groups. |
| **Historical trend retention** | Keyword performance is easier to trend over time. Search term data can be more difficult to work with. |

> Promote when it meaningfully improves **control**, **diagnostics**, or **automation**. Skip when it only fragments data and hurts Smart Bidding!

### What this SOP is NOT

This SOP does **not**:

- Decide ad group structure (See: [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md))
- Fix Ad Relevance issues (See: [SOP – Improve Ad Relevance](../sops/SOP – Improve Ad Relevance.md))

> ⚠️ **Critical distinction:**
> - If a search term needs a **meaningfully different ad** → this is a **Split & Route** case. See [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md).
> - If the **same ad** works but the query deserves a **different landing page** → **Promote + keyword-level Final URL** (this SOP).
> 💡 **Rule of thumb:**
> - Different **ad** needed → Split (see [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md))
> - Same **ad**, different **LP** → Promote + keyword-level Final URL (this SOP)

### When to run this SOP

Run this SOP if **any** of the following are true:

- You want better QS diagnostics on high-impact queries.
- High-volume search terms aren't represented as keywords (blind spot).
- DKI is underperforming because keywords don't match actual search behavior.
- You want Auction Insights visibility on specific query themes.
- You're building out a new ad group and want to seed it with the right keywords.

**Cadence:**

| Frequency | Scope |
| --- | --- |
| Monthly | Quick scan of top 10 search terms per priority ad group |
| Post-campaign | Capture new high-intent queries from promotions/seasonality |

---

### Before you start

**Required:**

- Search Terms Report (Last 30-90 days)
- Current keyword list for the ad group
- QS data by keyword (if available)
- Confirmation that ad group passes the Headline Test (see [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md))

---

### Execution framework

This SOP has three phases:

| Phase | Purpose | When to Execute |
| --- | --- | --- |
| **Phase 1️⃣:** Identify | Surface high-signal candidates from Search Terms Report | Always |
| **Phase 2️⃣:** Evaluate | Apply the decision framework to each candidate | Always |
| **Phase 3️⃣:** Execute | Promote keywords with correct match type and routing | If Phase 2 yields candidates |

---

## Phase 1️⃣: Identify

### 1.1 Pull Search Terms Report (STR)

**Action:**

1. Navigate to the ad group's Search Terms Report.
2. Set date range: **Last 30 days** (expand to 90 for low-volume ad groups).
3. Sort by **Impressions (descending)**.

### 1.2 Apply volume threshold

Not every search term deserves evaluation. Focus on queries with enough volume to matter.

**Thresholds (tiered by account volume):**

| Account Type | Minimum Impressions (30 days) |
| --- | --- |
| High-volume | ≥ 100 |
| Mid-volume | ≥ 50 |
| Low-volume | Top 10 queries not yet added, sorted by impressions (ignore absolute threshold) |

**Additional signal filters (optional):**

- Has conversions (≥ 1)

> Start with volume. If a search term doesn't have meaningful impressions, promoting it won't give you meaningful benefits anyway.

---

## Phase 2️⃣: Evaluate

### 2.1 The decision framework

For each candidate query, work through these three questions in order:

**1️⃣ Is it a close variant of an existing keyword?**

Close variants include: word order changes, singular/plural, filler words ("for", "the", "a"), minor spelling/typos.

- ✅ **Yes → Skip** (fragments data without adding value)
- ❌ **No → Continue**

**2️⃣ Would this query need a meaningfully different ad?**

- ✅ **Yes → Stop.** This is not a promotion case. This query needs its own ad group (see routing below).
- ❌ **No → Continue**

> ↪️ **Where to route "Yes" queries:** If a suitable ad group already exists, note the query for that ad group. If no suitable ad group exists, trigger [SOP – Build Search Campaign Structure](../sops/SOP – Build Search Campaign Structure.md) (Phase 2: Create ad groups by creative theme). Reference the [Modern Search Campaign Mental Model](../mental-models/Modern Search Campaign Mental Model.md) and [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md) for structure decisions.

**3️⃣ Does promotion create at least one real advantage?**

Promote if **any** of these are true:

- Better DKI headline (the keyword looks good in H1)
- Worth separate QS monitoring (enough volume to track)
- You want Auction Insights for this keyword and search terms triggered
- You need keyword-level automation or reporting
- You want tighter routing/prioritization predictability
- You want a keyword-level Final URL for a more relevant LP
- You want to retain/trend performance data over time

**Result:**

- ✅ **At least one advantage → PROMOTE**
- ❌ **No clear advantage → SKIP**

> 💡 **The whole SOP in one line:** Skip close variants. Split when the ad must change. Promote when it adds control or visibility.

### 2.2 The DKI litmus test

When you're on the fence, use this supporting test:

> If this search term became a keyword and triggered DKI, would the resulting headline look better to the user?

- **Yes → Promote**
- **No (same or awkward) → Skip**

### 2.3 What to promote vs. skip

#### ✅ Promote

Promote when it's a **distinct phrasing** that still fits the ad group theme:

| Type | Examples |
| --- | --- |
| **Commercial modifiers** | "buy running shoes", "running shoes sale", "running shoes discount" |
| **Benefit qualifiers** | "running shoes free shipping", "running shoes free returns" |
| **Synonyms users expect** | "jogging shoes" alongside "running shoes", "attorney" alongside "lawyer" |
| **Offer modifiers** | "crm software free trial", "crm software demo" |

#### ❌ Skip

Skip when it's only:

| Type | Examples |
| --- | --- |
| **Word order changes** | "sale running shoes" vs. "running shoes sale" |
| **Singular/plural** | "running shoe" vs. "running shoes" |
| **Filler words/grammar** | "shoes for running" vs. "running shoes" |
| **Typos** | "runing shoes", "runnning shoes" |
| **Generic modifiers with no headline value** | "running shoes online", "crm software online" |

---

## Phase 3️⃣: Execute

### 3.1 Choose match type

| Match Type | When to use | Default? |
| --- | --- | --- |
| **Exact** | Clean mapping, clearer routing | ✅ Yes |
| **Phrase** | Want controlled expansion from the root without adding more keywords | Sometimes |
| **Broad** | Discovery layer: use intentionally for exploration, not for promotion | Rare |

### 3.2 Add the keyword

**Action:**

1. Add the keyword to the **same ad group**.
2. Set match type per 3.1 (default: Exact).
3. If needed, set a **keyword-level Final URL** for a more relevant landing page.

> ⚠️ **Keyword-level Final URL tip:** Use this when the same ad works but a different LP would convert better. Example: "running shoes sale" → route to collection page with discounted shoes sorted/prioritized, but the standard ad copy still applies (e.g. “Up to -40% Discount). This avoids unnecessary ad group splits while still improving Landing Page Experience.

### 3.3 Routing check (edge case)

In most cases, promoting within the same ad group requires no routing changes.

However, if the query was previously matching from a **different** ad group:

1. Check if you now have internal overlap (same query, multiple keyword entry points).
2. If yes, add an **exact match negative** in the non-preferred ad group to clean up routing.

> This is rare for same-ad-group promotions but can happen if you have overlapping themes across ad groups.

---

### Examples

#### E-commerce: Running shoes

**Ad Group:** Running Shoes

**Existing keywords:** "running shoes"

| Search Term | Decision | Reasoning |
| --- | --- | --- |
| "buy running shoes" | ✅ Promote | Purchase intent: DKI shows "Buy Running Shoes" |
| "running shoes sale" | ✅ Promote | Commercial modifier: DKI shows "Running Shoes Sale" |
| "jogging shoes" | ✅ Promote | Synonym users expect + same LP |
| "running shoes free shipping" | ✅ Promote | Benefit qualifier: DKI value + worth tracking |
| "running shoe" | ❌ Skip | Singular variant: no benefit |
| "shoes for running" | ❌ Skip | Awkward phrasing: no DKI benefit |
| "sale running shoes" | ❌ Skip | Word order variant |
| "running shoes online" | ❌ Skip | "Online" adds no headline value |

#### B2B SaaS: CRM software

**Ad Group:** CRM Software

**Existing keywords:** "crm software"

| Search Term | Decision | Reasoning |
| --- | --- | --- |
| "buy crm software" | ✅ Promote | Purchase intent: DKI value |
| "crm software free trial" | ✅ Promote | Offer modifier: worth tracking separately |
| "crm software demo" | ✅ Promote | Offer modifier: keyword-level URL to demo page |
| "crm platform" | ✅ Promote | Synonym: DKI shows "CRM Platform" |
| "crm tool" | ✅ Promote | Synonym: different phrasing users search |
| "software crm" | ❌ Skip | Word order variant |
| "crm softwares" | ❌ Skip | Plural/grammar variant |
| "crm software online" | ❌ Skip | "Online" adds no value |

#### Lead Gen: Divorce lawyer

**Ad Group:** Divorce Lawyer Amsterdam

**Existing keywords:** "divorce lawyer amsterdam"

| Search Term | Decision | Reasoning |
| --- | --- | --- |
| "divorce attorney amsterdam" | ✅ Promote | Synonym: "attorney" vs. "lawyer" |
| "hire divorce lawyer amsterdam" | ✅ Promote | Action modifier: DKI shows intent |
| "divorce lawyer amsterdam free consultation" | ✅ Promote | Offer modifier: keyword-level URL to consultation page |
| "amsterdam divorce lawyer" | ❌ Skip | Word order variant |
| "divorce lawyers amsterdam" | ❌ Skip | Plural variant |
| "lawyer for divorce amsterdam" | ❌ Skip | Awkward phrasing |

---

### Validation & definition of done

#### How to validate

1. **Immediate:** Confirm keyword is active (no limited status) and accruing impressions.
2. **Short-term (7-14 days):** Check that the keyword is capturing the intended search terms.
3. **Medium-term (14-30 days):** QS populates: is it in line with ad group average?

#### Red flags to watch

| Signal | Meaning | Action |
| --- | --- | --- |
| New keyword has significantly lower QS than ad group average | Potential ad/LP mismatch | See [Improve Quality Score](../playbooks/Improve Quality Score.md) |
| New keyword generates impressions but no conversions | Fragmentation without value | Consider pausing/removing |

#### Definition of done

You are finished with this SOP when:

- [ ] High-signal search terms (per volume thresholds) have been evaluated
- [ ] Decision framework applied to each candidate
- [ ] Promoted keywords added with correct match type
- [ ] Keyword-level Final URLs set where applicable
- [ ] No routing overlap issues
- [ ] No red flags after 14-day monitoring period

---

### FAQ

**Q: How many keywords should I promote per ad group?**

A: No magic number. Promote only what passes the decision framework. Some ad groups need 0 new keywords, others need 5+. **Quality over quantity.**

**Q: Should I promote queries with conversions even if they're close variants?**

A: Not automatically. A converting close variant is still a close variant. If it fragments without adding control or visibility, skip it. The existing keyword is already capturing those conversions.

**Q: What if a query would pass the framework but has very low volume?**

A: Low volume = slow QS feedback. You can still promote for DKI value or routing control, but don't expect fast diagnostic insights. Prioritize high-volume candidates first.

**Q: Should I delete the old keyword after promoting a more specific version?**

A: Usually no. The original keyword serves as your catch-all. The promoted keyword handles the specific variant. They work together.

**Q: How does this relate to broad match strategy?**

A: Broad match is your discovery layer. This SOP is about what you do with those discoveries. High-signal queries graduate from broad → exact. You don't "promote into broad".

**Q: What if I'm not using DKI?**

A: Promotion still adds value for QS monitoring, Auction Insights, routing control, and automation. But DKI is a major leverage point: consider enabling it.

**Q: Can I run this SOP for a brand new ad group?**

A: Yes, but you need data first. Wait 30 days for the Search Terms Report to populate, or seed keywords from research, then run this SOP after data accumulates.

**Q: When should I use a keyword-level Final URL vs. splitting to a new ad group?**

A: Use keyword-level Final URL when the same ad works but a different LP converts better. Split when you need a meaningfully different ad (different headline, different CTA, different offer).

---

### Common mistakes

| Mistake | Why it's a problem | Fix |
| --- | --- | --- |
| Promoting every search term with conversions | Creates fragmentation: many are close variants | Apply decision framework strictly |
| Promoting word order variants | No DKI benefit + fragments data | Skip these |
| Promoting into broad match | Defeats the purpose: broad is for discovery | Use exact (default) or phrase |
| Promoting queries that need different ads | These are Split & Route cases | Move to new ad group instead |
| Not setting keyword-level Final URLs when relevant | Misses LP relevance opportunity | Set custom URL for better conversion |
| Not monitoring post-promotion | Miss red flags: don't learn what works | Check at 7-30 days |

---

### Exit → entry bridge

Once complete, promoted keywords are active and monitored. From here:

- If promoted keywords surface Ad Relevance issues → [SOP – Improve Ad Relevance](../sops/SOP – Improve Ad Relevance.md)
- If promoted keywords need creative testing → [SOP – Improve Expected CTR](../sops/SOP – Improve Expected CTR.md)
- If routing overlap requires cleanup → add negative keywords directly to shared lists or via [SOP – Run N-gram Analysis](../sops/SOP – Run N-gram Analysis.md)

---

### Related SOPs

| SOP | Relationship |
| --- | --- |
| [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md) | Upstream (identifies promotion candidates) |
| [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md) | Upstream (determines whether to split or promote) |
| [SOP – Build Search Campaign Structure](../sops/SOP – Build Search Campaign Structure.md) | Upstream (creates new ad groups when no suitable home exists) |
| [SOP – Improve Ad Relevance](../sops/SOP – Improve Ad Relevance.md) | This SOP is Phase 2.2 dependency |
| [SOP – Improve Expected CTR](../sops/SOP – Improve Expected CTR.md) | Downstream (promoted keywords may surface new creative angles) |
| [SOP – Run N-gram Analysis](../sops/SOP – Run N-gram Analysis.md) | Parallel (routing cleanup if needed) |

### Related documents

| Document | Type | Relationship |
| --- | --- | --- |
| [Search Term Report Reference](../references/Search Term Report Reference.md) | Reference | STR columns, filters, interpretation |
| [Match Type Reference](../references/Match Type Reference.md) | Reference | Match type selection guidance |
| [Modern Search Campaign Mental Model](../mental-models/Modern Search Campaign Mental Model.md) | Mental Model | Campaign structure context |

---

### Version details

- **Version:** 1.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

### Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

(c) 2026 PPC Mastery B.V. All rights reserved.