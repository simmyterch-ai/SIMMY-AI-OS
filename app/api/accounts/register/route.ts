import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const TERMS_VERSION = "T&C v1.0";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      country,
      city,
      termsAccepted,
    } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        {
          error:
            "First name, last name, email and password are required",
        },
        { status: 400 }
      );
    }

    if (termsAccepted !== true) {
      return NextResponse.json(
        {
          error:
            "You must accept the Terms & Conditions before creating account.",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    if (String(password).length < 8) {
      return NextResponse.json(
        {
          error: "Password must be at least 8 characters",
        },
        { status: 400 }
      );
    }

    const existingAccount = await prisma.publicAccount.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingAccount) {
      return NextResponse.json(
        {
          error: "An account with this email already exists",
        },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(String(password), 12);

    const account = await prisma.publicAccount.create({
      data: {
        firstName: String(firstName).trim(),
        lastName: String(lastName).trim(),
        email: normalizedEmail,
        passwordHash,
        phone: phone ? String(phone).trim() : null,
        country: country ? String(country).trim() : null,
        city: city ? String(city).trim() : null,
        status: "ACTIVE",
        emailVerified: false,
        termsAccepted: true,
        termsAcceptedAt: new Date(),
        termsVersion: TERMS_VERSION,
      },
    });

    await prisma.publicAccountActivity.create({
      data: {
        accountId: account.id,
        type: "ACCOUNT_CREATED",
        module: "Account",
        title: "Account created",
        description:
          "Your SIMMY LINK AFRICA account was successfully created.",
        itemId: account.id,
        itemUrl: "/account",
        metadata: {
          termsAccepted: true,
          termsVersion: TERMS_VERSION,
        },
      },
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
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
          termsAccepted: account.termsAccepted,
          termsAcceptedAt: account.termsAcceptedAt,
          termsVersion: account.termsVersion,
          createdAt: account.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/accounts/register error:", error);

    return NextResponse.json(
      {
        error: "Failed to create account",
      },
      { status: 500 }
    );
  }
}