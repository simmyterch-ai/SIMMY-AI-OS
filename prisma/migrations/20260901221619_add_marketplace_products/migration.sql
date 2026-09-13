-- CreateTable
CREATE TABLE "MarketplaceProduct" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketplaceProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MarketplaceProduct_slug_key" ON "MarketplaceProduct"("slug");

-- CreateIndex
CREATE INDEX "MarketplaceProduct_category_idx" ON "MarketplaceProduct"("category");

-- CreateIndex
CREATE INDEX "MarketplaceProduct_status_idx" ON "MarketplaceProduct"("status");

-- CreateIndex
CREATE INDEX "MarketplaceProduct_featured_idx" ON "MarketplaceProduct"("featured");
