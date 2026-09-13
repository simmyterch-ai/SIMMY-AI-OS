import { NextRequest, NextResponse } from "next/server";

import { departmentService } from "@/services/department.service";
import { requirePermission } from "@/lib/authorization";

// =======================================================
// ERROR RESPONSE HELPER
// =======================================================

function handleDepartmentError(
  error: unknown,
  fallbackMessage: string
) {
  const message =
    error instanceof Error
      ? error.message
      : "";

  if (message === "UNAUTHORIZED") {
    return NextResponse.json(
      {
        error: "Unauthorized.",
      },
      {
        status: 401,
      }
    );
  }

  if (
    message === "FORBIDDEN" ||
    message === "ORGANIZATION_CONTEXT_REQUIRED"
  ) {
    return NextResponse.json(
      {
        error: "Forbidden.",
      },
      {
        status: 403,
      }
    );
  }

  console.error(
    "Departments API error:",
    error
  );

  return NextResponse.json(
    {
      error: message || fallbackMessage,
    },
    {
      status: 500,
    }
  );
}

// =======================================================
// GET - ALL DEPARTMENTS
// =======================================================

export async function GET(
  request: NextRequest
) {
  try {
    const authenticatedUser =
      await requirePermission(
        request,
        "organization"
      );

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

    const departments =
      await departmentService.getDepartments(
        authenticatedUser.organizationId
      );

    return NextResponse.json(
      departments,
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    return handleDepartmentError(
      error,
      "Failed to fetch departments."
    );
  }
}

// =======================================================
// POST - CREATE DEPARTMENT
// =======================================================

export async function POST(
  request: NextRequest
) {
  try {
    const authenticatedUser =
      await requirePermission(
        request,
        "organization"
      );

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

    const body =
      await request.json();

    if (
      !body.name ||
      typeof body.name !== "string"
    ) {
      return NextResponse.json(
        {
          error:
            "Department name is required.",
        },
        {
          status: 400,
        }
      );
    }

    const department =
      await departmentService.createDepartment(
        authenticatedUser.organizationId,
        {
          departmentId:
            body.departmentId,

          name:
            body.name,

          manager:
            body.manager,

          employeeCount:
            body.employeeCount,

          location:
            body.location,

          description:
            body.description,

          status:
            body.status,
        }
      );

    return NextResponse.json(
      department,
      {
        status: 201,
      }
    );
  } catch (error: unknown) {
    return handleDepartmentError(
      error,
      "Failed to create department."
    );
  }
}
