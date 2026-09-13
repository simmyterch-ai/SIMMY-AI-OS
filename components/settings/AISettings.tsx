"use client";

import {
  Bot,
  Sparkles,
  BrainCircuit,
  Wand2,
} from "lucide-react";

export default function AISettings() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <div className="mb-8">

        <h2 className="text-2xl font-bold text-slate-900">
          AI Settings
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Configure how SAP AI assists your organization.
        </p>

      </div>

      <div className="space-y-5">

        <SettingRow
          icon={<Bot className="h-5 w-5 text-blue-600" />}
          title="Enable SAP AI"
          description="Allow SAP AI to assist across the platform."
          enabled
        />

        <SettingRow
          icon={<Sparkles className="h-5 w-5 text-purple-600" />}
          title="Daily AI Summary"
          description="Receive an executive summary every day."
          enabled
        />

        <SettingRow
          icon={<BrainCircuit className="h-5 w-5 text-emerald-600" />}
          title="Smart Recommendations"
          description="Generate intelligent workforce recommendations."
          enabled
        />

        <SettingRow
          icon={<Wand2 className="h-5 w-5 text-orange-600" />}
          title="Auto Insights"
          description="Automatically analyze attendance and reports."
        />

      </div>

      <div className="mt-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">

        <h3 className="font-semibold">
          SAP AI Status
        </h3>

        <p className="mt-2 text-sm leading-6 text-blue-100">
          SAP AI is active and ready to assist with
          workforce analytics, reporting and organizational
          insights.
        </p>

      </div>

    </div>
  );
}

type SettingRowProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled?: boolean;
};

function SettingRow({
  icon,
  title,
  description,
  enabled = false,
}: SettingRowProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-5">

      <div className="flex items-start gap-4">

        <div className="rounded-xl bg-slate-100 p-3">
          {icon}
        </div>

        <div>

          <h3 className="font-semibold text-slate-900">
            {title}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>

        </div>

      </div>

      <label className="relative inline-flex cursor-pointer items-center">

        <input
          type="checkbox"
          defaultChecked={enabled}
          className="peer sr-only"
        />

        <div className="peer h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-blue-600 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5" />

      </label>

    </div>
  );
}