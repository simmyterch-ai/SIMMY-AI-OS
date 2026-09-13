"use client";

import { useEffect, useState } from "react";

import type { Attendance } from "@/lib/types/attendance";
import type { Department } from "@/lib/types/user";

// =======================================================
// TYPES
// =======================================================

type AttendanceSummary = {
  totalRecords: number;
  present: number;
  late: number;
  absent: number;
  onLeave: number;
  remote: number;
  halfDay: number;
  holiday: number;
  totalHours: number;
  averageHours: number;
};

const emptySummary: AttendanceSummary = {
  totalRecords: 0,
  present: 0,
  late: 0,
  absent: 0,
  onLeave: 0,
  remote: 0,
  halfDay: 0,
  holiday: 0,
  totalHours: 0,
  averageHours: 0,
};

// =======================================================
// PAGE
// =======================================================

export default function AttendanceHistoryPage() {
  const [attendance, setAttendance] =
    useState<Attendance[]>([]);

  const [departments, setDepartments] =
    useState<Department[]>([]);

  const [summary, setSummary] =
    useState<AttendanceSummary>(emptySummary);

  const [loading, setLoading] =
    useState(true);

  const [loadingDepartments, setLoadingDepartments] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // FILTERS
  // =====================================================

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [departmentFilter, setDepartmentFilter] =
    useState("All");

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  // =====================================================
  // LOAD DEPARTMENTS
  // =====================================================

  useEffect(() => {
    loadDepartments();
  }, []);

  async function loadDepartments() {
    try {
      setLoadingDepartments(true);

      const response = await fetch(
        "/api/departments"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load departments."
        );
      }

      const data =
        await response.json();

      setDepartments(data);
    } catch (error) {
      console.error(
        "Failed to load departments:",
        error
      );

      setDepartments([]);
    } finally {
      setLoadingDepartments(false);
    }
  }

  // =====================================================
  // LOAD ATTENDANCE HISTORY
  // =====================================================

  useEffect(() => {
    loadAttendanceHistory();
  }, [
    search,
    statusFilter,
    departmentFilter,
    fromDate,
    toDate,
  ]);

  async function loadAttendanceHistory() {
    try {
      setLoading(true);
      setError("");

      const params =
        new URLSearchParams();

      // -------------------------------------------------
      // SEARCH
      // -------------------------------------------------

      if (search.trim()) {
        params.set(
          "search",
          search.trim()
        );
      }

      // -------------------------------------------------
      // STATUS
      // -------------------------------------------------

      if (statusFilter !== "All") {
        params.set(
          "status",
          statusFilter
        );
      }

      // -------------------------------------------------
      // DEPARTMENT
      // -------------------------------------------------

      if (
        departmentFilter !== "All"
      ) {
        const department =
          departments.find(
            (item) =>
              item.name ===
              departmentFilter
          );

        if (department) {
          params.set(
            "departmentId",
            String(department.id)
          );
        }
      }

      // -------------------------------------------------
      // DATE RANGE
      // -------------------------------------------------

      if (fromDate) {
        params.set(
          "from",
          fromDate
        );
      }

      if (toDate) {
        params.set(
          "to",
          toDate
        );
      }

      const queryString =
        params.toString();

      const url = queryString
        ? `/api/attendance/history?${queryString}`
        : "/api/attendance/history";

      const response =
        await fetch(url);

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Failed to load attendance history."
        );
      }

      setAttendance(
        data.records ?? []
      );

      setSummary({
        totalRecords:
          data.summary?.totalRecords ??
          0,

        present:
          data.summary?.present ??
          0,

        late:
          data.summary?.late ??
          0,

        absent:
          data.summary?.absent ??
          0,

        onLeave:
          data.summary?.onLeave ??
          0,

        remote:
          data.summary?.remote ??
          0,

        halfDay:
          data.summary?.halfDay ??
          0,

        holiday:
          data.summary?.holiday ??
          0,

        totalHours:
          data.summary?.totalHours ??
          0,

        averageHours:
          data.summary?.averageHours ??
          0,
      });
    } catch (error) {
      console.error(
        "Failed to load attendance history:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load attendance history."
      );

      setAttendance([]);
      setSummary(emptySummary);
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // RESET FILTERS
  // =====================================================

  function handleReset() {
    setSearch("");
    setStatusFilter("All");
    setDepartmentFilter("All");
    setFromDate("");
    setToDate("");
  }

  // =====================================================
  // DATE HELPERS
  // =====================================================

  function formatInputDate(
    date: Date
  ) {
    const year =
      date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function handleToday() {
    const today =
      new Date();

    const date =
      formatInputDate(today);

    setFromDate(date);
    setToDate(date);
  }

  function handleThisWeek() {
    const today =
      new Date();

    const day =
      today.getDay();

    const monday =
      new Date(today);

    const difference =
      day === 0
        ? 6
        : day - 1;

    monday.setDate(
      today.getDate() -
        difference
    );

    setFromDate(
      formatInputDate(monday)
    );

    setToDate(
      formatInputDate(today)
    );
  }

  function handleThisMonth() {
    const today =
      new Date();

    const firstDay =
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

    setFromDate(
      formatInputDate(firstDay)
    );

    setToDate(
      formatInputDate(today)
    );
  }

  function handleLastMonth() {
    const today =
      new Date();

    const firstDayLastMonth =
      new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1
      );

    const lastDayLastMonth =
      new Date(
        today.getFullYear(),
        today.getMonth(),
        0
      );

    setFromDate(
      formatInputDate(
        firstDayLastMonth
      )
    );

    setToDate(
      formatInputDate(
        lastDayLastMonth
      )
    );
  }

  // =====================================================
  // FORMATTING
  // =====================================================

  function formatDate(
    date: string
  ) {
    return new Date(
      date
    ).toLocaleDateString(
      [],
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  }

  function formatTime(
    date?: string | null
  ) {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  // =====================================================
  // STATUS COLORS
  // =====================================================

  function getStatusColor(
    status: string
  ) {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-700";

      case "Late":
        return "bg-yellow-100 text-yellow-700";

      case "Absent":
        return "bg-red-100 text-red-700";

      case "On Leave":
        return "bg-blue-100 text-blue-700";

      case "Remote":
        return "bg-purple-100 text-purple-700";

      case "Half Day":
        return "bg-orange-100 text-orange-700";

      case "Holiday":
        return "bg-pink-100 text-pink-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  // =====================================================
  // PRINT
  // =====================================================

  function handlePrint() {
    window.print();
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="space-y-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Attendance History
          </h1>

          <p className="mt-2 text-slate-500">
            Review employee attendance
            records, working hours and
            attendance trends.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">

          <button
            type="button"
            onClick={handlePrint}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            🖨️ Print
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
          >
            📄 Export PDF
          </button>

          <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            HR Reports
          </div>

        </div>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">

        <SummaryCard
          label="Total Records"
          value={summary.totalRecords}
          icon="📋"
        />

        <SummaryCard
          label="Present"
          value={summary.present}
          icon="🟢"
          valueClass="text-green-600"
        />

        <SummaryCard
          label="Late"
          value={summary.late}
          icon="🟡"
          valueClass="text-amber-600"
        />

        <SummaryCard
          label="On Leave"
          value={summary.onLeave}
          icon="🔵"
          valueClass="text-blue-600"
        />

        <SummaryCard
          label="Total Hours"
          value={`${summary.totalHours.toFixed(
            2
          )} hrs`}
          icon="⏱️"
          valueClass="text-purple-600"
        />

      </div>

      {/* =================================================
          SECONDARY SUMMARY
      ================================================= */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Average Working Hours
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-700">
            {summary.averageHours.toFixed(
              2
            )}{" "}
            hrs
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Remote Employees
          </p>

          <p className="mt-2 text-3xl font-bold text-purple-700">
            {summary.remote}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Half Day Records
          </p>

          <p className="mt-2 text-3xl font-bold text-orange-600">
            {summary.halfDay}
          </p>
        </div>

      </div>

      {/* =================================================
          FILTERS
      ================================================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">

          {/* SEARCH */}

          <input
            type="text"
            placeholder="🔍 Search employee..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

          {/* FROM DATE */}

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">
              From Date
            </label>

            <input
              type="date"
              value={fromDate}
              onChange={(event) =>
                setFromDate(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* TO DATE */}

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">
              To Date
            </label>

            <input
              type="date"
              value={toDate}
              onChange={(event) =>
                setToDate(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* STATUS */}

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="All">
              All Status
            </option>

            <option value="Present">
              Present
            </option>

            <option value="Late">
              Late
            </option>

            <option value="Absent">
              Absent
            </option>

            <option value="On Leave">
              On Leave
            </option>

            <option value="Remote">
              Remote
            </option>

            <option value="Half Day">
              Half Day
            </option>

            <option value="Holiday">
              Holiday
            </option>
          </select>

          {/* DEPARTMENT */}

          <select
            value={departmentFilter}
            onChange={(event) =>
              setDepartmentFilter(
                event.target.value
              )
            }
            disabled={loadingDepartments}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
          >
            <option value="All">
              All Departments
            </option>

            {departments.map(
              (department) => (
                <option
                  key={department.id}
                  value={department.name}
                >
                  {department.name}
                </option>
              )
            )}
          </select>

          {/* RESET */}

          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Reset
          </button>

        </div>

        {/* QUICK DATE RANGE */}

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">

          <span className="mr-2 text-sm font-medium text-slate-500">
            Quick Range:
          </span>

          <button
            type="button"
            onClick={handleToday}
            className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
          >
            Today
          </button>

          <button
            type="button"
            onClick={handleThisWeek}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            This Week
          </button>

          <button
            type="button"
            onClick={handleThisMonth}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            This Month
          </button>

          <button
            type="button"
            onClick={handleLastMonth}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Last Month
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Clear Dates
          </button>

        </div>

      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      {loading ? (

        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

          <div className="text-5xl">
            ⏳
          </div>

          <p className="mt-4 text-slate-500">
            Loading attendance history...
          </p>

        </div>

      ) : attendance.length === 0 ? (

        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

          <div className="text-6xl">
            📅
          </div>

          <h2 className="mt-5 text-xl font-semibold text-slate-700">
            No attendance records found
          </h2>

          <p className="mt-2 text-slate-500">
            Try changing your search,
            date range or filters.
          </p>

        </div>

      ) : (

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* TABLE HEADER */}

          <div className="border-b border-slate-200 px-6 py-5">

            <h2 className="text-lg font-semibold text-slate-800">
              Attendance Records
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {attendance.length}
              </span>{" "}
              records
            </p>

          </div>

          {/* TABLE */}

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-slate-50">

                <tr>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Employee
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Department
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Clock In
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Clock Out
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Hours
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {attendance.map(
                  (record) => {

                    const initials =
                      record.user.name
                        .split(" ")
                        .map(
                          (word) =>
                            word[0]
                        )
                        .join("")
                        .substring(
                          0,
                          2
                        )
                        .toUpperCase();

                    return (

                      <tr
                        key={record.id}
                        className="border-t border-slate-100 transition hover:bg-blue-50"
                      >

                        {/* DATE */}

                        <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-700">
                          {formatDate(
                            record.date
                          )}
                        </td>

                        {/* EMPLOYEE */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-bold text-white">
                              {initials}
                            </div>

                            <div>

                              <p className="font-semibold text-slate-800">
                                {record.user.name}
                              </p>

                              <p className="text-xs text-slate-500">
                                {record.user.employeeId}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* DEPARTMENT */}

                        <td className="px-6 py-5 text-sm text-slate-700">
                          {record.user.department?.name ??
                            "-"}
                        </td>

                        {/* CLOCK IN */}

                        <td className="px-6 py-5 text-sm text-slate-700">
                          {formatTime(
                            record.clockIn
                          )}
                        </td>

                        {/* CLOCK OUT */}

                        <td className="px-6 py-5 text-sm text-slate-700">
                          {formatTime(
                            record.clockOut
                          )}
                        </td>

                        {/* HOURS */}

                        <td className="px-6 py-5 text-sm font-medium text-slate-700">
                          {record.workHours !==
                            null &&
                          record.workHours !==
                            undefined
                            ? `${record.workHours.toFixed(
                                2
                              )} hrs`
                            : "-"}
                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-5">

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                              record.status
                            )}`}
                          >
                            {record.status}
                          </span>

                        </td>

                      </tr>

                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>
  );
}

// =======================================================
// SUMMARY CARD
// =======================================================

type SummaryCardProps = {
  label: string;
  value: string | number;
  icon: string;
  valueClass?: string;
};

function SummaryCard({
  label,
  value,
  icon,
  valueClass = "text-slate-900",
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="text-3xl">
        {icon}
      </div>

      <p className="mt-4 text-sm text-slate-500">
        {label}
      </p>

      <p
        className={`mt-2 text-3xl font-bold ${valueClass}`}
      >
        {value}
      </p>

    </div>
  );
}