"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
} from "recharts";

type ReportsChartsProps = {
  activeEmployees: number;
  inactiveEmployees: number;
};

const COLORS = ["#2563eb", "#e5e7eb"];

export default function ReportsCharts({
  activeEmployees,
  inactiveEmployees,
}: ReportsChartsProps) {
  const total =
    activeEmployees + inactiveEmployees;

  const data = [
    {
      name: "Active",
      value: activeEmployees,
      percentage:
        total > 0
          ? Math.round((activeEmployees / total) * 100)
          : 0,
    },
    {
      name: "Inactive",
      value: inactiveEmployees,
      percentage:
        total > 0
          ? Math.round((inactiveEmployees / total) * 100)
          : 0,
    },
  ];

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-xl font-bold text-slate-800">
            Employee Status
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Live workforce distribution
          </p>

        </div>

        <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
          {total} Employees
        </div>

      </div>

      <div className="h-80">

        <ResponsiveContainer width="100%" height="100%">

          <PieChart>

     <Pie
  data={data}
  dataKey="value"
  nameKey="name"
  cx="50%"
  cy="50%"
  innerRadius={75}
  outerRadius={110}
  paddingAngle={4}
  animationDuration={900}
  label={({ value }) => {
    const percentage =
      total > 0
        ? Math.round((Number(value) / total) * 100)
        : 0;

    return `${percentage}%`;
  }}
>
  <Label
    value={`${total}\nEmployees`}
    position="center"
    style={{
      fontSize: "16px",
      fontWeight: 700,
      fill: "#1e293b",
      whiteSpace: "pre-line",
      textAnchor: "middle",
    }}
  />

  {data.map((entry, index) => (
    <Cell
      key={entry.name}
      fill={COLORS[index]}
    />
  ))}
</Pie>

            <Tooltip
              formatter={(value) => [
                `${value} Employees`,
                "Count",
              ]}
            />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

          <p className="text-sm text-slate-500">
            Active Employees
          </p>

          <h3 className="mt-2 text-2xl font-bold text-blue-700">
            {activeEmployees}
          </h3>

          <p className="mt-1 text-sm text-slate-600">
            {data[0].percentage}% of workforce
          </p>

        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

          <p className="text-sm text-slate-500">
            Inactive Employees
          </p>

          <h3 className="mt-2 text-2xl font-bold text-slate-700">
            {inactiveEmployees}
          </h3>

          <p className="mt-1 text-sm text-slate-600">
            {data[1].percentage}% of workforce
          </p>

        </div>

      </div>

    </div>
  );
}