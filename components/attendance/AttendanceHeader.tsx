"use client";

import Link from "next/link";

type AttendanceHeaderProps = {
  search: string;
  onSearchChange: (value: string) => void;

  statusFilter: string;
  onStatusChange: (value: string) => void;

  onClockIn: () => void;
};

export default function AttendanceHeader({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onClockIn,
}: AttendanceHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Attendance
          </h1>

          <p className="mt-2 text-slate-500">
            Monitor employee attendance and working hours.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/attendance/history"
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-medium transition hover:bg-slate-100"
          >
            Attendance History
          </Link>

          <button
            onClick={onClockIn}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            + Clock In
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full max-w-sm rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />

        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          <option value="All">All Status</option>
          <option value="Present">Present</option>
          <option value="Late">Late</option>
          <option value="Absent">Absent</option>
          <option value="Half Day">Half Day</option>
          <option value="On Leave">On Leave</option>
          <option value="Remote">Remote</option>
          <option value="Holiday">Holiday</option>
        </select>
      </div>
    </div>
  );
}