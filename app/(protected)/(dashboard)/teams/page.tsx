"use client";

import { useEffect, useState } from "react";

import TeamStats from "@/components/teams/TeamStats";
import TeamTable from "@/components/teams/TeamTable";
import AddTeamModal from "@/components/teams/AddTeamModal";
import EditTeamModal from "@/components/teams/EditTeamModal";
import DeleteTeamModal from "@/components/teams/DeleteTeamModal";

import type { Team } from "@/lib/types/team";

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedTeam, setSelectedTeam] =
    useState<Team | null>(null);

  // =====================================================
  // LOAD TEAMS
  // =====================================================

  useEffect(() => {
    loadTeams();
  }, []);

  async function loadTeams() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/teams", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to load teams."
        );
      }

      /*
       * The current API returns Team[] directly.
       *
       * We also support the older:
       * { success: true, teams: [...] }
       *
       * format so the page remains resilient.
       */
      const teamList = Array.isArray(data)
        ? data
        : Array.isArray(data?.teams)
          ? data.teams
          : [];

      setTeams(
        teamList.filter(
          (team: unknown): team is Team =>
            Boolean(team) &&
            typeof team === "object" &&
            typeof (team as Team).id === "number"
        )
      );
    } catch (error) {
      console.error(
        "Failed to load teams:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load teams."
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // ADD TEAM
  // =====================================================

  function handleAddTeam(
    response: unknown
  ) {
    /*
     * AddTeamModal should normally send the actual Team.
     * But this also accepts { team: Team } safely.
     */

    const team =
      response &&
      typeof response === "object" &&
      "team" in response
        ? (response as { team?: Team }).team
        : (response as Team);

    if (
      !team ||
      typeof team.id !== "number"
    ) {
      console.error(
        "Invalid team returned from AddTeamModal:",
        response
      );

      /*
       * Reload from database rather than allowing
       * malformed frontend state.
       */
      loadTeams();
      return;
    }

    setTeams((previous) => {
      const alreadyExists =
        previous.some(
          (existingTeam) =>
            existingTeam &&
            existingTeam.id === team.id
        );

      if (alreadyExists) {
        return previous;
      }

      return [team, ...previous];
    });

    setIsAddOpen(false);
  }

  // =====================================================
  // EDIT TEAM
  // =====================================================

  function handleEdit(team: Team) {
    if (!team) {
      return;
    }

    setSelectedTeam(team);
    setIsEditOpen(true);
  }

  function handleEditSaved(
    response: unknown
  ) {
    /*
     * IMPORTANT:
     *
     * PUT /api/teams/[id] currently returns:
     *
     * {
     *   success: true,
     *   message: "...",
     *   team: { ... }
     * }
     *
     * Therefore we extract response.team here.
     */

    const updatedTeam =
      response &&
      typeof response === "object" &&
      "team" in response
        ? (response as { team?: Team }).team
        : (response as Team);

    if (
      !updatedTeam ||
      typeof updatedTeam.id !== "number"
    ) {
      console.error(
        "Invalid updated team:",
        response
      );

      /*
       * The database update succeeded, so reload the
       * authoritative database state instead of
       * corrupting the React state.
       */
      loadTeams();

      setSelectedTeam(null);
      setIsEditOpen(false);

      return;
    }

    setTeams((previous) =>
      previous.map((team) =>
        team && team.id === updatedTeam.id
          ? updatedTeam
          : team
      )
    );

    setSelectedTeam(null);
    setIsEditOpen(false);
  }

  // =====================================================
  // DELETE TEAM
  // =====================================================

  function handleDelete(team: Team) {
    if (!team) {
      return;
    }

    setSelectedTeam(team);
    setIsDeleteOpen(true);
  }

  function handleDeleted(
    teamId: number
  ) {
    setTeams((previous) =>
      previous.filter(
        (team) =>
          team &&
          team.id !== teamId
      )
    );

    setSelectedTeam(null);
    setIsDeleteOpen(false);
  }

  // =====================================================
  // VIEW TEAM
  // =====================================================

  function handleView(team: Team) {
    console.log(
      "View team:",
      team
    );
  }

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Teams
          </h1>

          <p className="mt-2 text-slate-500">
            Manage teams, team leaders and workforce
            structure.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
          Loading teams...
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR STATE
  // =====================================================

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Teams
          </h1>

          <p className="mt-2 text-slate-500">
            Manage teams, team leaders and workforce
            structure.
          </p>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-12 text-center">
          <h2 className="text-xl font-bold text-red-700">
            Unable to load teams
          </h2>

          <p className="mt-2 text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={loadTeams}
            className="mt-6 rounded-xl bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <>
      <div className="space-y-8">
        {/* PAGE HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Teams
            </h1>

            <p className="mt-2 text-slate-500">
              Manage teams, team leaders and workforce
              structure.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setIsAddOpen(true)
            }
            className="rounded-xl bg-blue-700 px-5 py-3 font-medium text-white transition hover:bg-blue-800"
          >
            + Add Team
          </button>
        </div>

        {/* TEAM STATISTICS */}

        <TeamStats
          teams={teams}
        />

        {/* TEAM TABLE */}

        <TeamTable
          teams={teams}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* ADD TEAM */}

      <AddTeamModal
        isOpen={isAddOpen}
        onClose={() =>
          setIsAddOpen(false)
        }
        onSave={handleAddTeam}
      />

      {/* EDIT TEAM */}

      <EditTeamModal
        isOpen={isEditOpen}
        team={selectedTeam}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedTeam(null);
        }}
        onSave={handleEditSaved}
      />

      {/* DELETE TEAM */}

      <DeleteTeamModal
        isOpen={isDeleteOpen}
        team={selectedTeam}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedTeam(null);
        }}
        onDeleted={handleDeleted}
      />
    </>
  );
}