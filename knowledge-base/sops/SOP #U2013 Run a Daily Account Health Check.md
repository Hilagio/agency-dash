# SOP – Run a Daily Account Health Check
Created: 2026-02-11

Agent_Executable: No
Category: Monitoring
Human_Approval_Required: No
Primary Outcome: Daily triage complete with breakage identified and flagged
SOP_ID: SOP_61
Secondary Outcomes: Urgent issues fixed, weekly review notes pre-populated
Status: Done
Domain: Operational
Pillar: 0

## Purpose

This SOP guides you through a 10-15 minute daily triage scan that catches broken tracking, disapproved ads, budget anomalies, and delivery issues before they cause significant damage.

> ❓ **The big question:** Did anything major break overnight, and do I need to take immediate action?

Daily monitoring is not about optimization. It's about damage prevention. You scan for breakage, flag issues, and move on. Diagnosis happens during the weekly review.

---

## What this SOP is NOT

This SOP does **not:**

- Replace weekly performance reviews (See: [SOP – Run a Weekly Performance Review](../sops/SOP – Run a Weekly Performance Review.md))
- Diagnose root causes of performance changes (See: [SOP – Investigate Performance Anomalies](../sops/SOP – Investigate Performance Anomalies.md))
- Cover monthly strategic analysis (See: [SOP – Run a Monthly Performance Review](../sops/SOP – Run a Monthly Performance Review.md))

## When to run this SOP

Run this SOP:

- Every business day, ideally at the same time each morning
- After launching new campaigns (daily for the first 7-14 days)
- After making significant account changes (budgets, tracking, bid strategies)

---

## Before you start

### Required inputs

- Access to Google Ads account
- Knowledge of expected daily spend levels per campaign
- Knowledge of expected daily conversion volumes

### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Account Health Checklist](../checklists/Account Health Checklist.md) | Check items |
| [Anomaly Detection Mental Model](../mental-models/Anomaly Detection Mental Model.md) | Signal vs. noise classification |

### Time allocation

| Section | Time |
|---------|------|
| Phase 1: Conversion tracking | 2 min |
| Phase 2: Budget and delivery | 3 min |
| Phase 3: Disapprovals and URLs | 3 min |
| Phase 4: Anomaly scan | 3 min |
| Phase 5: Log and flag | 2 min |
| **Total** | **13 min** |

> ⚠️ **Hard cap: 15 minutes:** If daily triage regularly takes longer, your alert configuration needs improvement. Automate detection so you spend time on action, not scanning.

---

## Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Conversion tracking** | Verify tracking is functional | Tracking status: OK or BROKEN |
| **Phase 2️⃣: Budget and delivery** | Check pacing and spend | Budget status: OK or FLAG |
| **Phase 3️⃣: Disapprovals and URLs** | Catch policy violations and broken pages | List of disapprovals and URL issues |
| **Phase 4️⃣: Anomaly scan** | Spot unusual patterns | Flagged anomalies for weekly review |
| **Phase 5️⃣: Log and flag** | Document findings | Triage log entry |

---

## Phase 1️⃣: Conversion Tracking (2 min)

### 1.1 Check conversion action status

1. Navigate to Goals > Conversions > Summary
2. Verify all primary conversion actions show "Recording conversions"
3. Check that no conversion actions show "No recent conversions" or "Inactive"

### 1.2 Quick volume check

1. Check yesterday's total conversion count at the account level
2. Compare to typical daily conversion volume

| Finding | Action |
|---------|--------|
| Volume within normal range | Proceed |
| Volume lower than expected but not zero | Flag for weekly review |
| Volume is zero or near zero | Immediate investigation: check tag health |

> ⚠️ **Zero conversions is always urgent:** If a normally-converting account shows zero conversions, stop the triage and investigate tracking immediately.

---

## Phase 2️⃣: Budget and Delivery (3 min)

### 2.1 Check campaign spend

1. Navigate to Campaigns view
2. Sort by Cost (descending) for yesterday's date
3. Scan for campaigns spending significantly more or less than expected

| Finding | Action |
|---------|--------|
| Spend within ±20% of expected | Normal |
| Spend >120% of expected | Check if budget was changed, flag if not |
| Spend is €0 on an active campaign | Check campaign status, bid strategy, ad eligibility |

### 2.2 Check budget limitations

1. Add "Search impr. share" and "Search lost IS (budget)" columns
2. Scan for campaigns newly limited by budget that were not previously

| Finding | Action |
|---------|--------|
| Expected budget limitation | Normal |
| New budget limitation on a priority campaign | Flag for weekly review |

### 2.3 Check monthly pacing

1. Compare month-to-date spend to expected spend for this point in the month
2. If overpacing by >10%, note for weekly review

---

## Phase 3️⃣: Disapprovals and URLs (3 min)

### 3.1 Check ad disapprovals

1. Navigate to Ads & Assets > Ads
2. Filter by Status: "Disapproved" or "Approved (limited)"
3. Scan for new disapprovals since yesterday

| Finding | Action |
|---------|--------|
| No new disapprovals | Proceed |
| New disapprovals on low-volume ads | Note, fix during weekly review |
| New disapprovals on high-volume ads | Fix today or escalate |

### 3.2 Check asset disapprovals

1. Navigate to Ads & Assets > Assets
2. Filter by Status: "Disapproved"
3. Check for newly disapproved sitelinks, callouts, or images

### 3.3 Spot-check landing pages

1. Click through 2-3 high-volume ads to verify landing pages load
2. Check that landing page content matches ad messaging

> 💡 **Automate URL monitoring:** If your account has many landing pages, use a URL monitoring script or tool rather than manual spot-checks. Manual spot-checks are a safety net, not a primary detection method.

---

## Phase 4️⃣: Anomaly Scan (3 min)

### 4.1 Check Change History

1. Navigate to Change History
2. Filter to "Yesterday"
3. Scan for unexpected changes: auto-applied recommendations, system changes, or changes by other users

| Finding | Action |
|---------|--------|
| Only your own changes | Normal |
| Auto-applied recommendations | Review what was changed, revert if needed |
| Unknown user changes | Investigate who made changes and why |

### 4.2 Scan for delivery anomalies

1. Review campaign-level impression and click data for yesterday
2. Compare to prior day and same day last week
3. Flag any campaigns with >40% deviation

### 4.3 Check bid strategy status

1. Navigate to bid strategies
2. Verify all strategies show "Eligible" or expected "Learning" status
3. Flag any "Limited" or "Misconfigured" strategies

---

## Phase 5️⃣: Log and Flag (2 min)

### 5.1 Document findings

Record your daily triage using this format:

```
Daily Triage — [Date]
Account: [Name]
Time: [X] minutes

Tracking: OK / ISSUE: [details]
Budget: OK / FLAG: [details]
Disapprovals: None / [count] new: [details]
Anomalies: None / FLAG: [details]
Changes made: None / [details]

For weekly review:
- [Flagged item 1]
- [Flagged item 2]
```

### 5.2 Take immediate action on critical items

| Critical issue | Immediate action |
|---------------|-----------------|
| Tracking broken | Investigate and fix now |
| High-volume ad disapproved | Fix or appeal now |
| Dramatic spend anomaly with no explanation | Pause or adjust now, investigate |
| Bid strategy misconfigured | Fix configuration now |

All other flagged items go to the weekly review.

---

## Validation & definition of done

This SOP is complete when:

- [ ] All six checklist categories scanned (tracking, budget, bids, disapprovals, URLs, anomalies)
- [ ] Critical issues addressed immediately
- [ ] Non-critical flags documented for weekly review
- [ ] Triage log entry completed
- [ ] Total time under 15 minutes

---

## Exit → Entry bridge

After daily triage:

| Timeframe | Action |
|-----------|--------|
| Same day | Fix any critical issues identified |
| This week | Address flagged items during weekly review |
| Weekly review | Review triage logs for recurring patterns |

**If critical issues are found:**

| Issue | Route to |
|-------|----------|
| Tracking broken | Investigate immediately, fix tag/pixel |
| Ads disapproved | [SOP – Resolve Ad Disapprovals](../sops/SOP – Resolve Ad Disapprovals.md) |
| Performance anomaly | [SOP – Investigate Performance Anomalies](../sops/SOP – Investigate Performance Anomalies.md) |

---

## Quick reference: Support library

| Document | Type | Used in |
|----------|------|---------|
| [Account Health Checklist](../checklists/Account Health Checklist.md) | Checklist | All phases |
| [Anomaly Detection Mental Model](../mental-models/Anomaly Detection Mental Model.md) | Mental Model | Phase 4 |
| [Optimization Cadence Mental Model](../mental-models/Optimization Cadence Mental Model.md) | Mental Model | Cadence alignment |
| [Budget Pacing Reference](../references/Budget Pacing Reference.md) | Reference | Phase 2 |

---

## Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Run a Weekly Performance Review](../sops/SOP – Run a Weekly Performance Review.md) | Downstream (weekly review uses daily flags) |
| [SOP – Resolve Ad Disapprovals](../sops/SOP – Resolve Ad Disapprovals.md) | Conditional (if disapprovals found) |
| [SOP – Investigate Performance Anomalies](../sops/SOP – Investigate Performance Anomalies.md) | Conditional (if anomaly detected) |
| [SOP – Configure Account Alerts](../sops/SOP – Configure Account Alerts.md) | Upstream (alerts reduce manual scanning) |

---

## Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Triage takes 30+ minutes | Scanning too deeply, diagnosing instead of flagging | Strict 15-minute cap, flag and move on |
| Skipping daily triage | "Nothing ever changes" mindset | Set calendar reminder, treat as non-negotiable |
| Diagnosing during triage | Investigating a flagged issue instead of logging it | Log it, investigate during weekly review |
| Missing auto-applied changes | Not checking Change History | Include Change History scan every day |
| Alert fatigue from bad configuration | Too many false-positive alerts | Tune alert thresholds to reduce noise |

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
