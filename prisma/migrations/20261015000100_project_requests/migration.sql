-- Preserve existing requests and their internal IDs, contact data and delivery state.
BEGIN IMMEDIATE;
CREATE TABLE "new_Lead" (
 "id" TEXT NOT NULL PRIMARY KEY,
 "publicId" TEXT NOT NULL,
 "requestKind" TEXT NOT NULL,
 "status" TEXT NOT NULL DEFAULT 'NEW',
 "consent" BOOLEAN NOT NULL DEFAULT true,
 "companyContext" TEXT,
 "projectReference" TEXT,
 "timeline" TEXT,
 "sourceUrl" TEXT,
 "referrer" TEXT,
 "utmSource" TEXT,
 "utmMedium" TEXT,
 "utmCampaign" TEXT,
 "updatedAt" DATETIME NOT NULL,
 "submissionId" TEXT NOT NULL,
 "payloadHash" TEXT NOT NULL,
 "name" TEXT NOT NULL,
 "company" TEXT,
 "email" TEXT,
 "phone" TEXT,
 "telegram" TEXT,
 "service" TEXT NOT NULL,
 "budget" TEXT,
 "message" TEXT NOT NULL,
 "consentVersion" TEXT NOT NULL,
 "consentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "notificationStatus" TEXT NOT NULL DEFAULT 'pending',
 "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Lead" ("id", "publicId", "requestKind", "updatedAt", "submissionId", "payloadHash", "name", "company", "email", "phone", "telegram", "service", "budget", "message", "consentVersion", "consentAt", "notificationStatus", "createdAt")
SELECT "id", 'PW-' || (1000 + ROW_NUMBER() OVER (ORDER BY "createdAt", "id")), CASE WHEN "service" = 'support' THEN 'SUPPORT' ELSE 'PROJECT' END, "createdAt", "submissionId", "payloadHash", "name", "company", "email", "phone", "telegram", "service", "budget", "message", "consentVersion", "consentAt", "notificationStatus", "createdAt" FROM "Lead";
DROP TABLE "Lead";
ALTER TABLE "new_Lead" RENAME TO "Lead";
CREATE UNIQUE INDEX "Lead_publicId_key" ON "Lead"("publicId");
CREATE UNIQUE INDEX "Lead_submissionId_key" ON "Lead"("submissionId");
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");
CREATE INDEX "Lead_notificationStatus_idx" ON "Lead"("notificationStatus");
CREATE TABLE "LeadSequence" ("id" INTEGER NOT NULL PRIMARY KEY, "value" INTEGER NOT NULL);
INSERT INTO "LeadSequence" ("id", "value") SELECT 1, COALESCE(MAX(CAST(SUBSTR("publicId", 4) AS INTEGER)), 1000) FROM "Lead";
COMMIT;
