import Image from "next/image";
import Link from "next/link";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa6";

import HeroSlider from "@/components/home/HeroSlider";
import ContactForm from "@/components/home/ContactForm";

const ecosystem = [
  {
    title: "Opportunities",
    href: "/opportunities",
    description:
      "Discover jobs, scholarships, grants, fellowships, internships, business opportunities, and other verified opportunities.",
  },
  {
    title: "Education & Training",
    href: "/education",
    description:
      "Explore study-abroad information, universities, programs, scholarships, professional learning, digital skills, and training.",
  },
  {
    title: "Careers",
    href: "/careers",
    description:
      "Build your career through job opportunities, CV and professional profile support, career resources, internships, and skills development.",
  },
  {
    title: "Business",
    href: "/business",
    description:
      "Grow stronger businesses through AI branding, AI content, WhatsApp automation, consulting, digital transformation, trade, and sourcing.",
  },
  {
    title: "Marketplace",
    href: "/marketplace",
    description:
      "Discover products, suppliers, sourcing opportunities, and business connections across Africa and global markets.",
  },
  {
    title: "Accounts",
    href: "/account/register",
    description:
      "Create your SIMMY LINK AFRICA account to manage your profile, save opportunities, track applications, and manage your activities.",
  },
];

const stats = [
  ["10,000+", "African entrepreneurs & professionals to support"],
  ["5,000", "Individuals to connect to verified opportunities"],
  ["1,000", "SMEs to assist with growth & digital transformation"],
];

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/",
    icon: FaFacebookF,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/",
    icon: FaInstagram,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/",
    icon: FaLinkedinIn,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/",
    icon: FaTiktok,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/",
    icon: FaYoutube,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* NAVIGATION */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">

          <Link
            href="/"
            className="flex items-center"
            aria-label="SIMMY LINK AFRICA Home"
          >
            <Image
              src="/images/simmy-link-africa-logo.png"
              alt="SIMMY LINK AFRICA"
              width={220}
              height={90}
              className="h-auto w-auto max-h-14"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#about" className="hover:text-[#b07a32]">
              About
            </a>

            <a href="#ecosystem" className="hover:text-[#b07a32]">
              Our Ecosystem
            </a>

            <a href="#impact" className="hover:text-[#b07a32]">
              Impact
            </a>

            <a href="#partners" className="hover:text-[#b07a32]">
              Partnerships
            </a>

            <a href="#contact" className="hover:text-[#b07a32]">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/account/login"
              className="hidden rounded-full border border-[#0b2a63] px-5 py-2.5 text-sm font-semibold text-[#0b2a63] transition hover:bg-[#0b2a63] hover:text-white sm:inline-flex"
            >
              Login
            </Link>

            <Link
              href="/account/register"
              className="rounded-full bg-[#0b2a63] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#071d45]"
            >
              Get Started
            </Link>
          </div>

        </div>
      </header>

      {/* HERO SLIDER */}
      <HeroSlider />

      {/* ABOUT */}
      <section
        id="about"
        className="mx-auto max-w-7xl px-6 py-24 lg:px-8"
      >
        <div className="grid gap-14 lg:grid-cols-2">

          <div>
            <p className="text-sm font-bold tracking-[0.25em] text-[#b07a32]">
              WHO WE ARE
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#0b2a63] md:text-5xl">
              Connecting potential with opportunity.
            </h2>
          </div>

          <div className="space-y-5 text-lg leading-8 text-slate-600">
            <p>
              SIMMY LINK AFRICA is a business growth and opportunity
              access platform helping entrepreneurs, startups, SMEs,
              professionals, and organizations unlock new possibilities
              through practical business solutions, strategic
              partnerships, and global connectivity.
            </p>

            <p>
              Built on over a decade of entrepreneurial and business
              execution experience through SIMMY-LINK CONCEPT LTD,
              established in 2013, SIMMY LINK AFRICA represents a
              modern evolution focused on empowering Africans and
              African businesses for success in a rapidly changing
              global economy.
            </p>

            <p>
              Our approach combines innovation, technology, strategic
              partnerships, consulting expertise, and practical
              execution to help businesses and individuals achieve
              measurable growth and long-term success.
            </p>
          </div>

        </div>
      </section>

      {/* VISION / MISSION */}
      <section className="bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-24 lg:grid-cols-2 lg:px-8">

          <div className="rounded-3xl bg-[#0b2a63] p-9 text-white">
            <p className="text-sm font-bold tracking-[0.25em] text-[#d9a85f]">
              OUR VISION
            </p>

            <h2 className="mt-5 text-3xl font-bold leading-tight">
              To become Africa&apos;s most trusted platform for business
              growth, opportunity access, and global market connectivity.
            </h2>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-9">
            <p className="text-sm font-bold tracking-[0.25em] text-[#b07a32]">
              OUR MISSION
            </p>

            <h2 className="mt-5 text-3xl font-bold leading-tight text-[#0b2a63]">
              To empower Africans and African businesses through
              innovation, knowledge, partnerships, technology, and access
              to opportunities that create sustainable growth and impact.
            </h2>
          </div>

        </div>
      </section>

      {/* ECOSYSTEM */}
      <section
        id="ecosystem"
        className="mx-auto max-w-7xl px-6 py-24 lg:px-8"
      >
        <div className="max-w-3xl">

          <p className="text-sm font-bold tracking-[0.25em] text-[#b07a32]">
            OUR ECOSYSTEM
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#0b2a63] md:text-5xl">
            One connected ecosystem for opportunity, growth and
            global connectivity.
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Six core modules bring together the essential pathways
            people and businesses need to discover opportunities, learn,
            build careers, grow businesses, trade, and manage their
            journey on SIMMY LINK AFRICA.
          </p>

        </div>

        {/* CLICKABLE ECOSYSTEM CARDS */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {ecosystem.map((item, index) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-3xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-[#b07a32]/50 hover:shadow-xl"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0b2a63] text-sm font-bold text-white">
                {String(index + 1).padStart(2, "0")}
              </div>

              <h3 className="mt-6 text-xl font-bold text-[#0b2a63] group-hover:text-[#b07a32]">
                {item.title}
              </h3>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                {item.description}
              </p>

              <p className="mt-6 text-sm font-bold text-[#b07a32]">
                Explore →
              </p>
            </Link>
          ))}

        </div>
      </section>

      {/* WHY US */}
      <section className="bg-[#071d45] text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="max-w-3xl">
            <p className="text-sm font-bold tracking-[0.25em] text-[#d9a85f]">
              WHY SIMMY LINK AFRICA
            </p>

            <h2 className="mt-4 text-4xl font-bold md:text-5xl">
              Practical experience. Strategic thinking. Global
              perspective.
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              [
                "Practical Experience",
                "Built on more than a decade of entrepreneurial and business execution experience.",
              ],
              [
                "Innovation-Driven Approach",
                "Combining innovation, technology and practical solutions to create sustainable change.",
              ],
              [
                "Cross-Border Business Exposure",
                "Practical business exposure across Nigeria, Morocco and China Sourcing with a global perspective.",
              ],
              [
                "Strategic Thinking",
                "Focusing on long-term growth, systems, partnerships and measurable outcomes.",
              ],
              [
                "Trusted Execution",
                "A foundation built on practical delivery, problem-solving and client success.",
              ],
              [
                "Global Perspective",
                "Helping African businesses connect with international opportunities, markets and partnerships.",
              ],
            ].map(([title, description]) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/5 p-7"
              >
                <h3 className="text-xl font-bold">
                  {title}
                </h3>

                <p className="mt-3 leading-7 text-slate-300">
                  {description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* IMPACT */}
      <section
        id="impact"
        className="mx-auto max-w-7xl px-6 py-24 lg:px-8"
      >
        <div className="text-center">

          <p className="text-sm font-bold tracking-[0.25em] text-[#b07a32]">
            OUR LONG-TERM IMPACT GOAL
          </p>

          <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-bold text-[#0b2a63] md:text-5xl">
            Helping thousands of Africans gain access to opportunities,
            build stronger businesses and contribute to Africa&apos;s
            growth and prosperity.
          </h2>

        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {stats.map(([number, label]) => (
            <div
              key={number}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center"
            >
              <div className="text-5xl font-bold text-[#0b2a63]">
                {number}
              </div>

              <p className="mt-4 text-slate-600">
                {label}
              </p>
            </div>
          ))}
        </div>

      </section>

      {/* PARTNERS */}
      <section id="partners" className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="grid gap-12 lg:grid-cols-2">

            <div>
              <p className="text-sm font-bold tracking-[0.25em] text-[#b07a32]">
                STRATEGIC PARTNERSHIPS
              </p>

              <h2 className="mt-4 text-4xl font-bold text-[#0b2a63]">
                Let&apos;s build Africa&apos;s future together.
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                We welcome collaboration with universities, employers,
                investors, government agencies, NGOs, development
                organizations, innovators, entrepreneurs, and businesses
                committed to creating sustainable opportunities across
                Africa.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">

              <h3 className="text-xl font-bold text-[#0b2a63]">
                We work with
              </h3>

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-600">
                {[
                  "NGOs",
                  "Government Agencies",
                  "Development Institutions",
                  "International Organizations",
                  "Startup Hubs",
                  "Accelerators",
                  "Incubators",
                  "Investors",
                  "SMEs",
                  "Corporate Organizations",
                  "Manufacturers",
                  "Educational Institutions",
                ].map((partner) => (
                  <div
                    key={partner}
                    className="rounded-xl bg-slate-50 px-4 py-3"
                  >
                    {partner}
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="mx-auto max-w-7xl px-6 py-24 lg:px-8"
      >
        <div className="grid gap-14 lg:grid-cols-2">

          <div>
            <p className="text-sm font-bold tracking-[0.25em] text-[#b07a32]">
              CONTACT US
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#0b2a63] md:text-5xl">
              Let&apos;s start a conversation.
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Whether you are looking for partnership opportunities,
              business support, collaboration, or more information about
              SIMMY LINK AFRICA, we would like to hear from you.
            </p>

            <div className="mt-8 space-y-3">
              <p className="font-semibold text-[#0b2a63]">
                Email
              </p>

              <a
                href="mailto:hello@simmylinkafrica.com"
                className="text-slate-600 transition hover:text-[#b07a32]"
              >
                hello@simmylinkafrica.com
              </a>
            </div>
          </div>

          <ContactForm />

        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#b07a32]">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">

          <h2 className="text-4xl font-bold text-white md:text-5xl">
            Let&apos;s build Africa&apos;s future together.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/90">
            Empowering Africans through opportunity, innovation and
            global connections.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">

            <a
              href="#contact"
              className="rounded-full bg-white px-7 py-3.5 font-semibold text-[#0b2a63] hover:bg-slate-100"
            >
              Contact Us
            </a>

            <Link
              href="/account/register"
              className="rounded-full border border-white/60 px-7 py-3.5 font-semibold text-white hover:bg-white/10"
            >
              Create Your Account
            </Link>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#071d45] text-slate-300">

        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

            {/* BRAND */}
            <div>

              <Link
                href="/"
                className="inline-flex"
                aria-label="SIMMY LINK AFRICA Home"
              >
                <Image
                  src="/images/simmy-link-africa-logo.png"
                  alt="SIMMY LINK AFRICA"
                  width={220}
                  height={90}
                  className="h-auto w-auto max-h-16"
                />
              </Link>

              <p className="mt-5 max-w-sm text-sm leading-6">
                Connecting Africa to Opportunities, Knowledge,
                Business Growth & Global Markets.
              </p>

              {/* SOCIAL MEDIA */}
              <div className="mt-6 flex flex-wrap gap-3">

                {socialLinks.map((social) => {
                  const Icon = social.icon;

                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-[#b07a32]"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}

              </div>

            </div>

              {/* CONTACT */}
            <div>

              <h3 className="font-semibold text-white">
                Contact
              </h3>

              <div className="mt-5 space-y-4 text-sm">

                <div>
                  <p className="font-medium text-white">
                    Email
                  </p>

                  <a
                    href="mailto:hello@simmylinkafrica.com"
                    className="mt-1 block transition hover:text-[#d9a85f]"
                  >
                    hello@simmylinkafrica.com
                  </a>
                </div>

                <a
                  href="#contact"
                  className="inline-block font-semibold text-[#d9a85f] hover:text-white"
                >
                  Send us a message →
                </a>

              </div>

            </div>
            {/* ECOSYSTEM LINKS */}
            <div>

              <h3 className="font-semibold text-white">
                Our Ecosystem
              </h3>

              <ul className="mt-5 space-y-3 text-sm">

                {ecosystem.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      className="transition hover:text-[#d9a85f]"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}

              </ul>

            </div>

            {/* VALUES */}
            <div>

              <h3 className="font-semibold text-white">
                Our Values
              </h3>

              <ul className="mt-5 space-y-3 text-sm">
                <li>Integrity</li>
                <li>Impact</li>
                <li>Innovation</li>
                <li>Collaboration</li>
                <li>Excellence</li>
                <li>Continuous Learning</li>
              </ul>

            </div>

          </div>

          {/* FOOTER BOTTOM */}
          <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">

            <p>
              © {new Date().getFullYear()} SIMMY LINK AFRICA.
              All rights reserved.
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