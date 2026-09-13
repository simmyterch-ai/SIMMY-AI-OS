"use client";

import { useEffect, useState } from "react";

import type { Attendance } from "@/lib/types/attendance";

import AttendanceHeader from "@/components/attendance/AttendanceHeader";
import AttendanceStats from "@/components/attendance/AttendanceStats";
import AttendanceCharts from "@/components/attendance/AttendanceCharts";
import AttendanceSummary from "@/components/attendance/AttendanceSummary";
import AttendanceDepartmentChart from "@/components/attendance/AttendanceDepartmentChart";
import AttendanceTrendChart from "@/components/attendance/AttendanceTrendChart";
import AttendanceTable from "@/components/attendance/AttendanceTable";
import ClockInModal from "@/components/attendance/ClockInModal";
import ClockOutModal from "@/components/attendance/ClockOutModal";

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isClockInOpen, setIsClockInOpen] = useState(false);
  const [isClockOutOpen, setIsClockOutOpen] = useState(false);

  const [selectedAttendance, setSelectedAttendance] =
    useState<Attendance | null>(null);

  useEffect(() => {
    loadAttendance();
  }, []);

  async function loadAttendance() {
    try {
      setLoading(true);

      const response = await fetch("/api/attendance");

      if (!response.ok) {
        throw new Error("Failed to load attendance.");
      }

      const data = await response.json();

      setAttendance(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const filteredAttendance = attendance.filter((record) => {
    const matchesSearch =
      record.user.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      record.user.employeeId
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      record.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const total = attendance.length;

  const present = attendance.filter(
    (record) => record.status === "Present"
  ).length;

  const late = attendance.filter(
    (record) => record.status === "Late"
  ).length;

  const onLeave = attendance.filter(
    (record) => record.status === "On Leave"
  ).length;

  function handleClockOut(record: Attendance) {
    setSelectedAttendance(record);
    setIsClockOutOpen(true);
  }

  return (
    <div className="space-y-8">

      <AttendanceHeader
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onClockIn={() => setIsClockInOpen(true)}
      />

      <AttendanceStats attendance={attendance} />

      <AttendanceCharts
        total={total}
        present={present}
        late={late}
        absent={onLeave}
      />

      <AttendanceSummary attendance={attendance} />

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">

  <AttendanceDepartmentChart
    attendance={attendance}
  />

  <AttendanceTrendChart
    attendance={attendance}
  />

</div>

      {loading ? (
        <div className="rounded-2xl bg-white p-12 text-center text-slate-500">
          Loading attendance...
        </div>
      ) : (
        <AttendanceTable
          attendance={filteredAttendance}
          onClockOut={handleClockOut}
        />
      )}

      <ClockInModal
        isOpen={isClockInOpen}
        onClose={() => setIsClockInOpen(false)}
        onSuccess={loadAttendance}
      />

      <ClockOutModal
        isOpen={isClockOutOpen}
        attendance={selectedAttendance}
        onClose={() => {
          setIsClockOutOpen(false);
          setSelectedAttendance(null);
        }}
        onSuccess={loadAttendance}
      />

    </div>
  );
}