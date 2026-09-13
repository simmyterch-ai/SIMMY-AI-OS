"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import OrganizationI18n from "@/components/i18n/OrganizationI18n";

export default function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // =====================================================
  // AUTHENTICATION LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">

          <div className="mx-auto mb-6 flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white">
            SAP
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            SIMMY AI PLATFORM
          </h1>

          <p className="mt-2 text-slate-500">
            Loading your workspace...
          </p>

          <div className="mt-6 h-2 w-64 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-600" />
          </div>

        </div>
      </div>
    );
  }

  // =====================================================
  // NOT AUTHENTICATED
  // =====================================================

  if (!user) {
    return null;
  }

  // =====================================================
  // AUTHENTICATED SAP APPLICATION
  // =====================================================

  return (
    <OrganizationI18n>
      {children}
    </OrganizationI18n>
  );
}