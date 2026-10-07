# SOP – Configure AI Max for Search
Created: 2026-02-04
Updated: 2026-10-05

SOP_ID: SOP_43
Agent_Executable: No
Category: Structure
Domain: Search
Human_Approval_Required: No
Pillar: 6
Primary Outcome: AI Max enabled and configured defensively on a Search campaign, with search term matching, brand controls, and final URL expansion set per the chosen control level
Secondary Outcomes: Expanded query coverage, keywordless reach, measurable incremental contribution
Status: Done

### Purpose

This SOP enables and configures AI Max for Search on a Search campaign: search term matching, brand controls, text customization, and final URL expansion, configured in an escalating sequence that starts with AI Max off so each layer is proven before the next.

> ❓ **The big question:** How do I turn on AI Max so it expands relevant reach without ceding control of which queries I bid on or which pages I send traffic to?

---

### What this SOP is NOT

This SOP does **not:**

- Explain when or whether to enable AI Max (See: [AI Max for Search Mental Model](../mental-models/AI Max for Search Mental Model.md))
- Document final URL expansion control syntax or page feed specs (See: [Final URL Expansion & Page Feed Reference](<../references/Final URL Expansion & Page Feed Reference.md>))
- Document every setting and reporting column (See: [AI Max for Search Reference](../references/AI Max for Search Reference.md))
- Cover negative keyword strategy (See: [Negative Keyword Reference](../references/Negative Keyword Reference.md))
- Cover brand control strategy across campaign types (See: [Brand Separation Reference](../references/Brand Separation Reference.md))

---

### When to run this SOP

**Run when:**

- You run an existing keyword Search campaign and want to expand query coverage
- You created a new Search campaign, which arrives with AI Max and all three sub-features on, and want it configured deliberately
- Broad match has already been tested and performs acceptably (See the experimentation sequence in the [AI Max for Search Mental Model](../mental-models/AI Max for Search Mental Model.md))
- You use Smart Bidding and responsive search ads (AI Max is designed for both)

**Do NOT run when:**

- You have not yet tested broad match (test that first)
- Your landing pages are stale, thin, or unmaintained (final URL expansion and text customization read your pages)
- You require strict keyword-level performance data and tight match-type control across the whole campaign

---

### Before you start

#### Required inputs

- Google Ads account with edit access (this SOP uses the web UI, and AI Max is also available in Editor and the API)
- An existing Search campaign using Smart Bidding and responsive search ads
- Broad match already tested with acceptable results
- Maintained, high-quality landing pages
- Your account-level and campaign-level negative keyword lists
- Brand lists prepared (for the controlled Branded searches mode, if you use it)

#### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [AI Max for Search Mental Model](../mental-models/AI Max for Search Mental Model.md) | Fit, sequence, and the reporting reality |
| [AI Max for Search Reference](../references/AI Max for Search Reference.md) | Setting-by-setting mechanics and reporting |
| [Final URL Expansion & Page Feed Reference](<../references/Final URL Expansion & Page Feed Reference.md>) | URL inclusions/exclusions and page feed syntax |
| [AI Max Keywordless Configuration Catalog](../catalogs/AI Max Keywordless Configuration Catalog.md) | Choosing the keywordless configuration for the decision gate |
| [Brand Separation Reference](../references/Brand Separation Reference.md) | Brand control matrix and negative pairing |

---

### Decision gate: keywordless coverage mode and control pattern

Final URL expansion is a campaign-level switch. First decide which mode you want, then how you will steer it.
| Mode | When | Result |
|------|------|--------|
| Final URL expansion on (open discovery) | You want Google to find and serve query-relevant pages across the campaign | Any indexed page can serve unless you constrain it. Steer with the patterns below |
| Final URL expansion off, URL inclusions only (scoped keywordless) | You want a defined keywordless URL set with no open expansion | Keywordless ad groups serve only their included URLs. Keyword ad groups serve on keywords with no dynamic page selection |

If you chose final URL expansion on, decide how you will steer it before enabling:
| If... | Then... | Why |
|-------|---------|-----|
| Your ad groups are well-themed (each maps to a clear set of related pages) | Add ad-group URL inclusions matching each ad group's theme | Keeps expansion on-theme without a separate ad group |
| Your ad groups are over-segmented around close keyword variants (no clean per-ad-group URL split) | Create one keywordless ad group (URL inclusions only, no keywords) to concentrate keywordless coverage | Avoids expansion landing randomly across narrow ad groups |
| You run a large catalog and need stock/margin/brand filtering | Use a page feed with custom labels | Catalog-scale control with scheduled refresh |

> ⚠️ **Final URL expansion is a campaign-level switch.** It cannot be on for some ad groups and off for others in the same campaign. In Mode 1, pair it with campaign URL exclusions for utility pages, then steer per ad group with URL inclusions or a page feed. If you need both open discovery and a contained keywordless set, use two campaigns (one per mode).

> ↪️ **For all keywordless setups with pros, cons, and when to choose each:** See [AI Max Keywordless Configuration Catalog](../catalogs/AI Max Keywordless Configuration Catalog.md).

---

### Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Confirm prerequisites** | Verify broad match, bidding, ads, and pages are ready | Go/no-go decision |
| **Phase 2️⃣: Confirm AI Max state and set the starting point** | Record what is on, turn AI Max off on a new campaign | Campaign at Step 1 of the sequence, AI Max off |
| **Phase 3️⃣: Configure search term matching** | Set expansion, protect ad groups that need it | Per-ad-group matching configured |
| **Phase 4️⃣: Set the Branded searches mode and negatives** | Choose the brand mode, apply negative lists | Brand mode and negatives live |
| **Phase 5️⃣: Configure final URL expansion** | Enable and constrain keywordless landing page selection | Final URL expansion constrained per the decision gate |
| **Phase 6️⃣: Set text guidelines (launch gate)** | Constrain AI-generated copy before anything goes live | Text guidelines applied |
| **Phase 7️⃣: Verify tracking and launch via experiment** | Protect measurement, isolate AI Max impact | Live AI Max campaign with a clean baseline |

---

## Phase 1️⃣: Confirm prerequisites

### 1.1 Readiness check

Verify all four conditions before proceeding:

| Condition | Check | Fail action |
|-----------|-------|-------------|
| Broad match tested | A broad match experiment has run with acceptable CPA/ROAS | Turn AI Max off, test broad match, then return to this SOP |
| Smart Bidding | Campaign uses a Smart Bidding strategy | Migrate to Smart Bidding first |
| Responsive search ads | Each ad group has at least one strong RSA | Build RSAs first |
| Landing-page readiness | Pages are maintained, relevant, and crawlable | Fix pages before enabling final URL expansion or text customization |

### 1.2 Confirm go/no-go

If all four pass, proceed. If any fails, resolve it first.

---

## Phase 2️⃣: Confirm AI Max state and set the starting point

1. Open the campaign in the Google Ads web UI
2. Go to **Campaign Settings** > **AI Max for Search campaigns**
3. Record the current state before changing anything: whether AI Max is on, and whether search term matching, text customization, and final URL expansion are on
4. Set the starting point from what you recorded:
   - **AI Max off:** the campaign is already at the starting point. Change nothing in this step
   - **AI Max on (every new Search campaign, with search term matching, text customization, and final URL expansion on underneath it):** toggle AI Max **Off**, then hold the campaign for two weeks before you read the baseline. The broad match experiment Phase 1.1 gates on runs with AI Max off
5. When you toggle AI Max **On** for the feature under test, deselect every other sub-feature in the same session. Turning AI Max on activates search term matching, text customization, and final URL expansion together, so only the feature under test stays enabled

> ⚠️ **Text customization is off unless something turns it on.** The default stance is OFF. It goes on only when (a) the configuration requires it (URL inclusions and final URL expansion force it on) or (b) you deliberately choose it for reach. Do not leave it on just because Google defaults it on.

> ⚠️ **Text customization on = the AI Max auto-upgrade cohort.** Google auto-upgrades campaigns with text customization on to AI Max on its announced schedule. Enabling text customization is opting into that upgrade: decide deliberately.

> 💡 **Launching via experiment? Skip the toggle here.** The AI Max experiment (Phase 7.2) activates AI Max for its trial arm on its own. Still work through Phases 3-6: the brand controls, negatives, exclusions, and text guidelines you set apply when AI Max is active.

> 💡 **Optional: AI Brief.** Use the AI Brief to steer AI Max with messaging, matching, and audience instructions if your campaign benefits from explicit guidance.

---

## Phase 3️⃣: Configure search term matching

### 3.1 Keep matching where it adds reach

Search term matching is the first AI Max feature to test, after the broad match experiment. Turn it on at the campaign level, deselect text customization and final URL expansion until Phases 5 and 6, and leave matching on for ad groups where broad match expansion is welcome.

### 3.2 Opt out per ad group where you need control

For any ad group running phrase or exact match for a specific control reason, turn search term matching **off at the ad group level**. This keeps AI Max active on the campaign without broadening that ad group's keywords.

1. Open the ad group
2. Go to its AI Max / search term matching setting
3. Uncheck **Use search term matching for this ad group**

> 💡 **This is the key control for exact/phrase ad groups.** You do not have to choose between AI Max and tight match-type control. Opt the specific ad groups out.

> ⚠️ **Never opt out search term matching on a keywordless URL-inclusion ad group.** Those ad groups depend on search term matching to serve. With it off, their dynamic ad targets stay "Eligible, Pending" and never activate. The opt-out is only for keyword ad groups protecting phrase or exact control.

---

## Phase 4️⃣: Set the Branded searches mode and negatives

### 4.1 Select the Branded searches mode

Go to **Campaign Settings** > **AI Max for Search campaigns** > **Branded searches** and choose the mode that matches your brand-separation strategy.
| Mode | Choose when |
|------|-------------|
| **Show ads only on unbranded searches** | Default for strict separation. Keeps AI Max off all brand traffic so your dedicated Brand campaign owns it |
| **Control branded searches with brand inclusions and exclusions** | Selective control. Add brand exclusions (campaign level) for competitor and irrelevant brands, and brand inclusions (campaign or ad group level) only where serving on a brand is a deliberate brand-defense choice |
| **Show ads on all relevant searches** | Only when you deliberately want maximum reach with no brand control |

In the controlled mode, populate the inclusion and exclusion lists. If a brand is both included and excluded, the exclusion wins.

### 4.2 Apply negative keyword lists

1. Apply your account-level and campaign-level negative keyword lists to the campaign
2. Do NOT add your own active keywords as negatives

> ⚠️ **Brand controls are the semantic net, negatives are the precise backstop.** Use both. Keep any dedicated brand or competitor campaign funded: if it runs out of budget, AI Max absorbs that traffic. See [Brand Separation Reference](../references/Brand Separation Reference.md).

---

## Phase 5️⃣: Configure final URL expansion

In Mode 1 (expansion on), enabling final URL expansion turns text customization on automatically (it is required, see Phase 6). In Mode 2 (expansion off), text customization must still be on: it is required to add URL inclusions and generates the page-matched headlines. Text customization is campaign-level, so if you want your keyword ad groups to keep it off, run the keywordless inclusions in a separate campaign instead.

### 5.1 Set campaign URL exclusions (Mode 1 only)

If you chose final URL expansion off, skip this step and go to 5.2.

1. Go to **Campaign Settings** > **AI Max for Search campaigns** > **Asset optimization** > **Final URL expansion**
2. Add URL exclusions for all utility pages (cart, checkout, contact, terms, privacy, login, account, thank-you, sitemap)

### 5.2 Apply your chosen mode

If you chose final URL expansion on, steer it per the decision gate:
| Pattern | Action |
|---------|--------|
| Well-themed ad groups | Add ad-group URL inclusions matching each ad group's creative theme |
| Over-segmented structure | Create a keywordless ad group (no keywords, URL inclusions only) for keywordless coverage |
| Large catalog | Assign a page feed at the campaign level and target by custom label at the ad group level |

If you chose final URL expansion off (scoped keywordless), turn final URL expansion off in the asset optimization panel, keep text customization on (it is required for inclusions) and search term matching on (required for the inclusions to serve, or they stay Pending), then build your keywordless ad groups. A standard ad group with no keywords and only URL inclusions serves keywordlessly on exactly those URLs. Keyword ad groups in the same campaign keep serving on their keywords.

> ↪️ **For URL inclusion/exclusion and page feed syntax:** See [Final URL Expansion & Page Feed Reference](<../references/Final URL Expansion & Page Feed Reference.md>).

> 💡 **Isolate text customization with a separate campaign.** Text customization is required for URL inclusions and is campaign-level. If you want keyword ad groups with hand-controlled RSAs (text customization off), do not mix keywordless inclusions into that campaign. Run them in a dedicated keywordless campaign (text customization on, final URL expansion off).

---

## Phase 6️⃣: Set text guidelines (launch gate)

Text customization is required when final URL expansion is on, so control it rather than disable it.

> ⚠️ **Hard launch gate: text customization on means text guidelines configured, before launch, every time.** A campaign with text customization on and no text guidelines is not launch-ready. Do not proceed to Phase 7 until this phase is complete.

1. Go to **Campaign Settings** > **AI Max for Search campaigns** > **Asset optimization** > **Text guidelines**
2. Add term exclusions (up to 25) for words you never want generated
3. Add messaging restrictions (up to 40) for concepts to avoid (competitor names, specific prices, superlatives, discontinued products). Restrictions can also define a tone of voice to adhere to, or one to avoid
4. If another campaign already carries proven guidelines, use **Copy guidelines from existing campaign** (choose replace or add to existing) instead of re-entering them
5. Save

After launch, review the Asset report and remove any generated asset that does not align with your brand.

> ⚠️ **Asset removal is campaign-wide, not per-URL.** Removing an asset removes it from every ad group and every expanded URL in the campaign, including the URL rows the report shows it against. When one page needs different copy, separate that page into its own campaign.

---

## Phase 7️⃣: Verify tracking and launch via experiment

### 7.1 Verify tracking template compatibility

Final URL expansion swaps your final URL for dynamically selected pages. Confirm your tracking template uses a valid `{lpurl}` pattern so dynamic URLs do not 404. See the tracking template section of [AI Max for Search Reference](../references/AI Max for Search Reference.md).

### 7.2 Launch via experiment to isolate impact

1. Confirm the campaign runs on broad match keywords (converted, not duplicated alongside exact/phrase, see [Keyword and Match Type Selection Guidelines](<../guidelines/Keyword and Match Type Selection Guidelines.md>)). Convert at the keyword level, never via the campaign-level broad match setting: that setting is its own AI Max auto-upgrade trigger, so use it only when you deliberately accept the upgrade
2. Set up an AI Max experiment: it splits the campaign's traffic and budget 50/50 within the existing campaign, the control arm keeps AI Max off and the trial arm turns it on. Search term matching and asset optimization activate by default in the trial arm, and the brand controls, negatives, exclusions, and text guidelines from Phases 3-6 apply when AI Max is active (See: [Experiment Configuration Reference](../references/Experiment Configuration Reference.md))
3. Isolate one layer per experiment: when the question is search term matching, disable asset optimization in the trial arm so the arms differ only in the matching layer, and test final URL expansion in its own follow-up experiment. If the campaign already runs a keywordless URL-inclusion ad group, keep asset optimization on in both arms (the inclusions require text customization) and use a custom experiment that changes only the layer under test
4. Run the experiment for 6-8 weeks (end earlier only when it reaches statistical significance)
5. Hold changes for the first two weeks to let the system learn
6. If an experiment is not possible (budget, volume, or account constraints), enable AI Max on the campaign directly and compare performance against the pre-AI Max period, treating the result as directional. On a campaign that started with AI Max on, the pre-AI Max period is the off window created in Phase 2

---

### Validation / Definition of Done

This SOP is complete when:

- [ ] Prerequisites passed (broad match tested, Smart Bidding, RSAs, landing-page readiness)
- [ ] Starting point set, meaning a new campaign has AI Max switched off before the broad match experiment, and a campaign that already had AI Max off is left as it is
- [ ] AI Max enabled on the campaign
- [ ] Search term matching left on where reach is welcome, opted out per ad group where control is needed
- [ ] Branded searches mode chosen (unbranded only for strict separation, or controlled with deliberate inclusions/exclusions)
- [ ] Negative keyword lists applied
- [ ] Campaign URL exclusions set for all utility pages
- [ ] Final URL expansion mode chosen and applied (Mode 1: expansion on and steered with inclusions/exclusions/page feed, or Mode 2: expansion off with keywordless URL-inclusion ad groups)
- [ ] Launch gate passed: text guidelines configured (term exclusions and messaging restrictions) on every campaign with text customization on
- [ ] Tracking template verified against a dynamic URL
- [ ] Launched via a 50/50 experiment against the broad match baseline (or a documented pre/post fallback), changes held for the first two weeks

---

### Exit → Entry bridge

Once AI Max is live:

| Timeframe | Action |
|-----------|--------|
| Day 1-7 | Review the search terms report (search term + headline + landing page view) for irrelevant queries and pages. Monitor Search Partner Network share |
| Week 2 | Add negatives and URL exclusions for anything irrelevant. Review the Asset report, remove off-brand generated assets |
| Week 3+ | Read the experiment arms to measure AI Max's contribution (or compare pre vs post AI Max performance if no experiment ran, directional only) |
| Ongoing | Promote high-performing discovered queries to keyword-based ad groups |

**If issues arise:**

| Issue | Route to |
|-------|----------|
| Irrelevant or competitor queries appearing | Add negatives, switch Branded searches to unbranded only or add brand exclusions, fund the brand/competitor campaign |
| Final URL expansion landing on wrong pages | Add campaign URL exclusions, tighten ad-group URL inclusions or page feed |
| Search Partner Network share spikes | Opt the campaign out of Search Partner Network |
| Off-brand generated copy | Tighten text guidelines, remove assets in the Asset report |

---

### Common failure modes

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Expansion lands on random pages | Final URL expansion enabled with no constraints | Set campaign URL exclusions and ad-group URL inclusions before scaling |
| Exact/phrase ad groups lose control | Search term matching left on everywhere | Opt those ad groups out at the ad group level |
| Off-brand generated copy | No text guidelines | Configure term exclusions and messaging restrictions before launch |
| Competitor traffic floods in | Branded searches left on "all relevant searches", or brand campaign out of budget | Set Branded searches to unbranded only or add brand exclusions, add negatives, keep the brand campaign funded |
| AI Max impact unmeasurable | Enabled directly with no experiment and no clean baseline | Launch via a 50/50 AI Max experiment against the broad match baseline |
| Layer contributions unreadable | New campaign left with AI Max on, so broad match and all three sub-features moved at once | Turn AI Max off in Phase 2, prove broad match, then enable one feature at a time with the rest deselected |
| Dynamic URLs 404 | Tracking template incompatible with `{lpurl}` | Verify the template against a dynamic URL first |

---

### Related documents

| Document | Type | Used in |
|----------|------|---------|
| [AI Max for Search Mental Model](../mental-models/AI Max for Search Mental Model.md) | Mental Model | Phases 1-2, fit, sequence, and which starting state the campaign is in |
| [AI Max for Search Reference](../references/AI Max for Search Reference.md) | Reference | All phases, setting mechanics |
| [Final URL Expansion & Page Feed Reference](<../references/Final URL Expansion & Page Feed Reference.md>) | Reference | Phase 5 control syntax |
| [AI Max Keywordless Configuration Catalog](../catalogs/AI Max Keywordless Configuration Catalog.md) | Catalog | Decision gate, Phase 5 configuration choice |
| [Brand Separation Reference](../references/Brand Separation Reference.md) | Reference | Phase 4 brand controls |
| [Negative Keyword Reference](../references/Negative Keyword Reference.md) | Reference | Phase 4 negatives |
| [Experiment Configuration Reference](../references/Experiment Configuration Reference.md) | Reference | Phase 7 experiment setup |
| [Keyword and Match Type Selection Guidelines](<../guidelines/Keyword and Match Type Selection Guidelines.md>) | Guideline | Phase 7 broad match baseline |

---

### Version details

- **Version:** 12.0
- **Last Updated:** October 2026
- **Creator:** Bob Meijer

---

### Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
