"use client";

import {
  Lock,
  ShieldCheck,
  KeyRound,
  Save,
} from "lucide-react";

export default function SecuritySettings() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <div className="mb-8">

        <h2 className="text-2xl font-bold text-slate-900">
          Security Settings
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Manage your password and account security preferences.
        </p>

      </div>

      <div className="grid gap-6">

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Current Password
          </label>

          <div className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 py-3">

            <Lock className="h-5 w-5 text-slate-400" />

            <input
              type="password"
              placeholder="Enter current password"
              className="w-full outline-none"
            />

          </div>

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            New Password
          </label>

          <div className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 py-3">

            <KeyRound className="h-5 w-5 text-slate-400" />

            <input
              type="password"
              placeholder="Enter new password"
              className="w-full outline-none"
            />

          </div>

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Confirm Password
          </label>

          <div className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 py-3">

            <ShieldCheck className="h-5 w-5 text-slate-400" />

            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full outline-none"
            />

          </div>

        </div>

      </div>

      <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">

        <h3 className="font-semibold text-amber-700">
          Coming Soon
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Two-factor authentication, active sessions,
          login history and device management will be
          available in SAP V2.
        </p>

      </div>

      <div className="mt-8 flex justify-end">

        <button className="flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-medium text-white transition hover:bg-blue-800">

          <Save className="h-5 w-5" />

          Update Password

        </button>

      </div>

    </div>
  );
}