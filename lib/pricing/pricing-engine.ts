import {
  BASE_CURRENCY,
  formatMoney,
  normalizeCurrencyCode,
  roundCurrencyAmount,
} from "./currency";
import { getActiveExchangeRate } from "./exchange-rate";

export type PricingResult = {
  baseCurrency: string;
  baseAmountUsd: number;

  displayCurrency: string;
  displayAmount: number;
  formattedDisplayAmount: string;

  exchangeRate: number;
  fxMarginPercent: number;
  effectiveRate: number;

  rateSource: string | null;
  rateFetchedAt: Date;
  rateExpiresAt: Date | null;

  usedFallback: boolean;
};

export type PriceOptions = {
  currency?: string | null;
  locale?: string;
  fallbackToUsd?: boolean;
};

export async function priceFromUsd(
  baseAmountUsd: number,
  options: PriceOptions = {}
): Promise<PricingResult> {
  if (
    !Number.isFinite(baseAmountUsd) ||
    baseAmountUsd < 0
  ) {
    throw new Error(
      "baseAmountUsd must be a valid positive number or zero."
    );
  }

  const requestedCurrency = normalizeCurrencyCode(
    options.currency
  );

  const fallbackToUsd =
    options.fallbackToUsd !== false;

  if (requestedCurrency === BASE_CURRENCY) {
    return {
      baseCurrency: BASE_CURRENCY,
      baseAmountUsd,
      displayCurrency: BASE_CURRENCY,
      displayAmount: roundCurrencyAmount(
        baseAmountUsd,
        BASE_CURRENCY,
        2
      ),
      formattedDisplayAmount: formatMoney(
        baseAmountUsd,
        {
          currency: BASE_CURRENCY,
          locale: options.locale,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      ),
      exchangeRate: 1,
      fxMarginPercent: 0,
      effectiveRate: 1,
      rateSource: "BASE_CURRENCY",
      rateFetchedAt: new Date(),
      rateExpiresAt: null,
      usedFallback: false,
    };
  }

  const exchangeRate =
    await getActiveExchangeRate(
      requestedCurrency
    );

  if (!exchangeRate) {
    if (!fallbackToUsd) {
      throw new Error(
        `No active exchange rate is available for ${requestedCurrency}.`
      );
    }

    return {
      baseCurrency: BASE_CURRENCY,
      baseAmountUsd,
      displayCurrency: BASE_CURRENCY,
      displayAmount: roundCurrencyAmount(
        baseAmountUsd,
        BASE_CURRENCY,
        2
      ),
      formattedDisplayAmount: formatMoney(
        baseAmountUsd,
        {
          currency: BASE_CURRENCY,
          locale: options.locale,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      ),
      exchangeRate: 1,
      fxMarginPercent: 0,
      effectiveRate: 1,
      rateSource: "FALLBACK_USD",
      rateFetchedAt: new Date(),
      rateExpiresAt: null,
      usedFallback: true,
    };
  }

  const margin =
    exchangeRate.currency.fxProtectionMargin;

  const effectiveRate =
    exchangeRate.rate * (1 + margin / 100);

  const rawDisplayAmount =
    baseAmountUsd * effectiveRate;

  const displayAmount =
    roundCurrencyAmount(
      rawDisplayAmount,
      exchangeRate.currency.code,
      exchangeRate.currency.decimalPlaces
    );

  return {
    baseCurrency: BASE_CURRENCY,
    baseAmountUsd,

    displayCurrency:
      exchangeRate.currency.code,

    displayAmount,

    formattedDisplayAmount:
      formatMoney(displayAmount, {
        currency:
          exchangeRate.currency.code,
        locale: options.locale,
        minimumFractionDigits:
          exchangeRate.currency.decimalPlaces,
        maximumFractionDigits:
          exchangeRate.currency.decimalPlaces,
      }),

    exchangeRate:
      exchangeRate.rate,

    fxMarginPercent:
      margin,

    effectiveRate,

    rateSource:
      exchangeRate.source,

    rateFetchedAt:
      exchangeRate.fetchedAt,

    rateExpiresAt:
      exchangeRate.expiresAt,

    usedFallback: false,
  };
}
