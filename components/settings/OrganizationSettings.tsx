"use client";

import {
  Building2,
  MapPin,
  Globe,
  Clock3,
  DollarSign,
  Save,
} from "lucide-react";

export default function OrganizationSettings() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <div className="mb-8">

        <h2 className="text-2xl font-bold text-slate-900">
          Organization Settings
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Configure your organization information and regional preferences.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Organization Name
          </label>

          <div className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 py-3">
            <Building2 className="h-5 w-5 text-slate-400" />

            <input
              defaultValue="Simmy Link Africa"
              className="w-full outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Country
          </label>

          <div className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 py-3">
            <Globe className="h-5 w-5 text-slate-400" />

            <input
              defaultValue="Nigeria"
              className="w-full outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Address
          </label>

          <div className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 py-3">
            <MapPin className="h-5 w-5 text-slate-400" />

            <input
              defaultValue="Makurdi, Benue State"
              className="w-full outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Time Zone
          </label>

          <div className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 py-3">
            <Clock3 className="h-5 w-5 text-slate-400" />

            <input
              defaultValue="Africa/Lagos"
              className="w-full outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Currency
          </label>

          <div className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 py-3">
            <DollarSign className="h-5 w-5 text-slate-400" />

            <input
              defaultValue="NGN (₦)"
              className="w-full outline-none"
            />
          </div>
        </div>

      </div>

      <div className="mt-8 flex justify-end">

        <button className="flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-medium text-white transition hover:bg-blue-800">

          <Save className="h-5 w-5" />

          Save Organization

        </button>

      </div>

    </div>
  );
}