"use client";

import { useState } from "react";

import type { Team } from "@/lib/types/team";

type TeamTableProps = {
  teams: Team[];
  onView: (team: Team) => void;
  onEdit: (team: Team) => void;
  onDelete: (team: Team) => void;
};

export default function TeamTable({
  teams,
  onView,
  onEdit,
  onDelete,
}: TeamTableProps) {
  const [searchTerm, setSearchTerm] =
    useState("");

  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState("All Status");

    const filteredTeams = teams.filter(
    (team) => {
      const search =
        searchTerm
          .trim()
          .toLowerCase();

      const teamName =
        typeof team.name === "string"
          ? team.name.toLowerCase()
          : "";

      const teamLead =
        typeof team.teamLead === "string"
          ? team.teamLead.toLowerCase()
          : "";

      const department =
        typeof team.department === "string"
          ? team.department.toLowerCase()
          : "";

      const location =
        typeof team.location === "string"
          ? team.location.toLowerCase()
          : "";

      const matchesSearch =
        !search ||
        teamName.includes(search) ||
        teamLead.includes(search) ||
        department.includes(search) ||
        location.includes(search);

      const matchesStatus =
        selectedStatus ===
          "All Status" ||
        team.status ===
          selectedStatus;

      return (
        matchesSearch &&
        matchesStatus
      );
    }
  );

  const getStatusBadge = (
    status: Team["status"]
  ) =>
    status === "Active"
      ? "bg-green-100 text-green-700"
      : "bg-amber-100 text-amber-700";

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {filteredTeams.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-700">
            {teams.length}
          </span>{" "}
          teams
        </p>

        <span className="rounded-full bg-purple-100 px-4 py-2 text-xs font-semibold text-purple-700">
          Team Management
        </span>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <input
          type="text"
          placeholder="Search teams, leads or departments..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(
              e.target.value
            )
          }
          className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />

        <select
          value={selectedStatus}
          onChange={(e) =>
            setSelectedStatus(
              e.target.value
            )
          }
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
        >
          <option>
            All Status
          </option>
          <option>
            Active
          </option>
          <option>
            Inactive
          </option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[1100px]">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-4 text-left">
                Team
              </th>

              <th className="px-6 py-4 text-left">
                Department
              </th>

              <th className="px-6 py-4 text-left">
                Team Lead
              </th>

              <th className="px-6 py-4 text-center">
                Members
              </th>

              <th className="px-6 py-4 text-left">
                Location
              </th>

              <th className="px-6 py-4 text-left">
                Status
              </th>

              <th className="px-6 py-4 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredTeams.length > 0 ? (
              filteredTeams.map(
                (team) => (
                  <tr
                    key={team.id}
                    className="border-t transition hover:bg-blue-50"
                  >
                    <td className="px-6 py-5">
                      <button
                        type="button"
                        onClick={() =>
                          onView(team)
                        }
                        className="flex items-center gap-4 text-left"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-xl text-white shadow-sm">
                          👥
                        </div>

                        <div>
                          <p className="font-semibold text-slate-800 hover:text-blue-600">
                            {team.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {team.teamId}
                          </p>
                        </div>
                      </button>
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                        {
                          team.department
                        }
                      </span>
                    </td>

                    <td className="px-6 py-5 text-slate-700">
                      👤{" "}
                      {
                        team.teamLead
                      }
                    </td>

                    <td className="px-6 py-5 text-center">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                        {
                          team.memberCount
                        }
                      </span>
                    </td>

                    <td className="px-6 py-5 text-slate-600">
                      📍{" "}
                      {
                        team.location
                      }
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(
                          team.status
                        )}`}
                      >
                        {
                          team.status
                        }
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            onView(team)
                          }
                          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onEdit(team)
                          }
                          className="rounded-lg px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onDelete(team)
                          }
                          className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-20 text-center"
                >
                  <div className="text-6xl">
                    👥
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-slate-800">
                    No teams found
                  </h3>

                  <p className="mt-2 text-slate-500">
                    {teams.length ===
                    0
                      ? "No teams have been created for this organization yet."
                      : "Try another search term or status filter."}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}