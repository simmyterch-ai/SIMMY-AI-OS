"use client";

import { FormEvent, useEffect, useState } from "react";

type Provider = {
  id: number;
  name: string;
  slug: string;
  type: string;
  country: string;
  city: string | null;
  description: string;
  websiteUrl: string | null;
  verificationStatus: string;
  status: string;
  featured: boolean;
  _count?: {
    programs: number;
    trainingCourses: number;
  };
};

type Program = {
  id: number;
  providerId: number;
  name: string;
  slug: string;
  level: string;
  fieldOfStudy: string;
  description: string;
  eligibility: string;
  duration: string | null;
  studyMode: string | null;
  tuition: string | null;
  currency: string | null;
  applicationUrl: string | null;
  deadline: string | null;
  intake: string | null;
  verificationStatus: string;
  status: string;
  featured: boolean;
  provider: {
    id: number;
    name: string;
    country: string;
    city: string | null;
  };
};

type Course = {
  id: number;
  providerId: number;
  name: string;
  slug: string;
  category: string;
  description: string;
  eligibility: string;
  duration: string | null;
  deliveryMode: string | null;
  cost: string | null;
  currency: string | null;
  applicationUrl: string | null;
  deadline: string | null;
  verificationStatus: string;
  status: string;
  featured: boolean;
  provider: {
    id: number;
    name: string;
    country: string;
    city: string | null;
  };
};

type Tab = "providers" | "programs" | "courses";

type SelectOption = [string, string];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const labelClass =
  "mb-1.5 block text-sm font-medium text-slate-700";

const emptyProvider = {
  name: "",
  slug: "",
  type: "UNIVERSITY",
  country: "",
  city: "",
  description: "",
  websiteUrl: "",
  verificationStatus: "PUBLIC_LISTED",
  status: "DRAFT",
  featured: false,
};

const emptyProgram = {
  providerId: "",
  name: "",
  slug: "",
  level: "BACHELOR",
  fieldOfStudy: "",
  description: "",
  eligibility: "",
  duration: "",
  studyMode: "",
  tuition: "",
  currency: "",
  applicationUrl: "",
  deadline: "",
  intake: "",
  verificationStatus: "PUBLIC_LISTED",
  status: "DRAFT",
  featured: false,
};

const emptyCourse = {
  providerId: "",
  name: "",
  slug: "",
  category: "",
  description: "",
  eligibility: "",
  duration: "",
  deliveryMode: "",
  cost: "",
  currency: "",
  applicationUrl: "",
  deadline: "",
  verificationStatus: "PUBLIC_LISTED",
  status: "DRAFT",
  featured: false,
};

export default function EducationAdminPage() {
  const [activeTab, setActiveTab] =
    useState<Tab>("providers");

  const [providers, setProviders] = useState<Provider[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [providerSearch, setProviderSearch] = useState("");
  const [programSearch, setProgramSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");

  const [providerForm, setProviderForm] =
    useState(emptyProvider);
  const [programForm, setProgramForm] =
    useState(emptyProgram);
  const [courseForm, setCourseForm] =
    useState(emptyCourse);

  const [editingProviderId, setEditingProviderId] =
    useState<number | null>(null);
  const [editingProgramId, setEditingProgramId] =
    useState<number | null>(null);
  const [editingCourseId, setEditingCourseId] =
    useState<number | null>(null);

  async function loadProviders() {
  const response = await fetch(
    "/api/education/admin/providers",
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load education providers"
    );
  }

  const data = await response.json();

  setProviders(
    Array.isArray(data)
      ? data
      : Array.isArray(data.providers)
        ? data.providers
        : []
  );
}

  async function loadPrograms() {
    const response = await fetch(
      "/api/education/admin/programs",
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to load education programs"
      );
    }

    const data = await response.json();
    setPrograms(Array.isArray(data) ? data : []);
  }

  async function loadCourses() {
    const response = await fetch(
      "/api/education/admin/courses",
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to load training courses"
      );
    }

    const data = await response.json();
    setCourses(Array.isArray(data) ? data : []);
  }

  async function loadAll() {
    try {
      setLoading(true);
      setError("");

      await Promise.all([
        loadProviders(),
        loadPrograms(),
        loadCourses(),
      ]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load education data"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  function resetProviderForm() {
    setProviderForm({ ...emptyProvider });
    setEditingProviderId(null);
  }

  function resetProgramForm() {
    setProgramForm({ ...emptyProgram });
    setEditingProgramId(null);
  }

  function resetCourseForm() {
    setCourseForm({ ...emptyCourse });
    setEditingCourseId(null);
  }

  function editProvider(provider: Provider) {
    setProviderForm({
      name: provider.name,
      slug: provider.slug,
      type: provider.type,
      country: provider.country,
      city: provider.city || "",
      description: provider.description,
      websiteUrl: provider.websiteUrl || "",
      verificationStatus:
        provider.verificationStatus,
      status: provider.status,
      featured: provider.featured,
    });

    setEditingProviderId(provider.id);
    setActiveTab("providers");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function editProgram(program: Program) {
    setProgramForm({
      providerId: String(program.providerId),
      name: program.name,
      slug: program.slug,
      level: program.level,
      fieldOfStudy: program.fieldOfStudy,
      description: program.description,
      eligibility: program.eligibility,
      duration: program.duration || "",
      studyMode: program.studyMode || "",
      tuition: program.tuition || "",
      currency: program.currency || "",
      applicationUrl: program.applicationUrl || "",
      deadline: program.deadline
        ? program.deadline.slice(0, 10)
        : "",
      intake: program.intake || "",
      verificationStatus:
        program.verificationStatus,
      status: program.status,
      featured: program.featured,
    });

    setEditingProgramId(program.id);
    setActiveTab("programs");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function editCourse(course: Course) {
    setCourseForm({
      providerId: String(course.providerId),
      name: course.name,
      slug: course.slug,
      category: course.category,
      description: course.description,
      eligibility: course.eligibility,
      duration: course.duration || "",
      deliveryMode: course.deliveryMode || "",
      cost: course.cost || "",
      currency: course.currency || "",
      applicationUrl: course.applicationUrl || "",
      deadline: course.deadline
        ? course.deadline.slice(0, 10)
        : "",
      verificationStatus:
        course.verificationStatus,
      status: course.status,
      featured: course.featured,
    });

    setEditingCourseId(course.id);
    setActiveTab("courses");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteProvider(id: number) {
    const confirmed = window.confirm(
      "Delete this education provider? Its programs and training courses will also be deleted."
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `/api/education/admin/providers/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete provider"
        );
      }

      setMessage(
        "Education provider deleted successfully."
      );

      await loadAll();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete provider"
      );
    }
  }

  async function deleteProgram(id: number) {
    const confirmed = window.confirm(
      "Delete this education program?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `/api/education/admin/programs/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete program"
        );
      }

      setMessage(
        "Education program deleted successfully."
      );

      await loadAll();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete program"
      );
    }
  }

  async function deleteCourse(id: number) {
    const confirmed = window.confirm(
      "Delete this training course?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `/api/education/admin/courses/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete course"
        );
      }

      setMessage(
        "Training course deleted successfully."
      );

      await loadAll();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete course"
      );
    }
  }

  async function handleProviderSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const url = editingProviderId
        ? `/api/education/admin/providers/${editingProviderId}`
        : "/api/education/admin/providers";

      const response = await fetch(url, {
        method: editingProviderId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(providerForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save provider"
        );
      }

      setMessage(
        editingProviderId
          ? "Education provider updated successfully."
          : "Education provider created successfully."
      );

      resetProviderForm();
      await loadProviders();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save provider"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleProgramSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const url = editingProgramId
        ? `/api/education/admin/programs/${editingProgramId}`
        : "/api/education/admin/programs";

      const response = await fetch(url, {
        method: editingProgramId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(programForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save program"
        );
      }

      setMessage(
        editingProgramId
          ? "Education program updated successfully."
          : "Education program created successfully."
      );

      resetProgramForm();
      await loadPrograms();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save program"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleCourseSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const url = editingCourseId
        ? `/api/education/admin/courses/${editingCourseId}`
        : "/api/education/admin/courses";

      const response = await fetch(url, {
        method: editingCourseId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save course"
        );
      }

      setMessage(
        editingCourseId
          ? "Training course updated successfully."
          : "Training course created successfully."
      );

      resetCourseForm();
      await loadCourses();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save course"
      );
    } finally {
      setSaving(false);
    }
  }

  const filteredProviders = providers.filter(
    (provider) => {
      const query =
        providerSearch.toLowerCase().trim();

      if (!query) return true;

      return [
        provider.name,
        provider.type,
        provider.country,
        provider.city || "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    }
  );

  const filteredPrograms = programs.filter(
    (program) => {
      const query =
        programSearch.toLowerCase().trim();

      if (!query) return true;

      return [
        program.name,
        program.level,
        program.fieldOfStudy,
        program.provider.name,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    }
  );

  const filteredCourses = courses.filter(
    (course) => {
      const query =
        courseSearch.toLowerCase().trim();

      if (!query) return true;

      return [
        course.name,
        course.category,
        course.deliveryMode || "",
        course.provider.name,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    }
  );

  const providerOptions: SelectOption[] = [
    ["", "Select provider"],
    ...providers.map(
      (provider): SelectOption => [
        String(provider.id),
        provider.name,
      ]
    ),
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Education & Training
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                Education Administration
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Manage education providers, academic
                programs, and training opportunities
                published across SIMMY LINK AFRICA.
              </p>
            </div>

            <button
              type="button"
              onClick={loadAll}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            label="Education Providers"
            value={providers.length}
          />

          <StatCard
            label="Academic Programs"
            value={programs.length}
          />

          <StatCard
            label="Training Courses"
            value={courses.length}
          />
        </div>

        {message && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <TabButton
            active={activeTab === "providers"}
            onClick={() => setActiveTab("providers")}
          >
            Providers
          </TabButton>

          <TabButton
            active={activeTab === "programs"}
            onClick={() => setActiveTab("programs")}
          >
            Programs
          </TabButton>

          <TabButton
            active={activeTab === "courses"}
            onClick={() => setActiveTab("courses")}
          >
            Training Courses
          </TabButton>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
            Loading education data...
          </div>
        ) : (
          <>
            {activeTab === "providers" && (
              <ProvidersSection
                providers={filteredProviders}
                search={providerSearch}
                setSearch={setProviderSearch}
                form={providerForm}
                setForm={setProviderForm}
                editingId={editingProviderId}
                saving={saving}
                onSubmit={handleProviderSubmit}
                onCancel={resetProviderForm}
                onEdit={editProvider}
                onDelete={deleteProvider}
              />
            )}

            {activeTab === "programs" && (
              <ProgramsSection
                providers={providers}
                programs={filteredPrograms}
                search={programSearch}
                setSearch={setProgramSearch}
                form={programForm}
                setForm={setProgramForm}
                editingId={editingProgramId}
                saving={saving}
                onSubmit={handleProgramSubmit}
                onCancel={resetProgramForm}
                onEdit={editProgram}
                onDelete={deleteProgram}
              />
            )}

            {activeTab === "courses" && (
              <CoursesSection
                providers={providers}
                courses={filteredCourses}
                search={courseSearch}
                setSearch={setCourseSearch}
                form={courseForm}
                setForm={setCourseForm}
                editingId={editingCourseId}
                saving={saving}
                onSubmit={handleCourseSubmit}
                onCancel={resetCourseForm}
                onEdit={editCourse}
                onDelete={deleteCourse}
              />
            )}
          </>
        )}
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
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-950">
        {value}
      </p>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
        active
          ? "bg-slate-950 text-white"
          : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
  );
}

function ProvidersSection({
  providers,
  search,
  setSearch,
  form,
  setForm,
  editingId,
  saving,
  onSubmit,
  onCancel,
  onEdit,
  onDelete,
}: {
  providers: Provider[];
  search: string;
  setSearch: (value: string) => void;
  form: typeof emptyProvider;
  setForm: React.Dispatch<
    React.SetStateAction<typeof emptyProvider>
  >;
  editingId: number | null;
  saving: boolean;
  onSubmit: (
    event: FormEvent<HTMLFormElement>
  ) => void;
  onCancel: () => void;
  onEdit: (provider: Provider) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="space-y-6">
      <FormCard
        title={
          editingId
            ? "Edit Education Provider"
            : "Add Education Provider"
        }
        description="Add a university, college, institute, academy, or other education provider."
      >
        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <Field
            label="Provider Name"
            required
            value={form.name}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                name: value,
              }))
            }
          />

          <Field
            label="Slug"
            required
            value={form.slug}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                slug: value,
              }))
            }
          />

          <SelectField
            label="Provider Type"
            value={form.type}
            options={[
              ["UNIVERSITY", "University"],
              ["COLLEGE", "College"],
              ["INSTITUTE", "Institute"],
              ["ACADEMY", "Academy"],
              ["TRAINING_CENTER", "Training Center"],
              ["OTHER", "Other"],
            ]}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                type: value,
              }))
            }
          />

          <Field
            label="Country"
            required
            value={form.country}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                country: value,
              }))
            }
          />

          <Field
            label="City"
            value={form.city}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                city: value,
              }))
            }
          />

          <Field
            label="Website URL"
            value={form.websiteUrl}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                websiteUrl: value,
              }))
            }
          />

          <TextAreaField
            label="Description"
            required
            className="md:col-span-2"
            value={form.description}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                description: value,
              }))
            }
          />

          <SelectField
            label="Verification Status"
            value={form.verificationStatus}
            options={[
              ["PUBLIC_LISTED", "Public Listed"],
              ["VERIFIED", "Verified"],
              ["PENDING", "Pending"],
              ["UNVERIFIED", "Unverified"],
            ]}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                verificationStatus: value,
              }))
            }
          />

          <SelectField
            label="Status"
            value={form.status}
            options={[
              ["DRAFT", "Draft"],
              ["PUBLISHED", "Published"],
              ["ARCHIVED", "Archived"],
            ]}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                status: value,
              }))
            }
          />

          <CheckboxField
            label="Featured provider"
            checked={form.featured}
            onChange={(checked) =>
              setForm((current) => ({
                ...current,
                featured: checked,
              }))
            }
          />

          <div className="flex items-end justify-end gap-2 md:col-span-2">
            {editingId && (
              <button
                type="button"
                onClick={onCancel}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Provider"
                  : "Create Provider"}
            </button>
          </div>
        </form>
      </FormCard>

      <ListCard
        title="Education Providers"
        search={search}
        setSearch={setSearch}
        count={providers.length}
      >
        {providers.length === 0 ? (
          <EmptyState text="No education providers found." />
        ) : (
          <div className="divide-y divide-slate-100">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-950">
                      {provider.name}
                    </h3>

                    <StatusBadge
                      value={provider.status}
                    />

                    {provider.featured && (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        Featured
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {provider.type} •{" "}
                    {provider.country}
                    {provider.city
                      ? ` • ${provider.city}`
                      : ""}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    Programs:{" "}
                    {provider._count?.programs ?? 0}
                    {" • "}
                    Courses:{" "}
                    {provider._count?.trainingCourses ?? 0}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(provider)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(provider.id)}
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ListCard>
    </div>
  );
}

function ProgramsSection({
  providers,
  programs,
  search,
  setSearch,
  form,
  setForm,
  editingId,
  saving,
  onSubmit,
  onCancel,
  onEdit,
  onDelete,
}: {
  providers: Provider[];
  programs: Program[];
  search: string;
  setSearch: (value: string) => void;
  form: typeof emptyProgram;
  setForm: React.Dispatch<
    React.SetStateAction<typeof emptyProgram>
  >;
  editingId: number | null;
  saving: boolean;
  onSubmit: (
    event: FormEvent<HTMLFormElement>
  ) => void;
  onCancel: () => void;
  onEdit: (program: Program) => void;
  onDelete: (id: number) => void;
}) {
  const providerOptions: SelectOption[] = [
    ["", "Select provider"],
    ...providers.map(
      (provider): SelectOption => [
        String(provider.id),
        provider.name,
      ]
    ),
  ];

  return (
    <div className="space-y-6">
      <FormCard
        title={
          editingId
            ? "Edit Education Program"
            : "Add Education Program"
        }
        description="Create an academic program and connect it to an education provider."
      >
        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <SelectField
            label="Education Provider"
            required
            value={form.providerId}
            options={providerOptions}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                providerId: value,
              }))
            }
          />

          <Field
            label="Program Name"
            required
            value={form.name}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                name: value,
              }))
            }
          />

          <Field
            label="Slug"
            required
            value={form.slug}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                slug: value,
              }))
            }
          />

          <SelectField
            label="Level"
            value={form.level}
            options={[
              ["CERTIFICATE", "Certificate"],
              ["DIPLOMA", "Diploma"],
              ["BACHELOR", "Bachelor"],
              ["POSTGRADUATE", "Postgraduate"],
              ["MASTERS", "Masters"],
              ["PHD", "PhD"],
              ["OTHER", "Other"],
            ]}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                level: value,
              }))
            }
          />

          <Field
            label="Field of Study"
            required
            value={form.fieldOfStudy}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                fieldOfStudy: value,
              }))
            }
          />

          <Field
            label="Duration"
            value={form.duration}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                duration: value,
              }))
            }
          />

          <Field
            label="Study Mode"
            placeholder="e.g. Online, On-campus, Hybrid"
            value={form.studyMode}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                studyMode: value,
              }))
            }
          />

          <Field
            label="Tuition"
            value={form.tuition}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                tuition: value,
              }))
            }
          />

          <Field
            label="Currency"
            value={form.currency}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                currency: value,
              }))
            }
          />

          <Field
            label="Intake"
            placeholder="e.g. September 2027"
            value={form.intake}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                intake: value,
              }))
            }
          />

          <Field
            label="Application Deadline"
            type="date"
            value={form.deadline}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                deadline: value,
              }))
            }
          />

          <Field
            label="Application URL"
            value={form.applicationUrl}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                applicationUrl: value,
              }))
            }
          />

          <TextAreaField
            label="Description"
            required
            className="md:col-span-2"
            value={form.description}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                description: value,
              }))
            }
          />

          <TextAreaField
            label="Eligibility"
            required
            className="md:col-span-2"
            value={form.eligibility}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                eligibility: value,
              }))
            }
          />

          <SelectField
            label="Verification Status"
            value={form.verificationStatus}
            options={[
              ["PUBLIC_LISTED", "Public Listed"],
              ["VERIFIED", "Verified"],
              ["PENDING", "Pending"],
              ["UNVERIFIED", "Unverified"],
            ]}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                verificationStatus: value,
              }))
            }
          />

          <SelectField
            label="Status"
            value={form.status}
            options={[
              ["DRAFT", "Draft"],
              ["PUBLISHED", "Published"],
              ["ARCHIVED", "Archived"],
            ]}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                status: value,
              }))
            }
          />

          <CheckboxField
            label="Featured program"
            checked={form.featured}
            onChange={(checked) =>
              setForm((current) => ({
                ...current,
                featured: checked,
              }))
            }
          />

          <div className="flex items-end justify-end gap-2 md:col-span-2">
            {editingId && (
              <button
                type="button"
                onClick={onCancel}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Program"
                  : "Create Program"}
            </button>
          </div>
        </form>
      </FormCard>

      <ListCard
        title="Academic Programs"
        search={search}
        setSearch={setSearch}
        count={programs.length}
      >
        {programs.length === 0 ? (
          <EmptyState text="No education programs found." />
        ) : (
          <div className="divide-y divide-slate-100">
            {programs.map((program) => (
              <div
                key={program.id}
                className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-950">
                      {program.name}
                    </h3>

                    <StatusBadge
                      value={program.status}
                    />

                    {program.featured && (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        Featured
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {program.provider.name} •{" "}
                    {program.level} •{" "}
                    {program.fieldOfStudy}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(program)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(program.id)}
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ListCard>
    </div>
  );
}

function CoursesSection({
  providers,
  courses,
  search,
  setSearch,
  form,
  setForm,
  editingId,
  saving,
  onSubmit,
  onCancel,
  onEdit,
  onDelete,
}: {
  providers: Provider[];
  courses: Course[];
  search: string;
  setSearch: (value: string) => void;
  form: typeof emptyCourse;
  setForm: React.Dispatch<
    React.SetStateAction<typeof emptyCourse>
  >;
  editingId: number | null;
  saving: boolean;
  onSubmit: (
    event: FormEvent<HTMLFormElement>
  ) => void;
  onCancel: () => void;
  onEdit: (course: Course) => void;
  onDelete: (id: number) => void;
}) {
  const providerOptions: SelectOption[] = [
    ["", "Select provider"],
    ...providers.map(
      (provider): SelectOption => [
        String(provider.id),
        provider.name,
      ]
    ),
  ];

  return (
    <div className="space-y-6">
      <FormCard
        title={
          editingId
            ? "Edit Training Course"
            : "Add Training Course"
        }
        description="Create practical training and skills-development opportunities."
      >
        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <SelectField
            label="Education Provider"
            required
            value={form.providerId}
            options={providerOptions}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                providerId: value,
              }))
            }
          />

          <Field
            label="Course Name"
            required
            value={form.name}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                name: value,
              }))
            }
          />

          <Field
            label="Slug"
            required
            value={form.slug}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                slug: value,
              }))
            }
          />

          <Field
            label="Category"
            required
            value={form.category}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                category: value,
              }))
            }
          />

          <Field
            label="Duration"
            value={form.duration}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                duration: value,
              }))
            }
          />

          <Field
            label="Delivery Mode"
            placeholder="e.g. Online, On-campus, Hybrid"
            value={form.deliveryMode}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                deliveryMode: value,
              }))
            }
          />

          <Field
            label="Cost"
            value={form.cost}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                cost: value,
              }))
            }
          />

          <Field
            label="Currency"
            value={form.currency}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                currency: value,
              }))
            }
          />

          <Field
            label="Application Deadline"
            type="date"
            value={form.deadline}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                deadline: value,
              }))
            }
          />

          <Field
            label="Application URL"
            value={form.applicationUrl}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                applicationUrl: value,
              }))
            }
          />

          <TextAreaField
            label="Description"
            required
            className="md:col-span-2"
            value={form.description}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                description: value,
              }))
            }
          />

          <TextAreaField
            label="Eligibility"
            required
            className="md:col-span-2"
            value={form.eligibility}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                eligibility: value,
              }))
            }
          />

          <SelectField
            label="Verification Status"
            value={form.verificationStatus}
            options={[
              ["PUBLIC_LISTED", "Public Listed"],
              ["VERIFIED", "Verified"],
              ["PENDING", "Pending"],
              ["UNVERIFIED", "Unverified"],
            ]}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                verificationStatus: value,
              }))
            }
          />

          <SelectField
            label="Status"
            value={form.status}
            options={[
              ["DRAFT", "Draft"],
              ["PUBLISHED", "Published"],
              ["ARCHIVED", "Archived"],
            ]}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                status: value,
              }))
            }
          />

          <CheckboxField
            label="Featured course"
            checked={form.featured}
            onChange={(checked) =>
              setForm((current) => ({
                ...current,
                featured: checked,
              }))
            }
          />

          <div className="flex items-end justify-end gap-2 md:col-span-2">
            {editingId && (
              <button
                type="button"
                onClick={onCancel}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Course"
                  : "Create Course"}
            </button>
          </div>
        </form>
      </FormCard>

      <ListCard
        title="Training Courses"
        search={search}
        setSearch={setSearch}
        count={courses.length}
      >
        {courses.length === 0 ? (
          <EmptyState text="No training courses found." />
        ) : (
          <div className="divide-y divide-slate-100">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-950">
                      {course.name}
                    </h3>

                    <StatusBadge
                      value={course.status}
                    />

                    {course.featured && (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        Featured
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {course.provider.name} •{" "}
                    {course.category}
                    {course.deliveryMode
                      ? ` • ${course.deliveryMode}`
                      : ""}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(course)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(course.id)}
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ListCard>
    </div>
  );
}

function FormCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-950">
          {title}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}

function ListCard({
  title,
  search,
  setSearch,
  count,
  children,
}: {
  title: string;
  search: string;
  setSearch: (value: string) => void;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-950">
            {title}
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            {count} record{count === 1 ? "" : "s"}
          </p>
        </div>

        <input
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder={`Search ${title.toLowerCase()}...`}
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:max-w-xs"
        />
      </div>

      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className={labelClass}>
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className={inputClass}
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  required,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className={labelClass}>
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <textarea
        required={required}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        rows={4}
        className={`${inputClass} resize-y`}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
  required,
}: {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className={labelClass}>
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <select
        required={required}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className={inputClass}
      >
        {options.map(
          ([optionValue, optionLabel]) => (
            <option
              key={optionValue}
              value={optionValue}
            >
              {optionLabel}
            </option>
          )
        )}
      </select>
    </div>
  );
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 self-end rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(event.target.checked)
        }
        className="h-4 w-4 rounded border-slate-300"
      />

      {label}
    </label>
  );
}

function StatusBadge({
  value,
}: {
  value: string;
}) {
  const normalized = value.toUpperCase();

  let className =
    "bg-slate-100 text-slate-600";

  if (normalized === "PUBLISHED") {
    className =
      "bg-green-50 text-green-700";
  }

  if (normalized === "DRAFT") {
    className =
      "bg-amber-50 text-amber-700";
  }

  if (normalized === "ARCHIVED") {
    className =
      "bg-slate-100 text-slate-500";
  }

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}
    >
      {value}
    </span>
  );
}

function EmptyState({
  text,
}: {
  text: string;
}) {
  return (
    <div className="p-10 text-center text-sm text-slate-500">
      {text}
    </div>
  );
}