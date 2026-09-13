import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

type AdminModule = {
  title: string;
  description: string;
  href: string;
  icon: string;
  category: "SIMMY LINK AFRICA" | "SAP MANAGEMENT";
};

const modules: AdminModule[] = [
  {
    title: "Opportunities",
    description:
      "Create, publish and manage jobs, scholarships, grants and other opportunities.",
    href: "/opportunities-admin",
    icon: "💼",
    category: "SIMMY LINK AFRICA",
  },
  {
    title: "Opportunity Applications",
    description:
      "View and manage applications submitted by SIMMY LINK AFRICA account holders.",
    href: "/opportunity-applications",
    icon: "📨",
    category: "SIMMY LINK AFRICA",
  },
  {
    title: "Education & Training",
    description:
      "Manage education providers, programmes, courses and training opportunities.",
    href: "/education-admin",
    icon: "🎓",
    category: "SIMMY LINK AFRICA",
  },
  {
    title: "Careers",
    description:
      "Create and manage career listings, jobs and professional opportunities.",
    href: "/careers-admin",
    icon: "📈",
    category: "SIMMY LINK AFRICA",
  },
  {
    title: "Business",
    description:
      "Manage business listings, partnerships and business opportunities.",
    href: "/businesses-admin",
    icon: "🏢",
    category: "SIMMY LINK AFRICA",
  },
  {
    title: "Marketplace",
    description:
      "Manage products, services and marketplace listings.",
    href: "/marketplace-admin",
    icon: "🛒",
    category: "SIMMY LINK AFRICA",
  },
  {
  title: "Contact Messages",
  description:
    "View, manage and respond to messages submitted by visitors through the SIMMY LINK AFRICA contact form.",
  href: "/contact-messages",
  icon: "📩",
  category: "SIMMY LINK AFRICA",
  },
  {
    title: "Marketplace Enquiries",
    description:
      "Review customer enquiries, requests and messages from marketplace users.",
    href: "/marketplace-enquiries",
    icon: "💬",
    category: "SIMMY LINK AFRICA",
  },
  {
    title: "Currency & Pricing",
    description:
      "Manage supported currencies, USD exchange rates, FX protection margins and central platform pricing.",
    href: "/currency-pricing",
    icon: "💱",
    category: "SIMMY LINK AFRICA",
  },
  {
    title: "Public Accounts",
    description:
      "View and manage SIMMY LINK AFRICA public user accounts.",
    href: "/public-accounts",
    icon: "👥",
    category: "SIMMY LINK AFRICA",
  },

  {
    title: "Organization",
    description:
      "Manage organization information and company structure.",
    href: "/organization",
    icon: "🏛️",
    category: "SAP MANAGEMENT",
  },
  {
    title: "People",
    description:
      "Manage employees and people records.",
    href: "/people",
    icon: "👤",
    category: "SAP MANAGEMENT",
  },
  {
    title: "Departments",
    description:
      "Create and manage organizational departments.",
    href: "/departments",
    icon: "🏷️",
    category: "SAP MANAGEMENT",
  },
  {
    title: "Teams",
    description:
      "Manage teams and team assignments.",
    href: "/teams",
    icon: "👥",
    category: "SAP MANAGEMENT",
  },
  {
    title: "Attendance",
    description:
      "View and manage attendance records.",
    href: "/attendance",
    icon: "📅",
    category: "SAP MANAGEMENT",
  },
  {
    title: "Reports",
    description:
      "View system reports and administrative insights.",
    href: "/reports",
    icon: "📊",
    category: "SAP MANAGEMENT",
  },
  {
    title: "Settings",
    description:
      "Manage system and administration settings.",
    href: "/settings",
    icon: "⚙️",
    category: "SAP MANAGEMENT",
  },
];

async function requirePlatformSuperAdmin() {
  const cookieStore = await cookies();

  const token = cookieStore.get("sap_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const payload = await verifyToken(token);

  if (!payload) {
    redirect("/login");
  }

  if (payload.scope !== "PLATFORM") {
    redirect("/dashboard");
  }

  if (payload.organizationId !== null) {
    redirect("/dashboard");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: payload.userId,
    },
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      organizationId: true,
    },
  });

  if (!user || !user.isActive) {
    redirect("/login");
  }

  if (user.id !== payload.userId) {
    redirect("/login");
  }

  if (
    user.email.trim().toLowerCase() !==
    payload.email.trim().toLowerCase()
  ) {
    redirect("/login");
  }

  if (user.organizationId !== null) {
    redirect("/dashboard");
  }

  const normalizedRole = user.role.trim().toLowerCase();

  if (normalizedRole !== "super admin") {
    redirect("/dashboard");
  }

  return user;
}

export default async function AdminManagementPage() {
  await requirePlatformSuperAdmin();

  const simmyModules = modules.filter(
    (module) => module.category === "SIMMY LINK AFRICA"
  );

  const sapModules = modules.filter(
    (module) => module.category === "SAP MANAGEMENT"
  );

  return (
    <div className="space-y-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Administration
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          SIMMY LINK AFRICA Management
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Manage all SIMMY LINK AFRICA platform modules from one central
          administration dashboard.
        </p>
      </div>

      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-950">
            SIMMY LINK AFRICA Platform
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Manage public-facing services, content, applications, users,
            marketplace activity, currencies and platform pricing.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {simmyModules.map((module) => (
            <Link
              key={module.href}
              href={module.href}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                  {module.icon}
                </div>

                <div>
                  <h3 className="font-bold text-slate-950 group-hover:text-slate-700">
                    {module.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {module.description}
                  </p>

                  <p className="mt-4 text-sm font-semibold text-slate-900">
                    Manage →
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 pt-10">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-950">
            SAP Management
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Access the existing internal organization and workforce management
            modules.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {sapModules.map((module) => (
            <Link
              key={module.href}
              href={module.href}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                  {module.icon}
                </div>

                <div>
                  <h3 className="font-bold text-slate-950 group-hover:text-slate-700">
                    {module.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {module.description}
                  </p>

                  <p className="mt-4 text-sm font-semibold text-slate-900">
                    Open →
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}