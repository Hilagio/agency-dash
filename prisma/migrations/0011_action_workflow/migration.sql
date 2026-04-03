-- Action workflow: snooze, assign, done note
ALTER TABLE "ActionRecommendation" ADD COLUMN "snoozedUntil" TIMESTAMP(3);
ALTER TABLE "ActionRecommendation" ADD COLUMN "assignedTo"   TEXT;
ALTER TABLE "ActionRecommendation" ADD COLUMN "doneNote"     TEXT;
