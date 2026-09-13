import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authorization";

// =======================================================
// GET — ATTENDANCE HISTORY / REPORT
// =======================================================

export async function GET(request: NextRequest) {
  try {
    await requirePermission(request, "attendance");

    const { searchParams } = new URL(request.url);

    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status") || "All";
    const departmentId = searchParams.get("departmentId");

    // ---------------------------------------------------
    // DATE FILTER
    // ---------------------------------------------------

    const dateFilter: {
      gte?: Date;
      lt?: Date;
    } = {};

    if (from) {
      const fromDate = new Date(`${from}T00:00:00`);

      if (!Number.isNaN(fromDate.getTime())) {
        dateFilter.gte = fromDate;
      }
    }

    if (to) {
      const toDate = new Date(`${to}T00:00:00`);

      if (!Number.isNaN(toDate.getTime())) {
        toDate.setDate(toDate.getDate() + 1);
        dateFilter.lt = toDate;
      }
    }

    // ---------------------------------------------------
    // USER FILTER
    // ---------------------------------------------------

    const userFilter: {
      OR?: Array<{
        name?: {
          contains: string;
          mode: "insensitive";
        };
        employeeId?: {
          contains: string;
          mode: "insensitive";
        };
        email?: {
          contains: string;
          mode: "insensitive";
        };
      }>;
      departmentId?: number;
    } = {};

    if (search) {
      userFilter.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          employeeId: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (departmentId) {
      const parsedDepartmentId = Number(departmentId);

      if (
        Number.isInteger(parsedDepartmentId) &&
        parsedDepartmentId > 0
      ) {
        userFilter.departmentId = parsedDepartmentId;
      }
    }

    // ---------------------------------------------------
    // ATTENDANCE FILTER
    // ---------------------------------------------------

    const where: {
      date?: {
        gte?: Date;
        lt?: Date;
      };
      status?: string;
      user?: typeof userFilter;
    } = {};

    if (Object.keys(dateFilter).length > 0) {
      where.date = dateFilter;
    }

    if (status !== "All") {
      where.status = status;
    }

    if (
      Object.keys(userFilter).length > 0
    ) {
      where.user = userFilter;
    }

    // ---------------------------------------------------
    // FETCH RECORDS
    // ---------------------------------------------------

    const attendance =
      await prisma.attendance.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              employeeId: true,
              name: true,
              email: true,
              role: true,
              status: true,

              department: {
                select: {
                  id: true,
                  name: true,
                },
              },

              team: {
                select: {
                  id: true,
                  name: true,
                },
              },
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

    // ---------------------------------------------------
    // REPORT SUMMARY
    // ---------------------------------------------------

    const totalRecords = attendance.length;

    const present = attendance.filter(
      (record) =>
        record.status === "Present"
    ).length;

    const late = attendance.filter(
      (record) =>
        record.status === "Late"
    ).length;

    const absent = attendance.filter(
      (record) =>
        record.status === "Absent"
    ).length;

    const onLeave = attendance.filter(
      (record) =>
        record.status === "On Leave"
    ).length;

    const remote = attendance.filter(
      (record) =>
        record.status === "Remote"
    ).length;

    const halfDay = attendance.filter(
      (record) =>
        record.status === "Half Day"
    ).length;

    const holiday = attendance.filter(
      (record) =>
        record.status === "Holiday"
    ).length;

    const completedRecords =
      attendance.filter(
        (record) =>
          record.workHours !== null &&
          record.workHours !== undefined
      );

    const totalHours =
      completedRecords.reduce(
        (sum, record) =>
          sum + (record.workHours ?? 0),
        0
      );

    const averageHours =
      completedRecords.length > 0
        ? Number(
            (
              totalHours /
              completedRecords.length
            ).toFixed(2)
          )
        : 0;

    return NextResponse.json({
      records: attendance,

      summary: {
        totalRecords,
        present,
        late,
        absent,
        onLeave,
        remote,
        halfDay,
        holiday,
        totalHours: Number(
          totalHours.toFixed(2)
        ),
        averageHours,
      },
    });
  } catch (error) {
    console.error(
      "GET /api/attendance/history failed:",
      error
    );

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

    if (
      error instanceof Error &&
      error.message === "FORBIDDEN"
    ) {
      return NextResponse.json(
        {
          error:
            "You do not have permission to access attendance history.",
        },
        {
          status: 403,
        }
      );
    }

    return NextResponse.json(
      {
        error:
          "Failed to load attendance history.",
      },
      {
        status: 500,
      }
    );
  }
}