import {
  NextRequest,
  NextResponse,
} from "next/server";

import { verifyToken } from "@/lib/jwt";
import { authService } from "@/services/auth.service";

export async function POST(
  request: NextRequest
) {
  try {
    // ===================================================
    // READ AUTHENTICATION COOKIE
    // ===================================================

    const token =
      request.cookies.get(
        "sap_token"
      )?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Authentication required.",
        },
        {
          status: 401,
        }
      );
    }

    // ===================================================
    // VERIFY JWT
    // ===================================================

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid or expired session.",
        },
        {
          status: 401,
        }
      );
    }

    // ===================================================
    // READ REQUEST
    // ===================================================

    const body =
      await request.json();

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (!password) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Password is required.",
        },
        {
          status: 400,
        }
      );
    }

    // ===================================================
    // BASIC PASSWORD VALIDATION
    // ===================================================

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Password must be at least 8 characters long.",
        },
        {
          status: 400,
        }
      );
    }

    // ===================================================
    // IMPORTANT:
    // NEVER TRUST EMAIL FROM THE CLIENT.
    //
    // Use the email from the verified JWT instead.
    // ===================================================

    await authService.setPassword(
      payload.email,
      password
    );

    return NextResponse.json({
      success: true,
      message:
        "Password has been set successfully.",
    });
  } catch (error) {
    console.error(
      "POST /api/auth/set-password failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to set password.",
      },
      {
        status: 500,
      }
    );
  }
}