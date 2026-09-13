import { NextRequest, NextResponse } from "next/server";

import { attendanceService } from "@/services/attendance.service";
import { requirePermission } from "@/lib/authorization";


// =======================================================
// POST - CLOCK OUT
// =======================================================

export async function POST(
  request: NextRequest
) {
  try {
    const authenticatedUser =
      await requirePermission(
        request,
        "attendance.update"
      );

    // ===================================================
    // ORGANIZATION CHECK
    // ===================================================

    if (
      authenticatedUser.organizationId === null
    ) {
      return NextResponse.json(
        {
          error:
            "Organization context is required.",
        },
        {
          status: 403,
        }
      );
    }

    // ===================================================
    // REQUEST BODY
    // ===================================================

    const body =
      await request.json();

    const attendanceId =
      Number(body.attendanceId);

    if (
      !Number.isInteger(
        attendanceId
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Valid attendance ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    // ===================================================
    // CLOCK OUT
    // ===================================================

    const attendance =
      await attendanceService.clockOut(
        attendanceId,
        authenticatedUser.organizationId
      );

    // ===================================================
    // SUCCESS
    // ===================================================

    return NextResponse.json(
      attendance,
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error(
      "POST /api/attendance/clock-out error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Failed to clock out.",
      },
      {
        status:
          error?.status || 500,
      }
    );
  }
}