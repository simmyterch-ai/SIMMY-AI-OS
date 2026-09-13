"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Business = {
  id: number;
  name: string;
  slug: string;
  category: string;
  country: string;
  city: string | null;
  description: string;
  services: string | null;
  websiteUrl: string | null;
  email: string | null;
  phone: string | null;
  logoUrl: string | null;
  verificationStatus: string;
  status: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};

type BusinessForm = {
  name: string;
  slug: string;
  category: string;
  country: string;
  city: string;
  description: string;
  services: string;
  websiteUrl: string;
  email: string;
  phone: string;
  logoUrl: string;
  verificationStatus: string;
  status: string;
  featured: boolean;
};

const emptyForm: BusinessForm = {
  name: "",
  slug: "",
  category: "",
  country: "",
  city: "",
  description: "",
  services: "",
  websiteUrl: "",
  email: "",
  phone: "",
  logoUrl: "",
  verificationStatus: "PUBLIC_LISTED",
  status: "DRAFT",
  featured: false,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function BusinessesAdminPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [form, setForm] = useState<BusinessForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");

  async function loadBusinesses() {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (statusFilter) {
        params.set("status", statusFilter);
      }

      if (countryFilter) {
        params.set("country", countryFilter);
      }

      if (search) {
        params.set("search", search);
      }

      const response = await fetch(
        `/api/businesses/admin?${params.toString()}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load businesses");
      }

      setBusinesses(data.businesses || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load businesses"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBusinesses();
  }, [statusFilter, countryFilter, search]);

  function updateField<K extends keyof BusinessForm>(
    field: K,
    value: BusinessForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startEdit(business: Business) {
    setEditingId(business.id);

    setForm({
      name: business.name,
      slug: business.slug,
      category: business.category,
      country: business.country,
      city: business.city || "",
      description: business.description,
      services: business.services || "",
      websiteUrl: business.websiteUrl || "",
      email: business.email || "",
      phone: business.phone || "",
      logoUrl: business.logoUrl || "",
      verificationStatus:
        business.verificationStatus || "PUBLIC_LISTED",
      status: business.status || "DRAFT",
      featured: business.featured,
    });

    setMessage("");
    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveBusiness(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const endpoint = editingId
        ? `/api/businesses/admin/${editingId}`
        : "/api/businesses/admin";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save business");
      }

      setMessage(
        editingId
          ? "Business updated successfully"
          : "Business created successfully"
      );

      setEditingId(null);
      setForm(emptyForm);

      await loadBusinesses();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save business"
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteBusiness(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this business?"
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/businesses/admin/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete business");
      }

      setMessage("Business deleted successfully");

      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }

      await loadBusinesses();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete business"
      );
    }
  }

  const countries = useMemo(() => {
    return Array.from(
      new Set(businesses.map((business) => business.country).filter(Boolean))
    ).sort();
  }, [businesses]);

  const total = businesses.length;
  const published = businesses.filter(
    (business) => business.status === "PUBLISHED"
  ).length;
  const drafts = businesses.filter(
    (business) => business.status === "DRAFT"
  ).length;
  const featured = businesses.filter(
    (business) => business.featured
  ).length;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-wider text-yellow-600">
              SIMMY LINK AFRICA
            </div>

            <h1 className="mt-1 text-3xl font-bold text-blue-950">
              Business Management
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Create, publish and manage businesses in the public ecosystem.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/business"
              target="_blank"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-blue-950 transition hover:bg-slate-100"
            >
              View Public Directory
            </Link>

            <button
              type="button"
              onClick={startCreate}
              className="rounded-xl bg-blue-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900"
            >
              + New Business
            </button>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Businesses" value={total} />
          <StatCard label="Published" value={published} />
          <StatCard label="Drafts" value={drafts} />
          <StatCard label="Featured" value={featured} />
        </div>

        {/* Form */}
        <section className="mb-10 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-xl font-bold text-blue-950">
              {editingId ? "Edit Business" : "Create Business"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editingId
                ? "Update the selected business listing."
                : "Add a business to the SIMMY LINK AFRICA ecosystem."}
            </p>
          </div>

          <form onSubmit={saveBusiness} className="space-y-8 p-6">
            {/* Basic information */}
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-blue-950">
                Basic Information
              </h3>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Business Name" required>
                  <input
                    value={form.name}
                    onChange={(event) => {
                      const value = event.target.value;

                      updateField("name", value);

                      if (!editingId) {
                        updateField("slug", slugify(value));
                      }
                    }}
                    required
                    className="input"
                    placeholder="Example: SIMMY LINK AFRICA"
                  />
                </Field>

                <Field label="Slug" required>
                  <input
                    value={form.slug}
                    onChange={(event) =>
                      updateField("slug", event.target.value)
                    }
                    required
                    className="input"
                    placeholder="simmy-link-africa"
                  />
                </Field>

                <Field label="Category" required>
                  <input
                    value={form.category}
                    onChange={(event) =>
                      updateField("category", event.target.value)
                    }
                    required
                    className="input"
                    placeholder="Technology"
                  />
                </Field>

                <Field label="Country" required>
                  <input
                    value={form.country}
                    onChange={(event) =>
                      updateField("country", event.target.value)
                    }
                    required
                    className="input"
                    placeholder="Nigeria"
                  />
                </Field>

                <Field label="City">
                  <input
                    value={form.city}
                    onChange={(event) =>
                      updateField("city", event.target.value)
                    }
                    className="input"
                    placeholder="Lagos"
                  />
                </Field>

                <Field label="Logo URL">
                  <input
                    value={form.logoUrl}
                    onChange={(event) =>
                      updateField("logoUrl", event.target.value)
                    }
                    className="input"
                    placeholder="https://example.com/logo.png"
                  />
                </Field>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-blue-950">
                Business Profile
              </h3>

              <div className="space-y-5">
                <Field label="Description" required>
                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                    required
                    rows={6}
                    className="input resize-y"
                    placeholder="Describe the business..."
                  />
                </Field>

                <Field label="Products & Services">
                  <textarea
                    value={form.services}
                    onChange={(event) =>
                      updateField("services", event.target.value)
                    }
                    rows={5}
                    className="input resize-y"
                    placeholder="List the products and services offered..."
                  />
                </Field>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-blue-950">
                Contact & Online Presence
              </h3>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Website URL">
                  <input
                    type="url"
                    value={form.websiteUrl}
                    onChange={(event) =>
                      updateField("websiteUrl", event.target.value)
                    }
                    className="input"
                    placeholder="https://example.com"
                  />
                </Field>

                <Field label="Email">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    className="input"
                    placeholder="business@example.com"
                  />
                </Field>

                <Field label="Phone">
                  <input
                    value={form.phone}
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                    className="input"
                    placeholder="+234..."
                  />
                </Field>
              </div>
            </div>

            {/* Publication */}
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-blue-950">
                Publication & Verification
              </h3>

              <div className="grid gap-5 md:grid-cols-3">
                <Field label="Verification Status">
                  <select
                    value={form.verificationStatus}
                    onChange={(event) =>
                      updateField(
                        "verificationStatus",
                        event.target.value
                      )
                    }
                    className="input"
                  >
                    <option value="PUBLIC_LISTED">Public Listed</option>
                    <option value="VERIFIED">Verified</option>
                    <option value="PENDING_VERIFICATION">
                      Pending Verification
                    </option>
                  </select>
                </Field>

                <Field label="Publication Status">
                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateField("status", event.target.value)
                    }
                    className="input"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </Field>

                <div className="flex items-end">
                  <label className="flex h-11 w-full cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(event) =>
                        updateField("featured", event.target.checked)
                      }
                      className="h-4 w-4"
                    />

                    <span className="text-sm font-medium text-slate-700">
                      Featured Business
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-blue-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Business"
                    : "Create Business"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={startCreate}
                  className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Filters */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Search
              </label>

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="input"
                placeholder="Search businesses..."
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="input"
              >
                <option value="">All Statuses</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Country
              </label>

              <select
                value={countryFilter}
                onChange={(event) => setCountryFilter(event.target.value)}
                className="input"
              >
                <option value="">All Countries</option>

                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Business list */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-xl font-bold text-blue-950">
              Business Listings
            </h2>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center text-sm text-slate-500">
              Loading businesses...
            </div>
          ) : businesses.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-slate-500">
              No businesses found.
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {businesses.map((business) => (
                <div
                  key={business.id}
                  className="flex flex-col gap-5 px-6 py-6 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-blue-950">
                        {business.name}
                      </h3>

                      {business.featured && (
                        <span className="rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-semibold text-yellow-700">
                          Featured
                        </span>
                      )}

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          business.status === "PUBLISHED"
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {business.status}
                      </span>
                    </div>

                    <p className="mt-1 text-sm font-medium text-yellow-600">
                      {business.category}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      {business.city
                        ? `${business.city}, ${business.country}`
                        : business.country}
                    </p>

                    <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-600">
                      {business.description}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Link
                      href={`/business/${business.slug}`}
                      target="_blank"
                      className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-blue-950 transition hover:bg-slate-50"
                    >
                      View
                    </Link>

                    <button
                      type="button"
                      onClick={() => startEdit(business)}
                      className="rounded-lg bg-blue-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-900"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteBusiness(business.id)}
                      className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgb(226 232 240);
          background: white;
          padding: 0.7rem 0.85rem;
          font-size: 0.875rem;
          color: rgb(15 23 42);
          outline: none;
          transition: border-color 150ms ease, box-shadow 150ms ease;
        }

        .input:focus {
          border-color: rgb(30 58 138);
          box-shadow: 0 0 0 3px rgb(30 58 138 / 0.1);
        }

        textarea.input {
          line-height: 1.6;
        }

        select.input {
          cursor: pointer;
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {children}
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-medium text-slate-500">{label}</div>

      <div className="mt-2 text-3xl font-bold text-blue-950">{value}</div>
    </div>
  );
}