import { z } from "zod";

export const bagSchema = z.object({
	id: z.string().uuid().optional(),
	created_at: z.coerce.date().optional(),
	updated_at: z.coerce.date().optional(),
	user_id: z.string(),
	product_id: z.string().uuid(),
	variant_color_id: z.string().uuid(),
	variant_size_id: z.string().uuid().nullable().optional(),
	quantity: z.coerce.number().optional(),
});

export type TBagFormValues = z.infer<typeof bagSchema>;