import {
  NextRequest,
  NextResponse,
} from "next/server";

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { put } from "@vercel/blob";

import { requirePermission } from "@/lib/authorization";

// =======================================================
// MARKETPLACE PRODUCT IMAGE UPLOAD
// =======================================================
//
// This route is separate from SAP's organization-logo
// upload route.
//
// Only PLATFORM users can upload Marketplace images.
// =======================================================

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_TYPES = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
} as const;

// =======================================================
// POST — UPLOAD MARKETPLACE PRODUCT IMAGE
// =======================================================

export async function POST(request: NextRequest) {
  try {
    // ---------------------------------------------------
    // AUTHENTICATION
    // ---------------------------------------------------

    const authenticatedUser =
      await requirePermission(
        request,
        "dashboard"
      );

    // ---------------------------------------------------
    // PLATFORM-ONLY ACCESS
    // ---------------------------------------------------

    if (
      authenticatedUser.scope !==
      "PLATFORM"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only platform administrators can upload Marketplace product images.",
        },
        {
          status: 403,
        }
      );
    }

    // ---------------------------------------------------
    // READ FORM DATA
    // ---------------------------------------------------

    const formData =
      await request.formData();

    const file =
      formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No image file uploaded.",
        },
        {
          status: 400,
        }
      );
    }

    // ---------------------------------------------------
    // FILE TYPE VALIDATION
    // ---------------------------------------------------

    if (
      !Object.prototype.hasOwnProperty.call(
        ALLOWED_TYPES,
        file.type
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid image type. Only PNG, JPEG and WebP images are allowed.",
        },
        {
          status: 400,
        }
      );
    }

    // ---------------------------------------------------
    // FILE SIZE VALIDATION
    // ---------------------------------------------------

    if (file.size === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Uploaded image is empty.",
        },
        {
          status: 400,
        }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Image is too large. Maximum size is 5 MB.",
        },
        {
          status: 400,
        }
      );
    }

    // ---------------------------------------------------
    // CONVERT FILE TO BUFFER
    // ---------------------------------------------------

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    // ---------------------------------------------------
    // SERVER-CONTROLLED EXTENSION
    // ---------------------------------------------------

    const extension =
      ALLOWED_TYPES[
        file.type as keyof typeof ALLOWED_TYPES
      ];

    // ---------------------------------------------------
    // GENERATE UNIQUE SERVER-SIDE FILE NAME
    // ---------------------------------------------------

    const filename =
      `product-${crypto.randomUUID()}.${extension}`;

    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    let publicPath: string;

    if (blobToken) {
      const blob = await put(
        `marketplace/${filename}`,
        buffer,
        {
          access: "public",
          contentType: file.type,
          token: blobToken,
        }
      );

      publicPath = blob.url;
    } else {
      const uploadDirectory = path.join(
        process.cwd(),
        "public",
        "uploads",
        "marketplace"
      );

      await mkdir(uploadDirectory, { recursive: true });
      await writeFile(path.join(uploadDirectory, filename), buffer);
      publicPath = `/uploads/marketplace/${filename}`;
    }

    // ---------------------------------------------------
    // RESPONSE
    // ---------------------------------------------------

    return NextResponse.json({
      success: true,
      path: publicPath,
      url: publicPath,
      filename,
      message:
        "Marketplace product image uploaded successfully.",
    });
  } catch (error) {
    console.error(
      "POST /api/marketplace/upload failed:",
      error
    );

    if (
      error instanceof Error &&
      error.message ===
        "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Authentication required.",
        },
        {
          status: 401,
        }
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "FORBIDDEN"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You do not have permission to upload Marketplace images.",
        },
        {
          status: 403,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Marketplace image upload failed.",
      },
      {
        status: 500,
      }
    );
  }
}