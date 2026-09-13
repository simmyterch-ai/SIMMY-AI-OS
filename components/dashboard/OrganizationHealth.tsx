"use client";

import {
  Activity,
  ShieldCheck,
  Building2,
} from "lucide-react";

import type { DashboardData } from "@/lib/types/dashboard";

type OrganizationHealthProps = {
  data: DashboardData;
};

export default function OrganizationHealth({
  data,
}: OrganizationHealthProps) {
  const healthLabel =
    data.healthScore >= 90
      ? "Excellent"
      : data.healthScore >= 75
      ? "Good"
      : data.healthScore >= 50
      ? "Needs Monitoring"
      : data.healthScore >= 25
      ? "Needs Attention"
      : "Critical";

  const healthStyles =
    data.healthScore >= 90
      ? {
          badge:
            "bg-emerald-100 text-emerald-700",
          progress:
            "from-emerald-500 to-green-600",
        }
      : data.healthScore >= 75
      ? {
          badge:
            "bg-green-100 text-green-700",
          progress:
            "from-green-500 to-emerald-500",
        }
      : data.healthScore >= 50
      ? {
          badge:
            "bg-amber-100 text-amber-700",
          progress:
            "from-yellow-500 to-amber-500",
        }
      : data.healthScore >= 25
      ? {
          badge:
            "bg-orange-100 text-orange-700",
          progress:
            "from-orange-500 to-red-500",
        }
      : {
          badge:
            "bg-red-100 text-red-700",
          progress:
            "from-red-500 to-red-600",
        };

  const recommendation =
    data.attendanceRate >= 90
      ? "Attendance is excellent. Maintain current workforce engagement and punctuality."
      : data.attendanceRate >= 75
      ? "Attendance is good. Continue monitoring punctuality and workforce engagement."
      : data.attendanceRate >= 50
      ? "Attendance needs monitoring. Review attendance trends and address recurring late arrivals."
      : data.attendanceRate >= 25
      ? "Attendance requires attention. Review attendance records and engage team leaders."
      : "Attendance is critically low. Follow up with employees who have no attendance record and review today's workforce coverage.";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Organization Health
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Live overview of your organization's performance
          </p>
        </div>

        <div
          className={`rounded-full px-4 py-2 text-sm font-semibold ${healthStyles.badge}`}
        >
          {healthLabel}
        </div>

      </div>

      <div className="mt-8">

        <div className="flex items-center justify-between">

          <span className="text-sm font-medium text-slate-500">
            Overall Health Score
          </span>

          <span className="text-3xl font-bold text-blue-700">
            {data.healthScore}%
          </span>

        </div>

        <div className="mt-4 h-4 overflow-hidden rounded-full bg-slate-200">

          <div
            className={`h-full rounded-full bg-gradient-to-r ${healthStyles.progress} transition-all duration-700`}
            style={{
              width: `${Math.min(
                100,
                Math.max(0, data.healthScore)
              )}%`,
            }}
          />

        </div>

      </div>

      <div className="mt-8 grid gap-5">

        <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">

          <div className="flex items-center gap-3">

            <Activity className="h-5 w-5 text-blue-600" />

            <span className="font-medium text-slate-700">
              Active Employees
            </span>

          </div>

          <span className="font-semibold text-blue-700">
            {data.activeEmployees}/{data.totalEmployees}
          </span>

        </div>

        <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">

          <div className="flex items-center gap-3">

            <Building2 className="h-5 w-5 text-purple-600" />

            <span className="font-medium text-slate-700">
              Departments
            </span>

          </div>

          <span className="font-semibold text-purple-700">
            {data.departments}
          </span>

        </div>

        <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">

          <div className="flex items-center gap-3">

            <ShieldCheck className="h-5 w-5 text-emerald-600" />

            <span className="font-medium text-slate-700">
              Attendance
            </span>

          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              data.attendanceRate >= 75
                ? "bg-emerald-100 text-emerald-700"
                : data.attendanceRate >= 50
                ? "bg-amber-100 text-amber-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {data.attendanceRate}%
          </span>

        </div>

      </div>

      <div className="mt-8 rounded-2xl bg-blue-50 p-5">

        <p className="text-sm font-semibold text-blue-700">
          SAP AI Recommendation
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          {recommendation}
        </p>

      </div>

    </div>
  );
}