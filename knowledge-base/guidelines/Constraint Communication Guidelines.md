# Constraint Communication Guidelines
Created: 2026-02-14

Support_ID: GUIDELINE_11
Status: Done
Category: Operational
Reference Type: Guideline
Agent_Readable: No
Human_Facing: Yes
Domain: Operational
Pillar: 0

## Purpose

This guideline defines how to communicate the constraint-based Scaling System to clients and stakeholders. It provides the four client-facing artifacts, scripts for common conversations, a structured QBR format, and a weekly call format that keeps stakeholders aligned without derailing active Sprints.

---

## What this is NOT

**This guideline does NOT:**

- Explain the theory behind constraint-based optimization (See: [One constraint, everything else is noise](../theory/One constraint, everything else is noise.md))
- Define the Status Board or operating rhythms (See: [Status board and operating rhythms](../theory/Status board and operating rhythms.md))
- Explain how Sprints work (See: [Constraint sprints and focused execution](../theory/Constraint sprints and focused execution.md))
- Provide step-by-step execution for diagnosis or sprint planning
- Replace strategic decision-making about which constraint to prioritize

---

## The four client-facing artifacts

Every client interaction uses some combination of these four artifacts. Build them once per account, update them each Sprint.

| Artifact | What it shows | When to use | Update cadence |
|----------|---------------|-------------|----------------|
| **Status Board** | One-page green/amber/red health check across all five buckets (Measurement, Business, Conversion, Traffic, Creative) with top-line results vs goals | Every weekly call and QBR opening | Weekly |
| **Constraint card** | Single slide: the one bottleneck you are focused on right now, with metric, bucket, baseline, target, and goal impact | Every weekly call, every QBR, every time someone asks "why aren't we doing X?" | Per Sprint |
| **Constraint backlog** | Prioritized list of identified problems and client ideas, with bucket tags and rough impact estimates | Whenever a client raises an idea, every QBR backlog review | Ongoing (add items as they surface) |
| **Sprint plan** | 2-4 week execution plan: which Playbooks you are running, which metric you are targeting, expected timeline | Sprint kickoff, weekly call progress update, QBR Sprint review | Per Sprint |

> 💡 **These are not new artifacts:** You already maintain these internally. The guideline is about making them visible to clients in language they understand.

---

## Explaining the system to non-technical stakeholders

Use this script when onboarding a new client or stakeholder. Adapt the specifics to their business.

**The factory script:**

> Think of Google Ads like a factory.
>
> Every month we want this factory to produce [X revenue / Y SQLs / Z new customers].
>
> Right now, there are lots of things we could work on: campaigns, landing pages, new features. But only one part of the factory is actually limiting output. That is the bottleneck.
>
> Our job is to:
> 1. Find that bottleneck using your metrics.
> 2. Focus our Sprints on fixing it.
> 3. Put all other ideas into a backlog until they actually help the bottleneck.
>
> That is why we are running this Sprint on [Constraint] instead of testing [their request] this month.

**Recommended delivery:**

| Setting | How to deliver |
|---------|---------------|
| New client onboarding | Walk through all four artifacts once, explain the factory analogy, set expectations for the cadence |
| New stakeholder joins | 2-minute version: show the Status Board, point to the Constraint card, explain the backlog |
| Client asks "how do you work?" | Share the factory script, then show the four artifacts as proof of the system in action |

---

## Handling "Can we test X?"

When a stakeholder requests something outside the current Sprint focus, follow this four-step pattern. Do not skip steps.

### Step 1️⃣: Acknowledge and clarify

Say: "That's a good idea. Can you tell me what you'd hope it changes? Leads? CAC? Pipeline?"

This makes the stakeholder feel heard and forces them to connect their idea to a metric. If they cannot connect it to a metric, that is useful information.

### Step 2️⃣: Place it in the backlog visibly

Add the idea to your Constraint backlog on-screen during the call. Tag it with the relevant bucket and whether it is likely a More, Better, or New lever. The client can see their idea is captured, not dismissed.

### Step 3️⃣: Contrast with the current Constraint

Show the Constraint card and the Status Board metric. Explain why the current focus is higher leverage right now.

Use language like: "If we don't fix [current constraint] first, testing X won't actually hit your main goal because [specific reason]".

### Step 4️⃣: Offer a review point

Say: "Once we've moved this metric into a healthy band, likely at the next Sprint review on [date], we'll re-evaluate backlog items including your idea".

**Summary table:**

| Step | What you do | What the client experiences |
|------|-------------|---------------------------|
| Acknowledge | Ask what metric they hope it moves | Feels heard, not shut down |
| Backlog | Add it visibly with bucket tag | Sees their idea is captured |
| Contrast | Show Constraint card and Status Board | Understands why current focus is higher priority |
| Review point | Give a specific date for re-evaluation | Knows when their idea gets another look |

> ⚠️ **Do not skip the acknowledge step:** Jumping straight to "no, we're focused on X" creates defensiveness. Asking "what would this change?" turns the conversation collaborative.

---

## Scenario scripts

These three scenarios cover the most common tension points between constraint-based execution and client expectations.

### Scenario A: Measurement broken, client wants a new feature

**Situation:** Status Board shows Measurement red, Business/Conversion data not trustworthy. Client says: "Let's launch AI Max, I've heard it's performing great for others".

**Recommended response:**

> We definitely want to explore that, and I've added "AI Max test" to our backlog.
>
> Right now our problem is more basic: we don't yet trust the numbers. Measurement is red on our Status Board. If we launch AI Max now, we won't know if it's actually working, we'd just be guessing.
>
> Our current Sprint is focused on fixing Measurement so we can see the truth. Once that's in a good place, likely by [date], we can revisit AI Max as a candidate for the next Sprint.

**Why this works:** It does not dismiss the idea. It shows measurement as a prerequisite for evaluating any new initiative. The client understands that launching without measurement is flying blind.

### Scenario B: Business constraint (lead quality), client pushing more volume

**Situation:** Status Board shows Business red (Lead to SQL% at 5%, sales overwhelmed). Traffic is mostly fine. Client says: "Can we just spend more to hit the SQL target?"

**Recommended response:**

> We could increase spend and get more leads, but right now your sales team is telling us most of those leads are not qualified. Your Lead to SQL% is only about 5%. That means we'd pay more to send more of the wrong people into an already overloaded sales funnel.
>
> Our current bottleneck is lead quality and sales process, not top-of-funnel volume. This Sprint, we're focused on improving qualification and follow-up. Once that's healthy, we definitely want to use your budget to scale, but only when we can do it profitably.

**Why this works:** It reframes "more spend" as waste until the quality problem is resolved. It positions scaling as the reward for fixing the real constraint, not the alternative.

### Scenario C: Traffic quality masquerading as a Conversion problem

**Situation:** Status Board shows Conversion looks bad (LP CVR low), but search terms reveal "jobs", "free", and "examples" queries. Client says: "We should rebuild the landing page, CVR is terrible".

**Recommended response:**

> You're right that CVR is currently weak, and we will improve the page. But when we look at the search terms, a lot of traffic is job-seekers and freebie hunters. That's a Traffic quality issue first. If we rebuild the page without fixing that, we'll still be converting the wrong crowd.
>
> So our current Constraint is Traffic quality. This Sprint, we're rebalancing queries and tightening match types and negatives. Then we'll revisit LP changes once we're sure we're talking to the right people.

**Why this works:** It validates the client's observation (CVR is bad) while correcting the diagnosis. The client sees you are not ignoring the problem, you are addressing its root cause.

---

## When the client is right

Sometimes the client's instinct points to the real bottleneck. They bring data, context, or internal constraints you did not see. Their idea exposes a higher-level Business constraint (capacity, cash flow, pricing) that genuinely changes the picture.

**How to handle it:**

| Step | Action |
|------|--------|
| 1. Listen fully | Do not interrupt or defend. Let them present their data and reasoning. |
| 2. Re-open the diagnostic framework | Walk through the goal equation, metric tree, Status Board, and bucket hierarchy with their new information. |
| 3. Update if justified | If their information genuinely shows a different node is the binding constraint, update the Constraint card on-screen. |
| 4. Explain the shift explicitly | Say: "Based on your new [capacity / margin / sales] data, I agree the bottleneck has moved. Let's update the Constraint and adjust this Sprint plan". |

**What to avoid:**

| Do not | Why |
|--------|-----|
| Defend the old Constraint out of ego | The system is a tool, not a religion. Updating the Constraint when evidence changes is the system working correctly. |
| Flip the Constraint without analysis | "You're right, let's do that" without walking through the framework undermines the entire diagnostic approach. |
| Treat every suggestion as a Constraint change | Most ideas belong in the backlog. Reserve Constraint updates for genuine new information that changes the diagnostic picture. |

---

## QBR structure

Use four slides per account. Keep total QBR time to 30-45 minutes per account.

### Slide 1: Status Board

| Element | What to show |
|---------|-------------|
| Top-line results | Revenue, leads, SQLs, or purchases vs goals |
| Five-bucket status | Green/amber/red per bucket with the key metric |
| Trend direction | Arrows or sparklines showing improvement, stability, or decline |

Open with: "Here's where we stand across the board". Spend 5-7 minutes. Do not go deep on any single metric here.

### Slide 2: Constraint story

| Element | What to show |
|---------|-------------|
| Last Constraint | What the bottleneck was when the quarter started |
| What you did | Which Playbooks you ran, which changes you made |
| How the metric moved | Baseline vs current, with the Status Board shift (red to orange, orange to green) |
| Sprint outcomes | Resolved, Partially Resolved, Inconclusive, or Misdiagnosed per Sprint |

This is your results slide. It directly answers: "What did you do and did it work?"

### Slide 3: Backlog

| Element | What to show |
|---------|-------------|
| Top 5-10 backlog items | Prioritized by bucket and estimated impact |
| Client's previous ideas | Highlighted visibly so they see their input is tracked |
| Status tags | "Identified", "Queued for next Sprint", "Deprioritized (with reason)" |

This slide is what makes clients feel heard. They see their ideas on the board, not forgotten.

### Slide 4: Next Sprint proposal

| Element | What to show |
|---------|-------------|
| Proposed Constraint | Bucket, metric, baseline, target |
| Rationale | Why this is the binding constraint based on Status Board and metric tree |
| Proposed Playbooks | 1-3 specific Playbooks you plan to run |
| Timeline | Sprint length and expected review date |

Close with: "Does this align with your priorities? Anything from the backlog you think should take precedence?"

---

## Weekly call structure

Keep weekly calls to 30 minutes. Three blocks, timed.

### Block 1: Status Board scan (5-10 minutes)

| Action | Details |
|--------|---------|
| Walk through the Status Board | Highlight any bucket that changed status since last week |
| Flag urgent issues | Any Measurement problems or major metric crashes |
| Note "watch" items | Metrics in amber that may need attention if they persist |

Do not diagnose problems in this block. Surface them.

### Block 2: Sprint progress (10-15 minutes)

| Action | Details |
|--------|---------|
| Report on Playbook execution | What was implemented this week, what is in progress |
| Show metric movement | How the Constraint metric has moved since Sprint start |
| Flag blockers | Anything preventing Sprint execution (waiting on client assets, developer access, sales team data) |

This block answers: "What did you do this week and is it working?"

### Block 3: Client questions and backlog (10-15 minutes)

| Action | Details |
|--------|---------|
| Open floor | Client raises ideas, questions, concerns |
| Apply the four-step pattern | Acknowledge, backlog, contrast, review point |
| Update backlog live | Add new items on-screen so the client sees them captured |

This block is where you prevent scope creep while maintaining trust.

> 💡 **End every call with a single sentence.** "Our focus for the coming week is [specific Constraint task], and we'll review progress next [day]". This reinforces the discipline and gives the client clarity.

---

## Exception conditions

### When to break Sprint focus for a client request

| Condition | Action | Rationale |
|-----------|--------|-----------|
| Client provides data that genuinely changes the Constraint diagnosis | Update the Constraint card and adjust the Sprint | The system is evidence-based, not rigid |
| External event changes business reality (acquisition, new product, market shift) | Pause Sprint, re-diagnose from the goal equation down | The goal may have changed |
| Urgent Measurement break discovered during a client request | Address immediately regardless of Sprint focus | Measurement issues do not follow the two-period rule |

### When NOT to break Sprint focus

| Condition | Response | Rationale |
|-----------|----------|-----------|
| Client heard about a new Google feature | Acknowledge, backlog, contrast, review point | New features are not constraints |
| CEO saw a competitor's ad | Acknowledge, backlog, contrast, review point | Competitor activity is not a diagnosis |
| Client wants to increase budget mid-Sprint | Explain why scaling during active constraint work introduces noise | Budget changes during Sprints contaminate Sprint data |
| Client requests match a lower-priority bucket | Backlog with bucket tag, show hierarchy | The bucket hierarchy exists for this reason |

---

## Related Documents

| Document | Relationship |
|----------|--------------|
| [One constraint, everything else is noise](../theory/One constraint, everything else is noise.md) | Theory: why single-constraint focus works |
| [Status board and operating rhythms](../theory/Status board and operating rhythms.md) | Theory: the Status Board artifact and review cadences |
| [Constraint sprints and focused execution](../theory/Constraint sprints and focused execution.md) | Theory: Sprint planning, execution, and evaluation |
| [The five buckets & hierarchy of constraints](../theory/The five buckets & hierarchy of constraints.md) | Theory: bucket priority order used in client conversations |
| [Diagnostic engine: Symptom to Constraint to Solution](<../theory/Diagnostic engine Symptom → Constraint → Solution.md>) | Theory: how constraints are identified and routed |
| [No goal, no bottleneck](../theory/No goal, no bottleneck.md) | Theory: why goal alignment is a prerequisite for constraint conversations |
| [You might be a constraint too](../theory/You might be a constraint too.md) | Theory: recognizing when the bottleneck is internal, not in the account |

---

## Terms

| Term | Definition |
|------|-----------|
| Status Board | Single-view health check per account showing 1-2 metrics per bucket with green/amber/red status |
| Constraint card | One-slide visual identifying the current bottleneck metric, bucket, baseline, and target |
| Constraint backlog | Prioritized list of identified problems and client ideas awaiting Sprint focus |
| Sprint plan | Time-boxed execution plan targeting one Constraint with 1-3 Playbooks |
| Four-step pattern | Acknowledge, backlog, contrast, review point: the sequence for handling off-Sprint requests |
| QBR | Quarterly Business Review: structured review using four slides per account |

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
