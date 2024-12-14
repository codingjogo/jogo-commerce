"use client";

import React, { useEffect, useState } from "react";
import { Prisma } from "@prisma/client";
import { FieldErrors, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderFormSchema, TOrderFormValues } from "@/lib/schemas/orderSchemas";
import axios from "axios";
import toast from "react-hot-toast";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import GCASH from "@/public/payment-methods/gcash.jpg";
import MAYA from "@/public/payment-methods/maya.jpg";
import BPI from "@/public/payment-methods/bpi.jpg";

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { AlertCircle, ChevronLeftIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import SuccessMessage from "./success-message";

const CheckoutForm = ({
	bagItems,
	address,
}: {
	bagItems: Prisma.bagGetPayload<{
		include: {
			product: true;
			variant_color: true;
			variant_size: true;
		};
	}>[];
	address: Prisma.addressGetPayload<{
		include: {
			user: true;
		};
	}>;
}) => {
	const [subtotal, setSubtotal] = useState(0);
	const [images, setImages] = useState<string[]>([]);
	const shippingFee = 100;

	const form = useForm<TOrderFormValues>({
		resolver: zodResolver(orderFormSchema),
		defaultValues: {
			user_id: address.user_id,
			payment_method: "",
			proof_of_payment: [],
			landmark: "",
			address_id: address.id,
		},
	});

	const isLoading = form.formState.isLoading || form.formState.isSubmitting;

	const watchPaymentMethod = useWatch({
		control: form.control,
		name: "payment_method",
	});

	const watchProofOfPayment = useWatch({
		control: form.control,
		name: "proof_of_payment",
	});

	const watched = form.watch();
	console.log("watched", watched);

	const onSubmit = async (values: TOrderFormValues) => {
		const response = await axios.post("/api/shop/checkout", values);

		if (response.status !== 201) {
			throw new Error("Error Placing Order");
		}
		toast.success("Successfully Place Order!");
	};

	const isSubmitted = form.formState.isSubmitted

	const onError = (errors: FieldErrors<TOrderFormValues>): void => {
		console.log("errors while submitting form: ", errors);
	};

	const handleUploadSuccess = (
		results: // eslint-disable-next-line
		any
	) => {
		const uploadedImageUrl = results.info.public_id;

		// Update local state
		setImages((prev) => [...prev, uploadedImageUrl]);

		// Update React Hook Form field
		const existingProofs = form.watch("proof_of_payment");
		form.setValue("proof_of_payment", [
			...existingProofs,
			uploadedImageUrl,
		]);
	};

	useEffect(() => {
		const newSubtotal = bagItems.reduce(
			(sum, item) => sum + item.product.price * item.quantity,
			0
		);
		setSubtotal(newSubtotal);
	}, [bagItems]);

	if (isSubmitted) {
	
		return (
			<SuccessMessage />
		);
	}

	return (
		<>
			<Button variant={"outline"} type="button" asChild>
				<Link href={"/shop/bag"}>
					<ChevronLeftIcon />
				</Link>
			</Button>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit, onError)}>
					<div className="md:col-span-2 space-y-8">
						{/* -------------------- */}
						{/* Shipping Form */}
						<h2>Shipping Address</h2>
						<Dialog>
							<DialogTrigger asChild>
								<Card>
									<CardHeader>
										<CardTitle>
											{address.user.first_name}{" "}
											{address.user.last_name}
										</CardTitle>
										<CardDescription>
											{address.user.email}
										</CardDescription>
									</CardHeader>

									<CardContent>
										{address.house_number} {address.street}{" "}
										{address.barangay}{" "}
										{address.municipality}{" "}
										{address.province} {address.zip_code}
									</CardContent>
								</Card>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>
										Are you absolutely sure?
									</DialogTitle>
									<DialogDescription>
										This action cannot be undone. This will
										permanently delete your account and
										remove your data from our servers.
									</DialogDescription>
								</DialogHeader>
							</DialogContent>
						</Dialog>

						{/* Landmark Input */}
						<div>
							<FormField
								control={form.control}
								name="landmark"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Landmark</FormLabel>
										<FormControl>
											<Input
												placeholder="Sa tindahan ni aling nena"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Rider will easily be able to find
											your home.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* End of Shipping Form */}
						{/* -------------------- */}

						{/* -------------------- */}
						{/* <PaymentInstructions /> */}
						<div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
							<h2 className="text-2xl font-bold mb-6">
								How to Complete Your Payment
							</h2>

							<div className="space-y-6">
								<div>
									<h3 className="text-lg font-semibold mb-2">
									Step 1: <span className="text-red-500">(required)</span> Select Your Payment Method
									</h3>

									<FormField
										control={form.control}
										name="payment_method"
										render={({ field }) => (
											<FormItem className="space-y-3">
												<FormLabel>
													Notify me about...
												</FormLabel>
												<FormControl>
													<RadioGroup
														onValueChange={
															field.onChange
														}
														defaultValue={
															field.value
														}
														className="flex flex-col space-y-1"
													>
														<FormItem className="flex items-center space-x-3 space-y-0">
															<FormControl>
																<RadioGroupItem value="GCASH" />
															</FormControl>
															<FormLabel className="font-normal">
																GCASH
															</FormLabel>
														</FormItem>
														<FormItem className="flex items-center space-x-3 space-y-0">
															<FormControl>
																<RadioGroupItem value="MAYA" />
															</FormControl>
															<FormLabel className="font-normal">
																MAYA
															</FormLabel>
														</FormItem>
														<FormItem className="flex items-center space-x-3 space-y-0">
															<FormControl>
																<RadioGroupItem value="BPI" />
															</FormControl>
															<FormLabel className="font-normal">
																BPI
															</FormLabel>
														</FormItem>
													</RadioGroup>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{form.getValues().payment_method && (
									<>
										<div>
											<h3 className="text-lg font-semibold mb-2">
												Step 2: Pay Using the QR Code
											</h3>
											<ol className="list-decimal list-inside space-y-2">
												<li>
													A unique QR code will be
													displayed on your screen
													after confirming your order.
												</li>
												<li>
													Take a screenshot of this QR
													code.
												</li>
												<li>
													Open your chosen payment app
													({watchPaymentMethod}
													).
												</li>
												<li>
													Upload or scan the QR code
													to complete the payment.
												</li>
											</ol>
										</div>

										<div>
											<h3 className="text-lg font-semibold mb-2">
												Step 3: <span className="text-red-500">(required)</span> Upload Your Payment
												Receipt
											</h3>
											<ol className="list-decimal list-inside space-y-2 mb-4">
												<li>
													After completing the
													payment, take a screenshot
													of the payment receipt or
													confirmation screen.
												</li>
												<li>
													Ensure the following details
													are visible on the receipt:
													<ul className="list-disc list-inside ml-4">
														<li>Amount paid</li>
														<li>
															Transaction
															ID/reference number
														</li>
														<li>
															Date and time of
															payment
														</li>
														<li>
															Payment method (
															{watchPaymentMethod}
															)
														</li>
													</ul>
													<p className="text-muted-foreground">
														Please click the image
														below:
													</p>
													<div className="flex gap-2">
														{/* Gcash, maya, BPI */}
														<Link
															href={
																"/shop/checkout/gcash"
															}
															target="_blank"
														>
															<Image
																src={GCASH}
																width={160}
																height={160}
																alt="GCASH-image"
															/>
														</Link>
														<Link
															href={
																"/shop/checkout/maya"
															}
															target="_blank"
														>
															<Image
																src={MAYA}
																width={160}
																height={160}
																alt="GCASH-image"
															/>
														</Link>

														<Link
															href={
																"/shop/checkout/bpi"
															}
															target="_blank"
														>
															<Image
																src={BPI}
																width={160}
																height={160}
																alt="GCASH-image"
															/>
														</Link>
													</div>
												</li>
												<li>
													<span className="text-red-500">(required)</span> Upload the receipt
													screenshot in the section
													below.
												</li>
											</ol>
											<div className="space-y-2">
												<CldUploadWidget
													uploadPreset="soule-psycle-products"
													onSuccess={
														handleUploadSuccess
													}
												>
													{({ open }) => (
														<Button
															type="button"
															onClick={() =>
																open()
															}
														>
															Upload Images
														</Button>
													)}
												</CldUploadWidget>

												{/* Image Previews */}
												<div className="flex gap-2 flex-wrap">
													{images.map(
														(url, index) => (
															<div
																key={index}
																className="relative h-32 aspect-square"
															>
																<CldImage
																	src={url}
																	alt={`Proof ${
																		index +
																		1
																	}`}
																	fill
																	className="object-cover rounded"
																/>
																<Button
																	type="button"
																	onClick={() => {
																		// Remove image from state
																		setImages(
																			(
																				prev
																			) =>
																				prev.filter(
																					(
																						_,
																						i
																					) =>
																						i !==
																						index
																				)
																		);

																		// Update React Hook Form
																		form.setValue(
																			"proof_of_payment",
																			form
																				.watch(
																					"proof_of_payment"
																				)
																				.filter(
																					(
																						_,
																						i
																					) =>
																						i !==
																						index
																				)
																		);
																	}}
																	variant={
																		"destructive"
																	}
																	className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
																>
																	<Trash2 />
																</Button>
															</div>
														)
													)}
												</div>
											</div>
										</div>

										<div>
											<h3 className="text-lg font-semibold mb-2">
												Step 4: Wait for Admin
												Confirmation
											</h3>
											<ul className="list-disc list-inside space-y-2">
												<li>
													Once you&apos;ve uploaded
													the receipt, our admin will
													review your payment and
													confirm your order.
												</li>
												<li>
													You&apos;ll receive a
													notification once your order
													has been verified.
												</li>
											</ul>
										</div>

										<Alert>
											<AlertTitle>
												Important Reminders:
											</AlertTitle>
											<AlertDescription>
												<ol className="list-decimal list-inside space-y-1">
													<li>
														Use the correct QR code
														displayed on the
														checkout page. Payments
														sent to the wrong QR
														code will not be
														refunded.
													</li>
													<li>
														Ensure the receipt is
														clear and all required
														details are visible.
													</li>
													<li>
														Do not close the order
														page until you&apos;ve
														uploaded the payment
														receipt.
													</li>
												</ol>
											</AlertDescription>
										</Alert>
									</>
								)}
							</div>

							{!form.getValues().payment_method && (
								<Alert className="mt-6">
									<AlertCircle className="h-4 w-4" />
									<AlertTitle>
										Please select a payment method
									</AlertTitle>
									<AlertDescription>
										Choose GCash, PayMaya, or BPI to see
										further instructions.
									</AlertDescription>
								</Alert>
							)}
						</div>
						{/* -------------------- */}
						{/* End of <PaymentInstructions /> */}

						{/* Order Summary */}
						<div className="md:col-span-1">
							<div className="bg-gray-50 p-6 rounded-lg">
								<h2 className="text-xl font-semibold mb-4">
									Order Summary
								</h2>
								<div className="space-y-4 mb-4">
									{bagItems.map((item) => (
										<div
											key={item.id}
											className="flex items-center space-x-4"
										>
											<CldImage
												src={
													item.variant_color.images[0]
												}
												alt={item.product.name}
												width={50}
												height={50}
												className="rounded-md"
											/>
											<div className="flex-grow">
												<h3 className="font-semibold text-sm">
													{item.product.name}
												</h3>
												<p className="text-xs text-gray-500">
													Color:{" "}
													{item.variant_color.color},
													Size:{" "}
													{item.variant_size?.size}
												</p>
												<p className="text-sm">
													Quantity: {item.quantity}
												</p>
											</div>
											<span className="text-sm font-medium">
												₱
												{(
													item.product.price *
													item.quantity
												).toFixed(2)}
											</span>
										</div>
									))}
								</div>
								<div className="space-y-2 mb-4">
									<div className="flex justify-between">
										<span>Subtotal</span>
										<span>₱{subtotal.toFixed(2)}</span>
									</div>
									<div className="flex justify-between">
										<span>Shipping Fee</span>
										<span>₱{shippingFee.toFixed(2)}</span>
									</div>
									<div className="flex justify-between font-semibold text-lg">
										<span>Total</span>
										<span>
											₱
											{(subtotal + shippingFee).toFixed(
												2
											)}
										</span>
									</div>
								</div>
								<Button
									className="w-full"
									type="submit"
									disabled={isLoading || !watchPaymentMethod || watchProofOfPayment.length === 0}
								>
									{isLoading
										? "Please wait..."
										: "Place Order"}
								</Button>
							</div>
						</div>
					</div>
				</form>
			</Form>
		</>
	);
};

export default CheckoutForm;
