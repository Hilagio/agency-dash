# Keyword Set Quality Checklist
Created: 2026-02-04

Support_ID: CHECKLIST_18
Category: Targeting
Domain: Search
Human_Facing: Yes
Pillar: 7
Reference Type: Checklist
Agent_Readable: Yes
Status: Done

## Purpose

Validates that a keyword set covers the right intent, meets volume thresholds, avoids waste, and is structured for smart bidding and RSA learning before launch.

---

## What this checklist validates

This checklist confirms:

- Keywords cover core business offerings and relevant intent stages
- Search volume is sufficient to feed smart bidding and generate actionable asset-level data
- Irrelevant terms are identified and excluded
- Keywords are clustered by creative theme with proper ad group structure
- Match types align with the active bidding strategy
- Each keyword cluster maps to a relevant landing page
- No unnecessary duplication across match types or ad groups

This checklist does **NOT:**

- Teach keyword research methodology (See: [SOP – Research Keywords](../sops/SOP – Research Keywords.md))
- Execute keyword clustering (See: [SOP – Cluster and Map Keywords](../sops/SOP – Cluster and Map Keywords.md))
- Select match types for you (See: [Keyword and Match Type Selection Guidelines](../guidelines/Keyword and Match Type Selection Guidelines.md))
- Define negative keyword strategy (See: [Negative Keyword Reference](../references/Negative Keyword Reference.md))

---

## When to use

Run this checklist:

- After completing keyword research and before uploading keywords to Google Ads
- After clustering keywords into ad groups and assigning match types
- When auditing an existing account's keyword structure
- Before launching a new search campaign

---

## Checklist

### Intent coverage

- [ ] Keywords cover the primary product or service offering
- [ ] High-intent (bottom-of-funnel) keywords are present
- [ ] Mid-intent (consideration-stage) keywords are included where relevant
- [ ] Informational keywords are excluded unless a dedicated strategy exists for them
- [ ] Each keyword maps to a real searcher need, not internal jargon
- [ ] Color-coded triage is complete: green (include), orange (review), red (exclude)
- [ ] All orange (doubtful) keywords have a documented include/exclude decision

### Volume viability

- [ ] Each ad group projects at least 1,000 impressions/week (4,000/month) for actionable asset-level data
- [ ] Campaign-level volume supports 30 conversions/month minimum (tCPA threshold) or 50 conversions/month (tROAS threshold)
- [ ] Low-volume keywords are consolidated into broader ad groups or removed
- [ ] No ad group relies on a single keyword with fewer than 500 monthly searches

### Negative coverage

- [ ] Red-flagged (irrelevant) keywords from research are added as negative keywords
- [ ] Negative keyword list covers common irrelevant modifiers (free, jobs, DIY, reviews, etc. as applicable)
- [ ] Brand terms are excluded from generic campaigns (or intentionally included with documented reasoning)
- [ ] Cross-campaign negatives prevent keyword cannibalization between campaigns
- [ ] Negative match types are appropriate: exact negatives for specific terms, phrase negatives for patterns

### Clustering quality

- [ ] Each ad group contains keywords that share the same searcher intent
- [ ] All keywords in an ad group can be served by a single RSA without relevance loss
- [ ] No ad group mixes commercial and informational intent
- [ ] No ad group mixes different product categories or service lines
- [ ] Ad group names clearly reflect the keyword theme

### Match type alignment

- [ ] Match types are aligned with the active bidding strategy
- [ ] Broad match is only used with tCPA or tROAS bidding
- [ ] If using Manual CPC or Max Clicks: keywords use exact or phrase match only
- [ ] No keyword appears in multiple match types within the same ad group
- [ ] No keyword appears in multiple match types across ad groups targeting the same intent
- [ ] If broad match is active: negative keywords are sufficient to contain irrelevant expansion

### Landing page alignment

- [ ] Each keyword cluster maps to a specific, relevant landing page
- [ ] Landing page headline reflects the keyword theme (not a generic homepage)
- [ ] Landing page content addresses the searcher intent behind the keywords
- [ ] No keyword cluster points to an out-of-stock, expired, or broken page
- [ ] High-intent keywords map to conversion-focused pages, not informational content

### De-duplication

- [ ] No keyword appears in more than one ad group (unless intentionally segmented by match type with documented reasoning)
- [ ] No keyword is duplicated across campaigns targeting the same geographic region
- [ ] Close variants are consolidated: singular/plural, common misspellings, and reordered words do not exist as separate keywords
- [ ] If running both Search and DSA campaigns: keyword-targeted terms are excluded from DSA

---

## Quick reference

| Document | Relationship |
|----------|-------------|
| [Match Type Reference](../references/Match Type Reference.md) | Defines match type behavior and syntax |
| [Keyword and Match Type Selection Guidelines](../guidelines/Keyword and Match Type Selection Guidelines.md) | Recommends match type configuration per bidding strategy |
| [Modern Search Campaign Mental Model](../mental-models/Modern Search Campaign Mental Model.md) | Provides the structural framework for keyword organization |
| [Negative Keyword Reference](../references/Negative Keyword Reference.md) | Negative keyword types, syntax, and application rules |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Data thresholds for smart bidding and RSA learning |
| [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md) | Campaign and ad group hierarchy for keyword placement |
| [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md) | Ad group design principles for keyword clustering |

---

## Version details

- **Version:** 1.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

(c) 2026 PPC Mastery B.V. All rights reserved.
