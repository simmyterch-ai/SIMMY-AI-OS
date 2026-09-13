import { prisma } from "@/lib/prisma";

type LogActivityParams = {
  title: string;
  description: string;
  type: string;
  organizationId?: number | null;
};

export async function logActivity({
  title,
  description,
  type,
  organizationId = null,
}: LogActivityParams) {
  try {
    await prisma.activity.create({
      data: {
        title,
        description,
        type,
        organizationId,
      },
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}