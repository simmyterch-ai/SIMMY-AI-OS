import {
  NextRequest,
  NextResponse,
} from "next/server";

import { teamService } from "@/services/team.service";
import { requirePermission } from "@/lib/authorization";

// =======================================================
// GET — FETCH ALL TEAMS
// =======================================================

export async function GET(
  request: NextRequest
) {
  try {
    const authenticatedUser =
      await requirePermission(
        request,
        "settings"
      );

    if (
      authenticatedUser.organizationId ===
      null
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Organization context is required.",
        },
        {
          status: 403,
        }
      );
    }

    const organizationId =
      authenticatedUser.organizationId;

    const teams =
      await teamService.getTeams(
        organizationId
      );

    /*
     * IMPORTANT:
     * Return the array directly because the
     * frontend expects Team[].
     */
    return NextResponse.json(
      Array.isArray(teams)
        ? teams
        : []
    );
  } catch (error) {
    console.error(
      "GET /api/teams failed:",
      error
    );

    if (
      error instanceof Error &&
      error.message ===
        "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
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
          success: false,
          message:
            "You do not have permission to manage teams.",
        },
        {
          status: 403,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch teams.",
      },
      {
        status: 500,
      }
    );
  }
}

// =======================================================
// POST — CREATE TEAM
// =======================================================

export async function POST(
  request: NextRequest
) {
  try {
    const authenticatedUser =
      await requirePermission(
        request,
        "settings"
      );

    if (
      authenticatedUser.organizationId ===
      null
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Organization context is required.",
        },
        {
          status: 403,
        }
      );
    }

    const organizationId =
      authenticatedUser.organizationId;

    const body =
      await request.json();

    if (
      typeof body.name !==
        "string" ||
      !body.name.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Team name is required.",
        },
        {
          status: 400,
        }
      );
    }

    const departmentId =
      Number(
        body.departmentId
      );

    if (
      !Number.isInteger(
        departmentId
      ) ||
      departmentId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Valid department ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const team =
      await teamService.createTeam(
        organizationId,
        {
          name:
            body.name.trim(),

          description:
            typeof body.description ===
            "string"
              ? body.description.trim()
              : null,

          departmentId,
        }
      );

    return NextResponse.json(
      team,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/teams failed:",
      error
    );

    if (
      error instanceof Error &&
      error.message ===
        "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
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
          success: false,
          message:
            "You do not have permission to manage teams.",
        },
        {
          status: 403,
        }
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "TEAM_NAME_ALREADY_EXISTS"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A team with this name already exists in your organization.",
        },
        {
          status: 409,
        }
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "DEPARTMENT_NOT_FOUND"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The selected department does not belong to your organization.",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create team.",
      },
      {
        status: 400,
      }
    );
  }
}