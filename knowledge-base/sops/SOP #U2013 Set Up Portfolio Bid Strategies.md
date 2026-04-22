# SOP – Set Up Portfolio Bid Strategies
Created: 2026-02-04

Agent_Executable: No
Category: Bidding
Human_Approval_Required: No
Primary Outcome: Portfolio bid strategy created with correct campaigns linked, optional shared budget and CPC caps configured
SOP_ID: SOP_37
Secondary Outcomes: Conversion data pooled across campaigns, centralized bid management enabled
Status: Done
Domain: Bidding
Pillar: 9

### Purpose

This SOP walks you through creating a portfolio bid strategy that pools conversion data across multiple campaigns sharing the same efficiency goal, and optionally pairing it with a shared budget.

> ❓ **The big question:** How do you set up a portfolio bid strategy so campaigns share conversion signals, and when should you add CPC caps or shared budgets?

Portfolio bid strategies solve a common problem: individual campaigns that fall below the 30 conversions/month threshold for reliable smart bidding. Five campaigns with 12 conversions each become one portfolio with 60 pooled conversions, giving the algorithm enough data to optimize effectively.

---

### What this SOP is NOT

This SOP does **not:**

- Help you select which bid strategy type to use (See: [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md))
- Cover setting up a single-campaign bid strategy (See: [SOP – Set Up Conversion-Based Bidding](../sops/SOP – Set Up Conversion-Based Bidding.md))
- Calculate your CPA or ROAS targets (See: [SOP – Calculate Bid Targets](../sops/SOP – Calculate Bid Targets.md))
- Explain smart bidding auction-time mechanics (See: [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md))

### When to run this SOP

Run this SOP when:

- Multiple campaigns share the same efficiency target (CPA, ROAS, or conversion volume goal)
- Individual campaigns fall below 30 conversions/month but combined they exceed the threshold
- You want centralized bid management across related campaigns
- You want to pair a bid strategy with a shared budget for automatic budget allocation

---

### Before you start

#### Required inputs

- List of campaigns to include in the portfolio (identified and confirmed)
- Shared efficiency target (CPA, ROAS, or Max Conversions/Value goal)
- Decision on whether to use a shared budget (yes/no)
- Conversion tracking verified and firing correctly on all campaigns
- Each campaign's current average CPC for top converting search terms (needed only if considering CPC caps)

#### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Bidding Configuration Guidelines](../guidelines/Bidding Configuration Guidelines.md) | Strategy configuration rules |
| [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md) | Learning period and data pooling mechanics |
| [Budget Pacing Reference](../references/Budget Pacing Reference.md) | Shared budget configuration |
| [Bid Strategy Health Checklist](../checklists/Bid Strategy Health Checklist.md) | Post-setup validation |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Minimum data thresholds |

---

### Decision gate: Eligibility check

Before creating the portfolio, confirm all campaigns are eligible:

| Requirement | Rule | If not met |
|-------------|------|------------|
| Campaign type | Search, Standard Shopping, or Display only | Remove ineligible campaigns from the list |
| Campaign type match | All campaigns in the portfolio must be the same type | Create separate portfolios per campaign type |
| Efficiency target | All campaigns share the same target metric (CPA, ROAS, etc.) | Group campaigns by target metric |
| Conversion action | All campaigns use the same primary conversion action or compatible actions | Align conversion actions before proceeding |

> ⚠️ **Portfolio bid strategies do not support Performance Max, Video, Demand Gen, or App campaigns:** These campaign types must use campaign-level bid strategies.

---

### Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Identify eligible campaigns** | Confirm which campaigns belong in the portfolio | Validated campaign list with pooled conversion count |
| **Phase 2️⃣: Create the portfolio strategy** | Build the strategy in Google Ads and link campaigns | Active portfolio bid strategy with campaigns attached |
| **Phase 3️⃣: Configure CPC caps** | Set optional bid limits if needed | CPC cap configuration (default: off) |
| **Phase 4️⃣: Configure shared budget** | Optionally create and link a shared budget | Shared budget active (or confirmed as not needed) |
| **Phase 5️⃣: Validate and monitor** | Verify setup and manage learning period | Validated portfolio with monitoring plan |

---

## Phase 1️⃣: Identify eligible campaigns

### 1.1 List candidate campaigns

Pull a list of all campaigns that share the same efficiency goal. For each campaign, record:

| Campaign name | Campaign type | Current strategy | Monthly conversions | Current avg CPA/ROAS | Avg CPC (top terms) |
|---------------|---------------|-----------------|--------------------|-----------------------|---------------------|
| | | | | | |
| | | | | | |
| | | | | | |

### 1.2 Validate eligibility

For each campaign on the list, confirm:

1. **Campaign type is supported:** Search, Standard Shopping, or Display
2. **All campaigns are the same type:** Do not mix Search and Shopping in one portfolio
3. **All campaigns target the same conversion action(s)**
4. **All campaigns share a compatible efficiency goal**

Remove any campaigns that fail these checks.

### 1.3 Calculate pooled conversion volume

Add up the monthly conversions across all eligible campaigns.

| Threshold | Status | Action |
|-----------|--------|--------|
| 50+ conversions/month pooled | Recommended | Proceed to Phase 2 |
| 15-49 conversions/month pooled | Minimum viable | Proceed with caution, expect more volatility |
| Below 15 conversions/month pooled | Insufficient | Do not create the portfolio, address volume first |

> 💡 **The core benefit of portfolio strategies is data pooling:** Five campaigns with 12 conversions each give you 60 pooled conversions, well above the 50+ threshold where smart bidding performs reliably.

---

## Phase 2️⃣: Create the portfolio strategy

### 2.1 Navigate to bid strategies

1. In Google Ads, go to **Tools > Budgets and Bidding > Bid Strategies**
2. Click the **+** button to create a new bid strategy

### 2.2 Configure the strategy

1. **Select the strategy type** based on your efficiency goal:

| Goal | Strategy type | Target field |
|------|---------------|--------------|
| Maximize conversion volume with CPA constraint | Target CPA | Enter your CPA target |
| Maximize conversion volume without constraint | Maximize Conversions | No target needed |
| Maximize conversion value with ROAS constraint | Target ROAS | Enter your ROAS target |
| Maximize conversion value without constraint | Maximize Conversion Value | No target needed |

2. **Name the strategy** using a clear naming convention:

| Format | Example |
|--------|---------|
| `[Type] - [Goal] - [Group descriptor]` | `Portfolio - tCPA €45 - US Brand Campaigns` |
| `[Type] - [Goal] - [Region/Segment]` | `Portfolio - tROAS 400% - Shopping EU` |

3. **Set the target** (if using Target CPA or Target ROAS):
   - Use the calculated target from the Bid Targets Reference
   - If migrating from individual campaign strategies: use the weighted average of the campaigns' existing targets as a starting point

### 2.3 Link campaigns

1. In the strategy creation screen, click **Select campaigns**
2. Add all campaigns from your validated list (Phase 1)
3. Review the list to confirm all intended campaigns are included
4. Save the portfolio strategy

> ⚠️ **Once you link a campaign to a portfolio strategy, the campaign's individual bid strategy is replaced:** The campaign now inherits the portfolio's target and settings.

---

## Phase 3️⃣: Configure CPC caps

### 3.1 Default position: CPC caps OFF

Leave CPC caps disabled. Smart bidding adjusts CPCs at auction time based on conversion probability. Manual caps interfere with this optimization.

> ⚠️ **Bob's stance: no longer default to CPC caps:** Leave bidding to the algorithm. Only set caps if the algorithm consistently overbids on low-value queries.

### 3.2 When to enable CPC caps

Enable CPC caps only when:

| Condition | Signal |
|-----------|--------|
| Algorithm consistently "goes nuts" | CPCs spike 5x+ above normal for extended periods (not just learning fluctuations) |
| Specific query categories drive extreme CPCs | Search term report shows high-CPC terms with no conversions |
| Brand protection needed | Competitor bidding drives brand CPCs to unsustainable levels |

### 3.3 How to set CPC caps (if needed)

1. Open the portfolio bid strategy settings
2. Expand "Advanced options" or "Bid limits"
3. Set the **Maximum CPC bid limit**

**Calculation:**

| Step | Action |
|------|--------|
| 1 | Pull the search term report for the last 30-60 days |
| 2 | Filter to terms with at least 1 conversion |
| 3 | Calculate the average CPC of these top converting terms |
| 4 | Set maximum CPC = 3x that average CPC |

**Example:**
Average CPC of converting terms = €2.50. Maximum CPC cap = €7.50.

4. Leave the **Minimum CPC bid limit** empty (do not set a floor)

### 3.4 Set a CPC cap review reminder

If you set CPC caps:

1. Create a calendar reminder to review CPC caps every 30 days
2. At each review: compare actual CPCs to the cap. If the cap is never approached, it is safe. If the cap is frequently hit, it may be limiting performance.
3. Remove the cap if performance is stable without it

> ⚠️ **Forgotten CPC caps are the most dangerous misconfiguration:** A cap set during a temporary spike can silently limit performance for months. Always set a review reminder when enabling caps.

---

## Phase 4️⃣: Configure shared budget (optional)

### 4.1 Decide if a shared budget is needed

| Use a shared budget when | Do not use a shared budget when |
|--------------------------|-------------------------------|
| All campaigns in the portfolio share the same business objective | Campaigns have different budget priorities |
| You want Google to automatically allocate budget to the best-performing campaigns | You need strict budget control per campaign |
| Campaign-level budget micromanagement is not required | Reporting requires campaign-level spend tracking |

### 4.2 Create the shared budget

1. In Google Ads, go to **Tools > Budgets and Bidding > Shared Budgets**
2. Click the **+** button
3. **Name the budget:** match the portfolio strategy name (e.g., `Shared Budget - US Brand Campaigns`)
4. **Set the daily budget:** sum of all individual campaign budgets being consolidated

**Example:**

| Campaign | Individual daily budget |
|----------|----------------------|
| Campaign A | €50 |
| Campaign B | €30 |
| Campaign C | €20 |
| **Shared budget** | **€100** |

5. Apply the shared budget to all campaigns in the portfolio
6. Remove the individual campaign budgets (they are now managed by the shared budget)

### 4.3 Verify shared budget assignment

1. Navigate to each campaign's settings
2. Confirm the shared budget name appears under "Budget"
3. Confirm no individual budget remains active alongside the shared budget

---

## Phase 5️⃣: Validate and monitor

### 5.1 Run the post-setup checklist

- [ ] Portfolio bid strategy is active and shows correct strategy type
- [ ] All intended campaigns are linked (check under strategy details)
- [ ] No unintended campaigns are linked
- [ ] Target (CPA/ROAS) matches the calculated value
- [ ] CPC caps are OFF (or documented with a review reminder if ON)
- [ ] Shared budget is correctly assigned (if applicable)
- [ ] Conversion tracking is firing on all linked campaigns

### 5.2 Run the Bid Strategy Health Checklist

Run the full [Bid Strategy Health Checklist](../checklists/Bid Strategy Health Checklist.md) against the new portfolio strategy.

### 5.3 Monitor the learning period

The portfolio strategy enters a learning period of approximately two conversion cycles after creation (See: [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md)).

| Do | Do not |
|----|--------|
| Check metrics daily for anomalies | Adjust the CPA/ROAS target |
| Verify conversions are being tracked | Add or remove campaigns from the portfolio |
| Note any external factors (seasonality, promos) | Change CPC caps during learning |
| Document daily performance in a tracking sheet | Change budget by more than 10% |

### 5.4 Post-learning evaluation

After the learning period (two conversion cycles):

1. Compare actual portfolio CPA/ROAS to the target
2. Check if pooled conversion volume matches expectations
3. Review budget allocation across campaigns (if using shared budget)
4. Decide on first adjustment (if needed): change target by no more than 10-15%

---

### Validation & definition of done

This SOP is complete when:

- [ ] Portfolio bid strategy is created with the correct strategy type and target
- [ ] All eligible campaigns are linked to the portfolio
- [ ] CPC caps are configured correctly (off by default, or set at 3x with review reminder)
- [ ] Shared budget is configured (if applicable) with correct total amount
- [ ] Bid Strategy Health Checklist passes
- [ ] Learning period has been completed without interference
- [ ] Post-learning evaluation confirms stable performance

---

### Exit → Entry bridge

Once the portfolio strategy is stable and post-learning evaluation is complete:

| Timeframe | Action |
|-----------|--------|
| Week 3-4 | Make first target adjustment if needed (10-15% increments) |
| Monthly | Review CPC caps (if set), remove if no longer needed |
| Monthly | Review shared budget allocation, adjust total if campaigns are consistently budget-limited |
| Quarterly | Re-evaluate which campaigns belong in the portfolio |
| When scaling | Begin [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md) |

**If issues arise:**

| Issue | Route to |
|-------|----------|
| Portfolio CPA/ROAS consistently misses target | [SOP – Calculate Bid Targets](../sops/SOP – Calculate Bid Targets.md) to recalculate targets |
| One campaign dominates the shared budget | Remove shared budget, return to individual budgets |
| CPC caps are frequently hit | Review and raise cap (or remove entirely) |
| Conversion volume drops below 15/month pooled | Consider dissolving portfolio, fix upstream volume issues |
| Learning period resets repeatedly | [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md) for learning triggers |

---

### FAQ

**Q: Can I mix Search and Shopping campaigns in the same portfolio?**

A: No. All campaigns in a portfolio must be the same campaign type. Create separate portfolio strategies for Search, Shopping, and Display.

**Q: What happens to a campaign's individual bid strategy when I add it to a portfolio?**

A: The campaign's individual strategy is replaced by the portfolio strategy. If you later remove the campaign from the portfolio, you need to assign a new bid strategy manually.

**Q: Should I always pair a portfolio strategy with a shared budget?**

A: No. Portfolio strategies and shared budgets are independent features. Use a shared budget only when you want Google to allocate budget dynamically across the campaigns. If you need strict per-campaign budget control, use individual budgets with the portfolio strategy.

**Q: How do I know if my CPC cap is too restrictive?**

A: Check the "Bid strategy status" column in the bid strategies view. If it shows "Limited by bid limit", your cap is constraining the algorithm. Compare performance with and without the cap over a 2-week period to determine whether to keep it.

**Q: What is the minimum number of campaigns for a portfolio strategy?**

A: Two campaigns is the technical minimum. The value increases with more campaigns because you pool more conversion data. A single campaign does not benefit from a portfolio strategy.

---

### Quick reference: Support library

| Document | Type | Used in |
|----------|------|---------|
| [Bidding Configuration Guidelines](../guidelines/Bidding Configuration Guidelines.md) | Guideline | Phase 2 (strategy configuration) |
| [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md) | Reference | Phase 5 (learning period management) |
| [Budget Pacing Reference](../references/Budget Pacing Reference.md) | Reference | Phase 4 (shared budget setup) |
| [Bid Strategy Health Checklist](../checklists/Bid Strategy Health Checklist.md) | Checklist | Phase 5 (validation) |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Reference | Phase 1 (eligibility check) |

---

### Related SOPs

| SOP | Relationship |
|-----|-------------|
| [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md) | Upstream (determines which strategy type to use) |
| [SOP – Calculate Bid Targets](../sops/SOP – Calculate Bid Targets.md) | Upstream (provides the CPA/ROAS target) |
| [SOP – Set Up Conversion-Based Bidding](../sops/SOP – Set Up Conversion-Based Bidding.md) | Alternative (for single-campaign setup) |
| [SOP – Migrate from Manual to Smart Bidding](../sops/SOP – Migrate from Manual to Smart Bidding.md) | Parallel (if campaigns are migrating from Manual CPC) |
| [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md) | Downstream (once portfolio strategy is stable) |

---

### Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Mixing campaign types in one portfolio | Assumption that any campaign can join | Verify all campaigns are the same type before creating |
| Forgotten CPC caps limiting performance for months | Cap set during a spike, never revisited | Always set a 30-day review reminder when enabling caps |
| Shared budget starving smaller campaigns | One campaign consumes disproportionate budget | Monitor allocation weekly, split into separate budgets if needed |
| Including PMax or Video campaigns | Incorrect assumption about eligible types | Only Search, Standard Shopping, and Display are supported |
| Setting portfolio target far below individual campaign averages | Aggressive target without enough pooled data | Start at weighted average of campaign-level performance |
| Removing campaigns from portfolio without assigning new strategy | Campaign left with no active bid strategy | Always assign a replacement strategy before removing from portfolio |

---

### Version details

- **Version:** 1.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

### Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
