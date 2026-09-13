import { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-blue-600",
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </h2>
        </div>

        <div className="rounded-xl bg-slate-100 p-3">
          <Icon
            size={30}
            className={iconColor}
          />
        </div>

      </div>
    </div>
  );
}