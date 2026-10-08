# Composition

How a run goes from an account's ad groups to a reviewable set of responsive search ads: what a
cluster is, what is derived rather than asked, which angle belongs in which slot, and what the
composition file has to contain before the artifact can be written.

Every threshold and every slot assignment on this page names the document it comes from.

---

## 1. The unit of composition is the cluster

A **cluster** is a set of ad groups with the same intent that can run identical creative apart from
the relevance anchor (SOP – RSA Testing with The Iteration Loop §1.1). Composing per cluster rather
than per ad group is what makes creative decidable: one ad group gathers a few hundred to a couple
of thousand impressions per asset a month, while five ad groups on one template gather five to ten
thousand and twenty gather twenty to fifty thousand (Creative Performance Reference, cluster
volume table). The same headline seen across the cluster is one measurable asset instead of five
unmeasurable ones.

So one run drafts every ad group in scope and asks for review **once**, organised by cluster. There
are no per-ad-group interviews.

### Proposing the clustering

Group by shared intent and shared messaging need, then name each cluster after the theme, not after
a campaign.

The test is the **Single Ad Test** (Search Ad Group Structure Mental Model): *can one RSA serve
every keyword in this group without a headline or description feeling generic or mismatched?* Where
the answer is yes across several ad groups, they are one cluster.

Split the proposal when the intent diverges (the same model's divergence taxonomy):

| Divergence | One cluster? |
|---|---|
| Funnel stage — informational vs commercial vs transactional | No, always separate |
| Audience segment — SMB vs enterprise, consumer vs trade | No |
| Product or service type | No |
| Problem or use case | Often separate; judge on volume |
| Feature or attribute | Usually one cluster |
| Commercial modifier — "x" vs "best x" vs "x reviews" | One cluster |
| Synonym or variant | One cluster |
| Location modifier | One cluster |
| Singular / plural | One cluster |

Traffic temperature splits a cluster too: cold and hot ad groups need different lead angles, so they
cannot share a template even when they share a product.

Brand and non-brand are never one cluster. Their awareness stages differ by two steps.

Common starting shapes (SOP – RSA Testing with The Iteration Loop §1.1): non-brand generic terms,
non-brand category terms, competitor terms, brand terms.

A cluster of one ad group is legitimate — that is what an account of distinct themes looks like. Say
so in the artifact rather than forcing a group.

---

## 2. Derive, never interview

`scripts/derive.js` collects the signals; the judgement is yours. Every derivation is shown in the
review artifact with the source it came from, because correction happens there and only there.

| Derivation | Where it comes from | When it is not derivable |
|---|---|---|
| Keyword anchor for H1 | the ad group's top enabled keyword by impressions | no enabled keywords — the ad group cannot be composed for; report it and move on |
| Final URL | the live ad's final URL, else the keyword final URL with the most impressions behind it | neither exists — ask for the landing page; do not invent one |
| Traffic temperature | the ad group's keyword themes and its campaign, read against the table below | never: classify from what the keywords say, and show the reason |
| Angle | the account's own `context/offer-angles.md`, matched to the cluster's audience and theme | no angle document — recommend `/offer-maker` and compose from the bundled catalogs, saying so |
| Variable-slot fill | whatever made this ad group need its own line — its keywords, its page, or a peer audit's finding on it | no reason worth naming — then the slot is not variable; write the shared core line instead |
| Live copy | the audit's `rsa-live-review.csv`, else the account ads pull | neither — every ad group is composed as a new ad and the artifact says the comparison was unavailable |
| Customizers | `scripts/pull-customizers.js`, joined per ad group: each attribute's keyword values and its ad group, campaign or customer fallback | no pull, or the account holds none — compose without them |

An anchor candidate longer than 30 characters is reported, never trimmed by machine. Write an anchor
that carries the same theme inside the slot.

### Traffic temperature

Awareness stage decides the lead angle and the tone of the call to action (Awareness Stage Mental
Model). Read it from what the keywords are, using the traffic-source table in SOP – Craft Your Offer
Angles §0.1:

| What the ad group's keywords are | Awareness stage | Temperature |
|---|---|---|
| Brand terms | Most Aware | hot |
| Competitor terms | Product Aware | hot |
| Remarketing audiences | Product → Most Aware | hot |
| Product or service terms | Solution Aware | warm |
| Problem or symptom terms | Problem Aware | cold |
| Category-education terms | Unaware → Problem Aware | cold |

`derive.js` reports a **brand signal** — the impression share of the ad group's keywords that carry
one of the account's own configured brand terms. It is evidence, not a verdict: an account that
configures no brand terms gets `not-calculable` and you classify from the ad group and campaign
yourself. Never infer brand from a campaign name pattern.

Record the temperature and the sentence behind it in the composition; both appear in the artifact as
correctable.

### Call-to-action tone follows the temperature

Cold traffic gets a soft, educational call ("see how it works"); warm gets an exploratory one
("compare the options"); hot gets a direct, transactional one ("order today") — SOP – Write
Compelling RSAs §1.2.

### Angle selection

`/offer-maker` owns the angles. This skill only **selects** which of them a cluster leads with, and
pulls proof points from the angle document's evidence markers so every claim in the copy traces to a
quote, a URL and a capture date. A fact the angle document marks as excluded or not-yet-claimable
never enters copy.

Compose in the language the account advertises in — the language of its keywords and its live copy —
not in the language of this document.

---

## 3. The slot model

### Roles

| Role | Who writes it | Testing |
|---|---|---|
| `anchor` | per ad group — its keyword, in slot H1 and unpinned by default | not compared; it differs by design |
| `core` | once per cluster, verbatim-identical in every ad group | the cluster-level comparison runs on these |
| `variable` | per ad group, at most two slots in the whole template | excluded from the cluster-level comparison |

A cluster that needs a third per-ad-group slot is the wrong cluster — those ad groups want different
messaging, which is the Single Ad Test failing. Split them instead of widening the budget.

A cluster of one or two ad groups **prefers a full template**: its impression pool is thin already,
and a variable slot splits what little there is. The slot check warns when a small cluster carries
one; the operator then either keeps it on purpose or folds that line into the core.

Every asset is tagged with an **angle type and a sub-angle, never with its slot number** (SOP – RSA
Testing with The Iteration Loop §1.2). The tag is what makes assets comparable across ad groups and
across cluster generations.

### The plan

`node scripts/slot-model.js --plan --temperature=<cold|warm|hot>` prints the angle plan for a
temperature. It is fixed, so that the same slot carries the same angle everywhere in the cluster and
the pooled data means something (§1.3 of the same SOP).

H1–H7 are the canonical template (SOP – RSA Testing with The Iteration Loop §1.2; Headline Angle
Catalog, the seven core types):

| Slot | Angle |
|---|---|
| H1 | Relevance Anchor |
| H2 | Value Proposition |
| H3 | USP / Benefit |
| H4 | Social Proof |
| H5 | Risk Removal |
| H6 | Call-to-Action |
| H7 | the angle the temperature leads with, a second time — Problem/Pain when cold, USP / Benefit when warm, Social Proof when hot |

H8 and later are optional, hypothesis-led additions. Temperature priorities can guide the
message choice but never fill an extension queue automatically. New ads start with seven;
existing ads retain useful assets at their current count until evidence supports a change.

Descriptions expand the headlines; they never restate them (SOP – Write Compelling RSAs §2.1):

| Slot | Pattern |
|---|---|
| D1 | Problem + Solution — carry the cluster's theme word here, because Google bolds text matching the query |
| D2 | Proof + CTA |
| D3 | Optional supported risk removal or authentic urgency; omit when it adds no useful message |
| D4 | Only for a documented expansion test with a distinct supported purpose |

Urgency is a modifier applied to another angle, never an angle of its own, and it appears in at most
two headlines (Headline Angle Catalog; Headline Quality Checklist).

**Keyword bolding inside a cluster.** SOP – Write Compelling RSAs asks D1 to carry the ad group's own
core keyword. In a cluster template D1 is shared, so it carries the *cluster's* theme word instead
and the ad group's own keyword is bolded through the anchor headline, which Google matches on the
same way. Spending a variable slot on a per-ad-group D1 is a legitimate use of the budget when the
cluster's ad groups have no shared theme word at all — the Description Quality Checklist treats
keyword bolding as an optimisation, not a requirement.

### Asset count follows the task

New compositions start with **seven supported headlines and two descriptions**. A third
useful description is optional. Evidence applies to every core asset, including these starting
slots. If proof is missing, choose another supported message or resolve the gap upstream; never
invent proof or fill a slot merely to reach a count.

For any existing RSA, record `revisionEvidence: { source, reason }` from its asset/ad evidence.
Retain useful messages; do not trim an existing 15-headline ad automatically. Low exposure is
insufficient evidence, not proof that the message is poor. A revision may preserve a smaller
existing RSA (at least the platform minimum of three headlines and two descriptions), with its
coverage gap stated. New ads still start at seven.

A live RSA above the KB range — more than eight headlines or more than three descriptions (Creative
Performance Reference: "Use 7-8 headlines and 2-3 descriptions") — is not trimmed and not kept
silently. Ask the user: *"Rewrite to 7–8 headlines and 2–3 descriptions (recommended), or keep the
current asset counts?"* Record the answer:

```json
{ "countDecision": { "choice": "reduce" | "keep", "source": "<the user's answer>" } }
```

On `reduce`, keep the assets with the strongest evidence (performance label, exposure, supported
claim) and retire the rest; do not keep the first slots by position. A routine iteration does not ask:
it changes one asset and leaves the count as it is.

An increased headline count, or a fourth description on a new ad, requires:

```json
{
  "expansion": {
    "messageGap": "The distinct missing message",
    "evidence": "The supporting claim source",
    "whyAdd": "Why keep the current messages instead of replacing one",
    "dataBasis": "Actual relevant asset exposure, outcomes and uncertainty",
    "reviewDecision": "What would justify keeping this addition"
  },
  "test": { "kind": "routine", "hypothesis": "One clear learning question" }
}
```

Use `controlled` instead of `routine` when the change needs a formal experiment. Routine changes
must satisfy `routine-iterations.md`; one asset change per RSA, with pins, URLs and other copy
stable. Expansion above eight headlines is an explicit experiment outside the KB starting range,
not an automatic recommendation for high-volume accounts. Capacity remains 15 headlines and four
descriptions. The Editor keeps all capacity columns so removed assets can be erased explicitly.

The KB tables describe unordered versus ordered three-headline arrangements. Neither the 455 nor
2,730 count, multiplied by an arbitrary impression count, proves test capacity. Pins and uneven
serving also change exposure. Do not derive count bands or statistical confidence from either
table, and do not invent a description-volume band. Comparable clusters help analysis, but report
per-member evidence so one large ad group cannot hide differences.

### Dynamic text: customizers, location and countdown

This skill uses what the account already holds. It never creates a customizer attribute or value:
the values are business data (prices, stock, offers) that the advertiser keeps current, not this
skill. `derivations.json` lists, per ad group, every attribute it can serve — `keywordValues`
(how many of its enabled keywords carry a value, with examples) and `fallback` (the ad group,
campaign or customer value the other queries get).

- **Syntax.** `{CUSTOMIZER.<attribute name>:<default text>}`, with the attribute name exactly as
  listed. The default text is required, stands alone, and fits the slot: Google shows it whenever no
  value applies or the value does not fit.
- **Coverage.** A core slot is shared, so use an attribute there only when every ad group in the
  cluster serves it (a `fallback`, or keyword values on most keywords). Otherwise use it in a
  variable slot, or not at all.
- **A value is a claim.** Read every value before using it. A price, a percentage or an offer needs
  evidence like any other claim: the evidence marker names the attribute and its level, and the
  value must agree with the angle document and the landing page. A value that contradicts them, or
  is plainly out of date (a seasonal offer outside its season), is not used — report it to the user.
- **Keyword-level headline values.** A TEXT attribute with values on most keywords is often a
  per-keyword headline the advertiser wrote. It can be the H1 anchor instead of keyword insertion:
  `{CUSTOMIZER.<name>:<category phrase>}`. Prefer it when it covers most of the ad group's keywords.
- **Location.** `{LOCATION(City):<default>}` (or `State`, `Country`) only when the offer is local —
  a service area, a store, a delivery region — and the campaigns target locations at that level
  (`context/google-ads/data/geo-targeted.csv`). Not for a national offer with no local relevance.
- **Countdown.** `{COUNTDOWN(yyyy-MM-dd HH:mm:ss,<days before>)}` in the account's time zone, or
  `GLOBAL_COUNTDOWN` in the searcher's, only for a real deadline that `context/business.md` or the
  angle document states with evidence. Never invent a deadline. A countdown is urgency: at most two
  headlines, never pinned. The asset stops serving after the end date; name that date in the review.

Character counting follows Google: a keyword, customizer or location tag counts as its default text,
and a countdown as 8 characters.

### Pinning

The default is not to pin (SOP – Write Compelling RSAs §4.2). Pinning removes combinations from the
auction, and every pin makes the remaining ones scarcer.

- A template has no pins, the anchor included. Google already favours the headline that matches
  the query, and keyword insertion makes the anchor match it.
- Propose a pin only when there is a structural reason: a legal or compliance text that must show,
  a brand guideline that names a fixed position, or an anchor that must always show because the
  ad group's other headlines do not carry its theme. Ask the user first, and name the reason.
- A revision can keep a live ad's pins; a routine wording test must not introduce or remove one.
- Every pinned asset records `pinReason`: the confirmed reason, or "kept from the live ad".
- The ceiling this skill enforces is **three pins** across the whole ad; past it the combination
  pool collapses. "I want this to show more" and "this is my best headline" are not reasons — test
  it instead.

`scripts/slot-model.js --composition=<file>` refuses a composition that breaks any of these rules.
A preference it cannot decide for you — a variable slot in a small cluster, a slot angle that
deviates from the plan — comes back as a warning instead, for you to keep or to fix.

---

## 4. Peer enrichment

Four peer audits are read **once per run, at account level** — not per ad group, and not as a
freshness ceremony. `derive.js` reports which of them exist and the date each declares.

| Peer | What it contributes |
|---|---|
| `/search-term-auditor` | converting n-grams — the words searchers already convert on, which belong in the copy |
| `/quality-score-auditor` | Ad Relevance and Expected CTR per ad group — a below-average signal tells you which ad groups need the anchor and the keyword language tightened |
| `/lp-auditor` | message match — what the page actually promises, so the ad does not promise something else |
| `/offer-auditor` | which angle the offer is strongest on |

A peer report that does not exist is simply unavailable: note it and compose without it. The review
artifact carries the record of what shaped the copy, so no separate sidecar file is written.

---

## 5. The composition file

One run writes one `composition.json` in its run folder. The scripts read it; the artifact is drawn
from it; corrections edit it and everything downstream is regenerated.

```jsonc
{
  "run": {
    "id": "<date>-<n>",
    "date": "YYYY-MM-DD",
    "mode": "search",
    "deliveryMode": "api" | "csv-create" | "csv-overwrite" | null,
    "language": "<the language the account advertises in>",
    "siteName": "<what the SERP preview shows above the URL>",
    "path": "context/analysis/ad-copy/runs/<date>-<n>/",
    "sources": "<the context files this run read>",
    "peers": [ { "skill": "lp-auditor", "date": "YYYY-MM-DD", "state": "present", "shaped": "<one line>" } ]
  },
  "clusters": [
    {
      "id": "CL-01",
      "name": "<theme>",
      "templateId": "TPL-<run>-01",
      "temperature": "cold" | "warm" | "hot",
      "temperatureBasis": "<the sentence behind it>",
      "angle": "<the angle this cluster leads with>",
      "subAngles": "<sub-angles, separated by ·>",
      "angleBasis": "<why this angle for this audience>",
      "countDecision": { "choice": "reduce" | "keep", "source": "…" },   // only when a live ad is above 8 / 3
      "headlines": [
        { "slot": 1, "role": "anchor", "angle": "Relevance Anchor", "subAngle": "keyword anchor" },
        { "slot": 2, "role": "core", "angle": "Value Proposition", "subAngle": "<sub-angle>", "text": "…", "evidence": "[E1]" },
        { "slot": 15, "role": "variable", "angle": "USP / Benefit", "subAngle": "<sub-angle>" }
      ],
      "descriptions": [ { "slot": 1, "role": "core", "angle": "Problem + Solution", "subAngle": "…", "text": "…", "evidence": "[E3]" } ],
      "adGroups": [
        {
          "campaignId": "…", "campaignName": "…", "adGroupId": "…", "adGroupName": "…",
          "anchor": "{KeyWord:<category phrase>}", "anchorSource": "…",
          "finalUrl": "…", "finalUrlSource": "…",
          "path1": "", "path2": "",
          "variables": { "H15": "…" },
          "variableSources": { "H15": "<what made this ad group need its own line>" },
          "live": { "adId": "…", "headlines": [ … ], "descriptions": [ … ], "finalUrl": "…", "adStrength": "…" }
        }
      ]
    }
  ]
}
```

Rules the file has to satisfy — all enforced by `slot-model.js`:

- Seven supported headlines and two or three descriptions for new copy; evidence-led counts for revisions and documented expansion tests.
- Slot H1 is the anchor. A pin carries a `pinReason`; no more than three pins in the ad.
- A revision of a live ad above eight headlines or three descriptions records `countDecision`; on
  `reduce` the template holds at most eight headlines and three descriptions.
- At most two `variable` slots per template, each filled for every ad group in the cluster.
- Every variable fill carries its own entry in `variableSources`, keyed by the same slot label as
  the fill. A fill is a per-ad-group derivation, and the review artifact draws every derivation with
  the source it came from; a fill with nothing under it cannot be corrected, so an unsourced one is
  an error rather than a blank line on the page.
- Every asset carries a non-empty `angle` and `subAngle`.
- Core slots carry template-level `text`; `anchor` and `variable` slots carry none.
- No headline is repeated inside one ad.
- Every ad group has an anchor and a final URL.
- Headlines ≤ 30 characters, descriptions ≤ 90, counted the way the ad editor counts them — a
  user-perceived character, so accents and non-Latin scripts count once. A keyword, customizer or
  location tag counts as its default text; a countdown as 8 characters.
- Every keyword, customizer or location tag has non-empty default text. At most two headlines carry
  a countdown, and no countdown is pinned.

A slot whose angle deviates from the temperature's plan is a warning, not an error: a deliberate
substitution is allowed, and the artifact shows it.

---

## 6. When a cluster cannot be composed

| Situation | What happens |
|---|---|
| The ad group has no enabled keywords | it is out of scope for composition; name it and the reason |
| No live ad and no keyword final URL | the ad group is held back until someone supplies the page |
| No `context/offer-angles.md` | compose from the bundled catalogs, recommend `/offer-maker`, and say in the artifact that no evidence markers back these claims |
| No brand or messaging evidence | compose from what exists and say plainly which claims are unsourced |
| The account has one ad group | one singleton cluster; full template, no variable slots |
| An ad group's type is not a standard search ad group | out of scope with the type named — it does not serve responsive search ads |
| A live ad exists but its copy could only be read from joined cells | shown for comparison, and marked as not safe to match an existing asset against |
