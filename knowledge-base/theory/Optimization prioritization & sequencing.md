# Optimization prioritization & sequencing
Created: 2026-02-14
Updated: 2026-02-14

Support_ID: THEORY_12
Status: Done
Category: Operational
Reference Type: Theory
Agent_Readable: No
Human_Facing: Yes
Domain: Foundations
Pillar: 0

## Purpose

When you sit down with an account and find five things wrong at once, this article teaches you how to decide what to fix first, what to schedule, what to batch, and what to skip. It gives you a repeatable scoring model and a set of sequencing rules so you stop guessing and start executing in the right order.

## What this is NOT

- Not an explanation of what bottlenecks are or how to find them (see [Systems thinking & bottleneck analysis](../theory/Systems thinking & bottleneck analysis.md))
- Not a guide for classifying issues into buckets (see [The five buckets & hierarchy of constraints](../theory/The five buckets & hierarchy of constraints.md))
- Not a Sprint execution guide (see [Constraint sprints and focused execution](../theory/Constraint sprints and focused execution.md))
- Not a decision on More/Better/New levers (see [Volume vs efficiency (more better new)](<../theory/Volume vs efficiency (more better new).md>))

## Introduction

You open three accounts on a Monday morning. Each one has five issues. That is fifteen problems staring at you before your first coffee. If you work on whatever catches your eye first, you will spend the day clicking, adjusting, and feeling productive. By Friday, you will have made forty changes across three accounts and moved zero needles. **Activity is not progress:** Sequence is everything.

The cost of getting prioritization wrong is not just wasted time. It is compounding waste. Every hour you spend on a low-impact task is an hour the high-impact constraint stays unfixed. The constraint keeps bleeding money while you polish things that do not matter yet. Over a month, bad sequencing can cost an account thousands in missed opportunity, not because you lacked skill, but because you applied skill to the wrong thing in the wrong order.

This article gives you the decision framework that sits between diagnosis and execution. You already know [where the problem lives](../theory/The five buckets & hierarchy of constraints.md). You already know [what type of fix to apply](<../theory/Volume vs efficiency (more better new).md>). Now you need to know: which problem, which fix, in what order, and when to wait instead of act.

## The triage room analogy

Think of account management like an emergency department. Patients arrive with different severities. The doctor with twenty patients does not treat them in the order they arrived. They triage: life-threatening first, urgent second, minor third. A broken wrist waits while a cardiac arrest gets the room.

Google Ads accounts work the same way. A broken conversion tag (tracking fires on page load instead of form submit) is your cardiac arrest: every decision you make while it stays broken is based on lies. A mediocre sitelink description is your broken wrist: real, but it can wait. The problem is that most specialists treat every issue like a broken wrist. They work through a tidy checklist, give each item equal attention, and never stop to ask: *"Is this the thing that actually matters right now?"*

This article is your triage protocol. It ensures you treat the cardiac arrest before the broken wrist, every time.

## The impact vs. effort matrix

Every optimization you could make falls into one of four quadrants:

![The impact vs effort matrix: four quadrants for optimization prioritization](images/THEORY_12/01-impact-effort-matrix-v3.png)

Most specialists never actually plot their tasks on this grid. They pick whatever feels most interesting or whatever the client mentioned last, which is the opposite of strategic.

**High impact, low effort: do these immediately:** A Shopping campaign is hemorrhaging spend because product titles do not match search intent on the top 20 products by cost. You open the feed, rewrite twenty titles in thirty minutes, and cut wasted spend by 15% within a week. Or: a lead gen account has zero negative keywords. You pull the search terms report, add forty negatives in ten minutes, and block €400/month of junk traffic. These are the moves that shift metrics disproportionately to the time they take.

**High impact, high effort: plan and schedule as Sprint tasks:** The landing page converts at 1.2% on high-intent exact match terms where the industry baseline is 5-8%. Fixing this means redesigning the page, rewriting the offer, and running an A/B test. That is a two-week project, not a morning task. It becomes the core of your next [Constraint Sprint](../theory/Constraint sprints and focused execution.md).

**Low impact, low effort: batch into maintenance windows:** Cleaning up ad group naming conventions. Adding a fourth sitelink to campaigns that have three. Tweaking a description line two from "Fast shipping" to "Free 2-day shipping". These are fine to do, but they do not move the needle on their own. Bundle them into your weekly maintenance block so they do not eat into Sprint time.

**Low impact, high effort: skip unless you have nothing else to do:** Migrating to a new account structure when the current one is performing fine. Building elaborate automated rules for an account with three campaigns. Writing a custom Looker Studio dashboard when the default Ads dashboard answers every question you actually have. If you find yourself here, you have either run out of real problems (unlikely) or you are avoiding the hard, impactful work (likely).

> 💡 **The productivity trap:** Most people gravitate to "low impact, low effort" because it feels productive. You are in the account, you are clicking things, you are making changes. But stacking ten low-impact tasks does not equal one high-impact task. A specialist who spends Monday morning adding three sitelinks, adjusting two bid modifiers, and writing one new description has been busy. A specialist who spends Monday morning fixing a broken conversion tag has been effective. Do not confuse the two.

## Constraint-driven sequencing

The impact/effort matrix tells you which tasks to prioritize within a bucket. But the [five buckets hierarchy](../theory/The five buckets & hierarchy of constraints.md) tells you which bucket to work on first. The hierarchy always wins.

The order is: Measurement, then Business, then Conversion, then Traffic, then Creative.

This is not a suggestion. It is a **dependency chain**. Each layer depends on the ones above it being functional.

![Constraint-driven sequencing: five bucket hierarchy with stop gates](images/THEORY_12/02-constraint-sequencing-v3.png)

**A Measurement problem invalidates everything downstream:** An e-commerce account shows ROAS of 800%. The team scales budget aggressively. Three months later, a tag audit reveals the conversion tag fires on "add to cart" and on "purchase", double-counting 40% of conversions. Actual ROAS is 480%. Half the scaling decisions were based on phantom performance.

**A Business problem cannot be solved with ad changes:** A B2B account generates 200 leads per month at €45 CPA. The client says it is not working. You dig in and find Lead to SQL% has dropped from 30% to 6% because the sales team changed their qualification criteria and started cherry-picking. No amount of keyword optimization fixes a sales team that ignores 94% of leads.

**A Conversion problem wastes all traffic improvements:** A SaaS account drives 3,000 trial signups per month but Trial to Paid% is 2% (benchmark: 8-15%). Doubling traffic to 6,000 signups would yield 120 paying customers. Fixing Trial to Paid% to 10% on the existing 3,000 signups would yield 300. The conversion fix is worth 2.5x the traffic fix with zero additional spend.

**A Traffic problem undermines creative testing:** Your search terms report shows 60% of clicks come from queries like "free" and "how to" that will never convert. You launch an A/B test on headline angles. The test is meaningless because two-thirds of the traffic seeing both variants has zero purchase intent.

This means: even if you spot a "high impact, low effort" creative fix, you do not make it your [Sprint](../theory/Constraint sprints and focused execution.md) focus while a Measurement or Conversion problem is still red on the [Status Board](../theory/Status board and operating rhythms.md). You can fix it during maintenance, but it is not your primary constraint. The hierarchy is not about ignoring lower buckets. It is about where you commit your focused energy.

## Account maturity determines focus

A brand-new account and an account running for two years need fundamentally different approaches. The optimization moves that are smart at month eight are reckless at month one.

**During Launch, resist the urge to optimize:** You have an e-commerce account that just went live. Shopping campaigns have been running for eight days. CPA looks high. The instinct screams: lower bids, pause underperformers, restructure. Do not touch it. You have eight days of data on products that need 50-100 clicks each to show real conversion patterns. Your job right now is to make sure the system works: tracking fires correctly, pages load, ads are approved, budgets are not wasted on obvious junk. Gather baseline data. That is it.

**During Ramp, focus on making what works work better:** A lead gen account is three months old. You have data. The search terms report shows Campaign A converts at 6% on exact match terms and Campaign B converts at 0.4% on broad match. Fix Campaign B's query mix, improve the landing page for the top-spending ad groups, tighten form fields that cause 40% drop-off. This is Better work. Scaling at this stage means cautiously increasing budget on segments that hit target metrics, not launching Performance Max campaigns.

**During Stable, you earn the right to scale:** You have reliable data, proven segments, and a track record of hitting targets. Now you can run proper Sprints, test new headline angles across your top campaigns, expand into new keyword themes, and start Horizontal scaling with new campaign types or audience segments.

**During Mature, optimize the margins:** The big wins are behind you. A mature account's next 10% improvement comes from compounding small gains: testing landing page variants for 0.5% CVR lift, running incrementality experiments, finding the next growth lever through New initiatives like video campaigns or new market segments.

![Account maturity stages: Launch, Ramp, Stable, Mature](images/THEORY_12/03-account-maturity-v3.png)

The key insight: **premature optimization** at the wrong maturity stage wastes time and corrupts your data. A launch-stage account does not need bid strategy testing. A mature account does not need basic negative keyword cleanup as its Sprint focus. Match your ambition to the account's readiness.

## The "sufficient data" rule

This is the single most violated principle in Google Ads management. Google Ads specialists act on data that is not data yet: it is noise.

Minimum thresholds before making decisions:

| Decision | Minimum data required |
|----------|----------------------|
| Judge keyword conversion potential | 50 clicks (at minimum) |
| Evaluate a bid strategy change | 14-day learning period complete, do not touch during learning |
| Trust Smart Bidding performance | 30-50 conversions in the new state |
| Draw conclusions from an A/B test | 2 weeks minimum runtime |
| Judge CTR reliably | 100+ impressions per variant |
| Evaluate landing page CVR | 200+ sessions (ideally 50+ conversions) |

These are not arbitrary numbers. They are the minimum thresholds where signal starts to separate from noise.

Acting on **insufficient data is worse than not acting at all**. Here is a real scenario: a specialist sees a keyword with 18 clicks and zero conversions. They pause it. That keyword had a 4% historical conversion rate in similar accounts and was six clicks away from its first conversion in this one. By pausing it, they eliminated a future top performer based on a sample size that would not pass a coin-flip test.

When you make a change based on noise, you create a new variable in the system. Now you cannot tell whether the next round of data reflects reality or your premature intervention. You have muddied the water, and every subsequent decision inherits that confusion.

Three practical rules:

1. **Do not pause keywords before 50 clicks:** That keyword with 12 clicks and no conversions might convert on click 15. You do not know yet. Leave it.
2. **Do not judge a bid strategy during learning:** The algorithm is exploring. Performance will look terrible. That is the point. Wait for learning to complete, then evaluate over a full 14-day post-learning window.
3. **Do not call A/B tests early:** A test that is "winning" after 3 days and 47 clicks is not winning. It is fluctuating. Let it run for the planned duration, then evaluate.

> 💡 **The impatience trap:** Clients and managers will pressure you to "do something" when numbers look bad for a few days. Your job is to know when action helps and when it makes things worse. Premature action is not proactive management: it is panic dressed up as diligence.

## Optimization backlog management

A good specialist does not just work on whatever is in front of them. They maintain a ranked list of potential optimizations and work through it systematically.

### Building the backlog

During every account review (weekly or biweekly, per your [operating rhythm](../theory/Status board and operating rhythms.md)), capture every potential optimization you spot. Do not filter yet: just write it down.

"CTR on Campaign Search-NB-Competitor is 1.1% vs 3.8% benchmark on exact match". "LP load time on /pricing is 7.2 seconds on mobile". "No negative keywords added to the Discovery campaign since launch". "Ad Group 'widgets-blue' has 47 keywords and zero impressions on 38 of them".

Each item gets a one-line description and a bucket classification (Measurement, Business, Conversion, Traffic, Creative).

### Scoring each item

Score every backlog item on three dimensions:

**Impact (1-3):** How much will this move the bottleneck metric if it works?
- 3 = directly moves the primary constraint metric (fixing the broken conversion tag when Measurement is the active constraint)
- 2 = indirectly supports the constraint or moves a secondary metric (improving CTR on a campaign that feeds the constrained funnel)
- 1 = nice to have, marginal improvement (adding one more sitelink to a campaign that already has three)

**Confidence (1-3):** How sure are you this will actually work?
- 3 = proven pattern, clear data supports it, you have done it before (adding negative keywords when the search terms report shows 30% junk queries)
- 2 = reasonable hypothesis, some supporting data (testing a new headline angle based on competitor analysis)
- 1 = speculative, worth trying but uncertain (restructuring campaigns based on a theory about how Smart Bidding clusters data)

**Effort (1-3):** How much time and resources does this require?
- 3 = major project, multiple days or external dependencies (landing page redesign requiring dev and design)
- 2 = half-day to full-day task, manageable within a Sprint (writing and launching 5 new RSA variants across 8 ad groups)
- 1 = under an hour, can be done during maintenance (adding 20 negative keywords from the search terms report)

The priority score: **(Impact x Confidence) / Effort**

A task scoring Impact 3, Confidence 3, Effort 1 gets a 9.0. That is your "do it now" task. A task scoring Impact 1, Confidence 1, Effort 3 gets a 0.11. That is your "probably never" task.

![Priority scoring formula: Impact times Confidence divided by Effort](images/THEORY_12/04-scoring-formula-v3.png)

### From backlog to Sprint

Take the top 3 scored items that belong to the same bucket as your [active constraint](../theory/One constraint, everything else is noise.md). These become your Sprint focus. Everything else stays on the backlog.

Review and re-score the backlog monthly. Priorities shift as metrics change. The item that was Impact 1 last month might be Impact 3 now because you resolved a higher-priority constraint and exposed a new bottleneck underneath it.

### Connection to Sprint methodology

This backlog feeds directly into [Constraint Sprint planning](../theory/Constraint sprints and focused execution.md). The Sprint planning step "select 1 to 3 Playbooks" becomes: pull the top-scored items from the backlog that align with the active constraint, match them to Playbooks, and execute.

[One constraint at a time](../theory/One constraint, everything else is noise.md). One Sprint at a time. The backlog ensures nothing gets lost, but discipline ensures you do not try to do everything at once.

## Monday morning: a decision walkthrough

Theory is clean. Reality is messy. Here is what the prioritization framework looks like when you actually use it.

It is Monday morning. You manage three accounts. Here is what is on your screen:

**Account A (e-commerce, mature):** Shopping ROAS dropped 15% last week. CTR on top campaigns is flat. Mobile landing page load time spiked to 6.8 seconds after a site update on Friday. Before the update, mobile load time was 2.1 seconds.

**Account B (B2B lead gen, ramp stage):** Lead volume is on target at 180/month but Lead to SQL% dropped from 22% to 9% over the past month. The client mentioned in Friday's call that they replaced two of three sales reps two weeks ago.

**Account C (SaaS, stable):** Everything looks fine except Lost IS (Budget) on the best-performing campaign hit 45%. The client approved a 30% budget increase last Thursday but you have not implemented it yet.

Where do you start? Walk through the decision process:

### Step 1️⃣: Scan for emergencies (Remove tasks)

Account A's mobile load time spike is a red flag. A page that went from 2.1 to 6.8 seconds is not "slow": it is potentially broken. If the Friday site update introduced an uncompressed image, a broken script, or a redirect loop, mobile users are bouncing before the page renders. That is a Conversion bucket issue and it is a Remove task (something that worked is now broken). Check it first.

You load the page on your phone. It takes 7 seconds to render. A hero image that was 120KB is now 4.2MB. The dev team pushed an unoptimized asset. You flag it to the client with a screenshot and the specific file. Resolution depends on them, but you have identified and escalated in five minutes.

### Step 2️⃣: Check the hierarchy for each account

**Account A:** With the page issue flagged, is there anything upstream? Measurement looks clean (tracking verified last week). Business metrics are stable (margins, AOV unchanged). The ROAS drop is likely a direct result of the page speed issue killing mobile conversions. The Conversion bucket is the constraint. The load time fix is the Sprint-worthy task. Everything else in Account A waits.

**Account B:** Lead to SQL% crashed from 22% to 9%. The client changed their sales team. This is a Business bucket constraint. New reps are either not following up fast enough, not qualifying properly, or both. No Google Ads change will fix this. Your move: document the correlation (Lead to SQL% drop coincides with sales team change), present it to the client with specific data (response time, follow-up cadence if available), and recommend they address sales onboarding before you adjust campaign targeting or volume. This goes into your weekly diagnosis session as a Sprint planning candidate, but the action item is a client conversation, not an account change.

**Account C:** Lost IS (Budget) at 45% on a proven campaign with an approved budget increase. This is a Traffic bucket constraint with a clear solution. The campaign has a track record, the budget is approved, and the execution is straightforward: increase budget in 20% steps over the next week, monitor CPA and ROAS daily to confirm efficiency holds.

### Step 3️⃣: Sequence and execute

**Priority order:** A (urgent fix, escalate immediately), C (quick execution, implement the budget increase in steps), B (Sprint planning, prepare the client conversation for the weekly call).

**Total time to triage all three accounts:** 15 minutes.

**Total time to resolve A (escalation) and C (budget adjustment):** 25 minutes.

**Account B** goes into the weekly diagnosis session for proper Sprint planning. You do not touch the campaigns. The constraint is not in Google Ads.

By 9:45 AM, you have handled the urgent issues, executed the easy win, and correctly identified the one problem that requires a conversation instead of a campaign change. The rest of the day is Sprint work on your active constraints, not reactive firefighting.

That is what disciplined sequencing looks like in practice.

![Monday morning triage sequence: six-step decision flow](images/THEORY_12/05-triage-sequence-v3.png)

## Putting it all together

When you sit down with an account that has multiple issues, your decision sequence is:

1. **Scan for emergencies:** Is anything broken that was working before? Broken tracking, broken pages, disapproved ads. Fix or escalate immediately.
2. **Run the hierarchy:** Which bucket has the highest-priority problem? (Measurement > Business > Conversion > Traffic > Creative)
3. **Within that bucket, list all potential fixes:** Pull from your backlog or generate new items during review.
4. **Score each fix:** Impact x Confidence / Effort.
5. **Check data sufficiency:** Do you have enough data to act on the top items? If not, wait.
6. **Check account maturity:** Is this account ready for this type of optimization?
7. **Top 3 become your Sprint:** Execute with focus, measure the result, then re-evaluate.

This process is not complicated. Doing it consistently, resisting the urge to skip steps or chase shiny objects, is what separates structured operators from account jockeys who "check in" on campaigns and hope something improves.

The specialist who triages fifteen problems across three accounts in fifteen minutes and **works on the right one all day** will outperform the specialist who spends eight hours making changes to all three accounts with no clear priority. Every single time.

## Implementation checklist

For each account you manage, you should be able to:

- [ ] Maintain a living optimization backlog with scored items (Impact x Confidence / Effort)
- [ ] Confirm that your current Sprint target respects the [five buckets hierarchy](../theory/The five buckets & hierarchy of constraints.md): no downstream Sprint while upstream is red
- [ ] State the account's maturity stage and confirm your optimization approach matches it
- [ ] Point to the data thresholds you are using before making each decision (clicks, conversions, time)
- [ ] Show that your top 3 Sprint items are the highest-scored items in the active constraint's bucket
- [ ] Review and re-score the backlog at least monthly
- [ ] Distinguish between "this feels urgent" and "this is actually the highest-priority constraint" before acting

## Related Documents

- [No goal, no bottleneck](../theory/No goal, no bottleneck.md)
- [The five buckets & hierarchy of constraints](../theory/The five buckets & hierarchy of constraints.md)
- [Diagnostic engine: Symptom to Constraint to Solution](<../theory/Diagnostic engine Symptom → Constraint → Solution.md>)
- [Status board and operating rhythms](../theory/Status board and operating rhythms.md)
- [One constraint, everything else is noise](../theory/One constraint, everything else is noise.md)
- [Systems thinking & bottleneck analysis](../theory/Systems thinking & bottleneck analysis.md)
- [Volume vs efficiency (more better new)](<../theory/Volume vs efficiency (more better new).md>)
- [Constraint sprints and focused execution](../theory/Constraint sprints and focused execution.md)
- [Optimization Cadence Mental Model](../mental-models/Optimization Cadence Mental Model.md)

## Terms

| Term | Definition |
|------|-----------|
| Impact/effort matrix | A 2x2 grid classifying optimizations by expected impact (high/low) and required effort (high/low) to determine execution priority |
| Constraint-driven sequencing | The principle that the five buckets hierarchy (Measurement > Business > Conversion > Traffic > Creative) overrides personal preference when choosing what to work on |
| Account maturity stage | One of four phases (Launch, Ramp, Stable, Mature) that determines which types of optimization are appropriate |
| Sufficient data threshold | The minimum number of events (clicks, conversions, days) required before acting on a metric |
| Optimization backlog | A scored, ranked list of all potential optimizations for an account, maintained and re-evaluated monthly |
| Priority score | Impact (1-3) x Confidence (1-3) / Effort (1-3), used to rank backlog items for Sprint inclusion |
| Triage | The process of scanning all issues across accounts, classifying severity, and determining execution order before making any changes |
