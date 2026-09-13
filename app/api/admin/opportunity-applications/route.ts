import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const pageParam = Number(searchParams.get("page") || "1");
    const limitParam = Number(searchParams.get("limit") || "20");

    const page =
      Number.isInteger(pageParam) && pageParam > 0
        ? pageParam
        : 1;

    const limit =
      Number.isInteger(limitParam) &&
      limitParam > 0 &&
      limitParam <= 100
        ? limitParam
        : 20;

    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      prisma.opportunityApplication.findMany({
        orderBy: {
          submittedAt: "desc",
        },
        skip,
        take: limit,

        include: {
          account: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              country: true,
              city: true,
              status: true,
            },
          },

          opportunity: {
            select: {
              id: true,
              title: true,
              slug: true,
              organizationName: true,
              type: true,
            },
          },
        },
      }),

      prisma.opportunityApplication.count(),
    ]);

    return NextResponse.json({
      applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    console.error(
      "GET /api/admin/opportunity-applications error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to load opportunity applications.",
      },
      { status: 500 }
    );
  }
}