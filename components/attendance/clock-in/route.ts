import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const userId = Number(body.userId);

    if (!userId) {
      return NextResponse.json(
        {
          error: "Employee is required.",
        },
        {
          status: 400,
        }
      );
    }

    // Verify employee exists
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Employee not found.",
        },
        {
          status: 404,
        }
      );
    }

    // Only active employees can clock in
    if (user.status !== "Active") {
      return NextResponse.json(
        {
          error: "Only active employees can clock in.",
        },
        {
          status: 400,
        }
      );
    }

    const now = new Date();

    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Prevent duplicate clock-ins
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        userId,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    if (existingAttendance) {
      return NextResponse.json(
        {
          error: "Employee has already clocked in today.",
        },
        {
          status: 409,
        }
      );
    }

    // Business rule:
    // Before 9:00 = Present
    // 9:00 or later = Late
    const status =
      now.getHours() >= 9
        ? "Late"
        : "Present";

    const attendance = await prisma.attendance.create({
      data: {
        userId,
        date: today,
        clockIn: now,
        status,
      },
      include: {
        user: {
          include: {
            department: true,
            team: true,
          },
        },
      },
    });

    return NextResponse.json(attendance, {
      status: 201,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Clock In failed.",
      },
      {
        status: 500,
      }
    );
  }
}