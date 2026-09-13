import type { AttendanceStatus } from "./attendance";

export type AttendanceHistoryRecord = {
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

export type AttendanceHistorySummary = {
  totalRecords: number;
  present: number;
  late: number;
  absent: number;
  onLeave: number;
  remote: number;
  halfDay: number;
  holiday: number;
  totalHours: number;
  averageHours: number;
};

export type AttendanceHistoryResponse = {
  records: AttendanceHistoryRecord[];
  summary: AttendanceHistorySummary;
};