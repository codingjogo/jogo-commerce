"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CldImage } from "next-cloudinary";
import { useBagStore } from "@/store/useBagStore";
import Link from "next/link";

const OrderSummary: React.FC = () => {
	const bagItems = useBagStore((state) => state.bagItems);

	// Calculate total price
	const totalPrice = bagItems.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0
	);

	return (
		<Card className="w-full max-w-md mx-auto shadow-lg border border-gray-200">
			<CardHeader>
				<CardTitle className="text-lg font-semibold">
					Order Summary
				</CardTitle>
			</CardHeader>
			<CardContent>
				{/* Items List */}
				<div className="space-y-4">
					{bagItems.length === 0 ? (
						<p className="text-center text-gray-500">
							Your bag is empty.
						</p>
					) : (
						bagItems.map((item) => (
							<div
								key={item.id}
								className="flex items-center justify-between border-b border-gray-200 pb-2"
							>
								<div className="flex items-center space-x-4">
									<CldImage
										width={64}
										height={64}
										src={item.image}
										alt={item.name}
										className="w-16 h-16 object-cover rounded-md"
									/>
									<div>
										<p className="font-medium text-gray-800">
											{item.name}
										</p>
										<p className="text-sm text-gray-500">
											{item.category} | {item.color} |{" "}
											{item.size}
										</p>
									</div>
								</div>
								<div className="text-right">
									<p className="text-sm text-gray-600">
										Qty: {item.quantity}
									</p>
									<p className="font-semibold text-gray-800">
                  ₱{item.price * item.quantity}
									</p>
								</div>
							</div>
						))
					)}
				</div>

				{/* Total Price */}
				<div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
					<p className="text-lg font-semibold">Total</p>
					<p className="text-lg font-bold">
          ₱{totalPrice.toFixed(2)}
					</p>
				</div>

				{/* Checkout Button */}
				<Button className="mt-4 w-full" variant={'default'} asChild>
					<Link href={'/shop/checkout'}>
					Proceed to Checkout
					</Link>
				</Button>
			</CardContent>
		</Card>
	);
};

export default OrderSummary;
