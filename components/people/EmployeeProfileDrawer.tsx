"use client";

import type { EmployeeProfile } from "@/lib/types/user";

type EmployeeProfileDrawerProps = {
  isOpen: boolean;
  user: EmployeeProfile | null;
  loading: boolean;
  onClose: () => void;
};

export default function EmployeeProfileDrawer({
  isOpen,
  user,
  loading,
  onClose,
}: EmployeeProfileDrawerProps) {
  if (!isOpen) {
    return null;
  }

  const initials = user
    ? user.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "";

  const roleIcon = user
    ? user.role === "Founder"
      ? "👑"
      : user.role === "Administrator"
      ? "🛡️"
      : user.role === "Manager"
      ? "💼"
      : "👤"
    : "👤";

  const statusColor = user
    ? user.status === "Active"
      ? "bg-green-100 text-green-700"
      : user.status === "Inactive"
      ? "bg-red-100 text-red-700"
      : user.status === "Pending"
      ? "bg-amber-100 text-amber-700"
      : "bg-slate-200 text-slate-700"
    : "bg-slate-100 text-slate-700";

  return (
    <>
      {/* BACKDROP */}

      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
      />

      {/* DRAWER */}

      <div className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col bg-white shadow-2xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Employee Profile
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Employee information
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-3xl text-slate-400 transition hover:text-red-500"
            aria-label="Close profile"
          >
            ×
          </button>
        </div>

        {/* CONTENT */}

        {loading ? (
          <div className="flex flex-1 items-center justify-center p-8">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="text-sm text-slate-500">
                Loading employee profile...
              </p>
            </div>
          </div>
        ) : !user ? (
          <div className="flex flex-1 items-center justify-center p-8">
            <div className="text-center">
              <div className="text-5xl">
                👤
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-700">
                Employee profile unavailable
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                We could not load this employee's information.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* PROFILE HEADER */}

            <div className="border-b p-8 text-center">

              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-3xl font-bold text-white shadow-lg">
                {initials}
              </div>

              <h2 className="mt-5 text-2xl font-bold text-slate-800">
                {user.name}
              </h2>

              <p className="mt-2 text-slate-500">
                {roleIcon} {user.role}
              </p>

              <span
                className={`mt-4 inline-block rounded-full px-4 py-1 text-sm font-semibold ${statusColor}`}
              >
                {user.status}
              </span>
            </div>

            {/* DETAILS */}

            <div className="flex-1 space-y-6 overflow-y-auto p-8">

              {/* EMPLOYEE ID */}

              <ProfileItem
                label="Employee ID"
                value={user.employeeId}
                icon="🆔"
              />

              {/* EMAIL */}

              <ProfileItem
                label="Email"
                value={user.email}
                icon="📧"
              />

              {/* PHONE */}

              <ProfileItem
                label="Phone"
                value={user.phone ?? "-"}
                icon="📞"
              />

              {/* LOCATION */}

              <ProfileItem
                label="Office Location"
                value={user.location ?? "-"}
                icon="📍"
              />

              {/* DEPARTMENT */}

              <ProfileItem
                label="Department"
                value={user.department?.name ?? "-"}
                icon="🏢"
              />

              {/* TEAM */}

              <ProfileItem
                label="Team"
                value={user.team?.name ?? "-"}
                icon="👥"
              />

              {/* ROLE */}

              <ProfileItem
                label="Role"
                value={user.role}
                icon={roleIcon}
              />

              {/* DATE JOINED */}

              <ProfileItem
                label="Date Joined"
                value={
                  user.dateJoined
                    ? new Date(
                        user.dateJoined
                      ).toLocaleDateString()
                    : "-"
                }
                icon="📅"
              />

              {/* CREATED AT */}

              <ProfileItem
                label="Created At"
                value={
                  user.createdAt
                    ? new Date(
                        user.createdAt
                      ).toLocaleString()
                    : "-"
                }
                icon="🕐"
              />

              {/* LAST UPDATED */}

              <ProfileItem
                label="Last Updated"
                value={
                  user.updatedAt
                    ? new Date(
                        user.updatedAt
                      ).toLocaleString()
                    : "-"
                }
                icon="🔄"
              />

            </div>

            {/* FOOTER */}

            <div className="border-t bg-slate-50 p-6">

              <button
                onClick={onClose}
                className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Close Profile
              </button>

            </div>
          </>
        )}
      </div>
    </>
  );
}

// =====================================================
// PROFILE ITEM
// =====================================================

type ProfileItemProps = {
  label: string;
  value: string;
  icon: string;
};

function ProfileItem({
  label,
  value,
  icon,
}: ProfileItemProps) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 font-medium text-slate-800">
        {icon} {value}
      </p>
    </div>
  );
}