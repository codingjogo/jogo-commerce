import prisma from "@/lib/db";
import { productSchema } from "@/lib/schemas/productSchemas";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
	req: NextRequest,
	{ params }: { params: { productId: string } }
) {
	try {
		const json = await req.json();

		const validatedData = productSchema.parse(json);

		const { name, description, price, sku, slug, status, category_id } =
			validatedData;

		const variant_colors = validatedData.variant_color;

		const data = await prisma.product.update({
			where: { id: params.productId },
			data: {
				name,
				description,
				price,
				sku,
				slug,
				status,
				category_id,
				updated_at: new Date(),
				variant_color: {
					deleteMany: {},
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

		return NextResponse.json({ data }, { status: 201 });
	} catch (err) {
		console.log("ERROR ROUTE POST [admin_inventory]", err);
		return NextResponse.json("ERROR ROUTE POST [admin_inventory]", {
			status: 400,
		});
	}
}