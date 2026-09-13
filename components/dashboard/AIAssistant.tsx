"use client";

import {
  Bot,
  Sparkles,
  ArrowRight,
  Activity,
  BrainCircuit,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import type { DashboardData } from "@/lib/types/dashboard";
import Link from "next/link";
type AIAssistantProps = {
  data: DashboardData;
};

export default function AIAssistant({
  data,
}: AIAssistantProps) {
  const { user } = useAuth();

  const attendedToday =
    data.present + data.late;

  const missingAttendance = Math.max(
    0,
    data.activeEmployees -
      attendedToday
  );

  const attendanceStatus =
    data.attendanceRate >= 90
      ? "Excellent"
      : data.attendanceRate >= 75
      ? "Good"
      : data.attendanceRate >= 50
      ? "Needs Monitoring"
      : data.attendanceRate >= 25
      ? "Needs Attention"
      : "Critical";

  const recommendation =
    data.attendanceRate >= 90
      ? "Attendance is excellent today. Maintain current workforce engagement and punctuality."
      : data.attendanceRate >= 75
      ? data.late > 0
        ? `Attendance is good, but ${data.late} ${
            data.late === 1
              ? "employee is"
              : "employees are"
          } late today. Review punctuality trends.`
        : "Attendance is good and no late arrivals have been recorded today."
      : data.attendanceRate >= 50
      ? `Attendance requires monitoring. ${data.late} ${
          data.late === 1
            ? "employee is"
            : "employees are"
        } late today. Review attendance patterns.`
      : data.attendanceRate >= 25
      ? `Attendance requires attention. Only ${attendedToday} of ${data.activeEmployees} active employees have recorded attendance today. Follow up with team leaders.`
      : `Attendance is critically low. Only ${attendedToday} of ${data.activeEmployees} active employees have recorded attendance today. ${missingAttendance} ${
          missingAttendance === 1
            ? "employee has"
            : "employees have"
        } no attendance record. Immediate follow-up is recommended.`;

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 17
      ? "Good afternoon"
      : "Good evening";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
            <Bot className="h-7 w-7 text-blue-700" />
          </div>

          <div>

            <h2 className="text-2xl font-bold text-slate-900">
              SAP AI Assistant
            </h2>

            <p className="text-sm text-slate-500">
              Executive AI Workspace
            </p>

          </div>

        </div>

        <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold text-blue-700">
          AI ONLINE
        </span>

      </div>

      <div className="mt-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">

        <div className="flex items-start gap-4">

          <Sparkles className="mt-1 h-6 w-6" />

          <div>

            <h3 className="text-lg font-semibold">
              {greeting},{" "}
              {user?.name?.split(" ")[0] ?? "User"} 👋
            </h3>

            <p className="mt-2 leading-7 text-blue-100">
              I analyzed today's workforce.
              There are{" "}
              <strong>
                {data.totalEmployees}
              </strong>{" "}
              employees,{" "}
              <strong>
                {data.present}
              </strong>{" "}
              present, and{" "}
              <strong>
                {data.late}
              </strong>{" "}
              late today.
            </p>

          </div>

        </div>

      </div>

      <div className="mt-8 space-y-4">

        <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">

          <div className="flex items-center gap-3">

            <Activity className="h-5 w-5 text-emerald-600" />

            <span className="font-medium">
              Attendance Status
            </span>

          </div>

          <span
            className={`font-semibold ${
              data.attendanceRate >= 75
                ? "text-emerald-600"
                : data.attendanceRate >= 50
                ? "text-amber-600"
                : data.attendanceRate >= 25
                ? "text-orange-600"
                : "text-red-600"
            }`}
          >
            {attendanceStatus}
          </span>

        </div>

        <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">

          <div className="flex items-center gap-3">

            <BrainCircuit className="h-5 w-5 text-purple-600" />

            <span className="font-medium">
              Attendance Rate
            </span>

          </div>

          <span className="font-semibold text-purple-700">
            {data.attendanceRate}%
          </span>

        </div>

      </div>

      <div className="mt-6 rounded-2xl bg-blue-50 p-5">

        <p className="text-sm font-semibold text-blue-700">
          AI Recommendation
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          {recommendation}
        </p>

      </div>

      <div className="mt-8">

        <div className="flex overflow-hidden rounded-2xl border border-slate-300">

          <input
            type="text"
            placeholder="Ask SAP AI anything..."
            className="flex-1 px-5 py-4 outline-none"
          />

          <Link
  href="/ai-assistant"
  className="flex items-center gap-2 bg-blue-700 px-6 text-white transition hover:bg-blue-800"
>
  Ask
  <ArrowRight className="h-5 w-5" />
</Link>

        </div>

      </div>

    </div>
  );
}