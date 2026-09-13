"use client";

type AttendanceChartsProps = {
  total: number;
  present: number;
  late: number;
  absent: number;
};

export default function AttendanceCharts({
  total,
  present,
  late,
  absent,
}: AttendanceChartsProps) {
  const presentPercent =
    total === 0 ? 0 : Math.round((present / total) * 100);

  const latePercent =
    total === 0 ? 0 : Math.round((late / total) * 100);

  const absentPercent =
    total === 0 ? 0 : Math.round((absent / total) * 100);

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-3">

      {/* Present */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <h3 className="mb-4 font-semibold">
          Present Rate
        </h3>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200">

          <div
            className="h-full rounded-full bg-green-500 transition-all"
            style={{
              width: `${presentPercent}%`,
            }}
          />

        </div>

        <p className="mt-3 text-3xl font-bold text-green-600">
          {presentPercent}%
        </p>

      </div>

      {/* Late */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <h3 className="mb-4 font-semibold">
          Late Rate
        </h3>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200">

          <div
            className="h-full rounded-full bg-yellow-500 transition-all"
            style={{
              width: `${latePercent}%`,
            }}
          />

        </div>

        <p className="mt-3 text-3xl font-bold text-yellow-600">
          {latePercent}%
        </p>

      </div>

      {/* Absent */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <h3 className="mb-4 font-semibold">
          Absent Rate
        </h3>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200">

          <div
            className="h-full rounded-full bg-red-500 transition-all"
            style={{
              width: `${absentPercent}%`,
            }}
          />

        </div>

        <p className="mt-3 text-3xl font-bold text-red-600">
          {absentPercent}%
        </p>

      </div>

    </div>
  );
}