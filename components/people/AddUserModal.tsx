"use client";

import { useEffect, useState } from "react";

import type {
  Department,
  Team,
} from "@/lib/types/user";

type AddUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => Promise<void>;
};

type FormData = {
  name: string;
  email: string;
  phone: string;
  location: string;
  departmentId: number;
  teamId: number | null;
  role: string;
  status: string;
};

export default function AddUserModal({
  isOpen,
  onClose,
  onSave,
}: AddUserModalProps) {
  const [departments, setDepartments] =
    useState<Department[]>([]);

  const [teams, setTeams] =
    useState<Team[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [loadingOptions, setLoadingOptions] =
    useState(false);

  const [formData, setFormData] =
    useState<FormData>({
      name: "",
      email: "",
      phone: "",
      location: "Casablanca, Morocco",
      departmentId: 0,
      teamId: null,
      role: "Employee",
      status: "Active",
    });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    loadOptions();
  }, [isOpen]);

  // =====================================================
  // LOAD DEPARTMENTS + TEAMS
  // =====================================================

  async function loadOptions() {
    try {
      setLoadingOptions(true);

      const [
        departmentsResponse,
        teamsResponse,
      ] = await Promise.all([
        fetch("/api/departments", {
          cache: "no-store",
        }),

        fetch("/api/teams", {
          cache: "no-store",
        }),
      ]);

      if (!departmentsResponse.ok) {
        throw new Error(
          "Failed to load departments."
        );
      }

      if (!teamsResponse.ok) {
        throw new Error(
          "Failed to load teams."
        );
      }

      const departmentsJson =
        await departmentsResponse.json();

      const teamsJson =
        await teamsResponse.json();

      // =================================================
      // NORMALIZE API RESPONSES
      //
      // Departments API may return either:
      //   Department[]
      // or:
      //   { departments: Department[] }
      //
      // Teams API currently returns:
      //   Team[]
      //
      // We support both forms safely.
      // =================================================

      const departmentsData: Department[] =
        Array.isArray(departmentsJson)
          ? departmentsJson
          : Array.isArray(
                departmentsJson?.departments
              )
            ? departmentsJson.departments
            : [];

      const teamsData: Team[] =
        Array.isArray(teamsJson)
          ? teamsJson
          : Array.isArray(
                teamsJson?.teams
              )
            ? teamsJson.teams
            : [];

      setDepartments(
        departmentsData
      );

      setTeams(teamsData);

      // =================================================
      // DEFAULT DEPARTMENT
      // =================================================

      const firstDepartment =
        departmentsData[0] ?? null;

      // =================================================
      // DEFAULT TEAM FOR FIRST DEPARTMENT
      // =================================================

      const departmentTeams =
        firstDepartment
          ? teamsData.filter(
              (team) =>
                Number(
                  team.departmentId
                ) ===
                Number(
                  firstDepartment.id
                )
            )
          : [];

      setFormData((previous) => ({
        ...previous,

        departmentId:
          firstDepartment?.id ?? 0,

        teamId:
          departmentTeams[0]?.id ??
          null,
      }));
    } catch (error) {
      console.error(
        "Failed to load employee options:",
        error
      );

      setDepartments([]);
      setTeams([]);

      setFormData((previous) => ({
        ...previous,
        departmentId: 0,
        teamId: null,
      }));
    } finally {
      setLoadingOptions(false);
    }
  }

  // =====================================================
  // TEAMS FILTERED BY SELECTED DEPARTMENT
  // =====================================================

  const filteredTeams =
    Array.isArray(teams)
      ? teams.filter(
          (team) =>
            Number(
              team.departmentId
            ) ===
            Number(
              formData.departmentId
            )
        )
      : [];

  // =====================================================
  // HANDLE FORM CHANGES
  // =====================================================

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) {
    const {
      name,
      value,
    } = e.target;

    // -----------------------------------------------
    // Department changed
    // -----------------------------------------------

    if (
      name === "departmentId"
    ) {
      const departmentId =
        Number(value);

      const departmentTeams =
        Array.isArray(teams)
          ? teams.filter(
              (team) =>
                Number(
                  team.departmentId
                ) === departmentId
            )
          : [];

      setFormData((previous) => ({
        ...previous,

        departmentId,

        // Automatically select the first
        // team belonging to the department.
        teamId:
          departmentTeams[0]?.id ??
          null,
      }));

      return;
    }

    // -----------------------------------------------
    // Team changed
    // -----------------------------------------------

    if (name === "teamId") {
      setFormData((previous) => ({
        ...previous,

        teamId:
          value !== ""
            ? Number(value)
            : null,
      }));

      return;
    }

    // -----------------------------------------------
    // Normal field
    // -----------------------------------------------

    setFormData((previous) => ({
      ...previous,

      [name]: value,
    }));
  }

  // =====================================================
  // SAVE EMPLOYEE
  // =====================================================

  async function handleSave() {
    if (!formData.name.trim()) {
      alert(
        "Please enter the employee's name."
      );

      return;
    }

    if (!formData.email.trim()) {
      alert(
        "Please enter an email address."
      );

      return;
    }

    if (!formData.phone.trim()) {
      alert(
        "Please enter a phone number."
      );

      return;
    }

    if (!formData.departmentId) {
      alert(
        "Please select a department."
      );

      return;
    }

    try {
      setLoading(true);

      const response =
        await fetch(
          "/api/users",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name:
                formData.name.trim(),

              email:
                formData.email.trim(),

              phone:
                formData.phone.trim(),

              location:
                formData.location.trim() ||
                null,

              role:
                formData.role,

              status:
                formData.status,

              departmentId:
                formData.departmentId,

              teamId:
                formData.teamId,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ??
            data?.message ??
            "Failed to create employee."
        );
      }

      await onSave();

      // Reset form after successful save.
      setFormData({
        name: "",
        email: "",
        phone: "",
        location:
          "Casablanca, Morocco",
        departmentId:
          departments[0]?.id ?? 0,
        teamId: null,
        role: "Employee",
        status: "Active",
      });

      onClose();
    } catch (error) {
      console.error(
        "Failed to create employee:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to create employee."
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // CLOSED
  // =====================================================

  if (!isOpen) {
    return null;
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-slate-800">
            Add New Employee
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-2xl text-slate-500 hover:text-slate-700 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* =================================================
            FORM BODY
        ================================================= */}

        <div className="max-h-[75vh] space-y-5 overflow-y-auto p-6">

          {/* Full Name */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter employee name"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Email */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Phone + Location */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Phone Number
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Office Location
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
              />
            </div>

          </div>

          {/* Department */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Department
            </label>

            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              disabled={
                loadingOptions ||
                departments.length === 0
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none disabled:bg-slate-100"
            >
              {departments.length === 0 ? (
                <option value={0}>
                  {loadingOptions
                    ? "Loading departments..."
                    : "No departments available"}
                </option>
              ) : (
                departments.map(
                  (department) => (
                    <option
                      key={
                        department.id
                      }
                      value={
                        department.id
                      }
                    >
                      {
                        department.name
                      }
                    </option>
                  )
                )
              )}
            </select>
          </div>

          {/* Team */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Team
            </label>

            <select
              name="teamId"
              value={
                formData.teamId ?? ""
              }
              onChange={handleChange}
              disabled={
                loadingOptions ||
                filteredTeams.length === 0
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none disabled:bg-slate-100"
            >
              <option value="">
                {loadingOptions
                  ? "Loading teams..."
                  : filteredTeams.length === 0
                    ? "No team available"
                    : "Select a team"}
              </option>

              {filteredTeams.map(
                (team) => (
                  <option
                    key={team.id}
                    value={team.id}
                  >
                    {team.name}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Role + Status */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Role
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none"
              >
                <option value="Employee">
                  Employee
                </option>

                <option value="Administrator">
                  Administrator
                </option>

                <option value="Manager">
                  Manager
                </option>

                <option value="Founder">
                  Founder
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none"
              >
                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Suspended">
                  Suspended
                </option>
              </select>
            </div>

          </div>

        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="flex justify-end gap-3 border-t bg-slate-50 px-6 py-4">

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-300 px-5 py-2 font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={
              loading ||
              loadingOptions ||
              departments.length === 0 ||
              !formData.departmentId
            }
            className="rounded-xl bg-blue-700 px-5 py-2 font-medium text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : "Save Employee"}
          </button>

        </div>
      </div>
    </div>
  );
}