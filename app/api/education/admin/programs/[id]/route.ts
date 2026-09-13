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
    const programId = Number(id);

    if (!Number.isInteger(programId)) {
      return NextResponse.json(
        { error: "Invalid program ID" },
        { status: 400 }
      );
    }

    const existingProgram =
      await prisma.educationProgram.findUnique({
        where: { id: programId },
      });

    if (!existingProgram) {
      return NextResponse.json(
        { error: "Education program not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const {
      providerId,
      name,
      slug,
      level,
      fieldOfStudy,
      description,
      eligibility,
      duration,
      studyMode,
      tuition,
      currency,
      applicationUrl,
      deadline,
      intake,
      verificationStatus,
      status,
      featured,
    } = body;

    if (
      !providerId ||
      !name ||
      !slug ||
      !level ||
      !fieldOfStudy ||
      !description ||
      !eligibility
    ) {
      return NextResponse.json(
        {
          error:
            "providerId, name, slug, level, fieldOfStudy, description and eligibility are required",
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
      await prisma.educationProgram.findFirst({
        where: {
          slug,
          NOT: {
            id: programId,
          },
        },
      });

    if (duplicateSlug) {
      return NextResponse.json(
        {
          error:
            "A different program already uses this slug",
        },
        { status: 409 }
      );
    }

    const program =
      await prisma.educationProgram.update({
        where: {
          id: programId,
        },
        data: {
          providerId: Number(providerId),
          name,
          slug,
          level,
          fieldOfStudy,
          description,
          eligibility,
          duration: duration || null,
          studyMode: studyMode || null,
          tuition: tuition || null,
          currency: currency || null,
          applicationUrl: applicationUrl || null,
          deadline: deadline
            ? new Date(deadline)
            : null,
          intake: intake || null,
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

    return NextResponse.json(program);
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
      "Education admin programs PUT error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to update education program" },
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
    const programId = Number(id);

    if (!Number.isInteger(programId)) {
      return NextResponse.json(
        { error: "Invalid program ID" },
        { status: 400 }
      );
    }

    const existingProgram =
      await prisma.educationProgram.findUnique({
        where: { id: programId },
      });

    if (!existingProgram) {
      return NextResponse.json(
        { error: "Education program not found" },
        { status: 404 }
      );
    }

    await prisma.educationProgram.delete({
      where: {
        id: programId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Education program deleted successfully",
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
      "Education admin programs DELETE error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to delete education program" },
      { status: 500 }
    );
  }
}