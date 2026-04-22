# Diagnostic Logic Patterns Reference
Created: 2026-04-02

Support_ID: REF_70
Status: Ready-to-publish
Category: Operational
Reference Type: Technical
Agent_Readable: Yes
Human_Facing: Yes
Domain: Operational
Pillar: 0

## Purpose

Consolidates non-numeric diagnostic logic patterns used across PPCOS skills. This is the companion to the Diagnostic Thresholds Reference (REF_69): where REF_69 defines quantitative triggers (PASS at X%, FAIL at Y%), this reference defines qualitative logic patterns (classification rules, pattern matching, decision trees, skip conditions).

---

## What this reference is / What this is NOT

**This reference:**

- Defines reusable logic patterns that appear across multiple skill diagnostics
- Provides deterministic rules for classification, detection, and routing
- Links each pattern to the skill check IDs that use it

**This reference does NOT:**

- Replace skill-specific diagnostic-rules files (those contain the full per-check logic)
- Define numeric thresholds (See: Diagnostic Thresholds Reference, REF_69)
- Explain how to build skills (See: skills/DIAGNOSTIC_RULES_GUIDE.md)

---

## Performance Quadrant Classification

Used by: KW-D05 through KW-D09, ST-D03, PMX-D05, PO-D01

Classifies entities (keywords, products, ad groups) into four quadrants based on spend share and conversion performance.

| Quadrant | Spend Share | Conversion Condition | Action | Severity if Mismanaged |
|----------|------------|---------------------|--------|----------------------|
| Hero | >30% of campaign total | Conversion share >= spend share | Protect, scale budget | N/A (classification) |
| Sidekick | <15% of campaign total | Positive ROAS, CPA below target | Maintain, monitor for promotion | N/A (classification) |
| Villain | >20% of campaign total | Conversion share >20pp below spend share | Restrict or pause | High |
| Zombie | Any | 0 impressions OR 0 clicks in 30 days | Pause or remove | Medium |

**Decision flow:**

```
1. Is impressions = 0 in 30 days? → Zombie
2. Is clicks = 0 in 30 days (with impressions)? → Zombie
3. Calculate spend_share = entity_cost / campaign_cost
4. Calculate conv_share = entity_conversions / campaign_conversions
5. Is spend_share > 30% AND conv_share >= spend_share? → Hero
6. Is spend_share > 20% AND conv_share < (spend_share - 20pp)? → Villain
7. Is spend_share < 15% AND ROAS > 0? → Sidekick
8. Else → Uncategorized (report as-is)
```

**Threshold overrides:** Check `config/ads-context.config.json` for account-specific hero/villain thresholds. If present, use those instead of defaults.

---

## Naming Convention Compliance

Used by: AUD-D09, AUD-D10, CB-E12

### Campaign Naming Pattern

The recommended convention is `{Geo}_{Language}_{Type}_{Theme}_{Modifier}` with underscore delimiter.

| Position | Variable | Examples |
|----------|----------|----------|
| 1 | Geographic targeting | `NL`, `USA`, `DE`, `EU`, `Global` |
| 2 | Language | `NL`, `EN`, `FR`, `DE`, `ALL` |
| 3 | Campaign type | `Search`, `Pmax`, `Display`, `Shopping`, `YouTube`, `DemandGen` |
| 4 | Theme/audience | Product category, keyword theme, audience type |
| 5 | Modifier | `Brand`, `NB`, `DSA`, `Remarketing`, `Prospecting`, `Heroes` |

**The check is for CONSISTENCY, not strict adherence.** If an account uses a different but consistent convention, that passes.

**Scoring rule:**
- PASS: >80% of campaigns follow a recognizable consistent convention
- WARN: 50-80% follow a convention
- FAIL: <50% follow any consistent pattern

### Ad Group Naming Pattern

Ad groups should be descriptive of their theme. Flag generic/default names.

**Generic name detection patterns:**

```
/^Ad Group \d+$/i
/^Ad Group #\d+$/i
/^New Ad Group/i
/^Default$/i
/^Untitled$/i
/^\d+$/
/^AG\d+$/i
```

**Scoring:** <10% generic = PASS, 10-30% = WARN, >30% = FAIL

### Formatting Rules

- Consistent delimiter (underscores preferred)
- No special characters (`&`, `%`, `$`, `#`)
- Under 75 characters (UI truncation)

---

## Duplicate and Overlap Detection

Used by: KW-D10, AUD-D06, WD-D11, ST-D08

### Keyword Deduplication

**Algorithm:**
1. Normalize all keywords: lowercase, strip match type brackets/quotes
2. Group by normalized text
3. For each group with >1 entry across campaigns:
   - If same campaign, same match type → flag as intra-campaign duplicate
   - If different campaigns, same match type → flag as cross-campaign duplicate (WARN)
   - If different campaigns, different match types → INFO (expected for match type strategy)
4. Exclude brand vs non-brand campaign pairs from duplicate flagging

**Severity:** Cross-campaign exact duplicates = Medium. Intra-campaign same-match = Medium.

### Negative Keyword Conflicts

**Algorithm:**
1. Load all negative keywords (campaign + ad group + shared lists)
2. Load all active keywords
3. For each negative, check if it blocks any active keyword:
   - Exact negative blocks exact keyword with same text
   - Phrase negative blocks any keyword containing that phrase
   - Broad negative blocks any keyword containing all words
4. Flag conflicts as Critical (negative blocking an active, converting keyword)

### Targeting Overlap (Campaigns)

**Algorithm:**
1. Group campaigns by type (Search, Shopping, PMax)
2. Within each type, compare keyword sets across campaigns
3. Calculate overlap: shared_keywords / total_unique_keywords
4. PASS: <10% overlap. WARN: 10-25%. FAIL: >25%
5. Shopping/PMax: check product overlap via product_groups.csv

---

## Campaign Type Filtering Rules

Used by: All skills with type-specific checks

When a check applies only to certain campaign types, filter using `campaign.advertising_channel_type`:

| Campaign Type | API Value | Skills Primarily Using |
|--------------|-----------|----------------------|
| Search | `SEARCH` | keyword, search-term, QS, ad-copy, account-auditor |
| Shopping | `SHOPPING` | feed, product-optimizer |
| Performance Max | `PERFORMANCE_MAX` | pmax-specialist |
| Display | `DISPLAY` | display-specialist |
| Video | `VIDEO` | video-specialist |
| Demand Gen | `DISCOVERY` | demand-gen-specialist |

**Common filter patterns:**

| Check Context | Filter |
|---------------|--------|
| Keyword checks | `SEARCH` only |
| Ad group thematic checks | `SEARCH` primarily (Shopping has product groups, PMax has asset groups) |
| Network settings checks | `SEARCH` and `SHOPPING` |
| URL expansion checks | `SEARCH` and `PERFORMANCE_MAX` |
| Placement checks | `DISPLAY` and `VIDEO` |

---

## Entity Status Filtering

Used by: All skills

### Standard Filters (apply unless check specifies otherwise)

| Level | Include | Exclude |
|-------|---------|---------|
| Campaign | `status = ENABLED` | PAUSED, REMOVED |
| Ad Group | `status = ENABLED` within enabled campaigns | PAUSED, REMOVED |
| Keyword | `status = ENABLED` within enabled ad groups | PAUSED, REMOVED |
| Ad | `status = ENABLED` within enabled ad groups | PAUSED, REMOVED |

### Special Status Handling (tracking-specialist pattern)

| Status | Treatment |
|--------|-----------|
| ENABLED | Audit normally |
| PAUSED | Include in completeness/coverage checks only (e.g., "does this conversion action exist?") |
| HIDDEN | Exclude from scoring. Report as INFO only. (Auto-imported ghost actions) |
| REMOVED | Exclude entirely |

### Origin-Based Filtering (conversion actions)

| Origin | Treatment |
|--------|-----------|
| WEBSITE, APP, CALL_FROM_ADS, STORE, YOUTUBE_HOSTED | Audit normally |
| GOOGLE_HOSTED | Exclude from scoring. Report as INFO. (Auto-created by Google) |
| UNKNOWN, UNSPECIFIED | WARN — flag for manual verification |

---

## Skip Conditions (Cross-Skill)

Used by: All skills

### When to SKIP a Check

| Condition | Action | Example |
|-----------|--------|---------|
| Required data missing | SKIP | business.md not found → skip business-dependent checks |
| Insufficient volume | SKIP | <50 clicks → skip conversion-dependent analysis |
| Wrong campaign type | SKIP | Shopping check on Search campaign |
| Feature not configured | SKIP | Checking audience signals on campaign with no audiences |
| API limitation | SKIP | GTM-dependent checks without GTM API access |
| Chrome DevTools not available | SKIP | On-page verification when --url not provided |

### Minimum Data Thresholds (from Diagnostic Thresholds Reference)

| Metric | Minimum for Analysis | Below Minimum = |
|--------|---------------------|-----------------|
| Clicks | 30 | SKIP |
| Conversion lag | 2x conversion window | SKIP (insufficient observation) |
| Impressions | 100 | SKIP for CTR/QS analysis |
| Statistical confidence | 95% (standard), 90% (directional) | WARN |

### SKIP Impact on Scoring

SKIP diagnostics are **excluded from the scoring denominator**.

```
Score % = (points earned / points possible excluding SKIPs) * 100
```

If all checks in a module are SKIP, the module score is "N/A — insufficient data."

---

## Confidence Scoring

Used by: All DIAGNOSE outputs (per SKILL_INTERFACE_CONTRACTS.md)

| Level | Range | When to Assign |
|-------|-------|---------------|
| High | 0.90-1.00 | Direct API data with clear threshold breach. Exact duplicate found. Zero-value detection. |
| Medium | 0.70-0.89 | Inferred from patterns. Borderline threshold. Heuristic classification (e.g., intent from keyword text). |
| Low | 0.50-0.69 | Insufficient data for certainty. Cross-referenced from external signals. Best-guess based on naming patterns. |

**Rule:** If confidence < 0.70 on a FAIL finding, downgrade to WARN and add note: "Low confidence — verify manually."

---

## Severity Assignment Logic

Used by: All skills (documented in diagnostic-rules-shared.md per skill)

| Severity | Points | Criteria | Examples |
|----------|--------|----------|----------|
| Critical | 15 | Actively losing money OR broken tracking | Zero-conversion campaign with spend, double-counted conversions, broken GACT tag |
| High | 10 | Significant structural issue OR major missed opportunity | Display Network on Search, no brand separation, targets exceed breakeven |
| Medium | 5 | Optimization opportunity with measurable impact | Naming inconsistency, SKAG fragmentation, missing ad schedule |
| Low | 3 | Best practice, polish | Generic ad group names, ad rotation setting, tracking template missing |

**Assignment rules:**
1. If the issue causes direct money loss → Critical
2. If the issue prevents effective optimization → High
3. If fixing it would improve performance measurably → Medium
4. If it's about cleanliness/best practice → Low

---

## Health Score Calculation

Used by: All DIAGNOSE skills

```
health_score = (points_earned / points_possible_excluding_skips) * 100
```

| Score | Grade | Meaning |
|-------|-------|---------|
| 90-100% | Excellent | Production-grade, no urgent action |
| 70-89% | Good | Minor issues, scheduled improvement |
| 50-69% | Needs Attention | Multiple issues, prioritize |
| 0-49% | Critical | Fundamental issues, fix before optimizing |

**Module vs Overall scoring:**
- Each module has its own score (points earned in module / points possible in module)
- Overall score = total points earned across all modules / total points possible across all modules
- SKIPs excluded from denominator at both module and overall level

---

## Vertical-Specific Logic

Used by: tracking-specialist, strategy-specialist, offer-builder, LP-specialist, campaign-builder

When checks vary by vertical, use a routing table:

| Vertical | Identifier | Key Differences |
|----------|-----------|-----------------|
| Ecommerce | `vertical = "ecommerce"` in business.md | Purchase conversion, product feed, Shopping/PMax, AOV/ROAS focus |
| Lead Gen | `vertical = "lead gen"` in business.md | Form/call conversions, CPA focus, offline conversion pipeline, lead quality |
| SaaS | `vertical = "saas"` in business.md | Signup + trial, LTV/CAC focus, longer conversion windows, subscription economics |

**How to determine vertical:**
1. Read `context/business.md` → Vertical field
2. If not set, infer from campaign structure:
   - Shopping/PMax campaigns present → likely Ecommerce
   - SUBMIT_LEAD_FORM conversion actions → likely Lead Gen
   - SIGNUP + PURCHASE → likely SaaS
3. If ambiguous, ASK the user

---

## Cross-Skill Routing Patterns

Used by: DIAGNOSE-only skills (account-auditor, competitive-analyst, waste-detective)

When a DIAGNOSE finding needs action from another specialist, include in the diagnostic result:

```
Routing: {target-skill} → {action description}
```

See the Cross-Skill Routing Table in `skills/SKILL_INTERFACE_CONTRACTS.md` for the formal mapping.

**Priority assignment for routing:**
- Critical finding → High priority routing
- High finding → High priority routing
- Medium finding → Medium priority routing
- Low finding → Low priority routing

---

## Related Documents

- [Diagnostic Thresholds Reference](Diagnostic Thresholds Reference.md) — Numeric PASS/WARN/FAIL thresholds
- [Conversion Volume Thresholds Reference](Conversion Volume Thresholds Reference.md) — Volume minimums for Smart Bidding

---

## Version

- v1.0 (2026-04-02): Initial creation, extracted from 5 built skills
