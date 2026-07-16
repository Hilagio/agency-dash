/**
 * ECOMTRADA — WAY OF WORK. The agency's actual operating philosophy: how we
 * think, the signals we watch, how we build/scale, how we create demand, and —
 * above all — how we DIAGNOSE when something breaks (nine times out of ten it
 * isn't the ads). This is made CONSULTABLE (via consult_playbook), not blanket-
 * injected, so the agent pulls the relevant part when it recognises a trigger.
 *
 * Sections are delimited by "--- TITLE ---" so the playbook parser can index them.
 */
export const ECOMTRADA_WAY_OF_WORK = `
ECOMTRADA — WAY OF WORK. This is not a checklist, it's how we think. If a rule conflicts with a principle here, the principle wins.

--- HOW WE THINK (SIX PRINCIPLES) ---
1. STEER ON PROFIT, NOT ROAS. ROAS uses revenue; a 5x ROAS on a 15% margin still loses money. Steer on POAS (profit on ad spend) wherever margin is known; know each account's break-even ROAS (1 ÷ gross margin). Above break-even we build the client's business; below it we spend their money. A pretty ROAS alone means nothing.
2. NINE TIMES OUT OF TEN, THE PROBLEM ISN'T THE ADS. Getting people to the site is the easy part. The leak is almost always the checkout, the price, the product page, the feed, or whether the product can even be bought right now. Before blaming the campaign, check whether a customer can actually complete the purchase and how soon they can have it. If you can't explain a drop from inside Google Ads, the answer is outside it.
3. SCALING IS NOT THE GOAL — THE BEST POSSIBLE RESULT IS. More budget is a lever, not a KPI. Past a point, extra budget buys worse traffic (the algorithm must spend, so it goes broad and cheap). Demand is the ceiling, not efficiency. Capture the demand that exists, then create more of it — don't pour budget into a saturated market.
4. CONCENTRATION TELLS YOU WHAT BREADTH HIDES. A broad, uniform decline (weather, seasonality, softer demand) hits everything proportionally. A concentrated collapse — a few product groups or pages at zero while others improve — means something is BROKEN, not soft. Always decompose before you conclude. This is our single most useful diagnostic instinct.
5. CHANGE WITH DISCIPLINE, OR YOU CAN'T LEARN. Every change is a hypothesis. Change one meaningful thing at a time, give it enough data, check whether it worked. When you scale budget, you clean the search terms in the same week — no exceptions. "No change" is a valid, reasoned call ("stable, previous change needs more data, re-assessing Friday"); not looking is not.
6. READ LEADING SIGNALS, NOT LAGGING ONES. Revenue and ROAS are lagging — by the time they move, the cause is a week old. Watch the leading signals below to catch problems while they're small and spot opportunities before the client asks.

--- HEALTH SIGNALS (the account is genuinely well-run) ---
- POAS above break-even and trending stable or up.
- Impression share climbing on high-intent terms without CPC running away.
- High share of spend on converting search terms (waste is low).
- New products moving TEST → PROMISING → WINNER over time.
- Demand-gen tests producing incremental conversions, not just cannibalising brand.

--- WARNING SIGNALS (investigate, do not wait) ---
- Traffic up, conversions down → NOT a demand problem, a traffic-QUALITY problem: usually over-scaling or a site/availability issue.
- Brand conversion rate dropping at flat brand spend → the best canary you have. Someone typing the client's name doesn't convert worse because you raised a budget. Almost always the site, the price, or availability — not the ads.
- Zero-conversion spend rising past ~40% of budget → search-term rot; nobody's been adding negatives while budget grew.
- Budget scaled while ROAS is below the floor → the classic self-inflicted wound. If ROAS breaks the floor, budget does NOT go up.
- A product/page with traffic and zero conversions for days → broken, mispriced, or unbuyable. Check the checkout yourself.
- CPC climbing while CR falls → you're buying broader, lower-intent traffic. Pull back.
- Google Ads conversions ≠ the client's actual orders → tracking is counting the wrong thing. Fix before trusting a single number.
- PMax eating brand traffic → brand queries served by non-brand campaigns; you pay a premium for your own name and lose measurement clarity.

--- OPPORTUNITY SIGNALS (bring these to the client before they ask) ---
- A profitable campaign capped by budget while ROAS holds → room to scale.
- A high-ROAS product with low impression share → headroom.
- A converting search term we're not bidding on → add it.
- A geo/location outperforming with almost no spend behind it → shift budget.
- A category strong enough to open a new market or language.
Finding the client a win is as much the job as fixing a problem. An account manager who only ever reports red is doing half the work.

--- THE BUILD (PHASES ARE A GUIDE, NOT A SCRIPT) ---
Move between phases on evidence, not a calendar. An account can sit in Phase 1 for months if that's where the profit is.
PHASE 0 — FOUNDATION & TRUTH (before any spend decisions): confirm the primary conversion is a REAL purchase (enhanced conversions / consent mode / server-side); reconcile Google Ads conversions against real orders — if they don't match, stop and fix it. Get real margin per product/category; compute break-even ROAS. Confirm buyability (can it be bought and delivered/attended in a useful timeframe?). Clean, complete, correct feed. Baseline = feed-only PMax + brand protection to gather clean data.
PHASE 1 — CAPTURE EXISTING DEMAND: brand protection (defend the name), high-intent search / standard shopping, feed-only PMax. Grow impression share on what already converts before chasing anything new. Review after ~€500 spend or ~30 conversions. If it works → segment (Phase 2). If not → the answer is usually Phase 0 or the diagnosis, NOT "spend more".
PHASE 2 — SEGMENT & OPTIMISE: roll out the Labelizer (Flowboost / ProductHero) — Heroes, Sidekicks, Zombies, low-budget Villains test. Optimise titles/descriptions (ProductHero Pro). Keep brand protection + standard shopping. Winners get room, drags get cut/excluded.
PHASE 3 — SCALE (with the guardrails): move to tROAS/tCPA once a campaign has ~50+ conversions to bid on. Scale proven structures to new geos/languages. Asset-based PMax for strong categories. Raise target ROAS gradually as profit allows. Scale INTO demand, not past it.
PHASE 4 — CREATE DEMAND: once existing demand is captured, the only way up is to make more of it (see demand generation).

--- SCALING GUARDRAILS (non-negotiable) ---
- The ROAS/POAS floor is a STOP CONDITION, not a suggestion. Below the agreed floor, budget does not increase — full stop. If a client wants to scale and the numbers say no, the correct answer is: "we're not scaling, ROAS is below target, here's what I'd do instead."
- Max ~20% budget increase per week (up to ~30% only when aggressively and profitably scaling). Not +100% in two days.
- Clean search terms every time you scale — budget up → negatives reviewed the same week.
- One change at a time where possible, so you can attribute the result.
- Watch for demand saturation: if each budget step buys progressively worse traffic (CR down, CPC up, zero-conv spend up), you've hit the ceiling. Stop and create demand, or fix the site.

--- DEMAND GENERATION & TESTING ---
Google Ads mostly CAPTURES existing demand (harvesting). Demand gen (Demand Gen campaigns, video, broad PMax, Meta) CREATES demand (planting). You need both; they behave completely differently.
Demand gen does NOT produce a 5x last-click ROAS on day one — judging it that way kills every good test. It works up-funnel; measure it differently:
- Start small and ring-fenced: separate campaign, separate budget, its own measurement — never mixed into the numbers you steer capture on.
- Pick the right metric: NOT last-click ROAS. Watch blended performance / MER (total revenue ÷ total spend), branded-search lift, new-customer rate, assisted conversions.
- Give it a real window: weeks, not days.
- Test one variable at a time (audience, creative angle, or channel — not all three).
- Read incrementality, not attribution: "did total revenue grow more than the extra spend?", not "what did Google attribute?".
What we test: Demand Gen campaigns (top of funnel), Video/YouTube for visual/story categories, broad PMax with brand EXCLUDED (so it finds new demand, not harvests old), Meta as a second channel measured on blended MER, new geos/languages for proven winners. Demand gen is an investment, not an efficiency play; be upfront the payoff shows up in blended numbers and brand lift, not one campaign's last-click ROAS.

--- WHEN IT'S NOT WORKING (THE DIAGNOSIS — DO THIS IN ORDER) ---
Do NOT reach for "spend more" or "lower the target". Diagnose first, in this exact order:
1. WALK THE METRIC TREE. Revenue down → is it traffic, conversion rate, or AOV? Each points somewhere completely different.
2. DECOMPOSE (Principle 4). Where is it concentrated — campaign, product, page, geo, device, search term? Broad = demand/seasonality. Concentrated = something's broken.
3. OVERLAY THE CHANGES. What did we change, and when, relative to the drop (budget, bids, targets, negatives, feed, tracking)? The first question when something breaks is always "what did we change?".
4. CHECK BUYABILITY (Principle 2). Can a customer actually buy this, and how soon can they have it? Sold out, backordered, next date weeks away — Merchant Center won't tell you this.
5. CHECK THE CANARIES. Brand CR above all. If brand converts worse, it's almost never the ads.
6. ONLY THEN form the possibilities — each with the numbers behind it and the test that would confirm or eliminate it. Never assert a single cause you're not certain of; investigate until it's clear, then act.
Common real causes that are NOT the campaign: sold-out / long-availability product, a price change, a broken or slow checkout, a feed error, a tracking change, an expired promo, a new competitor undercutting on price. Steering the campaign harder fixes none of these.

--- ROLES ---
Ownership is per client: one account owner responsible for the RESULT (not for personally doing every task — delegate freely, the responsibility stays with the owner).
- Account Manager (owner): reads the signals, makes the calls, manages pacing and guardrails, communicates clearly, and above all makes the account better than they found it.
- Feed Specialist: feed quality, ProductHero, Merchant Center health, Labelizer logic.
- Strategist: CRO, pricing and competitor analysis, the "it's not the ads" investigations, demand-gen strategy.
The measure of good account management is not how many changes were made — it's whether the account is genuinely better, whether problems were caught early, and whether opportunities were found and used.

--- TOOLS ---
Google Ads (the account). ProductHero Pro / Flowboost Labelizer (feed optimisation & product segmentation). Profit & blended MER for POAS and demand-gen measurement (WeTracked or TripleWhale preferred; TrackBee fine). Consentmo (consent mode / tracking integrity). Merchant Center (feed & product status). n8n / Slack automations (reporting, alerts, pricing sync). The account itself + the client's checkout is your most important tool — "the page loads" is not "a customer can choose a date and pay".

--- THE ONE-LINE VERSION ---
Capture the demand that exists, create more of it, steer on real profit, watch the leading signals, and when something breaks — diagnose before you touch a budget, because nine times out of ten it isn't the ads.
`.trim();
