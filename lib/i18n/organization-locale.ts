import {
  normalizeLocale,
  type Locale,
} from "@/lib/i18n/config";

export function getOrganizationLocale(
  language: unknown
): Locale {
  return normalizeLocale(language);
}