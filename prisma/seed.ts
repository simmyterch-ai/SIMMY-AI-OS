import "dotenv/config";

import {
  PrismaClient,
} from "../lib/generated/prisma/client";

import {
  PrismaPg,
} from "@prisma/adapter-pg";

import {
  hashPassword,
} from "../lib/password";

// =======================================================
// PRISMA CONNECTION
// =======================================================

const connectionString =
  process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not defined."
  );
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

// =======================================================
// MODULE PERMISSIONS
// =======================================================

const MODULE_PERMISSIONS = [
  {
    name: "dashboard",
    module: "Dashboard",
    description:
      "Access to the Dashboard module.",
  },
  {
    name: "organization",
    module: "Organization",
    description:
      "Access to the Organization module.",
  },
  {
    name: "people",
    module: "People",
    description:
      "Access to the People module.",
  },
{
  name: "departments.view",
  module: "Departments",
  description:
    "View departments.",
},
{
  name: "departments.create",
  module: "Departments",
  description:
    "Create departments.",
},
{
  name: "departments.update",
  module: "Departments",
  description:
    "Update departments.",
},
{
  name: "departments.delete",
  module: "Departments",
  description:
    "Delete departments.",
},
  {
    name: "teams",
    module: "Teams",
    description:
      "Access to the Teams module.",
  },
  {
    name: "attendance",
    module: "Attendance",
    description:
      "Access to the Attendance module.",
  },
  {
    name: "reports",
    module: "Reports",
    description:
      "Access to the Reports module.",
  },
  {
    name: "settings",
    module: "Settings",
    description:
      "Access to the Settings module.",
  },
  {
    name: "ai_assistant",
    module: "AI Assistant",
    description:
      "Access to the AI Assistant module.",
  },
];

// =======================================================
// ORGANIZATION ROLES
// =======================================================

const ORGANIZATION_ROLES = [
  {
    name: "Administrator",
    description:
      "Organization administrator.",
  },
  {
    name: "HR Manager",
    description:
      "Human resource manager.",
  },
  {
    name: "Department Manager",
    description:
      "Department manager.",
  },
  {
    name: "Employee",
    description:
      "Standard employee.",
  },
];

// =======================================================
// ROLE PERMISSIONS
// =======================================================

const ROLE_PERMISSIONS: Record<
  string,
  string[]
> = {
  Administrator: [
    "dashboard",
    "organization",
    "people",
    "departments.view",
    "departments.create",
    "departments.update",
    "departments.delete",
    "teams",
    "attendance",
    "reports",
    "settings",
    "ai_assistant",
  ],

"HR Manager": [
  "dashboard",
  "people",

  "departments.view",
  "departments.create",
  "departments.update",
  "departments.delete",

  "teams",
  "attendance",
  "reports",
  "ai_assistant",
],

  "Department Manager": [
  "dashboard",
  "people",

  "departments.view",
  "departments.create",
  "departments.update",
  "departments.delete",

  "teams",
  "attendance",
  "reports",
  "ai_assistant",
],

  Employee: [
    "dashboard",
    "attendance",
    "ai_assistant",
  ],
};

// =======================================================
// SUPER ADMIN
// =======================================================

const SUPER_ADMIN_EMAIL =
  process.env.SUPER_ADMIN_EMAIL ??
  "superadmin@simmylinkafrica.com";

const SUPER_ADMIN_PASSWORD =
  process.env.SUPER_ADMIN_PASSWORD ??
  "ChangeMe@SAP2026!";

const SUPER_ADMIN_NAME =
  process.env.SUPER_ADMIN_NAME ??
  "SAP Super Admin";

const SUPER_ADMIN_EMPLOYEE_ID =
  "SAP-SUPER-ADMIN-001";

// =======================================================
// DEMO ORGANIZATION
// =======================================================

const DEMO_ORGANIZATION_NAME =
  "SIMMY LINK AFRICA";

const DEMO_ORGANIZATION_EMAIL =
  "admin@simmylinkafrica.com";

const DEMO_ADMIN_EMAIL =
  "demo@simmylinkafrica.com";

const DEMO_ADMIN_PASSWORD =
  "Demo@SAP2026!";

// =======================================================
// SEED PERMISSIONS
// =======================================================

async function seedPermissions() {
  console.log("");
  console.log(
    "🔐 Seeding platform permissions..."
  );

  const permissions = [];

  for (const permission of MODULE_PERMISSIONS) {
    const result =
      await prisma.permission.upsert({
        where: {
          name: permission.name,
        },

        update: {
          module: permission.module,
          description:
            permission.description,
        },

        create: {
          name: permission.name,
          module: permission.module,
          description:
            permission.description,
        },
      });

    permissions.push(result);
  }

  console.log(
    `✅ ${permissions.length} permissions ready`
  );

  return permissions;
}

// =======================================================
// SEED ORGANIZATION ROLES
// =======================================================

async function seedOrganizationRoles(
  organizationId: number
) {
  console.log("");
  console.log(
    `👥 Seeding roles for organization ${organizationId}...`
  );

  const roles = [];

  for (const role of ORGANIZATION_ROLES) {
    const result =
      await prisma.role.upsert({
        where: {
          organizationId_name: {
            organizationId,
            name: role.name,
          },
        },

        update: {
          description:
            role.description,
          isSystem: true,
        },

        create: {
          name: role.name,
          description:
            role.description,
          isSystem: true,
          organizationId,
        },
      });

    roles.push(result);
  }

  console.log(
    `✅ ${roles.length} organization roles ready`
  );

  return roles;
}

// =======================================================
// ASSIGN ORGANIZATION ROLE PERMISSIONS
// =======================================================

async function seedRolePermissions(
  organizationId: number
) {
  console.log("");
  console.log(
    "🔗 Synchronizing role permissions..."
  );

  const permissions =
    await prisma.permission.findMany({
      where: {
        name: {
          in: MODULE_PERMISSIONS.map(
            (item) => item.name
          ),
        },
      },
    });

  const permissionMap =
    new Map(
      permissions.map(
        (permission) => [
          permission.name,
          permission.id,
        ]
      )
    );

  const roles =
    await prisma.role.findMany({
      where: {
        organizationId,
        name: {
          in: ORGANIZATION_ROLES.map(
            (role) => role.name
          ),
        },
      },
    });

  for (const role of roles) {
    const permissionNames =
      ROLE_PERMISSIONS[role.name] ??
      [];

    // Remove only permission links
    // belonging to this role.
    //
    // We do NOT delete the role itself.
    await prisma.rolePermission.deleteMany({
      where: {
        roleId: role.id,
      },
    });

    for (const permissionName of permissionNames) {
      const permissionId =
        permissionMap.get(
          permissionName
        );

      if (!permissionId) {
        throw new Error(
          `Permission "${permissionName}" was not found.`
        );
      }

      await prisma.rolePermission.create({
        data: {
          roleId: role.id,
          permissionId,
        },
      });
    }
  }

  console.log(
    "✅ Organization role permissions synchronized"
  );
}

// =======================================================
// FIND OR CREATE DEMO ORGANIZATION
// =======================================================

async function seedDemoOrganization() {
  console.log("");
  console.log(
    "🏢 Preparing SIMMY LINK AFRICA organization..."
  );

  let organization =
    await prisma.organization.findFirst({
      where: {
        name: DEMO_ORGANIZATION_NAME,
      },
    });

  if (!organization) {
    organization =
      await prisma.organization.create({
        data: {
          name:
            DEMO_ORGANIZATION_NAME,

          legalName:
            DEMO_ORGANIZATION_NAME,

          email:
            DEMO_ORGANIZATION_EMAIL,

          country: "Nigeria",

          timezone:
            "Africa/Lagos",

          currency: "NGN",
        },
      });

    console.log(
      `✅ Organization created: ${organization.name}`
    );
  } else {
    organization =
      await prisma.organization.update({
        where: {
          id: organization.id,
        },

        data: {
          legalName:
            organization.legalName ??
            DEMO_ORGANIZATION_NAME,

          email:
            organization.email ??
            DEMO_ORGANIZATION_EMAIL,
        },
      });

    console.log(
      `✅ Existing organization retained: ${organization.name}`
    );
  }

  return organization;
}

// =======================================================
// DEMO DEPARTMENT
// =======================================================

async function seedDemoDepartment(
  organizationId: number
) {
  let department =
    await prisma.department.findFirst({
      where: {
        organizationId,
        name: "Administration",
      },
    });

  if (!department) {
    department =
      await prisma.department.create({
        data: {
          name: "Administration",

          description:
            "Administration department for the SAP demonstration organization.",

          status: "Active",

          organizationId,
        },
      });
  } else {
    department =
      await prisma.department.update({
        where: {
          id: department.id,
        },

        data: {
          description:
            "Administration department for the SAP demonstration organization.",

          status: "Active",
        },
      });
  }

  console.log(
    `✅ Department ready: ${department.name}`
  );

  return department;
}

// =======================================================
// DEMO TEAM
// =======================================================

async function seedDemoTeam(
  organizationId: number,
  departmentId: number
) {
  let team =
    await prisma.team.findFirst({
      where: {
        organizationId,
        name:
          "Demo Administration Team",
      },
    });

  if (!team) {
    team =
      await prisma.team.create({
        data: {
          name:
            "Demo Administration Team",

          description:
            "Demo team for SAP demonstration.",

          departmentId,

          organizationId,
        },
      });
  } else {
    team =
      await prisma.team.update({
        where: {
          id: team.id,
        },

        data: {
          departmentId,

          description:
            "Demo team for SAP demonstration.",
        },
      });
  }

  console.log(
    `✅ Team ready: ${team.name}`
  );

  return team;
}

// =======================================================
// SUPER ADMIN ACCOUNT
// =======================================================

async function seedSuperAdmin() {
  console.log("");
  console.log(
    "👑 Preparing Super Admin account..."
  );

  const passwordHash =
    await hashPassword(
      SUPER_ADMIN_PASSWORD
    );

  const superAdmin =
    await prisma.user.upsert({
      where: {
        email:
          SUPER_ADMIN_EMAIL,
      },

      update: {
        name:
          SUPER_ADMIN_NAME,

        passwordHash,

        role: "Super Admin",

        status: "Active",

        isActive: true,

        emailVerified: true,

        organizationId: null,

        departmentId: null,

        teamId: null,
      },

      create: {
        employeeId:
          SUPER_ADMIN_EMPLOYEE_ID,

        name:
          SUPER_ADMIN_NAME,

        email:
          SUPER_ADMIN_EMAIL,

        passwordHash,

        role: "Super Admin",

        status: "Active",

        isActive: true,

        emailVerified: true,

        organizationId: null,

        departmentId: null,

        teamId: null,
      },
    });

  console.log(
    "✅ Super Admin account ready"
  );

  console.log("");
  console.log(
    "👑 PLATFORM SUPER ADMIN"
  );
  console.log(
    "--------------------------------"
  );
  console.log(
    `Email: ${SUPER_ADMIN_EMAIL}`
  );
  console.log(
    `Password: ${SUPER_ADMIN_PASSWORD}`
  );
  console.log(
    "Scope: PLATFORM"
  );
  console.log(
    "--------------------------------"
  );

  return superAdmin;
}

// =======================================================
// DEMO ADMINISTRATOR
// =======================================================

async function seedDemoAdministrator(
  organizationId: number,
  departmentId: number,
  teamId: number
) {
  console.log("");
  console.log(
    "🧪 Preparing organization Administrator..."
  );

  const passwordHash =
    await hashPassword(
      DEMO_ADMIN_PASSWORD
    );

  const demoUser =
    await prisma.user.upsert({
      where: {
        email:
          DEMO_ADMIN_EMAIL,
      },

      update: {
        name:
          "SAP Demo Administrator",

        passwordHash,

        phone:
          "+2340000000000",

        location:
          "Demo Environment",

        role:
          "Administrator",

        status:
          "Active",

        isActive:
          true,

        emailVerified:
          true,

        organizationId,

        departmentId,

        teamId,
      },

      create: {
        employeeId:
          "SAP-DEMO-001",

        name:
          "SAP Demo Administrator",

        email:
          DEMO_ADMIN_EMAIL,

        passwordHash,

        phone:
          "+2340000000000",

        location:
          "Demo Environment",

        role:
          "Administrator",

        status:
          "Active",

        isActive:
          true,

        emailVerified:
          true,

        organizationId,

        departmentId,

        teamId,
      },
    });

  console.log(
    "✅ Demo Administrator ready"
  );

  console.log("");
  console.log(
    "🧪 ORGANIZATION DEMO LOGIN"
  );
  console.log(
    "--------------------------------"
  );
  console.log(
    `Email: ${DEMO_ADMIN_EMAIL}`
  );
  console.log(
    `Password: ${DEMO_ADMIN_PASSWORD}`
  );
  console.log(
    `Organization ID: ${organizationId}`
  );
  console.log(
    "Role: Administrator"
  );
  console.log(
    "Scope: ORGANIZATION"
  );
  console.log(
    "--------------------------------"
  );

  return demoUser;
}

// =======================================================
// MAIN SEED
// =======================================================

async function main() {
  console.log("");
  console.log(
    "🌱 Seeding SIMMY AI PLATFORM..."
  );
  console.log(
    "================================"
  );

  // -----------------------------------------------------
  // 1. PLATFORM PERMISSIONS
  // -----------------------------------------------------

  await seedPermissions();

  // -----------------------------------------------------
  // 2. SUPER ADMIN
  // -----------------------------------------------------

  await seedSuperAdmin();

  // -----------------------------------------------------
  // 3. DEMO ORGANIZATION
  // -----------------------------------------------------

  const organization =
    await seedDemoOrganization();

  // -----------------------------------------------------
  // 4. ORGANIZATION ROLES
  // -----------------------------------------------------

  await seedOrganizationRoles(
    organization.id
  );

  // -----------------------------------------------------
  // 5. ROLE PERMISSIONS
  // -----------------------------------------------------

  await seedRolePermissions(
    organization.id
  );

  // -----------------------------------------------------
  // 6. DEMO DEPARTMENT
  // -----------------------------------------------------

  const department =
    await seedDemoDepartment(
      organization.id
    );

  // -----------------------------------------------------
  // 7. DEMO TEAM
  // -----------------------------------------------------

  const team =
    await seedDemoTeam(
      organization.id,
      department.id
    );

  // -----------------------------------------------------
  // 8. DEMO ADMINISTRATOR
  // -----------------------------------------------------

  await seedDemoAdministrator(
    organization.id,
    department.id,
    team.id
  );

  // -----------------------------------------------------
  // COMPLETE
  // -----------------------------------------------------

  console.log("");
  console.log(
    "================================"
  );
  console.log(
    "🎉 SIMMY AI PLATFORM seed complete!"
  );
  console.log(
    "================================"
  );

  console.log("");
  console.log(
    "Architecture:"
  );
  console.log(
    "  PLATFORM"
  );
  console.log(
    "    └── Super Admin"
  );
  console.log(
    "          organizationId = NULL"
  );
  console.log("");
  console.log(
    "  ORGANIZATION"
  );
  console.log(
    `    └── ${organization.name}`
  );
  console.log(
    "          └── Administrator"
  );
  console.log(
    "          └── HR Manager"
  );
  console.log(
    "          └── Department Manager"
  );
  console.log(
    "          └── Employee"
  );
}

// =======================================================
// RUN
// =======================================================

main()
  .catch((error) => {
    console.error("");
    console.error(
      "❌ Seed failed:"
    );
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });