import {
  attendanceRepository,
} from "@/repositories/attendance.repository";

import { prisma } from "@/lib/prisma";

export class AttendanceService {
  // =====================================================
  // GET ALL ATTENDANCE
  // =====================================================

  async getAttendances(
    organizationId: number
  ) {
    return attendanceRepository.findAll(
      organizationId
    );
  }

  // =====================================================
  // GET TODAY'S ATTENDANCE
  // =====================================================

  async getTodayAttendance(
    organizationId: number
  ) {
    const today =
      this.getTodayStart();

    const tomorrow =
      new Date(today);

    tomorrow.setDate(
      tomorrow.getDate() + 1
    );

    return attendanceRepository.findByDateRange(
      organizationId,
      today,
      tomorrow
    );
  }

  // =====================================================
  // GET ONE ATTENDANCE
  // =====================================================

  async getAttendance(
    id: number,
    organizationId: number
  ) {
    return attendanceRepository.findById(
      id,
      organizationId
    );
  }

  // =====================================================
  // CREATE ATTENDANCE
  // =====================================================

  async createAttendance(
    organizationId: number,
    data: {
      userId: number;
      date: Date;
      clockIn?: Date | null;
      clockOut?: Date | null;
      breakStart?: Date | null;
      breakEnd?: Date | null;
      workHours?: number | null;
      status: string;
      remarks?: string | null;
    }
  ) {
    return attendanceRepository.create(
      organizationId,
      data
    );
  }

  // =====================================================
  // UPDATE ATTENDANCE
  // =====================================================

  async updateAttendance(
    id: number,
    organizationId: number,
    data: {
      clockIn?: Date | null;
      clockOut?: Date | null;
      breakStart?: Date | null;
      breakEnd?: Date | null;
      workHours?: number | null;
      status?: string;
      remarks?: string | null;
    }
  ) {
    return attendanceRepository.update(
      id,
      organizationId,
      data
    );
  }

  // =====================================================
  // CLOCK IN
  // =====================================================

  async clockIn(
    userId: number,
    organizationId: number
  ) {
    const user =
      await prisma.user.findFirst({
        where: {
          id: userId,
          organizationId,
        },
      });

    if (!user) {
      throw new Error(
        "Employee not found."
      );
    }

    if (user.status !== "Active") {
      throw new Error(
        "Only active employees can clock in."
      );
    }

    const now = new Date();

    const today =
      this.getTodayStart();

    const tomorrow =
      new Date(today);

    tomorrow.setDate(
      tomorrow.getDate() + 1
    );

    const existing =
      await attendanceRepository.findForUserByDateRange(
        userId,
        organizationId,
        today,
        tomorrow
      );

    if (existing) {
      throw new Error(
        "Employee has already clocked in today."
      );
    }

    // SAP V1 attendance rule:
    // Before 09:00 = Present
    // 09:00 or later = Late

    const status =
      now.getHours() >= 9
        ? "Late"
        : "Present";

    return attendanceRepository.create(
      organizationId,
      {
        userId,
        date: today,
        clockIn: now,
        status,
      }
    );
  }

  // =====================================================
  // CLOCK OUT
  // =====================================================

  async clockOut(
    id: number,
    organizationId: number
  ) {
    const attendance =
      await attendanceRepository.findById(
        id,
        organizationId
      );

    if (!attendance) {
      throw new Error(
        "Attendance record not found."
      );
    }

    if (attendance.clockOut) {
      throw new Error(
        "Employee already clocked out."
      );
    }

    const now = new Date();

    let workHours:
      number | null = null;

    if (attendance.clockIn) {
      const clockIn =
        new Date(
          attendance.clockIn
        );

      const diff =
        now.getTime() -
        clockIn.getTime();

      workHours = Number(
        (
          diff / 3600000
        ).toFixed(2)
      );
    }

    return attendanceRepository.update(
      id,
      organizationId,
      {
        clockOut: now,
        workHours,
      }
    );
  }

  // =====================================================
  // DELETE
  // =====================================================

  async deleteAttendance(
    id: number,
    organizationId: number
  ) {
    return attendanceRepository.delete(
      id,
      organizationId
    );
  }

  // =====================================================
  // DATE HELPER
  // =====================================================

  private getTodayStart(): Date {
    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    return today;
  }
}

export const attendanceService =
  new AttendanceService();