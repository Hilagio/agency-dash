# Bid Strategy Health Checklist
Created: 2026-02-04

Support_ID: CHECKLIST_17
Status: Done
Category: Bidding
Reference Type: Checklist
Agent_Readable: Yes
Human_Facing: Yes
Domain: Bidding
Pillar: 9

## Purpose

Validates that bid strategies are correctly configured, meeting data thresholds, operating within healthy parameters, and that budgets are sufficient to support them.

---

## What this checklist validates

This checklist confirms:

- Bid strategies are correctly configured for campaign goals
- Conversion volume thresholds are met
- Learning periods are respected
- Targets are validated against unit economics
- Budget sufficiency supports the bid strategy
- CPC caps (if used) are not silently limiting performance

This checklist does **NOT:**

- Select the bid strategy for you (See: [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md))
- Calculate bid targets (See: [Bid Targets Reference](../references/Bid Targets Reference.md))
- Provide step-by-step configuration instructions (See: [SOP – Set Up Conversion-Based Bidding](../sops/SOP – Set Up Conversion-Based Bidding.md))

---

## When to use

Run this checklist:

- After setting up a new bid strategy (campaign-level or portfolio)
- During monthly account audits
- When performance is declining or volatile
- After major campaign changes (budget, targeting, conversion actions)
- When onboarding a new account for management

---

## Checklist

### Strategy configuration

- [ ] Bid strategy matches the campaign's optimization objective (conversions vs. conversion value)
- [ ] Target CPA/ROAS/POAS is set based on calculated breakeven and profit-to-acquisition ratio, not guesswork
- [ ] Campaign-specific goals point to the correct conversion action(s)
- [ ] Primary conversion action is the lowest-funnel action with sufficient volume
- [ ] No conflicting conversion actions are set as primary (e.g., page views alongside purchases)

### Conversion volume

- [ ] Campaign or portfolio has 50+ conversions in the last 30 days (recommended threshold)
- [ ] Campaign or portfolio has at least 15 conversions in the last 30 days (absolute minimum)
- [ ] If below minimum: campaigns are consolidated, a Portfolio Bid Strategy is in use to pool data, or a data-gathering strategy (Max Clicks, Manual CPC) is active
- [ ] Conversion tracking is firing correctly and consistently (no gaps or spikes in data)

### Learning period status

- [ ] No major changes were made within the last two conversion cycles (strategy switch, target change > 25%, budget change > 30%)
- [ ] If currently in learning: no further changes are planned until learning completes
- [ ] Stakeholders have been briefed on expected volatility during learning
- [ ] Learning period data is excluded from performance evaluations

### Target validation

- [ ] Breakeven CPA/ROAS/POAS is calculated from current unit economics
- [ ] Target CPA/ROAS/POAS falls between breakeven and starvation zone
- [ ] Profit-to-acquisition ratio is between 25-75% (outside this range requires explicit justification)
- [ ] Targets have been validated against growth goals using Performance Planner or bid simulator
- [ ] Both growth goals and efficiency goals exist (not just one or the other)

### Budget sufficiency

- [ ] Daily budget is at least 10x the target CPA (for conversion-based strategies)
- [ ] Daily budget allows for the daily spending limit (2x daily budget) without stakeholder alarm
- [ ] Search lost IS (budget) is monitored: if high, budget may need increasing
- [ ] If using shared budgets: no single campaign is consuming the entire pool disproportionately

### Portfolio bid strategy configuration (if applicable)

- [ ] All linked campaigns share the same efficiency target
- [ ] All linked campaigns are the same campaign type (Search with Search, Shopping with Shopping)
- [ ] Maximum CPC cap is OFF unless explicitly justified with documented reasoning
- [ ] If CPC cap is set: it is at least 3x the average CPC of top converting search terms
- [ ] If CPC cap is set: a monthly review reminder exists to prevent forgotten caps
- [ ] Minimum CPC cap is OFF (no justified use case in standard accounts)

### Bid adjustments

- [ ] No non-exclusion bid adjustments are set on smart bidding campaigns (they are ignored)
- [ ] Any device bid adjustments are -100% exclusions only (the only type that works)
- [ ] Location, schedule, audience, and demographic adjustments are removed or set to 0% on automated strategy campaigns

### Conversion value rules (if applicable)

- [ ] Rules are only applied to campaigns using Maximize Conversion Value or Target ROAS
- [ ] Rules address value differences that cannot be captured through conversion tracking
- [ ] Rules are not substituting for broken or incomplete conversion tracking

---

## Troubleshooting table

| Symptom | Likely cause | Diagnostic check | Resolution |
|---------|-------------|-----------------|-----------|
| CPA rising above target consistently | Insufficient conversion volume, or target is below sustainable level | Check 30-day conversion count, compare target to breakeven | Increase target in 10-15% increments, or use portfolio to pool data |
| ROAS falling below target consistently | Target may be too aggressive, or conversion value tracking issue | Verify conversion value accuracy, check bid simulator for sustainable range | Lower ROAS target in 10-15% increments, audit conversion tracking |
| Volume declining week-over-week | Target may be too aggressive (starvation zone) | Check IS lost to rank, compare target to breakeven | Increase CPA target or decrease ROAS target, check for starvation |
| High IS lost to budget | Budget insufficient for current targets | Compare daily spend to daily budget | Increase budget, or tighten targets to reduce cost-per-click |
| High IS lost to rank | Bids not competitive enough | Check CPC trends vs. competition, auction insights | Review if CPC cap is restricting, or increase CPA/decrease ROAS target |
| Performance volatile after changes | Still in learning period | Check last change date vs. learning period (two conversion cycles) | Wait for learning to complete, do not make additional changes |
| Top keyword CPCs plateau at exact CPC cap | Maximum CPC cap is restricting | Compare cap to top converting term CPCs | Increase cap to 3x average of top terms, or remove |
| Conversions not reporting | Conversion tracking issue | Check conversion action status, tag firing | Fix tracking (not a bidding issue) |
| Smart bidding underperforming Manual CPC | Insufficient data for smart bidding | Check 30-day conversion count | Build data first: stay on Manual CPC or Max Clicks until 50+ conversions |

---

## Quick reference

| Document | Relationship |
|----------|-------------|
| [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md) | Decision trees for selecting strategies |
| [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md) | How smart bidding works, learning periods, signals |
| [Bid Targets Reference](../references/Bid Targets Reference.md) | Calculating breakeven and targets |
| [Bidding Configuration Guidelines](../guidelines/Bidding Configuration Guidelines.md) | Default configuration recommendations |
| [Bid Simulator Reference](../references/Bid Simulator Reference.md) | Using simulators for target validation |
| [Budget Pacing Reference](../references/Budget Pacing Reference.md) | Budget mechanics and monitoring |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Data readiness thresholds |
| [SOP – Set Up Conversion-Based Bidding](../sops/SOP – Set Up Conversion-Based Bidding.md) | Uses this checklist for validation |
| [SOP – Set Up Value-Based Bidding](../sops/SOP – Set Up Value-Based Bidding.md) | Uses this checklist for validation |

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

© 2026 PPC Mastery B.V. All rights reserved.
