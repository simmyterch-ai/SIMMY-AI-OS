"use client";

import { useEffect, useState } from "react";

type Account = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  country: string | null;
  city: string | null;
  status: string;
};

type Opportunity = {
  id: number;
  title: string;
  slug: string;
  organizationName: string | null;
  type: string;
};

type Application = {
  id: number;
  accountId: number;
  opportunityId: number;

  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  country: string | null;
  city: string | null;

  message: string | null;
  status: string;
  submittedAt: string;

  account: Account;
  opportunity: Opportunity;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export default function OpportunityApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);

  async function loadApplications(page = 1) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/admin/opportunity-applications?page=${page}&limit=20`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load opportunity applications."
        );
      }

      setApplications(data.applications || []);
      setPagination(data.pagination || null);
    } catch (error) {
      console.error("Failed to load applications:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load opportunity applications."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          SIMMY LINK AFRICA
        </p>

        <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Opportunity Applications
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Review applications submitted by SIMMY LINK AFRICA account
              holders through the platform.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              loadApplications(pagination?.page || 1)
            }
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {pagination && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Total Applications
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              {pagination.total}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Current Page
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              {pagination.page}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Total Pages
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              {pagination.totalPages}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Loading opportunity applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-lg font-bold text-slate-900">
              No applications yet
            </p>

            <p className="mt-2 text-sm text-slate-600">
              Applications submitted through SIMMY LINK AFRICA will appear
              here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Applicant
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Opportunity
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Organization
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Submitted
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">
                        {application.firstName}{" "}
                        {application.lastName}
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        {application.email}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">
                        {application.opportunity.title}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {application.opportunity.type}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {application.opportunity.organizationName ||
                        "Not specified"}
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {application.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {new Date(
                        application.submittedAt
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedApplication(application)
                        }
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-900"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            disabled={
              loading || pagination.page <= 1
            }
            onClick={() =>
              loadApplications(pagination.page - 1)
            }
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <p className="text-sm text-slate-600">
            Page {pagination.page} of{" "}
            {pagination.totalPages}
          </p>

          <button
            type="button"
            disabled={
              loading ||
              pagination.page >= pagination.totalPages
            }
            onClick={() =>
              loadApplications(pagination.page + 1)
            }
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Application Details
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-950">
                  {selectedApplication.opportunity.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedApplication(null)
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Applicant
                </p>

                <p className="mt-1 font-semibold text-slate-950">
                  {selectedApplication.firstName}{" "}
                  {selectedApplication.lastName}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Email
                </p>

                <p className="mt-1 text-slate-900">
                  {selectedApplication.email}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Phone
                </p>

                <p className="mt-1 text-slate-900">
                  {selectedApplication.phone ||
                    "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Location
                </p>

                <p className="mt-1 text-slate-900">
                  {[
                    selectedApplication.city,
                    selectedApplication.country,
                  ]
                    .filter(Boolean)
                    .join(", ") || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {selectedApplication.status}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Submitted
                </p>

                <p className="mt-1 text-slate-900">
                  {new Date(
                    selectedApplication.submittedAt
                  ).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-7 border-t border-slate-200 pt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Cover Letter / Application Message
              </p>

              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-5">
                {selectedApplication.message ? (
                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-800">
                    {selectedApplication.message}
                  </p>
                ) : (
                  <p className="text-sm italic text-slate-500">
                    No application message was provided.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}