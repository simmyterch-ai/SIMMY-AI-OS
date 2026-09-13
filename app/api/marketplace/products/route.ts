import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authorization";

// =======================================================
// GET — PUBLIC MARKETPLACE PRODUCTS
// =======================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");

    const where = {
      status: "PUBLISHED",

      ...(category
        ? {
            category: category,
          }
        : {}),

      ...(featured === "true"
        ? {
            featured: true,
          }
        : {}),

      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                description: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                category: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
    };

    const products = await prisma.marketplaceProduct.findMany({
      where,
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

    return NextResponse.json(
      {
        error: "Failed to load marketplace products.",
      },
      {
        status: 500,
      }
    );
  }
}

// =======================================================
// POST — CREATE MARKETPLACE PRODUCT
// PLATFORM USERS ONLY
// =======================================================

export async function POST(request: NextRequest) {
  try {
    const user = await requirePermission(
      request,
      "dashboard"
    );

    // Marketplace is a global SIMMY LINK AFRICA module.
    // Product management is restricted to PLATFORM users.

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

    const body = await request.json();

    const {
      name,
      slug,
      category,
      description,
      imageUrl,
      status,
      featured,
    } = body;

    if (
      !name ||
      !slug ||
      !category ||
      !description ||
      !imageUrl
    ) {
      return NextResponse.json(
        {
          error:
            "Name, slug, category, description, and imageUrl are required.",
        },
        {
          status: 400,
        }
      );
    }

    const cleanName = String(name).trim();
    const cleanSlug = String(slug).trim();
    const cleanCategory = String(category).trim();
    const cleanDescription = String(description).trim();
    const cleanImageUrl = String(imageUrl).trim();

    if (
      !cleanName ||
      !cleanSlug ||
      !cleanCategory ||
      !cleanDescription ||
      !cleanImageUrl
    ) {
      return NextResponse.json(
        {
          error:
            "Name, slug, category, description, and imageUrl cannot be empty.",
        },
        {
          status: 400,
        }
      );
    }

    const existingProduct =
      await prisma.marketplaceProduct.findUnique({
        where: {
          slug: cleanSlug,
        },
      });

    if (existingProduct) {
      return NextResponse.json(
        {
          error:
            "A marketplace product with this slug already exists.",
        },
        {
          status: 409,
        }
      );
    }

    const product =
      await prisma.marketplaceProduct.create({
        data: {
          name: cleanName,
          slug: cleanSlug,
          category: cleanCategory,
          description: cleanDescription,
          imageUrl: cleanImageUrl,
          status:
            status === "PUBLISHED"
              ? "PUBLISHED"
              : "DRAFT",
          featured: Boolean(featured),
        },
      });

    return NextResponse.json(product, {
      status: 201,
    });
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
        error: "Failed to create marketplace product.",
      },
      {
        status: 500,
      }
    );
  }
}