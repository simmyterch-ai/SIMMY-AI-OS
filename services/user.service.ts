import {
  userRepository,
} from "@/repositories/user.repository";

import {
  AuthScope,
} from "@/lib/jwt";

export type UserDataScope = {
  scope: AuthScope;
  organizationId: number | null;
};

export class UserService {
  // =======================================================
  // GET ALL USERS
  // =======================================================

  async getUsers(
    dataScope: UserDataScope
  ) {
    return userRepository.findAll(
      dataScope
    );
  }

  // =======================================================
  // GET ONE USER
  // =======================================================

  async getUser(
    id: number,
    dataScope: UserDataScope
  ) {
    return userRepository.findById(
      id,
      dataScope
    );
  }

  // =======================================================
  // CREATE USER
  // =======================================================

  async createUser(
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
    return userRepository.create(
      data,
      organizationId
    );
  }

  // =======================================================
  // UPDATE USER
  // =======================================================

  async updateUser(
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
    return userRepository.update(
      id,
      data,
      organizationId
    );
  }

  // =======================================================
  // DELETE USER
  // =======================================================

  async deleteUser(
    id: number,
    organizationId: number
  ) {
    return userRepository.delete(
      id,
      organizationId
    );
  }
}

export const userService =
  new UserService();