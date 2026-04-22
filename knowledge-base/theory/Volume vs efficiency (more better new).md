# Volume vs efficiency (more better new)
Created: 2026-02-04
Updated: 2026-02-14
Video_URL: https://www.youtube.com/embed/zpzV9vZG-rQ

Support_ID: THEORY_4
Status: Done
Category: Operational
Reference Type: Theory
Agent_Readable: No
Human_Facing: Yes
Domain: Foundations
Pillar: 0

## Purpose

Once nothing is obviously broken, you are left with two kinds of problems: volume and efficiency. Either you do not have enough of the right stuff coming in, or you are wasting what you already have. This article teaches you to classify your bottleneck, pick the right growth lever (**More**, **Better**, or **New**), know when a step is "good enough", and understand the oscillation pattern that accounts follow as they grow.

> 💡 **Credit where it's due.** The More, Better, New framework was coined by Alex Hormozi. We translated it to Google Ads because it is that powerful: it maps perfectly onto the volume vs efficiency decision every account faces.

## What this is NOT

- Not an explanation of what bottlenecks are (see [Systems thinking & bottleneck analysis](../theory/Systems thinking & bottleneck analysis.md))
- Not a guide for finding which bottleneck to work on (see [One constraint, everything else is noise](../theory/One constraint, everything else is noise.md))
- Not a Sprint execution guide (see [Constraint sprints and focused execution](../theory/Constraint sprints and focused execution.md))

## Introduction

An E-commerce brand spends three months optimizing landing pages. Conversion rate goes from 2.1% to 2.8%. The team is proud. Revenue barely moves. The problem was never conversion rate. The problem was that Impression Share on their best product campaigns was capped at 35% because budgets were starved. They had a volume problem and treated it as an efficiency problem. Three months of skilled work on the wrong lever.

The opposite happens just as often. A SaaS company doubles their Google Ads budget overnight. Leads surge. Trial starts surge. Activation rate collapses from 40% to 12%. They flooded a system that could not handle the volume. They had an efficiency problem and treated it as a volume problem. The extra spend bought noise, not customers.

These are not edge cases. They are the two most common optimization errors in Google Ads. This article gives you a systematic way to know which lever to pull, when to switch, and when to stop.

## Step 0️⃣: Remove blockages first

Before you think about growing anything, ask one question:

> "Is anything obviously broken here?"

Broken forms. Checkout errors. Disapproved campaigns. Tracking that fires on page load instead of conversion events. These are not optimization problems. They are binary: broken vs working.

While a blockage exists, talking about volume is pointless, talking about efficiency is built on sand, and talking about new funnels is distraction. Remove first. Then optimize.

## Volume vs efficiency: the two families

After blockages are cleared, every bottleneck falls into one of two families:

**Volume bottleneck:** *"We need more of the right input"*. Proven campaigns with healthy economics are capped on budget or impression share. You hit target metrics on small spend but cannot reach your goal because scale is too small. The intent pool is clearly bigger than what you cover.

**Efficiency bottleneck:** *"We waste what we have"*. Plenty of traffic but terrible LP CVR. Many leads but low Lead to SQL%. Customers coming in but churn ruins payback. The input is there: the process squanders it.

![Split comparison of volume bottleneck versus efficiency bottleneck with diagnostic question](images/THEORY_4/01-volume-vs-efficiency-v3.png)

### How to tell which one you have

Use your [goal equation](../theory/No goal, no bottleneck.md) and current numbers.

Lead Gen example: Goal is 80 SQLs/month. Current: 2,000 clicks, 5% LP CVR = 100 leads, 20% Lead to SQL% = 20 SQLs.

Ask: *"If we keep the same volume of clicks, could realistic improvements in conversion alone get us to 80 SQLs?"*

Simulate: 2,000 clicks at 10% LP CVR = 200 leads, at 40% Lead to SQL% = 80 SQLs.

If 10% CVR and 40% Lead to SQL% are aggressive but realistic in your market, and your current 5%/20% are clearly underperforming, you have an efficiency bottleneck.

If your conversion metrics are already strong (15-20% CVR, 60-70% Lead to SQL%) and you still miss the goal, you have a volume bottleneck: you do not get enough good clicks.

> 💡 **Rule of thumb:** If efficiency is clearly below realistic benchmarks, fix efficiency. If efficiency is already strong, you need more volume.

### The simulation table

For any bottleneck, plug in your actual numbers and test both levers.
| Scenario | Clicks | LP CVR | Leads | Lead to SQL% | SQLs | Lever |
|----------|--------|--------|-------|-------------|------|-------|
| Current state | 2,000 | 5% | 100 | 20% | 20 | - |
| Double volume, same efficiency | 4,000 | 5% | 200 | 20% | 40 | **More** |
| Same volume, double efficiency | 2,000 | 10% | 200 | 40% | 80 | **Better** |
| Both (moderate) | 3,000 | 7% | 210 | 30% | 63 | **More** + **Better** |

Run this with your own numbers. The scenario that closes the gap fastest with realistic assumptions tells you which lever to pull first.

![Simulation table comparing four scenarios with bar chart showing only Better reaches the 80 SQL goal](images/THEORY_4/05-simulation-table-v3.png)

## The three growth levers

### 1. More: for clean volume problems

Use **More** when unit economics are healthy and you have a proven configuration that you are underfeeding.

Examples: increase budget on campaigns hitting target CAC/ROAS with spare Impression Share. Expand reach with broader match types where performance holds. Add geographies the business can serve.

Risk: pushing into worse inventory degrades performance. Hitting a new bottleneck downstream (e.g. sales capacity).

### 2. Better: for efficiency problems

Use **Better** when there is enough input but the process converts it poorly.

Examples: improve LP CVR by tightening message match and offer clarity. Reduce form friction, fix mobile UX, speed up load times. Improve sales scripts and SLAs to convert more SQLs from existing leads. Improve onboarding and retention to reduce payback.

Risk: time-intensive. Easy to over-focus on micro details (button color) instead of structural fixes (offer, positioning, sales process).

### 3. New: for missing pieces or ceilings

Use **New** when something important is literally absent, or you have reasonably pushed **More** and **Better** and still cannot reach the goal with the current architecture.

Examples: new dedicated landing page instead of generic homepage. New offer type (diagnostic, trial, bundle). New funnel (call funnel vs lead magnet). New campaign type once measurement and fundamentals are green.

Risk: you are starting a new system that needs its own bottleneck analysis. Very easy to use "new funnel" as a way to avoid fixing known leaks.

> ⚠️ **Warning:** "**New**" is the most seductive lever because it feels creative and exciting. It is also the most dangerous because it adds complexity. Default to **More** and **Better** first. Only reach for **New** when the current system has a structural ceiling, not when you are bored with the existing work.

![Three card grid showing More, Better, and New growth levers with examples and risks](images/THEORY_4/02-three-growth-levers-v3.png)

## Lever mismatch: the most common optimization error

Pulling the wrong lever is the single most common way accounts waste time and money. Here is why it happens:

**More when you need Better:** You scale budget into a system that converts poorly. More clicks hit the same bad landing page. CPA rises. You blame "market conditions" when the real problem is conversion efficiency. This is like turning up the water pressure when the pipe has a hole: **more pressure, bigger mess**.

**Better when you need More:** You polish a campaign to perfection but it operates on a tiny budget with 15% Impression Share. You achieve a beautiful CPA on 10 conversions per month. The business needs 100. No amount of creative testing or LP optimization will 10x the output at this scale. You need **More** first.

**New when you need Better:** You launch a new campaign type (PMax, YouTube, Demand Gen) because the existing Search campaign "plateaued". But Search LP CVR is 1.2%. The plateau was not a volume ceiling: it was an efficiency floor. Adding new channels just spreads bad conversion economics across more inventory.

Before committing to a lever, always ask: *"Is this lever addressing the actual bottleneck, or is it addressing the bottleneck I wish I had?"*

![Three lever mismatch errors in red with green corrections showing the right fix for each](images/THEORY_4/04-lever-mismatch-v3.png)

## The oscillation pattern

Volume and efficiency are not one-time choices. They **alternate** as accounts grow.

Think of them as two pedals on a bicycle. You push one, then the other, then the first again. You cannot ride by pressing both at once: you alternate. Each cycle takes you further.

In a Google Ads account, the pattern looks like this:

1. **Push efficiency** (**Better**): Fix the landing page, tighten the funnel, improve conversion rate until the system converts well enough to justify more spend.
2. **Push volume** (**More**): Increase budgets, expand keywords, add geographies. Volume grows, efficiency starts to degrade.
3. **Push efficiency again** (**Better**): The increased volume reveals new inefficiencies. Fix them. Stabilize at the new scale.
4. **Push volume again** (**More**): Efficiency is healthy at the new baseline. Scale further.

Each cycle raises both the volume floor and the efficiency baseline. The accounts that stall are the ones pressing the same pedal forever: endlessly polishing conversion without scaling, or endlessly scaling without fixing what breaks.

Knowing where you are in the oscillation prevents the most common mistake: assuming that because you "already optimized" the landing page, it cannot be the bottleneck again. At higher volumes, the same landing page may face different traffic quality, different device mixes, or different competitive pressure. Efficiency is not a checkbox: it is a **recurring commitment** at each new volume level.

![Timeline showing four alternating phases of efficiency and volume pushes with rising staircase](images/THEORY_4/03-oscillation-pattern-v3.png)

## Marginal returns: when to stop optimizing a lever

Every lever has diminishing returns. The first improvements are large. The later ones are small. At some point, the effort to squeeze another 5% from the current lever exceeds the effort to switch levers entirely.

Signs you have hit marginal returns on **Better**: LP CVR is at or above benchmark for your vertical and traffic type. Each new test produces smaller lifts. The goal equation shows that even a perfect efficiency score at this node would not close the gap (the bottleneck has moved to volume or a different node).

Signs you have hit marginal returns on **More**: budget increases produce proportionally smaller gains. CPA/ROAS degrades faster than volume grows. Impression Share is already captured on your best segments.

When you hit marginal returns, do not keep pushing the same lever harder. Switch levers. Or switch nodes. Walk your [metric tree](../theory/No goal, no bottleneck.md) and find the next weakest link.

## "Good enough" and moving on

This is a trap that catches even experienced Google Ads specialists. You can spend months polishing a step that is already "good enough" relative to your goal while the actual bottleneck is upstream.

A bottleneck is defined relative to a target, not an abstract benchmark. Once a metric reliably does what your equation needs, it stops being the constraint, even if you could optimize it further. That is **good enough**.

Signs a step is "good enough": the metric is stable over time (not a one-week spike), at or above realistic levels for your market, and no longer the worst term in your goal equation. When you plug current numbers into your equation, other terms dominate the gap.

When that happens: mark the constraint as Resolved, re-evaluate the equation to find the next weakest term, and run the Remove/Volume/Efficiency/**More**/**Better**/**New** logic on that new constraint.

> 💡 **Key principle:** The aim is not a perfect LP, perfect CTR, or perfect close rate. The aim is to keep moving the system's overall throughput by chasing the current bottleneck, then moving on when the math says the bottleneck has shifted.

## Implementation checklist

- [ ] Run the Remove pre-check: confirm forms/checkout/tracking/policies are working
- [ ] Classify the bottleneck: volume or efficiency (use the simulation table with real numbers)
- [ ] Generate options: what would **More** look like? **Better**? **New**?
- [ ] Check for lever mismatch: is the lever you want to pull addressing the actual bottleneck?
- [ ] Choose 1-2 primary levers for the Sprint
- [ ] Define "good enough": target range for the bottleneck metric based on the goal equation
- [ ] After the Sprint: re-measure. Decide if the constraint is Resolved, Improved but still limiting, or Misdiagnosed

## Related Documents

- [Systems thinking & bottleneck analysis](../theory/Systems thinking & bottleneck analysis.md)
- [No goal, no bottleneck](../theory/No goal, no bottleneck.md)
- [One constraint, everything else is noise](../theory/One constraint, everything else is noise.md)
- [The five buckets & hierarchy of constraints](../theory/The five buckets & hierarchy of constraints.md)
- [Diagnostic engine: Symptom to Constraint to Solution](<../theory/Diagnostic engine Symptom → Constraint → Solution.md>)
- [Constraint sprints and focused execution](../theory/Constraint sprints and focused execution.md)

## Terms

| Term | Definition |
|------|-----------|
| Remove | Pre-check for binary blockages (broken forms, tracking, disapprovals) before any optimization |
| Volume bottleneck | Not enough of the right input flowing into the system |
| Efficiency bottleneck | Input is sufficient but the process wastes it (low conversion rates, poor throughput) |
| **More** | Growth lever: increase volume of proven, profitable input |
| **Better** | Growth lever: improve how efficiently the system converts input to output |
| **New** | Growth lever: add a missing component or fundamentally restructure the system |
| Good enough | The point where a metric is no longer the worst term in the goal equation and focus should shift |
| Lever mismatch | Pulling the wrong growth lever for the actual bottleneck type |
| Oscillation | The natural alternation between volume and efficiency pushes as an account grows |
