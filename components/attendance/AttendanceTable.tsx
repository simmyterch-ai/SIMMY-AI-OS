"use client";

import type { Attendance } from "@/lib/types/attendance";

type AttendanceTableProps = {
  attendance: Attendance[];
  onClockOut: (attendance: Attendance) => void;
};

export default function AttendanceTable({
  attendance,
  onClockOut,
}: AttendanceTableProps) {
  if (attendance.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <div className="text-6xl">📅</div>

        <h2 className="mt-5 text-xl font-semibold text-slate-700">
          No Attendance Records
        </h2>

        <p className="mt-2 text-slate-500">
          Employees have not clocked in yet.
        </p>
      </div>
    );
  }

  function statusColor(status: string) {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-700";

      case "Late":
        return "bg-yellow-100 text-yellow-700";

      case "Absent":
        return "bg-red-100 text-red-700";

      case "On Leave":
        return "bg-blue-100 text-blue-700";

      case "Half Day":
        return "bg-orange-100 text-orange-700";

      case "Remote":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      <table className="min-w-full">

        <thead className="bg-slate-50">

          <tr>

            <th className="px-6 py-4 text-left">Employee</th>

            <th className="px-6 py-4 text-left">Department</th>

            <th className="px-6 py-4 text-left">Clock In</th>

            <th className="px-6 py-4 text-left">Clock Out</th>

            <th className="px-6 py-4 text-left">Hours</th>

            <th className="px-6 py-4 text-left">Status</th>

            <th className="px-6 py-4 text-center">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {attendance.map((record) => {

            const initials = record.user.name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .substring(0, 2)
              .toUpperCase();

            return (
              <tr
                key={record.id}
                className="border-t hover:bg-slate-50"
              >

                <td className="px-6 py-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">

                      {initials}

                    </div>

                    <div>

                      <div className="font-semibold">
                        {record.user.name}
                      </div>

                      <div className="text-sm text-slate-500">
                        {record.user.employeeId}
                      </div>

                    </div>

                  </div>

                </td>

                <td className="px-6 py-4">
                  {record.user.department.name}
                </td>

                <td className="px-6 py-4">
                  {record.clockIn
                    ? new Date(record.clockIn).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </td>

                <td className="px-6 py-4">
                  {record.clockOut
                    ? new Date(record.clockOut).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </td>

                <td className="px-6 py-4">
                  {record.workHours
                    ? `${record.workHours} hrs`
                    : "-"}
                </td>

                <td className="px-6 py-4">

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${statusColor(
                      record.status
                    )}`}
                  >
                    {record.status}
                  </span>

                </td>

                <td className="px-6 py-4 text-center">

                  {!record.clockOut ? (

                    <button
                      onClick={() =>
                        onClockOut(record)
                      }
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Clock Out
                    </button>

                  ) : (

                    <span className="text-green-600 font-semibold">
                      Completed
                    </span>

                  )}

                </td>

              </tr>
            );
          })}

        </tbody>

      </table>

    </div>
  );
}