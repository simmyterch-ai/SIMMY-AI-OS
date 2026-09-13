import { prisma } from "@/lib/prisma";

export class OrganizationRepository {
  // =======================================================
  // GET ORGANIZATION
  // =======================================================

  async getOrganization() {
    return prisma.organization.findFirst({
      orderBy: {
        id: "asc",
      },
    });
  }

  // =======================================================
  // CREATE ORGANIZATION
  // =======================================================

  async createOrganization(data: {
    name: string;
    legalName?: string;
    email?: string;
    phone?: string;
    website?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    logo?: string;
    industry?: string;
    timezone?: string;
    currency?: string;
    workingDays?: string;
    workingHours?: string;

    // =====================================================
    // ORGANIZATION LANGUAGE
    // SAP V1: English, French, Arabic
    // =====================================================

    language?: "en" | "fr" | "ar";
  }) {
    return prisma.organization.create({
      data,
    });
  }

  // =======================================================
  // UPDATE ORGANIZATION
  // =======================================================

  async updateOrganization(
    id: number,
    data: {
      name?: string;
      legalName?: string;
      email?: string;
      phone?: string;
      website?: string;
      address?: string;
      city?: string;
      state?: string;
      country?: string;
      postalCode?: string;
      logo?: string;
      industry?: string;
      timezone?: string;
      currency?: string;
      workingDays?: string;
      workingHours?: string;

      // =====================================================
      // ORGANIZATION LANGUAGE
      // SAP V1: English, French, Arabic
      // =====================================================

      language?: "en" | "fr" | "ar";
    }
  ) {
    return prisma.organization.update({
      where: {
        id,
      },
      data,
    });
  }
}

export const organizationRepository =
  new OrganizationRepository();