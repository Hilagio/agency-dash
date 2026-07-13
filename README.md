This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Account Ownership System

A headless red/yellow/green engine that mirrors the Notion "Stores" DB, scores
each account from Google Ads, and drives the Slack ownership flow. See
`AGENTS.md` for the full spec.

### Cron endpoints (configure on Railway; POST with `Authorization: Bearer $CRON_SECRET`)

| Endpoint | Schedule | What it does |
|---|---|---|
| `POST /api/integrations/notion/sync-stores` | nightly | Read-only Notion Stores → `accounts` sync |
| `POST /api/ownership/shadow-digest` | 07:00 daily (Europe/Amsterdam) | Pilot shadow run: evaluate `ownershipEnabled` accounts, post one digest to the ownership channel — nothing to client channels |

Both endpoints also accept a logged-in session (manual trigger, caller's org only).

### Env vars

| Var | Purpose |
|---|---|
| `CRON_SECRET` | Bearer token authorizing the nightly cron POSTs |
| `NOTION_STORES_DB_ID` | Override the Notion Stores database id (default: the ecomtrada Stores DB) |
| `NOTION_CUSTOMER_ID_PROP` | Notion property read as the 10-digit Google Ads customer id (default: `Google Ads Customer ID`) |
| `OWNERSHIP_SHADOW_CHANNEL_ID` | Internal channel for the shadow digest (default: `C0BGYLDP941`) |

Pilot: set `ownershipEnabled = true` on 5–10 accounts, seed `ownerId` +
`primaryKpi`/`targetValue` per account, then validate the shadow digest for
1–2 weeks before enabling per-channel cards.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
