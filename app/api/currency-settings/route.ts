import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

async function requirePlatformSuperAdmin() {
  const cookieStore = await cookies();

  const token = cookieStore.get("sap_token")?.value;

  if (!token) {
    return null;
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return null;
  }

  if (payload.scope !== "PLATFORM") {
    return null;
  }

  if (payload.organizationId !== null) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: payload.userId,
    },
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      organizationId: true,
    },
  });

  if (!user || !user.isActive) {
    return null;
  }

  if (user.organizationId !== null) {
    return null;
  }

  if (
    user.email.trim().toLowerCase() !==
    payload.email.trim().toLowerCase()
  ) {
    return null;
  }

  const normalizedRole = user.role.trim().toLowerCase();

  if (normalizedRole !== "super admin") {
    return null;
  }

  return user;
}

export async function GET() {
  try {
    const user = await requirePlatformSuperAdmin();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const currencies = await prisma.currencySetting.findMany({
      orderBy: {
        code: "asc",
      },
      include: {
        exchangeRates: {
          where: {
            isActive: true,
          },
          orderBy: {
            fetchedAt: "desc",
          },
          take: 1,
        },
      },
    });

    return NextResponse.json({
      currencies,
    });
  } catch (error) {
    console.error("Failed to fetch currency settings:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch currency settings.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requirePlatformSuperAdmin();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const code =
      typeof body.code === "string"
        ? body.code.trim().toUpperCase()
        : "";

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const symbol =
      typeof body.symbol === "string"
        ? body.symbol.trim()
        : null;

    const decimalPlaces = Number.isInteger(body.decimalPlaces)
      ? body.decimalPlaces
      : 2;

    const enabled =
      typeof body.enabled === "boolean"
        ? body.enabled
        : true;

    const fxProtectionMargin =
      body.fxProtectionMargin !== undefined &&
      body.fxProtectionMargin !== null &&
      body.fxProtectionMargin !== ""
        ? Number(body.fxProtectionMargin)
        : 0;

    if (!code || code.length !== 3) {
      return NextResponse.json(
        {
          error: "Currency code must be a 3-letter code.",
        },
        {
          status: 400,
        }
      );
    }

    if (!name) {
      return NextResponse.json(
        {
          error: "Currency name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isInteger(decimalPlaces) ||
      decimalPlaces < 0 ||
      decimalPlaces > 8
    ) {
      return NextResponse.json(
        {
          error:
            "Decimal places must be a whole number between 0 and 8.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      Number.isNaN(fxProtectionMargin) ||
      fxProtectionMargin < 0 ||
      fxProtectionMargin > 100
    ) {
      return NextResponse.json(
        {
          error:
            "FX protection margin must be between 0 and 100.",
        },
        {
          status: 400,
        }
      );
    }

    const existingCurrency =
      await prisma.currencySetting.findUnique({
        where: {
          code,
        },
      });

    if (existingCurrency) {
      return NextResponse.json(
        {
          error: `Currency ${code} already exists.`,
        },
        {
          status: 409,
        }
      );
    }

    const currency =
      await prisma.currencySetting.create({
        data: {
          code,
          name,
          symbol: symbol || null,
          decimalPlaces,
          enabled,
          fxProtectionMargin,
        },
      });

    return NextResponse.json(
      {
        currency,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Failed to create currency setting:", error);

    return NextResponse.json(
      {
        error: "Failed to create currency setting.",
      },
      {
        status: 500,
      }
    );
  }
}