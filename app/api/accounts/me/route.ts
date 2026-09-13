import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ACCOUNT_SESSION_COOKIE = "simmy_account_session";

const TERMS_VERSION = "T&C v1.0";

async function getAuthenticatedSession(request: NextRequest) {
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
    session,
    account: session.account,
  };
}

function accountResponse(account: {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  country: string | null;
  city: string | null;
  profileImage: string | null;
  status: string;
  emailVerified: boolean;
  termsAccepted: boolean;
  termsAcceptedAt: Date | null;
  termsVersion: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: account.id,
    firstName: account.firstName,
    lastName: account.lastName,
    email: account.email,
    phone: account.phone,
    country: account.country,
    city: account.city,
    profileImage: account.profileImage,
    status: account.status,
    emailVerified: account.emailVerified,
    termsAccepted: account.termsAccepted,
    termsAcceptedAt: account.termsAcceptedAt,
    termsVersion: account.termsVersion,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };
}

export async function GET(request: NextRequest) {
  try {
    const result = await getAuthenticatedSession(request);

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

    return NextResponse.json({
      authenticated: true,
      account: accountResponse(result.account),
    });
  } catch (error) {
    console.error("GET /api/accounts/me error:", error);

    return NextResponse.json(
      {
        error: "Failed to verify account session",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const result = await getAuthenticatedSession(request);

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
      firstName,
      lastName,
      phone,
      country,
      city,
    } = body;

    if (!firstName || !lastName) {
      return NextResponse.json(
        {
          error: "First name and last name are required",
        },
        { status: 400 }
      );
    }

    const updatedAccount = await prisma.publicAccount.update({
      where: {
        id: result.account.id,
      },
      data: {
        firstName: String(firstName).trim(),
        lastName: String(lastName).trim(),
        phone: phone ? String(phone).trim() : null,
        country: country ? String(country).trim() : null,
        city: city ? String(city).trim() : null,

        // Keep the existing legal acceptance record unchanged.
        termsAccepted: result.account.termsAccepted,
        termsAcceptedAt: result.account.termsAcceptedAt,
        termsVersion:
          result.account.termsVersion || TERMS_VERSION,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      account: accountResponse(updatedAccount),
    });
  } catch (error) {
    console.error("PUT /api/accounts/me error:", error);

    return NextResponse.json(
      {
        error: "Failed to update account profile",
      },
      { status: 500 }
    );
  }
}