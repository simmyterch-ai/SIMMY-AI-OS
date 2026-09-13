"use client";

import type { Team } from "@/lib/types/team";

type TeamStatsProps = {
  teams: Team[];
};

export default function TeamStats({
  teams,
}: TeamStatsProps) {
  /*
   * Defensive normalization.
   *
   * The API should return Team[], but we protect the UI
   * against an accidental null/undefined item so that one
   * malformed record cannot crash the entire Teams page.
   */
  const safeTeams = Array.isArray(teams)
    ? teams.filter(
        (team): team is Team =>
          Boolean(team) &&
          typeof team === "object"
      )
    : [];

  const totalTeams = safeTeams.length;

  const activeTeams = safeTeams.filter(
    (team) => team.status === "Active"
  ).length;

  const inactiveTeams = safeTeams.filter(
    (team) => team.status === "Inactive"
  ).length;

  const totalMembers = safeTeams.reduce(
    (total, team) =>
      total +
      (typeof team.memberCount === "number"
        ? team.memberCount
        : 0),
    0
  );

  const stats = [
    {
      label: "Total Teams",
      value: totalTeams,
      description: "Teams in organization",
      icon: "👥",
      className:
        "bg-blue-50 text-blue-700",
    },
    {
      label: "Active Teams",
      value: activeTeams,
      description: "Currently active",
      icon: "✓",
      className:
        "bg-green-50 text-green-700",
    },
    {
      label: "Inactive Teams",
      value: inactiveTeams,
      description: "Currently inactive",
      icon: "○",
      className:
        "bg-amber-50 text-amber-700",
    },
    {
      label: "Team Members",
      value: totalMembers,
      description: "Members across teams",
      icon: "👤",
      className:
        "bg-purple-50 text-purple-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                {stat.label}
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-800">
                {stat.value}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {stat.description}
              </p>
            </div>

            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold ${stat.className}`}
            >
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}