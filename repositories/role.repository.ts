import { prisma } from "@/lib/prisma";

export class RoleRepository {
  // =======================================================
  // FIND ALL ROLES FOR AN ORGANIZATION
  // =======================================================

  async findAll(organizationId: number) {
    return prisma.role.findMany({
      where: {
        organizationId,
      },

      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },

      orderBy: [
        {
          isSystem: "desc",
        },
        {
          id: "asc",
        },
      ],
    });
  }

  // =======================================================
  // FIND ROLE BY ID
  // =======================================================

  async findById(
    id: number,
    organizationId: number
  ) {
    return prisma.role.findFirst({
      where: {
        id,
        organizationId,
      },

      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  // =======================================================
  // CREATE ROLE
  // =======================================================

  async create(data: {
    name: string;
    description?: string;
    isSystem?: boolean;
    organizationId: number;
  }) {
    return prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
        isSystem: data.isSystem ?? false,
        organizationId: data.organizationId,
      },
    });
  }

  // =======================================================
  // UPDATE ROLE
  // =======================================================

  async update(
    id: number,
    organizationId: number,
    data: {
      name?: string;
      description?: string;
    }
  ) {
    const role =
      await prisma.role.findFirst({
        where: {
          id,
          organizationId,
          isSystem: false,
        },
      });

    if (!role) {
      throw new Error(
        "Role not found or cannot be modified."
      );
    }

    return prisma.role.update({
      where: {
        id: role.id,
      },

      data,
    });
  }

  // =======================================================
  // DELETE ROLE
  // =======================================================

  async delete(
    id: number,
    organizationId: number
  ) {
    const role =
      await prisma.role.findFirst({
        where: {
          id,
          organizationId,
          isSystem: false,
        },
      });

    if (!role) {
      throw new Error(
        "Role not found or cannot be deleted."
      );
    }

    return prisma.role.delete({
      where: {
        id: role.id,
      },
    });
  }

  // =======================================================
  // CHECK IF ROLE EXISTS IN ORGANIZATION
  // =======================================================

  async exists(
    name: string,
    organizationId: number
  ) {
    return prisma.role.findFirst({
      where: {
        name,
        organizationId,
      },
    });
  }

  // =======================================================
  // GET ROLE PERMISSIONS
  // =======================================================

  async getPermissions(
    roleId: number
  ) {
    return prisma.rolePermission.findMany({
      where: {
        roleId,
      },

      include: {
        permission: true,
      },
    });
  }

  // =======================================================
  // CLEAR ROLE PERMISSIONS
  // =======================================================

  async clearPermissions(
    roleId: number
  ) {
    return prisma.rolePermission.deleteMany({
      where: {
        roleId,
      },
    });
  }

  // =======================================================
  // ASSIGN PERMISSIONS
  // =======================================================

  async assignPermissions(
    roleId: number,
    permissionIds: number[]
  ) {
    if (
      permissionIds.length === 0
    ) {
      return;
    }

    return prisma.rolePermission.createMany({
      data: permissionIds.map(
        (permissionId) => ({
          roleId,
          permissionId,
        })
      ),

      skipDuplicates: true,
    });
  }

  // =======================================================
  // UPDATE PERMISSIONS
  // =======================================================

  async updatePermissions(
    roleId: number,
    permissionIds: number[]
  ) {
    await this.clearPermissions(
      roleId
    );

    return this.assignPermissions(
      roleId,
      permissionIds
    );
  }
}

export const roleRepository =
  new RoleRepository();