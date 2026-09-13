import { prisma } from "@/lib/prisma";
import { BASE_CURRENCY, normalizeCurrencyCode } from "./currency";

export type CurrencyRateResult = {
  currency: {
    id: number;
    code: string;
    name: string;
    symbol: string | null;
    decimalPlaces: number;
    enabled: boolean;
    fxProtectionMargin: number;
  };
  rate: number;
  source: string | null;
  fetchedAt: Date;
  expiresAt: Date | null;
  isManual: boolean;
};

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;

  if (
    typeof value === "object" &&
    value !== null &&
    "toString" in value
  ) {
    return Number(value.toString());
  }

  return Number(value);
}

export async function getEnabledCurrency(
  currencyCode: string
) {
  const code = normalizeCurrencyCode(currencyCode);

  return prisma.currencySetting.findUnique({
    where: { code },
  });
}

export async function getActiveExchangeRate(
  currencyCode: string
): Promise<CurrencyRateResult | null> {
  const code = normalizeCurrencyCode(currencyCode);

  if (code === BASE_CURRENCY) {
    return {
      currency: {
        id: 0,
        code: BASE_CURRENCY,
        name: "United States Dollar",
        symbol: "$",
        decimalPlaces: 2,
        enabled: true,
        fxProtectionMargin: 0,
      },
      rate: 1,
      source: "BASE_CURRENCY",
      fetchedAt: new Date(),
      expiresAt: null,
      isManual: true,
    };
  }

  const currency = await prisma.currencySetting.findUnique({
    where: { code },
    include: {
      exchangeRates: {
        where: {
          baseCurrency: BASE_CURRENCY,
          isActive: true,
        },
        orderBy: {
          fetchedAt: "desc",
        },
        take: 1,
      },
    },
  });

  if (!currency || !currency.enabled) {
    return null;
  }

  const latestRate = currency.exchangeRates[0];

  if (!latestRate) {
    return null;
  }

  if (
    latestRate.expiresAt &&
    latestRate.expiresAt.getTime() < Date.now()
  ) {
    return null;
  }

  return {
    currency: {
      id: currency.id,
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol,
      decimalPlaces: currency.decimalPlaces,
      enabled: currency.enabled,
      fxProtectionMargin: toNumber(
        currency.fxProtectionMargin
      ),
    },
    rate: toNumber(latestRate.rate),
    source: latestRate.source,
    fetchedAt: latestRate.fetchedAt,
    expiresAt: latestRate.expiresAt,
    isManual: latestRate.isManual,
  };
}
