# Dynamic Text Reference
Created: 2026-02-04
Updated: 2026-04-02

Support_ID: CHEATSHEET_1
Status: Done
Category: Creative
Reference Type: Cheat Sheet
Agent_Readable: No
Human_Facing: No
Domain: Creative
Pillar: 8

## Purpose:

Documents dynamic text insertion options available in Google Ads RSAs for automatic copy personalization

---

## What this reference is / What this is NOT

**This reference:**

- Documents syntax for **Keyword Insertion**, **Location Insertion**, and **Countdown Timers**
- Explains when to use each dynamic element
- Provides examples and common mistakes

**This reference does NOT:**

- Cover Ad Customizer attributes in depth (See: [Keyword Ad Customizer Attribute Catalog](../catalogs/Keyword Ad Customizer Attribute Catalog.md), [Dynamic Ad Customizer Attribute Catalog](../catalogs/Dynamic Ad Customizer Attribute Catalog.md))
- Provide step-by-step setup instructions

---

## Quick reference table

| **Dynamic element** | **Syntax** | **Best for** | **Complexity** |
| --- | --- | --- | --- |
| **1️⃣ Keyword Insertion** | `{KeyWord:Default}` | Relevance anchors, H1 | Low |
| **2️⃣ Location Insertion** | `{LOCATION(City):Default}` | Local services, geo-targeting | Low |
| **3️⃣ Countdown Timer** | `{COUNTDOWN(date):Default}` | Time-limited offers, urgency | Low |
| **4️⃣ Ad Customizers** | `{CUSTOMIZER.attribute:Default}` | Complex personalization, feeds | High |

> Dynamic text increases relevance without creating dozens of ad variations manually. Used well, **it improves Ad Relevance and CTR**. Used poorly, it creates awkward, broken ads.

---

## 1️⃣ Keyword Insertion

### What it does

Dynamically inserts the keyword that triggered the ad into your headline or description.

> ⚠️ **Important:** Keyword Insertion inserts the *keyword*, not the *search term*. If your keyword is "crm software" and someone searches "best crm software for startups", the ad shows "crm software", not the full search term.

### Syntax

`{KeyWord:Default Text}`

**Capitalization options:**

| **Syntax** | **Input keyword** | **Output** |
| --- | --- | --- |
| `{keyword:default}` | running shoes | running shoes |
| `{Keyword:Default}` | Running shoes | Running shoes |
| `{KeyWord:Default}` | Running Shoes | Running Shoes |

**Most common:** `{KeyWord:Default}` (Title Case)

### Rules

| **Rule** | **Details** |
| --- | --- |
| **Character limit** | If keyword + surrounding text exceeds character limit, Default Text shows instead |
| **Default required** | Always include strong default text: it will show when keyword is too long |
| **One per headline** | You can use multiple, but one per headline is typical |
| **Works in** | Headlines, Descriptions, Paths |

### Default text best practices

The default text shows when the keyword is too long. It must be strong enough to stand alone.

| ❌ **Bad Default** | ✅ **Good Default** | **Why** |
| --- | --- | --- |
| `{KeyWord:Our Products}` | `{KeyWord:CRM Software}` | Generic vs. specific |
| `{KeyWord:Click Here}` | `{KeyWord:Project Management}` | CTA vs. category |
| `{KeyWord:Learn More}` | `{KeyWord:Sales Tools}` | Action vs. noun |

### Use cases

| **Use Case** | **Example** | **Notes** |
| --- | --- | --- |
| **H1 Relevance Anchor** | `{KeyWord:CRM Software}` | Most common use: matches ad to search |
| **Description keyword match** | `Our {KeyWord:software} helps teams...` | For bold text matching |
| **Display Path** | `example.com/{KeyWord:Products}` | Dynamic URL paths |

### When NOT to use

| **Situation** | **Why** | **Alternative** |
| --- | --- | --- |
| Brand campaigns | Brand name should be exact | Static brand headline |
| Sensitive industries | Keywords may be awkward in ad | Static, carefully worded |
| Long-tail keywords | Will exceed character limits frequently | Static with strong message |
| When you need control | DKI reduces message control | Static headlines |

---

## 2️⃣ Location Insertion

### What it does

Dynamically inserts the user's location (city, state, or country) into your ad.

### Syntax

`{LOCATION(Level):Default Text}`

**Location levels:**

| **Level** | **Syntax** | **Example output** |
| --- | --- | --- |
| City | `{LOCATION(City):Your Area}` | Amsterdam |
| State | `{LOCATION(State):Your Region}` | North Holland |
| Country | `{LOCATION(Country):Your Country}` | Netherlands |

### Rules

| **Rule** | **Details** |
| --- | --- |
| **Targeting required** | Only works if you're targeting the location level you're inserting |
| **Default shows when** | Location can't be determined, or exceeds character limit |
| **Character limits** | Some city/state names are long (test your defaults) |
| **Works in** | Headlines, Descriptions |

### Use cases

| **Use Case** | **Example** | **Best For** |
| --- | --- | --- |
| **Local service headline** | `Plumber in {LOCATION(City):Your City}` | Home services, local businesses |
| **Geo-specific landing** | `{LOCATION(City):Local} Insurance Quotes` | Insurance, real estate, legal |
| **Regional offers** | `Free Shipping to {LOCATION(State):Your State}` | Ecommerce with regional shipping |

### Best practices

| **Practice** | **Why** |
| --- | --- |
| **Always test defaults** | Long city names will trigger default frequently |
| **Match targeting to insertion** | If targeting country-wide, city insertion may be inaccurate |
| **Consider awkward names** | Some locations sound odd in sentences |
| **Use for local intent** | Best when user expects local results |

### When NOT to use

| **Situation** | **Why** | **Alternative** |
| --- | --- | --- |
| National campaigns | Location adds no value | Focus on other angles |
| B2B/SaaS (usually) | Buyers don't care about your location | Focus on benefits |
| When location is irrelevant | Forced personalization feels manipulative | Skip it |

---

## 3️⃣ Countdown Timers

### What it does

Dynamically counts down to a specific date/time, creating urgency in your ad.

### Syntax

`{COUNTDOWN(YYYY-MM-DD HH:MM:SS):Default Text}`

**Full syntax options:**

`{COUNTDOWN(YYYY-MM-DD HH:MM:SS,language,days_before):Default}`

| **Parameter** | **Options** | **Default** |
| --- | --- | --- |
| Date/Time | `YYYY-MM-DD HH:MM:SS` | Required |
| Language | `en`, `nl`, `de`, etc. | Account language |
| Days before | Number (when to start showing) | 5 |

### Output examples

| **Time remaining** | **Output** |
| --- | --- |
| 3 days, 4 hours | "3 days" |
| 5 hours, 30 min | "5 hours" |
| 45 minutes | "45 minutes" |
| 30 seconds | "30 seconds" |
| Expired | Default text shows |

### Headline examples

| **Use case** | **Syntax** | **Output (2 days left)** |
| --- | --- | --- |
| Sale ending | `Sale Ends in {COUNTDOWN(2026-01-15 23:59:59):Soon}` | "Sale Ends in 2 days" |
| Event registration | `Register - {COUNTDOWN(2026-02-01 09:00:00):Limited Time}` | "Register - 14 days" |
| Offer expiry | `{COUNTDOWN(2026-01-20 00:00:00):Offer Ending} Left` | "5 days Left" |

### Rules

| **Rule** | **Details** |
| --- | --- |
| **Timezone** | Uses account timezone by default |
| **After expiry** | Default text shows (make it strong) |
| **Minimum display** | Shows seconds when under 1 minute |
| **Works in** | Headlines, Descriptions |

### Best practices

| **Practice** | **Why** |
| --- | --- |
| **Only use for real deadlines** | Fake urgency damages trust |
| **Plan for expiry** | Default text becomes your headline after deadline |
| **Test character limits** | "3 days" vs "30 seconds" have different lengths |
| **Match to landing page** | If ad says "ends Sunday", LP should confirm |

### When NOT to use

| **Situation** | **Why** | **Alternative** |
| --- | --- | --- |
| No real deadline | Fake urgency is unethical and ineffective | Authentic urgency or none |
| Evergreen offers | Creates operational burden to update | Static messaging |
| Long countdowns | "47 days left" isn't urgent | Start countdown closer to deadline |

---

## 4️⃣ Ad Customizers

### What it does

Pulls dynamic values from a business data feed or keyword-level settings into your ads. Most flexible but most complex option.

### Basic syntax

`{CUSTOMIZER.attribute_name:Default Text}`

### Two approaches

| **Approach** | **Best for** | **Reference** |
| --- | --- | --- |
| **Keyword-level customizers** | Relevance optimization (singular/plural, descriptors) | [Keyword Ad Customizer Attribute Catalog](../catalogs/Keyword Ad Customizer Attribute Catalog.md) + [SOP – Set Up Keyword-Level Ad Customizers](../sops/SOP – Set Up Keyword-Level Ad Customizers.md) |
| **Dynamic customizers** | Price, inventory, promotions that change frequently | [Dynamic Ad Customizer Attribute Catalog](../catalogs/Dynamic Ad Customizer Attribute Catalog.md) + [SOP – Set Up Dynamic Ad Customizers](../sops/SOP – Set Up Dynamic Ad Customizers.md) |

### When to use Ad Customizers vs. simpler options

| **Scenario** | **Recommendation** |
| --- | --- |
| Simple keyword matching | Use Keyword Insertion |
| Location personalization | Use Location Insertion |
| Time-limited urgency | Use Countdown Timer |
| Singular/plural control per keyword | Use Keyword-Level Ad Customizers |
| Dynamic pricing, inventory, promos | Use Dynamic Ad Customizers |

> ⚠️ **Complexity warning:** Ad Customizers require advanced setup and maintenance. Start with Keyword Insertion before graduating to customizers. See the dedicated catalogs and SOPs for full implementation guidance.

---

## Decision guide: which dynamic element?

```
Do you need dynamic text?
│
├─ NO → Use static headlines (most control)
│
└─ YES → What type of personalization?
         │
         ├─ Match keyword in ad?
         │  └─ Use Keyword Insertion
         │
         ├─ Show user's location?
         │  └─ Use Location Insertion
         │
         ├─ Create time-based urgency?
         │  └─ Use Countdown Timer
         │
         └─ Complex/multi-attribute personalization?
            │
            ├─ Relevance (singular/plural, descriptors)?
            │  └─ Use Keyword-Level Ad Customizers
            │
            └─ Dynamic data (price, inventory, promos)?
               └─ Use Dynamic Ad Customizers
```

---

## Common mistakes

| **Mistake** | **Problem** | **Fix** |
| --- | --- | --- |
| **Weak default text** | When dynamic fails, ad is generic | Always write defaults as if they'll show 50% of time |
| **Over-relying on DKI** | All headlines are `{KeyWord:X}` | Use DKI for H1, static for persuasion |
| **Ignoring character limits** | Defaults show more than expected | Test with longest keywords |
| **Fake countdown urgency** | Damages trust, policy risk | Only use for real deadlines |
| **Location insertion everywhere** | Does not increase CTR when location is irrelevant to the offer | Only use when location genuinely matters |

---

## Related documents

| **Document** | **Relationship** |
| --- | --- |
| [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md)  | Uses these for H1 relevance anchors |
| [SOP – Improve Ad Relevance](../sops/SOP – Improve Ad Relevance.md)  | DKI as relevance fix |
| [Headline Angle Catalog](../catalogs/Headline Angle Catalog.md)  | Relevance Anchor patterns |
| [Keyword Ad Customizer Attribute Catalog](../catalogs/Keyword Ad Customizer Attribute Catalog.md)  | Keyword-level customizer attributes |
| [Dynamic Ad Customizer Attribute Catalog](../catalogs/Dynamic Ad Customizer Attribute Catalog.md)  | Dynamic customizer attributes |
| [SOP – Set Up Keyword-Level Ad Customizers](../sops/SOP – Set Up Keyword-Level Ad Customizers.md)  | Keyword customizer setup |
| [SOP – Set Up Dynamic Ad Customizers](../sops/SOP – Set Up Dynamic Ad Customizers.md)  | Dynamic customizer setup |

---

## Version details

- **Version:** 2.0
- **Last Updated:** January 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

© 2026 PPC Mastery B.V. All rights reserved.