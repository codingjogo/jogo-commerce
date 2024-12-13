"use client";

import { Prisma } from "@prisma/client";
import axios from "axios";
import { useBagStore } from "@/store/useBagStore";
import { useEffect } from "react";
import { CldImage } from "next-cloudinary";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BagItemList({
	bagItems: initialItems,
}: {
	bagItems: Prisma.bagGetPayload<{
		include: {
			product: { include: { category: true } };
			variant_color: true;
			variant_size: true;
		};
	}>[];
}) {
	const bagItems = useBagStore((state) => state.bagItems);
	const removeItemInBagStore = useBagStore(
		(state) => state.removeItemInBagStore
	);
	const setItemsInBagStore = useBagStore((state) => state.setItemsInBagStore);

	const removeItem = async (id: string) => {
		try {
			const response = await axios.delete(
				`/api/shop/bag/delete-item?bagItemId=${id}`
			);

			if (response.status !== 200) {
				throw new Error("Error removing bag item.");
			}

			removeItemInBagStore(id);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		setItemsInBagStore(
			initialItems.map((i) => ({
				id: i.id,
				image: i.variant_color.images[0],
				name: i.product.name,
				category: i.product.category.name,
				price: Number(i.product.price),
        color: i.variant_color.color as string,
        size: i.variant_size?.size as string,
				quantity: Number(i.quantity),
			}))
		);
	}, [initialItems, setItemsInBagStore]);

	return (
		<div className="space-y-4">
			{bagItems.length > 0 &&
				bagItems.map((item) => (
					<div
						key={item.id}
						className="flex items-center space-x-4 border-b pb-4"
					>
						{/* Item Image */}
						<div className="overflow-hidden rounded-md">
							<CldImage
								width={64}
								height={64}
								src={item.image}
								alt={item.name}
								className="w-full h-full object-cover"
							/>
						</div>

						{/* Item Details */}
						<div className="flex-1">
							<div className="font-medium text-lg">
								{item.name}
							</div>
							<div className="font-medium text-lg">
								{item.color} | {item.size}
							</div>
							<Badge >{item.category}</Badge>
							<div className="text-sm text-gray-500">
								Price: ₱{item.price.toFixed(2)}
							</div>
						</div>

						{/* Quantity Editor */}
						<div className="flex items-center space-x-2">
							<button
								onClick={() =>
									item.quantity > 1 &&
									useBagStore
										.getState()
										.updateItemInBagStore(item.id, {
											quantity: item.quantity - 1,
										})
								}
								className="btn btn-secondary btn-sm"
							>
								-
							</button>
							<span className="font-medium">{item.quantity}</span>
							<button
								onClick={() =>
									useBagStore
										.getState()
										.updateItemInBagStore(item.id, {
											quantity: item.quantity + 1,
										})
								}
								className="btn btn-secondary btn-sm"
							>
								+
							</button>
						</div>

						{/* Remove Button */}
						<button
							onClick={() => removeItem(item.id)}
							className="btn btn-destructive btn-sm"
						>
							Remove
						</button>
					</div>
				))}

			{bagItems.length === 0 && (
				<>
					<Card>
						<CardContent className="flex flex-col gap-2 items-center justify-center p-6">
							<h1>Your Bag is Empty.</h1>
							<p>Please Add Item to Bag.</p>
						</CardContent>
					</Card>
				</>
			)}
		</div>
	);
}
