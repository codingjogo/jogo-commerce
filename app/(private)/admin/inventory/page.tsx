import { columns, Product } from "@/components/admin/inventory/columns";
import { DataTable } from "@/components/admin/inventory/data-table";
import prisma from "@/lib/db";

async function getData(): Promise<Product[]> {
	const products = await prisma.product.findMany({
		include: {
			category: true,
			variant_color: {
				include: {
					variant_size: true,
				},
			},
		},
	});

	const formattedData: Product[] = products.map((product) => ({
		id: product.id,
		image: product.variant_color?.[0]?.images?.[0] || "", // Safely fetch the first image
		name: product.name,
		category: product.category.name,
		variants: product.variant_color.flatMap((color) =>
			color.variant_size.map((size) => ({
				id: `${color.id}-${size.size}`, // Unique ID combining color and size
				color: color.color,
				size: size.size || "N/A", // Fallback in case size is null
				stock: size.stock || 0, // Ensure stock has a default value
				status: size.status,
			}))
		),
	}));

	return formattedData
}

export default async function Inventory() {
	const data = await getData();

	return (
		<section className="admin-content">
			<h1>Inventory</h1>

			<div className="content">
				<DataTable columns={columns} data={data} />
			</div>
		</section>
	);
}
