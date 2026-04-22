# SOP – Implement Server-Side Tagging
Created: 2026-02-04

SOP_ID: SOP_22
Status: Done
Category: Measurement
Primary Outcome: Server-side tagging container deployed and routing conversion data
Secondary Outcomes: Improved data accuracy, faster page loads, resistance to ad blockers and cookie restrictions
Agent_Executable: No
Human_Approval_Required: No
Domain: Measurement
Pillar: 5

### Purpose

This SOP deploys a server-side tagging (SST) container to route conversion data through a first-party server, bypassing browser-level tracking limitations.

> ❓ **The big question:** Is your conversion data being lost to ad blockers, cookie restrictions, or browser limitations that server-side tagging would solve?

Server-side tagging shifts the processing load from the user's browser to your own server. This prevents data loss from client-side issues, increases page speed, and provides more accurate conversion data for Smart Bidding.

---

### What this SOP is NOT

This SOP does **not:**

- Set up basic GACT from scratch (See: [SOP – Set Up Google Ads Conversion Tracking](../sops/SOP – Set Up Google Ads Conversion Tracking.md))
- Replace client-side tracking (SST works alongside your web container, not instead of it)
- Cover Consent Mode implementation (separate SOP)
- Configure Enhanced Conversions (See: [SOP – Implement Enhanced Conversions](../sops/SOP – Implement Enhanced Conversions.md))

### When to run this SOP

Run this SOP when:

- Client-side tracking shows significant data loss (compare backend vs. Google Ads conversions)
- Ad blockers or browser restrictions affect a meaningful portion of your audience
- Page load speed is a concern due to multiple tracking scripts
- You need higher data accuracy for Smart Bidding optimization

---

### Before you start

#### Required inputs

- Working GTM web container with GACT already configured (See: [SOP – Set Up Google Ads Conversion Tracking](../sops/SOP – Set Up Google Ads Conversion Tracking.md))
- Hosting account (Taggrs.io, Stape.io, Google Cloud Platform, or custom server)
- Custom subdomain available for server container (e.g., `ss.yourdomain.com`)
- SSL certificate for the subdomain
- DNS access to create subdomain records

#### Reference documents (have open)

| Document | Used for |
| --- | --- |
| [Measurement Maturity Mental Model](../mental-models/Measurement Maturity Mental Model.md) | Understanding SST's role in the measurement stack |
| [Conversion Action Reference](../references/Conversion Action Reference.md) | Conversion action IDs and Labels |

---

### Decision gate: Hosting method

Before starting, select your hosting approach:

| If... | Then... | Complexity |
| --- | --- | --- |
| Simplest setup preferred | GTM server container on middleware (Taggrs.io, Stape.io) | Low |
| Google ecosystem preferred | GTM server container on Google Cloud Platform | Medium |
| Maximum flexibility needed | Custom implementation on own server | High |

> 💡 **Taggrs.io and Stape.io are the recommended approaches for most advertisers:** They simplify hosting, SSL, and scaling. Google Cloud Platform works but requires more technical configuration. Custom implementations are only for teams with dedicated server infrastructure.

---

### Execution framework

| Phase | Purpose | Output |
| --- | --- | --- |
| **Phase 1️⃣: Set up server container** | Create and host the server-side GTM container | Live server container on custom subdomain |
| **Phase 2️⃣: Configure web-to-server routing** | Route data from web container to server container | Web container sending requests to server |
| **Phase 3️⃣: Set up server-side tags** | Create tags in server container to forward data | Google Ads and GA4 tags forwarding data |
| **Phase 4️⃣: Validate and launch** | Debug and verify end-to-end data flow | Confirmed SST processing conversion data |

---

## Phase 1️⃣: Set up server container

### 1.1 Create GTM server container

1. Open [tagmanager.google.com](https://tagmanager.google.com)
2. In your existing account, click **Create Container**
3. Name it: `[domain] – Server`
4. Select **Server** as the target platform
5. Click **Create**

### 1.2 Configure hosting

**Taggrs.io method (recommended):**

1. Create a Taggrs.io account at [taggrs.io](https://taggrs.io)
2. Add a new server container
3. Enter your GTM Server Container ID (starts with `GTM-`)
4. Select your preferred hosting region (closest to your primary audience)
5. Taggrs provisions the server automatically

**Stape.io method (recommended):**

1. Create a Stape.io account at [stape.io](https://stape.io)
2. Add a new server container
3. Enter your GTM Server Container ID (starts with `GTM-`)
4. Select your preferred hosting region (closest to your primary audience)
5. Stape provisions the server automatically

**Google Cloud Platform method:**

1. Open [cloud.google.com](https://cloud.google.com)
2. Create a new project or select an existing one
3. In GTM, go to your server container and click **Provision tagging server**
4. Follow the wizard to deploy to Google Cloud Run (or App Engine)
5. Note the generated server URL

### 1.3 Set up custom subdomain

1. Choose a subdomain: `ss.yourdomain.com` or `data.yourdomain.com`
2. In your DNS provider, create a CNAME record pointing the subdomain to:

| Hosting method | CNAME target |
| --- | --- |
| Taggrs.io | The endpoint URL provided by Taggrs |
| Stape.io | The endpoint URL provided by Stape |
| Google Cloud | The Cloud Run service URL |
| Custom server | Your server's domain |

3. Configure SSL for the subdomain (Taggrs and Stape handle this automatically, GCP requires manual setup)

### 1.4 Verify server container loads

1. Open the server container URL in a browser: `https://ss.yourdomain.com`
2. Confirm a response is returned (a blank page or a health check response is expected)
3. In GTM, open the server container and click **Preview** to confirm the debugger connects

---

## Phase 2️⃣: Configure web-to-server routing

### 2.1 Update Google Tag in web container

1. Open your GTM **web** container
2. Navigate to your Google Tag (the tag that fires on All Pages)
3. In the tag configuration, expand **Configuration Settings**
4. Add a setting: `server_container_url` with the value `https://ss.yourdomain.com`
5. Save the tag

### 2.2 Update transport URL

1. In the Google Tag configuration, set the transport URL to your server container subdomain
2. This routes all measurement requests through your first-party server instead of directly to Google

### 2.3 Verify routing in web container

1. Enable GTM Preview mode on the web container
2. Load your website
3. Verify in the network tab that requests go to `ss.yourdomain.com` instead of `www.googletagmanager.com` or `www.google-analytics.com`

---

## Phase 3️⃣: Set up server-side tags

### 3.1 Create GA4 client (if using GA4)

1. Open your GTM **server** container
2. Navigate to **Clients**
3. Verify the **GA4** client is present (it is created by default)
4. This client receives incoming GA4 requests and parses them for server-side tags

### 3.2 Create Google Ads Conversion Tracking tag

1. In the server container, create a new tag
2. Select **Google Ads Conversion Tracking** tag type
3. Configure:

| Field | Value |
| --- | --- |
| Conversion ID | Your Google Ads Conversion ID |
| Conversion Label | The label for this conversion action |
| Conversion Value | Event data variable for value |
| Transaction ID | Event data variable for transaction_id |
| Currency Code | Event data variable for currency |

4. Set trigger to fire on the appropriate event (e.g., `purchase` event from the GA4 client)

### 3.3 Create GA4 tag (if using GA4)

1. Create a new tag in the server container
2. Select **Google Analytics: GA4** tag type
3. Configure with your GA4 Measurement ID
4. Set trigger to fire on all events from the GA4 client

### 3.4 Replicate for all conversion actions

Repeat Step 3.2 for each Google Ads conversion action. Each action needs its own server-side tag with the correct Conversion Label.

---

## Phase 4️⃣: Validate and launch

### 4.1 Debug with server container Preview

1. In GTM, click **Preview** on the server container
2. Open your website and trigger a test conversion
3. In the server container debugger, verify:

| Check | Expected result |
| --- | --- |
| Client claims the request | GA4 client shows "Claimed" |
| Google Ads tag fires | Tag shows under "Tags Fired" |
| Conversion data correct | Value, Transaction ID, currency all pass through |
| Response sent to Google Ads | Outgoing HTTP request to googleads.g.doubleclick.net |

### 4.2 Compare conversion counts

1. Allow 48-72 hours of parallel tracking (web and server)
2. Compare conversion counts in Google Ads:

| Metric | Source | Action if mismatched |
| --- | --- | --- |
| Total conversions | Google Ads report | Check server container tag firing |
| Conversion value | Google Ads report | Verify value variable mapping |
| Backend conversions | CRM or ecommerce platform | Adjust for attribution window |

### 4.3 Publish both containers

1. Publish the **server** container with a descriptive version name
2. Publish the **web** container with the routing updates
3. Monitor for 7 days to confirm stable data flow

### 4.4 Final checklist

- [ ] Server container is live on custom subdomain with SSL
- [ ] Web container routes requests to server container
- [ ] All Google Ads conversion tags fire correctly in server container
- [ ] GA4 tag forwards data correctly (if applicable)
- [ ] Conversion counts align between client-side and server-side
- [ ] Page load speed improved (check with PageSpeed Insights)
- [ ] Both containers published

---

### Validation & definition of done

This SOP is complete when:

- [ ] Server container deployed and accessible on custom subdomain
- [ ] Web container routing data through server container
- [ ] All conversion tags firing correctly in server container
- [ ] 48-72 hours of verified parallel tracking
- [ ] Conversion data alignment confirmed

---

### Exit → Entry bridge

Once SST is live:

| Timeframe | Action |
| --- | --- |
| Immediately | Implement Enhanced Conversions via server container if not done |
| Week 1 | Monitor page speed improvements |
| Week 2 | Compare pre-SST and post-SST conversion volumes |
| Ongoing | Check server container health monthly |

**If issues arise:**

| Issue | Route to |
| --- | --- |
| Server container not receiving data | Verify web container routing URL and DNS records |
| Tags not firing in server container | Check Client configuration and event matching |
| Conversion counts drop after SST | Verify tag triggers match the correct events |
| SSL certificate expired | Renew through hosting provider |

---

### FAQ

**Q: Does server-side tagging replace client-side tracking?**

A: No. SST works alongside your web container. The web container collects data in the browser and routes it to the server container, which then forwards it to platforms. Both containers work together.

**Q: How much does server-side tagging cost?**

A: Taggrs.io and Stape.io start at around €20/month for low-traffic sites. Google Cloud Platform costs vary based on request volume. Custom servers depend on your infrastructure. For most advertisers, a middleware provider like Taggrs.io or Stape.io is the most cost-effective option.

**Q: Will SST fix all my tracking gaps?**

A: SST addresses ad blocker issues, cookie restrictions, and browser limitations. It does not fix consent-related gaps (you still need Consent Mode for that) or attribution gaps across channels.

---

### Quick reference: Support library

| Document | Type | Used in |
| --- | --- | --- |
| [Measurement Maturity Mental Model](../mental-models/Measurement Maturity Mental Model.md) | Mental Model | Context |
| [Conversion Action Reference](../references/Conversion Action Reference.md) | Reference | Phase 3 |

---

### Related SOPs

| SOP | Relationship |
| --- | --- |
| [SOP – Set Up Google Ads Conversion Tracking](../sops/SOP – Set Up Google Ads Conversion Tracking.md) | Upstream (GACT must exist first) |
| [SOP – Implement Enhanced Conversions](../sops/SOP – Implement Enhanced Conversions.md) | Parallel (can be done via server container) |

---

### Common failures

| Failure | Why it happens | How to avoid |
| --- | --- | --- |
| DNS not propagated | CNAME record not set correctly | Verify DNS propagation before proceeding (allow 24 hours) |
| SSL certificate issues | Manual setup on GCP missed steps | Use Taggrs.io or Stape.io for automatic SSL, or verify cert covers subdomain |
| Double counting conversions | Both web and server tags fire for same action | Remove web container conversion tags once server tags are verified |
| Server container down | Hosting not scaled for traffic | Monitor server health, set up alerts |
| Slow response times | Server hosted in wrong region | Choose hosting region closest to primary audience |
| Events not claimed by client | Wrong client type or event format | Verify GA4 client is enabled and web container sends GA4 format |

---

### Version details

- **Version:** 1.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

### Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

© 2026 PPC Mastery B.V. All rights reserved.
