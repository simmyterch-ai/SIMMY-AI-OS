import type { Department } from "../../lib/types/department";

type Props = {
  departments: Department[];
};

export default function DepartmentStats({
  departments,
}: Props) {
  const totalDepartments =
    departments.length;

  const totalEmployees =
    departments.reduce(
      (sum, department) =>
        sum +
        (Number(department.employeeCount) || 0),
      0
    );

  const activeDepartments =
    departments.filter(
      (department) =>
        department.status === "Active"
    ).length;

  const managers =
    departments.filter(
      (department) =>
        Boolean(
          department.manager?.trim()
        )
    ).length;

  const cards = [
    {
      title: "Total Departments",
      value: totalDepartments,
      icon: "🏢",
      color: "text-blue-600",
    },
    {
      title: "Total Employees",
      value: totalEmployees,
      icon: "👥",
      color: "text-green-600",
    },
    {
      title: "Department Managers",
      value: managers,
      icon: "👑",
      color: "text-amber-600",
    },
    {
      title: "Active Departments",
      value: activeDepartments,
      icon: "✅",
      color: "text-emerald-600",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                {card.title}
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-800">
                {card.value}
              </h2>
            </div>

            <div
              className={`text-3xl ${card.color}`}
            >
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}