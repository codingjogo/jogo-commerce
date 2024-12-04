import { columns, Product } from "@/components/admin/inventory/columns";
import { DataTable } from "@/components/admin/inventory/data-table";

async function getData(): Promise<Product[]> {
	return [
		{
			id: "1",
			image: "/shirt-placeholder.jpg", // default image
			name: "Shirt Placeholder",
			category: "category-placeholder",
			variants: [
				{
					id: "3",
					color: "Red", // Red | Blue | Green | Black | White
					size: "S", // S | M | L | XL | XXL
					stock: 9,
					status: "IN STOCK",
				},
				{
					id: "2",
					color: "Blue",
					size: "M",
					stock: 300,
					status: "IN STOCK",
				},
				{
					id: "4",
					color: "Orange",
					size: "M",
					stock: 20,
					status: "IN STOCK",
				},
			],
		},
		// ...
	];
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
