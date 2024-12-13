import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { capitalizeWords } from "@/lib/helpers";

// This would typically come from an API or database
const categories = [
	{
		id: 1,
		categoryName: "Tote Bag",
		image: "/products-gallery/ocean-blue-eyes.jpg",
	},
	{ id: 2, categoryName: "Shirt", image: "/products-gallery/gambala.jpg" },
];

export default function ProductGallery() {
	return (
		<section className="py-16 px-4 bg-gray-50">
			<div className="max-w-6xl mx-auto">
				<h2 className="text-3xl font-bold mb-8 text-center border-b-0">
					Explore Our Categories
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{categories.map((category) => (
						<div
							key={category.id}
							className="relative group overflow-hidden rounded-lg shadow-md"
						>
							<Image
								src={category.image}
								alt={category.categoryName}
								width={400}
								height={300}
								className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
							/>
							<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<div className="text-center">
									<h3 className="text-white text-xl font-semibold mb-4">
										{category.categoryName}
									</h3>
									<Button asChild variant="secondary">
										<Link
											href={`/shop?category=${capitalizeWords(
												category.categoryName
											)}`}
										>
											View Collection
										</Link>
									</Button>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
