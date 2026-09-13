"use client";

import { FormEvent, useEffect, useState } from "react";

type Opportunity = {
  id: number;
  title: string;
  slug: string;
  type: string;
  organizationName: string;
  country: string;
  location: string | null;
  description: string;
  eligibility: string;
  benefits: string | null;
  deadline: string | null;
  applicationMode: string;
  applicationUrl: string | null;
  sourceName: string | null;
  sourceUrl: string | null;
  verificationStatus: string;
  status: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};

const opportunityTypes = [
  "Scholarship",
  "Job",
  "Internship",
  "Grant",
  "Fellowship",
  "Training",
  "Business",
  "Other",
];

const statuses = ["DRAFT", "PUBLISHED"];

const verificationStatuses = [
  "PUBLIC_LISTED",
  "VERIFIED",
  "PARTNER",
];

const emptyForm = {
  title: "",
  slug: "",
  type: "Scholarship",
  organizationName: "",
  country: "",
  location: "",
  description: "",
  eligibility: "",
  benefits: "",
  deadline: "",
  applicationMode: "EXTERNAL",
  applicationUrl: "",
  sourceName: "",
  sourceUrl: "",
  verificationStatus: "PUBLIC_LISTED",
  status: "DRAFT",
  featured: false,
};

export default function OpportunitiesAdminPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState(emptyForm);

  async function loadOpportunities() {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (statusFilter) {
        params.set("status", statusFilter);
      }

      if (typeFilter) {
        params.set("type", typeFilter);
      }

      const response = await fetch(
        `/api/opportunities/admin?${params.toString()}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load opportunities");
      }

      setOpportunities(data.opportunities || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load opportunities"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOpportunities();
  }, [search, statusFilter, typeFilter]);

  function updateField(
    field: keyof typeof emptyForm,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function handleTitleChange(value: string) {
    setForm((current) => ({
      ...current,
      title: value,
      ...(editingId
        ? {}
        : {
            slug: createSlug(value),
          }),
    }));
  }

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
    setShowForm(true);
  }

  function openEditForm(opportunity: Opportunity) {
    setEditingId(opportunity.id);

    setForm({
      title: opportunity.title,
      slug: opportunity.slug,
      type: opportunity.type,
      organizationName: opportunity.organizationName,
      country: opportunity.country,
      location: opportunity.location || "",
      description: opportunity.description,
      eligibility: opportunity.eligibility,
      benefits: opportunity.benefits || "",
      deadline: opportunity.deadline
        ? opportunity.deadline.slice(0, 10)
        : "",
      applicationMode:
        opportunity.applicationMode || "EXTERNAL",
      applicationUrl: opportunity.applicationUrl || "",
      sourceName: opportunity.sourceName || "",
      sourceUrl: opportunity.sourceUrl || "",
      verificationStatus: opportunity.verificationStatus,
      status: opportunity.status,
      featured: opportunity.featured,
    });

    setMessage("");
    setError("");
    setShowForm(true);
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        ...form,
        deadline: form.deadline
          ? new Date(form.deadline).toISOString()
          : null,
        location: form.location || null,
        benefits: form.benefits || null,
        applicationUrl:
          form.applicationMode === "SIMMY_LINK"
            ? null
            : form.applicationUrl.trim() || null,
        sourceName: form.sourceName || null,
        sourceUrl: form.sourceUrl || null,
      };

      const response = await fetch(
        editingId
          ? `/api/opportunities/admin/${editingId}`
          : "/api/opportunities/admin",
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save opportunity"
        );
      }

      setMessage(
        editingId
          ? "Opportunity updated successfully."
          : "Opportunity created successfully."
      );

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);

      await loadOpportunities();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save opportunity"
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteOpportunity(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this opportunity?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `/api/opportunities/admin/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete opportunity"
        );
      }

      setMessage("Opportunity deleted successfully.");

      await loadOpportunities();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete opportunity"
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
              SIMMY LINK AFRICA
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Opportunities Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Create, manage, publish and maintain opportunities
              available through the SIMMY LINK AFRICA ecosystem.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
          >
            + Add Opportunity
          </button>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {opportunities.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Published</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {
                opportunities.filter(
                  (item) => item.status === "PUBLISHED"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Drafts</p>
            <p className="mt-2 text-3xl font-bold text-amber-600">
              {
                opportunities.filter(
                  (item) => item.status === "DRAFT"
                ).length
              }
            </p>
          </div>
        </section>

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Search
              </label>

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search opportunities..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">All statuses</option>

                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Type
              </label>

              <select
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(event.target.value)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">All types</option>

                {opportunityTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-900">
              Opportunity Records
            </h2>
          </div>

          {loading ? (
            <div className="p-10 text-center text-sm text-slate-500">
              Loading opportunities...
            </div>
          ) : opportunities.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-medium text-slate-800">
                No opportunities found.
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Add your first opportunity to begin building the
                opportunity database.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Opportunity</th>
                    <th className="px-5 py-4">Type</th>
                    <th className="px-5 py-4">Country</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Verification</th>
                    <th className="px-5 py-4">Featured</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {opportunities.map((opportunity) => (
                    <tr
                      key={opportunity.id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-900">
                          {opportunity.title}
                        </div>

                        <div className="mt-1 text-xs text-slate-500">
                          {opportunity.organizationName}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {opportunity.type}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {opportunity.country}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            opportunity.status === "PUBLISHED"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {opportunity.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-xs font-medium text-slate-600">
                          {opportunity.verificationStatus}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {opportunity.featured ? (
                          <span className="font-semibold text-amber-600">
                            Yes
                          </span>
                        ) : (
                          <span className="text-slate-400">
                            No
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openEditForm(opportunity)
                            }
                            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteOpportunity(opportunity.id)
                            }
                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {showForm && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/50 p-4 md:p-8">
            <div className="mx-auto max-w-4xl rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {editingId
                      ? "Edit Opportunity"
                      : "Add Opportunity"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Provide accurate and verifiable opportunity
                    information.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg px-3 py-2 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  ×
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-6 p-6"
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Title *
                    </label>

                    <input
                      required
                      value={form.title}
                      onChange={(event) =>
                        handleTitleChange(event.target.value)
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      placeholder="e.g. Fully Funded Master's Scholarship"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Slug *
                    </label>

                    <input
                      required
                      value={form.slug}
                      onChange={(event) =>
                        updateField(
                          "slug",
                          createSlug(event.target.value)
                        )
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      placeholder="fully-funded-masters-scholarship"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Type *
                    </label>

                    <select
                      required
                      value={form.type}
                      onChange={(event) =>
                        updateField("type", event.target.value)
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    >
                      {opportunityTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Organization *
                    </label>

                    <input
                      required
                      value={form.organizationName}
                      onChange={(event) =>
                        updateField(
                          "organizationName",
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      placeholder="Organization or institution"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Country *
                    </label>

                    <input
                      required
                      value={form.country}
                      onChange={(event) =>
                        updateField(
                          "country",
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      placeholder="Canada"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Location
                    </label>

                    <input
                      value={form.location}
                      onChange={(event) =>
                        updateField(
                          "location",
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      placeholder="City / Remote / Online"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Deadline
                    </label>

                    <input
                      type="date"
                      value={form.deadline}
                      onChange={(event) =>
                        updateField(
                          "deadline",
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Status
                    </label>

                    <select
                      value={form.status}
                      onChange={(event) =>
                        updateField("status", event.target.value)
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Verification Status
                    </label>

                    <select
                      value={form.verificationStatus}
                      onChange={(event) =>
                        updateField(
                          "verificationStatus",
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    >
                      {verificationStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
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

                      <span className="text-sm font-medium text-slate-700">
                        Feature this opportunity
                      </span>
                    </label>
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Description *
                    </label>

                    <textarea
                      required
                      rows={5}
                      value={form.description}
                      onChange={(event) =>
                        updateField(
                          "description",
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      placeholder="Describe the opportunity clearly..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Eligibility *
                    </label>

                    <textarea
                      required
                      rows={4}
                      value={form.eligibility}
                      onChange={(event) =>
                        updateField(
                          "eligibility",
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      placeholder="Who is eligible?"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Benefits
                    </label>

                    <textarea
                      rows={4}
                      value={form.benefits}
                      onChange={(event) =>
                        updateField(
                          "benefits",
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      placeholder="Funding, salary, training, accommodation, etc."
                    />
                  </div>

                  <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="mb-4">
                      <h3 className="text-base font-bold text-slate-900">
                        Application Method
                      </h3>

                      <p className="mt-1 text-sm text-slate-600">
                        Choose how users should apply for this opportunity.
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <label
                        className={`cursor-pointer rounded-xl border p-4 transition ${
                          form.applicationMode === "SIMMY_LINK"
                            ? "border-blue-600 bg-blue-50"
                            : "border-slate-200 bg-white hover:border-blue-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="applicationMode"
                          value="SIMMY_LINK"
                          checked={form.applicationMode === "SIMMY_LINK"}
                          onChange={(event) =>
                            updateField(
                              "applicationMode",
                              event.target.value
                            )
                          }
                          className="sr-only"
                        />

                        <p className="font-semibold text-slate-900">
                          SIMMY LINK AFRICA
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          Users complete and submit their application directly
                          through SIMMY LINK AFRICA.
                        </p>
                      </label>

                      <label
                        className={`cursor-pointer rounded-xl border p-4 transition ${
                          form.applicationMode === "EXTERNAL"
                            ? "border-blue-600 bg-blue-50"
                            : "border-slate-200 bg-white hover:border-blue-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="applicationMode"
                          value="EXTERNAL"
                          checked={form.applicationMode === "EXTERNAL"}
                          onChange={(event) =>
                            updateField(
                              "applicationMode",
                              event.target.value
                            )
                          }
                          className="sr-only"
                        />

                        <p className="font-semibold text-slate-900">
                          External Website
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          Users are redirected to the official organization
                          website to apply.
                        </p>
                      </label>

                      <label
                        className={`cursor-pointer rounded-xl border p-4 transition ${
                          form.applicationMode === "BOTH"
                            ? "border-blue-600 bg-blue-50"
                            : "border-slate-200 bg-white hover:border-blue-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="applicationMode"
                          value="BOTH"
                          checked={form.applicationMode === "BOTH"}
                          onChange={(event) =>
                            updateField(
                              "applicationMode",
                              event.target.value
                            )
                          }
                          className="sr-only"
                        />

                        <p className="font-semibold text-slate-900">
                          Both Options
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          Users can apply through SIMMY LINK AFRICA or use the
                          official external application website.
                        </p>
                      </label>
                    </div>

                    {form.applicationMode === "SIMMY_LINK" && (
                      <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4">
                        <p className="font-semibold text-blue-900">
                          SIMMY LINK AFRICA Application
                        </p>

                        <p className="mt-1 text-sm leading-6 text-blue-800">
                          Users will apply using the SIMMY LINK AFRICA
                          application form. No external application URL is
                          required.
                        </p>
                      </div>
                    )}

                    {(form.applicationMode === "EXTERNAL" ||
                      form.applicationMode === "BOTH") && (
                      <div className="mt-5">
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Official External Application URL *
                        </label>

                        <input
                          type="url"
                          required
                          value={form.applicationUrl}
                          onChange={(event) =>
                            updateField(
                              "applicationUrl",
                              event.target.value
                            )
                          }
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                          placeholder="https://official-organization.com/apply"
                        />

                        <p className="mt-2 text-xs leading-5 text-slate-500">
                          Use the official application page of the employer,
                          university, scholarship provider or organization.
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Source Name
                    </label>

                    <input
                      value={form.sourceName}
                      onChange={(event) =>
                        updateField(
                          "sourceName",
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      placeholder="Official organization website"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Source URL
                    </label>

                    <input
                      type="url"
                      value={form.sourceUrl}
                      onChange={(event) =>
                        updateField(
                          "sourceUrl",
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      placeholder="https://official-source..."
                    />
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeForm}
                    disabled={saving}
                    className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : editingId
                        ? "Update Opportunity"
                        : "Create Opportunity"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}