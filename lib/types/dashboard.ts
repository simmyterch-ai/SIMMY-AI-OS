export interface DashboardData {
  totalEmployees: number;
  activeEmployees: number;
  departments: number;
  teams: number;

  present: number;
  late: number;
  onLeave: number;

  attendanceRate: number;
  healthScore: number;

  recentActivities: {
    id: string;
    title: string;
    description: string;
    type: string;
    createdAt: string;
  }[];
}