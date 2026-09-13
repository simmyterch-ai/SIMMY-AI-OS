import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authorization";

export async function GET(request: NextRequest) {
  try {
    const user = await requirePermission(request, "education");

    if (user.scope !== "PLATFORM") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status") || "";
    const level = searchParams.get("level") || "";
    const fieldOfStudy = searchParams.get("fieldOfStudy") || "";
    const providerId = searchParams.get("providerId") || "";
    const search = searchParams.get("search") || "";

    const programs = await prisma.educationProgram.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(level ? { level } : {}),
        ...(fieldOfStudy ? { fieldOfStudy } : {}),
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
                  fieldOfStudy: {
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

    return NextResponse.json(programs);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

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

    console.error("Education admin programs GET error:", error);

    return NextResponse.json(
      { error: "Failed to load education programs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requirePermission(request, "education");

    if (user.scope !== "PLATFORM") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

    const provider = await prisma.educationProvider.findUnique({
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

    const existingSlug = await prisma.educationProgram.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: "A program with this slug already exists" },
        { status: 409 }
      );
    }

    const program = await prisma.educationProgram.create({
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
        deadline: deadline ? new Date(deadline) : null,
        intake: intake || null,
        verificationStatus:
          verificationStatus || "PUBLIC_LISTED",
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

    return NextResponse.json(program, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

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

    console.error("Education admin programs POST error:", error);

    return NextResponse.json(
      { error: "Failed to create education program" },
      { status: 500 }
    );
  }
}