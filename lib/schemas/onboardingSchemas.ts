import { z } from "zod";

export const addressSchema = z.object({
	house_number: z.string().min(1, "house number is required"),
	street: z.string().min(1, "street is required"),
	barangay: z.string().min(1, "barangay is required"),
	municipality: z.string().min(1, "municipality is required"),
	province: z.string().min(1, "province is required"),
	zip_code: z
		.string()
		.min(1, "zip code is required")
		.max(4, "zip code contains 4 characters only"),
	is_default: z.boolean(),
});

export const onboardingSchema = z.object({
	metadata: z.object({
		onboardingComplete: z.boolean(),
		address: addressSchema,
		isAcceptTermsAndConditions: z.boolean()
	}),
});

export type TOnboardingFormValues = z.infer<typeof onboardingSchema>;
