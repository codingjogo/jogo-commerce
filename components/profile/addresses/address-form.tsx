"use client";

import React from "react";
import {
	addressSchema,
	TAddressFormValues,
} from "@/lib/schemas/addressSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";

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
import { capitalizeWords } from "@/lib/helpers";
import { address } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const AddressForm = ({ address }: { address?: address | null }) => {
	const router = useRouter();

	const form = useForm<TAddressFormValues>({
		resolver: zodResolver(addressSchema),
		defaultValues: address || {
			updated_at: new Date(),
			house_number: "",
			street: "",
			barangay: "",
			municipality: "",
			province: "",
			zip_code: "",
			is_default: false,
		},
	});

	const onSubmit: SubmitHandler<TAddressFormValues> = async (
		values: TAddressFormValues
	) => {
		
		try {
			const res = await axios.post('/api/address', values);
			toast.success('Successfully Updated Address')
			if (res.status === 200) {
				setTimeout(() => {
					router.refresh();
					router.push('/profile')
				}, 3000)
			} else {
				toast.error("Failed to edit address")
			}
		} catch (err) {
			console.log("ERROR EDITTING ADDRESS", err)
		}
	};

	const onError = (error: FieldErrors<TAddressFormValues>): void => {
		console.log("SUBMITTING FORM ERROR", error);
	};

	return (
		<>
			<Toaster 
				toastOptions={{
					duration: 2900,
				}}
			/>
		<section className="container pb-16">
			<Card>
				<CardContent className="p-6">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit, onError)}
							className="space-y-8"
						>
							<FormField
								control={form.control}
								name="house_number"
								render={({ field }) => (
									<FormItem>
										<FormLabel>House Number</FormLabel>
										<FormControl>
											<Input
												placeholder="158"
												{...field}
												onChange={(e) => {
													const formattedInput =
														capitalizeWords(
															e.target.value
														);
													field.onChange(
														formattedInput
													);
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="street"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Street</FormLabel>
										<FormControl>
											<Input
												placeholder="Bonifacio St."
												{...field}
												onChange={(e) => {
													const formattedInput =
														capitalizeWords(
															e.target.value
														);
													field.onChange(
														formattedInput
													);
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="barangay"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Barangay</FormLabel>
										<FormControl>
											<Input
												placeholder="Kulapi"
												{...field}
												onChange={(e) => {
													const formattedInput =
														capitalizeWords(
															e.target.value
														);
													field.onChange(
														formattedInput
													);
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="municipality"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Municipality</FormLabel>
										<FormControl>
											<Input
												placeholder="Lucban"
												{...field}
												onChange={(e) => {
													const formattedInput =
														capitalizeWords(
															e.target.value
														);
													field.onChange(
														formattedInput
													);
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="province"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Province</FormLabel>
										<FormControl>
											<Input
												placeholder="Quezon"
												{...field}
												onChange={(e) => {
													const formattedInput =
														capitalizeWords(
															e.target.value
														);
													field.onChange(
														formattedInput
													);
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="zip_code"
								render={({ field }) => (
									<FormItem className="max-w-xs">
										<FormLabel>Zip Code</FormLabel>
										<FormControl>
											<Input
												placeholder="4328"
												{...field}
												onChange={(e) => {
													const formattedInput =
														capitalizeWords(
															e.target.value
														);
													field.onChange(
														formattedInput
													);
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="flex gap-2">
								<Button type="button" variant={'secondary'} onClick={() => router.back()}>
									Cancel
								</Button>
							<Button type="submit" className="px-12">
								{address ? 'Edit' : "Create"}
							</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</section>
		</>
	);
};

export default AddressForm;
