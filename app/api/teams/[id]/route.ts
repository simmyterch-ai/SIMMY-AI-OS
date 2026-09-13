import {
  NextRequest,
  NextResponse,
} from "next/server";

import { teamService } from "@/services/team.service";
import { requirePermission } from "@/lib/authorization";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

// =======================================================
// GET — FETCH TEAM
// =======================================================

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    const authenticatedUser =
      await requirePermission(
        request,
        "settings"
      );

    if (
      authenticatedUser.organizationId === null
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

    const { id } = await params;
    const teamId = Number(id);

    if (!Number.isInteger(teamId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid team ID.",
        },
        {
          status: 400,
        }
      );
    }

    const team =
      await teamService.getTeam(
        teamId,
        organizationId
      );

    if (!team) {
      return NextResponse.json(
        {
          success: false,
          message: "Team not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      team,
    });
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      error.message === "UNAUTHORIZED"
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
      error.message === "FORBIDDEN"
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
          "Failed to fetch team.",
      },
      {
        status: 500,
      }
    );
  }
}

// =======================================================
// PUT — UPDATE TEAM
// =======================================================

export async function PUT(
  request: NextRequest,
  { params }: Params
) {
  try {
    const authenticatedUser =
      await requirePermission(
        request,
        "settings"
      );

    if (
      authenticatedUser.organizationId === null
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

    const { id } = await params;
    const teamId = Number(id);

    if (!Number.isInteger(teamId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid team ID.",
        },
        {
          status: 400,
        }
      );
    }

    const body =
      await request.json();

    if (
      typeof body.name !== "string" ||
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
      Number(body.departmentId);

    if (
      !Number.isInteger(departmentId)
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

    const data = {
      name: body.name.trim(),
      description:
        typeof body.description ===
        "string"
          ? body.description.trim()
          : null,
      departmentId,
    };

    const team =
      await teamService.updateTeam(
        teamId,
        organizationId,
        data
      );

    return NextResponse.json({
      success: true,
      team,
      message:
        "Team updated successfully.",
    });
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      error.message === "UNAUTHORIZED"
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
      error.message === "FORBIDDEN"
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
          error instanceof Error
            ? error.message
            : "Failed to update team.",
      },
      {
        status: 400,
      }
    );
  }
}

// =======================================================
// DELETE — DELETE TEAM
// =======================================================

export async function DELETE(
  request: NextRequest,
  { params }: Params
) {
  try {
    const authenticatedUser =
      await requirePermission(
        request,
        "settings"
      );

    if (
      authenticatedUser.organizationId === null
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

    const { id } = await params;
    const teamId = Number(id);

    if (!Number.isInteger(teamId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid team ID.",
        },
        {
          status: 400,
        }
      );
    }

    await teamService.deleteTeam(
      teamId,
      organizationId
    );

    return NextResponse.json({
      success: true,
      message:
        "Team deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      error.message === "UNAUTHORIZED"
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
      error.message === "FORBIDDEN"
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
          error instanceof Error
            ? error.message
            : "Failed to delete team.",
      },
      {
        status: 400,
      }
    );
  }
}
