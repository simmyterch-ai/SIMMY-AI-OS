import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

type Provider = {
  id: number;
  name: string;
  slug: string;
  type: string;
  country: string;
  city: string | null;
  description: string;
  websiteUrl: string | null;
  logoUrl: string | null;
  verificationStatus: string;
  status: string;
  featured: boolean;
  _count: {
    programs: number;
    trainingCourses: number;
  };
};

type Program = {
  id: number;
  name: string;
  slug: string;
  level: string;
  fieldOfStudy: string;
  description: string;
  duration: string | null;
  studyMode: string | null;
  tuition: string | null;
  currency: string | null;
  applicationUrl: string | null;
  verificationStatus: string;
  featured: boolean;
  provider: {
    id: number;
    name: string;
    slug: string;
    type: string;
    country: string;
    city: string | null;
    verificationStatus: string;
  };
};

type Course = {
  id: number;
  name: string;
  slug: string;
  category: string;
  description: string;
  duration: string | null;
  deliveryMode: string | null;
  cost: string | null;
  currency: string | null;
  applicationUrl: string | null;
  verificationStatus: string;
  featured: boolean;
  provider: {
    id: number;
    name: string;
    slug: string;
    type: string;
    country: string;
    city: string | null;
    verificationStatus: string;
  };
};

function verificationLabel(status: string) {
  switch (status) {
    case "VERIFIED":
      return "Verified";

    case "PARTNER":
      return "Partner";

    default:
      return "Public Listed";
  }
}

function verificationClass(status: string) {
  switch (status) {
    case "VERIFIED":
      return "bg-emerald-100 text-emerald-700";

    case "PARTNER":
      return "bg-blue-100 text-blue-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

async function getEducationData() {
  const [providers, programs, courses] = await Promise.all([
    prisma.educationProvider.findMany({
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
      take: 6,
      include: {
        _count: {
          select: {
            programs: true,
            trainingCourses: true,
          },
        },
      },
    }),

    prisma.educationProgram.findMany({
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
      take: 6,
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            slug: true,
            type: true,
            country: true,
            city: true,
            verificationStatus: true,
          },
        },
      },
    }),

    prisma.trainingCourse.findMany({
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
      take: 6,
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            slug: true,
            type: true,
            country: true,
            city: true,
            verificationStatus: true,
          },
        },
      },
    }),
  ]);

  return {
    providers,
    programs,
    courses,
  };
}

export default async function EducationPage() {
  const { providers, programs, courses } =
    await getEducationData();

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <Image
              src="/images/simmy-link-africa-logo.png"
              alt="SIMMY LINK AFRICA"
              width={40}
              height={40}
              className="h-10 w-10 rounded-xl bg-white object-contain"
            />

            <div>
              <div className="text-sm font-bold tracking-tight text-blue-950">
                SIMMY LINK AFRICA
              </div>

              <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
                Opportunities • Knowledge • Business
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
            <Link
              href="/"
              className="transition hover:text-blue-800"
            >
              Home
            </Link>

            <Link
              href="/opportunities"
              className="transition hover:text-blue-800"
            >
              Opportunities
            </Link>

            <Link
              href="/education"
              className="font-semibold text-blue-800"
            >
              Education
            </Link>

            <Link
              href="/marketplace"
              className="transition hover:text-blue-800"
            >
              Marketplace
            </Link>
          </nav>

          <Link
            href="/account/register"
            className="rounded-xl bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-blue-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(234,179,8,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.28),transparent_40%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <div className="mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
              Education & Training
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
              Discover Knowledge.
              <br />
              Build Your Future.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-100 md:text-xl">
              Explore education providers, academic programs,
              professional courses and practical training
              opportunities from across Africa and the world.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#programs"
                className="rounded-xl bg-amber-400 px-6 py-3.5 text-center text-sm font-bold text-blue-950 transition hover:bg-amber-300"
              >
                Explore Programs
              </a>

              <a
                href="#training"
                className="rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Find Training
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
                Learn & Grow
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                Education should open doors, not create confusion.
              </h2>

              <p className="mt-4 max-w-3xl leading-7 text-slate-600">
                SIMMY LINK AFRICA brings education and training
                opportunities into one accessible ecosystem,
                helping people discover programs, institutions
                and skills pathways that can support their
                personal and professional growth.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-3xl font-bold text-blue-900">
                  {providers.length}
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  Featured providers
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-3xl font-bold text-blue-900">
                  {programs.length}
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  Featured programs
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-3xl font-bold text-blue-900">
                  {courses.length}
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  Featured courses
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-3xl font-bold text-blue-900">
                  Global
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  Learning ecosystem
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Providers */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
              Institutions
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Education Providers
            </h2>

            <p className="mt-3 max-w-2xl text-slate-600">
              Discover universities, colleges, institutes and
              other organizations offering learning pathways.
            </p>
          </div>

          <span className="text-sm font-medium text-slate-400">
            More providers coming soon
          </span>
        </div>

        {providers.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <h3 className="font-semibold text-slate-900">
              Education providers are coming soon.
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              We are building a trusted directory of education
              providers and institutions.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider: Provider) => (
              <article
                key={provider.id}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-800">
                    {provider.name
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${verificationClass(
                      provider.verificationStatus
                    )}`}
                  >
                    {verificationLabel(
                      provider.verificationStatus
                    )}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-950">
                  {provider.name}
                </h3>

                <p className="mt-1 text-sm font-medium text-blue-700">
                  {provider.type}
                </p>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                  {provider.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                  <span>
                    {provider.city
                      ? `${provider.city}, ${provider.country}`
                      : provider.country}
                  </span>

                  <span>
                    {provider._count.programs} programs
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Programs */}
      <section
        id="programs"
        className="border-y border-slate-200 bg-slate-50"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
              Academic Pathways
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Featured Programs
            </h2>

            <p className="mt-3 max-w-2xl text-slate-600">
              Explore academic programs and discover where
              they are offered.
            </p>
          </div>

          {programs.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <h3 className="font-semibold text-slate-900">
                Academic programs are coming soon.
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Published programs will appear here as the
                education directory grows.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {programs.map((program: Program) => (
                <article
                  key={program.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {program.level}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${verificationClass(
                        program.verificationStatus
                      )}`}
                    >
                      {verificationLabel(
                        program.verificationStatus
                      )}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-950">
                    {program.name}
                  </h3>

                  <p className="mt-2 text-sm font-semibold text-blue-700">
                    {program.fieldOfStudy}
                  </p>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                    {program.description}
                  </p>

                  <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                    <p>
                      <span className="font-semibold text-slate-700">
                        Provider:
                      </span>{" "}
                      {program.provider.name}
                    </p>

                    <p>
                      <span className="font-semibold text-slate-700">
                        Location:
                      </span>{" "}
                      {program.provider.city
                        ? `${program.provider.city}, ${program.provider.country}`
                        : program.provider.country}
                    </p>

                    {program.studyMode && (
                      <p>
                        <span className="font-semibold text-slate-700">
                          Study mode:
                        </span>{" "}
                        {program.studyMode}
                      </p>
                    )}

                    {program.duration && (
                      <p>
                        <span className="font-semibold text-slate-700">
                          Duration:
                        </span>{" "}
                        {program.duration}
                      </p>
                    )}
                  </div>

                  {program.applicationUrl && (
                    <a
                      href={program.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-blue-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
                    >
                      Visit Application Site →
                    </a>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Training */}
      <section
        id="training"
        className="mx-auto max-w-7xl px-6 py-16 lg:px-8"
      >
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
            Skills & Professional Development
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Training & Courses
          </h2>

          <p className="mt-3 max-w-2xl text-slate-600">
            Find practical courses and skills-development
            opportunities designed to support employability,
            entrepreneurship and professional growth.
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <h3 className="font-semibold text-slate-900">
              Training opportunities are coming soon.
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Published courses will appear here as verified
              training providers are added.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course: Course) => (
              <article
                key={course.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    {course.category}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${verificationClass(
                      course.verificationStatus
                    )}`}
                  >
                    {verificationLabel(
                      course.verificationStatus
                    )}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-950">
                  {course.name}
                </h3>

                <p className="mt-2 text-sm font-semibold text-blue-700">
                  {course.provider.name}
                </p>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                  {course.description}
                </p>

                <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                  <p>
                    <span className="font-semibold text-slate-700">
                      Location:
                    </span>{" "}
                    {course.provider.city
                      ? `${course.provider.city}, ${course.provider.country}`
                      : course.provider.country}
                  </p>

                  {course.deliveryMode && (
                    <p>
                      <span className="font-semibold text-slate-700">
                        Delivery:
                      </span>{" "}
                      {course.deliveryMode}
                    </p>
                  )}

                  {course.duration && (
                    <p>
                      <span className="font-semibold text-slate-700">
                        Duration:
                      </span>{" "}
                      {course.duration}
                    </p>
                  )}

                  {course.cost && (
                    <p>
                      <span className="font-semibold text-slate-700">
                        Cost:
                      </span>{" "}
                      {course.cost}
                      {course.currency
                        ? ` ${course.currency}`
                        : ""}
                    </p>
                  )}
                </div>

                {course.applicationUrl && (
                  <a
                    href={course.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-blue-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
                  >
                    View Course →
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Trust */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
                Trust & Transparency
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Know what has been verified.
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                SIMMY LINK AFRICA distinguishes between
                publicly listed information, verified providers
                and formal partners. This helps users understand
                the level of relationship and verification behind
                the information presented.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  Public Listed
                </span>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Information publicly listed for discovery.
                  Users should confirm current details with the
                  official provider.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-white p-5">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Verified
                </span>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Information that has undergone a verification
                  process by SIMMY LINK AFRICA.
                </p>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-white p-5">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  Partner
                </span>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  An institution or provider with a recognized
                  partnership relationship with SIMMY LINK AFRICA.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future intelligence */}
      <section className="bg-blue-950">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">
              Coming with Atlas Intelligence
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
              Education discovery will become more intelligent.
            </h2>

            <p className="mt-4 leading-7 text-blue-100">
              Future SIMMY AI capabilities can help users
              discover learning pathways based on their
              interests, education background, skills, career
              goals, location and available opportunities.
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm font-bold text-white">
                  Smart Discovery
                </div>

                <p className="mt-2 text-xs leading-5 text-blue-200">
                  Find relevant learning pathways faster.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm font-bold text-white">
                  Career Alignment
                </div>

                <p className="mt-2 text-xs leading-5 text-blue-200">
                  Connect learning choices to career goals.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm font-bold text-white">
                  Opportunity Matching
                </div>

                <p className="mt-2 text-xs leading-5 text-blue-200">
                  Connect education with future opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950">
            Ready to explore your next learning opportunity?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Explore education, discover opportunities and
            connect your learning journey to a bigger future.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/opportunities"
              className="rounded-xl bg-blue-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Explore Opportunities
            </Link>

            <Link
              href="/marketplace"
              className="rounded-xl border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Visit Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-bold">
                SIMMY LINK AFRICA
              </div>

              <p className="mt-1 text-sm text-slate-400">
                Connecting Africa to Opportunities, Knowledge,
                Business and the World.
              </p>
            </div>

            <div className="text-sm text-slate-400">
              Powered by SIMMY-LINK CONCEPT LTD.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}