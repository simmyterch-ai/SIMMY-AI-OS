import { NextRequest, NextResponse } from "next/server";
import { organizationService } from "@/services/organization.service";
import { requirePermission } from "@/lib/authorization";

// =======================================================
// GET — FETCH ORGANIZATION
// =======================================================

export async function GET(
  request: NextRequest
) {
  try {
    await requirePermission(
      request,
      "organization"
    );

    const organization =
      await organizationService.getOrganization();

    return NextResponse.json({
      success: true,
      organization,
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
            "You do not have permission to access the organization.",
        },
        {
          status: 403,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch organization.",
      },
      {
        status: 500,
      }
    );
  }
}

// =======================================================
// POST — SAVE ORGANIZATION
// =======================================================

export async function POST(
  request: NextRequest
) {
  try {
    await requirePermission(
      request,
      "organization"
    );

    const body = await request.json();

    const organization =
      await organizationService.saveOrganization(
        body
      );

    return NextResponse.json({
      success: true,
      organization,
      message:
        "Organization saved successfully.",
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
            "You do not have permission to modify the organization.",
        },
        {
          status: 403,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save organization.",
      },
      {
        status: 500,
      }
    );
  }
}