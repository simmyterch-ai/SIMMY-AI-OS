import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

type Opportunity = {
  id: number;
  title: string;
  slug: string;
  type: string;
  organizationName: string;
  country: string;
  location: string | null;
  description: string;
  eligibility: string;
  benefits: string | null;
  deadline: string | null;
  applicationUrl: string | null;
  sourceName: string | null;
  sourceUrl: string | null;
  verificationStatus: string;
  status: string;
  featured: boolean;
};

const opportunityTypes = [
  "JOB",
  "SCHOLARSHIP",
  "GRANT",
  "FELLOWSHIP",
  "INTERNSHIP",
  "TRAINING",
  "BUSINESS",
  "INTERNATIONAL",
];

function formatType(type: string) {
  return type
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(date: string | null) {
  if (!date) return "No deadline stated";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function verificationLabel(status: string) {
  switch (status) {
    case "VERIFIED":
      return "Verified";
    case "PARTNER":
      return "Partner";
    default:
      return "Public Listing";
  }
}

async function getOpportunities(): Promise<Opportunity[]> {
  try {
    const opportunities = await prisma.opportunity.findMany({
      where: {
        status: "PUBLISHED",
      },
      orderBy: [
        {
          featured: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    return opportunities.map((opportunity) => ({
      ...opportunity,
      deadline: opportunity.deadline
        ? opportunity.deadline.toISOString()
        : null,
    }));
  } catch (error) {
    console.error("Failed to load opportunities:", error);
    return [];
  }
}

export default async function OpportunitiesPage() {
  const opportunities = await getOpportunities();

  const featured = opportunities.filter(
    (opportunity) => opportunity.featured
  );

  const regular = opportunities.filter(
    (opportunity) => !opportunity.featured
  );

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/simmy-link-africa-logo.png"
              alt="SIMMY LINK AFRICA"
              width={40}
              height={40}
              className="h-10 w-10 rounded-xl bg-white object-contain"
            />

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
              href="/account/register"
              className="rounded-full bg-[#071b49] px-5 py-2.5 text-white transition hover:bg-[#0c2a68]"
            >
              Get Started
            </Link>
          </nav>

          <Link
            href="/account/register"
            className="rounded-full bg-[#071b49] px-4 py-2 text-xs font-bold text-white md:hidden"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative overflow-hidden bg-[#071b49]">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#d4af37]/10 blur-3xl" />

        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <div className="mb-5 inline-flex items-center rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#f0d477]">
              SIMMY LINK AFRICA • OPPORTUNITIES
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Discover opportunities that can move your{" "}
              <span className="text-[#d4af37]">future forward.</span>
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-100">
              Explore jobs, scholarships, grants, fellowships, internships,
              training programmes, business opportunities and international
              opportunities from one growing African platform.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              {opportunityTypes.map((type) => (
                <span
                  key={type}
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white"
                >
                  {formatType(type)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRO
      ====================================================== */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#b08b19]">
              Opportunity Access
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#071b49]">
              One place to discover what comes next.
            </h2>

            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
              SIMMY LINK AFRICA is building a structured opportunity
              discovery platform for Africans and people seeking legitimate
              opportunities across Africa and the wider world.
            </p>

            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
              Our goal is simple: make useful opportunities easier to
              discover, understand and pursue while gradually improving the
              quality and verification of information available on the
              platform.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-[#071b49]">
              Understanding opportunity status
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                  <span className="font-bold text-slate-800">
                    Public Listing
                  </span>
                </div>

                <p className="mt-1 pl-5 text-sm leading-6 text-slate-500">
                  Published for discovery from a publicly available source.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="font-bold text-slate-800">
                    Verified
                  </span>
                </div>

                <p className="mt-1 pl-5 text-sm leading-6 text-slate-500">
                  Information has gone through an additional verification
                  process.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#d4af37]" />
                  <span className="font-bold text-slate-800">
                    Partner
                  </span>
                </div>

                <p className="mt-1 pl-5 text-sm leading-6 text-slate-500">
                  Published through a recognized partner relationship.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURED
      ====================================================== */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#b08b19]">
              Featured
            </p>

            <h2 className="mt-2 text-3xl font-black text-[#071b49]">
              Opportunities worth exploring
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {featured.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                featured
              />
            ))}
          </div>
        </section>
      )}

      {/* =====================================================
          ALL OPPORTUNITIES
      ====================================================== */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#b08b19]">
              Explore
            </p>

            <h2 className="mt-2 text-3xl font-black text-[#071b49]">
              Latest opportunities
            </h2>

            <p className="mt-3 max-w-2xl text-slate-600">
              Browse currently published opportunities available through
              SIMMY LINK AFRICA.
            </p>
          </div>

          {opportunities.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#071b49] text-2xl text-[#d4af37]">
                ✦
              </div>

              <h3 className="mt-6 text-2xl font-black text-[#071b49]">
                Opportunities are coming soon.
              </h3>

              <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
                We are building the opportunity database and verification
                workflow. Once opportunities are published, they will appear
                here automatically.
              </p>

              <Link
                href="/"
                className="mt-7 inline-flex rounded-full bg-[#071b49] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0c2a68]"
              >
                Return to SIMMY LINK AFRICA
              </Link>
            </div>
          ) : (
            <>
              {regular.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {regular.map((opportunity) => (
                    <OpportunityCard
                      key={opportunity.id}
                      opportunity={opportunity}
                    />
                  ))}
                </div>
              )}

              {featured.length > 0 && regular.length === 0 && (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {featured.map((opportunity) => (
                    <OpportunityCard
                      key={opportunity.id}
                      opportunity={opportunity}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* =====================================================
          AI FUTURE
      ====================================================== */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-[#071b49]">
          <div className="grid lg:grid-cols-[1fr_0.8fr]">
            <div className="p-8 sm:p-10 lg:p-14">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#d4af37]">
                Intelligence Layer
              </p>

              <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                Smarter opportunity discovery is coming.
              </h2>

              <p className="mt-5 max-w-2xl leading-8 text-blue-100">
                As SIMMY AI OS evolves, opportunity data can become more
                intelligent — helping users discover opportunities based on
                their interests, skills, education, location and goals.
              </p>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-200">
                This is part of the future intelligence layer. The current
                V1 focuses first on building a reliable, structured
                opportunity foundation.
              </p>
            </div>

            <div className="flex items-center justify-center border-t border-white/10 bg-white/5 p-8 lg:border-l lg:border-t-0">
              <div className="w-full max-w-sm space-y-3">
                {[
                  "Structured opportunity data",
                  "Verification signals",
                  "User interests & goals",
                  "Future intelligent matching",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d4af37] text-xs font-black text-[#071b49]">
                      {index + 1}
                    </span>

                    <span className="text-sm font-semibold text-white">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#b08b19]">
            Be Part of the Ecosystem
          </p>

          <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-black tracking-tight text-[#071b49] sm:text-4xl">
            Your next opportunity could start here.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Create an account to become part of the SIMMY LINK AFRICA
            ecosystem as the platform continues to expand.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/account/register"
              className="rounded-full bg-[#071b49] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#0c2a68]"
            >
              Get Started
            </Link>

            <Link
              href="/marketplace"
              className="rounded-full border border-[#071b49] px-7 py-3.5 text-sm font-bold text-[#071b49] transition hover:bg-slate-50"
            >
              Explore Marketplace
            </Link>
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
                <Image
                  src="/images/simmy-link-africa-logo.png"
                  alt="SIMMY LINK AFRICA"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-xl bg-white object-contain"
                />

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

function OpportunityCard({
  opportunity,
  featured = false,
}: {
  opportunity: Opportunity;
  featured?: boolean;
}) {
  const verification = verificationLabel(
    opportunity.verificationStatus
  );

  return (
    <article
      className={`flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
        featured
          ? "border-[#d4af37]/50 ring-1 ring-[#d4af37]/20"
          : "border-slate-200"
      }`}
    >
      {/* Card header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#071b49]">
          {formatType(opportunity.type)}
        </span>

        {opportunity.featured && (
          <span className="rounded-full bg-[#fff8df] px-3 py-1.5 text-[11px] font-bold text-[#8a6a0a]">
            Featured
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="mt-5 text-xl font-black leading-snug text-[#071b49]">
        {opportunity.title}
      </h3>

      <p className="mt-2 text-sm font-semibold text-slate-600">
        {opportunity.organizationName}
      </p>

      {/* Location + deadline */}
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
        <span className="rounded-lg bg-slate-100 px-3 py-2">
          {opportunity.location
            ? `${opportunity.location}, ${opportunity.country}`
            : opportunity.country}
        </span>

        <span className="rounded-lg bg-slate-100 px-3 py-2">
          Deadline: {formatDate(opportunity.deadline)}
        </span>
      </div>

      {/* Description */}
      <p className="mt-5 line-clamp-4 text-sm leading-7 text-slate-600">
        {opportunity.description}
      </p>

      {/* Eligibility */}
      <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
          Eligibility
        </p>

        <p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-600">
          {opportunity.eligibility}
        </p>
      </div>

      {/* Actions */}
      <div className="mt-auto pt-6">
        <div className="flex items-center justify-between gap-3">
          <span
            className={`text-xs font-bold ${
              opportunity.verificationStatus === "VERIFIED"
                ? "text-emerald-600"
                : opportunity.verificationStatus === "PARTNER"
                  ? "text-[#9a780c]"
                  : "text-slate-500"
            }`}
          >
            ✓ {verification}
          </span>

          <Link
            href={`/opportunities/${opportunity.slug}`}
            className="rounded-full bg-[#071b49] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#0c2a68]"
          >
            View Opportunity →
          </Link>
        </div>
      </div>
    </article>
  );
}