"use client";

import { useState } from "react";
import type { User } from "../../lib/types/user";
import PeopleToolbar from "./PeopleToolbar";
import Badge from "../ui/Badge";

type PeopleTableProps = {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onView: (user: User) => void;
};

export default function PeopleTable({
  users,
  onEdit,
  onDelete,
  onView,
}: PeopleTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
  user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  user.department?.name
    .toLowerCase()
    .includes(searchTerm.toLowerCase()) ||
  user.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      selectedRole === "All Roles" || user.role === selectedRole;

    const matchesStatus =
      selectedStatus === "All Status" ||
      user.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

  const avatarColors = [
    "from-blue-600 to-indigo-600",
    "from-purple-600 to-pink-600",
    "from-emerald-600 to-green-600",
    "from-orange-500 to-red-500",
    "from-cyan-600 to-blue-500",
  ];

  const getAvatarColor = (id: number) =>
    avatarColors[id % avatarColors.length];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Founder":
        return "👑 Founder";
      case "Administrator":
        return "🛡 Administrator";
      case "Manager":
        return "💼 Manager";
      default:
        return "👤 Employee";
    }
  };

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {filteredUsers.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-700">
            {users.length}
          </span>{" "}
          employees
        </p>

        <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold text-blue-700">
          HR Module
        </span>
      </div>

      <PeopleToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-4 text-left">Employee</th>
              <th className="px-6 py-4 text-left">Contact</th>
              <th className="px-6 py-4 text-left">Department</th>
              <th className="px-6 py-4 text-left">Position</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-t transition-all duration-200 hover:bg-blue-50"
                >
                  <td className="px-6 py-5">
                    <button
                      onClick={() => onView(user)}
                      className="flex items-center gap-4 text-left transition hover:scale-[1.02]"
                    >
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r ${getAvatarColor(
                          user.id
                        )} font-bold text-white shadow`}
                      >
                        {getInitials(user.name)}
                      </div>

                      <div>
                        <p className="text-base font-semibold text-slate-800 hover:text-blue-600">
                          {user.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {getRoleBadge(user.role)}
                        </p>
                      </div>
                    </button>
                  </td>

                  <td className="px-6 py-5">
                    📧 {user.email}
                  </td>

                  <td className="px-6 py-5">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                      {user.department?.name}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    {getRoleBadge(user.role)}
                  </td>

                  <td className="px-6 py-5">
                   
                   {user.status === "Active" && (
  <Badge variant="success">
    {user.status}
  </Badge>
)}

{user.status === "Inactive" && (
  <Badge variant="danger">
    {user.status}
  </Badge>
)}

{user.status === "Pending" && (
  <Badge variant="warning">
    {user.status}
  </Badge>
)}

{user.status === "Suspended" && (
  <Badge variant="neutral">
    {user.status}
  </Badge>
)}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(user)}
                        className="rounded-lg bg-blue-100 px-3 py-2 text-blue-700 hover:bg-blue-200"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() => onDelete(user)}
                        className="rounded-lg bg-red-100 px-3 py-2 text-red-700 hover:bg-red-200"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <div className="text-7xl">👥</div>

                  <h3 className="mt-5 text-2xl font-bold">
                    No employees found
                  </h3>

                  <p className="mt-3 text-slate-500">
                    Click Add User to create your first employee.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}