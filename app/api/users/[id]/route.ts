import {
  NextRequest,
  NextResponse,
} from "next/server";

import { userService } from "@/services/user.service";
import {
  requirePermission,
  requireOrganizationId,
} from "@/lib/authorization";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// =======================================================
// GET /api/users/:id
// =======================================================

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const authenticatedUser =
      await requirePermission(
        request,
        "people"
      );

    const { id } = await params;

    const user =
      await userService.getUser(
        Number(id),
        {
          scope: authenticatedUser.scope,
          organizationId:
            authenticatedUser.organizationId,
        }
      );

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);

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
            "You do not have permission to access people.",
        },
        {
          status: 403,
        }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to fetch user.",
      },
      {
        status: 500,
      }
    );
  }
}

// =======================================================
// PUT /api/users/:id
// =======================================================

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const authenticatedUser =
      await requirePermission(
        request,
        "people"
      );

    // Require a real organization for this operation.
    const organizationId =
      requireOrganizationId(
        authenticatedUser
      );

    // Get user ID from URL
    const { id } = await params;

    const userId = Number(id);

    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      return NextResponse.json(
        {
          error: "Invalid user ID.",
        },
        {
          status: 400,
        }
      );
    }

    // Read request body
    const body = await request.json();

    // ---------------------------------------------------
    // Validate department
    // ---------------------------------------------------

    const departmentId = Number(
      body.departmentId
    );

    if (
      !Number.isInteger(departmentId) ||
      departmentId <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "A valid department is required.",
        },
        {
          status: 400,
        }
      );
    }

    // ---------------------------------------------------
    // Validate team
    // ---------------------------------------------------

    const teamId =
      body.teamId === null ||
      body.teamId === undefined ||
      body.teamId === ""
        ? null
        : Number(body.teamId);

    if (
      teamId !== null &&
      (!Number.isInteger(teamId) ||
        teamId <= 0)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid team selected.",
        },
        {
          status: 400,
        }
      );
    }

    // ---------------------------------------------------
    // Validate required fields
    // ---------------------------------------------------

    if (
      typeof body.name !== "string" ||
      !body.name.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Employee name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof body.email !== "string" ||
      !body.email.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Employee email is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof body.role !== "string" ||
      !body.role.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Employee role is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof body.status !== "string" ||
      !body.status.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Employee status is required.",
        },
        {
          status: 400,
        }
      );
    }

    // ---------------------------------------------------
    // UPDATE USER
    // ---------------------------------------------------

    const user =
      await userService.updateUser(
        userId,
        {
          name: body.name.trim(),
          email: body.email.trim(),
          phone:
            body.phone?.trim() || null,
          location:
            body.location?.trim() || null,
          avatar:
            body.avatar || null,
          role: body.role,
          status: body.status,
          departmentId,
          teamId,
        },
        organizationId
      );

    return NextResponse.json(user);
  } catch (error) {
    console.error(
      "PUT /api/users/[id] failed:",
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
            "You do not have permission to manage people.",
        },
        {
          status: 403,
        }
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "ORGANIZATION_CONTEXT_REQUIRED"
    ) {
      return NextResponse.json(
        {
          error:
            "An organization context is required for this operation.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      error instanceof Error &&
      error.message === "USER_NOT_FOUND"
    ) {
      return NextResponse.json(
        {
          error: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update user.",
      },
      {
        status: 500,
      }
    );
  }
}

// =======================================================
// DELETE /api/users/:id
// =======================================================

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const authenticatedUser =
      await requirePermission(
        request,
        "people"
      );

    // Require a real organization for this operation.
    const organizationId =
      requireOrganizationId(
        authenticatedUser
      );

    const { id } = await params;

    const userId = Number(id);

    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      return NextResponse.json(
        {
          error: "Invalid user ID.",
        },
        {
          status: 400,
        }
      );
    }

    await userService.deleteUser(
      userId,
      organizationId
    );

    return NextResponse.json(
      {
        message:
          "User deleted successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "DELETE /api/users/[id] failed:",
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
            "You do not have permission to delete people.",
        },
        {
          status: 403,
        }
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "ORGANIZATION_CONTEXT_REQUIRED"
    ) {
      return NextResponse.json(
        {
          error:
            "An organization context is required for this operation.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      error instanceof Error &&
      error.message === "USER_NOT_FOUND"
    ) {
      return NextResponse.json(
        {
          error: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete user.",
      },
      {
        status: 500,
      }
    );
  }
}