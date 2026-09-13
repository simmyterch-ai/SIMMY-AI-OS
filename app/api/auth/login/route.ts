import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  authService,
} from "@/services/auth.service";

export async function POST(
  request: NextRequest
) {
  try {
    // ===================================================
    // PARSE REQUEST BODY SAFELY
    // ===================================================

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON request.",
        },
        {
          status: 400,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }

    // ===================================================
    // VALIDATE REQUEST BODY
    // ===================================================

    if (
      typeof body !== "object" ||
      body === null
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body.",
        },
        {
          status: 400,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }

    const requestBody =
      body as {
        email?: unknown;
        password?: unknown;
      };

    const email =
      typeof requestBody.email === "string"
        ? requestBody.email
            .trim()
            .toLowerCase()
        : "";

    const password =
      typeof requestBody.password === "string"
        ? requestBody.password
        : "";

    // ===================================================
    // VALIDATE LOGIN REQUEST
    // ===================================================

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Email and password are required.",
        },
        {
          status: 400,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }

    // ===================================================
    // AUTHENTICATE USER
    // ===================================================

    const {
      token,
      user,
    } =
      await authService.login(
        email,
        password
      );

    // ===================================================
    // CREATE AUTHENTICATED RESPONSE
    // ===================================================

    const response =
      NextResponse.json(
        {
          success: true,
          user,
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );

    // ===================================================
    // SECURE AUTH COOKIE
    // ===================================================

    response.cookies.set(
      "sap_token",
      token,
      {
        httpOnly: true,

        sameSite: "lax",

        secure:
          process.env.NODE_ENV ===
          "production",

        path: "/",

        maxAge:
          60 * 60 * 24 * 7,
      }
    );

    return response;
  } catch (error) {
    console.error(
      "POST /api/auth/login failed:",
      error
    );

    // ===================================================
    // EXPECTED AUTHENTICATION ERRORS
    // ===================================================

    if (
      error instanceof Error &&
      (
        error.message ===
          "Invalid email or password." ||
        error.message ===
          "This account has been disabled." ||
        error.message ===
          "This account is not assigned to an organization." ||
        error.message ===
          "This account does not have a role assigned." ||
        error.message ===
          "Super Admin accounts must not belong to an organization." ||
        error.message ===
          "This account has no password yet. Please contact your administrator."
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            error.message,
        },
        {
          status: 401,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }

    // ===================================================
    // GENERIC SERVER ERROR
    // ===================================================

    return NextResponse.json(
      {
        success: false,
        error: "Login failed.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}