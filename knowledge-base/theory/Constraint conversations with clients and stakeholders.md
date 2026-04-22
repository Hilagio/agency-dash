# Constraint conversations with clients and stakeholders
Created: 2026-02-04

Support_ID: THEORY_13
Status: Done
Category: Operational
Reference Type: Theory
Agent_Readable: No
Human_Facing: Yes
Domain: Foundations
Pillar: 0

## Purpose

This article teaches you how to communicate the constraint-based Scaling System to clients and stakeholders so they understand your focus, feel heard, and stop derailing active Sprints with shiny-object requests.

## What this is NOT

- Not a client management SOP (no step-by-step execution)
- Not a sales pitch for the OS
- Not a template library for slide decks

## Introduction

The entire Google Ads Scaling OS works beautifully inside your head. You have a Status Board, a metric tree, a Diagnostic Engine, one active Constraint per account, and a Sprint plan tied to Playbooks.

The problem is that your client doesn't live in that system. They live in a world of Loom updates, *"Can we try this new beta?"*, and *"My CEO saw a competitor ad and wants us to do the same thing"*.

Without a shared **constraint narrative**, you get dragged into tactical whack-a-mole. Every call becomes a negotiation between what you know matters and what someone else thinks is urgent. You lose focus on the real bottleneck, and you lose the ability to say "not now" with a clear, non-defensive reason.

This article gives you a way to make the constraint logic visible to non-technical people, using four artifacts you already have internally. The goal is simple: turn conversations from *"Can you push this button?"* into *"Let's agree on the current constraint, then decide where your idea sits in the system"*.

## Why you need a constraint narrative

Clients and stakeholders don't judge your work by whether you removed the binding constraint this month. They judge it by whether you "did something", whether you implemented their idea, whether you tried the latest feature Google released.

Without a constraint narrative, every stakeholder request has equal weight, and the loudest voice wins. You end up testing AI Max because the CMO heard about it, pushing budget because the CEO wants more leads, or rebuilding a landing page because someone read a blog post, all while the real bottleneck (say, a 5% Lead to SQL rate) sits untouched.

The solution is to make the constraint-based logic visible. You don't need to teach clients Theory of Constraints. You need a small set of visuals and artifacts that frame every conversation around "what is actually limiting your results right now".

## The four client-facing building blocks

You already have these internally. Here is how they appear to clients:

The **Status Board** is a one-page health check across buckets. It shows business results (CAC, revenue, pipeline), funnel health (Conversion), Traffic and Creative signals, and Measurement sanity. Clients see a simple green/amber/red view of what's working and what isn't.

The **Constraint card** is a single slide or visual that says: "This is the one bottleneck we are focused on right now". It includes the metric and bucket (e.g. Lead to SQL%, Business), the goal impact (e.g. blocking 80 SQLs/month), and the baseline vs target. This is the anchor for every conversation.

The **Constraint Backlog** (or idea parking lot) is a list of other problems you've noticed and ideas the client has raised. It shows where their ideas live and when they might come into play. This is what makes clients feel heard without derailing focus.

The **Sprint plan** is a short plan: "For the next 2 to 4 weeks, we are running these Playbooks to move this metric". It makes your work feel purposeful and visible.

If you bring these four to a call, you can frame almost any conversation.

![The four client-facing communication artifacts](images/THEORY_13/02-communication-toolkit-v3.png)

## How to explain the system in client language

You don't talk about Constraint buckets or Solution Patterns with clients. Keep it simple. Here is a script that works:

> Think of Google Ads like a factory.
>
> Every month we want this factory to produce [X revenue / Y SQLs / Z new customers].
>
> Right now, there are lots of things we could work on (campaigns, landing pages, new betas) but only one part of the factory is actually limiting output. That is the bottleneck.
>
> Our job is to:
>
> 1. Find that bottleneck using your metrics.
> 2. Focus our Sprints on fixing it.
> 3. Put all other ideas into a backlog until they actually help the bottleneck.
>
> That is why we are running this Sprint on [Constraint] instead of testing [shiny object] this month.

If they understand that story once, you can refer back to it every time you need to say "not now".

![Factory analogy: Google Ads as a system with one bottleneck](images/THEORY_13/01-factory-analogy-v3.png)

## Handling "We want to test X" without losing the plot

This is where most specialists crumble. A stakeholder says "Can we test X?" and the specialist either caves immediately (losing focus) or says no without explanation (losing trust).

There is a better pattern. It has four steps:

First, **acknowledge and clarify**. *"That's a good idea. Can you tell me what you'd hope it changes? Leads? CAC? Pipeline?"* This makes the stakeholder feel heard and forces them to connect their idea to a metric.

Second, **place it in the backlog visibly**. Add it to your Constraint/Solution backlog on-screen. Tag it with which bucket it relates to and whether it's likely a More, Better, or New lever. The client can see their idea is captured, not dismissed.

Third, **contrast with the current Constraint**. Show the Constraint card and Status Board metric. Explain why the current focus is higher leverage right now: *"If we don't fix measurement / CAC / Lead to SQL% here, testing X won't actually hit your main goal"*.

Fourth, **offer a review point**. *"Once we've moved this metric into a healthy band, likely in the next Sprint review, we'll re-evaluate backlog items, including your X idea"*.

This way their idea is not dismissed, it's visibly captured, and you maintain focus on the Constraint.

![Four-step framework for handling client requests without losing focus](images/THEORY_13/03-conversation-framework-v3.png)

## Example scenarios and scripts

### Scenario A: Measurement is broken, client wants new feature

The Status Board shows Measurement red, Business/Conversion not trustworthy. The client says: *"Let's launch AI Max, I've heard it's performing great for others"*.

> We definitely want to explore that, and I've added "AI Max test" to our backlog.
>
> Right now our problem is more basic: we don't yet trust the numbers (Measurement is red). If we launch AI Max now, we won't know if it's actually working, we'd just be guessing.
>
> Our current Sprint is focused on fixing Measurement so we can see the truth. Once that's in a good place (likely by [date]), we can revisit AI Max as a potential Solution Pattern for the next bottleneck.

### Scenario B: Business constraint (lead quality), client pushing more volume

The Status Board shows Business red (Lead to SQL% bad, sales overwhelmed) while Traffic is mostly fine. The client says: *"Can we just spend more to hit the SQL target?"*

> We could increase spend and get more leads, but right now your sales team is telling us most of those leads are not qualified, and your Lead to SQL% is only ~5%. That means we'd simply pay more to send more of the wrong people into an already overloaded sales funnel.
>
> Our current bottleneck is lead quality and sales process, not top-of-funnel volume. This Sprint, we're focused on improving qualification and follow-up. Once that's healthy, we definitely want to use your budget to scale, but only when we can do it profitably.

### Scenario C: Conversion vs Traffic quality

The Status Board shows Conversion looks bad (LP CVR low), but query mix reveals "jobs", "free", "examples" queries. The client says: *"We should rebuild the landing page, CVR is terrible"*.

> You're right that CVR is currently weak, and we will improve the page. But when we look at the search terms, a lot of traffic is job-seekers and freebie hunters. That's a Traffic quality issue first. If we rebuild the page without fixing that, we'll still be selling to the wrong crowd.
>
> So our current Constraint is: Traffic quality. This Sprint, we're rebalancing queries and tightening match and negatives, then we'll revisit LP changes once we're sure we're talking to the right people.

## When the client is right and the Constraint changes

Sometimes the client's instinct does point to the real bottleneck. They bring data, context, or internal constraints you didn't see. Their idea exposes a higher-level Business constraint (e.g. capacity, cash flow) that genuinely changes the picture.

When that happens, hear them out fully. Then re-open your goal equation, metric tree, Status Board, and buckets hierarchy. If their information genuinely shows a different node is now the binding constraint, or the top-level goal has changed, update the Constraint card and explain that shift explicitly:

> "Based on your new sales capacity / margin reality, I agree the bottleneck has moved upstream. Let's update the Constraint and adjust this Sprint plan accordingly".

This keeps the relationship collaborative and the OS trusted as a tool, not a rigid religion.

## What this looks like in QBRs and weekly calls

### QBR structure

For each key account, a QBR follows four slides. The **Status Board slide** gives a green/amber/red overview with top-line results vs goals. The **Constraint story slide** shows what the bottleneck was when last reviewed, what you did (Solution Pattern and Playbooks), and how the target metric moved. The **Backlog slide** presents top Symptom/Constraint ideas in the queue, with the client's previous ideas visibly listed. The **Next Sprint proposal** covers the proposed Constraint for the next Sprint, the rationale from Status Board and metric tree, and proposed Playbooks.

![QBR structure: four presentation slides](images/THEORY_13/04-qbr-structure-v3.png)

### Weekly call structure

Weekly calls are more tactical but follow the same elements: 5 to 10 minutes on the Status Board and any urgent Remove issues, 10 to 15 minutes on active Sprint progress (what was implemented, what's next), and 10 to 15 minutes for client questions, ideas, and backlog/Constraint discussions.

## Implementation checklist

When you're done, you should be able to:

- [ ] Explain the Scaling System to a new stakeholder in under 2 minutes using the Status Board, a Constraint card, and the backlog.
- [ ] Handle "Can we test X?" with: Acknowledgement, backlog entry, Constraint explanation, review point.
- [ ] Show, at any time: Current Constraint and Sprint for their account. Where their past ideas live in the backlog. How your last Sprint moved a specific Status Board metric.
- [ ] Leave each QBR or weekly call with: Agreement on what the bottleneck is. Agreement on the next Sprint focus. Client feeling heard, even if their idea didn't "win" this Sprint.

## Related Documents

- [Status board and operating rhythms](../theory/Status board and operating rhythms.md)
- [Constraint sprints and focused execution](../theory/Constraint sprints and focused execution.md)
- [The five buckets & hierarchy of constraints](../theory/The five buckets & hierarchy of constraints.md)
- [Diagnostic engine Symptom to Constraint to Solution](<../theory/Diagnostic engine Symptom → Constraint → Solution.md>)
- [One constraint, everything else is noise](../theory/One constraint, everything else is noise.md)
- [You might be a constraint too](../theory/You might be a constraint too.md)

## Terms

| Term | Definition |
|------|-----------|
| Status Board | Single-view health check per account across all five buckets |
| Constraint card | One-slide visual identifying the current bottleneck metric and bucket |
| Constraint backlog | Prioritized list of identified problems and client ideas awaiting Sprint focus |
| Sprint plan | Time-boxed execution plan targeting one Constraint with 1-3 Playbooks |
