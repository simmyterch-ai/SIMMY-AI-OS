"use client";

import {
  User,
  Mail,
  Phone,
  Briefcase,
  Camera,
  Save,
} from "lucide-react";

export default function ProfileSettings() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <div className="mb-8">

        <h2 className="text-2xl font-bold text-slate-900">
          Profile Settings
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Update your personal information and account profile.
        </p>

      </div>

      <div className="mb-8 flex items-center gap-6">

        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
          <User className="h-10 w-10 text-blue-700" />
        </div>

        <button className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium transition hover:bg-slate-100">
          <Camera className="h-4 w-4" />
          Change Photo
        </button>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Full Name
          </label>

          <div className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 py-3">

            <User className="h-5 w-5 text-slate-400" />

            <input
              defaultValue="Simeon Dzuamo"
              className="w-full outline-none"
            />

          </div>

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Email Address
          </label>

          <div className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 py-3">

            <Mail className="h-5 w-5 text-slate-400" />

            <input
              defaultValue="admin@simmylinkafrica.com"
              className="w-full outline-none"
            />

          </div>

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Phone Number
          </label>

          <div className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 py-3">

            <Phone className="h-5 w-5 text-slate-400" />

            <input
              defaultValue="+212 600 000 000"
              className="w-full outline-none"
            />

          </div>

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Position
          </label>

          <div className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 py-3">

            <Briefcase className="h-5 w-5 text-slate-400" />

            <input
              defaultValue="Founder & Administrator"
              className="w-full outline-none"
            />

          </div>

        </div>

      </div>

      <div className="mt-8 flex justify-end">

        <button className="flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-medium text-white transition hover:bg-blue-800">

          <Save className="h-5 w-5" />

          Save Changes

        </button>

      </div>

    </div>
  );
}