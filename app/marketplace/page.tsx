"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProductImage from "@/components/marketplace/ProductImage";

// =======================================================
// TYPES
// =======================================================

type MarketplaceProduct = {
  id: number;
  name: string;
  slug: string;
  category: string;
  description: string;
  imageUrl: string;
  status: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};

type EnquiryForm = {
  customerName: string;
  email: string;
  phone: string;
  country: string;
  quantity: string;
  message: string;
};

// =======================================================
// CATEGORIES
// =======================================================

const categories = [
  {
    number: "01",
    title: "Business Equipment",
    description:
      "Practical equipment and tools for offices, enterprises, workshops and growing businesses.",
  },
  {
    number: "02",
    title: "Electronics",
    description:
      "Selected electronics and technology products for personal, professional and business use.",
  },
  {
    number: "03",
    title: "Agricultural Equipment",
    description:
      "Equipment and tools designed to support farming, processing and agricultural businesses.",
  },
  {
    number: "04",
    title: "Solar & Energy",
    description:
      "Solar products, backup power solutions and energy equipment for homes and businesses.",
  },
  {
    number: "05",
    title: "Printing & Branding",
    description:
      "Printing machines, branding equipment, signage materials and related production solutions.",
  },
  {
    number: "06",
    title: "Office Equipment",
    description:
      "Useful office machines, furniture, accessories and productivity equipment.",
  },
  {
    number: "07",
    title: "Packaging",
    description:
      "Packaging equipment and materials for manufacturers, retailers and growing businesses.",
  },
  {
    number: "08",
    title: "Promotional Products",
    description:
      "Branded products and corporate promotional materials for organisations and businesses.",
  },
];

// =======================================================
// PAGE
// =======================================================

export default function MarketplacePage() {
  const [products, setProducts] =
    useState<MarketplaceProduct[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedProduct, setSelectedProduct] =
    useState<MarketplaceProduct | null>(null);

  const [enquiryForm, setEnquiryForm] =
    useState<EnquiryForm>({
      customerName: "",
      email: "",
      phone: "",
      country: "",
      quantity: "1",
      message: "",
    });

  const [submittingEnquiry, setSubmittingEnquiry] =
    useState(false);

  const [enquirySuccess, setEnquirySuccess] =
    useState("");

  const [enquiryError, setEnquiryError] =
    useState("");

  // =====================================================
  // LOAD PUBLISHED MARKETPLACE PRODUCTS
  // =====================================================

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            "/api/marketplace/products",
            {
              cache: "no-store",
            }
          );

        if (!response.ok) {
          throw new Error(
            "Failed to load marketplace products."
          );
        }

        const data =
          await response.json();

        const publishedProducts =
          Array.isArray(data)
            ? data.filter(
                (
                  product: MarketplaceProduct
                ) =>
                  product.status ===
                  "PUBLISHED"
              )
            : [];

        publishedProducts.sort(
          (
            a: MarketplaceProduct,
            b: MarketplaceProduct
          ) => {
            if (
              a.featured &&
              !b.featured
            ) {
              return -1;
            }

            if (
              !a.featured &&
              b.featured
            ) {
              return 1;
            }

            return (
              new Date(
                b.createdAt
              ).getTime() -
              new Date(
                a.createdAt
              ).getTime()
            );
          }
        );

        setProducts(
          publishedProducts
        );
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load marketplace products."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadProducts();
  }, []);

  // =====================================================
  // PRODUCT ENQUIRY
  // =====================================================

  function openEnquiry(
    product: MarketplaceProduct
  ) {
    setSelectedProduct(product);
    setEnquirySuccess("");
    setEnquiryError("");

    setEnquiryForm({
      customerName: "",
      email: "",
      phone: "",
      country: "",
      quantity: "1",
      message: `I am interested in ${product.name}. Please provide your best quotation, including sourcing and delivery options.`,
    });
  }

  function closeEnquiry() {
    if (submittingEnquiry) {
      return;
    }

    setSelectedProduct(null);
    setEnquirySuccess("");
    setEnquiryError("");

    setEnquiryForm({
      customerName: "",
      email: "",
      phone: "",
      country: "",
      quantity: "1",
      message: "",
    });
  }

  function updateEnquiryField(
    field: keyof EnquiryForm,
    value: string
  ) {
    setEnquiryForm(
      (current) => ({
        ...current,
        [field]: value,
      })
    );
  }

  async function submitEnquiry(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!selectedProduct) {
      return;
    }

    try {
      setSubmittingEnquiry(true);
      setEnquiryError("");
      setEnquirySuccess("");

      const response =
        await fetch(
          "/api/marketplace/enquiries",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              productId:
                selectedProduct.id,
              productName:
                selectedProduct.name,
              customerName:
                enquiryForm.customerName,
              email:
                enquiryForm.email,
              phone:
                enquiryForm.phone,
              country:
                enquiryForm.country,
              quantity:
                enquiryForm.quantity,
              message:
                enquiryForm.message,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to submit your enquiry."
        );
      }

      setEnquirySuccess(
        data?.message ||
          "Your enquiry has been submitted successfully. We will contact you shortly."
      );

      setEnquiryForm({
        customerName: "",
        email: "",
        phone: "",
        country: "",
        quantity: "1",
        message: "",
      });
    } catch (err) {
      console.error(err);

      setEnquiryError(
        err instanceof Error
          ? err.message
          : "Unable to submit your enquiry. Please try again."
      );
    } finally {
      setSubmittingEnquiry(false);
    }
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="min-h-screen bg-slate-50 text-[#08265c]">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#08265c] text-sm font-bold text-white">
              SL
            </div>

            <div className="leading-none">
              <div className="text-sm font-bold tracking-[0.22em]">
                SIMMY LINK
              </div>

              <div className="mt-1 text-[10px] font-semibold tracking-[0.35em] text-[#b67b25]">
                AFRICA
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-xs font-medium md:flex">
            <Link
              href="/"
              className="hover:text-[#b67b25]"
            >
              Home
            </Link>

            <Link
              href="/#ecosystem"
              className="hover:text-[#b67b25]"
            >
              Our Ecosystem
            </Link>

            <Link
              href="/marketplace"
              className="font-semibold text-[#b67b25]"
            >
              Marketplace
            </Link>

            <Link
              href="/pricing"
              className="hover:text-[#b67b25]"
            >
              Pricing
            </Link>
          </nav>

          <Link
            href="/login"
            className="rounded-full bg-[#08265c] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#123c82]"
          >
            Platform Login
          </Link>
        </div>
      </header>

      {/* =================================================
          HERO
      ================================================= */}

      <section className="relative overflow-hidden bg-[#08265c]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#08265c] via-[#123d82] to-[#214b91] opacity-90" />

        <div className="relative mx-auto max-w-6xl px-6 py-24 text-white md:py-32">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex rounded-full border border-[#d49a3b]/60 bg-white/5 px-4 py-2 text-[10px] font-semibold tracking-[0.25em] text-[#e1ad55]">
              SIMMY LINK AFRICA MARKETPLACE
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
              From global suppliers
              <br />
              <span className="text-[#d9a044]">
                to African markets.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-blue-100 md:text-lg">
              Discover useful products for business,
              agriculture, technology, energy and
              everyday life through the SIMMY LINK
              AFRICA Marketplace.
            </p>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-blue-100/90">
              We are developing a growing trade network
              that connects African customers and
              businesses with selected products from
              international manufacturers and suppliers,
              including China.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#products"
                className="rounded-full bg-[#c28a32] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#d49a3b]"
              >
                Explore Products
              </a>

              <a
                href="mailto:hello@simmylinkafrica.com?subject=Marketplace%20Product%20Enquiry"
                className="rounded-full border border-white/60 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-[#08265c]"
              >
                Request a Product
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          INTRODUCTION
      ================================================= */}

      <section className="bg-[#f3f6fb] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 md:grid-cols-2 md:items-end">
            <div>
              <p className="text-xs font-semibold tracking-[0.28em] text-[#b67b25]">
                OUR MARKETPLACE
              </p>

              <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
                Useful products.
                <br />
                Global sourcing.
                <br />
                African opportunity.
              </h2>
            </div>

            <div className="text-sm leading-7 text-slate-600">
              <p>
                SIMMY LINK AFRICA Marketplace is being
                developed to make selected products more
                accessible to African consumers,
                entrepreneurs and businesses.
              </p>

              <p className="mt-4">
                Our focus is not simply selling products.
                We aim to connect product demand with
                international supply, practical business
                needs and emerging opportunities across
                African markets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          CATEGORIES
      ================================================= */}

      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs font-semibold tracking-[0.28em] text-[#b67b25]">
            SHOP BY CATEGORY
          </p>

          <h2 className="mt-4 max-w-2xl text-3xl font-bold md:text-4xl">
            Products selected for business and everyday
            needs.
          </h2>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map(
              (category) => (
                <div
                  key={category.number}
                  className="rounded-2xl border border-slate-200 bg-[#f7f9fc] p-6 transition hover:-translate-y-1 hover:border-[#b67b25]/50 hover:shadow-lg"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#08265c] text-xs font-bold text-white">
                    {category.number}
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    {category.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {category.description}
                  </p>

                  <div className="mt-5 text-xs font-semibold text-[#b67b25]">
                    Explore category →
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* =================================================
          LIVE MARKETPLACE PRODUCTS
      ================================================= */}

      <section
        id="products"
        className="bg-[#eef3fb] py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold tracking-[0.28em] text-[#b67b25]">
                FEATURED PRODUCTS
              </p>

              <h2 className="mt-4 text-3xl font-bold md:text-4xl">
                Explore selected products.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
                Our product catalogue will continue to
                grow as we establish supplier
                relationships and identify products
                relevant to African markets.
              </p>
            </div>
          </div>

          {loading && (
            <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <p className="text-sm font-medium text-slate-500">
                Loading marketplace products...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="mt-12 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <p className="text-sm font-medium text-red-700">
                {error}
              </p>
            </div>
          )}

          {!loading &&
            !error &&
            products.length === 0 && (
              <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#08265c] text-xl font-bold text-white">
                  SL
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  Marketplace catalogue coming soon.
                </h3>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
                  We are currently adding selected
                  products and sourcing opportunities for
                  African markets.
                </p>

                <a
                  href="mailto:hello@simmylinkafrica.com?subject=Marketplace%20Product%20Enquiry"
                  className="mt-6 inline-flex rounded-full bg-[#08265c] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#123c82]"
                >
                  Request a Product
                </a>
              </div>
            )}

          {!loading &&
            !error &&
            products.length > 0 && (
              <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {products.map(
                  (product) => (
                    <article
                      key={product.id}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="relative h-56 overflow-hidden bg-[#eef3fb]">
                        <ProductImage
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-contain"
                        />

                        {product.featured && (
                          <span className="absolute left-4 top-4 z-10 rounded-full bg-[#c28a32] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white">
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="p-6">
                        <p className="text-xs font-semibold text-[#b67b25]">
                          {product.category}
                        </p>

                        <h3 className="mt-2 text-xl font-bold">
                          {product.name}
                        </h3>

                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                          {product.description}
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            openEnquiry(
                              product
                            )
                          }
                          className="mt-6 inline-flex rounded-full bg-[#08265c] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#123c82]"
                        >
                          Request Quote
                        </button>
                      </div>
                    </article>
                  )
                )}
              </div>
            )}
        </div>
      </section>

      {/* =================================================
          HOW IT WORKS
      ================================================= */}

      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-[0.28em] text-[#b67b25]">
              HOW IT WORKS
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              From product discovery to delivery.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {[
              [
                "01",
                "Discover",
                "Browse products and identify what you need.",
              ],
              [
                "02",
                "Enquire",
                "Tell us the product, quantity and destination.",
              ],
              [
                "03",
                "Source",
                "We identify suitable suppliers and sourcing options.",
              ],
              [
                "04",
                "Deliver",
                "We work toward a practical supply and delivery solution.",
              ],
            ].map(
              ([
                number,
                title,
                description,
              ]) => (
                <div
                  key={number}
                  className="rounded-2xl border border-slate-200 bg-[#f7f9fc] p-6"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#08265c] text-xs font-bold text-white">
                    {number}
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {description}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* =================================================
          TRADE CTA
      ================================================= */}

      <section className="bg-[#08265c] py-20 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="text-xs font-semibold tracking-[0.28em] text-[#d9a044]">
            GLOBAL TRADE & SOURCING
          </p>

          <h2 className="mt-5 text-3xl font-bold md:text-5xl">
            Looking for a product?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-blue-100 md:text-base">
            If you cannot find what you need, tell us
            what you are looking for. As our supplier
            network develops, SIMMY LINK AFRICA will
            explore sourcing opportunities for products
            that meet African market needs.
          </p>

          <a
            href="mailto:hello@simmylinkafrica.com?subject=Product%20Sourcing%20Request"
            className="mt-8 inline-flex rounded-full bg-[#c28a32] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#d49a3b]"
          >
            Request Product Sourcing
          </a>
        </div>
      </section>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="bg-[#061d49] py-12 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <div className="text-sm font-bold tracking-[0.22em]">
                SIMMY LINK
              </div>

              <div className="mt-1 text-[10px] font-semibold tracking-[0.35em] text-[#d9a044]">
                AFRICA
              </div>

              <p className="mt-5 max-w-sm text-xs leading-6 text-blue-100">
                Connecting Africans to Opportunities,
                Business Growth & Global Markets.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold">
                Marketplace
              </h3>

              <p className="mt-4 text-xs leading-6 text-blue-100">
                Products, sourcing and trade opportunities
                connecting global suppliers with African
                markets.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold">
                Contact
              </h3>

              <a
                href="mailto:hello@simmylinkafrica.com"
                className="mt-4 block text-xs text-blue-100 hover:text-white"
              >
                hello@simmylinkafrica.com
              </a>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-xs text-blue-200">
            <div className="flex flex-col justify-between gap-3 md:flex-row">
              <span>
                © 2026 SIMMY LINK AFRICA. All rights
                reserved.
              </span>

              <span>
                Powered by SIMMY-LINK CONCEPT LTD
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* =================================================
          REQUEST QUOTE MODAL
      ================================================= */}

      {selectedProduct && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#061d49]/70 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="request-quote-title"
        >
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5 md:px-8">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#b67b25]">
                  MARKETPLACE ENQUIRY
                </p>

                <h2
                  id="request-quote-title"
                  className="mt-2 text-2xl font-bold text-[#08265c]"
                >
                  Request a Quote
                </h2>
              </div>

              <button
                type="button"
                onClick={closeEnquiry}
                disabled={submittingEnquiry}
                aria-label="Close enquiry form"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-600 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-6 md:px-8">
              <div className="rounded-2xl bg-[#eef3fb] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#b67b25]">
                  Selected Product
                </p>

                <p className="mt-1 text-base font-bold text-[#08265c]">
                  {selectedProduct.name}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {selectedProduct.category}
                </p>
              </div>

              {enquirySuccess ? (
                <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 text-xl font-bold text-white">
                    ✓
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-emerald-900">
                    Enquiry submitted successfully
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-emerald-800">
                    {enquirySuccess}
                  </p>

                  <button
                    type="button"
                    onClick={closeEnquiry}
                    className="mt-6 rounded-full bg-[#08265c] px-6 py-3 text-xs font-semibold text-white transition hover:bg-[#123c82]"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={submitEnquiry}
                  className="mt-6 space-y-5"
                >
                  {enquiryError && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
                      {enquiryError}
                    </div>
                  )}

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="customerName"
                        className="text-xs font-semibold text-[#08265c]"
                      >
                        Full Name *
                      </label>

                      <input
                        id="customerName"
                        type="text"
                        required
                        value={
                          enquiryForm.customerName
                        }
                        onChange={(event) =>
                          updateEnquiryField(
                            "customerName",
                            event.target.value
                          )
                        }
                        placeholder="Your full name"
                        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#08265c] focus:ring-2 focus:ring-[#08265c]/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="text-xs font-semibold text-[#08265c]"
                      >
                        Email Address *
                      </label>

                      <input
                        id="email"
                        type="email"
                        required
                        value={
                          enquiryForm.email
                        }
                        onChange={(event) =>
                          updateEnquiryField(
                            "email",
                            event.target.value
                          )
                        }
                        placeholder="you@example.com"
                        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#08265c] focus:ring-2 focus:ring-[#08265c]/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="text-xs font-semibold text-[#08265c]"
                      >
                        Phone / WhatsApp *
                      </label>

                      <input
                        id="phone"
                        type="tel"
                        required
                        value={
                          enquiryForm.phone
                        }
                        onChange={(event) =>
                          updateEnquiryField(
                            "phone",
                            event.target.value
                          )
                        }
                        placeholder="+234..."
                        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#08265c] focus:ring-2 focus:ring-[#08265c]/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="country"
                        className="text-xs font-semibold text-[#08265c]"
                      >
                        Country *
                      </label>

                      <input
                        id="country"
                        type="text"
                        required
                        value={
                          enquiryForm.country
                        }
                        onChange={(event) =>
                          updateEnquiryField(
                            "country",
                            event.target.value
                          )
                        }
                        placeholder="Nigeria"
                        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#08265c] focus:ring-2 focus:ring-[#08265c]/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="quantity"
                        className="text-xs font-semibold text-[#08265c]"
                      >
                        Quantity
                      </label>

                      <input
                        id="quantity"
                        type="number"
                        min="1"
                        step="1"
                        value={
                          enquiryForm.quantity
                        }
                        onChange={(event) =>
                          updateEnquiryField(
                            "quantity",
                            event.target.value
                          )
                        }
                        placeholder="1"
                        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#08265c] focus:ring-2 focus:ring-[#08265c]/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="text-xs font-semibold text-[#08265c]"
                    >
                      Message *
                    </label>

                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={
                        enquiryForm.message
                      }
                      onChange={(event) =>
                        updateEnquiryField(
                          "message",
                          event.target.value
                        )
                      }
                      placeholder="Tell us about your requirements, destination, quantity and any specifications."
                      className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-[#08265c] focus:ring-2 focus:ring-[#08265c]/10"
                    />
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">
                    By submitting this enquiry, you are
                    asking SIMMY LINK AFRICA to contact
                    you regarding the selected product,
                    quotation, sourcing and possible
                    delivery options.
                  </div>

                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={closeEnquiry}
                      disabled={
                        submittingEnquiry
                      }
                      className="rounded-full border border-slate-300 px-6 py-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={
                        submittingEnquiry
                      }
                      className="rounded-full bg-[#08265c] px-7 py-3 text-xs font-semibold text-white transition hover:bg-[#123c82] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submittingEnquiry
                        ? "Submitting..."
                        : "Submit Enquiry"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}