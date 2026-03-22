-- SaaS foundation: multi-tenancy, user auth, org management
-- Safely migrates existing single-tenant data to the default "My Agency" org

-- ── New tables ────────────────────────────────────────────────────────────────

CREATE TABLE "Organization" (
  "id"        TEXT NOT NULL,
  "name"      TEXT NOT NULL,
  "slug"      TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Organization_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Organization_slug_key" UNIQUE ("slug")
);

CREATE TABLE "User" (
  "id"        TEXT NOT NULL,
  "email"     TEXT NOT NULL,
  "name"      TEXT,
  "image"     TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "User_email_key" UNIQUE ("email")
);

CREATE TABLE "OrganizationMember" (
  "id"             TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "userId"         TEXT NOT NULL,
  "role"           TEXT NOT NULL DEFAULT 'SPECIALIST',
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OrganizationMember_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OrganizationMember_organizationId_userId_key" UNIQUE ("organizationId", "userId"),
  CONSTRAINT "OrganizationMember_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "OrganizationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "OrganizationInvite" (
  "id"             TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "email"          TEXT NOT NULL,
  "role"           TEXT NOT NULL DEFAULT 'SPECIALIST',
  "token"          TEXT NOT NULL,
  "expiresAt"      TIMESTAMP(3) NOT NULL,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "usedAt"         TIMESTAMP(3),
  CONSTRAINT "OrganizationInvite_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OrganizationInvite_token_key" UNIQUE ("token"),
  CONSTRAINT "OrganizationInvite_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ── Add organizationId to existing tables (nullable first) ────────────────────

ALTER TABLE "Account"          ADD COLUMN "organizationId" TEXT;
ALTER TABLE "AgencySop"        ADD COLUMN "organizationId" TEXT;
ALTER TABLE "OAuthCredential"  ADD COLUMN "organizationId" TEXT;

-- ── Seed the bootstrap organization ──────────────────────────────────────────
-- Existing data is moved into "My Agency" org so nothing breaks

INSERT INTO "Organization" ("id", "name", "slug", "createdAt", "updatedAt")
VALUES ('clbootstrap0000000000000001', 'My Agency', 'my-agency', NOW(), NOW());

UPDATE "Account"         SET "organizationId" = 'clbootstrap0000000000000001';
UPDATE "AgencySop"       SET "organizationId" = 'clbootstrap0000000000000001';
UPDATE "OAuthCredential" SET "organizationId" = 'clbootstrap0000000000000001';

-- Fix the OAuthCredential singleton id → proper cuid
UPDATE "OAuthCredential" SET "id" = 'clsingleton000000000000001' WHERE "id" = 'singleton';

-- ── Enforce NOT NULL + add constraints ────────────────────────────────────────

ALTER TABLE "Account"         ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "AgencySop"       ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "OAuthCredential" ALTER COLUMN "organizationId" SET NOT NULL;

ALTER TABLE "OAuthCredential" ADD CONSTRAINT "OAuthCredential_organizationId_key" UNIQUE ("organizationId");

ALTER TABLE "Account" ADD CONSTRAINT "Account_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "AgencySop" ADD CONSTRAINT "AgencySop_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "OAuthCredential" ADD CONSTRAINT "OAuthCredential_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
