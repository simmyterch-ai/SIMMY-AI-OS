import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authorization";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const user = await requirePermission(request, "education");

    if (user.scope !== "PLATFORM") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const providerId = Number(id);

    if (!Number.isInteger(providerId) || providerId <= 0) {
      return NextResponse.json(
        { error: "Invalid provider ID" },
        { status: 400 }
      );
    }

    const existingProvider =
      await prisma.educationProvider.findUnique({
        where: {
          id: providerId,
        },
      });

    if (!existingProvider) {
      return NextResponse.json(
        { error: "Education provider not found" },
        { status: 404 }
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

    const duplicateProvider =
      await prisma.educationProvider.findFirst({
        where: {
          slug,
          NOT: {
            id: providerId,
          },
        },
      });

    if (duplicateProvider) {
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

    const updatedProvider =
      await prisma.educationProvider.update({
        where: {
          id: providerId,
        },
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

    return NextResponse.json({
      provider: updatedProvider,
      message: "Education provider updated successfully",
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
      "Education provider admin PUT error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to update education provider",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const user = await requirePermission(request, "education");

    if (user.scope !== "PLATFORM") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const providerId = Number(id);

    if (!Number.isInteger(providerId) || providerId <= 0) {
      return NextResponse.json(
        { error: "Invalid provider ID" },
        { status: 400 }
      );
    }

    const existingProvider =
      await prisma.educationProvider.findUnique({
        where: {
          id: providerId,
        },
      });

    if (!existingProvider) {
      return NextResponse.json(
        { error: "Education provider not found" },
        { status: 404 }
      );
    }

    await prisma.educationProvider.delete({
      where: {
        id: providerId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Education provider deleted successfully",
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
      "Education provider admin DELETE error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to delete education provider",
      },
      {
        status: 500,
      }
    );
  }
}