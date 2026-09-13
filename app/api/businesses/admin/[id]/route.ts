import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authorization";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, { params }: Props) {
  try {
    await requirePermission(request, "businesses");

    const { id } = await params;
    const businessId = Number(id);

    if (!Number.isInteger(businessId)) {
      return NextResponse.json(
        { error: "Invalid business ID" },
        { status: 400 }
      );
    }

    const business = await prisma.business.findUnique({
      where: {
        id: businessId,
      },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ business });
  } catch (error) {
    console.error("GET /api/businesses/admin/[id] error:", error);

    return NextResponse.json(
      { error: "Failed to load business" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    await requirePermission(request, "businesses");

    const { id } = await params;
    const businessId = Number(id);

    if (!Number.isInteger(businessId)) {
      return NextResponse.json(
        { error: "Invalid business ID" },
        { status: 400 }
      );
    }

    const existingBusiness = await prisma.business.findUnique({
      where: {
        id: businessId,
      },
    });

    if (!existingBusiness) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const {
      name,
      slug,
      category,
      country,
      city,
      description,
      services,
      websiteUrl,
      email,
      phone,
      logoUrl,
      verificationStatus,
      status,
      featured,
    } = body;

    if (!name || !slug || !category || !country || !description) {
      return NextResponse.json(
        {
          error:
            "Name, slug, category, country and description are required",
        },
        { status: 400 }
      );
    }

    const duplicateSlug = await prisma.business.findFirst({
      where: {
        slug: String(slug).trim(),
        NOT: {
          id: businessId,
        },
      },
    });

    if (duplicateSlug) {
      return NextResponse.json(
        {
          error: "A business with this slug already exists",
        },
        { status: 409 }
      );
    }

    const business = await prisma.business.update({
      where: {
        id: businessId,
      },
      data: {
        name: String(name).trim(),
        slug: String(slug).trim(),
        category: String(category).trim(),
        country: String(country).trim(),
        city: city ? String(city).trim() : null,
        description: String(description).trim(),
        services: services ? String(services).trim() : null,
        websiteUrl: websiteUrl ? String(websiteUrl).trim() : null,
        email: email ? String(email).trim() : null,
        phone: phone ? String(phone).trim() : null,
        logoUrl: logoUrl ? String(logoUrl).trim() : null,
        verificationStatus:
          verificationStatus || "PUBLIC_LISTED",
        status: status || "DRAFT",
        featured: Boolean(featured),
      },
    });

    return NextResponse.json({
      message: "Business updated successfully",
      business,
    });
  } catch (error) {
    console.error("PUT /api/businesses/admin/[id] error:", error);

    return NextResponse.json(
      { error: "Failed to update business" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    await requirePermission(request, "businesses");

    const { id } = await params;
    const businessId = Number(id);

    if (!Number.isInteger(businessId)) {
      return NextResponse.json(
        { error: "Invalid business ID" },
        { status: 400 }
      );
    }

    const existingBusiness = await prisma.business.findUnique({
      where: {
        id: businessId,
      },
    });

    if (!existingBusiness) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    await prisma.business.delete({
      where: {
        id: businessId,
      },
    });

    return NextResponse.json({
      message: "Business deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/businesses/admin/[id] error:", error);

    return NextResponse.json(
      { error: "Failed to delete business" },
      { status: 500 }
    );
  }
}