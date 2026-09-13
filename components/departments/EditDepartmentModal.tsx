"use client";

import { useEffect, useState } from "react";
import type { Department } from "@/lib/types/department";

type EditDepartmentModalProps = {
  isOpen: boolean;
  department: Department | null;
  onClose: () => void;
  onSave: (department: Department) => void;
};

export default function EditDepartmentModal({
  isOpen,
  department,
  onClose,
  onSave,
}: EditDepartmentModalProps) {
  const [name, setName] = useState("");
  const [manager, setManager] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] =
    useState<Department["status"]>("Active");

  useEffect(() => {
    if (!department) {
      return;
    }

    setName(department.name);
    setManager(department.manager ?? "");
    setLocation(department.location ?? "");
    setDescription(department.description ?? "");
    setStatus(department.status);
  }, [department]);

  if (!isOpen || !department) {
    return null;
  }

  const handleSave = () => {
    if (!name.trim()) {
      return;
    }

    onSave({
      ...department,
      name: name.trim(),
      manager: manager.trim() || null,
      location: location.trim() || null,
      description: description.trim() || null,
      status,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Edit Department
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update department information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100"
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
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Manager
            </label>

            <input
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Location
            </label>

            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!name.trim()}
            className="rounded-xl bg-blue-700 px-5 py-3 font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}