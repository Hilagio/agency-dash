# Quality checklists

Run these over every finished template before the review artifact is written. What a script can
decide, `scripts/slot-model.js` already decides — those rows are marked *(checked)*. The rest are
read by a person or by the composer, because they are judgements about language.

Source: Headline Quality Checklist and Description Quality Checklist.

---

## Headlines

**Constraints**

- [ ] Each headline is 30 characters or fewer *(checked)*
- [ ] Most headlines sit in the 25–30 band — the slot is used, not half-used

**Stands alone**

- [ ] Each headline makes sense on its own, in any combination
- [ ] No headline needs another headline to be understood
- [ ] No awkward fragment or broken phrase
- [ ] Any keyword-insertion, customizer or location default text is a strong standalone phrase, not a placeholder
- [ ] Every customizer value used was read, agrees with the evidence, and is not out of date
- [ ] Any countdown counts down to a deadline the business context states

**Does not repeat**

- [ ] No two headlines make the same claim in different words
- [ ] No headline repeats a sitelink or a callout verbatim *(checked for verbatim repeats inside the ad)*

**Quality**

- [ ] No generic filler — "best", "quality", "leading" — without something specific behind it
- [ ] Every quantified claim is believable and defensible against the account's own evidence
- [ ] Written to the searcher, not about the advertiser
- [ ] No claim a competitor could make word for word

**Angle coverage**

- [ ] A relevance anchor exists *(checked)*
- [ ] A value proposition headline exists
- [ ] A call-to-action headline exists
- [ ] Social proof or risk removal exists
- [ ] A problem/pain headline exists — required on cold and warm traffic, optional on hot and brand

**Modifiers**

- [ ] Urgency appears in no more than two headlines
- [ ] Price headlines are used only where the intent and the pricing support them

---

## Descriptions

**Constraints**

- [ ] Each description is 90 characters or fewer *(checked)*
- [ ] Most descriptions sit in the 75–90 band

**Stands alone**

- [ ] Each description makes sense on its own
- [ ] No fragment; grammar and punctuation are clean

**Does not repeat**

- [ ] No description restates a headline in other words
- [ ] At least one description adds proof, specificity or terms that appear nowhere in the headlines
- [ ] Descriptions do not repeat sitelinks and callouts

**Quality**

- [ ] Written to the searcher — benefits and outcomes, not "we are…"
- [ ] No vague claim without specifics
- [ ] No unverifiable superlative and no policy-risk phrasing
- [ ] At least one description carries evidence: a number, a rating, a credential

**Angle coverage**

- [ ] At least one description reduces risk — a trial, a return, a refund, no obligation
- [ ] At least one description gives a clear next step
- [ ] At least two distinct angles across the four
- [ ] Problem-and-solution language and aspirational value language both appear

**Keyword bolding**

- [ ] At least one description carries the ad group's core keyword phrase naturally
- [ ] That inclusion reads grammatically — it is a sentence, not a slot

---

## Claim integrity

Every concrete claim — a number, a term, a guarantee, a delivery promise, a price — traces to the
account's own evidence:

- [ ] The claim appears in `context/offer-angles.md` with an evidence marker, or was confirmed by
      the operator in that document's review pass
- [ ] Where the evidence held two conflicting figures, the resolved figure is the one used
- [ ] A term marked as designed-but-not-yet-live is not claimed before its date
- [ ] An expired promotion or a dead discount code appears nowhere
- [ ] Nothing is claimed that the landing page contradicts

A claim with no evidence behind it is not composed. Where the account has no angle document at all,
say plainly in the artifact which claims are unsourced.

---

## Before the artifact

- [ ] `node scripts/slot-model.js --composition=<file>` exits 0
- [ ] Every warning it prints has been read and is either fixed or deliberate
- [ ] The copy is in the language the account advertises in
