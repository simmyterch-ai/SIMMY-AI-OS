-- CreateTable
CREATE TABLE "EducationProvider" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT,
    "description" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "logoUrl" TEXT,
    "verificationStatus" TEXT NOT NULL DEFAULT 'PUBLIC_LISTED',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EducationProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducationProgram" (
    "id" SERIAL NOT NULL,
    "providerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "fieldOfStudy" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "eligibility" TEXT NOT NULL,
    "duration" TEXT,
    "studyMode" TEXT,
    "tuition" TEXT,
    "currency" TEXT,
    "applicationUrl" TEXT,
    "deadline" TIMESTAMP(3),
    "intake" TEXT,
    "verificationStatus" TEXT NOT NULL DEFAULT 'PUBLIC_LISTED',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EducationProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingCourse" (
    "id" SERIAL NOT NULL,
    "providerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "eligibility" TEXT NOT NULL,
    "duration" TEXT,
    "deliveryMode" TEXT,
    "cost" TEXT,
    "currency" TEXT,
    "applicationUrl" TEXT,
    "deadline" TIMESTAMP(3),
    "verificationStatus" TEXT NOT NULL DEFAULT 'PUBLIC_LISTED',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingCourse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EducationProvider_slug_key" ON "EducationProvider"("slug");

-- CreateIndex
CREATE INDEX "EducationProvider_type_idx" ON "EducationProvider"("type");

-- CreateIndex
CREATE INDEX "EducationProvider_country_idx" ON "EducationProvider"("country");

-- CreateIndex
CREATE INDEX "EducationProvider_verificationStatus_idx" ON "EducationProvider"("verificationStatus");

-- CreateIndex
CREATE INDEX "EducationProvider_status_idx" ON "EducationProvider"("status");

-- CreateIndex
CREATE INDEX "EducationProvider_featured_idx" ON "EducationProvider"("featured");

-- CreateIndex
CREATE INDEX "EducationProvider_createdAt_idx" ON "EducationProvider"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "EducationProgram_slug_key" ON "EducationProgram"("slug");

-- CreateIndex
CREATE INDEX "EducationProgram_providerId_idx" ON "EducationProgram"("providerId");

-- CreateIndex
CREATE INDEX "EducationProgram_level_idx" ON "EducationProgram"("level");

-- CreateIndex
CREATE INDEX "EducationProgram_fieldOfStudy_idx" ON "EducationProgram"("fieldOfStudy");

-- CreateIndex
CREATE INDEX "EducationProgram_verificationStatus_idx" ON "EducationProgram"("verificationStatus");

-- CreateIndex
CREATE INDEX "EducationProgram_status_idx" ON "EducationProgram"("status");

-- CreateIndex
CREATE INDEX "EducationProgram_featured_idx" ON "EducationProgram"("featured");

-- CreateIndex
CREATE INDEX "EducationProgram_deadline_idx" ON "EducationProgram"("deadline");

-- CreateIndex
CREATE INDEX "EducationProgram_createdAt_idx" ON "EducationProgram"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingCourse_slug_key" ON "TrainingCourse"("slug");

-- CreateIndex
CREATE INDEX "TrainingCourse_providerId_idx" ON "TrainingCourse"("providerId");

-- CreateIndex
CREATE INDEX "TrainingCourse_category_idx" ON "TrainingCourse"("category");

-- CreateIndex
CREATE INDEX "TrainingCourse_verificationStatus_idx" ON "TrainingCourse"("verificationStatus");

-- CreateIndex
CREATE INDEX "TrainingCourse_status_idx" ON "TrainingCourse"("status");

-- CreateIndex
CREATE INDEX "TrainingCourse_featured_idx" ON "TrainingCourse"("featured");

-- CreateIndex
CREATE INDEX "TrainingCourse_deadline_idx" ON "TrainingCourse"("deadline");

-- CreateIndex
CREATE INDEX "TrainingCourse_createdAt_idx" ON "TrainingCourse"("createdAt");

-- AddForeignKey
ALTER TABLE "EducationProgram" ADD CONSTRAINT "EducationProgram_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "EducationProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingCourse" ADD CONSTRAINT "TrainingCourse_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "EducationProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
