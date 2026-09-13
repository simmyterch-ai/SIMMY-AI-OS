import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requirePlatformSuperAdmin } from "@/lib/auth/platformAdmin";


type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const user =
     await requirePlatformSuperAdmin();

    if (!user) {
      return NextResponse.json(
        {
          message: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const { id } =
      await context.params;

    const body =
      await request.json();

    const status =
      typeof body.status === "string"
        ? body.status
        : "";

    if (
      !["UNREAD", "READ", "ARCHIVED"].includes(
        status
      )
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid message status.",
        },
        {
          status: 400,
        }
      );
    }

    const message =
      await prisma.contactMessage.update({
        where: {
          id,
        },
        data: {
          status,
        },
      });

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error(
      "Failed to update contact message:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to update message.",
      },
      {
        status: 500,
      }
    );
  }
}