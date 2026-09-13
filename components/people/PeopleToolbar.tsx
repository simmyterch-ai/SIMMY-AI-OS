type PeopleToolbarProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedRole: string;
  setSelectedRole: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
};

export default function PeopleToolbar({
  searchTerm,
  setSearchTerm,
  selectedRole,
  setSelectedRole,
  selectedStatus,
  setSelectedStatus,
}: PeopleToolbarProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-4">
      <input
        type="text"
        placeholder="🔍 Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-80 rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />

      <select
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value)}
        className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      >
        <option>All Roles</option>
        <option>Founder</option>
        <option>Administrator</option>
        <option>Employee</option>
      </select>

      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      >
        <option>All Status</option>
        <option>Active</option>
        <option>Inactive</option>
        <option>Pending</option>
        <option>Suspended</option>
      </select>
    </div>
  );
}