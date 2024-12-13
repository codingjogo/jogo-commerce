"use client";

import { bagSchema, TBagFormValues } from "@/lib/schemas/bagSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useEffect } from "react";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const AddToBag = ({
	clerk_user_id,
	product_id,
	variant_color_id,
	variant_size_id,
}: {
	clerk_user_id: string;
	product_id: string;
	variant_color_id: string;
	variant_size_id?: string | null;
}) => {
	const router = useRouter();
	const form = useForm<TBagFormValues>({
		resolver: zodResolver(bagSchema),
		defaultValues: {
			user_id: clerk_user_id,
			product_id: product_id,
			variant_color_id: variant_color_id,
			variant_size_id: variant_size_id || null,
		},
	});

	const isLoading = form.formState.isLoading || form.formState.isSubmitting;

	const onSubmit: SubmitHandler<TBagFormValues> = async (
		values: TBagFormValues
	) => {
		try {
			const response = await axios.post("/api/shop/bag", values);

			if (response.status === 200) {
				toast.success("Successfully Added to Bag.");

				setTimeout(() => {
					router.refresh();
				}, 3000)
			} else {
				toast.error("Failed to Add.");
			}
		} catch (error) {
			console.log("Error submitting form", error);
			toast.error("Failed to Add.");
		}
	};

	const onError = (error: FieldErrors<TBagFormValues>): void => {
		console.log("Form Errors: ", error);
	};

	const { reset } = form;

	// Update form values when props change
	useEffect(() => {
		reset({
			user_id: clerk_user_id,
			product_id: product_id,
			variant_color_id: variant_color_id,
			variant_size_id: variant_size_id || null,
		});
		console.log("Add to Bag Button: ", {
			user_id: clerk_user_id,
			product_id,
			variant_color_id,
			variant_size_id,
		});
	}, [clerk_user_id, product_id, variant_color_id, variant_size_id, reset]);

	return (
		<>
			<Toaster />

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit, onError)}
					className="flex-1"
				>
					<FormField
						control={form.control}
						name="user_id"
						render={({ field }) => (
							<FormItem className="hidden">
								<FormLabel>User ID</FormLabel>
								<FormControl>
									<Input placeholder="User ID" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="product_id"
						render={({ field }) => (
							<FormItem className="hidden">
								<FormLabel>Product ID</FormLabel>
								<FormControl>
									<Input
										placeholder="Product ID"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="variant_color_id"
						render={({ field }) => (
							<FormItem className="hidden">
								<FormLabel>Variant Color ID</FormLabel>
								<FormControl>
									<Input
										placeholder="Variant Color ID"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{variant_size_id && (
						<FormField
							control={form.control}
							name="variant_size_id"
							render={({ field }) => (
								<FormItem className="hidden">
									<FormControl>
										<Input
											{...field}
											value={variant_size_id || ""}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					)}

					<Button
						type="submit"
						className="w-full"
						disabled={isLoading}
					>
						{isLoading ? "Adding to bag" : "Add to Bag"}
					</Button>
				</form>
			</Form>
		</>
	);
};

export default AddToBag;
