"use client";

import {
  CalendarDays,
  Plus,
  UserPlus,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function WelcomeBanner() {
  const { user, loading } = useAuth();

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 17
      ? "Good Afternoon"
      : "Good Evening";

  const today = new Date().toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-8 text-white shadow-lg">

      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <div className="flex items-center gap-2 text-blue-100">

            <CalendarDays className="h-5 w-5" />

            <span className="text-sm font-medium">
              {today}
            </span>

          </div>

          <h1 className="mt-4 text-4xl font-bold leading-tight">
            {greeting},{" "}
            {loading ? "Loading..." : user?.name ?? "Guest"} 👋
          </h1>

          <p className="mt-3 max-w-2xl text-lg text-blue-100">
            Welcome back to the SIMMY AI PLATFORM.
            Here's a quick overview of your organization today.
          </p>

          {!loading && user && (
            <div className="mt-5 flex flex-wrap gap-3 text-sm">

              <span className="rounded-full bg-white/20 px-3 py-1">
                {user.role}
              </span>

              <span className="rounded-full bg-white/20 px-3 py-1">
                {user.email}
              </span>

              <span className="rounded-full bg-white/20 px-3 py-1">
                {user.status}
              </span>

            </div>
          )}

        </div>

        <div className="flex flex-wrap gap-4">

          <button className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-blue-700 transition hover:scale-105">

            <UserPlus className="h-5 w-5" />

            Add Employee

          </button>

          <button className="flex items-center gap-2 rounded-xl border border-blue-300 bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500">

            <Plus className="h-5 w-5" />

            Quick Action

          </button>

        </div>

      </div>

    </div>
  );
}