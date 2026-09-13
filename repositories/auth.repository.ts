import { prisma } from "@/lib/prisma";

export class AuthRepository {
  // =======================================================
  // FIND USER BY EMAIL
  // =======================================================

  async findUserByEmail(
    email: string
  ) {
    return prisma.user.findUnique({
      where: {
        email,
      },

      include: {
        organization: true,
        department: true,
        team: true,
      },
    });
  }

  // =======================================================
  // FIND USER BY ID
  // =======================================================

  async findUserById(
    id: number
  ) {
    return prisma.user.findUnique({
      where: {
        id,
      },

      include: {
        organization: true,
        department: true,
        team: true,
      },
    });
  }

  // =======================================================
  // UPDATE LAST LOGIN
  // =======================================================

  async updateLastLogin(
    id: number
  ) {
    return prisma.user.update({
      where: {
        id,
      },

      data: {
        lastLogin: new Date(),
      },
    });
  }

  // =======================================================
  // UPDATE PASSWORD
  // =======================================================

  async updatePassword(
    email: string,
    passwordHash: string
  ) {
    return prisma.user.update({
      where: {
        email,
      },

      data: {
        passwordHash,
      },
    });
  }
}

export const authRepository =
  new AuthRepository();