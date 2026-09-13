import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  dashboardService,
} from "@/services/dashboard.service";

import {
  requirePermission,
} from "@/lib/authorization";

// =======================================================
// GET — DASHBOARD STATISTICS
// =======================================================

export async function GET(
  request: NextRequest
) {
  try {
    const authenticatedUser =
      await requirePermission(
        request,
        "dashboard"
      );

    const data =
      await dashboardService.getDashboardStats({
        scope:
          authenticatedUser.scope,

        organizationId:
          authenticatedUser.organizationId,
      });

    return NextResponse.json(
      data
    );
  } catch (error) {
    console.error(
      "GET /api/dashboard failed:",
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
            "You do not have permission to view the dashboard.",
        },
        {
          status: 403,
        }
      );
    }

    return NextResponse.json(
      {
        error:
          "Failed to load dashboard.",
      },
      {
        status: 500,
      }
    );
  }
}