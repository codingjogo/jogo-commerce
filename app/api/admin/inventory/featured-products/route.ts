import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
	try {
		const featuredProducts = await prisma.featured_product.findMany({
			include: {
				product: {
					include: {
						variant_color: true,
					},
				},
			},
		});

		return NextResponse.json({featuredProducts, method: req.method}, { status: 200 });
	} catch (error) {
		console.error("Error fetching featured products:", error);
		return NextResponse.json(
			{ message: "Failed to fetch featured products" },
			{ status: 500 }
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { productId } = body;

		if (!productId) {
			return NextResponse.json(
				{ message: "Product ID is required." },
				{ status: 400 }
			);
		}

		// Check if the product exists
		const product = await prisma.product.findUnique({
			where: { id: productId },
		});

		if (!product) {
			return NextResponse.json(
				{ message: "Product not found." },
				{ status: 404 }
			);
		}

		// Add product to featured_product table
		const featuredProduct = await prisma.featured_product.create({
			data: {
				product_id: productId,
			},
		});

		return NextResponse.json(
			{ message: "Product added to featured list.", featuredProduct },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error adding featured product:", error);
		return NextResponse.json(
			{ message: "Internal server error." },
			{ status: 500 }
		);
	}
}

export async function DELETE(req: NextRequest) {
	try {
		// Extract the `id` from the query parameters
		const { searchParams } = new URL(req.url);
		const productId = searchParams.get("id");

		if (!productId) {
			return NextResponse.json(
				{ message: "Product ID is required" },
				{ status: 400 }
			);
		}

		// Delete the featured product from the database
		const deletedProduct = await prisma.featured_product.delete({
			where: {
				id: productId,
			},
		});

		return NextResponse.json(
			{
				message: "Featured product removed successfully",
				deletedProduct,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error removing featured product:", error);
		return NextResponse.json(
			{ message: "Failed to remove featured product", error },
			{ status: 500 }
		);
	}
}
