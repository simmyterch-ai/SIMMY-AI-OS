import Link from "next/link";

const opportunities = [
  "Jobs",
  "Grants",
  "Scholarships",
  "Fellowships",
  "Internships",
  "Business Opportunities",
  "Training Opportunities",
  "Events",
  "Partnership Opportunities",
];

const assistance = [
  "CV & Career Services",
  "Scholarship Application Assistance",
  "Grant Application Assistance",
  "Business Proposal Development",
  "Interview Preparation",
  "Education Consulting",
];

const businessServices = [
  "Business Strategy",
  "Branding & Company Profiles",
  "AI Solutions",
  "WhatsApp Automation",
  "Digital Transformation",
  "Market Research",
  "Business Intelligence",
  "Trade Support",
];

const partners = [
  "Companies",
  "Universities",
  "NGOs",
  "Government Agencies",
  "Development Organizations",
  "Investors",
  "Employers",
  "Innovation Hubs",
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fc] text-slate-900">
      {/* NAVIGATION */}
      <header className="sticky top-0 z-50 border-b border-[#dbe4f2] bg-[#f4f7fc]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#123b8f] text-sm font-bold text-white">
              SL
            </div>

            <div>
              <div className="text-lg font-bold tracking-[0.18em] text-[#123b8f]">
                SIMMY LINK
              </div>
              <div className="text-xs font-semibold tracking-[0.45em] text-[#b07a32]">
                AFRICA
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <Link href="/" className="hover:text-[#b07a32]">
              Home
            </Link>

            <Link href="/#ecosystem" className="hover:text-[#b07a32]">
              Our Ecosystem
            </Link>

            <Link
              href="/pricing"
              className="font-semibold text-[#123b8f]"
            >
              Pricing
            </Link>
          </nav>

          <Link
            href="/login"
            className="rounded-full bg-[#123b8f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0d2f72]"
          >
            Platform Login
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#123b8f]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(176,122,50,0.24),transparent_35%)]" />

        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center lg:px-8 lg:py-28">
          <div className="mx-auto inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-[#e8c98f]">
            SIMPLE • TRANSPARENT • SERVICE-BASED
          </div>

          <h1 className="mt-7 text-5xl font-bold tracking-tight text-white md:text-6xl">
            Simple, Transparent Pricing
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-xl leading-8 text-blue-100">
            Discover opportunities for free. Pay only when you need
            professional assistance, business services, or products from
            our Marketplace.
          </p>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-blue-200">
            Our model is designed to keep opportunity access open while
            creating affordable pathways to professional support and
            business growth.
          </p>
        </div>
      </section>

      {/* FREE OPPORTUNITIES */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-[#dbe4f2] bg-white shadow-sm">
          <div className="grid lg:grid-cols-[1fr_1.4fr]">
            <div className="bg-[#eaf0fb] p-9 lg:p-12">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#123b8f] text-2xl text-white">
                ✓
              </div>

              <p className="mt-7 text-sm font-bold tracking-[0.25em] text-[#b07a32]">
                OPPORTUNITY ACCESS
              </p>

              <h2 className="mt-3 text-4xl font-bold text-[#123b8f]">
                FREE
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                Opportunity discovery should be accessible to everyone.
                No subscription is required to discover opportunities
                through SIMMY LINK AFRICA.
              </p>

              <div className="mt-8">
                <Link
                  href="/"
                  className="inline-flex rounded-full bg-[#123b8f] px-6 py-3 font-semibold text-white hover:bg-[#0d2f72]"
                >
                  Explore Opportunities
                </Link>
              </div>
            </div>

            <div className="p-9 lg:p-12">
              <h3 className="text-2xl font-bold text-[#123b8f]">
                Discover opportunities at no cost
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                We want Africans to have broad access to information
                that can help them learn, work, build businesses and
                create better futures.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {opportunities.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl bg-[#f4f7fc] px-4 py-3 text-sm font-medium text-slate-700"
                  >
                    <span className="text-[#b07a32]">✓</span>
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-[#dbe4f2] bg-[#f8faff] p-5">
                <p className="font-semibold text-[#123b8f]">
                  Our principle
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Find the opportunity for free. Pay only if you need
                  professional assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROFESSIONAL ASSISTANCE */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold tracking-[0.25em] text-[#b07a32]">
              PROFESSIONAL ASSISTANCE
            </p>

            <h2 className="mt-4 text-4xl font-bold text-[#123b8f] md:text-5xl">
              Need help turning an opportunity into an application?
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Opportunity discovery remains free. When you need
              professional guidance or hands-on assistance, you can
              book the specific service you need.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {assistance.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-[#dbe4f2] bg-[#f4f7fc] p-6"
              >
                <h3 className="text-lg font-bold text-[#123b8f]">
                  {item}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Service-based pricing according to your specific
                  requirements.
                </p>

                <Link
                  href="mailto:hello@simmylinkafrica.com"
                  className="mt-5 inline-block text-sm font-semibold text-[#b07a32] hover:underline"
                >
                  Request assistance →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BUSINESS GROWTH */}
      <section className="bg-[#eaf0fb]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold tracking-[0.25em] text-[#b07a32]">
                BUSINESS GROWTH
              </p>

              <h2 className="mt-4 text-4xl font-bold text-[#123b8f] md:text-5xl">
                Your business. Your goals. Our expertise.
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                Businesses should be able to choose the support they
                actually need rather than paying for services they do
                not use.
              </p>

              <p className="mt-4 text-lg leading-8 text-slate-600">
                SIMMY LINK AFRICA therefore offers business growth
                primarily through consultation, booking and
                service-based engagement.
              </p>

              <Link
                href="mailto:hello@simmylinkafrica.com"
                className="mt-8 inline-flex rounded-full bg-[#123b8f] px-7 py-3.5 font-semibold text-white hover:bg-[#0d2f72]"
              >
                Book a Business Consultation
              </Link>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-[#dbe4f2] lg:p-10">
              <h3 className="text-2xl font-bold text-[#123b8f]">
                Business services
              </h3>

              <div className="mt-7 space-y-3">
                {businessServices.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 rounded-xl bg-[#f4f7fc] px-5 py-4"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#123b8f] text-sm font-bold text-white">
                      ✓
                    </span>

                    <span className="font-medium text-slate-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-7 text-sm leading-6 text-slate-500">
                Final pricing is determined according to the scope,
                complexity and requirements of each engagement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MARKETPLACE */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-[#123b8f] text-white">
          <div className="grid lg:grid-cols-2">
            <div className="p-9 lg:p-12">
              <div className="text-5xl">🛒</div>

              <p className="mt-7 text-sm font-bold tracking-[0.25em] text-[#e8c98f]">
                SIMMY LINK AFRICA MARKETPLACE
              </p>

              <h2 className="mt-4 text-4xl font-bold">
                Discover products for business, work and everyday life.
              </h2>

              <p className="mt-6 leading-8 text-blue-100">
                Our Marketplace is being developed to connect African
                customers and businesses with useful products sourced
                through our growing global supplier and trade network.
              </p>

              <Link
                href="/"
                className="mt-8 inline-flex rounded-full bg-[#b07a32] px-7 py-3.5 font-semibold text-white hover:bg-[#966526]"
              >
                Explore Marketplace
              </Link>
            </div>

            <div className="border-t border-white/10 bg-white/5 p-9 lg:border-l lg:border-t-0 lg:p-12">
              <h3 className="text-2xl font-bold">
                From global suppliers to African markets.
              </h3>

              <p className="mt-5 leading-7 text-blue-100">
                As our trade network develops, we intend to source
                products from international manufacturers and suppliers,
                including China, and make selected products available
                across African markets.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3">
                {[
                  "Business Equipment",
                  "Electronics",
                  "Agricultural Equipment",
                  "Solar & Energy",
                  "Printing & Branding",
                  "Office Equipment",
                  "Packaging",
                  "Promotional Products",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-blue-100"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ENTERPRISE */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold tracking-[0.25em] text-[#b07a32]">
                ENTERPRISE & INSTITUTIONAL
              </p>

              <h2 className="mt-4 text-4xl font-bold text-[#123b8f]">
                Build strategic solutions with us.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                We welcome organizations looking to create meaningful
                opportunities, strengthen businesses, support skills
                development and expand access to global markets.
              </p>

              <Link
                href="mailto:hello@simmylinkafrica.com"
                className="mt-8 inline-flex rounded-full bg-[#123b8f] px-7 py-3.5 font-semibold text-white hover:bg-[#0d2f72]"
              >
                Contact Us
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {partners.map((partner) => (
                <div
                  key={partner}
                  className="rounded-2xl border border-[#dbe4f2] bg-[#f4f7fc] p-5 font-semibold text-[#123b8f]"
                >
                  {partner}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#b07a32]">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-4xl font-bold text-white md:text-5xl">
            Start with what you need.
          </h2>

          <p className="mt-5 text-lg leading-8 text-white/90">
            Discover opportunities for free, access professional
            assistance when needed, grow your business, and explore
            products through the Marketplace.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="rounded-full bg-white px-7 py-3.5 font-semibold text-[#123b8f] hover:bg-slate-100"
            >
              Explore SIMMY LINK AFRICA
            </Link>

            <Link
              href="mailto:hello@simmylinkafrica.com"
              className="rounded-full border border-white/70 px-7 py-3.5 font-semibold text-white hover:bg-white/10"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#071d45] text-slate-300">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <div className="text-xl font-bold tracking-[0.2em] text-white">
                SIMMY LINK
              </div>

              <div className="text-xs font-semibold tracking-[0.4em] text-[#d9a85f]">
                AFRICA
              </div>

              <p className="mt-4 max-w-sm text-sm leading-6">
                Connecting Africans to Opportunities, Business Growth &
                Global Markets.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white">
                Contact
              </h3>

              <p className="mt-4 text-sm">
                hello@simmylinkafrica.com
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white">
                Legal
              </h3>

              <p className="mt-4 text-sm leading-6">
                Powered by SIMMY-LINK CONCEPT LTD
              </p>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-sm text-slate-400">
            © {new Date().getFullYear()} SIMMY LINK AFRICA. All rights
            reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}