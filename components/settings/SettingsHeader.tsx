"use client";

import { Settings } from "lucide-react";

export default function SettingsHeader() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <div className="flex items-center gap-4">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">

          <Settings className="h-7 w-7 text-blue-700" />

        </div>

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            Settings
          </h1>

          <p className="mt-1 text-slate-500">
            Manage your account, organization and system preferences.
          </p>

        </div>

      </div>

    </div>
  );
}