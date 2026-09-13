"use client";

type AssistantWelcomeProps = {
  onPromptSelect: (prompt: string) => void;
};

const suggestions = [
  {
    icon: "👥",
    title: "Workforce Summary",
    description: "Get an overview of employees and workforce status.",
    prompt: "Summarize my workforce",
  },
  {
    icon: "🏢",
    title: "Department Analysis",
    description: "Review departments and organizational structure.",
    prompt: "Analyze my departments",
  },
  {
    icon: "📊",
    title: "Management Insights",
    description: "Generate useful management observations and recommendations.",
    prompt: "Give me management recommendations",
  },
  {
    icon: "⚠️",
    title: "Employee Status",
    description: "Identify employees requiring management attention.",
    prompt: "Show inactive, pending or suspended employees",
  },
];

export default function AssistantWelcome({
  onPromptSelect,
}: AssistantWelcomeProps) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 py-12">
      {/* AI Identity */}
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-4xl shadow-lg shadow-blue-200">
        ✨
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          SIMMY AI PLATFORM
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          SAP AI Assistant
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          Your intelligent workspace assistant for employees, teams,
          departments, reports and management insights.
        </p>
      </div>

      {/* Suggested Actions */}
      <div className="mt-10 w-full">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">
            What would you like to know?
          </h2>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            SAP Intelligence
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {suggestions.map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={() => onPromptSelect(item.prompt)}
              className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl transition group-hover:bg-blue-50">
                  {item.icon}
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800 transition group-hover:text-blue-700">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    {item.description}
                  </p>

                  <p className="mt-3 text-xs font-medium text-blue-600">
                    Ask SAP →
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Capability Note */}
      <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
        <span>🔒</span>
        <span>
          Designed to work with your organization&apos;s authorized SAP data.
        </span>
      </div>
    </div>
  );
}