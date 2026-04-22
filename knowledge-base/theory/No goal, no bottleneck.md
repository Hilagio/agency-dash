# No goal, no bottleneck
Created: 2026-02-04
Updated: 2026-02-14
Video_URL: https://www.youtube.com/embed/vg-FRHd1vPU

Support_ID: THEORY_2
Status: Done
Category: Operational
Reference Type: Theory
Agent_Readable: No
Human_Facing: Yes
Domain: Foundations
Pillar: 0

## Purpose

Turns vague ambitions ("scale", "grow", "lower CPL") into testable equations and visual metric trees so you can do real bottleneck analysis. Without a number, a formula, and a tree, everything is "kind of bad" and nothing is clearly the constraint.

## What this is NOT

- Not a guide for setting business strategy or company-level OKRs
- Not a KPI setup tutorial (see [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md))
- Not a dashboard or reporting guide
- Not a substitute for the Status Board (the tree is the structure, the Status Board is the daily view)

## Introduction

Imagine opening Google Ads and seeing CPA at €45. Is that good? Is that bad? You cannot answer. If the target is €30, it is a problem. If the target is €80, it is a celebration. The metric did not change. The interpretation depends entirely on what you are trying to achieve.

Now multiply that ambiguity across every metric in the account: CTR, CVR, ROAS, Impression Share, Lead to SQL rate. Without a clear goal, **every number is just a number**. You can stare at the dashboard for hours and still not know which metric is the one actually limiting your results. You end up treating Google Ads like a slot machine: pull levers, hope something changes, and call it optimization.

This article kills the ambiguity. You will turn vague goals into **goal equations**, equations into **metric trees**, and metric trees into a diagnostic tool that tells you exactly which node in the system is the bottleneck. Once you have this, every other theory article in the OS has something solid to work with.

## The Goal Clarity Test

Before building equations and trees, run this five-question test. If you cannot answer all five, you are not ready for bottleneck analysis. You are still in goal clarification mode.

1. **What is the output metric?** Revenue, Profit, New MRR, Pipeline Value, Deals. Not "growth" or "improvement". A number.
2. **What is the target?** A specific figure with a time horizon. "€80k/month in new revenue within 12 months". Not "more".
3. **What is the constraint?** Maximum CAC, minimum ROAS, minimum margin, maximum payback period. What are you not willing to sacrifice?
4. **Where does Google Ads fit?** What share of the target should Google Ads deliver? Google Ads is one channel, not the entire business.
5. **What does "good enough" look like?** The number at which you stop optimizing this metric and move to the next constraint. Perfection is not the goal: "good enough to move forward" is.

If you scored five out of five, you have a goal. If not, go get answers before touching the account.

## Goals are math

A goal is not a sentence. It is an equation.

> Output = Inputs x Efficiency x Value

Lead Gen example:

- `Revenue = Deals x Avg Deal Value`
- `Deals = SQLs x Win Rate`
- `SQLs = Leads x Lead to SQL%`

E-commerce example:

- `Profit = Orders x AOV x Margin% - Fixed Costs`

SaaS example:

- `New MRR = New Customers x ARPA`
- `New Customers = Trials x Activation% x Trial to Paid%`

**Goals are just math** means: when you say *"I want €X more per month"*, you are implicitly saying *"I will adjust one or more terms in this equation until the product equals €X"*. Bottleneck analysis becomes: *"Which term in the equation is currently too small or too weak to let the output hit target?"*

Without the equation, you are arguing about feelings. With the equation, **you are arguing about numbers**.

![Goal equations broken down by vertical: Lead Gen, SaaS, and Ecommerce](images/THEORY_2/01-goal-equation-v4.png)

### From goal to gap

Once you have a specific goal, translate it into numbers and measure the gap.

A Lead Gen account wants €80k/month in new revenue at €800 max CAC via Google Ads. Avg deal value is €4,000, win rate is 25%.

- Need `80,000 / 4,000 = 20 deals` per month
- At 25% win rate, need `20 / 0.25 = 80 SQLs` per month

Current trailing 3-month average: 30 SQLs, 7 deals, €28k revenue, CAC at €1,300.

The gap: 50 SQLs short. €52k revenue short. €500 over target CAC.

The problem is now numerical, not emotional. You are not *"bad at Google Ads"*. You are 50 SQLs and €500 of CAC away from where you want to be. That is a problem you can decompose and solve.

![Gap analysis: target vs current comparison showing where the numerical gap lives](images/THEORY_2/03-gap-analysis-v3.png)

### Vanity goals vs real goals

Not all goals are created equal.
| Vanity goal | Real goal | Why it matters |
|-------------|-----------|---------------|
| "Lower CPA" | "CPA at €45 with 200 leads/month" | Without a volume floor, you can "lower CPA" by pausing everything except brand |
| "Increase ROAS" | "ROAS of 400% at €50k/month spend" | ROAS at €500 spend means nothing for a business that needs scale |
| "More leads" | "120 SQLs/month at €60 max CPQL" | "More leads" without quality and cost constraints invites junk |
| "Grow revenue" | "€200k/month from Google Ads at 35% contribution margin" | Revenue without margin context could mean scaling at a loss |

Vanity goals feel clear but are not testable. They leave room for the Google Ads specialist to declare victory while the business stagnates. **Real goals** have a target, a constraint, and a volume requirement. They can be decomposed into equations, and those equations can be diagnosed.

## From equation to metric tree

Your goal equation written as a hierarchy, with the goal at the top and platform-level inputs at the bottom, is a **metric tree**. The tree is the spine that connects business goals, [Status Board](../theory/Status board and operating rhythms.md) metrics, [Five Buckets](../theory/The five buckets & hierarchy of constraints.md), and Google Ads levers. For the full technical reference on metric tree structures, root cause analysis method, and common diagnostic patterns, see the [Metric Tree Reference](../references/Metric Tree Reference.md).

The generic structure flows downward: Profit or Revenue at the top, then Deals/Orders/Customers, then Leads/Trials/Sessions, then Clicks, then Impressions, with efficiency multipliers connecting each level.

Every node in the tree decomposes into three components:

- **Volume:** how many units flow through (Leads, Clicks, Sessions)
- **Efficiency:** the rate at which input becomes output (CVR, Win%, Lead to SQL%)
- **Value:** what each success is worth (Deal size, AOV, ARPA, Margin%)

This decomposition is what lets you say: *"We don't have a Google Ads problem. We have a Lead to SQL% problem in the Business bucket"*. Or: *"This is a volume bottleneck at the Sessions level, not an efficiency bottleneck at CVR"*.

![Metric tree hierarchy: goal at top branching into volume, efficiency, and value nodes mapped to buckets](images/THEORY_2/02-metric-tree-v4.png)

## Canonical trees by vertical

One tree per vertical is enough. Tweak per account. The [Metric Tree Reference](../references/Metric Tree Reference.md) provides the full platform-level tree structures with Impression Share branches and root cause analysis flows.

### Lead Gen / B2B

Top goal: Net New Revenue or Pipeline from Google Ads.

`Revenue = Impressions x CTR x LP CVR x Lead to SQL% x Win% x Avg Deal Value`

Platform-level decomposition (from the [Metric Tree Reference](../references/Metric Tree Reference.md)):

```
CPA (or CPQL / CAC)
├── Cost
│   ├── Clicks
│   │   ├── Impressions
│   │   │   ├── Search Volume
│   │   │   └── Impression Share
│   │   └── CTR
│   └── CPC
└── Conversions (Leads / QLs)
    ├── Clicks
    └── Conversion Rate

Extended funnel (beyond Google Ads):
Revenue = Leads x MQL Rate x SQL Rate x Win Rate x Deal Value
```

Bucket assignments: Business owns Deals, Win%, Lead to SQL%, Avg Deal Value, CAC. Conversion owns LP CVR. Traffic owns Impressions and Clicks. Creative owns CTR. Measurement overlays accuracy of all.

### SaaS

Top goal: New MRR or New Customers at target payback.

`New MRR = Clicks x Signup CVR x Trial Start% x Activation% x Trial to Paid% x ARPA`

Bucket assignments: Business owns New Customers, ARPA, Trial to Paid%, churn, payback. Conversion owns Signup CVR, Trial Start%, early activation. Traffic owns Impressions, Clicks. Creative owns CTR and asset performance.

### E-commerce

Top goal: Profit or Contribution Margin at scale.

`Profit = Sessions x Session to Order% x AOV x Gross Margin% - Fixed Costs`

Platform-level decomposition (from the [Metric Tree Reference](../references/Metric Tree Reference.md)):

```
ROAS
├── Conversion Value
│   ├── Conversions
│   │   ├── Clicks
│   │   │   ├── Impressions (Search Volume x Impression Share)
│   │   │   └── CTR
│   │   └── Conversion Rate
│   └── AOV
└── Cost
    ├── Clicks
    └── CPC
```

Bucket assignments: Business owns Profit, Gross Margin%, AOV (if driven by mix/pricing), LTV. Conversion owns Session to Order%, cart-to-checkout, checkout-to-purchase. Traffic owns Impressions, Clicks, Sessions. Creative owns CTR and concept performance.

## Why CPA, ROAS, and CPC are not tree nodes

The metric tree models **flows**: how units move through the system. CPA, ROAS, CPC, and Impression Share are **derived ratios**: they describe how expensive the flow is, not how the flow works.

CPC is `Cost / Clicks`. CPA is `Cost / Conversions`. ROAS is `Revenue / Cost`. Each of these is already a function of tree nodes. Adding them as separate nodes would duplicate relationships and make it harder to see which underlying node is actually broken.

When CPA is "too high", the tree tells you why: is it because CTR is low (Creative/Traffic), CVR is low (Conversion), volume is insufficient (Traffic), or deal value is too small (Business)? CPA alone cannot answer that. The tree can.

Platform metrics still matter. They live on the [Status Board](../theory/Status board and operating rhythms.md) as health indicators. But they are outputs of the tree, not inputs to it.

## Setting baselines without guessing

A tree without realistic targets per node is useless. If you set LP CVR at 20% in a cold B2B niche where 5-10% is strong, you will mislabel Conversion as the bottleneck and waste months chasing an impossible number.

**Use existing data first:** Pull 3-6 months of stable-period data. Compute baselines for key nodes. Set targets as modest improvements over current performance (+20-30% relative), not made up numbers.

**Use sanity ranges when there is no history:** LP CVR in B2B: 3-10% is realistic. Lead to SQL%: 20-40% if form and offer are sane. Session to Order% in e-com: 1-5% depending on traffic and price point. Define "Broken / Acceptable / Strong" ranges, not perfect numbers.

**Align baselines with your top-level goal:** Simulate the equation with current baselines. Does it get you anywhere near the target with realistic adjustments? If not, either the goal is unrealistic or the tree is missing nodes (upsell, expansion, retention). Both are useful discoveries.

## Walking the tree: ratio analysis

This is where the tree becomes a live diagnostic tool (see the [Metric Tree Reference](../references/Metric Tree Reference.md) for the step-by-step root cause analysis method and common diagnostic patterns).

Start at the top node (Profit, Revenue, New MRR). Compare target vs current. Walk down: for each child node, compare its implied target (what the tree needs) vs its actual baseline. The first node where reality falls dramatically short of requirement is your bottleneck metric.

Concrete example: a Lead Gen tree says to hit the goal you need LP CVR around 7-8%, Lead to SQL% around 30-40%, and Win% around 25-30%. Actuals show LP CVR at 6% (acceptable), Lead to SQL% at 5% (terrible), and Win% at 25% (fine). The bottleneck is Lead to SQL% in the Business bucket. Fixing CTR or LP CVR would make marginal improvements. Fixing Lead to SQL% would transform the account.

![Top-down tree walkthrough with green, orange, and red color coding per node showing bottleneck at Lead to SQL%](images/THEORY_2/04-ratio-walkthrough-v4.png)

### Trees that lie

Blended metrics mask problems. Three ways trees mislead you if you are not careful:

**The average that hides two extremes:** Account-level LP CVR is 5% (fine). But Campaign A converts at 12% and Campaign B at 0.8%. The average looks healthy. Campaign B is bleeding money. Always break blended nodes down by campaign, geography, or segment before concluding a node is "fine".

**The compensating node:** Win% is high (40%) but Lead to SQL% is terrible (8%). The sales team is great at closing the few good leads that make it through. The tree shows the bottleneck is Lead to SQL%, but if you only looked at Deals, the output might look acceptable because Win% is compensating. Do not just check outputs: check every node.

**The lagging metric:** Revenue looks fine this month because of deals that started three months ago. The current pipeline is empty. The tree using trailing data looks green while the forward-looking picture is red. Set your tree baselines on recent enough data to see trends, not just snapshots.

![Blended vs segmented metrics: how account-level averages hide real constraints at the campaign level](images/THEORY_2/05-blended-vs-segmented-v3.png)

## Same account, different goals, different bottlenecks

Two specialists look at the same account. Same data, same metrics, same tree.

Specialist A's goal: *"Increase lead volume from 200 to 400 leads/month at current CPA"*. They walk the tree and see the bottleneck is Impressions and Click volume (Traffic). They need More.

Specialist B's goal: *"Maintain 200 leads/month but cut CPA from €90 to €50"*. They walk the same tree and see the bottleneck is LP CVR and Quality Score (Conversion/Creative). They need Better.

The account did not change. The **bottleneck changed because the goal changed**. This is why the Google Ads Scaling OS insists on clear goals before diagnosis. Without a goal, two equally competent Google Ads specialists will diagnose different problems, execute different solutions, and both claim they are "optimizing". Only one of them is solving the actual constraint, and which one depends entirely on what the business needs.

## Implementation checklist

- [ ] Pass the Goal Clarity Test (all five questions answered with specifics)
- [ ] Express the goal as an equation with input, efficiency, and value metrics
- [ ] Fill the equation with current trailing numbers and compute the gap per term
- [ ] Draw the metric tree for this account using the canonical template for the vertical
- [ ] Assign each tree node to a bucket (Business, Conversion, Traffic, Creative)
- [ ] Set baseline bands per node (Broken / Acceptable / Strong)
- [ ] Walk the tree top-to-bottom and identify the single worst-performing node relative to what the goal requires
- [ ] Confirm the identified bottleneck matches a bucket and a growth lever (More, Better, or New)

## Related Documents

- [Systems thinking & bottleneck analysis](../theory/Systems thinking & bottleneck analysis.md)
- [The five buckets & hierarchy of constraints](../theory/The five buckets & hierarchy of constraints.md)
- [Volume vs efficiency (more better new)](<../theory/Volume vs efficiency (more better new).md>)
- [Status board and operating rhythms](../theory/Status board and operating rhythms.md)
- [Diagnostic engine: Symptom to Constraint to Solution](<../theory/Diagnostic engine Symptom → Constraint → Solution.md>)
- [Metric Tree Reference](../references/Metric Tree Reference.md)
- [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md)
- [Unit Economics Mental Model](../mental-models/Unit Economics Mental Model.md)

## Terms

| Term | Definition |
|------|-----------|
| Goal equation | A numeric formula that breaks a business goal into measurable terms (Revenue = Deals x Avg Deal Value) |
| Metric tree | Visual decomposition of a business goal into volume, efficiency, and value nodes down to platform-level inputs |
| Gap | The numerical difference between target and current reality for each term in the equation |
| Input metric | A volume term: Impressions, Clicks, Leads, SQLs, Sessions |
| Efficiency metric | A conversion rate term: CTR, CVR, Lead to SQL%, Win% |
| Value metric | A per-unit worth term: AOV, Deal size, ARPA, Margin% |
| Baseline bands | "Broken / Acceptable / Strong" ranges per node, calibrated to account data or vertical benchmarks |
| Canonical tree | Standard metric tree template for a vertical (Lead Gen, SaaS, E-com) that gets customized per account |
| Ratio analysis | Walking the tree node by node, comparing actual vs required performance at each level |
