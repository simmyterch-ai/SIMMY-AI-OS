"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Archive,
  Check,
  Mail,
  MailOpen,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

type MessageStatus =
  | "UNREAD"
  | "READ"
  | "ARCHIVED";

type ContactMessage = {
  id: string;

  name: string;
  email: string;
  subject: string;
  message: string;

  status: MessageStatus;

  createdAt: string;
  updatedAt: string;
};

type MessageStats = {
  totalMessages: number;
  unreadMessages: number;
  readMessages: number;
  archivedMessages: number;
};

const initialStats: MessageStats = {
  totalMessages: 0,
  unreadMessages: 0,
  readMessages: 0,
  archivedMessages: 0,
};

export default function ContactMessagesClient() {
  const [messages, setMessages] =
    useState<ContactMessage[]>([]);

  const [stats, setStats] =
    useState<MessageStats>(initialStats);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState<"ALL" | MessageStatus>("ALL");

  const [selectedMessage, setSelectedMessage] =
    useState<ContactMessage | null>(
      null
    );

  const [updating, setUpdating] =
    useState(false);

  async function loadMessages() {
    try {
      setLoading(true);

      const params =
        new URLSearchParams();

      if (status !== "ALL") {
        params.set("status", status);
      }

      if (search.trim()) {
        params.set(
          "search",
          search.trim()
        );
      }

      const query =
        params.toString();

      const response =
        await fetch(
          `/api/admin/contact-messages${
            query ? `?${query}` : ""
          }`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

      if (!response.ok) {
        throw new Error(
          "Failed to load messages."
        );
      }

      const data =
        await response.json();

      setMessages(data.messages || []);
      setStats(
        data.stats || initialStats
      );
    } catch (error) {
      console.error(
        "Failed to load messages:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout =
      setTimeout(() => {
        loadMessages();
      }, 250);

    return () =>
      clearTimeout(timeout);
  }, [status, search]);

  async function updateStatus(
    id: string,
    newStatus: MessageStatus
  ) {
    try {
      setUpdating(true);

      const response =
        await fetch(
          `/api/admin/contact-messages/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              status: newStatus,
            }),
          }
        );

      if (!response.ok) {
        throw new Error(
          "Failed to update message."
        );
      }

      const data =
        await response.json();

      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.id === id
            ? data.message
            : message
        )
      );

      setSelectedMessage(
        data.message
      );

      await loadMessages();
    } catch (error) {
      console.error(
        "Failed to update message:",
        error
      );
    } finally {
      setUpdating(false);
    }
  }

  function openMessage(
    message: ContactMessage
  ) {
    setSelectedMessage(message);

    if (message.status === "UNREAD") {
      updateStatus(
        message.id,
        "READ"
      );
    }
  }

  const filteredTitle =
    useMemo(() => {
      if (status === "UNREAD") {
        return "Unread Messages";
      }

      if (status === "READ") {
        return "Read Messages";
      }

      if (status === "ARCHIVED") {
        return "Archived Messages";
      }

      return "All Messages";
    }, [status]);

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            SIMMY LINK AFRICA
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Contact Messages
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Manage messages submitted by
            visitors and users through the
            SIMMY LINK AFRICA website.
          </p>
        </div>

        <button
          type="button"
          onClick={loadMessages}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" />

          Refresh
        </button>

      </div>

      {/* STATS */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          label="Total Messages"
          value={stats.totalMessages}
          icon={<Mail />}
        />

        <StatCard
          label="Unread"
          value={stats.unreadMessages}
          icon={<Mail />}
          highlighted
        />

        <StatCard
          label="Read"
          value={stats.readMessages}
          icon={<MailOpen />}
        />

        <StatCard
          label="Archived"
          value={stats.archivedMessages}
          icon={<Archive />}
        />

      </div>

      {/* FILTERS */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="relative w-full lg:max-w-md">

            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search name, email or subject..."
              className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500"
            />

          </div>

          <div className="flex flex-wrap gap-2">

            {[
              ["ALL", "All"],
              ["UNREAD", "Unread"],
              ["READ", "Read"],
              ["ARCHIVED", "Archived"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setStatus(
                    value as
                      | "ALL"
                      | MessageStatus
                  )
                }
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  status === value
                    ? "bg-[#0b2a63] text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}

          </div>

        </div>

      </div>

      {/* MESSAGES */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="font-bold text-slate-900">
            {filteredTitle}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {messages.length} message
            {messages.length === 1
              ? ""
              : "s"} found.
          </p>

        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No messages found.
          </div>
        ) : (
          <div className="divide-y divide-slate-200">

            {messages.map((message) => (

              <button
                key={message.id}
                type="button"
                onClick={() =>
                  openMessage(
                    message
                  )
                }
                className={`w-full px-6 py-5 text-left transition hover:bg-slate-50 ${
                  message.status ===
                  "UNREAD"
                    ? "bg-blue-50/40"
                    : ""
                }`}
              >

                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

                  <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-3">

                      <h3
                        className={`text-sm text-slate-950 ${
                          message.status ===
                          "UNREAD"
                            ? "font-bold"
                            : "font-semibold"
                        }`}
                      >
                        {message.name}
                      </h3>

                      <StatusBadge
                        status={
                          message.status
                        }
                      />

                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      {message.email}
                    </p>

                    <p
                      className={`mt-3 truncate ${
                        message.status ===
                        "UNREAD"
                          ? "font-semibold text-slate-800"
                          : "text-slate-700"
                      }`}
                    >
                      {message.subject}
                    </p>

                  </div>

                  <div className="shrink-0 text-sm text-slate-400">

                    {new Date(
                      message.createdAt
                    ).toLocaleString()}

                  </div>

                </div>

              </button>

            ))}

          </div>
        )}

      </div>

      {/* MESSAGE MODAL */}

      {selectedMessage && (
        <MessageModal
          message={selectedMessage}
          updating={updating}
          onClose={() =>
            setSelectedMessage(null)
          }
          onUpdateStatus={
            updateStatus
          }
        />
      )}

    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  highlighted = false,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-6 ${
        highlighted
          ? "border-blue-200 bg-blue-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-3 text-3xl font-bold text-slate-950">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            highlighted
              ? "bg-blue-100 text-blue-700"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {icon}
        </div>

      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: MessageStatus;
}) {
  const styles = {
    UNREAD:
      "bg-blue-100 text-blue-700",

    READ:
      "bg-slate-100 text-slate-700",

    ARCHIVED:
      "bg-amber-100 text-amber-700",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
        styles[status]
      }`}
    >
      {status}
    </span>
  );
}

function MessageModal({
  message,
  updating,
  onClose,
  onUpdateStatus,
}: {
  message: ContactMessage;
  updating: boolean;
  onClose: () => void;
  onUpdateStatus: (
    id: string,
    status: MessageStatus
  ) => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">

      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* MODAL HEADER */}

        <div className="flex items-start justify-between border-b border-slate-200 p-6">

          <div>
            <div className="flex items-center gap-3">

              <h2 className="text-xl font-bold text-slate-950">
                Message Details
              </h2>

              <StatusBadge
                status={
                  message.status
                }
              />

            </div>

            <p className="mt-2 text-sm text-slate-500">
              Received{" "}
              {new Date(
                message.createdAt
              ).toLocaleString()}
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* CONTENT */}

        <div className="space-y-6 p-6">

          <div className="grid gap-5 sm:grid-cols-2">

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Name
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {message.name}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Email
              </p>

              <a
                href={`mailto:${message.email}?subject=${encodeURIComponent(
                  `Re: ${message.subject}`
                )}`}
                className="mt-1 block font-semibold text-blue-700 hover:underline"
              >
                {message.email}
              </a>
            </div>

          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Subject
            </p>

            <p className="mt-2 text-lg font-bold text-slate-950">
              {message.subject}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Message
            </p>

            <div className="mt-3 whitespace-pre-wrap rounded-2xl bg-slate-50 p-5 leading-7 text-slate-700">
              {message.message}
            </div>
          </div>

        </div>

        {/* ACTIONS */}

        <div className="flex flex-wrap gap-3 border-t border-slate-200 p-6">

          <a
            href={`mailto:${message.email}?subject=${encodeURIComponent(
              `Re: ${message.subject}`
            )}`}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0b2a63] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#071d45]"
          >
            <Mail className="h-4 w-4" />

            Reply by Email
          </a>

          {message.status !==
            "UNREAD" && (
            <button
              type="button"
              disabled={updating}
              onClick={() =>
                onUpdateStatus(
                  message.id,
                  "UNREAD"
                )
              }
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Mail className="h-4 w-4" />

              Mark Unread
            </button>
          )}

          {message.status !==
            "READ" && (
            <button
              type="button"
              disabled={updating}
              onClick={() =>
                onUpdateStatus(
                  message.id,
                  "READ"
                )
              }
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Check className="h-4 w-4" />

              Mark Read
            </button>
          )}

          {message.status !==
            "ARCHIVED" && (
            <button
              type="button"
              disabled={updating}
              onClick={() =>
                onUpdateStatus(
                  message.id,
                  "ARCHIVED"
                )
              }
              className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 hover:bg-amber-100"
            >
              <Archive className="h-4 w-4" />

              Archive
            </button>
          )}

        </div>

      </div>
    </div>
  );
}