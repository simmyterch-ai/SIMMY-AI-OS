-- CreateTable
CREATE TABLE "OpportunityApplication" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "opportunityId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpportunityApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OpportunityApplication_accountId_idx" ON "OpportunityApplication"("accountId");

-- CreateIndex
CREATE INDEX "OpportunityApplication_opportunityId_idx" ON "OpportunityApplication"("opportunityId");

-- CreateIndex
CREATE INDEX "OpportunityApplication_accountId_submittedAt_idx" ON "OpportunityApplication"("accountId", "submittedAt");

-- CreateIndex
CREATE INDEX "OpportunityApplication_status_idx" ON "OpportunityApplication"("status");

-- AddForeignKey
ALTER TABLE "OpportunityApplication" ADD CONSTRAINT "OpportunityApplication_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "PublicAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunityApplication" ADD CONSTRAINT "OpportunityApplication_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
