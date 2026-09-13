import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export type PlatformAdminUser = {
  id: number;
  email: string;
  role: string;
  isActive: boolean;
  organizationId: number | null;
};

export async function requirePlatformSuperAdmin(): Promise<PlatformAdminUser> {
  const cookieStore = await cookies();

  const token = cookieStore.get("sap_token")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const payload = await verifyToken(token);

  if (!payload) {
    throw new Error("Unauthorized");
  }

  if (payload.scope !== "PLATFORM") {
    throw new Error("Forbidden");
  }

  if (payload.organizationId !== null) {
    throw new Error("Forbidden");
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

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (!user.isActive) {
    throw new Error("Unauthorized");
  }

  if (user.id !== payload.userId) {
    throw new Error("Unauthorized");
  }

  if (
    user.email.trim().toLowerCase() !==
    payload.email.trim().toLowerCase()
  ) {
    throw new Error("Unauthorized");
  }

  if (user.organizationId !== null) {
    throw new Error("Forbidden");
  }

  const normalizedRole = user.role.trim().toLowerCase();

  if (normalizedRole !== "super admin") {
    throw new Error("Forbidden");
  }

  return user;
}

export async function getPlatformSuperAdmin(): Promise<PlatformAdminUser> {
  return requirePlatformSuperAdmin();
}