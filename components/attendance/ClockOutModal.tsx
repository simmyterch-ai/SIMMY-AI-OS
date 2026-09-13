"use client";

import { useState } from "react";
import type { Attendance } from "@/lib/types/attendance";

type ClockOutModalProps = {
  isOpen: boolean;
  attendance: Attendance | null;
  onClose: () => void;
  onSuccess: () => Promise<void>;
};

export default function ClockOutModal({
  isOpen,
  attendance,
  onClose,
  onSuccess,
}: ClockOutModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !attendance) return null;

  async function handleClockOut() {
  if (!attendance) return;

  try {
    setLoading(true);

    const response = await fetch(
      "/api/attendance/clock-out",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          attendanceId: attendance.id,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.error ?? "Clock Out failed.");
      return;
    }

    await onSuccess();

    onClose();

  } catch (error) {
    console.error(error);
    alert("Failed to clock out.");
  } finally {
    setLoading(false);
  }
}
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

        <div className="border-b px-6 py-4">

          <h2 className="text-xl font-semibold text-slate-800">
            Employee Clock Out
          </h2>

        </div>

        <div className="space-y-6 p-6">

          <div>

            <label className="mb-2 block text-sm font-medium">
              Employee
            </label>

            <input
              value={attendance.user.name}
              disabled
              className="w-full rounded-xl border bg-slate-100 p-3 text-slate-700"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Employee ID
            </label>

            <input
              value={attendance.user.employeeId}
              disabled
              className="w-full rounded-xl border bg-slate-100 p-3 text-slate-700"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Clock In
            </label>

            <input
              value={
                attendance.clockIn
                  ? new Date(
                      attendance.clockIn
                    ).toLocaleString()
                  : "-"
              }
              disabled
              className="w-full rounded-xl border bg-slate-100 p-3 text-slate-700"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Clock Out Time
            </label>

            <input
              value={new Date().toLocaleString()}
              disabled
              className="w-full rounded-xl border bg-slate-100 p-3 text-slate-700"
            />

          </div>

          <div className="rounded-xl bg-blue-50 p-4">

            <p className="text-sm text-blue-700">

              SAP will automatically calculate
              today's working hours after clocking out.

            </p>

          </div>

        </div>

        <div className="flex justify-end gap-3 border-t bg-slate-50 px-6 py-4">

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-2 hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={handleClockOut}
            disabled={loading}
            className="rounded-xl bg-red-600 px-5 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading
              ? "Clocking Out..."
              : "Clock Out"}
          </button>

        </div>

      </div>

    </div>
  );
}