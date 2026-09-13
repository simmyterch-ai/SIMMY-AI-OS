import { permissionRepository } from "@/repositories/permission.repository";

export class PermissionService {
  async findAll() {
    return permissionRepository.findAll();
  }

  async create(data: {
    name: string;
    module: string;
    description?: string;
  }) {
    const exists = await permissionRepository.exists(
      data.name
    );

    if (exists) {
      throw new Error("Permission already exists.");
    }

    return permissionRepository.create(data);
  }

  async findAssigned(roleId: number) {
    return permissionRepository.findAssigned(roleId);
  }

  async assign(
    roleId: number,
    permissionIds: number[]
  ) {
    return permissionRepository.assign(
      roleId,
      permissionIds
    );
  }
}

export const permissionService =
  new PermissionService();