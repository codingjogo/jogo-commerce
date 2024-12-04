import { z } from "zod";

export const signUpSchema = z.object({
	id: z.string().uuid().optional(),
	created_at: z.date().optional(),
	updated_at: z.date().optional(),
	first_name: z.string().min(1, "first name"),
	last_name: z.string().min(1, "last name"),
	email: z.string().email(),
});

export type TSignUp = z.infer<typeof signUpSchema>;