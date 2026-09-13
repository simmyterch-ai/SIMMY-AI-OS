import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ACCOUNT_SESSION_COOKIE = "simmy_account_session";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

async function getAuthenticatedAccount(request: NextRequest) {
  const sessionToken = request.cookies.get(
    ACCOUNT_SESSION_COOKIE
  )?.value;

  if (!sessionToken) {
    return {
      error: "Not authenticated",
      status: 401,
    };
  }

  const session = await prisma.publicAccountSession.findUnique({
    where: {
      token: sessionToken,
    },
    include: {
      account: true,
    },
  });

  if (!session) {
    return {
      error: "Invalid session",
      status: 401,
    };
  }

  if (session.expiresAt <= new Date()) {
    await prisma.publicAccountSession.delete({
      where: {
        id: session.id,
      },
    });

    return {
      error: "Session expired",
      status: 401,
      expired: true,
    };
  }

  if (session.account.status !== "ACTIVE") {
    return {
      error: "Account is not active",
      status: 403,
    };
  }

  return {
    account: session.account,
  };
}

export async function GET(request: NextRequest) {
  try {
    const result = await getAuthenticatedAccount(request);

    if ("error" in result) {
      const response = NextResponse.json(
        {
          error: result.error,
        },
        { status: result.status }
      );

      if ("expired" in result && result.expired) {
        response.cookies.delete(ACCOUNT_SESSION_COOKIE);
      }

      return response;
    }

    const { searchParams } = new URL(request.url);

    const requestedLimit = Number(
      searchParams.get("limit") || DEFAULT_LIMIT
    );

    const limit =
      Number.isFinite(requestedLimit) && requestedLimit > 0
        ? Math.min(Math.floor(requestedLimit), MAX_LIMIT)
        : DEFAULT_LIMIT;

    const requestedPage = Number(
      searchParams.get("page") || "1"
    );

    const page =
      Number.isFinite(requestedPage) && requestedPage > 0
        ? Math.floor(requestedPage)
        : 1;

    const skip = (page - 1) * limit;

    const [activities, total] = await Promise.all([
      prisma.publicAccountActivity.findMany({
        where: {
          accountId: result.account.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),

      prisma.publicAccountActivity.count({
        where: {
          accountId: result.account.id,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      activities,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("GET /api/accounts/activity error:", error);

    return NextResponse.json(
      {
        error: "Failed to load account activity",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const result = await getAuthenticatedAccount(request);

    if ("error" in result) {
      const response = NextResponse.json(
        {
          error: result.error,
        },
        { status: result.status }
      );

      if ("expired" in result && result.expired) {
        response.cookies.delete(ACCOUNT_SESSION_COOKIE);
      }

      return response;
    }

    const body = await request.json();

    const {
      type,
      module,
      title,
      description,
      itemId,
      itemSlug,
      itemUrl,
      metadata,
    } = body;

    if (!type || !module || !title) {
      return NextResponse.json(
        {
          error: "Activity type, module and title are required",
        },
        { status: 400 }
      );
    }

    const activity = await prisma.publicAccountActivity.create({
      data: {
        accountId: result.account.id,
        type: String(type),
        module: String(module),
        title: String(title),
        description: description
          ? String(description)
          : null,
        itemId:
          itemId !== undefined && itemId !== null
            ? Number(itemId)
            : null,
        itemSlug: itemSlug
          ? String(itemSlug)
          : null,
        itemUrl: itemUrl
          ? String(itemUrl)
          : null,
        metadata:
          metadata !== undefined
            ? metadata
            : undefined,
      },
    });

    return NextResponse.json(
      {
        message: "Activity recorded successfully",
        activity,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/accounts/activity error:", error);

    return NextResponse.json(
      {
        error: "Failed to record account activity",
      },
      { status: 500 }
    );
  }
}