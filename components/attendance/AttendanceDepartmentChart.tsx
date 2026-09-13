"use client";

import type { Attendance } from "@/lib/types/attendance";

type AttendanceDepartmentChartProps = {
  attendance: Attendance[];
};

type DepartmentSummary = {
  name: string;
  total: number;
};

export default function AttendanceDepartmentChart({
  attendance,
}: AttendanceDepartmentChartProps) {
  const departmentMap = new Map<string, number>();

  attendance.forEach((record) => {
    const department =
      record.user.department?.name ?? "Unknown";

    departmentMap.set(
      department,
      (departmentMap.get(department) ?? 0) + 1
    );
  });

  const departments: DepartmentSummary[] = Array.from(
    departmentMap.entries()
  )
    .map(([name, total]) => ({
      name,
      total,
    }))
    .sort((a, b) => b.total - a.total);

  const maxValue =
    departments.length > 0
      ? departments[0].total
      : 1;

  return (
    <div className="h-full rounded-2xl border bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Attendance by Department
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Live attendance distribution
          </p>
        </div>

        <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
          {departments.length} Departments
        </div>

      </div>

      <div className="flex h-80 flex-col justify-between">

        {departments.map((department) => {
          const percentage = Math.round(
            (department.total / maxValue) * 100
          );

          return (
            <div
              key={department.name}
              className="w-full"
            >
              <div className="mb-2 flex items-center justify-between">

                <span className="font-medium text-slate-700">
                  {department.name}
                </span>

                <span className="text-sm font-semibold text-slate-600">
                  {department.total} Employee
                  {department.total > 1 ? "s" : ""}
                </span>

              </div>

              <div className="h-3 w-full rounded-full bg-slate-200">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-700"
                  style={{
                    width: `${percentage}%`,
                  }}
                />

              </div>
            </div>
          );
        })}

        {departments.length === 0 && (
          <div className="flex h-full items-center justify-center text-slate-500">
            No attendance data available.
          </div>
        )}

      </div>

    </div>
  );
}