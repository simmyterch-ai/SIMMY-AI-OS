"use client";

import {
  Users,
  Building2,
  Users2,
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
      icon: Users2,
      label: "Teams",
      value: totalTeams,
    },
    {
      icon: Users,
      label: "Active Employees",
      value: activeEmployees,
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
  ];

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-slate-800">
        Executive Summary
      </h2>

      <table className="w-full">
        <thead className="border-b">
          <tr>
            <th className="py-3 text-left">Metric</th>
            <th className="py-3 text-right">Value</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => {
            const Icon = row.icon;

            return (
              <tr
                key={row.label}
                className="border-b last:border-0"
              >
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-blue-600" />
                    {row.label}
                  </div>
                </td>

                <td className="py-4 text-right font-bold">
                  {row.value}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}