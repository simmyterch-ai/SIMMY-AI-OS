import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category") || undefined;
    const country = searchParams.get("country") || undefined;
    const search = searchParams.get("search") || undefined;
    const featured = searchParams.get("featured");

    const businesses = await prisma.business.findMany({
      where: {
        status: "PUBLISHED",

        ...(category
          ? {
              category: {
                equals: category,
                mode: "insensitive",
              },
            }
          : {}),

        ...(country
          ? {
              country: {
                equals: country,
                mode: "insensitive",
              },
            }
          : {}),

        ...(search
          ? {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  category: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  services: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),

        ...(featured === "true"
          ? {
              featured: true,
            }
          : {}),
      },

      orderBy: [
        {
          featured: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    return NextResponse.json({
      businesses,
      total: businesses.length,
    });
  } catch (error) {
    console.error("GET /api/businesses error:", error);

    return NextResponse.json(
      {
        error: "Failed to load businesses",
      },
      { status: 500 }
    );
  }
}