"use client";

import Image from "next/image";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8 flex items-center justify-center">
      <div
        className="
          w-full
          max-w-lg
          rounded-[30px]
          border-[3px]
          border-blue-600
          bg-blue
          px-8
          py-8
          shadow-[0_20px_50px_rgba(15,23,42,0.10)]
          sm:px-10
          sm:py-9
        "
      >
        {/* SAP LOGO */}

        <div className="flex justify-center">
          <Image
            src="/images/sap-logo.png"
            alt="SIMMY AI PLATFORM"
            width={90}
            height={90}
            priority
            className="h-[90px] w-[90px] object-contain"
          />
        </div>

        {/* PLATFORM NAME */}

        <div className="mt-3 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            SIMMY AI PLATFORM
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to continue
          </p>
        </div>

        {/* LOGIN FORM */}

        <div className="mt-7">
          <LoginForm />
        </div>

        {/* LEGAL COMPANY */}

        <p className="mt-6 text-center text-sm text-slate-500">
          Powered by Simmy-Link Concept LTD
        </p>
      </div>
    </main>
  );
}