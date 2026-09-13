export const BASE_CURRENCY = "USD";

export type MoneyFormatOptions = {
  currency: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

export type CurrencyConversionResult = {
  baseAmount: number;
  baseCurrency: string;
  convertedAmount: number;
  targetCurrency: string;
  exchangeRate: number;
};

export type ConvertedMoneyResult = CurrencyConversionResult & {
  formatted: string;
};

/**
 * Normalizes a currency code.
 *
 * Examples:
 * "usd" -> "USD"
 * " ngn " -> "NGN"
 */
export function normalizeCurrencyCode(
  currency?: string | null
): string {
  return (currency || BASE_CURRENCY).trim().toUpperCase();
}

/**
 * Checks whether a value is a valid 3-letter currency code.
 */
export function isValidCurrencyCode(
  currency?: string | null
): boolean {
  return /^[A-Z]{3}$/.test(normalizeCurrencyCode(currency));
}

/**
 * Gets the standard number of decimal places for a currency.
 */
export function getCurrencyFractionDigits(
  currency: string
): number {
  try {
    return (
      new Intl.NumberFormat("en", {
        style: "currency",
        currency: normalizeCurrencyCode(currency),
      }).resolvedOptions().maximumFractionDigits ?? 2
    );
  } catch {
    return 2;
  }
}

/**
 * Formats a monetary amount.
 *
 * Example:
 * formatMoney(100, { currency: "USD" })
 *
 * formatMoney(160000, { currency: "NGN" })
 */
export function formatMoney(
  amount: number,
  options: MoneyFormatOptions
): string {
  const currency = normalizeCurrencyCode(options.currency);

  const fractionDigits =
    options.maximumFractionDigits ??
    options.minimumFractionDigits ??
    getCurrencyFractionDigits(currency);

  try {
    return new Intl.NumberFormat(options.locale || "en-US", {
      style: "currency",
      currency,
      minimumFractionDigits:
        options.minimumFractionDigits ?? fractionDigits,
      maximumFractionDigits:
        options.maximumFractionDigits ?? fractionDigits,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(fractionDigits)}`;
  }
}

/**
 * Rounds an amount according to the target currency.
 */
export function roundCurrencyAmount(
  amount: number,
  currency: string,
  decimalPlaces?: number | null
): number {
  const digits =
    typeof decimalPlaces === "number"
      ? Math.max(0, decimalPlaces)
      : getCurrencyFractionDigits(currency);

  const factor = 10 ** digits;

  return Math.round((amount + Number.EPSILON) * factor) / factor;
}

/**
 * Validates an exchange rate.
 *
 * Example:
 * 1600 = valid
 * 10 = valid
 * 0 = invalid
 * -5 = invalid
 */
export function isValidExchangeRate(
  rate: number
): boolean {
  return (
    typeof rate === "number" &&
    Number.isFinite(rate) &&
    rate > 0
  );
}

/**
 * Converts an amount from USD to a target currency.
 *
 * The exchange rate must represent:
 *
 * 1 USD = exchangeRate target currency
 *
 * Example:
 *
 * convertFromUsd(100, 1600, "NGN")
 *
 * Result:
 *
 * 160000
 */
export function convertFromUsd(
  usdAmount: number,
  exchangeRate: number,
  targetCurrency: string,
  decimalPlaces?: number | null
): number {
  if (
    typeof usdAmount !== "number" ||
    !Number.isFinite(usdAmount)
  ) {
    throw new Error("USD amount must be a valid number.");
  }

  if (!isValidExchangeRate(exchangeRate)) {
    throw new Error(
      "Exchange rate must be a valid number greater than zero."
    );
  }

  const currency = normalizeCurrencyCode(targetCurrency);

  /**
   * If the customer currency is already USD,
   * no conversion is required.
   */
  if (currency === BASE_CURRENCY) {
    return roundCurrencyAmount(
      usdAmount,
      BASE_CURRENCY,
      decimalPlaces
    );
  }

  const convertedAmount = usdAmount * exchangeRate;

  return roundCurrencyAmount(
    convertedAmount,
    currency,
    decimalPlaces
  );
}

/**
 * Converts USD into a target currency and returns
 * complete conversion information.
 */
export function convertUsdPrice(
  usdAmount: number,
  exchangeRate: number,
  targetCurrency: string,
  decimalPlaces?: number | null
): CurrencyConversionResult {
  const currency = normalizeCurrencyCode(targetCurrency);

  const convertedAmount =
    currency === BASE_CURRENCY
      ? roundCurrencyAmount(
          usdAmount,
          BASE_CURRENCY,
          decimalPlaces
        )
      : convertFromUsd(
          usdAmount,
          exchangeRate,
          currency,
          decimalPlaces
        );

  return {
    baseAmount: usdAmount,
    baseCurrency: BASE_CURRENCY,
    convertedAmount,
    targetCurrency: currency,
    exchangeRate:
      currency === BASE_CURRENCY ? 1 : exchangeRate,
  };
}

/**
 * Converts a USD amount and formats the result
 * for display.
 *
 * Example:
 *
 * convertAndFormatFromUsd(100, 1600, "NGN")
 *
 * Result:
 *
 * {
 *   baseAmount: 100,
 *   baseCurrency: "USD",
 *   convertedAmount: 160000,
 *   targetCurrency: "NGN",
 *   exchangeRate: 1600,
 *   formatted: "₦160,000.00"
 * }
 */
export function convertAndFormatFromUsd(
  usdAmount: number,
  exchangeRate: number,
  targetCurrency: string,
  options?: {
    locale?: string;
    decimalPlaces?: number | null;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): ConvertedMoneyResult {
  const conversion = convertUsdPrice(
    usdAmount,
    exchangeRate,
    targetCurrency,
    options?.decimalPlaces
  );

  const formatted = formatMoney(
    conversion.convertedAmount,
    {
      currency: conversion.targetCurrency,
      locale: options?.locale,
      minimumFractionDigits:
        options?.minimumFractionDigits,
      maximumFractionDigits:
        options?.maximumFractionDigits,
    }
  );

  return {
    ...conversion,
    formatted,
  };
}

/**
 * Calculates a converted amount using an optional
 * FX protection margin.
 *
 * Example:
 *
 * USD 100
 * Rate: 1600
 * Margin: 0.05 (5%)
 *
 * Effective rate:
 * 1680
 *
 * Converted amount:
 * 168000 NGN
 */
export function convertFromUsdWithMargin(
  usdAmount: number,
  exchangeRate: number,
  targetCurrency: string,
  fxProtectionMargin = 0,
  decimalPlaces?: number | null
): number {
  if (
    typeof fxProtectionMargin !== "number" ||
    !Number.isFinite(fxProtectionMargin)
  ) {
    throw new Error(
      "FX protection margin must be a valid number."
    );
  }

  const safeMargin = Math.max(
    0,
    fxProtectionMargin
  );

  const effectiveRate =
    exchangeRate * (1 + safeMargin);

  return convertFromUsd(
    usdAmount,
    effectiveRate,
    targetCurrency,
    decimalPlaces
  );
}

/**
 * Checks whether two currency codes are the same.
 */
export function isBaseCurrency(
  currency?: string | null
): boolean {
  return (
    normalizeCurrencyCode(currency) ===
    BASE_CURRENCY
  );
}