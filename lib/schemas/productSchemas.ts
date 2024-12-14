import { z } from "zod";

export enum PRODUCT_STATUS {
	ACTIVE = "ACTIVE",
	DISCONTINUED = "DISCONTINUED",
}

export enum COLOR_SIZES {
	XS = "XS",
	S = "S",
	M = "M",
	L = "L",
	XL = "XL",
	XXL = "XXL",
	XXXL = "XXXL",
	XXXXL = "XXXXL",
}

export enum SIZE_STATUS {
	IN_STOCK = "IN_STOCK",
	LOW_STOCK = "LOW_STOCK",
	OUT_OF_STOCK = "OUT_OF_STOCK",
}

export const variantSizeSchema = z.object({
	id: z.string().uuid().optional(),
	size: z.nativeEnum(COLOR_SIZES).nullable(),
	stock: z.coerce.number().min(1, "stock is required"),
	status: z.nativeEnum(SIZE_STATUS),
	variant_color_id: z.string().uuid().optional(),
});

export const variantColorSchema = z.object({
	id: z.string().uuid().optional(),
	created_at: z.coerce.date().optional(),
	color: z.string().min(1, "color is required"),
	images: z.array(z.string()).min(1, "at least one image is required"),
	product_id: z.string().uuid().optional(),
	variant_size: z.array(variantSizeSchema).optional(),
});

export const productSchema = z.object({
	id: z.string().uuid().optional(),
	created_at: z.coerce.date().optional(),
	updated_at: z.coerce.date().optional(),
	name: z.string().min(1, "name is required"),
	slug: z.string().min(1, "slug is required"),
	sku: z.string().min(1, "sku is required"),
	description: z.string().min(2, "at least 2 characters").optional(),
	status: z.nativeEnum(PRODUCT_STATUS),
	category_id: z.string().uuid(),
	price: z.coerce.number().min(1, "price is required"),
	variant_color: z.array(variantColorSchema).nonempty(),
});

export type TProductFormValues = z.infer<typeof productSchema>;
