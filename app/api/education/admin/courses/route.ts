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

    const status = searchParams.get("status") || "";
    const category = searchParams.get("category") || "";
    const deliveryMode =
      searchParams.get("deliveryMode") || "";
    const providerId =
      searchParams.get("providerId") || "";
    const search = searchParams.get("search") || "";

    const courses = await prisma.trainingCourse.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(category ? { category } : {}),
        ...(deliveryMode ? { deliveryMode } : {}),
        ...(providerId
          ? { providerId: Number(providerId) }
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
                  provider: {
                    name: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                },
              ],
            }
          : {}),
      },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            country: true,
            city: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(courses);
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
      "Education admin courses GET error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to load training courses" },
      { status: 500 }
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

    const {
      providerId,
      name,
      slug,
      category,
      description,
      eligibility,
      duration,
      deliveryMode,
      cost,
      currency,
      applicationUrl,
      deadline,
      verificationStatus,
      status,
      featured,
    } = body;

    if (
      !providerId ||
      !name ||
      !slug ||
      !category ||
      !description ||
      !eligibility
    ) {
      return NextResponse.json(
        {
          error:
            "providerId, name, slug, category, description and eligibility are required",
        },
        { status: 400 }
      );
    }

    const provider =
      await prisma.educationProvider.findUnique({
        where: {
          id: Number(providerId),
        },
      });

    if (!provider) {
      return NextResponse.json(
        { error: "Education provider not found" },
        { status: 400 }
      );
    }

    const existingSlug =
      await prisma.trainingCourse.findUnique({
        where: { slug },
      });

    if (existingSlug) {
      return NextResponse.json(
        {
          error:
            "A training course with this slug already exists",
        },
        { status: 409 }
      );
    }

    const course =
      await prisma.trainingCourse.create({
        data: {
          providerId: Number(providerId),
          name,
          slug,
          category,
          description,
          eligibility,
          duration: duration || null,
          deliveryMode: deliveryMode || null,
          cost: cost || null,
          currency: currency || null,
          applicationUrl: applicationUrl || null,
          deadline: deadline
            ? new Date(deadline)
            : null,
          verificationStatus:
            verificationStatus ||
            "PUBLIC_LISTED",
          status: status || "DRAFT",
          featured: Boolean(featured),
        },
        include: {
          provider: {
            select: {
              id: true,
              name: true,
              country: true,
              city: true,
            },
          },
        },
      });

    return NextResponse.json(course, {
      status: 201,
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
      "Education admin courses POST error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to create training course" },
      { status: 500 }
    );
  }
}