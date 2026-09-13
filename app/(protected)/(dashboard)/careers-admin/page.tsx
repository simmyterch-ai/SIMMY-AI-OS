"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Career = {
  id: number;
  title: string;
  slug: string;
  companyName: string;
  country: string;
  location: string | null;
  employmentType: string;
  workMode: string | null;
  industry: string | null;
  description: string;
  requirements: string;
  responsibilities: string | null;
  benefits: string | null;
  salary: string | null;
  applicationUrl: string | null;
  deadline: string | null;
  sourceName: string | null;
  sourceUrl: string | null;
  verificationStatus: string;
  status: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};

type CareerForm = {
  title: string;
  slug: string;
  companyName: string;
  country: string;
  location: string;
  employmentType: string;
  workMode: string;
  industry: string;
  description: string;
  requirements: string;
  responsibilities: string;
  benefits: string;
  salary: string;
  applicationUrl: string;
  deadline: string;
  sourceName: string;
  sourceUrl: string;
  verificationStatus: string;
  status: string;
  featured: boolean;
};

const emptyForm: CareerForm = {
  title: "",
  slug: "",
  companyName: "",
  country: "",
  location: "",
  employmentType: "FULL_TIME",
  workMode: "ON_SITE",
  industry: "",
  description: "",
  requirements: "",
  responsibilities: "",
  benefits: "",
  salary: "",
  applicationUrl: "",
  deadline: "",
  sourceName: "",
  sourceUrl: "",
  verificationStatus: "PUBLIC_LISTED",
  status: "DRAFT",
  featured: false,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function formatDate(value: string | null) {
  if (!value) return "No deadline";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function CareersAdminPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [countryFilter, setCountryFilter] = useState("ALL");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState<CareerForm>(emptyForm);

  async function loadCareers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/careers/admin", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load careers");
      }

      setCareers(
        Array.isArray(data)
          ? data
          : Array.isArray(data.careers)
            ? data.careers
            : []
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load careers"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCareers();
  }, []);

  const countries = useMemo(() => {
    return Array.from(
      new Set(
        careers
          .map((career) => career.country)
          .filter(Boolean)
      )
    ).sort();
  }, [careers]);

  const filteredCareers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return careers.filter((career) => {
      const matchesSearch =
        !query ||
        career.title.toLowerCase().includes(query) ||
        career.companyName.toLowerCase().includes(query) ||
        career.country.toLowerCase().includes(query) ||
        (career.industry ?? "").toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        career.status === statusFilter;

      const matchesCountry =
        countryFilter === "ALL" ||
        career.country === countryFilter;

      return matchesSearch && matchesStatus && matchesCountry;
    });
  }, [careers, search, statusFilter, countryFilter]);

  const stats = useMemo(() => {
    return {
      total: careers.length,
      published: careers.filter(
        (career) => career.status === "PUBLISHED"
      ).length,
      drafts: careers.filter(
        (career) => career.status === "DRAFT"
      ).length,
      featured: careers.filter(
        (career) => career.featured
      ).length,
    };
  }, [careers]);

  function updateField<K extends keyof CareerForm>(
    field: K,
    value: CareerForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startEdit(career: Career) {
    setEditingId(career.id);

    setForm({
      title: career.title,
      slug: career.slug,
      companyName: career.companyName,
      country: career.country,
      location: career.location ?? "",
      employmentType: career.employmentType,
      workMode: career.workMode ?? "",
      industry: career.industry ?? "",
      description: career.description,
      requirements: career.requirements,
      responsibilities: career.responsibilities ?? "",
      benefits: career.benefits ?? "",
      salary: career.salary ?? "",
      applicationUrl: career.applicationUrl ?? "",
      deadline: career.deadline
        ? new Date(career.deadline).toISOString().slice(0, 10)
        : "",
      sourceName: career.sourceName ?? "",
      sourceUrl: career.sourceUrl ?? "",
      verificationStatus: career.verificationStatus,
      status: career.status,
      featured: career.featured,
    });

    setError("");
    setSuccess("");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(false);
    setError("");
    setSuccess("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        ...form,
        deadline: form.deadline
          ? new Date(`${form.deadline}T23:59:59`).toISOString()
          : null,
      };

      const endpoint = editingId
        ? `/api/careers/admin/${editingId}`
        : "/api/careers/admin";

      const response = await fetch(endpoint, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            (editingId
              ? "Failed to update career"
              : "Failed to create career")
        );
      }

      setSuccess(
        editingId
          ? "Career updated successfully."
          : "Career created successfully."
      );

      setEditingId(null);
      setForm(emptyForm);
      setShowForm(false);

      await loadCareers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteCareer(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this career listing?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/careers/admin/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete career"
        );
      }

      setSuccess("Career deleted successfully.");
      await loadCareers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete career"
      );
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-900 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-600">
              SIMMY LINK AFRICA
            </p>

            <h1 className="mt-2 text-3xl font-black text-blue-950">
              Careers Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Create, manage, verify and publish career opportunities
              across the SIMMY LINK AFRICA ecosystem.
            </p>
          </div>

          <button
            type="button"
            onClick={startCreate}
            className="rounded-xl bg-blue-950 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-900"
          >
            + Add Career
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
            {success}
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Careers"
            value={stats.total}
          />

          <StatCard
            label="Published"
            value={stats.published}
          />

          <StatCard
            label="Drafts"
            value={stats.drafts}
          />

          <StatCard
            label="Featured"
            value={stats.featured}
          />
        </div>

        {/* Form */}
        {showForm && (
          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-600">
                  {editingId ? "Edit Career" : "New Career"}
                </p>

                <h2 className="mt-2 text-2xl font-black text-blue-950">
                  {editingId
                    ? "Update Career Listing"
                    : "Create Career Listing"}
                </h2>
              </div>

              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-8"
            >
              {/* Basic information */}
              <div>
                <h3 className="text-lg font-black text-blue-950">
                  Basic Information
                </h3>

                <div className="mt-4 grid gap-5 md:grid-cols-2">
                  <Field
                    label="Job Title"
                    required
                    value={form.title}
                    onChange={(value) => {
                      updateField("title", value);

                      if (!editingId) {
                        updateField("slug", slugify(value));
                      }
                    }}
                    placeholder="e.g. Procurement Officer"
                  />

                  <Field
                    label="Slug"
                    required
                    value={form.slug}
                    onChange={(value) =>
                      updateField("slug", slugify(value))
                    }
                    placeholder="procurement-officer"
                  />

                  <Field
                    label="Company Name"
                    required
                    value={form.companyName}
                    onChange={(value) =>
                      updateField("companyName", value)
                    }
                    placeholder="Company or organization"
                  />

                  <Field
                    label="Country"
                    required
                    value={form.country}
                    onChange={(value) =>
                      updateField("country", value)
                    }
                    placeholder="Nigeria"
                  />

                  <Field
                    label="Location"
                    value={form.location}
                    onChange={(value) =>
                      updateField("location", value)
                    }
                    placeholder="Lagos, Nigeria"
                  />

                  <Field
                    label="Industry"
                    value={form.industry}
                    onChange={(value) =>
                      updateField("industry", value)
                    }
                    placeholder="Technology, Finance, Agriculture..."
                  />
                </div>
              </div>

              {/* Employment */}
              <div className="border-t border-slate-100 pt-8">
                <h3 className="text-lg font-black text-blue-950">
                  Employment Details
                </h3>

                <div className="mt-4 grid gap-5 md:grid-cols-3">
                  <SelectField
                    label="Employment Type"
                    required
                    value={form.employmentType}
                    onChange={(value) =>
                      updateField("employmentType", value)
                    }
                    options={[
                      ["FULL_TIME", "Full Time"],
                      ["PART_TIME", "Part Time"],
                      ["CONTRACT", "Contract"],
                      ["TEMPORARY", "Temporary"],
                      ["INTERNSHIP", "Internship"],
                      ["VOLUNTEER", "Volunteer"],
                    ]}
                  />

                  <SelectField
                    label="Work Mode"
                    value={form.workMode}
                    onChange={(value) =>
                      updateField("workMode", value)
                    }
                    options={[
                      ["ON_SITE", "On-site"],
                      ["REMOTE", "Remote"],
                      ["HYBRID", "Hybrid"],
                    ]}
                  />

                  <Field
                    label="Salary"
                    value={form.salary}
                    onChange={(value) =>
                      updateField("salary", value)
                    }
                    placeholder="e.g. USD 2,000/month"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-slate-100 pt-8">
                <h3 className="text-lg font-black text-blue-950">
                  Opportunity Information
                </h3>

                <div className="mt-4 space-y-5">
                  <TextAreaField
                    label="Description"
                    required
                    value={form.description}
                    onChange={(value) =>
                      updateField("description", value)
                    }
                    placeholder="Describe the career opportunity..."
                  />

                  <TextAreaField
                    label="Requirements"
                    required
                    value={form.requirements}
                    onChange={(value) =>
                      updateField("requirements", value)
                    }
                    placeholder="List qualifications, experience and other requirements..."
                  />

                  <TextAreaField
                    label="Responsibilities"
                    value={form.responsibilities}
                    onChange={(value) =>
                      updateField("responsibilities", value)
                    }
                    placeholder="Describe the main responsibilities..."
                  />

                  <TextAreaField
                    label="Benefits"
                    value={form.benefits}
                    onChange={(value) =>
                      updateField("benefits", value)
                    }
                    placeholder="Salary benefits, insurance, allowances, development opportunities..."
                  />
                </div>
              </div>

              {/* Application */}
              <div className="border-t border-slate-100 pt-8">
                <h3 className="text-lg font-black text-blue-950">
                  Application & Source
                </h3>

                <div className="mt-4 grid gap-5 md:grid-cols-2">
                  <Field
                    label="Application URL"
                    value={form.applicationUrl}
                    onChange={(value) =>
                      updateField("applicationUrl", value)
                    }
                    placeholder="https://..."
                    type="url"
                  />

                  <Field
                    label="Deadline"
                    value={form.deadline}
                    onChange={(value) =>
                      updateField("deadline", value)
                    }
                    type="date"
                  />

                  <Field
                    label="Source Name"
                    value={form.sourceName}
                    onChange={(value) =>
                      updateField("sourceName", value)
                    }
                    placeholder="Official company website"
                  />

                  <Field
                    label="Source URL"
                    value={form.sourceUrl}
                    onChange={(value) =>
                      updateField("sourceUrl", value)
                    }
                    placeholder="https://..."
                    type="url"
                  />
                </div>
              </div>

              {/* Publishing */}
              <div className="border-t border-slate-100 pt-8">
                <h3 className="text-lg font-black text-blue-950">
                  Publishing & Verification
                </h3>

                <div className="mt-4 grid gap-5 md:grid-cols-3">
                  <SelectField
                    label="Verification Status"
                    value={form.verificationStatus}
                    onChange={(value) =>
                      updateField(
                        "verificationStatus",
                        value
                      )
                    }
                    options={[
                      [
                        "PUBLIC_LISTED",
                        "Public Listed",
                      ],
                      [
                        "SOURCE_VERIFIED",
                        "Source Verified",
                      ],
                      [
                        "PARTNER_VERIFIED",
                        "Partner Verified",
                      ],
                      [
                        "PENDING_VERIFICATION",
                        "Pending Verification",
                      ],
                    ]}
                  />

                  <SelectField
                    label="Publication Status"
                    value={form.status}
                    onChange={(value) =>
                      updateField("status", value)
                    }
                    options={[
                      ["DRAFT", "Draft"],
                      ["PUBLISHED", "Published"],
                    ]}
                  />

                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(event) =>
                        updateField(
                          "featured",
                          event.target.checked
                        )
                      }
                      className="h-4 w-4"
                    />

                    <span>
                      <span className="block text-sm font-bold text-blue-950">
                        Featured Career
                      </span>

                      <span className="block text-xs text-slate-500">
                        Highlight this opportunity publicly
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-6">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-950 px-6 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Career"
                      : "Create Career"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Filters */}
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr]">
            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by title, company, country or industry..."
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-900"
            />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="ALL">All statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>

            <select
              value={countryFilter}
              onChange={(event) =>
                setCountryFilter(event.target.value)
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="ALL">All countries</option>

              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Career list */}
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-black text-blue-950">
                  Career Listings
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Showing {filteredCareers.length} of{" "}
                  {careers.length} careers
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="px-6 py-16 text-center text-sm font-semibold text-slate-500">
              Loading careers...
            </div>
          ) : filteredCareers.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                💼
              </div>

              <h3 className="mt-4 text-lg font-black text-blue-950">
                No career listings found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Create your first career opportunity to make it
                available through the Careers module.
              </p>

              <button
                type="button"
                onClick={startCreate}
                className="mt-5 rounded-full bg-blue-950 px-5 py-3 text-sm font-black text-white"
              >
                + Add Career
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredCareers.map((career) => (
                <div
                  key={career.id}
                  className="px-6 py-6 transition hover:bg-slate-50"
                >
                  <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {career.featured && (
                          <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-yellow-800">
                            Featured
                          </span>
                        )}

                        <StatusBadge
                          status={career.status}
                        />

                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                          {formatLabel(
                            career.verificationStatus
                          )}
                        </span>
                      </div>

                      <h3 className="mt-3 text-lg font-black text-blue-950">
                        {career.title}
                      </h3>

                      <p className="mt-1 text-sm font-bold text-slate-600">
                        {career.companyName}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                        <span>🌍 {career.country}</span>

                        {career.location && (
                          <span>📍 {career.location}</span>
                        )}

                        <span>
                          💼{" "}
                          {formatLabel(
                            career.employmentType
                          )}
                        </span>

                        {career.workMode && (
                          <span>
                            🏢{" "}
                            {formatLabel(
                              career.workMode
                            )}
                          </span>
                        )}

                        {career.industry && (
                          <span>
                            • {career.industry}
                          </span>
                        )}
                      </div>

                      <p className="mt-3 text-sm text-slate-500">
                        Deadline:{" "}
                        <span className="font-semibold text-slate-700">
                          {formatDate(career.deadline)}
                        </span>
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(career)}
                        className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-black text-blue-950 hover:bg-slate-100"
                      >
                        Edit
                      </button>

                      {career.status === "PUBLISHED" && (
                        <a
                          href={`/careers/${career.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs font-black text-blue-800 hover:bg-blue-100"
                        >
                          View
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          deleteCareer(career.id)
                        }
                        className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-black text-red-700 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
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
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-blue-950">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const published = status === "PUBLISHED";

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
        published
          ? "bg-green-100 text-green-800"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      {formatLabel(status)}
    </span>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </span>

      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </span>

      <textarea
        required={required}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        rows={6}
        className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </span>

      <select
        required={required}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}