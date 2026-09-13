import {
  NextRequest,
  NextResponse,
} from "next/server";

import { roleService } from "@/services/role.service";
import { requirePermission } from "@/lib/authorization";

// =======================================================
// GET — GET ALL ROLES
// =======================================================

export async function GET(
  request: NextRequest
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

    const roles =
      await roleService.findAll(
        organizationId
      );

    return NextResponse.json({
      success: true,
      roles,
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
            : "Failed to fetch roles.",
      },
      {
        status: 500,
      }
    );
  }
}

// =======================================================
// POST — CREATE ROLE
// =======================================================

export async function POST(
  request: NextRequest
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

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : undefined;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Role name is required.",
        },
        {
          status: 400,
        }
      );
    }

    const role =
      await roleService.create({
        name,
        description,
        organizationId,
      });

    return NextResponse.json(
      {
        success: true,
        role,
        message:
          "Role created successfully.",
      },
      {
        status: 201,
      }
    );
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
            : "Failed to create role.",
      },
      {
        status: 400,
      }
    );
  }
}