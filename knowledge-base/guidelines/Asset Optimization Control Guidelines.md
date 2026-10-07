# Asset Optimization Control Guidelines
Created: 2026-02-04
Updated: 2026-10-05

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

This guideline defines the recommended on/off states for Google's asset optimization and auto-generation settings across Demand Gen and Performance Max campaigns.

---

## What this is / What this is NOT

**This guideline:**

- Defines recommended on/off states for each asset optimization setting
- Explains the rationale behind each recommendation
- Establishes when exceptions apply
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
| Video enhancement | Creates vertical/square versions, shorter cuts, AI-generated voice-over (auto-applied unless disabled, English-only) |
| Auto-generated video | Creates video ads from static images |
| Resized assets | Creates different aspect ratio versions |
| Landing page images | Pulls images from your landing page |
| Adaptive layouts | Forces assets into formats they weren't designed for |
| AI content disclosure scope | Treats images Google automatically enhances as AI-edited assets, so they fall inside the AI content disclosure scope even when you generated nothing yourself |

---

## Recommended configuration

### Default recommendation: DISABLE

Auto-generated and enhanced assets produce poor quality results that damage brand perception. Create your own high-quality assets instead.

**Why disable:**

| Issue | Impact |
| --- | --- |
| Auto-generated videos | Low quality generic animations from static images |
| Image enhancements | Unpredictable cropping, color adjustments, layouts |
| Resized videos | May cut important content, distort aspect ratios, lose key visual elements |
| Shorter videos | Trims carefully crafted message, may cut branding or CTA |
| AI voice-over | Adds a generated narration you did not script, on by default |
| Landing page images | Generic, uncontrolled visual representation |
| Adaptive layouts | Assets forced into formats they weren't designed for |
| AI content disclosure scope | Automatically enhanced images fall inside the AI content disclosure scope, so enhancement pulls a compliance requirement onto assets you never generated |

**Quality over reach:** Disabling may reduce reach/coverage, but preserving video quality and brand perception is more important than incremental reach from poor-quality auto-generated content.

---

## The new AI creative tools (Veo, Gemini)

Google's newer generative tools (Veo 3 video, Gemini Omni in Asset Studio, and the AI video and "copy and edit with AI" features inside PMax and Demand Gen) are a real step up from the older auto-enhancement and auto-generated-video settings this guideline was written against. They produce materially better output.

The default still holds: your own, purpose-built creative wins, and the campaign-level auto-enhancement toggles below stay OFF. What changes is that these new tools are now worth deliberate testing rather than blanket avoidance.

| Use | Stance |
| --- | --- |
| Campaign auto-enhancement / auto-generated video toggles (the settings below) | Keep OFF by default |
| Veo / Gemini generation as a production tool (build assets you then review and upload) | Test deliberately. Treat output as a draft: review every asset, keep brand guidelines on, ship only what meets your bar |
| Relying on AI generation as your only creative | Avoid. It is a fallback and a speed tool, not a replacement for considered creative |

> 💡 **Test the new tools as a drafting aid, not an autopilot.** Generate with Veo or Gemini, then apply the same review bar you would to any agency deliverable. The quality gap has narrowed enough to test, not enough to hand over the wheel.

> ⚠️ **AI-content disclosure labels are a compliance requirement.** AI regulations in the European Union, India, and New York require disclosures or labels on ads with certain AI-generated or AI-edited assets. An AI label setting is available across Google Ads, Display & Video 360, Campaign Manager 360, Merchant Center, and Ads Editor. If you generate or edit image or video creative with AI (including Veo and Gemini output), account for these labels. Performance Max images that Google automatically enhances fall inside the same disclosure scope, so leaving image enhancement on puts you in scope even when you generate nothing yourself. Keep the label clear of the very corners and edges of a creative: Google gives no guarantee that a label survives cropping or trimming. Applying an AI label to a product image also suppresses Merchant Center image enhancements for that image, so labelling and automated enhancement cannot both run on the same asset. Using the label setting does not by itself guarantee compliance with a specific regulation.

---

## Settings by campaign type

### Responsive display ads in Demand Gen (ad level)

**Location:** "Additional format options" when creating/editing a responsive display ad

| Setting | What It Does | Recommendation |
| --- | --- | --- |
| Use asset enhancements | Enhances assets and optimizes ad layouts | ❌ **DISABLE** |
| Use auto-generated video | Creates video ads from headlines, descriptions, and images | ❌ **DISABLE** |
| Use native formats | Expands reach to native ad placements | ✅ **ENABLE** (format expansion, not asset modification) |

**Auto-generated video behavior:** If you've added your own video content, auto-generated videos only serve when your video cannot be used. Disable it anyway to prevent the fallback to low-quality content.

### Performance Max campaigns (campaign level)

**Location:** Campaign Settings → Asset optimization

| Setting | What It Does | Recommendation |
| --- | --- | --- |
| Text: Customization | AI-generated headlines/descriptions from site, landing pages, and existing ads | ❌ **OFF by default**: enable only when the configuration requires it (Final URL expansion) or reach is deliberately chosen. If ON, text guidelines are mandatory before launch |
| Text: Final URL expansion | Dynamic landing page selection (requires Customization ON) | ❌ **DISABLE** (unless comprehensive URL exclusions in place) |
| Image: Enhancement | Adjusts images for appearance, formatting, layout | ❌ **DISABLE** |
| Image: Landing page images | Pulls images from landing page to use in ads | ❌ **DISABLE** |
| Video: Enhancement | Creates vertical/square versions and shorter cuts from uploaded videos | ❌ **DISABLE** |

**If no video uploaded:** Google may auto-generate videos from images. Upload your own videos to prevent this, or disable auto-generation in settings.

Text customization also generates image assets sourced from your landing pages, so Text customization and Landing page images both stay off to prevent unwanted auto-generated text and image assets. Setting changes take 24-48 hours to fully reflect.

> ⚠️ **Google may enrich PMax ads with AI-generated content by default.** For campaigns with a Merchant Center feed, Google may use content from your landing page, images, feed, and other signals, including content created by Google AI, to enrich your ads. Opting out is only possible via a support request to your account manager or Google support, processed in 3-5 business days. Know that this default exists: use the assets labeled as created by Google AI in the asset reports as the audit trail for what enrichment wrote, and steer the output with text guidelines.

### Text guidelines and visual guidelines

Text guidelines and visual guidelines provide control over how Google generates and modifies assets when optimization settings are enabled.

**Text guidelines** constrain AI-generated text when Text customization is enabled:

| Control | Limit | Purpose |
| --- | --- | --- |
| Term exclusions | Up to 25 words/phrases | Exclude specific words or phrases from generated text |
| Messaging restrictions | Up to 40 natural-language rules | Prevent specific concepts, topics, or messaging approaches (e.g., "Do not mention competitor names", "Do not reference specific prices", "Do not use superlatives"). Restrictions can also define a tone of voice to adhere to, or one to avoid |

Text guidelines can be copied from an existing campaign (choose replace or add to existing guidelines), so proven guidelines transfer across Performance Max and AI Max Search campaigns without re-entry.

**Access:** Campaign settings > Asset optimization > Text > "Edit text guidelines" OR Settings > Brand guidelines > Text guidelines

**Visual guidelines** constrain how Google modifies images and videos when enhancement is enabled:

| Control | Purpose |
| --- | --- |
| Custom colors (main + accent) | Restrict color palette for enhanced assets |
| Font | Restrict font usage for enhanced assets |

**Access:** Campaign settings > Asset optimization > Image/Video > "Add visual guidelines" OR Settings > Brand guidelines > Visual guidelines

**Hard rule:** A campaign with Text customization on and no text guidelines is not launch-ready. Whenever Text customization is on, configure text guidelines before launch, every time. If enabling any image or video enhancement, configure visual guidelines first.

> ⚠️ **Search campaigns: text customization on = the AI Max auto-upgrade cohort.** Google auto-upgrades Search campaigns with text customization on (formerly automatically created assets) to AI Max on its announced schedule. Enabling text customization on a Search campaign is opting into that upgrade: decide deliberately.

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

---

## Exception conditions

### When to enable asset optimization

Enable only if **all** of the following are true:

- You cannot produce required asset variations yourself
- Incremental reach outweighs brand quality concerns
- You've configured Brand Guidelines to constrain modifications
- You commit to monitoring and disabling if quality issues arise
- You account for AI content disclosure labels on the enhanced assets, which fall inside disclosure scope

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

### Responsive display ads (Demand Gen)

| Check | Expected State |
| --- | --- |
| Use asset enhancements | OFF |
| Use auto-generated video | OFF |
| Use native formats | ON |

### Performance Max campaigns

| Check | Expected State |
| --- | --- |
| Text: Customization | OFF unless required by the configuration or deliberately chosen for reach |
| Text: Final URL expansion | OFF (unless URL exclusions configured) |
| Text guidelines (if Customization ON) | Configured before launch (term exclusions + messaging restrictions), no exceptions |
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

- **Version:** 6.0
- **Last Updated:** October 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

© 2026 PPC Mastery B.V. All rights reserved.