"use client";

import Link from "next/link";

import {
  Building2,
  UserPlus,
  Bot,
  FileBarChart2,
  ArrowRight,
} from "lucide-react";

const actions = [
  {
    title: "Organization",
    subtitle: "Manage company profile",
    icon: Building2,
    href: "/organization",
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Add Employee",
    subtitle: "Register a new employee",
    icon: UserPlus,
    href: "/people",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Ask SAP AI",
    subtitle: "Generate AI insights",
    icon: Bot,
    href: "/ai-assistant",
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "Reports",
    subtitle: "View analytics dashboard",
    icon: FileBarChart2,
    href: "/reports",
    color: "bg-orange-50 text-orange-600",
  },
];

export default function QuickActions() {
  return (
    <div className="mt-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Frequently used actions for administrators.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group"
            >
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${action.color}`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>

                  <ArrowRight className="h-5 w-5 text-slate-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-blue-600" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  {action.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {action.subtitle}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}