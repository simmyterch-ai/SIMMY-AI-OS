export const SUPPORTED_LOCALES = ["en", "fr", "ar"] as const;

export type Locale =
  (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_DIRECTION: Record<
  Locale,
  "ltr" | "rtl"
> = {
  en: "ltr",
  fr: "ltr",
  ar: "rtl",
};

export const LOCALE_NAMES: Record<
  Locale,
  string
> = {
  en: "English",
  fr: "Français",
  ar: "العربية",
};

export function isSupportedLocale(
  value: unknown
): value is Locale {
  return (
    typeof value === "string" &&
    SUPPORTED_LOCALES.includes(
      value as Locale
    )
  );
}

export function normalizeLocale(
  value: unknown
): Locale {
  return isSupportedLocale(value)
    ? value
    : DEFAULT_LOCALE;
}

export function getDirection(
  locale: Locale
): "ltr" | "rtl" {
  return LOCALE_DIRECTION[locale];
}
