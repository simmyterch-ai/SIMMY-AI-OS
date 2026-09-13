"use client";

import {
  ReactNode,
  useEffect,
  useState,
} from "react";

import {
  DEFAULT_LOCALE,
  normalizeLocale,
  type Locale,
} from "@/lib/i18n/config";

import { I18nProvider } from "@/contexts/I18nContext";

export default function OrganizationI18n({
  children,
}: {
  children: ReactNode;
}) {
  const [locale, setLocale] =
    useState<Locale>(
      DEFAULT_LOCALE
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadOrganizationLanguage() {
      try {
        const response =
          await fetch(
            "/api/organization",
            {
              cache: "no-store",
            }
          );

        if (!response.ok) {
          return;
        }

        const data =
          await response.json();

        const organization =
          data?.organization;

        if (organization) {
          setLocale(
            normalizeLocale(
              organization.language
            )
          );
        }
      } catch (error) {
        console.error(
          "Failed to load organization language:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrganizationLanguage();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <I18nProvider
      initialLocale={locale}
    >
      {children}
    </I18nProvider>
  );
}
