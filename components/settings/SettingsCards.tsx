type SettingsCardsProps = {
  companyName: string;
  userName: string;
};

export default function SettingsCards({
  companyName,
  userName,
}: SettingsCardsProps) {
  const cards = [
    {
      title: "Company",
      value: companyName,
      icon: "🏢",
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Current User",
      value: userName,
      icon: "👤",
      color: "bg-green-100 text-green-700",
    },
    {
      title: "System Version",
      value: "SAP v1.0.0",
      icon: "⚙️",
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "Environment",
      value: "Development",
      icon: "🚀",
      color: "bg-amber-100 text-amber-700",
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

              <h2 className="mt-2 text-lg font-bold text-slate-800">
                {card.value}
              </h2>
            </div>

            <div
              className={`flex h-14 w-14 items-center justify-center rounded-xl text-2xl ${card.color}`}
            >
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}