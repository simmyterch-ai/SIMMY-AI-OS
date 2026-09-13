export type Department = {
  id: number;
  name: string;
  description?: string | null;
};

export type Team = {
  id: number;
  name: string;
  description?: string | null;

  departmentId: number;
};

export type User = {
  id: number;

  employeeId: string;

  name: string;

  email: string;

  phone?: string | null;

  location?: string | null;

  avatar?: string | null;

  role: string;

  status: string;

  dateJoined?: string;

  createdAt?: string;

  updatedAt?: string;

  departmentId: number;

  teamId?: number | null;

  department: Department;

  team?: Team | null;
};

export type EmployeeAttendance = {
  id: number;

  date: string;

  clockIn?: string | null;

  clockOut?: string | null;

  workHours?: number | null;

  status:
    | "Present"
    | "Late"
    | "Absent"
    | "Half Day"
    | "On Leave"
    | "Remote"
    | "Holiday";

  remarks?: string | null;
};

export type EmployeeProfile = User & {
  attendances: EmployeeAttendance[];
};