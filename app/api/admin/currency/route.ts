import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authorization";

function parseNonNegativeNumber(value: unknown, fallback: number): number | null {
  if (value === undefined || value === null || value === "") return fallback;
  const parsed = typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export async function GET(request: NextRequest) {
  try {
    const user = await requirePermission(request, "opportunities");
    if (user.scope !== "PLATFORM") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const currencies = await prisma.currencySetting.findMany({
      include: {
        exchangeRates: {
          where: { isActive: true, baseCurrency: "USD" },
          orderBy: { fetchedAt: "desc" },
          take: 1,
        },
      },
      orderBy: [{ enabled: "desc" }, { code: "asc" }],
    });

    return NextResponse.json({ currencies, total: currencies.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error("Currency admin GET error:", error);
    return NextResponse.json({ error: "Failed to load currencies" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requirePermission(request, "opportunities");
    if (user.scope !== "PLATFORM") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();

    if (typeof body.code !== "string" || !body.code.trim())
      return NextResponse.json({ error: "Currency code is required" }, { status: 400 });

    if (typeof body.name !== "string" || !body.name.trim())
      return NextResponse.json({ error: "Currency name is required" }, { status: 400 });

    const code = body.code.trim().toUpperCase();

    if (!/^[A-Z]{3}$/.test(code))
      return NextResponse.json({ error: "Currency code must be a valid 3-letter code, for example USD, NGN or MAD" }, { status: 400 });

    const decimalPlaces = parseNonNegativeNumber(body.decimalPlaces, 2);

    if (decimalPlaces === null || !Number.isInteger(decimalPlaces) || decimalPlaces > 10)
      return NextResponse.json({ error: "Decimal places must be a whole number between 0 and 10" }, { status: 400 });

    const fxProtectionMargin = parseNonNegativeNumber(body.fxProtectionMargin, 0);

    if (fxProtectionMargin === null)
      return NextResponse.json({ error: "FX protection margin must be a valid non-negative number" }, { status: 400 });

    const existingCurrency = await prisma.currencySetting.findUnique({ where: { code } });

    if (existingCurrency)
      return NextResponse.json({ error: `Currency ${code} already exists` }, { status: 409 });

    const currency = await prisma.currencySetting.create({
      data: {
        code,
        name: body.name.trim(),
        symbol: typeof body.symbol === "string" && body.symbol.trim() ? body.symbol.trim() : null,
        decimalPlaces,
        enabled: typeof body.enabled === "boolean" ? body.enabled : true,
        fxProtectionMargin,
      },
    });

    return NextResponse.json({ currency, message: "Currency created successfully" }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error("Currency admin POST error:", error);
    return NextResponse.json({ error: "Failed to create currency" }, { status: 500 });
  }
}
