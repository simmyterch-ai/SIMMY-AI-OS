import { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";

import {
  verifyToken,
  JwtPayload,
  AuthScope,
} from "@/lib/jwt";

// =======================================================
// SUPPORTED ORGANIZATION LANGUAGES
// =======================================================

export type OrganizationLanguage =
  | "en"
  | "fr"
  | "ar";

// =======================================================
// AUTHENTICATED USER
// =======================================================

export type AuthenticatedUser = {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  role: string;
  status: string;
  isActive: boolean;

  organizationId: number | null;

  // Organization language
  language: OrganizationLanguage;

  scope: AuthScope;

  departmentId: number | null;
  teamId: number | null;
};

// =======================================================
// ORGANIZATION AUTHENTICATED USER
// =======================================================

export type OrganizationAuthenticatedUser =
  AuthenticatedUser & {
    organizationId: number;
    scope: "ORGANIZATION";
  };

// =======================================================
// REQUIRE ORGANIZATION CONTEXT
// =======================================================

export function requireOrganizationId(
  user: AuthenticatedUser
): number {
  if (user.scope === "PLATFORM") {
    throw new Error(
      "ORGANIZATION_CONTEXT_REQUIRED"
    );
  }

  if (user.organizationId === null) {
    throw new Error(
      "ORGANIZATION_CONTEXT_REQUIRED"
    );
  }

  return user.organizationId;
}

// =======================================================
// VALIDATE ORGANIZATION LANGUAGE
// =======================================================

function normalizeOrganizationLanguage(
  language: string | null | undefined
): OrganizationLanguage {
  if (
    language === "fr" ||
    language === "ar"
  ) {
    return language;
  }

  return "en";
}

// =======================================================
// GET AUTHENTICATED USER
// =======================================================

export async function getAuthenticatedUser(
  request: NextRequest
): Promise<AuthenticatedUser | null> {
  const token =
    request.cookies.get("sap_token")?.value;

  if (!token) {
    return null;
  }

  const payload: JwtPayload | null =
    await verifyToken(token);

  if (!payload) {
    return null;
  }

  const user =
    await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },

      select: {
        id: true,
        employeeId: true,
        name: true,
        email: true,
        role: true,
        status: true,
        isActive: true,
        organizationId: true,
        departmentId: true,
        teamId: true,

        // =================================================
        // ORGANIZATION LANGUAGE
        // =================================================

        organization: {
          select: {
            language: true,
          },
        },
      },
    });

  if (!user || !user.isActive) {
    return null;
  }

  // =====================================================
  // TOKEN MUST BELONG TO SAME DATABASE USER
  // =====================================================

  if (user.id !== payload.userId) {
    return null;
  }

  // =====================================================
  // TOKEN EMAIL MUST MATCH DATABASE USER
  // =====================================================

  if (
    user.email.toLowerCase() !==
    payload.email.toLowerCase()
  ) {
    return null;
  }

  // =====================================================
  // PLATFORM USER
  // =====================================================

  if (payload.scope === "PLATFORM") {
    if (
      user.organizationId !== null ||
      payload.organizationId !== null
    ) {
      return null;
    }

    return {
      id: user.id,
      employeeId: user.employeeId,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      isActive: user.isActive,

      organizationId: null,

      // Platform remains English by default.
      language: "en",

      scope: "PLATFORM",

      departmentId: user.departmentId,
      teamId: user.teamId,
    };
  }

  // =====================================================
  // ORGANIZATION USER
  // =====================================================

  if (
    user.organizationId === null ||
    payload.organizationId === null ||
    payload.scope !== "ORGANIZATION"
  ) {
    return null;
  }

  // =====================================================
  // TENANT IDENTITY MUST MATCH
  // =====================================================

  if (
    user.organizationId !==
    payload.organizationId
  ) {
    return null;
  }

  // =====================================================
  // ORGANIZATION LANGUAGE
  // =====================================================

  const language =
    normalizeOrganizationLanguage(
      user.organization?.language
    );

  return {
    id: user.id,
    employeeId: user.employeeId,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    isActive: user.isActive,

    organizationId:
      user.organizationId,

    language,

    scope: "ORGANIZATION",

    departmentId: user.departmentId,
    teamId: user.teamId,
  };
}

// =======================================================
// CHECK USER PERMISSION
// =======================================================
//
// Permission model:
//
//   attendance
//   attendance.view
//   attendance.create
//   attendance.update
//   attendance.delete
//
// Existing SAP database currently contains the module-level
// permission:
//
//   attendance
//
// Therefore a role with "attendance" is allowed to access
// attendance actions until granular permissions are added.
//
// Exact action permissions always take priority.
//
// =======================================================

export async function hasPermission(
  user: AuthenticatedUser,
  permissionName: string
): Promise<boolean> {
  // =====================================================
  // PLATFORM USER
  // =====================================================

  if (user.scope === "PLATFORM") {
    return true;
  }

  // =====================================================
  // ALL OTHER USERS MUST BE ORGANIZATION-SCOPED
  // =====================================================

  if (
    user.scope !== "ORGANIZATION" ||
    user.organizationId === null
  ) {
    return false;
  }

  // =====================================================
  // FIND ORGANIZATION ROLE
  // =====================================================

  const role =
    await prisma.role.findFirst({
      where: {
        name: user.role,
        organizationId:
          user.organizationId,
      },

      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

  if (!role) {
    return false;
  }

  // =====================================================
  // EXACT PERMISSION MATCH
  // =====================================================

  const exactMatch =
    role.permissions.some(
      (rolePermission) =>
        rolePermission.permission.name ===
        permissionName
    );

  if (exactMatch) {
    return true;
  }

  // =====================================================
  // MODULE-LEVEL FALLBACK
  // =====================================================

  const moduleName =
    permissionName.includes(".")
      ? permissionName.split(".")[0]
      : permissionName;

  const modulePermission =
    role.permissions.some(
      (rolePermission) =>
        rolePermission.permission.name ===
        moduleName
    );

  if (modulePermission) {
    return true;
  }

  return false;
}

// =======================================================
// TENANT PERMISSION NAMES
// =======================================================

export type OrganizationPermission =
  | "attendance"
  | "attendance.view"
  | "attendance.create"
  | "attendance.update"
  | "attendance.delete"
  | "organization"
  | "organization.view"
  | "organization.create"
  | "organization.update"
  | "organization.delete"
  | "people"
  | "people.view"
  | "people.create"
  | "people.update"
  | "people.delete"
  | "settings"
  | "settings.view"
  | "settings.update";

// =======================================================
// REQUIRE PERMISSION
// =======================================================

export async function requirePermission(
  request: NextRequest,
  permissionName: OrganizationPermission
): Promise<AuthenticatedUser>;

export async function requirePermission(
  request: NextRequest,
  permissionName: string
): Promise<AuthenticatedUser>;

export async function requirePermission(
  request: NextRequest,
  permissionName: string
): Promise<AuthenticatedUser> {
  const user =
    await getAuthenticatedUser(request);

  // =====================================================
  // AUTHENTICATION
  // =====================================================

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  // =====================================================
  // PERMISSION
  // =====================================================

  const allowed =
    await hasPermission(
      user,
      permissionName
    );

  if (!allowed) {
    throw new Error("FORBIDDEN");
  }

  // =====================================================
  // PLATFORM USER
  // =====================================================

  if (
    user.scope === "PLATFORM"
  ) {
    return user;
  }

  // =====================================================
  // ORGANIZATION USER
  // =====================================================

  if (
    user.scope === "ORGANIZATION" &&
    user.organizationId !== null
  ) {
    return user;
  }

  // =====================================================
  // INVALID ORGANIZATION CONTEXT
  // =====================================================

  throw new Error(
    "ORGANIZATION_CONTEXT_REQUIRED"
  );
}

// =======================================================
// EXPLICIT ORGANIZATION PERMISSION HELPER
// =======================================================

export async function requireOrganizationPermission(
  request: NextRequest,
  permissionName: OrganizationPermission
): Promise<OrganizationAuthenticatedUser> {
  const user =
    await requirePermission(
      request,
      permissionName
    );

  if (
    user.scope !== "ORGANIZATION" ||
    user.organizationId === null
  ) {
    throw new Error(
      "ORGANIZATION_CONTEXT_REQUIRED"
    );
  }

  return {
    ...user,
    scope: "ORGANIZATION",
    organizationId:
      user.organizationId,
  };
}