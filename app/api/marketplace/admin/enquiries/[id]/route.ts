import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authorization";

// =======================================================
// ALLOWED MARKETPLACE ENQUIRY STATUSES
// =======================================================

const ALLOWED_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUOTED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
] as const;

type EnquiryStatus = (typeof ALLOWED_STATUSES)[number];

// =======================================================
// HELPERS
// =======================================================

function getErrorStatus(error: unknown) {
  if (
    error instanceof Error &&
    error.message === "UNAUTHORIZED"
  ) {
    return 401;
  }

  if (
    error instanceof Error &&
    error.message === "FORBIDDEN"
  ) {
    return 403;
  }

  if (
    error instanceof Error &&
    error.message === "ORGANIZATION_CONTEXT_REQUIRED"
  ) {
    return 403;
  }

  return 500;
}

// =======================================================
// PUT — UPDATE MARKETPLACE ENQUIRY STATUS
// PLATFORM USERS ONLY
// =======================================================

export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const user = await requirePermission(
      request,
      "dashboard"
    );

    if (user.scope !== "PLATFORM") {
      return NextResponse.json(
        {
          error:
            "Only platform administrators can update marketplace enquiries.",
        },
        {
          status: 403,
        }
      );
    }

    const { id } = await context.params;

    const enquiryId = Number(id);

    if (
      !Number.isInteger(enquiryId) ||
      enquiryId < 1
    ) {
      return NextResponse.json(
        {
          error: "Invalid enquiry ID.",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    const requestedStatus = String(
      body?.status ?? ""
    ).trim().toUpperCase();

    if (
      !ALLOWED_STATUSES.includes(
        requestedStatus as EnquiryStatus
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid enquiry status. Allowed statuses are NEW, CONTACTED, QUOTED, IN_PROGRESS, COMPLETED, and CANCELLED.",
        },
        {
          status: 400,
        }
      );
    }

    const existingEnquiry =
      await prisma.marketplaceEnquiry.findUnique({
        where: {
          id: enquiryId,
        },
      });

    if (!existingEnquiry) {
      return NextResponse.json(
        {
          error: "Marketplace enquiry not found.",
        },
        {
          status: 404,
        }
      );
    }

    const enquiry =
      await prisma.marketplaceEnquiry.update({
        where: {
          id: enquiryId,
        },
        data: {
          status: requestedStatus,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              category: true,
              imageUrl: true,
            },
          },
        },
      });

    return NextResponse.json({
      success: true,
      message: "Marketplace enquiry status updated successfully.",
      enquiry,
    });
  } catch (error) {
    console.error(
      "Marketplace enquiry status update error:",
      error
    );

    return NextResponse.json(
      {
        error:
          getErrorStatus(error) === 401
            ? "Authentication required."
            : getErrorStatus(error) === 403
            ? "You do not have permission to update marketplace enquiries."
            : "Failed to update marketplace enquiry status.",
      },
      {
        status: getErrorStatus(error),
      }
    );
  }
}