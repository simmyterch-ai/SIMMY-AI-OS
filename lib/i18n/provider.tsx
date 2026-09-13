"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import {
  DEFAULT_LOCALE,
  getDirection,
  normalizeLocale,
  type Locale,
} from "./config";

import {
  getTranslations,
  type TranslationDictionary,
} from "./translations";

type I18nContextValue = {
  locale: Locale;
  direction: "ltr" | "rtl";
  translations: TranslationDictionary;
};

const I18nContext =
  createContext<I18nContextValue | null>(null);

type I18nProviderProps = {
  children: ReactNode;
  locale?: Locale | string | null;
};

export function I18nProvider({
  children,
  locale,
}: I18nProviderProps) {
  const normalizedLocale =
    normalizeLocale(
      locale ?? DEFAULT_LOCALE
    );

  const value = useMemo(() => {
    return {
      locale: normalizedLocale,
      direction:
        getDirection(normalizedLocale),
      translations:
        getTranslations(normalizedLocale),
    };
  }, [normalizedLocale]);

  return (
    <I18nContext.Provider value={value}>
      <div
        dir={value.direction}
        lang={value.locale}
        className="min-h-full"
      >
        {children}
      </div>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context =
    useContext(I18nContext);

  if (!context) {
    throw new Error(
      "useI18n must be used inside I18nProvider."
    );
  }

  return context;
}
