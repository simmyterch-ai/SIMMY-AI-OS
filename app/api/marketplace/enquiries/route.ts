import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// =======================================================
// POST — PUBLIC MARKETPLACE PRODUCT ENQUIRY
// =======================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      productId,
      productName,
      customerName,
      email,
      phone,
      country,
      quantity,
      message,
    } = body;

    // ---------------------------------------------------
    // Required fields
    // ---------------------------------------------------

    if (
      !customerName ||
      !email ||
      !phone ||
      !country ||
      !message
    ) {
      return NextResponse.json(
        {
          error:
            "Customer name, email, phone, country, and message are required.",
        },
        {
          status: 400,
        }
      );
    }

    // ---------------------------------------------------
    // Clean input
    // ---------------------------------------------------

    const cleanCustomerName = String(customerName).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPhone = String(phone).trim();
    const cleanCountry = String(country).trim();
    const cleanMessage = String(message).trim();

    const cleanProductName = productName
      ? String(productName).trim()
      : "";

    // ---------------------------------------------------
    // Validate required values after trimming
    // ---------------------------------------------------

    if (
      !cleanCustomerName ||
      !cleanEmail ||
      !cleanPhone ||
      !cleanCountry ||
      !cleanMessage
    ) {
      return NextResponse.json(
        {
          error:
            "Customer name, email, phone, country, and message cannot be empty.",
        },
        {
          status: 400,
        }
      );
    }

    // ---------------------------------------------------
    // Basic email validation
    // ---------------------------------------------------

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      return NextResponse.json(
        {
          error: "Please provide a valid email address.",
        },
        {
          status: 400,
        }
      );
    }

    // ---------------------------------------------------
    // Quantity validation
    // ---------------------------------------------------

    let cleanQuantity: number | null = null;

    if (
      quantity !== undefined &&
      quantity !== null &&
      quantity !== ""
    ) {
      const parsedQuantity = Number(quantity);

      if (
        !Number.isInteger(parsedQuantity) ||
        parsedQuantity < 1
      ) {
        return NextResponse.json(
          {
            error:
              "Quantity must be a whole number greater than zero.",
          },
          {
            status: 400,
          }
        );
      }

      cleanQuantity = parsedQuantity;
    }

    // ---------------------------------------------------
    // Product validation
    // ---------------------------------------------------

    let linkedProductId: number | null = null;
    let finalProductName = cleanProductName;

    if (productId !== undefined && productId !== null) {
      const parsedProductId = Number(productId);

      if (
        !Number.isInteger(parsedProductId) ||
        parsedProductId < 1
      ) {
        return NextResponse.json(
          {
            error: "Invalid product ID.",
          },
          {
            status: 400,
          }
        );
      }

      const product =
        await prisma.marketplaceProduct.findFirst({
          where: {
            id: parsedProductId,
            status: "PUBLISHED",
          },
        });

      if (!product) {
        return NextResponse.json(
          {
            error:
              "The selected marketplace product is not available.",
          },
          {
            status: 404,
          }
        );
      }

      linkedProductId = product.id;
      finalProductName = product.name;
    }

    // ---------------------------------------------------
    // Product name fallback
    // ---------------------------------------------------

    if (!finalProductName) {
      return NextResponse.json(
        {
          error: "Product name is required.",
        },
        {
          status: 400,
        }
      );
    }

    // ---------------------------------------------------
    // Create enquiry
    // ---------------------------------------------------

    const enquiry =
      await prisma.marketplaceEnquiry.create({
        data: {
          productId: linkedProductId,
          productName: finalProductName,
          customerName: cleanCustomerName,
          email: cleanEmail,
          phone: cleanPhone,
          country: cleanCountry,
          quantity: cleanQuantity,
          message: cleanMessage,
          status: "NEW",
        },
      });

    // ---------------------------------------------------
    // Success
    // ---------------------------------------------------

    return NextResponse.json(
      {
        success: true,
        message:
          "Your enquiry has been submitted successfully. SIMMY LINK AFRICA will contact you shortly.",
        enquiryId: enquiry.id,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Marketplace enquiry submission error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to submit your enquiry at this time. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}