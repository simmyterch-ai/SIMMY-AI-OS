import {
  DEFAULT_LOCALE,
  type Locale,
  normalizeLocale,
} from "./config";

import {
  translations,
} from "./translations";

type TranslationObject =
  typeof translations[typeof DEFAULT_LOCALE];

type TranslationKeys<T> =
  T extends object
    ? {
        [K in keyof T & string]:
          T[K] extends object
            ? `${K}.${TranslationKeys<T[K]>}`
            : K;
      }[keyof T & string]
    : never;

export type TranslationKey =
  TranslationKeys<TranslationObject>;

function getNestedValue(
  object: unknown,
  path: string
): string | undefined {
  const parts = path.split(".");

  let current: unknown = object;

  for (const part of parts) {
    if (
      typeof current !== "object" ||
      current === null ||
      !(part in current)
    ) {
      return undefined;
    }

    current = (
      current as Record<string, unknown>
    )[part];
  }

  return typeof current === "string"
    ? current
    : undefined;
}

export function translate(
  locale: Locale,
  key: TranslationKey
): string {
  const safeLocale =
    normalizeLocale(locale);

  const localized =
    getNestedValue(
      translations[safeLocale],
      key
    );

  if (localized !== undefined) {
    return localized;
  }

  const fallback =
    getNestedValue(
      translations[DEFAULT_LOCALE],
      key
    );

  return fallback ?? key;
}

export function createTranslator(
  locale: Locale
) {
  return function t(
    key: TranslationKey
  ): string {
    return translate(
      locale,
      key
    );
  };
}
