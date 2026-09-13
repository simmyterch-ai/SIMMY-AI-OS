import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getAuthenticatedUser,
} from "@/lib/authorization";

const NO_STORE_HEADERS = {
  "Cache-Control":
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function GET(
  request: NextRequest
) {
  try {
    const user =
      await getAuthenticatedUser(
        request
      );

    if (!user) {
      const response =
        NextResponse.json(
          {
            authenticated: false,
          },
          {
            status: 401,
            headers: NO_STORE_HEADERS,
          }
        );

      response.cookies.delete(
        "sap_token"
      );

      return response;
    }

    return NextResponse.json(
      {
        authenticated: true,
        user,
      },
      {
        status: 200,
        headers: NO_STORE_HEADERS,
      }
    );
  } catch (error) {
    console.error(
      "GET /api/auth/me failed:",
      error
    );

    const response =
      NextResponse.json(
        {
          authenticated: false,
        },
        {
          status: 401,
          headers: NO_STORE_HEADERS,
        }
      );

    response.cookies.delete(
      "sap_token"
    );

    return response;
  }
}
