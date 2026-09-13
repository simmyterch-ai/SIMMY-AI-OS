"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Shield, KeyRound } from "lucide-react";

type Role = {
  id: number;
  name: string;
  description?: string;
  isSystem: boolean;
  permissions: {
    permission: {
      id: number;
      name: string;
    };
  }[];
};

type Props = {
  onEdit: (role: Role) => void;
  onPermissions: (role: Role) => void;
};

export default function RoleTable({
  onEdit,
  onPermissions,
}: Props) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoles();
  }, []);

  async function loadRoles() {
    try {
      const response = await fetch("/api/roles");
      const result = await response.json();

      if (result.success) {
        setRoles(result.roles);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteRole(id: number) {
    if (!confirm("Delete this role?")) return;

    try {
      const response = await fetch(`/api/roles/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        loadRoles();
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center">
        Loading roles...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full">
        <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-6 py-4 text-left">Role</th>
            <th className="px-6 py-4 text-left">Description</th>
            <th className="px-6 py-4 text-center">Permissions</th>
            <th className="px-6 py-4 text-center">Type</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {roles.length > 0 ? (
            roles.map((role) => (
              <tr
                key={role.id}
                className="border-t transition hover:bg-blue-50"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                      <Shield className="h-6 w-6" />
                    </div>

                    <div>
                      <p className="font-semibold text-slate-800">
                        {role.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        Role ID #{role.id}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5">
                  {role.description || "-"}
                </td>

                <td className="px-6 py-5 text-center">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                    {role.permissions.length}
                  </span>
                </td>

                <td className="px-6 py-5 text-center">
                  {role.isSystem ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      System
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      Custom
                    </span>
                  )}
                </td>

                <td className="px-6 py-5">
  <div className="flex justify-center gap-2">

    <button
      onClick={() => onPermissions(role)}
      className="rounded-lg bg-amber-100 p-2 text-amber-700 hover:bg-amber-200"
      title="Assign Permissions"
    >
      <KeyRound className="h-4 w-4" />
    </button>

    <button
      onClick={() => onEdit(role)}
      className="rounded-lg bg-blue-100 p-2 text-blue-700 hover:bg-blue-200"
      title="Edit"
    >
      <Pencil className="h-4 w-4" />
    </button>

    <button
      onClick={() => deleteRole(role.id)}
      disabled={role.isSystem}
      className="rounded-lg bg-red-100 p-2 text-red-700 hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
      title="Delete"
    >
      <Trash2 className="h-4 w-4" />
    </button>

  </div>
</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-20 text-center">
                <div className="text-7xl">🛡️</div>

                <h3 className="mt-5 text-2xl font-bold">
                  No roles found
                </h3>

                <p className="mt-3 text-slate-500">
                  Click <strong>New Role</strong> to create your first role.
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}