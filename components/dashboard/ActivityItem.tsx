type ActivityItemProps = {
  icon: string;
  title: string;
  description: string;
  time: string;
};

export default function ActivityItem({
  icon,
  title,
  description,
  time,
}: ActivityItemProps) {
  return (
    <div className="flex items-start justify-between py-4 border-b last:border-b-0">

      <div className="flex gap-4">

        <div className="text-2xl">
          {icon}
        </div>

        <div>

          <h3 className="font-semibold text-slate-900">
            {title}
          </h3>

          <p className="text-sm text-slate-500">
            {description}
          </p>

        </div>

      </div>

      <span className="text-xs text-slate-400">
        {time}
      </span>

    </div>
  );
}