-- AlterTable
ALTER TABLE "MarketplaceProduct" ADD COLUMN     "priceUsd" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "CurrencySetting" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT,
    "decimalPlaces" INTEGER NOT NULL DEFAULT 2,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "fxProtectionMargin" DECIMAL(8,4) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurrencySetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExchangeRate" (
    "id" SERIAL NOT NULL,
    "currencyId" INTEGER NOT NULL,
    "baseCurrency" TEXT NOT NULL DEFAULT 'USD',
    "rate" DECIMAL(18,8) NOT NULL,
    "source" TEXT,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "isManual" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExchangeRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "reference" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'PAYSTACK',
    "purpose" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "baseCurrency" TEXT NOT NULL DEFAULT 'USD',
    "baseAmountUsd" DECIMAL(12,2) NOT NULL,
    "displayCurrency" TEXT,
    "displayAmount" DECIMAL(18,2),
    "checkoutCurrency" TEXT NOT NULL,
    "checkoutAmount" DECIMAL(18,2) NOT NULL,
    "exchangeRate" DECIMAL(18,8),
    "fxMarginPercent" DECIMAL(8,4),
    "accountId" INTEGER,
    "productId" INTEGER,
    "customerEmail" TEXT NOT NULL,
    "providerReference" TEXT,
    "providerData" JSONB,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CurrencySetting_code_key" ON "CurrencySetting"("code");

-- CreateIndex
CREATE INDEX "CurrencySetting_enabled_idx" ON "CurrencySetting"("enabled");

-- CreateIndex
CREATE INDEX "ExchangeRate_currencyId_idx" ON "ExchangeRate"("currencyId");

-- CreateIndex
CREATE INDEX "ExchangeRate_baseCurrency_idx" ON "ExchangeRate"("baseCurrency");

-- CreateIndex
CREATE INDEX "ExchangeRate_isActive_idx" ON "ExchangeRate"("isActive");

-- CreateIndex
CREATE INDEX "ExchangeRate_fetchedAt_idx" ON "ExchangeRate"("fetchedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_reference_key" ON "Payment"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_providerReference_key" ON "Payment"("providerReference");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_provider_idx" ON "Payment"("provider");

-- CreateIndex
CREATE INDEX "Payment_purpose_idx" ON "Payment"("purpose");

-- CreateIndex
CREATE INDEX "Payment_accountId_idx" ON "Payment"("accountId");

-- CreateIndex
CREATE INDEX "Payment_productId_idx" ON "Payment"("productId");

-- CreateIndex
CREATE INDEX "Payment_customerEmail_idx" ON "Payment"("customerEmail");

-- CreateIndex
CREATE INDEX "Payment_createdAt_idx" ON "Payment"("createdAt");

-- CreateIndex
CREATE INDEX "MarketplaceProduct_createdAt_idx" ON "MarketplaceProduct"("createdAt");

-- AddForeignKey
ALTER TABLE "ExchangeRate" ADD CONSTRAINT "ExchangeRate_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "CurrencySetting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "PublicAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "MarketplaceProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;
