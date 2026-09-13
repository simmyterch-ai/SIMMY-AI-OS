"use client";

import {
  Bell,
  Menu,
  Search,
  Sun,
} from "lucide-react";

import ProfileDropdown from "@/components/layout/ProfileDropdown";
import { useI18n } from "@/contexts/I18nContext";
import { getDirection } from "@/lib/i18n/config";

export default function Header() {
  const { locale, t } = useI18n();

  const direction = getDirection(locale);

  const searchPosition =
    direction === "rtl"
      ? "right-4"
      : "left-4";

  const searchPadding =
    direction === "rtl"
      ? "pr-12 pl-4"
      : "pl-12 pr-4";

  return (
    <header
      dir={direction}
      className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8"
    >

      <div className="flex items-center gap-6">

        <button
          type="button"
          className="text-slate-700 transition hover:text-blue-700"
          aria-label={t.common.menu}
        >
          <Menu className="h-6 w-6" />
        </button>

        <h1 className="text-2xl font-semibold text-slate-900">
          {t.common.dashboard}
        </h1>

      </div>

      <div className="relative">

        <Search
          className={
            "absolute top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 " +
            searchPosition
          }
        />

        <input
          type="text"
          placeholder={t.common.search}
          aria-label={t.common.search}
          dir={direction}
          className={
            "w-80 rounded-xl border border-slate-300 py-3 outline-none transition focus:border-blue-500 " +
            searchPadding
          }
        />

      </div>

      <div className="flex items-center gap-6">

        <button
          type="button"
          className="text-slate-600 transition hover:text-blue-700"
          aria-label={t.common.notifications}
        >
          <Bell className="h-5 w-5" />
        </button>

        <button
          type="button"
          className="text-slate-600 transition hover:text-yellow-500"
          aria-label={t.common.theme}
        >
          <Sun className="h-5 w-5" />
        </button>

        <ProfileDropdown />

      </div>

    </header>
  );
}