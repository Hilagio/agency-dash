# Upper Funnel Channel Selection Mental Model
Created: 2026-02-05
Updated: 2026-04-01

Support_ID: MENTALMODEL_10
Status: Done
Category: Operational
Reference Type: Mental Model
Agent_Readable: Yes
Human_Facing: Yes
Domain: Upper Funnel
Pillar: 6

## Purpose

This mental model helps you decide which advertising platform to use for upper funnel goals (awareness, consideration, demand generation).

> ❓ **The core question:** When should I use Google Ads for upper funnel, and when are other platforms a better fit?

Google Ads excels at capturing existing demand (Search, Shopping). For creating demand, Google's Display, Video, and Demand Gen inventory competes with Meta Ads (Facebook/Instagram), Pinterest Ads, TikTok Ads, and others. The right choice depends on your audience, creative assets, and budget.

---

## What this is NOT

This mental model does **not:**

- Explain how to structure Google Ads upper funnel campaigns (See: [Upper Funnel Campaign Structure Mental Model](../mental-models/Upper Funnel Campaign Structure Mental Model.md))
- Provide platform-specific setup instructions
- Replace platform-specific expertise for Meta, Pinterest, or TikTok

---

## The demand capture vs. demand creation distinction

| | **Demand Capture** | **Demand Creation** |
| --- | --- | --- |
| **What it is** | Reaching users who already want your product | Making users aware of your product for the first time |
| **Google Ads strength** | Search, Shopping (best-in-class) | Display, Video, Demand Gen (competitive but not dominant) |
| **Other platforms** | Limited (no search intent data) | Meta, Pinterest, TikTok (often stronger for awareness) |

---

## Platform decision criteria

Choose your upper funnel platform based on your constraints, not platform features.

| **When your constraint is...** | **Best platform** | **Why** |
| --- | --- | --- |
| You have strong video, no static assets | YouTube (Google Video or Demand Gen) | YouTube is the only platform where long-form video performs well at scale |
| You have strong static/carousel, no video | Meta Ads or Pinterest Ads | Both platforms are optimized for static and carousel engagement |
| You need the lowest possible CPMs | Meta Ads or Pinterest Ads | Google Display/Video CPMs are typically 2-3x higher than Meta/Pinterest |
| Your audience is B2B / professional | LinkedIn Ads or Google Display | LinkedIn has the best professional targeting, Google Display reaches business sites |
| You need remarketing across Google surfaces | Google Display + YouTube | Cross-surface remarketing (Display + YouTube + Demand Gen) is a Google advantage |
| You want conversion-optimized upper funnel | Google Demand Gen | Demand Gen combines upper funnel reach with conversion-based bidding |
| Your product is visual/lifestyle | Meta + Pinterest | Visual discovery platforms drive higher engagement for lifestyle products |
| Your audience skews Gen Z | TikTok, Instagram | Strongest Gen Z engagement and content format fit |
| Social proof drives your sales | Meta Ads | UGC, reviews, and social proof formats perform best on Meta |

### Platform trade-offs

| Platform | CPM range | Audience size | Targeting precision | Attribution clarity |
| --- | --- | --- | --- | --- |
| Google Display | Higher (€5-15) | Largest (3M+ sites) | Moderate | Moderate (view-through inflation risk) |
| Google Video (YouTube) | Medium-High (€8-20) | Large (YouTube) | Moderate | Low (view-through heavy) |
| Google Demand Gen | Medium (€5-15) | Medium (YouTube, Discover, Gmail) | Moderate + lookalikes | Low (30-50% GA4 gap) |
| Meta Ads | Lower (€3-10) | Large (Facebook + Instagram) | High | Low (cross-platform attribution) |
| Pinterest Ads | Lowest (€2-8) | Smaller | Moderate | Moderate |
| TikTok Ads | Lower (€3-10) | Medium | Moderate | Low |

---

## Decision framework

```
Is your goal to capture existing demand?
│
├─ YES → Google Search / Shopping (not upper funnel)
│
└─ NO → What type of creative do you have?
         │
         ├─ Strong video → YouTube (Google Video or Demand Gen)
         │
         ├─ Strong static/carousel → Meta or Pinterest
         │
         └─ Both → Consider platform based on audience:
                    │
                    ├─ B2B audience → LinkedIn
                    │
                    ├─ Visual/lifestyle product → Meta + Pinterest
                    │
                    └─ Broad consumer → Test Google Demand Gen vs. Meta
```

---

## When Google Ads is the right upper funnel choice

| **Scenario** | **Why Google** |
| --- | --- |
| You already run Search/Shopping and want incremental reach | Consolidated reporting, audience sharing, cross-campaign learning |
| YouTube is a primary channel for your audience | Direct access to YouTube inventory |
| You need remarketing across Google surfaces | Dynamic remarketing on Display, retargeting on YouTube |
| You want conversion-optimized upper funnel | Demand Gen with lookalikes is Google's social-like offering |

## When other platforms are a better fit

| **Scenario** | **Why Not Google** |
| --- | --- |
| Visual/lifestyle products (fashion, food, home) | Meta and Pinterest often deliver lower CPMs and higher engagement |
| Social proof is your primary creative strategy | Meta (Facebook/Instagram) excels at social-proof-driven ads |
| Younger demographic (Gen Z) | TikTok and Instagram have stronger Gen Z engagement |
| Inspiration and discovery phase | Pinterest users are actively looking for ideas and products |
| Lower CPMs are critical | Meta and Pinterest often offer lower CPMs than Google Display/Video |

---

## Integration with existing Google Ads strategy

If you decide to use Google Ads for upper funnel alongside Search/Shopping:

> ↪️ **For campaign structure:** See [Upper Funnel Campaign Structure Mental Model](../mental-models/Upper Funnel Campaign Structure Mental Model.md)
> ↪️ **For audience strategy:** See [Audience Strategy Mental Model](../mental-models/Audience Strategy Mental Model.md)
> ↪️ **For awareness-stage messaging:** See [Awareness Stage Mental Model](../mental-models/Awareness Stage Mental Model.md)

---

## Failure modes

| Failure | What happens | How to prevent |
|---------|-------------|----------------|
| Defaulting to Google for all upper funnel | Paying 2-3x CPMs when Meta or Pinterest would be cheaper for the same audience | Evaluate CPMs cross-platform before committing budget |
| Picking platform based on familiarity, not fit | Underperformance because creative format or audience does not match platform strengths | Match creative assets and audience demographics to platform strengths first |
| Running only one platform | No comparison data to evaluate efficiency or incrementality | Test at least two platforms for 30 days each before committing |
| Comparing platforms on last-click attribution | Platform with more view-throughs appears to "win" when it is just taking credit | Use third-party attribution or incrementality testing for cross-platform comparison |
| Ignoring creative format requirements | Running static ads on YouTube (poor performance) or video on Pinterest (low engagement) | Match your strongest creative format to the platform that rewards it |

---

## Key principles

1. **Google captures demand, other platforms create it:** Google Search and Shopping are unmatched for intent-based advertising. For awareness and consideration, compare cross-platform.
2. **Creative format determines platform:** Strong video = YouTube advantage. Strong static/carousel = Meta/Pinterest advantage.
3. **Do not default to Google for upper funnel:** Evaluate CPMs, audience fit, and creative format before committing budget.
4. **Remarketing is Google's upper funnel strength:** Dynamic remarketing on Display and YouTube retargeting are powerful. Prospecting may be better on other platforms.
5. **Test, do not assume:** Run 30-day tests on multiple platforms before committing upper funnel budget.
6. **Attribution is ambiguous across platforms:** Google and Meta both claim credit for the same conversions. When running multi-platform upper funnel, use third-party attribution or incrementality testing to isolate true platform contribution.

---

## Related documents

| **Document** | **Relationship** |
| --- | --- |
| [Upper Funnel Campaign Structure Mental Model](../mental-models/Upper Funnel Campaign Structure Mental Model.md) | Downstream (Google Ads upper funnel campaign structure) |
| [Audience Strategy Mental Model](../mental-models/Audience Strategy Mental Model.md) | Foundation (audience targeting approach) |
| [Awareness Stage Mental Model](../mental-models/Awareness Stage Mental Model.md) | Messaging (awareness-stage creative alignment) |

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

© 2026 PPC Mastery B.V. All rights reserved.
