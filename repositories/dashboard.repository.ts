import { prisma } from "@/lib/prisma";

import {
  DashboardDataScope,
} from "@/services/dashboard.service";

export class DashboardRepository {
  // =======================================================
  // GET DASHBOARD STATISTICS
  // =======================================================

  async getStats(
    dataScope: DashboardDataScope
  ) {
    const startOfDay =
      new Date();

    startOfDay.setHours(
      0,
      0,
      0,
      0
    );

    const endOfDay =
      new Date();

    endOfDay.setHours(
      23,
      59,
      59,
      999
    );

    // =====================================================
    // BUILD TENANT FILTER
    // =====================================================

    const organizationFilter =
      dataScope.scope === "PLATFORM"
        ? {}
        : {
            organizationId:
              dataScope.organizationId!,
          };

    // =====================================================
    // ATTENDANCE USER FILTER
    // =====================================================

    const attendanceUserFilter =
      dataScope.scope === "PLATFORM"
        ? {}
        : {
            organizationId:
              dataScope.organizationId!,
          };

    // =====================================================
    // GET STATISTICS
    // =====================================================

    const [
      totalEmployees,
      activeEmployees,
      organizationDepartments,
      organizationTeams,
      attendanceToday,
      recentActivities,
    ] = await Promise.all([
      // ===================================================
      // TOTAL EMPLOYEES
      // ===================================================

      prisma.user.count({
        where:
          organizationFilter,
      }),

      // ===================================================
      // ACTIVE EMPLOYEES
      // ===================================================

      prisma.user.count({
        where: {
          ...organizationFilter,
          isActive: true,
        },
      }),

      // ===================================================
      // DEPARTMENTS
      // ===================================================

      prisma.department.count({
        where:
          organizationFilter,
      }),

      // ===================================================
      // TEAMS
      // ===================================================

      prisma.team.count({
        where:
          organizationFilter,
      }),

      // ===================================================
      // TODAY'S ATTENDANCE
      // ===================================================

      prisma.attendance.findMany({
        where: {
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },

          user:
            dataScope.scope ===
            "PLATFORM"
              ? undefined
              : {
                  organizationId:
                    dataScope.organizationId!,
                },
        },
      }),

      // ===================================================
      // RECENT ACTIVITIES
      // ===================================================

      prisma.activity.findMany({
        where:
          organizationFilter,

        orderBy: {
          createdAt: "desc",
        },

        take: 10,
      }),
    ]);

    // =======================================================
    // ATTENDANCE STATISTICS
    // =======================================================

    const present =
      attendanceToday.filter(
        (attendance) =>
          attendance.status ===
          "Present"
      ).length;

    const late =
      attendanceToday.filter(
        (attendance) =>
          attendance.status ===
          "Late"
      ).length;

    const onLeave =
      attendanceToday.filter(
        (attendance) =>
          attendance.status ===
          "On Leave"
      ).length;

    // =======================================================
    // EMPLOYEES WITH RECORDED ATTENDANCE
    // =======================================================

    const attendedToday =
      present + late;

    // =======================================================
    // ATTENDANCE RATE
    // =======================================================

    const attendanceRate =
      activeEmployees === 0
        ? 0
        : Math.round(
            (attendedToday /
              activeEmployees) *
              100
          );

    // =======================================================
    // ORGANIZATION / PLATFORM HEALTH
    // =======================================================

    const healthScore =
      attendanceRate;

    // =======================================================
    // RETURN DASHBOARD DATA
    // =======================================================

    return {
      scope:
        dataScope.scope,

      organizationId:
        dataScope.organizationId,

      totalEmployees,

      activeEmployees,

      departments:
        organizationDepartments,

      teams:
        organizationTeams,

      present,

      late,

      onLeave,

      attendanceRate,

      healthScore,

      recentActivities,
    };
  }
}

export const dashboardRepository =
  new DashboardRepository();