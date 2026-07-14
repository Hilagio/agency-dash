/**
 * Notion "Stores" sync — READ-ONLY, nightly.
 *
 * Notion is the answer to exactly one question: "which stores exist?".
 * This module mirrors the Notion Stores database into agency-dash `Account`
 * rows. It NEVER writes anything back to Notion.
 *
 * Uses the plain Notion REST API with an internal integration token (the same
 * token stored per-org in NotionConnection). We deliberately do NOT use the
 * Notion MCP / SQL query mode — it is gated behind Business + Notion AI and 400s.
 *
 * Mapping (Notion Stores -> Account):
 *   page id                     -> notionPageId (sync key, unique)
 *   Store Name (title)          -> name
 *   Google Ads Customer ID      -> googleAdsId   (the 10-digit customer id)
 *   Slack Channel ID            -> slackChannelId
 *   Monthly Ad Spend (EUR)      -> monthlyBudget
 *   Status (select)             -> only "Active" stores are created/kept active
 *   Client (relation)           -> clientName    (resolved via the Client page title)
 *
 * Sync rules: upsert on notionPageId. If a store flips away from "Active",
 * mark Account.active = false (never delete — keep the history).
 */
import { prisma } from "@/lib/db";

// The Stores id in the spec is a *data source* id, which the modern data-sources
// API (2025-09-03) queries directly. We fall back to the legacy databases
// endpoint (2022-06-28) in case an env override points at a classic database id.
const NOTION_VERSION_DS = "2025-09-03";
const NOTION_VERSION_LEGACY = "2022-06-28";
const BASE = "https://api.notion.com/v1";

// Data source / database ids (overridable via env for other workspaces).
// NOTE on the spec's open question: the Stores DB has both "Google Ads Account ID"
// and "Google Ads Customer ID". The 10-digit id the Google Ads API expects is the
// *Customer ID*, so that is the property we read (configurable below).
const STORES_DB_ID = process.env.NOTION_STORES_DB_ID ?? "34307b74-2ba3-43be-8ab1-0672c1c37e54";
const CUSTOMER_ID_PROP = process.env.NOTION_CUSTOMER_ID_PROP ?? "Google Ads Customer ID";

export interface StoresSyncResult {
  created: number;
  updated: number;
  deactivated: number;
  skipped: Array<{ page: string; reason: string }>;
  errors: string[];
}

// ─── Notion property extractors ───────────────────────────────────────────────

type Prop = Record<string, unknown> | undefined;

function plainRichText(prop: Prop): string {
  const arr = ((prop?.rich_text ?? []) as Array<{ plain_text?: string }>);
  return arr.map(t => t.plain_text ?? "").join("").trim();
}
function plainTitle(prop: Prop): string {
  const arr = ((prop?.title ?? []) as Array<{ plain_text?: string }>);
  return arr.map(t => t.plain_text ?? "").join("").trim();
}
function numberValue(prop: Prop): number | null {
  const n = prop?.number;
  return typeof n === "number" ? n : null;
}
function selectName(prop: Prop): string | null {
  const s = prop?.select as { name?: string } | null | undefined;
  return s?.name ?? null;
}
function relationIds(prop: Prop): string[] {
  const arr = (prop?.relation ?? []) as Array<{ id: string }>;
  return arr.map(r => r.id);
}

/** Digits-only 10-digit Google Ads customer id (strips dashes/spaces). */
function normalizeCustomerId(raw: string): string {
  return raw.replace(/[^0-9]/g, "");
}

// ─── API helper ───────────────────────────────────────────────────────────────

async function notionFetch(token: string, path: string, version: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": version,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    const err = new Error(`Notion API ${res.status}: ${body}`) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  return res.json();
}

/**
 * Query a page of stores. Tries the data-sources endpoint (2025-09-03) first —
 * the spec's Stores id is a data-source id — and falls back to the legacy
 * databases endpoint if the id turns out to be a classic database id.
 */
async function queryStoresPage(token: string, body: Record<string, unknown>) {
  try {
    return await notionFetch(token, `/data_sources/${STORES_DB_ID}/query`, NOTION_VERSION_DS, {
      method: "POST", body: JSON.stringify(body),
    });
  } catch (err) {
    const status = (err as { status?: number }).status;
    if (status === 404 || status === 400) {
      return await notionFetch(token, `/databases/${STORES_DB_ID}/query`, NOTION_VERSION_LEGACY, {
        method: "POST", body: JSON.stringify(body),
      });
    }
    throw err;
  }
}

/** Query every store page (all statuses — we handle Active/non-Active in-code). */
async function queryAllStores(token: string): Promise<Array<Record<string, unknown>>> {
  const pages: Array<Record<string, unknown>> = [];
  let cursor: string | undefined;
  do {
    const body: Record<string, unknown> = { page_size: 100 };
    if (cursor) body.start_cursor = cursor;
    const data = await queryStoresPage(token, body);
    pages.push(...(data.results ?? []));
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);
  return pages;
}

/** Resolve a Client relation page id -> its title, cached across the sync run. */
async function resolveClientName(
  token: string,
  clientId: string,
  cache: Map<string, string>,
): Promise<string | null> {
  if (cache.has(clientId)) return cache.get(clientId)!;
  try {
    const page = await notionFetch(token, `/pages/${clientId}`, NOTION_VERSION_DS);
    const props = (page.properties ?? {}) as Record<string, Prop>;
    let name = "";
    for (const val of Object.values(props)) {
      if ((val as Record<string, unknown>)?.type === "title") {
        name = plainTitle(val);
        break;
      }
    }
    cache.set(clientId, name);
    return name || null;
  } catch {
    return null;
  }
}

// ─── Sync ─────────────────────────────────────────────────────────────────────

/**
 * Mirror the Notion Stores DB into Account rows for one organization.
 * Read-only against Notion. Returns a per-run summary.
 */
export async function syncStoresFromNotion(
  token: string,
  organizationId: string,
): Promise<StoresSyncResult> {
  const result: StoresSyncResult = {
    created: 0, updated: 0, deactivated: 0, skipped: [], errors: [],
  };

  const stores = await queryAllStores(token);
  const clientCache = new Map<string, string>();
  const seenActivePageIds = new Set<string>();

  for (const page of stores) {
    const pageId = page.id as string;
    const props = (page.properties ?? {}) as Record<string, Prop>;

    const name = plainTitle(props["Store Name"]) || "(unnamed store)";
    const status = selectName(props["Status"]);

    // Non-Active store: deactivate an existing mirror, never create one.
    if (status !== "Active") {
      const existing = await prisma.account.findUnique({ where: { notionPageId: pageId } });
      if (existing && existing.active) {
        await prisma.account.update({ where: { id: existing.id }, data: { active: false } });
        result.deactivated++;
      }
      continue;
    }

    const rawCustomerId = plainRichText(props[CUSTOMER_ID_PROP]);
    const customerId = normalizeCustomerId(rawCustomerId);
    if (!customerId) {
      result.skipped.push({ page: name, reason: `missing "${CUSTOMER_ID_PROP}"` });
      continue;
    }

    const slackChannelId = plainRichText(props["Slack Channel ID"]) || null;
    const monthlyBudget = numberValue(props["Monthly Ad Spend"]);

    const clientRel = relationIds(props["Client"]);
    const clientName = clientRel.length
      ? await resolveClientName(token, clientRel[0], clientCache)
      : null;

    seenActivePageIds.add(pageId);

    try {
      const existing = await prisma.account.findUnique({ where: { notionPageId: pageId } });
      // Fields Notion owns. Ownership config (targets, tolerances, ownerId) is
      // never touched here — it is tuned inside agency-dash.
      const notionFields = {
        name,
        googleAdsId: customerId,
        slackChannelId,
        clientName,
        active: true,
        ...(monthlyBudget != null ? { monthlyBudget } : {}),
      };

      if (existing) {
        await prisma.account.update({ where: { id: existing.id }, data: notionFields });
        result.updated++;
      } else {
        await prisma.account.create({
          data: { organizationId, notionPageId: pageId, currency: "EUR", ...notionFields },
        });
        result.created++;
      }
    } catch (err) {
      result.errors.push(`${name}: ${err instanceof Error ? err.message : "unknown error"}`);
    }
  }

  return result;
}
