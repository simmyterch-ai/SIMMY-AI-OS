import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const subject =
      typeof body.subject === "string"
        ? body.subject.trim()
        : "";

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Please complete all required fields.",
        },
        {
          status: 400,
        }
      );
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      name.length > 100 ||
      email.length > 150 ||
      subject.length > 200 ||
      message.length > 5000
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "One or more fields exceed the allowed length.",
        },
        {
          status: 400,
        }
      );
    }

    const contactMessage =
      await prisma.contactMessage.create({
        data: {
          name,
          email,
          subject,
          message,
          status: "UNREAD",
        },
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Your message has been sent successfully.",
        data: {
          id: contactMessage.id,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Contact message submission failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to send your message. Please try again later.",
      },
      {
        status: 500,
      }
    );
  }
}