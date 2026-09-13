import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  attendanceService,
} from "@/services/attendance.service";

import {
  requireOrganizationPermission,
} from "@/lib/authorization";

// =======================================================
// GET - TODAY'S ATTENDANCE
// =======================================================

export async function GET(
  request: NextRequest
) {
  try {
    const authenticatedUser =
      await requireOrganizationPermission(
        request,
        "attendance.view"
      );

    const attendance =
      await attendanceService.getTodayAttendance(
        authenticatedUser.organizationId
      );

    return NextResponse.json(
      attendance,
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error(
      "GET /api/attendance error:",
      error
    );

    const message =
      error?.message ||
      "Failed to fetch attendance.";

    let status = 500;

    if (message === "UNAUTHORIZED") {
      status = 401;
    }

    if (message === "FORBIDDEN") {
      status = 403;
    }

    if (
      message ===
      "ORGANIZATION_CONTEXT_REQUIRED"
    ) {
      status = 403;
    }

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      {
        status,
      }
    );
  }
}

// =======================================================
// POST - CLOCK IN
// =======================================================

export async function POST(
  request: NextRequest
) {
  try {
    const authenticatedUser =
      await requireOrganizationPermission(
        request,
        "attendance.create"
      );

    const body =
      await request.json();

    const userId =
      Number(body?.userId);

    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A valid employee is required.",
        },
        {
          status: 400,
        }
      );
    }

    const attendance =
      await attendanceService.clockIn(
        userId,
        authenticatedUser.organizationId
      );

    return NextResponse.json(
      {
        success: true,
        message:
          "Employee clocked in successfully.",
        attendance,
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    console.error(
      "POST /api/attendance error:",
      error
    );

    const message =
      error?.message ||
      "Failed to clock in.";

    let status = 500;

    // ===================================================
    // AUTHORIZATION ERRORS
    // ===================================================

    if (message === "UNAUTHORIZED") {
      status = 401;
    }

    if (message === "FORBIDDEN") {
      status = 403;
    }

    if (
      message ===
      "ORGANIZATION_CONTEXT_REQUIRED"
    ) {
      status = 403;
    }

    // ===================================================
    // ATTENDANCE ERRORS
    // ===================================================

    if (
      message ===
      "Employee not found."
    ) {
      status = 404;
    }

    if (
      message ===
      "Only active employees can clock in."
    ) {
      status = 400;
    }

    if (
      message ===
      "Employee has already clocked in today."
    ) {
      status = 409;
    }

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      {
        status,
      }
    );
  }
}