"use client";

import {
  Server,
  Database,
  Cpu,
  ShieldCheck,
  Globe,
  CheckCircle2,
} from "lucide-react";

export default function SystemInformation() {
  const systemInfo = [
    {
      title: "Platform",
      value: "SIMMY AI PLATFORM",
      icon: Cpu,
      color: "text-blue-600",
    },
    {
      title: "Version",
      value: "SAP V1.0",
      icon: CheckCircle2,
      color: "text-emerald-600",
    },
    {
      title: "Database",
      value: "PostgreSQL",
      icon: Database,
      color: "text-purple-600",
    },
    {
      title: "API Status",
      value: "Healthy",
      icon: Server,
      color: "text-orange-600",
    },
    {
      title: "Security",
      value: "Protected",
      icon: ShieldCheck,
      color: "text-green-600",
    },
    {
      title: "Region",
      value: "Global",
      icon: Globe,
      color: "text-cyan-600",
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <div className="mb-8">

        <h2 className="text-2xl font-bold text-slate-900">
          System Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Current platform status and environment information.
        </p>

      </div>

      <div className="grid gap-5 md:grid-cols-2">

        {systemInfo.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 p-5 transition-all duration-300 hover:border-blue-200 hover:shadow-md"
            >

              <div className="rounded-2xl bg-slate-100 p-3">

                <Icon className={`h-6 w-6 ${item.color}`} />

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  {item.title}
                </p>

                <h3 className="text-lg font-semibold text-slate-900">
                  {item.value}
                </h3>

              </div>

            </div>
          );
        })}

      </div>

      <div className="mt-8 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white">

        <h3 className="font-semibold">
          Platform Status
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          All core services are operational. Your system is
          running normally and is ready for daily workforce
          management.
        </p>

      </div>

    </div>
  );
}