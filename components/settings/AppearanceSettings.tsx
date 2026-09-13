"use client";

import { Monitor, Moon, Palette, Sun } from "lucide-react";

export default function AppearanceSettings() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <div className="mb-8">

        <h2 className="text-2xl font-bold text-slate-900">
          Appearance
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Customize the look and feel of your SAP workspace.
        </p>

      </div>

      <div className="space-y-8">

        {/* Theme */}

        <div>

          <h3 className="mb-4 text-lg font-semibold text-slate-800">
            Theme
          </h3>

          <div className="grid gap-4 md:grid-cols-3">

            <ThemeCard
              icon={<Sun className="h-6 w-6 text-amber-500" />}
              title="Light"
              active
            />

            <ThemeCard
              icon={<Moon className="h-6 w-6 text-slate-700" />}
              title="Dark"
            />

            <ThemeCard
              icon={<Monitor className="h-6 w-6 text-blue-600" />}
              title="System"
            />

          </div>

        </div>

        {/* Accent Color */}

        <div>

          <h3 className="mb-4 text-lg font-semibold text-slate-800">
            Accent Color
          </h3>

          <div className="flex gap-4">

            <ColorCircle color="bg-blue-600" active />
            <ColorCircle color="bg-emerald-600" />
            <ColorCircle color="bg-purple-600" />
            <ColorCircle color="bg-orange-500" />
            <ColorCircle color="bg-pink-600" />

          </div>

        </div>

      </div>

    </div>
  );
}

function ThemeCard({
  icon,
  title,
  active = false,
}: {
  icon: React.ReactNode;
  title: string;
  active?: boolean;
}) {
  return (
    <button
      className={`rounded-2xl border p-6 text-center transition-all ${
        active
          ? "border-blue-600 bg-blue-50"
          : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
      }`}
    >
      <div className="flex justify-center">{icon}</div>

      <p className="mt-4 font-semibold text-slate-900">
        {title}
      </p>
    </button>
  );
}

function ColorCircle({
  color,
  active = false,
}: {
  color: string;
  active?: boolean;
}) {
  return (
    <button
      className={`h-10 w-10 rounded-full ${color} transition-all ${
        active
          ? "ring-4 ring-blue-200"
          : "hover:scale-110"
      }`}
    />
  );
}