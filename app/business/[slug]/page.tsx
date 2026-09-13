import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Globe2,
  Mail,
  MapPin,
  Phone,
  ExternalLink,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BusinessDetailsPage({ params }: Props) {
  const { slug } = await params;

  const business = await prisma.business.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
  });

  if (!business) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-950 text-sm font-bold text-white">
              SL
            </div>

            <div>
              <div className="text-sm font-bold tracking-wide text-blue-950">
                SIMMY LINK AFRICA
              </div>
              <div className="text-xs text-slate-500">
                Business Ecosystem
              </div>
            </div>
          </Link>

          <Link
            href="/business"
            className="hidden items-center gap-2 text-sm font-semibold text-blue-950 md:flex"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Business Directory
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-blue-950">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-center">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg">
              {business.logoUrl ? (
                <img
                  src={business.logoUrl}
                  alt={`${business.name} logo`}
                  className="h-full w-full object-contain p-3"
                />
              ) : (
                <Building2 className="h-14 w-14 text-blue-950" />
              )}
            </div>

            <div>
              <div className="mb-3 inline-flex rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-950">
                {business.category}
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                {business.name}
              </h1>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-blue-100">
                <span className="flex items-center gap-2">
                  <Globe2 className="h-4 w-4" />
                  {business.country}
                </span>

                {business.city && (
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {business.city}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* About */}
          <div>
            <div className="mb-8">
              <div className="text-sm font-semibold uppercase tracking-wider text-yellow-600">
                About the Business
              </div>

              <h2 className="mt-2 text-3xl font-bold text-blue-950">
                Business Overview
              </h2>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <p className="whitespace-pre-line text-base leading-8 text-slate-700">
                {business.description}
              </p>
            </div>

            {business.services && (
              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-7">
                <h3 className="text-xl font-bold text-blue-950">
                  Products & Services
                </h3>

                <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-700">
                  {business.services}
                </p>
              </div>
            )}
          </div>

          {/* Contact / details */}
          <aside>
            <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-blue-950">
                Business Information
              </h2>

              <div className="mt-6 space-y-5">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Category
                  </div>

                  <div className="mt-1 font-medium text-slate-800">
                    {business.category}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Location
                  </div>

                  <div className="mt-1 flex items-center gap-2 font-medium text-slate-800">
                    <MapPin className="h-4 w-4 text-yellow-600" />
                    {business.city
                      ? `${business.city}, ${business.country}`
                      : business.country}
                  </div>
                </div>

                {business.email && (
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Email
                    </div>

                    <a
                      href={`mailto:${business.email}`}
                      className="mt-1 flex items-center gap-2 break-all font-medium text-blue-950 hover:text-yellow-600"
                    >
                      <Mail className="h-4 w-4 shrink-0" />
                      {business.email}
                    </a>
                  </div>
                )}

                {business.phone && (
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Phone
                    </div>

                    <a
                      href={`tel:${business.phone}`}
                      className="mt-1 flex items-center gap-2 font-medium text-blue-950 hover:text-yellow-600"
                    >
                      <Phone className="h-4 w-4 shrink-0" />
                      {business.phone}
                    </a>
                  </div>
                )}
              </div>

              {business.websiteUrl && (
                <a
                  href={business.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-900"
                >
                  Visit Website
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}

              <div className="mt-6 rounded-xl bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Listing Status
                </div>

                <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-green-700">
                  <span className="h-2 w-2 rounded-full bg-green-600" />
                  {business.verificationStatus === "VERIFIED"
                    ? "Verified Business"
                    : "Publicly Listed"}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center lg:px-8">
          <h2 className="text-3xl font-bold text-blue-950">
            Explore More Businesses
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Discover more businesses and organizations within the SIMMY LINK
            AFRICA ecosystem.
          </p>

          <Link
            href="/business"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-900"
          >
            Business Directory
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} SIMMY LINK AFRICA</p>
          <p>Powered by SIMMY-LINK CONCEPT LTD.</p>
        </div>
      </footer>
    </main>
  );
}