import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authorization";

export async function GET(request: NextRequest) {
  try {
    const user = await requirePermission(request, "careers");

    if (user.scope !== "PLATFORM") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const careers = await prisma.career.findMany({
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
      { error: "Failed to fetch careers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requirePermission(request, "careers");

    if (user.scope !== "PLATFORM") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
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

    const career = await prisma.career.create({
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

    return NextResponse.json(
      { career },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create career:", error);

    return NextResponse.json(
      { error: "Failed to create career" },
      { status: 500 }
    );
  }
}