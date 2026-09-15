import Image from "next/image";
import Link from "next/link";

type Career = {
  id: number;
  title: string;
  slug: string;
  companyName: string;
  country: string;
  location: string | null;
  employmentType: string;
  workMode: string | null;
  industry: string | null;
  description: string;
  requirements: string;
  benefits: string | null;
  salary: string | null;
  applicationUrl: string | null;
  deadline: string | null;
  verificationStatus: string;
  featured: boolean;
};

type CareersResponse = {
  careers: Career[];
  total: number;
};

async function getCareers(): Promise<CareersResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/careers`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return { careers: [], total: 0 };
    }

    return response.json();
  } catch {
    return { careers: [], total: 0 };
  }
}

function formatDeadline(deadline: string | null) {
  if (!deadline) return "No deadline specified";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(deadline));
}

function formatLabel(value: string | null) {
  if (!value) return "";

  return value
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function CareersPage() {
  const { careers, total } = await getCareers();

  const featuredCareers = careers.filter((career) => career.featured);
  const regularCareers = careers.filter((career) => !career.featured);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/simmy-link-africa-logo.png"
              alt="SIMMY LINK AFRICA"
              width={40}
              height={40}
              className="h-10 w-10 rounded-xl bg-white object-contain"
            />

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
            <Link href="/marketplace" className="text-slate-600 hover:text-blue-950">
              Marketplace
            </Link>
            <Link href="/education" className="text-slate-600 hover:text-blue-950">
              Education
            </Link>
            <Link href="/opportunities" className="text-slate-600 hover:text-blue-950">
              Opportunities
            </Link>
          </nav>

          <Link
            href="/account/register"
            className="rounded-full bg-blue-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-900"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-blue-950">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-yellow-400/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <div className="mb-5 inline-flex rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-yellow-300">
              Careers & Employment
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find Opportunities.
              <span className="block text-yellow-400">
                Build Your Future.
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-100 sm:text-xl">
              Discover career opportunities from organizations and employers
              looking for talented people across Africa and the global
              marketplace.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#jobs"
                className="rounded-full bg-yellow-400 px-6 py-3.5 text-sm font-black text-blue-950 transition hover:bg-yellow-300"
              >
                Explore Careers
              </a>

              <Link
                href="/opportunities"
                className="rounded-full border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/15"
              >
                View Opportunities
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-7 sm:grid-cols-3 lg:px-8">
          <div>
            <p className="text-sm font-black text-blue-950">
              {total}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Published career opportunities
            </p>
          </div>

          <div>
            <p className="text-sm font-black text-blue-950">
              Verified & Listed
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Source and verification information where available
            </p>
          </div>

          <div>
            <p className="text-sm font-black text-blue-950">
              Africa + Global
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Opportunities can come from multiple countries and markets
            </p>
          </div>
        </div>
      </section>

      {/* Search / filter presentation */}
      <section id="jobs" className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm lg:p-8">
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto]">
            <div>
              <label
                htmlFor="career-search"
                className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Search
              </label>

              <input
                id="career-search"
                type="text"
                placeholder="Job title, company or keyword"
                disabled
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Country
              </label>

              <select
                disabled
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 outline-none"
                defaultValue=""
              >
                <option value="">All countries</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Employment
              </label>

              <select
                disabled
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 outline-none"
                defaultValue=""
              >
                <option value="">All types</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Work Mode
              </label>

              <select
                disabled
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 outline-none"
                defaultValue=""
              >
                <option value="">All modes</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                disabled
                className="w-full rounded-xl bg-slate-300 px-5 py-3 text-sm font-bold text-slate-500 lg:w-auto"
              >
                Search
              </button>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Advanced career search and filtering will be activated as the
            Careers module expands.
          </p>
        </div>
      </section>

      {/* Featured careers */}
      {featuredCareers.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-14 lg:px-8">
          <div className="mb-7">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-600">
              Featured
            </p>
            <h2 className="mt-2 text-3xl font-black text-blue-950">
              Featured Career Opportunities
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {featuredCareers.map((career) => (
              <CareerCard key={career.id} career={career} featured />
            ))}
          </div>
        </section>
      )}

      {/* All careers */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-600">
                Career Opportunities
              </p>

              <h2 className="mt-2 text-3xl font-black text-blue-950">
                Explore Available Careers
              </h2>
            </div>

            <div className="text-sm font-semibold text-slate-500">
              {total} {total === 1 ? "opportunity" : "opportunities"}
            </div>
          </div>

          {regularCareers.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {regularCareers.map((career) => (
                <CareerCard key={career.id} career={career} />
              ))}
            </div>
          ) : careers.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                💼
              </div>

              <h3 className="mt-5 text-xl font-black text-blue-950">
                Career opportunities are coming soon
              </h3>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
                We are building a trusted career marketplace where people can
                discover relevant employment opportunities from organizations
                and employers.
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link
                  href="/opportunities"
                  className="rounded-full bg-blue-950 px-5 py-3 text-sm font-bold text-white"
                >
                  Explore Opportunities
                </Link>

                <Link
                  href="/education"
                  className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-blue-950"
                >
                  Explore Education
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center">
              <h3 className="text-xl font-black text-blue-950">
                No additional career opportunities
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Featured opportunities are currently displayed above.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Transparency */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="text-2xl">✓</div>
            <h3 className="mt-4 text-lg font-black text-blue-950">
              Transparency
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Career listings can include source and verification information
              to help users understand where an opportunity comes from.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="text-2xl">🌍</div>
            <h3 className="mt-4 text-lg font-black text-blue-950">
              Global Access
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Discover employment opportunities across different countries,
              industries and working arrangements.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="text-2xl">✦</div>
            <h3 className="mt-4 text-lg font-black text-blue-950">
              Atlas Intelligence
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Future Atlas capabilities can help users discover, organize and
              understand opportunities more intelligently.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-950">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-400">
            SIMMY LINK AFRICA
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black text-white sm:text-4xl">
            Your next opportunity could change your future.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-blue-100">
            Explore careers, education, business opportunities and other
            pathways designed to help you move forward.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/opportunities"
              className="rounded-full bg-yellow-400 px-6 py-3.5 text-sm font-black text-blue-950"
            >
              Explore Opportunities
            </Link>

            <Link
              href="/education"
              className="rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white"
            >
              Education & Training
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <p className="font-black text-blue-950">SIMMY LINK AFRICA</p>
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

function CareerCard({
  career,
  featured = false,
}: {
  career: Career;
  featured?: boolean;
}) {
  return (
    <article
      className={`group rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
        featured
          ? "border-yellow-300 ring-1 ring-yellow-100"
          : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          {featured && (
            <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-yellow-800">
              Featured
            </span>
          )}

          <h3 className="mt-3 text-xl font-black leading-tight text-blue-950">
            {career.title}
          </h3>

          <p className="mt-2 text-sm font-bold text-slate-600">
            {career.companyName}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg">
          💼
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {career.country && (
          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
            {career.country}
          </span>
        )}

        {career.location && (
          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
            {career.location}
          </span>
        )}

        {career.employmentType && (
          <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800">
            {formatLabel(career.employmentType)}
          </span>
        )}

        {career.workMode && (
          <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-800">
            {formatLabel(career.workMode)}
          </span>
        )}
      </div>

      {career.industry && (
        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
          {career.industry}
        </p>
      )}

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
        {career.description}
      </p>

      <div className="mt-5 border-t border-slate-100 pt-5">
        <div className="flex items-center justify-between gap-4 text-xs">
          <div>
            <p className="font-semibold text-slate-400">Deadline</p>
            <p className="mt-1 font-bold text-slate-700">
              {formatDeadline(career.deadline)}
            </p>
          </div>

          {career.salary && (
            <div className="text-right">
              <p className="font-semibold text-slate-400">Salary</p>
              <p className="mt-1 font-bold text-slate-700">
                {career.salary}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-slate-400">
          {formatLabel(career.verificationStatus)}
        </span>

        <Link
          href={`/careers/${career.slug}`}
          className="rounded-full bg-blue-950 px-5 py-2.5 text-xs font-black text-white transition group-hover:bg-blue-900"
        >
          View Career
        </Link>
      </div>
    </article>
  );
}