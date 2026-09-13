import { prisma } from "@/lib/prisma";

export class PermissionRepository {
  async findAll() {
    return prisma.permission.findMany({
      orderBy: [
        {
          module: "asc",
        },
        {
          name: "asc",
        },
      ],
    });
  }

  async create(data: {
    name: string;
    module: string;
    description?: string;
  }) {
    return prisma.permission.create({
      data,
    });
  }

  async exists(name: string) {
    return prisma.permission.findUnique({
      where: {
        name,
      },
    });
  }

  // ===============================
  // ROLE PERMISSIONS
  // ===============================

  async findAssigned(roleId: number) {
    const permissions = await prisma.rolePermission.findMany({
      where: {
        roleId,
      },
      select: {
        permissionId: true,
      },
    });

    return permissions.map((item) => item.permissionId);
  }

  async assign(
    roleId: number,
    permissionIds: number[]
  ) {
    // Remove existing permissions
    await prisma.rolePermission.deleteMany({
      where: {
        roleId,
      },
    });

    // Nothing selected
    if (permissionIds.length === 0) {
      return;
    }

    // Assign new permissions
    return prisma.rolePermission.createMany({
      data: permissionIds.map((permissionId) => ({
        roleId,
        permissionId,
      })),
      skipDuplicates: true,
    });
  }
}

export const permissionRepository =
  new PermissionRepository();