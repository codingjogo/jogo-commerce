import { z } from "zod";

enum PRODUCT_STATUS {
	ACTIVE = "ACTIVE",
	DISCONTINUED = "DISCONTINUED",
}

enum COLOR_SIZES {
	XS = "XS",
	S = "S",
	M = "M",
	L = "L",
	XL = "XL",
	XXL = "XXL",
	XXXL = "XXXL",
	XXXXL = "XXXXL",
}

export const variantSizeSchema = z.object({
	id: z.string().uuid().optional(),
	size: z.nativeEnum(COLOR_SIZES),
	stock: z.coerce.number().min(1, "stock is required"),
	variant_color_id: z.string().uuid().optional(),
});

export const variantColorSchema = z.object({
	id: z.string().uuid().optional(),
	created_at: z.date().optional(),
	color: z.string().min(1, "color is required"),
	images: z.array(z.string()).min(1, "at least one image is required"),
	product_id: z.string().uuid().optional(),
	variant_size: z.array(variantSizeSchema),
});

export const productSchema = z.object({
	id: z.string().uuid().optional(),
	created_at: z.date().optional(),
	updated_at: z.date().optional(),
	name: z.string().min(1, "name is required"),
	slug: z.string().min(1, "slug is required"),
	sku: z.string().min(1, "sku is required"),
	description: z.string().min(1, "description is required"),
	status: z.nativeEnum(PRODUCT_STATUS),
	category_id: z.string().uuid().optional(),
	price: z.coerce.number().min(1, "price is required"),
	variant_color: z.array(variantColorSchema),
});

export type TProductFormValues = z.infer<typeof productSchema>;
