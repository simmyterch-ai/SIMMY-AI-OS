"use client";

import {
  CheckCircle2,
  LogIn,
  Building2,
  UserPlus,
  Bot,
  CalendarCheck,
  ArrowRight,
} from "lucide-react";

import type { DashboardData } from "@/lib/types/dashboard";

type RecentActivityProps = {
  data: DashboardData;
};

export default function RecentActivity({
  data,
}: RecentActivityProps) {
  function getIcon(type: string) {
    switch (type) {
      case "Employee":
        return {
          icon: UserPlus,
          color: "bg-orange-100 text-orange-600",
        };

      case "Department":
        return {
          icon: Building2,
          color: "bg-purple-100 text-purple-600",
        };

      case "Attendance":
        return {
          icon: CalendarCheck,
          color: "bg-emerald-100 text-emerald-600",
        };

      case "AI":
        return {
          icon: Bot,
          color: "bg-cyan-100 text-cyan-600",
        };

      case "Security":
        return {
          icon: LogIn,
          color: "bg-blue-100 text-blue-600",
        };

      default:
        return {
          icon: CheckCircle2,
          color: "bg-slate-100 text-slate-600",
        };
    }
  }

  return (
    <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-slate-900">
            Recent Activity
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest actions across your organization
          </p>

        </div>

        <button className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium hover:bg-slate-200">

          View All

          <ArrowRight className="h-4 w-4" />

        </button>

      </div>

      <div className="space-y-5">

        {data.recentActivities.length === 0 && (

          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">

            No recent activities.

          </div>

        )}

        {data.recentActivities.map((activity) => {
          const item = getIcon(activity.type);

          const Icon = item.icon;

          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 rounded-2xl border border-slate-100 p-5 transition hover:border-blue-200 hover:bg-slate-50"
            >

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}
              >

                <Icon className="h-6 w-6" />

              </div>

              <div className="flex-1">

                <div className="flex items-center justify-between">

                  <h3 className="font-semibold text-slate-900">
                    {activity.title}
                  </h3>

                  <span className="text-sm text-slate-400">
                    {new Date(activity.createdAt).toLocaleString()}
                  </span>

                </div>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {activity.description}
                </p>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}