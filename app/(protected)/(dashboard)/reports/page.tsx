"use client";

import { useEffect, useState } from "react";

import ReportsHeader from "@/components/reports/ReportsHeader";
import ReportsStats from "@/components/reports/ReportsStats";
import ReportsCharts from "@/components/reports/ReportsCharts";
import ReportsInsights from "@/components/reports/ReportsInsights";
import ReportsTable from "@/components/reports/ReportsTable";
import ReportsExport from "@/components/reports/ReportsExport";

type ReportData = {
  totalEmployees: number;
  totalDepartments: number;
  totalTeams: number;
  totalAttendance: number;
  activeEmployees: number;
  inactiveEmployees: number;
  presentToday: number;
  lateToday: number;
  averageHours: number;
  attendanceRate: number;
};

export default function ReportsPage() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadReport() {
    try {
      setLoading(true);

      const response = await fetch("/api/reports");

      if (!response.ok) {
        throw new Error("Failed to load reports.");
      }

      const data: ReportData = await response.json();

      setReport(data);
    } catch (error) {
      console.error("Failed to load reports:", error);

      setReport(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const initializeReports = async () => {
      await loadReport();
    };

    initializeReports();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-12 text-center text-slate-500">
        Loading reports...
      </div>
    );
  }

  if (!report) {
    return (
      <div className="rounded-2xl bg-white p-12 text-center text-red-600">
        Failed to load reports.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ReportsHeader />

      <ReportsStats
        totalEmployees={report.totalEmployees}
        totalDepartments={report.totalDepartments}
        totalTeams={report.totalTeams}
        activeEmployees={report.activeEmployees}
      />

      <div className="grid gap-8 xl:grid-cols-2">
        <ReportsCharts
          activeEmployees={report.activeEmployees}
          inactiveEmployees={report.inactiveEmployees}
        />

        <ReportsInsights
          activeEmployees={report.activeEmployees}
          totalEmployees={report.totalEmployees}
          attendanceRate={report.attendanceRate}
          averageHours={report.averageHours}
        />
      </div>

      <ReportsTable
        totalEmployees={report.totalEmployees}
        totalDepartments={report.totalDepartments}
        totalTeams={report.totalTeams}
        activeEmployees={report.activeEmployees}
        attendanceRate={report.attendanceRate}
        averageHours={report.averageHours}
      />

      <ReportsExport />
    </div>
  );
}