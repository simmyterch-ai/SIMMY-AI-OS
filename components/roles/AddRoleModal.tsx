"use client";

import { useEffect, useState } from "react";

type Role = {
  id?: number;
  name: string;
  description?: string;
  isSystem?: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  role?: Role | null;
};

export default function AddRoleModal({
  open,
  onClose,
  role,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (role) {
      setName(role.name);
      setDescription(role.description ?? "");
    } else {
      setName("");
      setDescription("");
    }
  }, [role]);

  if (!open) return null;

  async function handleSave() {
    if (!name.trim()) {
      alert("Role name is required.");
      return;
    }

    try {
      const response = await fetch(
        role ? `/api/roles/${role.id}` : "/api/roles",
        {
          method: role ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description,
            isSystem: false,
            permissionIds: [],
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Failed to save role.");
        return;
      }

      alert(
        role
          ? "Role updated successfully."
          : "Role created successfully."
      );

      onClose();

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to save role.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-2xl font-bold">
            {role ? "Edit Role" : "New Role"}
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-slate-500 hover:text-red-500"
          >
            ×
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Role Name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border p-3 focus:border-blue-600 focus:outline-none"
              placeholder="HR Manager"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border p-3 focus:border-blue-600 focus:outline-none"
              placeholder="Describe this role..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t bg-slate-50 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-2"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="rounded-xl bg-blue-700 px-5 py-2 text-white transition hover:bg-blue-800"
          >
            {role ? "Update Role" : "Create Role"}
          </button>
        </div>
      </div>
    </div>
  );
}