export type Department = {
  id: number;

  departmentId: string | null;

  name: string;

  manager: string | null;

  employeeCount: number;

  location: string | null;

  description: string | null;

  status: "Active" | "Inactive";

  organizationId: number | null;

  createdAt: string;
  updatedAt: string;
};