-- AlterTable
ALTER TABLE "Opportunity" ADD COLUMN     "applicationMode" TEXT NOT NULL DEFAULT 'EXTERNAL';

-- CreateIndex
CREATE INDEX "Opportunity_applicationMode_idx" ON "Opportunity"("applicationMode");
