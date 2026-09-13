-- CreateTable
CREATE TABLE "PublicAccountSession" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "accountId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublicAccountSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PublicAccountSession_token_key" ON "PublicAccountSession"("token");

-- CreateIndex
CREATE INDEX "PublicAccountSession_accountId_idx" ON "PublicAccountSession"("accountId");

-- CreateIndex
CREATE INDEX "PublicAccountSession_expiresAt_idx" ON "PublicAccountSession"("expiresAt");

-- AddForeignKey
ALTER TABLE "PublicAccountSession" ADD CONSTRAINT "PublicAccountSession_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "PublicAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
