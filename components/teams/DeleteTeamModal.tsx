"use client";

import { useState } from "react";

import type { Team } from "@/lib/types/team";

type DeleteTeamModalProps = {
  isOpen: boolean;
  team: Team | null;
  onClose: () => void;
  onDeleted: (teamId: number) => void;
};

export default function DeleteTeamModal({
  isOpen,
  team,
  onClose,
  onDeleted,
}: DeleteTeamModalProps) {
  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  if (!isOpen || !team) {
    return null;
  }

  async function handleDelete() {
    if (!team) {
      return;
    }

    try {
      setDeleting(true);
      setError(null);

      const response = await fetch(
        `/api/teams/${team.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data =
        await response.json().catch(
          () => null
        );

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to delete team."
        );
      }

      onDeleted(team.id);
      onClose();
    } catch (error) {
      console.error(
        "Failed to delete team:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete team."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl">
          🗑️
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-800">
          Delete Team
        </h2>

        <p className="mt-2 text-slate-600">
          Are you sure you want to delete{" "}
          <strong>{team.name}</strong>?
        </p>

        <p className="mt-2 text-sm text-slate-500">
          This action cannot be undone.
        </p>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-xl bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting
              ? "Deleting..."
              : "Delete Team"}
          </button>
        </div>
      </div>
    </div>
  );
}