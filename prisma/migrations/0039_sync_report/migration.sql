-- Persist the last Notion stores-sync report so skipped/errored stores are visible.
ALTER TABLE "NotionConnection" ADD COLUMN IF NOT EXISTS "lastSyncResult" TEXT;
