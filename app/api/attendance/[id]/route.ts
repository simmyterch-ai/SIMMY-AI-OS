import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  attendanceService,
} from "@/services/attendance.service";

import {
  requirePermission,
} from "@/lib/authorization";

// =======================================================
// HELPERS
// =======================================================

function getErrorStatus(
  error: unknown
): number {
  if (
    error &&
    typeof error === "object" &&
    "status" in error
  ) {
    const status = Number(
      (error as { status?: unknown }).status
    );

    if (
      Number.isInteger(status) &&
      status >= 400 &&
      status <= 599
    ) {
      return status;
    }
  }

  if (
    error instanceof Error
  ) {
    const message =
      error.message.toLowerCase();

    if (
      message.includes(
        "unauthorized"
      ) ||
      message.includes(
        "authentication"
      ) ||
      message.includes(
        "not authenticated"
      ) ||
      message.includes(
        "authentication required"
      )
    ) {
      return 401;
    }

    if (
      message.includes(
        "forbidden"
      ) ||
      message.includes(
        "permission"
      ) ||
      message.includes(
        "not allowed"
      )
    ) {
      return 403;
    }

    if (
      error.message ===
      "ATTENDANCE_NOT_FOUND"
    ) {
      return 404;
    }
  }

  return 500;
}

function safeErrorMessage(
  error: unknown,
  fallback: string
): string {
  const status =
    getErrorStatus(error);

  if (status === 401) {
    return "Authentication required.";
  }

  if (status === 403) {
    return "You do not have permission to perform this action.";
  }

  if (
    error instanceof Error &&
    error.message ===
      "ATTENDANCE_NOT_FOUND"
  ) {
    return "Attendance record not found.";
  }

  return fallback;
}

async function getAttendanceId(
  context: {
    params: Promise<{
      id: string;
    }>;
  }
): Promise<number | null> {
  const { id } =
    await context.params;

  const attendanceId =
    Number(id);

  if (
    !Number.isInteger(
      attendanceId
    ) ||
    attendanceId <= 0
  ) {
    return null;
  }

  return attendanceId;
}

// =======================================================
// GET ONE ATTENDANCE
// =======================================================

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const authenticatedUser =
      await requirePermission(
        request,
        "attendance.view"
      );

    const organizationId =
      authenticatedUser.organizationId;

    if (
      organizationId === null
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

    const attendanceId =
      await getAttendanceId(
        context
      );

    if (
      attendanceId === null
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid attendance ID.",
        },
        {
          status: 400,
        }
      );
    }

    const attendance =
      await attendanceService.getAttendance(
        attendanceId,
        organizationId
      );

    if (!attendance) {
      return NextResponse.json(
        {
          error:
            "Attendance record not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      attendance,
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    const status =
      getErrorStatus(error);

    console.error(
      "GET /api/attendance/[id] error:",
      error
    );

    return NextResponse.json(
      {
        error: safeErrorMessage(
          error,
          "Failed to fetch attendance."
        ),
      },
      {
        status,
      }
    );
  }
}

// =======================================================
// PUT - UPDATE ATTENDANCE
// =======================================================

export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const authenticatedUser =
      await requirePermission(
        request,
        "attendance.update"
      );

    const organizationId =
      authenticatedUser.organizationId;

    if (
      organizationId === null
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

    const attendanceId =
      await getAttendanceId(
        context
      );

    if (
      attendanceId === null
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid attendance ID.",
        },
        {
          status: 400,
        }
      );
    }

    let body: unknown;

    try {
      body =
        await request.json();
    } catch {
      return NextResponse.json(
        {
          error:
            "Invalid JSON request.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid request body.",
        },
        {
          status: 400,
        }
      );
    }

    const data =
      body as Record<
        string,
        unknown
      >;

    const existingAttendance =
      await attendanceService.getAttendance(
        attendanceId,
        organizationId
      );

    if (!existingAttendance) {
      return NextResponse.json(
        {
          error:
            "Attendance record not found.",
        },
        {
          status: 404,
        }
      );
    }

    const parseDate =
      (
        value: unknown
      ): Date | null | undefined => {
        if (value === null) {
          return null;
        }

        if (
          typeof value ===
          "string"
        ) {
          const date =
            new Date(value);

          if (
            !Number.isNaN(
              date.getTime()
            )
          ) {
            return date;
          }
        }

        return undefined;
      };

    const attendance =
      await attendanceService.updateAttendance(
        attendanceId,
        organizationId,
        {
          clockIn:
            data.clockIn !==
            undefined
              ? parseDate(
                  data.clockIn
                )
              : undefined,

          clockOut:
            data.clockOut !==
            undefined
              ? parseDate(
                  data.clockOut
                )
              : undefined,

          breakStart:
            data.breakStart !==
            undefined
              ? parseDate(
                  data.breakStart
                )
              : undefined,

          breakEnd:
            data.breakEnd !==
            undefined
              ? parseDate(
                  data.breakEnd
                )
              : undefined,

          workHours:
            typeof data.workHours ===
            "number"
              ? data.workHours
              : data.workHours === null
                ? null
                : undefined,

          status:
            typeof data.status ===
            "string"
              ? data.status
              : undefined,

          remarks:
            typeof data.remarks ===
            "string"
              ? data.remarks
              : data.remarks === null
                ? null
                : undefined,
        }
      );

    return NextResponse.json(
      attendance,
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    const status =
      getErrorStatus(error);

    console.error(
      "PUT /api/attendance/[id] error:",
      error
    );

    return NextResponse.json(
      {
        error: safeErrorMessage(
          error,
          "Failed to update attendance."
        ),
      },
      {
        status,
      }
    );
  }
}

// =======================================================
// DELETE ATTENDANCE
// =======================================================

export async function DELETE(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const authenticatedUser =
      await requirePermission(
        request,
        "attendance.delete"
      );

    const organizationId =
      authenticatedUser.organizationId;

    if (
      organizationId === null
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

    const attendanceId =
      await getAttendanceId(
        context
      );

    if (
      attendanceId === null
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid attendance ID.",
        },
        {
          status: 400,
        }
      );
    }

    const attendance =
      await attendanceService.getAttendance(
        attendanceId,
        organizationId
      );

    if (!attendance) {
      return NextResponse.json(
        {
          error:
            "Attendance record not found.",
        },
        {
          status: 404,
        }
      );
    }

    await attendanceService.deleteAttendance(
      attendanceId,
      organizationId
    );

    return NextResponse.json(
      {
        message:
          "Attendance deleted successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    const status =
      getErrorStatus(error);

    console.error(
      "DELETE /api/attendance/[id] error:",
      error
    );

    return NextResponse.json(
      {
        error: safeErrorMessage(
          error,
          "Failed to delete attendance."
        ),
      },
      {
        status,
      }
    );
  }
}