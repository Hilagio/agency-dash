/**
 * PPC OS knowledge base — live MCP connector.
 *
 * Attaches the PPC OS (PPC Mastery, Bob Meijer's Google Ads methodology) MCP
 * server to the app's Anthropic calls so the assistant can retrieve real PPC OS
 * guidance on demand — via the Messages API MCP connector (server-side; Anthropic
 * makes the MCP connection).
 *
 * Configuration is env-only — the access token is a secret and never lives in
 * the repo:
 *   PPC_OS_MCP_URL    (default: https://os.ppcmastery.com/api/mcp)
 *   PPC_OS_MCP_TOKEN  (Bearer token from os.ppcmastery.com — required to enable)
 *
 * Returns null when unconfigured, so callers cleanly fall back to a plain request.
 */

const DEFAULT_URL = "https://os.ppcmastery.com/api/mcp";
const SERVER_NAME = "ppc-os";
const MCP_BETA = "mcp-client-2025-11-20";

export interface PpcOsMcp {
  betas: string[];
  mcp_servers: Array<{ type: "url"; url: string; name: string; authorization_token: string }>;
  tools: Array<{ type: "mcp_toolset"; mcp_server_name: string }>;
}

/** MCP-connector params for client.beta.messages.*, or null when unconfigured. */
export function ppcOsMcp(): PpcOsMcp | null {
  const token = process.env.PPC_OS_MCP_TOKEN;
  if (!token) return null;
  const url = process.env.PPC_OS_MCP_URL ?? DEFAULT_URL;
  return {
    betas: [MCP_BETA],
    mcp_servers: [{ type: "url", url, name: SERVER_NAME, authorization_token: token }],
    tools: [{ type: "mcp_toolset", mcp_server_name: SERVER_NAME }],
  };
}

/** A system-prompt note that tells the model the KB tools exist and when to use them. */
export const PPC_OS_SYSTEM_NOTE =
  "\n\nYou have access to the PPC OS knowledge base (Bob Meijer's Google Ads methodology) " +
  "through the `ppc-os` tools: `search` for any Google Ads strategy, setup, or optimization " +
  "question, `fetch` to read more of a specific document, and `updates` for PPC OS product news. " +
  "Consult it whenever a question touches Google Ads methodology rather than answering from memory alone.";
