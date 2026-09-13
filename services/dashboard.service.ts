import {
  dashboardRepository,
} from "@/repositories/dashboard.repository";

import {
  AuthScope,
} from "@/lib/jwt";

export type DashboardDataScope = {
  scope: AuthScope;
  organizationId: number | null;
};

export class DashboardService {
  // =======================================================
  // GET DASHBOARD STATISTICS
  // =======================================================

  async getDashboardStats(
    dataScope: DashboardDataScope
  ) {
    return dashboardRepository.getStats(
      dataScope
    );
  }
}

export const dashboardService =
  new DashboardService();