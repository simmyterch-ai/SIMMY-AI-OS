import { organizationRepository } from "@/repositories/organization.repository";

export class OrganizationService {
  // =======================================================
  // GET ORGANIZATION
  // =======================================================

  async getOrganization() {
    return organizationRepository.getOrganization();
  }

  // =======================================================
  // SAVE ORGANIZATION
  // =======================================================

  async saveOrganization(data: {
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
    const organization =
      await organizationRepository.getOrganization();

    // =====================================================
    // CREATE ORGANIZATION
    // =====================================================

    if (!organization) {
      return organizationRepository.createOrganization(data);
    }

    // =====================================================
    // UPDATE ORGANIZATION
    // =====================================================

    return organizationRepository.updateOrganization(
      organization.id,
      data
    );
  }
}

export const organizationService =
  new OrganizationService();