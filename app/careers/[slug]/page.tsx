import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type CareerPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatDeadline(deadline: Date | null) {
  if (!deadline) return "No deadline specified";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(deadline);
}

function formatLabel(value: string | null) {
  if (!value) return "";

  return value
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function CareerDetailsPage({
  params,
}: CareerPageProps) {
  const { slug } = await params;

  const career = await prisma.career.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
  });

  if (!career) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-950 text-lg font-black text-yellow-400">
              S
            </div>

            <div>
              <div className="text-sm font-black tracking-wide text-blue-950">
                SIMMY LINK
              </div>
              <div className="text-[10px] font-semibold tracking-[0.2em] text-slate-500">
                AFRICA
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-semibold md:flex">
            <Link href="/" className="text-slate-600 hover:text-blue-950">
              Home
            </Link>

            <Link
              href="/#ecosystem"
              className="text-slate-600 hover:text-blue-950"
            >
              Our Ecosystem
            </Link>

            <Link
              href="/marketplace"
              className="text-slate-600 hover:text-blue-950"
            >
              Marketplace
            </Link>

            <Link
              href="/education"
              className="text-slate-600 hover:text-blue-950"
            >
              Education
            </Link>

            <Link
              href="/opportunities"
              className="text-slate-600 hover:text-blue-950"
            >
              Opportunities
            </Link>
          </nav>

          <Link
            href="/careers"
            className="rounded-full bg-blue-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-900"
          >
            All Careers
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-blue-950">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
          <Link
            href="/careers"
            className="text-sm font-semibold text-blue-200 hover:text-yellow-400"
          >
            ← Back to Careers
          </Link>

          <div className="mt-8 max-w-4xl">
            <div className="flex flex-wrap gap-2">
              {career.featured && (
                <span className="rounded-full bg-yellow-400 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-blue-950">
                  Featured
                </span>
              )}

              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white">
                {formatLabel(career.verificationStatus)}
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              {career.title}
            </h1>

            <p className="mt-5 text-xl font-bold text-yellow-400">
              {career.companyName}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-blue-100">
              <span className="rounded-full bg-white/10 px-4 py-2">
                🌍 {career.country}
              </span>

              {career.location && (
                <span className="rounded-full bg-white/10 px-4 py-2">
                  📍 {career.location}
                </span>
              )}

              <span className="rounded-full bg-white/10 px-4 py-2">
                💼 {formatLabel(career.employmentType)}
              </span>

              {career.workMode && (
                <span className="rounded-full bg-white/10 px-4 py-2">
                  🏢 {formatLabel(career.workMode)}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* Main column */}
          <div className="space-y-10">
            {/* Overview */}
            <section>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-600">
                Career Opportunity
              </p>

              <h2 className="mt-2 text-3xl font-black text-blue-950">
                About this opportunity
              </h2>

              <div className="mt-5 whitespace-pre-line text-base leading-8 text-slate-600">
                {career.description}
              </div>
            </section>

            {/* Requirements */}
            <section className="border-t border-slate-200 pt-10">
              <h2 className="text-2xl font-black text-blue-950">
                Requirements
              </h2>

              <div className="mt-5 whitespace-pre-line text-base leading-8 text-slate-600">
                {career.requirements}
              </div>
            </section>

            {/* Responsibilities */}
            {career.responsibilities && (
              <section className="border-t border-slate-200 pt-10">
                <h2 className="text-2xl font-black text-blue-950">
                  Responsibilities
                </h2>

                <div className="mt-5 whitespace-pre-line text-base leading-8 text-slate-600">
                  {career.responsibilities}
                </div>
              </section>
            )}

            {/* Benefits */}
            {career.benefits && (
              <section className="border-t border-slate-200 pt-10">
                <h2 className="text-2xl font-black text-blue-950">
                  Benefits
                </h2>

                <div className="mt-5 whitespace-pre-line text-base leading-8 text-slate-600">
                  {career.benefits}
                </div>
              </section>
            )}

            {/* Source */}
            {(career.sourceName || career.sourceUrl) && (
              <section className="border-t border-slate-200 pt-10">
                <h2 className="text-xl font-black text-blue-950">
                  Opportunity Source
                </h2>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  {career.sourceName && (
                    <p className="text-sm font-bold text-slate-700">
                      {career.sourceName}
                    </p>
                  )}

                  {career.sourceUrl && (
                    <a
                      href={career.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm font-semibold text-blue-700 hover:text-blue-950"
                    >
                      Visit original source →
                    </a>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside>
            <div className="sticky top-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-600">
                Application
              </p>

              <h2 className="mt-2 text-2xl font-black text-blue-950">
                Ready to apply?
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Review the opportunity details carefully before submitting
                your application.
              </p>

              <div className="mt-6 space-y-4 border-y border-slate-100 py-5">
                <InfoRow
                  label="Company"
                  value={career.companyName}
                />

                <InfoRow
                  label="Country"
                  value={career.country}
                />

                {career.location && (
                  <InfoRow
                    label="Location"
                    value={career.location}
                  />
                )}

                <InfoRow
                  label="Employment"
                  value={formatLabel(career.employmentType)}
                />

                {career.workMode && (
                  <InfoRow
                    label="Work Mode"
                    value={formatLabel(career.workMode)}
                  />
                )}

                {career.industry && (
                  <InfoRow
                    label="Industry"
                    value={career.industry}
                  />
                )}

                <InfoRow
                  label="Deadline"
                  value={formatDeadline(career.deadline)}
                />

                {career.salary && (
                  <InfoRow
                    label="Salary"
                    value={career.salary}
                  />
                )}
              </div>

              {career.applicationUrl ? (
                <a
                  href={career.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-full bg-yellow-400 px-5 py-3.5 text-center text-sm font-black text-blue-950 transition hover:bg-yellow-300"
                >
                  Apply Now →
                </a>
              ) : (
                <div className="rounded-2xl bg-slate-100 px-5 py-4 text-center text-sm font-semibold text-slate-500">
                  Application link not currently available.
                </div>
              )}

              <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                SIMMY LINK AFRICA provides opportunity information. Always
                verify application details with the original source.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-14 text-center lg:px-8">
          <h2 className="text-3xl font-black text-blue-950">
            Keep exploring opportunities.
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            Your career journey can include employment, education, training
            and other opportunities.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/careers"
              className="rounded-full bg-blue-950 px-6 py-3 text-sm font-black text-white"
            >
              More Careers
            </Link>

            <Link
              href="/education"
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-blue-950"
            >
              Education & Training
            </Link>

            <Link
              href="/opportunities"
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-blue-950"
            >
              Opportunities
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <p className="font-black text-blue-950">
              SIMMY LINK AFRICA
            </p>

            <p className="mt-1">
              Connecting Africa to Opportunities, Knowledge, Business and the
              World.
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p>Careers & Employment</p>

            <p className="mt-1 text-xs">
              Powered by SIMMY-LINK CONCEPT LTD.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-700">
        {value}
      </p>
    </div>
  );
}