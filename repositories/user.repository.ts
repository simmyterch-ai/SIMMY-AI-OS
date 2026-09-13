import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";

import {
  AuthScope,
} from "@/lib/jwt";

import {
  UserDataScope,
} from "@/services/user.service";

export class UserRepository {
  // =======================================================
  // GET ALL USERS
  // =======================================================

  async findAll(
    dataScope: UserDataScope
  ) {
    const where =
      dataScope.scope === "PLATFORM"
        ? {}
        : {
            organizationId:
              dataScope.organizationId!,
          };

    return prisma.user.findMany({
      where,

      select: {
        id: true,
        employeeId: true,
        name: true,
        email: true,
        phone: true,
        location: true,
        avatar: true,
        role: true,
        status: true,
        isActive: true,
        emailVerified: true,
        lastLogin: true,
        dateJoined: true,
        departmentId: true,
        teamId: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,

        organization: true,
        department: true,
        team: true,
      },

      orderBy: {
        id: "desc",
      },
    });
  }

  // =======================================================
  // GET ONE USER
  // =======================================================

  async findById(
    id: number,
    dataScope: UserDataScope
  ) {
    const where =
      dataScope.scope === "PLATFORM"
        ? {
            id,
          }
        : {
            id,
            organizationId:
              dataScope.organizationId!,
          };

    return prisma.user.findFirst({
      where,

      select: {
        id: true,
        employeeId: true,
        name: true,
        email: true,
        phone: true,
        location: true,
        avatar: true,
        role: true,
        status: true,
        isActive: true,
        emailVerified: true,
        lastLogin: true,
        dateJoined: true,
        departmentId: true,
        teamId: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,

        organization: true,

        department: true,

        team: true,

        attendances: {
          orderBy: {
            date: "desc",
          },

          take: 10,
        },
      },
    });
  }

  // =======================================================
  // VALIDATE ORGANIZATION ID
  // =======================================================

  private validateOrganizationId(
    organizationId: number
  ) {
    if (
      !Number.isInteger(
        organizationId
      ) ||
      organizationId <= 0
    ) {
      throw new Error(
        "INVALID_ORGANIZATION"
      );
    }
  }

  // =======================================================
  // VALIDATE DEPARTMENT
  // =======================================================

  private async validateDepartment(
    departmentId: number,
    organizationId: number
  ) {
    this.validateOrganizationId(
      organizationId
    );

    const department =
      await prisma.department.findFirst({
        where: {
          id: departmentId,
          organizationId,
        },
      });

    if (!department) {
      throw new Error(
        "DEPARTMENT_NOT_FOUND"
      );
    }

    return department;
  }

  // =======================================================
  // VALIDATE TEAM
  // =======================================================

  private async validateTeam(
    teamId: number,
    departmentId: number,
    organizationId: number
  ) {
    this.validateOrganizationId(
      organizationId
    );

    const team =
      await prisma.team.findFirst({
        where: {
          id: teamId,
          organizationId,
          departmentId,
        },
      });

    if (!team) {
      throw new Error(
        "TEAM_NOT_FOUND"
      );
    }

    return team;
  }

  // =======================================================
  // CREATE USER
  // =======================================================

  async create(
    data: {
      employeeId: string;
      name: string;
      email: string;
      phone?: string | null;
      location?: string | null;
      avatar?: string | null;
      role: string;
      status: string;
      departmentId: number;
      teamId?: number | null;
    },
    organizationId: number
  ) {
    this.validateOrganizationId(
      organizationId
    );

    // -----------------------------------------------------
    // Department must belong to organization
    // -----------------------------------------------------

    await this.validateDepartment(
      data.departmentId,
      organizationId
    );

    // -----------------------------------------------------
    // Team must belong to organization
    // AND department
    // -----------------------------------------------------

    if (
      data.teamId !== null &&
      data.teamId !== undefined
    ) {
      await this.validateTeam(
        data.teamId,
        data.departmentId,
        organizationId
      );
    }

    // -----------------------------------------------------
    // Create user
    // -----------------------------------------------------

    const user =
      await prisma.user.create({
        data: {
          ...data,
          organizationId,
        },

        select: {
          id: true,
          employeeId: true,
          name: true,
          email: true,
          phone: true,
          location: true,
          avatar: true,
          role: true,
          status: true,
          isActive: true,
          emailVerified: true,
          lastLogin: true,
          dateJoined: true,
          departmentId: true,
          teamId: true,
          organizationId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    // -----------------------------------------------------
    // Activity log
    // -----------------------------------------------------

   await logActivity({
  title: "Employee Created",
  description:
    `${user.name} was added successfully.`,
  type: "Employee",
  organizationId: user.organizationId,
});

    return user;
  }

  // =======================================================
  // UPDATE USER
  // =======================================================

  async update(
    id: number,
    data: {
      name: string;
      email: string;
      phone?: string | null;
      location?: string | null;
      avatar?: string | null;
      role: string;
      status: string;
      departmentId: number;
      teamId?: number | null;
    },
    organizationId: number
  ) {
    this.validateOrganizationId(
      organizationId
    );

    // -----------------------------------------------------
    // User must belong to organization
    // -----------------------------------------------------

    const existingUser =
      await prisma.user.findFirst({
        where: {
          id,
          organizationId,
        },
      });

    if (!existingUser) {
      throw new Error(
        "USER_NOT_FOUND"
      );
    }

    // -----------------------------------------------------
    // Department must belong to organization
    // -----------------------------------------------------

    await this.validateDepartment(
      data.departmentId,
      organizationId
    );

    // -----------------------------------------------------
    // Team validation
    // -----------------------------------------------------

    if (
      data.teamId !== null &&
      data.teamId !== undefined
    ) {
      await this.validateTeam(
        data.teamId,
        data.departmentId,
        organizationId
      );
    }

    // -----------------------------------------------------
    // Update user
    // -----------------------------------------------------

    return prisma.user.update({
      where: {
        id: existingUser.id,
      },

      data,

      select: {
        id: true,
        employeeId: true,
        name: true,
        email: true,
        phone: true,
        location: true,
        avatar: true,
        role: true,
        status: true,
        isActive: true,
        emailVerified: true,
        lastLogin: true,
        dateJoined: true,
        departmentId: true,
        teamId: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // =======================================================
  // DELETE USER
  // =======================================================

  async delete(
    id: number,
    organizationId: number
  ) {
    this.validateOrganizationId(
      organizationId
    );

    // -----------------------------------------------------
    // User must belong to organization
    // -----------------------------------------------------

    const existingUser =
      await prisma.user.findFirst({
        where: {
          id,
          organizationId,
        },
      });

    if (!existingUser) {
      throw new Error(
        "USER_NOT_FOUND"
      );
    }

    // -----------------------------------------------------
    // Delete verified user
    // -----------------------------------------------------

    return prisma.user.delete({
      where: {
        id: existingUser.id,
      },

      select: {
        id: true,
        employeeId: true,
        name: true,
        email: true,
        phone: true,
        location: true,
        avatar: true,
        role: true,
        status: true,
        isActive: true,
        emailVerified: true,
        lastLogin: true,
        dateJoined: true,
        departmentId: true,
        teamId: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}

export const userRepository =
  new UserRepository();