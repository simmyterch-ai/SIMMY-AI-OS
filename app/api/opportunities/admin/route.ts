import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authorization";

const VALID_APPLICATION_MODES = [
  "SIMMY_LINK",
  "EXTERNAL",
  "BOTH",
] as const;

type ApplicationMode =
  (typeof VALID_APPLICATION_MODES)[number];

function isValidUrl(value: string) {
  try {
    const url = new URL(value);

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requirePermission(
      request,
      "opportunities"
    );

    if (user.scope !== "PLATFORM") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const country = searchParams.get("country");
    const search = searchParams.get("search");

    const opportunities =
      await prisma.opportunity.findMany({
        where: {
          ...(status ? { status } : {}),
          ...(type ? { type } : {}),
          ...(country ? { country } : {}),
          ...(search
            ? {
                OR: [
                  {
                    title: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                  {
                    organizationName: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                  {
                    description: {
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
                  {
                    type: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                ],
              }
            : {}),
        },
        orderBy: [
          {
            featured: "desc",
          },
          {
            createdAt: "desc",
          },
        ],
      });

    return NextResponse.json({
      opportunities,
      total: opportunities.length,
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
      "Opportunity admin GET error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to load opportunities" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requirePermission(
      request,
      "opportunities"
    );

    if (user.scope !== "PLATFORM") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
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

    const existingOpportunity =
      await prisma.opportunity.findUnique({
        where: {
          slug,
        },
      });

    if (existingOpportunity) {
      return NextResponse.json(
        {
          error:
            "An opportunity with this slug already exists",
        },
        { status: 409 }
      );
    }

    if (
      body.deadline &&
      Number.isNaN(
        new Date(body.deadline).getTime()
      )
    ) {
      return NextResponse.json(
        { error: "Invalid deadline" },
        { status: 400 }
      );
    }

    /*
     * Application Mode
     */

    const applicationMode =
      typeof body.applicationMode === "string"
        ? body.applicationMode.trim()
        : "EXTERNAL";

    if (
      !VALID_APPLICATION_MODES.includes(
        applicationMode as ApplicationMode
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid application mode. Use SIMMY_LINK, EXTERNAL or BOTH.",
        },
        { status: 400 }
      );
    }

    /*
     * External Application URL
     */

    const applicationUrl =
      typeof body.applicationUrl === "string" &&
      body.applicationUrl.trim()
        ? body.applicationUrl.trim()
        : null;

    /*
     * External application URL is required for:
     *
     * EXTERNAL
     * BOTH
     */

    if (
      (applicationMode === "EXTERNAL" ||
        applicationMode === "BOTH") &&
      !applicationUrl
    ) {
      return NextResponse.json(
        {
          error:
            "An official application URL is required for EXTERNAL or BOTH application modes.",
        },
        { status: 400 }
      );
    }

    if (
      applicationUrl &&
      !isValidUrl(applicationUrl)
    ) {
      return NextResponse.json(
        {
          error:
            "Please provide a valid application URL starting with http:// or https://",
        },
        { status: 400 }
      );
    }

    const opportunity =
      await prisma.opportunity.create({
        data: {
          title: body.title.trim(),
          slug,
          type: body.type.trim(),
          organizationName:
            body.organizationName.trim(),
          country: body.country.trim(),

          location:
            typeof body.location === "string" &&
            body.location.trim()
              ? body.location.trim()
              : null,

          description:
            body.description.trim(),

          eligibility:
            body.eligibility.trim(),

          benefits:
            typeof body.benefits === "string" &&
            body.benefits.trim()
              ? body.benefits.trim()
              : null,

          deadline: body.deadline
            ? new Date(body.deadline)
            : null,

          /*
           * Application Settings
           */

          applicationMode,

          applicationUrl:
            applicationMode === "SIMMY_LINK"
              ? null
              : applicationUrl,

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
            typeof body.verificationStatus ===
              "string" &&
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

    return NextResponse.json(
      {
        opportunity,
        message:
          "Opportunity created successfully",
      },
      { status: 201 }
    );
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
      "Opportunity admin POST error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to create opportunity" },
      { status: 500 }
    );
  }
}