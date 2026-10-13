CREATE TABLE "Lead" (
  "id" TEXT NOT NULL PRIMARY KEY,
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

CREATE UNIQUE INDEX "Lead_submissionId_key" ON "Lead"("submissionId");
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");
CREATE INDEX "Lead_notificationStatus_idx" ON "Lead"("notificationStatus");

CREATE TABLE "RateLimitBucket" (
  "key" TEXT NOT NULL PRIMARY KEY,
  "hits" INTEGER NOT NULL,
  "expiresAt" BIGINT NOT NULL
);

CREATE INDEX "RateLimitBucket_expiresAt_idx" ON "RateLimitBucket"("expiresAt");
