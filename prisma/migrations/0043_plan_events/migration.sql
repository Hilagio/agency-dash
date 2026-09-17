-- Plan audit trail: who did what, when, and why (deviations included).
CREATE TABLE IF NOT EXISTS "PlanEvent" (
  "id" TEXT NOT NULL,
  "planId" TEXT NOT NULL,
  "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "by" TEXT,
  "kind" TEXT NOT NULL,
  "detail" TEXT NOT NULL,
  CONSTRAINT "PlanEvent_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "PlanEvent_planId_at_idx" ON "PlanEvent"("planId", "at");
DO $$ BEGIN
  ALTER TABLE "PlanEvent" ADD CONSTRAINT "PlanEvent_planId_fkey"
    FOREIGN KEY ("planId") REFERENCES "PlanInstance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
