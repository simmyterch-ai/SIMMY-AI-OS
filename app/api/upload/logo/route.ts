import {
  NextRequest,
  NextResponse,
} from "next/server";

import { mkdir, writeFile } from "fs/promises";
import path from "path";

import { requirePermission } from "@/lib/authorization";

// =======================================================
// POST — UPLOAD ORGANIZATION LOGO
// =======================================================

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

const ALLOWED_TYPES = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
} as const;

export async function POST(
  request: NextRequest
) {
  try {
    // Only users with organization permission
    // can upload the organization logo.
    await requirePermission(
      request,
      "organization"
    );

    const formData =
      await request.formData();

    const file =
      formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "No file uploaded.",
        },
        {
          status: 400,
        }
      );
    }

    // ===================================================
    // FILE TYPE VALIDATION
    // ===================================================

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
            "Invalid file type. Only PNG, JPEG and WebP images are allowed.",
        },
        {
          status: 400,
        }
      );
    }

    // ===================================================
    // FILE SIZE VALIDATION
    // ===================================================

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message:
            "File is too large. Maximum size is 2 MB.",
        },
        {
          status: 400,
        }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Uploaded file is empty.",
        },
        {
          status: 400,
        }
      );
    }

    // ===================================================
    // CONVERT FILE TO BUFFER
    // ===================================================

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    // ===================================================
    // USE SERVER-CONTROLLED FILE EXTENSION
    // ===================================================

    const extension =
      ALLOWED_TYPES[
        file.type as keyof typeof ALLOWED_TYPES
      ];

    const filename =
      `organization-logo.${extension}`;

    // ===================================================
    // ENSURE UPLOAD DIRECTORY EXISTS
    // ===================================================

    const uploadDirectory =
      path.join(
        process.cwd(),
        "public",
        "uploads",
        "logos"
      );

    await mkdir(
      uploadDirectory,
      {
        recursive: true,
      }
    );

    // ===================================================
    // SAVE FILE
    // ===================================================

    const uploadPath =
      path.join(
        uploadDirectory,
        filename
      );

    await writeFile(
      uploadPath,
      buffer
    );

    // ===================================================
    // RESPONSE
    // ===================================================

    return NextResponse.json({
      success: true,
      path: `/uploads/logos/${filename}`,
    });
  } catch (error) {
    console.error(
      "POST /api/upload failed:",
      error
    );

    if (
      error instanceof Error &&
      error.message === "UNAUTHORIZED"
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
      error.message === "FORBIDDEN"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You do not have permission to upload the organization logo.",
        },
        {
          status: 403,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Upload failed.",
      },
      {
        status: 500,
      }
    );
  }
}