"use client";

import {
  Users,
  Clock3,
  Building2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import type { DashboardData } from "@/lib/types/dashboard";

type DashboardOverviewProps = {
  data: DashboardData;
};

export default function DashboardOverview({
  data,
}: DashboardOverviewProps) {
  return (
    <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-xl font-bold text-slate-900">
            Today's Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Real-time organization summary
          </p>

        </div>

        <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          Live
        </div>

      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">

        <OverviewCard
          icon={<Users className="h-5 w-5 text-blue-600" />}
          label="Employees"
          value={data.totalEmployees}
          valueColor="text-slate-900"
        />

        <OverviewCard
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          label="Present"
          value={data.present}
          valueColor="text-emerald-600"
        />

        <OverviewCard
          icon={<Clock3 className="h-5 w-5 text-yellow-600" />}
          label="Late"
          value={data.late}
          valueColor="text-yellow-600"
        />

        <OverviewCard
          icon={<Building2 className="h-5 w-5 text-purple-600" />}
          label="Departments"
          value={data.departments}
          valueColor="text-purple-600"
        />

      </div>

      <div className="mt-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white">

        <div className="flex items-start gap-3">

          <Sparkles className="mt-1 h-5 w-5" />

          <div>

            <p className="font-semibold">
              SAP AI Summary
            </p>

            <p className="mt-2 text-sm leading-6 text-blue-100">

              Today you have{" "}

              <strong>{data.totalEmployees}</strong>

              {" "}employees,

              <strong> {data.present}</strong>

              {" "}present,

              and{" "}

              <strong>{data.late}</strong>

              {" "}late arrivals.

              {data.late === 0
                ? " Excellent attendance today."
                : " Attendance is healthy, but review late arrivals."}

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

type OverviewCardProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
  valueColor: string;
};

function OverviewCard({
  icon,
  label,
  value,
  valueColor,
}: OverviewCardProps) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">

      <div className="flex items-center gap-3">

        {icon}

        <span className="text-sm text-slate-600">
          {label}
        </span>

      </div>

      <h3 className={`mt-3 text-3xl font-bold ${valueColor}`}>
        {value}
      </h3>

    </div>
  );
}