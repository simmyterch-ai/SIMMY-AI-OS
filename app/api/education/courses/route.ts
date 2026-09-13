import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const providerIdParam = searchParams.get("providerId");
    const category = searchParams.get("category");
    const deliveryMode = searchParams.get("deliveryMode");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");

    let providerId: number | undefined;

    if (providerIdParam) {
      const parsedProviderId = Number(providerIdParam);

      if (
        !Number.isInteger(parsedProviderId) ||
        parsedProviderId <= 0
      ) {
        return NextResponse.json(
          { error: "Invalid providerId" },
          { status: 400 }
        );
      }

      providerId = parsedProviderId;
    }

    const courses = await prisma.trainingCourse.findMany({
      where: {
        status: "PUBLISHED",

        ...(providerId !== undefined
          ? {
              providerId,
            }
          : {}),

        ...(category
          ? {
              category,
            }
          : {}),

        ...(deliveryMode
          ? {
              deliveryMode,
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
                  category: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  eligibility: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
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

      include: {
        provider: {
          select: {
            id: true,
            name: true,
            slug: true,
            type: true,
            country: true,
            city: true,
            verificationStatus: true,
          },
        },
      },
    });

    return NextResponse.json({
      courses,
      total: courses.length,
    });
  } catch (error) {
    console.error("Training courses GET error:", error);

    return NextResponse.json(
      {
        error: "Failed to load training courses",
      },
      {
        status: 500,
      }
    );
  }
}