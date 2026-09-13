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
    const user = await requirePermission(request, "opportunities");

    if (user.scope !== "PLATFORM") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const opportunityId = Number(id);

    if (!Number.isInteger(opportunityId) || opportunityId <= 0) {
      return NextResponse.json(
        { error: "Invalid opportunity ID" },
        { status: 400 }
      );
    }

    const existingOpportunity =
      await prisma.opportunity.findUnique({
        where: {
          id: opportunityId,
        },
      });

    if (!existingOpportunity) {
      return NextResponse.json(
        { error: "Opportunity not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const requiredFields = [
      "title",
      "slug",
      "type",
      "organizationName",
      "country",
      "description",
      "eligibility",
    ];

    for (const field of requiredFields) {
      if (
        typeof body[field] !== "string" ||
        !body[field].trim()
      ) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const slug = body.slug.trim();

    const duplicateSlug =
      await prisma.opportunity.findFirst({
        where: {
          slug,
          NOT: {
            id: opportunityId,
          },
        },
      });

    if (duplicateSlug) {
      return NextResponse.json(
        { error: "An opportunity with this slug already exists" },
        { status: 409 }
      );
    }

    const updatedOpportunity =
      await prisma.opportunity.update({
        where: {
          id: opportunityId,
        },
        data: {
          title: body.title.trim(),
          slug,
          type: body.type.trim(),
          organizationName: body.organizationName.trim(),
          country: body.country.trim(),
          location:
            typeof body.location === "string" &&
            body.location.trim()
              ? body.location.trim()
              : null,
          description: body.description.trim(),
          eligibility: body.eligibility.trim(),
          benefits:
            typeof body.benefits === "string" &&
            body.benefits.trim()
              ? body.benefits.trim()
              : null,
          deadline: body.deadline
            ? new Date(body.deadline)
            : null,
          applicationUrl:
            typeof body.applicationUrl === "string" &&
            body.applicationUrl.trim()
              ? body.applicationUrl.trim()
              : null,
          sourceName:
            typeof body.sourceName === "string" &&
            body.sourceName.trim()
              ? body.sourceName.trim()
              : null,
          sourceUrl:
            typeof body.sourceUrl === "string" &&
            body.sourceUrl.trim()
              ? body.sourceUrl.trim()
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
      opportunity: updatedOpportunity,
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

    console.error("Opportunity admin PUT error:", error);

    return NextResponse.json(
      { error: "Failed to update opportunity" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const user = await requirePermission(request, "opportunities");

    if (user.scope !== "PLATFORM") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const opportunityId = Number(id);

    if (!Number.isInteger(opportunityId) || opportunityId <= 0) {
      return NextResponse.json(
        { error: "Invalid opportunity ID" },
        { status: 400 }
      );
    }

    const existingOpportunity =
      await prisma.opportunity.findUnique({
        where: {
          id: opportunityId,
        },
      });

    if (!existingOpportunity) {
      return NextResponse.json(
        { error: "Opportunity not found" },
        { status: 404 }
      );
    }

    await prisma.opportunity.delete({
      where: {
        id: opportunityId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Opportunity deleted successfully",
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

    console.error("Opportunity admin DELETE error:", error);

    return NextResponse.json(
      { error: "Failed to delete opportunity" },
      { status: 500 }
    );
  }
}