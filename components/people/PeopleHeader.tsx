type PeopleHeaderProps = {
  onAddUser: () => void;
};

export default function PeopleHeader({
  onAddUser,
}: PeopleHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          People
        </h1>

        <p className="mt-2 text-slate-500">
          Manage employees, administrators and team members.
        </p>
      </div>

      <button
        onClick={onAddUser}
        className="rounded-xl bg-blue-700 px-6 py-3 font-medium text-white transition hover:bg-blue-800"
      >
        + Add User
      </button>
    </div>
  );
}