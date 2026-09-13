import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";

export class AttendanceRepository {
  // =====================================================
  // FIND ALL
  // =====================================================

  async findAll(organizationId: number) {
    return prisma.attendance.findMany({
      where: {
        user: {
          organizationId,
        },
      },
      include: {
        user: {
          include: {
            department: true,
            team: true,
          },
        },
      },
      orderBy: [
        {
          date: "desc",
        },
        {
          clockIn: "desc",
        },
      ],
    });
  }

  // =====================================================
  // FIND BY ID
  // =====================================================

  async findById(
    id: number,
    organizationId: number
  ) {
    return prisma.attendance.findFirst({
      where: {
        id,
        user: {
          organizationId,
        },
      },
      include: {
        user: {
          include: {
            department: true,
            team: true,
          },
        },
      },
    });
  }

  // =====================================================
  // FIND ATTENDANCE FOR USER / DATE RANGE
  // =====================================================

  async findForUserByDateRange(
    userId: number,
    organizationId: number,
    startDate: Date,
    endDate: Date
  ) {
    return prisma.attendance.findFirst({
      where: {
        userId,
        user: {
          organizationId,
        },
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: {
        user: {
          include: {
            department: true,
            team: true,
          },
        },
      },
    });
  }

  // =====================================================
  // FIND ATTENDANCE BY DATE RANGE
  // =====================================================

  async findByDateRange(
    organizationId: number,
    startDate: Date,
    endDate: Date
  ) {
    return prisma.attendance.findMany({
      where: {
        user: {
          organizationId,
        },
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: {
        user: {
          include: {
            department: true,
            team: true,
          },
        },
      },
      orderBy: {
        clockIn: "asc",
      },
    });
  }

  // =====================================================
  // CREATE
  // =====================================================

  async create(
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
    const user = await prisma.user.findFirst({
      where: {
        id: data.userId,
        organizationId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!user) {
      throw new Error("Employee not found.");
    }

    const attendance =
      await prisma.attendance.create({
        data,
        include: {
          user: {
            include: {
              department: true,
              team: true,
            },
          },
        },
      });

    await logActivity({
      title: "Attendance Recorded",
      description:
        `${attendance.user.name} checked in successfully.`,
      type: "Attendance",
      organizationId:
        attendance.user.organizationId,
    });

    return attendance;
  }

  // =====================================================
  // UPDATE
  // =====================================================

  async update(
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
    const existing =
      await this.findById(
        id,
        organizationId
      );

    if (!existing) {
      throw new Error(
        "ATTENDANCE_NOT_FOUND"
      );
    }

    const attendance =
      await prisma.attendance.update({
        where: {
          id,
        },
        data,
        include: {
          user: {
            include: {
              department: true,
              team: true,
            },
          },
        },
      });

    if (data.clockOut) {
      await logActivity({
        title: "Attendance Completed",
        description:
          `${attendance.user.name} clocked out successfully.`,
        type: "Attendance",
        organizationId:
          attendance.user.organizationId,
      });
    }

    return attendance;
  }

  // =====================================================
  // DELETE
  // =====================================================

  async delete(
    id: number,
    organizationId: number
  ) {
    const existing =
      await this.findById(
        id,
        organizationId
      );

    if (!existing) {
      throw new Error(
        "ATTENDANCE_NOT_FOUND"
      );
    }

    return prisma.attendance.delete({
      where: {
        id,
      },
    });
  }
}

export const attendanceRepository =
  new AttendanceRepository();