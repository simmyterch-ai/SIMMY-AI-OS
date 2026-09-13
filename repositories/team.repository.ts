import { prisma } from "@/lib/prisma";

export class TeamRepository {
  async findAll(organizationId: number) {
    const teams = await prisma.team.findMany({
      where: {
        organizationId,
      },

      orderBy: {
        name: "asc",
      },

      include: {
        department: true,

        users: {
          select: {
            id: true,
            name: true,
            role: true,
            location: true,
            isActive: true,
          },
        },
      },
    });

    return teams.map((team) =>
      this.formatTeam(team)
    );
  }

  async findById(
    id: number,
    organizationId: number
  ) {
    const team = await prisma.team.findFirst({
      where: {
        id,
        organizationId,
      },

      include: {
        department: true,

        users: {
          select: {
            id: true,
            name: true,
            role: true,
            location: true,
            isActive: true,
          },
        },
      },
    });

    if (!team) {
      return null;
    }

    return this.formatTeam(team);
  }

  async create(
    organizationId: number,
    data: {
      name: string;
      description?: string | null;
      departmentId: number;
    }
  ) {
    const normalizedName = data.name.trim();

    /*
     * Check for an existing team first.
     * This gives the application a predictable error instead
     * of exposing a raw Prisma P2002 error to the browser.
     */
    const existingTeam =
      await prisma.team.findFirst({
        where: {
          organizationId,
          name: normalizedName,
        },
      });

    if (existingTeam) {
      throw new Error(
        "TEAM_NAME_ALREADY_EXISTS"
      );
    }

    /*
     * Verify that the department belongs to the
     * same organization.
     */
    const department =
      await prisma.department.findFirst({
        where: {
          id: data.departmentId,
          organizationId,
        },
      });

    if (!department) {
      throw new Error(
        "DEPARTMENT_NOT_FOUND"
      );
    }

    try {
      const team =
        await prisma.team.create({
          data: {
            organizationId,

            name: normalizedName,

            description:
              data.description?.trim() ||
              null,

            departmentId:
              data.departmentId,
          },

          include: {
            department: true,

            users: {
              select: {
                id: true,
                name: true,
                role: true,
                location: true,
                isActive: true,
              },
            },
          },
        });

      return this.formatTeam(team);
    } catch (error: any) {
      /*
       * Protect against a race condition where another
       * request creates the same team between the
       * existence check and prisma.team.create().
       */
      if (
        error?.code === "P2002"
      ) {
        throw new Error(
          "TEAM_NAME_ALREADY_EXISTS"
        );
      }

      throw error;
    }
  }

  async update(
    id: number,
    organizationId: number,
    data: {
      name: string;
      description?: string | null;
      departmentId: number;
    }
  ) {
    const existingTeam =
      await prisma.team.findFirst({
        where: {
          id,
          organizationId,
        },
      });

    if (!existingTeam) {
      throw new Error(
        "TEAM_NOT_FOUND"
      );
    }

    const normalizedName =
      data.name.trim();

    /*
     * Check whether another team in the same
     * organization already uses this name.
     */
    const duplicateTeam =
      await prisma.team.findFirst({
        where: {
          organizationId,
          name: normalizedName,
          NOT: {
            id,
          },
        },
      });

    if (duplicateTeam) {
      throw new Error(
        "TEAM_NAME_ALREADY_EXISTS"
      );
    }

    /*
     * Verify department ownership.
     */
    const department =
      await prisma.department.findFirst({
        where: {
          id: data.departmentId,
          organizationId,
        },
      });

    if (!department) {
      throw new Error(
        "DEPARTMENT_NOT_FOUND"
      );
    }

    try {
      const team =
        await prisma.team.update({
          where: {
            id: existingTeam.id,
          },

          data: {
            name: normalizedName,

            description:
              data.description?.trim() ||
              null,

            departmentId:
              data.departmentId,
          },

          include: {
            department: true,

            users: {
              select: {
                id: true,
                name: true,
                role: true,
                location: true,
                isActive: true,
              },
            },
          },
        });

      return this.formatTeam(team);
    } catch (error: any) {
      if (
        error?.code === "P2002"
      ) {
        throw new Error(
          "TEAM_NAME_ALREADY_EXISTS"
        );
      }

      throw error;
    }
  }

  async delete(
    id: number,
    organizationId: number
  ) {
    const existingTeam =
      await prisma.team.findFirst({
        where: {
          id,
          organizationId,
        },
      });

    if (!existingTeam) {
      throw new Error(
        "TEAM_NOT_FOUND"
      );
    }

    return prisma.team.delete({
      where: {
        id: existingTeam.id,
      },
    });
  }

  private formatTeam(team: any) {
    const users = Array.isArray(
      team.users
    )
      ? team.users
      : [];

    const teamLeadUser =
      users.find(
        (user: any) => {
          const role =
            typeof user.role ===
            "string"
              ? user.role.toLowerCase()
              : "";

          return (
            role.includes(
              "team lead"
            ) ||
            role.includes(
              "teamlead"
            ) ||
            role.includes(
              "manager"
            ) ||
            role.includes(
              "supervisor"
            ) ||
            role.includes(
              "leader"
            )
          );
        }
      ) ?? null;

    const activeMembers =
      users.filter(
        (user: any) =>
          user.isActive === true
      ).length;

    return {
      id: team.id,

      teamId:
        `TEAM-${String(
          team.id
        ).padStart(4, "0")}`,

      name: team.name,

      departmentId:
        team.departmentId,

      department:
        team.department?.name ??
        "Not assigned",

      teamLead:
        teamLeadUser?.name ??
        "Not assigned",

      memberCount:
        users.length,

      location:
        teamLeadUser?.location ??
        "Not specified",

      status:
        activeMembers > 0
          ? "Active"
          : "Inactive",

      description:
        team.description ?? "",

      createdAt:
        team.createdAt instanceof Date
          ? team.createdAt.toISOString()
          : String(
              team.createdAt
            ),

      updatedAt:
        team.updatedAt instanceof Date
          ? team.updatedAt.toISOString()
          : String(
              team.updatedAt
            ),
    };
  }
}

export const teamRepository =
  new TeamRepository();