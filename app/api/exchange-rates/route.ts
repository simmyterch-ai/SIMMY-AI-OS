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

    const rates = await prisma.exchangeRate.findMany({
      include: {
        currency: {
          select: {
            id: true,
            code: true,
            name: true,
            symbol: true,
          },
        },
      },
      orderBy: {
        fetchedAt: "desc",
      },
    });

    return NextResponse.json({
      rates,
    });
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch exchange rates.",
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

    const currencyId = Number(body.currencyId);

    const baseCurrency =
      typeof body.baseCurrency === "string"
        ? body.baseCurrency.trim().toUpperCase()
        : "USD";

    const rate = Number(body.rate);

    const source =
      typeof body.source === "string"
        ? body.source.trim()
        : null;

    const isManual =
      typeof body.isManual === "boolean"
        ? body.isManual
        : true;

    if (
      !Number.isInteger(currencyId) ||
      currencyId <= 0
    ) {
      return NextResponse.json(
        {
          error: "A valid currency is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!baseCurrency || baseCurrency.length !== 3) {
      return NextResponse.json(
        {
          error:
            "Base currency must be a valid 3-letter currency code.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      Number.isNaN(rate) ||
      !Number.isFinite(rate) ||
      rate <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Exchange rate must be a valid number greater than zero.",
        },
        {
          status: 400,
        }
      );
    }

    const currency =
      await prisma.currencySetting.findUnique({
        where: {
          id: currencyId,
        },
      });

    if (!currency) {
      return NextResponse.json(
        {
          error: "Currency not found.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.exchangeRate.updateMany({
      where: {
        currencyId,
        baseCurrency,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    const exchangeRate =
      await prisma.exchangeRate.create({
        data: {
          currencyId,
          baseCurrency,
          rate,
          source: source || "Manual Super Admin Entry",
          isManual,
          isActive: true,
        },
        include: {
          currency: {
            select: {
              id: true,
              code: true,
              name: true,
              symbol: true,
            },
          },
        },
      });

    return NextResponse.json(
      {
        exchangeRate,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Failed to create exchange rate:", error);

    return NextResponse.json(
      {
        error: "Failed to create exchange rate.",
      },
      {
        status: 500,
      }
    );
  }
}