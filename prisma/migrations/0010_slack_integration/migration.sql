-- Slack integration: per-org bot token connection
CREATE TABLE "SlackConnection" (
  "id"             TEXT NOT NULL PRIMARY KEY,
  "organizationId" TEXT NOT NULL UNIQUE,
  "botToken"       TEXT NOT NULL,
  "teamId"         TEXT,
  "teamName"       TEXT,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SlackConnection_organizationId_fkey"
    FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Per-account Slack channel link
ALTER TABLE "Account"
  ADD COLUMN "slackChannelId"   TEXT,
  ADD COLUMN "slackChannelName" TEXT;
