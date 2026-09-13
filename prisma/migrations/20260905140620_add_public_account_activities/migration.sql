-- CreateTable
CREATE TABLE "PublicAccountActivity" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "itemId" INTEGER,
    "itemSlug" TEXT,
    "itemUrl" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublicAccountActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PublicAccountActivity_accountId_idx" ON "PublicAccountActivity"("accountId");

-- CreateIndex
CREATE INDEX "PublicAccountActivity_accountId_createdAt_idx" ON "PublicAccountActivity"("accountId", "createdAt");

-- CreateIndex
CREATE INDEX "PublicAccountActivity_type_idx" ON "PublicAccountActivity"("type");

-- CreateIndex
CREATE INDEX "PublicAccountActivity_module_idx" ON "PublicAccountActivity"("module");

-- CreateIndex
CREATE INDEX "PublicAccountActivity_createdAt_idx" ON "PublicAccountActivity"("createdAt");

-- AddForeignKey
ALTER TABLE "PublicAccountActivity" ADD CONSTRAINT "PublicAccountActivity_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "PublicAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
