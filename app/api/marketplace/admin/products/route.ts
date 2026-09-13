import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authorization";

// =======================================================
// ADMIN MARKETPLACE PRODUCTS API
// PLATFORM USERS ONLY
// =======================================================

export async function GET(request: NextRequest) {
  try {
    const user = await requirePermission(
      request,
      "dashboard"
    );

    // Marketplace is a global SIMMY LINK AFRICA module.
    // Only PLATFORM administrators can view all products,
    // including DRAFT products.

    if (user.scope !== "PLATFORM") {
      return NextResponse.json(
        {
          error:
            "Only platform administrators can manage marketplace products.",
        },
        {
          status: 403,
        }
      );
    }

    const products =
      await prisma.marketplaceProduct.findMany({
        orderBy: [
          {
            featured: "desc",
          },
          {
            createdAt: "desc",
          },
        ],
      });

    return NextResponse.json(products);
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
            "You do not have permission to manage marketplace products.",
        },
        {
          status: 403,
        }
      );
    }

    return NextResponse.json(
      {
        error:
          "Failed to load marketplace products.",
      },
      {
        status: 500,
      }
    );
  }
}