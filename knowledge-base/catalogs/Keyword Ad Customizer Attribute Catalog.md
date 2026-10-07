# Keyword Ad Customizer Attribute Catalog
Created: 2026-02-04

Support_ID: CATALOG_4
Status: Done
Category: Creative
Reference Type: Catalog
Agent_Readable: No
Human_Facing: No
Bucket: Creative
Domain: Creative
Pillar: 8

## Purpose

Lists reusable keyword-level customizer attributes for RSA relevance optimization

---

## What this catalog is / What this is NOT

**This catalog:**

- Lists keyword-level attribute types and their purposes
- Provides example values by vertical
- Explains when each attribute is useful

**This catalog does NOT:**

- Provide step-by-step setup instructions (See: [SOP – Set Up Keyword-Level Ad Customizers](../sops/SOP – Set Up Keyword-Level Ad Customizers.md))
- Validate customizer quality (See: [Ad Customizer Quality Checklist](../checklists/Ad Customizer Quality Checklist.md))

---

## Core keyword attributes

| **Attribute** | **Data type** | **Purpose** | **When to use** |
| --- | --- | --- | --- |
| **KeywordSingular** | Text | Singular form of core keyword | When you need the singular variant of the core keyword |
| **KeywordPlural** | Text | Plural form of core keyword | When you need the plural variant of the core keyword |
| **FullKeywordSingular** | Text | Complete keyword phrase (singular) | When you need the full keyword |
| **FullKeywordPlural** | Text | Complete keyword phrase (plural) | When you need the full keyword |

> 💡 **These attributes are fully custom.** The names adapt to the account. What matters is consistent usage across keywords and RSAs.

---

## Example mappings by vertical

### 1️⃣ Ecommerce (dining tables)

**Ad Group: Dining Tables**

This ad group consolidates material variations (oak, marble), style variations (round, extendable), and synonym variations (dining table, dining-room table).

| **Keyword** | **KeywordSingular** | **KeywordPlural** | **FullKeywordSingular** | **FullKeywordPlural** | Material | Modifier |
| --- | --- | --- | --- | --- | --- | --- |
| dining tables | dining table | dining tables | dining table | dining tables |  |  |
| dining-room table | dining table | dining tables | dining-room table | dining-room tables |  |  |
| oak dining table | dining table | dining tables | oak dining table | oak dining tables | oak |  |
| marble dining tables | dining table | dining tables | marble dining table | marble dining tables | marble |  |
| round dining table | dining table | dining tables | round dining table | round dining tables |  | round |
| extendable dining table | dining table | dining tables | extendable dining table | extendable dining tables |  | extendable |
| walnut dining-room table | dining-room table | dining-room tables | walnut dining-room table | walnut dining-room tables | walnut |  |

### 2️⃣ Lead Gen (emergency plumber)

**Ad Group: Emergency Plumber**

This ad group consolidates urgency variations (emergency, 24 hour, same day, after hours).

| **Keyword** | **KeywordSingular** | **KeywordPlural** | **FullKeywordSingular** | **FullKeywordPlural** | **Descriptor** |
| --- | --- | --- | --- | --- | --- |
| emergency plumber | Plumber | Plumbers | Emergency Plumber | Emergency Plumbers | Emergency |
| 24 hour plumber | Plumber | Plumbers | 24 Hour Plumber | 24 Hour Plumbers | 24 Hour |
| 24/7 plumber | Plumber | Plumbers | 24/7 Plumber | 24/7 Plumbers | 24/7 |
| urgent plumber | Plumber | Plumbers | Urgent Plumber | Urgent Plumbers | Urgent |
| same day plumber | Plumber | Plumbers | Same-Day Plumber | Same-Day Plumbers | Same-Day |
| after hours plumber | Plumber | Plumbers | After Hours Plumber | After Hours Plumbers | After Hours |
| weekend plumber | Plumber | Plumbers | Weekend Plumber | Weekend Plumbers | Weekend |
| night plumber | Plumber | Plumbers | Night Plumber | Night Plumbers | Night |

> ⚠️ **Ad Customizer values are inserted literally.** The casing stored in the feed is the casing that appears in the ad.

---

## RSA examples by vertical

### 1️⃣ Ecommerce (dining tables)

| Type | **Content** |
| --- | --- |
| H1 | Shop `{CUSTOMIZER.KeywordPlural:dining tables}` online |
| H2 | 200+ `{CUSTOMIZER.KeywordPlural:dining tables}` in stock |
| H3 | Find your perfect `{CUSTOMIZER.KeywordSingular:dining table}` |
| H4 | High-quality `{CUSTOMIZER.Material:tables}` only |
| D1 | Shop our `{CUSTOMIZER.Material:high-quality} {CUSTOMIZER.KeywordPlural:dining tables}`. Free shipping on orders over €500. |
| D2 | Find the perfect `{CUSTOMIZER.FullKeywordSingular:dining table}` for your home. 100-day returns & 10-year warranty. |

**Example outputs:**

| **Keyword** | **H1** | **H4** | **D2** |
| --- | --- | --- | --- |
| oak dining table | Shop `dining tables` online | High-quality `oak` only | Find the perfect `oak dining table` for your home. 100-day returns & 10-year warranty. |
| round dining table | Shop `dining tables` online | High-quality `tables` only | Find the perfect `round dining table` for your home. 100-day returns & 10-year warranty. |
| dining-room tables | Shop `dining-room tables` online | High-quality `tables` only | Find the perfect `dining-room table` for your home. 100-day returns & 10-year warranty. |

### 2️⃣ Lead Gen (emergency plumber)

| **Slot** | **Content** |
| --- | --- |
| H1 | `{CUSTOMIZER.Descriptor:Fast}` Service Available Now |
| H2 | Trusted `{CUSTOMIZER.FullKeywordPlural:Emergency Plumbers}` |
| H3 | Call Your `{CUSTOMIZER.KeywordSingular:Plumber}` Now |
| H4 | Licensed & Insured `{CUSTOMIZER.KeywordPlural:Plumbers}` |
| D1 | `{CUSTOMIZER.Descriptor:Emergency}` plumbing service available right now. Call for a free quote: we're standing by. |
| D2 | Trusted `{CUSTOMIZER.Descriptor:local} {CUSTOMIZER.KeywordPlural:plumbers}` in your area. Fast response, fair prices, guaranteed. |

**Example outputs:**

| **Keyword** | **H1** | **H2** | **D1** |
| --- | --- | --- | --- |
| emergency plumber | `Emergency` Service Available Now | Trusted `Emergency Plumbers` | `Emergency` plumbing service available right now. Call for a free quote: we're standing by. |
| 24 hour plumber | `24 Hour` Service Available Now | Trusted `24 Hour Plumbers` | `24 Hour` plumbing service available right now. Call for a free quote: we're standing by. |
| same day plumber | `Same-Day` Service Available Now | Trusted `Same-Day Plumbers` | `Same-Day` plumbing service available right now. Call for a free quote: we're standing by. |

> 💡 **Start simple.** Extra attributes earn their place only when the keyword variations require them.

---

## Version details

- **Version:** 2.0
- **Last Updated:** January 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

© 2026 PPC Mastery B.V. All rights reserved.