-- CreateTable
CREATE TABLE "Career" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "location" TEXT,
    "employmentType" TEXT NOT NULL,
    "workMode" TEXT,
    "industry" TEXT,
    "description" TEXT NOT NULL,
    "requirements" TEXT NOT NULL,
    "responsibilities" TEXT,
    "benefits" TEXT,
    "salary" TEXT,
    "applicationUrl" TEXT,
    "deadline" TIMESTAMP(3),
    "sourceName" TEXT,
    "sourceUrl" TEXT,
    "verificationStatus" TEXT NOT NULL DEFAULT 'PUBLIC_LISTED',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Career_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Career_slug_key" ON "Career"("slug");

-- CreateIndex
CREATE INDEX "Career_employmentType_idx" ON "Career"("employmentType");

-- CreateIndex
CREATE INDEX "Career_country_idx" ON "Career"("country");

-- CreateIndex
CREATE INDEX "Career_industry_idx" ON "Career"("industry");

-- CreateIndex
CREATE INDEX "Career_verificationStatus_idx" ON "Career"("verificationStatus");

-- CreateIndex
CREATE INDEX "Career_status_idx" ON "Career"("status");

-- CreateIndex
CREATE INDEX "Career_featured_idx" ON "Career"("featured");

-- CreateIndex
CREATE INDEX "Career_deadline_idx" ON "Career"("deadline");

-- CreateIndex
CREATE INDEX "Career_createdAt_idx" ON "Career"("createdAt");
