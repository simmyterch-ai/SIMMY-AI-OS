"use client";

import {
  Building2,
  Users,
  CalendarCheck,
  Clock3,
} from "lucide-react";

type ReportsTableProps = {
  totalEmployees: number;
  totalDepartments: number;
  totalTeams: number;
  activeEmployees: number;
  attendanceRate: number;
  averageHours: number;
};

export default function ReportsTable({
  totalEmployees,
  totalDepartments,
  totalTeams,
  activeEmployees,
  attendanceRate,
  averageHours,
}: ReportsTableProps) {
  const rows = [
    {
      icon: Users,
      label: "Total Employees",
      value: totalEmployees,
    },
    {
      icon: Building2,
      label: "Departments",
      value: totalDepartments,
    },
    {
      icon: Users,
      label: "Teams",
      value: totalTeams,
    },
    {
      icon: CalendarCheck,
      label: "Attendance Rate",
      value: `${attendanceRate}%`,
    },
    {
      icon: Clock3,
      label: "Average Work Hours",
      value: `${averageHours.toFixed(2)} hrs`,
    },
    {
      icon: Users,
      label: "Active Employees",
      value: activeEmployees,
    },
  ];

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          Executive Summary
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Key organizational metrics
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">

        <table className="min-w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Metric
              </th>

              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                Value
              </th>

            </tr>

          </thead>

          <tbody>

            {rows.map((row) => {
              const Icon = row.icon;

              return (
                <tr
                  key={row.label}
                  className="border-t"
                >
                  <td className="px-6 py-4">

                    <div className="flex items-center gap-3">

                      <div className="rounded-lg bg-blue-100 p-2">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>

                      <span className="font-medium text-slate-700">
                        {row.label}
                      </span>

                    </div>

                  </td>

                  <td className="px-6 py-4 text-right font-bold text-slate-800">
                    {row.value}
                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

    </div>
  );
}