-- CreateTable
CREATE TABLE "Opportunity" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "organizationName" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "location" TEXT,
    "description" TEXT NOT NULL,
    "eligibility" TEXT NOT NULL,
    "benefits" TEXT,
    "deadline" TIMESTAMP(3),
    "applicationUrl" TEXT,
    "sourceName" TEXT,
    "sourceUrl" TEXT,
    "verificationStatus" TEXT NOT NULL DEFAULT 'PUBLIC_LISTED',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Opportunity_slug_key" ON "Opportunity"("slug");

-- CreateIndex
CREATE INDEX "Opportunity_type_idx" ON "Opportunity"("type");

-- CreateIndex
CREATE INDEX "Opportunity_country_idx" ON "Opportunity"("country");

-- CreateIndex
CREATE INDEX "Opportunity_verificationStatus_idx" ON "Opportunity"("verificationStatus");

-- CreateIndex
CREATE INDEX "Opportunity_status_idx" ON "Opportunity"("status");

-- CreateIndex
CREATE INDEX "Opportunity_featured_idx" ON "Opportunity"("featured");

-- CreateIndex
CREATE INDEX "Opportunity_deadline_idx" ON "Opportunity"("deadline");

-- CreateIndex
CREATE INDEX "Opportunity_createdAt_idx" ON "Opportunity"("createdAt");
