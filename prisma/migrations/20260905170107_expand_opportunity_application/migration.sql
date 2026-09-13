/*
  Warnings:

  - Added the required column `email` to the `OpportunityApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `OpportunityApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `OpportunityApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OpportunityApplication" ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "coverLetter" TEXT,
ADD COLUMN     "cvUrl" TEXT,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "message" TEXT,
ADD COLUMN     "phone" TEXT;

-- CreateIndex
CREATE INDEX "OpportunityApplication_email_idx" ON "OpportunityApplication"("email");
