import { NextRequest, NextResponse } from "next/server";

import { attendanceService } from "@/services/attendance.service";
import { requirePermission } from "@/lib/authorization";


// =======================================================
// CLOCK OUT
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

    // Organization users must have an organization.
    // Super Admin has organizationId = null and therefore
    // cannot perform organization-level attendance actions.
    const organizationId =
      authenticatedUser.organizationId;

    if (organizationId === null) {
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

    const attendance =
      await attendanceService.clockOut(
        attendanceId,
        organizationId
      );

    return NextResponse.json(
      attendance
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
          error?.status ||
          500,
      }
    );
  }
}