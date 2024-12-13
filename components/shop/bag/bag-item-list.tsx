"use client";

import { Prisma } from "@prisma/client";
import axios from "axios";
import { useBagStore } from "@/store/useBagStore";
import { useEffect } from "react";
import { CldImage } from "next-cloudinary";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MinusForm from "./minus-form";
import PlusForm from "./plus-form";
import { Button } from "@/components/ui/button";

export default function BagItemList({
	bagItems: initialItems,
	clerk_user_id,
}: {
	bagItems: Prisma.bagGetPayload<{
		include: {
			product: { include: { category: true } };
			variant_color: true;
			variant_size: true;
		};
	}>[];
	clerk_user_id: string
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
				size_id: i.variant_size_id as string,
				quantity: Number(i.quantity),
				maxStock: Number(i.variant_size?.stock)
			}))
		);
	}, [initialItems, setItemsInBagStore]);

	return (
		<>
			<Card className="flex-1 space-y-4 shadow-lg border border-gray-200">
				<CardContent className="p-6">
					{
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
									<Badge>{item.category}</Badge>
									<div className="text-sm text-gray-500">
										Price: ₱{item.price.toFixed(2)}
									</div>
								</div>

								{/* Quantity Editor */}
								<div className="flex items-center space-x-2">
									<MinusForm
										id={item.id}
										quantity={item.quantity}
										clerk_user_id={clerk_user_id}
									/>
									<span className="font-medium">
										{item.quantity}
									</span>
									<PlusForm
										id={item.id}
										quantity={item.quantity}
										clerk_user_id={clerk_user_id}
									/>
								</div>

								{/* Remove Button */}
								<Button
									type="button"
									variant={"ghost"}
									onClick={() => removeItem(item.id)}
									className="btn btn-destructive btn-sm"
								>
									Remove
								</Button>
							</div>
						))}
				</CardContent>
			</Card>
		</>
	);
}
