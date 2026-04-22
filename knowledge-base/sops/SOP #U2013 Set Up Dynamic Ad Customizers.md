# SOP – Set Up Dynamic Ad Customizers
Created: 2026-02-04

SOP_ID: SOP_7
Status: Done
Category: Creative
Primary Outcome: Dynamically updated ad content (prices, products, promotions)
Agent_Executable: No
Human_Approval_Required: No
Domain: Creative
Pillar: 8

### Purpose

This SOP sets up Ad Customizers for **dynamic, frequently-changing da ta** such as prices, inventory levels, product names, and time-limited promotions.

> ❓ **The big question:** How do I keep my ads automatically updated with current prices, stock levels, and promotions without manual edits?

---

### What this SOP is NOT

This SOP does **not:**

- Cover keyword-level relevance customizers (See: [SOP – Set Up Keyword-Level Ad Customizers](../sops/SOP – Set Up Keyword-Level Ad Customizers.md))
- Explain basic Keyword Insertion syntax (See: [Dynamic Text Reference](../references/Dynamic Text Reference.md))

---

### When to run this SOP

**Run when:**

- You need to display current prices in ads
- Inventory levels affect your messaging
- You run time-limited promotions or sales
- Product details change frequently

**Do NOT run when:**

- Data source cannot be trusted (garbage in = garbage out)
- You cannot verify pricing/inventory accuracy before going live
- Claims would be misleading (false scarcity, unverifiable discounts)
- Regulated industries without compliance review (APR, medical, etc.)

---

### Guardrails (read before proceeding)

> - **Data quality gate:** Do not automate until feed accuracy is verified against source system.
> - **Policy gate:** Avoid unverifiable claims and regulated pricing terms. "Only 3 left" requires real inventory data.
> - **Brand gate:** Defaults must never create nonsense or generic copy. Test your defaults/fallbacks.
> - **Minimum viable feed:** Start with one campaign or ad group and ~10 keywords. Validate everything works before scaling to your full catalog.

---

### Before you start

**Required:**

- Google Ads account with Editor access
- Data source with your dynamic values (spreadsheet, ERP, ecommerce platform)
- [Dynamic Ad Customizer Attribute Catalog](../catalogs/Dynamic Ad Customizer Attribute Catalog.md) reviewed

**Have open:**

- [Dynamic Ad Customizer Attribute Catalog](../catalogs/Dynamic Ad Customizer Attribute Catalog.md)
- [Ad Customizer Quality Checklist](../checklists/Ad Customizer Quality Checklist.md)
- Your data source

---

### Critical rules (memorize these)

1. **Attribute rows before value rows** in any upload file
2. **No brackets in feed keywords:** Use oak dining table not [oak dining table]
3. **Price type requires currency:** Use €89.99 not 89.99
4. **Percent type requires %:** Use 25% not 25
5. **Defaults must work everywhere.**

> 💡 **Price flexibility tip:** Instead of using the "Price" data type, you can use "Text" and include only the number (e.g., 899). Then add the currency symbol directly in your RSA: € `{CUSTOMIZER.Price:899}`. This gives you more control over formatting. Like whether to include a space between the symbol and the number.

---

### Choose your approach

> 💡 **Decision gate:** How often does your data change, and how many items are affected?

| **Approach** | **Best For** | **Update frequency** |
| --- | --- | --- |
| **Manual upload** | <50 products, infrequent changes | Weekly/monthly |
| **Scheduled Google Sheets** | 50-200 products, regular updates | Daily |
| **Feed management tool** | 200+ products, real-time needs | Hourly |

---

## Execution

### Phase 1️⃣: Plan attributes

1. Identify which values need to be dynamic
2. Select attributes from [Dynamic Ad Customizer Attribute Catalog](../catalogs/Dynamic Ad Customizer Attribute Catalog.md)
3. Decide targeting level (account, campaign, ad group, or keyword)
4. Map your data source fields to attributes

> 💡 **Start small:** Select one campaign or ad group with ~10 keywords for your first feed. Get everything working before scaling.

---

### Phase 2️⃣: Build feed

#### Option 1: Manually

1. Download the example template below
2. Fill template

**Official Ad Customizer Feed Template:**

[rsa-customizer-combine-template.csv](rsa-customizer-combine-template.csv)

**Example structure:**

| **Attribute** | **Data type** | **Account value** | **Campaign** | **Ad group** | **Keyword** | **Customizer:ProductName** | **Customizer:Price** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ProductName | Text | Our Products |  |  |  |  |  |
| Price | Price |  |  |  |  |  |  |
|  |  |  | Search - Furniture | Dining Tables | oak dining table | Oak Dining Table | €899 |
|  |  |  | Search - Furniture | Dining Tables | walnut dining table | Walnut Dining Table | €1,199 |

#### Option 2: Feed management tool (Channable, etc.)

1. Connect tool to your data source (Shopify, WooCommerce, ERP)
2. Configure transformation rules
3. Export to Google Sheets or CSV
    1. Upload manually first to debug
    2. Set up scheduled upload in Google Ads (if neccessary) in phase 7

**Example:** Simple Ad Customizer CSV export containing the lowest price per product_type

![image.png](image.png)

---

### Phase 3️⃣: Upload and verify

1. Go to **Tools & Settings** → **Bulk Actions** → **Uploads**
2. Click **+** → select your file
3. Click **Preview**. Verify:
    - Attribute count correct
    - Data types recognized
    - No errors
4. Click **Apply**

---

### Phase 4️⃣: Add customizers to RSA

1. Open your RSA
2. In headline/description, type `{`
3. Select **Ad customizer** → select attribute → enter default
4. Apply

**Syntax:** `{CUSTOMIZER.AttributeName:Default Text}`

**Example:** `{CUSTOMIZER.diy_houten_deur}`  Ad Customizer shows lowest price of this product category

![image.png](image%201.png)

---

### Phase 5️⃣: Validate

1. Go to **Tools & Settings** → **Ad Preview and Diagnosis**
2. Test keywords from your feed
3. Verify:
    - Correct values appear
    - Price formatting correct
    - Defaults only when expected
4. Run [Ad Customizer Quality Checklist](../checklists/Ad Customizer Quality Checklist.md) 

---

### Phase 6️⃣: Scale (after validation)

Once your minimum viable feed is working correctly:

1. Expand feed to include additional campaigns/ad groups
2. Add remaining keywords
3. Re-run validation on a sample of new entries
4. Proceed to automation (if applicable)

---

### Phase 7️⃣: Set up automation (if needed)

**Google Sheets scheduled sync:**

1. Create Google Sheet or CSV with your feed data
2. Go to **Tools & Settings** → **Bulk Actions** → **Uploads** → **Schedules**
3. Click **+** → select Google Sheets → select your spreadsheet
4. Set frequency (daily recommended) and time
5. Save

![image.png](image%202.png)

---

### Definition of Done

- [ ]  Attributes created with correct data types
- [ ]  Feed uploaded without errors
- [ ]  RSA updated with customizer syntax
- [ ]  5+ keywords tested in Ad Preview: correct values + formatting
- [ ]  Scheduled sync running (if applicable)
- [ ]  [Ad Customizer Quality Checklist](../checklists/Ad Customizer Quality Checklist.md) passed

---

### Exit → Entry bridge

| **Next Step** | **When** |
| --- | --- |
| Verify sync is running | Daily (first week) |
| Monitor for disapprovals | Ongoing |
| Scale to additional campaigns/ad groups | After validation passes |
| Proceed to [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md)  | When RSA live + stable |

---

### Ongoing hygiene (not a separate doc)

- **Daily (first week):** verify scheduled upload ran
- **Weekly:** spot-check 3-5 keywords in Ad Preview
- **When prices change:** verify feed updated correctly
- **When promotions start/end:** update feed, verify output

---

### FAQ

**Q: How often should my feed update?**

A: Depends on your data volatility. Daily is sufficient for most Ecommerce accounts. If prices change multiple times per day or you have flash sales, consider hourly updates via a feed management tool.

**Q: What happens if my feed upload fails?**

A: Your RSAs continue showing the last successfully uploaded values. Google doesn't revert to defaults on upload failure: it keeps the previous data. Check **Tools & Settings → Bulk Actions → Uploads** for error logs.

**Q: Can I use text instead of the Price data type?**

A: Yes. Using Text gives you more formatting control. Instead of `{CUSTOMIZER.Price:€99}` with Price type, use `€ {CUSTOMIZER.Price:99}` with Text type. This lets you control currency symbol placement and spacing.

**Q: My prices are showing incorrectly formatted. Why?**

A: If using Price data type, ensure values include currency symbols (€89.99 not 89.99). If formatting is still wrong, switch to Text data type and handle formatting in your RSA syntax.

**Q: How do I handle products that go out of stock?**

A: Two options: (1) Remove the row from your feed (defaults will show), or (2) Update the StockStatus attribute to messaging like "Back Soon" and pause keywords for out-of-stock products.

**Q: Can I target the same keyword with different values in different campaigns?**

A: Yes. Use the Campaign and Ad Group columns in your feed to specify where each value applies. A keyword can have different prices in different campaigns.

**Q: What's the difference between Account value and keyword-level values?**

A: Account value is the universal fallback: it shows when no more specific value exists. Keyword-level values override account values for that specific keyword. Campaign and Ad Group values sit in between.

---

### Related documents

| **Document** | **Type** | **Used in** |
| --- | --- | --- |
| [Dynamic Ad Customizer Attribute Catalog](../catalogs/Dynamic Ad Customizer Attribute Catalog.md) | Catalog | Phase 1 |
| [Ad Customizer Quality Checklist](../checklists/Ad Customizer Quality Checklist.md) | Checklist | Phase 5 |
| [Dynamic Text Reference](../references/Dynamic Text Reference.md)  | Reference | Phase 4 context |
| [SOP – Set Up Keyword-Level Ad Customizers](../sops/SOP – Set Up Keyword-Level Ad Customizers.md) | SOP | If also using keyword-level customizers |

---

### Version details

- **Version:** 3
- **Last Updated:** January 2026
- **Creator:** Bob Meijer

---

### Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

© 2026 PPC Mastery B.V. All rights reserved.