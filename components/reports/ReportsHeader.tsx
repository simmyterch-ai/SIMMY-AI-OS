"use client";

import { FileText, Download, Printer } from "lucide-react";

type ReportsHeaderProps = {
  onExportPDF?: () => void;
  onExportExcel?: () => void;
  onPrint?: () => void;
};

export default function ReportsHeader({
  onExportPDF,
  onExportExcel,
  onPrint,
}: ReportsHeaderProps) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-blue-100 p-3">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>

            <div>

              <h1 className="text-3xl font-bold text-slate-800">
                Reports
              </h1>

              <p className="mt-1 text-slate-500">
                Analyze workforce performance and generate business reports.
              </p>

            </div>

          </div>

        </div>

        <div className="flex flex-wrap gap-3">

          <button
            onClick={onExportPDF}
            className="rounded-xl border border-slate-300 px-5 py-3 font-medium hover:bg-slate-100"
          >
            Export PDF
          </button>

          <button
            onClick={onExportExcel}
            className="rounded-xl border border-slate-300 px-5 py-3 font-medium hover:bg-slate-100"
          >
            Export Excel
          </button>

          <button
            onClick={onPrint}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            <Printer size={18} />
            Print
          </button>

        </div>

      </div>

    </div>
  );
}