# Ad Customizer Quality Checklist
Created: 2026-02-04

Support_ID: CHECKLIST_4
Status: Done
Category: Creative
Reference Type: Checklist
Agent_Readable: No
Human_Facing: No
Bucket: Creative
Domain: Creative
Pillar: 8

## Purpose

Validates that ad customizers are correctly configured, rendering properly, and not creating policy or brand risks.

---

## What this checklist validates

This checklist confirms:

- Setup and syntax correctness
- Feed data integrity (dynamic customizers)
- Value coverage completeness
- Rendering behavior across keywords
- Policy and brand compliance

This checklist does **NOT**:

- Teach customizer implementation
    - See: [SOP – Set Up Keyword-Level Ad Customizers](../sops/SOP – Set Up Keyword-Level Ad Customizers.md)
    - See: [SOP – Set Up Dynamic Ad Customizers](../sops/SOP – Set Up Dynamic Ad Customizers.md)
- Explain customizer types and use cases (See: [Dynamic Text Reference](../references/Dynamic Text Reference.md))
- Provide strategic guidance on when to use customizers

---

## When to use

Run this checklist:

- After initial customizer setup before launch
- After uploading or updating feed data
- When troubleshooting customizer display issues
- When auditing existing RSAs using customizers

---

## Checklist

### Setup & syntax

- [ ]  Attributes created in Business Data with correct data types
- [ ]  Attribute names consistent across Business Data and RSA syntax
- [ ]  Syntax correct: `{CUSTOMIZER.AttributeName:Default}`
- [ ]  Default text is strong standalone copy (not generic)
- [ ]  Total character count (static + longest value) ≤ limit (30/90)

### Feed integrity (dynamic customizers)

- [ ]  Attribute rows come before value rows in feed
- [ ]  Keywords have no brackets (`oak dining table` not `[oak dining table]`)
- [ ]  Price values include currency symbol (`€899` not `899`)
- [ ]  Percent values include % symbol (`25%` not `25`)
- [ ]  Campaign/ad group/keyword names match exactly (case-sensitive)

### Value coverage

- [ ]  All keywords have values assigned (no unintentional defaults)
- [ ]  No empty cells where values are expected
- [ ]  Values are appropriate length (won't cause truncation)

### Rendering verification

- [ ]  Tested 5+ keywords in Ad Preview and Diagnosis
- [ ]  Correct dynamic values appear (not defaults)
- [ ]  Price/percent formatting displays correctly
- [ ]  No truncation, overflow, or broken grammar
- [ ]  Ad reads naturally across multiple keyword variations

### Default behavior

- [ ]  Defaults only appear when expected (untargeted scenarios)
- [ ]  Defaults don't create awkward or generic copy
- [ ]  Defaults don't violate brand guidelines

### Policy & brand safety

- [ ]  No unverifiable claims (false scarcity, misleading discounts)
- [ ]  No regulated terms without compliance review
- [ ]  Price/discount claims match landing page
- [ ]  StockStatus claims backed by real inventory data

### Automation (if scheduled sync)

- [ ]  Scheduled upload configured and running
- [ ]  Source data accurate and current
- [ ]  Sync frequency appropriate for data change rate

---

## Quick reference

| Document | Relationship |
| --- | --- |
| [Dynamic Text Reference](../references/Dynamic Text Reference.md) | Syntax for DKI, customizers, functions |
| [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md) | RSA creation workflow |
| [Headline Quality Checklist](../checklists/Headline Quality Checklist.md)  | Validates headlines including DKI defaults |

---

## Version details

- **Version:** 2.0
- **Last Updated:** January 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.