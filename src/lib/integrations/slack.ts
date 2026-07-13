/**
 * Slack API integration
 *
 * Uses a Bot Token (xoxb-) stored per organization.
 * Required bot scopes: channels:history, channels:read, groups:history, groups:read
 *
 * Setup: Create a Slack App at https://api.slack.com/apps, add the bot scopes,
 * install to workspace, copy the Bot User OAuth Token.
 */

export interface SlackChannel {
  id:         string;
  name:       string;
  isPrivate:  boolean;
  memberCount?: number;
}

export interface SlackMessage {
  ts:        string;  // Unix timestamp string (Slack's message ID)
  text:      string;
  user?:     string;  // User ID — resolved to name if possible
  username?: string;  // Bot display name, if applicable
  date:      string;  // ISO date string for readability
  /** Threaded replies, if any were fetched */
  replies?:  string[];
}

const SLACK_API = "https://slack.com/api";

async function slackGet(token: string, method: string, params: Record<string, string> = {}): Promise<Record<string, unknown>> {
  const url = new URL(`${SLACK_API}/${method}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  const data = await res.json() as Record<string, unknown>;
  if (!data.ok) throw new Error(`Slack API error (${method}): ${data.error}`);
  return data;
}

async function slackPost(token: string, method: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
  const res = await fetch(`${SLACK_API}/${method}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  const data = await res.json() as Record<string, unknown>;
  if (!data.ok) throw new Error(`Slack API error (${method}): ${data.error}`);
  return data;
}

/** Post a message to a channel. Returns the message ts (used later for chat.update). */
export async function postSlackMessage(
  token: string,
  channel: string,
  text: string,
  blocks?: unknown[],
): Promise<{ ts: string }> {
  const data = await slackPost(token, "chat.postMessage", {
    channel, text, ...(blocks ? { blocks } : {}), unfurl_links: false, unfurl_media: false,
  });
  return { ts: data.ts as string };
}

/** Update a previously-posted message in place (the pinned status card pattern). */
export async function updateSlackMessage(
  token: string,
  channel: string,
  ts: string,
  text: string,
  blocks?: unknown[],
): Promise<void> {
  await slackPost(token, "chat.update", { channel, ts, text, ...(blocks ? { blocks } : {}) });
}

/** Verify token and return team info */
export async function testSlackConnection(token: string): Promise<{ teamId: string; teamName: string }> {
  const data = await slackGet(token, "auth.test");
  return {
    teamId:   data.team_id as string,
    teamName: data.team   as string,
  };
}

/** List all channels the bot can see (public + private it's been invited to) */
export async function listSlackChannels(token: string): Promise<SlackChannel[]> {
  const channels: SlackChannel[] = [];
  let cursor = "";

  // Fetch public channels
  do {
    const params: Record<string, string> = { types: "public_channel,private_channel", limit: "200", exclude_archived: "true" };
    if (cursor) params.cursor = cursor;
    const data = await slackGet(token, "conversations.list", params);
    const list = data.channels as Array<{ id: string; name: string; is_private: boolean; num_members?: number }>;
    for (const c of list) {
      channels.push({ id: c.id, name: c.name, isPrivate: c.is_private, memberCount: c.num_members });
    }
    cursor = (data.response_metadata as { next_cursor?: string })?.next_cursor ?? "";
  } while (cursor);

  return channels.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Fetch messages from a channel going back up to `daysBack` days.
 * Returns messages in chronological order (oldest first), stripped of
 * bot/system noise, ready to be included in an AI prompt.
 */
export async function fetchSlackMessages(
  token: string,
  channelId: string,
  daysBack = 90,
): Promise<SlackMessage[]> {
  const oldest = String(Math.floor(Date.now() / 1000) - daysBack * 86_400);
  const messages: SlackMessage[] = [];
  let cursor = "";

  do {
    const params: Record<string, string> = { channel: channelId, limit: "200", oldest };
    if (cursor) params.cursor = cursor;
    const data = await slackGet(token, "conversations.history", params);
    const msgs = data.messages as Array<{
      ts: string; text: string; user?: string; username?: string;
      subtype?: string; bot_id?: string;
    }>;

    for (const m of msgs) {
      // Skip join/leave/channel_archive system messages
      if (m.subtype && !["bot_message"].includes(m.subtype)) continue;
      // Skip empty or very short bot messages (reactions, etc.)
      const text = (m.text ?? "").trim();
      if (!text || text.length < 10) continue;

      messages.push({
        ts:       m.ts,
        text:     cleanSlackText(text),
        user:     m.user,
        username: m.username,
        date:     new Date(parseFloat(m.ts) * 1000).toISOString().slice(0, 10),
      });
    }

    cursor = (data.response_metadata as { next_cursor?: string })?.next_cursor ?? "";
  } while (cursor);

  // Chronological order (Slack returns newest-first)
  return messages.reverse();
}

/** Format Slack messages as a readable block for AI context */
export function formatSlackForContext(messages: SlackMessage[], channelName: string): string {
  if (messages.length === 0) return "";

  const lines = messages.map(m => {
    const who = m.username ?? (m.user ? `<@${m.user}>` : "team");
    return `[${m.date}] ${who}: ${m.text}`;
  });

  return [
    `SLACK CHANNEL: #${channelName} (${messages.length} messages, ${messages[0].date} → ${messages[messages.length - 1].date})`,
    "---",
    ...lines,
    "---",
  ].join("\n");
}

/** Strip Slack formatting markup from message text */
function cleanSlackText(text: string): string {
  return text
    .replace(/<@[A-Z0-9]+>/g, "@user")         // user mentions
    .replace(/<#[A-Z0-9]+\|([^>]+)>/g, "#$1")  // channel links
    .replace(/<([^|>]+)\|([^>]+)>/g, "$2")     // named links
    .replace(/<([^>]+)>/g, "$1")                // plain links
    .replace(/\*/g, "")                         // bold
    .replace(/_/g, "")                          // italic
    .replace(/~~/g, "")                         // strikethrough
    .replace(/`{1,3}/g, "")                     // code
    .trim();
}
