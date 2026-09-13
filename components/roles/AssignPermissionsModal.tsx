"use client";

import { useEffect, useState } from "react";

type Permission = {
  id: number;
  name: string;
  module: string;
};

type Role = {
  id: number;
  name: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  role: Role | null;
};

export default function AssignPermissionsModal({
  open,
  onClose,
  role,
}: Props) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!role || !open) return;

    loadPermissions();
  }, [role, open]);

  async function loadPermissions() {
    try {
      setLoading(true);

      const permissionResponse = await fetch("/api/permissions");
      const permissionResult = await permissionResponse.json();

      const assignedResponse = await fetch(
        `/api/roles/${role?.id}/permissions`
      );

      const assignedResult = await assignedResponse.json();

      setPermissions(permissionResult.permissions || []);
      setSelected(assignedResult.assigned || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load permissions.");
    } finally {
      setLoading(false);
    }
  }

  function togglePermission(id: number) {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  }

  async function savePermissions() {
    try {
      const response = await fetch(
        `/api/roles/${role?.id}/permissions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            permissionIds: selected,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message);
        return;
      }

      alert("Permissions updated successfully.");

      onClose();

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to save permissions.");
    }
  }

  if (!open || !role) return null;

  const grouped = permissions.reduce(
    (acc: Record<string, Permission[]>, permission) => {
      if (!acc[permission.module]) {
        acc[permission.module] = [];
      }

      acc[permission.module].push(permission);

      return acc;
    },
    {}
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b px-6 py-5">

          <div>

            <h2 className="text-2xl font-bold">
              Assign Permissions
            </h2>

            <p className="text-sm text-slate-500">
              {role.name}
            </p>

          </div>

          <button
            onClick={onClose}
            className="text-2xl"
          >
            ×
          </button>

        </div>

        <div className="space-y-8 p-6">

          {loading ? (
            <div>Loading...</div>
          ) : (
            Object.entries(grouped).map(
              ([module, modulePermissions]) => (
                <div key={module}>

                  <h3 className="mb-4 text-lg font-bold text-blue-700">
                    {module}
                  </h3>

                  <div className="grid grid-cols-2 gap-3">

                    {modulePermissions.map((permission) => (

                      <label
                        key={permission.id}
                        className="flex items-center gap-3 rounded-xl border p-3 hover:bg-slate-50"
                      >

                        <input
                          type="checkbox"
                          checked={selected.includes(permission.id)}
                          onChange={() =>
                            togglePermission(permission.id)
                          }
                        />

                        <span>{permission.name}</span>

                      </label>

                    ))}

                  </div>

                </div>
              )
            )
          )}

        </div>

        <div className="flex justify-end gap-3 border-t bg-slate-50 px-6 py-4">

          <button
            onClick={onClose}
            className="rounded-xl border px-5 py-2"
          >
            Cancel
          </button>

          <button
            onClick={savePermissions}
            className="rounded-xl bg-blue-700 px-5 py-2 text-white"
          >
            Save Permissions
          </button>

        </div>

      </div>

    </div>
  );
}