"use client";

import { useState } from "react";

import RoleTable from "@/components/roles/RoleTable";
import AddRoleModal from "@/components/roles/AddRoleModal";
import AssignPermissionsModal from "@/components/roles/AssignPermissionsModal";

type Role = {
  id: number;
  name: string;
  description?: string;
  isSystem?: boolean;
};

export default function RolesPage() {
  const [roleModalOpen, setRoleModalOpen] =
    useState(false);

  const [permissionModalOpen, setPermissionModalOpen] =
    useState(false);

  const [selectedRole, setSelectedRole] =
    useState<Role | null>(null);

  function handleCreate() {
    setSelectedRole(null);
    setRoleModalOpen(true);
  }

  function handleEdit(role: Role) {
    setSelectedRole(role);
    setRoleModalOpen(true);
  }

  function handlePermissions(role: Role) {
    setSelectedRole(role);
    setPermissionModalOpen(true);
  }

  return (
    <>
      <div className="space-y-8">

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold">
              Roles & Permissions
            </h1>

            <p className="mt-2 text-slate-500">
              Manage user roles and permissions.
            </p>

          </div>

          <button
            onClick={handleCreate}
            className="rounded-xl bg-blue-700 px-5 py-3 text-white hover:bg-blue-800"
          >
            + New Role
          </button>

        </div>

        <RoleTable
          onEdit={handleEdit}
          onPermissions={handlePermissions}
        />

      </div>

      <AddRoleModal
        open={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        role={selectedRole}
      />

      <AssignPermissionsModal
        open={permissionModalOpen}
        onClose={() =>
          setPermissionModalOpen(false)
        }
        role={selectedRole}
      />

    </>
  );
}