"use client";

import { useEffect, useState } from "react";

import type { Team } from "@/lib/types/team";

type Department = {
  id: number;
  name: string;
};

type AddTeamModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (team: Team) => void;
};

export default function AddTeamModal({
  isOpen,
  onClose,
  onSave,
}: AddTeamModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");
  const [departmentId, setDepartmentId] =
    useState("");

  const [departments, setDepartments] =
    useState<Department[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    loadDepartments();
  }, [isOpen]);

  async function loadDepartments() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "/api/departments",
        {
          cache: "no-store",
        }
      );

      const data =
        await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to load departments."
        );
      }

      /*
       * Support both:
       *
       *   [department, department]
       *
       * and:
       *
       *   { departments: [...] }
       *
       * so this modal remains compatible
       * with the existing API.
       */
      const list: Department[] =
        Array.isArray(data)
          ? data
          : Array.isArray(data?.departments)
            ? data.departments
            : [];

      setDepartments(list);

      if (list.length > 0) {
        setDepartmentId((current) => {
          if (
            current &&
            list.some(
              (department) =>
                String(department.id) ===
                current
            )
          ) {
            return current;
          }

          return String(list[0].id);
        });
      } else {
        setDepartmentId("");
      }
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
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setName("");
    setDescription("");
    setDepartmentId("");
    setError(null);
  }

  function handleClose() {
    if (saving) {
      return;
    }

    resetForm();
    onClose();
  }

  async function handleSave() {
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
        "/api/teams",
        {
          method: "POST",

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

      const data =
        await response.json().catch(
          () => null
        );

      if (!response.ok) {
        let message =
          "Failed to create team.";

        if (
          data?.message &&
          typeof data.message ===
            "string"
        ) {
          message = data.message;
        } else if (
          data?.error &&
          typeof data.error ===
            "string"
        ) {
          message = data.error;
        }

        if (
          message ===
            "TEAM_NAME_ALREADY_EXISTS" ||
          data?.code ===
            "TEAM_NAME_ALREADY_EXISTS"
        ) {
          message =
            `A team named "${trimmedName}" already exists in this organization. Please choose a different name.`;
        }

        throw new Error(message);
      }

      /*
       * The API should return Team directly.
       *
       * We also support { team: Team } in case
       * another API response wrapper is returned.
       */
      const createdTeam: Team | null =
        data &&
        typeof data === "object" &&
        data.team &&
        typeof data.team ===
          "object"
          ? data.team
          : data &&
              typeof data ===
                "object"
            ? data
            : null;

      /*
       * Never call onSave(undefined).
       *
       * This is the exact condition that caused:
       *
       * Cannot read properties of undefined
       * (reading 'id')
       */
      if (
        !createdTeam ||
        typeof createdTeam.id !==
          "number"
      ) {
        console.error(
          "Unexpected create-team response:",
          data
        );

        throw new Error(
          "Team was created, but the server returned an invalid team record. Please refresh the page."
        );
      }

      onSave(createdTeam);

      resetForm();
      onClose();
    } catch (error) {
      console.error(
        "Failed to create team:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create team."
      );
    } finally {
      setSaving(false);
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Add Team
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create a new organizational
              team.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Team Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="e.g. Sales Team"
              disabled={saving}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
            />
          </div>

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
              disabled={
                loading || saving
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 disabled:bg-slate-100"
            >
              <option value="">
                {loading
                  ? "Loading departments..."
                  : "Select department"}
              </option>

              {departments.map(
                (department) => (
                  <option
                    key={department.id}
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
              rows={3}
              placeholder="Describe the team..."
              disabled={saving}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
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
              loading ||
              saving
            }
            className="rounded-xl bg-blue-700 px-5 py-3 font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save Team"}
          </button>
        </div>
      </div>
    </div>
  );
}