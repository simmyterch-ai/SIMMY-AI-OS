import {
  NextRequest,
  NextResponse,
} from "next/server";

import { roleService } from "@/services/role.service";
import { requirePermission } from "@/lib/authorization";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

// =======================================================
// GET — GET ROLE PERMISSIONS
// =======================================================

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    const user = await requirePermission(
      request,
      "settings"
    );

    if (user.organizationId === null) {
      return NextResponse.json(
        {
          success: false,
          message: "Organization is required.",
        },
        {
          status: 403,
        }
      );
    }

    const organizationId =
      user.organizationId;

    const { id } = await params;
    const roleId = Number(id);

    if (!Number.isInteger(roleId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid role ID.",
        },
        {
          status: 400,
        }
      );
    }

    const permissions =
      await roleService.getPermissions(
        roleId,
        organizationId
      );

    return NextResponse.json({
      success: true,
      permissions,
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
            "You do not have permission to manage roles and permissions.",
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
            : "Failed to fetch role permissions.",
      },
      {
        status: 500,
      }
    );
  }
}

// =======================================================
// PUT — UPDATE ROLE PERMISSIONS
// =======================================================

export async function PUT(
  request: NextRequest,
  { params }: Params
) {
  try {
    const user = await requirePermission(
      request,
      "settings"
    );

    if (user.organizationId === null) {
      return NextResponse.json(
        {
          success: false,
          message: "Organization is required.",
        },
        {
          status: 403,
        }
      );
    }

    const organizationId =
      user.organizationId;

    const { id } = await params;
    const roleId = Number(id);

    if (!Number.isInteger(roleId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid role ID.",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    if (!Array.isArray(body.permissionIds)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "permissionIds must be an array.",
        },
        {
          status: 400,
        }
      );
    }

    const permissionIds =
      body.permissionIds.filter(
        (id: unknown): id is number =>
          typeof id === "number" &&
          Number.isInteger(id)
      );

    const permissions =
      await roleService.updatePermissions(
        roleId,
        organizationId,
        permissionIds
      );

    return NextResponse.json({
      success: true,
      permissions,
      message:
        "Role permissions updated successfully.",
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
            "You do not have permission to manage roles and permissions.",
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
            : "Failed to update role permissions.",
      },
      {
        status: 400,
      }
    );
  }
}

// =======================================================
// POST — ASSIGN ROLE PERMISSIONS
// =======================================================

export async function POST(
  request: NextRequest,
  { params }: Params
) {
  try {
    const user = await requirePermission(
      request,
      "settings"
    );

    if (user.organizationId === null) {
      return NextResponse.json(
        {
          success: false,
          message: "Organization is required.",
        },
        {
          status: 403,
        }
      );
    }

    const organizationId =
      user.organizationId;

    const { id } = await params;
    const roleId = Number(id);

    if (!Number.isInteger(roleId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid role ID.",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    if (!Array.isArray(body.permissionIds)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "permissionIds must be an array.",
        },
        {
          status: 400,
        }
      );
    }

    const permissionIds =
      body.permissionIds.filter(
        (id: unknown): id is number =>
          typeof id === "number" &&
          Number.isInteger(id)
      );

    const permissions =
      await roleService.assignPermissions(
        roleId,
        organizationId,
        permissionIds
      );

    return NextResponse.json({
      success: true,
      permissions,
      message:
        "Permissions assigned successfully.",
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
            "You do not have permission to manage roles and permissions.",
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
            : "Failed to assign permissions.",
      },
      {
        status: 400,
      }
    );
  }
}

// =======================================================
// DELETE — CLEAR ROLE PERMISSIONS
// =======================================================

export async function DELETE(
  request: NextRequest,
  { params }: Params
) {
  try {
    const user = await requirePermission(
      request,
      "settings"
    );

    if (user.organizationId === null) {
      return NextResponse.json(
        {
          success: false,
          message: "Organization is required.",
        },
        {
          status: 403,
        }
      );
    }

    const organizationId =
      user.organizationId;

    const { id } = await params;
    const roleId = Number(id);

    if (!Number.isInteger(roleId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid role ID.",
        },
        {
          status: 400,
        }
      );
    }

    await roleService.clearPermissions(
      roleId,
      organizationId
    );

    return NextResponse.json({
      success: true,
      message:
        "Role permissions cleared successfully.",
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
            "You do not have permission to manage roles and permissions.",
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
            : "Failed to clear role permissions.",
      },
      {
        status: 400,
      }
    );
  }
}