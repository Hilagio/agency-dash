# Brand Separation Reference
Created: 2026-02-04
Updated: 2026-07-13

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

- Documents the brand-control mechanism per campaign type (Search, Standard Shopping, PMax)
- Documents brand exclusion mechanics in PMax
- Provides verification methods and red flags

**This reference does NOT:**

- Explain brand keyword bidding strategy (See: [Bidding Strategy Mental Model](../mental-models/Bidding Strategy Mental Model.md))
- Explain brand campaign structure (See: campaign-specific Mental Models)
- Provide brand keyword research (See: [SOP – Build Search Campaign Structure](../sops/SOP – Build Search Campaign Structure.md))
- Cover brand safety / brand suitability settings (that is content suitability, not brand separation)

---

## Quick reference: brand controls by campaign type

One table, one row per campaign type: the mechanism that controls brand traffic, the scope it actually covers, and the gap it leaves open.

| **Campaign Type** | **Mechanism** | **Scope** | **Known gaps** |
| --- | --- | --- | --- |
| **Search** | Dedicated Brand campaign + broad match brand negatives in all non-brand campaigns | String-level: blocks every query the negative matches | You enumerate variants yourself. Misspellings and translations you have not listed leak through |
| **Standard Shopping** | Dedicated Brand Shopping campaign (Low priority) + brand negatives in High-priority non-brand campaigns | String-level, same as Search, applied through priority sculpting | Same enumeration burden as Search |
| **AI Max for Search** | Branded searches mode: show on all relevant searches (default), controlled with inclusions + exclusions (exclusions win on conflict), or unbranded only | Google's brand classification of Search queries | Catches exact brand names only. Misses misspellings, abbreviations, and word-order variants. The default mode applies no brand control at all |
| **PMax** | Campaign-level brand exclusions (brand lists) | Applies to only Search, Shopping, and YouTube search inventory. An optional checkbox still allows Shopping ads on searches for excluded brands | Same classification gaps as AI Max. Non-search PMax surfaces (Display, Gmail, Discover, Maps) are not covered by brand exclusions |

Implementation steps per campaign type follow below.

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

Search brand separation rests on two objects: a dedicated Brand Search campaign holding every brand keyword (brand name, brand + product, brand + pricing, misspellings), and a shared "Branded" negative keyword list applied to every non-brand Search campaign. The list uses **broad match**, which catches more variations than exact or phrase. Leakage shows up as brand queries in the non-brand campaigns' search terms.

> ↪️ **Full setup steps:** See [SOP - Build Search Campaign Structure](../sops/SOP – Build Search Campaign Structure.md) for the complete brand campaign build procedure.

---

## Implementation: Standard Shopping

Create a dedicated Brand Shopping campaign (Low priority) targeting products where your brand appears in the product title or brand attribute. Set non-brand Shopping campaigns to High priority with brand terms as negative keywords. This creates query sculpting: brand queries hit the high-priority non-brand campaign first, get rejected by the negative, and fall through to the low-priority Brand campaign.

> ↪️ **Full setup steps:** See [SOP - Launch Standard Shopping Campaign](../sops/SOP – Launch Standard Shopping Campaign.md) for the complete Shopping campaign build procedure.

---

## Implementation: Performance Max

PMax brand exclusions live under **Settings > Brand exclusions > Exclude specific brands** on each non-brand campaign. A brand not in Google's list can be added as a custom entry. The set that needs excluding is the primary brand name plus its variations, misspellings, and sub-brands. Leakage shows up as brand queries in the campaign's search terms report.

> ⚠️ **Brand exclusions in PMax are not negative keywords:** Google uses its own brand classification system (not keyword-based). Some branded queries slip through if Google does not classify them as brand. Supplement with negative keyword lists and weekly monitoring.

**Inventory scope:** PMax brand exclusions apply to only Search, Shopping, and YouTube search inventory. YouTube search is explicitly in scope, the non-search PMax surfaces (Display, Gmail, Discover, Maps) are not. A separate checkbox keeps Shopping ads serving on searches for excluded brands, so strict brand separation requires it left unchecked.

> ↪️ **Full setup steps:** See [SOP - Manage PMax Search Terms and Brand Defense](../sops/SOP – Manage PMax Search Terms and Brand Defense.md) for the complete PMax brand exclusion procedure.

### Brand exclusion limitations (brand/non-brand bleeding)

PMax brand exclusions match exact brand names but do not catch variations:

| **Limitation** | **Impact** | **Workaround** |
| --- | --- | --- |
| Misspellings not caught | Brand queries with typos (e.g., "Nikee" for "Nike") serve in non-brand PMax | Add common misspellings to negative keyword lists |
| Abbreviations not caught | Shortened brand names (e.g., "MS" for "Microsoft") bypass exclusions | Add abbreviations to negative keyword lists |
| Word order variations | Different word arrangements may bypass filters | Build comprehensive negative keyword lists |

PMax brand exclusions are therefore a first layer only. Strict brand and non-brand separation in PMax rests on negative keyword lists, which catch the variations the classifier does not.

> ↪️ **AI Max has the same limitation:** AI Max brand controls (the Branded searches setting) match exact brand names only, missing misspellings, abbreviations, and word order variations. Its default mode, "show ads on all relevant searches", scales into competitor brand queries until you switch to "unbranded only" or the controlled inclusion/exclusion mode. See [AI Max for Search Mental Model](../mental-models/AI Max for Search Mental Model.md) for the full risk profile.

---

## Brand controls across campaign types

Brand separation uses three distinct controls. They are not interchangeable: each operates at a different level and catches different things. Knowing which control exists per campaign type, and how they pair, is the difference between thorough brand defense and silent leakage.

| **Control** | **Where it lives** | **Available in** | **Not available in** | **What it does** |
| --- | --- | --- | --- | --- |
| **Brand inclusions** | Campaign and ad group level | AI Max for Search | PMax | Deliberately ALLOW serving on specific brand terms when brand defense is intentional |
| **Brand exclusions** | Campaign level | AI Max for Search, Performance Max | Standard Search (use negatives) | Suppress the listed brands across the campaign |
| **Negative keywords** | Keyword/list level | Search, Shopping (and as a backstop for AI Max + PMax) | N/A | Precise string-level block of exact/phrase terms |

### AI Max: the Branded searches mode selector

In AI Max, brand inclusions and exclusions are not standalone toggles. They live inside one campaign-level setting, **Branded searches**, which has three modes. Pick the mode first, then populate lists only if you chose the controlled mode.
| Mode | Purpose | Brand separation effect |
|------|-----------|------------------------|
| Show ads on all relevant searches | Maximize reach | None. AI Max serves on your brand and competitor brands. This is the default and the leakage risk |
| Control branded searches with brand inclusions and exclusions | Deliberately allow or block specific brands | Selective. Inclusions open a brand, exclusions close one (exclusion wins on conflict) |
| Show ads only on unbranded searches | Keep AI Max off every brand Google knows | Cleanest separation. Brand and competitor traffic stay in your dedicated campaigns |

> ⚠️ **Default prescription: every AI Max enablement sets Branded searches to "unbranded only".** Deviate only when brand defense through AI Max is a deliberate, documented choice. Use the controlled mode only when deliberate brand defense (inclusions) or selective competitor blocking is the strategy, and record that decision.

The mode is a net, not a wall. It catches exact brand names but misses misspellings, abbreviations, and word-order variants. Layered defense stays mandatory regardless of mode:

1. **Branded searches mode** set to "unbranded only" (or a documented exception)
2. **Negative keyword lists** as the string-level backstop for the variants the classifier misses
3. **Ongoing search-term review** to catch what both layers let through

### Inclusions vs exclusions: opposite intents

- **Brand inclusions** open a door: inside the controlled Branded searches mode, they tell AI Max it is allowed to serve on the named brand terms. Use them only when serving on a brand is a deliberate strategy (for example, defending your own brand inside an AI Max campaign, or an authorized reseller bidding on a brand you are permitted to target).
- **Brand exclusions** close a door: they tell AI Max or PMax to suppress the named brands. Use them to keep automated campaigns off your own brand (so it stays in the dedicated Brand campaign) or off competitor brands you do not want to chase.

### Pairing logic: semantic net plus surgical backstop

Brand exclusions and negative keywords solve the same problem from opposite ends, and neither covers the other's range.

| **Layer** | **Mechanism** | **Strength** | **Best for** |
| --- | --- | --- | --- |
| **Brand exclusions** | List-based and semantic: Google's brand list catches variants, misspellings, and brand-entity matches automatically | Broad coverage of a whole brand family without enumerating every string | Broad brand-family suppression in automated campaigns (AI Max, PMax) |
| **Negative keywords** | Precise string control: exact and phrase match against literal terms | Surgical, predictable, catches what the brand list misses and unblocks what it over-blocks | The backstop for terms the brand list misses, or terms it over-blocks |

Brand exclusions are the semantic net. Negative keyword lists are the surgical precision layer underneath. The brand list will catch most of a brand family automatically, but it will also miss edge cases and occasionally over-block legitimate terms. Negative lists let you patch both gaps without loosening the whole net.

> 💡 **Run both layers in automated campaigns.** Set brand exclusions for broad brand-family suppression, then add negative keyword lists for the exact and phrase terms the brand list misses or over-blocks. Neither layer alone is thorough.

### Eligibility nuance: keep dedicated brand and competitor campaigns funded

If a dedicated Brand campaign or a dedicated competitor-conquesting campaign runs out of budget and becomes ineligible, AI Max and other automated campaigns will absorb that traffic. The brand or competitor queries do not disappear: they flow to whichever campaign is still eligible to serve.

> ⚠️ **Budget starvation breaks brand separation.** A dedicated Brand or competitor campaign that goes ineligible on budget hands its queries to AI Max or PMax, reinflating their metrics and undoing the separation. Keep these campaigns funded so they stay eligible to own their queries.

### Stance on Google's auto brand-inclusion recommendation

Google surfaces an automated recommendation that nudges you to let AI Max serve on brand (the "brand-inclusion recommendation"). This is a recommendation to scrutinize, not a default to accept.

| **Action** | **Default stance** |
| --- | --- |
| Google's AUTO brand-inclusion recommendation | DECLINE by default. Treat it as a prompt to review, not an instruction. Only accept when brand defense via AI Max is a deliberate, chosen strategy. |
| MANUAL brand inclusions | Configure deliberately, at the ad group level, only when you have decided AI Max should serve on a specific brand. |
| MANUAL brand exclusions | Configure deliberately, at the campaign level, to suppress brands you do not want automated campaigns chasing. |

> ⚠️ **Default-decline the auto brand-inclusion recommendation.** Accepting it lets AI Max serve on brand without a deliberate decision, which inflates AI Max metrics and pulls traffic away from the dedicated Brand campaign. Decline it unless brand defense inside AI Max is your chosen strategy. If you simply want AI Max off all brand traffic, set Branded searches to "unbranded only" instead of managing lists. Set inclusions and exclusions manually only when selective brand defense is the goal.

> ↪️ **AI Max mechanics:** See [AI Max for Search Mental Model](../mental-models/AI Max for Search Mental Model.md) for the full AI Max risk profile, and [Negative Keyword Reference](../references/Negative Keyword Reference.md) plus [Negative Keyword Catalog](../catalogs/Negative Keyword Catalog.md) for building the negative-keyword backstop.

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
| [AI Max for Search Mental Model](../mental-models/AI Max for Search Mental Model.md) | Brand control limitations and risk profile in AI Max for Search |
| [Negative Keyword Reference](../references/Negative Keyword Reference.md) | Negative keyword backstop for the brand-exclusion semantic net |
| [Negative Keyword Catalog](../catalogs/Negative Keyword Catalog.md) | Negative keyword options for surgical brand/competitor blocking |
| [SOP – Build Search Campaign Structure](../sops/SOP – Build Search Campaign Structure.md) | Execution (brand campaign setup) |

---

## Version details

- **Version:** 9.0
- **Last Updated:** July 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
