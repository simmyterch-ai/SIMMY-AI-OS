import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  unlink,
} from "fs/promises";

import path from "path";

import {
  prisma,
} from "@/lib/prisma";

import {
  requirePermission,
} from "@/lib/authorization";

// =======================================================
// HELPERS
// =======================================================

function getErrorStatus(
  error: unknown
): number {
  if (
    error &&
    typeof error === "object" &&
    "status" in error
  ) {
    const status = Number(
      (error as { status?: unknown }).status
    );

    if (
      Number.isInteger(status) &&
      status >= 400 &&
      status <= 599
    ) {
      return status;
    }
  }

  if (error instanceof Error) {
    const message =
      error.message.toLowerCase();

    if (
      message.includes("unauthorized") ||
      message.includes("authentication") ||
      message.includes("not authenticated")
    ) {
      return 401;
    }

    if (
      message.includes("forbidden") ||
      message.includes("permission") ||
      message.includes("not allowed")
    ) {
      return 403;
    }
  }

  return 500;
}

function safeErrorMessage(
  error: unknown,
  fallback: string
): string {
  const status =
    getErrorStatus(error);

  if (status === 401) {
    return "Authentication required.";
  }

  if (status === 403) {
    return "You do not have permission to perform this action.";
  }

  if (
    error instanceof Error &&
    error.message ===
      "Marketplace product not found."
  ) {
    return error.message;
  }

  return fallback;
}

async function getProductId(
  context: {
    params: Promise<{
      id: string;
    }>;
  }
): Promise<number | null> {
  const { id } =
    await context.params;

  const productId =
    Number(id);

  if (
    !Number.isInteger(productId) ||
    productId <= 0
  ) {
    return null;
  }

  return productId;
}

// =======================================================
// PLATFORM ACCESS
// =======================================================

async function requirePlatformUser(
  request: NextRequest
) {
  const authenticatedUser =
    await requirePermission(
      request,
      "dashboard"
    );

  if (
    authenticatedUser.scope !==
    "PLATFORM"
  ) {
    throw new Error(
      "FORBIDDEN"
    );
  }

  return authenticatedUser;
}

// =======================================================
// MARKETPLACE IMAGE CLEANUP
// =======================================================

async function deleteLocalMarketplaceImage(
  imageUrl: unknown
): Promise<void> {
  /*
   * Only delete images that belong to:
   *
   * /uploads/marketplace/
   *
   * External URLs are ignored.
   */

  if (
    typeof imageUrl !== "string" ||
    !imageUrl.trim()
  ) {
    return;
  }

  try {
    const parsedUrl =
      new URL(
        imageUrl,
        "http://localhost"
      );

    const pathname =
      decodeURIComponent(
        parsedUrl.pathname
      );

    const marketplaceDirectory =
      path.resolve(
        process.cwd(),
        "public",
        "uploads",
        "marketplace"
      );

    const filename =
      path.basename(
        pathname
      );

    const resolvedFilePath =
      path.resolve(
        marketplaceDirectory,
        filename
      );

    /*
     * Security check:
     *
     * Make sure the resolved file is actually
     * inside public/uploads/marketplace.
     */

    if (
      path.dirname(
        resolvedFilePath
      ) !== marketplaceDirectory
    ) {
      return;
    }

    /*
     * Only process our Marketplace upload path.
     */

    if (
      !pathname.startsWith(
        "/uploads/marketplace/"
      )
    ) {
      return;
    }

    await unlink(
      resolvedFilePath
    );

    console.log(
      "Marketplace image deleted:",
      resolvedFilePath
    );
  } catch (error: unknown) {
    /*
     * If the image has already been removed,
     * deletion is considered successful.
     *
     * We deliberately do not fail the product
     * deletion because of a missing image file.
     */

    const code =
      error &&
      typeof error === "object" &&
      "code" in error
        ? (error as { code?: unknown }).code
        : undefined;

    if (code === "ENOENT") {
      return;
    }

    console.error(
      "Failed to delete Marketplace image:",
      error
    );
  }
}

// =======================================================
// GET - GET ONE MARKETPLACE PRODUCT
// PUBLIC
// =======================================================

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const productId =
      await getProductId(
        context
      );

    if (
      productId === null
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid marketplace product ID.",
        },
        {
          status: 400,
        }
      );
    }

    const product =
      await prisma.marketplaceProduct.findFirst(
        {
          where: {
            id: productId,
            status: "PUBLISHED",
          },
        }
      );

    if (!product) {
      return NextResponse.json(
        {
          error:
            "Marketplace product not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      product,
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    const status =
      getErrorStatus(error);

    console.error(
      "GET /api/marketplace/products/[id] error:",
      error
    );

    return NextResponse.json(
      {
        error: safeErrorMessage(
          error,
          "Failed to fetch marketplace product."
        ),
      },
      {
        status,
      }
    );
  }
}

// =======================================================
// PUT - UPDATE MARKETPLACE PRODUCT
// PLATFORM USERS ONLY
// =======================================================

export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    await requirePlatformUser(
      request
    );

    const productId =
      await getProductId(
        context
      );

    if (
      productId === null
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid marketplace product ID.",
        },
        {
          status: 400,
        }
      );
    }

    const existingProduct =
      await prisma.marketplaceProduct.findUnique(
        {
          where: {
            id: productId,
          },
        }
      );

    if (!existingProduct) {
      return NextResponse.json(
        {
          error:
            "Marketplace product not found.",
        },
        {
          status: 404,
        }
      );
    }

    let body: unknown;

    try {
      body =
        await request.json();
    } catch {
      return NextResponse.json(
        {
          error:
            "Invalid JSON request.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid request body.",
        },
        {
          status: 400,
        }
      );
    }

    const data =
      body as Record<
        string,
        unknown
      >;

    const updateData: {
      name?: string;
      slug?: string;
      category?: string;
      description?: string;
      imageUrl?: string;
      status?: string;
      featured?: boolean;
    } = {};

    if (
      typeof data.name ===
      "string"
    ) {
      const value =
        data.name.trim();

      if (value) {
        updateData.name =
          value;
      }
    }

    if (
      typeof data.slug ===
      "string"
    ) {
      const value =
        data.slug.trim();

      if (value) {
        updateData.slug =
          value;
      }
    }

    if (
      typeof data.category ===
      "string"
    ) {
      const value =
        data.category.trim();

      if (value) {
        updateData.category =
          value;
      }
    }

    if (
      typeof data.description ===
      "string"
    ) {
      const value =
        data.description.trim();

      if (value) {
        updateData.description =
          value;
      }
    }

    if (
      typeof data.imageUrl ===
      "string"
    ) {
      const value =
        data.imageUrl.trim();

      if (value) {
        updateData.imageUrl =
          value;
      }
    }

    if (
      data.status ===
        "DRAFT" ||
      data.status ===
        "PUBLISHED"
    ) {
      updateData.status =
        data.status;
    }

    if (
      typeof data.featured ===
      "boolean"
    ) {
      updateData.featured =
        data.featured;
    }

    if (
      Object.keys(
        updateData
      ).length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "No valid fields were provided for update.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      updateData.slug &&
      updateData.slug !==
        existingProduct.slug
    ) {
      const slugExists =
        await prisma.marketplaceProduct.findFirst(
          {
            where: {
              slug:
                updateData.slug,
              NOT: {
                id: productId,
              },
            },
          }
        );

      if (slugExists) {
        return NextResponse.json(
          {
            error:
              "A marketplace product with this slug already exists.",
          },
          {
            status: 409,
          }
        );
      }
    }

    const product =
      await prisma.marketplaceProduct.update(
        {
          where: {
            id: productId,
          },
          data: updateData,
        }
      );

    /*
     * If the product image was replaced,
     * remove the previous locally uploaded image.
     *
     * External URLs are never deleted.
     */

    if (
      updateData.imageUrl &&
      updateData.imageUrl !==
        existingProduct.imageUrl
    ) {
      await deleteLocalMarketplaceImage(
        existingProduct.imageUrl
      );
    }

    return NextResponse.json(
      product,
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    const status =
      getErrorStatus(error);

    console.error(
      "PUT /api/marketplace/products/[id] error:",
      error
    );

    return NextResponse.json(
      {
        error: safeErrorMessage(
          error,
          "Failed to update marketplace product."
        ),
      },
      {
        status,
      }
    );
  }
}

// =======================================================
// DELETE - DELETE MARKETPLACE PRODUCT
// PLATFORM USERS ONLY
// =======================================================

export async function DELETE(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    await requirePlatformUser(
      request
    );

    const productId =
      await getProductId(
        context
      );

    if (
      productId === null
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid marketplace product ID.",
        },
        {
          status: 400,
        }
      );
    }

    const existingProduct =
      await prisma.marketplaceProduct.findUnique(
        {
          where: {
            id: productId,
          },
        }
      );

    if (!existingProduct) {
      return NextResponse.json(
        {
          error:
            "Marketplace product not found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Delete the database record first.
     *
     * Image cleanup is intentionally handled
     * afterward so an image-file problem does
     * not prevent the product from being deleted.
     */

    await prisma.marketplaceProduct.delete(
      {
        where: {
          id: productId,
        },
      }
    );

    /*
     * Remove the associated local Marketplace
     * image, if it is one of our uploads.
     */

    await deleteLocalMarketplaceImage(
      existingProduct.imageUrl
    );

    return NextResponse.json(
      {
        message:
          "Marketplace product and associated image deleted successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    const status =
      getErrorStatus(error);

    console.error(
      "DELETE /api/marketplace/products/[id] error:",
      error
    );

    return NextResponse.json(
      {
        error: safeErrorMessage(
          error,
          "Failed to delete marketplace product."
        ),
      },
      {
        status,
      }
    );
  }
}