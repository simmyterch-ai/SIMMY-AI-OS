export type Team = {
  id: number;

  teamId: string;

  name: string;

  departmentId: number;

  department: string;

  teamLead: string;

  memberCount: number;

  location: string;

  status:
    | "Active"
    | "Inactive";

  description: string;

  createdAt: string;

  updatedAt: string;
};