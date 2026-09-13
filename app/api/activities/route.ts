import { NextRequest, NextResponse } from "next/server";
import { activityService } from "@/services/activity.service";
import { requirePermission } from "@/lib/authorization";

// =======================================================
// GET — LOAD LATEST ACTIVITIES
// =======================================================

export async function GET(
  request: NextRequest
) {
  try {
    await requirePermission(
      request,
      "dashboard"
    );

    const activities =
      await activityService.getLatestActivities();

    return NextResponse.json(activities);
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      error.message === "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        {
          error: "Authentication required.",
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
            "You do not have permission to view organizational activities.",
        },
        {
          status: 403,
        }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to load activities.",
      },
      {
        status: 500,
      }
    );
  }
}