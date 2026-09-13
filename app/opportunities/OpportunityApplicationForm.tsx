"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type OpportunityApplicationFormProps = {
  opportunityId: number;
  opportunityTitle: string;
};

export default function OpportunityApplicationForm({
  opportunityId,
  opportunityTitle,
}: OpportunityApplicationFormProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/opportunities/apply", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          opportunityId,
          message: message.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setError(
            "Please log in to your SIMMY LINK AFRICA account before applying."
          );
        } else {
          setError(data.error || "Unable to submit your application.");
        }

        return;
      }

      setSuccess(true);
      setMessage("");
    } catch (error) {
      console.error("Opportunity application submission error:", error);

      setError(
        "Something went wrong while submitting your application. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setError("");
          setSuccess(false);
        }}
        className="mt-8 flex w-full items-center justify-center rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800"
      >
        Apply Through SIMMY LINK AFRICA
      </button>
    );
  }

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
      {success ? (
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl text-emerald-700">
            ✓
          </div>

          <h3 className="mt-4 text-xl font-bold text-slate-950">
            Application Submitted
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Your application for{" "}
            <span className="font-semibold">{opportunityTitle}</span>{" "}
            has been successfully recorded in your SIMMY LINK AFRICA
            account.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            You can view your application activity from your dashboard.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/account"
              className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              View My Dashboard
            </Link>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-900"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="text-xl font-bold text-slate-950">
            Apply for This Opportunity
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Your application will use the personal information saved in
            your SIMMY LINK AFRICA account.
          </p>

          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Opportunity
            </p>

            <p className="mt-1 font-semibold text-slate-900">
              {opportunityTitle}
            </p>
          </div>

          <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm font-semibold text-blue-900">
              Your account information
            </p>

            <p className="mt-2 text-sm leading-6 text-blue-800">
              Your name, email, phone, country and city will be taken
              directly from your account when the application is submitted.
            </p>

            <Link
              href="/account"
              className="mt-3 inline-flex text-sm font-bold text-blue-900 underline underline-offset-4"
            >
              Review or update my profile
            </Link>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
              {error}

              {error.includes("log in") && (
                <div className="mt-3">
                  <Link
                    href="/account/login"
                    className="font-bold underline underline-offset-4"
                  >
                    Go to Login
                  </Link>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6">
            <label
              htmlFor="application-message"
              className="block text-sm font-semibold text-slate-900"
            >
              Cover Letter / Application Message
            </label>

            <textarea
              id="application-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={7}
              placeholder="Tell the opportunity provider why you are applying and provide any relevant information."
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />

            <p className="mt-2 text-xs leading-5 text-slate-500">
              This message will be saved with your application.
            </p>

            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm leading-6 text-amber-900">
                By submitting this form, you confirm that you want to
                submit this opportunity application through SIMMY LINK
                AFRICA and that the information in your account is
                accurate.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-5 flex w-full items-center justify-center rounded-xl bg-amber-500 px-5 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Submitting Application..."
                : "Submit Application"}
            </button>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setError("");
                setMessage("");
              }}
              disabled={submitting}
              className="mt-3 flex w-full items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-900 disabled:opacity-60"
            >
              Cancel
            </button>
          </form>
        </>
      )}
    </div>
  );
}