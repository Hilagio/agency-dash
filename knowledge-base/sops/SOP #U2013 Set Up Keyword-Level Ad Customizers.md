# SOP – Set Up Keyword-Level Ad Customizers
Created: 2026-02-04
Updated: 2026-04-02

SOP_ID: SOP_6
Status: Done
Category: Creative
Primary Outcome: Keyword-level customizers improving Ad Relevance without ad group fragmentation
Agent_Executable: No
Human_Approval_Required: No
Domain: Creative
Pillar: 8

### Purpose

This SOP sets up Ad Customizers at the **keyword level** to dynamically tailor RSA copy without splitting into multiple ad groups.

> ❓ **The big question:** How do I make my ads perfectly relevant to each keyword without fragmenting my account into dozens of small ad groups?

> ⚠️ **Ad Relevance boost:** Keyword-level customizers let you control singular/plural, descriptors, and full phrases per keyword, allowing you to aggressively consolidate ad groups while keeping your Ad Relevance in check. **Beware: This is a highly advanced tactic.**

---

### What this SOP is NOT

This SOP does **not:**

- Cover dynamic pricing, inventory, or product feeds (See: [SOP – Set Up Dynamic Ad Customizers](../sops/SOP – Set Up Dynamic Ad Customizers.md))
- Explain basic Keyword Insertion syntax (See: [Dynamic Text Reference](../references/Dynamic Text Reference.md))
- Teach RSA composition (See: [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md))

---

### When to run this SOP

**Run when:**

- You have keywords with variations (singular/plural, descriptors, synonyms)
- You want to consolidate ad groups without losing ad relevance
- Standard Keyword Insertion doesn't give you enough control
- Ad Relevance is suffering despite tight ad group structure

**Do NOT run when:**

- Low-volume ad groups where manual edits are faster
- Brand campaigns where variations don't matter
- You can't commit to maintaining values when keywords are added
- You don't have stable naming conventions for campaigns/ad groups (exact-match targeting will break when names change)

---

### Before you start

**Required:**

- Google Ads account with Editor access
- Keyword list for the ad group
- [Keyword Ad Customizer Attribute Catalog](../catalogs/Keyword Ad Customizer Attribute Catalog.md) reviewed

**Have open:**

- [Keyword Ad Customizer Attribute Catalog](../catalogs/Keyword Ad Customizer Attribute Catalog.md)
- [Ad Customizer Quality Checklist](../checklists/Ad Customizer Quality Checklist.md)
- Your keyword list (exported or visible)

---

### Critical rules (memorize these)

1. **Defaults are set in the RSA syntax**, not at the attribute level
2. **Defaults must read naturally everywhere:** Never create broken grammar if the default fires
3. **Values are inserted literally:** Always enter values in the exact casing you want to appear in ads

---

## Execution

### Phase 1️⃣: Plan attributes

1. Review your keyword list
2. Identify variation patterns (singular/plural, descriptors, synonyms)
3. Select attributes from [Keyword Ad Customizer Attribute Catalog](../catalogs/Keyword Ad Customizer Attribute Catalog.md)
4. Map values to keywords in a spreadsheet before entering

**Typical attribute set:**

| **Attribute** | **Purpose** | **Example Values** |
| --- | --- | --- |
| KeywordSingular | Singular form of core keyword | dining table, plumber |
| KeywordPlural | Plural form of core keyword | dining tables, plumbers |
| FullKeywordSingular | Complete keyword phrase (singular) | oak dining table, emergency plumber |
| FullKeywordPlural | Complete keyword phrase (plural) | oak dining tables, emergency plumbers |

**Vertical-specific attributes (add when needed):**

| **Vertical** | **Additional Attribute** | **Purpose** | **Example Values** |
| --- | --- | --- | --- |
| Ecommerce | Material | Material type | oak, marble, walnut |
| Ecommerce | Modifier | Style/feature modifier | round, extendable |
| Services | Descriptor | Service modifier | emergency, 24 hour, same-day |

> 💡 **Start simple:** The four core attributes cover 80% of use cases. Add vertical-specific attributes only when your keyword variations require them.

---

### Phase 2️⃣: Create attributes in Business Data

1. Go to **Tools & Settings** → **Business Data** → **Ad customizer attributes**
2. Click **+**
3. For each attribute:
    - Enter name (e.g., "KeywordSingular")
    - Select Data type: **Text**
    - Leave Account value blank (defaults are set in the RSA)
4. Click **Create**

![image.png](image.png)

---

### Phase 3️⃣: Assign keyword-level values

1. Go to **Keywords** view in your target ad group
2. Click **Columns** icon → expand **Ad customizer attributes** → check your attributes → **Apply**
3. For each keyword:
    - Click the cell under the attribute column
    - Select **"Use custom value"**
    - Enter the value for this keyword
    - Click **Save**
4. Repeat for all keywords and all attributes

![image.png](image%201.png)

> 💡 **Work systematically:** Complete one attribute column for all keywords before moving to the next. This reduces errors and speeds up the process.

---

### Phase 4️⃣: Add customizers to RSA

1. Open your RSA
2. In headline/description, type `{`
3. Select **Ad customizer** → select attribute → enter default
4. Apply

**Syntax:** `{CUSTOMIZER.AttributeName:Default Text}`

> ⚠️ **Default text is critical:** The default shows when no keyword-level value exists. It must read naturally and make grammatical sense in every position where it's used.

---

### Phase 5️⃣: Validate

1. Go to **Tools & Settings** → **Ad Preview and Diagnosis**
2. Test 5-10 keywords from your list
3. Verify correct values appear (not defaults)
4. Run [Ad Customizer Quality Checklist](../checklists/Ad Customizer Quality Checklist.md)

---

### Definition of done

- [ ]  Attributes created in Business Data
- [ ]  Values assigned to all keywords
- [ ]  RSA updated with customizer syntax
- [ ]  5+ keywords tested in Ad Preview: correct values showing
- [ ]  Defaults only appear when expected
- [ ]  [Ad Customizer Quality Checklist](../checklists/Ad Customizer Quality Checklist.md) passed

---

### Exit → Entry bridge

| **Next Step** | **When** |
| --- | --- |
| Monitor Ad Relevance impact | 7-14 days |
| Add values for new keywords | When keywords added |
| Proceed to [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md) | When RSA live + stable |

---

### Ongoing hygiene (not a separate doc)

- **When adding new keywords:** assign Ad Customizer values immediately
- **Monthly:** spot-check 5 keywords in Ad Preview
- **If restructuring campaigns:** verify targeting names still match

---

### FAQ

**Q: How is this different from standard Dynamic Keyword Insertion (DKI)?**

A: DKI inserts the keyword exactly as it exists in your account. Keyword-level customizers let you control the *form* of that keyword (singular vs. plural, with or without descriptors, etc). Use DKI when your keywords already read well in ads. Use customizers when you need granular control.

**Q: Do I need to set values for every keyword?**

A: Yes. Any keyword without a value will show the default text from your RSA syntax. If you have 50 keywords and only set values for 30, the other 20 will show defaults. This isn't necessarily bad, but just make sure your defaults work.

**Q: What happens when I add new keywords?**

A: New keywords will show default text until you assign customizer values. Build a habit: when adding keywords, immediately assign customizer values.

**Q: Can I use this alongside Dynamic Ad Customizers (price/promo feeds)?**

A: Yes. They serve different purposes. Keyword-level customizers handle relevance (singular/plural, descriptors). Dynamic customizers handle changing data (prices, inventory, promotions). Many Ecommerce accounts use both.

**Q: My values aren't showing in Ad Preview. What's wrong?**

A: Check three things: (1) The attribute name in your RSA matches exactly (case-sensitive), (2) The keyword you're previewing has a value assigned, (3) There are no character limit violations causing the default to show instead.

**Q: How do I handle keywords with different match types?**

A: Customizer values are assigned to the keyword, not the match type. If you have "running shoes" as both broad and exact match, you should add customizer values for keywords.

---

### Related documents

| **Document** | **Type** | **Used in** |
| --- | --- | --- |
| [Keyword Ad Customizer Attribute Catalog](../catalogs/Keyword Ad Customizer Attribute Catalog.md) | Catalog | Phase 1 |
| [Ad Customizer Quality Checklist](../checklists/Ad Customizer Quality Checklist.md) | Checklist | Phase 5 |
| [Dynamic Text Reference](../references/Dynamic Text Reference.md) | Reference | Phase 4 context |
| [SOP – Set Up Dynamic Ad Customizers](../sops/SOP – Set Up Dynamic Ad Customizers.md) | SOP | If also using price/promo customizers |

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