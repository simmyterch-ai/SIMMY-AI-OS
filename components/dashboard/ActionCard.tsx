type ActionCardProps = {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
};

export default function ActionCard({
  title,
  subtitle,
  icon,
  color,
}: ActionCardProps) {
  return (
    <div
      className={`rounded-2xl p-6 flex justify-between items-center ${color}`}
    >
      <div>
        <div className="text-2xl mb-2">{icon}</div>

        <h3 className="font-semibold text-slate-900">
          {title}
        </h3>

        <p className="text-sm text-slate-500">
          {subtitle}
        </p>
      </div>

      <div className="text-2xl">
        ➜
      </div>
    </div>
  );
}