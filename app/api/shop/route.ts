import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db"; // Ensure the Prisma client is properly configured

export async function GET(req: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const query = searchParams.get("q")?.toLowerCase() || ""; // Default to an empty string if no query

    // Build query conditions
    // eslint-disable-next-line
    const whereCondition: any = {
      AND: [
        category
          ? { category: { name: category } }
          : {}, // Filter by category if provided
        query
          ? { name: { contains: query, mode: "insensitive" } }
          : {}, // Filter by query if provided
      ],
    };

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
