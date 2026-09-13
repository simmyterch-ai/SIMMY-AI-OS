"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function AccountLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/accounts/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to sign in. Please try again.");
        return;
      }

      router.push("/account");
      router.refresh();
    } catch {
      setError(
        "Something went wrong. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

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
                <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white">
                  <Image
                    src="/images/simmy-link-africa-logo.png"
                    alt="SIMMY LINK AFRICA Logo"
                    width={48}
                    height={48}
                    className="h-full w-full object-contain"
                    priority
                  />
                </span>

                <span>SIMMY LINK AFRICA</span>
              </Link>

              <div className="mt-20">
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400">
                  Welcome back
                </p>

                <h1 className="text-4xl font-bold leading-tight">
                  Your gateway to opportunities, knowledge, business and the
                  world.
                </h1>

                <p className="mt-6 max-w-md text-base leading-7 text-slate-300">
                  Sign in to your SIMMY LINK AFRICA account and continue
                  exploring opportunities, education, careers, businesses and
                  global connections.
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400">
              Connecting Africa to Opportunities, Knowledge, Business and the
              World.
            </p>
          </section>

          {/* Login form */}
          <section className="p-8 sm:p-10 lg:p-12">
            <div className="mx-auto max-w-md">
              <div className="mb-8 lg:hidden">
                <Link
                  href="/"
                  className="inline-flex items-center gap-3 text-lg font-bold text-slate-950"
                >
                  <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
                    <Image
                      src="/images/simmy-link-africa-logo.png"
                      alt="SIMMY LINK AFRICA Logo"
                      width={44}
                      height={44}
                      className="h-full w-full object-contain"
                      priority
                    />
                  </span>

                  <span>SIMMY LINK AFRICA</span>
                </Link>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                  Account
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                  Sign in
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Access your SIMMY LINK AFRICA account.
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

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Password
                    </label>

                    <span className="text-xs text-slate-400">
                      Minimum 8 characters
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      title={showPassword ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-slate-500 transition hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-blue-700 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </form>

              <div className="my-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs text-slate-400">OR</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <p className="text-center text-sm text-slate-600">
                Don't have an account?{" "}
                <Link
                  href="/account/register"
                  className="font-semibold text-blue-700 hover:text-blue-800"
                >
                  Create an account
                </Link>
              </p>

              <div className="mt-8 text-center">
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
