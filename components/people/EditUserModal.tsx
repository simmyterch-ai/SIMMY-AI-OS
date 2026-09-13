"use client";

import { useEffect, useState } from "react";
import type {
  User,
  Department,
  Team,
} from "@/lib/types/user";

type EditUserModalProps = {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (user: User) => void;
};

const emptyUser: User = {
  id: 0,
  employeeId: "",
  name: "",
  email: "",
  phone: "",
  location: "",
  avatar: "",
  role: "Employee",
  status: "Active",
  dateJoined: "",
  departmentId: 0,
  teamId: null,
  department: {
    id: 0,
    name: "",
    description: null,
  },
  team: null,
};

export default function EditUserModal({
  isOpen,
  user,
  onClose,
  onSave,
}: EditUserModalProps) {
  const [departments, setDepartments] =
    useState<Department[]>([]);

  const [teams, setTeams] =
    useState<Team[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [loadingOptions, setLoadingOptions] =
    useState(false);

  const [formData, setFormData] =
    useState<User>(emptyUser);

  useEffect(() => {
    if (!isOpen || !user) return;

    setFormData(user);

    loadOptions(user.departmentId);
  }, [isOpen, user]);

  async function loadOptions(
    selectedDepartmentId: number
  ) {
    try {
      setLoadingOptions(true);

      const [
        departmentsResponse,
        teamsResponse,
      ] = await Promise.all([
        fetch("/api/departments"),
        fetch("/api/teams"),
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

      const departmentsData =
        await departmentsResponse.json();

      const teamsData =
        await teamsResponse.json();

      setDepartments(departmentsData);
      setTeams(teamsData);

      setFormData((prev) => {
        const validTeams =
          teamsData.filter(
            (team: Team) =>
              team.departmentId ===
              selectedDepartmentId
          );

        const currentTeamStillValid =
          prev.teamId !== null &&
          validTeams.some(
            (team: Team) =>
              team.id === prev.teamId
          );

        return {
          ...prev,
          teamId: currentTeamStillValid
            ? prev.teamId
            : validTeams[0]?.id ?? null,
        };
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingOptions(false);
    }
  }

  const filteredTeams = teams.filter(
    (team) =>
      team.departmentId ===
      formData.departmentId
  );

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;

    if (name === "departmentId") {
      const departmentId = Number(value);

      const departmentTeams = teams.filter(
        (team) =>
          team.departmentId ===
          departmentId
      );

      setFormData((prev) => ({
        ...prev,
        departmentId,
        teamId:
          departmentTeams[0]?.id ?? null,
      }));

      return;
    }

    if (name === "teamId") {
      setFormData((prev) => ({
        ...prev,
        teamId: value
          ? Number(value)
          : null,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

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

    if (
      !(formData.phone ?? "").trim()
    ) {
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

      const response = await fetch(
        `/api/users/${formData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone:
              formData.phone?.trim() ||
              null,
            location:
              formData.location?.trim() ||
              null,
            avatar:
              formData.avatar || null,
            role: formData.role,
            status: formData.status,
            departmentId:
              formData.departmentId,
            teamId:
              formData.teamId ?? null,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Failed to update user."
        );
      }

      onSave(data);

      onClose();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update user."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen || !user) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b p-6">

          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              ✏️ Edit User
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update employee information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-2xl text-slate-500 hover:text-red-500 disabled:opacity-50"
          >
            ×
          </button>

        </div>

        {/* FORM */}

        <div className="max-h-[75vh] overflow-y-auto p-8">

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* NAME */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Full Name
              </label>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border p-3 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* EMAIL */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Email
              </label>

              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border p-3 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* PHONE */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Phone Number
              </label>

              <input
                name="phone"
                value={formData.phone ?? ""}
                onChange={handleChange}
                className="w-full rounded-xl border p-3 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* LOCATION */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Office Location
              </label>

              <input
                name="location"
                value={
                  formData.location ?? ""
                }
                onChange={handleChange}
                className="w-full rounded-xl border p-3 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* DEPARTMENT */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Department
              </label>

              <select
                name="departmentId"
                value={
                  formData.departmentId
                }
                onChange={handleChange}
                disabled={
                  loadingOptions ||
                  departments.length === 0
                }
                className="w-full rounded-xl border p-3 disabled:bg-slate-100"
              >
                {departments.map(
                  (department) => (
                    <option
                      key={department.id}
                      value={department.id}
                    >
                      {department.name}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* TEAM */}

            <div>
              <label className="mb-2 block text-sm font-medium">
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
                className="w-full rounded-xl border p-3 disabled:bg-slate-100"
              >
                <option value="">
                  No Team
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

            {/* ROLE */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Role
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              >
                <option value="Founder">
                  Founder
                </option>

                <option value="Administrator">
                  Administrator
                </option>

                <option value="Manager">
                  Manager
                </option>

                <option value="Employee">
                  Employee
                </option>
              </select>
            </div>

            {/* STATUS */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
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

            {/* EMPLOYEE ID */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Employee ID
              </label>

              <input
                value={
                  formData.employeeId
                }
                disabled
                className="w-full rounded-xl border bg-slate-100 p-3 text-slate-500"
              />
            </div>

            {/* DATE JOINED */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Date Joined
              </label>

              <input
                value={
                  formData.dateJoined
                    ? new Date(
                        formData.dateJoined
                      ).toLocaleDateString()
                    : "-"
                }
                disabled
                className="w-full rounded-xl border bg-slate-100 p-3 text-slate-500"
              />
            </div>

          </div>
        </div>

        {/* FOOTER */}

        <div className="flex justify-end gap-3 border-t bg-slate-50 p-6">

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border px-6 py-3 font-medium hover:bg-slate-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={
              loading ||
              loadingOptions ||
              !formData.departmentId
            }
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : "💾 Save Changes"}
          </button>

        </div>

      </div>
    </div>
  );
}