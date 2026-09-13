import Link from "next/link";

const sections = [
  ["privacy-commitment", "1. Privacy Commitment"],
  ["data-controller", "2. Data Controller"],
  ["information-collected", "3. Information We Collect"],
  ["purpose-processing", "4. Purpose of Processing"],
  ["legal-basis", "5. Legal Basis for Processing"],
  ["data-sharing", "6. Data Sharing"],
  ["international-transfers", "7. International Data Transfers"],
  ["data-security", "8. Data Security"],
  ["data-retention", "9. Data Retention"],
  ["user-rights", "10. Your Privacy Rights"],
  ["cookies", "11. Cookies & Tracking Technologies"],
  ["children", "12. Children's Privacy"],
  ["data-breach", "13. Data Breach Management"],
  ["confidentiality", "14. Confidentiality"],
  ["updates", "15. Updates to Privacy Practices"],
  ["contact", "16. Contact for Privacy Matters"],
  ["reservation", "17. Reservation of Rights"],
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-3 text-lg font-bold tracking-tight text-slate-900"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 font-extrabold text-slate-950">
              S
            </span>

            <span>SIMMY LINK AFRICA</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/account/login"
              className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:inline-flex"
            >
              Login
            </Link>

            <Link
              href="/account/register"
              className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Create Account
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:py-20">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
              SIMMY LINK AFRICA
            </p>

            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
              Privacy Policy
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              This Privacy Policy explains how SIMMY LINK AFRICA, operated by
              SIMMY-LINK CONCEPT LTD, collects, uses, protects, shares, and
              retains personal information when you use our Platform and
              services.
            </p>

            <div className="mt-7 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-slate-100 px-4 py-2 font-medium text-slate-700">
                Version 1.0
              </span>

              <span className="rounded-full bg-slate-100 px-4 py-2 font-medium text-slate-700">
                Effective Date: 20 August 2026
              </span>

              <span className="rounded-full bg-slate-100 px-4 py-2 font-medium text-slate-700">
                Last Updated: 20 August 2026
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Table of contents */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950">
              Contents
            </h2>

            <nav className="mt-4 space-y-1">
              {sections.map(([id, title]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="block rounded-lg px-3 py-2 text-sm leading-5 text-slate-600 transition hover:bg-slate-50 hover:text-blue-700"
                >
                  {title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Policy */}
        <article className="min-w-0 rounded-3xl border border-slate-200 bg-white px-6 py-10 shadow-sm sm:px-10 lg:px-14">
          <div className="max-w-4xl space-y-12">
            {/* 1 */}
            <section id="privacy-commitment" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-slate-950">
                1. Privacy Commitment
              </h2>

              <p className="mt-4 leading-8 text-slate-600">
                SIMMY LINK AFRICA is committed to protecting the privacy,
                confidentiality, and security of personal information provided
                by Users of the Platform.
              </p>

              <p className="mt-4 leading-8 text-slate-600">
                The Company shall process personal data in a lawful, fair,
                transparent, and responsible manner, consistent with applicable
                data protection laws and internationally recognized privacy
                principles.
              </p>

              <p className="mt-4 leading-8 text-slate-600">
                This Privacy Policy should be read together with the SIMMY LINK
                AFRICA Terms &amp; Conditions and other applicable policies
                published by the Company.
              </p>
            </section>

            <hr className="border-slate-200" />

            {/* 2 */}
            <section id="data-controller" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-slate-950">
                2. Data Controller
              </h2>

              <p className="mt-4 leading-8 text-slate-600">
                For the purposes of applicable data protection laws, personal
                information collected through the Platform is controlled by:
              </p>

              <div className="mt-5 rounded-2xl bg-slate-50 p-6">
                <p className="font-bold text-slate-950">
                  SIMMY-LINK CONCEPT LTD
                </p>
                <p className="mt-1 text-slate-600">
                  Operating the global business brand:
                  <span className="font-semibold"> SIMMY LINK AFRICA</span>
                </p>
                <p className="mt-1 text-slate-600">
                  Website: www.simmylinkafrica.com
                </p>
                <p className="mt-1 text-slate-600">
                  Official Email: hello@simmylinkafrica.com
                </p>
              </div>

              <p className="mt-5 leading-8 text-slate-600">
                The Company may appoint authorized service providers or
                processors to assist in processing personal information in
                accordance with this Privacy Policy and applicable law.
              </p>
            </section>

            <hr className="border-slate-200" />

            {/* 3 */}
            <section id="information-collected" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-slate-950">
                3. Information We Collect
              </h2>

              <p className="mt-4 leading-8 text-slate-600">
                Depending on the services requested and how you interact with
                the Platform, SIMMY LINK AFRICA may collect the following
                categories of information.
              </p>

              <div className="mt-7 grid gap-6 md:grid-cols-2">
                <InfoCard
                  title="Personal Information"
                  items={[
                    "Full Name",
                    "Date of Birth",
                    "Nationality",
                    "Gender, where necessary",
                    "Residential Address",
                    "Country of Residence",
                    "Email Address",
                    "Telephone Number",
                    "Passport Number",
                    "National Identification Number, where applicable",
                    "Government-issued Identification",
                    "Photograph",
                    "Emergency Contact Information",
                  ]}
                />

                <InfoCard
                  title="Educational Information"
                  items={[
                    "Academic Certificates",
                    "Academic Transcripts",
                    "Admission Letters",
                    "Student Identification",
                    "Statements of Purpose",
                    "Personal Statements",
                    "Reference Letters",
                    "Educational History",
                    "Language Test Results",
                  ]}
                />

                <InfoCard
                  title="Career Information"
                  items={[
                    "Curriculum Vitae (CV)",
                    "Résumé",
                    "Employment History",
                    "Professional Licences",
                    "Skills",
                    "Qualifications",
                    "LinkedIn Profile",
                    "Portfolio",
                    "References",
                  ]}
                />

                <InfoCard
                  title="Business Information"
                  items={[
                    "Company Name",
                    "Business Registration Documents",
                    "Tax Information, where required",
                    "Company Profile",
                    "Business Contacts",
                    "Trade Information",
                  ]}
                />

                <InfoCard
                  title="Technical Information"
                  items={[
                    "IP Address",
                    "Browser Type",
                    "Device Information",
                    "Operating System",
                    "Language Preferences",
                    "Session Information",
                    "Login Activity",
                    "Cookies",
                    "Usage Analytics",
                    "Error Logs",
                  ]}
                />

                <InfoCard
                  title="Payment Information"
                  items={[
                    "Transaction Reference",
                    "Payment Status",
                    "Billing Information",
                    "Invoice Records",
                  ]}
                />
              </div>

              <div className="mt-7 rounded-2xl border border-blue-100 bg-blue-50 p-6">
                <p className="font-semibold text-slate-950">
                  Payment card information
                </p>

                <p className="mt-2 leading-7 text-slate-600">
                  SIMMY LINK AFRICA does not intentionally store complete debit
                  or credit card information. Payment processing is handled by
                  secure third-party payment providers.
                </p>
              </div>
            </section>

            <hr className="border-slate-200" />

            {/* 4 */}
            <section id="purpose-processing" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-slate-950">
                4. Purpose of Processing
              </h2>

              <p className="mt-4 leading-8 text-slate-600">
                The Company processes personal information only for legitimate
                business purposes, including:
              </p>

              <BulletList
                items={[
                  "Creating user accounts",
                  "Delivering requested services",
                  "Processing applications",
                  "Providing education and opportunity services",
                  "Business consulting",
                  "AI services",
                  "Career development",
                  "Customer support",
                  "Platform administration",
                  "Identity verification",
                  "Fraud prevention",
                  "Improving Platform performance",
                  "Processing payments",
                  "Issuing invoices",
                  "Managing subscriptions",
                  "Sending service notifications",
                  "Providing opportunity alerts",
                  "Conducting research and analytics",
                  "Complying with legal obligations",
                ]}
              />

              <p className="mt-5 leading-8 text-slate-600">
                Personal information shall not be processed for purposes
                incompatible with those for which it was originally collected
                without appropriate notice or consent where required.
              </p>
            </section>

            <hr className="border-slate-200" />

            {/* 5 */}
            <section id="legal-basis" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-slate-950">
                5. Legal Basis for Processing
              </h2>

              <p className="mt-4 leading-8 text-slate-600">
                Depending on the circumstances, the Company may process
                personal information based on one or more of the following
                lawful grounds:
              </p>

              <BulletList
                items={[
                  "User consent",
                  "Performance of a contract",
                  "Compliance with legal obligations",
                  "Protection of vital interests",
                  "Legitimate business interests",
                  "Public interest where applicable",
                ]}
              />

              <p className="mt-5 leading-8 text-slate-600">
                Where consent is required, Users may withdraw consent at any
                time, subject to legal and contractual limitations.
              </p>
            </section>

            <hr className="border-slate-200" />

            {/* 6 */}
            <section id="data-sharing" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-slate-950">
                6. Data Sharing
              </h2>

              <p className="mt-4 leading-8 text-slate-600">
                SIMMY LINK AFRICA shall not sell Users&apos; personal
                information.
              </p>

              <p className="mt-4 leading-8 text-slate-600">
                Personal information may only be shared where reasonably
                necessary with:
              </p>

              <BulletList
                items={[
                  "Universities",
                  "Employers",
                  "Government agencies",
                  "Embassies",
                  "Scholarship providers",
                  "Training institutions",
                  "Payment service providers",
                  "Technology providers",
                  "Professional advisers",
                  "Auditors",
                  "Law enforcement agencies where legally required",
                  "Other authorized partners involved in delivering requested services",
                ]}
              />

              <p className="mt-5 leading-8 text-slate-600">
                All reasonable steps shall be taken to ensure that third
                parties protect personal information appropriately.
              </p>
            </section>

            <hr className="border-slate-200" />

            {/* 7 */}
            <section id="international-transfers" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-slate-950">
                7. International Data Transfers
              </h2>

              <p className="mt-4 leading-8 text-slate-600">
                As an international platform serving Users across Africa and
                globally, SIMMY LINK AFRICA may transfer personal information
                across national borders where necessary to deliver requested
                services.
              </p>

              <p className="mt-4 leading-8 text-slate-600">
                Where such transfers occur, the Company shall take reasonable
                measures to ensure that transferred information receives an
                appropriate level of protection consistent with applicable data
                protection laws.
              </p>
            </section>

            <hr className="border-slate-200" />

            {/* 8 */}
            <section id="data-security" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-slate-950">
                8. Data Security
              </h2>

              <p className="mt-4 leading-8 text-slate-600">
                The Company shall implement reasonable administrative,
                technical, and organizational measures designed to protect
                personal information against:
              </p>

              <BulletList
                items={[
                  "Unauthorized access",
                  "Accidental loss",
                  "Destruction",
                  "Alteration",
                  "Disclosure",
                  "Misuse",
                  "Cyberattacks",
                  "Unlawful processing",
                ]}
              />

              <p className="mt-5 leading-8 text-slate-600">
                Such measures may include:
              </p>

              <BulletList
                items={[
                  "Encryption where appropriate",
                  "Access controls",
                  "Authentication procedures",
                  "Secure hosting",
                  "Regular security reviews",
                  "Staff confidentiality obligations",
                ]}
              />

              <p className="mt-5 leading-8 text-slate-600">
                While the Company strives to protect personal information, no
                electronic system can be guaranteed to be completely secure.
              </p>
            </section>

            <hr className="border-slate-200" />

            {/* 9 */}
            <section id="data-retention" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-slate-950">
                9. Data Retention
              </h2>

              <p className="mt-4 leading-8 text-slate-600">
                Personal information shall be retained only for as long as
                reasonably necessary to:
              </p>

              <BulletList
                items={[
                  "Provide services",
                  "Comply with legal obligations",
                  "Resolve disputes",
                  "Prevent fraud",
                  "Enforce the Terms & Conditions",
                  "Maintain legitimate business records",
                ]}
              />

              <p className="mt-5 leading-8 text-slate-600">
                After the applicable retention period, information shall be
                securely deleted, anonymized, or archived in accordance with
                applicable law.
              </p>
            </section>

            <hr className="border-slate-200" />

            {/* 10 */}
            <section id="user-rights" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-slate-950">
                10. Your Privacy Rights
              </h2>

              <p className="mt-4 leading-8 text-slate-600">
                Subject to applicable law, Users may have the right to:
              </p>

              <BulletList
                items={[
                  "Request access to their personal information",
                  "Request correction of inaccurate information",
                  "Request deletion of personal information",
                  "Object to certain processing activities",
                  "Request restriction of processing",
                  "Request data portability where technically feasible",
                  "Withdraw consent where processing is based on consent",
                  "Lodge complaints with relevant data protection authorities",
                ]}
              />

              <p className="mt-5 leading-8 text-slate-600">
                The Company may request reasonable verification of identity
                before responding to such requests.
              </p>
            </section>

            <hr className="border-slate-200" />

            {/* 11 */}
            <section id="cookies" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-slate-950">
                11. Cookies &amp; Tracking Technologies
              </h2>

              <p className="mt-4 leading-8 text-slate-600">
                The Platform may use cookies and similar technologies to:
              </p>

              <BulletList
                items={[
                  "Improve functionality",
                  "Remember user preferences",
                  "Analyze website performance",
                  "Enhance security",
                  "Measure traffic",
                  "Personalize user experience",
                ]}
              />

              <p className="mt-5 leading-8 text-slate-600">
                Users may manage cookie preferences through their browser
                settings or the Company&apos;s Cookie Policy.
              </p>

              <p className="mt-4 leading-8 text-slate-600">
                Disabling certain cookies may affect Platform functionality.
              </p>
            </section>

            <hr className="border-slate-200" />

            {/* 12 */}
            <section id="children" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-slate-950">
                12. Children&apos;s Privacy
              </h2>

              <p className="mt-4 leading-8 text-slate-600">
                SIMMY LINK AFRICA does not knowingly collect personal
                information from children in violation of applicable law.
              </p>

              <p className="mt-4 leading-8 text-slate-600">
                Where services are provided to minors, appropriate parental or
                guardian consent may be required.
              </p>

              <p className="mt-4 leading-8 text-slate-600">
                If the Company becomes aware that personal information has been
                collected unlawfully from a child, reasonable steps shall be
                taken to delete such information.
              </p>
            </section>

            <hr className="border-slate-200" />

            {/* 13 */}
            <section id="data-breach" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-slate-950">
                13. Data Breach Management
              </h2>

              <p className="mt-4 leading-8 text-slate-600">
                In the event of a personal data breach, the Company shall:
              </p>

              <BulletList
                items={[
                  "Investigate the incident",
                  "Contain the breach where practicable",
                  "Assess potential risks",
                  "Notify affected Users and relevant authorities where required by applicable law",
                  "Implement corrective measures to reduce the likelihood of recurrence",
                ]}
              />
            </section>

            <hr className="border-slate-200" />

            {/* 14 */}
            <section id="confidentiality" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-slate-950">
                14. Confidentiality
              </h2>

              <p className="mt-4 leading-8 text-slate-600">
                Employees, contractors, consultants, and authorized
                representatives of SIMMY LINK AFRICA who have access to
                personal information shall be bound by confidentiality
                obligations.
              </p>

              <p className="mt-4 leading-8 text-slate-600">
                Such persons shall process personal information only to the
                extent necessary for their authorized duties.
              </p>
            </section>

            <hr className="border-slate-200" />

            {/* 15 */}
            <section id="updates" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-slate-950">
                15. Updates to Privacy Practices
              </h2>

              <p className="mt-4 leading-8 text-slate-600">
                The Company may periodically update its privacy and data
                protection practices to reflect changes in:
              </p>

              <BulletList
                items={[
                  "Legal requirements",
                  "Technology",
                  "Platform services",
                  "Operational processes",
                  "Security standards",
                ]}
              />

              <p className="mt-5 leading-8 text-slate-600">
                Material changes shall be communicated through appropriate
                channels where required by law.
              </p>
            </section>

            <hr className="border-slate-200" />

            {/* 16 */}
            <section id="contact" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-slate-950">
                16. Contact for Privacy Matters
              </h2>

              <p className="mt-4 leading-8 text-slate-600">
                Questions, concerns, or requests relating to privacy or data
                protection may be directed to:
              </p>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="font-bold text-slate-950">
                  Data Protection Contact
                </p>

                <p className="mt-2 text-slate-700">
                  <span className="font-semibold">SIMMY LINK AFRICA</span>
                </p>

                <p className="mt-2 text-slate-600">
                  Email:{" "}
                  <a
                    href="mailto:privacy@simmylinkafrica.com"
                    className="font-semibold text-blue-700 hover:underline"
                  >
                    privacy@simmylinkafrica.com
                  </a>
                </p>

                <p className="mt-2 text-slate-600">
                  General Enquiries:{" "}
                  <a
                    href="mailto:hello@simmylinkafrica.com"
                    className="font-semibold text-blue-700 hover:underline"
                  >
                    hello@simmylinkafrica.com
                  </a>
                </p>

                <p className="mt-2 text-slate-600">
                  Website:{" "}
                  <a
                    href="https://www.simmylinkafrica.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-700 hover:underline"
                  >
                    www.simmylinkafrica.com
                  </a>
                </p>
              </div>
            </section>

            <hr className="border-slate-200" />

            {/* 17 */}
            <section id="reservation" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-slate-950">
                17. Reservation of Rights
              </h2>

              <p className="mt-4 leading-8 text-slate-600">
                Nothing in this Privacy Policy shall limit the Company&apos;s
                ability to process personal information where required:
              </p>

              <BulletList
                items={[
                  "By law",
                  "By court order",
                  "By lawful governmental request",
                  "To establish, exercise, or defend legal claims",
                  "To protect the rights, safety, or security of the Company, its Users, Partners, or the public",
                ]}
              />
            </section>

            {/* Important notice */}
            <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6">
              <p className="font-bold text-slate-950">
                Important Notice
              </p>

              <p className="mt-2 leading-7 text-slate-700">
                This Privacy Policy forms part of the SIMMY LINK AFRICA legal
                framework and should be read together with the Platform&apos;s
                Terms &amp; Conditions and other applicable policies.
              </p>
            </div>
          </div>
        </article>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-bold text-white">SIMMY LINK AFRICA</p>
            <p className="mt-2 text-sm">
              Connecting Africa to Opportunities, Knowledge, Business and the
              World.
            </p>
            <p className="mt-3 text-xs text-slate-400">
              Powered by SIMMY-LINK CONCEPT LTD.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm">
            <Link href="/" className="hover:text-white">
              Home
            </Link>

            <Link href="/terms" className="hover:text-white">
              Terms &amp; Conditions
            </Link>

            <Link href="/privacy" className="text-yellow-400">
              Privacy Policy
            </Link>

            <Link href="/account/register" className="hover:text-white">
              Create Account
            </Link>
          </div>
        </div>

        <div className="border-t border-slate-800">
          <div className="mx-auto max-w-7xl px-6 py-5 text-xs text-slate-500">
            © {new Date().getFullYear()} SIMMY LINK AFRICA. All rights
            reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 leading-7 text-slate-600">
          <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-700" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function InfoCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
      <h3 className="text-lg font-bold text-slate-950">{title}</h3>

      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-3 text-sm leading-6 text-slate-600"
          >
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-700" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}