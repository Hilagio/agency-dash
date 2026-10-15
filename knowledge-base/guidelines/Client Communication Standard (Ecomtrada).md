# Client Communication Standard (Ecomtrada)
Created: 2026-10-15

Support_ID: ECOMTRADA_STANDARD_1
Status: Done
Category: Communication
Agent_Readable: Yes
Human_Facing: Yes

## Purpose

The house standard for every message that goes to a client — answers to client
questions, performance explanations, weekly updates, change announcements. Set
by Lennard after the AMDOR escalation: the client told us exactly what level
they need, and this is it. Every client-facing text the AI produces follows
this standard.

## The standard

**1. Separate answers for separate problems.** Never one blended story for two
campaigns or two issues. Each campaign/issue gets its own block with its own
diagnosis and its own decision. A client asking "why did these two campaigns
drop" gets two answers.

**2. Diagnosis before opinion, causes ranked by weight.** Lead with what
happened and why, with real numbers. When there are multiple causes, order
them by impact and say which is the main driver.

**3. Fair baselines.** If the reference number was a peak, say so and compare
against the standing level ("the 3.46 was a peak; the standing level was
~2.2x, so the fair comparison is 2.2 → 1.87"). Never let a flattering or
alarming baseline stand uncorrected — including our own.

**4. "Our call:" — decision, threshold, date, consequence.** Every issue ends
with the decision in one block: what we are doing, the number it must clear,
the review date, and what happens if it fails ("we give it until Thursday to
settle above 2.2x; if it holds, it runs; if not, we change the structure, not
the budget"). No open-ended monitoring.

**5. "Done today" for changes already made.** Changes that are live are listed
plainly as done — separated from proposals.

**6. Flag side effects in advance.** If a change will temporarily look worse
("a new tROAS pulls volume down for a few days while bidding recalibrates"),
say it BEFORE the client sees it, and name it as the mechanism working.

**7. Honest uncertainty + the test that resolves it.** When we are not sure
(tracking, attribution), say so plainly, name the test that will settle it
(e.g. a week of Shopify orders reconciled against the new tag on count AND
value) and the date the answer lands. "I will show you the comparison rather
than tell you it reconciled."

**8. Every promise carries a date.** Open items are listed each with the date
the client can expect them. No "soon", no "we're looking into it".

**9. Asks separated and explicit.** Anything needing the client's go-ahead is
its own clearly-marked block — never buried in prose.

**10. Tone.** Direct, confident, concrete. Treat the client's question as
valid — never defensive, never lecturing first ("we don't react to every
swing" is fine as ONE alignment line, never as a substitute for the answer).
Honest bad news with a plan beats soft news without one. No internal jargon,
no tool names, no hedging-by-committee.

**Format for Slack/WhatsApp:** plain text, short paragraphs, "•" bullets,
*asterisk bold*, no markdown headings, no tables, no links unless asked.

## Reference example (the AMDOR answer that set the bar)

> Feed-Only | Blaulichtfilterbrillen (3.46 → 1.87) — two causes, in order of
> weight: Target off + budget up. We'd deliberately run this without a ROAS
> target to open up delivery and test the headroom […] That's the main driver —
> and it's exactly the signal that test was designed to surface. The offer
> stopped showing a discount in the feed […] One note on the baseline: the
> 3.46 was a peak within the period, the standing level was ~2.2x. The drop is
> real, but the fair comparison is ~2.2 → 1.87, not 3.46 → 1.87.
>
> Our call: We are setting a tROAS of 250%. We give it until Thursday next
> week to settle back above 2.2x breakeven. If it holds, we leave it to run.
> If it doesn't, we change the structure, not the budget.
