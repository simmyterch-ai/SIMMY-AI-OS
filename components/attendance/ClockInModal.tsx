"use client";

import { useEffect, useState } from "react";
import type { User } from "@/lib/types/user";

type ClockInModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
};

export default function ClockInModal({
  isOpen,
  onClose,
  onSuccess,
}: ClockInModalProps) {
  const [users, setUsers] =
    useState<User[]>([]);

  const [userId, setUserId] =
    useState<number>(0);

  const [loading, setLoading] =
    useState(false);

  const [loadingUsers, setLoadingUsers] =
    useState(false);

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  // =====================================================
  // LOAD ACTIVE EMPLOYEES
  // =====================================================

  async function loadUsers() {
    try {
      setLoadingUsers(true);

      const response =
        await fetch("/api/users", {
          cache: "no-store",
        });

      if (!response.ok) {
        throw new Error(
          "Failed to load users."
        );
      }

      const data =
        await response.json();

      const activeUsers =
        Array.isArray(data)
          ? data.filter(
              (user: User) =>
                user.status === "Active"
            )
          : [];

      setUsers(activeUsers);

      if (activeUsers.length > 0) {
        setUserId(
          activeUsers[0].id
        );
      } else {
        setUserId(0);
      }
    } catch (error) {
      console.error(
        "Failed to load employees:",
        error
      );

      setUsers([]);
      setUserId(0);
    } finally {
      setLoadingUsers(false);
    }
  }

  // =====================================================
  // CLOCK IN
  // =====================================================

  async function handleClockIn() {
    if (!userId) {
      alert(
        "Please select an employee."
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await fetch(
          "/api/attendance",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              userId,
            }),
          }
        );

      // Safely handle JSON responses.
      // Prevents "Unexpected end of JSON input"
      // if the server returns an empty response.
      const contentType =
        response.headers.get(
          "content-type"
        );

      let data: any = null;

      if (
        contentType?.includes(
          "application/json"
        )
      ) {
        data =
          await response.json();
      } else {
        const text =
          await response.text();

        data = {
          error:
            text ||
            `Request failed with status ${response.status}.`,
        };
      }

      if (!response.ok) {
        alert(
          data?.error ??
            "Clock In failed."
        );
        return;
      }

      await onSuccess();

      onClose();
    } catch (error) {
      console.error(
        "Clock in error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to clock in."
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // MODAL
  // =====================================================

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

        {/* HEADER */}

        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-slate-800">
            Employee Clock In
          </h2>
        </div>

        {/* BODY */}

        <div className="space-y-6 p-6">

          {/* EMPLOYEE */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Employee
            </label>

            {loadingUsers ? (
              <div className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-500">
                Loading employees...
              </div>
            ) : users.length === 0 ? (
              <div className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-500">
                No active employees available.
              </div>
            ) : (
              <select
                value={userId}
                onChange={(e) =>
                  setUserId(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              >
                {users.map(
                  (user) => (
                    <option
                      key={user.id}
                      value={user.id}
                    >
                      {user.employeeId} -{" "}
                      {user.name}
                    </option>
                  )
                )}
              </select>
            )}
          </div>

          {/* CLOCK TIME */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Clock In Time
            </label>

            <input
              value={new Date().toLocaleString()}
              disabled
              readOnly
              className="w-full rounded-xl border bg-slate-100 p-3 text-slate-600"
            />

            <p className="mt-2 text-xs text-slate-500">
              The official clock-in time
              and attendance status are
              determined by the server.
            </p>
          </div>
        </div>

        {/* FOOTER */}

        <div className="flex justify-end gap-3 border-t bg-slate-50 px-6 py-4">

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-300 px-5 py-2 hover:bg-slate-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleClockIn}
            disabled={
              loading ||
              loadingUsers ||
              users.length === 0 ||
              !userId
            }
            className="rounded-xl bg-green-600 px-5 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading
              ? "Clocking In..."
              : "Clock In"}
          </button>

        </div>
      </div>
    </div>
  );
}