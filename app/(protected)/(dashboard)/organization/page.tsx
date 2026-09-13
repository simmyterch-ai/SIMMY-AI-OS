"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import FormField from "@/components/ui/FormField";

type Locale = "en" | "fr" | "ar";

type Organization = {
  name: string;
  legalName: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  logo: string;
  industry: string;
  timezone: string;
  currency: string;
  workingDays: string;
  workingHours: string;

  // =====================================================
  // ORGANIZATION LANGUAGE
  // =====================================================

  language: Locale;

  createdAt?: string;
  updatedAt?: string;
};

const emptyOrganization: Organization = {
  name: "",
  legalName: "",
  email: "",
  phone: "",
  website: "",
  address: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  logo: "",
  industry: "",
  timezone: "Africa/Lagos",
  currency: "NGN",
  workingDays: "",
  workingHours: "",

  // SAP V1 default language
  language: "en",
};

export default function OrganizationPage() {
  const [organization, setOrganization] =
    useState<Organization>(emptyOrganization);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [selectedLogo, setSelectedLogo] =
    useState<File | null>(null);

  const [uploadingLogo, setUploadingLogo] =
    useState(false);

  // =====================================================
  // LOAD ORGANIZATION
  // =====================================================

  useEffect(() => {
    loadOrganization();
  }, []);

  async function loadOrganization() {
    try {
      const response =
        await fetch("/api/organization");

      const result =
        await response.json();

      if (result.organization) {
        setOrganization({
          ...emptyOrganization,
          ...result.organization,

          // Protect against an invalid/missing database value
          language:
            result.organization.language === "fr" ||
            result.organization.language === "ar"
              ? result.organization.language
              : "en",
        });
      }
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load organization."
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // UPLOAD LOGO
  // =====================================================

  async function uploadLogo() {
    if (!selectedLogo) {
      toast.error(
        "Please choose a logo first."
      );
      return;
    }

    try {
      setUploadingLogo(true);

      const formData = new FormData();

      formData.append(
        "file",
        selectedLogo
      );

      const response = await fetch(
        "/api/upload/logo",
        {
          method: "POST",
          body: formData,
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message
        );
      }

      setOrganization((previous) => ({
        ...previous,
        logo: result.path,
      }));

      toast.success(
        "Logo uploaded."
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Upload failed."
      );
    } finally {
      setUploadingLogo(false);
    }
  }

  // =====================================================
  // SAVE ORGANIZATION
  // =====================================================

  async function handleSave(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setSaving(true);

      const response =
        await fetch(
          "/api/organization",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              organization
            ),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message
        );
      }

      toast.success(
        "Organization updated successfully."
      );

      await loadOrganization();
    } catch (error) {
      console.error(error);

      toast.error(
        "Save failed."
      );
    } finally {
      setSaving(false);
    }
  }

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center">
        Loading organization...
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="space-y-8">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Organization
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your company profile and organization settings.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8">

        {/* =================================================
            LEFT COLUMN
        ================================================= */}

        <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

          <form
            onSubmit={handleSave}
            className="space-y-6"
          >

            {/* =============================================
                ORGANIZATION LOGO
            ============================================= */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

              <h2 className="mb-4 text-lg font-semibold">
                Organization Logo
              </h2>

              <div className="flex items-center gap-6">

                <div className="h-24 w-24 overflow-hidden rounded-2xl border bg-white">

                  <Image
                    src={
                      organization.logo
                        ? organization.logo
                        : "/images/sap-logo.png"
                    }
                    alt="Logo"
                    width={96}
                    height={96}
                    className="h-full w-full object-contain"
                  />

                </div>

                <div className="space-y-3">

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (
                        e.target.files &&
                        e.target.files.length > 0
                      ) {
                        setSelectedLogo(
                          e.target.files[0]
                        );
                      }
                    }}
                  />

                  <button
                    type="button"
                    onClick={uploadLogo}
                    disabled={uploadingLogo}
                    className="rounded-xl bg-blue-700 px-5 py-2 font-medium text-white transition hover:bg-blue-800 disabled:opacity-50"
                  >
                    {uploadingLogo
                      ? "Uploading..."
                      : "Upload Logo"}
                  </button>

                </div>

              </div>

            </div>

            {/* =============================================
                ORGANIZATION NAME
            ============================================= */}

            <FormField
              label="Organization Name"
              value={organization.name}
              onChange={(e) =>
                setOrganization({
                  ...organization,
                  name: e.target.value,
                })
              }
            />

            {/* =============================================
                LEGAL COMPANY
            ============================================= */}

            <FormField
              label="Legal Company"
              value={organization.legalName}
              onChange={(e) =>
                setOrganization({
                  ...organization,
                  legalName: e.target.value,
                })
              }
            />

            {/* =============================================
                COUNTRY / INDUSTRY
            ============================================= */}

            <div className="grid grid-cols-2 gap-6">

              <FormField
                label="Country"
                value={organization.country}
                onChange={(e) =>
                  setOrganization({
                    ...organization,
                    country: e.target.value,
                  })
                }
              />

              <FormField
                label="Industry"
                value={organization.industry}
                onChange={(e) =>
                  setOrganization({
                    ...organization,
                    industry: e.target.value,
                  })
                }
              />

            </div>

            {/* =============================================
                WEBSITE
            ============================================= */}

            <FormField
              label="Website"
              value={organization.website}
              onChange={(e) =>
                setOrganization({
                  ...organization,
                  website: e.target.value,
                })
              }
            />

            {/* =============================================
                BUSINESS EMAIL
            ============================================= */}

            <FormField
              label="Business Email"
              type="email"
              value={organization.email}
              onChange={(e) =>
                setOrganization({
                  ...organization,
                  email: e.target.value,
                })
              }
            />

            {/* =============================================
                PHONE
            ============================================= */}

            <FormField
              label="Phone"
              value={organization.phone}
              onChange={(e) =>
                setOrganization({
                  ...organization,
                  phone: e.target.value,
                })
              }
            />

            {/* =============================================
                ADDRESS
            ============================================= */}

            <FormField
              label="Address"
              value={organization.address}
              onChange={(e) =>
                setOrganization({
                  ...organization,
                  address: e.target.value,
                })
              }
            />

            {/* =============================================
                SAP LANGUAGE
            ============================================= */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

              <div className="mb-4">

                <h2 className="text-lg font-semibold text-slate-900">
                  SAP Language
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Choose the language that users in this organization
                  will use when operating SAP.
                </p>

              </div>

              <label
                htmlFor="organization-language"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Organization Language
              </label>

              <select
                id="organization-language"
                value={organization.language}
                onChange={(e) =>
                  setOrganization({
                    ...organization,
                    language:
                      e.target.value as Locale,
                  })
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="en">
                  English
                </option>

                <option value="fr">
                  Français
                </option>

                <option value="ar">
                  العربية
                </option>
              </select>

              <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">

                <p className="font-medium">
                  Organization-wide language
                </p>

                <p className="mt-1">
                  This setting will apply to users belonging
                  to this organization. SAP V1 remains English
                  by default until another language is selected.
                </p>

              </div>

            </div>

            {/* =============================================
                SAVE
            ============================================= */}

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-700 px-6 py-3 font-medium text-white transition hover:bg-blue-800 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </form>

        </div>

        {/* =================================================
            RIGHT COLUMN
        ================================================= */}

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

          <div className="mb-6 flex flex-col items-center border-b border-slate-200 pb-6 text-center">

            <Image
              src={
                organization.logo
                  ? organization.logo
                  : "/images/sap-logo.png"
              }
              alt="Organization Logo"
              width={96}
              height={96}
              className="rounded-2xl object-contain"
            />

            <h2 className="mt-4 text-xl font-bold">
              {organization.name ||
                "Organization"}
            </h2>

            <p className="text-sm text-slate-500">
              {organization.legalName}
            </p>

            <span className="mt-4 rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
              Active Organization
            </span>

          </div>

          <div className="space-y-4 text-sm">

            <div className="flex justify-between">
              <span>Organization ID</span>
              <span>ORG-000001</span>
            </div>

            <div className="flex justify-between">
              <span>Status</span>

              <span className="font-semibold text-green-600">
                Active
              </span>
            </div>

            <div className="flex justify-between">
              <span>Country</span>

              <span>
                {organization.country}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Industry</span>

              <span>
                {organization.industry}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Email</span>

              <span>
                {organization.email}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Phone</span>

              <span>
                {organization.phone}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Website</span>

              <span className="max-w-[170px] truncate">
                {organization.website}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Timezone</span>

              <span>
                {organization.timezone}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Currency</span>

              <span>
                {organization.currency}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Language</span>

              <span className="font-semibold">
                {organization.language === "fr"
                  ? "Français"
                  : organization.language === "ar"
                    ? "العربية"
                    : "English"}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Working Days</span>

              <span>
                {organization.workingDays || "-"}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Working Hours</span>

              <span>
                {organization.workingHours || "-"}
              </span>
            </div>

            <hr />

            <div className="flex justify-between">
              <span>Created</span>

              <span>
                {organization.createdAt
                  ? new Date(
                      organization.createdAt
                    ).toLocaleDateString()
                  : "-"}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Last Updated</span>

              <span>
                {organization.updatedAt
                  ? new Date(
                      organization.updatedAt
                    ).toLocaleDateString()
                  : "-"}
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}