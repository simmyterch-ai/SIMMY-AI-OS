import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// =======================================================
// GET — PUBLIC OPPORTUNITIES
// =======================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const type = searchParams.get("type");
    const country = searchParams.get("country");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");

    const where = {
      status: "PUBLISHED",

      ...(type
        ? {
            type,
          }
        : {}),

      ...(country
        ? {
            country: {
              equals: country,
              mode: "insensitive" as const,
            },
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
                title: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                organizationName: {
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
                country: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                type: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
    };

    const opportunities =
      await prisma.opportunity.findMany({
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

    return NextResponse.json(opportunities);
  } catch (error) {
    console.error(
      "Public opportunities GET error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load opportunities.",
      },
      {
        status: 500,
      }
    );
  }
}