"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react";

import {
  useAuth,
} from "@/contexts/AuthContext";

export default function LoginForm() {
  const router = useRouter();

  const {
    refreshUser,
  } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response =
        await fetch(
          "/api/auth/login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Login failed."
        );
      }

      // Update global authentication
      // state after successful login.
      await refreshUser();

      // Enter protected application.
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">
        
        </h1>

        <p className="mt-2 text-slate-500">
          
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Email Address
          </label>

          <div className="flex items-center rounded-xl border border-slate-300 px-4">
            <Mail className="h-5 w-5 text-slate-400" />

            <input
              type="email"
              required
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full border-none bg-transparent px-3 py-4 outline-none"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Password
          </label>

          <div className="flex items-center rounded-xl border border-slate-300 px-4">
            <Lock className="h-5 w-5 text-slate-400" />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              required
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full border-none bg-transparent px-3 py-4 outline-none"
              placeholder="Enter your password"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="ml-2"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-slate-400" />
              ) : (
                <Eye className="h-5 w-5 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-700 py-4 font-semibold text-white transition hover:bg-blue-800 disabled:opacity-50"
        >
          {loading
            ? "Signing In..."
            : "Sign In"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
      
      </p>
    </div>
  );
}