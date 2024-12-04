import Image from "next/image";
import { Card, CardContent, CardHeader } from "../ui/card";

// This would typically come from an API or database
const featuredProducts = [
	{
		id: 1,
		name: "Classic T-Shirt",
		price: 29.99,
		image: "/shirt-placeholder.jpg",
	},
	{
		id: 2,
		name: "Vintage Hoodie",
		price: 59.99,
		image: "/shirt-placeholder.jpg",
	},
	{
		id: 3,
		name: "Denim Jacket",
		price: 89.99,
		image: "/shirt-placeholder.jpg",
	},
	{
		id: 4,
		name: "Leather Boots",
		price: 129.99,
		image: "/shirt-placeholder.jpg",
	},
];

export default function FeaturedProducts() {
	return (
		<section className="bg-foreground text-background py-16 px-4">
			<h2 className="text-2xl font-semibold mb-8 text-center border-b-0">
				Featured Products
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
				{featuredProducts.map((product) => (
					<Card key={product.id} className="text-center">
						<CardHeader className="p-0">
							<Image
								src={product.image}
								alt={product.name}
								width={300}
								height={300}
								className="w-full h-64 object-cover mb-4"
							/>
						</CardHeader>
						<CardContent>
							<h3 className="font-semibold">{product.name}</h3>
							<p className="text-gray-600">
								${product.price.toFixed(2)}
							</p>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}
