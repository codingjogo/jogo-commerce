"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CldImage } from "next-cloudinary";
import { Prisma } from "@prisma/client";
import AddToBag from "./add-to-bag";
import { useAuth } from "@clerk/nextjs";
import { notFound } from "next/navigation";

export default function ProductDetails({
	product,
	bagItems,
}: {
	product: Prisma.productGetPayload<{
		include: {
			category: true;
			variant_color: {
				include: {
					variant_size: true;
				};
			};
		};
	}>;
	bagItems: Prisma.bagGetPayload<{
		include: {
			product: true;
			variant_color: true;
			variant_size: true;
		};
	}>[];
}) {
	// Initial states for selected color, size, and image
	const [selectedColor, setSelectedColor] = useState(
		product.variant_color[0]?.color || ""
	);
	const [selectedColorId, setSelectedColorId] = useState("");
	const [selectedSize, setSelectedSize] = useState("");
	const [selectedSizeId, setSelectedSizeId] = useState("");
	const [selectedImage, setSelectedImage] = useState(
		product.variant_color[0]?.images[0] || "/placeholder.svg"
	);

	const { userId } = useAuth();

	if (!userId) {
		notFound();
	}

	const isToteBagCategory =
		product.category.name.toLowerCase() === "tote bag";

	const isBagItemExist = bagItems.find(
		(b) => b.variant_color_id === selectedColorId
	);

	// Get selected variant color based on selected color
	const selectedVariantColor = product.variant_color.find(
		(variant) => variant.color === selectedColor
	);

	// Handle color selection change
	const handleColorChange = (color: string) => {
		const newVariant = product.variant_color.find(
			(variant) => variant.color === color
		);
		if (newVariant) {
			setSelectedColor(color);
			setSelectedImage(newVariant.images[0] || "/placeholder.svg");
			setSelectedSize(""); // Reset size when color changes
			setSelectedColorId(newVariant?.id || "");
		}
	};

	// Handle size selection change
	const handleSizeChange = (size: string, sizeId: string) => {
		setSelectedSize(size);
		setSelectedSizeId(sizeId);
	};

	const handleBuyNow = () => {
		console.log("Buy now:", {
			variantColorId: selectedColorId,
			selectedSizeId: selectedSizeId,
		});
	};

	const handleAddToWishlist = () => {
		console.log("Added to wishlist:", selectedColorId);
	};

	const productId = product.id;
	const newVariant = product.variant_color.find(
		(variant) => variant.color === selectedColor
	);

	useEffect(() => {
		setSelectedColorId(newVariant?.id || "");
		console.log("selectedSizeId:", {
			selectedSizeId
		});
	}, [
		userId,
		productId,
		selectedColor,
		selectedColorId,
		selectedSize,
		selectedSizeId,
		selectedVariantColor,
		bagItems,
		isBagItemExist,
		newVariant,
	]);

	return (
		<div className="grid md:grid-cols-2 gap-8">
			{/* Image Section */}
			<div className="space-y-4">
				<div className="aspect-square relative overflow-hidden rounded-lg">
					<CldImage
						src={selectedImage}
						alt={product.name}
						layout="fill"
						objectFit="cover"
					/>
				</div>
				<div className="grid grid-cols-4 gap-2">
					{selectedVariantColor?.images.map((img, index) => (
						<div
							key={index}
							className="aspect-square relative overflow-hidden rounded-lg cursor-pointer"
							onClick={() => setSelectedImage(img)}
						>
							<CldImage
								src={img}
								alt={`${product.name} Image ${index + 1}`}
								layout="fill"
								objectFit="cover"
							/>
						</div>
					))}
				</div>
			</div>

			{/* Details Section */}
			<div className="space-y-6">
				<h1 className="text-3xl font-bold">{product.name}</h1>
				<p className="text-xl font-semibold">
					₱{product.price.toFixed(2)}
				</p>
				<p className="text-gray-600">{product.description}</p>
				<p className="text-sm text-gray-500">
					Category: {product.category.name}
				</p>
				<p className="text-sm text-gray-500">SKU: {product.sku}</p>

				{/* Variant Color Selection */}
				<div>
					<h3 className="text-lg font-semibold mb-2">Color</h3>
					<div className="flex gap-2">
						{product.variant_color.map((variant) => (
							<button
								key={variant.id}
								onClick={() => handleColorChange(variant.color)}
								className={`w-12 h-12 rounded-full overflow-hidden border-2 ${
									selectedColor === variant.color
										? "border-black"
										: "border-transparent"
								}`}
							>
								<CldImage
									src={variant.images[0]}
									alt={variant.color}
									width={48}
									height={48}
									className="w-full h-full object-cover"
								/>
							</button>
						))}
					</div>
				</div>

				{/* Variant Size Selection (Conditional) */}
				{!isToteBagCategory &&
					selectedVariantColor &&
					selectedVariantColor.variant_size.length > 0 && (
						<div>
							<h3 className="text-lg font-semibold mb-2">Size</h3>
							<RadioGroup
								value={selectedSize}
								onValueChange={(size) => {
									const sizeId =
										selectedVariantColor.variant_size.find(
											(vs) => vs.size === size
										)?.id || "";
									handleSizeChange(size, sizeId);
								}}
								className="flex flex-wrap gap-2"
							>
								{selectedVariantColor.variant_size.map(
									(size) => (
										<div key={size.id}>
											<RadioGroupItem
												value={size.size || ""}
												id={size.id}
												className="peer sr-only"
												disabled={size.stock === 0}
											/>
											<Label
												htmlFor={size.id}
												className={`flex items-center justify-center rounded-md border px-3 py-2 text-sm peer-data-[state=checked]:bg-black peer-data-[state=checked]:text-white ${
													size.stock === 0
														? "bg-gray-200 text-gray-400 cursor-not-allowed"
														: ""
												}`}
											>
												{size.size}
												{size.stock <= 10 &&
													size.stock > 0 && (
														<span className="ml-2 text-xs text-red-500">
															(Low Stock)
														</span>
													)}
												{size.stock === 0 && (
													<span className="ml-2 text-xs text-red-500">
														(Out of Stock)
													</span>
												)}
											</Label>
										</div>
									)
								)}
							</RadioGroup>
						</div>
					)}

				{/* Action Buttons */}
				<div className="flex gap-4">
					{/* 
						- Is variant size with color id is equals to bag item?
						- Then show minus quantity plus
						- Else Add To Bag
					*/}

					<AddToBag
						clerk_user_id={userId}
						product_id={productId}
						variant_color_id={selectedColorId}
						variant_size_id={selectedSizeId}
					/>

					<Button
						onClick={handleBuyNow}
						variant="outline"
						className="flex-1"
					>
						Buy Now
					</Button>
					<Button
						onClick={handleAddToWishlist}
						variant="outline"
						size="icon"
					>
						♥<span className="sr-only">Add to wishlist</span>
					</Button>
				</div>
			</div>
		</div>
	);
}
