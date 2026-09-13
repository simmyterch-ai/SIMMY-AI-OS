"use client";

import type { Attendance } from "@/lib/types/attendance";

type AttendanceSummaryProps = {
  attendance: Attendance[];
};

export default function AttendanceSummary({
  attendance,
}: AttendanceSummaryProps) {
  const present = attendance.filter(
    (a) => a.status === "Present"
  ).length;

  const late = attendance.filter(
    (a) => a.status === "Late"
  ).length;

  const remote = attendance.filter(
    (a) => a.status === "Remote"
  ).length;

  const halfDay = attendance.filter(
    (a) => a.status === "Half Day"
  ).length;

  const onLeave = attendance.filter(
    (a) => a.status === "On Leave"
  ).length;

  const holiday = attendance.filter(
    (a) => a.status === "Holiday"
  ).length;

  const totalHours = attendance.reduce(
    (sum, item) => sum + (item.workHours ?? 0),
    0
  );

  const averageHours =
    attendance.length > 0
      ? (totalHours / attendance.length).toFixed(2)
      : "0.00";

  const departmentCount: Record<string, number> = {};

  attendance.forEach((item) => {
    const department =
      item.user.department?.name ?? "Unknown";

    departmentCount[department] =
      (departmentCount[department] ?? 0) + 1;
  });

  const topDepartment =
    Object.entries(departmentCount).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] ?? "-";

  return (
    <div className="grid gap-6 lg:grid-cols-2">

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-lg font-semibold">
          Today's Summary
        </h2>

        <div className="grid grid-cols-2 gap-4">

          <SummaryItem
            label="Present"
            value={present}
            color="text-green-600"
          />

          <SummaryItem
            label="Late"
            value={late}
            color="text-yellow-600"
          />

          <SummaryItem
            label="Remote"
            value={remote}
            color="text-blue-600"
          />

          <SummaryItem
            label="Half Day"
            value={halfDay}
            color="text-orange-500"
          />

          <SummaryItem
            label="On Leave"
            value={onLeave}
            color="text-purple-600"
          />

          <SummaryItem
            label="Holiday"
            value={holiday}
            color="text-pink-600"
          />

        </div>

      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-lg font-semibold">
          Workforce Insights
        </h2>

        <div className="space-y-6">

          <div>
            <p className="text-sm text-slate-500">
              Average Working Hours
            </p>

            <p className="mt-1 text-3xl font-bold text-blue-600">
              {averageHours} hrs
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Leading Department
            </p>

            <p className="mt-1 text-xl font-semibold">
              {topDepartment}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Attendance Records
            </p>

            <p className="mt-1 text-xl font-semibold">
              {attendance.length}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

type SummaryItemProps = {
  label: string;
  value: number;
  color: string;
};

function SummaryItem({
  label,
  value,
  color,
}: SummaryItemProps) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">

      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className={`mt-2 text-2xl font-bold ${color}`}>
        {value}
      </p>

    </div>
  );
}