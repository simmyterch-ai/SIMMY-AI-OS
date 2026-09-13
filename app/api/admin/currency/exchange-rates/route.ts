import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authorization";

function parsePositiveNumber(value: unknown): number | null {
  const parsed = typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export async function GET(request: NextRequest) {
  try {
    const user = await requirePermission(request, "opportunities");
    if (user.scope !== "PLATFORM") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const currencyIdParam = searchParams.get("currencyId");
    const currencyId = currencyIdParam ? Number(currencyIdParam) : null;

    if (currencyIdParam && (!Number.isInteger(currencyId) || !currencyId || currencyId <= 0))
      return NextResponse.json({ error: "Invalid currencyId" }, { status: 400 });

    const baseCurrency = searchParams.get("baseCurrency")?.trim().toUpperCase() || "USD";

    const rates = await prisma.exchangeRate.findMany({
      where: {
        ...(currencyId ? { currencyId } : {}),
        baseCurrency,
      },
      include: {
        currency: {
          select: {
            id: true,
            code: true,
            name: true,
            symbol: true,
            decimalPlaces: true,
            enabled: true,
            fxProtectionMargin: true,
          },
        },
      },
      orderBy: [{ isActive: "desc" }, { fetchedAt: "desc" }],
    });

    return NextResponse.json({ rates, total: rates.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error("Exchange rate admin GET error:", error);
    return NextResponse.json({ error: "Failed to load exchange rates" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requirePermission(request, "opportunities");
    if (user.scope !== "PLATFORM") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const currencyId = typeof body.currencyId === "number" ? body.currencyId : Number(body.currencyId);

    if (!Number.isInteger(currencyId) || currencyId <= 0)
      return NextResponse.json({ error: "A valid currencyId is required" }, { status: 400 });

    const rate = parsePositiveNumber(body.rate);

    if (rate === null)
      return NextResponse.json({ error: "Exchange rate must be a valid number greater than zero" }, { status: 400 });

    const baseCurrency =
      typeof body.baseCurrency === "string" && body.baseCurrency.trim()
        ? body.baseCurrency.trim().toUpperCase()
        : "USD";

    if (!/^[A-Z]{3}$/.test(baseCurrency))
      return NextResponse.json({ error: "Base currency must be a valid 3-letter currency code" }, { status: 400 });

    let expiresAt: Date | null = null;

    if (body.expiresAt) {
      const parsedDate = new Date(body.expiresAt);
      if (Number.isNaN(parsedDate.getTime()))
        return NextResponse.json({ error: "Invalid expiresAt date" }, { status: 400 });
      expiresAt = parsedDate;
    }

    const currency = await prisma.currencySetting.findUnique({ where: { id: currencyId } });

    if (!currency)
      return NextResponse.json({ error: "Currency not found" }, { status: 404 });

    const exchangeRate = await prisma.$transaction(async (tx) => {
      await tx.exchangeRate.updateMany({
        where: { currencyId, baseCurrency, isActive: true },
        data: { isActive: false },
      });

      return tx.exchangeRate.create({
        data: {
          currencyId,
          baseCurrency,
          rate,
          source: typeof body.source === "string" && body.source.trim() ? body.source.trim() : null,
          fetchedAt: body.fetchedAt ? new Date(body.fetchedAt) : new Date(),
          expiresAt,
          isManual: typeof body.isManual === "boolean" ? body.isManual : true,
          isActive: typeof body.isActive === "boolean" ? body.isActive : true,
        },
        include: {
          currency: {
            select: {
              id: true,
              code: true,
              name: true,
              symbol: true,
              decimalPlaces: true,
              enabled: true,
              fxProtectionMargin: true,
            },
          },
        },
      });
    });

    return NextResponse.json({ exchangeRate, message: "Exchange rate created successfully" }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error("Exchange rate admin POST error:", error);
    return NextResponse.json({ error: "Failed to create exchange rate" }, { status: 500 });
  }
}
