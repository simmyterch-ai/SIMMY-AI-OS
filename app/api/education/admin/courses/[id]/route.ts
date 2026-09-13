import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authorization";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const user = await requirePermission(request, "education");

    if (user.scope !== "PLATFORM") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const courseId = Number(id);

    if (!Number.isInteger(courseId)) {
      return NextResponse.json(
        { error: "Invalid course ID" },
        { status: 400 }
      );
    }

    const existingCourse =
      await prisma.trainingCourse.findUnique({
        where: { id: courseId },
      });

    if (!existingCourse) {
      return NextResponse.json(
        { error: "Training course not found" },
        { status: 404 }
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

    const duplicateSlug =
      await prisma.trainingCourse.findFirst({
        where: {
          slug,
          NOT: {
            id: courseId,
          },
        },
      });

    if (duplicateSlug) {
      return NextResponse.json(
        {
          error:
            "A different training course already uses this slug",
        },
        { status: 409 }
      );
    }

    const course =
      await prisma.trainingCourse.update({
        where: {
          id: courseId,
        },
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

    return NextResponse.json(course);
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
      "Education admin courses PUT error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to update training course" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const user = await requirePermission(
      request,
      "education"
    );

    if (user.scope !== "PLATFORM") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const courseId = Number(id);

    if (!Number.isInteger(courseId)) {
      return NextResponse.json(
        { error: "Invalid course ID" },
        { status: 400 }
      );
    }

    const existingCourse =
      await prisma.trainingCourse.findUnique({
        where: { id: courseId },
      });

    if (!existingCourse) {
      return NextResponse.json(
        { error: "Training course not found" },
        { status: 404 }
      );
    }

    await prisma.trainingCourse.delete({
      where: {
        id: courseId,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Training course deleted successfully",
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
      "Education admin courses DELETE error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to delete training course" },
      { status: 500 }
    );
  }
}