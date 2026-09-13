"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
  industry: string;
  timezone: string;
  currency: string;
  workingDays: string;
  workingHours: string;
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
  industry: "",
  timezone: "Africa/Lagos",
  currency: "NGN",
  workingDays: "",
  workingHours: "",
};

export default function OrganizationForm() {
  const [form, setForm] =
    useState<Organization>(emptyOrganization);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadOrganization();
  }, []);

  async function loadOrganization() {
    try {
      const response = await fetch("/api/organization");

      const result = await response.json();

      if (result.organization) {
        setForm({
          ...emptyOrganization,
          ...result.organization,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load organization.");
    } finally {
      setLoading(false);
    }
  }

  async function saveOrganization() {
    try {
      setSaving(true);

      const response = await fetch("/api/organization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      toast.success("Organization saved successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save organization.");
    } finally {
      setSaving(false);
    }
  }

  function updateField(
    key: keyof Organization,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
        Loading organization...
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <h1 className="text-3xl font-bold text-slate-900">
        Organization Profile
      </h1>

      <p className="mt-2 text-slate-500">
        Manage your company information.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-6">

        <Input
          label="Company Name"
          value={form.name}
          onChange={(v) => updateField("name", v)}
        />

        <Input
          label="Legal Name"
          value={form.legalName}
          onChange={(v) => updateField("legalName", v)}
        />

        <Input
          label="Email"
          value={form.email}
          onChange={(v) => updateField("email", v)}
        />

        <Input
          label="Phone"
          value={form.phone}
          onChange={(v) => updateField("phone", v)}
        />

        <Input
          label="Website"
          value={form.website}
          onChange={(v) => updateField("website", v)}
        />

        <Input
          label="Industry"
          value={form.industry}
          onChange={(v) => updateField("industry", v)}
        />

        <Input
          label="Address"
          value={form.address}
          onChange={(v) => updateField("address", v)}
        />

        <Input
          label="City"
          value={form.city}
          onChange={(v) => updateField("city", v)}
        />

        <Input
          label="State"
          value={form.state}
          onChange={(v) => updateField("state", v)}
        />

        <Input
          label="Country"
          value={form.country}
          onChange={(v) => updateField("country", v)}
        />

        <Input
          label="Postal Code"
          value={form.postalCode}
          onChange={(v) => updateField("postalCode", v)}
        />

        <Input
          label="Timezone"
          value={form.timezone}
          onChange={(v) => updateField("timezone", v)}
        />

        <Input
          label="Currency"
          value={form.currency}
          onChange={(v) => updateField("currency", v)}
        />

        <Input
          label="Working Days"
          value={form.workingDays}
          onChange={(v) => updateField("workingDays", v)}
        />

        <Input
          label="Working Hours"
          value={form.workingHours}
          onChange={(v) => updateField("workingHours", v)}
        />

      </div>

      <button
        onClick={saveOrganization}
        disabled={saving}
        className="mt-8 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>

    </div>
  );
}

type InputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function Input({
  label,
  value,
  onChange,
}: InputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
      />
    </div>
  );
}