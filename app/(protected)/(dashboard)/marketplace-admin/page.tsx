"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ImagePlus,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
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

type ProductForm = {
  name: string;
  slug: string;
  category: string;
  description: string;
  imageUrl: string;
  status: "DRAFT" | "PUBLISHED";
  featured: boolean;
};

// =======================================================
// CONSTANTS
// =======================================================

const CATEGORIES = [
  "Business Equipment",
  "Electronics",
  "Agricultural Equipment",
  "Solar & Energy",
  "Printing & Branding",
  "Office Equipment",
  "Packaging",
  "Promotional Products",
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
];

// =======================================================
// DEFAULT FORM
// =======================================================

const EMPTY_FORM: ProductForm = {
  name: "",
  slug: "",
  category: "Business Equipment",
  description: "",
  imageUrl: "",
  status: "DRAFT",
  featured: false,
};

// =======================================================
// HELPERS
// =======================================================

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// =======================================================
// PAGE
// =======================================================

export default function MarketplaceAdminPage() {
  const [products, setProducts] =
    useState<MarketplaceProduct[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [categoryFilter, setCategoryFilter] =
    useState("ALL");

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [form, setForm] =
    useState<ProductForm>(EMPTY_FORM);

  const [selectedImageName, setSelectedImageName] =
    useState("");

  const [selectedImagePreview, setSelectedImagePreview] =
    useState("");

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

     const response =
  await fetch(
    "/api/marketplace/admin/products",
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

      setProducts(
        Array.isArray(data)
          ? data
          : []
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

  // =====================================================
  // FORM HELPERS
  // =====================================================

  function clearSelectedImage() {
    setSelectedImageName("");
    setSelectedImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function openCreateForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    clearSelectedImage();
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function openEditForm(
    product: MarketplaceProduct
  ) {
    setEditingId(product.id);

    setForm({
      name: product.name,
      slug: product.slug,
      category: product.category,
      description: product.description,
      imageUrl: product.imageUrl,
      status:
        product.status ===
        "PUBLISHED"
          ? "PUBLISHED"
          : "DRAFT",
      featured: product.featured,
    });

    clearSelectedImage();
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function closeForm() {
    if (
      saving ||
      uploadingImage
    ) {
      return;
    }

    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    clearSelectedImage();
  }

  function updateField<
    K extends keyof ProductForm
  >(
    field: K,
    value: ProductForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleNameChange(
    value: string
  ) {
    setForm((current) => ({
      ...current,
      name: value,
      ...(editingId === null &&
      !current.slug
        ? {
            slug: createSlug(value),
          }
        : {}),
    }));
  }

  // =====================================================
  // IMAGE SELECTION
  // =====================================================

  function handleImageSelection(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setSuccess("");

    // ---------------------------------------------------
    // TYPE
    // ---------------------------------------------------

    if (
      !ALLOWED_IMAGE_TYPES.includes(
        file.type
      )
    ) {
      clearSelectedImage();

      setError(
        "Invalid image type. Only PNG, JPEG and WebP images are allowed."
      );

      return;
    }

    // ---------------------------------------------------
    // SIZE
    // ---------------------------------------------------

    if (file.size === 0) {
      clearSelectedImage();

      setError(
        "The selected image is empty."
      );

      return;
    }

    if (
      file.size >
      MAX_IMAGE_SIZE
    ) {
      clearSelectedImage();

      setError(
        "Image is too large. Maximum size is 5 MB."
      );

      return;
    }

    // ---------------------------------------------------
    // PREVIEW
    // ---------------------------------------------------

    const previewUrl =
      URL.createObjectURL(file);

    setSelectedImageName(
      file.name
    );

    setSelectedImagePreview(
      previewUrl
    );
  }

  // =====================================================
  // UPLOAD IMAGE
  // =====================================================

  async function uploadImage() {
    const file =
      fileInputRef.current
        ?.files?.[0];

    if (!file) {
      setError(
        "Please choose an image first."
      );

      return;
    }

    setUploadingImage(true);
    setError("");
    setSuccess("");

    try {
      if (
        !ALLOWED_IMAGE_TYPES.includes(
          file.type
        )
      ) {
        throw new Error(
          "Invalid image type. Only PNG, JPEG and WebP images are allowed."
        );
      }

      if (
        file.size >
        MAX_IMAGE_SIZE
      ) {
        throw new Error(
          "Image is too large. Maximum size is 5 MB."
        );
      }

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      const response =
        await fetch(
          "/api/marketplace/upload",
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to upload image."
        );
      }

      if (!data?.path) {
        throw new Error(
          "Image uploaded, but no image path was returned."
        );
      }

      updateField(
        "imageUrl",
        data.url || data.path || ""
      );

      setSuccess(
        "Product image uploaded successfully."
      );

      clearSelectedImage();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload image."
      );
    } finally {
      setUploadingImage(false);
    }
  }

  // =====================================================
  // SAVE PRODUCT
  // =====================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (!form.name.trim()) {
        throw new Error(
          "Product name is required."
        );
      }

      if (!form.slug.trim()) {
        throw new Error(
          "Product slug is required."
        );
      }

      if (!form.description.trim()) {
        throw new Error(
          "Product description is required."
        );
      }

      const isEditing =
        editingId !== null;

      const endpoint =
        isEditing
          ? `/api/marketplace/products/${editingId}`
          : "/api/marketplace/products";

      const method =
        isEditing
          ? "PUT"
          : "POST";

      const response =
        await fetch(
          endpoint,
          {
            method,
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              name:
                form.name.trim(),
              slug:
                form.slug.trim(),
              category:
                form.category.trim(),
              description:
                form.description.trim(),
              imageUrl:
                form.imageUrl.trim(),
              status:
                form.status,
              featured:
                form.featured,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to save product."
        );
      }

      setSuccess(
        isEditing
          ? "Product updated successfully."
          : "Product created successfully."
      );

      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      clearSelectedImage();

      await loadProducts();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save product."
      );
    } finally {
      setSaving(false);
    }
  }

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  async function deleteProduct(
    product: MarketplaceProduct
  ) {
    const confirmed =
      window.confirm(
        `Delete "${product.name}"? This action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(product.id);
    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          `/api/marketplace/products/${product.id}`,
          {
            method: "DELETE",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to delete product."
        );
      }

      setSuccess(
        "Product deleted successfully."
      );

      await loadProducts();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // =====================================================
  // FILTER PRODUCTS
  // =====================================================

  const filteredProducts =
    products.filter(
      (product) => {
        const normalizedSearch =
          search
            .toLowerCase()
            .trim();

        const matchesSearch =
          !normalizedSearch ||
          product.name
            .toLowerCase()
            .includes(
              normalizedSearch
            ) ||
          product.category
            .toLowerCase()
            .includes(
              normalizedSearch
            );

        const matchesStatus =
          statusFilter ===
            "ALL" ||
          product.status ===
            statusFilter;

        const matchesCategory =
          categoryFilter ===
            "ALL" ||
          product.category ===
            categoryFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesCategory
        );
      }
    );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
            SIMMY LINK AFRICA
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Marketplace Management
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Manage products displayed on
            the public SIMMY LINK AFRICA
            Marketplace.
          </p>
        </div>

        <button
          type="button"
          onClick={
            openCreateForm
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
        >
          <Plus className="h-5 w-5" />

          Add Product
        </button>
      </div>

      {/* NOTIFICATIONS */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
          {success}
        </div>
      )}

      {/* STATS */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">
            Total Products
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {products.length}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">
            Published
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {
              products.filter(
                (product) =>
                  product.status ===
                  "PUBLISHED"
              ).length
            }
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">
            Drafts
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {
              products.filter(
                (product) =>
                  product.status ===
                  "DRAFT"
              ).length
            }
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">
            Featured
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {
              products.filter(
                (product) =>
                  product.featured
              ).length
            }
          </p>
        </div>
      </div>

      {/* FILTER BAR */}

      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search products..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </div>

          <select
            value={
              categoryFilter
            }
            onChange={(event) =>
              setCategoryFilter(
                event.target.value
              )
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500"
          >
            <option value="ALL">
              All Categories
            </option>

            {CATEGORIES.map(
              (category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              )
            )}
          </select>

          <select
            value={
              statusFilter
            }
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500"
          >
            <option value="ALL">
              All Statuses
            </option>

            <option value="PUBLISHED">
              Published
            </option>

            <option value="DRAFT">
              Draft
            </option>
          </select>
        </div>
      </div>

      {/* PRODUCT LIST */}

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-bold text-slate-900">
            Products
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {filteredProducts.length}{" "}
            product
            {filteredProducts.length ===
            1
              ? ""
              : "s"}{" "}
            shown
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500">
            Loading marketplace
            products...
          </div>
        ) : filteredProducts.length ===
          0 ? (
          <div className="p-12 text-center">
            <p className="font-semibold text-slate-700">
              No products found.
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Add your first marketplace
              product to get started.
            </p>

            <button
              type="button"
              onClick={
                openCreateForm
              }
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
            >
              <Plus className="h-4 w-4" />

              Add Product
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredProducts.map(
              (product) => (
                <div
                  key={product.id}
                  className="p-6"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
                    {/* IMAGE */}

                    <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      <ProductImage
                        src={
                          product.imageUrl
                        }
                        alt={
                          product.name
                        }
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* CONTENT */}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900">
                          {
                            product.name
                          }
                        </h3>

                        {product.featured && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                            <Star className="h-3.5 w-3.5 fill-current" />

                            Featured
                          </span>
                        )}

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            product.status ===
                            "PUBLISHED"
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {
                            product.status
                          }
                        </span>
                      </div>

                      <p className="mt-1 text-sm font-medium text-blue-700">
                        {
                          product.category
                        }
                      </p>

                      <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                        {
                          product.description
                        }
                      </p>
                    </div>

                    {/* ACTIONS */}

                    <div className="flex flex-wrap gap-3 xl:flex-shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(
                            product
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <Pencil className="h-4 w-4" />

                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteProduct(
                            product
                          )
                        }
                        disabled={
                          deletingId ===
                          product.id
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />

                        {deletingId ===
                        product.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* PRODUCT FORM MODAL */}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingId !==
                  null
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingId !==
                  null
                    ? "Update the marketplace product details."
                    : "Add a product to the SIMMY LINK AFRICA Marketplace."}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeForm
                }
                disabled={
                  saving ||
                  uploadingImage
                }
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-6 p-6"
            >
              <div className="grid gap-5 md:grid-cols-2">
                {/* NAME */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Product Name
                  </label>

                  <input
                    value={
                      form.name
                    }
                    onChange={(
                      event
                    ) =>
                      handleNameChange(
                        event.target
                          .value
                      )
                    }
                    placeholder="e.g. Solar Street Light"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                {/* SLUG */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Slug
                  </label>

                  <input
                    value={
                      form.slug
                    }
                    onChange={(
                      event
                    ) =>
                      updateField(
                        "slug",
                        event.target
                          .value
                      )
                    }
                    placeholder="solar-street-light"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                {/* CATEGORY */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Category
                  </label>

                  <select
                    value={
                      form.category
                    }
                    onChange={(
                      event
                    ) =>
                      updateField(
                        "category",
                        event.target
                          .value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  >
                    {CATEGORIES.map(
                      (
                        category
                      ) => (
                        <option
                          key={
                            category
                          }
                          value={
                            category
                          }
                        >
                          {
                            category
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* STATUS */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Status
                  </label>

                  <select
                    value={
                      form.status
                    }
                    onChange={(
                      event
                    ) =>
                      updateField(
                        "status",
                        event.target
                          .value as
                          | "DRAFT"
                          | "PUBLISHED"
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="DRAFT">
                      Draft
                    </option>

                    <option value="PUBLISHED">
                      Published
                    </option>
                  </select>
                </div>
              </div>

              {/* PRODUCT IMAGE */}

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Product Image
                  </label>

                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                          <ImagePlus className="h-6 w-6" />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            Upload product image
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            PNG, JPEG or WebP • Maximum 5 MB
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <input
                          ref={
                            fileInputRef
                          }
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={
                            handleImageSelection
                          }
                          className="hidden"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            fileInputRef.current?.click()
                          }
                          disabled={
                            uploadingImage ||
                            saving
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <ImagePlus className="h-4 w-4" />

                          Choose Image
                        </button>

                        <button
                          type="button"
                          onClick={
                            uploadImage
                          }
                          disabled={
                            !selectedImageName ||
                            uploadingImage ||
                            saving
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Upload className="h-4 w-4" />

                          {uploadingImage
                            ? "Uploading..."
                            : "Upload Image"}
                        </button>
                      </div>
                    </div>

                    {selectedImageName && (
                      <div className="mt-4 rounded-xl border border-blue-100 bg-white p-3">
                        <p className="text-xs font-medium text-slate-500">
                          Selected image
                        </p>

                        <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                          {
                            selectedImageName
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* SELECTED IMAGE PREVIEW */}

                {selectedImagePreview && (
                  <div>
                    <p className="mb-2 text-sm font-semibold text-slate-700">
                      Selected Image Preview
                    </p>

                    <div className="h-56 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
                      <img
                        src={
                          selectedImagePreview
                        }
                        alt="Selected product preview"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                )}

                {/* UPLOADED IMAGE */}

                {form.imageUrl && (
                  <div>
                    <p className="mb-2 text-sm font-semibold text-slate-700">
                      Product Image
                    </p>

                    <div className="relative h-56 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
                      <ProductImage
                        src={
                          form.imageUrl
                        }
                        alt="Product image"
                        className="h-full w-full object-contain"
                      />

                      <div className="absolute bottom-3 left-3 right-3 rounded-lg bg-slate-900/75 px-3 py-2 text-xs font-medium text-white">
                        {form.imageUrl}
                      </div>
                    </div>
                  </div>
                )}

                {/* FALLBACK IMAGE PATH */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Image Path / URL
                    <span className="ml-2 text-xs font-normal text-slate-400">
                      Optional fallback
                    </span>
                  </label>

                  <input
                    value={
                      form.imageUrl
                    }
                    onChange={(
                      event
                    ) =>
                      updateField(
                        "imageUrl",
                        event.target
                          .value
                      )
                    }
                    placeholder="/uploads/marketplace/product-image.webp"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    You can upload an image above or enter an existing public image path/URL manually.
                  </p>
                </div>
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  value={
                    form.description
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "description",
                      event.target
                        .value
                    )
                  }
                  rows={5}
                  placeholder="Describe the product, its use, and the value it provides."
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              {/* FEATURED */}

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <input
                  type="checkbox"
                  checked={
                    form.featured
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "featured",
                      event.target
                        .checked
                    )
                  }
                  className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-500"
                />

                <span>
                  <span className="block text-sm font-semibold text-slate-700">
                    Featured Product
                  </span>

                  <span className="block text-xs text-slate-500">
                    Highlight this product
                    on the public
                    Marketplace.
                  </span>
                </span>
              </label>

              {/* ACTIONS */}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={
                    closeForm
                  }
                  disabled={
                    saving ||
                    uploadingImage
                  }
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    uploadingImage
                  }
                  className="rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId !==
                        null
                      ? "Save Changes"
                      : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}