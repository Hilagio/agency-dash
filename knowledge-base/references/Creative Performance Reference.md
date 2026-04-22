# Creative Performance Reference
Created: 2026-04-02

Support_ID: REF_72
Status: Done
Category: Creative
Reference Type: Reference
Agent_Readable: Yes
Human_Facing: Yes
Domain: Creative
Pillar: 8

## Purpose

Documents the metrics, thresholds, and diagnostic frameworks for evaluating RSA asset performance. Covers CPI, RPI, PPI, AIS, and the performance quadrant system used in The Iteration Loop.

---

## What this is / What this is NOT

**This reference:**

- Defines creative performance metrics and their formulas
- Provides data sufficiency thresholds for asset-level decisions
- Documents the performance quadrant classification system
- Specifies concentration and visibility alert thresholds

**This reference does NOT:**

- Explain how to write headlines or descriptions (See: [Headline Angle Catalog](../catalogs/Headline Angle Catalog.md))
- Provide step-by-step testing procedures (See: [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md))
- Cover ad-level or campaign-level optimization (See: [SOP – Run a Creative Testing Cycle](../sops/SOP – Run a Creative Testing Cycle.md))

---

## Quick reference: Core metrics

| Metric | Full name | Formula | Use case |
|--------|-----------|---------|----------|
| **CPI** | Conversions Per Impression | Conversions / Impressions | Lead Gen, SaaS (conversion-focused) |
| **RPI** | Revenue Per Impression | Conversion Value / Impressions | Ecommerce (revenue-focused) |
| **PPI** | Profit Per Impression | (Conversion Value - Cost) / Impressions | Ecommerce with margin data (profit-focused) |
| **AIS** | Asset Impression Share | Asset Impressions / Total Ad Impressions | All verticals (visibility measurement) |

---

## Why CPI and RPI, not CTR

Google's asset performance labels (Low / Good / Best) are CTR-driven. CTR measures click appeal but not business outcomes. An asset with high CTR and zero conversions costs money without generating results.

CPI and RPI combine two stages of the funnel into a single metric:

| Metric | What it captures | Why it matters |
|--------|-----------------|----------------|
| **CTR** | Click appeal only | A headline that attracts clicks from unqualified users raises CPC without improving conversions |
| **Conversion rate** | Post-click conversion only | Ignores how often the asset was shown and clicked |
| **CPI** | Click appeal + conversion effectiveness | Measures the full path: impression → click → conversion. An asset that converts well but rarely gets clicked still scores low. |
| **RPI** | Click appeal + revenue generation | Same as CPI but weights by revenue, so high-AOV conversions are properly valued |

CPI = CTR × Conversion Rate. It rewards assets that both attract clicks AND convert them.

> ⚠️ **Do not use Google's asset performance labels as your primary decision metric.** They reflect Google's CTR-based optimization, not your business outcomes. An asset labeled "Low" by Google can have the highest CPI in your account.

---

## Metric selection by vertical

| Vertical | Primary metric | When to use | Fallback |
|----------|---------------|-------------|----------|
| **Lead Gen** | CPI | All lead-focused campaigns | CPI is the default for any conversion-counted goal |
| **SaaS** | CPI | Trial signups, demo requests | RPI if subscription value is tracked |
| **Ecommerce (basic)** | RPI | Revenue tracked, margins unknown | CPI if revenue tracking is unavailable |
| **Ecommerce (advanced)** | PPI | Margins known, profit data available | RPI as stepping stone to PPI |

> 💡 **Start with CPI.** Move to RPI when you have reliable conversion value tracking. Move to PPI when you have margin data. Do not wait for perfect data to start measuring.

---

## Asset Impression Share (AIS)

AIS measures how often Google shows a specific asset relative to total ad impressions.

| AIS range | Meaning | Interpretation |
|-----------|---------|----------------|
| >40% | Dominant | Google heavily favors this asset. Verify it deserves the exposure. |
| 25-40% | High visibility | Strong rotation position. Expected for top-performing assets. |
| 15-25% | Moderate | Normal rotation range for most assets. |
| 5-15% | Low visibility | Google is deprioritizing this asset. Check if CPI/RPI justifies keeping it. |
| <5% | Near-zero | Asset is effectively not serving. Replace or investigate pinning. |

### AIS concentration alerts

| Signal | Threshold | What it means | Action |
|--------|-----------|---------------|--------|
| Single asset dominance | One asset >60% AIS | Google is over-rotating one headline, limiting combination testing | Pin a different headline to position 1 to force rotation diversity |
| Low-visibility cluster | 3+ assets below 5% AIS | Multiple assets effectively inactive | Remove inactive assets to reduce combination count |
| Uniform distribution | All assets within 5% of each other | Google has not identified winners, possibly insufficient data | Increase data collection period or reduce asset count |

---

## The performance quadrant system

The quadrant system classifies assets using two dimensions: CPI/RPI (business outcome) and AIS (visibility).

### Quadrant definitions

|  | High AIS (>25%) | Low AIS (<15%) |
|--|-----------------|----------------|
| **High CPI/RPI** (above cluster average) | **Champions** | **Hidden Gems** |
| **Low CPI/RPI** (below cluster average) | **Silent Killers** | **Underperformers** |

### Quadrant interpretation and action

| Quadrant | Profile | Business impact | Action | Priority |
|----------|---------|-----------------|--------|----------|
| **Champions** | High CPI/RPI + High AIS | Driving results with strong visibility | Protect: do not change. Document the winning angle in your learning log. | Lowest (maintain) |
| **Hidden Gems** | High CPI/RPI + Low AIS | Converting well but rarely shown | Increase exposure: pin to position 1, or reduce competing assets so Google rotates to this one more often. | High (opportunity) |
| **Silent Killers** | Low CPI/RPI + High AIS | Consuming impressions without converting | Remove immediately: these actively degrade performance by absorbing impressions that should go to better assets. | Critical (urgent) |
| **Underperformers** | Low CPI/RPI + Low AIS | Neither converting nor showing | Replace when convenient: low urgency because low visibility means low damage. Swap during the next iteration cycle. | Low (cleanup) |

> ⚠️ **Silent Killers are the top priority.** They are the single biggest drag on RSA performance because Google shows them frequently despite poor conversion rates. Removing one Silent Killer improves CPI/RPI for the entire ad.

### Defining "high" vs "low" thresholds

| Metric | High | Low | Grey zone |
|--------|------|-----|-----------|
| CPI/RPI | Above cluster average | Below cluster average | Within 10% of average: hold for one more cycle |
| AIS | >25% | <15% | 15-25%: moderate visibility, classify based on CPI/RPI direction |

"Cluster average" = the mean CPI/RPI across all assets in the testing cluster (same template deployed across multiple ad groups).

---

## Data sufficiency thresholds

Asset-level decisions require sufficient data. Acting on small samples produces unreliable conclusions.

### Minimum data for asset-level decisions

| Decision type | Minimum impressions | Minimum conversions | Confidence level |
|--------------|--------------------|--------------------|-----------------|
| Remove a Silent Killer | 5,000+ per asset | 0 conversions at 5,000+ impressions | High confidence (clear signal) |
| Promote a Hidden Gem (pin) | 3,000+ per asset | 5+ conversions | Medium confidence |
| Declare a Champion | 5,000+ per asset | 10+ conversions | High confidence |
| Replace an Underperformer | 1,000+ per asset | 0-1 conversions | Low confidence (acceptable for low-priority swap) |
| Compare two assets | 5,000+ per asset each | 10+ conversions each | 90%+ statistical confidence for CPI/RPI difference |

### Reaching sufficiency faster

The Iteration Loop solves the data poverty problem through aggregation:

| Approach | Data per asset | Time to decision |
|----------|---------------|-----------------|
| Single ad group (isolated) | 500-2,000 impressions/month | 3-6 months (insufficient for most decisions) |
| Templatized cluster (5 ad groups) | 5,000-10,000 impressions/month | 2-4 weeks |
| Templatized cluster (20 ad groups) | 20,000-50,000 impressions/month | 1-2 weeks |

> ↪️ **How to set up templated clusters.** See [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md) Pillar 1 for cluster creation and template deployment.

### The combination explosion problem

Each additional headline exponentially increases the number of combinations Google must test:

| Headlines | 2-headline combinations | 3-headline combinations | Min. impressions needed (100 per combo) |
|-----------|------------------------|------------------------|-----------------------------------------|
| 5 | 10 | 10 | 1,000 |
| 7 | 21 | 35 | 3,500 |
| 8 | 28 | 56 | 5,600 |
| 10 | 45 | 120 | 12,000 |
| 15 | 105 | 455 | 45,500 |

At 7-8 headlines, combination count is manageable (3,500-5,600 minimum impressions). At 15 headlines, most ad groups never accumulate enough data for Google to identify winning combinations.

**Rule: Use 7-8 headlines and 2-3 descriptions.** This concentrates impressions on fewer assets, producing faster and more reliable performance signals.

---

## Statistical confidence for asset comparison

When comparing two assets (e.g., testing a new USP headline against the current one), use these confidence levels:

| Confidence level | When to use | What it means |
|-----------------|-------------|---------------|
| 80% | Directional signal for low-stakes decisions | 1 in 5 chance the result is random |
| 90% | Standard for most creative testing | 1 in 10 chance of false positive |
| 95% | High-stakes decisions (account-wide rollouts) | 1 in 20 chance of false positive |

### Factors that increase time to confidence

| Factor | Effect | Mitigation |
|--------|--------|------------|
| Small CPI/RPI difference between assets | Requires more data to detect | Accept 80% confidence for marginal differences |
| Low impression volume per asset | Slow data accumulation | Reduce headline count (7 instead of 15) or expand cluster size |
| Low conversion rate | Few conversion events per asset | Use longer evaluation windows (4+ weeks) |
| High CPC | Fewer clicks per budget dollar | Focus testing on highest-volume clusters first |

---

## Creative fatigue detection

Assets degrade over time as audiences see the same messaging repeatedly.

| Signal | Threshold | What it means |
|--------|-----------|---------------|
| CTR declining | 2+ consecutive weeks of decline | Audience is tuning out the message |
| CPI/RPI declining | 2+ consecutive weeks, CTR stable | Post-click conversion is degrading (landing page fatigue or offer staleness) |
| AIS shifting | Champion asset AIS drops 10+ points | Google is de-prioritizing the asset (possibly detecting engagement decline) |

### Fatigue response framework

| Fatigue type | Diagnosis | Action |
|-------------|-----------|--------|
| CTR decline only | Headline messaging is stale | Replace the specific headline with a new variation of the same angle type |
| CPI/RPI decline, CTR stable | Post-click experience is the issue | Investigate landing page, offer freshness, or seasonality before changing creative |
| Both CTR and CPI/RPI declining | Full creative fatigue | Replace the asset and test a new angle variation in the next iteration cycle |

---

## Where to find asset performance data

| Data point | Location in Google Ads |
|-----------|----------------------|
| Asset-level metrics (impressions, clicks, conversions, cost, value) | Ads & assets > Assets > Performance tab > filter by Headline or Description |
| Asset Impression Share | Calculate: asset impressions / total ad impressions (from the same report) |
| Google's performance labels (Low/Good/Best) | Ads & assets > Assets > Performance rating column |
| Combination report | Ads & assets > Combinations (shows which headline+description pairs served) |

> 💡 **Asset data updates once daily.** Changes to assets will not appear in the performance report until the next day.

---

## Common mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Using Google's Low/Good/Best labels as primary metric | Labels are CTR-driven, not conversion-driven | Use CPI/RPI as primary, treat Google labels as secondary signal |
| Testing with 15 headlines | Data diluted across 2,730 combinations, no asset reaches significance | Cap at 7-8 headlines to concentrate impressions |
| Removing assets based on <1,000 impressions | Insufficient data for reliable conclusions | Wait for 5,000+ impressions before removing |
| Ignoring AIS when evaluating performance | A high-CPI asset with 2% AIS has no impact on results | Always evaluate CPI/RPI alongside AIS |
| Comparing assets across different clusters | Different clusters have different audiences and baseline CPI | Compare assets within the same cluster only |
| Reacting to weekly fluctuations | Short-term noise, not signal | Evaluate on 2-4 week windows minimum |

---

## Related documents

| Document | Relationship |
|----------|-------------|
| [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md) | Execution: The testing framework that uses these metrics |
| [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md) | Upstream: Creates the initial RSA structure |
| [Headline Angle Catalog](../catalogs/Headline Angle Catalog.md) | Catalog: Angle types used in the template system |
| [Description Expansion Catalog](../catalogs/Description Expansion Catalog.md) | Catalog: Description patterns |
| [Headline Quality Checklist](../checklists/Headline Quality Checklist.md) | Checklist: Validates headline quality |
| [SOP – Run a Creative Testing Cycle](../sops/SOP – Run a Creative Testing Cycle.md) | Parallel: Multi-format creative testing |

---

## Version details

- **Version:** 1.0
- **Last Updated:** April 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
