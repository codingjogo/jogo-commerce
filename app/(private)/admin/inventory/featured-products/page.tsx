import {
	columns,
	Product,
} from "@/components/admin/inventory/featured-products/columns";
import { DataTable } from "@/components/admin/inventory/featured-products/data-table";
import prisma from "@/lib/db";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

async function getData(): Promise<Product[]> {
	const data = await prisma.featured_product.findMany({
		include: {
			product: {
				include: {
					category: true,
					variant_color: {
						include: {
							variant_size: true, // Include sizes for each color
						},
					},
				},
			},
		},
	});

	// Transform the data to fit the Product type expected by the DataTable
	return data.map((featuredProduct) => {
		const product = featuredProduct.product;

		return {
			id: featuredProduct.id,
			image: product.variant_color[0]?.images[0] || "", // Use the first image if available
			name: product.name,
			price: product.price,
			variants: product.variant_color.flatMap((color) =>
				color.variant_size.map((size) => ({
					id: size.id,
					color: color.color,
					size: size.size || "N/A", // Default to "N/A" if no size
					stock: size.stock,
				}))
			),
		};
	});
}

export default async function FeaturedProducts() {
	const data = await getData();

	return (
		<section className="admin-content">
			<div className="grid gap-4">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/admin/inventory">
								Inventory
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Featured Products</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<h1>Featured Products</h1>
			</div>

			<div className="content">
				<DataTable columns={columns} data={data} />
			</div>
		</section>
	);
}
