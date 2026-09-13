"use client";

import { useState } from "react";
import type { Department } from "@/lib/types/department";

type AddDepartmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (department: Department) => void;
};

export default function AddDepartmentModal({
  isOpen,
  onClose,
  onSave,
}: AddDepartmentModalProps) {
  const [name, setName] = useState("");
  const [manager, setManager] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] =
    useState<Department["status"]>("Active");

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(
    null
  );

  if (!isOpen) {
    return null;
  }

  const resetForm = () => {
    setName("");
    setManager("");
    setLocation("");
    setDescription("");
    setStatus("Active");
    setError(null);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const response = await fetch(
        "/api/departments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: name.trim(),
            manager: manager.trim() || null,
            location: location.trim() || null,
            description:
              description.trim() || null,
            status,
          }),
        }
      );

      const data = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to create department."
        );
      }

      onSave(data);

      resetForm();
      onClose();
    } catch (error) {
      console.error(
        "Failed to create department:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create department."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Add Department
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create a new organizational department.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Department Name
            </label>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="e.g. Operations"
              disabled={isSaving}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Manager
            </label>

            <input
              value={manager}
              onChange={(e) =>
                setManager(e.target.value)
              }
              placeholder="Department manager"
              disabled={isSaving}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Location
            </label>

            <input
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
              placeholder="e.g. Casablanca, Morocco"
              disabled={isSaving}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Describe the department..."
              rows={3}
              disabled={isSaving}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as Department["status"]
                )
              }
              disabled={isSaving}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 disabled:bg-slate-100"
            >
              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={
              !name.trim() || isSaving
            }
            className="rounded-xl bg-blue-700 px-5 py-3 font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving
              ? "Saving..."
              : "Save Department"}
          </button>
        </div>
      </div>
    </div>
  );
}