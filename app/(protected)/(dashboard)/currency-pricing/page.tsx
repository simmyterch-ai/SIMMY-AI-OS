"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Currency = {
  id: number;
  code: string;
  name: string;
  symbol: string | null;
  decimalPlaces: number;
  enabled: boolean;
  fxProtectionMargin: string | number;
  exchangeRates?: ExchangeRate[];
};

type ExchangeRate = {
  id: number;
  currencyId: number;
  baseCurrency: string;
  rate: string | number;
  source: string | null;
  fetchedAt: string;
  expiresAt: string | null;
  isManual: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  currency?: {
    id: number;
    code: string;
    name: string;
    symbol: string | null;
  };
};

type CurrencyResponse = {
  currencies?: Currency[];
  error?: string;
};

type ExchangeRateResponse = {
  rates?: ExchangeRate[];
  error?: string;
};

function toNumber(value: string | number | undefined | null): number {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function formatCurrency(
  amount: number,
  currency: Currency
) {
  const symbol = currency.symbol || currency.code;

  const formatted = amount.toLocaleString(undefined, {
    minimumFractionDigits: currency.decimalPlaces,
    maximumFractionDigits: currency.decimalPlaces,
  });

  return `${symbol} ${formatted}`;
}

export default function CurrencyPricingPage() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [rates, setRates] = useState<ExchangeRate[]>([]);

  const [loading, setLoading] = useState(true);
  const [savingCurrency, setSavingCurrency] =
    useState(false);
  const [savingRate, setSavingRate] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Currency form
  const [currencyCode, setCurrencyCode] =
    useState("");
  const [currencyName, setCurrencyName] =
    useState("");
  const [currencySymbol, setCurrencySymbol] =
    useState("");
  const [decimalPlaces, setDecimalPlaces] =
    useState(2);
  const [fxProtectionMargin, setFxProtectionMargin] =
    useState("0");

  // Exchange rate form
  const [selectedCurrencyId, setSelectedCurrencyId] =
    useState("");
  const [exchangeRate, setExchangeRate] =
    useState("");
  const [rateSource, setRateSource] =
    useState("Manual Super Admin Entry");

  // Pricing preview
  const [usdPrice, setUsdPrice] =
    useState("100");

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [currencyResponse, rateResponse] =
        await Promise.all([
          fetch("/api/currency-settings", {
            cache: "no-store",
          }),
          fetch("/api/exchange-rates", {
            cache: "no-store",
          }),
        ]);

      const currencyData: CurrencyResponse =
        await currencyResponse.json();

      const rateData: ExchangeRateResponse =
        await rateResponse.json();

      if (!currencyResponse.ok) {
        throw new Error(
          currencyData.error ||
            "Failed to load currencies."
        );
      }

      if (!rateResponse.ok) {
        throw new Error(
          rateData.error ||
            "Failed to load exchange rates."
        );
      }

      setCurrencies(currencyData.currencies || []);
      setRates(rateData.rates || []);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load currency information."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreateCurrency(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSavingCurrency(true);

    try {
      const response = await fetch(
        "/api/currency-settings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: currencyCode,
            name: currencyName,
            symbol: currencySymbol,
            decimalPlaces,
            enabled: true,
            fxProtectionMargin,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to create currency."
        );
      }

      setSuccess(
        `${currencyCode.toUpperCase()} currency was created successfully.`
      );

      setCurrencyCode("");
      setCurrencyName("");
      setCurrencySymbol("");
      setDecimalPlaces(2);
      setFxProtectionMargin("0");

      await loadData();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create currency."
      );
    } finally {
      setSavingCurrency(false);
    }
  }

  async function handleCreateRate(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSavingRate(true);

    try {
      if (!selectedCurrencyId) {
        throw new Error(
          "Please select a currency."
        );
      }

      const response = await fetch(
        "/api/exchange-rates",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currencyId: Number(selectedCurrencyId),
            baseCurrency: "USD",
            rate: exchangeRate,
            source: rateSource,
            isManual: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to save exchange rate."
        );
      }

      setSuccess(
        "Exchange rate was saved successfully."
      );

      setExchangeRate("");
      setRateSource(
        "Manual Super Admin Entry"
      );

      await loadData();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to save exchange rate."
      );
    } finally {
      setSavingRate(false);
    }
  }

  const activeRates = useMemo(() => {
    const map = new Map<number, ExchangeRate>();

    rates
      .filter((rate) => rate.isActive)
      .forEach((rate) => {
        if (!map.has(rate.currencyId)) {
          map.set(rate.currencyId, rate);
        }
      });

    return map;
  }, [rates]);

  const previewPrice = toNumber(usdPrice);

  return (
    <div className="space-y-10">
      {/* Header */}

      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Platform Administration
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          Currency & Pricing
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Manage platform currencies, USD-based
          exchange rates and pricing protection
          margins. Products and services can keep
          their base prices in USD while customers
          see converted prices in their local
          currency.
        </p>
      </div>

      {/* Messages */}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Summary cards */}

      <section className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Currencies
          </p>

          <p className="mt-3 text-3xl font-bold text-slate-950">
            {currencies.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Enabled Currencies
          </p>

          <p className="mt-3 text-3xl font-bold text-slate-950">
            {
              currencies.filter(
                (currency) => currency.enabled
              ).length
            }
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Active Exchange Rates
          </p>

          <p className="mt-3 text-3xl font-bold text-slate-950">
            {activeRates.size}
          </p>
        </div>
      </section>

      {/* Forms */}

      <section className="grid gap-6 xl:grid-cols-2">
        {/* Add Currency */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              Add Currency
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Add a currency that can be used by
              SIMMY LINK AFRICA customers and
              marketplace pricing.
            </p>
          </div>

          <form
            onSubmit={handleCreateCurrency}
            className="mt-6 space-y-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="currencyCode"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Currency Code
                </label>

                <input
                  id="currencyCode"
                  value={currencyCode}
                  onChange={(event) =>
                    setCurrencyCode(
                      event.target.value.toUpperCase()
                    )
                  }
                  placeholder="NGN"
                  maxLength={3}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm uppercase outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="currencySymbol"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Symbol
                </label>

                <input
                  id="currencySymbol"
                  value={currencySymbol}
                  onChange={(event) =>
                    setCurrencySymbol(
                      event.target.value
                    )
                  }
                  placeholder="₦"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="currencyName"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Currency Name
              </label>

              <input
                id="currencyName"
                value={currencyName}
                onChange={(event) =>
                  setCurrencyName(
                    event.target.value
                  )
                }
                placeholder="Nigerian Naira"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="decimalPlaces"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Decimal Places
                </label>

                <input
                  id="decimalPlaces"
                  type="number"
                  min="0"
                  max="8"
                  value={decimalPlaces}
                  onChange={(event) =>
                    setDecimalPlaces(
                      Number(event.target.value)
                    )
                  }
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="fxProtectionMargin"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  FX Protection Margin (%)
                </label>

                <input
                  id="fxProtectionMargin"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={fxProtectionMargin}
                  onChange={(event) =>
                    setFxProtectionMargin(
                      event.target.value
                    )
                  }
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingCurrency}
              className="w-full rounded-xl bg-blue-700 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingCurrency
                ? "Saving Currency..."
                : "Add Currency"}
            </button>
          </form>
        </div>

        {/* Add Exchange Rate */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              Set USD Exchange Rate
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Set how much of the selected currency
              equals one US Dollar.
            </p>
          </div>

          <form
            onSubmit={handleCreateRate}
            className="mt-6 space-y-5"
          >
            <div>
              <label
                htmlFor="currency"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Currency
              </label>

              <select
                id="currency"
                value={selectedCurrencyId}
                onChange={(event) =>
                  setSelectedCurrencyId(
                    event.target.value
                  )
                }
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  Select currency
                </option>

                {currencies
                  .filter(
                    (currency) =>
                      currency.enabled &&
                      currency.code !== "USD"
                  )
                  .map((currency) => (
                    <option
                      key={currency.id}
                      value={currency.id}
                    >
                      {currency.code} —{" "}
                      {currency.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="exchangeRate"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                1 USD equals
              </label>

              <input
                id="exchangeRate"
                type="number"
                min="0.00000001"
                step="any"
                value={exchangeRate}
                onChange={(event) =>
                  setExchangeRate(
                    event.target.value
                  )
                }
                placeholder="1600"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="rateSource"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Rate Source
              </label>

              <input
                id="rateSource"
                value={rateSource}
                onChange={(event) =>
                  setRateSource(
                    event.target.value
                  )
                }
                placeholder="Manual Super Admin Entry"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-800">
              Saving a new rate automatically
              deactivates the previous active USD
              rate for that currency.
            </div>

            <button
              type="submit"
              disabled={
                savingRate ||
                currencies.length === 0
              }
              className="w-full rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingRate
                ? "Saving Exchange Rate..."
                : "Save Exchange Rate"}
            </button>
          </form>
        </div>
      </section>

      {/* Pricing Preview */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              USD Pricing Preview
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Preview how a USD product price will
              appear after exchange-rate conversion
              and your FX protection margin.
            </p>
          </div>

          <div className="w-full lg:w-72">
            <label
              htmlFor="usdPrice"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Base Price in USD
            </label>

            <input
              id="usdPrice"
              type="number"
              min="0"
              step="0.01"
              value={usdPrice}
              onChange={(event) =>
                setUsdPrice(event.target.value)
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <p className="text-sm font-medium text-blue-700">
              Base Price
            </p>

            <p className="mt-3 text-2xl font-bold text-slate-950">
              $ {previewPrice.toLocaleString()}
            </p>

            <p className="mt-2 text-xs text-slate-600">
              USD base pricing
            </p>
          </div>

          {currencies
            .filter(
              (currency) =>
                currency.enabled &&
                currency.code !== "USD"
            )
            .map((currency) => {
              const activeRate =
                activeRates.get(currency.id);

              if (!activeRate) {
                return (
                  <div
                    key={currency.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <p className="text-sm font-medium text-slate-700">
                      {currency.code}
                    </p>

                    <p className="mt-3 text-sm text-slate-500">
                      No active exchange rate
                    </p>
                  </div>
                );
              }

              const rate =
                toNumber(activeRate.rate);

              const margin =
                toNumber(
                  currency.fxProtectionMargin
                );

              const converted =
                previewPrice *
                rate *
                (1 + margin / 100);

              return (
                <div
                  key={currency.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <p className="text-sm font-medium text-slate-500">
                    {currency.code}
                  </p>

                  <p className="mt-3 text-2xl font-bold text-slate-950">
                    {formatCurrency(
                      converted,
                      currency
                    )}
                  </p>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Rate: 1 USD ={" "}
                    {rate.toLocaleString()}{" "}
                    {currency.code}
                    <br />
                    FX margin: {margin}%
                  </p>
                </div>
              );
            })}
        </div>
      </section>

      {/* Currency List */}

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-xl font-bold text-slate-950">
            Currency Settings
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            All currencies configured for the
            SIMMY LINK AFRICA platform.
          </p>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-slate-500">
            Loading currency settings...
          </div>
        ) : currencies.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm font-medium text-slate-700">
              No currencies configured yet.
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Start by adding USD, NGN and MAD.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Currency
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Symbol
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    FX Margin
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Active Rate
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {currencies.map(
                  (currency) => {
                    const activeRate =
                      activeRates.get(
                        currency.id
                      );

                    return (
                      <tr
                        key={currency.id}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-950">
                            {currency.code}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {currency.name}
                          </p>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-700">
                          {currency.symbol ||
                            "—"}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-700">
                          {
                            currency.fxProtectionMargin
                          }
                          %
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              currency.enabled
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {currency.enabled
                              ? "Enabled"
                              : "Disabled"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-700">
                          {activeRate
                            ? `1 USD = ${toNumber(
                                activeRate.rate
                              ).toLocaleString()} ${
                                currency.code
                              }`
                            : "No active rate"}
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Exchange Rate History */}

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-xl font-bold text-slate-950">
            Exchange Rate History
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            New exchange rates automatically replace
            previous active rates while preserving
            historical records.
          </p>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-slate-500">
            Loading exchange rates...
          </div>
        ) : rates.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            No exchange rates have been added yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Currency
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Rate
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Source
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {rates.map((rate) => (
                  <tr
                    key={rate.id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-950">
                        {rate.currency?.code ||
                          `Currency #${rate.currencyId}`}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {rate.currency?.name ||
                          "Unknown currency"}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      1 {rate.baseCurrency} ={" "}
                      {toNumber(
                        rate.rate
                      ).toLocaleString()}{" "}
                      {rate.currency?.code || ""}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {rate.source || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          rate.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {rate.isActive
                          ? "Active"
                          : "Historical"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDate(
                        rate.fetchedAt
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}