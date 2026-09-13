import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  verifyToken,
} from "@/lib/jwt";

const PUBLIC_ROUTES = [
  "/login",
  "/api/auth/login",
  "/api/auth/set-password",
  "/favicon.ico",
];

export async function middleware(
  request: NextRequest
) {
  const { pathname } =
    request.nextUrl;

  // =====================================================
  // 1. ALLOW PUBLIC ROUTES
  // =====================================================

  if (
    PUBLIC_ROUTES.some(
      (route) =>
        pathname === route ||
        pathname.startsWith(
          `${route}/`
        )
    )
  ) {
    return NextResponse.next();
  }

  // =====================================================
  // 2. READ AUTHENTICATION COOKIE
  // =====================================================

  const token =
    request.cookies.get(
      "sap_token"
    )?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL(
        "/login",
        request.url
      )
    );
  }

  // =====================================================
  // 3. VERIFY AUTHENTICATION TOKEN
  // =====================================================

  const payload =
    await verifyToken(token);

  // =====================================================
  // 4. REJECT INVALID TOKEN
  // =====================================================

  if (!payload) {
    const response =
      NextResponse.redirect(
        new URL(
          "/login",
          request.url
        )
      );

    response.cookies.delete(
      "sap_token"
    );

    return response;
  }

  // =====================================================
  // 5. AUTHENTICATED REQUEST
  // =====================================================

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",

    "/dashboard",
    "/dashboard/:path*",

    "/people",
    "/people/:path*",

    "/departments",
    "/departments/:path*",

    "/teams",
    "/teams/:path*",

    "/attendance",
    "/attendance/:path*",

    "/reports",
    "/reports/:path*",

    "/settings",
    "/settings/:path*",

    "/organization",
    "/organization/:path*",

    "/ai-assistant",
    "/ai-assistant/:path*",
  ],
};