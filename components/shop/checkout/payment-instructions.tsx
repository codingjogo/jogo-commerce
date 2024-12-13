"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";
import GCASH from "@/public/payment-methods/gcash.jpg";
import MAYA from "@/public/payment-methods/maya.jpg";
import BPI from "@/public/payment-methods/bpi.jpg";
import Link from "next/link";
import { CldUploadWidget } from "next-cloudinary";

type PaymentMethod = "GCash" | "PayMaya" | "BPI";

export default function PaymentInstructions() {

	return (
		<div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
			<h2 className="text-2xl font-bold mb-6">
				How to Complete Your Payment
			</h2>

			<div className="space-y-6">
				<div>
					<h3 className="text-lg font-semibold mb-2">
						Step 1: Select Your Payment Method
					</h3>
					<RadioGroup
						onValueChange={handlePaymentMethodChange}
						value={paymentMethod || undefined}
					>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="GCash" id="GCash" />
							<Label htmlFor="GCash">GCash</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="PayMaya" id="PayMaya" />
							<Label htmlFor="PayMaya">PayMaya</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="BPI" id="BPI" />
							<Label htmlFor="BPI">BPI</Label>
						</div>
					</RadioGroup>
				</div>

				{paymentMethod && (
					<>
						<div>
							<h3 className="text-lg font-semibold mb-2">
								Step 2: Pay Using the QR Code
							</h3>
							<ol className="list-decimal list-inside space-y-2">
								<li>
									A unique QR code will be displayed on your
									screen after confirming your order.
								</li>
								<li>Take a screenshot of this QR code.</li>
								<li>
									Open your chosen payment app (
									{paymentMethod}).
								</li>
								<li>
									Upload or scan the QR code to complete the
									payment.
								</li>
							</ol>
						</div>

						<div>
							<h3 className="text-lg font-semibold mb-2">
								Step 3: Upload Your Payment Receipt
							</h3>
							<ol className="list-decimal list-inside space-y-2 mb-4">
								<li>
									After completing the payment, take a
									screenshot of the payment receipt or
									confirmation screen.
								</li>
								<li>
									Ensure the following details are visible on
									the receipt:
									<ul className="list-disc list-inside ml-4">
										<li>Amount paid</li>
										<li>Transaction ID/reference number</li>
										<li>Date and time of payment</li>
										<li>
											Payment method ({paymentMethod})
										</li>
									</ul>
									<p className="text-muted-foreground">
										Please click the image below:
									</p>
									<div className="flex gap-2">
										{/* Gcash, maya, BPI */}
										<Link
											href={"/shop/checkout/gcash"}
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
											href={"/shop/checkout/maya"}
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
											href={"/shop/checkout/bpi"}
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
									Upload the receipt screenshot in the section
									below.
								</li>
							</ol>
							<div className="space-y-2">
								<CldUploadWidget uploadPreset="soule-psycle-products">
									{({ open }) => {
										return (
											<Button
												type="button"
												onClick={() => open()}
											>
												Upload an Image
											</Button>
										);
									}}
								</CldUploadWidget>
							</div>
							{receiptUploaded && (
								<Alert className="mt-4">
									<CheckCircle2 className="h-4 w-4" />
									<AlertTitle>Success</AlertTitle>
									<AlertDescription>
										Your receipt has been uploaded
										successfully.
									</AlertDescription>
								</Alert>
							)}
							{uploadError && (
								<Alert variant="destructive" className="mt-4">
									<AlertCircle className="h-4 w-4" />
									<AlertTitle>Error</AlertTitle>
									<AlertDescription>
										{uploadError}
									</AlertDescription>
								</Alert>
							)}
						</div>

						<div>
							<h3 className="text-lg font-semibold mb-2">
								Step 4: Wait for Admin Confirmation
							</h3>
							<ul className="list-disc list-inside space-y-2">
								<li>
									Once you&apos;ve uploaded the receipt, our
									admin will review your payment and confirm
									your order.
								</li>
								<li>
									You&apos;ll receive a notification once your
									order has been verified.
								</li>
							</ul>
						</div>

						<Alert>
							<AlertTitle>Important Reminders:</AlertTitle>
							<AlertDescription>
								<ol className="list-decimal list-inside space-y-1">
									<li>
										Use the correct QR code displayed on the
										checkout page. Payments sent to the
										wrong QR code will not be refunded.
									</li>
									<li>
										Ensure the receipt is clear and all
										required details are visible.
									</li>
									<li>
										Do not close the order page until
										you&apos;ve uploaded the payment
										receipt.
									</li>
								</ol>
							</AlertDescription>
						</Alert>
					</>
				)}
			</div>

			{!paymentMethod && (
				<Alert className="mt-6">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Please select a payment method</AlertTitle>
					<AlertDescription>
						Choose GCash, PayMaya, or BPI to see further
						instructions.
					</AlertDescription>
				</Alert>
			)}
		</div>
	);
}
