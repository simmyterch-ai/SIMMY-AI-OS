import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OpportunityApplicationForm from "../OpportunityApplicationForm";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatType(type: string) {
  return type
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(date: Date | null) {
  if (!date) return "No deadline stated";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function verificationLabel(status: string) {
  switch (status) {
    case "VERIFIED":
      return "Verified Opportunity";
    case "PARTNER":
      return "Partner Opportunity";
    default:
      return "Public Listing";
  }
}

function verificationDescription(status: string) {
  switch (status) {
    case "VERIFIED":
      return "This opportunity has gone through an additional verification process.";
    case "PARTNER":
      return "This opportunity has been published through a recognized partner relationship.";
    default:
      return "This opportunity is published for discovery from a publicly available source.";
  }
}

async function getOpportunity(slug: string) {
  return prisma.opportunity.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
  });
}

export default async function OpportunityDetailsPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const opportunity = await getOpportunity(slug);

  if (!opportunity) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#071b49] text-lg font-black text-[#d4af37]">
              SL
            </div>

            <div>
              <div className="text-sm font-black tracking-wide text-[#071b49]">
                SIMMY LINK AFRICA
              </div>

              <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
                Opportunities • Knowledge • Business
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-semibold md:flex">
            <Link
              href="/"
              className="text-slate-600 transition hover:text-[#071b49]"
            >
              Home
            </Link>

            <Link
              href="/opportunities"
              className="font-bold text-[#071b49]"
            >
              Opportunities
            </Link>

            <Link
              href="/marketplace"
              className="text-slate-600 transition hover:text-[#071b49]"
            >
              Marketplace
            </Link>

            <Link
              href="/#about"
              className="text-slate-600 transition hover:text-[#071b49]"
            >
              About
            </Link>

            <Link
              href="/login"
              className="rounded-full bg-[#071b49] px-5 py-2.5 text-white transition hover:bg-[#0c2a68]"
            >
              Platform Login
            </Link>
          </nav>

          <Link
            href="/login"
            className="rounded-full bg-[#071b49] px-4 py-2 text-xs font-bold text-white md:hidden"
          >
            Login
          </Link>
        </div>
      </header>

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative overflow-hidden bg-[#071b49]">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#d4af37]/10 blur-3xl" />

        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-200 transition hover:text-white"
          >
            ← Back to Opportunities
          </Link>

          <div className="mt-8 max-w-4xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
                {formatType(opportunity.type)}
              </span>

              {opportunity.featured && (
                <span className="rounded-full bg-[#d4af37] px-4 py-2 text-xs font-bold text-[#071b49]">
                  Featured
                </span>
              )}
            </div>

            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
              {opportunity.title}
            </h1>

            <p className="mt-5 text-lg font-semibold text-blue-100">
              {opportunity.organizationName}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-blue-100">
              <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
                📍{" "}
                {opportunity.location
                  ? `${opportunity.location}, ${opportunity.country}`
                  : opportunity.country}
              </span>

              <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
                🗓 Deadline: {formatDate(opportunity.deadline)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ====================================================== */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* Main content */}
          <div className="space-y-10">
            {/* Description */}
            <section>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b08b19]">
                Opportunity Overview
              </p>

              <h2 className="mt-2 text-2xl font-black text-[#071b49]">
                About this opportunity
              </h2>

              <div className="mt-5 whitespace-pre-line text-base leading-8 text-slate-600">
                {opportunity.description}
              </div>
            </section>

            {/* Eligibility */}
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b08b19]">
                Eligibility
              </p>

              <h2 className="mt-2 text-2xl font-black text-[#071b49]">
                Who can apply?
              </h2>

              <div className="mt-5 whitespace-pre-line text-base leading-8 text-slate-600">
                {opportunity.eligibility}
              </div>
            </section>

            {/* Benefits */}
            {opportunity.benefits && (
              <section>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b08b19]">
                  Benefits
                </p>

                <h2 className="mt-2 text-2xl font-black text-[#071b49]">
                  What this opportunity offers
                </h2>

                <div className="mt-5 whitespace-pre-line text-base leading-8 text-slate-600">
                  {opportunity.benefits}
                </div>
              </section>
            )}

            {/* Source */}
            {(opportunity.sourceName || opportunity.sourceUrl) && (
              <section className="border-t border-slate-200 pt-8">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b08b19]">
                  Source
                </p>

                <h2 className="mt-2 text-xl font-black text-[#071b49]">
                  Opportunity source
                </h2>

                <div className="mt-4 flex flex-wrap items-center gap-4">
                  {opportunity.sourceName && (
                    <span className="text-sm font-semibold text-slate-600">
                      {opportunity.sourceName}
                    </span>
                  )}

                  {opportunity.sourceUrl && (
                    <a
                      href={opportunity.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-[#071b49] underline underline-offset-4 hover:text-[#b08b19]"
                    >
                      Visit source
                    </a>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b08b19]">
                  Application
                </p>

                <h2 className="mt-2 text-2xl font-black text-[#071b49]">
                  Ready to take the next step?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Choose the application option provided for this opportunity.
                </p>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Opportunity Type
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-700">
                    {formatType(opportunity.type)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-700">
                    {opportunity.location
                      ? `${opportunity.location}, ${opportunity.country}`
                      : opportunity.country}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Deadline
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-700">
                    {formatDate(opportunity.deadline)}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {(opportunity.applicationMode === "SIMMY_LINK" ||
                  opportunity.applicationMode === "BOTH") && (
                  <OpportunityApplicationForm
                    opportunityId={opportunity.id}
                    opportunityTitle={opportunity.title}
                  />
                )}

                {(opportunity.applicationMode === "EXTERNAL" ||
                  opportunity.applicationMode === "BOTH") && (
                  <>
                    {opportunity.applicationUrl ? (
                      <a
                        href={opportunity.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center rounded-full border border-[#071b49] bg-white px-6 py-3.5 text-sm font-bold text-[#071b49] transition hover:bg-slate-50"
                      >
                        Apply on Official Website →
                      </a>
                    ) : (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-center text-sm font-semibold text-amber-800">
                        The official external application link is not available yet.
                      </div>
                    )}
                  </>
                )}

                {!["SIMMY_LINK", "EXTERNAL", "BOTH"].includes(
                  opportunity.applicationMode
                ) && (
                  <div className="rounded-xl bg-slate-100 px-5 py-4 text-center text-sm font-semibold text-slate-500">
                    Application information is being updated.
                  </div>
                )}
              </div>

              {opportunity.applicationMode === "SIMMY_LINK" && (
                <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                  Apply directly through SIMMY LINK AFRICA using the form above.
                </p>
              )}

              {opportunity.applicationMode === "EXTERNAL" && (
                <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                  You will continue to the official organization website to complete your application.
                </p>
              )}

              {opportunity.applicationMode === "BOTH" && (
                <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                  You can apply through SIMMY LINK AFRICA or continue to the official organization website.
                </p>
              )}

              {/* Verification */}
              <div className="mt-6 border-t border-slate-200 pt-6">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-3 w-3 rounded-full ${
                      opportunity.verificationStatus === "VERIFIED"
                        ? "bg-emerald-500"
                        : opportunity.verificationStatus === "PARTNER"
                          ? "bg-[#d4af37]"
                          : "bg-slate-400"
                    }`}
                  />

                  <span className="text-sm font-bold text-[#071b49]">
                    {verificationLabel(
                      opportunity.verificationStatus
                    )}
                  </span>
                </div>

                <p className="mt-2 text-xs leading-6 text-slate-500">
                  {verificationDescription(
                    opportunity.verificationStatus
                  )}
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
                Important
              </p>

              <p className="mt-2 text-xs leading-6 text-amber-800">
                Always review the original application requirements and
                source information before submitting personal information,
                documents or payments.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* =====================================================
          FUTURE INTELLIGENCE
      ====================================================== */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div className="rounded-3xl bg-[#071b49] p-8 sm:p-10 lg:p-12">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d4af37]">
                SIMMY AI OS • Future Capability
              </p>

              <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                Find opportunities that fit you.
              </h2>

              <p className="mt-4 leading-8 text-blue-100">
                As the SIMMY LINK AFRICA intelligence layer develops, users
                will be able to receive more relevant opportunity
                recommendations based on their skills, education, interests,
                location and goals.
              </p>

              <p className="mt-4 text-sm leading-7 text-blue-200">
                This capability is part of the future roadmap. The current
                V1 focuses on building structured and reliable opportunity
                data first.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer className="bg-[#071b49] text-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-black text-[#071b49]">
                  SL
                </div>

                <div className="font-black">
                  SIMMY LINK AFRICA
                </div>
              </div>

              <p className="mt-4 max-w-sm text-sm leading-7 text-blue-200">
                Connecting Africa to Opportunities, Knowledge, Business and
                the World.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-white">Explore</h3>

              <div className="mt-4 space-y-3 text-sm text-blue-200">
                <Link
                  href="/opportunities"
                  className="block transition hover:text-white"
                >
                  Opportunities
                </Link>

                <Link
                  href="/marketplace"
                  className="block transition hover:text-white"
                >
                  Marketplace
                </Link>

                <Link
                  href="/"
                  className="block transition hover:text-white"
                >
                  SIMMY LINK AFRICA
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-white">Connect</h3>

              <div className="mt-4 space-y-3 text-sm text-blue-200">
                <p>hello@simmylinkafrica.com</p>
                <p>Official social channels coming soon.</p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-blue-300 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} SIMMY LINK AFRICA. All rights
              reserved.
            </p>

            <p>
              Powered by SIMMY-LINK CONCEPT LTD.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}