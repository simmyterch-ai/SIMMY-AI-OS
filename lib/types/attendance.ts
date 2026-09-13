export type AttendanceStatus =
  | "Present"
  | "Late"
  | "Absent"
  | "Half Day"
  | "On Leave"
  | "Remote"
  | "Holiday";

export type Attendance = {
  id: number;

  userId: number;

  date: string;

  clockIn?: string | null;

  clockOut?: string | null;

  breakStart?: string | null;

  breakEnd?: string | null;

  workHours?: number | null;

  status: AttendanceStatus;

  remarks?: string | null;

  createdAt?: string;

  updatedAt?: string;

  user: {
    id: number;
    employeeId: string;
    name: string;
    email: string;
    role: string;
    status: string;

    department: {
      id: number;
      name: string;
    };

    team?: {
      id: number;
      name: string;
    } | null;
  };
};