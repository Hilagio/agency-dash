-- Manual archive flag for stores that are no longer clients.
-- Independent of Notion's Active status: the nightly sync never clears this,
-- so an archived store stays hidden even while it's still Active in Notion.
ALTER TABLE "Account" ADD COLUMN "archived" BOOLEAN NOT NULL DEFAULT false;
