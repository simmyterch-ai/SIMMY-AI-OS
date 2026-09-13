import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authorization";

// =======================================================
// GET — REPORTS SUMMARY
// =======================================================

export async function GET(
  request: NextRequest
) {
  try {
    // =====================================================
    // AUTHENTICATION + ORGANIZATION
    // =====================================================

    const user = await requirePermission(
      request,
      "reports"
    );

    const organizationId =
      user.organizationId;

    // =====================================================
    // TODAY
    // =====================================================

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);

    tomorrow.setDate(
      today.getDate() + 1
    );

    // =====================================================
    // LOAD REPORT DATA
    //
    // IMPORTANT:
    // Every query is scoped to the
    // authenticated user's organization.
    // =====================================================

    const [
      totalEmployees,
      totalDepartments,
      totalTeams,
      totalAttendance,
      activeEmployees,
      attendanceToday,
    ] = await Promise.all([

      // ---------------------------------------------------
      // EMPLOYEES
      // ---------------------------------------------------

      prisma.user.count({
        where: {
          organizationId,
        },
      }),

      // ---------------------------------------------------
      // DEPARTMENTS
      // ---------------------------------------------------

      prisma.department.count({
        where: {
          organizationId,
        },
      }),

      // ---------------------------------------------------
      // TEAMS
      // ---------------------------------------------------

      prisma.team.count({
        where: {
          organizationId,
        },
      }),

      // ---------------------------------------------------
      // ATTENDANCE
      // ---------------------------------------------------

      prisma.attendance.count({
        where: {
          user: {
            organizationId,
          },
        },
      }),

      // ---------------------------------------------------
      // ACTIVE EMPLOYEES
      // ---------------------------------------------------

      prisma.user.count({
        where: {
          organizationId,
          isActive: true,
        },
      }),

      // ---------------------------------------------------
      // TODAY'S ATTENDANCE
      // ---------------------------------------------------

      prisma.attendance.findMany({
        where: {
          date: {
            gte: today,
            lt: tomorrow,
          },

          user: {
            organizationId,
          },
        },

        select: {
          status: true,
          workHours: true,
        },
      }),
    ]);

    // =====================================================
    // TODAY'S ATTENDANCE
    // =====================================================

    const presentToday =
      attendanceToday.filter(
        (record) =>
          record.status === "Present"
      ).length;

    const lateToday =
      attendanceToday.filter(
        (record) =>
          record.status === "Late"
      ).length;

    // =====================================================
    // ATTENDED
    //
    // Present + Late both count as attendance.
    // =====================================================

    const attendedToday =
      presentToday + lateToday;

    // =====================================================
    // ATTENDANCE RATE
    // =====================================================

    const attendanceRate =
      activeEmployees > 0
        ? Math.round(
            (attendedToday /
              activeEmployees) *
              100
          )
        : 0;

    // =====================================================
    // AVERAGE WORKING HOURS
    //
    // Only completed attendance records with
    // workHours are included.
    // =====================================================

    const completedAttendance =
      attendanceToday.filter(
        (record) =>
          record.workHours !== null
      );

    const averageHours =
      completedAttendance.length > 0
        ? Number(
            (
              completedAttendance.reduce(
                (sum, record) =>
                  sum +
                  (record.workHours ?? 0),
                0
              ) /
              completedAttendance.length
            ).toFixed(2)
          )
        : 0;

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json({
      totalEmployees,

      totalDepartments,

      totalTeams,

      totalAttendance,

      activeEmployees,

      inactiveEmployees:
        totalEmployees -
        activeEmployees,

      presentToday,

      lateToday,

      attendedToday,

      averageHours,

      attendanceRate,
    });

  } catch (error) {
    console.error(error);

    // =====================================================
    // UNAUTHORIZED
    // =====================================================

    if (
      error instanceof Error &&
      error.message === "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        {
          error:
            "Authentication required.",
        },
        {
          status: 401,
        }
      );
    }

    // =====================================================
    // FORBIDDEN
    // =====================================================

    if (
      error instanceof Error &&
      error.message === "FORBIDDEN"
    ) {
      return NextResponse.json(
        {
          error:
            "You do not have permission to access reports.",
        },
        {
          status: 403,
        }
      );
    }

    // =====================================================
    // SERVER ERROR
    // =====================================================

    return NextResponse.json(
      {
        error:
          "Failed to load reports.",
      },
      {
        status: 500,
      }
    );
  }
}