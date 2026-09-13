"use client";

import { useState } from "react";
import type { Department } from "@/lib/types/department";

type DepartmentTableProps = {
  departments: Department[];
  onEdit: (department: Department) => void;
  onDelete: (department: Department) => void;
  onView: (department: Department) => void;
};

export default function DepartmentTable({
  departments,
  onEdit,
  onDelete,
  onView,
}: DepartmentTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const filteredDepartments = departments.filter((department) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      department.name.toLowerCase().includes(search) ||
      (department.manager ?? "").toLowerCase().includes(search) ||
      (department.location ?? "").toLowerCase().includes(search) ||
      (department.departmentId ?? "").toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "All Status" ||
      department.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (
    status: Department["status"]
  ) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";

      case "Inactive":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {filteredDepartments.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-700">
            {departments.length}
          </span>{" "}
          departments
        </p>

        <span className="rounded-full bg-indigo-100 px-4 py-2 text-xs font-semibold text-indigo-700">
          Organization Module
        </span>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <input
          type="text"
          placeholder="Search departments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3"
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-4 text-left">
                Department
              </th>
              <th className="px-6 py-4 text-left">
                Manager
              </th>
              <th className="px-6 py-4 text-center">
                Employees
              </th>
              <th className="px-6 py-4 text-left">
                Location
              </th>
              <th className="px-6 py-4 text-left">
                Status
              </th>
              <th className="px-6 py-4 text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredDepartments.length > 0 ? (
              filteredDepartments.map((department) => (
                <tr
                  key={department.id}
                  className="border-t transition hover:bg-blue-50"
                >
                  <td className="px-6 py-5">
                    <button
                      type="button"
                      onClick={() => onView(department)}
                      className="flex items-center gap-4 text-left"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-white shadow">
                        🏢
                      </div>

                      <div>
                        <p className="font-semibold text-slate-800 hover:text-blue-600">
                          {department.name}
                        </p>

                        <p className="text-xs text-slate-500">
                          {department.departmentId ??
                            "No ID assigned"}
                        </p>
                      </div>
                    </button>
                  </td>

                  <td className="px-6 py-5">
                    👤 {department.manager ?? "Not assigned"}
                  </td>

                  <td className="px-6 py-5 text-center">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                      {department.employeeCount}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    📍 {department.location ?? "Not specified"}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(
                        department.status
                      )}`}
                    >
                      {department.status}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onEdit(department)
                        }
                        className="rounded-lg bg-blue-100 px-3 py-2 text-blue-700 hover:bg-blue-200"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onDelete(department)
                        }
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
                <td
                  colSpan={6}
                  className="py-20 text-center"
                >
                  <div className="text-7xl">🏢</div>

                  <h3 className="mt-5 text-2xl font-bold">
                    No departments found
                  </h3>

                  <p className="mt-3 text-slate-500">
                    Try another search term or status
                    filter.
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