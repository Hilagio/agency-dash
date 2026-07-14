/**
 * Notion REST API integration.
 *
 * Uses the Notion API v1 directly (no SDK) to:
 *  1. List pages shared with an integration token
 *  2. Fetch a page's full block tree and convert it to clean plain text
 *
 * The plain text output is cached in NotionPageCache and injected into AI prompts.
 */

const NOTION_VERSION = "2022-06-28";
const BASE = "https://api.notion.com/v1";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NotionPageMeta {
  id:    string;
  title: string;
  url:   string;
}

// ─── API helpers ──────────────────────────────────────────────────────────────

async function notionFetch(token: string, path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      Authorization:    `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type":   "application/json",
      ...(options.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Notion API ${res.status}: ${body}`);
  }
  return res.json();
}

// ─── Health probe ──────────────────────────────────────────────────────────────

export interface NotionPing { ok: boolean; workspace?: string; error?: string; }

/** Light live check that a Notion integration token still works. */
export async function pingNotion(token: string): Promise<NotionPing> {
  try {
    const me = await notionFetch(token, "/users/me") as { name?: string; bot?: { workspace_name?: string } };
    return { ok: true, workspace: me?.bot?.workspace_name ?? me?.name ?? "connected" };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message.slice(0, 200) : String(err) };
  }
}

// ─── Page listing ─────────────────────────────────────────────────────────────

/**
 * Returns all pages (and databases) shared with this integration token.
 * Notion only returns objects the integration has been explicitly given access to.
 */
export async function listNotionPages(token: string): Promise<NotionPageMeta[]> {
  const results: NotionPageMeta[] = [];
  let cursor: string | undefined;

  do {
    const body: Record<string, unknown> = { filter: { value: "page", property: "object" }, page_size: 100 };
    if (cursor) body.start_cursor = cursor;

    const data = await notionFetch(token, "/search", { method: "POST", body: JSON.stringify(body) });

    for (const page of data.results ?? []) {
      const title = extractPageTitle(page);
      results.push({ id: page.id, title, url: page.url ?? "" });
    }

    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);

  return results;
}

function extractPageTitle(page: Record<string, unknown>): string {
  // Page title lives in properties.title or properties.Name depending on type
  const props = (page.properties ?? {}) as Record<string, unknown>;
  for (const val of Object.values(props)) {
    const v = val as Record<string, unknown>;
    if (v.type === "title") {
      const arr = (v.title ?? []) as Array<{ plain_text?: string }>;
      const t = arr.map(t => t.plain_text ?? "").join("").trim();
      if (t) return t;
    }
  }
  // Fallback: check top-level title (databases)
  const titleArr = (page as Record<string, unknown[]>).title as Array<{ plain_text?: string }> | undefined;
  if (titleArr) return titleArr.map(t => t.plain_text ?? "").join("").trim() || "Untitled";
  return "Untitled";
}

// ─── Block-to-text conversion ─────────────────────────────────────────────────

/**
 * Fetches a page's full block tree and converts it to clean plain text,
 * suitable for injection into an AI system prompt.
 */
export async function fetchPageContent(token: string, pageId: string): Promise<string> {
  const lines: string[] = [];
  await collectBlocks(token, pageId, lines, 0);
  return lines.join("\n").trim();
}

async function collectBlocks(token: string, blockId: string, lines: string[], depth: number) {
  let cursor: string | undefined;

  do {
    const path = `/blocks/${blockId}/children` + (cursor ? `?start_cursor=${cursor}&page_size=100` : "?page_size=100");
    const data = await notionFetch(token, path);

    for (const block of data.results ?? []) {
      const line = blockToText(block, depth);
      if (line !== null) lines.push(line);

      // Recurse into child blocks (e.g. toggle, callout, columns)
      if (block.has_children && !["child_page", "child_database"].includes(block.type)) {
        await collectBlocks(token, block.id, lines, depth + 1);
      }
    }

    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);
}

function richTextToPlain(richText: Array<{ plain_text?: string }> = []): string {
  return richText.map(t => t.plain_text ?? "").join("");
}

function blockToText(block: Record<string, unknown>, depth: number): string | null {
  const indent = "  ".repeat(depth);
  const type   = block.type as string;
  const data   = (block[type] ?? {}) as Record<string, unknown>;
  const rt     = (data.rich_text ?? []) as Array<{ plain_text?: string }>;
  const text   = richTextToPlain(rt).trim();

  switch (type) {
    case "heading_1": return `\n${indent}# ${text}`;
    case "heading_2": return `\n${indent}## ${text}`;
    case "heading_3": return `\n${indent}### ${text}`;
    case "paragraph":
      return text ? `${indent}${text}` : "";
    case "bulleted_list_item":
      return `${indent}- ${text}`;
    case "numbered_list_item":
      return `${indent}• ${text}`;
    case "to_do": {
      const checked = data.checked ? "[x]" : "[ ]";
      return `${indent}${checked} ${text}`;
    }
    case "toggle":
      return text ? `${indent}▶ ${text}` : null;
    case "callout":
      return text ? `${indent}> ${text}` : null;
    case "quote":
      return text ? `${indent}> ${text}` : null;
    case "code": {
      const code = richTextToPlain(rt);
      return `${indent}\`\`\`\n${indent}${code}\n${indent}\`\`\``;
    }
    case "divider":
      return `${indent}---`;
    case "table_of_contents":
    case "breadcrumb":
    case "embed":
    case "image":
    case "video":
    case "file":
    case "pdf":
    case "bookmark":
    case "link_preview":
      return null; // skip non-text blocks
    default:
      return text ? `${indent}${text}` : null;
  }
}

// ─── Workspace info ───────────────────────────────────────────────────────────

export async function getNotionWorkspaceName(token: string): Promise<string | null> {
  try {
    const data = await notionFetch(token, "/users/me");
    return (data.bot?.workspace_name as string) ?? null;
  } catch {
    return null;
  }
}
