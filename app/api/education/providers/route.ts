import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const type = searchParams.get("type");
    const country = searchParams.get("country");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");

    const providers = await prisma.educationProvider.findMany({
      where: {
        status: "PUBLISHED",

        ...(type ? { type } : {}),

        ...(country ? { country } : {}),

        ...(featured === "true"
          ? { featured: true }
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
                  country: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  city: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  type: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
      },

      orderBy: [
        { featured: "desc" },
        { createdAt: "desc" },
      ],

      include: {
        _count: {
          select: {
            programs: true,
            trainingCourses: true,
          },
        },
      },
    });

    return NextResponse.json({
      providers,
      total: providers.length,
    });
  } catch (error) {
    console.error("Education providers GET error:", error);

    return NextResponse.json(
      {
        error: "Failed to load education providers",
      },
      {
        status: 500,
      }
    );
  }
}