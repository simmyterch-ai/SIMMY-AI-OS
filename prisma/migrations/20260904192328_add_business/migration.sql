-- CreateTable
CREATE TABLE "Business" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT,
    "description" TEXT NOT NULL,
    "services" TEXT,
    "websiteUrl" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "logoUrl" TEXT,
    "verificationStatus" TEXT NOT NULL DEFAULT 'PUBLIC_LISTED',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Business_slug_key" ON "Business"("slug");

-- CreateIndex
CREATE INDEX "Business_category_idx" ON "Business"("category");

-- CreateIndex
CREATE INDEX "Business_country_idx" ON "Business"("country");

-- CreateIndex
CREATE INDEX "Business_verificationStatus_idx" ON "Business"("verificationStatus");

-- CreateIndex
CREATE INDEX "Business_status_idx" ON "Business"("status");

-- CreateIndex
CREATE INDEX "Business_featured_idx" ON "Business"("featured");

-- CreateIndex
CREATE INDEX "Business_createdAt_idx" ON "Business"("createdAt");
