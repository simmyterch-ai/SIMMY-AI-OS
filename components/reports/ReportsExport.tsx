"use client";

import {
  FileText,
  FileSpreadsheet,
  File,
  Printer,
} from "lucide-react";

export default function ReportsExport() {
  const actions = [
    {
      title: "Export PDF",
      icon: FileText,
      color:
        "bg-red-100 text-red-600 hover:bg-red-200",
      onClick: () => alert("PDF export coming soon"),
    },
    {
      title: "Export Excel",
      icon: FileSpreadsheet,
      color:
        "bg-green-100 text-green-600 hover:bg-green-200",
      onClick: () => alert("Excel export coming soon"),
    },
    {
      title: "Export CSV",
      icon: File,
      color:
        "bg-blue-100 text-blue-600 hover:bg-blue-200",
      onClick: () => alert("CSV export coming soon"),
    },
    {
      title: "Print",
      icon: Printer,
      color:
        "bg-slate-100 text-slate-700 hover:bg-slate-200",
      onClick: () => window.print(),
    },
  ];

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          Export Center
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Export workforce reports in multiple formats.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              onClick={action.onClick}
              className={`flex flex-col items-center justify-center gap-3 rounded-xl border p-6 transition ${action.color}`}
            >
              <Icon className="h-8 w-8" />

              <span className="font-semibold">
                {action.title}
              </span>
            </button>
          );
        })}

      </div>

    </div>
  );
}