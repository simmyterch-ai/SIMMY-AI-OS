import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const employmentType = searchParams.get("employmentType")?.trim();
    const country = searchParams.get("country")?.trim();
    const industry = searchParams.get("industry")?.trim();
    const workMode = searchParams.get("workMode")?.trim();
    const search = searchParams.get("search")?.trim();
    const featured = searchParams.get("featured") === "true";

    const careers = await prisma.career.findMany({
      where: {
        status: "PUBLISHED",

        ...(employmentType
          ? {
              employmentType: {
                equals: employmentType,
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

        ...(industry
          ? {
              industry: {
                equals: industry,
                mode: "insensitive",
              },
            }
          : {}),

        ...(workMode
          ? {
              workMode: {
                equals: workMode,
                mode: "insensitive",
              },
            }
          : {}),

        ...(featured ? { featured: true } : {}),

        ...(search
          ? {
              OR: [
                {
                  title: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  companyName: {
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
                  industry: {
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
              ],
            }
          : {}),
      },

      orderBy: [
        { featured: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({
      careers,
      total: careers.length,
    });
 } catch (error) {
  console.error("Failed to fetch careers:", error);

  return NextResponse.json(
    {
      error: "Failed to fetch careers",
      details: error instanceof Error ? error.message : String(error),
    },
    { status: 500 }
  );
}
  }
