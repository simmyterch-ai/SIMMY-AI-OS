"use client";

import { useEffect, useState } from "react";

import type { Team } from "@/lib/types/team";

type Department = {
  id: number;
  name: string;
};

type EditTeamModalProps = {
  isOpen: boolean;
  team: Team | null;
  onClose: () => void;
  onSave: (team: Team) => void;
};

type UpdateTeamResponse = {
  success: boolean;
  message?: string;
  team?: Team;
  error?: string;
};

export default function EditTeamModal({
  isOpen,
  team,
  onClose,
  onSave,
}: EditTeamModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  const [departments, setDepartments] =
    useState<Department[]>([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] =
    useState<string | null>(null);

  // =====================================================
  // LOAD TEAM DATA INTO FORM
  // =====================================================

  useEffect(() => {
    if (!team) {
      setName("");
      setDescription("");
      setDepartmentId("");
      return;
    }

    setName(team.name ?? "");

    setDescription(
      team.description ?? ""
    );

    setDepartmentId(
      String(
        team.departmentId ?? ""
      )
    );

    setError(null);
  }, [team]);

  // =====================================================
  // LOAD DEPARTMENTS
  // =====================================================

  useEffect(() => {
    if (!isOpen) return;

    loadDepartments();
  }, [isOpen]);

  async function loadDepartments() {
    try {
      const response = await fetch(
        "/api/departments",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to load departments."
        );
      }

      setDepartments(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.departments)
          ? data.departments
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load departments:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load departments."
      );
    }
  }

  // =====================================================
  // SAVE TEAM
  // =====================================================

  async function handleSave() {
    if (!team) return;

    const trimmedName =
      name.trim();

    if (!trimmedName) {
      setError(
        "Team name is required."
      );
      return;
    }

    if (!departmentId) {
      setError(
        "Please select a department."
      );
      return;
    }

    const numericDepartmentId =
      Number(departmentId);

    if (
      !Number.isInteger(
        numericDepartmentId
      )
    ) {
      setError(
        "Please select a valid department."
      );
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const response = await fetch(
        `/api/teams/${team.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: trimmedName,

            description:
              description.trim() ||
              null,

            departmentId:
              numericDepartmentId,
          }),
        }
      );

      const data: UpdateTeamResponse =
        await response.json();

      // =================================================
      // API ERROR
      // =================================================

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to update team."
        );
      }

      // =================================================
      // IMPORTANT:
      //
      // The API returns:
      //
      // {
      //   success: true,
      //   message: "...",
      //   team: { ... }
      // }
      //
      // We must pass data.team to the parent,
      // NOT the entire response object.
      // =================================================

      if (
        !data.team ||
        typeof data.team.id !==
          "number"
      ) {
        console.error(
          "Invalid team returned from update API:",
          data
        );

        throw new Error(
          "The server updated the team but returned an invalid team record."
        );
      }

      // Send the actual Team object
      // back to TeamsPage.
      onSave(data.team);

      // Close only after a successful save.
      onClose();
    } catch (error) {
      console.error(
        "Failed to update team:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update team."
      );
    } finally {
      setSaving(false);
    }
  }

  // =====================================================
  // DO NOT RENDER WHEN CLOSED
  // =====================================================

  if (!isOpen || !team) {
    return null;
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Edit Team
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update team information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* =================================================
            FORM
        ================================================= */}

        <div className="mt-6 space-y-4">

          {/* TEAM NAME */}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Team Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              disabled={saving}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
              placeholder="Enter team name"
            />
          </div>

          {/* DEPARTMENT */}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Department
            </label>

            <select
              value={departmentId}
              onChange={(e) =>
                setDepartmentId(
                  e.target.value
                )
              }
              disabled={saving}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
            >
              <option value="">
                Select department
              </option>

              {departments.map(
                (department) => (
                  <option
                    key={
                      department.id
                    }
                    value={
                      department.id
                    }
                  >
                    {department.name}
                  </option>
                )
              )}
            </select>
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              disabled={saving}
              rows={3}
              placeholder="Describe the team..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
            />
          </div>
        </div>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="mt-6 flex justify-end gap-3">

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={
              !name.trim() ||
              !departmentId ||
              saving
            }
            className="rounded-xl bg-blue-700 px-5 py-3 font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>
      </div>
    </div>
  );
}