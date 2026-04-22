# Brand Separation Reference
Created: 2026-02-04
Updated: 2026-04-02

Support_ID: CHEATSHEET_9
Status: Done
Category: Operational
Reference Type: Cheat Sheets
Agent_Readable: Yes
Human_Facing: Yes
Applies_To: Search, Shopping, PMax
Domain: Search
Pillar: 6

## Purpose

Documents how to implement brand separation per campaign type (Search, Standard Shopping, PMax) and how to verify it is working.

---

## What this reference is / What this is NOT

**This reference:**

- Provides implementation steps per campaign type (Search, Standard Shopping, PMax)
- Documents brand exclusion mechanics in PMax
- Provides verification methods and red flags

**This reference does NOT:**

- Explain brand keyword bidding strategy (See: [Bidding Strategy Mental Model](../mental-models/Bidding Strategy Mental Model.md))
- Explain brand campaign structure (See: campaign-specific Mental Models)
- Provide brand keyword research (See: [SOP – Build Search Campaign Structure](../sops/SOP – Build Search Campaign Structure.md))
- Cover brand safety / brand suitability settings (that is content suitability, not brand separation)

---

## Quick reference: brand separation by campaign type

| **Campaign Type** | **Method** | **Implementation** |
| --- | --- | --- |
| **Search** | Dedicated Brand campaign + negatives | Create Brand campaign with brand keywords. Add brand terms as negatives in all non-brand campaigns. |
| **Standard Shopping** | Dedicated Brand Shopping campaign + negatives | Create Brand Shopping campaign. Add brand terms as negative keywords in non-brand Shopping campaigns. |
| **PMax** | Campaign-level brand exclusions | Go to PMax campaign Settings > Brand exclusions > select your brand. |

---

## When to use this reference

Brand separation is a structural prerequisite for accurate campaign measurement. The structure mental models explain why and when it applies:

- [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md): brand always separates at the campaign level
- [Shopping Campaign Type Mental Model](../mental-models/Shopping Campaign Type Mental Model.md): brand separation across all Ecommerce campaign types
- [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>): brand exclusions for Ecommerce PMax
- [PMax Structure Mental Model (Lead Gen/SaaS)](<../mental-models/PMax Structure Mental Model (Lead Gen-SaaS).md>): brand exclusions for Lead Gen/SaaS PMax

**Skip brand separation only when:** the account is brand-only, or the account is brand-new with zero recognition. Re-evaluate monthly.

---

## Implementation: Search

Create a dedicated Brand Search campaign with all brand keywords (brand name, brand + product, brand + pricing, misspellings). Set Max CPC bidding targeting >85% absolute top of page rate. Create a shared "Branded" negative keyword list using **broad match** (catches more variations than exact or phrase) and apply it to all non-brand Search campaigns. Verify by checking search terms in non-brand campaigns for brand query leakage.

> ↪️ **Full setup steps:** See [SOP - Build Search Campaign Structure](../sops/SOP – Build Search Campaign Structure.md) for the complete brand campaign build procedure.

---

## Implementation: Standard Shopping

Create a dedicated Brand Shopping campaign (Low priority) targeting products where your brand appears in the product title or brand attribute. Set non-brand Shopping campaigns to High priority with brand terms as negative keywords. This creates query sculpting: brand queries hit the high-priority non-brand campaign first, get rejected by the negative, and fall through to the low-priority Brand campaign.

> ↪️ **Full setup steps:** See [SOP - Launch Standard Shopping Campaign](../sops/SOP – Launch Standard Shopping Campaign.md) for the complete Shopping campaign build procedure.

---

## Implementation: Performance Max

In each non-brand PMax campaign, go to **Settings > Brand exclusions > Exclude specific brands**, search for your brand, and select it (add as custom if not listed). Exclude your primary brand name, variations, misspellings, and sub-brands. After saving, confirm exclusions display correctly and check the search terms report within the first week for brand leakage.

> ⚠️ **Brand exclusions in PMax are not negative keywords:** Google uses its own brand classification system (not keyword-based). Some branded queries slip through if Google does not classify them as brand. Supplement with negative keyword lists and weekly monitoring.

> ↪️ **Full setup steps:** See [SOP - Manage PMax Search Terms and Brand Defense](../sops/SOP – Manage PMax Search Terms and Brand Defense.md) for the complete PMax brand exclusion procedure.

### Brand exclusion limitations (brand/non-brand bleeding)

PMax brand exclusions match exact brand names but do not catch variations:

| **Limitation** | **Impact** | **Workaround** |
| --- | --- | --- |
| Misspellings not caught | Brand queries with typos (e.g., "Nikee" for "Nike") serve in non-brand PMax | Add common misspellings to negative keyword lists |
| Abbreviations not caught | Shortened brand names (e.g., "MS" for "Microsoft") bypass exclusions | Add abbreviations to negative keyword lists |
| Word order variations | Different word arrangements may bypass filters | Build comprehensive negative keyword lists |

**Recommendation:** Treat PMax brand exclusions as the first layer of defense. Use negative keyword lists as the primary mechanism for strict brand/non-brand separation in PMax.

> ↪️ **AI Max has the same limitation:** AI Max brand inclusions and exclusions match exact brand names only, missing misspellings, abbreviations, and word order variations. Without brand exclusions configured before enabling AI Max, expanded matching can aggressively scale into competitor brand queries. See [AI Max for Search Mental Model](../mental-models/AI Max for Search Mental Model.md) for the full risk profile.

---

## Verification: how to confirm brand separation is working

| **Check** | **How** | **Frequency** |
| --- | --- | --- |
| **Search terms report** | Review non-brand campaigns for brand query leakage | Weekly |
| **Brand campaign metrics** | Brand campaign shows high CTR (15%+), low CPA, high ROAS | Weekly |
| **Non-brand metrics** | Non-brand shows realistic (lower) CTR and higher CPA/lower ROAS than brand | Weekly |
| **PMax search terms** | Check for brand queries appearing in non-brand PMax campaigns | Weekly |
| **Auction insights** | Brand campaign shows 90%+ impression share for brand terms | Monthly |

### Red flags that separation is failing

| **Signal** | **Likely Cause** | **Fix** |
| --- | --- | --- |
| Non-brand campaign has CTR >10% | Brand queries leaking in | Add more brand negatives |
| PMax search terms show brand queries | Brand exclusions incomplete | Add brand to PMax exclusion list |
| Brand campaign has <80% impression share | Brand keywords missing or budget too low | Add keywords, increase budget |
| Blended ROAS drops when brand campaign paused | Non-brand was hidden behind brand performance | Adjust non-brand targets to realistic levels |

---

## Common mistakes

| **Mistake** | **Problem** | **Fix** |
| --- | --- | --- |
| Not separating brand at all | Metrics inflated, Smart Bidding optimizes for wrong signal | Implement brand separation per campaign type |
| Using only exact match brand negatives | Phrase and broad brand queries still leak through | Add phrase match brand negatives at minimum |
| Forgetting PMax brand exclusions | PMax captures brand traffic, inflates its metrics | Add brand exclusions in every non-brand PMax campaign |
| Relying only on brand exclusions (PMax/AI Max) | Misspellings, abbreviations, and variations slip through | Supplement with negative keyword lists for thorough coverage |
| No monitoring after setup | Brand queries evolve over time | Review search terms weekly |
| Separating brand but not adjusting non-brand targets | Non-brand targets were set based on inflated blended data | Re-evaluate CPA/ROAS targets after separation |

---

## Related documents

| **Document** | **Relationship** |
| --- | --- |
| [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md) | Uses brand separation as structural prerequisite |
| [Standard Shopping Campaign Structure Mental Model](../mental-models/Standard Shopping Campaign Structure Mental Model.md) | Uses brand separation for Standard Shopping structure |
| [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>) | Uses brand exclusions for Ecommerce PMax structure |
| [PMax Structure Mental Model (Lead Gen/SaaS)](<../mental-models/PMax Structure Mental Model (Lead Gen-SaaS).md>) | Uses brand exclusions for Lead Gen/SaaS PMax structure |
| [Shopping Campaign Type Mental Model](../mental-models/Shopping Campaign Type Mental Model.md) | Brand separation as principle across all Ecommerce campaign types |
| [Search PMax Query Routing Reference](../references/Search PMax Query Routing Reference.md) | Brand exclusion coordination between Search and PMax |
| [AI Max for Search Mental Model](../mental-models/AI Max for Search Mental Model.md) | Brand control limitations in AI Max for Search |
| [SOP – Build Search Campaign Structure](../sops/SOP – Build Search Campaign Structure.md) | Execution (brand campaign setup) |

---

## Version details

- **Version:** 6.0
- **Last Updated:** April 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
