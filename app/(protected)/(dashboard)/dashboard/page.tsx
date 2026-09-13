"use client";

import { useEffect, useState } from "react";

import type { DashboardData } from "@/lib/types/dashboard";

import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import OrganizationHealth from "@/components/dashboard/OrganizationHealth";
import StatsGrid from "@/components/dashboard/StatsGrid";
import QuickActions from "@/components/dashboard/QuickActions";
import AIAssistant from "@/components/dashboard/AIAssistant";
import RecentActivity from "@/components/dashboard/RecentActivity";

export default function DashboardPage() {
  const [data, setData] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);


  async function loadDashboard() {
    try {
      setLoading(true);

      const response = await fetch("/api/dashboard");

      if (!response.ok) {
        throw new Error("Failed to load dashboard");
      }

      const result: DashboardData =
        await response.json();

      setData(result);

    } catch (error) {
      console.error(
        "Failed to load dashboard:",
        error
      );

      setData(null);

    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    const initializeDashboard = async () => {
      await loadDashboard();
    };

    initializeDashboard();
  }, []);


  if (loading || !data) {
    return (
      <div className="rounded-2xl bg-white p-12 text-center text-slate-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <>

      <div className="grid gap-8 xl:grid-cols-2">

        <div>

          <WelcomeBanner />

          <DashboardOverview
            data={data}
          />

        </div>

        <OrganizationHealth
          data={data}
        />

      </div>

      <div className="mt-8">

        <StatsGrid
          data={data}
        />

      </div>

      <div className="mt-10 grid grid-cols-2 gap-8">

        <QuickActions />

        <AIAssistant
          data={data}
        />

      </div>

      <div className="mt-10">

        <RecentActivity
          data={data}
        />

      </div>
    </>
  );
}