import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authorization";

// =======================================================
// GET — MARKETPLACE ENQUIRIES
// PLATFORM USERS ONLY
// =======================================================

export async function GET(request: NextRequest) {
  try {
    const user = await requirePermission(
      request,
      "dashboard"
    );

    // Marketplace is a global SIMMY LINK AFRICA module.
    // Enquiry management is restricted to PLATFORM users.

    if (user.scope !== "PLATFORM") {
      return NextResponse.json(
        {
          error:
            "Only platform administrators can manage marketplace enquiries.",
        },
        {
          status: 403,
        }
      );
    }

    const { searchParams } =
      new URL(request.url);

    const status =
      searchParams.get("status");

    const search =
      searchParams.get("search");

    const where = {
      ...(status &&
      status !== "ALL"
        ? {
            status,
          }
        : {}),

      ...(search
        ? {
            OR: [
              {
                customerName: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                email: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                phone: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                country: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                productName: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                message: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
    };

    const enquiries =
      await prisma.marketplaceEnquiry.findMany({
        where,
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
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(
      enquiries
    );
  } catch (error) {
    console.error(
      "Marketplace enquiries GET error:",
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
            "You do not have permission to manage marketplace enquiries.",
        },
        {
          status: 403,
        }
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "ORGANIZATION_CONTEXT_REQUIRED"
    ) {
      return NextResponse.json(
        {
          error:
            "Platform administration context is required.",
        },
        {
          status: 403,
        }
      );
    }

    return NextResponse.json(
      {
        error:
          "Failed to load marketplace enquiries.",
      },
      {
        status: 500,
      }
    );
  }
}