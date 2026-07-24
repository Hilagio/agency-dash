-- Join requests for the team workspace. Additive + idempotent.
CREATE TABLE IF NOT EXISTS "OrgJoinRequest" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "decidedBy" TEXT,
    "decidedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrgJoinRequest_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "OrgJoinRequest_organizationId_userId_key"
    ON "OrgJoinRequest"("organizationId", "userId");

DO $$ BEGIN
    ALTER TABLE "OrgJoinRequest"
        ADD CONSTRAINT "OrgJoinRequest_organizationId_fkey"
        FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE "OrgJoinRequest"
        ADD CONSTRAINT "OrgJoinRequest_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
