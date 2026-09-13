import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authorization";

export async function GET(request: NextRequest) {
  try {
    const user = await requirePermission(request, "education");

    if (user.scope !== "PLATFORM") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const country = searchParams.get("country");
    const search = searchParams.get("search");

    const providers = await prisma.educationProvider.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(type ? { type } : {}),
        ...(country ? { country } : {}),
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
        {
          featured: "desc",
        },
        {
          createdAt: "desc",
        },
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
    const message =
      error instanceof Error ? error.message : "";

    if (message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (message === "FORBIDDEN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    console.error(
      "Education provider admin GET error:",
      error
    );

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

export async function POST(request: NextRequest) {
  try {
    const user = await requirePermission(request, "education");

    if (user.scope !== "PLATFORM") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const requiredFields = [
      "name",
      "slug",
      "type",
      "country",
      "description",
    ];

    for (const field of requiredFields) {
      if (
        typeof body[field] !== "string" ||
        !body[field].trim()
      ) {
        return NextResponse.json(
          {
            error: `${field} is required`,
          },
          {
            status: 400,
          }
        );
      }
    }

    const slug = body.slug.trim();

    const existingProvider =
      await prisma.educationProvider.findUnique({
        where: {
          slug,
        },
      });

    if (existingProvider) {
      return NextResponse.json(
        {
          error:
            "An education provider with this slug already exists",
        },
        {
          status: 409,
        }
      );
    }

    const provider =
      await prisma.educationProvider.create({
        data: {
          name: body.name.trim(),
          slug,
          type: body.type.trim(),
          country: body.country.trim(),

          city:
            typeof body.city === "string" &&
            body.city.trim()
              ? body.city.trim()
              : null,

          description: body.description.trim(),

          websiteUrl:
            typeof body.websiteUrl === "string" &&
            body.websiteUrl.trim()
              ? body.websiteUrl.trim()
              : null,

          logoUrl:
            typeof body.logoUrl === "string" &&
            body.logoUrl.trim()
              ? body.logoUrl.trim()
              : null,

          verificationStatus:
            typeof body.verificationStatus === "string" &&
            body.verificationStatus.trim()
              ? body.verificationStatus.trim()
              : "PUBLIC_LISTED",

          status:
            typeof body.status === "string" &&
            body.status.trim()
              ? body.status.trim()
              : "DRAFT",

          featured:
            typeof body.featured === "boolean"
              ? body.featured
              : false,
        },
      });

    return NextResponse.json(
      {
        provider,
        message: "Education provider created successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "";

    if (message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (message === "FORBIDDEN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    console.error(
      "Education provider admin POST error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to create education provider",
      },
      {
        status: 500,
      }
    );
  }
}