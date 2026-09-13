"use client";

import {
  Users,
  Building2,
  UsersRound,
  CalendarCheck,
} from "lucide-react";

import type { DashboardData } from "@/lib/types/dashboard";
import StatCard from "./StatCard";

type StatsGridProps = {
  data: DashboardData;
};

export default function StatsGrid({
  data,
}: StatsGridProps) {
  return (
    <div className="mt-8 grid grid-cols-4 gap-6">

      <StatCard
        title="People"
        value={data.totalEmployees}
        subtitle="Total employees"
        icon={Users}
        iconColor="text-blue-600"
      />

      <StatCard
        title="Departments"
        value={data.departments}
        subtitle="Organization departments"
        icon={Building2}
        iconColor="text-purple-600"
      />

      <StatCard
        title="Teams"
        value={data.teams}
        subtitle="Active teams"
        icon={UsersRound}
        iconColor="text-green-600"
      />

      <StatCard
        title="Attendance"
        value={data.present}
        subtitle="Present today"
        icon={CalendarCheck}
        iconColor="text-orange-600"
      />

    </div>
  );
}