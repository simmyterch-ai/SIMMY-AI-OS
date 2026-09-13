"use client";

import {
  BrainCircuit,
  Users,
  CalendarCheck,
  Clock3,
  TrendingUp,
} from "lucide-react";

type ReportsInsightsProps = {
  activeEmployees: number;
  totalEmployees: number;
  attendanceRate: number;
  averageHours: number;
};

export default function ReportsInsights({
  activeEmployees,
  totalEmployees,
  attendanceRate,
  averageHours,
}: ReportsInsightsProps) {
  const insights = [
    {
      icon: Users,
      text: `${activeEmployees} of ${totalEmployees} employees are currently active.`,
    },
    {
      icon: CalendarCheck,
      text: `Attendance rate is ${attendanceRate}% today.`,
    },
    {
      icon: Clock3,
      text: `Average working hours: ${averageHours.toFixed(2)} hrs.`,
    },
    {
      icon: TrendingUp,
      text: "Attendance performance remains stable across the organization.",
    },
  ];

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center gap-3">

        <div className="rounded-xl bg-violet-100 p-3">
          <BrainCircuit className="h-6 w-6 text-violet-600" />
        </div>

        <div>

          <h2 className="text-xl font-bold text-slate-800">
            SAP AI Insights
          </h2>

          <p className="text-sm text-slate-500">
            Live workforce intelligence
          </p>

        </div>

      </div>

      <div className="space-y-4">

        {insights.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="rounded-lg bg-blue-100 p-2">
                <Icon className="h-5 w-5 text-blue-600" />
              </div>

              <p className="text-sm leading-6 text-slate-700">
                {item.text}
              </p>
            </div>
          );
        })}

      </div>

    </div>
  );
}