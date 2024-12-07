import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db"; // Ensure the Prisma client is properly configured

export async function GET(req: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category"); // Retrieve the category from the query params

    // Build query conditions
    const whereCondition = category
      ? {
          category: {
            name: category, // Assuming the `name` field in the `category` model is used for filtering
          },
        }
      : {}; // If no category is provided, fetch all products

    // Fetch products
    const products = await prisma.product.findMany({
      where: whereCondition,
      include: {
        category: true, // Include category details if needed
        variant_color: true, // Include related variant data if necessary
      },
    });

    // Respond with the products
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
