export default function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center shadow-sm">
      <div className="text-6xl">👥</div>

      <h2 className="mt-6 text-2xl font-bold text-slate-800">
        No users yet
      </h2>

      <p className="mx-auto mt-3 max-w-md text-slate-500">
        Invite employees, administrators and team members to start
        collaborating inside SAP.
      </p>

      <button className="mt-8 rounded-xl bg-blue-700 px-6 py-3 font-medium text-white transition hover:bg-blue-800">
        + Invite First User
      </button>
    </div>
  );
}