"use client";

import type { Attendance } from "@/lib/types/attendance";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface Props {
  attendance: Attendance[];
}

export default function AttendanceTrendChart({
  attendance,
}: Props) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const chartData = days.map((day, index) => ({
  day: day.slice(0, 3),
  total: attendance.filter((record) => {
    if (!record.clockIn) {
      return false;
    }

    const date = new Date(record.clockIn);

    return date.getDay() === index;
  }).length,
}));

  return (
    <div className="h-full rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">
          Weekly Attendance Trend
        </h3>

        <p className="text-sm text-slate-500">
          Employee attendance grouped by weekday
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis dataKey="day" />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="total"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}