import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requirePlatformSuperAdmin } from "@/lib/auth/platformAdmin"; 


export async function GET(request: Request) {
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

    const { searchParams } =
      new URL(request.url);

    const status =
      searchParams.get("status");

    const search =
      searchParams.get("search");

    const where: {
      status?: string;
      OR?: Array<{
        name?: {
          contains: string;
          mode: "insensitive";
        };
        email?: {
          contains: string;
          mode: "insensitive";
        };
        subject?: {
          contains: string;
          mode: "insensitive";
        };
      }>;
    } = {};

    if (
      status &&
      ["UNREAD", "READ", "ARCHIVED"].includes(
        status
      )
    ) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          subject: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    const [
      messages,
      totalMessages,
      unreadMessages,
      readMessages,
      archivedMessages,
    ] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.contactMessage.count(),

      prisma.contactMessage.count({
        where: {
          status: "UNREAD",
        },
      }),

      prisma.contactMessage.count({
        where: {
          status: "READ",
        },
      }),

      prisma.contactMessage.count({
        where: {
          status: "ARCHIVED",
        },
      }),
    ]);

    return NextResponse.json({
      messages,

      stats: {
        totalMessages,
        unreadMessages,
        readMessages,
        archivedMessages,
      },
    });
  } catch (error) {
    console.error(
      "Failed to load contact messages:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to load contact messages.",
      },
      {
        status: 500,
      }
    );
  }
}