import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const providerIdParam = searchParams.get("providerId");
    const level = searchParams.get("level");
    const fieldOfStudy = searchParams.get("fieldOfStudy");
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

    const programs = await prisma.educationProgram.findMany({
      where: {
        status: "PUBLISHED",

        ...(providerId !== undefined
          ? {
              providerId,
            }
          : {}),

        ...(level
          ? {
              level,
            }
          : {}),

        ...(fieldOfStudy
          ? {
              fieldOfStudy,
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
                  fieldOfStudy: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  level: {
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
      programs,
      total: programs.length,
    });
  } catch (error) {
    console.error("Education programs GET error:", error);

    return NextResponse.json(
      {
        error: "Failed to load education programs",
      },
      {
        status: 500,
      }
    );
  }
}