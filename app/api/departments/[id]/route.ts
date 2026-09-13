import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  departmentService,
} from "@/services/department.service";

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
      "Department not found."
  ) {
    return error.message;
  }

  return fallback;
}

async function getDepartmentId(
  context: {
    params: Promise<{
      id: string;
    }>;
  }
): Promise<number | null> {
  const { id } =
    await context.params;

  const departmentId =
    Number(id);

  if (
    !Number.isInteger(
      departmentId
    ) ||
    departmentId <= 0
  ) {
    return null;
  }

  return departmentId;
}

// =======================================================
// GET - GET ONE DEPARTMENT
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
        "departments.view"
      );

    if (
      authenticatedUser.organizationId ===
      null
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

    const departmentId =
      await getDepartmentId(
        context
      );

    if (
      departmentId === null
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid department ID.",
        },
        {
          status: 400,
        }
      );
    }

    const department =
      await departmentService.getDepartment(
        departmentId,
        authenticatedUser.organizationId
      );

    if (!department) {
      return NextResponse.json(
        {
          error:
            "Department not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      department,
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    const status =
      getErrorStatus(error);

    console.error(
      "GET /api/departments/[id] error:",
      error
    );

    return NextResponse.json(
      {
        error: safeErrorMessage(
          error,
          "Failed to fetch department."
        ),
      },
      {
        status,
      }
    );
  }
}

// =======================================================
// PUT - UPDATE DEPARTMENT
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
        "departments.update"
      );

    if (
      authenticatedUser.organizationId ===
      null
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

    const departmentId =
      await getDepartmentId(
        context
      );

    if (
      departmentId === null
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid department ID.",
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

    const existingDepartment =
      await departmentService.getDepartment(
        departmentId,
        authenticatedUser.organizationId
      );

    if (!existingDepartment) {
      return NextResponse.json(
        {
          error:
            "Department not found.",
        },
        {
          status: 404,
        }
      );
    }

    const department =
      await departmentService.updateDepartment(
        departmentId,
        authenticatedUser.organizationId,
        {
          departmentId:
            typeof data.departmentId ===
            "string"
              ? data.departmentId
              : data.departmentId ===
                null
                ? null
                : undefined,

          name:
            typeof data.name ===
            "string"
              ? data.name
              : undefined,

          manager:
            typeof data.manager ===
            "string"
              ? data.manager
              : data.manager === null
                ? null
                : undefined,

          employeeCount:
            typeof data.employeeCount ===
            "number"
              ? data.employeeCount
              : undefined,

          location:
            typeof data.location ===
            "string"
              ? data.location
              : data.location === null
                ? null
                : undefined,

          description:
            typeof data.description ===
            "string"
              ? data.description
              : data.description === null
                ? null
                : undefined,

          status:
            typeof data.status ===
            "string"
              ? data.status
              : undefined,
        }
      );

    return NextResponse.json(
      department,
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    const status =
      getErrorStatus(error);

    console.error(
      "PUT /api/departments/[id] error:",
      error
    );

    return NextResponse.json(
      {
        error: safeErrorMessage(
          error,
          "Failed to update department."
        ),
      },
      {
        status,
      }
    );
  }
}

// =======================================================
// DELETE - DELETE DEPARTMENT
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
        "departments.delete"
      );

    if (
      authenticatedUser.organizationId ===
      null
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

    const departmentId =
      await getDepartmentId(
        context
      );

    if (
      departmentId === null
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid department ID.",
        },
        {
          status: 400,
        }
      );
    }

    const existingDepartment =
      await departmentService.getDepartment(
        departmentId,
        authenticatedUser.organizationId
      );

    if (!existingDepartment) {
      return NextResponse.json(
        {
          error:
            "Department not found.",
        },
        {
          status: 404,
        }
      );
    }

    await departmentService.deleteDepartment(
      departmentId,
      authenticatedUser.organizationId
    );

    return NextResponse.json(
      {
        message:
          "Department deleted successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    const status =
      getErrorStatus(error);

    console.error(
      "DELETE /api/departments/[id] error:",
      error
    );

    return NextResponse.json(
      {
        error: safeErrorMessage(
          error,
          "Failed to delete department."
        ),
      },
      {
        status,
      }
    );
  }
}