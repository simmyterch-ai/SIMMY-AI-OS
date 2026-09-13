"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  User,
  Settings,
  Bell,
  CircleHelp,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfileDropdown() {
  const { user } = useAuth();

  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    try {
      setLoading(true);

      await fetch("/api/auth/logout", {
        method: "POST",
      });

      router.push("/login");
      router.refresh();
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <div className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-slate-100"
      >

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">

          {user?.name?.charAt(0).toUpperCase() ?? "U"}

        </div>

        <div className="text-left">

          <p className="font-semibold text-slate-900">
            {user?.name ?? "Guest"}
          </p>

          <p className="text-sm text-slate-500">
            {user?.role ?? ""}
          </p>

        </div>

        <ChevronDown
          className={`h-4 w-4 text-slate-500 transition ${
            open ? "rotate-180" : ""
          }`}
        />

      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

          <div className="border-b border-slate-100 p-5">

            <p className="font-semibold">
              {user?.name}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {user?.email}
            </p>

          </div>

          <button className="flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-slate-50">

            <User className="h-5 w-5" />

            My Profile

          </button>

          <button className="flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-slate-50">

            <Settings className="h-5 w-5" />

            Account Settings

          </button>

          <button className="flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-slate-50">

            <Bell className="h-5 w-5" />

            Notifications

          </button>

          <button className="flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-slate-50">

            <CircleHelp className="h-5 w-5" />

            Help

          </button>

          <div className="border-t border-slate-100">

            <button
              onClick={handleLogout}
              disabled={loading}
              className="flex w-full items-center gap-3 px-5 py-3 text-left text-red-600 transition hover:bg-red-50"
            >

              <LogOut className="h-5 w-5" />

              {loading ? "Signing Out..." : "Sign Out"}

            </button>

          </div>

        </div>
      )}

    </div>
  );
}