import { prisma } from "@/lib/prisma";

const permissions = [
  { module: "Dashboard", name: "dashboard.view" },

  { module: "Organization", name: "organization.view" },
  { module: "Organization", name: "organization.edit" },

  { module: "People", name: "people.view" },
  { module: "People", name: "people.create" },
  { module: "People", name: "people.edit" },
  { module: "People", name: "people.delete" },

  { module: "Departments", name: "departments.view" },
  { module: "Departments", name: "departments.create" },
  { module: "Departments", name: "departments.edit" },
  { module: "Departments", name: "departments.delete" },

  { module: "Teams", name: "teams.view" },
  { module: "Teams", name: "teams.create" },
  { module: "Teams", name: "teams.edit" },
  { module: "Teams", name: "teams.delete" },

  { module: "Attendance", name: "attendance.view" },
  { module: "Attendance", name: "attendance.checkin" },
  { module: "Attendance", name: "attendance.checkout" },

  { module: "Reports", name: "reports.view" },
  { module: "Reports", name: "reports.export" },

  { module: "AI Assistant", name: "ai.view" },

  { module: "Roles", name: "roles.view" },
  { module: "Roles", name: "roles.create" },
  { module: "Roles", name: "roles.edit" },
  { module: "Roles", name: "roles.delete" },
  { module: "Roles", name: "roles.assign" },
];

async function seed() {
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: {
        name: permission.name,
      },
      update: {},
      create: permission,
    });
  }

  console.log("Permissions seeded successfully.");
}

seed()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });