import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "simmy_account_session";

async function getAuthenticatedAccount(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const session = await prisma.publicAccountSession.findUnique({
    where: {
      token,
    },
    include: {
      account: true,
    },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt <= new Date()) {
    return null;
  }

  if (session.account.status !== "ACTIVE") {
    return null;
  }

  return session.account;
}

export async function POST(request: NextRequest) {
  try {
    const account = await getAuthenticatedAccount(request);

    if (!account) {
      return NextResponse.json(
        {
          error: "You must be logged in to apply for an opportunity.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const opportunityId = Number(body.opportunityId);

    const applicationMessage =
      body.message && String(body.message).trim()
        ? String(body.message).trim()
        : null;

    if (!Number.isInteger(opportunityId) || opportunityId <= 0) {
      return NextResponse.json(
        {
          error: "A valid opportunity is required.",
        },
        { status: 400 }
      );
    }

    const opportunity = await prisma.opportunity.findFirst({
      where: {
        id: opportunityId,
        status: "PUBLISHED",
      },
    });

    if (!opportunity) {
      return NextResponse.json(
        {
          error: "Opportunity not found.",
        },
        { status: 404 }
      );
    }

    const existingApplication =
      await prisma.opportunityApplication.findFirst({
        where: {
          accountId: account.id,
          opportunityId: opportunity.id,
        },
      });

    if (existingApplication) {
      return NextResponse.json(
        {
          error: "You have already applied for this opportunity.",
          application: {
            id: existingApplication.id,
            status: existingApplication.status,
            submittedAt: existingApplication.submittedAt,
          },
        },
        { status: 409 }
      );
    }

    if (!account.firstName || !account.lastName || !account.email) {
      return NextResponse.json(
        {
          error:
            "Your account profile is missing required application information. Please update your profile before applying.",
        },
        { status: 400 }
      );
    }

    const application = await prisma.opportunityApplication.create({
      data: {
        accountId: account.id,
        opportunityId: opportunity.id,

        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        phone: account.phone,
        country: account.country,
        city: account.city,

        message: applicationMessage,

        status: "SUBMITTED",
      },
    });

    await prisma.publicAccountActivity.create({
      data: {
        accountId: account.id,
        type: "OPPORTUNITY_APPLICATION_SUBMITTED",
        module: "Opportunities",
        title: `Applied for ${opportunity.title}`,
        description:
          "You successfully submitted an application for this opportunity.",
        itemId: opportunity.id,
        itemSlug: opportunity.slug,
        itemUrl: `/opportunities/${opportunity.slug}`,
        metadata: {
          applicationId: application.id,
          status: application.status,
        },
      },
    });

    return NextResponse.json(
      {
        message: "Application submitted successfully.",
        application: {
          id: application.id,
          opportunityId: application.opportunityId,
          status: application.status,
          submittedAt: application.submittedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/opportunities/apply error:", error);

    return NextResponse.json(
      {
        error: "Failed to submit application.",
      },
      { status: 500 }
    );
  }
}