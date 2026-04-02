-- Notion integration: per-org connection and page content cache
CREATE TABLE "NotionConnection" (
  "id"              TEXT NOT NULL PRIMARY KEY,
  "organizationId"  TEXT NOT NULL UNIQUE,
  "accessToken"     TEXT NOT NULL,
  "workspaceName"   TEXT,
  "selectedPageIds" TEXT NOT NULL DEFAULT '[]',
  "lastSyncedAt"    TIMESTAMP(3),
  "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "NotionConnection_organizationId_fkey"
    FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "NotionPageCache" (
  "id"           TEXT NOT NULL PRIMARY KEY,
  "connectionId" TEXT NOT NULL,
  "pageId"       TEXT NOT NULL,
  "title"        TEXT NOT NULL,
  "content"      TEXT NOT NULL,
  "fetchedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "NotionPageCache_connectionId_fkey"
    FOREIGN KEY ("connectionId") REFERENCES "NotionConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "NotionPageCache_connectionId_pageId_key" UNIQUE ("connectionId", "pageId")
);

-- AI feedback loop: thumbs up/down on assistant messages with optional correction
CREATE TABLE "ChatFeedback" (
  "id"           TEXT NOT NULL PRIMARY KEY,
  "messageId"    TEXT NOT NULL,
  "orgId"        TEXT NOT NULL,
  "rating"       TEXT NOT NULL,
  "correction"   TEXT,
  "questionText" TEXT,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Learned patterns: org-specific or global, promoted from feedback
CREATE TABLE "LearnedPattern" (
  "id"           TEXT NOT NULL PRIMARY KEY,
  "orgId"        TEXT,
  "questionType" TEXT NOT NULL,
  "pattern"      TEXT NOT NULL,
  "seenCount"    INTEGER NOT NULL DEFAULT 1,
  "isActive"     BOOLEAN NOT NULL DEFAULT true,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
