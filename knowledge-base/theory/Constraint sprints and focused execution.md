# Constraint sprints and focused execution
Created: 2026-02-04
Updated: 2026-02-14

Support_ID: THEORY_8
Status: Done
Category: Operational
Reference Type: Theory
Agent_Readable: No
Human_Facing: Yes
Domain: Foundations
Pillar: 0

## Purpose

This article defines the Constraint Sprint: a time-boxed cycle where you commit to removing one active bottleneck for a specific account by running a small set of Playbooks. It covers planning, execution, evaluation, the "let the dust settle" principle, Sprint retrospectives, and the five things that most commonly derail Sprints.

## What this is NOT

- Not an SOP with step-by-step execution instructions
- Not a project management methodology (no Scrum ceremonies, no standups)
- Not a testing framework (Sprints are constraint-focused, not experiment-focused)

## Introduction

A B2B SaaS Google Ads specialist opens their task list on Monday morning. Adjust bids on Campaign A. Test three new headline variants. Rebuild the landing page footer. Add negative keywords from last week's search terms report. Research new audience segments. Launch a Display remarketing experiment. Nothing on the list connects to the single thing actually holding the account back: a 4% landing page conversion rate that makes every click unprofitable.

This is what unfocused optimization looks like. Twelve hours of effort, zero impact on the bottleneck, and a status report that reads "lots of activity" while the account bleeds money.

Everything in the Google Ads Scaling OS leads to this moment. You have a [goal and a bottleneck](../theory/No goal, no bottleneck.md). You know which of the [five buckets](../theory/The five buckets & hierarchy of constraints.md) it lives in. The [Diagnostic Engine](<../theory/Diagnostic engine Symptom → Constraint → Solution.md>) gave you a Solution Pattern. You understand why [one constraint gets all your attention](../theory/One constraint, everything else is noise.md).

Now you need a structure that turns all of that into focused action. That structure is the Constraint Sprint.

## The repair crew analogy

Think of your account like a building with a burst pipe on the third floor. Water is flooding one floor, threatening to damage the rest. A maintenance crew that shows up and repaints the lobby, replaces lightbulbs in the stairwell, and polishes the elevator doors is doing real work. Visible work. Work they can report on. But the pipe is still gushing.

A repair crew does one thing: fix the pipe. They isolate the problem, bring the right tools, stop the water, then verify the fix holds before moving to the next issue.

A **Constraint Sprint** turns you from a maintenance crew into a repair crew. You identify the one thing flooding the account, fix it with focused effort, confirm the fix held, and only then move to the next problem.

![Repair crew vs maintenance crew: why focused execution beats busy work](images/THEORY_8/01-repair-vs-maintenance-v3.png)

## What is a Constraint Sprint?

A Constraint Sprint is a time-boxed period (1 to 4 weeks) where you commit to removing one active Constraint for a specific account by running 1 to 3 Playbooks.

The key characteristics:

- **One primary Constraint** per account per Sprint
- **Scoped to 1-3 Playbooks**, not 12 unrelated ideas
- **Tied to one primary metric** on the [Status Board](../theory/Status board and operating rhythms.md)
- **Clear start/end date**, a logged baseline, and a standardized review

What it is not: a permission slip to shove all experiments into a two-week box, a wrapper for "whatever we end up doing", or an excuse to chase ideas that are not tied to the Constraint.

## Choosing Sprint length

You cannot declare a Sprint "done" if you have not seen enough data to judge the effect. Sprint length depends on how many events you get per week at the node you are targeting.
| Volume tier | Events/week | Sprint length | Example |
|-------------|-------------|---------------|---------|
| High | 50+ | 1 week | Large e-commerce account with hundreds of purchases per week |
| Medium | 10-50 | 2 weeks | B2B Lead Gen with 20-60 leads per week |
| Low | Under 10 | 3-4 weeks | High-ticket B2B with a handful of SQLs per month |

> 💡 **Shortest viable window:** Pick the shortest Sprint length that realistically allows you to see meaningful change in the bottleneck metric, given its current volume.

## Planning a Constraint Sprint

Sprint planning turns diagnosis into a scoped plan. Five steps, in order:

**1️⃣ Confirm the Constraint:** From your weekly diagnosis, verify which Constraint (bucket + metric + Symptom Pattern) is active. Walk the [hierarchy](../theory/The five buckets & hierarchy of constraints.md): Measurement and Business must be clear before you Sprint on Traffic or Conversion. If Business is on fire, you do not Sprint on keyword bids.

**2️⃣ Choose the Solution Pattern:** Decide how you will attack the Constraint: run the Remove pre-check (is anything broken?), classify it as Volume vs Efficiency, and make the [More / Better / New](<../theory/Volume vs efficiency (more better new).md>) choice.

**3️⃣ Select 1-3 Playbooks:** Choose Playbooks that are impactful enough to move the bottleneck metric and feasible within the Sprint length. Resist the urge to do everything.

**4️⃣ Define baseline and success criteria:** Record the baseline value and the target band. Link this to the Status Board metric the Sprint is meant to move.

**5️⃣ Create tasks and assign them:** For each Playbook, break it into concrete tasks with an owner, due dates within the Sprint, and links back to the Playbook and Constraint.

### Good vs bad Sprint plans

Here is a bad Sprint plan:

*"Improve Search campaign performance. Tasks: test new ads, add negatives, adjust bids, try new audiences, rebuild landing page"*.

Why it fails: no single constraint identified, no specific metric named, five unrelated tasks spanning multiple buckets, no baseline recorded, no success criteria defined. This is a to-do list disguised as a plan.

Here is a good Sprint plan:

"Constraint: Landing Page CVR (Business bucket, currently 1.2%, target 3-5%). Solution: Better. Playbooks: (1) Rewrite hero section to match top search intent, (2) Reduce form from 8 fields to 4. Baseline: 1.2% LP CVR trailing 30d. Success: 2.5%+ sustained over 14 days. Sprint length: 2 weeks".

Why it works: single metric, specific constraint with its bucket, two focused playbooks that both target the same bottleneck, clear baseline and target, defined Sprint duration.

Another good Sprint plan for an e-commerce account:

"Constraint: ROAS on non-brand Search (Conversion bucket, currently 280%, target 400%+). Solution: Better. Playbooks: (1) Restructure ad groups to improve relevance for top-10 product categories, (2) Rewrite RSAs to match high-intent commercial queries. Baseline: 280% ROAS trailing 14d on non-brand Search. Success: 380%+ sustained over 7 days. Sprint length: 1 week (high volume, 200+ purchases/week)".

The difference between these plans is not complexity. It is **clarity**. One Constraint, the right Playbooks, a number to beat.

![Anatomy of a Constraint Sprint: three phases from planning to evaluation](images/THEORY_8/02-sprint-anatomy-v3.png)

## Running the Sprint day-to-day

Once the Sprint starts, the rules are simple.

**Execute the plan, do not rewrite it:** Complete the tasks tied to the chosen Playbooks and the active Constraint. You can fix urgent Remove issues (broken tracking, broken forms) as they surface. You can adjust small details inside Playbooks if you learn something. You do not add new Playbooks or random experiments mid-Sprint.

**Use the [Status Board](../theory/Status board and operating rhythms.md) for monitoring, not overreacting:** Watch the target metric with the appropriate window (14 to 30 days). Note trends, but do not call the Sprint early or late based on 1-2 noisy days.

**Keep a change log:** For each meaningful change (landing page update, structure change, sales process tweak), log what changed, when, and why. This is the only way to interpret metric movements when you evaluate the Sprint.

## Evaluating a Sprint: four outcomes

At the end of a Sprint, you classify the outcome into one of four categories.

**Resolved:** The bottleneck metric moved into the "good enough" band and is stable. The Status Board for that metric shifts from red to orange or green. When you walk the metric tree, another node now looks worse. Action: mark the Constraint as Resolved and choose a new one for the next Sprint.

**Partially Resolved:** The metric clearly improved but not enough to leave the "bottleneck" role. Example: Lead-to-SQL% went from 6% to 12%, but the target band is 25-30%. Action: commit a second Sprint on the same Constraint with refined Playbooks, or accept the partial improvement and switch if another bottleneck is now clearly worse. This is a case-by-case call.

**Inconclusive:** Not enough events at the node, or seasonality, external events, or large changes elsewhere made the signal too noisy. Action: extend the Sprint for more data, or pause and re-evaluate when you have enough signal. Do not treat thin data as a definitive result.

**Misdiagnosed:** You ran the Playbooks but the metric barely moved, and other tree nodes suggest you picked the wrong Constraint or wrong lever. Action: mark the Constraint as Misdiagnosed, update your Symptom-to-Solution mapping with this learning, and use the next weekly diagnosis from the [Diagnostic Engine](<../theory/Diagnostic engine Symptom → Constraint → Solution.md>) to pick better.

![Four Sprint outcomes: Resolved, Partially Resolved, Inconclusive, Misdiagnosed](images/THEORY_8/03-sprint-outcomes-v3.png)

### "Enough data" guardrails

We are not running formal statistics, but some guardrails help:

- For a conversion step you are optimizing, aim for at least 20-30 conversions in the new state before drawing strong conclusions
- Compare against typical variation in the baseline period
- For CAC, CPQL, or ROAS, look at blended 30-day windows, not 3-day spikes
- Ask: "Is the change bigger than the usual month-to-month noise?"

If you are far from these numbers (e.g. 3 conversions in 2 weeks), treat the Sprint as exploratory and Inconclusive, not definitive.

## Sprint retrospective: three questions

At the end of every Sprint, answer three questions:

1. **What was the constraint, and did we correctly identify it?** If the Playbooks you ran did not move the metric, the constraint may have been elsewhere. Name the bucket, the metric, and whether your diagnosis held up.
2. **Did the metric move enough to change its status on the Status Board?** A number, not a feeling. *"LP CVR went from 1.2% to 2.8% over 14 days"* is an answer. *"I think it got better"* is not.
3. **What is the next constraint based on current data?** Walk the [five buckets](../theory/The five buckets & hierarchy of constraints.md) again with fresh numbers. The answer might be the same constraint (Partially Resolved), a new constraint revealed by the improvement, or a return to [systems-level diagnosis](../theory/Systems thinking & bottleneck analysis.md).

This is not a ceremony. It is three sentences in your Sprint log that force honest evaluation. A Lead Gen specialist after a 2-week Sprint might write: "Constraint was LP CVR at 1.2% (Business bucket). Moved to 2.9%, Status Board shifted from red to orange. Next constraint: lead quality, Sales reports 40% of leads are unqualified, moving to Business bucket, targeting Lead-to-SQL%".

That is the entire retrospective. Three sentences, three minutes, and you know exactly what to do next.

## Let the dust settle

After completing a Sprint that changed something meaningful, do not immediately start the next major change. This is one of the hardest disciplines in account management, because the instinct is always to keep moving.

Here is why it matters:

- **Smart Bidding recalibration:** After structural changes (new campaigns, new conversion actions, budget shifts), automated bidding needs 1-2 weeks to recalibrate. Changes made during this window produce unreliable data.
- **Conversion lag:** Conversion data takes days to finalize. For longer sales cycles (B2B, high-ticket), downstream metrics like SQL rate or close rate take weeks to reflect changes.
- **Behavioral stabilization:** A new landing page, a new offer, or a new form length changes user behavior. The first wave of data includes curiosity clicks and novelty effects. Stable performance takes 2-4 weeks to emerge.

The rule: **hold for at least one Sprint duration** after resolving a Constraint before starting the next major change. A 2-week Sprint that resolved a Constraint gets a 2-week hold period before you launch the next Sprint on a different bucket.

Use the hold period productively:

- Gather clean baseline data for the next constraint
- Update the Status Board with stabilized metrics
- Run your [diagnostic rhythm](../theory/Status board and operating rhythms.md) to confirm the next constraint
- Handle maintenance tasks (negatives, search terms, routine checks)

An e-commerce account resolves a ROAS constraint by restructuring campaigns. ROAS jumps from 280% to 420% in week one. The manager, excited, immediately launches a new audience expansion Sprint. Smart Bidding destabilizes from two simultaneous changes. ROAS crashes to 200%. Both changes are now impossible to evaluate independently. The "let the dust settle" principle would have prevented this: hold for one Sprint duration, confirm ROAS stabilizes at 400%+, then start the audience Sprint with a clean baseline.

## Sprint killers: five things that derail Sprints

Knowing what a good Sprint looks like is not enough. You need to recognize the patterns that destroy them.

**1️⃣ Scope creep:** "While we're at it, let's also test new audiences and rebuild the feed". Every addition dilutes focus. One constraint, 1-3 Playbooks, nothing else. If the new idea is genuinely important, it becomes the next Sprint, not a footnote on this one.

**2️⃣ Premature evaluation:** Calling results after 3 days of data. A manager sees a 50% improvement in day-three metrics and declares victory, or sees a dip and panics. Neither response is justified. Wait for the volume guardrails: 20-30 conversions minimum, measured against baseline variation. Three days of data is noise, not signal.

**3️⃣ External disruption:** The client launches a flash sale mid-Sprint. A website redesign goes live on day four. A competitor enters the auction with aggressive bids. These events contaminate your data. When they happen, acknowledge the disruption, extend the Sprint, or mark it Inconclusive and restart with a clean window. Do not pretend the data is still valid.

**4️⃣ Comfort zone retreat:** The Constraint is in Business (sales team is not following up on leads within 24 hours) but you spend the Sprint on Traffic (adding negative keywords and testing new ad copy). This happens constantly. The real constraint requires an uncomfortable conversation with the client about their sales process, so you retreat to the bucket you control. The Sprint looks productive but the bottleneck does not move.

**5️⃣ No baseline:** If you did not record the starting metric, you cannot measure progress. "I think it got better" is the hallmark of undisciplined optimization. Without a baseline, every Sprint ends in ambiguity, and you never know whether your work actually moved the needle.

![Five Sprint killers: scope creep, premature evaluation, external disruption, comfort zone retreat, no baseline](images/THEORY_8/04-sprint-killers-v3.png)

## Handling low-volume accounts

Low-volume accounts are where Google Ads specialists most often abandon discipline and revert to gut feel. The constraint-driven approach still applies, but you adjust expectations.

Use longer Sprints (3 to 4 weeks). Focus on bigger levers: offer changes, funnel changes, sales process improvements, things that create visible changes even on small numbers. Be explicit that Sprint outcomes will often be Partial or Inconclusive, and rely more on qualitative signals (sales feedback on lead quality, client reports on inquiry patterns) alongside the few metrics you have.

A high-ticket B2B account generating 6 leads per month cannot produce statistically meaningful data in any Sprint length. But you can still observe: did the sales team report higher-quality conversations? Did the ratio of booked demos to form fills change noticeably? Did the client independently mention better leads? These qualitative signals, combined with directional quantitative movement, are enough to classify the Sprint outcome.

You still keep one active Constraint per account, log Playbooks and changes, and use best available data plus judgment rather than random thrashing.

## Multi-account and team focus

For individuals managing multiple accounts, each account has one active Constraint per Sprint, and each person should have a limited number of Sprint commitments at any time. As a specialist, 2 to 4 meaningfully scoped Sprints across accounts is usually the limit for good focus. More than that and you are time-slicing too thin for any Sprint to get the attention it needs.

The principle from [One constraint, everything else is noise](../theory/One constraint, everything else is noise.md) scales to your personal workload: outside maintenance, time spent on tasks that are not tied to an active Sprint is distraction. Your Sprint log across accounts should fit on one screen. If it does not, you have too many active Sprints.

## The compound effect

A single Sprint is just one improvement cycle. The power is in compounding.

An account runs 26 two-week Sprints in a year. Even if only half of them produce a Resolved or Partially Resolved outcome, that is 13 real bottleneck improvements in 12 months. Each improvement raises the ceiling for the next. LP CVR improves, which makes Traffic spend more efficient, which increases volume, which gives Smart Bidding more data, which improves CPA, which unlocks budget for scaling.

This is what [systems thinking](../theory/Systems thinking & bottleneck analysis.md) looks like in practice: not one heroic optimization, but a **relentless cycle** of identifying the weakest link, strengthening it, and moving to the next one.

Accounts that run constraint-driven Sprints for six months do not just perform better. They perform better at an accelerating rate, because every resolved constraint unblocks the system for the next improvement.

![The compound effect: 26 Sprints per year with cumulative improvement](images/THEORY_8/05-compound-sprints-v3.png)

## Implementation checklist

For each major account, you should be able to confirm:

- [ ] The current Sprint is focused on one Constraint (bucket + metric), documented with baseline and target
- [ ] 1-3 Playbooks are selected, with tasks assigned and due dates within the Sprint window
- [ ] The Sprint length matches the account's volume tier
- [ ] A change log tracks every meaningful change made during the Sprint
- [ ] At Sprint end, the outcome is classified: Resolved, Partially Resolved, Inconclusive, or Misdiagnosed
- [ ] A three-question retrospective is completed and logged
- [ ] A hold period follows any Resolved Sprint before the next major change begins
- [ ] Active Sprint commitments per specialist stay at 2-4 maximum

## Related Documents

- [No goal, no bottleneck](../theory/No goal, no bottleneck.md)
- [The five buckets & hierarchy of constraints](../theory/The five buckets & hierarchy of constraints.md)
- [Diagnostic engine Symptom to Constraint to Solution](<../theory/Diagnostic engine Symptom → Constraint → Solution.md>)
- [Status board and operating rhythms](../theory/Status board and operating rhythms.md)
- [One constraint, everything else is noise](../theory/One constraint, everything else is noise.md)
- [Systems thinking & bottleneck analysis](../theory/Systems thinking & bottleneck analysis.md)
- [Volume vs efficiency (more better new)](<../theory/Volume vs efficiency (more better new).md>)

## Terms

| Term | Definition |
|------|-----------|
| Constraint Sprint | Time-boxed period (1 to 4 weeks) focused on removing one active bottleneck via 1 to 3 Playbooks |
| Volume tier | Classification (High/Medium/Low) based on weekly conversion events at the constrained step |
| Sprint outcome | One of four classifications: Resolved, Partially Resolved, Inconclusive, Misdiagnosed |
| Sprint retrospective | Three-question evaluation at Sprint end: correct constraint, metric movement, next constraint |
| Hold period | Waiting time after a Resolved Sprint before starting the next major change, equal to at least one Sprint duration |
| Sprint killer | Common pattern that derails Sprint execution: scope creep, premature evaluation, external disruption, comfort zone retreat, no baseline |
| Change log | Record of every meaningful change made during a Sprint, with what, when, and why |