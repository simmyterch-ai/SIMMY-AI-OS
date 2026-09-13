import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authorization";

export async function GET(request: NextRequest) {
  try {
    await requirePermission(request, "businesses");

    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status") || undefined;
    const country = searchParams.get("country") || undefined;
    const search = searchParams.get("search") || undefined;

    const businesses = await prisma.business.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(country
          ? {
              country: {
                equals: country,
                mode: "insensitive",
              },
            }
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
                  country: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      businesses,
      total: businesses.length,
    });
  } catch (error) {
    console.error("GET /api/businesses/admin error:", error);

    return NextResponse.json(
      {
        error: "Failed to load businesses",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requirePermission(request, "businesses");

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

    const existingBusiness = await prisma.business.findUnique({
      where: {
        slug,
      },
    });

    if (existingBusiness) {
      return NextResponse.json(
        {
          error: "A business with this slug already exists",
        },
        { status: 409 }
      );
    }

    const business = await prisma.business.create({
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

    return NextResponse.json(
      {
        message: "Business created successfully",
        business,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/businesses/admin error:", error);

    return NextResponse.json(
      {
        error: "Failed to create business",
      },
      { status: 500 }
    );
  }
}