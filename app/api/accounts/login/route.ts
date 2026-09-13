import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const ACCOUNT_SESSION_COOKIE = "simmy_account_session";

// Public SIMMY LINK AFRICA account session duration: 30 days
const SESSION_DURATION_SECONDS = 30 * 24 * 60 * 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email and password are required",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const account = await prisma.publicAccount.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!account) {
      return NextResponse.json(
        {
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    if (account.status !== "ACTIVE") {
      return NextResponse.json(
        {
          error: "This account is not active",
        },
        { status: 403 }
      );
    }

    const passwordMatches = await bcrypt.compare(
      String(password),
      account.passwordHash
    );

    if (!passwordMatches) {
      return NextResponse.json(
        {
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    const sessionToken = crypto.randomUUID();

    const expiresAt = new Date(
      Date.now() + SESSION_DURATION_SECONDS * 1000
    );

    await prisma.publicAccountSession.create({
      data: {
        token: sessionToken,
        accountId: account.id,
        expiresAt,
      },
    });

    const response = NextResponse.json({
      message: "Login successful",
      account: {
        id: account.id,
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        phone: account.phone,
        country: account.country,
        city: account.city,
        status: account.status,
        emailVerified: account.emailVerified,
      },
    });

    response.cookies.set({
      name: ACCOUNT_SESSION_COOKIE,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION_SECONDS,
    });

    return response;
  } catch (error) {
    console.error("POST /api/accounts/login error:", error);

    return NextResponse.json(
      {
        error: "Failed to process login",
      },
      { status: 500 }
    );
  }
}