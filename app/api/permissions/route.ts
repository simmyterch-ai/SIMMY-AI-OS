import { NextRequest, NextResponse } from "next/server";
import { permissionService } from "@/services/permission.service";
import { requirePermission } from "@/lib/authorization";

// =======================================================
// GET — LIST PERMISSIONS
// =======================================================

export async function GET(
  request: NextRequest
) {
  try {
    await requirePermission(
      request,
      "settings"
    );

    const permissions =
      await permissionService.findAll();

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
          message: "Authentication required.",
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
        message: "Failed to fetch permissions.",
      },
      {
        status: 500,
      }
    );
  }
}

// =======================================================
// POST — CREATE PERMISSION
// =======================================================

export async function POST(
  request: NextRequest
) {
  try {
    await requirePermission(
      request,
      "settings"
    );

    const body = await request.json();

    if (
      typeof body.name !== "string" ||
      body.name.trim().length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Permission name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof body.module !== "string" ||
      body.module.trim().length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Permission module is required.",
        },
        {
          status: 400,
        }
      );
    }

    const permission =
      await permissionService.create({
        name: body.name.trim(),
        module: body.module.trim(),
        description:
          typeof body.description === "string"
            ? body.description.trim()
            : undefined,
      });

    return NextResponse.json({
      success: true,
      permission,
      message:
        "Permission created successfully.",
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
          message: "Authentication required.",
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
            : "Failed to create permission.",
      },
      {
        status: 400,
      }
    );
  }
}