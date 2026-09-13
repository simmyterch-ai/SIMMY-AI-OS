import { prisma } from "@/lib/prisma";

export class ActivityRepository {
  async findLatest(limit = 10) {
    return prisma.activity.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
  }
}

export const activityRepository = new ActivityRepository();