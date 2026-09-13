"use client";

import type { Attendance } from "@/lib/types/attendance";

type AttendanceStatsProps = {
  attendance: Attendance[];
};

export default function AttendanceStats({
  attendance,
}: AttendanceStatsProps) {
  const totalRecords = attendance.length;

  const present = attendance.filter(
    (record) => record.status === "Present"
  ).length;

  const late = attendance.filter(
    (record) => record.status === "Late"
  ).length;

  const absent = attendance.filter(
    (record) => record.status === "Absent"
  ).length;

  const onLeave = attendance.filter(
    (record) => record.status === "On Leave"
  ).length;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="text-4xl">📋</div>

        <p className="mt-4 text-sm text-slate-500">
          Total Records
        </p>

        <h2 className="mt-2 text-4xl font-bold text-slate-900">
          {totalRecords}
        </h2>

      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="text-4xl">🟢</div>

        <p className="mt-4 text-sm text-slate-500">
          Present Today
        </p>

        <h2 className="mt-2 text-4xl font-bold text-green-600">
          {present}
        </h2>

      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="text-4xl">🟡</div>

        <p className="mt-4 text-sm text-slate-500">
          Late
        </p>

        <h2 className="mt-2 text-4xl font-bold text-amber-500">
          {late}
        </h2>

      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="text-4xl">🔴</div>

        <p className="mt-4 text-sm text-slate-500">
          Absent / Leave
        </p>

        <h2 className="mt-2 text-4xl font-bold text-red-600">
          {absent + onLeave}
        </h2>

      </div>

    </div>
  );
}