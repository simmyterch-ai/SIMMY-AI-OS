"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

import {
  DEFAULT_LOCALE,
  getDirection,
  normalizeLocale,
  type Locale,
} from "@/lib/i18n/config";

import {
  getTranslations,
  type TranslationDictionary,
} from "@/lib/i18n/translations";

type I18nContextType = {
  locale: Locale;
  direction: "ltr" | "rtl";
  translations: TranslationDictionary;
  setLocale: (locale: Locale) => void;
  t: TranslationDictionary;
};

const I18nContext =
  createContext<I18nContextType | undefined>(
    undefined
  );

export function I18nProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] =
    useState<Locale>(
      normalizeLocale(initialLocale)
    );

  const translations =
    useMemo(
      () => getTranslations(locale),
      [locale]
    );

  const direction =
    getDirection(locale);

  // =====================================================
  // UPDATE DOCUMENT LANGUAGE + DIRECTION
  // =====================================================

  useEffect(() => {
    document.documentElement.lang =
      locale;

    document.documentElement.dir =
      direction;
  }, [locale, direction]);

  // =====================================================
  // CHANGE LANGUAGE
  // =====================================================

  function setLocale(
    nextLocale: Locale
  ) {
    setLocaleState(
      normalizeLocale(nextLocale)
    );
  }

  return (
    <I18nContext.Provider
      value={{
        locale,
        direction,
        translations,
        setLocale,
        t: translations,
      }}
    >
      {children}
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
