"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Account = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  country?: string | null;
  city?: string | null;
  profileImage?: string | null;
  status: string;
  emailVerified: boolean;
  termsAccepted: boolean;
  termsAcceptedAt?: string | null;
  termsVersion?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type Activity = {
  id: number;
  type: string;
  module: string;
  title: string;
  description?: string | null;
  itemId?: number | null;
  itemSlug?: string | null;
  itemUrl?: string | null;
  metadata?: unknown;
  createdAt: string;
};

type ActivityResponse = {
  activities: Activity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export default function AccountPage() {
  const router = useRouter();

  const [account, setAccount] = useState<Account | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);

  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [editingProfile, setEditingProfile] = useState(false);
  const [activityPage, setActivityPage] = useState(1);

  const [activityPagination, setActivityPagination] =
    useState<ActivityResponse["pagination"] | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    country: "",
    city: "",
  });

  useEffect(() => {
    async function loadAccount() {
      try {
        const response = await fetch("/api/accounts/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          router.replace("/account/login");
          return;
        }

        setAccount(data.account);

        setProfileForm({
          firstName: data.account.firstName || "",
          lastName: data.account.lastName || "",
          phone: data.account.phone || "",
          country: data.account.country || "",
          city: data.account.city || "",
        });
      } catch {
        setError("Unable to load your account.");
      } finally {
        setLoading(false);
      }
    }

    loadAccount();
  }, [router]);

  useEffect(() => {
    async function loadActivity() {
      if (!account) {
        return;
      }

      setActivityLoading(true);

      try {
        const response = await fetch(
          `/api/accounts/activity?page=${activityPage}&limit=10`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Unable to load your activity.");
          return;
        }

        setActivities(data.activities || []);
        setActivityPagination(data.pagination || null);
      } catch {
        setError("Unable to load your activity.");
      } finally {
        setActivityLoading(false);
      }
    }

    loadActivity();
  }, [account, activityPage]);

  async function handleSaveProfile() {
    if (!account) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/accounts/me", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileForm),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to update your profile.");
        return;
      }

      setAccount(data.account);
      setProfileForm({
        firstName: data.account.firstName || "",
        lastName: data.account.lastName || "",
        phone: data.account.phone || "",
        country: data.account.country || "",
        city: data.account.city || "",
      });

      setEditingProfile(false);
      setSuccess("Your profile has been updated successfully.");
    } catch {
      setError("Unable to update your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    setError("");

    try {
      await fetch("/api/accounts/logout", {
        method: "POST",
        credentials: "include",
      });

      router.replace("/account/login");
      router.refresh();
    } catch {
      setError("Unable to log out. Please try again.");
      setLoggingOut(false);
    }
  }

  function formatDate(date?: string | null) {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function formatActivityType(type: string) {
    return type
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function getModuleBadge(module: string) {
    const normalized = module.toLowerCase();

    if (normalized === "opportunities") {
      return "bg-blue-100 text-blue-700";
    }

    if (normalized === "education") {
      return "bg-purple-100 text-purple-700";
    }

    if (normalized === "careers") {
      return "bg-green-100 text-green-700";
    }

    if (normalized === "business") {
      return "bg-orange-100 text-orange-700";
    }

    if (normalized === "marketplace") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (normalized === "account") {
      return "bg-slate-200 text-slate-700";
    }

    return "bg-slate-100 text-slate-600";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-700" />
            <p className="mt-4 text-sm text-slate-500">
              Loading your account...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!account) {
    return null;
  }

  const fullName = `${account.firstName} ${account.lastName}`;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-3 text-lg font-bold text-slate-950"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 text-slate-950">
              S
            </span>

            <span>SIMMY LINK AFRICA</span>
          </Link>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
          >
            {loggingOut ? "Logging out..." : "Log out"}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Alerts */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Welcome */}
        <section className="rounded-3xl bg-slate-950 p-8 text-white shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-yellow-400">
            My Account
          </p>

          <div className="mt-3 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">
                Welcome, {account.firstName}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Your personal SIMMY LINK AFRICA account connects your profile,
                activities and future services across the ecosystem.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Account status
              </p>

              <p className="mt-1 font-semibold text-green-400">
                {account.status}
              </p>
            </div>
          </div>
        </section>

        {/* Account navigation */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href="#profile"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300"
          >
            <div className="text-2xl">👤</div>
            <h2 className="mt-3 font-bold text-slate-950">My Profile</h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage your personal information.
            </p>
          </a>

          <a
            href="#activity"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300"
          >
            <div className="text-2xl">🕘</div>
            <h2 className="mt-3 font-bold text-slate-950">My Activity</h2>
            <p className="mt-1 text-sm text-slate-500">
              View what you have done on the platform.
            </p>
          </a>

          <a
            href="#services"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300"
          >
            <div className="text-2xl">🌍</div>
            <h2 className="mt-3 font-bold text-slate-950">
              Explore Services
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Access the SIMMY LINK AFRICA ecosystem.
            </p>
          </a>

          <Link
            href="/"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300"
          >
            <div className="text-2xl">🏠</div>
            <h2 className="mt-3 font-bold text-slate-950">
              Main Website
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Return to SIMMY LINK AFRICA.
            </p>
          </Link>
        </section>

        {/* Profile */}
        <section
          id="profile"
          className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                My Profile
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Keep your account information accurate and up to date.
              </p>
            </div>

            {!editingProfile && (
              <button
                onClick={() => {
                  setError("");
                  setSuccess("");
                  setEditingProfile(true);
                }}
                className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Edit Profile
              </button>
            )}
          </div>

          {!editingProfile ? (
            <>
              <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <ProfileItem
                  label="Full name"
                  value={fullName}
                />

                <ProfileItem
                  label="Email"
                  value={account.email}
                />

                <ProfileItem
                  label="Phone"
                  value={account.phone || "Not provided"}
                />

                <ProfileItem
                  label="Country"
                  value={account.country || "Not provided"}
                />

                <ProfileItem
                  label="City"
                  value={account.city || "Not provided"}
                />

                <ProfileItem
                  label="Account status"
                  value={account.status}
                />
              </div>

              <div className="mt-7 grid gap-6 border-t border-slate-100 pt-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Email verification
                  </p>

                  <p className="mt-2 text-sm font-semibold">
                    {account.emailVerified ? (
                      <span className="text-green-700">
                        ✓ Email verified
                      </span>
                    ) : (
                      <span className="text-amber-600">
                        Email not yet verified
                      </span>
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Terms acceptance
                  </p>

                  <p className="mt-2 text-sm font-semibold text-green-700">
                    {account.termsAccepted
                      ? "✓ Terms accepted"
                      : "Terms not accepted"}
                  </p>

                  {account.termsAccepted && (
                    <p className="mt-1 text-xs text-slate-500">
                      {account.termsVersion || "T&C v1.0"} •{" "}
                      {formatDate(account.termsAcceptedAt)}
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="mt-7">
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  label="First name"
                  value={profileForm.firstName}
                  onChange={(value) =>
                    setProfileForm((current) => ({
                      ...current,
                      firstName: value,
                    }))
                  }
                />

                <FormField
                  label="Last name"
                  value={profileForm.lastName}
                  onChange={(value) =>
                    setProfileForm((current) => ({
                      ...current,
                      lastName: value,
                    }))
                  }
                />

                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Email
                  </label>

                  <input
                    type="email"
                    value={account.email}
                    disabled
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 outline-none"
                  />

                  <p className="mt-1 text-xs text-slate-400">
                    Email changes require a separate verification process.
                  </p>
                </div>

                <FormField
                  label="Phone"
                  value={profileForm.phone}
                  onChange={(value) =>
                    setProfileForm((current) => ({
                      ...current,
                      phone: value,
                    }))
                  }
                />

                <FormField
                  label="Country"
                  value={profileForm.country}
                  onChange={(value) =>
                    setProfileForm((current) => ({
                      ...current,
                      country: value,
                    }))
                  }
                />

                <FormField
                  label="City"
                  value={profileForm.city}
                  onChange={(value) =>
                    setProfileForm((current) => ({
                      ...current,
                      city: value,
                    }))
                  }
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  onClick={() => {
                    setEditingProfile(false);
                    setProfileForm({
                      firstName: account.firstName || "",
                      lastName: account.lastName || "",
                      phone: account.phone || "",
                      country: account.country || "",
                      city: account.city || "",
                    });
                  }}
                  disabled={saving}
                  className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Activity */}
        <section
          id="activity"
          className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                My Activity
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                A record of your activity across SIMMY LINK AFRICA.
              </p>
            </div>

            {activityPagination && (
              <span className="text-sm text-slate-500">
                {activityPagination.total}{" "}
                {activityPagination.total === 1
                  ? "activity"
                  : "activities"}
              </span>
            )}
          </div>

          <div className="mt-6">
            {activityLoading ? (
              <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-200 py-12">
                <div className="text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-700" />
                  <p className="mt-3 text-sm text-slate-500">
                    Loading your activity...
                  </p>
                </div>
              </div>
            ) : activities.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                <div className="text-4xl">🕘</div>

                <h3 className="mt-4 font-bold text-slate-950">
                  No activity yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Your activity history will appear here as you interact
                  with SIMMY LINK AFRICA services.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="rounded-2xl border border-slate-200 p-5 transition hover:border-slate-300"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg">
                          {getActivityIcon(activity.type)}
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-950">
                            {activity.title}
                          </h3>

                          {activity.description && (
                            <p className="mt-1 text-sm leading-6 text-slate-500">
                              {activity.description}
                            </p>
                          )}

                          <p className="mt-2 text-xs text-slate-400">
                            {formatActivityType(activity.type)} •{" "}
                            {formatDate(activity.createdAt)}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getModuleBadge(
                          activity.module
                        )}`}
                      >
                        {activity.module}
                      </span>
                    </div>

                    {activity.itemUrl && (
                      <div className="mt-4 border-t border-slate-100 pt-4">
                        <Link
                          href={activity.itemUrl}
                          className="text-sm font-semibold text-blue-700 hover:underline"
                        >
                          View related item →
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {activityPagination &&
            activityPagination.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                <button
                  onClick={() =>
                    setActivityPage((page) => Math.max(1, page - 1))
                  }
                  disabled={
                    !activityPagination.hasPreviousPage ||
                    activityLoading
                  }
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ← Previous
                </button>

                <span className="text-sm text-slate-500">
                  Page {activityPagination.page} of{" "}
                  {activityPagination.totalPages}
                </span>

                <button
                  onClick={() =>
                    setActivityPage((page) => page + 1)
                  }
                  disabled={
                    !activityPagination.hasNextPage ||
                    activityLoading
                  }
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            )}
        </section>

        {/* Services */}
        <section id="services" className="mt-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">
              Explore SIMMY LINK AFRICA
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Continue exploring opportunities, knowledge, careers,
              businesses and global marketplace services.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <ServiceCard
              href="/opportunities"
              icon="🎯"
              title="Opportunities"
              description="Discover grants, scholarships and other opportunities."
            />

            <ServiceCard
              href="/education"
              icon="🎓"
              title="Education & Training"
              description="Explore education programs and training courses."
            />

            <ServiceCard
              href="/careers"
              icon="💼"
              title="Careers"
              description="Find career and employment opportunities."
            />

            <ServiceCard
              href="/business"
              icon="🏢"
              title="Business"
              description="Discover businesses, services and connections."
            />

            <ServiceCard
              href="/marketplace"
              icon="🛒"
              title="Marketplace"
              description="Explore products and global trade opportunities."
            />

            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
              <div className="text-2xl">🚀</div>

              <h3 className="mt-3 font-bold text-slate-950">
                More coming
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Saved opportunities, applications, notifications and
                other personalized services will be added as the
                ecosystem grows.
              </p>
            </div>
          </div>
        </section>

        {/* Legal/account information */}
        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <h2 className="font-bold text-slate-950">
            Your account &amp; privacy
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Your account activity is associated with your SIMMY LINK
            AFRICA account so you can return later and continue your
            journey across the platform.
          </p>

          <div className="mt-5 flex flex-wrap gap-4 text-sm">
            <Link
              href="/terms"
              className="font-semibold text-blue-700 hover:underline"
            >
              Terms &amp; Conditions
            </Link>

            <Link
              href="/privacy"
              className="font-semibold text-blue-700 hover:underline"
            >
              Privacy Policy
            </Link>
          </div>
        </section>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            ← Back to SIMMY LINK AFRICA
          </Link>
        </div>
      </div>
    </main>
  );
}

function ProfileItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-medium text-slate-900">
        {value}
      </p>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

function ServiceCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
    >
      <div className="text-2xl">{icon}</div>

      <h3 className="mt-3 font-bold text-slate-950">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <p className="mt-4 text-sm font-semibold text-blue-700">
        Explore →
      </p>
    </Link>
  );
}

function getActivityIcon(type: string) {
  const normalized = type.toUpperCase();

  if (normalized.includes("LOGIN")) {
    return "🔐";
  }

  if (normalized.includes("LOGOUT")) {
    return "🚪";
  }

  if (normalized.includes("VIEWED") || normalized.includes("VIEW")) {
    return "👁️";
  }

  if (normalized.includes("SAVED")) {
    return "⭐";
  }

  if (normalized.includes("APPLIED") || normalized.includes("APPLICATION")) {
    return "📨";
  }

  if (normalized.includes("ENQUIRY")) {
    return "💬";
  }

  if (normalized.includes("PROFILE")) {
    return "👤";
  }

  if (normalized.includes("ACCOUNT")) {
    return "📝";
  }

  return "📌";
}