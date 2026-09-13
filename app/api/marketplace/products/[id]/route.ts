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
// MARKETPLACE IMAGE CLEANUP
// =======================================================

async function deleteLocalMarketplaceImage(
  imageUrl: unknown
) {
  if (
    typeof imageUrl !== "string" ||
    !imageUrl.trim()
  ) {
    return;
  }

  const cleanImageUrl =
    imageUrl.trim();

  try {
    const url =
      new URL(
        cleanImageUrl,
        "http://localhost"
      );

    const pathname =
      decodeURIComponent(
        url.pathname
      );

    // Only clean images belonging to the
    // Marketplace upload directory.
    if (
      !pathname.startsWith(
        "/uploads/marketplace/"
      )
    ) {
      return;
    }

    const marketplaceDirectory =
      path.resolve(
        process.cwd(),
        "public",
        "uploads",
        "marketplace"
      );

    const filename =
      path.basename(pathname);

    if (!filename) {
      return;
    }

    const filePath =
      path.resolve(
        marketplaceDirectory,
        filename
      );

    // Security check:
    // ensure the resolved file is directly
    // inside public/uploads/marketplace.
    if (
      path.dirname(filePath) !==
      marketplaceDirectory
    ) {
      console.warn(
        "Marketplace image cleanup skipped unsafe path:",
        imageUrl
      );

      return;
    }

    await unlink(filePath);

    console.log(
      "Marketplace image deleted:",
      filePath
    );
  } catch (error) {
    // If the file does not exist, there is
    // nothing left to clean.
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code ===
        "ENOENT"
    ) {
      return;
    }

    // Image cleanup must never cause a
    // successful product deletion to fail.
    console.error(
      "Marketplace image cleanup failed:",
      error
    );
  }
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

    // If the product received a different
    // local uploaded image, clean up the old one.
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

    await prisma.marketplaceProduct.delete(
      {
        where: {
          id: productId,
        },
      }
    );

    // Delete the associated local image
    // after the database record is successfully removed.
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