# Consent Mode Reference
Created: 2026-02-04
Updated: 2026-04-02

Support_ID: CHEATSHEET_17
Status: Done
Category: Operational
Reference Type: Cheat Sheets
Agent_Readable: Yes
Human_Facing: Yes
Domain: Measurement
Pillar: 5

## Purpose

Documents Google Consent Mode V2 configuration, consent signals, conversion modeling mechanics, and CMP integration methods for maintaining conversion data accuracy under privacy regulations.

---

## What this reference is / What this is NOT

**This reference:**

- Defines all four consent signals and their tag behavior impact
- Explains how conversion modeling recovers unconsented conversion data
- Documents both implementation methods (Google Tag and GTM with CMP)
- Covers built-in vs. manual consent checks for Google and non-Google tags

**This reference does NOT:**

- Provide a step-by-step consent mode setup procedure (See: future SOP: Configure Consent Mode)
- Explain the full measurement maturity roadmap (See: [Measurement Maturity Mental Model](../mental-models/Measurement Maturity Mental Model.md))
- Cover conversion action configuration settings (See: [Conversion Action Reference](../references/Conversion Action Reference.md))

---

## Quick reference: consent signals

| **Signal** | **Controls** | **Default (denied)** | **Version** |
|------------|-------------|---------------------|-------------|
| `ad_storage` | Google Ads cookies (conversion tracking, remarketing) | Tags fire with limited, cookieless pings | V1 (original) |
| `analytics_storage` | Google Analytics cookies (GA4 measurement) | Tags fire without storing analytics cookies | V1 (original) |
| `ad_user_data` | Whether user data can be sent to Google for advertising | User data not sent for ad personalization | V2 (required) |
| `ad_personalization` | Whether user data can be used for remarketing | No personalized ads served | V2 (required) |

> ⚠️ **V2 is mandatory in the EU/EEA since March 2024:** Accounts without Consent Mode V2 lose remarketing audiences and conversion modeling in affected regions. Implement both V2 signals (`ad_user_data` and `ad_personalization`) alongside the original V1 signals.

---

## How Consent Mode works

### Core mechanism

Consent Mode acts as a layer between your Consent Management Platform (CMP) and your Google tags. It does not block or allow cookies directly. Instead, it adjusts tag behavior based on the consent state communicated by the CMP.

| **Consent state** | **Tag behavior** | **Data collected** |
|-------------------|-----------------|-------------------|
| Granted (all signals) | Tags fire normally with full cookie access | Full conversion data, remarketing, analytics |
| Denied (all signals) | Tags fire cookieless pings with limited data | Anonymized pings: timestamp, user agent, referrer, consent state |
| Partial (mixed signals) | Each tag respects its relevant signal independently | Varies by signal combination |

### What happens when consent is denied

1. Google tags still fire, but send cookieless, anonymized pings
2. No cookies are written to the user's browser
3. No personally identifiable information is collected
4. Google uses the anonymized pings as input for conversion modeling

---

## Conversion modeling process

Google uses a four-step statistical model to estimate conversions from users who denied consent:

| **Step** | **Action** | **Details** |
|----------|-----------|-------------|
| 1. Separate clicks | Split traffic into consented and unconsented groups | Based on consent signal state at time of click |
| 2. Form subgroups | Group users by shared characteristics | Device type, browser, geo, time of day, landing page |
| 3. Match characteristics | Compare consented conversion patterns to unconsented subgroups | Statistical matching within each subgroup |
| 4. Link conversions | Estimate unconsented conversions based on consented patterns | Modeled conversions added to reports |

> 💡 **Modeled conversions appear in your standard conversion columns:** They are not reported separately. Google blends them into your existing conversion data to maintain signal quality for Smart Bidding.

### Expected conversion recovery

| **Consent rejection rate** | **Estimated conversion recovery** | **Net impact** |
|---------------------------|----------------------------------|----------------|
| 10-20% of users deny consent | ~5-10% conversion uplift vs. no Consent Mode | Moderate recovery |
| 20-40% of users deny consent | ~10-18% conversion uplift vs. no Consent Mode | Significant recovery |
| 40%+ of users deny consent | ~15-18% conversion uplift (capped) | High recovery, but modeling accuracy decreases |

> ⚠️ **Modeling recovery depends on traffic volume.** Accounts with 100+ daily conversions see reliable modeling. Accounts below 100 daily conversions see less stable modeling with wider variance. Below 30 daily conversions, modeling is unreliable.

### Diagnosing broken modeling

| Signal | What it means | Action |
|--------|--------------|--------|
| Modeled conversions = 0 despite denied consent traffic | Consent Mode tags not firing correctly under denied state | Verify consent signal implementation in Tag Assistant: check that tags fire in "denied" mode (not blocked entirely) |
| Modeled conversions suddenly drop >50% | Consent rate changed or tag configuration broke | Check CMP consent rate trends for the period, verify tag deployment unchanged |
| Modeled conversions exceed observed conversions by >30% | Over-modeling (rare, usually indicates implementation issue) | Verify consent signals are correctly distinguishing granted vs denied states |
| "Consent Mode not detected" in Tag Assistant | Implementation missing or not deployed | Re-implement consent signals per the setup method in this reference |

---

## Implementation methods

### Method 1: Google Tag (hardcoded)

Set default consent states directly in the Google Tag on every page.

```javascript
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'analytics_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied'
});
```

When the CMP collects consent, update the state:

```javascript
gtag('consent', 'update', {
  'ad_storage': 'granted',
  'analytics_storage': 'granted',
  'ad_user_data': 'granted',
  'ad_personalization': 'granted'
});
```

**Best for:** Simple implementations without GTM, single-tag setups.

### Method 2: GTM with CMP gallery template (recommended)

| **Step** | **Action** | **Where** |
|----------|-----------|-----------|
| 1 | Enable Consent Overview | GTM Container Settings > Enable consent overview |
| 2 | Add CMP gallery template | GTM Templates > Search Gallery (e.g., Cookiebot, OneTrust, CookieYes) |
| 3 | Configure CMP tag | Add CMP tag, set default consent states, map CMP categories to Google signals |
| 4 | Set trigger | Fire CMP tag on Consent Initialization (fires before All Pages) |
| 5 | Verify consent overview | Check Consent Overview dashboard to confirm all tags show correct consent requirements |

**Best for:** Most implementations. Recommended for accounts using GTM with multiple tags.

> 💡 **The CMP gallery template handles both default and update calls automatically:** You configure the mapping once, and the template manages consent state changes when users interact with the cookie banner.

---

## Built-in vs. manual consent checks

### Google tags (built-in consent checks)

Google tags (Google Ads conversion tracking, Google Analytics, Floodlight) have built-in consent checks. They automatically read the consent state and adjust behavior. No additional configuration required beyond setting up Consent Mode.

| **Tag type** | **Consent check** | **Additional setup** |
|--------------|-------------------|---------------------|
| Google Ads Conversion Tracking | Built-in | None |
| Google Ads Remarketing | Built-in | None |
| GA4 Configuration | Built-in | None |
| GA4 Event | Built-in | None |
| Floodlight | Built-in | None |

### Non-Google tags (manual consent checks required)

Non-Google tags (LinkedIn Insight, Meta Pixel, TikTok Pixel) do not read Google Consent Mode signals. You must configure manual consent checks.

| **Tag type** | **Consent check** | **Setup required** |
|--------------|-------------------|-------------------|
| LinkedIn Insight Tag | Manual | Add consent requirement in tag settings, create Cookie Consent Update trigger |
| Meta Pixel | Manual | Add consent requirement in tag settings, create Cookie Consent Update trigger |
| TikTok Pixel | Manual | Add consent requirement in tag settings, create Cookie Consent Update trigger |
| Any custom HTML tag | Manual | Add consent requirement in tag settings, create Cookie Consent Update trigger |

### Cookie Consent Update trigger

For non-Google tags, create a trigger in GTM:

| **Setting** | **Value** |
|-------------|----------|
| Trigger type | Custom Event |
| Event name | `cookie_consent_update` |
| Fires on | All Custom Events |

Assign this trigger as an additional firing trigger on each non-Google tag. This ensures non-Google tags fire (or re-fire) when the user grants consent after the initial page load.

---

## Diagnostics and verification

### How to verify Consent Mode is working

| **Method** | **Where** | **What to check** |
|-----------|----------|-------------------|
| Conversion action diagnostics | Google Ads > Goals > Conversions > [Action] > Diagnostics | Consent Mode status shows "Active" |
| GTM Preview mode | GTM > Preview | Consent state changes visible in event timeline |
| GTM Consent Overview | GTM > Admin > Container Settings > Consent Overview | All tags show correct consent requirements |
| Browser developer tools | Network tab | Filter for `google` requests, verify `gcs` parameter in requests |

### Legal requirements

| **Region** | **Requirement** | **Deadline** |
|-----------|----------------|-------------|
| EU/EEA | Consent Mode V2 mandatory for Google Ads features | March 2024 (enforced) |
| UK | Recommended, aligns with ICO guidance | Strongly recommended |
| Global | Recommended for privacy compliance and data recovery | No deadline, best practice |

---

## Common mistakes

| **Mistake** | **Problem** | **Fix** |
|-------------|-------------|---------|
| Not implementing V2 signals | Loss of remarketing audiences and conversion modeling in EU/EEA | Add `ad_user_data` and `ad_personalization` signals |
| CMP tag fires after Google tags | Consent state not set before tags fire, data lost | Use Consent Initialization trigger (fires before All Pages) |
| Default consent set to "granted" | Violates GDPR, no modeling benefit | Set all defaults to "denied" for EU/EEA visitors |
| Non-Google tags without manual consent checks | Tags fire regardless of consent state, potential legal violation | Add consent requirements and Cookie Consent Update trigger |
| Not verifying in diagnostics | Unknown whether modeling is active | Check conversion action diagnostics page monthly |
| Blocking tags entirely instead of using Consent Mode | Zero data from unconsented users, no modeling input | Let tags fire with Consent Mode (cookieless pings enable modeling) |

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Measurement Maturity Mental Model](../mental-models/Measurement Maturity Mental Model.md) | Consent Mode is a foundational measurement technique |
| [Conversion Action Reference](../references/Conversion Action Reference.md) | Conversion actions receive modeled conversions from Consent Mode |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Consent Mode helps maintain conversion volume above thresholds |

---

## Version details

- **Version:** 2.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
