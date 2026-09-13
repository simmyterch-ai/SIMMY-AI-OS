-- CreateTable
CREATE TABLE "MarketplaceEnquiry" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER,
    "productName" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "quantity" INTEGER,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketplaceEnquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MarketplaceEnquiry_productId_idx" ON "MarketplaceEnquiry"("productId");

-- CreateIndex
CREATE INDEX "MarketplaceEnquiry_status_idx" ON "MarketplaceEnquiry"("status");

-- CreateIndex
CREATE INDEX "MarketplaceEnquiry_email_idx" ON "MarketplaceEnquiry"("email");

-- CreateIndex
CREATE INDEX "MarketplaceEnquiry_createdAt_idx" ON "MarketplaceEnquiry"("createdAt");

-- AddForeignKey
ALTER TABLE "MarketplaceEnquiry" ADD CONSTRAINT "MarketplaceEnquiry_productId_fkey" FOREIGN KEY ("productId") REFERENCES "MarketplaceProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;
