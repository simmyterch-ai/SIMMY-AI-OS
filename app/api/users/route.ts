import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  userService,
} from "@/services/user.service";

import {
  requirePermission,
} from "@/lib/authorization";

// =======================================================
// GET — LIST PEOPLE
// =======================================================

export async function GET(
  request: NextRequest
) {
  try {
    const authenticatedUser =
      await requirePermission(
        request,
        "people"
      );

    const users =
      await userService.getUsers({
        scope:
          authenticatedUser.scope,

        organizationId:
          authenticatedUser.organizationId,
      });

    return NextResponse.json(
      users
    );
  } catch (error) {
    console.error(
      "GET /api/users failed:",
      error
    );

    if (
      error instanceof Error &&
      error.message ===
        "UNAUTHORIZED"
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
      error.message ===
        "FORBIDDEN"
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
        error:
          "Failed to fetch users.",
      },
      {
        status: 500,
      }
    );
  }
}

// =======================================================
// POST — CREATE PERSON
// =======================================================

export async function POST(
  request: NextRequest
) {
  try {
    const authenticatedUser =
      await requirePermission(
        request,
        "people"
      );

    // -----------------------------------------------------
    // Organization users only
    // -----------------------------------------------------

    if (
      authenticatedUser.scope !==
        "ORGANIZATION" ||
      authenticatedUser.organizationId ===
        null
    ) {
      return NextResponse.json(
        {
          error:
            "Users can only be created within an organization.",
        },
        {
          status: 403,
        }
      );
    }

    const body =
      await request.json();

    const user =
      await userService.createUser(
        {
          employeeId:
            body.employeeId ??
            `SAP-${Date.now()
              .toString()
              .slice(-6)}`,

          name:
            body.name,

          email:
            body.email,

          phone:
            body.phone ??
            null,

          location:
            body.location ??
            null,

          avatar:
            body.avatar ??
            null,

          role:
            body.role,

          status:
            body.status,

          departmentId:
            Number(
              body.departmentId
            ),

          teamId:
            body.teamId
              ? Number(
                  body.teamId
                )
              : null,
        },

        authenticatedUser.organizationId
      );

    return NextResponse.json(
      user,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/users failed:",
      error
    );

    if (
      error instanceof Error &&
      error.message ===
        "UNAUTHORIZED"
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
      error.message ===
        "FORBIDDEN"
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

    return NextResponse.json(
      {
        error:
          "Failed to create user.",
      },
      {
        status: 500,
      }
    );
  }
}