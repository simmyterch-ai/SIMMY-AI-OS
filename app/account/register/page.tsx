"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AccountRegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    country: "",
    city: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateField(field: string, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!termsAccepted) {
      setError(
        "You must read and agree to the Terms & Conditions before creating an account."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/accounts/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          termsAccepted,
          termsVersion: "T&C v1.0",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to create your account.");
        return;
      }

      setSuccess("Account created successfully. Redirecting to login...");

      setTimeout(() => {
        router.push("/account/login");
      }, 1200);
    } catch {
      setError(
        "Something went wrong. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const canCreateAccount = termsAccepted;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">
          {/* Left panel */}
          <section className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-3 text-xl font-bold tracking-tight"
              >
                <Image
                  src="/images/simmy-link-africa-logo.png"
                  alt="SIMMY LINK AFRICA"
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-xl bg-white object-contain"
                />
                SIMMY LINK AFRICA
              </Link>

              <div className="mt-20">
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400">
                  Join the ecosystem
                </p>

                <h1 className="text-4xl font-bold leading-tight">
                  Create your gateway to opportunities, knowledge, business
                  and the world.
                </h1>

                <p className="mt-6 max-w-md text-base leading-7 text-slate-300">
                  Create your free SIMMY LINK AFRICA account and begin
                  discovering opportunities, education, careers, businesses
                  and global marketplace connections.
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400">
              Connecting Africa to Opportunities, Knowledge, Business and the
              World.
            </p>
          </section>

          {/* Registration form */}
          <section className="p-8 sm:p-10 lg:p-12">
            <div className="mx-auto max-w-md">
              <div className="mb-8 lg:hidden">
                <Link
                  href="/"
                  className="inline-flex items-center gap-3 text-lg font-bold text-slate-950"
                >
                  <Image
                    src="/images/simmy-link-africa-logo.png"
                    alt="SIMMY LINK AFRICA"
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-xl bg-white object-contain"
                  />
                  SIMMY LINK AFRICA
                </Link>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                  Account
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                  Create your account
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Join SIMMY LINK AFRICA and connect with opportunities,
                  knowledge, business and the world.
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              {success && (
                <div
                  role="status"
                  className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                >
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      First name
                    </label>

                    <input
                      id="firstName"
                      type="text"
                      autoComplete="given-name"
                      required
                      value={form.firstName}
                      onChange={(event) =>
                        updateField("firstName", event.target.value)
                      }
                      placeholder="First name"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Last name
                    </label>

                    <input
                      id="lastName"
                      type="text"
                      autoComplete="family-name"
                      required
                      value={form.lastName}
                      onChange={(event) =>
                        updateField("lastName", event.target.value)
                      }
                      placeholder="Last name"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      minLength={8}
                      value={form.password}
                      onChange={(event) =>
                        updateField("password", event.target.value)
                      }
                      placeholder="Create a password"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-20 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-700 hover:text-blue-900"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    Minimum 8 characters.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Phone number
                    <span className="ml-1 font-normal text-slate-400">
                      (optional)
                    </span>
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                    placeholder="+234..."
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="country"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Country
                    </label>

                    <input
                      id="country"
                      type="text"
                      autoComplete="country-name"
                      value={form.country}
                      onChange={(event) =>
                        updateField("country", event.target.value)
                      }
                      placeholder="Country"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      City
                    </label>

                    <input
                      id="city"
                      type="text"
                      autoComplete="address-level2"
                      value={form.city}
                      onChange={(event) =>
                        updateField("city", event.target.value)
                      }
                      placeholder="City"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* Electronic signature and terms */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-slate-900">
                      
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      You must accept the Terms & Conditions before creating
                      account.
                    </p>
                  </div>

                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(event) =>
                        setTermsAccepted(event.target.checked)
                      }
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                    />

                    <span className="text-sm leading-6 text-slate-600">
                      I have read and agree to the{" "}
                      <Link
                        href="/terms"
                        target="_blank"
                        className="font-semibold text-blue-700 underline hover:text-blue-900"
                      >
                        Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        target="_blank"
                        className="font-semibold text-blue-700 underline hover:text-blue-900"
                      >
                        Privacy Policy
                      </Link>{" "}
                      of SIMMY LINK AFRICA account.
                    </span>
                  </label>
                </div>

                {/* Create account */}
                <button
                  type="submit"
                  disabled={loading || !canCreateAccount}
                  className="w-full rounded-xl bg-blue-700 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Creating account..." : "Create account"}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                  href="/account/login"
                  className="font-semibold text-blue-700 hover:text-blue-800"
                >
                  Sign in
                </Link>
              </p>

              <div className="mt-6 text-center">
                <Link
                  href="/"
                  className="text-sm font-medium text-slate-500 hover:text-slate-800"
                >
                  ← Back to SIMMY LINK AFRICA
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}