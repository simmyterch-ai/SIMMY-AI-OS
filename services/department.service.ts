import {
  departmentRepository,
} from "@/repositories/department.repository";

export class DepartmentService {
  async getDepartments(
    organizationId: number
  ) {
    return departmentRepository.findAll(
      organizationId
    );
  }

  async getDepartment(
    id: number,
    organizationId: number
  ) {
    return departmentRepository.findById(
      id,
      organizationId
    );
  }

  async createDepartment(
    organizationId: number,
    data: {
      departmentId?: string | null;
      name: string;
      manager?: string | null;
      employeeCount?: number;
      location?: string | null;
      description?: string | null;
      status?: string;
    }
  ) {
    return departmentRepository.create(
      organizationId,
      data
    );
  }

  async updateDepartment(
    id: number,
    organizationId: number,
    data: {
      departmentId?: string | null;
      name?: string;
      manager?: string | null;
      employeeCount?: number;
      location?: string | null;
      description?: string | null;
      status?: string;
    }
  ) {
    return departmentRepository.update(
      id,
      organizationId,
      data
    );
  }

  async deleteDepartment(
    id: number,
    organizationId: number
  ) {
    return departmentRepository.delete(
      id,
      organizationId
    );
  }
}

export const departmentService =
  new DepartmentService();