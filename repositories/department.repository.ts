import { prisma } from "@/lib/prisma";

export class DepartmentRepository {
  async findAll(organizationId: number) {
    return prisma.department.findMany({
      where: {
        organizationId,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  async findById(
    id: number,
    organizationId: number
  ) {
    return prisma.department.findFirst({
      where: {
        id,
        organizationId,
      },
    });
  }

  async create(
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
    return prisma.department.create({
      data: {
        organizationId,
        departmentId: data.departmentId ?? null,
        name: data.name,
        manager: data.manager ?? null,
        employeeCount: data.employeeCount ?? 0,
        location: data.location ?? null,
        description: data.description ?? null,
        status: data.status ?? "Active",
      },
    });
  }

  async update(
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
    return prisma.department.updateMany({
      where: {
        id,
        organizationId,
      },
      data,
    });
  }

  async delete(
    id: number,
    organizationId: number
  ) {
    return prisma.department.deleteMany({
      where: {
        id,
        organizationId,
      },
    });
  }
}

export const departmentRepository =
  new DepartmentRepository();