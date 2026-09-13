-- CreateTable
CREATE TABLE "PublicAccount" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT,
    "city" TEXT,
    "profileImage" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublicAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PublicAccount_email_key" ON "PublicAccount"("email");

-- CreateIndex
CREATE INDEX "PublicAccount_status_idx" ON "PublicAccount"("status");

-- CreateIndex
CREATE INDEX "PublicAccount_country_idx" ON "PublicAccount"("country");

-- CreateIndex
CREATE INDEX "PublicAccount_createdAt_idx" ON "PublicAccount"("createdAt");
