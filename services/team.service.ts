import { teamRepository } from "@/repositories/team.repository";

export class TeamService {
  async getTeams(organizationId: number) {
    return teamRepository.findAll(organizationId);
  }

  async getTeam(
    id: number,
    organizationId: number
  ) {
    return teamRepository.findById(
      id,
      organizationId
    );
  }

  async createTeam(
    organizationId: number,
    data: {
      name: string;
      description?: string | null;
      departmentId: number;
    }
  ) {
    return teamRepository.create(
      organizationId,
      data
    );
  }

  async updateTeam(
    id: number,
    organizationId: number,
    data: {
      name: string;
      description?: string | null;
      departmentId: number;
    }
  ) {
    return teamRepository.update(
      id,
      organizationId,
      data
    );
  }

  async deleteTeam(
    id: number,
    organizationId: number
  ) {
    return teamRepository.delete(
      id,
      organizationId
    );
  }
}

export const teamService =
  new TeamService();