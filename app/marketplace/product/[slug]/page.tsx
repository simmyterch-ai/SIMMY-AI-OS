"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductImage from "@/components/marketplace/ProductImage";

type MarketplaceProduct = {
  id: number;
  name: string;
  slug: string;
  category: string;
  description: string;
  imageUrl: string | null;
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

export default function MarketplaceProductDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug)
    ? params.slug[0]
    : params?.slug;

  const [product, setProduct] =
    useState<MarketplaceProduct | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showEnquiry, setShowEnquiry] = useState(false);
  const [submittingEnquiry, setSubmittingEnquiry] =
    useState(false);

  const [enquirySuccess, setEnquirySuccess] =
    useState("");

  const [enquiryError, setEnquiryError] =
    useState("");

  const [enquiryForm, setEnquiryForm] =
    useState<EnquiryForm>({
      customerName: "",
      email: "",
      phone: "",
      country: "",
      quantity: "1",
      message: "",
    });

  useEffect(() => {
    if (!slug) {
      return;
    }

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        /*
         * The existing public marketplace API returns
         * published products including their slugs.
         *
         * We intentionally keep the existing product-detail
         * API unchanged.
         */
        const response = await fetch(
          "/api/marketplace/products",
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Unable to load marketplace products."
          );
        }

        const products: MarketplaceProduct[] =
          Array.isArray(data?.products)
            ? data.products
            : Array.isArray(data)
              ? data
              : [];

        const foundProduct = products.find(
          (item) =>
            item.slug === String(slug) &&
            item.status === "PUBLISHED"
        );

        if (!foundProduct) {
          setError("Product not found.");
          setProduct(null);
          return;
        }

        setProduct(foundProduct);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load this product."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [slug]);

  function openEnquiry() {
    if (!product) {
      return;
    }

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

    setShowEnquiry(true);
  }

  function closeEnquiry() {
    if (submittingEnquiry) {
      return;
    }

    setShowEnquiry(false);
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
    setEnquiryForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function submitEnquiry(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!product) {
      return;
    }

    try {
      setSubmittingEnquiry(true);
      setEnquiryError("");
      setEnquirySuccess("");

      const response = await fetch(
        "/api/marketplace/enquiries",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: product.id,
            productName: product.name,
            customerName: enquiryForm.customerName,
            email: enquiryForm.email,
            phone: enquiryForm.phone,
            country: enquiryForm.country,
            quantity: enquiryForm.quantity,
            message: enquiryForm.message,
          }),
        }
      );

      const data = await response.json();

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

  return (
    <main className="min-h-screen bg-slate-50 text-[#08265c]">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <Image
              src="/images/simmy-link-africa-logo.png"
              alt="SIMMY LINK AFRICA"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full bg-white object-contain"
            />

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
            href="/account/register"
            className="rounded-full bg-[#08265c] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#123c82]"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* BREADCRUMB */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <Link
              href="/marketplace"
              className="font-semibold text-[#08265c] hover:text-[#b67b25]"
            >
              Marketplace
            </Link>

            <span>→</span>

            <span>
              {product?.category || "Product"}
            </span>

            {product && (
              <>
                <span>→</span>
                <span className="truncate">
                  {product.name}
                </span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="bg-[#eef3fb] py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          {loading && (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
              <p className="text-sm font-medium text-slate-500">
                Loading product...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center">
              <h1 className="text-2xl font-bold text-red-900">
                Product unavailable
              </h1>

              <p className="mt-3 text-sm leading-6 text-red-700">
                {error}
              </p>

              <Link
                href="/marketplace"
                className="mt-7 inline-flex rounded-full bg-[#08265c] px-6 py-3 text-xs font-semibold text-white transition hover:bg-[#123c82]"
              >
                Back to Marketplace
              </Link>
            </div>
          )}

          {!loading && !error && product && (
            <>
              <Link
                href="/marketplace"
                className="inline-flex items-center text-xs font-semibold text-[#08265c] transition hover:text-[#b67b25]"
              >
                ← Back to Marketplace
              </Link>

              <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="grid md:grid-cols-2">
                  {/* IMAGE */}
                  <div className="relative min-h-[360px] bg-[#eef3fb] md:min-h-[560px]">
                    <ProductImage
                      src={product.imageUrl || ""}
                      alt={product.name}
                      className="h-full min-h-[360px] w-full object-contain p-8 md:min-h-[560px] md:p-12"
                    />

                    {product.featured && (
                      <span className="absolute left-6 top-6 rounded-full bg-[#c28a32] px-4 py-2 text-[10px] font-bold uppercase tracking-wide text-white">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* DETAILS */}
                  <div className="flex flex-col justify-center p-8 md:p-12">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b67b25]">
                      {product.category}
                    </p>

                    <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
                      {product.name}
                    </h1>

                    <div className="mt-8 h-px bg-slate-200" />

                    <div className="mt-8">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Product Description
                      </p>

                      <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600 md:text-base">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-10 rounded-2xl bg-[#f3f6fb] p-5">
                      <p className="text-sm font-semibold text-[#08265c]">
                        Need pricing, sourcing or delivery
                        information?
                      </p>

                      <p className="mt-2 text-xs leading-6 text-slate-500">
                        Send us your requirements and SIMMY
                        LINK AFRICA will contact you regarding
                        quotation, sourcing and possible
                        delivery options.
                      </p>
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={openEnquiry}
                        className="rounded-full bg-[#08265c] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#123c82]"
                      >
                        Request a Quote
                      </button>

                      <Link
                        href="/marketplace"
                        className="rounded-full border border-slate-300 px-7 py-3.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        Browse More Products
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* TRADE INFORMATION */}
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#08265c] text-sm font-bold text-white">
                    01
                  </div>

                  <h2 className="mt-5 text-lg font-bold">
                    Enquire
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Tell us the quantity, destination and
                    requirements for this product.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#08265c] text-sm font-bold text-white">
                    02
                  </div>

                  <h2 className="mt-5 text-lg font-bold">
                    Source
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    We explore suitable supplier and sourcing
                    options based on your requirements.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#08265c] text-sm font-bold text-white">
                    03
                  </div>

                  <h2 className="mt-5 text-lg font-bold">
                    Deliver
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    We work toward a practical supply and
                    delivery solution for your market.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* FOOTER */}
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

      {/* REQUEST QUOTE MODAL */}
      {showEnquiry && product && (
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
                <ProductImage
                  src={product.imageUrl || ""}
                  alt={product.name}
                  className="mb-4 h-40 w-full rounded-xl object-contain"
                />

                <p className="text-xs font-semibold uppercase tracking-wide text-[#b67b25]">
                  Selected Product
                </p>

                <p className="mt-1 text-base font-bold text-[#08265c]">
                  {product.name}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {product.category}
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
                        htmlFor="detail-customerName"
                        className="text-xs font-semibold text-[#08265c]"
                      >
                        Full Name *
                      </label>

                      <input
                        id="detail-customerName"
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
                        htmlFor="detail-email"
                        className="text-xs font-semibold text-[#08265c]"
                      >
                        Email Address *
                      </label>

                      <input
                        id="detail-email"
                        type="email"
                        required
                        value={enquiryForm.email}
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
                        htmlFor="detail-phone"
                        className="text-xs font-semibold text-[#08265c]"
                      >
                        Phone / WhatsApp *
                      </label>

                      <input
                        id="detail-phone"
                        type="tel"
                        required
                        value={enquiryForm.phone}
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
                        htmlFor="detail-country"
                        className="text-xs font-semibold text-[#08265c]"
                      >
                        Country *
                      </label>

                      <input
                        id="detail-country"
                        type="text"
                        required
                        value={enquiryForm.country}
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
                        htmlFor="detail-quantity"
                        className="text-xs font-semibold text-[#08265c]"
                      >
                        Quantity
                      </label>

                      <input
                        id="detail-quantity"
                        type="number"
                        min="1"
                        step="1"
                        value={enquiryForm.quantity}
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
                      htmlFor="detail-message"
                      className="text-xs font-semibold text-[#08265c]"
                    >
                      Message *
                    </label>

                    <textarea
                      id="detail-message"
                      required
                      rows={5}
                      value={enquiryForm.message}
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
                    asking SIMMY LINK AFRICA to contact you
                    regarding the selected product,
                    quotation, sourcing and possible delivery
                    options.
                  </div>

                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={closeEnquiry}
                      disabled={submittingEnquiry}
                      className="rounded-full border border-slate-300 px-6 py-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={submittingEnquiry}
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