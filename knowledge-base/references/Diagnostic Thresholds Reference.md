# Diagnostic Thresholds Reference
Created: 2026-03-31

Support_ID: REF_69
Status: Ready-to-publish
Category: Operational
Reference Type: Technical
Agent_Readable: Yes
Human_Facing: Yes
Domain: Operational
Pillar: 0

## Purpose

Consolidates all numeric diagnostic thresholds used across PPCOS skills into one reference. Each threshold defines when a metric triggers a PASS, WARN, or FAIL verdict in a diagnostic check.

---

## What this reference is / What this is NOT

**This reference:**

- Lists every quantitative threshold used in PPCOS diagnostic checks
- Organizes thresholds by domain (Keywords, Bidding, Budgets, etc.)
- Links each threshold to the skill check ID that uses it
- Provides comparison basis and severity for each threshold

**This reference does NOT:**

- Explain how to fix issues that fail thresholds (See: skill-specific SOPs and playbooks)
- Define the scoring model or grade calculation (See: SKILL_INTERFACE_CONTRACTS.md)
- Provide business strategy or methodology context (See: domain-specific Mental Models)

---

## How to read the tables

| Column | Meaning |
|--------|---------|
| **Metric** | What is measured |
| **Threshold** | The numeric trigger value |
| **Comparison** | What the metric is compared against |
| **Verdict** | PASS, WARN, or FAIL when threshold is breached |
| **Severity** | Critical (15pts), High (10pts), Medium (5pts), Low (3pts) |
| **Check ID** | The skill diagnostic that uses this threshold |

All thresholds assume a 30-day lookback window unless stated otherwise.

---

## Keywords

| Metric | Threshold | Comparison | Verdict | Severity | Check ID |
|--------|-----------|-----------|---------|----------|----------|
| Keyword spend + conversion share | >30% of campaign total | Campaign totals | Classification: Hero | N/A (classification) | KW-D05 |
| Keyword spend share vs. conversion share | Spend share >20pp above conversion share AND CPA >1.5x campaign average (or ROAS <0.7x campaign average) | Campaign averages | FAIL: Villain | High | KW-D07 |
| Keyword impressions | 0 impressions in 30 days | Absolute | FAIL: Zombie | Medium | KW-D08 |
| Keyword clicks | 0 clicks in 30 days (with impressions) | Absolute | WARN: Low performer | Medium | KW-D08 |
| Keyword spend, zero conversions | Spend >2x target CPA (or spend with 0 revenue where expected ROAS requires value), 0 conversions | Target CPA / Target ROAS | FAIL: Non-converting | High | KW-D07 |
| Broad match on Manual CPC | Any broad match keyword on Manual CPC or Max Clicks | Strategy type | FAIL | Medium | KW-D02 |
| Same keyword in multiple match types | >1 match type of same keyword in one ad group | Ad group contents | WARN | Low | KW-D03 |
| Duplicate keywords across campaigns | Exact duplicate found | Cross-campaign | WARN | Medium | KW-D10 |
| Below first page bid (Manual CPC) | Bid < estimated first page bid | Google estimate | WARN | Low | KW-D14 |
| Low volume keyword | "Low search volume" status for >30 days | Google status | WARN | Low | KW-D15 |
| Keyword performance tier shift | Tier changed vs. prior 30-day period | Prior period classification | WARN (if degraded) | Medium | KW-D09 |

---

## Search Terms

| Metric | Threshold | Comparison | Verdict | Severity | Check ID |
|--------|-----------|-----------|---------|----------|----------|
| Search term spend, zero conversions | Spend >2x target CPA (or spend with 0 revenue where expected ROAS requires value), 0 conversions | Target CPA / Target ROAS | FAIL | High | ST-D02 |
| Search term CPA/ROAS | CPA >2x campaign average (or ROAS <0.5x campaign average) | Campaign average | FAIL: Underperforming | Medium | ST-D03 |
| Irrelevant spend share | >5% of total campaign spend on irrelevant terms | Total campaign spend | FAIL | High | ST-D01 |
| Irrelevant spend share | 2-5% of total campaign spend on irrelevant terms | Total campaign spend | WARN | Medium | ST-D01 |
| Campaign without negative keywords | 0 negatives on any active campaign | Absolute | FAIL | High | ST-D06 |
| Campaign without shared negative list | No shared list linked | Absolute | WARN | Medium | ST-D07 |
| Negative keyword conflict | Negative blocks an active keyword | Keyword list | FAIL | Critical | ST-D08 |
| N-gram analysis freshness (high spend >=50K/mo) | Last analysis >30 days ago | Current date | WARN | Medium | ST-D15 |
| N-gram analysis freshness (medium spend 10-50K/mo) | Last analysis >90 days ago | Current date | WARN | Medium | ST-D15 |
| N-gram analysis freshness (low spend <10K/mo) | Last analysis >180 days ago | Current date | WARN | Medium | ST-D15 |
| Non-converting N-gram | Word pattern with >2x target CPA spend (or spend with 0 revenue where expected ROAS requires value), 0 conversions | Target CPA / Target ROAS | FAIL | High | ST-D13 |
| Inefficient N-gram | Word pattern CPA >1.75x target CPA (or ROAS <0.7x target ROAS) | Target CPA / Target ROAS | WARN | Medium | ST-D14 |
| Close variant CPA/ROAS drift | Close variant CPA >2x parent keyword CPA (or ROAS <0.5x parent keyword ROAS) | Parent keyword CPA/ROAS | FAIL | High | ST-D17 |
| Close variant spend share | Close variant spend >50% of keyword spend | Parent keyword spend | WARN | Medium | ST-D18 |
| PMax brand query share | Brand queries >30% of PMax search terms | PMax search term volume | WARN | High | ST-D25 |
| High-performing term not a keyword | 3+ conversions, CPA below campaign average, not added | Campaign average CPA | WARN: Promotion candidate | Medium | ST-D20 |

---

## Quality Score

| Metric | Threshold | Comparison | Verdict | Severity | Check ID |
|--------|-----------|-----------|---------|----------|----------|
| Impression-weighted QS average | <5.0 | Absolute | FAIL | High | QS-D01 |
| Impression-weighted QS average | 5.0-6.9 | Absolute | WARN | Medium | QS-D01 |
| Keywords with QS <=3 | >10% of active keywords | Active keyword count | FAIL | High | QS-D02 |
| High-spend keyword with QS <5 | Top 20% by spend AND QS <5 | Spend ranking | FAIL | Critical | QS-D03 |
| Any component "Below Average" | 1+ component Below Average | Google status | FAIL (for that component) | High | QS-D07/D08/D09 |
| Dominant limiting component | >50% of Below Average ratings on one component | Component distribution | WARN: Systemic issue | Medium | QS-D10 |
| Null QS keywords | >30% of keywords without QS data | Active keyword count | WARN | Low | QS-D06 |
| QS trend: declining | QS dropped by 1+ points averaged over 3 consecutive periods | Prior 3 reporting periods | WARN | Medium | QS-D15 |
| QS trend: sharply declining | QS dropped by 2+ points in one period | Prior period | FAIL | High | QS-D15 |
| Lost IS (rank) correlation with low QS | >15% IS lost to rank on campaigns with QS <6 | Campaign IS metrics | FAIL: QS dragging rank | High | QS-D20 |
| CPC premium on low-QS keywords | CPC >30% above ad group average on QS <5 keywords | Ad group average CPC | WARN | Medium | QS-D21 |

---

## Bidding

| Metric | Threshold | Comparison | Verdict | Severity | Check ID |
|--------|-----------|-----------|---------|----------|----------|
| Manual bidding on high-volume campaign | Manual CPC on campaign with 50+ conversions/month | Monthly conversion count | WARN | Medium | BID-D02 |
| Smart bidding on low-volume campaign | tCPA/tROAS on campaign with <15 conversions/month | Monthly conversion count | FAIL | High | BID-D03 |
| Smart bidding on borderline campaign | tCPA/tROAS on campaign with 15-29 conversions/month | Monthly conversion count | WARN | Medium | BID-D03 |
| Target CPA vs. breakeven | Target CPA >100% of breakeven CPA | Breakeven CPA | FAIL: Unprofitable target | Critical | BID-D05 |
| Target CPA vs. breakeven | Target CPA >80% of breakeven CPA | Breakeven CPA | WARN: Thin margin | High | BID-D05 |
| Target ROAS vs. breakeven | Target ROAS <100% of breakeven ROAS | Breakeven ROAS | FAIL: Unprofitable target | Critical | BID-D06 |
| Actual CPA/ROAS vs. target | >20% deviation sustained for 2x conversion lag (minimum 14 days) | Target CPA/ROAS | FAIL | High | BID-D08 |
| Actual CPA/ROAS vs. target | 10-20% deviation sustained for 2x conversion lag (minimum 14 days) | Target CPA/ROAS | WARN | Medium | BID-D08 |
| Learning phase duration | >14 days in "Learning" status | Strategy status | FAIL: Extended learning | High | BID-D10 |
| Changes during learning | Any campaign change within 14 days of strategy change | Change history | WARN | Medium | BID-D11 |
| Strategy change recency | Strategy changed within last 14 days | Change history | WARN: In learning | Low | BID-D13 |
| Mixed campaign types in portfolio | Portfolio strategy spans different campaign types | Campaign type | WARN | Medium | BID-D14 |
| CPC cap vs. top CPCs | CPC cap <80% of top-performing keyword CPCs | Keyword CPC distribution | WARN: Cap may limit | Medium | BID-D16 |
| Shared budget + portfolio conflict | Shared budget AND portfolio strategy on same campaigns | Budget + strategy type | WARN | Medium | BID-D17 |
| Non-zero modifiers on smart bidding | Any modifier != 0% and != -100% on smart bidding | Modifier values | WARN: Ignored by algorithm | Low | BID-D18 |
| CPC spike | CPC increase >25% vs. prior 14 days | Prior 14-day average CPC | FAIL | High | BID-D22 |
| Rising CPC trend | CPC increasing for 3+ consecutive 7-day periods | Prior 3 periods | WARN | Medium | BID-D23 |
| Bid simulator opportunity | Simulator shows >20% conversion increase at <15% cost increase | Bid simulator forecast | WARN: Opportunity | Medium | BID-D24 |
| Conversion value rules on non-VBB campaign | Value rules active but campaign not on value-based bidding | Bid strategy type | WARN | Low | BID-D25 |

---

## Budgets

| Metric | Threshold | Comparison | Verdict | Severity | Check ID |
|--------|-----------|-----------|---------|----------|----------|
| Campaign "Limited by budget" | Status shows limited | Google status | WARN (check profitability) | Medium | BUD-D01 |
| IS lost to budget | >10% IS lost to budget | Campaign IS metrics | WARN | Medium | BUD-D02 |
| IS lost to budget | >25% IS lost to budget | Campaign IS metrics | FAIL | High | BUD-D02 |
| Profitable + budget limited | CPA below target (or ROAS above target) AND IS lost to budget >10% | Target CPA/ROAS + IS metrics | FAIL: Missed opportunity | Critical | BUD-D03 |
| Unprofitable + budget limited | CPA above target (or ROAS below target) AND limited by budget | Target CPA/ROAS + Google status | WARN: Reduce first | High | BUD-D04 |
| Daily budget:CPA ratio | Daily budget <1x target CPA (or <1x revenue-implied daily target for ROAS campaigns) | Target CPA / Target ROAS | FAIL | High | BUD-D05 |
| Daily budget:CPA ratio | Daily budget 1-1.6x target CPA (or 1-1.6x revenue-implied daily target) | Target CPA / Target ROAS | WARN | Medium | BUD-D05 |
| Budget exhaustion before 6pm local | Budget depleted before 18:00 regularly (3+ days/week) | Hourly spend pattern | WARN | Medium | BUD-D06 |
| Monthly pacing: overspend | Projected spend >110% of monthly budget | Monthly budget target | WARN | Medium | BUD-D10 |
| Monthly pacing: underspend | Projected spend <90% of monthly budget | Monthly budget target | WARN | Medium | BUD-D11 |
| Performance vs. budget share misalignment | Campaign with CPA 30%+ below average (or ROAS 30%+ above average) gets <15% of budget | Account budget share | WARN: Underfunded performer | High | BUD-D13 |
| Underperformer budget share | Campaign with CPA 50%+ above average (or ROAS 50%+ below average) gets >20% of budget | Account budget share | FAIL: Overfunded waste | High | BUD-D14 |
| Zero-spend active campaign | Enabled campaign with 0 spend in 14+ days | Absolute | WARN | Medium | BUD-D16 |
| Shared budget imbalance | One campaign consuming >70% of shared budget | Shared budget total | WARN | Medium | BUD-D17 |
| Shared budget mixed objectives | Campaigns with different conversion actions on same shared budget | Conversion action config | FAIL | High | BUD-D18 |
| Shared budget + portfolio conflict | Shared budget conflicting with portfolio bid strategy | Strategy + budget type | WARN | Medium | BUD-D19 |

---

## Geographic, Schedule & Device

| Metric | Threshold | Comparison | Verdict | Severity | Check ID |
|--------|-----------|-----------|---------|----------|----------|
| Location targeting method: "Presence or interest" | Set to "Presence or interest" without justification | Targeting method setting | WARN | Medium | GS-D01 |
| Location CPA/ROAS | CPA 30%+ above account average (or ROAS 30%+ below account average) | Account average | WARN: Underperforming | Medium | GS-D02 |
| Location CPA/ROAS | CPA 50%+ above account average (or ROAS 50%+ below account average) | Account average | FAIL: High waste | High | GS-D02 |
| Zero-conversion location | 0 conversions, spend >2x target CPA (or spend with 0 revenue where expected ROAS requires value), 50+ clicks | Target CPA / Target ROAS + click count | FAIL | High | GS-D03 |
| High-performing location + IS limited | CPA 20%+ below average AND IS lost to budget >10% | Account average CPA + IS | WARN: Opportunity | Medium | GS-D04 |
| Non-target location not excluded | Serving in locations outside target set | Targeting settings | WARN | Medium | GS-D05 |
| Device CPA | Device CPA 50%+ above account average | Account average CPA | FAIL | High | GS-D06 |
| Ad schedule time slot | CPA 60%+ above average (or ROAS 60%+ below average) OR zero conversions (confirmed 4+ weeks) | Account average | FAIL: Dead time window | High | GS-D07 |
| Ad schedule pattern confirmation | Pattern observed in <4 weeks of data | Data duration | WARN: Unconfirmed | Low | GS-D08 |
| Modifier stacking | Combined location + device + schedule modifier >50% or <-50% | Combined effect | WARN: Unintended amplification | Medium | GS-D09 |
| Demographic segment CPA | CPA 50%+ above account average (age, gender, or income) | Account average CPA | WARN | Medium | GS-D10 |
| Demographic segment: sustained poor | CPA 50%+ above average for 60+ days, 100+ clicks | Account average CPA | FAIL: Exclusion candidate | High | GS-D13 |
| Seasonal geographic shift | Current period CPA deviates >30% from same period last year for a location | YoY comparison | WARN | Medium | GS-D12 |

---

## Placements

| Metric | Threshold | Comparison | Verdict | Severity | Check ID |
|--------|-----------|-----------|---------|----------|----------|
| Mobile app category not excluded | App category placements active on Display/Video/DG/PMax | Exclusion list | WARN | Medium | PL-D01 |
| Mobile app spend share (no conversions) | App spend >5% of campaign total, 0 conversions | Campaign total spend | FAIL | High | PL-D01 |
| Display placement: zero clicks | Placement with 1,000+ impressions, 0 clicks | Absolute | WARN: Invalid | Medium | PL-D02 |
| Display placement: suspiciously high CTR | Placement CTR >10% | Absolute | FAIL: Accidental clicks | High | PL-D02 |
| Display placement: high CTR, zero conversions | Placement CTR >3%, 0 conversions | Absolute | FAIL: Invalid traffic | High | PL-D02 |
| Display placement: high CPA | Placement CPA >3x campaign average | Campaign average CPA | FAIL | High | PL-D02 |
| Video: kids/children's content | Placement on known children's content | Content classification | FAIL: Brand safety | Critical | PL-D03 |
| Known-bad domain patterns | Parked domains, MFA sites, random character domains | Pattern matching | FAIL | High | PL-D04 |
| No account-level exclusion list | No exclusion list exists at account level | Account settings | FAIL | High | PL-D05 |
| Exclusion list not updated | List not updated in 90+ days | Last update date | WARN | Medium | PL-D09 |
| Exclusion list near capacity | List >80% of 65K limit | List size | WARN | Low | PL-D09 |
| Brand safety: expanded inventory | Inventory type set to "Expanded" | Inventory setting | WARN | Medium | PL-D06 |

---

## Competitive

| Metric | Threshold | Comparison | Verdict | Severity | Check ID |
|--------|-----------|-----------|---------|----------|----------|
| Impression share trajectory (short-term) | >5pp IS decline over 30 days | 30-day trend | WARN | Medium | CA-D01 |
| Impression share trajectory (long-term) | >10pp IS decline over 90 days (quarter) | 90-day trend | FAIL | High | CA-D01 |
| Combined IS loss (budget + rank) | >20% combined IS loss | Campaign IS metrics | FAIL | High | CA-D02 |
| Core competitor classification | IS >30% AND overlap rate >50% | Auction Insights | Classification: Core | N/A (classification) | CA-D03 |
| Competitor IS growth (short-term) | Core competitor IS growing >5pp over 30 days | 30-day trend | WARN | Medium | CA-D04 |
| Competitor IS growth (long-term) | Core competitor IS growing >10pp per quarter | 90-day trend | WARN | High | CA-D04 |
| Top-of-page rate decline | Absolute top IS declining >5pp over 30 days | 30-day trend | WARN | Medium | CA-D05 |
| Outranking share decline | Outranking share vs. core competitor dropped >15pp | 3-month trend | FAIL | High | CA-D06 |
| New entrant threat | New competitor appearing with IS >20% sustained 30+ days | Auction Insights history | WARN | High | CA-D12 |
| CPC-to-competition correlation | CPC rise >15% correlating with new competitor IS >15% | CPC trend + Auction Insights | WARN: Competitive pressure | Medium | CA-D11 |

---

## Waste Detection

| Metric | Threshold | Comparison | Verdict | Severity | Check ID |
|--------|-----------|-----------|---------|----------|----------|
| Mobile app placement spend | >5% of campaign spend on apps without conversions | Campaign total spend | FAIL | High | WD-D02 |
| Search Partner CPA/ROAS differential | Search Partner CPA >2x Google Search CPA (or ROAS <0.5x Google Search ROAS) | Google Search CPA/ROAS | FAIL | High | WD-D03 |
| Search Partner CPA/ROAS differential | Search Partner CPA 1.5-2x Google Search CPA (or ROAS 0.5-0.7x Google Search ROAS) | Google Search CPA/ROAS | WARN | Medium | WD-D03 |
| Display Network on Search campaign | Display Network enabled on any Search campaign | Network settings | FAIL | High | WD-D04 |
| Close variant CPA/ROAS drift | Close variant CPA >2x parent keyword CPA (or ROAS <0.5x parent keyword ROAS) | Parent keyword CPA/ROAS | FAIL | High | WD-D05 |
| Auto-applied recommendations active | Any auto-apply setting enabled without review | Account settings | WARN | Medium | WD-D06 |
| IS loss monetary value | IS lost (budget) x estimated CPC x estimated CVR x avg CPA | Calculated opportunity cost | Classification: waste estimate | N/A (quantification) | WD-D07 |
| Negative keyword gap: recurring pattern | Same irrelevant term appearing 3+ times in 30 days | Search term report | FAIL: Gap | High | WD-D08 |
| Dead time window without -100% | Confirmed zero-conversion time slot (4+ weeks) without schedule exclusion | Ad schedule + conversion data | WARN | Medium | WD-D10 |
| Non-target geographic spend | >3% of spend in locations outside targeting set | Campaign total spend | WARN | Medium | WD-D11 |
| Keyword cannibalization | Same query triggered by 3+ keywords in different campaigns | Search term overlap | WARN | Medium | WD-D12 |
| Shopping/Search/PMax overlap | Same product/query served by 2+ campaign types simultaneously | Search term + shopping reports | WARN | Medium | WD-D12 |
| Broken tracking + active spend | Conversion count dropped >80% for 3+ days while campaign is spending | Conversion trend | FAIL: Emergency | Critical | WD-D13 |
| Brand CPC vs. organic baseline | Brand CPC >3x industry organic CTR implied value | Estimated organic click value | WARN | Medium | WD-D14 |

---

## Cross-Domain Thresholds

These thresholds apply across multiple skills and domains.

| Metric | Threshold | Comparison | Verdict | Severity | Used By |
|--------|-----------|-----------|---------|----------|---------|
| Conversion volume drop | >50% drop vs. prior 7-day average | Rolling 7-day average | FAIL: Tracking incident | Critical | TRK-D10, WD-D13, MON-D01 |
| Data freshness: account data | >7 days since last data pull | Current date | WARN: Stale data | Medium | All skills |
| Minimum evaluation window | <2x conversion lag | Conversion lag days | WARN: Premature evaluation | Medium | BID-D08, BUD-D09, GS-D08 |
| Statistical confidence for decisions | <80% confidence (standard). Below 80%: directional only (non-significant) | Statistical test | WARN: Insufficient data | Medium | All diagnostic skills |
| Minimum click threshold for judgment | <50 clicks on entity being evaluated | Click count | SKIP: Insufficient data | N/A | KW-D07, ST-D02, GS-D03, PL-D02 |
| Minimum spend threshold for judgment | Spend <1x target CPA (or <1x revenue-implied spend for ROAS campaigns) on entity being evaluated | Target CPA / Target ROAS | SKIP: Insufficient data | N/A | KW-D07, ST-D02, GS-D02 |

---

## Feed & Shopping

| Metric | Threshold | Comparison | Verdict | Severity | Check ID |
|--------|-----------|-----------|---------|----------|----------|
| Product disapproval rate | >5% of active products disapproved | Total active product count | FAIL | High | FD-D03 |
| Product disapproval rate | 2-5% disapproved | Total active product count | WARN | Medium | FD-D03 |
| Product warning rate | >10% of active products with warnings | Total active product count | WARN | Medium | FD-D04 |
| Title length utilization | Average title length <40% of 150-char limit (<60 chars) | 150-character limit | WARN | Medium | FD-D10 |
| Title length utilization | Average title length <25% of limit (<38 chars) | 150-character limit | FAIL | High | FD-D10 |
| Product count spike | >20% increase in product count overnight (unplanned) | Prior day count | WARN | Medium | FD-D29 |
| Product count drop | >10% decrease in product count (unplanned) | Prior day count | FAIL: Possible feed error | High | FD-D30 |
| High-volume product stopped | Top 10% products by revenue no longer serving | Revenue ranking | FAIL | Critical | FD-D31 |
| Inventory sync: out-of-stock served | >3% of clicks going to out-of-stock products | Total Shopping clicks | FAIL | High | FD-D32 |
| Inventory sync: out-of-stock served | 1-3% clicks to out-of-stock | Total Shopping clicks | WARN | Medium | FD-D32 |
| Price competitiveness | Product price >20% above benchmark competitors | Price comparison data | WARN | Medium | FD-D33 |
| Sale price badge eligibility | Sale price not set on products that have regular promotions | Product feed | WARN: Missed badge | Low | FD-D34 |
| Product ROAS/CPA | Product ROAS <0.5x campaign average (or CPA >2x campaign average), spend >2x target CPA (or spend with 0 revenue where expected ROAS requires value) | Campaign average ROAS/CPA | FAIL: Low-ROAS waste | High | PO-D04 |
| Zero-impression products | >20% of active products with 0 impressions in 30 days | Active product count | WARN | Medium | PO-D02 |
| Zero-impression products | >40% of active products with 0 impressions in 30 days | Active product count | FAIL | High | PO-D02 |

---

## Performance Max

| Metric | Threshold | Comparison | Verdict | Severity | Check ID |
|--------|-----------|-----------|---------|----------|----------|
| Zero-impression asset groups | Asset group with 0 impressions for 14+ days | Absolute | FAIL | High | PMX-D04 |
| Low visibility assets | Asset with <5% of asset group impressions (AIS <5%) after 5,000+ total impressions | Asset group total | WARN: Near-zero serving | Medium | PMX-D06 |
| Creative concentration | Single asset serving >60% of asset group impressions (AIS >60%) | Asset group total | WARN: Over-rotation | Medium | PMX-D07 |
| Low-visibility cluster | 3+ assets below 5% AIS in same asset group | Asset group distribution | WARN: Multiple underserved | Medium | PMX-D07 |
| Channel allocation: Shopping declining | Shopping % of PMax spend declined >10pp over 30 days | Prior 30-day trend | WARN | Medium | PMX-D09 |
| Minimum Shopping allocation | Shopping channel <30% of PMax spend on ecommerce account | PMax total spend | WARN | High | PMX-D10 |
| Minimum Shopping allocation | Shopping channel <15% of PMax spend on ecommerce account | PMax total spend | FAIL: Search/Display cannibalizing | High | PMX-D10 |
| Brand vs non-brand CPA gap | Brand CPA <30% of non-brand CPA within PMax | PMax non-brand CPA | WARN: Brand inflating performance | Medium | PMX-D19 |
| Non-converting landing pages | Landing page with 50+ clicks, 0 conversions from PMax | Absolute | FAIL | High | PMX-D16 |
| NCA value premium | New customer value premium set but new customer CPA >2x returning | Returning customer CPA | WARN: Premium too aggressive | Medium | PMX-D22 |

---

## Video

| Metric | Threshold | Comparison | Verdict | Severity | Check ID |
|--------|-----------|-----------|---------|----------|----------|
| View rate (skippable in-stream) | <10% sustained for 14+ days | Absolute | FAIL | High | VID-D17 |
| View rate (skippable in-stream) | 10-15% sustained | Absolute | WARN | Medium | VID-D17 |
| View rate (non-skippable) | Watch completion <25% | Absolute | WARN: Creative issue | Medium | VID-D17 |
| CPV (skippable in-stream) | CPV >2x target CPV or bid | Target CPV | FAIL | High | VID-D18 |
| CPV (skippable in-stream) | CPV 1.5-2x target | Target CPV | WARN | Medium | VID-D18 |
| CTR on action campaigns (TrueView for Action) | CTR <0.3% after 14+ days | Absolute | FAIL | High | VID-D19 |
| CTR on action campaigns | 0.3-0.5% after 14+ days | Absolute | WARN | Medium | VID-D19 |
| Video frequency (per user per week) | >10 impressions/user/week | User frequency data | WARN: Fatigue risk | Medium | VID-D10 |
| Creative freshness | Same creative running >90 days without refresh | Campaign start date | WARN | Low | VID-D08 |

---

## Demand Gen

| Metric | Threshold | Comparison | Verdict | Severity | Check ID |
|--------|-----------|-----------|---------|----------|----------|
| Seed audience size | <1,000 users | Absolute | FAIL: Below Google minimum | High | DG-D01 |
| Seed audience size | 1,000-5,000 users | Absolute | WARN: Functional but limited | Medium | DG-D01 |
| Seed freshness | List not updated in >90 days | Current date | FAIL | High | DG-D03 |
| Seed freshness | List not updated in 30-90 days | Current date | WARN | Medium | DG-D03 |
| Demand Gen CPM | CPM >€15 (or local equivalent) sustained | Absolute | WARN: Above range (typical €5-15) | Medium | DG-D17 |
| Demand Gen CTR | <0.2% sustained for 14+ days | Absolute | FAIL | High | DG-D18 |
| Demand Gen CTR | 0.2-0.5% sustained | Absolute | WARN | Medium | DG-D18 |
| Demand Gen CPA/ROAS vs target | CPA >2x Demand Gen target (or ROAS <0.5x target) after learning period (2x conversion lag, minimum 30 days) | Demand Gen tCPA/tROAS | FAIL | High | DG-D19 |
| Demand Gen CPA/ROAS vs target | CPA 1.5-2x Demand Gen target (or ROAS 0.5-0.7x target) after learning | Demand Gen tCPA/tROAS | WARN | Medium | DG-D19 |
| Conversions per ad group per month | <30 conversions/ad group/month on Target CPA | Monthly conversion count | WARN: Insufficient signal | Medium | DG-D01 |
| Creative freshness | Same creative set running >60 days without refresh | Campaign start date | WARN | Low | DG-D07 |

---

## Audiences

| Metric | Threshold | Comparison | Verdict | Severity | Check ID |
|--------|-----------|-----------|---------|----------|----------|
| Audience list minimum size (Search) | <1,000 members | Absolute | FAIL: Below Google minimum | High | AUS-D03 |
| Audience list minimum size (Display/Video) | <100 members | Absolute | FAIL: Below Google minimum | High | AUS-D03 |
| Customer Match match rate | <40% match rate | Upload records | FAIL: Data quality issue (typical 60-80%) | High | AUS-D06 |
| Customer Match match rate | 40-55% match rate | Upload records | WARN: Below typical (60-80%) | Medium | AUS-D06 |
| Audience list freshness | Customer Match list not updated in >90 days | Current date | FAIL | High | AUS-D04/D07 |
| Audience list freshness | Customer Match list not updated in 30-90 days | Current date | WARN | Medium | AUS-D04/D07 |
| Remarketing list freshness | Website visitor list not refreshing (tag issue) | Expected refresh cadence | FAIL | High | AUS-D04 |
| Unknown demographic spend | >25% of campaign spend on "Unknown" age, gender, or income | Campaign total spend | WARN | Medium | AUS-D14 |
| Unknown demographic spend | >40% on "Unknown" | Campaign total spend | FAIL: Targeting blind spot | High | AUS-D14 |
| Excessive ad frequency | >15 impressions/user/week on Display | User frequency data | WARN: Fatigue | Medium | AUS-D17 |
| Excessive ad frequency | >20 impressions/user/week on Display | User frequency data | FAIL: Waste | High | AUS-D17 |
| Membership duration vs buying cycle | Remarketing window <7 days for high-consideration product (avg cycle >30 days) | Business buying cycle | WARN: Too short | Medium | AUS-D11 |

---

## Ad Copy & Creative

| Metric | Threshold | Comparison | Verdict | Severity | Check ID |
|--------|-----------|-----------|---------|----------|----------|
| Low visibility headline | Headline AIS <5% after 5,000+ total ad impressions | Asset group total impressions | WARN: Near-zero serving | Medium | AD-D04 |
| Low visibility description | Description AIS <5% after 5,000+ total ad impressions | Asset group total impressions | WARN: Near-zero serving | Medium | AD-D05 |
| Creative concentration | Single headline serving >60% of impressions (AIS >60%) | Ad total impressions | WARN: Over-rotation | Medium | AD-D07 |
| Test duration minimum | A/B test concluded in <14 days | Test start date | WARN: Premature | Medium | AD-D21 |
| Test duration minimum | A/B test concluded in <7 days | Test start date | FAIL: Invalid test | High | AD-D21 |
| Falling CTR detection | RSA CTR declined >20% vs prior 30-day average for 14+ days | Prior 30-day CTR | WARN | Medium | AD-D22 |
| Falling CTR detection | RSA CTR declined >40% vs prior 30-day average | Prior 30-day CTR | FAIL: Creative fatigue | High | AD-D22 |
| Silent Killer asset | AIS >25% AND CPI/RPI below cluster average (or ad-level average if no cluster), 5,000+ impressions | Cluster/ad average CPI/RPI | FAIL: Remove immediately | Critical | AD-D06 |
| Hidden Gem asset | AIS <15% AND CPI/RPI above cluster average (or ad-level average), 3,000+ impressions | Cluster/ad average CPI/RPI | WARN: Opportunity (pin to increase visibility) | Medium | AD-D06 |
| CPI/RPI decline | CPI/RPI declining 2+ consecutive weeks | Prior 2-week trend | WARN: Creative fatigue | Medium | AD-D22 |
| Creative freshness (Display) | Same ad creatives running >60 days without refresh | Creative upload date | WARN | Low | DSP-D13 |

---

## Extensions

| Metric | Threshold | Comparison | Verdict | Severity | Check ID |
|--------|-----------|-----------|---------|----------|----------|
| Low-performing sitelink | Sitelink CTR <50% of ad-level CTR after 1,000+ impressions | Ad-level CTR | WARN | Medium | EXT-D22 |
| Low-performing sitelink | Sitelink with 0 clicks after 5,000+ impressions | Absolute | FAIL: Replace | High | EXT-D22 |
| Extension impression share | Extensions showing on <50% of eligible impressions | Eligible impression count | WARN | Medium | EXT-D23 |
| Extension impression share | Extensions showing on <25% of eligible impressions | Eligible impression count | FAIL: Configuration issue | High | EXT-D23 |

---

## Monitoring & Anomaly Detection

Sourced from Account Monitoring Mental Model and Post-Launch Monitoring Reference. These apply to daily-monitor skill (MON) checks.

**Lookback windows for monitoring are conversion-lag-dependent.** Default = max(7 days, 2x conversion lag). Configure via `ads-context.config.json`. The values below use "rolling window" to mean this configurable lookback.

| Metric | Threshold | Comparison | Verdict | Severity | Check ID |
|--------|-----------|-----------|---------|----------|----------|
| CPA spike | CPA >30% above rolling window average | Rolling window average (default: max(7d, 2x conv lag)) | WARN | Medium | MON-D01 |
| CPA spike | CPA >50% above rolling window average | Rolling window average | FAIL | High | MON-D01 |
| ROAS drop | ROAS >25% below rolling window average | Rolling window average | WARN | Medium | MON-D02 |
| ROAS drop | ROAS >40% below rolling window average | Rolling window average | FAIL | High | MON-D02 |
| CPC surge | CPC >25% above rolling window average | Rolling window average | WARN | Medium | MON-D05 |
| CTR decline | CTR >20% below rolling window average | Rolling window average | WARN | Medium | MON-D06 |
| CTR decline | CTR >50% below rolling window average | Rolling window average | FAIL: Possible ad issue | High | MON-D06 |
| IS collapse | IS dropped >10pp in rolling window | Prior period IS | WARN | Medium | MON-D07 |
| IS collapse | IS dropped >20pp in rolling window | Prior period IS | FAIL | High | MON-D07 |
| Budget exhaustion timing | Budget consistently depleted before 6pm local (3+ days/week) | Daily spend pattern | WARN | Medium | MON-D09 |
| Severe pacing alert | Projected monthly spend >130% or <70% of budget | Monthly budget target | FAIL | High | MON-D10 |

---

## Threshold Calibration Notes

1. **All CPA/ROAS thresholds assume the target is correctly set.** If target CPA/ROAS is not configured, use breakeven CPA or breakeven ROAS as the reference point. (See: [Bid Targets Reference](../references/Bid Targets Reference.md))

2. **Percentage thresholds are defaults.** Skills should allow threshold overrides via `config/ads-context.config.json` for accounts with non-standard economics (high-value B2B, seasonal businesses, low-volume verticals).

3. **Lookback windows:** Unless stated, thresholds use 30-day lookback. Performance-based thresholds (CPA/ROAS deviation, anomaly detection) use `max(7 days, 2x conversion lag)` as the rolling window. Configure via `ads-context.config.json`. Other exceptions: learning phase (14 days), QS trends (3 reporting periods), seasonal (YoY), exclusion list freshness (90 days), N-gram freshness (spend-dependent: 30/90/180 days).

6. **CPA and ROAS equivalence:** All CPA-based thresholds have a ROAS equivalent. When the account uses Target ROAS bidding, evaluate using the ROAS threshold instead of CPA. The ROAS multiples use clean round numbers consistent across the OS: 0.5x (severe), 0.7x (inefficient). Do not mix CPA and ROAS evaluation on the same entity: pick the metric that matches the bid strategy.

4. **Severity assignment logic:**
   - **Critical (15pts):** Actively losing money or broken tracking
   - **High (10pts):** Significant waste or missed opportunity, fix within current optimization cycle
   - **Medium (5pts):** Optimization opportunity, schedule for next cycle
   - **Low (3pts):** Best practice deviation, address when capacity allows

5. **SKIP conditions:** When data is insufficient to make a judgment (below minimum click/spend thresholds), diagnostics should SKIP rather than PASS. SKIP removes the check from the denominator so it does not inflate scores.

---

## Related documents

| Document | Relationship |
|----------|-------------|
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Bid strategy volume minimums (complementary, not duplicated) |
| [Bid Targets Reference](../references/Bid Targets Reference.md) | Breakeven calculations that anchor CPA/ROAS thresholds |
| [Quality Score Reference](../references/Quality Score Reference.md) | QS scale interpretation |
| [Budget Pacing Reference](../references/Budget Pacing Reference.md) | Budget mechanics behind budget thresholds |
| [Auction Insights Reference](../references/Auction Insights Reference.md) | Competitive metrics behind IS thresholds |
| [Improve Quality Score](../playbooks/Improve Quality Score.md) | Routes QS findings to correct fix |
| [Diagnostic Logic Patterns Reference](../references/Diagnostic Logic Patterns Reference.md) | Non-numeric diagnostic logic (classification, pattern matching, skip conditions) |
| [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md) | Video/Display/DG benchmarks that source monitoring thresholds |
| [Demand Gen Performance Reference](../references/Demand Gen Performance Reference.md) | Demand Gen CPM/CTR/CPA ranges |
| [Frequency Capping Reference](../references/Frequency Capping Reference.md) | Frequency limits by campaign type |

---

## Version details

- **Version:** 2.0
- **Last Updated:** April 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

(c) 2026 PPC Mastery B.V. All rights reserved.
