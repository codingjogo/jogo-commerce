"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Prisma } from "@prisma/client";
import { CldImage } from "next-cloudinary";
import Link from "next/link";

export default function FeaturedProducts() {
	const [featuredProducts, setFeaturedProducts] = useState<
		Prisma.featured_productGetPayload<{
			include: {
				product: {
					include: {
						variant_color: true;
					};
				};
			};
		}>[]
	>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchFeaturedProducts = async () => {
			try {
				const response = await axios.get(
					"/api/admin/inventory/featured-products"
				);
				setFeaturedProducts(response.data.featuredProducts); // Use the returned data
				setLoading(false);
			} catch (err) {
				console.error("Error fetching featured products:", err);
				setError("Failed to load featured products");
				setLoading(false);
			}
		};

		fetchFeaturedProducts();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>{error}</div>;
	}

	return (
		<section className="bg-foreground text-background py-16 px-4">
			<h2 className="text-2xl font-semibold mb-8 text-center border-b-0">
				Featured Products
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
				{featuredProducts.map((product) => {
					const productImage = product.product.variant_color.map(
						(vc) => vc.images
					)[0][0];
					const productName = product.product.name;
					const productPrice = product.product.price.toFixed(2);

					return (
						<Link
							key={product.id}
							href={`/shop/product/${product.product.id}`}
						>
							<Card className="text-center">
								<CardHeader className="p-0">
									<CldImage
										src={productImage}
										alt={`image-${productName}`}
										width={300}
										height={300}
										className="w-full h-64 object-cover mb-4"
									/>
								</CardHeader>
								<CardContent>
									<h3 className="font-semibold">
										{productName}
									</h3>
									<p className="text-gray-600">
										₱{productPrice}
									</p>
								</CardContent>
							</Card>
						</Link>
					);
				})}
			</div>
		</section>
	);
}
