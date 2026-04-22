# SOP – Resolve Ad Disapprovals
Created: 2026-02-11
Updated: 2026-04-02

Agent_Executable: No
Category: Compliance
Human_Approval_Required: No
Primary Outcome: All disapproved ads and assets resolved (fixed, appealed, or replaced)
SOP_ID: SOP_66
Secondary Outcomes: Policy violations documented, prevention measures applied
Status: Done
Domain: Operational
Pillar: 0

## Purpose

This SOP guides you through identifying, diagnosing, and resolving ad and asset disapprovals in Google Ads to restore full ad serving as quickly as possible.

> ❓ **The big question:** Why was this ad disapproved, and what's the fastest path to getting it approved and serving again?

Disapprovals reduce impression volume, can indicate policy compliance issues, and in severe cases can lead to account suspension. Resolve them promptly.

---

## What this SOP is NOT

This SOP does **not:**

- Cover account-level suspension resolution (requires direct Google support contact)
- Provide Google Ads policy documentation (reference Google's policy center directly)
- Replace proactive ad compliance review during ad creation

## When to run this SOP

Run this SOP:

- When daily monitoring reveals new disapprovals
- When disapproval alerts fire
- When ad group impressions drop to zero unexpectedly
- As part of monthly review when outstanding disapprovals exist

---

## Before you start

### Required inputs

- Google Ads account access
- Knowledge of which ads/assets are disapproved
- Understanding of the ad's intended message and landing page

### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md) | Disapproval categories |
| Google Ads Policy Center (support.google.com/adspolicy) | Policy details |

---

## Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Identify** | Find all disapproved entities | Complete disapproval inventory |
| **Phase 2️⃣: Diagnose** | Understand why each was disapproved | Root cause per disapproval |
| **Phase 3️⃣: Resolve** | Fix, appeal, or replace | All disapprovals addressed |
| **Phase 4️⃣: Prevent** | Apply prevention measures | Reduced future disapprovals |

---

## Phase 1️⃣: Identify (5 min)

### 1.1 Check ad disapprovals

1. Navigate to Ads & Assets > Ads
2. Filter by "Policy approval status: Disapproved" and "Policy approval status: Approved (limited)"
3. Sort by impressions (descending) to prioritize high-impact disapprovals
4. Record all disapproved ads:

| Campaign | Ad group | Ad type | Status | Policy issue | Impact |
|----------|----------|---------|--------|-------------|--------|
| ___ | ___ | RSA/RDA | Disapproved / Limited | ___ | High / Med / Low |

### 1.2 Check asset disapprovals

1. Navigate to Ads & Assets > Assets
2. Filter by "Policy approval status: Disapproved"
3. Record disapproved assets:

| Asset type | Asset text/image | Policy issue |
|-----------|-----------------|-------------|
| ___ | ___ | ___ |

### 1.3 Check ad group impact

For each disapproved ad, check if the ad group has other eligible ads:

| Ad group | Total ads | Eligible ads | Risk |
|----------|----------|-------------|------|
| ___ | ___ | ___ | Zero ads = Critical / Low ads = High / Adequate = Low |

> ⚠️ **Ad groups with zero eligible ads cannot serve:** Prioritize these above all others.

---

## Phase 2️⃣: Diagnose (5-10 min)

### 2.1 Read the policy violation

1. Click on the disapproved ad
2. Read the specific policy violation cited
3. Click through to the policy documentation for details

### 2.2 Common disapproval categories and causes

| **Policy category** | **Common trigger** | **Resolution** |
|---------------------|-------------------|----------------------|
| **Misleading content** | Exaggerated claims, unrealistic promises | Rewrite ad copy with accurate claims |
| **Trademark** | Using a trademarked term you're not authorized for | Remove the trademark term or apply for authorization |
| **Destination mismatch** | Final URL doesn't match display URL domain | Correct URL or display path |
| **Malware/unwanted software** | Landing page flagged by Google's scanner | Fix landing page security issues |
| **Healthcare/pharma** | Medical claims without certification | Obtain certification or remove claims |
| **Financial services** | Credit, loan, or investment claims | Verify compliance with financial advertising policies |
| **Adult content** | Suggestive imagery or language | Review and adjust creative |
| **Editorial** | Punctuation, capitalization, or formatting issues | Fix the specific editorial issue |
| **Broken destination** | 404 error or redirect chain on landing page | Fix the landing page URL |
| **Restricted content** | Alcohol, gambling, or other restricted categories | Apply for certification or adjust messaging |

### 2.3 Determine resolution path

| Situation | Resolution path |
|-----------|----------------|
| Policy violation is legitimate (your ad does violate the policy) | Edit the ad to comply |
| Policy violation is a false positive (your ad complies with policy) | Appeal the disapproval |
| Policy requires certification you don't have | Apply for certification or rewrite without restricted claims |
| Landing page issue (not ad copy) | Fix the landing page first |

---

## Phase 3️⃣: Resolve (10-20 min)

### 3.1 Edit and resubmit (for legitimate violations)

1. Click on the disapproved ad
2. Click "Edit" to create a new version
3. Address the specific policy violation:
   - Remove or rephrase the violating text
   - Replace the image if it was flagged
   - Update the URL if destination was the issue
4. Save the new ad
5. The new ad enters review (typically 1 business day)

> 💡 **Create a new ad rather than editing in place when possible:** This preserves performance data on the original ad and gives you a clean review path.

### 3.2 Appeal (for false positives)

1. Click on the disapproved ad
2. Click "Appeal" or "Request review"
3. Provide a clear explanation of why the ad complies with policy
4. Wait for review (typically 1-3 business days)

**When to appeal:**
- Your ad clearly complies with the cited policy
- The violation appears to be from automated review misclassification
- You have documentation supporting compliance (e.g., trademark authorization)

**When NOT to appeal:**
- Your ad does violate the policy (even if you disagree with the policy)
- The same ad has been disapproved and appeal denied before
- The violation is editorial (faster to fix than appeal)

### 3.3 Replace (when editing is insufficient)

If the policy constraint prevents your intended message:

1. Create a completely new ad with compliant messaging
2. Maintain the core value proposition while avoiding policy triggers
3. Pause the disapproved ad
4. Monitor the new ad's review status

### 3.4 Fix landing page issues

If the disapproval is destination-related:

1. Check the landing page URL for 404s, redirects, or security issues
2. Fix the landing page (this may require developer involvement)
3. Request ad re-review after the landing page is fixed
4. Verify the fix by clicking through the ad's final URL

---

## Phase 4️⃣: Prevent (5 min)

### 4.1 Document the pattern

Record the disapproval pattern for future reference:

| Date | Policy | Trigger | Resolution | Prevention |
|------|--------|---------|------------|------------|
| ___ | ___ | ___ | Edit / Appeal / Replace | ___ |

### 4.2 Apply prevention measures

| Prevention measure | When to apply |
|-------------------|---------------|
| Pre-review ad copy against policy center | Before creating new ads |
| Use Google's Ad Preview tool | Before submitting ads with sensitive content |
| Monitor landing page health | Daily (URL checks) |
| Maintain trademark authorizations | Annually or when trademarks change |
| Avoid superlative claims without evidence | Always |

---

## Validation & definition of done

This SOP is complete when:

- [ ] All disapproved ads and assets identified
- [ ] Each disapproval diagnosed (policy violation identified)
- [ ] Each disapproval resolved (edited, appealed, or replaced)
- [ ] Ad groups with zero eligible ads addressed first
- [ ] Resolution documented with prevention notes
- [ ] Re-review status tracked for appealed/edited ads

---

## Exit → Entry bridge

After resolving disapprovals:

| Timeframe | Action |
|-----------|--------|
| Next business day | Check review status of resubmitted/appealed ads |
| 3 business days | Follow up on pending appeals |
| Next daily triage | Monitor for new disapprovals |

**If resolution is blocked:**

| Issue | Route to |
|-------|----------|
| Appeal denied, disagree with policy | Contact Google Ads support directly |
| Account-level policy issue | Escalate to Google Ads support |
| Landing page fix requires development | Create ticket with web team |
| Repeated disapprovals on same policy | Review creative strategy for compliance |

---

## Quick reference: Support library

| Document | Type | Used in |
|----------|------|---------|
| [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md) | Reference | Phase 2 |
| Google Ads Policy Center | External | Phase 2-3 |

---

## Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Run a Daily Account Health Check](../sops/SOP – Run a Daily Account Health Check.md) | Upstream (daily triage triggers this SOP) |
| [SOP – Run a Monthly Performance Review](../sops/SOP – Run a Monthly Performance Review.md) | Upstream (monthly review catches lingering disapprovals) |

---

## Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Ignoring "Approved (limited)" status | Seems less urgent than "Disapproved" | Limited status reduces reach, treat as high priority |
| Appealing when the violation is real | Disagreeing with the policy vs. complying with it | Read the policy fully, edit if the violation is legitimate |
| Fixing the ad but not the root cause | Same issue recurs on new ads | Document patterns and apply prevention measures |
| Not checking asset disapprovals | Only checking ad-level disapprovals | Include sitelinks, callouts, and images in every review |
| Waiting too long to resolve | "It's just one ad" mindset | High-volume ad disapproval compounds daily, resolve within 24h |

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
