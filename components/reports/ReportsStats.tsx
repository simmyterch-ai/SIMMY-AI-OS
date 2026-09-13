"use client";

import Link from "next/link";

import {
  Users,
  Building2,
  Users2,
  UserCheck,
} from "lucide-react";

type ReportsStatsProps = {
  totalEmployees: number;
  totalDepartments: number;
  totalTeams: number;
  activeEmployees: number;
};

export default function ReportsStats({
  totalEmployees,
  totalDepartments,
  totalTeams,
  activeEmployees,
}: ReportsStatsProps) {
  const cards = [
    {
      title: "Employees",
      value: totalEmployees,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
      href: "/people",
    },
    {
      title: "Departments",
      value: totalDepartments,
      icon: Building2,
      color: "bg-green-100 text-green-600",
      href: "/departments",
    },
    {
      title: "Teams",
      value: totalTeams,
      icon: Users2,
      color: "bg-purple-100 text-purple-600",
      href: "/teams",
    },
    {
      title: "Active Employees",
      value: activeEmployees,
      icon: UserCheck,
      color: "bg-emerald-100 text-emerald-600",
      href: "/people?status=Active",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Link
            key={card.title}
            href={card.href}
            className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
          >
            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500 transition-colors group-hover:text-blue-600">
                  {card.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-800">
                  {card.value}
                </h2>

              </div>

              <div
                className={`rounded-xl p-3 transition-transform duration-300 group-hover:scale-110 ${card.color}`}
              >
                <Icon className="h-6 w-6" />
              </div>

            </div>
          </Link>
        );
      })}
    </div>
  );
}