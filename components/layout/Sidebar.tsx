"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ClipboardCheck, ShieldCheck } from "lucide-react";

import { useI18n } from "@/contexts/I18nContext";
import { getDirection } from "@/lib/i18n/config";

type AuthUser = {
  role?: string | null;
  scope?: string | null;
};

export default function Sidebar() {
  const pathname = usePathname();

  const { locale, t } = useI18n();

  const direction = getDirection(locale);

  const [canAccessAdminManagement, setCanAccessAdminManagement] =
    useState(false);

  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadCurrentUser() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        const user: AuthUser =
          data?.user && typeof data.user === "object"
            ? data.user
            : data;

        const normalizedRole =
          typeof user.role === "string"
            ? user.role.trim().toLowerCase()
            : "";

        const isPlatformSuperAdmin =
          normalizedRole === "super admin" &&
          user.scope === "PLATFORM";

        if (active) {
          setCanAccessAdminManagement(
            isPlatformSuperAdmin
          );
        }
      } catch (error) {
        console.error(
          "Failed to load sidebar access:",
          error
        );
      } finally {
        if (active) {
          setAuthLoading(false);
        }
      }
    }

    loadCurrentUser();

    return () => {
      active = false;
    };
  }, []);

  const menuItems = [
    {
      name: t.common.dashboard,
      href: "/dashboard",
    },
    ...(canAccessAdminManagement
      ? [
          {
            name: "Admin Management",
            href: "/admin",
            icon: ShieldCheck,
            prominent: true,
          },
        ]
      : []),
    {
      name: t.common.organization,
      href: "/organization",
    },
    {
      name: t.common.people,
      href: "/people",
    },
    {
      name: t.common.teams,
      href: "/teams",
    },
    {
      name: t.common.departments,
      href: "/departments",
    },
    {
      name: t.common.reports,
      href: "/reports",
    },
    {
      name: t.common.attendance,
      href: "/attendance",
      icon: ClipboardCheck,
    },
    {
      name: t.common.aiAssistant,
      href: "/ai-assistant",
    },
    {
      name: t.common.rolesPermissions,
      href: "/settings/roles",
    },
  ];

  return (
    <aside
      dir={direction}
      className={`w-80 min-h-screen bg-white border-slate-200 flex flex-col ${
        direction === "rtl"
          ? "border-l"
          : "border-r"
      }`}
    >
      {/* Product Branding */}

      <div className="border-b border-slate-200 p-6">
        <div className="flex items-center gap-3">
          <Image
            src="/images/sap-logo.png"
            alt="SAP Logo"
            width={58}
            height={58}
            className="h-auto w-auto flex-shrink-0"
            priority
          />

          <div className="leading-none">
            <h1 className="text-5xl font-extrabold text-blue-700">
              SAP
            </h1>

            <p className="mt-1 text-xs font-bold tracking-wide text-slate-800">
              SIMMY AI PLATFORM
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-400">
          A Product of Simmy Link Africa
        </p>
      </div>

      {/* Navigation */}

      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                pathname.startsWith(
                  `${item.href}/`
                ));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition ${
                    item.prominent
                      ? isActive
                        ? "bg-blue-700 text-white shadow-sm"
                        : "border border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100"
                      : isActive
                        ? "bg-blue-700 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {Icon && (
                    <Icon className="h-5 w-5 flex-shrink-0" />
                  )}

                  <span
                    className={
                      item.prominent
                        ? "font-bold"
                        : ""
                    }
                  >
                    {item.name}
                  </span>

                  {item.prominent && (
                    <span
                      className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      Central
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {!authLoading && !canAccessAdminManagement && (
          <p className="mt-6 px-4 text-xs leading-5 text-slate-400">
            Platform administration is available only to
            the SAP Super Admin.
          </p>
        )}
      </nav>

      {/* Footer */}

      <div className="border-t border-slate-200 p-6 text-xs text-slate-400">
        © 2026 SIMMY-LINK CONCEPT LTD
      </div>
    </aside>
  );
}
