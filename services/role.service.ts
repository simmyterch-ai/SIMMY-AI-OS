import { roleRepository } from "@/repositories/role.repository";

export class RoleService {
  // =======================================================
  // FIND ALL ROLES
  // =======================================================

  async findAll(
    organizationId: number
  ) {
    return roleRepository.findAll(
      organizationId
    );
  }

  // =======================================================
  // FIND ROLE BY ID
  // =======================================================

  async findById(
    id: number,
    organizationId: number
  ) {
    return roleRepository.findById(
      id,
      organizationId
    );
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
    if (!data.organizationId) {
      throw new Error(
        "Organization is required."
      );
    }

    const exists =
      await roleRepository.exists(
        data.name,
        data.organizationId
      );

    if (exists) {
      throw new Error(
        "Role already exists."
      );
    }

    return roleRepository.create({
      name: data.name,
      description: data.description,
      isSystem: data.isSystem ?? false,
      organizationId:
        data.organizationId,
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
    return roleRepository.update(
      id,
      organizationId,
      data
    );
  }

  // =======================================================
  // DELETE ROLE
  // =======================================================

  async delete(
    id: number,
    organizationId: number
  ) {
    return roleRepository.delete(
      id,
      organizationId
    );
  }

  // =======================================================
  // GET ROLE PERMISSIONS
  // =======================================================

  async getPermissions(
    roleId: number,
    organizationId: number
  ) {
    const role =
      await roleRepository.findById(
        roleId,
        organizationId
      );

    if (!role) {
      throw new Error(
        "Role not found."
      );
    }

    return roleRepository.getPermissions(
      roleId
    );
  }

  // =======================================================
  // ASSIGN PERMISSIONS
  // =======================================================

  async assignPermissions(
    roleId: number,
    organizationId: number,
    permissionIds: number[]
  ) {
    const role =
      await roleRepository.findById(
        roleId,
        organizationId
      );

    if (!role) {
      throw new Error(
        "Role not found."
      );
    }

    if (role.isSystem) {
      throw new Error(
        "System role permissions cannot be modified."
      );
    }

    return roleRepository.assignPermissions(
      roleId,
      permissionIds
    );
  }

  // =======================================================
  // UPDATE PERMISSIONS
  // =======================================================

  async updatePermissions(
    roleId: number,
    organizationId: number,
    permissionIds: number[]
  ) {
    const role =
      await roleRepository.findById(
        roleId,
        organizationId
      );

    if (!role) {
      throw new Error(
        "Role not found."
      );
    }

    if (role.isSystem) {
      throw new Error(
        "System role permissions cannot be modified."
      );
    }

    return roleRepository.updatePermissions(
      roleId,
      permissionIds
    );
  }

  // =======================================================
  // CLEAR PERMISSIONS
  // =======================================================

  async clearPermissions(
    roleId: number,
    organizationId: number
  ) {
    const role =
      await roleRepository.findById(
        roleId,
        organizationId
      );

    if (!role) {
      throw new Error(
        "Role not found."
      );
    }

    if (role.isSystem) {
      throw new Error(
        "System role permissions cannot be modified."
      );
    }

    return roleRepository.clearPermissions(
      roleId
    );
  }
}

export const roleService =
  new RoleService();