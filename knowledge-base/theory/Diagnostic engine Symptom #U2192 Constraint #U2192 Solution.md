# Diagnostic engine: Symptom to Constraint to Solution to Playbook
Created: 2026-02-04
Updated: 2026-02-14

Support_ID: THEORY_6
Status: Done
Category: Operational
Reference Type: Theory
Agent_Readable: No
Human_Facing: Yes
Domain: Foundations
Pillar: 0

## Purpose

Defines the four-object diagnostic loop (Symptom Pattern, Constraint, Solution Pattern, Playbook) and the repeatable process for going from "something looks off" to a focused Sprint with concrete tasks. This is the engine that turns observation into action.

## What this is NOT

- Not a list of specific symptoms or solutions (those live in your Symptom and Solution Pattern libraries)
- Not a Sprint management guide: it covers diagnosis and routing, not task execution
- Not a replacement for the five buckets hierarchy: bucket classification happens before this engine runs

## Introduction

A Google Ads specialist notices CPA rising on a key campaign. They react: pause low-performing keywords, write new ad copy, lower the tROAS target. CPA keeps rising. Three weeks later they discover the conversion tag was misconfigured during a website update. Every "optimization" they made was based on phantom data. The keywords they paused were profitable. The ad copy they replaced was fine. Three weeks of skilled work made the account worse, not better.

This is what happens when you skip diagnosis and jump to solutions. The symptom (rising CPA) was real. The constraint (broken tracking) was invisible because no one asked "why is CPA rising?" before asking "how do I fix CPA?" Symptoms describe what the data looks like. Constraints describe what is actually wrong. They are not the same thing, and confusing them is the most expensive mistake in account management.

The **Diagnostic Engine** exists to force a pause between *"something looks off"* and *"let me change something"*. That pause is where real diagnosis happens.

## The four objects

The engine runs on four types of reusable patterns, used in order:

**1️⃣ Symptom Pattern:** A recurring description of what the data looks like when a specific type of problem is present. Not a diagnosis, just a fingerprint. Examples: "CPL up 40%, CPQL flat, SQLs stable". "High ROAS, profit down". "Good LP CVR, terrible Lead to SQL%".

**2️⃣ Constraint:** A specific symptom, in a specific account, right now, chosen as the bottleneck you commit to fixing. The Constraint is where you enforce [one bottleneck at a time](../theory/One constraint, everything else is noise.md) and respect the [five buckets hierarchy](../theory/The five buckets & hierarchy of constraints.md).

**3️⃣ Solution Pattern:** A reusable strategy for removing a certain type of bottleneck, tagged by bucket and growth lever. Not a random idea: a structured approach that has worked for this type of constraint before.

**4️⃣ Playbook:** The atomic, step-by-step recipe that implements part of a Solution Pattern in a single Sprint. This is where strategy becomes tasks.

Think of them as levels of zoom: **Symptom Pattern** is what we see. **Constraint** is where we focus. **Solution Pattern** is how we intend to fix it. **Playbook** is what we do this week.

![The Diagnostic Engine: four objects from observation to action](images/THEORY_6/01-diagnostic-flow-v3.png)

## The full diagnostic flow

### Step 1️⃣: Status Board flags a problem

You review the [Status Board](../theory/Status board and operating rhythms.md) during daily triage or weekly diagnosis. One or more metrics are red or drifting. This is the trigger. Do not react yet. Observe.

### Step 2️⃣: Name the Symptom Pattern

Translate raw numbers into a named pattern. *"CPL up, CPQL flat, SQLs stable"* is more useful than *"CPL went from 38 to 52"*. A named pattern matches to a library of known causes and solutions. It also forces you to look at multiple metrics together rather than fixating on one.

### Step 3️⃣: Identify the Constraint

From the Symptom Pattern, ask three questions:

1. Which [bucket](../theory/The five buckets & hierarchy of constraints.md) does this belong to? Check the hierarchy from the top.
2. Which metric in the [goal equation](../theory/No goal, no bottleneck.md) is this symptom pointing to?
3. Is this the binding constraint (the one that, if fixed, would most increase output)?

Create a Constraint entry: account, bucket, bottleneck metric, evidence, and why you believe this is the binding constraint. Everything else goes to the [Constraint Backlog](../theory/One constraint, everything else is noise.md).

### Step 4️⃣: Choose a Solution Pattern

With the Constraint identified:

1. Run the [Remove pre-check](<../theory/Volume vs efficiency (more better new).md>): is anything obviously broken? Fix it before optimizing.
2. Classify: is this primarily a [volume or efficiency bottleneck](<../theory/Volume vs efficiency (more better new).md>)?
3. Choose a Solution Pattern that matches the bucket, bottleneck type, and vertical.

### Step 5️⃣: Execute via Playbooks

The Solution Pattern tells you what kind of work to do. The Playbooks tell you what exactly to click, build, or change. Pick 1-3 Playbooks for the Sprint. These spawn tasks.

### Step 6️⃣: Review

At the end of the Sprint, re-check the Status Board metrics linked to the Constraint. Decide:

- **Resolved:** the constraint moved. The bottleneck metric improved to "good enough". Time to find the next constraint.
- **Partial:** the metric improved but is still the binding constraint. Continue or adjust the approach.
- **Inconclusive:** not enough data yet. Extend the Sprint.
- **Misdiagnosed:** the metric did not move despite executing well. The symptom was pointing to the wrong constraint. Re-diagnose.

Update the Constraint status and document what you learned. Your pattern libraries get smarter with each cycle.

## The 5-minute diagnosis

When time is short (daily triage, mid-meeting, quick account check), use this compressed version:

1. **What metric moved?** Look at the Status Board. One number is off.
2. **Which direction and by how much?** Is this a 10% drift or a 50% crash? Magnitude determines urgency.
3. **What else moved at the same time?** Check correlated metrics. CPA up but CVR flat means the cost of traffic changed, not the conversion rate. CPA up and CVR down means the landing page or offer broke something.
4. **Where in the hierarchy?** Is Measurement trustworthy? Is Business stable? Walk down until you hit the mismatch.
5. **Does this match a known Symptom Pattern?** If yes, you have a shortcut to the Constraint and Solution. If no, flag it for deeper diagnosis in the weekly session.

Five questions. Five minutes. Not a replacement for the full engine, but enough to avoid knee-jerk reactions during daily triage.

![The 5-minute diagnosis: five questions to avoid knee-jerk reactions](images/THEORY_6/03-five-minute-diagnosis-v3.png)

## Funnel-walking: the intuitive diagnostic entry point

When you are not sure where to start, walk the funnel from the top.

Start at the business outcome (Revenue, Profit, Deals) and work downward through the [metric tree](../theory/No goal, no bottleneck.md). At each node, compare actual vs target. The first node where reality diverges significantly from requirement is your starting point for the Symptom Pattern.

Example: Revenue is short. Deals are short. Win rate is fine. SQLs are short. Leads are fine. LP CVR is fine. Clicks are fine. Impressions are fine. The divergence is at Leads-to-SQLs: plenty of leads, not enough become SQLs. That is a Business bucket issue (lead quality or sales process). The Symptom Pattern might be "Good LP CVR, terrible Lead to SQL%".

Funnel-walking prevents the most common diagnostic error: starting with whatever metric the Google Ads interface puts in front of you. Google surfaces CTR, CPC, and Impression Share because those are platform metrics. The actual constraint is often at a funnel stage that Google Ads does not even display. Walking the funnel forces you to check business metrics before campaign metrics.

![Funnel-walking: start at revenue, walk down to find the break](images/THEORY_6/02-funnel-walking-v3.png)

## Three misdiagnosis patterns

Even experienced Google Ads specialists get it wrong. Here are the three most common misdiagnosis patterns.

### 1. Treating a symptom as a constraint

CPA is rising. You "fix" CPA by lowering tROAS, pausing expensive keywords, and tightening audiences. CPA drops. So does volume. Revenue falls. You treated the symptom (high CPA) as if it were the constraint, when the actual constraint was broken tracking, changed auction dynamics, or a seasonal shift in conversion rate.

**CPA is not a constraint:** It is a ratio. It rises when something in the numerator (cost) or denominator (conversions) changes. Your job is to find which one changed and why, not to "fix CPA" directly.

### 2. Confusing correlation with causation

You changed the bid strategy and CPA improved in the same week. Conclusion: the bid strategy change worked. But you also happened to hit a holiday weekend where conversion rates naturally spike. Or the tracking lag meant conversions from two weeks ago finally attributed. Or a competitor's budget ran out.

The cure: never attribute results to a single change during periods when multiple variables shifted. Hold for clean data. Compare to a control where possible. Be suspicious of wins that happen too fast.

### 3. Anchoring to the comfortable bucket

You are a media buyer. Traffic and Creative are your domain. When performance drops, you diagnose Traffic or Creative problems because those are the ones you know how to fix. Meanwhile, the actual constraint is in the Business bucket (sales process) or the Conversion bucket (landing page UX), which are outside your comfort zone.

The cure: always walk the hierarchy from the top. Start with Measurement, then Business, then Conversion, then Traffic, then Creative. **The hierarchy overrides your instinct.**

![Three misdiagnosis patterns and their cures](images/THEORY_6/04-misdiagnosis-patterns-v3.png)

## Being wrong well

Misdiagnosis is not failure. It is data. A Sprint that resolves the constraint validates your diagnosis. A Sprint where the metric does not move despite good execution tells you the diagnosis was wrong. Both are valuable.

![The hypothesis loop: scientific method for Google Ads](images/THEORY_6/05-hypothesis-loop-v3.png)

The dangerous response to misdiagnosis is not "I was wrong" (that is healthy). The dangerous response is one of three things:

- **Denial:** *"It must be working, we just need more time"*. Sometimes true, often self-deception. Set a clear decision point before the Sprint starts.
- **Blame:** *"The algorithm is broken"*. Maybe. But have you checked every other explanation first?
- **Abandonment:** *"This approach does not work, let me try something completely different"*. Changing the whole approach after one Sprint is just as destructive as never changing. Iterate, do not oscillate.

When a Sprint does not move the metric:

1. Check execution quality first. Did you actually do what you planned?
2. Check data sufficiency. Did you have enough volume and time for the result to be meaningful?
3. If execution was clean and data is sufficient: the diagnosis was wrong. Return to Step 2 of the diagnostic flow and look for a different Symptom Pattern or a different constraint.

Document what you learned. *"Tested hypothesis X, result was Y, concluding Z"*. Over time, your misdiagnosis rate drops because your pattern library improves.

> 💡 **Key principle:** The diagnostic engine is the scientific method applied to Google Ads. Hypothesis (Constraint), experiment (Sprint), conclusion (Review), next hypothesis. The quality of your diagnosis improves with each cycle. Being wrong once is learning. Being wrong and not updating your model is stubbornness.

## Implementation checklist

- [ ] When a Status Board metric turns red: name the Symptom Pattern before taking any action
- [ ] Match the Symptom Pattern to a bucket using the hierarchy (Measurement first)
- [ ] Create a Constraint entry with account, bucket, metric, evidence, and rationale
- [ ] Choose a Solution Pattern that matches the bucket and bottleneck type
- [ ] Execute via 1-3 Playbooks in a single Sprint
- [ ] Review at Sprint end: Resolved, Partial, Inconclusive, or Misdiagnosed
- [ ] Document the outcome on the Symptom Pattern and Solution Pattern so the library improves

## Related Documents

- [The five buckets & hierarchy of constraints](../theory/The five buckets & hierarchy of constraints.md)
- [One constraint, everything else is noise](../theory/One constraint, everything else is noise.md)
- [Volume vs efficiency (more better new)](<../theory/Volume vs efficiency (more better new).md>)
- [Constraint sprints and focused execution](../theory/Constraint sprints and focused execution.md)
- [Status board and operating rhythms](../theory/Status board and operating rhythms.md)
- [No goal, no bottleneck](../theory/No goal, no bottleneck.md)
- [Systems thinking & bottleneck analysis](../theory/Systems thinking & bottleneck analysis.md)

## Terms

| Term | Definition |
|------|-----------|
| Symptom Pattern | A recurring, named description of what the data looks like when a specific type of problem is present |
| Constraint | A specific symptom in a specific account, right now, chosen as the bottleneck to fix this Sprint |
| Solution Pattern | A reusable strategy for removing a certain type of bottleneck, tagged by bucket and growth lever |
| Playbook | An atomic, step-by-step recipe that implements part of a Solution Pattern in a single Sprint |
| Diagnostic Engine | The full loop: Status Board to Symptom to Constraint to Solution to Playbook to Review |
| Funnel-walking | The technique of starting at the business outcome and walking down the metric tree to find the first divergence |
| Misdiagnosis | When a Sprint does not move the target metric despite good execution, indicating the wrong constraint was selected |
