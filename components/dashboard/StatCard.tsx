import { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: number;
  subtitle: string;
  icon: LucideIcon;
  iconColor: string;
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
}: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl">

      {/* Decorative Glow */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-50 opacity-60 transition-all duration-300 group-hover:scale-125" />

      <div className="relative flex items-start justify-between">

        <div>

          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-5xl font-bold tracking-tight text-slate-900">
            {value}
          </h2>

          <p className="mt-3 text-sm text-slate-500">
            {subtitle}
          </p>

        </div>

        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 transition-all duration-300 group-hover:scale-110 ${iconColor}`}
        >
          <Icon className="h-8 w-8" />
        </div>

      </div>

      <div className="relative mt-6 flex items-center justify-between">

        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
          Live Data
        </span>

        <span className="text-sm font-medium text-blue-600 transition-all duration-300 group-hover:translate-x-1">
          View →
        </span>

      </div>

    </div>
  );
}