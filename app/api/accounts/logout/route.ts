import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ACCOUNT_SESSION_COOKIE = "simmy_account_session";

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get(
      ACCOUNT_SESSION_COOKIE
    )?.value;

    if (sessionToken) {
      await prisma.publicAccountSession.deleteMany({
        where: {
          token: sessionToken,
        },
      });
    }

    const response = NextResponse.json({
      message: "Logged out successfully",
    });

    response.cookies.delete(ACCOUNT_SESSION_COOKIE);

    return response;
  } catch (error) {
    console.error("POST /api/accounts/logout error:", error);

    return NextResponse.json(
      {
        error: "Failed to log out",
      },
      { status: 500 }
    );
  }
}