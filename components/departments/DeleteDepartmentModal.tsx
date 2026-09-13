"use client";

import type { Department } from "@/lib/types/department";

type DeleteDepartmentModalProps = {
  isOpen: boolean;
  department: Department | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
};

export default function DeleteDepartmentModal({
  isOpen,
  department,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteDepartmentModalProps) {
  if (!isOpen || !department) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Delete Department
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              This action cannot be undone.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {/* Warning */}
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex gap-3">
            <div className="text-2xl">⚠️</div>

            <div>
              <p className="font-semibold text-red-800">
                Are you sure you want to delete this department?
              </p>

              <p className="mt-2 text-sm text-red-700">
                You are about to permanently delete:
              </p>

              <p className="mt-2 font-bold text-red-900">
                {department.name}
              </p>

              {department.departmentId && (
                <p className="mt-1 text-xs text-red-600">
                  {department.departmentId}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Department information */}
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">
                Manager
              </p>

              <p className="mt-1 font-medium text-slate-800">
                {department.manager || "Not assigned"}
              </p>
            </div>

            <div>
              <p className="text-slate-500">
                Employees
              </p>

              <p className="mt-1 font-medium text-slate-800">
                {department.employeeCount}
              </p>
            </div>

            <div className="col-span-2">
              <p className="text-slate-500">
                Location
              </p>

              <p className="mt-1 font-medium text-slate-800">
                {department.location || "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-xl bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete Department"}
          </button>
        </div>
      </div>
    </div>
  );
}