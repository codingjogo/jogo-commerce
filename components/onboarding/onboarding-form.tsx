"use client";

import {
	onboardingSchema,
	TOnboardingFormValues,
} from "@/lib/schemas/onboardingSchemas";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { FieldErrors, SubmitHandler, useForm, useWatch } from "react-hook-form";
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
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { capitalizeWords } from "@/lib/helpers";
import { completeOnboarding } from "@/app/(root)/onboarding/_actions";

const OnboardingForm = () => {
	const { user } = useUser();
	const router = useRouter();

	const form = useForm<TOnboardingFormValues>({
		resolver: zodResolver(onboardingSchema),
		defaultValues: {
			metadata: {
				onboardingComplete: true,
				address: {
					house_number: "",
					street: "",
					barangay: "",
					municipality: "",
					province: "",
					zip_code: "",
					is_default: true,
				},
				isAcceptTermsAndConditions: false,
			},
		},
	});

	const isSubmitting = form.formState.isSubmitting;
	const isAcceptTermsAndConditions = useWatch({
		control: form.control,
		name: "metadata.isAcceptTermsAndConditions",
	});

	const onSubmit: SubmitHandler<TOnboardingFormValues> = async (
		values: TOnboardingFormValues
	) => {
		console.log('values', values);

		const res = await completeOnboarding(values)
		if (res?.message) {
			// Reloads the user's data from the Clerk API
			await user?.reload();
			toast.success("Created Successfully");

			setTimeout(() => {
				router.push("/");
			}, 1000);
		}

		if (res?.error) {
			toast.error(res.error);
		}
	};

	const onError = (error: FieldErrors<TOnboardingFormValues>): void => {
		console.log("onError", error);
	};

	return (
		<>
			<Toaster
				toastOptions={{
					duration: 900,
				}}
			/>
			<Card>
				<CardHeader>
					<CardTitle>Please complete the following inputs</CardTitle>
					<CardDescription>
						These inputs are required before using our system.
					</CardDescription>
				</CardHeader>

				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit, onError)}
							className="space-y-8"
						>
							<FormField
								control={form.control}
								name="metadata.address.house_number"
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
								name="metadata.address.street"
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
								name="metadata.address.barangay"
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
								name="metadata.address.municipality"
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
								name="metadata.address.province"
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
								name="metadata.address.zip_code"
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

							<FormField
								control={form.control}
								name="metadata.isAcceptTermsAndConditions"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>
												Accept terms and conditions
											</FormLabel>
										</div>
									</FormItem>
								)}
							/>

							<Button
								type="submit"
								className="w-[320px] max-w-xs"
								disabled={
									isSubmitting || !isAcceptTermsAndConditions
								}
							>
								{!isSubmitting && !isAcceptTermsAndConditions
									? "Input fields are required" : 'Finish'}
								{isSubmitting && "Submitting"}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</>
	);
};

export default OnboardingForm;
