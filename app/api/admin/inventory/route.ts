import prisma from "@/lib/db";
import { productSchema } from "@/lib/schemas/productSchemas";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const json = await req.json();

		const validatedData = productSchema.parse(json);

		const { name, description, price, sku, slug, status, category_id } =
			validatedData;

		const variant_colors = validatedData.variant_color;

		const data = await prisma.product.create({
			data: {
				name,
				description,
				price,
				sku,
				slug,
				status,
				category_id,
				variant_color: {
					create: variant_colors.map((variant_color) => ({
						color: variant_color.color,
						images: variant_color.images,
						variant_size: {
							create: variant_color.variant_size?.map(
								(variant_size) => ({
									size: variant_size.size,
									stock: variant_size.stock,
									status: variant_size.status,
								})
							),
						},
					})),
				},
			},
		});

		return NextResponse.json(
			{ data },
			{ status: 201 }
		);
	} catch (err) {
		console.log("ERROR ROUTE POST [admin_inventory]", err);
		return NextResponse.json("ERROR ROUTE POST [admin_inventory]", {
			status: 400,
		});
	}
}

export async function DELETE(req: Request) {
  try {
    // Parse the query parameter from the request URL
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

		console.log('Product ID to Delete', id)

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const deletedProduct = await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Product deleted successfully", deletedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the product" },
      { status: 500 }
    );
  }
}