# Asset Optimization Control Guidelines
Created: 2026-02-04

Support_ID: GUIDELINE_2
Status: Done
Category: Creative
Reference Type: Guideline
Agent_Readable: No
Human_Facing: No
Bucket: Creative
Domain: Creative
Pillar: 8

## Purpose

This guideline defines the recommended on/off states for Google's asset optimization and auto-generation settings across Display, Demand Gen, and Performance Max campaigns.

---

## What this is / What this is NOT

**This guideline:**

- Defines recommended on/off states for each asset optimization setting
- Explains the rationale behind each recommendation
- Establishes when exceptions may apply
- Covers image enhancement, video enhancement, and auto-generation settings

**This guideline does NOT:**

- Provide creative specifications (See: Video Creative Reference, Image Creative Reference)
- Validate creative quality (See: Video Creative Quality Checklist, Image Creative Quality Checklist)
- Configure automated assets like sitelinks or callouts (See: [Automated Assets Control Guidelines](../guidelines/Automated Assets Control Guidelines.md))

---

## What are asset optimization settings?

Google offers various settings that automatically modify, enhance, or generate creative assets. These exist at campaign and ad levels depending on campaign type.

**Types of auto-modification:**

| Type | What Google Does |
| --- | --- |
| Image enhancement | Adjusts images for appearance, formatting, layout |
| Video enhancement | Creates vertical/square versions, shorter cuts |
| Auto-generated video | Creates video ads from static images |
| Resized assets | Creates different aspect ratio versions |
| Landing page images | Pulls images from your landing page |
| Adaptive layouts | Forces assets into formats they weren't designed for |

---

## Recommended configuration

### Default recommendation: DISABLE

Auto-generated and enhanced assets typically produce poor quality results that can negatively impact brand perception. Create your own high-quality assets instead.

**Why disable:**

| Issue | Impact |
| --- | --- |
| Auto-generated videos | Low quality generic animations from static images |
| Image enhancements | Unpredictable cropping, color adjustments, layouts |
| Resized videos | May cut important content, distort aspect ratios, lose key visual elements |
| Shorter videos | Trims carefully crafted message, may cut branding or CTA |
| Landing page images | Generic, uncontrolled visual representation |
| Adaptive layouts | Assets forced into formats they weren't designed for |

**Quality over reach:** Disabling may reduce reach/coverage, but preserving video quality and brand perception is more important than incremental reach from poor-quality auto-generated content.

---

## Settings by campaign type

### Display campaigns (ad level)

**Location:** "Additional format options" when creating/editing a responsive display ad

| Setting | What It Does | Recommendation |
| --- | --- | --- |
| Use asset enhancements | Enhances assets and optimizes ad layouts | ❌ **DISABLE** |
| Use auto-generated video | Creates video ads from headlines, descriptions, and images | ❌ **DISABLE** |
| Use native formats | Expands reach to native ad placements | ✅ **ENABLE** (format expansion, not asset modification) |

**Auto-generated video behavior:** If you've added your own video content, auto-generated videos only serve when your video cannot be used. Still recommended to disable to prevent fallback to low-quality content.

### Performance Max campaigns (campaign level)

**Location:** Campaign Settings → Asset optimization

| Setting | What It Does | Recommendation |
| --- | --- | --- |
| Text: Customization | AI-generated headlines/descriptions from site, landing pages, and existing ads | ⚠️ **REVIEW CAREFULLY**: configure text guidelines first if enabling |
| Text: Final URL expansion | Dynamic landing page selection (requires Customization ON) | ❌ **DISABLE** (unless comprehensive URL exclusions in place) |
| Image: Enhancement | Adjusts images for appearance, formatting, layout | ❌ **DISABLE** |
| Image: Landing page images | Pulls images from landing page to use in ads | ❌ **DISABLE** |
| Video: Enhancement | Creates vertical/square versions and shorter cuts from uploaded videos | ❌ **DISABLE** |

**If no video uploaded:** Google may auto-generate videos from images. Upload your own videos to prevent this, or disable auto-generation in settings.

### Text guidelines and visual guidelines

Text guidelines and visual guidelines provide control over how Google generates and modifies assets when optimization settings are enabled.

**Text guidelines** constrain AI-generated text when Text Customization is enabled:

| Control | Limit | Purpose |
| --- | --- | --- |
| Term exclusions | Up to 25 words/phrases | Exclude specific words or phrases from generated text |
| Messaging restrictions | Up to 40 natural-language rules | Prevent specific concepts, topics, or messaging approaches (e.g., "Do not mention competitor names", "Do not reference specific prices", "Do not use superlatives") |

**Access:** Campaign Settings > Asset optimization > Text > "Edit text guidelines" OR Settings > Brand guidelines > Text guidelines

**Visual guidelines** constrain how Google modifies images and videos when enhancement is enabled:

| Control | Purpose |
| --- | --- |
| Custom colors (main + accent) | Restrict color palette for enhanced assets |
| Font | Restrict font usage for enhanced assets |

**Access:** Campaign Settings > Asset optimization > Image/Video > "Add visual guidelines" OR Settings > Brand guidelines > Visual guidelines

**Recommendation:** If enabling Text Customization, always configure text guidelines first. If enabling any image or video enhancement, configure visual guidelines first.

### Demand Gen campaigns (ad level)

**Location:** Asset optimization when creating/editing Demand Gen ads

**Video ad settings:**

| Setting | What It Does | Recommendation |
| --- | --- | --- |
| Resized videos | Creates different aspect ratio versions (horizontal → vertical/square) | ❌ **DISABLE** |
| Shorter videos | Trims videos to create shorter versions | ❌ **DISABLE** |
| Show a screenshot of your landing page in your ads | Uses landing page screenshot as video content | ❌ **DISABLE** |

**Image ad settings:**

| Setting | What It Does | Recommendation |
| --- | --- | --- |
| Videos | Creates videos from your existing image assets | ❌ **DISABLE** |
| Adaptive layouts | Assets adapt to fit more layouts, styles, and aspect ratios | ❌ **DISABLE** |

**Preview before deciding:** Click "Show examples" in Demand Gen asset optimization settings to see how your assets will be modified.

---

## Exception conditions

### When you might enable asset optimization

Enable only if **all** of the following are true:

- You cannot produce required asset variations yourself
- Incremental reach outweighs brand quality concerns
- You've configured Brand Guidelines to constrain modifications
- You commit to monitoring and disabling if quality issues arise

### If you must enable: Mitigation steps

**1. Create your own assets first**

| Asset Type | What to Upload |
| --- | --- |
| Images | Horizontal (1.91:1), square (1:1), vertical (4:5 or 9:16) |
| Videos | All three aspect ratios + multiple lengths (6s, 15s, 30s+) |

Uploading your own variations reduces Google's need to auto-generate.

**2. Add Brand Guidelines (Demand Gen / Performance Max)**

| Setting | Action |
| --- | --- |
| Custom colors | Set primary and secondary brand colors |
| Brand fonts | Define approved fonts |
| Official logos | Upload high-quality logos |
| Business name | Set correctly |
| Text guidelines: term exclusions | Add up to 25 words/phrases to exclude from generated text |
| Text guidelines: messaging restrictions | Add up to 40 rules to prevent off-brand messaging |

Brand Guidelines constrain how Google modifies and generates your assets.

**3. Monitor performance**

| Check | Frequency |
| --- | --- |
| Review auto-generated assets in asset report | Weekly |
| Check quality of enhanced versions in preview | Before launch |
| Disable immediately if quality issues arise | Ongoing |

---

## Configuration verification

### Display campaigns

| Check | Expected State |
| --- | --- |
| Use asset enhancements | OFF |
| Use auto-generated video | OFF |
| Use native formats | ON |

### Performance Max campaigns

| Check | Expected State |
| --- | --- |
| Text: Customization | Review case-by-case |
| Text: Final URL expansion | OFF (unless URL exclusions configured) |
| Text guidelines (if Customization ON) | Configured (term exclusions + messaging restrictions) |
| Image: Enhancement | OFF |
| Image: Landing page images | OFF |
| Visual guidelines (if any enhancement ON) | Configured (brand colors + font) |
| Video: Enhancement | OFF |

### Demand Gen campaigns (video ads)

| Check | Expected State |
| --- | --- |
| Resized videos | OFF |
| Shorter videos | OFF |
| Landing page screenshots | OFF |

### Demand Gen campaigns (image ads)

| Check | Expected State |
| --- | --- |
| Videos (from images) | OFF |
| Adaptive layouts | OFF |
| If any enabled → Brand Guidelines | Configured |

---

## Related documents

| Document | Relationship |
| --- | --- |
| Automated Assets Control Guidelines | Parallel (covers account-level automated assets like sitelinks, callouts) |
| Video Creative Reference | Upstream (creative specs that make auto-generation unnecessary) |
| Image Creative Reference | Upstream (creative specs that make auto-generation unnecessary) |
| Video Creative Quality Checklist | Validates video quality |
| Image Creative Quality Checklist | Validates image quality |

---

## Version details

- **Version:** 2.0
- **Last Updated:** March 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

© 2026 PPC Mastery B.V. All rights reserved.