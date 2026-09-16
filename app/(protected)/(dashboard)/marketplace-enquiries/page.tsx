"use client";

import { useEffect, useMemo, useState } from "react";

// =======================================================
// TYPES
// =======================================================

type MarketplaceEnquiry = {
  id: number;
  productId: number | null;
  productName: string;
  customerName: string;
  email: string;
  phone: string;
  country: string;
  quantity: number | null;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  product: {
    id: number;
    name: string;
    slug: string;
    category: string;
    imageUrl: string | null;
  } | null;
};

// =======================================================
// STATUS CONFIGURATION
// =======================================================

const statuses = [
  "ALL",
  "NEW",
  "CONTACTED",
  "QUOTED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

function getStatusClasses(status: string) {
  switch (status) {
    case "NEW":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "CONTACTED":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "QUOTED":
      return "bg-purple-50 text-purple-700 border-purple-200";

    case "IN_PROGRESS":
      return "bg-orange-50 text-orange-700 border-orange-200";

    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "CANCELLED":
      return "bg-red-50 text-red-700 border-red-200";

    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
}

function formatStatus(status: string) {
  return status.replace(
    /_/g,
    " "
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleString(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );
}

// =======================================================
// PAGE
// =======================================================

export default function MarketplaceEnquiriesPage() {
  const [enquiries, setEnquiries] =
    useState<MarketplaceEnquiry[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [selectedEnquiry, setSelectedEnquiry] =
    useState<MarketplaceEnquiry | null>(
      null
    );

  const [selectedStatus, setSelectedStatus] =
    useState("");

  const [savingStatus, setSavingStatus] =
    useState(false);

  const [statusMessage, setStatusMessage] =
    useState("");

  const [statusError, setStatusError] =
    useState("");

  // =====================================================
  // LOAD ENQUIRIES
  // =====================================================

  useEffect(() => {
    loadEnquiries();
  }, []);

  async function loadEnquiries() {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(
          "/api/marketplace/admin/enquiries",
          {
            cache: "no-store",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to load marketplace enquiries."
        );
      }

      setEnquiries(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load marketplace enquiries."
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // FILTERED ENQUIRIES
  // =====================================================

  const filteredEnquiries =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return enquiries.filter(
        (enquiry) => {
          const matchesStatus =
            statusFilter === "ALL" ||
            enquiry.status ===
              statusFilter;

          if (!matchesStatus) {
            return false;
          }

          if (!normalizedSearch) {
            return true;
          }

          return [
            enquiry.customerName,
            enquiry.email,
            enquiry.phone,
            enquiry.country,
            enquiry.productName,
            enquiry.message,
          ].some((value) =>
            value
              .toLowerCase()
              .includes(
                normalizedSearch
              )
          );
        }
      );
    }, [
      enquiries,
      search,
      statusFilter,
    ]);

  // =====================================================
  // STATISTICS
  // =====================================================

  const statistics = useMemo(
    () => ({
      total: enquiries.length,

      new: enquiries.filter(
        (item) =>
          item.status === "NEW"
      ).length,

      contacted: enquiries.filter(
        (item) =>
          item.status ===
          "CONTACTED"
      ).length,

      quoted: enquiries.filter(
        (item) =>
          item.status === "QUOTED"
      ).length,

      inProgress: enquiries.filter(
        (item) =>
          item.status ===
          "IN_PROGRESS"
      ).length,

      completed: enquiries.filter(
        (item) =>
          item.status ===
          "COMPLETED"
      ).length,
    }),
    [enquiries]
  );

  // =====================================================
  // UPDATE ENQUIRY STATUS
  // =====================================================

  async function updateEnquiryStatus() {
    if (!selectedEnquiry || !selectedStatus) {
      return;
    }

    try {
      setSavingStatus(true);
      setStatusMessage("");
      setStatusError("");

      const response = await fetch(
        `/api/marketplace/admin/enquiries/${selectedEnquiry.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: selectedStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to update enquiry status."
        );
      }

      const updatedEnquiry =
        data?.enquiry as MarketplaceEnquiry | undefined;

      if (updatedEnquiry) {
        setSelectedEnquiry(updatedEnquiry);

        setEnquiries((current) =>
          current.map((item) =>
            item.id === updatedEnquiry.id
              ? updatedEnquiry
              : item
          )
        );

        setSelectedStatus(updatedEnquiry.status);
      }

      setStatusMessage(
        data?.message ||
          "Enquiry status updated successfully."
      );
    } catch (err) {
      console.error(err);

      setStatusError(
        err instanceof Error
          ? err.message
          : "Unable to update enquiry status."
      );
    } finally {
      setSavingStatus(false);
    }
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="space-y-6">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b67b25]">
            SIMMY LINK AFRICA
          </p>

          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Marketplace Enquiries
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage customer product enquiries, quotation requests and
            sourcing opportunities from the SIMMY LINK AFRICA Marketplace.
          </p>
        </div>

        <button
          type="button"
          onClick={loadEnquiries}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Refreshing..."
            : "Refresh Enquiries"}
        </button>
      </div>

      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-500">
            Total
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {statistics.total}
          </p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5 shadow-sm">
          <p className="text-xs font-medium text-blue-600">
            New
          </p>

          <p className="mt-2 text-2xl font-bold text-blue-800">
            {statistics.new}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5 shadow-sm">
          <p className="text-xs font-medium text-amber-600">
            Contacted
          </p>

          <p className="mt-2 text-2xl font-bold text-amber-800">
            {statistics.contacted}
          </p>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-5 shadow-sm">
          <p className="text-xs font-medium text-purple-600">
            Quoted
          </p>

          <p className="mt-2 text-2xl font-bold text-purple-800">
            {statistics.quoted}
          </p>
        </div>

        <div className="rounded-2xl border border-orange-100 bg-orange-50/40 p-5 shadow-sm">
          <p className="text-xs font-medium text-orange-600">
            In Progress
          </p>

          <p className="mt-2 text-2xl font-bold text-orange-800">
            {statistics.inProgress}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 shadow-sm">
          <p className="text-xs font-medium text-emerald-600">
            Completed
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-800">
            {statistics.completed}
          </p>
        </div>
      </div>

      {/* =================================================
          FILTERS
      ================================================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
          <div>
            <label
              htmlFor="enquiry-search"
              className="text-xs font-semibold text-slate-700"
            >
              Search enquiries
            </label>

            <input
              id="enquiry-search"
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search customer, email, product, country..."
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#08265c] focus:bg-white focus:ring-2 focus:ring-[#08265c]/10"
            />
          </div>

          <div>
            <label
              htmlFor="status-filter"
              className="text-xs font-semibold text-slate-700"
            >
              Status
            </label>

            <select
              id="status-filter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#08265c] focus:bg-white focus:ring-2 focus:ring-[#08265c]/10"
            >
              {statuses.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {formatStatus(
                      status
                    )}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-medium text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Customer Enquiries
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Showing{" "}
                {
                  filteredEnquiries.length
                }{" "}
                of{" "}
                {enquiries.length}{" "}
                enquiries
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <p className="text-sm text-slate-500">
              Loading marketplace enquiries...
            </p>
          </div>
        ) : filteredEnquiries.length ===
          0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef3fb] text-sm font-bold text-[#08265c]">
              SL
            </div>

            <h3 className="mt-4 text-base font-bold text-slate-900">
              No enquiries found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              No marketplace enquiries match the current search and status
              filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Customer
                  </th>

                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Product
                  </th>

                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Location
                  </th>

                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Qty
                  </th>

                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Date
                  </th>

                  <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredEnquiries.map(
                  (enquiry) => (
                    <tr
                      key={
                        enquiry.id
                      }
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {
                              enquiry.customerName
                            }
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {
                              enquiry.email
                            }
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {
                              enquiry.phone
                            }
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="max-w-[220px] truncate text-sm font-medium text-slate-800">
                          {
                            enquiry.productName
                          }
                        </p>

                        {enquiry.product && (
                          <p className="mt-1 text-xs text-[#b67b25]">
                            {
                              enquiry
                                .product
                                .category
                            }
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-700">
                          {
                            enquiry.country
                          }
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm font-medium text-slate-700">
                          {enquiry.quantity ??
                            "—"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${getStatusClasses(
                            enquiry.status
                          )}`}
                        >
                          {formatStatus(
                            enquiry.status
                          )}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="whitespace-nowrap text-xs text-slate-500">
                          {formatDate(
                            enquiry.createdAt
                          )}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedEnquiry(
                              enquiry
                            );
                            setSelectedStatus(
                              enquiry.status
                            );
                            setStatusMessage("");
                            setStatusError("");
                          }}
                          className="rounded-lg bg-[#08265c] px-4 py-2 text-[10px] font-semibold text-white transition hover:bg-[#123c82]"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =================================================
          DETAILS MODAL
      ================================================= */}

      {selectedEnquiry && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#061d49]/70 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="enquiry-details-title"
        >
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#b67b25]">
                  MARKETPLACE ENQUIRY
                </p>

                <h2
                  id="enquiry-details-title"
                  className="mt-2 text-xl font-bold text-[#08265c]"
                >
                  Enquiry #
                  {
                    selectedEnquiry.id
                  }
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedEnquiry(null);
                  setSelectedStatus("");
                  setStatusMessage("");
                  setStatusError("");
                }}
                aria-label="Close enquiry details"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-600 transition hover:bg-slate-200"
              >
                ×
              </button>
            </div>

            <div className="space-y-6 px-6 py-6">
              {/* PRODUCT */}

              <div className="rounded-2xl bg-[#eef3fb] p-5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#b67b25]">
                  Product Requested
                </p>

                <h3 className="mt-2 text-lg font-bold text-[#08265c]">
                  {
                    selectedEnquiry.productName
                  }
                </h3>

                {selectedEnquiry
                  .product && (
                  <p className="mt-1 text-xs text-slate-500">
                    {
                      selectedEnquiry
                        .product
                        .category
                    }
                  </p>
                )}
              </div>

              {/* CUSTOMER */}

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Customer Information
                </h3>

                <div className="mt-3 grid gap-4 rounded-2xl border border-slate-200 p-5 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-slate-400">
                      Name
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {
                        selectedEnquiry.customerName
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase text-slate-400">
                      Country
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {
                        selectedEnquiry.country
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase text-slate-400">
                      Email
                    </p>

                    <a
                      href={`mailto:${selectedEnquiry.email}`}
                      className="mt-1 block text-sm font-medium text-[#08265c] hover:underline"
                    >
                      {
                        selectedEnquiry.email
                      }
                    </a>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase text-slate-400">
                      Phone / WhatsApp
                    </p>

                    <a
                      href={`tel:${selectedEnquiry.phone}`}
                      className="mt-1 block text-sm font-medium text-[#08265c] hover:underline"
                    >
                      {
                        selectedEnquiry.phone
                      }
                    </a>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase text-slate-400">
                      Quantity
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {selectedEnquiry.quantity ??
                        "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase text-slate-400">
                      Submitted
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {formatDate(
                        selectedEnquiry.createdAt
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* MESSAGE */}

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Customer Message
                </h3>

                <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                    {
                      selectedEnquiry.message
                    }
                  </p>
                </div>
              </div>

              {/* STATUS */}

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Enquiry Status
                </h3>

                <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="flex-1">
                      <label
                        htmlFor="enquiry-status"
                        className="text-[10px] font-semibold uppercase tracking-wide text-slate-400"
                      >
                        Update Status
                      </label>

                      <select
                        id="enquiry-status"
                        value={selectedStatus}
                        onChange={(event) => {
                          setSelectedStatus(
                            event.target.value
                          );
                          setStatusMessage("");
                          setStatusError("");
                        }}
                        disabled={savingStatus}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#08265c] focus:ring-2 focus:ring-[#08265c]/10 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {statuses
                          .filter(
                            (status) =>
                              status !== "ALL"
                          )
                          .map((status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {formatStatus(
                                status
                              )}
                            </option>
                          ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={updateEnquiryStatus}
                      disabled={
                        savingStatus ||
                        !selectedStatus ||
                        selectedStatus ===
                          selectedEnquiry.status
                      }
                      className="rounded-xl bg-[#08265c] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#123c82] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {savingStatus
                        ? "Saving..."
                        : "Save Status"}
                    </button>
                  </div>

                  <div className="mt-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Current Status
                    </p>

                    <span
                      className={`mt-2 inline-flex rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide ${getStatusClasses(
                        selectedEnquiry.status
                      )}`}
                    >
                      {formatStatus(
                        selectedEnquiry.status
                      )}
                    </span>
                  </div>

                  {statusMessage && (
                    <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                      <p className="text-xs font-medium text-emerald-700">
                        {statusMessage}
                      </p>
                    </div>
                  )}

                  {statusError && (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                      <p className="text-xs font-medium text-red-700">
                        {statusError}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedEnquiry(null);
                    setSelectedStatus("");
                    setStatusMessage("");
                    setStatusError("");
                  }}
                  className="rounded-full bg-[#08265c] px-6 py-3 text-xs font-semibold text-white transition hover:bg-[#123c82]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}