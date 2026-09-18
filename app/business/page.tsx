import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Globe2,
  MapPin,
  ArrowRight,
  Search,
} from "lucide-react";

// Tell Next.js that this page uses live data
export const dynamic = "force-dynamic";

type Business = {
  id: number;
  name: string;
  slug: string;
  category: string;
  country: string;
  city?: string | null;
  description: string;
  services?: string | null;
  websiteUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  logoUrl?: string | null;
  verificationStatus: string;
  status: string;
  featured: boolean;
};

function getApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.simmylinkafrica.com"
  ).replace(/\/$/, "");
}

async function getBusinesses(): Promise<Business[]> {
  try {
    const baseUrl = getApiBaseUrl();

    const response = await fetch(`${baseUrl}/api/businesses`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        "Failed to fetch businesses:",
        response.status,
        response.statusText
      );

      return [];
    }

    const data = await response.json();

    return data.businesses || [];
  } catch (error) {
    console.error("Failed to load businesses:", error);

    return [];
  }
}

export default async function BusinessPage() {
  const businesses = await getBusinesses();

  const featuredBusinesses = businesses.filter(
    (business) => business.featured
  );

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Header */}
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
              <div className="text-sm font-bold tracking-wide text-blue-950">
                SIMMY LINK AFRICA
              </div>

              <div className="text-xs text-slate-500">
                Business Ecosystem
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link
              href="/"
              className="text-slate-600 transition hover:text-blue-950"
            >
              Home
            </Link>

            <Link
              href="/opportunities"
              className="text-slate-600 transition hover:text-blue-950"
            >
              Opportunities
            </Link>

            <Link
              href="/education"
              className="text-slate-600 transition hover:text-blue-950"
            >
              Education
            </Link>

            <Link
              href="/careers"
              className="text-slate-600 transition hover:text-blue-950"
            >
              Careers
            </Link>

            <Link
              href="/marketplace"
              className="text-slate-600 transition hover:text-blue-950"
            >
              Marketplace
            </Link>
          </nav>

          <Link
            href="/account/register"
            className="rounded-full bg-blue-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-blue-950">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white">
              <Building2 className="h-4 w-4" />
              African Business Ecosystem
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              Discover Businesses.
              <span className="block text-yellow-400">
                Build Connections.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
              Discover businesses, services and trusted organizations across
              Africa and connect with opportunities for growth, partnerships
              and global business.
            </p>
          </div>
        </div>
      </section>

      {/* Search / Intro */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-blue-950">
                Business Directory
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Explore businesses currently listed on SIMMY LINK AFRICA.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
              <Search className="h-4 w-4" />
              Business discovery coming next
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      {featuredBusinesses.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div className="mb-8">
            <div className="text-sm font-semibold uppercase tracking-wider text-yellow-600">
              Featured
            </div>

            <h2 className="mt-2 text-3xl font-bold text-blue-950">
              Featured Businesses
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        </section>
      )}

      {/* All Businesses */}
      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="mb-8">
          <div className="text-sm font-semibold uppercase tracking-wider text-yellow-600">
            Directory
          </div>

          <h2 className="mt-2 text-3xl font-bold text-blue-950">
            {businesses.length > 0
              ? "Businesses on SIMMY LINK AFRICA"
              : "Business Directory"}
          </h2>
        </div>

        {businesses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
            <Building2 className="mx-auto h-12 w-12 text-slate-400" />

            <h3 className="mt-5 text-xl font-bold text-blue-950">
              No businesses listed yet
            </h3>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
              Business listings will appear here as verified businesses join
              the SIMMY LINK AFRICA ecosystem.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {businesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center lg:px-8">
          <h2 className="text-3xl font-bold text-blue-950">
            Grow Your Business With SIMMY LINK AFRICA
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Connect your business to customers, partners, opportunities and
            markets across Africa and beyond.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-900"
            >
              Partner With Us
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-xl border border-blue-950 px-6 py-3 text-sm font-semibold text-blue-950 transition hover:bg-blue-950 hover:text-white"
            >
              Request Assistance
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-xl border border-blue-950 px-6 py-3 text-sm font-semibold text-blue-950 transition hover:bg-blue-950 hover:text-white"
            >
              Business Growth Consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-3 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} SIMMY LINK AFRICA</p>

            <p>Powered by SIMMY-LINK CONCEPT LTD.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function BusinessCard({ business }: { business: Business }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-40 items-center justify-center bg-slate-100">
        {business.logoUrl ? (
          <img
            src={business.logoUrl}
            alt={`${business.name} logo`}
            className="h-24 w-24 object-contain"
          />
        ) : (
          <Building2 className="h-14 w-14 text-slate-400" />
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-yellow-600">
              {business.category}
            </div>

            <h3 className="mt-2 text-xl font-bold text-blue-950">
              {business.name}
            </h3>
          </div>

          {business.featured && (
            <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
              Featured
            </span>
          )}
        </div>

        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Globe2 className="h-4 w-4 shrink-0" />
            {business.country}
          </div>

          {business.city && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              {business.city}
            </div>
          )}
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
          {business.description}
        </p>

        <Link
          href={`/business/${business.slug}`}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-950 transition group-hover:text-yellow-600"
        >
          View Business
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}