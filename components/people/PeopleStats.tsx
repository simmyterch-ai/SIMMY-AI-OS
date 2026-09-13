import type { User } from "@/lib/types/user";

type PeopleStatsProps = {
  users: User[];
};

export default function PeopleStats({
  users,
}: PeopleStatsProps) {
  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const administrators = users.filter(
    (user) =>
      user.role === "Administrator" ||
      user.role === "Founder"
  ).length;

  const pendingInvites = users.filter(
    (user) => user.status === "Pending"
  ).length;

  return (
    <div className="grid grid-cols-4 gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-3xl">👥</div>

        <p className="mt-4 text-sm text-slate-500">
          Total Users
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          {totalUsers}
        </h2>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-3xl">🛡️</div>

        <p className="mt-4 text-sm text-slate-500">
          Administrators
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          {administrators}
        </h2>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-3xl">🟢</div>

        <p className="mt-4 text-sm text-slate-500">
          Active Users
        </p>

        <h2 className="mt-2 text-3xl font-bold text-green-600">
          {activeUsers}
        </h2>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-3xl">📨</div>

        <p className="mt-4 text-sm text-slate-500">
          Pending Invites
        </p>

        <h2 className="mt-2 text-3xl font-bold text-amber-600">
          {pendingInvites}
        </h2>
      </div>
    </div>
  );
}