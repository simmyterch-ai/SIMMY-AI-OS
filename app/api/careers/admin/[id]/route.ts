import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authorization";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const user = await requirePermission(request, "careers");

    if (user.scope !== "PLATFORM") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const careerId = Number(id);

    if (!Number.isInteger(careerId)) {
      return NextResponse.json(
        { error: "Invalid career ID" },
        { status: 400 }
      );
    }

    const career = await prisma.career.findUnique({
      where: {
        id: careerId,
      },
    });

    if (!career) {
      return NextResponse.json(
        { error: "Career not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ career });
  } catch (error) {
    console.error("Failed to fetch career:", error);

    return NextResponse.json(
      { error: "Failed to fetch career" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const user = await requirePermission(request, "careers");

    if (user.scope !== "PLATFORM") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const careerId = Number(id);

    if (!Number.isInteger(careerId)) {
      return NextResponse.json(
        { error: "Invalid career ID" },
        { status: 400 }
      );
    }

    const existingCareer = await prisma.career.findUnique({
      where: {
        id: careerId,
      },
    });

    if (!existingCareer) {
      return NextResponse.json(
        { error: "Career not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const {
      title,
      slug,
      companyName,
      country,
      location,
      employmentType,
      workMode,
      industry,
      description,
      requirements,
      responsibilities,
      benefits,
      salary,
      applicationUrl,
      deadline,
      sourceName,
      sourceUrl,
      verificationStatus,
      status,
      featured,
    } = body;

    if (
      !title ||
      !slug ||
      !companyName ||
      !country ||
      !employmentType ||
      !description ||
      !requirements
    ) {
      return NextResponse.json(
        {
          error:
            "Title, slug, company name, country, employment type, description and requirements are required",
        },
        { status: 400 }
      );
    }

    const career = await prisma.career.update({
      where: {
        id: careerId,
      },
      data: {
        title: String(title).trim(),
        slug: String(slug).trim(),
        companyName: String(companyName).trim(),
        country: String(country).trim(),
        location: location ? String(location).trim() : null,
        employmentType: String(employmentType).trim(),
        workMode: workMode ? String(workMode).trim() : null,
        industry: industry ? String(industry).trim() : null,
        description: String(description).trim(),
        requirements: String(requirements).trim(),
        responsibilities: responsibilities
          ? String(responsibilities).trim()
          : null,
        benefits: benefits ? String(benefits).trim() : null,
        salary: salary ? String(salary).trim() : null,
        applicationUrl: applicationUrl
          ? String(applicationUrl).trim()
          : null,
        deadline: deadline ? new Date(deadline) : null,
        sourceName: sourceName ? String(sourceName).trim() : null,
        sourceUrl: sourceUrl ? String(sourceUrl).trim() : null,
        verificationStatus: verificationStatus
          ? String(verificationStatus).trim()
          : "PUBLIC_LISTED",
        status: status ? String(status).trim() : "DRAFT",
        featured: Boolean(featured),
      },
    });

    return NextResponse.json({ career });
  } catch (error) {
    console.error("Failed to update career:", error);

    return NextResponse.json(
      { error: "Failed to update career" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const user = await requirePermission(request, "careers");

    if (user.scope !== "PLATFORM") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const careerId = Number(id);

    if (!Number.isInteger(careerId)) {
      return NextResponse.json(
        { error: "Invalid career ID" },
        { status: 400 }
      );
    }

    const existingCareer = await prisma.career.findUnique({
      where: {
        id: careerId,
      },
    });

    if (!existingCareer) {
      return NextResponse.json(
        { error: "Career not found" },
        { status: 404 }
      );
    }

    await prisma.career.delete({
      where: {
        id: careerId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Career deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete career:", error);

    return NextResponse.json(
      { error: "Failed to delete career" },
      { status: 500 }
    );
  }
}